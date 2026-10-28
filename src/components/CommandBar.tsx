import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sections, site } from "../data/content";
import { goToSection, useActiveSection } from "../hooks/useActiveSection";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { OPEN_DEMO_EVENT } from "./Projects";
import { T_QUICK } from "../lib/motion";

interface Line {
  id: number;
  kind: "in" | "out" | "err";
  text: string;
}

/** Alias de cada sección: id, etiqueta y variantes sin tilde. */
const SECTION_ALIASES: Record<string, string> = Object.fromEntries(
  sections.flatMap((s) => [
    [s.id, s.id],
    [s.label, s.id],
    [s.label.normalize("NFD").replace(/\p{M}/gu, ""), s.id],
  ]),
);
SECTION_ALIASES["habilidades"] = "habilidades";
SECTION_ALIASES["home"] = "inicio";

const HELP = [
  "secciones    inicio · sobre-mi · enfoque · proyectos · stack · contacto",
  `proyectos    ${site.projects.map((p) => p.cmd).join(" · ")}  (abre su demo)`,
  "sistema      status · whoami · ls · clear",
  "enlaces      email · github · linkedin · paleta (Ctrl K)",
];

const COMPLETIONS = [
  ...sections.map((s) => s.label.normalize("NFD").replace(/\p{M}/gu, "")),
  ...site.projects.map((p) => p.cmd),
  "ayuda", "status", "whoami", "ls", "clear", "email", "github", "linkedin", "paleta",
];

/**
 * Barra de comandos fija abajo, estilo terminal: se navega la web escribiendo
 * (`proyectos`, `kair0s`, `status`…) o pulsando los atajos de sección.
 * "/" la enfoca desde cualquier sitio; Tab autocompleta; ↑ recupera historial.
 */
export default function CommandBar() {
  const reduce = useReducedMotion();
  const active = useActiveSection();
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [showOut, setShowOut] = useState(false);
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // "/" enfoca la barra salvo que ya se esté escribiendo en otro campo.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, [contenteditable='true']");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function print(out: { kind: Line["kind"]; text: string }[]) {
    setLines((prev) => [...prev, ...out.map((l) => ({ ...l, id: nextId.current++ }))].slice(-7));
    setShowOut(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (document.activeElement !== inputRef.current) setShowOut(false);
    }, 6000);
  }

  function run(raw: string) {
    const input = raw.trim();
    if (!input) return;
    history.current = [input, ...history.current].slice(0, 20);
    histIdx.current = -1;

    const [head, ...rest] = input.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    const echo = { kind: "in" as const, text: input };

    if (head === "clear" || head === "cls") {
      setLines([]);
      return;
    }
    if (head === "ayuda" || head === "help" || head === "?") {
      return print([echo, ...HELP.map((text) => ({ kind: "out" as const, text }))]);
    }
    if (head === "ls") {
      return print([
        echo,
        { kind: "out", text: sections.map((s) => `${s.label}/`).join("  ") },
        { kind: "out", text: site.projects.map((p) => `${p.cmd}*`).join("  ") },
      ]);
    }
    if (head === "status") {
      return print([
        echo,
        ...site.projects.map((p) => ({
          kind: "out" as const,
          text: `● ${p.cmd.padEnd(9)} ${p.status.label}`,
        })),
      ]);
    }
    if (head === "whoami") {
      return print([echo, { kind: "out", text: `${site.realName.toLowerCase()} '${site.name.toLowerCase()}' — ${site.role.toLowerCase()}` }]);
    }
    if (head === "sudo") {
      return print([echo, { kind: "err", text: "sudo: buen intento. Incidente reportado a PHAR0S." }]);
    }
    if (head === "email" || head === "mail") {
      window.location.href = `mailto:${site.contact.email}`;
      return print([echo, { kind: "out", text: `abriendo correo → ${site.contact.email}` }]);
    }
    if (head === "github" || head === "linkedin") {
      window.open(head === "github" ? site.contact.github : site.contact.linkedin, "_blank", "noopener,noreferrer");
      return print([echo, { kind: "out", text: `abriendo ${head}…` }]);
    }
    if (head === "paleta" || head === "palette") {
      window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
      return print([echo]);
    }

    const project = site.projects.find((p) => p.cmd === head || p.cmd === arg);
    if (project && (head === project.cmd || head === "open" || head === "cd")) {
      goToSection("proyectos");
      window.dispatchEvent(new CustomEvent(OPEN_DEMO_EVENT, { detail: project.cmd }));
      return print([echo, { kind: "out", text: `▶ ${project.title} · ${project.status.label}` }]);
    }

    const target = SECTION_ALIASES[head === "cd" ? arg.replace(/\/$/, "") : head.replace(/\/$/, "")];
    if (target) {
      goToSection(target);
      return print([echo, { kind: "out", text: `→ /${target}` }]);
    }

    print([echo, { kind: "err", text: `comando no encontrado: ${head} · prueba "ayuda"` }]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      // Sin esto, el Enter "pulsa" el botón de cerrar que la demo enfoca al abrirse.
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "Escape") {
      setShowOut(false);
      inputRef.current?.blur();
    } else if (e.key === "Tab" && value.trim()) {
      const match = COMPLETIONS.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histIdx.current + 1, history.current.length - 1);
      if (i >= 0) {
        histIdx.current = i;
        setValue(history.current[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = histIdx.current - 1;
      histIdx.current = Math.max(i, -1);
      setValue(i >= 0 ? history.current[i] : "");
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <AnimatePresence>
        {showOut && lines.length > 0 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={T_QUICK}
            className="mx-auto mb-2 max-w-6xl px-3 sm:px-6"
          >
            <div
              aria-live="polite"
              className="max-w-xl rounded-xl border border-line-bright bg-night/95 px-3.5 py-2.5 font-mono text-[11px] leading-relaxed shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur"
            >
              {lines.map((l) => (
                <p
                  key={l.id}
                  className={`whitespace-pre-wrap ${
                    l.kind === "in" ? "text-muted" : l.kind === "err" ? "text-rose-400" : "text-ink/90"
                  }`}
                >
                  {l.kind === "in" ? <span className="text-accent">$ </span> : null}
                  {l.text}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-line bg-night/85 backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-6xl items-center gap-3 px-3 sm:px-6">
          <label className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[12px] md:max-w-[340px]">
            <span className="shrink-0 text-accent">
              flako@dev<span className="text-muted">:~$</span>
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => lines.length > 0 && setShowOut(true)}
              placeholder='escribe "ayuda"'
              aria-label="Barra de comandos"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              // El foco ya se ve con el caret y el prompt; sin el recuadro global
              style={{ outline: "none" }}
              className="min-w-0 flex-1 bg-transparent text-ink caret-accent placeholder:text-faint focus:outline-none"
            />
          </label>

          <nav aria-label="Atajos de sección" className="hidden items-center gap-1 md:flex">
            {sections.slice(1).map((s) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(s.id)}
                  className={`rounded-md px-2 py-1 font-mono text-[10px] transition-colors ${
                    on ? "bg-accent/15 text-accent" : "text-faint hover:text-ink"
                  }`}
                >
                  {on && "> "}
                  {s.index}_{s.label.toUpperCase()}
                </button>
              );
            })}
          </nav>

          <span className="ml-auto hidden font-mono text-[10px] text-faint lg:block">
            <kbd className="rounded border border-line-bright px-1 text-muted">/</kbd> escribir ·{" "}
            <kbd className="rounded border border-line-bright px-1 text-muted">Tab</kbd> completar
          </span>
        </div>
      </div>
    </div>
  );
}
