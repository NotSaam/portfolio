import type { DemoProps } from "./types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAutoSteps } from "./useAutoSteps";
import { EASE_SIGNATURE, T_QUICK, SPRING_SNAPPY } from "../../lib/motion";

/**
 * Demo animada de flkOS — mi SO de escritorio: escritorio FLK sobre Wayland,
 * servicios propios en Rust (flkd, flk-update, flk-snapshots) y apps propias.
 *
 * Recorrido: ARRANQUE (wordmark + servicios [ ok ]) → ESCRITORIO (panel + dock)
 * → AJUSTES (tema por tokens) → ACTUALIZACIÓN con snapshot previo → final con
 * el rollback disponible. Autoplay en bucle; el último paso es un fotograma
 * final coherente (reduce-motion lo congela ahí).
 *
 * Contrato común: export default FlakosDemo({ playing }: DemoProps), usa
 * useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing }).
 */

// Paso:        0 boot 1 escritorio 2 ajustes 3 update 4 snapshots(final)
const DURATIONS = [2600, 1800, 2600, 2600, 3200] as const;

const BOOT = [
  "btrfs · montando @root @home",
  "flkd · broker D-Bus + Polkit",
  "flk-snapshots · listo",
  "flk-desktop · sesión Wayland",
] as const;

const DOCK = [
  { id: "files", glyph: "▤", label: "Archivos" },
  { id: "term", glyph: ">_", label: "Terminal" },
  { id: "settings", glyph: "⚙", label: "Ajustes" },
  { id: "web", glyph: "◎", label: "Web" },
] as const;

const ACCENTS = ["#8b5cf6", "#2dd4bf", "#38bdf8", "#f472b6"] as const;

const SNAPSHOTS = [
  { id: "#42", when: "ahora", note: "antes de actualizar · 38 paquetes", current: true },
  { id: "#41", when: "ayer", note: "automático diario", current: false },
  { id: "#40", when: "hace 3 días", note: "antes de instalar flk-files", current: false },
] as const;

const EASE = { duration: 0.45, ease: EASE_SIGNATURE };

export default function FlakosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const booted = step >= 1;
  const dockActive = step === 2 ? "settings" : step >= 3 ? "term" : null;

  return (
    <div className="flex h-full w-full items-center justify-center p-4 font-sans">
      <div className="relative h-full max-h-[440px] w-full max-w-[660px] overflow-hidden rounded-2xl border border-line bg-night shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        <AnimatePresence mode="wait">
          {!booted ? (
            /* ── 0 · Arranque ─────────────────────────────────────────── */
            <motion.div
              key="boot"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.03 }}
              transition={EASE}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_65%)]"
            >
              <p className="font-display text-4xl font-bold tracking-tight text-ink">
                flk<span className="text-violet">OS</span>
              </p>
              <div className="h-0.5 w-40 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full bg-violet"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: "100%" }}
                  transition={reduce ? undefined : { duration: 2.2, ease: "easeInOut" }}
                />
              </div>
              <ul className="space-y-1 font-mono text-[10px]">
                {BOOT.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={reduce ? undefined : { delay: 0.3 + i * 0.4 }}
                    className="flex gap-2 text-muted"
                  >
                    <span className="text-violet">[ ok ]</span> {line}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : (
            /* ── 1-4 · Escritorio FLK ─────────────────────────────────── */
            <motion.div
              key="desktop"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={EASE}
              className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(139,92,246,0.35),transparent_55%),radial-gradient(90%_80%_at_0%_100%,rgba(45,212,191,0.16),transparent_60%)]"
            >
              {/* Panel superior */}
              <div className="flex h-7 items-center justify-between border-b border-white/5 bg-night/60 px-3 font-mono text-[10px] text-muted backdrop-blur">
                <span className="font-display font-bold text-ink">
                  flk<span className="text-violet">OS</span>
                </span>
                <span className="text-ink">sáb 24 oct · 18:42</span>
                <span className="flex items-center gap-2">
                  <span>wifi</span>
                  <span>vol</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                </span>
              </div>

              <div className="relative h-[calc(100%-28px)]">
                <AnimatePresence>
                  {step === 2 && <SettingsWindow key="settings" reduce={reduce} />}
                  {step >= 3 && <SnapshotsWindow key="snap" reduce={reduce} final={step === 4} />}
                </AnimatePresence>

                {/* Notificación de flk-update */}
                <AnimatePresence>
                  {step === 3 && (
                    <motion.div
                      key="toast"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: 16 }}
                      transition={T_QUICK}
                      className="absolute top-3 right-3 w-52 rounded-xl border border-violet/40 bg-night/90 px-3 py-2.5 shadow-xl backdrop-blur"
                    >
                      <p className="font-mono text-[9px] text-violet">flk-update</p>
                      <p className="text-[11px] leading-tight text-ink">Actualización lista</p>
                      <p className="text-[10px] text-muted">snapshot #42 creado antes de aplicar</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dock */}
                <motion.div
                  initial={reduce ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reduce ? undefined : { delay: 0.15, ...SPRING_SNAPPY }}
                  className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl border border-white/10 bg-night/70 px-2.5 py-2 backdrop-blur"
                >
                  {DOCK.map((d) => (
                    <div key={d.id} className="flex flex-col items-center gap-1">
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-xl font-mono text-[11px] transition-colors ${
                          dockActive === d.id ? "bg-violet/30 text-ink" : "bg-panel-2 text-muted"
                        }`}
                      >
                        {d.glyph}
                      </span>
                      <span className={`h-1 w-1 rounded-full ${dockActive === d.id ? "bg-violet" : "bg-transparent"}`} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Window({
  title,
  reduce,
  children,
  className = "",
}: {
  title: string;
  reduce: boolean | null;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      transition={SPRING_SNAPPY}
      className={`absolute overflow-hidden rounded-xl border border-white/10 bg-panel/95 shadow-2xl backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-line-bright" />
        <span className="h-2 w-2 rounded-full bg-line-bright" />
        <span className="h-2 w-2 rounded-full bg-violet" />
        <span className="ml-2 font-mono text-[10px] text-muted">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

function SettingsWindow({ reduce }: { reduce: boolean | null }) {
  return (
    <Window title="flk-settings · Apariencia" reduce={reduce} className="top-6 left-[12%] w-[58%]">
      <div className="flex">
        <ul className="w-24 space-y-1 border-r border-line p-2 font-mono text-[9px] text-muted">
          <li className="rounded bg-violet/20 px-1.5 py-1 text-ink">Apariencia</li>
          <li className="px-1.5 py-1">Pantalla</li>
          <li className="px-1.5 py-1">Energía</li>
          <li className="px-1.5 py-1">Sistema</li>
        </ul>
        <div className="flex-1 space-y-3 p-3">
          <div>
            <p className="mb-1.5 font-mono text-[9px] text-faint">Color de acento</p>
            <div className="flex gap-2">
              {ACCENTS.map((c, i) => (
                <motion.span
                  key={c}
                  initial={false}
                  animate={i === 0 ? { scale: [1, 1.2, 1] } : {}}
                  transition={reduce ? undefined : { delay: 0.7, ...SPRING_SNAPPY }}
                  className={`h-5 w-5 rounded-full ${i === 0 ? "ring-2 ring-white/70 ring-offset-2 ring-offset-panel" : ""}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-line px-2.5 py-1.5">
            <span className="text-[10px] text-ink">Animaciones reducidas</span>
            <span className="h-3.5 w-6 rounded-full bg-line p-0.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-muted" />
            </span>
          </div>
          <p className="font-mono text-[9px] text-faint">tema generado desde tokens · GTK + Shell</p>
        </div>
      </div>
    </Window>
  );
}

function SnapshotsWindow({ reduce, final }: { reduce: boolean | null; final: boolean }) {
  return (
    <Window title="flk-snapshots" reduce={reduce} className="top-6 left-[8%] w-[62%]">
      <div className="space-y-1.5 p-3">
        {SNAPSHOTS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduce ? undefined : { delay: i * 0.12, ...T_QUICK }}
            className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 ${
              s.current ? "border-violet/50 bg-violet/10" : "border-line bg-night/40"
            }`}
          >
            <span className="font-mono text-[10px] text-violet">{s.id}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] text-ink">{s.note}</p>
              <p className="font-mono text-[8px] text-faint">{s.when}</p>
            </div>
            <span className="rounded-md border border-line-bright px-1.5 py-0.5 font-mono text-[8px] text-muted">revertir</span>
          </motion.div>
        ))}
        <AnimatePresence>
          {final && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={T_QUICK}
              className="flex items-center gap-2 rounded-lg border border-violet/40 bg-violet/10 px-2.5 py-1.5 font-mono text-[10px] text-ink"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-violet"><path d="M5 13l4 4L19 7" /></svg>
              Sistema actualizado · rollback a un clic
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Window>
  );
}
