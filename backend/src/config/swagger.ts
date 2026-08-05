import fs from "fs";
import path from "path";
import YAML from "yaml";

/** Loads and parses the hand-written OpenAPI 3.0 spec at docs/openapi.yaml. */
export function loadOpenApiDocument(): Record<string, unknown> {
  const filePath = path.join(__dirname, "..", "..", "docs", "openapi.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  return YAML.parse(raw) as Record<string, unknown>;
}
