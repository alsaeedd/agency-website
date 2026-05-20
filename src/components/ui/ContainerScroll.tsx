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

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Buttery spring-smoothed scroll progress
  const smooth = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 110,
    mass: 0.5,
    restDelta: 0.001,
  });

  const scaleRange: [number, number] = isMobile ? [0.82, 0.98] : [1.04, 1];
  const rotate = useTransform(smooth, [0.05, 0.55], [22, 0]);
  const scale = useTransform(smooth, [0.05, 0.55], scaleRange);
  const translate = useTransform(smooth, [0.05, 0.6], [0, -80]);

  return (
    <div ref={containerRef} className="cscroll-shell">
      <div className="cscroll-stage">
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

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
