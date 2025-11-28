import type { FastifyPluginAsync } from 'fastify';
import { randomUUID } from 'crypto';
import { replicateService } from '../services/replicate';
import { buildPromptInstructions } from '../services/promptBuilder';
import { ICON_STYLES } from '../types';
import { generateIconsSchema } from '../utils/validation';

const iconsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/generate', async (request, reply) => {
    const startedAt = Date.now();
    const payload = generateIconsSchema.parse(request.body);
    const styleMeta = ICON_STYLES.find((style) => style.id === payload.style);
    if (!styleMeta) {
      reply.status(400).send({ message: 'Unknown style provided' });
      return;
    }

    const instructions = buildPromptInstructions(payload);
    const replicateInputs = instructions.map((instruction) => ({
      prompt: instruction.prompt,
      negative_prompt: instruction.negativePrompt,
      seed: instruction.seed,
      aspect_ratio: '1:1',
      output_format: 'png' as const,
      go_fast: true,
      num_inference_steps: 4,
    }));

    const generated = await replicateService.generateBatch(replicateInputs);

    const icons = generated.map((image, index) => ({
      id: `${instructions[index].id}-${image.predictionId}`,
      url: image.url,
      dataUri: image.base64,
      mimeType: image.mimeType,
      style: payload.style,
      prompt: instructions[index].prompt,
      seed: instructions[index].seed,
      colors: payload.colors ?? [],
    }));

    return reply.status(200).send({
      requestId: randomUUID(),
      durationMs: Date.now() - startedAt,
      prompt: payload.prompt,
      style: styleMeta,
      icons,
    });
  });
};

export default iconsRoute;
