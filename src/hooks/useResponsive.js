import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// The original site's dominant behavioral breakpoint (slick `responsive` configs,
// the wheel-scroll status interaction, the magic-line nav) switches at 992px.
export default function useResponsive() {
  const isDesktop = useMediaQuery('(min-width: 993px)');
  return { isDesktop, isMobile: !isDesktop };
}
