export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Start here when tuning how Cosmonaut One feels to control.
export const MOVEMENT_SPEED = 3.3;

export const CAMERA_START = {
  x: 7,
  y: 5.5,
  z: 8,
} as const;

export const CAMERA_TARGET_HEIGHT = 1.25;
export const MODEL_HEIGHT = 2.8;
export const MODEL_URL = `${basePath}/models/cosmonaut.glb`;

