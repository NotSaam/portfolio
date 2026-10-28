import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { EASE_SIGNATURE, T_QUICK } from "../../lib/motion";

/**
 * Demo: KRIT0S, plataforma de reporting de pentest.
 * Flujo real de la app: registrar un hallazgo → puntuarlo con la calculadora
 * CVSS 3.1 (métrica a métrica) → la severidad sale sola → generar el informe
 * PDF en cola → versión v1 sellada con SHA-256 y publicada al cliente.
 * Autoplay en bucle; fotograma final coherente (informe publicado) si reduce.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 idle  1 explot. 2 C:H   3 I+A:H  4 cola  5 publicado
const DURATIONS = [1200, 1400, 1300, 1700, 1500, 3000] as const;

// Métricas en el orden en que se "pulsan". `at` = paso en que se fija el valor alto.
const METRICS = [
  { k: "AV", opts: ["N", "A", "L", "P"], pick: "N", at: 1 },
  { k: "AC", opts: ["L", "H"], pick: "L", at: 1 },
  { k: "PR", opts: ["N", "L", "H"], pick: "N", at: 1 },
  { k: "UI", opts: ["N", "R"], pick: "N", at: 1 },
  { k: "S", opts: ["U", "C"], pick: "U", at: 0 },
  { k: "C", opts: ["H", "L", "N"], pick: "H", at: 2 },
  { k: "I", opts: ["H", "L", "N"], pick: "H", at: 3 },
  { k: "A", opts: ["H", "L", "N"], pick: "H", at: 3 },
] as const;

// Puntuación real CVSS 3.1 de cada estado (calculada con la spec de FIRST).
const SCORE = [0, 0, 7.5, 9.8, 9.8, 9.8];
const SEVERITY = [
  { label: "Info", color: "#8a8aa0" },
  { label: "Info", color: "#8a8aa0" },
  { label: "Alta", color: "#fb923c" },
  { label: "Crítica", color: "#f43f5e" },
  { label: "Crítica", color: "#f43f5e" },
  { label: "Crítica", color: "#f43f5e" },
];

const FINDINGS = [
  { ref: "F-02", t: "IDOR en extractos", s: "7.1", c: "#fb923c" },
  { ref: "F-03", t: "JWT con secreto débil", s: "7.4", c: "#fb923c" },
  { ref: "F-04", t: "XSS reflejado", s: "6.1", c: "#facc15" },
];

export default function KritosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const queued = step === 4;
  const published = step >= 5;
  const sev = SEVERITY[step];

  const valueFor = (m: (typeof METRICS)[number]) => {
    if (step >= m.at) return m.pick;
    // Antes de fijarse, el vector arranca "sin impacto" (C/I/A:N) y explotabilidad por defecto.
    return m.k === "C" || m.k === "I" || m.k === "A" ? "N" : m.opts[m.opts.length - 1];
  };
  const vector = `CVSS:3.1/${METRICS.map((m) => `${m.k}:${valueFor(m)}`).join("/")}`;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-ink">
              KRIT<span className="font-mono text-teal-neon">0</span>S
            </span>
            <span className="font-mono text-[10px] text-faint">/ KRT-2026-001 / nuevo hallazgo</span>
          </div>
          <span className="rounded-full border border-violet/30 bg-violet/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-violet uppercase">
            pentester
          </span>
        </div>

        <div className="scanlines grid min-h-0 flex-1 grid-cols-[1.45fr_1fr]">
          {/* ── Izquierda: hallazgo + calculadora CVSS ─────────────────── */}
          <div className="flex flex-col gap-3 overflow-hidden border-r border-line p-4">
            <div>
              <p className="hud-label">F-01 · Hallazgo</p>
              <p className="mt-1 font-display text-[15px] font-semibold text-ink">Inyección SQL en buscador de oficinas</p>
              <p className="font-mono text-[10px] text-muted">online.aurora.test/oficinas?q=</p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {METRICS.map((m) => {
                const current = valueFor(m);
                return (
                  <div key={m.k} className="flex items-center gap-1.5">
                    <span className="w-5 font-mono text-[9px] text-faint">{m.k}</span>
                    <div className="flex gap-1">
                      {m.opts.map((o) => {
                        const on = current === o;
                        return (
                          <span
                            key={o}
                            className={`grid h-5 w-5 place-items-center rounded border font-mono text-[9px] transition-colors duration-300 ${
                              on ? "border-teal-neon/60 bg-teal-neon/15 text-teal-neon" : "border-line text-faint"
                            }`}
                          >
                            {o}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto truncate rounded-md border border-line bg-night/70 px-2.5 py-1.5 font-mono text-[9.5px] text-teal-neon/90">
              {vector}
            </div>
          </div>

          {/* ── Derecha: veredicto + informe ──────────────────────────── */}
          <div className="flex flex-col gap-3 p-4">
            <div className="hud-corners flex flex-col items-center rounded-xl border border-line bg-night/50 py-3">
              <span className="hud-label">Puntuación base</span>
              <motion.span
                key={SCORE[step]}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={T_QUICK}
                className="font-display text-4xl font-bold tabular-nums"
                style={{ color: sev.color }}
              >
                {SCORE[step].toFixed(1)}
              </motion.span>
              <span
                className="mt-1 rounded px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider uppercase transition-colors duration-500"
                style={{ background: `${sev.color}26`, color: sev.color }}
              >
                {sev.label}
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="hud-label">KRT-2026-001 · hallazgos</p>
              {FINDINGS.map((f) => (
                <div key={f.ref} className="flex items-center gap-2 text-[10px]">
                  <span className="font-mono text-faint">{f.ref}</span>
                  <span className="flex-1 truncate text-muted">{f.t}</span>
                  <span className="rounded px-1 font-mono text-[9px] font-semibold text-night" style={{ background: f.c }}>
                    {f.s}
                  </span>
                </div>
              ))}
            </div>

            {/* Informe */}
            <motion.div
              animate={queued && !reduce ? { scale: [1, 0.98, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
              className={`mt-auto flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] transition-colors duration-300 ${
                published
                  ? "border-teal-neon/40 bg-teal-neon/10 text-teal-neon"
                  : queued
                    ? "border-violet/40 bg-violet/10 text-violet"
                    : step >= 3
                      ? "border-accent/40 text-ink"
                      : "border-line text-faint"
              }`}
            >
              {queued ? (
                <motion.span
                  className="h-3 w-3 rounded-full border-2 border-violet/30 border-t-violet"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <path d="M14 3v6h6" />
                </svg>
              )}
              <span className="flex-1 font-medium">
                {published ? "Informe v1 · PDF listo" : queued ? "Generando en cola…" : "Generar informe"}
              </span>
              {published && <span className="font-mono text-[9px] text-teal-neon/70">sha256:9f2c…e41a</span>}
            </motion.div>
          </div>
        </div>

        {/* Toast: veredicto publicado al portal del cliente */}
        <AnimatePresence>
          {published && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={T_QUICK}
              className="absolute bottom-3 left-3 w-60 rounded-xl border border-teal-neon/30 bg-night/95 px-3 py-2.5 shadow-xl backdrop-blur"
            >
              <p className="flex items-start gap-2 text-[11px] leading-tight text-ink">
                <span className="pulse-ring mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-neon" />
                <span>
                  <span className="font-medium">Veredicto publicado</span>
                  <span className="block text-[10px] text-muted">Banca Aurora ya puede descargar el informe</span>
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
