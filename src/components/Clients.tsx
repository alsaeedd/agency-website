import AnimatedText from "./AnimatedText";
import logoMain from "../../assets/logo_main.png";

const logos = [
  {
    name: "Jerar",
    src: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png",
  },
  {
    name: "Revenue Automation Lab",
    src: logoMain,
  },
];

// Duplicate enough times to fill the track for a seamless loop
const track = [...logos, ...logos, ...logos, ...logos];

export default function Clients() {
  return (
    <section className="clients">
      <div className="container">
        <div className="clients-header">
          <AnimatedText as="h2" className="section-title" triggerOnScroll stagger={0.1}>
            Our clients
          </AnimatedText>
        </div>
      </div>

      <div className="clients-marquee">
        <div className="clients-track">
          {track.map((logo, i) => (
            <div key={i} className="client-logo">
              <img src={logo.src} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
