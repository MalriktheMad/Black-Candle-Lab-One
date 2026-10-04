"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedBrand } from "./components/AnimatedBrand";
import { MovementControls } from "./components/MovementControls";
import {
  createLabZeroTest,
  type LabZeroTest,
} from "./game/LabZeroTest";
import type { Direction } from "./game/controls";

export function CosmonautLab() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLSpanElement>(null);
  const gameRef = useRef<LabZeroTest | null>(null);
  const [pressed] = useState(() => new Set<Direction>());

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    gameRef.current = createLabZeroTest({
      viewport,
      pressed,
      onPositionChange: (x, z) => {
        if (positionRef.current) {
          positionRef.current.textContent = `X ${x.toFixed(1)} · Z ${z.toFixed(1)}`;
        }
      },
    });

    return () => {
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, [pressed]);

  return (
    <main className="lab-shell">
      <div className="scene" ref={viewportRef} />
      <div className="scene-vignette" aria-hidden="true" />

      <header className="lab-header">
        <div className="brand-mark">
          <AnimatedBrand />
          <span>Black Candle</span>
        </div>
        <div className="lab-number">LAB / 01</div>
      </header>

      <section className="intro-panel" aria-labelledby="lab-title">
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          Prototype online
        </p>
        <h1 id="lab-title">
          Cosmonaut One
          <span>Field Test</span>
        </h1>
        <p className="intro-copy">
          A first experiment in moving through a three-dimensional space.
        </p>
      </section>

      <aside className="readout" aria-label="Object position">
        <span className="readout-label">Position</span>
        <span className="readout-value" ref={positionRef}>
          X 0.0 · Z 0.0
        </span>
        <button type="button" onClick={() => gameRef.current?.reset()}>
          Reset view <kbd>R</kbd>
        </button>
      </aside>

      <div className="camera-hint">
        <span className="mouse-icon" aria-hidden="true" />
        <span className="desktop-hint">Drag to orbit · Scroll to zoom</span>
        <span className="mobile-hint">Drag to orbit · Pinch to zoom</span>
      </div>

      <MovementControls pressed={pressed} />
      <div className="scanline" aria-hidden="true" />
    </main>
  );
}
