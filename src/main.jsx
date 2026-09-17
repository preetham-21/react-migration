import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Bundled locally (not via CDN) so react-slick's horizontal track/slide layout
// (.slick-track, .slick-slide float/display rules) never depends on an
// external stylesheet request succeeding.
import 'slick-carousel/slick/slick.css';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
