import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import config from "./site.config.mjs";

if (config.url.includes("example.com")) {
    console.warn("[site.config.mjs] 还没有填写正式域名（url）。canonical、sitemap、RSS 会使用占位域名，部署前请修改。");
}

export default defineConfig({
    site: config.url,
    trailingSlash: "always",
    output: "static",
    integrations: [sitemap()],
});
