import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_";

interface ScrambleTextProps {
  text: string;
  /** Clase para los "0" de la marca (KAIR0S, PHAR0S, Flak0S) cuando ya están fijados. */
  zeroClass?: string;
  /** Duración total del descifrado en ms. */
  duration?: number;
}

/**
 * Texto que se "descifra" letra a letra al entrar en pantalla y al pasar el
 * ratón por encima (efecto scramble). Con reduce-motion muestra el texto final.
 * Lectores de pantalla: leen siempre el texto real vía aria-label.
 */
export default function ScrambleText({ text, zeroClass, duration = 700 }: ScrambleTextProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Nº de caracteres ya fijados; -1 = aún sin empezar (se ve el texto final).
  const [settled, setSettled] = useState(text.length);
  const [, setTick] = useState(0);
  const frame = useRef(0);

  function play() {
    if (reduce) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setSettled(Math.floor(p * text.length));
      setTick((t) => t + 1);
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  // Primera reproducción al entrar en viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, text]);

  return (
    <span ref={ref} aria-label={text} onMouseEnter={play}>
      <span aria-hidden>
        {[...text].map((ch, i) => {
          const fixed = i < settled || ch === " ";
          const shown = fixed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          const cls = fixed && ch === "0" && zeroClass ? zeroClass : fixed ? undefined : "text-accent/70";
          return (
            <span key={i} className={cls}>
              {shown}
            </span>
          );
        })}
      </span>
    </span>
  );
}
