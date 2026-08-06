"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Direction = "forward" | "back" | "left" | "right";

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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CandlewickLab() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLSpanElement>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const pressedRef = useRef(new Set<Direction>());

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#03040a");
    scene.fog = new THREE.FogExp2("#03040a", 0.025);

    const camera = new THREE.PerspectiveCamera(
      48,
      viewport.clientWidth / viewport.clientHeight,
      0.1,
      150,
    );
    camera.position.set(7, 5.5, 8);

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
      "Interactive 3D view of Candlewick",
    );
    viewport.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4.5;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 1.25, 0);
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

    scene.add(new THREE.HemisphereLight("#e7edff", "#25190f", 2.8));

    const keyLight = new THREE.DirectionalLight("#fff1d2", 5.5);
    keyLight.position.set(5, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#8fb8ff", 2.4);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    const cyanLight = new THREE.PointLight("#00c8ff", 45, 16, 2);
    cyanLight.position.set(-4, 5, 3);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight("#8c35ff", 48, 16, 2);
    violetLight.position.set(4, 3, -3);
    scene.add(violetLight);

    const actor = new THREE.Group();
    scene.add(actor);

    const modelAnchor = new THREE.Group();
    actor.add(modelAnchor);

    const texture = new THREE.TextureLoader().load(
      `${basePath}/candlewick.png`,
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: "#111425",
      roughness: 0.6,
      metalness: 0.35,
    });
    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: "#08263e",
      emissive: "#00a8df",
      emissiveIntensity: 0.22,
      roughness: 0.45,
    });
    const violetMaterial = new THREE.MeshStandardMaterial({
      color: "#261044",
      emissive: "#8b2bff",
      emissiveIntensity: 0.25,
      roughness: 0.45,
    });
    const portraitMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.5,
      metalness: 0.15,
    });

    const loadingPlaceholder = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 2.7, 2.7),
      [
        cyanMaterial,
        violetMaterial,
        darkMaterial,
        darkMaterial,
        portraitMaterial,
        portraitMaterial,
      ],
    );
    loadingPlaceholder.position.y = 1.35;
    loadingPlaceholder.castShadow = true;
    loadingPlaceholder.receiveShadow = true;
    modelAnchor.add(loadingPlaceholder);

    let cosmonaut: THREE.Group | null = null;
    const modelLoader = new GLTFLoader();
    modelLoader.load(
      `${basePath}/models/cosmonaut.glb`,
      (gltf) => {
        cosmonaut = gltf.scene;
        cosmonaut.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const sourceBounds = new THREE.Box3().setFromObject(cosmonaut);
        const sourceSize = sourceBounds.getSize(new THREE.Vector3());
        if (sourceSize.y > 0) {
          cosmonaut.scale.setScalar(2.8 / sourceSize.y);
        }

        cosmonaut.updateMatrixWorld(true);
        const scaledBounds = new THREE.Box3().setFromObject(cosmonaut);
        const center = scaledBounds.getCenter(new THREE.Vector3());
        cosmonaut.position.set(-center.x, -scaledBounds.min.y, -center.z);

        modelAnchor.remove(loadingPlaceholder);
        loadingPlaceholder.geometry.dispose();
        modelAnchor.add(cosmonaut);
      },
      undefined,
      (error) => {
        console.error("Could not load the cosmonaut model", error);
      },
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#7625ff",
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const baseGlow = new THREE.Mesh(
      new THREE.RingGeometry(1.65, 1.78, 64),
      glowMaterial,
    );
    baseGlow.rotation.x = -Math.PI / 2;
    baseGlow.position.y = 0.015;
    actor.add(baseGlow);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 70),
      new THREE.MeshStandardMaterial({
        color: "#050711",
        roughness: 0.88,
        metalness: 0.15,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(70, 70, "#6b24dd", "#102850");
    grid.position.y = 0.012;
    const gridMaterials = Array.isArray(grid.material)
      ? grid.material
      : [grid.material];
    gridMaterials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.42;
    });
    scene.add(grid);

    const markerGeometry = new THREE.BufferGeometry();
    const markerPositions: number[] = [];
    for (let index = 0; index < 90; index += 1) {
      markerPositions.push(
        (Math.random() - 0.5) * 50,
        Math.random() * 14 + 2,
        (Math.random() - 0.5) * 50,
      );
    }
    markerGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(markerPositions, 3),
    );
    const markers = new THREE.Points(
      markerGeometry,
      new THREE.PointsMaterial({
        color: "#4d72ff",
        size: 0.045,
        transparent: true,
        opacity: 0.75,
      }),
    );
    scene.add(markers);

    const updatePositionLabel = () => {
      if (positionRef.current) {
        positionRef.current.textContent = `X ${actor.position.x.toFixed(
          1,
        )} · Z ${actor.position.z.toFixed(1)}`;
      }
    };

    const moveActor = (x: number, z: number) => {
      actor.position.x += x;
      actor.position.z += z;
      camera.position.x += x;
      camera.position.z += z;
      controls.target.x += x;
      controls.target.z += z;
      updatePositionLabel();
    };

    const reset = () => {
      actor.position.set(0, 0, 0);
      camera.position.set(7, 5.5, 8);
      controls.target.set(0, 1.25, 0);
      controls.update();
      updatePositionLabel();
    };
    resetRef.current = reset;

    const onKeyDown = (event: KeyboardEvent) => {
      const direction =
        directionKeys[event.key] ?? directionKeys[event.key.toLowerCase()];
      if (direction) {
        event.preventDefault();
        pressedRef.current.add(direction);
      }
      if (event.key.toLowerCase() === "r") reset();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction =
        directionKeys[event.key] ?? directionKeys[event.key.toLowerCase()];
      if (direction) pressedRef.current.delete(direction);
    };

    const onResize = () => {
      if (!viewport.clientWidth || !viewport.clientHeight) return;
      camera.aspect = viewport.clientWidth / viewport.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewport.clientWidth, viewport.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    const timer = new THREE.Timer();
    timer.connect(document);
    let animationFrame = 0;
    const animate = (timestamp?: number) => {
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.05);
      const elapsed = timer.getElapsed();
      const speed = 3.3 * delta;
      let x = 0;
      let z = 0;
      if (pressedRef.current.has("left")) x -= speed;
      if (pressedRef.current.has("right")) x += speed;
      if (pressedRef.current.has("forward")) z -= speed;
      if (pressedRef.current.has("back")) z += speed;
      if (x || z) moveActor(x, z);

      modelAnchor.position.y = Math.sin(elapsed * 1.8) * 0.035;
      glowMaterial.opacity =
        0.62 + Math.sin(elapsed * 2.2) * 0.12;
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      timer.dispose();
      controls.dispose();
      renderer.dispose();
      texture.dispose();
      if (cosmonaut) {
        cosmonaut.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry.dispose();
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => material.dispose());
        });
      } else {
        loadingPlaceholder.geometry.dispose();
      }
      viewport.removeChild(renderer.domElement);
      resetRef.current = null;
    };
  }, []);

  const press = (direction: Direction) => (event: React.PointerEvent) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pressedRef.current.add(direction);
  };

  const release = (direction: Direction) => () => {
    pressedRef.current.delete(direction);
  };

  const movementButton = (
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
    <main className="lab-shell">
      <div className="scene" ref={viewportRef} />
      <div className="scene-vignette" aria-hidden="true" />

      <header className="lab-header">
        <div className="brand-mark">
          <span className="brand-pixel" aria-hidden="true" />
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
          Candlewick
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
        <button type="button" onClick={() => resetRef.current?.()}>
          Reset view <kbd>R</kbd>
        </button>
      </aside>

      <div className="camera-hint">
        <span className="mouse-icon" aria-hidden="true" />
        <span className="desktop-hint">Drag to orbit · Scroll to zoom</span>
        <span className="mobile-hint">Drag to orbit · Pinch to zoom</span>
      </div>

      <section className="movement-panel" aria-label="Movement controls">
        <div className="movement-copy">
          <span>Move Candlewick</span>
          <small>WASD / ARROW KEYS</small>
        </div>
        <div className="d-pad">
          {movementButton("forward", "forward", "↑", "move-up")}
          {movementButton("left", "left", "←", "move-left")}
          <div className="d-pad-center" aria-hidden="true" />
          {movementButton("right", "right", "→", "move-right")}
          {movementButton("back", "backward", "↓", "move-down")}
        </div>
      </section>

      <div className="scanline" aria-hidden="true" />
    </main>
  );
}
