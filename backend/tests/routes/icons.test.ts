import { beforeAll, describe, expect, it, vi } from 'vitest';
import { buildServer } from '../../src/server';

const mockBatch = Array.from({ length: 4 }).map((_, index) => ({
  url: `https://example.com/icon-${index}.png`,
  mimeType: 'image/png',
  base64: 'data:image/png;base64,AAA',
  predictionId: `prediction-${index}`,
}));

vi.mock('../../src/services/replicate', () => ({
  replicateService: {
    generateBatch: vi.fn(async () => mockBatch),
  },
}));

describe('POST /api/icons/generate', () => {
  beforeAll(() => {
    process.env.REPLICATE_API_TOKEN = 'test-token';
  });

  it('returns quartet of icons for valid payload', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/api/icons/generate',
      payload: {
        prompt: 'futuristic gardening tools',
        style: 'pastels',
        colors: ['#ABCDEF'],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.icons).toHaveLength(4);
    expect(body.style.id).toBe('pastels');
  });

  it('returns validation error for malformed colors', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/api/icons/generate',
      payload: {
        prompt: 'bad colors',
        style: 'pastels',
        colors: ['not-a-color'],
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
