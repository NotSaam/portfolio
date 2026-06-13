import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../data/content";
import { EASE_SIGNATURE } from "../lib/motion";

/**
 * Micro-intro tipo "boot" de terminal con presencia real (~3 s):
 *  - el prompt "$ boot --portfolio" se teclea con efecto typing
 *  - cada línea de estado aparece en secuencia y confirma con "[ ok ]"
 *  - termina con "listo_" + cursor, mantiene un instante y entra al hero
 * Saltable desde CUALQUIER tecla / clic / scroll / toque (transición suave).
 * Se muestra 1 vez por sesión; con prefers-reduced-motion se omite entera.
 * Ritmo configurable en content.ts → site.boot.
 */
const TITLE = "FLAKO//OS · portfolio v2.0";
const PROMPT = "$ boot --portfolio";
const { lines: LINES, charMs, lineMs, holdMs } = site.boot;

const PROMPT_START = 220;
const OK_DELAY = Math.round(lineMs * 0.55);
const PROMPT_DONE = PROMPT_START + PROMPT.length * charMs;
const LINES_DONE = PROMPT_DONE + LINES.length * lineMs;
const TOTAL_MS = LINES_DONE + holdMs; // duración hasta entrar al hero

export default function BootIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    // Pantalla de carga: se muestra en CADA carga/recarga (sin gating de sesión).
    // El estado inicial se calcula antes del primer pintado → sin parpadeo del hero.
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [promptLen, setPromptLen] = useState(0);
  const [shownLines, setShownLines] = useState(0);
  const [shownOks, setShownOks] = useState(0);
  const [showListo, setShowListo] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    if (!visible) return;

    const dismiss = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      setVisible(false);
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    // Tecleo del prompt
    for (let i = 1; i <= PROMPT.length; i++) {
      timers.push(setTimeout(() => setPromptLen(i), PROMPT_START + i * charMs));
    }
    // Líneas de estado en secuencia + su [ ok ]
    LINES.forEach((_, i) => {
      const at = PROMPT_DONE + i * lineMs;
      timers.push(setTimeout(() => setShownLines(i + 1), at));
      timers.push(setTimeout(() => setShownOks(i + 1), at + OK_DELAY));
    });
    // "listo_" y cierre tras la pausa final
    timers.push(setTimeout(() => setShowListo(true), LINES_DONE));
    timers.push(setTimeout(dismiss, TOTAL_MS));

    // Saltar desde cualquier interacción
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="scanlines fixed inset-0 z-[100] flex items-center justify-center bg-night px-6"
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: EASE_SIGNATURE }}
          aria-hidden
        >
          <div className="w-full max-w-md font-mono text-sm">
            <p className="mb-4 font-display text-lg font-bold tracking-tight text-ink">{TITLE}</p>

            {/* Prompt tecleado */}
            <p className="text-teal-neon">
              {PROMPT.slice(0, promptLen)}
              {promptLen < PROMPT.length && <span className="type-cursor">▍</span>}
            </p>

            {/* Líneas de estado secuenciales */}
            <div className="mt-2 min-h-[112px] space-y-1">
              {LINES.slice(0, shownLines).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between text-muted"
                >
                  <span>
                    {line} <span className="text-faint">…</span>
                  </span>
                  {i < shownOks && <span className="text-teal-neon">[ ok ]</span>}
                </motion.p>
              ))}

              {showListo && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1 text-ink">
                  listo<span className="type-cursor text-accent">▍</span>
                </motion.p>
              )}
            </div>

            {/* Barra de progreso */}
            <div className="mt-5 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-blue-neon to-teal-neon"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
              />
            </div>

            {/* Pista de salto — visible y clara */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {}}
                tabIndex={-1}
                className="inline-flex items-center gap-2 rounded-full border border-line-bright bg-panel/70 px-3.5 py-1.5 text-xs text-muted"
              >
                <span className="pulse-ring inline-block h-1.5 w-1.5 rounded-full bg-teal-neon" />
                pulsa, toca o haz scroll para saltar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
