import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "../data/content";
import { EASE_SIGNATURE } from "../lib/motion";

interface Command {
  id: string;
  label: string;
  group: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

/** Evento global para abrir la paleta desde otros sitios (p. ej. el navbar). */
export const OPEN_PALETTE_EVENT = "open-command-palette";

function go(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function CommandPalette() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: "top", label: "Inicio", group: "Navegación", hint: "#inicio", run: () => go("#inicio") },
      ...site.nav.map((n) => ({
        id: n.href,
        label: n.label,
        group: "Navegación",
        hint: n.href,
        run: () => go(n.href),
      })),
    ];
    const projects: Command[] = site.projects.map((p) => ({
      id: `proj-${p.title}`,
      label: p.title,
      group: "Proyectos",
      hint: p.repo && p.repo !== "#" ? "abrir repo" : "ver demo",
      keywords: `${p.kind} ${p.tags.join(" ")}`,
      run: () => (p.repo && p.repo !== "#" ? openUrl(p.repo) : go("#proyectos")),
    }));
    const links: Command[] = [
      { id: "gh", label: "GitHub", group: "Enlaces", hint: "NotSaam", run: () => openUrl(site.contact.github) },
      { id: "li", label: "LinkedIn", group: "Enlaces", hint: "notsaam", run: () => openUrl(site.contact.linkedin) },
      { id: "mail", label: "Email", group: "Enlaces", hint: site.contact.email, run: () => { window.location.href = `mailto:${site.contact.email}`; } },
    ];
    return [...nav, ...projects, ...links];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Atajo global ⌘K / Ctrl+K + evento externo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Al abrir: foco, reset, bloquear scroll
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (active >= filtered.length) setActive(Math.max(0, filtered.length - 1));
  }, [filtered, active]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        cmd.run();
        setOpen(false);
      }
    }
  }

  // Agrupar manteniendo el índice plano para el resaltado
  let flatIndex = -1;
  const groups = ["Navegación", "Proyectos", "Enlaces"].filter((g) =>
    filtered.some((c) => c.group === g),
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Paleta de comandos"
        >
          <div className="absolute inset-0 bg-night/75 backdrop-blur-md" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25, ease: EASE_SIGNATURE }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-line-bright bg-panel/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-sm text-teal-neon">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Buscar sección, proyecto, enlace…"
                aria-label="Buscar"
                className="w-full bg-transparent py-4 font-mono text-sm text-ink placeholder:text-faint focus:outline-none"
              />
              <kbd className="rounded border border-line-bright bg-night px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center font-mono text-sm text-muted">
                  sin resultados
                </p>
              )}
              {groups.map((group) => (
                <div key={group} className="mb-1">
                  <p className="hud-label px-3 pt-2 pb-1">{group}</p>
                  {filtered
                    .filter((c) => c.group === group)
                    .map((cmd) => {
                      flatIndex += 1;
                      const isActive = flatIndex === active;
                      const idx = flatIndex;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            cmd.run();
                            setOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            isActive ? "bg-accent/15 text-ink" : "text-muted hover:text-ink"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className={isActive ? "text-accent" : "text-faint"}>▸</span>
                            {cmd.label}
                          </span>
                          {cmd.hint && (
                            <span className="font-mono text-[11px] text-faint">{cmd.hint}</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
