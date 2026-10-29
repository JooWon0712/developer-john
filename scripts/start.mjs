import { cpSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, ".next", "standalone");
const server = path.join(output, "server.js");

if (!existsSync(server)) {
  console.error("프로덕션 빌드가 없습니다. npm run build를 먼저 실행하세요.");
  process.exit(1);
}

// Next.js standalone output excludes these assets; Docker performs the same copies.
cpSync(path.join(root, "public"), path.join(output, "public"), { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(output, ".next", "static"), { recursive: true });

process.env.HOSTNAME ??= "127.0.0.1";
process.env.PORT ??= "3000";
await import(pathToFileURL(server).href);
