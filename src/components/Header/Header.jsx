import { useEffect, useRef, useState } from 'react';
import './Header.css';

const NAV_LINKS = [
  { id: 'homesection', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'statusmap', label: 'Service Status' },
  { id: 'review', label: 'Meet Go Kinetic' },
];

// The original does NOT use scrollIntoView/CSS smooth-scroll for nav clicks --
// it uses jQuery's $('html, body').animate({ scrollTop: ... }, 800, callback),
// which is an 800ms animation eased with jQuery's default 'swing' easing
// (0.5 - cos(pos*PI)/2), not a linear or native-smooth-scroll curve. This
// reproduces that exact duration/easing/target (target.offsetTop, with no
// header-height subtraction -- the original doesn't subtract one either).
const NAV_SCROLL_DURATION = 800;
const swing = (pos) => 0.5 - Math.cos(pos * Math.PI) / 2;

export default function Header({ activeSection, headerHidden }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const magicLineRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  useEffect(() => {
    const menu = menuRef.current;
    const magicLine = magicLineRef.current;
    if (!menu || !magicLine) return;

    const activeLink = menu.querySelector(`a[href="#${activeSection}"]`);
    if (!activeLink) return;

    const parentRect = menu.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    magicLine.style.width = `${activeLink.offsetWidth}px`;
    magicLine.style.left = `${linkRect.left - parentRect.left}px`;
  }, [activeSection, menuOpen]);

  const handleNavClick = (event, id) => {
    event.preventDefault();
    // Clicking leaves the link :focus-ed, which triggers the same green
    // active styling as .nav-link.active (see Header.css) -- without
    // blurring it, that link stays visually "active" even after scrolling
    // moves the real activeSection elsewhere, showing two green items at
    // once. Blur immediately so only the scroll-driven state paints green.
    event.currentTarget.blur();

    const target = document.getElementById(id);
    if (target) {
      cancelAnimationFrame(scrollAnimationRef.current);
      const startY = window.scrollY;
      const targetY = target.getBoundingClientRect().top + startY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const step = (now) => {
        const pos = Math.min((now - startTime) / NAV_SCROLL_DURATION, 1);
        window.scrollTo(0, startY + distance * swing(pos));
        if (pos < 1) {
          scrollAnimationRef.current = requestAnimationFrame(step);
        } else {
          window.history.replaceState(null, '', `#${id}`);
        }
      };
      scrollAnimationRef.current = requestAnimationFrame(step);
    }
    setMenuOpen(false);
  };

  useEffect(() => () => cancelAnimationFrame(scrollAnimationRef.current), []);

  return (
    <header className={`fixed-top px-0 pb-0${headerHidden ? ' hidden-header' : ''}`}>
      <div className="container custom-container">
        <nav className="navbar nav-section navbar-expand-lg navbar-light bg-white">
          <a className="navbar-brand p-0" href="javascript:void(0)" style={{ cursor: 'default' }}>
            <img src="https://my-uata.gokinetic.com/consumer/assets/images/Logo/GoKineticLogo.svg" alt="Go Kinetic Logo" height="55" />
          </a>
          <button
            className={`navbar-toggler${menuOpen ? '' : ' collapsed'}`}
            type="button"
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div className={`collapse navbar-collapse justify-content-center${menuOpen ? ' show' : ''}`} id="navbarNav">
            <div className="navbarmenu position-relative" ref={menuRef}>
              <ul className="navbar-nav">
                {NAV_LINKS.map((link) => (
                  <li className="nav-item" key={link.id}>
                    <a
                      className={`nav-link${activeSection === link.id ? ' active' : ''}`}
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://my.gokinetic.com/consumer/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success loginbtn d-sm-none"
                    style={{ position: 'static' }}
                  >
                    Log in or Register
                  </a>
                </li>
                <li></li>
              </ul>
              <div id="magic-line" ref={magicLineRef}></div>
            </div>
          </div>
          <a
            href="https://my.gokinetic.com/consumer/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-success loginbtn ml-auto d-sm-block d-none"
          >
            Log in or Register
          </a>
        </nav>
      </div>
    </header>
  );
}
