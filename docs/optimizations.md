# Optimizations

This document tracks planned optimizations and their status.

1. Reduce initial bundle size by loading only article index on list pages. (done)
2. Move code highlighting to build-time (or SSG-time) to reduce runtime cost. (done)
3. Reduce DocumentTree building from O(n^2) to O(n). (done)
4. Precompute search index (lowercased fields) to speed up search. (done)
5. Deduplicate article scanning logic between scripts and app. (done)
6. Improve SSR HTML sanitization (use a proper DOMPurify SSR solution). (done)
