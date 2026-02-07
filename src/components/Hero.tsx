import AnimatedText from "./AnimatedText";

export default function Hero() {
  const handleContactClick = () => {
    const contactCircle = document.querySelector(
      ".contact-circle",
    ) as HTMLElement;
    if (contactCircle) contactCircle.click();
  };

  return (
    <section className="hero">
      <div className="hero-content">
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
          onClick={handleContactClick}
          className="hero-cta-btn"
          style={{ animationDelay: "1.3s" }}
        >
          Build Your Dream Project With Us
        </button>
      </div>
    </section>
  );
}
