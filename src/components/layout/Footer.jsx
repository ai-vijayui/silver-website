import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__top-line" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              Silver
            </Link>
            <p className="site-footer__tagline">
              Building Landmarks.
              <br />
              Creating Legacies.
            </p>
            <p className="site-footer__desc">
              Premium real estate developer creating commercial spaces with quality, trust, and long-term value in Surat.
            </p>
            <ul className="site-footer__social" aria-label="Social media">
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Quick Links</p>
            <ul className="site-footer__nav">
              <li>
                <Link className="site-footer__link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/projects">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="site-footer__link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Featured Project</p>
            <img
              className="site-footer__project-logo"
              src="/images/logo/silver infinity white logo.png"
              alt="Silver Infinity"
              width="200"
              height="56"
              loading="lazy"
              decoding="async"
            />
            <p className="site-footer__body">
              Premium Commercial Spaces
              <br />
              Near VIP Circle, Utran, Surat
            </p>
            <div className="site-footer__project-links">
              <Link className="site-footer__link" to="/projects">
                Explore Project →
              </Link>
              <Link className="site-footer__link" to="/virtual-tour">
                Virtual Tour →
              </Link>
            </div>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__heading">Contact</p>
            <p className="site-footer__body">
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
            </p>
            <p className="site-footer__body">
              <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
            </p>
            <p className="site-footer__body">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__bottom-left">
            <p className="site-footer__copy">&copy; 2026 Silver Group. All rights reserved.</p>
            <ul className="site-footer__policy">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
          <p className="site-footer__legal">RERA details available on request.</p>
        </div>
      </div>
    </footer>
  );
}
