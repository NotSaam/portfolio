import { Suspense } from "react";
import type { KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "../data/content";
import { demoRegistry } from "./demos/registry";
import DemoStage from "./demos/DemoStage";
import { usePreviewPlayback } from "./usePreviewPlayback";
import { SPRING_SNAPPY } from "../lib/motion";

interface ProjectPreviewProps {
  project: Project;
  featured: boolean;
  onOpen: () => void;
}

/**
 * Ventana de preview EN VIVO de una tarjeta: marco tipo visor con la demo
 * (ventana de escritorio) escalada a miniatura vía DemoStage — fiel y completa,
 * nunca recortada, a cualquier ancho. No interactiva (la interacción vive en el
 * modal). Se monta perezosa al acercarse a viewport y se pausa fuera de vista.
 */
export default function ProjectPreview({ project, featured, onOpen }: ProjectPreviewProps) {
  const { ref, mounted, playing } = usePreviewPlayback(featured);
  const reduce = useReducedMotion();

  const Demo = project.demo ? demoRegistry[project.demo] : null;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Abrir demo de ${project.title}`}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={SPRING_SNAPPY}
      className="group/preview relative w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-night scanlines hud-corners transition-colors duration-300 hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {mounted && Demo ? (
        <Suspense fallback={<Poster project={project} />}>
          <DemoStage interactive={false}>
            <Demo playing={playing} />
          </DemoStage>
        </Suspense>
      ) : (
        <Poster project={project} />
      )}

      {/* Degradado superior sutil para legibilidad de la pill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-night/70 to-transparent"
      />

      {/* Pill esquina: EN VIVO (featured) o HOVER/TAP (resto) */}
      <div className="pointer-events-none absolute left-3 top-3 z-10">
        {featured ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-neon/40 bg-teal-neon/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-teal-neon uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-neon pulse-ring" />
            en vivo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line-bright bg-night/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-muted uppercase transition-opacity duration-300 group-hover/preview:opacity-0">
            hover / tap
          </span>
        )}
      </div>

      {/* Afordancia inferior derecha */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-line-bright bg-night/70 px-3 py-1 font-mono text-[10px] tracking-widest text-ink/80 uppercase opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        ver demo
      </div>
    </motion.div>
  );
}

/** Póster estático: se ve antes de montar la demo y como fallback de Suspense. */
function Poster({ project }: { project: Project }) {
  return (
    <div className="flex aspect-[680/440] w-full flex-col justify-between bg-grid p-4">
      <span className="hud-label">{project.kind}</span>
      <div>
        <p className="font-display text-lg font-semibold text-ink">{project.title}</p>
        <p className="mt-1 font-mono text-[11px] text-faint">▶ preview</p>
      </div>
    </div>
  );
}
