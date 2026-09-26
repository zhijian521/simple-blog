// /manifest.json 端点：PWA 清单。本站没有客户端 JS，清单只为「添加到主屏幕」服务。
import config from "../../site.config.mjs";

export function GET() {
    // background_color 是启动画面底色，theme_color 是浏览器 UI 底色，
    // 两者都用站点主题色，避免安装后先闪一下白底
    const manifest = {
        name: config.name,
        short_name: config.name,
        description: config.description,
        start_url: "/",
        display: "standalone",
        background_color: config.themeColor,
        theme_color: config.themeColor,
        icons: [
            { src: config.favicon, sizes: "32x32", type: "image/png" },
            { src: config.appleTouchIcon, sizes: "180x180", type: "image/png" },
        ],
    };

    return new Response(`${JSON.stringify(manifest, null, 4)}\n`, {
        headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
    });
}
