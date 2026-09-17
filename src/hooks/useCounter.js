import { useEffect, useRef, useState } from 'react';

// jQuery's default 'swing' easing: 0.5 - cos(pos*PI)/2
const swing = (pos) => 0.5 - Math.cos(pos * Math.PI) / 2;

export default function useCounter(target, duration = 3000) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let rafId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const start = performance.now();
            const from = 0;

            const step = (now) => {
              const elapsed = now - start;
              const pos = Math.min(elapsed / duration, 1);
              const eased = swing(pos);
              const current = from + (target - from) * eased;
              setValue(pos >= 1 ? target : current);
              if (pos < 1) rafId = requestAnimationFrame(step);
            };
            rafId = requestAnimationFrame(step);
          }
        });
      },
      { threshold: 1.0 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  return { ref, display: value.toFixed(1) };
}
