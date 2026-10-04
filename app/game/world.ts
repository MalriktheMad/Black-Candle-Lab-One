import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { basePath, MODEL_HEIGHT, MODEL_URL } from "./config";

type World = {
  actor: THREE.Group;
  modelAnchor: THREE.Group;
  glowMaterial: THREE.MeshBasicMaterial;
  dispose: () => void;
};

function disposeMaterial(material: THREE.Material) {
  material.dispose();
}

export function createWorld(scene: THREE.Scene): World {
  scene.background = new THREE.Color("#03040a");
  scene.fog = new THREE.FogExp2("#03040a", 0.025);

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

  const texture = new THREE.TextureLoader().load(`${basePath}/candlewick.png`);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const placeholderMaterials = [
    new THREE.MeshStandardMaterial({
      color: "#08263e",
      emissive: "#00a8df",
      emissiveIntensity: 0.22,
      roughness: 0.45,
    }),
    new THREE.MeshStandardMaterial({
      color: "#261044",
      emissive: "#8b2bff",
      emissiveIntensity: 0.25,
      roughness: 0.45,
    }),
    new THREE.MeshStandardMaterial({
      color: "#111425",
      roughness: 0.6,
      metalness: 0.35,
    }),
    new THREE.MeshStandardMaterial({
      color: "#111425",
      roughness: 0.6,
      metalness: 0.35,
    }),
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.5,
      metalness: 0.15,
    }),
    new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 0.5,
      metalness: 0.15,
    }),
  ];

  const loadingPlaceholder = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 2.7, 2.7),
    placeholderMaterials,
  );
  loadingPlaceholder.position.y = 1.35;
  loadingPlaceholder.castShadow = true;
  loadingPlaceholder.receiveShadow = true;
  modelAnchor.add(loadingPlaceholder);

  let disposed = false;
  let cosmonaut: THREE.Group | null = null;

  new GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      if (disposed) return;

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
        cosmonaut.scale.setScalar(MODEL_HEIGHT / sourceSize.y);
      }

      cosmonaut.updateMatrixWorld(true);
      const scaledBounds = new THREE.Box3().setFromObject(cosmonaut);
      const center = scaledBounds.getCenter(new THREE.Vector3());
      cosmonaut.position.set(-center.x, -scaledBounds.min.y, -center.z);

      modelAnchor.remove(loadingPlaceholder);
      loadingPlaceholder.geometry.dispose();
      placeholderMaterials.forEach(disposeMaterial);
      texture.dispose();
      modelAnchor.add(cosmonaut);
    },
    undefined,
    (error) => console.error("Could not load the cosmonaut model", error),
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

  return {
    actor,
    modelAnchor,
    glowMaterial,
    dispose: () => {
      disposed = true;
      loadingPlaceholder.geometry.dispose();
      placeholderMaterials.forEach(disposeMaterial);
      texture.dispose();

      if (cosmonaut) {
        cosmonaut.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry.dispose();
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach(disposeMaterial);
        });
      }

      baseGlow.geometry.dispose();
      glowMaterial.dispose();
      floor.geometry.dispose();
      disposeMaterial(floor.material);
      grid.geometry.dispose();
      gridMaterials.forEach(disposeMaterial);
      markerGeometry.dispose();
      disposeMaterial(markers.material);
    },
  };
}

