---
title: OpenCode 安装与配置笔记
date: 2026-04-01
category: 开发/AI工具/编程助手
id: opencode-setup-guide
description: OpenCode 多 Agent 协作配置笔记，基于 JD Cloud Code Plan 套餐。
tags:
  - OpenCode
  - AI编程
  - 笔记
---

## 前言

OpenCode 是一个强大的多 Agent 协作编程工具，通过智能任务编排实现自动化工作流。本文介绍的是基于 **JD Cloud Code Plan 套餐**的配置方案，该套餐支持 GLM-5、MiniMax、Kimi 等多种模型，能够根据任务类型自动选择最优模型。

## 安装

```bash
# 1. 安装 OpenCode
npm install -g @anthropic-ai/claude-code

# 2. 在 OpenCode 中让它自己装 oh-my-opencode
# 直接说：请帮我安装 oh-my-opencode

# 3. 诊断
bunx oh-my-opencode doctor
```

## Agent 配置（JD Cloud Code Plan）

### 主要 Agent

| Agent | 模型 | 用途 |
|-------|------|------|
| **Sisyphus** | GLM-5 | 主协调器，任务编排 |
| **Prometheus** | GLM-5 | 战略规划师，面试模式制定计划 |
| **Oracle** | GLM-5 | 架构设计与调试专家 |
| **Explore** | MiniMax-M2.5 | 快速代码库搜索 |
| **Librarian** | MiniMax-M2.5 | 文档和外部知识搜索 |
| **Momus** | GLM-5 | 代码审查专家 |
| **Atlas** | Kimi-K2-Turbo | Todo 任务协调器 |
| **Multimodal Looker** | Kimi-K2-Turbo | 视觉任务处理 |

### 任务路由

| 类别 | 模型 | 场景 |
|------|------|------|
| visual-engineering | GLM-5 | 前端/UI |
| ultrabrain | GLM-5 | 复杂逻辑 |
| quick | MiniMax-M2.5 | 简单任务 |
| writing | Kimi-K2-Turbo | 文档 |

## 常用命令

```bash
ulw                 # 全 Agent 并行执行
/start-work         # 规划模式
/init-deep          # 生成 AGENTS.md
```

## 已安装技能

### 前端开发基础包

| 技能 | 用途 |
|------|------|
| `frontend-design` | 创建独特的生产级前端界面 |
| `test-driven-development` | RED-GREEN-REFACTOR 循环 |
| `playwright-interactive` | Playwright 浏览器自动化 |
| `webapp-testing` | 本地 Web 应用 E2E 测试 |

### React 强化包

| 技能 | 用途 |
|------|------|
| `frontend-design` | 前端界面开发 |
| `vercel-react-best-practices` | Vercel 和 Next.js 最佳实践 |
| `webapp-testing` | 应用测试 |

### 全栈联调包

| 技能 | 用途 |
|------|------|
| `frontend-design` | 前端开发 |
| `webapp-testing` | 应用测试 |
| `postgres` | 安全只读 SQL 查询 |
| `using-git-worktrees` | Git 工作树管理 |

### 内置技能

- `/playwright` - 浏览器自动化
- `/frontend-ui-ux` - 无设计稿创建 UI/UX
- `/git-master` - Git 操作专家
- `/dev-browser` - 浏览器自动化

## 使用技巧

1. 复杂任务用 `ulw`
2. 先规划再执行：`/start-work`
3. 代码搜索用 Explore Agent（便宜快）
4. 架构问题用 Oracle Agent

## 相关链接

- [opencode](https://opencode.ai/)
- [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
