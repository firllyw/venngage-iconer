import { IconForm } from '../components/IconForm';
import { IconGrid } from '../components/IconGrid';
import { useIconStore } from '../store/useIconStore';
import { ColorChip } from '../components/ColorChip';
import { ICON_STYLES } from '../types';
import { useShallow } from 'zustand/shallow';

export const IconWorkbench = () => {
  const { icons, loading, style, prompt, colors, requestId, durationMs, error } = useIconStore(
    useShallow((state) => ({
      icons: state.icons,
      loading: state.loading,
      style: state.style,
      prompt: state.prompt,
      colors: state.colors,
      requestId: state.requestId,
      durationMs: state.durationMs,
      error: state.error,
    }))
  );
  const styleMeta = ICON_STYLES.find((entry) => entry.id === style);

  return (
    <main className="layout-grid">
      <IconForm />
      <section className="panel grid-panel">
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p className="tone-pill" style={{ marginBottom: '0.35rem' }}>
                {styleMeta ? `${styleMeta.name} • ${styleMeta.badge}` : 'Awaiting selection'}
              </p>
              <h2 style={{ margin: 0 }}>{prompt || 'Your gallery awaits'}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {durationMs ? `Generated in ${(durationMs / 1000).toFixed(2)}s` : 'Ready for generation'}
              </p>
            </div>
            {colors.length > 0 && (
              <div className="color-chips">
                {colors.map((color) => (
                  <ColorChip key={`result-${color}`} value={color} />
                ))}
              </div>
            )}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {requestId ? `Request ref: ${requestId.slice(0, 8)}...` : 'No runs yet'}
          </span>
        </header>
        {error && <div className="alert">{error}</div>}
        <IconGrid icons={icons} loading={loading} />
      </section>
    </main>
  );
};
