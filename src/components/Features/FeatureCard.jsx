export default function FeatureCard({ feature }) {
  return (
    <div className="col-md-6 mb-4">
      <div className={`feature-card h-100 reveal-pane reveal ${feature.reveal}`}>
        <div className="card-icon">
          <img src={feature.icon} alt={feature.alt} height="80" />
        </div>
        <h3 className="card-title">{feature.title}</h3>
        <p className="card-text">{feature.text}</p>
        <ul className="list-unstyled">
          {feature.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
