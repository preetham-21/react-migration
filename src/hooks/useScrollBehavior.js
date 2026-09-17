import { useEffect, useRef, useState } from 'react';
import scrollLock from './scrollLock';

const SECTION_IDS = ['homesection', 'features', 'statusmap', 'review'];

function throttle(fn, limit) {
  let lastRan;
  let timeout;
  const throttled = (...args) => {
    if (!lastRan) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
  throttled.cancel = () => clearTimeout(timeout);
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

  return { headerHidden, setHeaderHidden, activeSection, footerAnimate, sectionIds: SECTION_IDS };
}
