import config from "../../site.config.mjs";

export function GET() {
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
