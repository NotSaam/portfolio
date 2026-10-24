import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useAutoSteps } from "./useAutoSteps";
import type { DemoProps } from "./types";
import { EASE_SIGNATURE, SPRING_SNAPPY } from "../../lib/motion";

/**
 * KAIR0S · plataforma multi-club de carga, lesiones y vídeo para fútbol.
 * Réplica del flujo real (kair0s.es): panel de la semana → RPE desde el móvil
 * → sala de etiquetado con seis teclas → mapa de tiros → clips en ZIP por
 * carpetas. Datos de ejemplo. Teal primario. Frame final coherente.
 */

// Paso:        0 semana 1 rpe  2 etiquetado 3 tiros 4 clips(final)
const DURATIONS = [2600, 2400, 3000, 2600, 3000] as const;
const T_SOFT: Transition = { duration: 0.45, ease: EASE_SIGNATURE };

const NAV = [
  { id: "hoy", label: "Hoy", icon: "◉" },
  { id: "carga", label: "Carga", icon: "▤" },
  { id: "video", label: "Vídeo", icon: "▶" },
  { id: "partidos", label: "Partidos", icon: "◔" },
  { id: "jugadores", label: "Jugadores", icon: "☰" },
] as const;

/** Carga diaria del microciclo, % respecto al partido. */
const WEEK = [
  { d: "MD+1", v: 22 },
  { d: "MD-5", v: 48 },
  { d: "MD-4", v: 74 },
  { d: "MD-3", v: 62 },
  { d: "MD-2", v: 41 },
  { d: "MD-1", v: 26 },
  { d: "MD", v: 100 },
] as const;

const WELLNESS = [
  { k: "Sueño", v: 4.2 },
  { k: "Fatiga", v: 2.9 },
  { k: "Estrés", v: 2.1 },
  { k: "Ánimo", v: 4.4 },
] as const;

const KEYS = [
  { k: "1", label: "Banda", c: "#8a8aa0" },
  { k: "2", label: "Puerta", c: "#8a8aa0" },
  { k: "3", label: "Córner", c: "#38bdf8" },
  { k: "4", label: "Falta", c: "#8b5cf6" },
  { k: "5", label: "Tiro", c: "#fbbf24" },
  { k: "6", label: "Gol", c: "#2dd4bf" },
] as const;

/** Marcas que van cayendo en la línea de tiempo (minuto, índice de tecla). */
const MARKS = [
  { min: 8, key: 2 },
  { min: 17, key: 4 },
  { min: 23, key: 5 },
  { min: 31, key: 3 },
  { min: 38, key: 4 },
] as const;

/** Tiros sobre medio campo (x/y en %), g = gol. */
const SHOTS = [
  { x: 50, y: 18, g: true },
  { x: 44, y: 24, g: true },
  { x: 58, y: 26, g: false },
  { x: 36, y: 30, g: false },
  { x: 66, y: 40, g: false },
  { x: 48, y: 52, g: false },
  { x: 30, y: 58, g: false },
] as const;

const FOLDERS = [
  { name: "01_goles", n: 2, c: "#2dd4bf" },
  { name: "02_tiros", n: 5, c: "#fbbf24" },
  { name: "03_corners", n: 4, c: "#38bdf8" },
  { name: "04_faltas", n: 9, c: "#8b5cf6" },
] as const;

export default function KairosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const navActive = step === 0 ? "carga" : step === 1 ? "hoy" : step === 3 ? "partidos" : "video";

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Sidebar */}
        <aside className="hidden w-[130px] shrink-0 flex-col border-r border-line bg-panel-2/70 p-3 sm:flex">
          <p className="font-display text-sm font-bold text-ink">
            KAIR<span className="text-accent">0</span>S
          </p>
          <p className="mb-4 font-mono text-[8px] tracking-widest text-faint uppercase">CD Ejemplo · Staff</p>
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
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 font-mono text-[9px] text-accent">PF</span>
            <span className="font-mono text-[9px] text-faint">preparador</span>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-line bg-night/40 px-4 py-2">
            <span className="hud-label whitespace-nowrap">MC25 · J8</span>
            <span className="font-mono text-[10px] text-muted">vs Club Ejemplo (local)</span>
            <span className="ml-auto rounded-full border border-line-bright px-2 py-0.5 font-mono text-[8px] text-faint uppercase">
              datos de ejemplo
            </span>
          </div>

          <div className="scanlines relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ── 0 · La semana del equipo ───────────────────────────── */}
              {step === 0 && (
                <Panel key="week" reduce={reduce}>
                  <h3 className="mb-2 font-display text-base font-bold text-ink">La semana del equipo</h3>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    <Kpi label="Carga semanal" value="27.330" unit="UA" note="+8 % vs previa" />
                    <Kpi label="Disponibles" value="15" unit="de 18" note="2 lesionados" />
                    <Kpi label="ACWR" value="1,12" unit="EWMA" note="tendencia estable" />
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr] gap-2">
                    <div className="rounded-lg border border-line bg-night/50 p-2.5">
                      <p className="mb-1.5 font-mono text-[9px] text-faint">% respecto al partido</p>
                      <div className="flex h-20 items-end gap-1.5">
                        {WEEK.map((w, i) => (
                          <div key={w.d} className="flex flex-1 flex-col items-center gap-1">
                            <motion.div
                              className={`w-full rounded-sm ${w.d === "MD" ? "bg-accent" : "bg-accent/45"}`}
                              initial={reduce ? false : { height: 0 }}
                              animate={{ height: `${w.v * 0.62}px` }}
                              transition={reduce ? undefined : { delay: i * 0.07, ...T_SOFT }}
                            />
                            <span className="font-mono text-[7px] text-faint">{w.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5 rounded-lg border border-line bg-night/50 p-2.5">
                      <p className="font-mono text-[9px] text-faint">Wellness · 7 días</p>
                      {WELLNESS.map((w, i) => (
                        <div key={w.k} className="flex items-center gap-1.5">
                          <span className="w-9 font-mono text-[8px] text-muted">{w.k}</span>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                            <motion.div
                              className="h-full rounded-full bg-blue-neon"
                              initial={reduce ? false : { width: 0 }}
                              animate={{ width: `${(w.v / 5) * 100}%` }}
                              transition={reduce ? undefined : { delay: 0.2 + i * 0.08, ...T_SOFT }}
                            />
                          </div>
                          <span className="font-mono text-[8px] text-ink">{w.v.toFixed(1).replace(".", ",")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              )}

              {/* ── 1 · RPE desde el móvil ─────────────────────────────── */}
              {step === 1 && (
                <Panel key="rpe" reduce={reduce}>
                  <div className="flex h-full items-center justify-center gap-5">
                    <div className="w-[190px] rounded-[22px] border border-line-bright bg-night/80 p-3 shadow-xl">
                      <p className="font-mono text-[8px] text-faint">MC25 · sesión 99 · MD</p>
                      <p className="mt-1 text-[12px] font-medium text-ink">¿Cuánto te ha costado?</p>
                      <div className="mt-2 grid grid-cols-6 gap-1">
                        {Array.from({ length: 11 }).map((_, n) => (
                          <motion.span
                            key={n}
                            initial={false}
                            animate={n === 8 ? { scale: [1, 1.18, 1] } : {}}
                            transition={reduce ? undefined : { delay: 0.6, ...SPRING_SNAPPY }}
                            className={`grid h-6 place-items-center rounded-md font-mono text-[10px] ${
                              n === 8 ? "bg-accent text-night font-bold" : "border border-line text-muted"
                            }`}
                          >
                            {n}
                          </motion.span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-muted">8 · Entre muy duro y casi máximo</p>
                    </div>
                    <motion.div
                      initial={reduce ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={reduce ? undefined : { delay: 0.9, ...T_SOFT }}
                      className="max-w-[170px] space-y-2"
                    >
                      <p className="hud-label">carga calculada</p>
                      <p className="font-mono text-[11px] text-muted">
                        RPE <span className="text-ink">8</span> × <span className="text-ink">94</span> min efectivos
                      </p>
                      <p className="font-display text-3xl font-bold text-accent">752 UA</p>
                      <p className="text-[10px] leading-snug text-faint">Los minutos salen del GPS; el jugador solo marca su esfuerzo.</p>
                    </motion.div>
                  </div>
                </Panel>
              )}

              {/* ── 2 · Sala de etiquetado ─────────────────────────────── */}
              {step === 2 && (
                <Panel key="tag" reduce={reduce}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-ink">Sala de etiquetado</h3>
                    <span className="font-mono text-[10px] text-muted">vídeo local · sin subir</span>
                  </div>
                  <div className="relative mb-2 h-[92px] overflow-hidden rounded-lg border border-line bg-[linear-gradient(180deg,#0f3d2e,#0a2a20)]">
                    <div className="absolute inset-x-6 inset-y-3 rounded-sm border border-white/15" />
                    <div className="absolute inset-y-3 left-1/2 w-px bg-white/15" />
                    <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
                    <span className="absolute top-2 left-2 rounded bg-night/70 px-1.5 py-0.5 font-mono text-[9px] text-ink">1.ª parte · 23'</span>
                    <motion.span
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={reduce ? undefined : { delay: 1.3, ...SPRING_SNAPPY }}
                      className="absolute top-2 right-2 rounded-md border border-accent/50 bg-night/80 px-2 py-1 font-mono text-[9px] text-accent"
                    >
                      Gol · 23' · Nuestro · 8 Interior dcho.
                    </motion.span>
                  </div>
                  <div className="mb-2.5 grid grid-cols-6 gap-1.5">
                    {KEYS.map((k, i) => (
                      <motion.div
                        key={k.k}
                        animate={
                          reduce || i !== 5
                            ? {}
                            : { y: [0, 2, 0], borderColor: ["#1c1c2b", k.c, k.c] }
                        }
                        transition={reduce ? undefined : { delay: 1.1, duration: 0.35 }}
                        className="rounded-md border border-line bg-night/60 py-1 text-center"
                      >
                        <p className="font-mono text-[11px] font-bold" style={{ color: k.c }}>{k.k}</p>
                        <p className="font-mono text-[8px] text-muted">{k.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="relative h-6 rounded-md border border-line bg-night/50">
                    {MARKS.map((m, i) => (
                      <motion.span
                        key={m.min}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={reduce ? undefined : { delay: 0.2 + i * 0.35, ...SPRING_SNAPPY }}
                        className="absolute top-1 h-4 w-1 rounded-full"
                        style={{ left: `${(m.min / 45) * 96 + 1}%`, background: KEYS[m.key].c }}
                      />
                    ))}
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[8px] text-faint">45'</span>
                  </div>
                </Panel>
              )}

              {/* ── 3 · Mapa de tiros ──────────────────────────────────── */}
              {step === 3 && (
                <Panel key="shots" reduce={reduce}>
                  <div className="flex h-full gap-4">
                    <div className="relative h-full flex-1 overflow-hidden rounded-lg border border-line bg-[linear-gradient(180deg,#0f3d2e,#0a2a20)]">
                      <div className="absolute inset-x-[22%] top-0 h-[34%] border-x border-b border-white/15" />
                      <div className="absolute inset-x-[38%] top-0 h-[14%] border-x border-b border-white/15" />
                      <div className="absolute inset-x-3 bottom-0 h-px bg-white/15" />
                      {SHOTS.map((s, i) => (
                        <motion.span
                          key={i}
                          initial={reduce ? false : { opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={reduce ? undefined : { delay: i * 0.12, ...SPRING_SNAPPY }}
                          className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                            s.g ? "bg-accent shadow-[0_0_10px_rgba(45,212,191,0.9)]" : "border border-amber-300/80 bg-amber-300/20"
                          }`}
                          style={{ left: `${s.x}%`, top: `${s.y}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex w-[150px] shrink-0 flex-col justify-center gap-2">
                      <p className="hud-label">informe del partido</p>
                      <p className="font-display text-2xl font-bold text-ink">7 tiros</p>
                      <p className="font-mono text-[11px] text-accent">2 goles</p>
                      <p className="text-[10px] leading-snug text-muted">4 desde dentro del área</p>
                      <p className="font-mono text-[10px] text-faint">2 claras · 3 medias · 2 lejanas</p>
                    </div>
                  </div>
                </Panel>
              )}

              {/* ── 4 · Clips en ZIP (final) ───────────────────────────── */}
              {step === 4 && (
                <Panel key="clips" reduce={reduce}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-base font-bold text-ink">Clips del partido</h3>
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] text-accent">ffmpeg · listo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {FOLDERS.map((f, i) => (
                      <motion.div
                        key={f.name}
                        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={reduce ? undefined : { delay: i * 0.1, ...SPRING_SNAPPY }}
                        className="flex items-center gap-2.5 rounded-lg border border-line bg-night/60 px-3 py-2.5"
                      >
                        <span className="grid h-7 w-8 place-items-center rounded-md font-mono text-[11px]" style={{ background: `${f.c}22`, color: f.c }}>
                          ▣
                        </span>
                        <div>
                          <p className="font-mono text-[10px] text-ink">{f.name}/</p>
                          <p className="font-mono text-[9px] text-faint">{f.n} clips</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                    J8_clips.zip · el vídeo se borra al terminar
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

function Kpi({ label, value, unit, note }: { label: string; value: string; unit: string; note: string }) {
  return (
    <div className="rounded-lg border border-line bg-night/50 px-2.5 py-2">
      <p className="font-mono text-[8px] tracking-wider text-faint uppercase">{label}</p>
      <p className="mt-0.5 font-display text-lg leading-tight font-bold text-ink">
        {value} <span className="font-mono text-[9px] font-normal text-muted">{unit}</span>
      </p>
      <p className="font-mono text-[8px] text-accent">{note}</p>
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
