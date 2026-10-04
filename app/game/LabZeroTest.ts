import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CAMERA_START,
  CAMERA_TARGET_HEIGHT,
  MOVEMENT_SPEED,
} from "./config";
import {
  getDirectionForKey,
  getMovement,
  type Direction,
} from "./controls";
import { createWorld } from "./world";

type GameOptions = {
  viewport: HTMLDivElement;
  pressed: Set<Direction>;
  onPositionChange: (x: number, z: number) => void;
};

export type LabZeroTest = {
  reset: () => void;
  destroy: () => void;
};

export function createLabZeroTest({
  viewport,
  pressed,
  onPositionChange,
}: GameOptions): LabZeroTest {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    48,
    viewport.clientWidth / viewport.clientHeight,
    0.1,
    150,
  );
  camera.position.set(CAMERA_START.x, CAMERA_START.y, CAMERA_START.z);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive 3D view of Cosmonaut One",
  );
  viewport.appendChild(renderer.domElement);

  const cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.enableDamping = true;
  cameraControls.dampingFactor = 0.06;
  cameraControls.minDistance = 4.5;
  cameraControls.maxDistance = 18;
  cameraControls.maxPolarAngle = Math.PI * 0.48;
  cameraControls.target.set(0, CAMERA_TARGET_HEIGHT, 0);
  cameraControls.touches.ONE = THREE.TOUCH.ROTATE;
  cameraControls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

  const world = createWorld(scene);

  const moveActor = (x: number, z: number) => {
    world.actor.position.x += x;
    world.actor.position.z += z;

    // The camera follows the actor while preserving the player's orbit angle.
    camera.position.x += x;
    camera.position.z += z;
    cameraControls.target.x += x;
    cameraControls.target.z += z;

    onPositionChange(world.actor.position.x, world.actor.position.z);
  };

  const reset = () => {
    pressed.clear();
    world.actor.position.set(0, 0, 0);
    camera.position.set(CAMERA_START.x, CAMERA_START.y, CAMERA_START.z);
    cameraControls.target.set(0, CAMERA_TARGET_HEIGHT, 0);
    cameraControls.update();
    onPositionChange(0, 0);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const direction = getDirectionForKey(event.key);
    if (direction) {
      event.preventDefault();
      pressed.add(direction);
    }
    if (event.key.toLowerCase() === "r") reset();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const direction = getDirectionForKey(event.key);
    if (direction) pressed.delete(direction);
  };

  const onBlur = () => pressed.clear();

  const onResize = () => {
    if (!viewport.clientWidth || !viewport.clientHeight) return;
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", onResize);

  const timer = new THREE.Timer();
  timer.connect(document);
  let animationFrame = 0;
  const animate = (timestamp?: number) => {
    timer.update(timestamp);
    const delta = Math.min(timer.getDelta(), 0.05);
    const elapsed = timer.getElapsed();
    const movement = getMovement(pressed, MOVEMENT_SPEED * delta);
    if (movement.x || movement.z) moveActor(movement.x, movement.z);

    world.modelAnchor.position.y = Math.sin(elapsed * 1.8) * 0.035;
    world.glowMaterial.opacity = 0.62 + Math.sin(elapsed * 2.2) * 0.12;
    cameraControls.update();
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  };
  animate();

  return {
    reset,
    destroy: () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
      pressed.clear();
      timer.dispose();
      cameraControls.dispose();
      world.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
