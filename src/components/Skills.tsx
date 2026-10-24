import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { site } from "../data/content";
import { T_QUICK } from "../lib/motion";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const chip: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: T_QUICK },
};

export default function Skills() {
  const reduce = useReducedMotion();

  return (
    <Section id="habilidades">
      <SectionHeading index="04" title="Stack" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {site.skills.map((group, i) => (
          <Reveal key={group.area} delay={i * 0.12}>
            <div
              className={`h-full rounded-2xl border bg-panel-2/80 p-5 transition-colors duration-300 sm:p-7 ${
                group.placeholder
                  ? "border-dashed border-line"
                  : "border-line hover:border-line-bright"
              }`}
            >
              <h3 className="text-balance font-display text-lg font-semibold sm:text-xl">
                <span className="text-accent">{"// "}</span>
                {group.area}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{group.tagline}</p>

              <motion.ul
                variants={list}
                initial={reduce ? "show" : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-6 flex flex-wrap gap-2.5"
              >
                {group.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={chip}
                    className={`rounded-lg border px-3.5 py-2 font-mono text-sm transition-[border-color,box-shadow,transform] duration-200 ${
                      group.placeholder
                        ? "border-dashed border-line text-muted/60"
                        : "border-line bg-night/60 text-ink/85 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_0_18px_rgba(45,212,191,0.25)]"
                    }`}
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>

              {group.placeholder && (
                <p className="mt-5 font-mono text-xs text-muted/60">
                  → edita src/data/content.ts para rellenar esta sección
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
