import { feedResponse } from "../lib/feed.js";

// 旧站点（Next.js 版）的订阅地址是 /feed.xml，这里保留同样路径，避免老订阅者失效。
export function GET() {
    return feedResponse();
}
