import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/** Contenedor de sección con ancho, padding y offset de anclaje consistentes */
export default function Section({ id, className = "", children }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-6 sm:py-24 md:py-28 ${className}`}
    >
      {children}
    </section>
  );
}
