import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Heart, Phone, Play } from "lucide-react";

interface FloatingIcon {
  icon: string;
  x: number;
  y: number;
  delay: number;
  size: string;
}

interface Stat {
  value: string;
  label: string;
}

const floatingIcons: FloatingIcon[] = [
  { icon: "💕", x: -80, y: -60, delay: 0, size: "2rem" },
  { icon: "📞", x: 90, y: -80, delay: 0.5, size: "1.5rem" },
  { icon: "❤️", x: -100, y: 80, delay: 1, size: "1.5rem" },
  { icon: "🌟", x: 110, y: 60, delay: 1.5, size: "1.25rem" },
  { icon: "💗", x: -50, y: 150, delay: 0.8, size: "1.5rem" },
  { icon: "🎵", x: 130, y: -20, delay: 1.2, size: "1.25rem" },
];

const stats: Stat[] = [
  { value: "10K+", label: "സജീവ ഉപയോക്താക്കൾ" },
  { value: "50K+", label: "ദൈനംദിന കോളുകൾ" },
  { value: "4.9 ★", label: "ആപ്പ് റേറ്റിംഗ്" },
];

export default function Hero() {
  return (
    <>
      <style>{`
        #home {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-top: 5rem;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, hsl(0,60%,96%), hsl(270,40%,96%));
          z-index: 0;
        }
        .hero-blob-1 {
          position: absolute;
          width: 24rem;
          height: 24rem;
          top: 2.5rem;
          left: -5rem;
          border-radius: 9999px;
          background: hsl(0,60%,85%);
          filter: blur(80px);
          opacity: 0.4;
          animation: blobMove 8s ease-in-out infinite;
          z-index: 0;
        }
        .hero-blob-2 {
          position: absolute;
          width: 20rem;
          height: 20rem;
          bottom: 5rem;
          right: 0;
          border-radius: 9999px;
          background: hsl(270,50%,85%);
          filter: blur(80px);
          opacity: 0.35;
          animation: blobMove 8s ease-in-out infinite 3s;
          z-index: 0;
        }
        @keyframes blobMove {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.08) translate(10px, -10px); }
        }
        .hero-content {
          position: relative;
          z-index: 10;
        }
        .badge-pill-talky {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(8px);
          color: #c53030;
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
        }
        .hero-heading {
          font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          line-height: 1.15;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        .gradient-text {
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-lead {
          color: rgba(0,0,0,0.6);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 36rem;
        }
        .btn-gradient {
          background: linear-gradient(135deg, hsl(0,65%,50%), hsl(270,60%,60%)) !important;
          color: white !important;
          border: none !important;
          border-radius: 9999px !important;
          font-weight: 700 !important;
          padding: 0.9rem 2rem !important;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(229,62,62,0.3);
          font-size: 1rem !important;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          box-shadow: 0 6px 28px rgba(229,62,62,0.45);
        }
        .btn-secondary-talky {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(8px);
          color: #1a1a1a;
          font-weight: 700;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          text-decoration: none;
          font-size: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-secondary-talky:hover {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
          color: #1a1a1a;
        }
        .play-icon-btn {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, hsl(0,65%,50%), hsl(270,60%,60%));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-value {
          font-weight: 800;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(0,0,0,0.5);
          font-weight: 500;
        }

        /* Phone Mockup */
        .phone-frame {
          width: 280px;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border-radius: 3rem;
          box-shadow: 0 30px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06), inset 0 0 0 2px rgba(255,255,255,0.8);
          padding: 0.75rem;
          position: relative;
          z-index: 10;
        }
        .phone-notch {
          position: absolute;
          top: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          width: 5rem;
          height: 1.2rem;
          background: rgba(0,0,0,0.9);
          border-radius: 9999px;
          z-index: 30;
        }
        .phone-screen {
          border-radius: 2.5rem;
          overflow: hidden;
          background: linear-gradient(135deg, #fff5f5, #ffe4e4);
          min-height: 540px;
        }
        .phone-header {
          padding: 2.5rem 1.25rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, hsl(0,65%,28%), hsl(0,55%,40%));
        }
        .phone-logo-circle {
          width: 3.5rem;
          height: 3.5rem;
          background: rgba(255,255,255,0.2);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          backdrop-filter: blur(6px);
        }
        .phone-body {
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .phone-input-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border-radius: 0.75rem;
          padding: 0.65rem 0.75rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }
        .phone-verify-btn {
          text-align: center;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.75rem;
          border-radius: 0.75rem;
          cursor: pointer;
          background: linear-gradient(135deg, hsl(0,65%,30%), hsl(0,55%,45%));
        }
        .phone-gender-row {
          background: #fff5f5;
          border-radius: 0.75rem;
          padding: 0.65rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gender-badge {
          background: white;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.75rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          color: #e53e3e;
        }
        .phone-glow {
          position: absolute;
          inset: 0;
          border-radius: 3rem;
          background: linear-gradient(135deg, #e53e3e55, #9f7aea55);
          filter: blur(2rem);
          transform: scale(1.05);
          pointer-events: none;
          opacity: 0.5;
        }
        .floating-icon {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 20;
        }
      `}</style>

      <section id="home">
        <div className="hero-bg" />
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />

        <Container style={{ maxWidth: "1152px", position: "relative", zIndex: 10 }} className="py-5">
          <Row className="align-items-center g-5">
            {/* Left — Text Content */}
            <Col xs={12} lg={6} className="text-center text-lg-start hero-content">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="badge-pill-talky">
                  <Heart size={15} fill="#e53e3e" color="#e53e3e" />
                  ആരംഭിക്കൂ ഇന്നേ! 🎉
                </div>
              </motion.div>

              <motion.h1
                className="hero-heading"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <span className="gradient-text">പുതിയ സൗഹൃദങ്ങൾ,</span>
                <br />
                <span>ഒരു കോളിലൂടെ 💕</span>
              </motion.h1>

              <motion.p
                className="hero-lead mx-auto mx-lg-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Talky വഴി ലോകത്തിന്റെ ഏത് ഭാഗത്തുനിന്നും പുതിയ സുഹൃത്തുക്കളുമായി
                ബന്ധപ്പെടൂ. ഒരു ടാപ്പ് മതി, ഒരു സൗഹൃദം ജനിക്കാൻ! 🌟
              </motion.p>

              <motion.div
                className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                <motion.a
                  href="#contact"
                  className="btn-gradient"
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Phone size={18} />
                  ഇപ്പോൾ തുടങ്ങാം
                </motion.a>

                <motion.a
                  href="#how"
                  className="btn-secondary-talky"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="play-icon-btn">
                    <Play size={15} color="white" fill="white" />
                  </span>
                  ഡെമോ കാണൂ
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </Col>

            {/* Right — Phone Mockup */}
            <Col xs={12} lg={6} className="d-flex justify-content-center">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {/* Floating Emojis */}
                {floatingIcons.map((fi, i) => (
                  <motion.div
                    key={i}
                    className="floating-icon"
                    style={{
                      left: `calc(50% + ${fi.x}px)`,
                      top: `calc(50% + ${fi.y}px)`,
                      fontSize: fi.size,
                    }}
                    animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
                    transition={{
                      duration: 3 + i * 0.4,
                      delay: fi.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {fi.icon}
                  </motion.div>
                ))}

                <div style={{ position: "relative" }}>
                  <div className="phone-glow" />
                  <div className="phone-frame">
                    <div className="phone-notch" />
                    <div className="phone-screen">
                      {/* App Header */}
                      <div className="phone-header">
                        <div className="phone-logo-circle">
                          <Heart size={28} color="white" fill="white" />
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "white", margin: 0 }}>
                          Talky
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem", margin: "0.25rem 0 0" }}>
                          സൗഹൃദത്തിന്റെ ശബ്‌ദം
                        </p>
                      </div>

                      {/* Login Form */}
                      <div className="phone-body">
                        <h4 style={{ fontWeight: 700, textAlign: "center", fontSize: "0.8rem", color: "#1a1a1a", marginBottom: "0.25rem" }}>
                          മൊബൈൽ നമ്പർ നൽകൂ
                        </h4>

                        <div className="phone-input-row">
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#e53e3e" }}>🇮🇳 +91</span>
                          <span style={{ fontSize: "0.7rem", color: "rgba(0,0,0,0.4)" }}>മൊബൈൽ നമ്പർ</span>
                        </div>

                        <div className="phone-input-row">
                          <span style={{ fontSize: "0.7rem", color: "rgba(0,0,0,0.4)" }}>🔐 OTP കോഡ്</span>
                        </div>

                        <div className="phone-verify-btn">വെരിഫൈ ചെയ്യൂ ✓</div>

                        <div className="phone-gender-row">
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#e53e3e" }}>ജെന്റർ തിരഞ്ഞെടുക്കൂ</span>
                          <div className="d-flex gap-1">
                            <span className="gender-badge">♂</span>
                            <span className="gender-badge" style={{ color: "#9f7aea" }}>♀</span>
                          </div>
                        </div>

                        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(0,0,0,0.4)", marginTop: "0.25rem" }}>
                          <span style={{ fontWeight: 700, color: "#e53e3e", cursor: "pointer" }}>
                            ആരംഭിക്കൂ 🚀
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}