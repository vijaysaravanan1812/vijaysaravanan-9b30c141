import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { dataSchemas, type DataFileName } from "@/data/schema";

const TEMPLATE_DIR = path.resolve(__dirname, "../../../public/templates");

describe("public/templates JSON files", () => {
  const files = readdirSync(TEMPLATE_DIR).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_")
  );

  it.each(files)("%s validates against its schema", (file) => {
    const schema = dataSchemas[file as DataFileName];
    expect(schema, `no schema registered for ${file}`).toBeDefined();
    const raw = JSON.parse(readFileSync(path.join(TEMPLATE_DIR, file), "utf8"));
    const res = schema.safeParse(raw);
    if (!res.success) {
      throw new Error(JSON.stringify(res.error.issues, null, 2));
    }
    expect(res.success).toBe(true);
  });

  it("provides a template for every registered schema", () => {
    const expected = Object.keys(dataSchemas).sort();
    expect(files.slice().sort()).toEqual(expected);
  });
});
