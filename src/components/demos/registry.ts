import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import type { DemoId } from "../../data/content";
import type { DemoProps } from "./types";

/**
 * id de demo → componente animado, cargado de forma perezosa (code-splitting).
 * Cada demo vive en su propio chunk: no entran en el bundle inicial; se piden
 * cuando una tarjeta entra en viewport o se abre su modal.
 * Envuelve siempre en <Suspense> al renderizar.
 */
export const demoRegistry: Record<DemoId, LazyExoticComponent<ComponentType<DemoProps>>> = {
  flk0s: lazy(() => import("./FlkosSocDemo")),
  kairos: lazy(() => import("./KairosDemo")),
  flakos: lazy(() => import("./FlakosDemo")),
  reservas: lazy(() => import("./ReservasDemo")),
};
