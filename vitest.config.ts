import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: ["src/test/setup.ts"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "test-results/junit.xml",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/__tests__/**",
        "src/test/**",
        "src/routeTree.gen.ts",
        "src/components/ui/**",
        "src/routes/**",
        "src/router.tsx",
        "src/server.ts",
        "src/start.ts",
        "src/lib/**",
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
});

