import { useState } from 'react';
import { Download, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import type { IconResult } from '../types';
import { downloadDataUri, convertPngToJpg } from '../utils/download';

interface IconCardProps {
  icon: IconResult;
  index: number;
}

export const IconCard = ({ icon, index }: IconCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const filename = `${icon.prompt.replace(/\s+/g, '_').slice(0, 40)}_${index + 1}`;

  const handleDownload = async (format: 'png' | 'jpg') => {
    setMenuOpen(false);
    try {
      if (format === 'png') {
        downloadDataUri(icon.dataUri, `${filename}.png`);
        return;
      }
      const jpgData = await convertPngToJpg(icon.dataUri);
      downloadDataUri(jpgData, `${filename}.jpg`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to download image';
      toast.error(message);
    }
  };

  return (
    <article className="icon-card">
      <div className="icon-preview">
        <img src={icon.dataUri} alt={`Generated icon ${index + 1}`} loading="lazy" width={512} height={512} />
      </div>
      <div className="icon-meta">
        <strong>Seed {icon.seed}</strong>
        <span>{icon.prompt}</span>
      </div>
      <div className="icon-actions">
        <button className="split-button" type="button" onClick={() => handleDownload('png')}>
          <Download size={18} /> PNG
        </button>
        <div className="download-menu">
          <button type="button" aria-haspopup="true" onClick={() => setMenuOpen((prev) => !prev)}>
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="menu-sheet">
              <button type="button" onClick={() => handleDownload('jpg')}>
                JPG (flat background)
              </button>
              <button type="button" onClick={() => downloadDataUri(icon.dataUri, `${filename}.png`)}>
                Original PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
