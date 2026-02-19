import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Features from "../Components/Features";
import HowItWorks from "../Components/HowItWorks";
import Footer from "../Components/Footer";
export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}