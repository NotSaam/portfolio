import { useEffect, useState } from "react";
import { site } from "../data/content";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";

/** Barra de navegación fija: transparente arriba, con blur al hacer scroll */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPalette = () => window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line/70 bg-night/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-6"
      >
        <a href="#inicio" className="shrink-0 font-mono text-sm font-medium text-ink">
          <span className="text-teal-neon">~</span>/flako
          <span className="type-cursor text-accent">_</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Disparador del command palette */}
          <button
            type="button"
            onClick={openPalette}
            aria-label="Abrir paleta de comandos"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel/60 px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <kbd className="rounded border border-line-bright bg-night px-1 py-0.5 text-[10px]">⌘K</kbd>
          </button>
        </div>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-muted hover:text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Panel móvil */}
      {open && (
        <ul className="border-t border-line/60 px-5 py-3 sm:px-6 md:hidden">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex min-h-[44px] items-center text-sm text-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Acceso táctil al command palette (sin teclado) */}
          <li className="mt-1 border-t border-line/50 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openPalette();
              }}
              className="flex min-h-[44px] w-full items-center gap-2 text-left font-mono text-sm text-muted hover:text-ink"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Buscar
              <kbd className="ml-auto rounded border border-line-bright bg-night px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
          </li>
        </ul>
      )}
    </header>
  );
}
