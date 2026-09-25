export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: {
        enabled: false,
    },
    modules: ["@nuxt/content", "@nuxtjs/sitemap", "@nuxtjs/robots"],
    css: ["~/assets/css/main.css"],
    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
        },
    },
    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
        name: "知简",
    },
    app: {
        head: {
            htmlAttrs: {
                lang: "zh-CN",
            },
            meta: [
                {
                    name: "theme-color",
                    content: "#f8f8f5",
                },
            ],
        },
    },
    nitro: {
        publicAssets: [
            {
                dir: "../docs/images",
                baseURL: "/images",
            },
            {
                dir: "../docs/videos",
                baseURL: "/videos",
            },
        ],
        prerender: {
            crawlLinks: true,
        },
    },
});
