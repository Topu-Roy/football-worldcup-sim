import { copyFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkgDir = path.join(root, "node_modules", "harfbuzzjs");

for (const file of ["hb.wasm", "hb-subset.wasm"]) {
  const target = path.join(pkgDir, file);
  if (!existsSync(target)) {
    copyFileSync(path.join(root, "vendor", "harfbuzzjs", file), target);
    console.log(`patched harfbuzzjs: restored ${file}`);
  }
}

// bun truncates large native binaries on install; restore from vendor copy
const resvgTarget = path.join(
  root,
  "node_modules",
  "@resvg",
  "resvg-js-win32-x64-msvc",
  "resvgjs.win32-x64-msvc.node",
);
const resvgVendor = path.join(root, "vendor", "resvgjs.win32-x64-msvc.node");
if (existsSync(path.dirname(resvgTarget)) && statSize(resvgTarget) !== statSize(resvgVendor)) {
  copyFileSync(resvgVendor, resvgTarget);
  console.log("patched @resvg/resvg-js: restored win32-x64 binary");
}

function statSize(file) {
  try {
    return statSync(file).size;
  } catch {
    return -1;
  }
}
