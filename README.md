# Flako — Portfolio

Portfolio personal single-page: desarrollo de aplicaciones web + ciberseguridad.

**Stack:** React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · Framer Motion

## Arrancar en local

Requisitos: Node.js 18+.

```bash
npm install
npm run dev      # → http://localhost:5173
```

Otros comandos:

```bash
npm run build    # typecheck + build de producción en /dist
npm run preview  # sirve la build de producción en local
```

## Editar el contenido

Todo el texto, proyectos, habilidades y enlaces viven en **un solo fichero**:

```
src/data/content.ts
```

Busca los comentarios `← EDITAR` para localizar los placeholders pendientes:

- **Email, GitHub y LinkedIn** en `contact`.
- **Enlaces de demo/repo** de cada proyecto (`link` / `repo`).
- **Textos de KAIR0S, FLAK0S y Reservas**: descripciones y tags con datos
  plausibles; ajústalos a tu realidad (stack exacto, qué hace cada uno).
- **Proyectos de ciberseguridad**: hay dos tarjetas con `placeholder: true`;
  sustitúyelas por proyectos reales (quita el flag y rellena los campos).
- **Habilidades de ciberseguridad**: grupo con `placeholder: true` en `skills`.

## Demos interactivas

Cada proyecto destacado lleva un campo `demo` (`"kairos" | "flakos" | "reservas"`).
Si está presente, la tarjeta muestra **▶ Ver demo interactiva**, que abre un modal
con una mini-UI **animada que se reproduce sola** (estilo clip de producto de
LinkedIn, pero nativo e interactivo): marcador en vivo de KAIR0S, arranque del SO
FLAK0S en una terminal, y el flujo de reserva de Reservas.

- Las animaciones viven en `src/components/demos/` (una por proyecto).
- Todas usan el reproductor por pasos `useAutoSteps` y respetan
  `prefers-reduced-motion` (saltan al fotograma final sin animar).
- **Añadir una demo nueva**: crea `XDemo.tsx` (copia la estructura de
  `ReservasDemo.tsx`), regístrala en `demos/registry.ts`, añade su id al tipo
  `DemoId` en `content.ts` y pon `demo: "x"` en el proyecto.
- El modal vive en `DemoModal.tsx`: cierre con Esc / clic fuera, botón de
  reinicio, y enlaces a `código` / `abrir →` cuando `repo`/`link` no son `#`.

## Estructura

```
src/
├── data/content.ts        ← textos, proyectos, skills, enlaces (editar aquí)
├── hooks/useTypewriter.ts ← efecto typing del hero
├── components/
│   ├── AuroraBackground   ← fondo animado (aurora + rejilla)
│   ├── ScrollProgress     ← barra de progreso superior
│   ├── Navbar / Footer
│   ├── Hero               ← typing + spotlight que sigue al cursor
│   ├── About              ← bio + tarjeta terminal
│   ├── Projects / ProjectCard ← tarjetas con tilt 3D, glow y botón de demo
│   ├── DemoModal          ← visor de demos interactivas (Esc / clic fuera)
│   ├── demos/             ← una demo animada por proyecto + registro
│   │   ├── useAutoSteps   ← reproductor por pasos (autoplay + reduce-motion)
│   │   ├── registry       ← id de demo → componente
│   │   ├── KairosDemo     ← marcador de fútbol en vivo
│   │   ├── FlakosDemo     ← arranque del SO en terminal (QEMU)
│   │   └── ReservasDemo   ← flujo de reserva en móvil
│   ├── Skills             ← chips agrupados por área
│   ├── Contact
│   └── Reveal / MagneticButton / Section / SectionHeading (reutilizables)
└── index.css              ← tokens de diseño (colores, fuentes) y keyframes
```

## Accesibilidad y rendimiento

- Todas las animaciones respetan `prefers-reduced-motion`.
- HTML semántico, `aria-label` en iconos y navegación, foco visible.
- Sin librerías pesadas: solo Framer Motion sobre React; animaciones de fondo
  en CSS puro (GPU-friendly: `transform` + `filter`).

## Desplegar

### Vercel

1. Sube el repo a GitHub.
2. En [vercel.com](https://vercel.com) → *New Project* → importa el repo.
3. Framework preset: **Vite** (lo detecta solo). Build `npm run build`, output `dist`.

### Netlify

1. *New site from Git* → selecciona el repo.
2. Build command: `npm run build` · Publish directory: `dist`.

En ambos casos no hace falta configuración extra: es un sitio 100% estático.
