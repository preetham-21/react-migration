const STAR_PATH =
  'M12 1.5l3.22 6.52 7.2.99-5.21 5.08 1.23 7.17L12 17.77l-6.44 3.49 1.23-7.17L1.58 9.01l7.2-.99L12 1.5z';

// One star, drawn twice: a dim outline copy underneath, and a solid
// colored copy on top clipped to `fillFraction` (0-1) of its width. No
// images, no reveal animation -- both copies always render at their final
// state, driven directly by the rating value.
function Star({ fillFraction }) {
  return (
    <span className="rating-star" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="rating-star-outline">
        <path d={STAR_PATH} />
      </svg>
      {fillFraction > 0 && (
        <svg
          viewBox="0 0 24 24"
          className="rating-star-fill"
          style={{ clipPath: `inset(0 ${100 - fillFraction * 100}% 0 0)` }}
        >
          <path d={STAR_PATH} />
        </svg>
      )}
    </span>
  );
}

export default function StarRating({ rating, className = '' }) {
  return (
    <div className={`rating-stars ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fillFraction={Math.max(0, Math.min(1, rating - i))} />
      ))}
    </div>
  );
}
