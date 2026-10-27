import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTypewriter } from "./useTypewriter";

const PHRASES = ["ab", "xyz"];

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra la primera frase fija sin animación (reduced motion)", () => {
    const { result } = renderHook(() => useTypewriter(PHRASES, false));
    expect(result.current).toBe("ab");
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(result.current).toBe("ab");
  });

  it("escribe la frase letra a letra", () => {
    const { result } = renderHook(() => useTypewriter(PHRASES, true, 100, 500, 50));
    expect(result.current).toBe("");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("ab");
  });

  it("borra la frase y pasa a la siguiente", () => {
    const { result } = renderHook(() => useTypewriter(PHRASES, true, 100, 500, 50));
    // escribir "ab" (2 × 100 ms) + pausa (500 ms) + borrar (2 × 50 ms)
    for (const ms of [100, 100, 500, 50, 50]) {
      act(() => {
        vi.advanceTimersByTime(ms);
      });
    }
    expect(result.current).toBe("");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("x");
  });
});
