import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load, JSON_SCHEMA } from "js-yaml";
import config from "../../site.config.mjs";

const readDate = (file, value, field) => {
    const parsed = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(NaN);

    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
        throw new Error(`${file} 的 ${field} 必须是真实日期（YYYY-MM-DD），当前值：${String(value ?? "空")}`);
    }

    return value;
};

/** 页面、字体与内容检查共用发布规则；草稿只解析 YAML，不校验发布字段。 */
export function readPublishedPosts(directory = path.join(config.docsDir, config.postsDir)) {
    const posts = [];
    const slugs = new Map();

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

        const file = entry.name;
        let parsed;
        try {
            // 保留日期原文，避免 YAML 先把 2026-02-30 自动纠正成三月。
            parsed = matter(fs.readFileSync(path.join(directory, file), "utf8"), {
                engines: { yaml: (source) => load(source, { schema: JSON_SCHEMA }) },
            });
        } catch (error) {
            throw new Error(`${file} 的 front matter 解析失败：${error.message}`);
        }

        const { data, content } = parsed;
        if (data.status !== undefined && data.status !== "published") continue;

        const { slug } = data;
        if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw new Error(`${file} 的 slug 必填，只允许小写字母、数字及单个连字符连接的单词`);
        }
        if (slugs.has(slug)) throw new Error(`slug 重复：${slug}（${slugs.get(slug)} 和 ${file}）`);
        slugs.set(slug, file);

        for (const field of ["title", "description", "category"]) {
            if (data[field] !== undefined && typeof data[field] !== "string") {
                throw new Error(`${file} 的 ${field} 必须是文本`);
            }
        }
        const date = readDate(file, data.date, "date");
        const updated =
            data.updated === undefined || data.updated === null || data.updated === "" ? undefined : readDate(file, data.updated, "updated");
        if (updated && updated < date) throw new Error(`${file} 的 updated 不能早于 date`);

        const tags = data.tags === undefined || data.tags === null ? [] : Array.isArray(data.tags) ? data.tags : [data.tags];
        if (tags.some((tag) => typeof tag !== "string")) throw new Error(`${file} 的 tags 必须是文本或文本数组`);

        posts.push({
            file,
            slug,
            url: `/blog/${slug}/`,
            title: data.title || slug,
            description: data.description,
            date,
            updated,
            tags,
            category: data.category,
            content,
        });
    }

    return posts.sort((a, b) => b.date.localeCompare(a.date));
}
