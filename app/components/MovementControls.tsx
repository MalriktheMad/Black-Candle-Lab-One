import type { PointerEvent } from "react";
import type { Direction } from "../game/controls";

type Props = {
  pressed: Set<Direction>;
};

export function MovementControls({ pressed }: Props) {
  const press = (direction: Direction) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pressed.add(direction);
  };

  const release = (direction: Direction) => () => pressed.delete(direction);

  const button = (
    direction: Direction,
    label: string,
    symbol: string,
    className: string,
  ) => (
    <button
      className={`move-button ${className}`}
      aria-label={`Move ${label}`}
      onPointerDown={press(direction)}
      onPointerUp={release(direction)}
      onPointerCancel={release(direction)}
      onLostPointerCapture={release(direction)}
      type="button"
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );

  return (
    <section className="movement-panel" aria-label="Movement controls">
      <div className="movement-copy">
        <span>Move Cosmonaut One</span>
        <small>WASD / ARROW KEYS</small>
      </div>
      <div className="d-pad">
        {button("forward", "forward", "↑", "move-up")}
        {button("left", "left", "←", "move-left")}
        <span className="d-pad-center" aria-hidden="true" />
        {button("right", "right", "→", "move-right")}
        {button("back", "backward", "↓", "move-down")}
      </div>
    </section>
  );
}
