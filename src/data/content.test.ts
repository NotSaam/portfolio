import { describe, expect, it } from "vitest";
import { site } from "./content";
import { demoRegistry } from "../components/demos/registry";

describe("content", () => {
  it("marca un único proyecto como destacado", () => {
    expect(site.projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it("cada demo referenciada existe en el registro", () => {
    for (const p of site.projects) {
      if (p.demo) expect(demoRegistry).toHaveProperty(p.demo);
    }
  });

  it("solo los proyectos soñados llevan hoja de ruta", () => {
    for (const p of site.projects) {
      if (p.roadmap) expect(p.dream).toBe(true);
    }
  });

  it("los enlaces de la navegación apuntan a anclas", () => {
    for (const n of site.nav) expect(n.href).toMatch(/^#[a-z-]+$/);
  });

  it("los enlaces externos usan https", () => {
    const urls = [
      site.contact.github,
      site.contact.linkedin,
      ...site.projects.flatMap((p) => [p.link, p.repo]),
    ].filter((u): u is string => Boolean(u) && u !== "#");
    for (const u of urls) expect(u).toMatch(/^https:\/\//);
  });
});
