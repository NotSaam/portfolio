import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import { site } from "../data/content";
import { useTypewriter } from "../hooks/useTypewriter";
import { staggerContainer, staggerItem } from "../lib/motion";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const typed = useTypewriter(site.typingPhrases, !reduce);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = sectionRef.current;
    if (!el || reduce) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 sm:px-6"
    >
      {/* Spotlight reactivo al cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(620px circle at var(--mx, 50%) var(--my, 38%), rgba(45,212,191,0.12), transparent 65%)",
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Disponibilidad */}
        <motion.p
          variants={staggerItem}
          className="mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-panel/60 px-4 py-1.5 font-mono text-[clamp(0.625rem,2.4vw,0.75rem)] tracking-widest text-muted uppercase backdrop-blur"
        >
          <span className="pulse-ring relative inline-block h-2 w-2 shrink-0 rounded-full bg-teal-neon" />
          <span className="text-balance">{site.available}</span>
        </motion.p>

        {/* Nombre (legible) — tipografía fluida, nunca desborda a 320px */}
        <motion.h1
          variants={staggerItem}
          className="font-display text-[clamp(2.75rem,18vw,9rem)] font-bold leading-[0.95] tracking-tight"
        >
          <span className="glitch text-gradient-animated" data-text={site.name}>
            {site.name}
          </span>
        </motion.h1>

        {/* Rol: quién soy en 5 segundos */}
        <motion.p
          variants={staggerItem}
          className="mt-5 text-balance font-display text-[clamp(1.05rem,4.5vw,1.5rem)] font-semibold tracking-tight text-ink"
        >
          {site.role}
        </motion.p>

        {/* Frase grande */}
        <motion.p
          variants={staggerItem}
          className="mx-auto mt-5 max-w-2xl text-pretty text-[clamp(0.95rem,3.5vw,1.125rem)] text-muted"
        >
          {site.heroLine}
        </motion.p>

        {/* Línea typing de focos — discreta, no compite con el nombre */}
        <motion.p
          variants={staggerItem}
          aria-hidden
          className="mt-4 min-h-6 truncate font-mono text-xs text-faint sm:text-sm"
        >
          <span className="text-teal-neon">&gt; </span>
          {typed}
          <span className="type-cursor text-accent">▍</span>
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <MagneticButton href="#proyectos">Ver proyectos</MagneticButton>
          <MagneticButton href="#contacto" variant="ghost">
            Hablemos
          </MagneticButton>
        </motion.div>

        <motion.p variants={staggerItem} className="mt-8 hidden font-mono text-xs text-faint sm:block">
          pulsa{" "}
          <kbd className="rounded border border-line-bright bg-panel px-1.5 py-0.5 text-muted">⌘K</kbd>{" "}
          para navegar
        </motion.p>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.a
        href="#sobre-mi"
        aria-label="Ir a la sección sobre mí"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted transition-colors hover:text-ink"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.a>
    </section>
  );
}
