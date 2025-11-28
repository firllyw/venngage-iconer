import { getReadableTextColor } from '../utils/colors';

interface ColorChipProps {
  value: string;
}

export const ColorChip = ({ value }: ColorChipProps) => (
  <span className="color-chip" style={{ background: value, color: getReadableTextColor(value) }}>
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />
    {value}
  </span>
);
