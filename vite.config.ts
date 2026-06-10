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

// Force a static Nitro build when the user runs `bun run build` themselves
// (Netlify / GitHub Pages / any static host). Inside the Lovable sandbox the
// preset is force-pinned to Cloudflare regardless of what we pass here, so
// this is safe.
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
    // nitro/vite builds from this
    server: { entry: "server" },
    router: { basepath: BASE_PATH },
    client: { base: BASE_PATH },
    // Prerender the homepage (and any reachable internal links) to real .html files
    // so static hosts (GH Pages / Netlify) have an index.html to serve.
    pages: [{ path: "/" }],
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
  vite: {
    base: BASE_PATH,
    plugins: [dataSchemaValidator()],
  },
});
