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
  /** Cifras/hechos verificables que se muestran como mini-KPIs (solo featured). */
  highlights?: { value: string; label: string }[];
  /** true = "proyecto soñado": tarjeta ancha final con hoja de ruta. */
  dream?: boolean;
  /** Hitos de la hoja de ruta (solo dream). */
  roadmap?: { id: string; label: string; state: "done" | "doing" | "next" }[];
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
      "Mi proyecto principal es KAIR0S, una plataforma SaaS multi-club de carga, lesiones y vídeo para equipos de fútbol, ya en producción. Antes construí FLK0S, un ecosistema de operaciones de ciberseguridad con SSO, MFA y RBAC, y en paralelo persigo el proyecto soñado: flkOS, mi propio sistema operativo, hecho a mi gusto y optimizado.",
      "Curso un máster en ciberseguridad: una mirada ofensiva y defensiva que aplico a todo lo que construyo. Código que funciona y, además, resiste.",
    ],
    /** Líneas de la tarjeta tipo terminal. cmd=true → línea de comando */
    terminal: [
      { cmd: true, text: "whoami" },
      { cmd: false, text: "samuel 'flako' fuentes — full-stack engineer" },
      { cmd: true, text: "cat stack.txt" },
      { cmd: false, text: "next · react · python · fastapi · postgres · supabase · rust" },
      { cmd: true, text: "ls ~/proyectos" },
      { cmd: false, text: "kair0s/  flk0s/  reservas/  flkos/" },
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
      kind: "SaaS · Deporte · En producción",
      title: "KAIR0S",
      problem:
        "Clubes que gestionan carga, lesiones y vídeo en hojas de cálculo sueltas → un solo panel, del GPS al clip del partido.",
      description:
        "Plataforma multi-club para cuerpos técnicos de fútbol. Los jugadores responden RPE y wellness desde el móvil, el staff importa el GPS (Catapult / STATSports) y KAIR0S calcula sola la carga semanal y el ACWR. Etiquetado de partido con seis teclas, mapa de tiros, alineaciones y clips cortados con ffmpeg en un ZIP por carpetas. Cada club solo ve sus datos: aislamiento con Row-Level Security en Postgres, no en la UI.",
      tags: ["Next.js 16", "React 19", "Supabase", "PostgreSQL · RLS", "FastAPI", "FFmpeg", "PWA"],
      highlights: [
        { value: "6 teclas", label: "etiquetar un partido entero" },
        { value: "RLS", label: "aislamiento real por club" },
        { value: "2 GPS", label: "Catapult y STATSports" },
        { value: "3 roles", label: "preparador · entrenador · jugador" },
      ],
      demo: "kairos",
      featured: true,
      repo: "https://github.com/NotSaam/kair0s-showcase",
      link: "https://kair0s.es/r/web",
    },
    {
      kind: "Ciberseguridad · SOC",
      title: "FLK0S",
      problem:
        "5 herramientas de seguridad inconexas → un solo ecosistema con SSO, IA y observabilidad e2e.",
      description:
        "Ecosistema unificado de operaciones de ciberseguridad: Blue Team (detección como código, MITRE ATT&CK, conectores SIEM), Red Team con agentes de IA, copiloto con RAG y reporting CVSS, todo bajo un único SSO con MFA y RBAC. Release Candidate v1.0.",
      tags: ["Next.js 14", "FastAPI", "PostgreSQL", "Docker", "OpenTelemetry", "SSO/MFA"],
      demo: "flk0s",
      repo: "https://github.com/NotSaam/FLK0S-Ecosystem",
    },
    {
      kind: "App web · Reservas",
      title: "Reserva de clases con profesores",
      problem:
        "Cuadrar horarios profe–familia por chat es un caos → reservas con disponibilidad real y confirmación al instante.",
      description:
        "Las familias eligen asignatura, franja libre y modalidad (online o presencial) en un asistente paso a paso; el profesor acepta o rechaza desde su panel y cada paso llega por email. Control transaccional contra dobles reservas y cancelación con enlace único.",
      tags: ["Next.js 16", "TypeScript", "Prisma", "Auth.js", "Zod", "Tailwind"],
      demo: "reservas",
    },
    {
      kind: "Sistema operativo · El proyecto soñado",
      title: "flkOS",
      wip: true,
      dream: true,
      problem:
        "Ningún sistema operativo está hecho a mi medida → construir el mío: rápido, coherente y pensado hasta el último detalle.",
      description:
        "Mi sistema operativo de escritorio, diseñado desde cero a mi gusto: identidad visual propia, escritorio FLK sobre Wayland, servicios del sistema en Rust (broker D-Bus con Polkit, actualizaciones y snapshots Btrfs con rollback) y apps propias como Ajustes y Archivos. Optimizado con presupuestos de rendimiento estrictos para ir fluido desde 4 GB de RAM.",
      tags: ["Rust", "Wayland", "Btrfs", "D-Bus", "Tauri", "x86_64 UEFI"],
      roadmap: [
        { id: "M0", label: "Cimientos", state: "done" },
        { id: "M1", label: "Servicios del sistema", state: "done" },
        { id: "M2", label: "Escritorio FLK", state: "doing" },
        { id: "M3", label: "Instalador", state: "next" },
        { id: "M4", label: "Apps propias", state: "next" },
        { id: "M5", label: "ISO firmada", state: "next" },
        { id: "M6", label: "Uso diario", state: "next" },
      ],
      demo: "flakos",
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
      skills: ["Python", "FastAPI", "PostgreSQL", "Supabase", "Redis"],
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
