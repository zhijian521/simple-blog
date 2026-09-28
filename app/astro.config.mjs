// Astro 配置：站点地址、sitemap 的 lastmod，以及给 app/ 之外的 docs/ 补上 dev 热更新。

import path from "node:path";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import config, { absoluteUrl } from "./site.config.mjs";
import { getPosts } from "./src/lib/posts.js";
import { syncMedia } from "./scripts/sync-media.js";

if (config.url.includes("example.com")) {
    console.warn("[site.config.mjs] 还没有填写正式域名（url）。canonical、sitemap、RSS 会使用占位域名，部署前请修改。");
}

// 文章放在 app/ 之外的 docs/，Vite 默认不监听它，而且文章 HTML 是在
// getStaticPaths 阶段生成的，所以改了 Markdown 开发服务器不会更新。
// 素材先同步到 public，再丢弃模块缓存、整页刷新。
const watchContent = {
    name: "watch-content",
    configureServer(server) {
        const contentDir = path.resolve(process.cwd(), config.contentDir);
        let reloadTimer;
        let mediaChanged = false;

        server.watcher.add(contentDir);
        const onContentChange = (_event, file) => {
            const relative = path.relative(contentDir, path.resolve(file));
            if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
                return;
            }

            mediaChanged ||= ["images", "videos"].includes(relative.split(path.sep)[0]);
            clearTimeout(reloadTimer);
            // 合并编辑器保存/重命名产生的一组事件，避免读到替换中的文件。
            reloadTimer = setTimeout(() => {
                try {
                    if (mediaChanged) syncMedia();
                    mediaChanged = false;
                    server.moduleGraph.invalidateAll();
                    server.ws.send({ type: "full-reload" });
                } catch (error) {
                    server.config.logger.error(error.stack || error.message);
                    server.ws.send({ type: "error", err: { message: error.message, stack: error.stack } });
                }
            }, 75);
        };
        server.watcher.on("all", onContentChange);
        server.httpServer?.once("close", () => {
            clearTimeout(reloadTimer);
            server.watcher.off("all", onContentChange);
        });
    },
};

// sitemap 的 lastmod 取文章本身的时间：首页与归档页用最新文章日期。
// changefreq 与 priority 已被 Google/Bing 忽略，这里不再输出。
const posts = getPosts();
const postDates = new Map(posts.map((post) => [absoluteUrl(post.url), post.date]));
const latestDate = posts[0]?.date;

export default defineConfig({
    site: config.url,
    trailingSlash: "always",
    output: "static",
    integrations: [
        sitemap({
            serialize(item) {
                const date = postDates.get(item.url) || latestDate;

                if (date) {
                    // 显式 UTC 零点：不写 Z 会按构建机本地时区解析，lastmod 会漂一天
                    item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
                }

                return item;
            },
        }),
    ],
    vite: {
        plugins: [watchContent],
    },
});
