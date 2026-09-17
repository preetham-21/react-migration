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

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const sectionOffset = el.getBoundingClientRect().top + window.scrollY - 70;
        const sectionHeight = el.offsetHeight;
        if (scrollPosition >= sectionOffset && scrollPosition < sectionOffset + sectionHeight) {
          setActiveSection(id);
          break;
        }
      }
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
