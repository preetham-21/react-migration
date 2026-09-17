import features from '../../data/features';
import FeatureCard from './FeatureCard';
import './Features.css';

export default function Features() {
  return (
    <section id="features" className="features-section text-center py-5">
      <div className="container custom-container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-xl-10 offset-xl-1">
            <h2 className="section-title f-f-NSR mb-3 text-white">Features</h2>
            <div className="row">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
