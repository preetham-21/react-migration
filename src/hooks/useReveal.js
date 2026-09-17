import { useEffect } from 'react';

// Mirrors the original reveal() logic: an element's `.reveal` class becomes
// `.reveal.active` once its top crosses (windowHeight - 150), and reverts
// when scrolled back above that line, so the fade animation can replay.
// rootMargin bottom of -150px reproduces that "150px before the bottom
// of the viewport" trigger point using IntersectionObserver instead of
// a scroll-position poll.
export default function useReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const elements = root.querySelectorAll('.reveal-pane');
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -150px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}
