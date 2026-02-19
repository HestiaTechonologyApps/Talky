import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";

interface Step {
  emoji: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    emoji: "📲",
    title: "ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ",
    desc: "Google Play Store അല്ലെങ്കിൽ App Store-ൽ നിന്ന് Talky ഡൗൺലോഡ് ചെയ്ത് ഇൻസ്റ്റാൾ ചെയ്യൂ.",
  },
  {
    emoji: "📱",
    title: "മൊബൈൽ നമ്പർ ഉപയോഗിച്ച് ലോഗിൻ",
    desc: "നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകൂ, OTP വഴി വേഗം വെരിഫൈ ചെയ്ത് ലോഗിൻ ചെയ്യൂ.",
  },
  {
    emoji: "🧑‍🤝‍🧑",
    title: "ജെന്റർ തിരഞ്ഞെടുക്കൂ",
    desc: "നിങ്ങളുടെ ജെൻഡർ സെലക്ട് ചെയ്യൂ — Male അല്ലെങ്കിൽ Female. ഇത് നിങ്ങൾക്ക് മികച്ച മാച്ച് ഉറപ്പാക്കും.",
  },
  {
    emoji: "📞",
    title: "കണക്ട് ആകൂ & കോൾ ചെയ്യൂ",
    desc: "ഒരു ടാപ്പ് ചെയ്ത് പുതിയ സൗഹൃദം ആരംഭിക്കൂ — ലോകമെമ്പാടുമുള്ള ആളുകളുമായി കോൾ ചെയ്യൂ! 💕",
  },
];

export default function HowItWorks() {
  return (
    <>
      <style>{`
        #how {
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, hsl(0,20%,97%) 0%, hsl(0,10%,95%) 100%);
        }
        .how-blob-1 {
          position: absolute;
          width: 16rem;
          height: 16rem;
          bottom: 0;
          left: 0;
          border-radius: 9999px;
          background: hsl(0,60%,40%);
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }
        .how-blob-2 {
          position: absolute;
          width: 12rem;
          height: 12rem;
          top: 2.5rem;
          right: 2.5rem;
          border-radius: 9999px;
          background: hsl(0,50%,50%);
          filter: blur(70px);
          opacity: 0.1;
          pointer-events: none;
        }
        .section-badge {
          display: inline-block;
          background: #fff5f5;
          color: #c53030;
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }
        .section-heading {
          font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 3rem);
          color: #1a1a1a;
          margin-bottom: 1rem;
        }
        .gradient-text {
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-lead {
          color: rgba(0,0,0,0.5);
          font-size: 1.05rem;
          max-width: 36rem;
          margin: 0 auto;
        }
        .section-line {
          width: 3rem;
          height: 0.2rem;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          border-radius: 9999px;
          margin: 1.5rem auto 0;
        }
        .step-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.04);
          position: relative;
          height: 100%;
        }
        .step-outer-ring {
          width: 6rem;
          height: 6rem;
          border-radius: 9999px;
          background: #fff5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          position: relative;
        }
        .step-inner-circle {
          width: 4rem;
          height: 4rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 16px rgba(229,62,62,0.3);
        }
        .step-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          z-index: 2;
        }
        .step-title {
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .step-desc {
          color: rgba(0,0,0,0.5);
          font-size: 0.875rem;
          line-height: 1.65;
        }
        .connecting-line {
          position: absolute;
          top: 3rem;
          left: calc(12.5% + 2rem);
          right: calc(12.5% + 2rem);
          height: 2px;
          background: linear-gradient(135deg, #e53e3e, #9f7aea);
          opacity: 0.25;
          pointer-events: none;
        }
        .cta-banner {
          margin-top: 5rem;
          background: linear-gradient(135deg, rgba(229,62,62,0.06), rgba(159,122,234,0.04));
          border-radius: 2rem;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0,0,0,0.06);
          border: 1px solid rgba(229,62,62,0.08);
        }
        .cta-heading {
          font-weight: 800;
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: #1a1a1a;
          margin-bottom: 1rem;
        }
        .cta-lead {
          color: rgba(0,0,0,0.5);
          max-width: 28rem;
          margin: 0 auto 2rem;
          font-size: 0.95rem;
        }
        .btn-gradient {
          background: linear-gradient(135deg, hsl(0,65%,50%), hsl(270,60%,60%));
          color: white !important;
          border: none !important;
          border-radius: 9999px !important;
          font-weight: 700 !important;
          padding: 1rem 2.5rem !important;
          font-size: 1rem !important;
          display: inline-block;
          box-shadow: 0 4px 20px rgba(229,62,62,0.3);
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          box-shadow: 0 6px 28px rgba(229,62,62,0.45);
        }
      `}</style>

      <section id="how">
        <div className="how-blob-1" />
        <div className="how-blob-2" />

        <Container style={{ maxWidth: "1152px", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-5"
          >
            <span className="section-badge">🚀 എങ്ങനെ ഉപയോഗിക്കാം?</span>
            <h2 className="section-heading">
              <span className="gradient-text">4 ഘട്ടം</span> മതി! ✨
            </h2>
            <p className="section-lead">
              Talky ഉപയോഗിക്കാൻ ഇതിലും എളുപ്പം ഒന്നുമില്ല — ഇൻസ്റ്റാൾ ചെയ്ത് ഒരു മിനിറ്റ് കൊണ്ട് ആരംഭിക്കൂ.
            </p>
            <div className="section-line" />
          </motion.div>

          {/* Steps */}
          <div style={{ position: "relative" }}>
            <div className="d-none d-lg-block connecting-line" />
            <Row className="g-4">
              {steps.map((step, i) => (
                <Col key={step.title} xs={12} sm={6} lg={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="step-card"
                  >
                    <div className="step-outer-ring">
                      <motion.div
                        className="step-inner-circle"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 3,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {step.emoji}
                      </motion.div>
                      <div className="step-badge">{i + 1}</div>
                    </div>

                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>

          {/* CTA Banner */}
          <motion.div
            className="cta-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💕</div>
            <h3 className="cta-heading">
              ഇന്ന് തന്നെ{" "}
              <span className="gradient-text">Talky-യിൽ</span> ചേരൂ!
            </h3>
            <p className="cta-lead">
              10,000-ലധികം ഉപയോക്താക്കൾ ഇതിനകം Talky-ൽ ഉണ്ട്. നിങ്ങളും വരൂ!
            </p>
            <motion.a
              href="#contact"
              className="btn-gradient"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📲 ഇപ്പോൾ ഡൗൺലോഡ് ചെയ്യൂ
            </motion.a>
          </motion.div>
        </Container>
      </section>
    </>
  );
}