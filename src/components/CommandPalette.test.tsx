import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import CommandPalette, { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { site } from "../data/content";

beforeAll(() => {
  // jsdom no implementa scrollIntoView ni matchMedia (useReducedMotion).
  Element.prototype.scrollIntoView = vi.fn();
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as typeof window.matchMedia;
});

function openPalette() {
  act(() => {
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  });
}

describe("CommandPalette", () => {
  it("está cerrada al inicio", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("se abre con Ctrl+K", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Paleta de comandos" })).toBeInTheDocument();
  });

  it("se abre con el evento global y lista los proyectos", () => {
    render(<CommandPalette />);
    openPalette();
    for (const p of site.projects) {
      expect(screen.getByRole("option", { name: new RegExp(p.title) })).toBeInTheDocument();
    }
  });

  it("filtra por texto, incluidas las etiquetas del proyecto", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    openPalette();
    await user.type(screen.getByLabelText("Buscar"), "rust");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("flkOS");
  });

  it("muestra un aviso cuando no hay resultados", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    openPalette();
    await user.type(screen.getByLabelText("Buscar"), "zzzz");
    expect(screen.getByText("sin resultados")).toBeInTheDocument();
  });

  it("navega con las flechas y ejecuta con Enter", async () => {
    const user = userEvent.setup();
    const target = document.createElement("section");
    target.id = "proyectos";
    document.body.appendChild(target);

    render(<CommandPalette />);
    openPalette();
    const input = screen.getByLabelText("Buscar");
    await user.type(input, "proyectos");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");
    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
  });

  it("se cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    openPalette();
    await user.click(screen.getByLabelText("Buscar"));
    await user.keyboard("{Escape}");
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
