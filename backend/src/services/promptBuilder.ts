import { ICON_STYLES, IconStyleId } from '../types';

const NEGATIVE_PROMPT = [
  'photograph',
  'text',
  'caption',
  'logo watermark',
  'duplicate icon',
  'realistic lighting',
  'background scene',
  '3d render',
  'blur',
  'distorted proportions',
].join(', ');

const VARIATION_BLUEPRINTS = [
  {
    id: 'mascot',
    narrative: 'a friendly mascot',
    detail: 'rounded outlines and expressive eyes',
  },
  {
    id: 'object',
    narrative: 'a hero object',
    detail: 'bold silhouette with soft shadow',
  },
  {
    id: 'symbol',
    narrative: 'a symbolic badge',
    detail: 'minimal negative space and geometric framing',
  },
  {
    id: 'pattern',
    narrative: 'a playful abstract shape',
    detail: 'layered forms with depth cues',
  },
] as const;

export interface PromptBuilderInput {
  prompt: string;
  style: IconStyleId;
  colors?: string[];
}

export interface PromptInstruction {
  id: string;
  prompt: string;
  negativePrompt: string;
  seed: number;
}

const sanitizePrompt = (value: string) => value.trim().replace(/\s+/g, ' ');

const getStyleMeta = (style: IconStyleId) => {
  const match = ICON_STYLES.find((entry) => entry.id === style);
  if (!match) {
    throw new Error(`Unknown style: ${style}`);
  }
  return match;
};

const buildColorDirective = (colors?: string[], paletteHint?: string) => {
  if (colors && colors.length > 0) {
    const list = colors.map((color) => color.toUpperCase()).join(', ');
    return `palette anchored in ${list}`;
  }

  return paletteHint ? `palette inspired by ${paletteHint}` : 'cohesive palette';
};

export const buildPromptInstructions = ({ prompt, style, colors }: PromptBuilderInput): PromptInstruction[] => {
  const cleanPrompt = sanitizePrompt(prompt);
  const styleMeta = getStyleMeta(style);
  const colorDirective = buildColorDirective(colors, styleMeta.paletteHint);
  const styleDescriptor = `${styleMeta.name} icon style emphasizing ${styleMeta.descriptors.join(', ')}`;
  const stylePrompt = [
    styleMeta.promptSpec.narrative,
    styleMeta.promptSpec.background,
    styleMeta.promptSpec.accent,
    styleMeta.promptSpec.finish,
  ].join('. ');

  return VARIATION_BLUEPRINTS.map((blueprint, index) => ({
    id: blueprint.id,
    prompt: [
      `Design ${blueprint.narrative} for ${cleanPrompt}`,
      `focus on ${blueprint.detail}`,
      styleDescriptor,
      stylePrompt,
      colorDirective,
      'flat background, consistent stroke weight, 512x512 icon, ultra crisp edges, no text',
    ].join('. '),
    negativePrompt: NEGATIVE_PROMPT,
    seed: Date.now() + index,
  }));
};
