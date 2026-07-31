import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("keeps the Candlewick prototype wired to its required assets", async () => {
  const [component, layout] = await Promise.all([
    readFile(new URL("app/CandlewickLab.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    access(new URL("public/candlewick.png", projectRoot)),
    access(new URL("public/og.png", projectRoot)),
  ]);

  assert.match(component, /candlewick\.png/);
  assert.match(component, /OrbitControls/);
  assert.match(layout, /Candlewick Field Test/);
});
