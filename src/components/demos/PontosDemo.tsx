import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { DemoProps } from "./types";
import { useAutoSteps } from "./useAutoSteps";
import { T_QUICK } from "../../lib/motion";

/**
 * Demo: PONT0S, cámaras en directo de la costa gallega.
 * Flujo real de la web: la costa como carta náutica de noche con cada cámara
 * como una luz → buscar «Samil» → la luz se enciende y sale su cámara → el
 * tiempo y el mar de ese punto → la marea de hoy con el «ahora».
 * Fotograma final coherente (todo a la vista) si reduce-motion.
 *
 * Contrato común:
 *  - export default, props DemoProps ({ playing })
 *  - useReducedMotion() + useAutoSteps(DURATIONS, { enabled: !reduce, playing })
 *  - rellena su contenedor y se ve bien a ~640×440 y reducido ~0.45 en tarjeta
 */

// Paso:        0 mapa  1 busca  2 cámara 3 datos  4 marea  5 final
const DURATIONS = [1300, 1300, 1500, 1500, 1700, 3200] as const;

/** Acento de PONT0S: naranja boya sobre grafito. */
const BOIA = "#ff8a3d";

// Costa de Galicia (OpenStreetMap, simplificada) en el mismo sistema que la web, a 300×343.
const COAST =
  "M319 71L303 69L297 72L292 71L291 74L294 76L291 76L288 85L290 72L275 72L268 70L264 74L267 69L261 66L254 54L243 50L242 47L240 49L242 47L241 46L236 47L235 44L231 45L232 47L228 48L229 51L226 52L226 56L226 47L223 46L222 41L215 44L217 47L214 48L216 41L219 38L216 35L212 42L204 44L201 47L203 51L200 51L201 49L197 48L199 54L194 55L192 54L196 54L193 52L196 48L195 46L197 48L198 47L196 44L196 38L192 39L190 43L187 43L187 45L181 49L177 47L174 49L173 56L175 56L175 57L173 58L176 60L171 59L171 55L164 63L160 62L159 65L152 71L147 72L146 70L144 71L148 75L144 78L145 82L142 86L144 88L145 85L151 85L153 81L153 84L158 84L164 78L158 87L155 87L152 86L145 89L153 93L154 91L162 94L168 92L163 95L158 94L156 97L158 102L156 103L158 108L157 114L155 111L157 107L146 95L142 96L142 104L138 105L141 110L137 106L137 102L136 102L136 101L139 101L136 97L135 101L131 99L127 103L122 103L121 104L122 103L125 104L121 109L112 108L101 113L93 111L86 104L85 108L78 108L78 112L76 114L73 112L69 115L73 117L74 123L78 120L76 124L70 122L68 124L66 122L61 129L58 130L58 128L53 127L50 129L48 128L45 134L44 133L46 139L49 134L49 138L55 136L50 138L47 144L43 140L43 144L39 144L40 147L37 151L34 149L39 158L34 170L37 172L37 176L38 170L41 169L42 167L43 167L44 171L47 171L46 165L50 171L55 171L52 174L51 178L53 182L56 182L56 185L51 189L58 198L62 193L61 190L66 188L66 191L70 192L71 190L72 192L76 187L78 188L79 184L81 186L79 188L81 192L78 190L76 191L73 197L69 198L64 205L63 214L58 223L64 225L63 232L67 232L70 228L69 225L77 222L75 218L79 213L82 215L80 217L84 219L84 215L86 214L84 212L85 209L86 210L85 206L89 209L88 212L91 214L97 212L99 206L93 217L94 221L92 219L91 223L87 223L88 227L86 225L89 235L92 234L87 237L88 242L85 241L83 243L84 239L82 235L80 238L75 238L75 241L76 243L78 241L81 242L81 248L86 253L89 250L93 252L102 245L105 247L111 242L115 243L109 243L98 254L94 261L86 260L89 269L84 265L82 273L83 274L84 272L87 273L89 272L92 274L92 272L95 272L98 268L101 270L107 267L109 258L116 259L111 260L112 268L108 267L97 277L95 277L93 281L89 283L88 288L85 288L88 290L88 294L91 295L87 295L85 292L79 295L82 312L81 331L83 335L81 351L86 363L86 361L88 363L88 370L336 380L336 71Z";

// Las luces de la web (una por punto con cámara): [x, y, id].
const LIGHTS: [number, number, string][] = [
  [290, 74, "ria-de-ribadeo"],
  [255, 56, "burela"],
  [231, 56, "covas"],
  [197, 44, "porto-de-carino"],
  [175, 49, "punta-candieira"],
  [154, 83, "ria-de-ferrol"],
  [155, 89, "redes"],
  [135, 101, "orzan-riazor"],
  [139, 101, "dique-de-abrigo"],
  [121, 104, "langosteira-arteixo"],
  [48, 138, "camarinas"],
  [43, 141, "muxia"],
  [37, 176, "cabo-fisterra"],
  [59, 187, "louro"],
  [74, 194, "portosin"],
  [65, 226, "corrubedo"],
  [90, 223, "coron"],
  [83, 236, "o-grove"],
  [90, 251, "silgar"],
  [88, 251, "baltar"],
  [99, 254, "aguete"],
  [76, 254, "illa-de-ons"],
  [93, 272, "cangas"],
  [79, 278, "illas-cies"],
  [93, 280, "samil"],
  [86, 294, "baiona"],
  [82, 327, "a-guarda"],
  [162, 63, "a-frouxeira"],
  [80, 189, "noia"],
  [74, 189, "o-freixo"],
  [99, 241, "castrove"],
  [79, 295, "cabo-silleiro"],
];
const PICK = "samil";

const QUERY = "Samil";
const TIDE = "M0 30C14 30 22 6 40 6S66 34 86 34 112 8 130 8 156 30 170 30";

export default function PontosDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });

  const searched = step >= 1;
  const showCam = step >= 2;
  const showData = step >= 3;
  const showTide = step >= 4;
  const done = step >= 5;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(255,138,61,0.10),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-bold tracking-[0.14em] text-ink">
              PONT<span className="font-mono" style={{ color: BOIA }}>0</span>S
            </span>
            <span className="font-mono text-[10px] text-faint">/ costa de Galicia</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted">
            <span className="pulse-ring inline-block h-1.5 w-1.5 rounded-full" style={{ background: BOIA }} />
            38 cámaras en directo
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr]">
          {/* ── Carta náutica de noche ─────────────────────────────── */}
          <div className="relative flex items-center justify-center overflow-hidden border-r border-line bg-[#0e0f12] p-2">
            <svg viewBox="0 0 300 343" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <path d={COAST} fill="none" stroke="#233545" strokeWidth="15" strokeLinejoin="round" />
              <path d={COAST} fill="none" stroke="#0e0f12" strokeWidth="13.5" strokeLinejoin="round" />
              <path d={COAST} fill="none" stroke="#131c24" strokeWidth="8" strokeLinejoin="round" />
              <path d={COAST} fill="#1e2127" stroke="#6f7880" strokeWidth="0.8" strokeLinejoin="round" />
              <text x="205" y="18" fill="#8a8aa0" fontSize="9" fontStyle="italic" letterSpacing="2.5" textAnchor="middle">
                Mar Cantábrico
              </text>
              <text x="14" y="260" fill="#8a8aa0" fontSize="9" fontStyle="italic" letterSpacing="2.5" transform="rotate(-90 14 260)">
                Océano Atlántico
              </text>
              {LIGHTS.map(([x, y, id]) => {
                const on = searched && id === PICK;
                const dim = searched && id !== PICK;
                return (
                  <g key={id} transform={`translate(${x} ${y})`} style={{ opacity: dim ? 0.35 : 1, transition: "opacity 400ms" }}>
                    {on && !reduce && (
                      <motion.circle
                        r={4}
                        fill="none"
                        stroke={BOIA}
                        strokeWidth={1}
                        initial={{ scale: 1, opacity: 0.9 }}
                        animate={{ scale: 3.2, opacity: 0 }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <path
                      d="M0 0C1.6-2.1 2.6-5.3 1-8.1C.5-8.9-.5-8.9-1-8.1C-2.6-5.3-1.6-2.1 0 0Z"
                      fill={BOIA}
                      transform={`rotate(45) scale(${on ? 1.7 : 1})`}
                      style={{ transition: "transform 400ms" }}
                    />
                    <circle r={on ? 2.4 : 1.6} fill="#0e0f12" stroke="#e9e9f3" strokeWidth={0.8} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Ficha del punto ───────────────────────────────────── */}
          <div className="flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden p-3">
            <div className="flex items-center gap-2 rounded-md border border-line bg-night/70 px-2.5 py-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-faint">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className={`text-[11px] ${searched ? "text-ink" : "text-faint"}`}>
                {searched ? QUERY : "Riazor, Sanxenxo, Razo…"}
                {step === 1 && !reduce && <span className="type-cursor" />}
              </span>
            </div>

            {/* Cámara: escena de Samil con las Cíes al fondo */}
            <div className="relative aspect-[2.3/1] shrink-0 overflow-hidden rounded-md border border-line bg-panel-2">
              <AnimatePresence>
                {showCam && (
                  <motion.svg
                    key="cam"
                    viewBox="0 0 320 180"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="xMidYMid slice"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={T_QUICK}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="pontos-sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#5d6b78" />
                        <stop offset="1" stopColor="#a8b2b8" />
                      </linearGradient>
                      <linearGradient id="pontos-sea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#5f7a84" />
                        <stop offset="1" stopColor="#3a525c" />
                      </linearGradient>
                    </defs>
                    <rect width="320" height="92" fill="url(#pontos-sky)" />
                    <path d="M150 92l18-10 14 4 22-14 20 12 16-6 26 14z" fill="#3b4650" />
                    <path d="M0 92l26-6 30 6z" fill="#46525c" />
                    <rect y="92" width="320" height="58" fill="url(#pontos-sea)" />
                    {[104, 118, 132].map((y, i) => (
                      <motion.path
                        key={y}
                        d={`M-40 ${y}q20-4 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0`}
                        fill="none"
                        stroke="#d9e2e6"
                        strokeOpacity={0.35 + i * 0.15}
                        strokeWidth={1 + i * 0.4}
                        animate={reduce ? undefined : { x: [0, 40] }}
                        transition={{ duration: 3.2 - i * 0.6, repeat: Infinity, ease: "linear" }}
                      />
                    ))}
                    <path d="M0 150q80-10 160-4t160-6v40H0z" fill="#c9b994" />
                    <path d="M0 150q80-10 160-4t160-6" fill="none" stroke="#eef3f4" strokeOpacity="0.8" strokeWidth="2" />
                  </motion.svg>
                )}
              </AnimatePresence>
              {showCam ? (
                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-night/85 px-1.5 py-0.5 font-mono text-[8px] text-ink">
                  <span className="h-1 w-1 rounded-full" style={{ background: BOIA }} />
                  en directo · RiadeVigoCam
                </span>
              ) : (
                <span className="absolute inset-0 grid place-items-center font-mono text-[9px] text-faint">elige un punto de la costa</span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg font-semibold italic text-ink">{showCam ? "Samil" : "—"}</span>
              <span className="font-mono text-[9px] text-muted">{showCam ? "Vigo · Rías Baixas" : ""}</span>
            </div>

            {/* Tiempo y mar */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { k: "aire", v: "18°" },
                { k: "agua", v: "15°" },
                { k: "olas", v: "1,0 m" },
                { k: "viento", v: "3 km/h" },
              ].map((d, i) => (
                <motion.div
                  key={d.k}
                  initial={false}
                  animate={{ opacity: showData ? 1 : 0.25, y: showData || reduce ? 0 : 4 }}
                  transition={{ ...T_QUICK, delay: reduce ? 0 : i * 0.08 }}
                  className="rounded-md border border-line bg-night/60 px-1.5 py-1"
                >
                  <p className="font-mono text-[7.5px] text-faint">{d.k}</p>
                  <p className="text-[11px] font-semibold tabular-nums text-ink">{showData ? d.v : "—"}</p>
                </motion.div>
              ))}
            </div>

            {/* Marea de hoy */}
            <div className="mt-auto shrink-0 rounded-md border border-line bg-night/60 px-2 pb-1 pt-1">
              <div className="flex justify-between">
                <span className="hud-label">Marea de hoy</span>
                <span className="font-mono text-[8px]" style={{ color: showTide ? BOIA : "transparent" }}>
                  ahora 13:30
                </span>
              </div>
              <svg viewBox="0 0 170 40" className="h-7 w-full" preserveAspectRatio="none" aria-hidden="true">
                <path d={`${TIDE}V40H0Z`} fill="#131c24" opacity={showTide ? 1 : 0} style={{ transition: "opacity 500ms" }} />
                <motion.path
                  d={TIDE}
                  fill="none"
                  stroke="#e9e9f3"
                  strokeWidth={1.2}
                  initial={false}
                  animate={{ pathLength: showTide ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 1.1, ease: "easeInOut" }}
                />
                {showTide && (
                  <>
                    <line x1="96" x2="96" y1="0" y2="40" stroke={BOIA} strokeWidth="1" />
                    <circle cx="96" cy="31" r="2.6" fill={BOIA} />
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Toast final */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={T_QUICK}
              className="absolute bottom-3 left-3 rounded-xl border bg-night/95 px-3 py-2 shadow-xl backdrop-blur"
              style={{ borderColor: `${BOIA}55` }}
            >
              <p className="flex items-center gap-2 text-[11px] text-ink">
                <span className="pulse-ring inline-block h-1.5 w-1.5 rounded-full" style={{ background: BOIA }} />
                <span className="font-medium">32 puntos de Ribadeo a A Guarda</span>
                <span className="font-mono text-[9px] text-muted">open source</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
