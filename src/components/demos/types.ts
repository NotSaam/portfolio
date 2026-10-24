/**
 * Contrato común de TODAS las demos animadas.
 *
 * Cada demo es `export default function XDemo(props: DemoProps)` y:
 *  - usa `useReducedMotion()` + `useAutoSteps(DURATIONS, { enabled: !reduce, playing })`
 *  - rellena su contenedor (`h-full w-full`) y se ve bien tanto a tamaño completo
 *    (modal ~640×440) como reducida (teaser dentro de una tarjeta)
 *  - su ÚLTIMO paso es un fotograma final coherente (lo que se ve con reduce-motion)
 */
export interface DemoProps {
  /**
   * Si `false`, la demo se congela en el paso actual (no avanza ni reinicia).
   * Lo usa el teaser de la tarjeta para pausar fuera de pantalla / sin hover.
   * Por defecto `true` (autoplay en bucle).
   */
  playing?: boolean;
}
