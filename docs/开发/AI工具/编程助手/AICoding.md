---
title: AICoding 使用与推荐
date: 2026-03-05
category: 开发/AI工具/编程助手
id: s8u9yp4g
description: 介绍如何使用 AI 模型进行开发，以及当前推荐方案。
tags:
  - AICoding
  - OpenCode
  - GLM
  - Kimi
  - MiniMax
  - JD Cloud
  - AI模型
---

介绍一下我用过哪些 AI Coding 方案，以及当前使用的方案。

- 当前主力：`OpenCode + JD Cloud Code Plan`（支持 GLM-5.0、Kimi 2.5、MiniMax 2.5）
- 停用方案：`Cursor`、`Claude Code + GLM`、`Zed + GLM`、`Codex CLI`

## OpenCode + JD Cloud Code Plan（当前使用）

**优势：**

- 多模型协作，任务自动路由到最优模型
- GLM-5 处理复杂逻辑、架构决策
- Kimi 2.5 处理文档写作、长上下文任务
- MiniMax 2.5 处理简单任务，成本低速度快
- 多 Agent 并行工作，效率高
- 丰富的技能生态（前端开发、测试、Git 工作流等）

**劣势：**

- 以命令行为主，对图形化用户有上手门槛
- 需要理解 Agent 协作机制

相关链接：[OpenCode 安装与配置笔记](/article/opencode-setup-guide)

## Cursor（已停用）

**优势：**

- 编辑器内体验好，模型选择多

**劣势：**

- 费用高（最低套餐约 `$20/月`），高级模型额度有限

官网：[Cursor](https://www.cursor.so/)

## Claude Code + GLM（已停用）

曾经是低成本替代，但 GLM 5.0 后价格上涨，性价比下降。

**优势：**

- 中文理解和命令行体验不错

**劣势：**

- 额度限制明显
- 需要配置 API 和环境，维护成本高

官网：[Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code/overview)、
[智谱 AI 开放平台](https://open.bigmodel.cn/)

## Zed + GLM（已停用）

同样因为成本上涨，已停用。

**优势：**

- AI 原生编辑器体验好

**劣势：**

- 成本偏高
- 依赖模型和密钥配置

官网：[Zed](https://zed.dev)

## Codex CLI（已停用）

**优势：**

- 跨文件理解和重构能力强
- 终端工作流顺畅

**劣势：**

- 成本较高，重度使用费用明显
- 依赖网络和接口稳定性

---

以上仅是个人实践结论，适合自己的方案最重要。
