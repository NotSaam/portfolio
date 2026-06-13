import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "../data/content";
import { demoRegistry } from "./demos/registry";
import DemoStage from "./demos/DemoStage";
import { EASE_SIGNATURE, SPRING_SIGNATURE } from "../lib/motion";

interface DemoModalProps {
  /** Proyecto cuya demo se muestra; null = cerrado */
  project: Project | null;
  onClose: () => void;
}

/**
 * Visor de demos interactivas: marco de producto con la animación dentro
 * (estilo clip de LinkedIn pero nativo e interactivo). Se reproduce sola; botón
 * de reinicio (remonta), cierre con Esc / clic fuera, foco atrapado en cerrar.
 */
export default function DemoModal({ project, onClose }: DemoModalProps) {
  const reduce = useReducedMotion();
  const [runKey, setRunKey] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = Boolean(project?.demo);

  // Esc para cerrar + bloquear scroll del fondo + foco en cerrar al abrir.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const Demo = project?.demo ? demoRegistry[project.demo] : null;
  const hasRepo = Boolean(project?.repo && project.repo !== "#");
  const hasLink = Boolean(project?.link && project.link !== "#");

  return (
    <AnimatePresence>
      {open && project && Demo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            padding:
              "max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Demo de ${project.title}`}
        >
          {/* Fondo */}
          <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={SPRING_SIGNATURE}
            className="relative z-10 flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between gap-4 border-b border-line/70 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </span>
                <div className="ml-1 leading-tight">
                  <p className="hud-label text-accent">{project.kind}</p>
                  <p className="font-display text-sm font-semibold text-ink">{project.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRunKey((k) => k + 1)}
                  aria-label="Reiniciar demo"
                  className="grid h-11 w-11 place-items-center rounded-lg text-muted transition-colors hover:bg-line-bright/50 hover:text-ink focus-visible:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar demo"
                  className="grid h-11 w-11 place-items-center rounded-lg text-muted transition-colors hover:bg-line-bright/50 hover:text-ink focus-visible:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Escenario de la demo — escala responsive (DemoStage) */}
            <div className="w-full bg-night/40">
              <Suspense
                fallback={
                  <div className="grid aspect-[680/440] w-full place-items-center">
                    <div className="flex flex-col items-center gap-3 font-mono text-xs text-muted">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line-bright border-t-accent" />
                      cargando demo…
                    </div>
                  </div>
                }
              >
                <DemoStage interactive>
                  <Demo key={runKey} playing />
                </DemoStage>
              </Suspense>
            </div>

            {/* Pie */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-5 py-3">
              <p className="font-mono text-[11px] text-muted">
                ▶ demo interactiva · se reproduce sola
              </p>
              <div className="flex items-center gap-2">
                {hasRepo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
                  >
                    código
                  </a>
                )}
                {hasLink && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-[11px] text-ink transition-colors hover:bg-accent/20"
                  >
                    abrir →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
