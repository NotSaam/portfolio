import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { EASE_SIGNATURE, T_QUICK, SPRING_SNAPPY } from "../../lib/motion";

/**
 * Demo: app WEB de reservas de clases particulares ("ClaseYa").
 * Layout de escritorio (cabecera + calendario/agenda + panel de reserva),
 * coherente con las demás demos. Flujo real: elegir día en el calendario →
 * franja horaria → confirmar → éxito en tiempo real (toast WebSocket).
 * Autoplay en bucle; fotograma final coherente (confirmado + toast) si reduce.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 idle   1 día    2 franja  3 procesando 4 éxito
const DURATIONS = [1400, 1600, 1700, 1100, 2700] as const;

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const LEADING = 0; // huecos antes del día 1 (Junio empieza en lunes)
const DAYS_IN_MONTH = 30;
const SELECTED_DAY = 18; // Mié 18

const SLOTS = [
  { t: "09:00", busy: true },
  { t: "10:00", busy: false },
  { t: "11:30", busy: false },
  { t: "16:30", busy: true },
  { t: "17:00", busy: false },
  { t: "17:30", busy: false },
  { t: "18:30", busy: false },
  { t: "19:00", busy: true },
];
const SELECTED_SLOT = 5; // 17:30

export default function ReservasDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const dayPicked = step >= 1;
  const slotPicked = step >= 2;
  const sending = step === 3;
  const done = step >= 4;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior de la app web */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-tight text-ink">
              Clase<span className="text-accent">Ya</span>
            </span>
            <span className="font-mono text-[10px] text-faint">/ reservar clase</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-neon/30 bg-teal-neon/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-teal-neon uppercase">
            <span className="pulse-ring relative inline-block h-1.5 w-1.5 rounded-full bg-teal-neon" />
            tiempo real
          </span>
        </div>

        {/* Cuerpo: calendario/agenda (izq) + panel de reserva (der) */}
        <div className="scanlines grid min-h-0 flex-1 grid-cols-[1.5fr_1fr]">
          {/* ── Izquierda: calendario + franjas ──────────────────────── */}
          <div className="flex flex-col gap-3 overflow-hidden border-r border-line p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">Junio 2026</span>
                <span className="font-mono text-[10px] text-faint">‹ ›</span>
              </div>
              <AnimatePresence>
                {dayPicked && (
                  <motion.span
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[10px] text-teal-neon"
                  >
                    3 franjas libres
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Calendario mensual */}
            <div>
              <div className="mb-1 grid grid-cols-7 gap-1">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="text-center font-mono text-[8px] tracking-wider text-faint uppercase">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: LEADING }).map((_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((n) => {
                  const active = dayPicked && n === SELECTED_DAY;
                  const past = n < 16;
                  return (
                    <div key={n} className="relative">
                      <div
                        className={`flex items-center justify-center rounded-md py-1 font-display text-[11px] transition-colors duration-300 ${
                          active ? "font-bold text-night" : past ? "text-faint" : "text-muted"
                        }`}
                      >
                        {n}
                      </div>
                      {active && (
                        <motion.div
                          layoutId="rsv-day"
                          className="absolute inset-0 -z-10 rounded-md bg-gradient-to-b from-accent to-accent-deep glow-accent"
                          transition={SPRING_SNAPPY}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Franjas horarias */}
            <AnimatePresence>
              {dayPicked && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={T_QUICK}
                  className="min-h-0 flex-1"
                >
                  <p className="hud-label mb-1.5">Franjas · Mié 18 jun</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SLOTS.map((slot, i) => {
                      const active = slotPicked && i === SELECTED_SLOT;
                      return (
                        <div
                          key={slot.t}
                          className={`rounded-md border py-1.5 text-center font-mono text-[10px] transition-colors duration-300 ${
                            active
                              ? "border-teal-neon/60 bg-teal-neon/15 font-medium text-teal-neon"
                              : slot.busy
                                ? "border-line/50 text-faint line-through"
                                : "border-line text-muted"
                          }`}
                        >
                          {slot.t}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Derecha: profesor + resumen + confirmar ──────────────── */}
          <div className="flex flex-col gap-3 p-4">
            {/* Profesor */}
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-blue-neon font-display text-xs font-bold text-night">
                LM
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-teal-neon" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[12px] font-semibold text-ink">Prof. Laura Méndez</p>
                <p className="truncate text-[10px] text-muted">Matemáticas · 2º Bach</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-medium text-blue-neon">★ 4.9</span>
              <span className="text-faint">(128)</span>
              <span className="ml-auto font-mono font-medium text-ink">12 €/h</span>
            </div>

            <div className="h-px bg-line" />

            {/* Resumen de la reserva */}
            <div className="space-y-2">
              <p className="hud-label">Tu reserva</p>
              <SummaryRow label="Día" value={dayPicked ? "Mié 18 jun" : "—"} on={dayPicked} />
              <SummaryRow label="Hora" value={slotPicked ? "17:30" : "—"} on={slotPicked} mono />
              <SummaryRow label="Duración" value={slotPicked ? "1 h" : "—"} on={slotPicked} />
              <div className="my-1 h-px bg-line" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Total</span>
                <span className="font-display text-base font-bold text-teal-neon">
                  {slotPicked ? "12 €" : "—"}
                </span>
              </div>
            </div>

            {/* Botón confirmar */}
            <motion.button
              type="button"
              tabIndex={-1}
              animate={sending && !reduce ? { scale: [1, 0.97, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
              className={`mt-auto flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-colors duration-300 ${
                done
                  ? "bg-teal-neon text-night"
                  : slotPicked
                    ? "bg-accent text-night glow-accent"
                    : "bg-line/60 text-muted"
              }`}
            >
              {done ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Reserva confirmada
                </>
              ) : sending ? (
                <>
                  <motion.span
                    className="h-3.5 w-3.5 rounded-full border-2 border-night/30 border-t-night"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                  Procesando…
                </>
              ) : slotPicked ? (
                "Confirmar reserva"
              ) : (
                "Elige día y hora"
              )}
            </motion.button>
          </div>
        </div>

        {/* Toast en tiempo real (vibe WebSocket) */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={T_QUICK}
              className="absolute bottom-3 right-3 w-56 rounded-xl border border-teal-neon/30 bg-night/95 px-3 py-2.5 shadow-xl backdrop-blur"
            >
              <p className="flex items-start gap-2 text-[11px] leading-tight text-ink">
                <span className="pulse-ring mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-neon" />
                <span>
                  <span className="font-medium">Profesor notificado vía WebSocket</span>
                  <span className="block text-[10px] text-muted">recibirás un recordatorio</span>
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, on, mono }: { label: string; value: string; on: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted">{label}</span>
      <span className={`${mono ? "font-mono " : ""}${on ? "font-medium text-ink" : "text-faint"}`}>
        {value}
      </span>
    </div>
  );
}
