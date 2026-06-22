import { TOUR } from '../../config/site';

export const bodyClass = 'page-virtual-tour';

export default function VirtualTourContent() {
  return (
    <div className="tour-frame-wrap">
      <div className="tour-loading" id="tour-loading" aria-live="polite">
        <div className="tour-loading__spinner" aria-hidden="true" />
        <span>Loading virtual tour…</span>
      </div>

      <div className="tour-fallback" id="tour-fallback" role="alert" hidden>
        <p>The tour could not be embedded in this window. You can open it directly below.</p>
        <a href={TOUR.embedUrl} target="_blank" rel="noopener noreferrer">
          Open Virtual Tour
        </a>
        <a href="/">Return to Home</a>
      </div>

      <iframe
        id="tour-frame"
        title="Silver Infinity 360° Virtual Tour"
        src={TOUR.embedUrl}
        allow="fullscreen; accelerometer; gyroscope"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
}
