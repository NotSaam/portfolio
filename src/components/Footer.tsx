import { site } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line-bright/50 px-5 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-center font-mono text-xs text-muted sm:px-6">
      <p className="flex flex-wrap items-center justify-center gap-2 text-balance">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-neon/70 pulse-ring" aria-hidden />
        © {new Date().getFullYear()} · {site.footer}
      </p>
    </footer>
  );
}
