import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { useIconStore } from '../store/useIconStore';
import { ICON_STYLES, MAX_COLOR_SWATCHES, DEFAULT_STYLE, type IconStyleId } from '../types';
import { StyleCard } from './StyleCard';
import { ColorChip } from './ColorChip';
import { isHex, normalizeHex } from '../utils/colors';
import { useShallow } from 'zustand/shallow';

const seedPalette = ['#6EE7B7', '#8B5CF6', '#FDE047'];

export const IconForm = () => {
  const [prompt, setPrompt] = useState('Toys with tactile finishes for cozy kid bedroom decor');
  const [styleId, setStyleId] = useState<IconStyleId>(DEFAULT_STYLE);
  const [colorInputs, setColorInputs] = useState<string[]>(seedPalette.slice(0, 3));
  const [errors, setErrors] = useState<{ prompt?: string; colors?: string }>();

  const { generateIcons, loading } = useIconStore(
    useShallow((state) => ({
      generateIcons: state.generateIcons,
      loading: state.loading,
    }))
  );

  const sanitizedColors = useMemo(
    () =>
      colorInputs
        .filter((value) => value.trim().length)
        .map((value) => normalizeHex(value))
        .filter((value, index, self) => self.indexOf(value) === index),
    [colorInputs]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setErrors({ prompt: 'Prompt cannot be empty' });
      toast.error('Please enter a descriptive prompt');
      return;
    }

    if (sanitizedColors.some((value) => !isHex(value))) {
      setErrors({ colors: 'All colors must be 6-digit HEX values' });
      toast.error('Fix color inputs to continue');
      return;
    }

    setErrors(undefined);
    try {
      await generateIcons({ prompt, style: styleId, colors: sanitizedColors });
      toast.success('Icons are on their way 🌈');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate icons';
      toast.error(message);
    }
  };

  const handleColorChange = (value: string, index: number) => {
    setColorInputs((prev) => prev.map((color, idx) => (idx === index ? value : color)));
  };

  const getPickerValue = (value: string) => (isHex(value) ? normalizeHex(value) : '#A0C4FF');

  const handleAddColor = () => {
    if (colorInputs.length >= MAX_COLOR_SWATCHES) {
      toast.error(`You can only add up to ${MAX_COLOR_SWATCHES} colors`);
      return;
    }
    setColorInputs((prev) => [...prev, '#']);
  };

  const handleRemoveColor = (index: number) => {
    setColorInputs((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="prompt">Prompt for icon set</label>
        <textarea
          id="prompt"
          className="prompt-input"
          placeholder="Whimsical camping gadgets with friendly faces"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        {errors?.prompt && <small style={{ color: '#f87171' }}>{errors.prompt}</small>}
      </div>

      <div className="field">
        <label>Preset style</label>
        <div className="style-grid">
          {ICON_STYLES.map((style) => (
            <StyleCard key={style.id} style={style} selected={style.id === styleId} onSelect={(id) => setStyleId(id)} />
          ))}
        </div>
      </div>

      <div className="field">
        <label>Palette steering (HEX)</label>
        <div className="color-chips">
          {sanitizedColors.length ? sanitizedColors.map((color) => <ColorChip key={color} value={color} />) : 'Auto palette'}
        </div>
        {colorInputs.map((value, index) => (
          <div key={`color-${index}`} className="color-input-row">
            <input
              type="color"
              className="color-picker"
              value={getPickerValue(value)}
              onChange={(event) => handleColorChange(normalizeHex(event.target.value), index)}
              aria-label={`Select color swatch ${index + 1}`}
            />
            <input
              type="text"
              className="color-text-input"
              value={value}
              onChange={(event) => handleColorChange(event.target.value, index)}
              placeholder="#A0C4FF"
              maxLength={7}
            />
            <button type="button" onClick={() => handleRemoveColor(index)} aria-label="Remove color">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {errors?.colors && <small style={{ color: '#f87171' }}>{errors.colors}</small>}
        <button type="button" className="ghost-button" style={{ width: 'fit-content' }} onClick={handleAddColor}>
          <Plus size={18} /> Add color swatch
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Summoning Icons...' : 'Generate quartet'}
        </button>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Consistent 512x512 PNGs. 4 unique icons every run.</p>
      </div>
    </form>
  );
};
