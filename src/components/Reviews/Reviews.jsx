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

export default function Reviews() {
  const iosCounter = useCounter(4.8);
  const androidCounter = useCounter(4.7);
  const [navSlider, setNavSlider] = useState(null);
  const [contentSlider, setContentSlider] = useState(null);
  const wrapTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(wrapTimeoutRef.current), []);

  // `infinite: true` is what actually caused the "blank after several
  // rotations" bug, not `variableWidth` -- infinite mode's clone-slide
  // bookkeeping (rendering extra copies before/after the real slides to
  // fake a seamless wrap) drifts a little on every transition, and under
  // continuous autoplay that drift compounds until the track lands
  // entirely outside .slick-list's viewport. variableWidth is what gives
  // each label its own natural width with even gaps between them (see the
  // reference screenshot) instead of forcing 3-5 equal-width boxes that
  // crowd together at narrow widths -- removing it (tried previously) lost
  // that look for no longer benefit, once the real culprit (infinite) is
  // addressed directly instead. So: infinite:false removes the clone
  // machinery entirely (variableWidth + centerMode without clones is far
  // more stable), and the "6 -> 1" loop is completed manually below --
  // react-slick's own autoplay simply stops advancing once infinite:false
  // reaches the last slide (canGoNext returns false), so afterChange
  // pauses its internal timer there, waits one more autoplaySpeed itself,
  // jumps back to slide 0, then resumes autoplay -- keeping the same
  // one-step-every-3s cadence with no clone-based state to ever drift.
  const handleAfterChange = (currentSlide) => {
    clearTimeout(wrapTimeoutRef.current);
    if (currentSlide === reviews.length - 1) {
      navSlider?.slickPause?.();
      wrapTimeoutRef.current = setTimeout(() => {
        navSlider?.slickGoTo(0);
        navSlider?.slickPlay?.();
      }, AUTOPLAY_SPEED);
    }
  };

  const navSettings = {
    slidesToShow: 5,
    arrows: false,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: AUTOPLAY_SPEED,
    centerMode: true,
    centerPadding: '60px',
    variableWidth: true,
    adaptiveHeight: true,
    slidesToScroll: 1,
    dots: false,
    focusOnSelect: true,
    infinite: false,
    asNavFor: contentSlider,
    afterChange: handleAfterChange,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
    ],
  };

  const contentSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    infinite: false,
    asNavFor: navSlider,
    appendDots,
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
          <div className="reviewslider-nav">
            <Slider ref={setNavSlider} {...navSettings}>
              {reviews.map((review) => (
                <div className="navtab-slide" key={review.tab}>
                  {review.tab}
                </div>
              ))}
            </Slider>
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
