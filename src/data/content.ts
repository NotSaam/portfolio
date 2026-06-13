/**
 * ÚNICO fichero que necesitas editar para cambiar textos, proyectos,
 * habilidades y enlaces. Los componentes leen todo de aquí.
 *
 * Busca los comentarios "← EDITAR" para localizar los placeholders.
 */

/** Identificadores de las demos interactivas (animadas en navegador). */
export type DemoId = "flk0s" | "kairos" | "flakos" | "reservas";

export interface Project {
  /** Etiqueta pequeña sobre el título (p. ej. "App web", "Ciberseguridad") */
  kind: string;
  title: string;
  /** Una línea problema → solución, lo primero que se lee de la tarjeta. */
  problem: string;
  description: string;
  tags: string[];
  /** URL de la demo en vivo. "#" = placeholder */
  link?: string;
  /** URL del repositorio. "#" = placeholder */
  repo?: string;
  /** id de la demo interactiva; si está, la tarjeta muestra preview + "Ver demo" */
  demo?: DemoId;
  /** true = tarjeta destacada (ancha, preview en autoplay). Marca solo UNA. */
  featured?: boolean;
  /** true = badge honesto "En desarrollo / WIP". */
  wip?: boolean;
  /** true = tarjeta "hueco reservado" con estilo punteado */
  placeholder?: boolean;
}

export interface SkillGroup {
  area: string;
  tagline: string;
  skills: string[];
  placeholder?: boolean;
}

export interface FocusArea {
  title: string;
  text: string;
}

export const site = {
  name: "Flako",
  realName: "Samuel Fuentes",
  /** Rol/subtítulo: quién soy en 5 segundos. */
  role: "Full-Stack Engineer · IA · Ciberseguridad",
  /** Banner discreto de disponibilidad. */
  available: "Disponible para oportunidades y colaboración técnica",

  /** Frase grande del hero. */
  heroLine:
    "Construyo plataformas completas de extremo a extremo — frontend, backend, IA, seguridad e infraestructura.",

  /** Etiquetas cortas que rota el efecto typing del hero. */
  typingPhrases: [
    "frontend + backend",
    "IA aplicada",
    "seguridad por diseño",
    "infra reproducible",
  ],

  /** Para <meta> y lectores: descripción corta. */
  tagline: "Full-Stack Engineer · IA · Ciberseguridad",

  nav: [
    { label: "Sobre mí", href: "#sobre-mi" },
    { label: "Enfoque", href: "#enfoque" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Stack", href: "#habilidades" },
    { label: "Contacto", href: "#contacto" },
  ],

  about: {
    paragraphs: [
      "Soy Samuel —Flako—, Full-Stack Engineer. Construyo productos completos de extremo a extremo: del modelo de datos y la API hasta la interfaz, pasando por la IA y la seguridad. Trabajo sobre todo con Python, FastAPI y el ecosistema React/Next.js.",
      "Mi proyecto de referencia es FLK0S, un ecosistema de operaciones de ciberseguridad con SSO, MFA, RBAC y observabilidad de serie. También entreno IA de visión por computador (KAIR0S) y, por gusto, desarrollo FLAK0S, mi propio sistema operativo desde cero.",
      "Curso un máster en ciberseguridad: una mirada ofensiva y defensiva que aplico a todo lo que construyo. Código que funciona y, además, resiste.",
    ],
    /** Líneas de la tarjeta tipo terminal. cmd=true → línea de comando */
    terminal: [
      { cmd: true, text: "whoami" },
      { cmd: false, text: "samuel 'flako' fuentes — full-stack engineer" },
      { cmd: true, text: "cat stack.txt" },
      { cmd: false, text: "next · react · python · fastapi · postgres · pytorch · c" },
      { cmd: true, text: "ls ~/proyectos" },
      { cmd: false, text: "flk0s/  kair0s/  reservas/  flak0s/" },
      { cmd: true, text: "status --formacion" },
      { cmd: false, text: "máster en ciberseguridad [█████░░ en curso]" },
    ],
  },

  /** Sección "En qué me enfoco": 4 pilares. */
  focus: [
    {
      title: "Seguridad de serie",
      text: "SSO, MFA, RBAC, multi-tenancy y trazas de auditoría. La seguridad va desde el diseño, no parcheada al final.",
    },
    {
      title: "IA aplicada",
      text: "Visión por computador, agentes y automatización que resuelven trabajo real, con revisión humana donde importa.",
    },
    {
      title: "Arquitectura full-stack",
      text: "Del modelo de datos a la UI, con observabilidad incluida. Una sola plataforma coherente, no piezas sueltas.",
    },
    {
      title: "DevOps",
      text: "Docker, instalación reproducible y monorepo. Lo que construyo se levanta y se despliega sin sorpresas.",
    },
  ] satisfies FocusArea[] as FocusArea[],

  projects: [
    {
      kind: "Ciberseguridad · SOC",
      title: "FLK0S",
      problem:
        "5 herramientas de seguridad inconexas → un solo ecosistema con SSO, IA y observabilidad e2e.",
      description:
        "Ecosistema unificado de operaciones de ciberseguridad: defensa (CDP), Red Team, copiloto de IA y reporting bajo un único SSO. Centro de Operaciones con KPIs cross-app, RBAC, multi-tenant y observabilidad de extremo a extremo.",
      tags: ["Next.js 14", "FastAPI", "PostgreSQL", "Docker", "OpenTelemetry", "SSO/MFA"],
      demo: "flk0s",
      featured: true,
      repo: "https://github.com/NotSaam/FLK0S-Ecosystem",
      link: "#", // ← EDITAR: demo en vivo si la hay
    },
    {
      kind: "IA · Visión · Deporte",
      title: "KAIR0S",
      problem:
        "Etiquetar los eventos de un partido a mano es lentísimo → IA que detecta y recorta cada jugada sola.",
      description:
        "Análisis de vídeo de fútbol con IA: subes el partido y el detector marca goles, córners, faltas y saques con su nivel de confianza, y genera los clips listos para revisar y exportar como dataset de entrenamiento.",
      tags: ["Python", "FastAPI", "Next.js", "PyTorch", "ONNX", "FFmpeg"],
      demo: "kairos",
      repo: "https://github.com/NotSaam/FlakAI",
      link: "#", // ← EDITAR
    },
    {
      kind: "App web · Tiempo real",
      title: "Reserva de clases con profesores",
      problem:
        "Cuadrar horarios profe–familia por chat es un caos → reservas con disponibilidad real y confirmación al instante.",
      description:
        "Plataforma donde alumnos y familias ven la disponibilidad real de cada profesor, reservan una franja y reciben la confirmación en tiempo real. Gestión de horarios, reservas y avisos vía WebSockets.",
      tags: ["Python", "Flask", "React", "WebSockets"],
      demo: "reservas",
      repo: "#", // ← EDITAR: aún sin repo público
      link: "#", // ← EDITAR
    },
    {
      kind: "Sistema operativo · Bajo nivel",
      title: "FLAK0S",
      wip: true,
      problem:
        "Entender de verdad cómo funciona un ordenador → construir un SO usable desde cero.",
      description:
        "Mi sistema operativo desde cero: bootloader en ASM, kernel en C y gestión de memoria. La visión es un SO funcional para uso diario; hoy en fase temprana (arranque + shell). Proyecto vivo que iré ampliando.",
      tags: ["C", "Assembly", "x86", "Kernel"],
      demo: "flakos",
      repo: "#", // ← EDITAR: aún sin repo público
      link: "#", // ← EDITAR
    },
  ] satisfies Project[] as Project[],

  skills: [
    {
      area: "Frontend",
      tagline: "Interfaces rápidas y accesibles",
      skills: ["Next.js", "React", "TypeScript", "Tailwind"],
    },
    {
      area: "Backend",
      tagline: "APIs y datos",
      skills: ["Python", "FastAPI", "PostgreSQL", "Redis"],
    },
    {
      area: "IA",
      tagline: "Visión por computador y agentes",
      skills: ["PyTorch", "ONNX", "Visión por computador", "Agentes"],
    },
    {
      area: "DevOps / Observabilidad",
      tagline: "Reproducible y observable",
      skills: ["Docker", "OpenTelemetry", "Grafana", "Prometheus"],
    },
  ] satisfies SkillGroup[] as SkillGroup[],

  contact: {
    title: "¿Hablamos?",
    text: "Busco oportunidades como ingeniero full-stack (software, IA y ciberseguridad) y colaboraciones técnicas. Si encaja, escríbeme.",
    email: "samufuentesp@gmail.com",
    github: "https://github.com/NotSaam",
    linkedin: "https://www.linkedin.com/in/notsaam",
  },

  /**
   * Intro de arranque (BootIntro). Se muestra 1 vez por sesión.
   * Ajusta el ritmo con charMs/lineMs/holdMs (duración total ≈ 3 s).
   */
  boot: {
    lines: [
      "cargando módulos",
      "montando /proyectos",
      "inicializando perfil",
      "iniciando interfaz",
    ],
    charMs: 36, // velocidad de tecleo del prompt "$ boot --portfolio"
    lineMs: 400, // tiempo entre líneas (incluye su "[ ok ]")
    holdMs: 420, // pausa final antes de entrar al hero
  },

  footer: "Diseñado y construido por Samuel 'Flako' Fuentes",
};
