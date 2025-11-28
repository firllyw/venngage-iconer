import type { IconResult } from '../types';
import { IconCard } from './IconCard';

interface IconGridProps {
  icons: IconResult[];
  loading: boolean;
}

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden>
    <div style={{ height: 220, borderRadius: 18, background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

export const IconGrid = ({ icons, loading }: IconGridProps) => {
  if (!icons.length && !loading) {
    return (
      <div className="empty-state">
        <p className="tone-pill">Awaiting prompt</p>
        <h3>Craft a story and choose a preset</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          The atelier needs a prompt, preset style, and optional palette to orchestrate your four-icon set.
        </p>
      </div>
    );
  }

  return (
    <section className="icon-grid">
      {loading
        ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={`skeleton-${idx}`} />)
        : icons.map((icon, index) => <IconCard icon={icon} key={icon.id} index={index} />)}
    </section>
  );
};
