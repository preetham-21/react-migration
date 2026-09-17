import { useEffect, useRef, useState } from 'react';
import serviceStatusSlides from '../../data/serviceStatus';
import useServiceStatusController from '../../hooks/useServiceStatusController';
import useResponsive from '../../hooks/useResponsive';
import ImageLightbox from '../ImageLightbox/ImageLightbox';
import './ServiceStatus.css';

// Slick's default autoplaySpeed is 3000ms; the original never overrides it
// in the <=992px `responsive` blocks that turn autoplay on, so 3000 (not an
// arbitrary value) is what it actually relies on.
const AUTOPLAY_INTERVAL = 3000;
const SWIPE_THRESHOLD = 40;

export default function ServiceStatus({ onHideHeader }) {
  const { isDesktop } = useResponsive();
  const { sectionRef, pathRef, activeIndex, circlePoint, goToIndex } = useServiceStatusController({
    onHideHeader,
  });
  const [lightboxImage, setLightboxImage] = useState(null);
  const touchStartX = useRef(null);

  // Mobile/tablet: autoplay + swipe, matching the original slick `responsive`
  // overrides (infinite, dots, autoplay, draggable) below the 992px breakpoint.
  useEffect(() => {
    if (isDesktop) return undefined;
    const timer = setInterval(() => {
      goToIndex((activeIndex + 1) % serviceStatusSlides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isDesktop, activeIndex, goToIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      const direction = deltaX < 0 ? 1 : -1;
      const next = (activeIndex + direction + serviceStatusSlides.length) % serviceStatusSlides.length;
      goToIndex(next);
    }
    touchStartX.current = null;
  };

  return (
    <section id="statusmap" className="statusmap-section text-center">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <h2 className="section-title f-f-NSR mb-3 text-white">Service Status</h2>
            <p className="page-description mb-3 text-white">
              Keep Updated And Connected With New Tools That Make Accessing Service And Technician Support Even
              Easier.
            </p>
          </div>
        </div>
      </div>
      <section id="scrollableSection" className="position-relative" style={{ zIndex: 2 }} ref={sectionRef}>
        <div className="container position-relative">
          <div className="service-map">
            <div className="column-left">
              <div className="absolute-panel flexbox active">
                <div className="sliderstatustext">
                  {serviceStatusSlides.map((slide, index) => (
                    <div
                      className={`slidetext${index === activeIndex ? ' current' : ''}`}
                      key={slide.title}
                      aria-hidden={index !== activeIndex}
                    >
                      <h2 className="leftContentTitle font-weight-bold">{slide.title}</h2>
                      <p className="leftContentText">{slide.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <svg className="responsive-svg" viewBox="0 0 320 402" xmlns="http://www.w3.org/2000/svg">
                <path
                  id="zigzagPath"
                  ref={pathRef}
                  d="
                    M310,10
                    L310,130
                    Q310,142 298,142
                    L34,142
                    Q22,142 22,154
                    L22,298
                    Q22,310 34,310
                    L298,310
                    Q310,310 310,322
                    L310,402"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                ></path>
                <circle
                  id="movingCircle"
                  r="5"
                  fill="#f7941d"
                  stroke="white"
                  strokeWidth="2"
                  transform={`translate(${circlePoint.x}, ${circlePoint.y})`}
                ></circle>
              </svg>
            </div>
            <div className="column-right flexbox">
              <div className="position-relative statusimagewrap w-100">
                <div
                  className="sliderstatusimages"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="slideimage-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                    {serviceStatusSlides.map((slide) => (
                      <div className="slideimage" key={slide.image}>
                        <a
                          href={slide.image}
                          onClick={(e) => {
                            e.preventDefault();
                            setLightboxImage(slide);
                          }}
                        >
                          <img src={slide.image} alt="statussection image" className="img-fluid" style={{ maxWidth: '90%' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                {!isDesktop && (
                  <ul className="slick-dots">
                    {serviceStatusSlides.map((slide, index) => (
                      <li className={index === activeIndex ? 'slick-active' : ''} key={slide.title}>
                        <button type="button" aria-label={slide.title} onClick={() => goToIndex(index)}></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImageLightbox
        src={lightboxImage?.image}
        alt={lightboxImage ? `${lightboxImage.title} image` : ''}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  );
}
