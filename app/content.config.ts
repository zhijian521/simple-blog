import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        notes: defineCollection({
            type: "page",
            source: {
                include: "notes/*.md",
                cwd: "../docs",
            },
            schema: z.object({
                title: z.string(),
                description: z.string().optional(),
                date: z.string(),
                tags: z.array(z.string()).optional(),
            }),
        }),
    },
});
