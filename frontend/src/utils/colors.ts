export const isHex = (value: string) => /^#?[0-9A-Fa-f]{6}$/.test(value.trim());

export const normalizeHex = (value: string) => {
  if (!value) return value;
  const sanitized = value.trim();
  return sanitized.startsWith('#') ? sanitized.toUpperCase() : `#${sanitized.toUpperCase()}`;
};

export const getReadableTextColor = (hex: string) => {
  const normalized = normalizeHex(hex).replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0F172A' : '#F8FAFC';
};
