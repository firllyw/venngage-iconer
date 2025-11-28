import { z } from 'zod';
import { ICON_STYLES } from '../types';

const HEX_PATTERN = /^#?[0-9A-Fa-f]{6}$/;

const STYLE_IDS = ICON_STYLES.map((style) => style.id) as [string, ...string[]];

export const generateIconsSchema = z.object({
  prompt: z.string().min(3).max(120),
  style: z.enum(STYLE_IDS),
  colors: z
    .array(
      z
        .string()
        .regex(HEX_PATTERN, 'Color must be a 6-digit HEX value (e.g., #A0B1C2)')
        .transform((value) => (value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`)),
    )
    .max(6)
    .optional(),
});

export type GenerateIconsBody = z.infer<typeof generateIconsSchema>;
