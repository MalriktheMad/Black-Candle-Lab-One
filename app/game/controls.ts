export type Direction = "forward" | "back" | "left" | "right";

const directionKeys: Record<string, Direction> = {
  ArrowUp: "forward",
  w: "forward",
  ArrowDown: "back",
  s: "back",
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
};

export function getDirectionForKey(key: string) {
  return directionKeys[key] ?? directionKeys[key.toLowerCase()];
}

export function getMovement(
  pressed: ReadonlySet<Direction>,
  distance: number,
) {
  let x = 0;
  let z = 0;

  if (pressed.has("left")) x -= 1;
  if (pressed.has("right")) x += 1;
  if (pressed.has("forward")) z -= 1;
  if (pressed.has("back")) z += 1;

  // Normalizing keeps diagonal movement from being faster than straight movement.
  const length = Math.hypot(x, z);
  if (length === 0) return { x: 0, z: 0 };

  return {
    x: (x / length) * distance,
    z: (z / length) * distance,
  };
}

