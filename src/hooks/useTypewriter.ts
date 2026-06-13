import { useEffect, useState } from "react";

/**
 * Efecto máquina de escribir que rota entre varias frases.
 * Con enabled=false (prefers-reduced-motion) devuelve la primera frase fija.
 */
export function useTypewriter(
  phrases: string[],
  enabled = true,
  typeMs = 65,
  holdMs = 1900,
  deleteMs = 30,
) {
  const [text, setText] = useState(enabled ? "" : phrases[0]);
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setText(phrases[0]);
      return;
    }

    const phrase = phrases[index % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < phrase.length) {
      timer = setTimeout(() => setText(phrase.slice(0, text.length + 1)), typeMs);
    } else if (!deleting) {
      timer = setTimeout(() => setDeleting(true), holdMs);
    } else if (text.length > 0) {
      timer = setTimeout(() => setText(phrase.slice(0, text.length - 1)), deleteMs);
    } else {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases, enabled, typeMs, holdMs, deleteMs]);

  return text;
}
