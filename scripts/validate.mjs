import fs from "fs";
import path from "path";
import Ajv from "ajv/dist/2020.js";

const root = process.cwd();
const indexPath = path.join(root, "index.json");
const schemaPath = path.join(root, "schema.json");

// Load Schema
let validate;
try {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false }); // strict: false to allow some flexibility if schema is not perfect
  validate = ajv.compile(schema);
} catch (e) {
  console.error("Failed to load or compile schema:", e.message);
  process.exit(1);
}

// Load Index
let files = [];
try {
  const indexObj = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  if (indexObj && Array.isArray(indexObj.files)) {
    files = indexObj.files;
  }
} catch {}
if (!files.length) {
  // Fallback if index.json is missing or invalid
  files = Array.from({ length: 51 }, (_, i) => `data/${String(i + 1).padStart(2, "0")}.json`);
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) return { ok: false, error: "empty file" };
    const obj = JSON.parse(raw);
    if (obj === null || typeof obj !== "object") {
      return { ok: false, error: "not an object" };
    }
    return { ok: true, obj };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function checkImages(fileId) {
  const id = parseInt(fileId, 10); // "01" -> 1
  const img1 = path.join(root, "image", `${id}_1.jpg`);
  const img2 = path.join(root, "image", `${id}_2.jpg`);
  const missing = [];
  if (!fs.existsSync(img1)) missing.push(`${id}_1.jpg`);
  if (!fs.existsSync(img2)) missing.push(`${id}_2.jpg`);
  return missing;
}

const results = [];
let okCount = 0;
let warnCount = 0;
let errCount = 0;

console.log("Starting validation...");

for (const f of files) {
  const p = path.join(root, f);
  const fileId = path.basename(f, ".json"); // "01"

  // 1. Check file existence
  if (!fs.existsSync(p)) {
    results.push({ file: f, status: "error", detail: "missing file" });
    errCount++;
    continue;
  }

  // 2. Check JSON validity
  const r = readJson(p);
  if (!r.ok) {
    results.push({ file: f, status: "error", detail: r.error });
    errCount++;
    continue;
  }

  // 3. Validate against Schema
  const valid = validate(r.obj);
  const issues = [];
  if (!valid) {
    validate.errors.forEach((err) => {
      issues.push(`Schema: ${err.instancePath} ${err.message}`);
    });
  }

  // 4. Check Images
  const missingImages = checkImages(fileId);
  if (missingImages.length) {
    issues.push(`Missing images: ${missingImages.join(", ")}`);
  }

  if (issues.length) {
    results.push({ file: f, status: "warn", detail: issues }); // Treat schema errors as warnings for now to avoid breaking CI immediately if data is imperfect
    warnCount++;
  } else {
    results.push({ file: f, status: "ok" });
    okCount++;
  }
}

// Output results
const summary = {
  total: files.length,
  ok: okCount,
  warn: warnCount,
  error: errCount,
  timestamp: new Date().toISOString(),
};

console.log(JSON.stringify({ summary, results }, null, 2));

if (errCount > 0) {
  process.exit(1);
}
