import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Escenario de demo RESPONSIVE por escalado.
 *
 * Las demos están diseñadas como ventanas de escritorio a un tamaño NATIVO fijo
 * (680×440). Este contenedor mantiene ese aspect-ratio, ocupa el ancho que le
 * den y ESCALA la demo (transform: scale) para encajar — así se ve idéntica y
 * fiel tanto en el thumbnail de una tarjeta como en el modal, en cualquier
 * pantalla (~320px → desktop) sin romper las columnas internas.
 */
export const NATIVE_W = 680;
export const NATIVE_H = 440;

export default function DemoStage({
  children,
  interactive = true,
  className = "",
}: {
  children: ReactNode;
  /** false = la demo no captura el puntero (preview de tarjeta) */
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") {
      setScale(1);
      return;
    }
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / NATIVE_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${NATIVE_W} / ${NATIVE_H}` }}
    >
      <div
        className={`absolute left-0 top-0 origin-top-left ${interactive ? "" : "pointer-events-none"}`}
        style={{
          width: NATIVE_W,
          height: NATIVE_H,
          transform: `scale(${scale})`,
          // Mientras se mide (scale 0) lo ocultamos para evitar un flash a tamaño completo.
          visibility: scale === 0 ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
