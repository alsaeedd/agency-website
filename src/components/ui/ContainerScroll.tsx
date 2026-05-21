import React, { useRef, useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  MotionValue,
} from "framer-motion";
import "./ContainerScroll.css";

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Returns true on coarse-pointer devices (touch / mobile) AND on weak tiers.
 * On those devices we DO NOT subscribe to scrollYProgress at all — framer's
 * useScroll/useSpring pipeline runs every frame across the entire page
 * lifecycle, which is the dominant lag source for this section on Android.
 * Capable desktops keep the original buttery 3D scroll choreography.
 */
function useIsLowFidelity(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const tier = document.documentElement.dataset.tier; // low | med | high
    const coarse =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches;
    setLow(coarse || tier === "low" || tier === "med");
  }, []);
  return low;
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lowFi = useIsLowFidelity();

  // On low-fidelity devices we render the same DOM but skip ALL scroll
  // subscriptions. The card has no rotation/scale tween — it just sits
  // there, enters via a cheap CSS opacity+translateY transition. This drops
  // ~16ms/frame of framer-motion + spring + getBoundingClientRect from the
  // main thread on mobile.
  if (lowFi) {
    return (
      <div ref={containerRef} className="cscroll-shell cscroll-shell-lite">
        <div className="cscroll-stage cscroll-stage-lite">
          <div className="cscroll-header">{titleComponent}</div>
          <div className="cscroll-card cscroll-card-lite">
            <div className="cscroll-card-inner">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  return <ContainerScrollFull ref={containerRef} titleComponent={titleComponent}>{children}</ContainerScrollFull>;
};

interface FullProps extends ContainerScrollProps {}
const ContainerScrollFull = React.forwardRef<HTMLDivElement, FullProps>(
  ({ titleComponent, children }, ref) => {
    const { scrollYProgress } = useScroll({
      target: ref as React.RefObject<HTMLDivElement>,
      offset: ["start end", "end start"],
    });

    // Buttery spring-smoothed scroll progress (desktop only)
    const smooth = useSpring(scrollYProgress, {
      damping: 32,
      stiffness: 110,
      mass: 0.5,
      restDelta: 0.001,
    });

    const rotate = useTransform(smooth, [0.05, 0.55], [22, 0]);
    const scale = useTransform(smooth, [0.05, 0.55], [1.04, 1]);
    const translate = useTransform(smooth, [0.05, 0.6], [0, -80]);

    return (
      <div ref={ref} className="cscroll-shell">
        <div className="cscroll-stage">
          <Header translate={translate}>{titleComponent}</Header>
          <Card rotate={rotate} scale={scale}>
            {children}
          </Card>
        </div>
      </div>
    );
  },
);

const Header: React.FC<{ translate: MotionValue<number>; children: React.ReactNode }> = ({
  translate,
  children,
}) => (
  <motion.div style={{ translateY: translate }} className="cscroll-header">
    {children}
  </motion.div>
);

const Card: React.FC<{
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}> = ({ rotate, scale, children }) => (
  <motion.div
    style={{ rotateX: rotate, scale }}
    className="cscroll-card"
  >
    <div className="cscroll-card-inner">{children}</div>
  </motion.div>
);

export default ContainerScroll;
