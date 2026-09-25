import fs from "node:fs";
import path from "node:path";
import config from "../site.config.mjs";

const publicDir = path.join(config.appDir, "public");

const countFiles = (dir) => fs.readdirSync(dir).filter((name) => !name.startsWith(".")).length;

for (const name of ["images", "videos"]) {
    const source = path.join(config.docsDir, name);

    if (!fs.existsSync(source)) {
        continue;
    }

    // 先拷到临时目录，成功后再替换，避免复制失败时留下空目录
    const destination = path.join(publicDir, name);
    const staging = `${destination}.tmp`;

    fs.rmSync(staging, { recursive: true, force: true });
    fs.cpSync(source, staging, { recursive: true });
    fs.rmSync(destination, { recursive: true, force: true });
    fs.renameSync(staging, destination);

    console.log(`[sync-media] ${name}: ${countFiles(source)} 个文件已同步`);
}
