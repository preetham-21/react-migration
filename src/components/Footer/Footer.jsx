import './Footer.css';

export default function Footer({ animate }) {
  return (
    <>
      <section className="footer-section text-center pt-5 pb-3" style={{ backgroundColor: '#fbfaf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="row align-items-center text-left">
                <div className="col-md-6 text-md-right reveal-pane reveal fade-left">
                  <img
                    className="footer-logo"
                    src="https://my-uata.gokinetic.com/consumer/assets/images/Logo/GoKineticLogo.svg"
                    alt="Go Kinetic Logo"
                    style={{ height: '130px', maxWidth: '240px' }}
                  />
                </div>
                <div className="col-md-6 text-left reveal-pane reveal fade-right">
                  <h4 className="f-f-NSR">Take control of Your Kinetic experience.</h4>
                  <p>
                    Go Kinetic is more than just a tool&mdash;it&apos;s your gateway to better connectivity,
                    smarter solutions, and stress-free support. Download the mobile app today.
                  </p>
                  <div className="d-flex">
                    <a href="https://apps.apple.com/us/app/go-kinetic-by-windstream/id1342262959" target="_blank" rel="noreferrer">
                      <img
                        src="https://login.windstream.com/assets/images/consumer/Store.Apple.svg"
                        alt="Download on the App Store"
                        style={{ height: '40px', marginRight: '10px' }}
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.windstream.residential&hl=en_US&gl=US"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="https://login.windstream.com/assets/images/consumer/Store.Google.svg"
                        alt="Get it on Google Play"
                        style={{ height: '40px' }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={`footer-section-strip${animate ? ' animate' : ''}`} style={{ backgroundColor: '#fbfaf1' }}>
        <svg width="1440" className="footer-baranimation" height="351" style={{ width: '100%' }} viewBox="0 0 1440 351" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="footer-bar">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M663.421 1135.53V1283.68L984.977 1217.27V901.698L984.977 537.916C984.977 537.916 984.977 537.916 984.977 537.916V178.392L663.421 111.979V394.803H663.42V1135.53H663.421Z"
              fill="#409AC0"
            />
          </g>
          <g className="footer-bar">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1440 334.797V1064C1440 1098.88 1408.35 1129.62 1362.19 1139.4L1213.02 1170.77V833.448V609.804V228.026L1362.19 259.398C1408.35 269.182 1440 299.915 1440 334.797Z"
              fill="#931D65"
            />
          </g>
          <g className="footer-bar">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1212.48 566.89V226.686L985.508 179.229V484.292H985.507V901.131V1005.63V1215.33L1212.49 1167.87V831.851C1212.49 831.851 1212.49 831.851 1212.49 831.851V566.89H1212.48Z"
              fill="#F7941D"
            />
          </g>
          <g className="footer-bar">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M662.89 1050.49L662.889 1285.83L142.224 1393.51C71.618 1408.35 0.862549 1370.46 0.862549 1317.85V78.9851C0.862549 26.2631 71.618 -11.5174 142.224 3.21058L662.889 110.896V565.648H662.89V1050.49Z"
              fill="#24A76A"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
