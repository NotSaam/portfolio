import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { T_QUICK } from "../../lib/motion";

/**
 * Demo: GRAFIK0S, bots de trading para cuentas de fondeo (MT5).
 * Flujo real del bot: vigila el oro → sale una señal → el gestor de riesgo
 * calcula el lote dentro de las normas de la firma → orden enviada → una
 * noticia roja bloquea nuevas entradas → la posición llega al TP y el objetivo
 * del examen avanza. Datos de demostración, no resultados reales.
 * Autoplay en bucle; fotograma final coherente (TP alcanzado) si reduce.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 vigilando  1 señal  2 riesgo  3 abierta  4 noticia  5 TP
const DURATIONS = [1300, 1300, 1400, 1500, 1600, 3000] as const;

// Curva de equity (puntos SVG); el último tramo se dibuja al llegar al TP.
const EQUITY = "0,62 20,58 40,60 60,50 80,52 100,44 120,46 140,38 160,40 180,34";
const EQUITY_TP = "180,34 200,30 220,22";

const BALANCE = ["104.008,10", "104.008,10", "104.008,10", "104.008,10", "104.008,10", "104.820,50"];
const OBJECTIVE = [40, 40, 40, 40, 40, 48];

const EVENTS = [
  { at: 1, t: "Señal de venta en XAUUSD", c: "text-ink" },
  { at: 2, t: "Lote 0,56 · riesgo 0,5 % dentro de las normas", c: "text-muted" },
  { at: 3, t: "Orden ejecutada: venta a 4.118,40", c: "text-ink" },
  { at: 4, t: "Noticia roja USD: nuevas entradas bloqueadas", c: "text-amber-300" },
  { at: 5, t: "TP alcanzado: +812,40", c: "text-teal-neon" },
] as const;

export default function GrafikosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const open = step >= 3 && step < 5;
  const blocked = step === 4;
  const tp = step >= 5;
  const status = tp ? "Activo" : blocked ? "Bloqueado · noticia" : step >= 1 ? "Señal" : "Vigilando";

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-ink">
              GRAFIK<span className="font-mono text-teal-neon">0</span>S
            </span>
            <span className="font-mono text-[10px] text-faint">/ FTMO 80K · fase 1</span>
          </div>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase transition-colors duration-300 ${
              blocked ? "border-amber-300/40 bg-amber-300/10 text-amber-300" : "border-teal-neon/30 bg-teal-neon/10 text-teal-neon"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="scanlines grid min-h-0 flex-1 grid-cols-[1.35fr_1fr]">
          {/* ── Izquierda: cuenta ───────────────────────────────────── */}
          <div className="flex flex-col gap-3 overflow-hidden border-r border-line p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="hud-label">Balance</p>
                <motion.p
                  key={BALANCE[step]}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={T_QUICK}
                  className="font-mono text-2xl font-bold text-ink tabular-nums"
                >
                  {BALANCE[step]}
                </motion.p>
              </div>
              <span className={`font-mono text-[11px] tabular-nums ${tp ? "text-teal-neon" : open ? "text-rose-400" : "text-faint"}`}>
                {tp ? "+812,40" : open ? "-165,20" : "0,00"}
              </span>
            </div>

            {/* Equity */}
            <svg viewBox="0 0 220 70" className="h-24 w-full" preserveAspectRatio="none">
              <polyline points={EQUITY} fill="none" stroke="#2dd4bf" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              {tp && (
                <motion.polyline
                  points={EQUITY_TP}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.6"
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </svg>

            {/* Límites de la firma */}
            <div className="space-y-2">
              {[
                { k: "Objetivo", v: `${OBJECTIVE[step]} %`, w: OBJECTIVE[step], c: "bg-teal-neon" },
                { k: "Pérdida diaria", v: open ? "3 % de 5 %" : "0 % de 5 %", w: open ? 60 : 0, c: "bg-muted" },
                { k: "Pérdida total", v: "0 % de 10 %", w: 0, c: "bg-muted" },
              ].map((b) => (
                <div key={b.k}>
                  <div className="flex justify-between text-[9.5px]">
                    <span className="text-muted">{b.k}</span>
                    <span className="font-mono text-ink">{b.v}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-night">
                    <motion.div
                      className={`h-1 rounded-full ${b.c}`}
                      initial={false}
                      animate={{ width: `${b.w}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Derecha: eventos del bot ────────────────────────────── */}
          <div className="flex flex-col gap-2 p-4">
            <p className="hud-label">Eventos</p>
            <div className="space-y-1.5">
              {EVENTS.map((e) => (
                <motion.div
                  key={e.t}
                  initial={false}
                  animate={{ opacity: step >= e.at ? 1 : 0, x: step >= e.at || reduce ? 0 : 8 }}
                  transition={T_QUICK}
                  className="rounded border border-line bg-night/50 px-2 py-1.5 text-[10px] leading-tight"
                >
                  <span className={e.c}>{e.t}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-line bg-night/50 px-3 py-2 font-mono text-[9.5px] text-muted">
              Próxima roja: <span className="text-ink">Fed Chair Speaks</span> (USD)
            </div>
          </div>
        </div>

        {/* Toast: objetivo del examen más cerca */}
        <AnimatePresence>
          {tp && (
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
                  <span className="font-medium">TP alcanzado</span>
                  <span className="block text-[10px] text-muted">Objetivo de la fase 1 al 48 %, sin tocar ningún límite</span>
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
