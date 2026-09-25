import path from "node:path";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import config from "./site.config.mjs";

if (config.url.includes("example.com")) {
    console.warn("[site.config.mjs] 还没有填写正式域名（url）。canonical、sitemap、RSS 会使用占位域名，部署前请修改。");
}

// 文章放在 app/ 之外的 docs/，Vite 默认不监听它，而且文章 HTML 是在
// getStaticPaths 阶段生成的，所以改了 Markdown 开发服务器不会更新。
// 这个插件补上监听，并在内容变化时丢弃模块缓存、整页刷新。
const watchContent = {
    name: "watch-content",
    configureServer(server) {
        const contentDir = path.resolve(process.cwd(), config.contentDir);

        server.watcher.add(contentDir);
        server.watcher.on("all", (_event, file) => {
            if (!file.startsWith(contentDir)) {
                return;
            }

            server.moduleGraph.invalidateAll();
            server.ws.send({ type: "full-reload" });
        });
    },
};

export default defineConfig({
    site: config.url,
    trailingSlash: "always",
    output: "static",
    integrations: [sitemap()],
    vite: {
        plugins: [watchContent],
    },
});
