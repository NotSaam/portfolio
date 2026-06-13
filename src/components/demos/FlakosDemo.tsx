import type { DemoProps } from "./types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAutoSteps } from "./useAutoSteps";
import { EASE_SIGNATURE, T_QUICK, SPRING_SNAPPY } from "../../lib/motion";

/**
 * Demo animada de "FLAK0S" — un SO x86 hobby escrito desde cero (bootloader ASM
 * + kernel C + memoria + shell mínima). Estado real: ARRANCA y tiene una shell
 * básica; el resto es la visión (honesto, "early build / WIP").
 *
 * Recorrido en pasos: BOOT (wordmark + init [ OK ]) → LOGIN → SHELL (uname /
 * free / ls / htop-mini) → guiño GUI flak-wm (próximamente). Autoplay en bucle;
 * el último paso es un fotograma final coherente (reduce-motion lo congela ahí).
 *
 * Modular: las líneas de boot, los comandos y los procesos viven en arrays para
 * ampliarlos a medida que crezca el SO sin tocar el render.
 *
 * Contrato común: export default FlakosDemo({ playing }: DemoProps), usa
 * useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing }).
 */

// Paso:  0 boot   1 login   2 shell/uname  3 free/ls  4 htop  5 GUI (final)
const DURATIONS = [2000, 2200, 1800, 1900, 2000, 2800] as const;

// Cascada de init: cada línea termina en [ OK ] teal. Fácil de extender.
const INIT_LINES = [
  "A20 line enabled",
  "Protected mode (32-bit)",
  "GDT / IDT installed",
  "Paging enabled",
  "Heap allocator ready",
  "VGA text 80x25",
  "PS/2 keyboard",
] as const;

// Procesos para la mini-vista tipo htop. cpu = ancho de barra (0-100).
const PROCS = [
  { pid: 1, name: "kinit", cpu: 4 },
  { pid: 7, name: "ksh", cpu: 11 },
  { pid: 9, name: "vga-fb", cpu: 2 },
] as const;

export default function FlakosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const loggedIn = step >= 1; // login resuelto
  const ranUname = step >= 2; // uname -a + free comienzan
  const ranLs = step >= 3; // free + ls visibles
  const ranHtop = step >= 4; // mini htop
  const wmHint = step >= 5; // guiño GUI (frame final)

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.08),transparent_60%)] p-5">
      {/* Ventana de terminal */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-night shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra de título */}
        <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-neon/70" />
          <span className="flex-1 text-center font-mono text-[11px] tracking-wide text-muted">
            flak0s — qemu · i386
          </span>
          <span className="hud-label rounded border border-line px-1.5 py-0.5 text-[9px] text-faint">
            WIP · early build
          </span>
        </div>

        {/* Cuerpo del terminal — `scanlines` aporta el overlay CRT sutil */}
        <div className="scanlines relative flex-1 overflow-hidden px-5 py-3 font-mono text-[12px] leading-[1.5]">
          <div className="relative z-0 flex h-full flex-col">
            {/* BOOT: wordmark + bootloader (paso 0+) */}
            <pre className="font-mono text-[10px] leading-[1.05] text-accent glow-accent">
              {" ___ _      _   _  _____ ___\n"}
              {"| __| |    /_\\ | |/ / _ \\ __|\n"}
              {"| _|| |__ / _ \\| ' < (_) \\__ \\\n"}
              {"|_| |____/_/ \\_\\_|\\_\\___/|___/"}
            </pre>
            <p className="mt-1.5 text-ink">
              <span className="text-accent">FLAK0S</span> bootloader v0.1{" "}
              <span className="text-blue-neon">[0.012s]</span>
            </p>

            {/* Init: dos columnas para no desbordar al escalar */}
            <div className="mt-1 grid grid-cols-2 gap-x-5 gap-y-0">
              {INIT_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    reduce ? { duration: 0 } : { ...SPRING_SNAPPY, delay: i * 0.1 }
                  }
                  className="flex items-center gap-1.5 text-[11px] text-ink"
                >
                  <span className="flex-1 truncate text-muted">{line}</span>
                  <span className="text-teal-neon">[ OK ]</span>
                </motion.p>
              ))}
            </div>

            {/* LOGIN (paso 1+) */}
            <AnimatePresence mode="popLayout">
              {loggedIn && (
                <motion.div
                  key="login"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_SIGNATURE }}
                  className="mt-1.5"
                >
                  <p className="text-muted">
                    flak0s login: <span className="text-ink">flako</span>
                  </p>
                  <p className="text-muted">
                    password: <span className="tracking-[0.2em] text-ink">••••••</span>
                  </p>
                  <p className="text-ink">
                    Bienvenido a <span className="text-accent">FLAK0S 0.1</span>{" "}
                    <span className="text-faint">(early build)</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SHELL (paso 2+) */}
            <AnimatePresence mode="popLayout">
              {ranUname && (
                <motion.div
                  key="shell"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_SIGNATURE }}
                  className="mt-1.5 space-y-0.5"
                >
                  {/* uname -a */}
                  <p className="text-ink">
                    <Prompt /> <span>uname -a</span>
                  </p>
                  <p className="text-muted">FLAK0S 0.1.0 x86 i386 monolithic</p>

                  {/* free */}
                  <Cmd show={ranLs} reduce={reduce} cmd="free">
                    <p className="text-muted">
                      mem: <span className="text-ink">14M</span> used / 64M ·
                      heap: <span className="text-teal-neon">ok</span>
                    </p>
                  </Cmd>

                  {/* ls */}
                  <Cmd show={ranLs} reduce={reduce} cmd="ls">
                    <p className="text-ink">
                      <span className="text-blue-neon">kernel/</span>{"  "}
                      <span className="text-blue-neon">drivers/</span>{"  "}
                      <span className="text-blue-neon">shell/</span>{"  "}README
                    </p>
                  </Cmd>

                  {/* htop-mini */}
                  <Cmd show={ranHtop} reduce={reduce} cmd="htop">
                    <div className="mt-0.5 space-y-0.5">
                      {PROCS.map((p) => (
                        <div key={p.pid} className="flex items-center gap-2 text-[11px]">
                          <span className="w-5 text-right text-faint">{p.pid}</span>
                          <span className="w-14 text-muted">{p.name}</span>
                          <span className="relative h-2 flex-1 overflow-hidden rounded-sm bg-panel-2">
                            <motion.span
                              className="absolute inset-y-0 left-0 rounded-sm bg-teal-neon"
                              initial={reduce ? false : { width: 0 }}
                              animate={{ width: `${p.cpu}%` }}
                              transition={reduce ? { duration: 0 } : T_QUICK}
                            />
                          </span>
                          <span className="w-9 text-right text-ink">{p.cpu}%</span>
                        </div>
                      ))}
                    </div>
                  </Cmd>

                  {/* GUI WINK — startx → flak-wm (frame final) */}
                  {wmHint && (
                    <div className="mt-1">
                      <p className="text-ink">
                        <Prompt /> <span>startx</span>
                      </p>
                      <p className="text-muted">
                        iniciando <span className="text-accent">flak-wm</span>… entorno
                        gráfico mínimo{" "}
                        <span className="text-faint">(próximamente)</span>
                      </p>
                    </div>
                  )}

                  {/* Prompt en espera (excepto cuando ya hay otro comando) */}
                  {!wmHint && ranHtop && (
                    <p className="text-ink">
                      <Prompt /> <Cursor reduce={reduce} />
                    </p>
                  )}
                  {wmHint && (
                    <p className="text-ink">
                      <Prompt /> <Cursor reduce={reduce} />
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bloque comando: prompt + comando revelado + salida, con animación de fade. */
function Cmd({
  show,
  reduce,
  cmd,
  children,
}: {
  show: boolean;
  reduce: boolean | null;
  cmd: string;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
    >
      <p className="text-ink">
        <Prompt /> <span>{cmd}</span>
      </p>
      {children}
    </motion.div>
  );
}

/** Prompt de la shell: usuario@host con el `$` en teal. */
function Prompt() {
  return (
    <span>
      <span className="text-teal-neon">flako@flak0s</span>
      <span className="text-muted">:~</span>
      <span className="text-teal-neon">$</span>
    </span>
  );
}

/** Cursor de bloque parpadeante. Usa clase CSS (segura con reduce-motion). */
function Cursor({ reduce }: { reduce: boolean | null }) {
  return (
    <span
      className={`ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-teal-neon ${
        reduce ? "" : "type-cursor"
      }`}
    />
  );
}
