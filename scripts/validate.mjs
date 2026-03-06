import fs from "fs";
import path from "path";

const root = process.cwd();
const indexPath = path.join(root, "index.json");
let files = [];
try {
  const indexObj = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  if (indexObj && Array.isArray(indexObj.files)) {
    files = indexObj.files;
  }
} catch {}
if (!files.length) {
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

function checkStructure(obj) {
  const keys = [
    "签号",
    "签名",
    "签文类型",
    "卦象",
    "生肖",
    "签文简介",
    "家宅运势",
    "岁君签",
    "生意",
    "出外",
    "谋望求财",
    "学艺功名",
    "行舟六畜",
    "移徙",
    "行人",
    "婚姻",
    "官讼",
    "失物",
    "占病",
    "其他"
  ];
  const warnings = [];
  keys.forEach((k) => {
    if (!(k in obj)) warnings.push(`missing key: ${k}`);
  });
  if ("签文简介" in obj && typeof obj["签文简介"] !== "object") {
    warnings.push("签文简介 should be object");
  }
  if ("岁君签" in obj) {
    const v = obj["岁君签"];
    if (v && typeof v === "object" && "年龄运势" in v) {
      const arr = v["年龄运势"];
      if (!Array.isArray(arr)) warnings.push("年龄运势 should be array");
    }
  }
  return warnings;
}

const results = [];
let okCount = 0;
let warnCount = 0;
let errCount = 0;

for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    results.push({ file: f, status: "error", detail: "missing file" });
    errCount++;
    continue;
  }
  const r = readJson(p);
  if (!r.ok) {
    results.push({ file: f, status: "error", detail: r.error });
    errCount++;
    continue;
  }
  const warns = checkStructure(r.obj);
  if (warns.length) {
    results.push({ file: f, status: "warn", detail: warns });
    warnCount++;
  } else {
    results.push({ file: f, status: "ok" });
    okCount++;
  }
}

console.log(
  JSON.stringify(
    { summary: { ok: okCount, warn: warnCount, error: errCount }, results },
    null,
    2
  )
);
