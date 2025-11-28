import clsx from 'clsx';
import type { IconStyleDefinition } from '../types';

interface StyleCardProps {
  style: IconStyleDefinition;
  selected: boolean;
  onSelect: (id: IconStyleDefinition['id']) => void;
}

export const StyleCard = ({ style, selected, onSelect }: StyleCardProps) => (
  <button
    type="button"
    className={clsx('style-card', { selected })}
    onClick={() => onSelect(style.id)}
  >
    <h3>{style.name}</h3>
    <p>{style.descriptors.join(' · ')}</p>
    <small style={{ color: 'var(--text-muted)' }}>{style.paletteHint}</small>
  </button>
);
