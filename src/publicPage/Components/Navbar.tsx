import { useState, useEffect } from "react";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "ഹോം", href: "#home" },
  { label: "ഫീച്ചേഴ്സ്", href: "#features" },
  { label: "എങ്ങനെ?", href: "#how" },
  { label: "ഞങ്ങളെക്കുറിച്ച്", href: "#about" },
  { label: "ബന്ധപ്പെടൂ", href: "#contact" },
];

export default function Navbar() {
    const navigate = useNavigate()
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Global styles injected inline for portability */}
      <style>{`
        .navbar-glass {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .talky-brand-text {
          font-weight: 800;
          font-size: 1.4rem;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-gradient {
          background: linear-gradient(135deg, hsl(0,65%,50%), hsl(270,60%,60%));
          color: white !important;
          border: none !important;
          border-radius: 999px !important;
          font-weight: 700 !important;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(229,62,62,0.35);
        }
        .nav-link-talky {
          color: rgba(0,0,0,0.65) !important;
          font-weight: 600;
          font-size: 0.875rem;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link-talky::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          border-radius: 999px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s;
        }
        .nav-link-talky:hover {
          color: #e53e3e !important;
        }
        .nav-link-talky:hover::after {
          transform: scaleX(1);
        }
        .mobile-nav-link {
          color: rgba(0,0,0,0.75) !important;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          transition: background 0.2s, color 0.2s;
          display: block;
          text-decoration: none;
        }
        .mobile-nav-link:hover {
          color: #e53e3e !important;
          background: rgba(229,62,62,0.08);
        }
        .logo-icon-bg {
          width: 36px;
          height: 36px;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, hsl(0,65%,50%), hsl(270,60%,60%));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(229,62,62,0.3);
        }
      `}</style>

      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
          transition: "all 0.3s",
        }}
        className={scrolled ? "navbar-glass shadow" : ""}
      >
        <BSNavbar expand="md" className="py-0" style={{ background: "transparent" }}>
          <Container style={{ maxWidth: "1152px" }}>
            {/* Brand / Logo */}
            <BSNavbar.Brand
              href="#home"
              className="d-flex align-items-center gap-2 py-3"
              style={{ textDecoration: "none" }}
            >
              <motion.div whileHover={{ scale: 1.05 }} className="d-flex align-items-center gap-2">
                <div className="logo-icon-bg">
                  <Heart size={18} color="white" fill="white" />
                </div>
                <span className="talky-brand-text">Talky</span>
              </motion.div>
            </BSNavbar.Brand>

            {/* Desktop Nav + Login Button */}
            <div className="d-none d-md-flex align-items-center gap-4 ms-auto">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="nav-link-talky"
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="btn-gradient d-flex align-items-center gap-2 px-4 py-2"
                  style={{ fontSize: "0.875rem" }}
                   onClick={() => navigate('/adminlogin')}
                >
                  <Phone size={15} />
                  ലോഗിൻ
                </Button>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="d-md-none border-0 bg-transparent p-2"
              style={{ color: "#e53e3e", borderRadius: "0.75rem" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                {mobileOpen ? "✕" : "☰"}
              </span>
            </button>
          </Container>
        </BSNavbar>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="d-md-none navbar-glass"
              style={{ borderTop: "1px solid rgba(229,62,62,0.1)", overflow: "hidden" }}
            >
              <div className="px-4 py-3 d-flex flex-column gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Button
                  className="btn-gradient text-center mt-2 py-2"
                  style={{ fontSize: "0.875rem" }}
                  onClick={() => navigate('/adminlogin')}
                >
                  ലോഗിൻ
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}