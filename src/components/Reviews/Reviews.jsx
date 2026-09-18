import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
const TRANSITION_MS = 500;
const REAL_COUNT = reviews.length; // 6
const LEAD_CLONES = 2;
const TRAIL_CLONES = 2;
const REAL_START = LEAD_CLONES; // real index 0 lives at render position 2

// The nav bar (six category pills, natural width, one centered in a ribbon,
// with real neighbors -- or, at the array's ends, wrapped neighbors --
// peeking in on both sides, continuously autoplaying forever) needs a
// genuinely seamless infinite loop: "Great Service" -> "Convenient" must
// look like ordinary forward motion, never a reverse sweep back across the
// whole row. A real scrolling container (tried previously, via
// scrollIntoView) can't do that -- wrapping from the last real item to the
// first is necessarily a long *backward* scroll. react-slick's own
// `infinite` mode fakes this with cloned slides, but that specific
// combination (variableWidth + centerMode + infinite + autoplay) proved
// unreliable across several passes (real-browser testing kept showing a
// blank ribbon).
//
// This hand-rolls the same "clone slides" idea react-slick uses, without
// react-slick: the rendered row is [clone(4), clone(5), real 0..5,
// clone(0), clone(1)] -- 2 duplicate pills at each end. A CSS
// `transform: translateX()` (not a real scroll) slides the row to center
// whichever position is active. Advancing past the last real position
// (7) moves onto its trailing clone (8, a pixel-identical duplicate of
// position 2); once that transition finishes, the position is silently
// reset to 2 with the CSS transition disabled for one frame -- since the
// clone is pixel-identical to the real item, that reset is invisible, and
// the loop can continue forward forever. Clicking always targets a real
// position (2-7) directly, so only autoplay's forward stepping ever visits
// the clone positions.
export default function Reviews() {
  const iosCounter = useCounter(4.8);
  const androidCounter = useCounter(4.7);
  const [renderPosition, setRenderPosition] = useState(REAL_START);
  const [trackOffset, setTrackOffset] = useState(0);
  const [suppressTransition, setSuppressTransition] = useState(true);
  const [contentSlider, setContentSlider] = useState(null);

  const navContainerRef = useRef(null);
  const navTrackRef = useRef(null);
  const itemRefs = useRef([]);
  const autoplayRef = useRef(null);
  const pausedRef = useRef(false);

  const activeRealIndex = (((renderPosition - REAL_START) % REAL_COUNT) + REAL_COUNT) % REAL_COUNT;

  const renderItems = [
    ...reviews.slice(REAL_COUNT - LEAD_CLONES).map((review, i) => ({
      review,
      realIndex: REAL_COUNT - LEAD_CLONES + i,
      key: `lead-${i}`,
    })),
    ...reviews.map((review, i) => ({ review, realIndex: i, key: `real-${i}` })),
    ...reviews.slice(0, TRAIL_CLONES).map((review, i) => ({ review, realIndex: i, key: `trail-${i}` })),
  ];

  const moveToRealIndex = (realIndex) => {
    setRenderPosition(REAL_START + realIndex);
  };

  // Re-center the track on the active position -- measured via plain
  // offsetLeft (layout position, unaffected by the transform itself) so
  // the math never gets contaminated by whatever transform is currently
  // mid-transition.
  useLayoutEffect(() => {
    const container = navContainerRef.current;
    const activeEl = itemRefs.current[renderPosition];
    if (!container || !activeEl) return;
    const offset = container.clientWidth / 2 - (activeEl.offsetLeft + activeEl.offsetWidth / 2);
    setTrackOffset(offset);
  });

  // Recompute on resize too (widths/container size can change).
  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return undefined;
    const recompute = () => {
      const activeEl = itemRefs.current[renderPosition];
      if (!activeEl) return;
      setTrackOffset(container.clientWidth / 2 - (activeEl.offsetLeft + activeEl.offsetWidth / 2));
    };
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The very first positioning (page load) happens with the transition
  // disabled, so it doesn't visibly slide in from the left on mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setSuppressTransition(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // Once a step lands on a trailing clone (past the last real position),
  // wait for that transition to finish, then silently reset onto the
  // pixel-identical real position with the transition disabled for one
  // frame -- the loop then continues forward indefinitely.
  useEffect(() => {
    if (renderPosition < REAL_START + REAL_COUNT) return undefined;
    const timer = setTimeout(() => {
      setSuppressTransition(true);
      setRenderPosition(renderPosition - REAL_COUNT);
      requestAnimationFrame(() => requestAnimationFrame(() => setSuppressTransition(false)));
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [renderPosition]);

  // Drive the content slider to match, once it's mounted.
  useEffect(() => {
    contentSlider?.slickGoTo(activeRealIndex);
  }, [activeRealIndex, contentSlider]);

  // Continuous autoplay, paused on hover (matching the original's
  // `pauseOnHover: true`) -- a plain forward step; the effect above turns
  // "one step past the end" into a seamless loop.
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setRenderPosition((prev) => prev + 1);
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
    afterChange: (index) => moveToRealIndex(index),
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
                  <img
                    src="/assets/images/iosrating.svg"
                    alt="Ios Star"
                    className="iosreview star star-fill"
                    style={{ clipPath: `inset(0 ${100 - Math.min(iosCounter.progress, 1) * 100}% 0 0)` }}
                  />
                </div>
                <p className="text-white">App Store Rating</p>
              </div>
              <div className="col-md-6 reveal-pane reveal fade-bottom">
                <h3 className="text-white rating-point counter" ref={androidCounter.ref}>
                  {androidCounter.display}
                </h3>
                <div className="stars mb-2">
                  <img
                    src="/assets/images/androidrating.svg"
                    alt="Ios Star"
                    className="androidreview star star-fill"
                    style={{ clipPath: `inset(0 ${100 - Math.min(androidCounter.progress, 1) * 100}% 0 0)` }}
                  />
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
            <div
              className="navtab-track"
              ref={navTrackRef}
              style={{
                transform: `translateX(${trackOffset}px)`,
                transition: suppressTransition ? 'none' : `transform ${TRANSITION_MS}ms ease`,
              }}
            >
              {renderItems.map((item, position) => (
                <div
                  key={item.key}
                  ref={(el) => {
                    itemRefs.current[position] = el;
                  }}
                  className={`navtab-slide${position === renderPosition ? ' slick-current' : ''}`}
                  onClick={() => moveToRealIndex(item.realIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') moveToRealIndex(item.realIndex);
                  }}
                >
                  {item.review.tab}
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
