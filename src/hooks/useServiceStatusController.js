import { useCallback, useEffect, useRef, useState } from 'react';
import scrollLock from './scrollLock';

const DESKTOP_BREAKPOINT = 992;

function indexFromValue(value) {
  if (value < 25) return 0;
  if (value < 50) return 1;
  if (value < 75) return 2;
  return 3;
}

// Reproduces the original desktop-only "wheel over the status section drives
// a 0-100 slider in 25% steps, which moves an orange dot along the SVG zigzag
// path and swaps the synced text/image slides" interaction, plus the window
// scroll-lock that pins the page to the section while that's happening.
export default function useServiceStatusController({ onHideHeader }) {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [circlePoint, setCirclePoint] = useState({ x: 0, y: 0 });

  const valueRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const debounceRef = useRef(null);
  const pathLengthRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const updateCircle = useCallback((value) => {
    const path = pathRef.current;
    if (!path) return;
    try {
      // Cache the length instead of recomputing it on every step, and guard
      // against browsers (Safari/iOS in particular) that throw when
      // getTotalLength() is called on a path inside a display:none ancestor
      // -- the SVG is hidden below the 992px breakpoint (.responsive-svg).
      if (pathLengthRef.current == null) {
        pathLengthRef.current = path.getTotalLength();
      }
      const length = (value / 100) * pathLengthRef.current;
      const point = path.getPointAtLength(length);
      setCirclePoint({ x: point.x, y: point.y });
    } catch {
      // Path not renderable (hidden) at this viewport -- nothing to update.
    }
  }, []);

  const animateSlider = useCallback(
    (from, to, callback) => {
      isAnimatingRef.current = true;
      const step = from < to ? 1 : -1;
      const stepInterval = 50;

      const tick = () => {
        if (!mountedRef.current) return;
        if ((step > 0 && from < to) || (step < 0 && from > to)) {
          from += step;
          valueRef.current = from;
          updateCircle(from);
          animationTimeoutRef.current = setTimeout(tick, stepInterval);
        } else {
          isAnimatingRef.current = false;
          callback();
        }
      };
      tick();
    },
    [updateCircle]
  );

  useEffect(() => {
    updateCircle(0);
    return () => {
      mountedRef.current = false;
      clearTimeout(animationTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const lockScrollPosition = () => {
      const statusmap = document.getElementById('statusmap');
      if (window.innerHeight < 700) {
        window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
      } else if (statusmap) {
        window.scrollTo(0, statusmap.getBoundingClientRect().top + window.scrollY + 40);
      }
    };

    const runStep = (event) => {
      const currentValue = valueRef.current;
      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 10;
      const adjustedDelta = delta > 0 ? 25 : -25;

      if ((currentValue === 0 && adjustedDelta < 0) || (currentValue === 100 && adjustedDelta > 0)) {
        return;
      }

      lockScrollPosition();
      event.preventDefault();

      const targetValue = Math.max(0, Math.min(100, currentValue + adjustedDelta));
      if (targetValue !== currentValue) {
        animateSlider(currentValue, targetValue, () => {
          setActiveIndex(indexFromValue(targetValue));
        });
      }
    };

    const onWheel = (event) => {
      if (window.innerWidth <= DESKTOP_BREAKPOINT) return;

      scrollLock.isScrollingInSection = true;
      onHideHeader?.(true);

      if (isAnimatingRef.current) {
        lockScrollPosition();
        event.preventDefault();
        return;
      }

      const isTouchpad = Math.abs(event.deltaY) < 10;
      if (isTouchpad) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runStep(event), 60);
      } else {
        runStep(event);
      }
    };

    section.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      section.removeEventListener('wheel', onWheel);
      clearTimeout(debounceRef.current);
    };
  }, [animateSlider, onHideHeader]);

  const goToIndex = useCallback(
    (index) => {
      const target = index * 25;
      isAnimatingRef.current = false;
      valueRef.current = target;
      updateCircle(target);
      setActiveIndex(index);
    },
    [updateCircle]
  );

  return { sectionRef, pathRef, activeIndex, circlePoint, goToIndex };
}
