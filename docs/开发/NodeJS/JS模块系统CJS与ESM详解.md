---
title: JS 模块系统：CJS 与 ESM 详解
date: 2025-01-19
category: 开发/NodeJS
description: 一文看懂 CommonJS 和 ES Modules 的区别与使用
tags:
  - Node.js
  - JavaScript
  - 模块系统
id: zsavdegc
---

## 前言

JavaScript 有两种主流的模块系统：**CommonJS (CJS)** 和 **ES Modules (ESM)**。

- **CJS**：Node.js 最早使用的模块系统
- **ESM**：JavaScript 官方标准模块系统（ES6 引入）

**简单记忆**：新项目用 ESM，老项目可能还在用 CJS。

## CommonJS (CJS)

### 基本语法

```javascript
// 导出
module.exports = {
  name: 'foo',
  sayHello: () => 'Hello',
}

// 或者
exports.foo = 'foo'
exports.bar = 'bar'

// 导入
const utils = require('./utils')
const { foo, bar } = require('./utils')
```

### 关键特点

1. **运行时加载**：代码执行到 `require` 时才加载模块
2. **值拷贝**：导出的是值的拷贝，不是引用
3. **动态导入**：可以在任何地方使用 `require`

```javascript
// 条件导入
if (process.env.NODE_ENV === 'dev') {
  const devTools = require('./dev-tools')
}
```

## ES Modules (ESM)

### 基本语法

```javascript
// 导出
export const foo = 'foo'
export const bar = 'bar'

// 默认导出
export default {
  name: 'foo',
}

// 导入
import { foo, bar } from './utils.js'
import utils from './utils.js'
import * as utils from './utils.js'
```

### 关键特点

1. **编译时加载**：在代码执行前就确定了依赖关系
2. **实时绑定**：导出的是值的引用，会实时更新
3. **静态分析**：工具可以更好地优化（Tree Shaking）

```javascript
// 动态导入
button.addEventListener('click', async () => {
  const Modal = await import('./Modal.js')
  new Modal()
})
```

## 核心区别

| 特性           | CommonJS                     | ES Modules                         |
| -------------- | ---------------------------- | ---------------------------------- |
| **语法**       | `require` / `module.exports` | `import` / `export`                |
| **加载时机**   | 运行时                       | 编译时                             |
| **导出方式**   | 值拷贝                       | 实时绑定                           |
| **文件扩展名** | `.cjs` 或 `.js`              | `.mjs` 或 `.js` + `type: "module"` |
| **顶级 await** | ❌ 不支持                    | ✅ 支持                            |

### 例子：值拷贝 vs 实时绑定

```javascript
// counter.js
let count = 0
export function increment() {
  count++
}
export { count }

// main.js (ESM)
import { count, increment } from './counter.js'
console.log(count) // 0
increment()
console.log(count) // 1（实时更新）

// main.js (CJS)
const { count, increment } = require('./counter.js')
console.log(count) // 0
increment()
console.log(count) // 仍然是 0（值拷贝）
```

## 如何选择模块系统

### 启用 ESM

在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

现在所有 `.js` 文件都会被当作 ESM 处理。

### 文件扩展名

- `.js` + `type: "module"` → ESM
- `.mjs` → 强制 ESM
- `.cjs` → 强制 CJS

### 推荐方案

```json
// ✅ 新项目：使用 ESM
{
  "type": "module"
}

// ✅ 库项目：同时支持两种
{
  "exports": {
    "import": "./index.js",
    "require": "./index.cjs"
  }
}
```

## 常见转换

### CJS → ESM

```javascript
// CJS
const fs = require('fs')
module.exports = { foo: 'foo' }

// ESM
import fs from 'fs'
export const foo = 'foo'
```

### **dirname 和 **filename

ESM 中没有 `__dirname` 和 `__filename`，需要自己实现：

```javascript
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

## 互操作性

### ESM 导入 CJS

```javascript
// math.cjs
module.exports.add = (a, b) => a + b

// main.mjs
import math from './math.cjs'
math.add(1, 2)
```

### CJS 导入 ESM

```javascript
// utils.mjs
export const helper = () => {}

// main.cjs
// ❌ 不能用 require
// const utils = require('./utils.mjs')

// ✅ 使用动态导入
async function loadUtils() {
  const { helper } = await import('./utils.mjs')
  helper()
}
```

## 最佳实践

### 1. 新项目用 ESM

```json
{
  "type": "module"
}
```

### 2. 不要混用

```javascript
// ❌ 错误：在 ESM 中用 require
import { require } from 'module'
const math = require('./math')

// ✅ 正确
import math from './math.js'
```

### 3. 使用一致的扩展名

```
src/
├── utils/
│   ├── math.js      # ESM
│   └── helper.cjs   # CJS
```

## 常见问题

### Q: 报错 "Cannot use import statement outside a module"

**A**: 在 `package.json` 中添加 `"type": "module"`，或将文件改为 `.mjs`

### Q: 报错 "require is not defined"

**A**: ESM 模式下不能使用 `require`，改用 `import`

### Q: Node.js 版本要求？

**A**:

- Node.js 13.2+：实验性支持
- Node.js 16+：稳定支持
- Node.js 20+：完整支持

## 总结

| 场景               | 选择     |
| ------------------ | -------- |
| 新项目             | ✅ ESM   |
| 使用 Vite / Rollup | ✅ ESM   |
| 兼容老版本 Node.js | CJS      |
| - 维护老项目       | 保持 CJS |

## 参考资源

- [Node.js ESM 文档](https://nodejs.org/api/esm.html)
- [MDN - ES Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
- [Vite 官方文档](https://cn.vitejs.dev/)
