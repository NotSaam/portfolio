import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useAutoSteps } from "./useAutoSteps";
import type { DemoProps } from "./types";
import { EASE_SIGNATURE, SPRING_SNAPPY } from "../../lib/motion";

/**
 * KAIR0S · análisis de vídeo de fútbol con IA. Réplica fiel del dashboard real
 * (sidebar "Mis Vídeos", progreso de etiquetado, lista de partidos con
 * "N eventos · M pendientes"). Narrativa: subir partido → detección IA →
 * eventos con confianza → clips. Teal primario. Frame final coherente.
 */

// Paso:        0 dash  1 subir 2 análisis 3 eventos 4 clips(final)
const DURATIONS = [2200, 2200, 2400, 2700, 3000] as const;
const T_SOFT: Transition = { duration: 0.45, ease: EASE_SIGNATURE };

const NAV = [
  { id: "videos", label: "Mis Vídeos", icon: "▶" },
  { id: "upload", label: "Subir Vídeo", icon: "↑" },
  { id: "review", label: "Revisión", icon: "◔" },
  { id: "billing", label: "Facturación", icon: "▤" },
] as const;

const VIDEOS = [
  { title: "PORTUGAL vs ARGENTINA · Full Match", meta: "1.4 GB · 17/5/2026", ev: 117, pend: 80 },
  { title: "Crystal Palace v Man City · FA Cup Final", meta: "2.7 GB · 16/5/2026", ev: 107, pend: 73 },
  { title: "Best Goals of the Year 2026.mp4", meta: "1.1 GB · 17/5/2026", ev: 14, pend: 10 },
] as const;

const EVENTS = [
  { t: "23:14", type: "Gol", conf: 0.94, c: "#2dd4bf" },
  { t: "41:02", type: "Córner", conf: 0.88, c: "#38bdf8" },
  { t: "67:39", type: "Falta", conf: 0.79, c: "#8b5cf6" },
  { t: "88:10", type: "Saque", conf: 0.71, c: "#fbbf24" },
] as const;

export default function KairosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const navActive = step === 1 ? "upload" : step === 4 ? "review" : "videos";

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Sidebar */}
        <aside className="hidden w-[130px] shrink-0 flex-col border-r border-line bg-panel-2/70 p-3 sm:flex">
          <p className="font-display text-sm font-bold text-ink">
            KAIR<span className="text-accent">0</span>S
          </p>
          <p className="mb-4 font-mono text-[8px] tracking-widest text-faint uppercase">Administración</p>
          <nav className="space-y-1">
            {NAV.map((n) => {
              const active = n.id === navActive;
              return (
                <div
                  key={n.id}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[10px] transition-colors ${
                    active ? "bg-accent/15 text-accent" : "text-muted"
                  }`}
                >
                  <span>{n.icon}</span> {n.label}
                </div>
              );
            })}
          </nav>
          <div className="mt-auto flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 font-mono text-[9px] text-accent">N</span>
            <span className="font-mono text-[9px] text-faint">admin · Free</span>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Barra progreso de etiquetado */}
          <div className="flex shrink-0 items-center gap-3 border-b border-line bg-night/40 px-4 py-2">
            <span className="hud-label whitespace-nowrap">Etiquetado</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: "42%" }} />
            </div>
            <span className="font-mono text-[10px] text-muted">3.644/8.770 · 42%</span>
          </div>

          <div className="scanlines relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ── 0/1 · Mis Vídeos (+ subida) ───────────────────────── */}
              {(step === 0 || step === 1) && (
                <Panel key="videos" reduce={reduce}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-ink">Mis Vídeos</h3>
                      <p className="text-[10px] text-faint">65 partidos analizados</p>
                    </div>
                    <span className="rounded-md bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold text-night">↑ Subir Vídeo</span>
                  </div>
                  <div className="space-y-1.5">
                    {step === 1 && (
                      <motion.div
                        initial={reduce ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate text-[11px] text-ink">PORTUGAL_vs_ARGENTINA.mp4</span>
                          <span className="font-mono text-[9px] text-accent">subiendo 100%</span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                          <motion.div
                            className="h-full bg-accent"
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: "100%" }}
                            transition={reduce ? undefined : { duration: 1.4, ease: "linear" }}
                          />
                        </div>
                      </motion.div>
                    )}
                    {VIDEOS.map((v) => (
                      <VideoRow key={v.title} v={v} />
                    ))}
                  </div>
                </Panel>
              )}

              {/* ── 2 · Análisis IA ───────────────────────────────────── */}
              {step === 2 && (
                <Panel key="analysis" reduce={reduce}>
                  <h3 className="mb-1 font-display text-base font-bold text-ink">PORTUGAL vs ARGENTINA</h3>
                  <p className="mb-3 font-mono text-[10px] text-accent">Detectando eventos…</p>
                  {/* Filmstrip con cabezal */}
                  <div className="relative flex h-14 gap-0.5 overflow-hidden rounded-md border border-line bg-night/60 p-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="h-full flex-1 rounded-sm bg-gradient-to-b from-line-bright to-line" />
                    ))}
                    {!reduce && (
                      <motion.div
                        className="absolute inset-y-1 w-0.5 bg-accent shadow-[0_0_10px_rgba(45,212,191,0.8)]"
                        initial={{ left: "4%" }}
                        animate={{ left: "96%" }}
                        transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-line-bright border-t-accent" />
                    Inferencia · modelo MobileNetV3-Small · ONNX
                  </div>
                  <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                    {EVENTS.map((e, i) => (
                      <motion.div
                        key={e.type}
                        initial={reduce ? false : { opacity: 0.2 }}
                        animate={{ opacity: [0.2, 1, 0.4] }}
                        transition={reduce ? undefined : { delay: i * 0.2, duration: 1, repeat: Infinity }}
                        className="rounded border border-line py-1 text-center font-mono text-[9px]"
                        style={{ color: e.c }}
                      >
                        {e.type}
                      </motion.div>
                    ))}
                  </div>
                </Panel>
              )}

              {/* ── 3 · Eventos detectados ────────────────────────────── */}
              {step === 3 && (
                <Panel key="events" reduce={reduce}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-ink">Eventos detectados</h3>
                    <span className="font-mono text-[10px] text-muted">117 eventos · 80 pendientes</span>
                  </div>
                  <div className="space-y-1.5">
                    {EVENTS.map((e, i) => (
                      <motion.div
                        key={e.type}
                        initial={reduce ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={reduce ? undefined : { delay: i * 0.16, ...T_SOFT }}
                        className="flex items-center gap-2.5 rounded-lg border border-line bg-night/50 px-3 py-2"
                      >
                        <span className="font-mono text-[10px] text-faint">{e.t}</span>
                        <span className="w-12 font-mono text-[10px]" style={{ color: e.c }}>{e.type}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: e.c }}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${e.conf * 100}%` }}
                            transition={reduce ? undefined : { delay: i * 0.16 + 0.1, ...T_SOFT }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-ink">{e.conf.toFixed(2)}</span>
                      </motion.div>
                    ))}
                  </div>
                </Panel>
              )}

              {/* ── 4 · Clips / Revisión (final) ──────────────────────── */}
              {step === 4 && (
                <Panel key="clips" reduce={reduce}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-ink">Clips generados</h3>
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] text-accent">Completado</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {EVENTS.map((e, i) => (
                      <motion.div
                        key={e.type}
                        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={reduce ? undefined : { delay: i * 0.1, ...SPRING_SNAPPY }}
                        className="overflow-hidden rounded-lg border border-line bg-night/60"
                      >
                        <div className="h-10 bg-gradient-to-br from-line-bright to-line" style={{ borderBottom: `2px solid ${e.c}` }} />
                        <div className="px-2 py-1">
                          <p className="font-mono text-[9px]" style={{ color: e.c }}>{e.type}</p>
                          <p className="font-mono text-[8px] text-faint">0:08 · {e.t}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                    117 clips listos · exportar dataset de entrenamiento
                  </div>
                </Panel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoRow({ v }: { v: (typeof VIDEOS)[number] }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-night/40 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-[11px] text-ink">{v.title}</p>
        <p className="font-mono text-[9px] text-faint">{v.meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-[9px] text-muted">
          <span className="text-ink">{v.ev}</span> ev · <span className="text-ink">{v.pend}</span> pend
        </span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[8px] text-accent">Completado</span>
      </div>
    </div>
  );
}

function Panel({ children, reduce }: { children: React.ReactNode; reduce: boolean | null }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={T_SOFT}
      className="absolute inset-0 p-4"
    >
      {children}
    </motion.div>
  );
}
