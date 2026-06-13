import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}

/** Botón "magnético": se desplaza suavemente hacia el cursor al pasar por encima */
export default function MagneticButton({
  href,
  children,
  variant = "primary",
  external = false,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[background-color,border-color,box-shadow,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const styles =
    variant === "primary"
      ? "bg-accent font-semibold text-night hover:bg-teal-neon shadow-[0_0_24px_rgba(45,212,191,0.32)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)]"
      : "border border-line text-ink/80 hover:border-accent/60 hover:text-ink";

  return (
    <motion.a
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${base} ${styles}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}
