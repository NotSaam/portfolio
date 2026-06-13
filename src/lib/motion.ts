import type { Transition, Variants } from "framer-motion";

/**
 * Lenguaje de movimiento ÚNICO de toda la web.
 * Importa de aquí en vez de inventar easings/duraciones por componente: así
 * todo comparte la misma "firma" de movimiento (sensación premium y coherente).
 */

/** Easing firma: settle suave tipo out-expo. El alma del movimiento del sitio. */
export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const;

/** Transiciones firma reutilizables. */
export const T_SIGNATURE: Transition = { duration: 0.7, ease: EASE_SIGNATURE };
export const T_QUICK: Transition = { duration: 0.45, ease: EASE_SIGNATURE };
export const SPRING_SIGNATURE: Transition = { type: "spring", stiffness: 260, damping: 28 };
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 380, damping: 30 };

/** Reveal estándar al entrar en viewport (fade + subida) con la easing firma. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: T_SIGNATURE },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

/** Item para usar dentro de staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: T_SIGNATURE },
};
