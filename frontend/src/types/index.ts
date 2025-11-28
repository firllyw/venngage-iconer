export type IconStyleId = 'pastels' | 'bubbles' | 'minimal' | 'vibrant' | 'geometric';

export interface IconStyleDefinition {
  id: IconStyleId;
  name: string;
  descriptors: string[];
  paletteHint: string;
  badge: string;
}

export interface IconResult {
  id: string;
  url: string;
  dataUri: string;
  mimeType: string;
  prompt: string;
  seed: number;
  style: IconStyleId;
  colors: string[];
}

export interface GenerateIconsResponse {
  requestId: string;
  durationMs: number;
  prompt: string;
  style: IconStyleDefinition;
  icons: IconResult[];
}

export interface GenerateIconsPayload {
  prompt: string;
  style: IconStyleId;
  colors: string[];
}

export const ICON_STYLES: IconStyleDefinition[] = [
  {
    id: 'pastels',
    name: 'Pastels',
    descriptors: ['soft gradients', 'muted tones', 'dreamy finishes'],
    paletteHint: 'pinks • lilacs • powder blues',
    badge: 'Soft Calm',
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    descriptors: ['rounded', 'glossy', 'playful highlights'],
    paletteHint: 'candy brights • whites',
    badge: 'Playful Pop',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    descriptors: ['clean lines', 'duotone', 'negative space'],
    paletteHint: 'charcoal • ivory • neon accent',
    badge: 'Sharp Focus',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    descriptors: ['bold gradients', 'high contrast', 'energetic'],
    paletteHint: 'sunset oranges • neon magenta • cobalt',
    badge: 'Neon Pulse',
  },
  {
    id: 'geometric',
    name: 'Geometric',
    descriptors: ['angular shapes', 'precision', 'patterns'],
    paletteHint: 'teal • saffron • graphite',
    badge: 'Structured Bold',
  },
];

export const DEFAULT_STYLE: IconStyleId = 'pastels';

export const MAX_COLOR_SWATCHES = 5;
