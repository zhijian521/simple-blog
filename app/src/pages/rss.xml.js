import { feedResponse } from "../lib/feed.js";

export function GET() {
    return feedResponse();
}
