import { useEffect, useRef } from "react";

/**
 * Fondo fijo "sala de control": aurora de blobs + rejilla HUD + un foco de luz
 * que sigue al cursor (vía variables CSS, sin re-renders) + viñeta y ruido.
 * Todo se desactiva con prefers-reduced-motion (animaciones en index.css).
 */
export default function AuroraBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = glowRef.current;
        if (el) {
          el.style.setProperty("--gx", `${e.clientX}px`);
          el.style.setProperty("--gy", `${e.clientY}px`);
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="noise fixed inset-0 -z-10 overflow-hidden bg-night">
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />

      {/* Rejilla HUD con desvanecido superior */}
      <div className="grid-overlay absolute inset-0" />

      {/* Foco de luz que sigue al cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(500px circle at var(--gx, 50%) var(--gy, 0%), rgba(45,212,191,0.10), transparent 65%)",
        }}
      />

      {/* Viñeta para centrar la atención */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,6,10,0.72)_100%)]" />
    </div>
  );
}
