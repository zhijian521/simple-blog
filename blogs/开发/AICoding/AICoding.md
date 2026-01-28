---
title: AICoding 使用与推荐
date: 2026-01-25
category: 开发/AICoding
id: s8u9yp4g
description: 介绍如何使用AI模型进行开发以及推荐一些好用的AI模型。
tags:
  - AICoding
  - Vibe Coding
  - GLM
  - Cursor
  - Claude Code
  - Zed
  - Kimi
  - Kimi CLI
  - AI模型
---

分享我使用过的 AI 开发工具和当前的主力方案。

## Cursor (已停用)

基于 VS Code 的 AI 编辑器，我之前使用的主力编辑器，现已不再使用。

**优势：**

- 多款模型可选，且能力较强
- 前端开发可以直接在编辑器里预览和选中 UI 进行修改
- 编辑器内开发内开发，可以实时查看修改代码

**劣势：**

- 费用很贵，最低套餐 $20 / 月，并且高级模型使用有限制

官网：[ https://www.cursor.so/ ](https://www.cursor.so/)

## Claude Code + GLM (当前主力)

一个低成本的替代方案。Claude Code 是命令行工具，配合智谱 GLM 使用。当前主力方案使用。

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

## Zed + GLM 4.7 Code (当前主力)

当前使用方案。使用 Zed 编辑器配合智谱 GLM 4.7 Code 套餐，通过 LLM providers 实现 AI Agent Coding。

**优势：**

- AI 原生编辑器，深度集成 AI 能力
- GLM 4.7 Code 模型能力强，中文理解优秀
- 支持真正的 AI Agent，自动完成复杂任务
- 费用合理，性价比高

**配置：**

安装 Zed 后，在 Settings → AI 中配置 LLM provider，添加智谱 API 密钥并选择 最新 模型。


Zed 还支持其他模型和工具，如 Claude Code、OpenCode 等。  

官网：[ https://zed.dev ](https://zed.dev)

## Kimi 2.5 + Kimi CLI (推荐)

月之暗面推出的 Kimi 2.5 模型配合官方 Kimi CLI 工具，是一个值得尝试的 AI Coding 方案。

**优势：**

- 模型能力强，支持超长上下文（200K+）
- 中文理解出色，编程体验流畅
- API 价格合理

**劣势：**

- 命令行工具，无图形界面
- MCP 生态还在完善中

### 配置方法

安装 Kimi CLI：

```bash
# Linux / macOS
curl -LsSf https://code.kimi.com/install.sh | bash  

# Windows (PowerShell)
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
```

登录：

```bash
/login
```

API 密钥在 [ Kimi Code ](https://www.kimi.com/code) 获取。

### 基本使用

在项目目录启动 Kimi CLI：

```bash
kimi
```


官网：[ https://www.kimi.com/code ](https://www.kimi.com/code)

## 其他选择

看到别人推荐的，但我没有使用过：

- [ MiniMax Code ](https://www.minimaxi.com/)

## 相关链接

- [ Cursor 官网 ](https://www.cursor.so/)
- [ Claude Code 文档 ](https://docs.anthropic.com/en/docs/claude-code/overview)
- [ 智谱 AI 开放平台 ](https://open.bigmodel.cn/)
- [ GLM API 文档 ](https://open.bigmodel.cn/dev/api)
- [ Kimi 官网 ](https://www.kimi.com)
- [ Kimi 文档 ](https://www.kimi.com/code/docs/)

---

以上内容仅供参考。找到适合自己的最重要。
