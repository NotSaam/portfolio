import { site } from "../data/content";
import Section from "./Section";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  const { contact } = site;

  return (
    <Section id="contacto" className="pb-32">
      <Reveal className="text-center">
        <p className="mb-3 flex items-center justify-center gap-2 font-mono text-sm text-accent">
          <span className="hud-label text-faint">índice</span>
          <span className="text-muted">/</span> 05
        </p>

        {/* Banner discreto de disponibilidad */}
        <p className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-xs tracking-wide text-accent">
          <span className="pulse-ring relative inline-block h-2 w-2 shrink-0 rounded-full bg-teal-neon" />
          <span className="text-balance">{site.available}</span>
        </p>

        <h2 className="font-display text-[clamp(2rem,9vw,3.75rem)] font-bold tracking-tight">
          <span className="text-gradient-animated">{contact.title}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-muted">{contact.text}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <MagneticButton href={`mailto:${contact.email}`}>
            <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
            <span className="break-all">{contact.email}</span>
          </MagneticButton>
        </div>

        <div className="mt-10 flex justify-center gap-5">
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-[border-color,color,box-shadow] duration-300 hover:border-accent/60 hover:text-ink hover:shadow-[0_0_22px_rgba(45,212,191,0.3)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-[border-color,color,box-shadow] duration-300 hover:border-blue-neon/60 hover:text-ink hover:shadow-[0_0_22px_rgba(56,189,248,0.3)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
