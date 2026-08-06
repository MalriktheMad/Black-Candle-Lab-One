import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the Cosmonaut One prototype wired to its required assets", async () => {
  const [component, layout] = await Promise.all([
    readFile(new URL("app/CandlewickLab.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    access(new URL("public/candlewick.png", projectRoot)),
    access(new URL("public/Candlewick/candlewick1.png", projectRoot)),
    access(new URL("public/Candlewick/candlewick2.png", projectRoot)),
    access(new URL("public/Candlewick/candlewick3.png", projectRoot)),
  ]);

  assert.match(component, /candlewick\.png/);
  assert.match(component, /brand-candlewick/);
  assert.match(component, /OrbitControls/);
  assert.match(layout, /Cosmonaut One Field Test/);
});
