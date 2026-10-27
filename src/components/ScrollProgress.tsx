import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Barra fina de progreso de scroll en el borde superior */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent via-blue-neon to-teal-neon"
      style={{ scaleX }}
    />
  );
}
