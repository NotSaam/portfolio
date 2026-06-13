import Reveal from "./Reveal";

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
}

/** Cabecera de sección: índice mono + título display + línea degradada */
export default function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal className="mb-14">
      <p className="mb-3 flex items-center gap-2 font-mono text-sm text-accent">
        <span className="hud-label text-faint">índice</span>
        <span className="text-muted">/</span> {index}
      </p>
      <h2 className="text-balance font-display text-[clamp(1.75rem,6vw,2.25rem)] font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 max-w-xl text-pretty text-muted">{subtitle}</p>}
      <div className="mt-5 h-px w-24 bg-gradient-to-r from-accent via-teal-neon/60 to-transparent" />
    </Reveal>
  );
}
