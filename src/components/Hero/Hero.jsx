import './Hero.css';

export default function Hero({ onWatchVideo }) {
  return (
    <section className="home-section text-center text-white flexbox" id="homesection">
      <div className="container custom-container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <h1 className="section-title f-f-NSR mb-4">Meet Go Kinetic</h1>
            <h2 className="font-weight-bold bold-text mb-4">Your home connection. Simplified.</h2>
            <div className="lead mb-5 page-description col-lg-8 offset-lg-2">
              Managing your services has never been easier with the new and improved Go Kinetic. Access
              smarter tools, faster support, and seamless communication - all in one place.
            </div>
          </div>
        </div>
        <div className="devices mb-4 col-lg-10 offset-lg-1">
          <div className="position-relative d-inline-flex">
            <img src="/assets/images/homeall-img.png" className="section1-img maxwidth100 opacity-zero" alt="section-1img" />
            <img
              src="/assets/images/home2-img.png"
              className="section1tab-img position-absolute reveal-pane reveal fade-left"
              alt="section1-tabimg"
              style={{ maxWidth: '82.5%' }}
            />
            <img
              src="/assets/images/home1-img.png"
              className="section1tab-img position-absolute reveal-pane reveal fade-right"
              alt="section1-tabimg"
              style={{ maxWidth: '23%', right: '0px', bottom: '5px' }}
            />
          </div>
        </div>
        <div className="reveal-pane reveal fade-bottom">
          <button
            className="btn btn-link text-white youtube-btn"
            style={{ outline: 'none', boxShadow: 'none' }}
            onClick={onWatchVideo}
          >
            <img src="/assets/images/youtube.svg" alt="youtube icon" className="pr-3" />
            Watch on YouTube
          </button>
        </div>
      </div>
    </section>
  );
}
