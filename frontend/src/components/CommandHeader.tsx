import { Sparkles, Gauge, Droplets, ShieldCheck } from 'lucide-react';
import { ICON_STYLES } from '../types';

interface CommandHeaderProps {
  activeStyleId?: string | null;
}

export const CommandHeader = ({ activeStyleId }: CommandHeaderProps) => {
  const activeStyle = ICON_STYLES.find((style) => style.id === activeStyleId);

  return (
    <header className="command-header">
      <div>
        <p className="tone-pill">
          <Sparkles size={16} /> Icon Ensembles Lab
        </p>
        <h1>Flux Atelier</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Feed the atelier a single idea and get a quartet of icons with synchronized style DNA.
        </p>
      </div>
      <div className="metrics-bar" aria-live="polite">
        <div className="metric">
          <span>Preset</span>
          <strong>{activeStyle?.name ?? 'Select a style'}</strong>
        </div>
        <div className="metric">
          <span>Descriptors</span>
          <strong>{activeStyle ? activeStyle.descriptors.slice(0, 2).join(' • ') : '---'}</strong>
        </div>
        <div className="metric">
          <span>Palette Hint</span>
          <strong>{activeStyle?.paletteHint ?? '---'}</strong>
        </div>
        <div className="metric">
          <span>Safety</span>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} /> Guarded
          </strong>
        </div>
        <div className="metric">
          <span>Load</span>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Gauge size={16} /> Instant
          </strong>
        </div>
        <div className="metric">
          <span>Palette Control</span>
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Droplets size={16} /> Hex precise
          </strong>
        </div>
      </div>
    </header>
  );
};
