import { useCallback, useEffect, useState } from "react";

/**
 * Reproductor por pasos para las demos animadas.
 *
 * Avanza por una secuencia de pasos según `durations` (ms por paso) y, si
 * `loop`, vuelve a empezar.
 *
 * - `enabled = false` (prefers-reduced-motion): salta directo al último paso =
 *   fotograma final estático, sin animación.
 * - `playing = false`: CONGELA en el paso actual (no avanza ni reinicia). Al
 *   volver a `true`, continúa desde ese paso. Lo usan los teasers para pausar
 *   fuera de pantalla / sin hover, sin perder el estado.
 *
 * IMPORTANTE: pasa `durations` como constante a nivel de módulo (identidad
 * estable) para no reprogramar el temporizador en cada render.
 */
export function useAutoSteps(
  durations: readonly number[],
  {
    loop = true,
    enabled = true,
    playing = true,
  }: { loop?: boolean; enabled?: boolean; playing?: boolean } = {},
) {
  const [step, setStep] = useState(0);

  const restart = useCallback(() => setStep(0), []);

  useEffect(() => {
    // Reduce-motion: directo al fotograma final, sin temporizadores.
    if (!enabled) {
      setStep(durations.length - 1);
      return;
    }
    // Pausa: no programar el siguiente paso; conservar el actual.
    if (!playing) return;

    const id = setTimeout(() => {
      setStep((s) => {
        const next = s + 1;
        if (next < durations.length) return next;
        return loop ? 0 : s;
      });
    }, durations[step]);

    return () => clearTimeout(id);
  }, [step, enabled, playing, loop, durations]);

  return { step, restart, isLast: step === durations.length - 1 };
}
