import { useRef, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import ServiceStatus from './components/ServiceStatus/ServiceStatus';
import Reviews from './components/Reviews/Reviews';
import Footer from './components/Footer/Footer';
import VideoModal from './components/VideoModal/VideoModal';
import useScrollBehavior from './hooks/useScrollBehavior';
import useReveal from './hooks/useReveal';

export default function App() {
  const appRef = useRef(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const scroll = useScrollBehavior();

  useReveal(appRef);

  return (
    <div ref={appRef}>
      <Header
        activeSection={scroll.activeSection}
        setActiveSection={scroll.setActiveSection}
        headerHidden={scroll.headerHidden}
      />

      <Hero onWatchVideo={() => setVideoOpen(true)} />
      <Features />

      <div className="pinwheelshadow position-relative">
        <ServiceStatus onHideHeader={scroll.setHeaderHidden} />
        <Reviews />
      </div>

      <Footer animate={scroll.footerAnimate} />

      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}
