import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data/content";
import { staggerContainer, staggerItem } from "../lib/motion";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

/** Iconos (uno por pilar, en orden de content.focus). */
const ICONS = [
  // Seguridad — escudo
  "M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z",
  // IA — chip
  "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z",
  // Arquitectura — capas
  "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  // DevOps — caja
  "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
];

export default function Focus() {
  const reduce = useReducedMotion();

  return (
    <Section id="enfoque">
      <SectionHeading
        index="02"
        title="En qué me enfoco"
        subtitle="Cuatro pilares que aplico en cada proyecto. No solo escribo código: entrego producto que funciona, resiste y se despliega."
      />

      <motion.div
        variants={staggerContainer}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {site.focus.map((area, i) => (
          <motion.div
            key={area.title}
            variants={staggerItem}
            className="hud-corners group rounded-2xl border border-line bg-panel-2/70 p-6 transition-colors duration-300 hover:border-accent/40"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/15">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS[i]} />
                </svg>
              </span>
              <h3 className="min-w-0 font-display text-base font-semibold text-balance text-ink sm:text-lg">{area.title}</h3>
              <span className="ml-auto shrink-0 font-mono text-xs text-faint">0{i + 1}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{area.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
