import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useAutoSteps } from "./useAutoSteps";
import type { DemoProps } from "./types";
import { EASE_SIGNATURE, SPRING_SNAPPY } from "../../lib/motion";

/**
 * FLK0S · Centro de Operaciones (SOC). Réplica fiel del producto real
 * (github.com/NotSaam/FLK0S-Ecosystem): login SSO → MFA → hub Centro de
 * Operaciones → feed de amenazas → Blue Team (CDP) ⇄ Red Team (RT) → triaje
 * por Copilot IA → observabilidad e2e (frame final). Teal = defensa/primario,
 * magenta = Red Team. Autoplay; frame final coherente con reduce-motion.
 */

// Paso:        0 SSO   1 MFA   2 hub  3 feed 4 blue 5 red  6 IA   7 obs(final)
const DURATIONS = [1900, 2000, 2500, 2600, 2600, 2600, 2700, 3000] as const;
const T_SOFT: Transition = { duration: 0.45, ease: EASE_SIGNATURE };

const RED = "#f472b6"; // acento Red Team (magenta), funcional
const CRIT = "#f87171";
const HIGH = "#fbbf24";

const PRODUCTS = [
  { id: "CDP", name: "FLK0S-CDP", desc: "SOC · alertas, casos, threat intel" },
  { id: "RT", name: "FLK0S-RT", desc: "Red Team · campañas, C2, lateral" },
  { id: "AI", name: "FLK0S-AI", desc: "Copilot · IOC, hunting assist" },
  { id: "REP", name: "FLK0S-Reportes", desc: "Engagements · findings, evidence" },
] as const;

const KPIS = [
  { k: "Alertas ecosistema", v: "247" },
  { k: "Eventos 24h", v: "1.064" },
  { k: "Campañas RT", v: "3" },
  { k: "IOCs nuevos", v: "29" },
  { k: "Casos abiertos", v: "13" },
  { k: "Cobertura", v: "68%" },
] as const;

const ALERTS = [
  { sev: "CRIT", c: CRIT, t: "Acceso a credenciales LSASS · proceso no firmado", src: "DC03" },
  { sev: "HIGH", c: HIGH, t: "PowerShell codificado · origen finanzas", src: "WK-114" },
  { sev: "HIGH", c: HIGH, t: "Fuerza bruta RDP desde IP externa", src: "edge-02" },
  { sev: "MED", c: "#38bdf8", t: "Panel admin expuesto · nodo CASH", src: "cash-01" },
] as const;

const CTX: Record<number, string> = {
  2: "Hub", 3: "Alertas", 4: "Blue Team · CDP", 5: "Red Team · RT", 6: "Copilot IA", 7: "Observabilidad",
};

const NODES = [
  { id: "SSO", x: 10 }, { id: "API", x: 32 }, { id: "PG", x: 54 }, { id: "WK", x: 76 }, { id: "OTel", x: 94 },
] as const;

export default function FlkosSocDemo({ playing = true }: DemoProps) {
  const reduce = useReducedMotion();
  const { step } = useAutoSteps(DURATIONS, { enabled: !reduce, playing });
  const screen = step === 0 ? "sso" : step === 1 ? "mfa" : "soc";
  const redActive = step === 5;

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.12),transparent_60%)] p-4 font-sans">
      <div className="relative flex h-full max-h-[440px] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
        {/* Barra superior de ventana */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-panel-2/70 px-4 py-2.5">
          <span className="font-mono text-[11px] tracking-wide text-ink">
            FLK<span className="text-accent">0</span>S · Centro de Operaciones
          </span>
          {screen === "soc" && (
            <span className="font-mono text-[10px] text-muted">
              acme-corp · <span className="text-accent">SOC Analyst</span> · RBAC
            </span>
          )}
        </div>

        <div className="scanlines bg-grid relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ── 0 · SSO ─────────────────────────────────────────────── */}
            {screen === "sso" && (
              <Screen key="sso" reduce={reduce}>
                <div className="grid h-full grid-cols-2">
                  <div className="flex flex-col justify-center gap-3 border-r border-line p-6">
                    <p className="font-display text-2xl font-bold text-ink">
                      FLK<span className="text-accent">0</span>S
                    </p>
                    <p className="text-xs text-muted">Cybersecurity Operations Platform — un solo ecosistema, no cinco herramientas.</p>
                    <ul className="mt-2 space-y-1.5">
                      {["SSO compartido · MFA · RBAC", "Blue Team + Red Team + IA", "Observabilidad de extremo a extremo"].map((b) => (
                        <li key={b} className="flex items-center gap-2 font-mono text-[11px] text-muted">
                          <span className="text-accent">▸</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-6">
                    <p className="hud-label">Inicia sesión en tu tenant</p>
                    <div className="rounded-md border border-line-bright bg-night px-3 py-2 font-mono text-[11px] text-muted">operador@acme.io</div>
                    <div className="rounded-md border border-line-bright bg-night px-3 py-2 font-mono text-[11px] text-faint">tenant: acme-corp ▾</div>
                    <button className="glow-accent mt-1 rounded-md bg-accent py-2 font-mono text-[12px] font-semibold text-night">
                      Entrar con SSO →
                    </button>
                  </div>
                </div>
              </Screen>
            )}

            {/* ── 1 · MFA ─────────────────────────────────────────────── */}
            {screen === "mfa" && (
              <Screen key="mfa" reduce={reduce} center>
                <p className="hud-label">Verificación multifactor</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={reduce ? false : { opacity: 0.4, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={reduce ? undefined : { delay: 0.12 + i * 0.14, ...SPRING_SNAPPY }}
                      className="grid h-11 w-9 place-items-center rounded-md border border-accent/50 bg-night font-mono text-lg text-accent"
                    >
                      •
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduce ? undefined : { delay: 1.1, ...T_SOFT }}
                  className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent"
                >
                  <Check /> Acceso concedido · rol SOC Analyst
                </motion.div>
              </Screen>
            )}

            {/* ── 2..7 · SOC ──────────────────────────────────────────── */}
            {screen === "soc" && (
              <Screen key="soc" reduce={reduce} className="p-4">
                {/* Breadcrumb + toggle Blue/Red */}
                <div className="mb-3 flex shrink-0 items-center justify-between">
                  <span className="hud-label">Centro de operaciones · {CTX[step]}</span>
                  <div className="flex gap-1 rounded-lg border border-line bg-night p-0.5">
                    {(["Blue", "Red"] as const).map((label, i) => {
                      const active = (i === 1) === redActive;
                      return (
                        <div key={label} className="relative px-2.5 py-1">
                          {active && (
                            <motion.div
                              layoutId="flk-team"
                              className="absolute inset-0 rounded-md"
                              style={{ background: redActive ? "rgba(244,114,182,0.18)" : "rgba(45,212,191,0.16)" }}
                              transition={SPRING_SNAPPY}
                            />
                          )}
                          <span className="relative font-mono text-[10px]" style={{ color: active ? (redActive ? RED : "#2dd4bf") : "#8a8aa0" }}>
                            {label} Team
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {step === 2 && <HubView key="hub" reduce={reduce} />}
                    {step === 3 && <FeedView key="feed" reduce={reduce} />}
                    {step === 4 && <BlueView key="blue" reduce={reduce} />}
                    {step === 5 && <RedView key="red" reduce={reduce} />}
                    {step === 6 && <AiView key="ai" reduce={reduce} />}
                    {step === 7 && <ObsView key="obs" reduce={reduce} />}
                  </AnimatePresence>
                </div>
              </Screen>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Vistas internas ─────────────────────────────────────────────────── */

function HubView({ reduce }: { reduce: boolean | null }) {
  return (
    <View reduce={reduce}>
      <div className="grid grid-cols-3 gap-2">
        {KPIS.map((kpi) => (
          <div key={kpi.k} className="rounded-lg border border-line bg-night/60 px-3 py-2">
            <p className="font-display text-lg font-bold text-accent">{kpi.v}</p>
            <p className="hud-label !text-[8px]">{kpi.k}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-panel-2 px-3 py-2">
            <div>
              <p className="font-mono text-[11px] text-ink">{p.name}</p>
              <p className="text-[10px] text-faint">{p.desc}</p>
            </div>
            <span className="font-mono text-[9px] text-accent">ABRIR →</span>
          </div>
        ))}
      </div>
    </View>
  );
}

function FeedView({ reduce }: { reduce: boolean | null }) {
  return (
    <View reduce={reduce}>
      <p className="hud-label mb-2">Últimas alertas del ecosistema</p>
      <div className="space-y-1.5">
        {ALERTS.map((a, i) => (
          <motion.div
            key={a.t}
            initial={reduce ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduce ? undefined : { delay: i * 0.18, ...T_SOFT }}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-night/50 px-3 py-2"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.c }} />
            <span className="font-mono text-[9px]" style={{ color: a.c }}>{a.sev}</span>
            <span className="flex-1 truncate text-[11px] text-ink">{a.t}</span>
            <span className="font-mono text-[10px] text-faint">{a.src}</span>
          </motion.div>
        ))}
      </div>
    </View>
  );
}

function BlueView({ reduce }: { reduce: boolean | null }) {
  const bars = [60, 38, 72, 45, 80, 52, 66];
  return (
    <View reduce={reduce}>
      <div className="mb-2 flex gap-2">
        <Stat v="17" k="alertas abiertas" />
        <Stat v="10" k="en investigación" />
        <Stat v="142ms" k="p95 detección" />
      </div>
      <div className="rounded-lg border border-line bg-night/50 p-3">
        <p className="hud-label mb-2">Volumen de alertas · 24h</p>
        <div className="flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-accent-deep to-accent"
              initial={reduce ? false : { height: 0 }}
              animate={{ height: `${h}%` }}
              transition={reduce ? undefined : { delay: i * 0.05, ...T_SOFT }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-night/50 px-3 py-1.5 font-mono text-[10px] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-ring" /> EDR · 248 endpoints · 0 sin cobertura
      </div>
    </View>
  );
}

function RedView({ reduce }: { reduce: boolean | null }) {
  const camps = [
    { n: "Operation Phantom", o: "FinCorp Inc", p: 65, s: "ACTIVA" },
    { n: "Project Spectre", o: "MedData Systems", p: 38, s: "ACTIVA" },
  ];
  return (
    <View reduce={reduce}>
      <div className="mb-2 flex gap-2">
        <Stat v="3" k="campañas" c={RED} />
        <Stat v="7" k="operadores" c={RED} />
        <Stat v="14" k="nodos infra" c={RED} />
      </div>
      <p className="hud-label mb-1.5">Campañas activas</p>
      <div className="space-y-1.5">
        {camps.map((c) => (
          <div key={c.n} className="rounded-lg border border-line bg-night/50 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-ink">{c.n}</span>
              <span className="font-mono text-[9px]" style={{ color: RED }}>{c.s}</span>
            </div>
            <p className="mb-1 text-[10px] text-faint">Objetivo · {c.o}</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full"
                style={{ background: RED }}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${c.p}%` }}
                transition={reduce ? undefined : T_SOFT}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg border border-line bg-night/50 px-3 py-1.5 font-mono text-[10px]">
        <span className="text-muted">C2-Primary · sliver</span>
        <span style={{ color: RED }}>● EN LÍNEA</span>
      </div>
    </View>
  );
}

function AiView({ reduce }: { reduce: boolean | null }) {
  const lines = [
    { who: "ia", t: "Triando alerta #4821 (LSASS, DC03)…" },
    { who: "ia", t: "Clasificada: MITRE ATT&CK T1003.001 · LSASS Memory" },
    { who: "ia", t: "Acción sugerida: aislar DC03 · revocar sesión Kerberos" },
  ];
  return (
    <View reduce={reduce}>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-violet/20 font-mono text-[10px] text-violet">IA</span>
        <span className="hud-label">Copilot IA · triaje automático</span>
      </div>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <motion.div
            key={l.t}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? undefined : { delay: i * 0.4, ...T_SOFT }}
            className="rounded-lg border border-line bg-night/50 px-3 py-2 font-mono text-[11px] text-ink"
          >
            <span className="text-violet">›</span> {l.t}
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? undefined : { delay: 1.3 }}
        className="mt-2 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent"
      >
        <Check /> Caso #1042 → Resuelto · MTTR 9m
      </motion.div>
    </View>
  );
}

function ObsView({ reduce }: { reduce: boolean | null }) {
  return (
    <View reduce={reduce}>
      <p className="hud-label mb-2">Observabilidad e2e · OpenTelemetry</p>
      <div className="relative h-24 rounded-lg border border-line bg-night/50">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {NODES.slice(0, -1).map((n, i) => (
            <motion.line
              key={n.id}
              x1={`${n.x}%`} y1="50%" x2={`${NODES[i + 1].x}%`} y2="50%"
              stroke="#2dd4bf" strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={reduce ? undefined : { delay: 0.2 + i * 0.18, duration: 0.4 }}
            />
          ))}
        </svg>
        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            className="absolute top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/50 bg-night font-mono text-[8px] text-accent"
            style={{ left: `${n.x}%` }}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduce ? undefined : { delay: 0.2 + i * 0.18, ...SPRING_SNAPPY }}
          >
            {n.id}
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-accent">● trazas e2e · p95 142ms · OK</span>
        <span className="font-mono text-[9px] text-faint">Next.js · FastAPI · Postgres · Docker · OTel</span>
      </div>
    </View>
  );
}

/* ── Primitivas ──────────────────────────────────────────────────────── */

function Screen({
  children, reduce, center, className = "",
}: { children: React.ReactNode; reduce: boolean | null; center?: boolean; className?: string }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={T_SOFT}
      className={`absolute inset-0 flex flex-col ${center ? "items-center justify-center gap-4" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function View({ children, reduce }: { children: React.ReactNode; reduce: boolean | null }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={T_SOFT}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Stat({ v, k, c = "#2dd4bf" }: { v: string; k: string; c?: string }) {
  return (
    <div className="flex-1 rounded-lg border border-line bg-night/60 px-2.5 py-1.5">
      <p className="font-display text-base font-bold" style={{ color: c }}>{v}</p>
      <p className="hud-label !text-[8px]">{k}</p>
    </div>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
