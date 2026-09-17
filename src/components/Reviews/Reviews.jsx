import { useState } from 'react';
import Slider from 'react-slick';
import reviews from '../../data/reviews';
import useCounter from '../../hooks/useCounter';
import './Reviews.css';

export default function Reviews() {
  const iosCounter = useCounter(4.8);
  const androidCounter = useCounter(4.7);
  const [navSlider, setNavSlider] = useState(null);
  const [contentSlider, setContentSlider] = useState(null);

  const navSettings = {
    slidesToShow: 5,
    arrows: false,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '60px',
    variableWidth: true,
    adaptiveHeight: true,
    slidesToScroll: 1,
    dots: false,
    focusOnSelect: true,
    infinite: true,
    asNavFor: contentSlider,
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
    asNavFor: navSlider,
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
