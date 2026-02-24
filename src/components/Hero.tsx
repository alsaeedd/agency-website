import AnimatedText from "./AnimatedText";
import "./Hero.css";

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Bahrain-based digital agency
        </div>
        <AnimatedText as="h1" className="hero-title" delay={0.3} stagger={0.08}>
          Digital agency specialized in custom development and AI automations
        </AnimatedText>
        <AnimatedText
          as="p"
          className="hero-subtitle"
          delay={0.8}
          stagger={0.03}
        >
          RAL is a digital agency that specializes in custom, end-to-end
          software development - from architecture to deployment - and custom AI
          automation workflows.
        </AnimatedText>
        <button
          onClick={onContactClick}
          className="hero-cta-btn"
          style={{ animationDelay: "1.3s" }}
        >
          Build Your Dream Project With Us
        </button>
      </div>
    </section>
  );
}
