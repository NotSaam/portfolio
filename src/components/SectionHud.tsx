import { motion } from "framer-motion";
import { sections, site } from "../data/content";
import type { Project } from "../data/content";
import { goToSection, useActiveSection } from "../hooks/useActiveSection";
import { SPRING_SNAPPY } from "../lib/motion";

/** Color del punto de estado según la madurez real del proyecto. */
export const TONE: Record<Project["status"]["tone"], string> = {
  live: "bg-accent",
  rc: "bg-blue-neon",
  mvp: "bg-amber-300",
  wip: "bg-violet",
};

/**
 * HUD lateral fijo (solo pantallas anchas, donde hay margen libre a la
 * izquierda del contenido): índice de secciones con la actual resaltada y,
 * debajo, el estado real de cada proyecto.
 */
export default function SectionHud() {
  const active = useActiveSection();

  return (
    <aside
      aria-label="Posición en la página y estado de los proyectos"
      className="fixed top-1/2 left-4 z-30 hidden w-[104px] -translate-y-1/2 flex-col gap-6 font-mono min-[1400px]:flex"
    >
      <nav>
        <p className="hud-label mb-2 text-faint">sys.nav</p>
        <ul className="space-y-1">
          {sections.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id} className="relative">
                {on && (
                  <motion.span
                    layoutId="hud-active"
                    transition={SPRING_SNAPPY}
                    className="absolute inset-y-0 -left-2 w-0.5 rounded-full bg-accent"
                  />
                )}
                <button
                  type="button"
                  onClick={() => goToSection(s.id)}
                  aria-current={on ? "location" : undefined}
                  className={`flex w-full items-baseline gap-1.5 py-0.5 text-left text-[10px] transition-colors ${
                    on ? "text-ink" : "text-faint hover:text-muted"
                  }`}
                >
                  <span className={on ? "text-accent" : undefined}>{s.index}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        <p className="hud-label mb-2 text-faint">sys.status</p>
        <ul className="space-y-1.5">
          {site.projects.map((p) => (
            <li key={p.title}>
              <button
                type="button"
                onClick={() => goToSection("proyectos")}
                className="group w-full text-left"
              >
                <span className="flex items-center gap-1.5 text-[10px] text-ink/85 group-hover:text-ink">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE[p.status.tone]} ${
                      p.status.tone === "live" ? "pulse-ring" : ""
                    }`}
                  />
                  <span className="truncate">{p.title.length <= 8 ? p.title : p.cmd}</span>
                </span>
                <span className="block truncate pl-3 text-[9px] text-faint">{p.status.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
