import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { dataSchemas, type DataFileName } from "@/data/schema";
import { DATA_DIR, listDataFiles } from "../helpers/content";

describe("every src/data JSON file parses against its registered Zod schema", () => {
  const files = listDataFiles();

  it("data files match the schema registry exactly", () => {
    expect(files.slice().sort()).toEqual(Object.keys(dataSchemas).sort());
  });

  it.each(files)("%s passes schema validation", (file) => {
    const schema = dataSchemas[file as DataFileName];
    expect(schema, `no schema registered for ${file}`).toBeDefined();
    const raw = JSON.parse(readFileSync(path.join(DATA_DIR, file), "utf8"));
    const res = schema.safeParse(raw);
    if (!res.success) {
      throw new Error(JSON.stringify(res.error.issues, null, 2));
    }
    expect(res.success).toBe(true);
  });
});
