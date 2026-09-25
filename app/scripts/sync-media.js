import fs from "node:fs";
import path from "node:path";

const docsDir = path.resolve("..", "docs");
const publicDir = path.resolve("public");

for (const name of ["images", "videos"]) {
    const destination = path.join(publicDir, name);
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(path.join(docsDir, name), destination, { recursive: true });
}
