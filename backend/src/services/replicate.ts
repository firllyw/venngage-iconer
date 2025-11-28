import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '../utils/env';
import { AppError } from '../utils/errors';

const BASE_URL = 'https://api.replicate.com/v1';
const MODEL_ENDPOINT = '/models/black-forest-labs/flux-schnell/predictions';
const POLL_INTERVAL_MS = 1500;
const MAX_WAIT_MS = 120_000;

export interface ReplicateInput {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: string;
  num_inference_steps?: number;
  num_outputs?: number;
  output_format?: 'png' | 'webp';
  output_quality?: number;
  seed?: number;
  go_fast?: boolean;
  megapixels?: string;
}

export interface ReplicateOutput {
  url: string;
  mimeType: string;
  base64: string;
  predictionId: string;
}

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  error?: string | null;
  output?: string[] | null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeOutput = (output?: string[] | null) => {
  if (!output || !output.length) {
    return null;
  }

  const first = output[0];
  if (typeof first === 'string') {
    return first;
  }

  return null;
};

export class ReplicateService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 60_000,
      headers: {
        Authorization: `Bearer ${env.replicateApiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private async createPrediction(input: ReplicateInput) {
    try {
      const { data } = await this.client.post<ReplicatePrediction>(MODEL_ENDPOINT, {
        input: {
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'png',
          go_fast: true,
          num_inference_steps: 4,
          ...input,
        },
      });
      return data;
    } catch (error) {
      this.handleAxiosError(error, 'Failed to create prediction');
      throw error;
    }
  }

  private async pollPrediction(id: string) {
    const maxAttempts = Math.ceil(MAX_WAIT_MS / POLL_INTERVAL_MS);
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const { data } = await this.client.get<ReplicatePrediction>(`/predictions/${id}`);
      if (data.status === 'succeeded' || data.status === 'failed' || data.status === 'canceled') {
        return data;
      }
      await wait(POLL_INTERVAL_MS);
    }

    throw new AppError({
      message: 'Timed out waiting for image generation',
      statusCode: 504,
      details: { predictionId: id },
    });
  }

  private async downloadImage(url: string) {
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
      });
      const mimeType = response.headers['content-type'] ?? 'image/png';
      const base64 = Buffer.from(response.data).toString('base64');
      return {
        url,
        mimeType,
        base64: `data:${mimeType};base64,${base64}`,
      };
    } catch (error) {
      this.handleAxiosError(error, 'Failed to download generated image');
      throw error;
    }
  }

  private handleAxiosError(error: unknown, message: string): never {
    if (error instanceof AxiosError) {
      throw new AppError({
        message,
        statusCode: error.response?.status ?? 502,
        details: error.response?.data ?? error.message,
      });
    }

    throw new AppError({ message, statusCode: 500, details: error });
  }

  public async generateImage(input: ReplicateInput): Promise<ReplicateOutput> {
    const prediction = await this.createPrediction(input);
    const finalState = await this.pollPrediction(prediction.id);

    if (finalState.status !== 'succeeded') {
      throw new AppError({
        message: 'Image generation failed',
        statusCode: 502,
        details: finalState.error ?? 'Unknown error',
      });
    }

    const assetUrl = normalizeOutput(finalState.output);
    if (!assetUrl) {
      throw new AppError({
        message: 'Model returned empty output',
        statusCode: 502,
        details: { predictionId: finalState.id },
      });
    }

    const image = await this.downloadImage(assetUrl);
    return {
      ...image,
      predictionId: finalState.id,
    };
  }

  public async generateBatch(inputs: ReplicateInput[]): Promise<ReplicateOutput[]> {
    const results: ReplicateOutput[] = [];
    for (const input of inputs) {
      // Sequential generation avoids API spikes and keeps prompts isolated
      // eslint-disable-next-line no-await-in-loop
      const image = await this.generateImage(input);
      results.push(image);
      await wait(300);
    }
    return results;
  }
}

export const replicateService = new ReplicateService();
