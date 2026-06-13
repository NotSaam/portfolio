import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data/content";
import type { Project } from "../data/content";
import { staggerContainer, staggerItem } from "../lib/motion";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import DemoModal from "./DemoModal";

export default function Projects() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Project | null>(null);

  const featured = site.projects.find((p) => p.featured);
  const rest = site.projects.filter((p) => p !== featured);

  return (
    <Section id="proyectos">
      <SectionHeading
        index="03"
        title="Proyectos"
        subtitle="Productos reales, no maquetas. Cada tarjeta lleva una demo que recrea la app de verdad y se reproduce sola; pulsa para abrirla a tamaño completo."
      />

      <motion.div
        variants={staggerContainer}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {featured && (
          <motion.div variants={staggerItem} className="sm:col-span-2">
            <ProjectCard project={featured} featured onOpen={() => setActive(featured)} />
          </motion.div>
        )}

        {rest.map((project) => (
          <motion.div variants={staggerItem} key={project.title}>
            <ProjectCard
              project={project}
              featured={false}
              onOpen={() => setActive(project)}
            />
          </motion.div>
        ))}
      </motion.div>

      <DemoModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
