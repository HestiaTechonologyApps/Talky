import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react";

interface SocialLink {
  Icon: React.ElementType;
  href: string;
  label: string;
}

interface FooterLink {
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

const footerLinks: FooterLink[] = [
  { label: "ഹോം", href: "#home" },
  { label: "ഫീച്ചേഴ്സ്", href: "#features" },
  { label: "എങ്ങനെ?", href: "#how" },
  { label: "ബന്ധപ്പെടൂ", href: "#contact" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <>
      <style>{`
        #contact {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, hsl(0,60%,16%), hsl(0,50%,22%));
        }
        .footer-blob-1 {
          position: absolute;
          width: 16rem;
          height: 16rem;
          top: 0;
          right: 0;
          border-radius: 9999px;
          background: hsl(0,65%,35%);
          filter: blur(80px);
          opacity: 0.1;
          pointer-events: none;
        }
        .footer-blob-2 {
          position: absolute;
          width: 12rem;
          height: 12rem;
          bottom: 0;
          left: 0;
          border-radius: 9999px;
          background: hsl(0,55%,45%);
          filter: blur(60px);
          opacity: 0.1;
          pointer-events: none;
        }
        .footer-brand-text {
          font-weight: 800;
          font-size: 1.4rem;
          color: white;
        }
        .footer-logo-bg {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(229,62,62,0.3);
        }
        .footer-tagline {
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }
        .social-btn {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.7);
          transition: background 0.3s, color 0.3s;
          text-decoration: none;
        }
        .social-btn:hover {
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          color: white;
        }
        .footer-col-heading {
          font-weight: 700;
          color: white;
          margin-bottom: 1.25rem;
          font-size: 1rem;
        }
        .footer-link {
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          text-decoration: none;
          display: block;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: white;
          text-decoration: underline;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          text-decoration: none;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }
        .footer-contact-item:hover {
          color: white;
        }
        .newsletter-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .newsletter-input {
          flex: 1;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 0.875rem;
          padding: 0.65rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
          outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .newsletter-input:focus {
          border-color: rgba(229,62,62,0.5);
        }
        .newsletter-btn {
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
          white-space: nowrap;
        }
        .newsletter-btn:hover {
          transform: scale(1.05);
        }
        .footer-divider {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          margin-top: 0;
        }
        .footer-copy {
          color: rgba(255,255,255,0.4);
          font-size: 0.875rem;
          text-align: center;
        }
        .footer-tagline-bottom {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.875rem;
        }
      `}</style>

      <footer id="contact">
        <div className="footer-blob-1" />
        <div className="footer-blob-2" />

        <Container style={{ maxWidth: "1152px", position: "relative", zIndex: 10, paddingTop: "4rem", paddingBottom: "2rem" }}>
          {/* Top Section */}
          <Row className="g-5 mb-5">
            {/* Brand Column */}
            <Col xs={12} md={4}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="footer-logo-bg">
                  <Heart size={18} color="white" fill="white" />
                </div>
                <span className="footer-brand-text">Talky</span>
              </div>
              <p className="footer-tagline">
                Talky – സൗഹൃദത്തിന്റെ പുതിയ ശബ്‌ദം ❤️
                <br />
                ഒരു കോൾ, ഒരു ജീവിതം മാറ്റും.
              </p>
              <div className="d-flex gap-2">
                {socialLinks.map(({ Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="social-btn"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={12} sm={6} md={4}>
              <h4 className="footer-col-heading">ക്വിക്ക് ലിങ്ക്സ്</h4>
              <ul className="list-unstyled">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact & Newsletter */}
            <Col xs={12} sm={6} md={4}>
              <h4 className="footer-col-heading">ബന്ധപ്പെടൂ</h4>

              <a href="mailto:hello@talky.app" className="footer-contact-item">
                <Mail size={15} />
                hello@talky.app
              </a>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                📍 Kerala, India
              </p>

              <div className="mt-4">
                <p className="newsletter-label">ന്യൂസ്‌ലെറ്ററിൽ ചേരൂ</p>
                <div className="d-flex gap-2">
                  <input
                    type="email"
                    placeholder="ഇമെയിൽ"
                    className="newsletter-input"
                  />
                  <motion.button
                    className="newsletter-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Go
                  </motion.button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Bottom Bar */}
          <div className="footer-divider">
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
              <p className="footer-copy mb-0">
                © 2024 Talky. All rights reserved. Made with ❤️ in Kerala
              </p>
              <div className="footer-tagline-bottom">
                <Heart size={12} color="#e53e3e" fill="#e53e3e" />
                <span>Talky – സൗഹൃദത്തിന്റെ പുതിയ ശബ്‌ദം</span>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}