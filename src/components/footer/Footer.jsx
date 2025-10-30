// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sms-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon small">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#4648fd"/>
                  <path d="M12 6L16.5 9L12 12L7.5 9L12 6Z" fill="#81f9f9"/>
                  <path d="M7.5 9V15L12 18L16.5 15V9L12 12V18" fill="white" fillOpacity="0.8"/>
                </svg>
              </div>
              <span className="logo-text">EduManage</span>
            </div>
            <p className="footer-description">
              Streamlining student management for educational institutions with modern technology solutions.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Dashboard</a></li>
              <li><a href="/">Students</a></li>
              <li><a href="/">Courses</a></li>
              <li><a href="/">Grades</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="/">Help Center</a></li>
              <li><a href="/">Contact Us</a></li>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📧 support@edumanage.com</p>
              <p>📞 +251911567890</p>
              <p>🏢 123 Education St, Campus City</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="bottom-content">
            <p>&copy; {currentYear} EduManage. All rights reserved.</p>
            <div className="social-links">
              <a href="/" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 5.924c-.75.33-1.56.556-2.405.656.865-.52 1.53-1.34 1.84-2.32-.81.48-1.705.83-2.66 1.02-.765-.82-1.855-1.33-3.06-1.33-2.315 0-4.19 1.88-4.19 4.19 0 .33.035.65.105.96-3.48-.175-6.57-1.84-8.64-4.38-.36.62-.565 1.34-.565 2.11 0 1.455.74 2.74 1.86 3.49-.685-.022-1.33-.21-1.895-.52v.05c0 2.03 1.445 3.73 3.36 4.115-.35.095-.72.145-1.1.145-.27 0-.53-.025-.785-.075.53 1.655 2.07 2.86 3.895 2.89-1.425 1.12-3.225 1.785-5.18 1.785-.335 0-.67-.02-1-.06 1.855 1.19 4.06 1.885 6.425 1.885 7.71 0 11.925-6.39 11.925-11.925 0-.18-.005-.36-.015-.54.82-.59 1.53-1.33 2.09-2.17z"/>
                </svg>
              </a>
              <a href="/" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="/" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;