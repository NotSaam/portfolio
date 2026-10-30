/**
 * ÚNICO fichero que necesitas editar para cambiar textos, proyectos,
 * habilidades y enlaces. Los componentes leen todo de aquí.
 *
 * Busca los comentarios "← EDITAR" para localizar los placeholders.
 */

/** Identificadores de las demos interactivas (animadas en navegador). */
export type DemoId = "flk0s" | "kairos" | "flakos" | "reservas" | "krit0s" | "synk0s" | "pont0s";

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
  /** Estado real del proyecto: lo muestran el HUD lateral y la barra de comandos. */
  status: { label: string; tone: "live" | "rc" | "mvp" | "wip" };
  /** Comando corto de la barra (p. ej. "kair0s"). */
  cmd: string;
}

/** Secciones en orden de página: las usan el HUD y la barra de comandos. */
export const sections = [
  { id: "inicio", index: "00", label: "inicio" },
  { id: "sobre-mi", index: "01", label: "sobre-mí" },
  { id: "enfoque", index: "02", label: "enfoque" },
  { id: "proyectos", index: "03", label: "proyectos" },
  { id: "habilidades", index: "04", label: "stack" },
  { id: "contacto", index: "05", label: "contacto" },
] as const;

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
      "Mi proyecto principal es KAIR0S, una plataforma SaaS multi-club de carga, lesiones y vídeo para equipos de fútbol, ya en producción. Antes construí PHAR0S, un ecosistema de operaciones de ciberseguridad con SSO, MFA y RBAC, y en paralelo persigo el proyecto soñado: Flak0S, mi propio sistema operativo, hecho a mi gusto y optimizado.",
      "Curso un máster en ciberseguridad: una mirada ofensiva y defensiva que aplico a todo lo que construyo. Código que funciona y, además, resiste.",
    ],
    /** Líneas de la tarjeta tipo terminal. cmd=true → línea de comando */
    terminal: [
      { cmd: true, text: "whoami" },
      { cmd: false, text: "samuel 'flako' fuentes — full-stack engineer" },
      { cmd: true, text: "cat stack.txt" },
      { cmd: false, text: "next · react · python · fastapi · postgres · supabase · rust" },
      { cmd: true, text: "ls ~/proyectos" },
      { cmd: false, text: "kair0s/  krit0s/  synk0s/  pont0s/  phar0s/  ment0r/  flak0s/" },
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
      status: { label: "en producción", tone: "live" },
      cmd: "kair0s",
      repo: "https://github.com/NotSaam/kair0s-showcase",
      link: "https://kair0s.es/r/web",
    },
    {
      kind: "Ciberseguridad · Reporting de pentest",
      title: "KRIT0S",
      problem:
        "Informes de pentest en Word y CVSS calculado a mano → del hallazgo al veredicto en una sola plataforma.",
      description:
        "Plataforma full-stack para consultoras de seguridad: proyectos con alcance y equipo, hallazgos puntuados con una calculadora CVSS 3.1 que el servidor recalcula siempre, biblioteca de plantillas OWASP y PDF generado en una cola Redis como versión inmutable con huella SHA-256. RBAC con Policies (admin, pentester y cliente con portal de solo lectura) y auditoría append-only. 60 tests Pest y CI sobre PostgreSQL real.",
      tags: ["Laravel 12", "Vue 3", "Inertia", "TypeScript", "PostgreSQL", "Redis", "Pest", "Docker"],
      demo: "krit0s",
      status: { label: "MVP · v1", tone: "mvp" },
      cmd: "krit0s",
      repo: "https://github.com/NotSaam/KRIT0S",
      link: "https://krit0s.vercel.app",
    },
    {
      kind: "App web · Tiempo real",
      title: "SYNK0S",
      problem:
        "Tableros que hay que recargar para ver lo que hizo el equipo → un kanban donde cada cambio llega al resto en milisegundos.",
      description:
        "Kanban colaborativo sin registro: compartes el enlace y trabajáis a la vez con cursores en vivo, avatares de presencia y aviso de quién edita cada tarjeta. UI optimista con patches idempotentes, ordenación fraccional para mover tarjetas tocando una sola fila y servidor Socket.IO propio que valida cada operación con Zod, aísla tableros (anti-IDOR) y aplica rate limiting. 17 tests, incluido uno de integración con dos clientes reales.",
      tags: ["Next.js 15", "React 19", "TypeScript", "Socket.IO", "SQLite · Drizzle", "Zod", "dnd-kit", "Vitest"],
      demo: "synk0s",
      status: { label: "demo en vivo", tone: "live" },
      cmd: "synk0s",
      repo: "https://github.com/NotSaam/SYNK0S",
      link: "https://synk0s.onrender.com",
    },
    {
      kind: "Open source · Web pública",
      title: "PONT0S",
      problem:
        "Ver cómo está el mar exige saltar entre webs de cámaras y de previsión → toda la costa gallega en directo, con su tiempo, olas y marea, en una sola página.",
      description:
        "38 cámaras en 32 puntos de Ribadeo a A Guarda que se ven dentro de la web: fotos de MeteoGalicia y Windy que se renuevan solas y directos que arrancan con un clic. Cada punto trae el tiempo y el mar de Open-Meteo (olas, mar de fondo, agua, UV y la curva de la marea de hoy) y la bandera azul y la calidad del agua oficiales. El mapa es una carta náutica de noche dibujada en SVG con la costa de OpenStreetMap. Web estática en español y gallego, sin cookies ni claves, y una tarea semanal que comprueba que cada cámara sigue viva.",
      tags: ["Astro 7", "TypeScript", "Open-Meteo", "SVG", "OpenStreetMap", "i18n es/gl", "GitHub Actions"],
      demo: "pont0s",
      status: { label: "en línea", tone: "live" },
      cmd: "pont0s",
      repo: "https://github.com/NotSaam/PONT0S",
      link: "https://pont0s.vercel.app",
    },
    {
      kind: "Ciberseguridad · SOC",
      title: "PHAR0S",
      problem:
        "5 herramientas de seguridad inconexas → un solo ecosistema con SSO, IA y observabilidad e2e.",
      description:
        "Ecosistema unificado de operaciones de ciberseguridad: Blue Team (detección como código, MITRE ATT&CK, conectores SIEM), Red Team con agentes de IA, copiloto con RAG y reporting CVSS, todo bajo un único SSO con MFA y RBAC. Release Candidate v1.0.",
      tags: ["Next.js 14", "FastAPI", "PostgreSQL", "Docker", "OpenTelemetry", "SSO/MFA"],
      demo: "flk0s",
      status: { label: "RC v1.0", tone: "rc" },
      cmd: "phar0s",
      repo: "https://github.com/NotSaam/FLK0S-Ecosystem",
    },
    {
      kind: "App web · Reserva de clases",
      title: "MENT0R",
      problem:
        "Cuadrar horarios profe–familia por chat es un caos → reservas con disponibilidad real y confirmación al instante.",
      description:
        "Las familias eligen asignatura, franja libre y modalidad (online o presencial) en un asistente paso a paso; el profesor acepta o rechaza desde su panel y cada paso llega por email. Control transaccional contra dobles reservas y cancelación con enlace único.",
      tags: ["Next.js 16", "TypeScript", "Prisma", "Auth.js", "Zod", "Tailwind"],
      demo: "reservas",
      status: { label: "MVP", tone: "mvp" },
      cmd: "ment0r",
    },
    {
      kind: "Sistema operativo · El proyecto soñado",
      title: "Flak0S",
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
      status: { label: "M2 · escritorio", tone: "wip" },
      cmd: "flak0s",
    },
  ] satisfies Project[] as Project[],

  skills: [
    {
      area: "Frontend",
      tagline: "Interfaces rápidas y accesibles",
      skills: ["Next.js", "React", "Vue", "TypeScript", "Tailwind"],
    },
    {
      area: "Backend",
      tagline: "APIs y datos",
      skills: ["Python", "FastAPI", "PHP · Laravel", "PostgreSQL", "Supabase", "Redis"],
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
