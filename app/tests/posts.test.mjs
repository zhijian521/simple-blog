import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { formatDate, getPosts } from "../src/lib/posts.js";

const LOADER = fileURLToPath(new URL("./fixture-loader.mjs", import.meta.url));

// 造一个内容目录夹具并跑一次 getPosts()：
//   <root>/docs/blog/*.md 是文章，<root>/app 只是为了让 cwd/../docs 指向夹具
const runFixture = (files) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "simple-blog-fixture-"));
    fs.mkdirSync(path.join(root, "docs", "blog"), { recursive: true });
    fs.mkdirSync(path.join(root, "app"), { recursive: true });

    for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(root, "docs", "blog", name), content, "utf8");
    }

    const result = spawnSync(process.execPath, [LOADER], { cwd: path.join(root, "app"), encoding: "utf8" });
    fs.rmSync(root, { recursive: true, force: true });

    assert.equal(result.status, 0, `夹具进程异常退出：${result.stderr}`);
    return JSON.parse(result.stdout.trim().split("\n").pop());
};

const post = (frontMatter, body = "正文。") => `---\n${frontMatter}\n---\n\n${body}\n`;

test("正常文章：字段完整、URL 正确、可选字段有默认值", () => {
    const result = runFixture({
        "hello.md": post("title: 你好\nslug: hello\ndate: 2026-01-02\ncategory: 技术笔记\ntags: [Node.js, SEO]"),
    });

    assert.equal(result.ok, true, result.error);
    const [first] = result.posts;
    assert.equal(first.slug, "hello");
    assert.equal(first.url, "/blog/hello/");
    assert.equal(first.title, "你好");
    assert.equal(first.date, "2026-01-02");
    assert.deepEqual(first.tags, ["Node.js", "SEO"]);
    assert.equal(first.updated, undefined, "没写 updated 时不应有值");
    assert.equal(first.cover, undefined);
});

// YAML 用单引号：双引号会处理 \b 这类转义，把反斜杠变成控制字符，
// 让「反斜杠」用例测不到想测的东西
const quoted = (value) => `'${value.replace(/'/g, "''")}'`;

test("date 必须补零：写 2026-1-2 会被拦住并回显原值", () => {
    const result = runFixture({ "a.md": post("title: A\ndate: 2026-1-2") });
    assert.equal(result.ok, false);
    assert.match(result.error, /2026-1-2/);
});

test("yaml 时间戳形式的 date 会规整成 YYYY-MM-DD", () => {
    const result = runFixture({ "a.md": post("title: A\ndate: 2026-01-02T00:00:00.000Z") });
    assert.equal(result.ok, true, result.error);
    assert.equal(result.posts[0].date, "2026-01-02");
});

test("缺 date 时抛错，且报错里带文件名", () => {
    const result = runFixture({ "broken.md": post("title: 只有标题") });
    assert.equal(result.ok, false);
    assert.match(result.error, /broken\.md/);
    assert.match(result.error, /date/);
});

test("date 非法时抛错并回显原值", () => {
    const result = runFixture({ "a.md": post("title: A\ndate: 去年") });
    assert.equal(result.ok, false);
    assert.match(result.error, /a\.md/);
    assert.match(result.error, /去年/);
});

test("可选字段 updated：写了就生效，写错格式同样拦住构建", () => {
    const good = runFixture({ "a.md": post("title: A\ndate: 2026-01-02\nupdated: 2026-03-04") });
    assert.equal(good.ok, true, good.error);
    assert.equal(good.posts[0].updated, "2026-03-04");

    const bad = runFixture({ "a.md": post("title: A\ndate: 2026-01-02\nupdated: 前天") });
    assert.equal(bad.ok, false);
    assert.match(bad.error, /updated/);
});

test("slug 含会破坏 URL 的字符时抛错", () => {
    for (const slug of ["a/b", "a\\b", "..", ".", "a b", "a#b", "a?b", "a%b", "a\u0008b", "a\nb"]) {
        const result = runFixture({ "a.md": post(`title: A\ndate: 2026-01-02\nslug: ${quoted(slug)}`) });
        assert.equal(result.ok, false, `slug ${JSON.stringify(slug)} 本应被拒绝`);
    }
});

test("slug 重复时抛错，并列出两个文件名", () => {
    const result = runFixture({
        "one.md": post("title: 一\ndate: 2026-01-02\nslug: same"),
        "two.md": post("title: 二\ndate: 2026-01-03\nslug: same"),
    });
    assert.equal(result.ok, false);
    assert.match(result.error, /one\.md/);
    assert.match(result.error, /two\.md/);
});

test("status 不是 published 的文章会被过滤掉", () => {
    const result = runFixture({
        "public.md": post("title: 公开\ndate: 2026-01-02\nstatus: published"),
        "draft.md": post("title: 草稿\ndate: 2026-01-03\nstatus: draft"),
    });
    assert.equal(result.ok, true, result.error);
    assert.equal(result.posts.length, 1);
    assert.equal(result.posts[0].slug, "public");
});

test("front matter 解析失败时抛错并指名文件", () => {
    const result = runFixture({ "bad.md": "---\ntitle: [未闭合\ndate: 2026-01-02\n---\n\n正文\n" });
    assert.equal(result.ok, false);
    assert.match(result.error, /bad\.md/);
    assert.match(result.error, /front matter/);
});

test("标题层级归一：正文不会出现 h1，最低级别落到 h2", () => {
    const oneHash = runFixture({ "a.md": post("title: A\ndate: 2026-01-02", "# 一级\n\n## 二级\n\n### 三级") });
    assert.equal(oneHash.ok, true, oneHash.error);
    assert.match(oneHash.posts[0].html, /<h2[ >]/);
    assert.match(oneHash.posts[0].html, /<h3[ >]/);
    assert.doesNotMatch(oneHash.posts[0].html, /<h1[ >]/);

    // 从 ## 起步的文章不应被二次降级
    const twoHash = runFixture({ "a.md": post("title: A\ndate: 2026-01-02", "## 二级\n\n### 三级") });
    assert.equal(twoHash.ok, true, twoHash.error);
    assert.match(twoHash.posts[0].html, /<h2[ >]/);
    assert.doesNotMatch(twoHash.posts[0].html, /<h4[ >]/);
});

test("任务清单：紧凑写法转成勾选框，松散写法不误伤", () => {
    const compact = runFixture({ "a.md": post("title: A\ndate: 2026-01-02", "- [ ] 未完成\n- [x] 已完成") });
    assert.match(compact.posts[0].html, /class="task"/);
    assert.match(compact.posts[0].html, /class="task task--done"/);

    const loose = runFixture({ "a.md": post("title: A\ndate: 2026-01-02", "- [ ] 一\n\n- [x] 二") });
    assert.doesNotMatch(loose.posts[0].html, /class="task"/);
});

test("图片相对路径被改写，能读出尺寸的会补上 width/height", () => {
    const result = runFixture({ "a.md": post("title: A\ndate: 2026-01-02", "![示例](./images/whatever.webp)") });
    assert.match(result.posts[0].html, /src="\/images\/whatever\.webp"/);
    // 文件不存在时读不到尺寸，也不该报错
    assert.doesNotMatch(result.posts[0].html, /width=/);
});

test("真实语料：排序、URL、日期与图片都自洽", () => {
    const posts = getPosts();

    assert.ok(posts.length >= 7, `真实语料应有 7 篇以上，实际 ${posts.length}`);
    assert.deepEqual(
        posts.map((p) => p.date),
        [...posts.map((p) => p.date)].sort((a, b) => b.localeCompare(a)),
        "文章应按日期倒序",
    );

    const slugs = new Set();
    for (const item of posts) {
        assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/, `${item.file} 的日期格式`);
        assert.equal(item.url, `/blog/${item.slug}/`);
        assert.match(item.slug, /^[a-z0-9-]+$/, `${item.file} 的 slug 只应含小写字母、数字与连字符`);
        assert.doesNotMatch(item.html, /<h1[ >]/, `${item.file} 的正文不应出现 h1`);
        assert.ok(!slugs.has(item.slug), `${item.slug} 重复`);
        slugs.add(item.slug);
    }
});

test("真实语料：每张图都有 alt、宽高，且 alt 不是文件名", () => {
    let count = 0;
    for (const item of getPosts()) {
        for (const tag of item.html.match(/<img\b[^>]*>/g) ?? []) {
            count += 1;
            const alt = /alt="([^"]*)"/.exec(tag)?.[1];
            assert.ok(alt && alt.length > 0, `${item.file} 有图片缺少 alt`);
            assert.doesNotMatch(alt, /^(image\d|Image_)/i, `${item.file} 的 alt 仍是文件名：${alt}`);
            assert.match(tag, /\swidth="/, `${item.file} 的图片缺少 width`);
            assert.match(tag, /\sheight="/, `${item.file} 的图片缺少 height`);
            assert.match(tag, /\sloading="(lazy|eager)"/, `${item.file} 的图片缺少 loading`);
        }
    }
    assert.ok(count >= 14, `真实语料应有 14 张以上图片，实际 ${count}`);
});

test("formatDate：中文长格式，非法输入原样返回", () => {
    assert.equal(formatDate("2026-06-28"), "2026年6月28日");
    assert.equal(formatDate("2026-01-01"), "2026年1月1日");
    assert.equal(formatDate("不是日期"), "不是日期");
});
