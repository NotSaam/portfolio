import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { SPRING_SIGNATURE, T_QUICK } from "../../lib/motion";

/**
 * Demo: SYNK0S, kanban colaborativo en tiempo real.
 * Dos personas en el mismo tablero: Guille arrastra una tarjeta de "En curso"
 * a "Hecho", Flako la etiqueta como urgente mientras la edita y añade una
 * tarjeta nueva. Todo se refleja con cursores en vivo y feed de actividad.
 * Fotograma final coherente (todo sincronizado) si reduce-motion.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 idle  1 agarra  2 suelta  3 etiqueta  4 nueva  5 sync
const DURATIONS = [1100, 1200, 1500, 1600, 1800, 3000] as const;

const TEAL = "#2dd4bf";
const VIOLET = "#8b5cf6";

type Label = "feature" | "bug" | "urgente";
const LABEL_COLOR: Record<Label, string> = { feature: TEAL, bug: "#f43f5e", urgente: "#facc15" };

interface Card {
  id: string;
  title: string;
  label?: Label;
  by: string;
}

const COLS = ["Por hacer", "En curso", "Hecho"] as const;

function board(step: number): Card[][] {
  const todo: Card[] = [
    { id: "db", title: "Esquema de la base de datos", label: "feature", by: "Flako" },
    { id: "a11y", title: "Revisar accesibilidad", by: "Guille" },
  ];
  const doing: Card[] = [
    { id: "auth", title: "Endpoint de auth", label: "bug", by: "Flako" },
    { id: "cur", title: "Cursores en vivo", label: step >= 3 ? "urgente" : "feature", by: "Guille" },
  ];
  const done: Card[] = [{ id: "ci", title: "CI con GitHub Actions", by: "Guille" }];

  if (step >= 2) {
    const [auth] = doing.splice(0, 1);
    done.unshift(auth);
  }
  if (step >= 4) todo.push({ id: "deploy", title: "Desplegar demo", by: "Flako" });
  return [todo, doing, done];
}

const ACTIVITY = [
  { at: 2, who: "Guille", c: VIOLET, msg: "movió «Endpoint de auth» a Hecho" },
  { at: 3, who: "Flako", c: TEAL, msg: "etiquetó «Cursores en vivo» como urgente" },
  { at: 4, who: "Flako", c: TEAL, msg: "añadió «Desplegar demo»" },
];

// Posiciones de cursor por paso (coordenadas del área del tablero, bajo la barra superior)
const GUILLE = [
  { x: 420, y: 300 },
  { x: 236, y: 82 },
  { x: 398, y: 86 },
  { x: 380, y: 230 },
  { x: 360, y: 270 },
  { x: 350, y: 280 },
];
const FLAKO = [
  { x: 100, y: 300 },
  { x: 110, y: 270 },
  { x: 140, y: 240 },
  { x: 200, y: 66 },
  { x: 96, y: 206 },
  { x: 104, y: 214 },
];

function Cursor({ name, color, x, y, reduce }: { name: string; color: string; x: number; y: number; reduce: boolean | null }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-20"
      initial={false}
      animate={{ x, y }}
      transition={reduce ? { duration: 0 } : { duration: 0.75, ease: [0.45, 0, 0.2, 1] }}
    >
      <svg width="14" height="16" viewBox="0 0 16 18">
        <path d="M1 1l5.5 15 2.2-6.3L15 7.5z" fill={color} stroke="#06060a" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span
        className="ml-2.5 -mt-0.5 inline-block rounded px-1.5 py-px font-mono text-[9px] font-bold text-night"
        style={{ background: color }}
      >
        {name}
      </span>
    </motion.div>
  );
}

export default function SynkosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const cols = board(step);
  const grabbing = step === 1;
  const editingCur = step === 3;
  const synced = step >= 5;
  const activity = ACTIVITY.filter((a) => step >= a.at).reverse();

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-ink">
              SYNK<span className="font-mono text-teal-neon">0</span>S
            </span>
            <span className="font-mono text-[10px] text-faint">/ Sprint 14</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted">
              <span className="pulse-ring inline-block h-1.5 w-1.5 rounded-full bg-teal-neon" />
              en línea
            </span>
            <div className="flex -space-x-1.5">
              {[
                ["F", TEAL],
                ["G", VIOLET],
              ].map(([l, c]) => (
                <span
                  key={l}
                  className="grid h-5 w-5 place-items-center rounded-full font-mono text-[9px] font-bold text-night ring-2 ring-panel-2"
                  style={{ background: c }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="scanlines relative grid min-h-0 flex-1 grid-cols-[1fr_168px]">
          {/* ── Tablero ─────────────────────────────────────────── */}
          <LayoutGroup>
            <div className="grid grid-cols-3 gap-2 overflow-hidden p-3">
              {COLS.map((title, ci) => (
                <div key={title} className="flex min-w-0 flex-col rounded-xl border border-line bg-panel-2/60">
                  <div className="flex items-center justify-between px-2.5 pb-1.5 pt-2.5">
                    <span className="flex items-center gap-1.5 font-mono text-[9px] font-medium tracking-[0.14em] text-ink uppercase">
                      <span className="h-1 w-1 rounded-full bg-teal-neon" />
                      {title}
                    </span>
                    <span className="rounded bg-night/70 px-1 font-mono text-[8px] text-muted">{cols[ci].length}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-1.5 pb-2">
                    <AnimatePresence initial={false}>
                      {cols[ci].map((card) => {
                        const lifted = grabbing && card.id === "auth";
                        const edited = editingCur && card.id === "cur";
                        return (
                          <motion.div
                            key={card.id}
                            layout={!reduce}
                            layoutId={reduce ? undefined : card.id}
                            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: lifted ? 1.04 : 1, rotate: lifted ? 1.5 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={SPRING_SIGNATURE}
                            className="rounded-lg border bg-night/70 px-2 py-1.5"
                            style={{
                              borderColor: lifted ? VIOLET : edited ? TEAL : "var(--color-line)",
                              boxShadow: lifted
                                ? "0 10px 24px -8px rgba(0,0,0,0.8)"
                                : edited
                                  ? `0 0 0 1px ${TEAL}55`
                                  : undefined,
                            }}
                          >
                            {card.label && (
                              <span
                                className="mb-1 inline-flex items-center gap-1 rounded px-1 font-mono text-[7.5px] font-semibold tracking-wider uppercase transition-colors duration-500"
                                style={{ color: LABEL_COLOR[card.label], background: `${LABEL_COLOR[card.label]}1f` }}
                              >
                                <span className="h-1 w-1 rounded-full" style={{ background: LABEL_COLOR[card.label] }} />
                                {card.label}
                              </span>
                            )}
                            <p className="text-[10px] leading-snug text-ink">{card.title}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="font-mono text-[7.5px] text-faint">{card.by}</span>
                              {edited && (
                                <span className="flex items-center gap-1 font-mono text-[7.5px] text-teal-neon">
                                  <span className="h-1 w-1 rounded-full bg-teal-neon" />
                                  Flako edita
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </LayoutGroup>

          {/* ── Actividad ───────────────────────────────────────── */}
          <div className="flex flex-col border-l border-line bg-panel-2/40">
            <p className="hud-label border-b border-line px-3 py-2">Actividad</p>
            <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2.5">
              <AnimatePresence initial={false}>
                {activity.map((a) => (
                  <motion.div
                    key={a.msg}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={T_QUICK}
                    className="flex gap-1.5 text-[9px] leading-snug"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background: a.c }} />
                    <p className="text-muted">
                      <span className="font-medium" style={{ color: a.c }}>
                        {a.who}
                      </span>{" "}
                      {a.msg}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {activity.length === 0 && <p className="text-[9px] text-faint">Esperando cambios…</p>}
            </div>
            <div className="border-t border-line px-3 py-2 font-mono text-[8.5px] text-faint">
              websocket · 2 clientes
            </div>
          </div>

          {/* Cursores en vivo */}
          <Cursor name="Guille" color={VIOLET} reduce={reduce} {...GUILLE[step]} />
          <Cursor name="Flako" color={TEAL} reduce={reduce} {...FLAKO[step]} />
        </div>

        {/* Toast: todo sincronizado */}
        <AnimatePresence>
          {synced && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={T_QUICK}
              className="absolute bottom-3 left-3 rounded-xl border border-teal-neon/30 bg-night/95 px-3 py-2 shadow-xl backdrop-blur"
            >
              <p className="flex items-center gap-2 text-[11px] text-ink">
                <span className="pulse-ring inline-block h-1.5 w-1.5 rounded-full bg-teal-neon" />
                <span className="font-medium">3 cambios sincronizados</span>
                <span className="font-mono text-[9px] text-teal-neon/80">~14 ms</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
