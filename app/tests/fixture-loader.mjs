// 夹具加载器：在指定的内容目录下调用 getPosts()，把结果或错误以 JSON 打到 stdout。
//
// 为什么要用子进程：site.config.mjs 用 process.cwd() 定位内容目录（这是为了在
// Astro 打包改写模块位置后路径依然稳定），所以一个进程只能对应一个内容目录。
// 测试里用一个临时目录当夹具，把 cwd 设成 "<夹具>/app"，于是内容目录就是
// "<夹具>/docs"，可以随便造不合格的文章来验证报错。

const { getPosts } = await import(new URL("../src/lib/posts.js", import.meta.url).href);

try {
    const posts = getPosts();
    console.log(
        JSON.stringify({
            ok: true,
            posts: posts.map((post) => ({
                file: post.file,
                slug: post.slug,
                title: post.title,
                date: post.date,
                updated: post.updated,
                url: post.url,
                tags: post.tags,
                cover: post.cover,
                coverWidth: post.coverWidth,
                coverHeight: post.coverHeight,
                coverType: post.coverType,
                html: post.html,
            })),
        }),
    );
} catch (error) {
    console.log(JSON.stringify({ ok: false, error: error.message }));
}
