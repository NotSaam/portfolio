import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "../data/content";
import type { Project } from "../data/content";
import { staggerContainer, staggerItem } from "../lib/motion";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import DemoModal from "./DemoModal";

/** Evento global para abrir la demo de un proyecto desde fuera (barra de comandos). */
export const OPEN_DEMO_EVENT = "open-project-demo";

export default function Projects() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Project | null>(null);

  // La barra de comandos abre demos con `kair0s`, `phar0s`… (detail = cmd).
  useEffect(() => {
    const onOpen = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      const project = site.projects.find((p) => p.cmd === cmd);
      if (project) setActive(project);
    };
    window.addEventListener(OPEN_DEMO_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DEMO_EVENT, onOpen);
  }, []);

  const featured = site.projects.find((p) => p.featured);
  const dream = site.projects.find((p) => p.dream);
  const rest = site.projects.filter((p) => p !== featured && p !== dream);

  return (
    <Section id="proyectos">
      <SectionHeading
        index="03"
        title="Proyectos"
        subtitle="Productos reales, no maquetas. Primero el que está en producción, al final el que más me ilusiona. Cada tarjeta lleva una demo que recrea la app y se reproduce sola; pulsa para abrirla a tamaño completo."
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

        {dream && (
          <motion.div variants={staggerItem} className="sm:col-span-2">
            <ProjectCard project={dream} featured={false} onOpen={() => setActive(dream)} />
          </motion.div>
        )}
      </motion.div>

      <DemoModal project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
