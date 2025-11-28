import { describe, expect, it } from 'vitest';
import { buildPromptInstructions } from '../../src/services/promptBuilder';

const basePayload = {
  prompt: 'botanical tea kettles',
  style: 'pastels' as const,
};

describe('buildPromptInstructions', () => {
  it('creates four unique instructions', () => {
    const result = buildPromptInstructions(basePayload);
    expect(result).toHaveLength(4);
    const ids = new Set(result.map((entry) => entry.id));
    expect(ids.size).toBe(4);
  });

  it('injects color directive when custom colors provided', () => {
    const result = buildPromptInstructions({ ...basePayload, colors: ['#FFAA00', '#00CCFF'] });
    expect(result[0].prompt).toContain('#FFAA00');
    expect(result[1].prompt).toContain('#00CCFF');
  });

  it('includes style descriptors in prompts', () => {
    const result = buildPromptInstructions(basePayload);
    expect(result[0].prompt).toContain('Pastels icon style');
  });

  it('generates deterministic seeds length', () => {
    const result = buildPromptInstructions(basePayload);
    const seeds = result.map((instruction) => instruction.seed);
    expect(seeds.every((seed) => typeof seed === 'number')).toBe(true);
  });
});
