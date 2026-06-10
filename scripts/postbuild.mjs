#!/usr/bin/env node
// Generates dist/client/index.html from the built client assets so static hosts
// (Netlify, GitHub Pages) have a root document to serve. TanStack Start's
// Nitro static preset emits assets but no shell HTML.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CLIENT_DIR = "dist/client";
const ASSETS_DIR = join(CLIENT_DIR, "assets");
const BASE_PATH = process.env.BASE_PATH ?? "/";
const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;

if (!existsSync(ASSETS_DIR)) {
  console.error(`[postbuild] ${ASSETS_DIR} does not exist; nothing to do.`);
  process.exit(1);
}

const assets = readdirSync(ASSETS_DIR);
const js =
  assets.find((f) => /^(index|client|entry).*\.js$/.test(f)) ??
  assets.find((f) => f.endsWith(".js"));
const css = assets.find((f) => f.endsWith(".css"));

if (!js) {
  console.error("[postbuild] Could not locate a client JS entry in assets/.");
  process.exit(1);
}

const cssTag = css ? `\n  <link rel="stylesheet" href="${base}assets/${css}"/>` : "";

// TanStack Start's client entry unconditionally calls hydrate(router), which
// throws "Invariant failed: Expected to find bootstrap data on window.$_TSR"
// when the SSR bootstrap script is missing. For a pure static SPA we inject a
// minimal window.$_TSR shim with an empty matches/manifest so the hydrate
// path takes the "SPA mode" branch and falls through to router.load(), which
// then matches the current URL client-side.
const tsrBootstrap = `
  <script>
    window.$_TSR = {
      matches: [],
      router: { matches: [], manifest: { routes: {} }, dehydratedData: undefined, lastMatchId: "__root__" },
      buffer: [],
      initialized: false,
      t: new Map(),
    };
  </script>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Vijay Saravanan</title>${cssTag}${tsrBootstrap}
  <link rel="modulepreload" href="${base}assets/${js}"/>
  <script type="module" src="${base}assets/${js}"></script>
</head>
<body><div id="root"></div></body>
</html>
`;


writeFileSync(join(CLIENT_DIR, "index.html"), html);
console.log(
  `[postbuild] Wrote ${CLIENT_DIR}/index.html (base="${base}", js="${js}", css="${css ?? "none"}")`,
);
