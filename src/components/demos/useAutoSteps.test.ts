import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAutoSteps } from "./useAutoSteps";

// Identidad estable, como pide el hook.
const DURATIONS = [100, 200, 300] as const;

// Cada paso programa su temporizador tras renderizar: avanzar de uno en uno.
function advance(...ms: number[]) {
  for (const m of ms) {
    act(() => {
      vi.advanceTimersByTime(m);
    });
  }
}

describe("useAutoSteps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("avanza un paso al terminar la duración del paso actual", () => {
    const { result } = renderHook(() => useAutoSteps(DURATIONS));
    expect(result.current.step).toBe(0);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.step).toBe(1);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.step).toBe(2);
    expect(result.current.isLast).toBe(true);
  });

  it("vuelve al primer paso con loop", () => {
    const { result } = renderHook(() => useAutoSteps(DURATIONS));
    advance(100, 200, 300);
    expect(result.current.step).toBe(0);
  });

  it("se queda en el último paso sin loop", () => {
    const { result } = renderHook(() => useAutoSteps(DURATIONS, { loop: false }));
    advance(100, 200, 300, 300);
    expect(result.current.step).toBe(2);
  });

  it("salta al fotograma final con reduced motion", () => {
    const { result } = renderHook(() => useAutoSteps(DURATIONS, { enabled: false }));
    expect(result.current.step).toBe(2);
  });

  it("congela el paso en pausa y continúa al reanudar", () => {
    const { result, rerender } = renderHook(
      ({ playing }) => useAutoSteps(DURATIONS, { playing }),
      { initialProps: { playing: true } },
    );
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.step).toBe(1);

    rerender({ playing: false });
    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    expect(result.current.step).toBe(1);

    rerender({ playing: true });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.step).toBe(2);
  });

  it("restart vuelve al paso 0", () => {
    const { result } = renderHook(() => useAutoSteps(DURATIONS));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => {
      result.current.restart();
    });
    expect(result.current.step).toBe(0);
  });
});
