import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: true, linkify: true });
const notesDir = path.resolve("..", "docs", "notes");

export function getNotes() {
    return fs
        .readdirSync(notesDir)
        .filter((filename) => filename.endsWith(".md"))
        .map((filename) => {
            const { data, content } = matter(fs.readFileSync(path.join(notesDir, filename), "utf8"));
            const slug = path.basename(filename, ".md");
            const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);

            return {
                slug,
                url: `/notes/${slug}/`,
                title: data.title,
                description: data.description,
                date,
                tags: data.tags || [],
                html: markdown.render(content),
            };
        })
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(date) {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}
