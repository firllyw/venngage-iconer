export type IconStyleId = (typeof ICON_STYLES)[number]['id'];

export interface StylePromptSpec {
  narrative: string;
  background: string;
  accent: string;
  finish: string;
}

export interface StyleDefinition {
  id: string;
  name: string;
  descriptors: string[];
  paletteHint: string;
  promptSpec: StylePromptSpec;
}

export const ICON_STYLES: StyleDefinition[] = [
  {
    id: 'pastels',
    name: 'Pastels',
    descriptors: ['soft gradients', 'muted tones', 'dreamy'],
    paletteHint: 'soft pinks, lilacs, powder blues',
    promptSpec: {
      narrative: 'stickers inspired by children’s book art and lovable plush mascots',
      background: 'set each icon on a fuzzy pastel sticker with rounded corners and a faint vellum shadow',
      accent: 'sprinkle tiny stitched stars and floating beads hugging the sticker border',
      finish: 'chalky bloom, watercolor edges, hazy lighting, zero harsh contrast',
    },
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    descriptors: ['rounded forms', 'glossy sheen', 'playful'],
    paletteHint: 'candy brights with white highlights',
    promptSpec: {
      narrative: 'toy-like glyphs sculpted out of soft plastic bubbles',
      background: 'place a thick circular bubble halo directly behind the subject and keep it perfectly centered',
      accent: 'add floating confetti dots and mini sparkles orbiting the halo plus one small sidekick object',
      finish: 'high-gloss lighting, translucent edges, subtle drop shadow beneath the halo',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    descriptors: ['clean lines', 'duotone', 'negative space'],
    paletteHint: 'charcoal, ivory, electric accent',
    promptSpec: {
      narrative: 'architectural pictograms constructed with deliberate negative space',
      background: 'frame each icon with a geometric outline that changes between circle, triangle, square, or amorphous blob',
      accent: 'include two line-based embellishments such as grid ticks, dash clusters, or crosshair dots',
      finish: 'crisp vector edges, matte duotone fills, no gradients, micro glow around edges',
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    descriptors: ['high contrast', 'bold gradients', 'energetic'],
    paletteHint: 'sunset oranges, neon magenta, cobalt',
    promptSpec: {
      narrative: 'kinetic neon illustrations with motion streaks and dramatic lighting',
      background: 'paint a dynamic angled ribbon or swoosh behind the icon to imply forward movement',
      accent: 'bursting flare particles and gradient trails extending from the subject',
      finish: 'glossy neon gradients, rim light, cinematic bloom, supersaturated contrast',
    },
  },
  {
    id: 'geometric',
    name: 'Geometric',
    descriptors: ['angular shapes', 'precision', 'patterns'],
    paletteHint: 'teal, saffron, graphite',
    promptSpec: {
      narrative: 'material design inspired flat icons with precise vector layering',
      background: 'build stacked angled rectangles or circles with long shadows behind the subject',
      accent: 'embed minimalist UI glyphs, grid dots, or measurement ticks intersecting the icon',
      finish: 'clean material flat colors, subtle ambient occlusion, razor sharp edges and shadows',
    },
  },
];

export interface GenerateIconsPayload {
  prompt: string;
  style: IconStyleId;
  colors?: string[];
}

export interface IconResult {
  id: string;
  url: string;
  prompt: string;
  style: IconStyleId;
  colorsApplied: string[];
}
