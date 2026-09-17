import { useEffect } from 'react';
import './ImageLightbox.css';

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className="image-lightbox-overlay" onClick={onClose}>
      <button type="button" className="image-lightbox-close" aria-label="Close" onClick={onClose}>
        &times;
      </button>
      <img src={src} alt={alt} className="image-lightbox-img" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
