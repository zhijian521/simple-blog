// 把 docs/images、docs/videos 整目录镜像到 app/public/，由 predev 与 prebuild 自动触发。
// 只复制不转换：webp 编码与文件重命名在仓库外完成，这里不做任何图片处理。
//
// 注意本脚本依赖 site.config.mjs 的 process.cwd() 定位内容目录，
// 所以必须经 npm 脚本在 app/ 下运行，直接 node app/scripts/sync-media.js 会报找不到内容目录。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";

const countFiles = (dir) => fs.readdirSync(dir).filter((name) => !name.startsWith(".")).length;

/** 镜像素材目录，供启动、构建与开发监听共用；源目录删除时同时移除旧副本。 */
export function syncMedia({ docsDir = config.docsDir, publicDir = path.join(config.appDir, "public") } = {}) {
    fs.mkdirSync(publicDir, { recursive: true });
    for (const name of ["images", "videos"]) {
        const source = path.join(docsDir, name);
        const destination = path.join(publicDir, name);
        const staging = `${destination}.tmp`;

        if (!fs.existsSync(source)) {
            fs.rmSync(destination, { recursive: true, force: true });
            continue;
        }

        // 先拷到临时目录，成功后再替换，避免复制失败时留下空目录。
        fs.rmSync(staging, { recursive: true, force: true });
        fs.cpSync(source, staging, { recursive: true });
        fs.rmSync(destination, { recursive: true, force: true });
        fs.renameSync(staging, destination);
        console.log(`[sync-media] ${name}: ${countFiles(source)} 个文件已同步`);
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    syncMedia();
}
