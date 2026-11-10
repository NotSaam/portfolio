import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { T_QUICK } from "../../lib/motion";

/**
 * Demo: KYB0S, casino social provably fair.
 * Flujo real de la app: el servidor publica el hash de su semilla → apuestas en
 * Dice (más de 50,00) → sale la tirada → rotas la semilla y se revela → el
 * verificador recalcula la tirada paso a paso y «Coincide».
 * Autoplay en bucle; fotograma final coherente (tirada verificada) si reduce.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 compromiso  1 tirando  2 resultado  3 rotar  4 verificado
const DURATIONS = [1500, 1300, 1700, 1500, 3200] as const;

const HASH = "4ae4babe62ac5258bf859c7e…3093f581e";
const SEED = "02e622f7e07170e8f473a366…88173c22";
const ROLL = 56.13;
const TARGET = 50;

const HISTORY = ["1,98×", "0,00×", "1,98×", "1,98×", "0,00×"];

const STEPS = [
  { k: "SHA-256(semilla)", v: "4ae4babe…f581e", at: 4 },
  { k: "HMAC-SHA256", v: "8fb37a37…a5630f7", at: 4 },
  { k: "float", v: "0,5613323578", at: 4 },
  { k: "tirada", v: "56,13", at: 4 },
] as const;

export default function KybosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const rolling = step === 1;
  const rolled = step >= 2;
  const revealed = step >= 3;
  const verified = step >= 4;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-ink">
              KYB<span className="font-mono text-teal-neon">0</span>S
            </span>
            <span className="font-mono text-[10px] text-faint">/ dice</span>
          </div>
          <span className="rounded-full border border-line bg-night/60 px-2 py-0.5 font-mono text-[10px] text-ink tabular-nums">
            ◎ {rolled ? "5.009" : "5.000"} fichas
          </span>
        </div>

        <div className="scanlines grid min-h-0 flex-1 grid-cols-[1.2fr_1fr]">
          {/* ── Izquierda: el juego ─────────────────────────────────── */}
          <div className="flex flex-col gap-3 overflow-hidden border-r border-line p-4">
            <div className="flex gap-1">
              {HISTORY.map((h, i) => (
                <span
                  key={i}
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${
                    h === "0,00×" ? "bg-night/70 text-faint" : "bg-teal-neon/10 text-teal-neon"
                  }`}
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="hud-corners flex flex-col items-center rounded-xl border border-line bg-night/50 py-4">
              <span className="hud-label">Tirada</span>
              <motion.span
                key={rolled ? "r" : rolling ? "x" : "i"}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={T_QUICK}
                className={`font-mono text-5xl font-bold tabular-nums ${rolled ? "text-teal-neon" : "text-faint"}`}
              >
                {rolled ? ROLL.toFixed(2).replace(".", ",") : rolling ? "··,··" : "--,--"}
              </motion.span>
              <span className={`mt-1 font-mono text-[10px] ${rolled ? "text-teal-neon" : "text-faint"}`}>
                {rolled ? "gana · 1,98×" : "más de 50,00"}
              </span>
            </div>

            {/* Barra 0–100 con el objetivo y la tirada */}
            <div className="relative h-2 rounded-full bg-night">
              <div className="absolute inset-y-0 right-0 rounded-r-full bg-teal-neon/25" style={{ left: `${TARGET}%` }} />
              <div className="absolute -top-1 h-4 w-0.5 bg-muted" style={{ left: `${TARGET}%` }} />
              {rolled && (
                <motion.span
                  initial={reduce ? false : { left: "0%" }}
                  animate={{ left: `${ROLL}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-md border border-teal-neon bg-night shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                />
              )}
            </div>

            <div className="mt-auto flex items-center gap-2">
              <span className="flex-1 rounded-md border border-line bg-night/70 px-2.5 py-1.5 font-mono text-[11px] text-ink">10 fichas</span>
              <motion.span
                animate={rolling && !reduce ? { scale: [1, 0.96, 1] } : { scale: 1 }}
                className="rounded-md bg-teal-neon px-4 py-1.5 text-[11px] font-semibold text-night"
              >
                {rolling ? "Tirando…" : "Apostar"}
              </motion.span>
            </div>
          </div>

          {/* ── Derecha: la prueba ──────────────────────────────────── */}
          <div className="flex flex-col gap-2.5 p-4">
            <div>
              <p className="hud-label">Hash publicado antes de apostar</p>
              <p className="mt-1 truncate font-mono text-[9.5px] text-teal-neon/90">{HASH}</p>
            </div>
            <div>
              <p className="hud-label">Semilla del servidor</p>
              <p className={`mt-1 truncate font-mono text-[9.5px] transition-colors duration-500 ${revealed ? "text-ink" : "text-faint"}`}>
                {revealed ? SEED : "oculta hasta rotar"}
              </p>
            </div>
            <div className="flex gap-3 font-mono text-[9.5px]">
              <span className="text-faint">cliente <span className="text-ink">EmSjKAU0…</span></span>
              <span className="text-faint">nonce <span className="text-ink">1</span></span>
            </div>

            <div className="mt-1 space-y-1">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.k}
                  initial={false}
                  animate={{ opacity: step >= s.at ? 1 : 0.25 }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.12 }}
                  className="flex items-center justify-between rounded border border-line bg-night/50 px-2 py-1 text-[9.5px]"
                >
                  <span className="text-muted">{s.k}</span>
                  <span className="font-mono text-ink">{s.v}</span>
                </motion.div>
              ))}
            </div>

            <div
              className={`mt-auto flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] transition-colors duration-300 ${
                verified
                  ? "border-teal-neon/40 bg-teal-neon/10 text-teal-neon"
                  : revealed
                    ? "border-accent/40 text-ink"
                    : "border-line text-faint"
              }`}
            >
              <span className="flex-1 font-medium">{verified ? "Coincide" : revealed ? "Verificando…" : "Rotar semilla"}</span>
              {verified && <span className="font-mono text-[9px] text-teal-neon/70">56,13 = 56,13</span>}
            </div>
          </div>
        </div>

        {/* Toast: la tirada era la que tocaba */}
        <AnimatePresence>
          {verified && (
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
                  <span className="font-medium">Tirada verificada</span>
                  <span className="block text-[10px] text-muted">Recalculada en tu navegador, sin fiarte de la casa</span>
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
