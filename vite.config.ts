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

// Static SPA build for Netlify / GitHub Pages / any static host.
// We use TanStack Start's built-in SPA mode (`spa.enabled` + `spa.prerender.enabled`)
// to generate a single index.html shell that mounts the React app client-side.
// This avoids Nitro's route-by-route prerender crawler (which 404s when the
// router basepath doesn't exactly match `/`) and produces the index.html that
// GitHub Pages / Netlify need at the root of the published directory.
export default defineConfig({
  nitro: {
    preset: "static",
    output: {
      dir: "dist",
      publicDir: "dist/client",
    },
    // Disable Nitro's static-preset auto-prerender. It crawls "/" by default,
    // which 404s when the TanStack router is mounted under a basepath. We let
    // TanStack Start's own SPA prerender (below) write the index.html instead.
    prerender: { crawlLinks: false, routes: [] },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    router: { basepath: BASE_PATH },
    // SPA mode: render a single static HTML shell that mounts the React app
    // client-side. outputPath "/index" makes the shell land at
    // <publicDir>/index.html — the file GitHub Pages / Netlify serve at the
    // site root. maskPath "/" matches our index route inside the router.
    spa: {
      enabled: true,
      maskPath: "/",
      prerender: { enabled: true, crawlLinks: false, outputPath: "/index" },
    },
  },
  vite: {
    base: BASE_PATH,
    plugins: [dataSchemaValidator()],
  },
});
