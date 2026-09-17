import { useEffect } from 'react';
import './VideoModal.css';

export default function VideoModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-content">
          <div className="video-modal-header">
            <h5 className="video-modal-title">YouTube Video</h5>
            <button type="button" className="modal-close-icon" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="video-modal-body">
            <div className="framevideo-container">
              <iframe
                width="100%"
                className="framevideo"
                src="https://www.youtube.com/embed/iYSf0xhhBzA?&rel=0&autohide=1&showinfo=0&autoplay=0"
                title="Go Kinetic video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
