import { site } from "../data/content";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function About() {
  return (
    <Section id="sobre-mi">
      <SectionHeading index="01" title="Sobre mí" />

      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-ink/80">
            {site.about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        {/* Tarjeta tipo terminal */}
        <Reveal delay={0.15}>
          <div className="hud-corners overflow-hidden rounded-xl border border-line bg-panel-2 shadow-[0_0_40px_rgba(45,212,191,0.12)]">
            <div className="flex items-center gap-1.5 border-b border-line-bright px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-muted">flako@dev:~</span>
            </div>
            <div className="space-y-1.5 px-5 py-5 font-mono text-sm">
              {site.about.terminal.map((line) => (
                <p key={line.text} className={line.cmd ? "text-ink" : "text-muted"}>
                  {line.cmd && <span className="text-teal-neon">$ </span>}
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
