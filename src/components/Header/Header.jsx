import { useEffect, useRef, useState } from 'react';
import './Header.css';

const NAV_LINKS = [
  { id: 'homesection', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'statusmap', label: 'Service Status' },
  { id: 'review', label: 'Meet Go Kinetic' },
];

export default function Header({ activeSection, headerHidden }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const magicLineRef = useRef(null);

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
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
    setMenuOpen(false);
  };

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
