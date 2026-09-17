import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import reviews from '../../data/reviews';
import useCounter from '../../hooks/useCounter';
import './Reviews.css';

// react-slick's default appendDots renders <ul style={{ display: "block" }}>.
// That's an inline style, which always wins over an external stylesheet rule
// (our .slick-dots{display:flex} in app.css), so the dots' default <li>
// display (browser default list-item, since slick-theme.css was never
// bundled) stacks them vertically. Supplying our own wrapper with no inline
// style sidesteps the conflict entirely -- app.css's .slick-dots rule then
// applies cleanly.
const appendDots = (dots) => <ul className="slick-dots">{dots}</ul>;
const AUTOPLAY_SPEED = 3000;

// The nav bar (six category pills, natural width, one centered in a ribbon,
// neighbors peeking in from both sides, continuously autoplaying) was built
// on react-slick's centerMode+variableWidth+autoplay combination through
// several previous passes, tuning `infinite` on and off, with and without a
// forced resize. Real-browser testing kept surfacing the same class of bug
// (a blank ribbon) regardless -- that specific combination of react-slick
// features is simply not reliable enough for this. It's replaced below with
// a small, fully custom implementation: a plain flex row of naturally-sized
// pills inside a hidden-overflow container, centered on the active one via
// the browser's own native `scrollIntoView({ inline: 'center' })`. There is
// no width measurement, no cloned slides, no track-position bookkeeping to
// ever drift -- the browser's own scroll-centering is the only thing
// positioning it, so it cannot go blank. The content slider below (plain
// `fade`, no centerMode/variableWidth) was never reported broken and is
// left on react-slick.
export default function Reviews() {
  const iosCounter = useCounter(4.8);
  const androidCounter = useCounter(4.7);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentSlider, setContentSlider] = useState(null);
  const navContainerRef = useRef(null);
  const navTrackRef = useRef(null);
  const itemRefs = useRef([]);
  const autoplayRef = useRef(null);
  const pausedRef = useRef(false);
  const hasCenteredOnceRef = useRef(false);

  // Give the track enough empty space on each side (half the visible
  // container's width) that scrollIntoView can actually center even the
  // first/last pill, not just ones with real neighbors on both sides.
  useEffect(() => {
    const container = navContainerRef.current;
    const track = navTrackRef.current;
    if (!container || !track) return undefined;

    const applyPadding = () => {
      const half = container.clientWidth / 2;
      track.style.paddingLeft = `${half}px`;
      track.style.paddingRight = `${half}px`;
    };
    applyPadding();

    const observer = new ResizeObserver(applyPadding);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Center the active pill whenever it changes -- the very first
  // positioning (page load) is instant, not animated; only subsequent
  // moves (autoplay/click) smoothly slide.
  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({
      behavior: hasCenteredOnceRef.current ? 'smooth' : 'auto',
      inline: 'center',
      block: 'nearest',
    });
    hasCenteredOnceRef.current = true;
  }, [activeIndex]);

  // Drive the content slider to match, once it's mounted -- kept as a
  // separate effect so a late-arriving `contentSlider` ref doesn't also
  // re-trigger the nav's own scrollIntoView above.
  useEffect(() => {
    contentSlider?.slickGoTo(activeIndex);
  }, [activeIndex, contentSlider]);

  // Continuous autoplay, paused on hover (matching the original's
  // `pauseOnHover: true`) -- a plain index increment, so "last -> first" is
  // just ordinary wraparound arithmetic, not a special case.
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, AUTOPLAY_SPEED);
    return () => clearInterval(autoplayRef.current);
  }, []);

  const contentSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    infinite: false,
    appendDots,
    afterChange: (index) => setActiveIndex(index),
    responsive: [
      {
        breakpoint: 767,
        settings: { dots: true },
      },
    ],
  };

  return (
    <section id="review" className="review-section text-center py-5">
      <div className="container pt-3 custom-container position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <h2 className="section-title f-f-NSR mb-3 text-white">Customers love Go Kinetic!</h2>
            <p className="page-description mb-5 text-white">
              At Kinetic, everything we do has the customer in mind. Go Kinetic is providing useful features,
              added value, and improving overall customer experience. Our customers agree.
            </p>
            <div className="row mb-5">
              <div className="col-md-6 reveal-pane reveal fade-bottom">
                <h3 className="text-white rating-point counter" ref={iosCounter.ref}>
                  {iosCounter.display}
                </h3>
                <div className="stars mb-2">
                  <img src="/assets/images/iosrating.svg" alt="Ios Star" className="iosreview star" />
                </div>
                <p className="text-white">App Store Rating</p>
              </div>
              <div className="col-md-6 reveal-pane reveal fade-bottom">
                <h3 className="text-white rating-point counter" ref={androidCounter.ref}>
                  {androidCounter.display}
                </h3>
                <div className="stars mb-2">
                  <img src="/assets/images/androidrating.svg" alt="Ios Star" className="androidreview star" />
                </div>
                <p className="text-white">Google Play Rating</p>
              </div>
            </div>
            <div className="decorative-icon">
              <img src="/assets/images/quoteframe.svg" alt="Decorative Icon" className="decorative-icon" style={{ height: '100px' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container custom-container position-relative" style={{ zIndex: 2 }}>
        <div className="highlight-banner mb-4 position-relative">
          <div className="sliderbackground-overlay"></div>
          <div
            className="reviewslider-nav"
            ref={navContainerRef}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
          >
            <div className="navtab-track" ref={navTrackRef}>
              {reviews.map((review, index) => (
                <div
                  key={review.tab}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`navtab-slide${index === activeIndex ? ' slick-current' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveIndex(index);
                  }}
                >
                  {review.tab}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-3 pb-3 position-relative" style={{ zIndex: 2 }}>
        <div className="reviewslider-content">
          <div className="row">
            <div className="col-lg-4 offset-lg-4 col-xl-6 offset-xl-3 col-md-8 offset-md-2">
              <div className="reviewslider-for">
                <Slider ref={setContentSlider} {...contentSettings}>
                  {reviews.map((review) => (
                    <div className="navcontent-slide" key={review.tab}>
                      {review.content}
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
