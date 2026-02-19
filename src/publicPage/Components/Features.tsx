import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";

interface Feature {
  emoji: string;
  title: string;
  desc: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    emoji: "📞",
    title: "റാൻഡം വോയ്‌സ് കോൾ",
    desc: "ലോകത്തിന്റെ ഏത് കോണിലേക്കും ആകസ്‌മിക വോയ്‌സ് കോൾ ചെയ്ത് പുതിയ ബന്ധങ്ങൾ ഉണ്ടാക്കൂ.",
    iconBg: "linear-gradient(135deg, #e53e3e, #fc8181)",
  },
  {
    emoji: "🔒",
    title: "സുരക്ഷിതവും സേഫ്",
    desc: "നിങ്ങളുടെ സ്വകാര്യത ഞങ്ങൾക്ക് പ്രധാനം. End-to-end encrypted ആണ് എല്ലാ കോളുകളും.",
    iconBg: "linear-gradient(135deg, #9f7aea, #e53e3e)",
  },
  {
    emoji: "⚡",
    title: "ഇൻസ്റ്റൻ്റ് കണക്ട്",
    desc: "ഒരു ടാപ്പ് മതി — ഒരു നിമിഷം കൊണ്ട് കണക്ട് ആകൂ. കാത്തിരിക്കേണ്ട!",
    iconBg: "linear-gradient(135deg, #fc8181, #e53e3e)",
  },
  {
    emoji: "🫂",
    title: "ഫ്രണ്ട്‌ലി കമ്മ്യൂണിറ്റി",
    desc: "സ്‌നേഹമുള്ള, ആദരണീയമായ ഒരു കമ്മ്യൂണിറ്റിയിൽ ചേരൂ. ഒറ്റപ്പെടൽ ഇനി ഇല്ല!",
    iconBg: "linear-gradient(135deg, #e53e3e, #9f7aea)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Features() {
  return (
    <>
      <style>{`
        #features {
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
        }
        .features-blob {
          position: absolute;
          width: 18rem;
          height: 18rem;
          top: 0;
          right: 0;
          border-radius: 9999px;
          background: hsl(285,70%,72%);
          filter: blur(80px);
          opacity: 0.2;
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
        .feature-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
          transition: box-shadow 0.3s;
        }
        .feature-card:hover {
          box-shadow: 0 12px 40px rgba(229,62,62,0.15);
        }
        .feature-icon-wrap {
          width: 4rem;
          height: 4rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transition: transform 0.3s;
        }
        .feature-card:hover .feature-icon-wrap {
          transform: scale(1.12);
        }
        .feature-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .feature-desc {
          color: rgba(0,0,0,0.5);
          font-size: 0.875rem;
          line-height: 1.65;
        }
      `}</style>

      <section id="features">
        <div className="features-blob" />

        <Container style={{ maxWidth: "1152px", position: "relative", zIndex: 1 }}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-5"
          >
            <span className="section-badge">✨ ഫീച്ചേഴ്സ്</span>
            <h2 className="section-heading">
              എന്തുകൊണ്ട്{" "}
              <span className="gradient-text">Talky?</span>{" "}
              💕
            </h2>
            <p className="section-lead">
              ഞങ്ങളുടെ ആപ്പ് നിങ്ങൾക്ക് ലഭ്യമാക്കുന്ന അദ്ഭുതകരമായ ഫീച്ചേഴ്സ് കണ്ടുപിടിക്കൂ.
            </p>
            <div className="section-line" />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Row className="g-4">
              {features.map((feature) => (
                <Col key={feature.title} xs={12} sm={6} lg={3}>
                  <motion.div
                    variants={cardVariants}
                    className="feature-card h-100"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div
                      className="feature-icon-wrap"
                      style={{ background: feature.iconBg }}
                    >
                      {feature.emoji}
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>
    </>
  );
}