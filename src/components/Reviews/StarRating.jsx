import { useEffect, useRef, useState } from 'react';

const STAR_PATH =
  'M12 1.5l3.22 6.52 7.2.99-5.21 5.08 1.23 7.17L12 17.77l-6.44 3.49 1.23-7.17L1.58 9.01l7.2-.99L12 1.5z';

// One star, drawn twice: a dim outline copy underneath, and a solid
// colored copy on top clipped to `fillFraction` (0-1) of its width.
function Star({ fillFraction }) {
  return (
    <span className="rating-star" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="rating-star-outline">
        <path d={STAR_PATH} />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="rating-star-fill"
        style={{ clipPath: `inset(0 ${100 - fillFraction * 100}% 0 0)` }}
      >
        <path d={STAR_PATH} />
      </svg>
    </span>
  );
}

// The fill amount for each star is always computed directly from `rating`
// (no image assets, no dependency on the separate number counter) -- but
// starts at 0 and transitions up to its real value once this row scrolls
// into view, so the stars visibly "fill in" on load rather than just
// appearing already-drawn. `.rating-star-fill`'s CSS transition on
// clip-path (see Reviews.css) is what animates each star; this only ever
// flips the target between 0 and the real fraction, once.
export default function StarRating({ rating, className = '' }) {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`rating-stars ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fillFraction={revealed ? Math.max(0, Math.min(1, rating - i)) : 0} />
      ))}
    </div>
  );
}
