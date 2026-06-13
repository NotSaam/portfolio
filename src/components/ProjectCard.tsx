import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import type { Project } from "../data/content";
import { T_QUICK } from "../lib/motion";
import ProjectPreview from "./ProjectPreview";

interface ProjectCardProps {
  project: Project;
  /** true = tarjeta destacada: layout ancho 2-columnas y preview en autoplay. */
  featured: boolean;
  /** Abre el modal con la demo interactiva. */
  onOpen: () => void;
}

function RepoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

/** Cabecera: etiqueta de tipo + badge honesto "En desarrollo" si es WIP. */
function Header({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3">
      <span className="hud-label">{project.kind}</span>
      {project.wip && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-neon/40 bg-blue-neon/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-blue-neon uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-neon" />
          En desarrollo
        </span>
      )}
    </div>
  );
}

/**
 * Línea problema → solución: el GANCHO. Lo primero que vende, antes que la
 * descripción larga. Marcador teal + texto destacado (ink, medium) y aireado.
 */
function Problem({ text, featured }: { text: string; featured?: boolean }) {
  return (
    <p
      className={`relative border-l-2 border-accent pl-3.5 font-medium leading-relaxed text-balance text-ink ${
        featured ? "text-base md:text-lg" : "text-[15px]"
      }`}
    >
      {text}
    </p>
  );
}

/** Acciones: "Ver demo" + CTAs claros "Ver repo" / "En vivo" (si existen y ≠ "#"). */
function Actions({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const hasRepo = Boolean(project.repo && project.repo !== "#");
  const hasLink = Boolean(project.link && project.link !== "#");

  // Botones secundarios comparten estilos: misma altura y ≥44px de tap target.
  const secondary =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm text-muted transition-colors duration-300 hover:border-line-bright hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div className="mt-auto flex flex-wrap items-stretch gap-2.5 pt-2">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 text-sm font-medium text-ink transition-colors duration-300 hover:border-accent/70 hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
          <path d="M8 5v14l11-7z" />
        </svg>
        Ver demo
      </button>

      {hasRepo && (
        <a href={project.repo} target="_blank" rel="noreferrer" className={secondary}>
          <RepoIcon /> Ver repo
        </a>
      )}
      {hasLink && (
        <a href={project.link} target="_blank" rel="noreferrer" className={secondary}>
          <LinkIcon /> En vivo
        </a>
      )}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2 pt-1">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-line bg-night/60 px-3 py-1 font-mono text-xs text-ink/70"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Tarjeta de proyecto: preview en vivo + problema→solución + stack + CTAs. */
export default function ProjectCard({ project, featured, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }

  if (project.placeholder) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line p-8 text-center">
        <span className="hud-label">{project.kind}</span>
        <h3 className="font-display text-lg text-muted">{project.title}</h3>
        <p className="max-w-xs text-sm text-muted/70">{project.description}</p>
      </div>
    );
  }

  const glow = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(460px circle at var(--gx, 50%) var(--gy, 50%), rgba(45,212,191,0.12), transparent 60%)",
      }}
    />
  );

  if (featured) {
    return (
      <motion.article
        ref={cardRef}
        onMouseMove={onMouseMove}
        transition={T_QUICK}
        className="group relative grid gap-6 overflow-hidden rounded-2xl border border-line bg-panel/90 p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:glow-accent md:grid-cols-2 md:items-center md:p-8"
      >
        {glow}
        <div className="relative z-10">
          <ProjectPreview project={project} featured onOpen={onOpen} />
        </div>
        <div className="relative z-10 flex min-w-0 flex-col gap-4">
          <Header project={project} />
          <h3 className="font-display text-2xl font-bold tracking-tight text-balance md:text-3xl">
            {project.title}
          </h3>
          <Problem text={project.problem} featured />
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>
          <Tags tags={project.tags} />
          <Actions project={project} onOpen={onOpen} />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      transition={T_QUICK}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-panel/90 p-6 transition-colors duration-300 hover:border-accent/40"
    >
      {glow}
      <div className="relative z-10">
        <ProjectPreview project={project} featured={false} onOpen={onOpen} />
      </div>
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-3">
        <Header project={project} />
        <h3 className="font-display text-xl font-semibold text-balance">{project.title}</h3>
        <Problem text={project.problem} />
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
        <Tags tags={project.tags} />
        <Actions project={project} onOpen={onOpen} />
      </div>
    </motion.article>
  );
}
