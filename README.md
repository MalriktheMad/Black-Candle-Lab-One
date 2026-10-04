# Black Candle Lab One

A small, mobile-first 3D experiment starring Cosmonaut One.

## What this prototype teaches

- A Three.js scene, camera, renderer, lights, and meshes
- A 2D image used as a texture on a 3D box
- Orbit and pinch controls for the camera
- Keyboard and touch controls for moving an object
- Responsive interface design for phones

## Run it

Install the dependencies, then start the development server:

```bash
pnpm install
pnpm dev
```

Open the local address printed in the terminal. Drag to orbit, scroll or pinch
to zoom, and use WASD, arrow keys, or the on-screen direction pad to move.

To make the private development server available to phones on the same network:

```bash
pnpm dev --hostname 0.0.0.0
```

Open the network address printed by Next.js on the phone.

## Publishing

Pushes to `main` automatically build and publish a static copy through GitHub
Pages. The workflow lives in `.github/workflows/deploy-pages.yml`.

## Project map

- `app/CosmonautLab.tsx` contains the page interface.
- `app/components/` contains the touch controls and animated brand.
- `app/game/config.ts` contains movement speed, camera, and model settings.
- `app/game/controls.ts` maps keys and calculates movement.
- `app/game/LabZeroTest.ts` runs input, movement, camera, and rendering.
- `app/game/world.ts` builds the lights, floor, grid, and cosmonaut model.
- `public/` contains the generated cosmonaut model and sharing artwork.
- `tests/` verifies the rendered page.
- `.github/workflows/` publishes the public GitHub Pages copy.
- `.git/` is the hidden local Git history.
