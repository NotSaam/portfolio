import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/**
 * Controla CUÁNDO se anima la preview en vivo de una tarjeta.
 *
 * - Monta la demo (lazy chunk) la PRIMERA vez que la tarjeta se acerca a pantalla
 *   y la mantiene montada (perf: el chunk no entra en el bundle inicial).
 * - `playing` decide si la animación avanza:
 *     featured  → autoplay mientras esté en viewport
 *     resto     → al hover (desktop) o mientras esté en viewport (táctil)
 *     siempre   → pausa fuera de pantalla y nunca "juega" con reduce-motion.
 */
export function usePreviewPlayback(featured: boolean): {
  ref: RefObject<HTMLDivElement | null>;
  mounted: boolean;
  playing: boolean;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Coarse pointer (táctil) y reduce-motion: se leen una vez y se vigilan.
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const hoverMq = window.matchMedia("(hover: none)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncHover = () => setCoarsePointer(hoverMq.matches);
    const syncMotion = () => setReducedMotion(motionMq.matches);
    syncHover();
    syncMotion();

    hoverMq.addEventListener("change", syncHover);
    motionMq.addEventListener("change", syncMotion);
    return () => {
      hoverMq.removeEventListener("change", syncHover);
      motionMq.removeEventListener("change", syncMotion);
    };
  }, []);

  // IntersectionObserver: rastrea inView y monta una sola vez al entrar.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) setMounted(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listeners de puntero para el hover (desktop). En táctil no aplican.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mounted]);

  const playing =
    mounted &&
    inView &&
    !reducedMotion &&
    (featured || hovered || coarsePointer);

  return { ref, mounted, playing };
}
