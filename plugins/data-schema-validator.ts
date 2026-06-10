import type { Plugin } from "vite";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { dataSchemas, type DataFileName } from "../src/data/schema";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
};

function formatPath(p: (string | number)[]): string {
  if (p.length === 0) return "(root)";
  return p
    .map((seg, i) => (typeof seg === "number" ? `[${seg}]` : i === 0 ? String(seg) : `.${seg}`))
    .join("");
}

function formatZodError(file: string, error: z.ZodError): string {
  const header = `${ANSI.red}${ANSI.bold}✖ Invalid content in src/data/${file}${ANSI.reset}`;
  const issues = error.issues.map((iss) => {
    const where = formatPath(iss.path);
    return `  ${ANSI.yellow}•${ANSI.reset} ${ANSI.bold}${where}${ANSI.reset} — ${iss.message}`;
  });
  const hint = `  ${ANSI.dim}fix it in src/data/${file}, save, the dev server will recheck.${ANSI.reset}`;
  return [header, ...issues, hint].join("\n");
}

async function validateOne(
  dataDir: string,
  file: DataFileName,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const fullPath = path.join(dataDir, file);
  let raw: string;
  try {
    raw = await readFile(fullPath, "utf8");
  } catch {
    return {
      ok: false,
      message: `${ANSI.red}${ANSI.bold}✖ Missing data file:${ANSI.reset} src/data/${file}\n  ${ANSI.dim}create it (even an empty stub with { "visible": false, "items": [] } works).${ANSI.reset}`,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      ok: false,
      message: `${ANSI.red}${ANSI.bold}✖ Invalid JSON in src/data/${file}${ANSI.reset}\n  ${(err as Error).message}`,
    };
  }

  const result = dataSchemas[file].safeParse(parsed);
  if (!result.success) {
    return { ok: false, message: formatZodError(file, result.error) };
  }
  return { ok: true };
}

async function validateAll(dataDir: string): Promise<string[]> {
  const files = Object.keys(dataSchemas) as DataFileName[];
  const errors: string[] = [];

  // Warn about unknown JSON files (typo guard)
  try {
    const present = (await readdir(dataDir)).filter((f) => f.endsWith(".json"));
    const known = new Set<string>(files);
    for (const f of present) {
      if (!known.has(f)) {
        console.warn(
          `${ANSI.yellow}⚠ src/data/${f} has no schema — it will not be validated.${ANSI.reset}`,
        );
      }
    }
  } catch {
    /* ignore */
  }

  for (const file of files) {
    const res = await validateOne(dataDir, file);
    if (!res.ok) errors.push(res.message);
  }
  return errors;
}

export function dataSchemaValidator(): Plugin {
  const dataDir = path.resolve(process.cwd(), "src/data");
  let isDev = false;

  const runAndReport = async (
    server?: { ws?: { send: (payload: unknown) => void } } | undefined,
  ) => {
    const errors = await validateAll(dataDir);
    if (errors.length === 0) {
      if (isDev) {
        console.log(
          `${ANSI.green}✓ data schemas OK${ANSI.reset} ${ANSI.dim}(src/data validated)${ANSI.reset}`,
        );
      }
      return;
    }

    const joined = errors.join("\n\n");
    const friendly = `\n${joined}\n`;

    if (isDev && server?.ws) {
      // Show in the browser as a Vite overlay so the user sees it immediately.
      server.ws.send({
        type: "error",
        err: {
          message: `Portfolio data validation failed:\n\n${stripAnsi(joined)}`,
          stack: "",
          plugin: "data-schema-validator",
          id: "src/data/*.json",
        },
      });
      console.error(friendly);
      return;
    }

    // Build time: hard fail with a friendly grouped error.
    throw new Error(friendly);
  };

  return {
    name: "lovable:data-schema-validator",
    configResolved(config) {
      isDev = config.command === "serve";
    },
    async buildStart() {
      await runAndReport();
    },
    configureServer(server) {
      const onChange = (file: string) => {
        if (file.startsWith(dataDir) && file.endsWith(".json")) {
          void runAndReport(server);
        }
      };
      server.watcher.on("change", onChange);
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}

function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}
