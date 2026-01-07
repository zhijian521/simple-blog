---
title: AICoding 使用与推荐
date: 2026-01-03
category: 开发/AICoding
id: s8u9yp4g
description: 介绍如何使用AI模型进行开发以及推荐一些好用的AI模型。
tags:
  - AICoding
  - Vibe Coding
  - GLM
  - Cursor
  - Claude Code
  - AI模型
---

分享两个我常用的 AI 开发工具。

## Cursor

基于 VS Code 的 AI 编辑器，我之前使用的主力编辑器。

**优势：**

- 多款模型可选，且能力较强
- 前端开发可以直接在编辑器里预览和选中 UI 进行修改
- 编辑器内开发，可以实时查看修改代码

**劣势：**

- 费用很贵，最低套餐 $20 / 月，并且高级模型使用有限制

官网：[ https://www.cursor.so/ ](https://www.cursor.so/)

## Claude Code + GLM

一个低成本的替代方案。Claude Code 是命令行工具，配合智谱 GLM 使用。我当前主力使用的方案。

**优势：**

- GLM 费用较低，模型能力也够用
- 命令行操作，不用切窗口
- 中文理解能力强

**劣势：**

- 最低套餐有使用限制，每 5 小时刷新额度。如果同时开多个项目，额度不够用
- 需要配置 API 密钥，比 Cursor 麻烦
- 没有图形界面，需要适应命令行

### 配置方法

先安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

然后使用配置工具配置 GLM：

```bash
npx @z_ai/coding-helper
```

会引导你配置 GLM 的 API 密钥和 MCP 服务。API 密钥在 [ 智谱 AI 开放平台 ](https://open.bigmodel.cn/) 获取。

### 基本使用

配置完成后，在项目目录直接使用：

```bash
claude
```

## 其他选择

看到别人推荐的，但我没有使用过：

- [ MiniMax Code ](https://www.minimaxi.com/)
- [ Kimi Code ](https://www.kimi.com/code)

## 相关链接

- [ Cursor 官网 ](https://www.cursor.so/)
- [ Claude Code 文档 ](https://docs.anthropic.com/en/docs/claude-code/overview)
- [ 智谱 AI 开放平台 ](https://open.bigmodel.cn/)
- [ GLM API 文档 ](https://open.bigmodel.cn/dev/api)

---

以上内容仅供参考。找到适合自己的最重要。
