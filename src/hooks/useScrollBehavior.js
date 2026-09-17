import { useEffect, useRef, useState } from 'react';
import scrollLock from './scrollLock';

const SECTION_IDS = ['homesection', 'features', 'statusmap', 'review'];

// Leading+trailing throttle. The trailing call is unconditional once its
// timer fires -- an earlier version re-checked "has `limit` really elapsed"
// inside the timeout callback and silently dropped the call (never
// rescheduling) if that check failed by even a millisecond or two due to
// ordinary setTimeout imprecision. Since that trailing call is what catches
// the *final* scroll position once scrolling stops, an occasional dropped
// call meant activeSection could permanently miss updating to wherever a
// scroll (including the click-nav's own animated scroll) actually ended.
function throttle(fn, limit) {
  let lastRan = 0;
  let timeout = null;
  let pendingArgs = null;

  const throttled = (...args) => {
    const now = Date.now();
    const remaining = limit - (now - lastRan);
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      lastRan = now;
      fn(...args);
    } else {
      pendingArgs = args;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          lastRan = Date.now();
          fn(...pendingArgs);
        }, remaining);
      }
    }
  };
  throttled.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return throttled;
}

export default function useScrollBehavior() {
  const [headerHidden, setHeaderHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('homesection');
  const [footerAnimate, setFooterAnimate] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleActiveAndFooter = throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setFooterAnimate(scrollPosition + windowHeight >= documentHeight - 300);

      // While a nav-link click's animated scroll is in flight, the click
      // handler owns activeSection directly (see Header.jsx) -- skip
      // passive detection so it can't flicker to whatever intermediate
      // section the animation is currently scrolling past.
      if (scrollLock.isNavigating) return;

      // Sections are checked by "which one's top have we most recently
      // scrolled past", not by "are we within [top, top+ownHeight)". The
      // latter used each section's OWN offsetHeight as its range, but
      // .features-section has `margin-top: -100px` (see Features.css),
      // which pulls it up to visually overlap the bottom ~100px of
      // .home-section without changing home-section's own offsetHeight --
      // so that 100px band still matched homesection's range and kept the
      // nav on "Home" even though Features had already visually painted
      // over it. Finding the last section whose top boundary we've reached
      // is correct regardless of any such overlap between adjacent sections.
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const sectionTop = el.getBoundingClientRect().top + window.scrollY - 70;
        if (scrollPosition >= sectionTop) {
          current = id;
        } else {
          break;
        }
      }
      setActiveSection(current);
    }, 100);

    const handleHeaderVisibility = () => {
      if (!scrollLock.isScrollingInSection) {
        const currentScroll = window.scrollY;
        setHeaderHidden(currentScroll > lastScrollTop.current);
        lastScrollTop.current = currentScroll;
      }
      scrollLock.isScrollingInSection = false;
    };

    const onScroll = () => {
      handleActiveAndFooter();
      handleHeaderVisibility();
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      handleActiveAndFooter.cancel();
    };
  }, []);

  return { headerHidden, setHeaderHidden, activeSection, setActiveSection, footerAnimate, sectionIds: SECTION_IDS };
}
