// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { dataSchemaValidator } from "./plugins/data-schema-validator";

// Base path for static hosting under a subpath (e.g. GitHub Pages project sites).
// Set BASE_PATH=/your-repo-name/ in CI for GitHub Pages; leave unset for root-hosted
// deploys (Netlify, custom domains, Lovable hosting).
const BASE_PATH = process.env.BASE_PATH ?? "/";

// Static build for Netlify / GitHub Pages / any static host.
// A `postbuild` script in package.json synthesizes dist/client/index.html from
// the emitted client assets so the static host has a root document to serve.
export default defineConfig({
  nitro: {
    preset: "static",
    output: {
      dir: "dist",
      publicDir: "dist/client",
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    router: { basepath: BASE_PATH },
  },
  vite: {
    base: BASE_PATH,
    plugins: [dataSchemaValidator()],
  },
});
