---
title: Git 提交规范
date: 2024-05-16
category: 开发/Git
description: 规范化 Git 提交信息的最佳实践
tags:
  - Git
  - 提交规范
  - 开发规范
id: hleayr4y
---

## 为什么需要提交规范

统一的提交规范可以带来以下好处：

- **清晰的历史记录**：快速了解每次提交的目的
- **自动化生成日志**：自动生成 CHANGELOG
- **团队协作效率**：统一的沟通语言
- **版本控制优化**：便于语义化版本管理

## Conventional Commits 规范

### 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

必须使用以下类型之一：

| 类型       | 说明                               | 示例                           |
| ---------- | ---------------------------------- | ------------------------------ |
| `feat`     | 新功能                             | feat: 添加用户登录功能         |
| `fix`      | 修复 Bug                           | fix: 修复登录后页面跳转错误    |
| `docs`     | 文档变更                           | docs: 更新 README 安装说明     |
| `style`    | 代码格式调整（不影响代码运行）     | style: 统一代码缩进为 2 空格   |
| `refactor` | 重构代码（既不是新功能也不是修复） | refactor: 重构用户服务层代码   |
| `perf`     | 性能优化                           | perf: 优化图片加载速度         |
| `test`     | 测试相关                           | test: 添加用户模块单元测试     |
| `build`    | 构建系统或外部依赖变更             | build: 升级 webpack 到 5.0     |
| `ci`       | CI/CD 配置变更                     | ci: 优化 GitHub Actions 工作流 |
| `chore`    | 其他不修改 src 或 test 的变更      | chore: 更新 .gitignore         |
| `revert`   | 回退提交                           | revert: feat: 移除用户头像功能 |

### Scope 范围

Scope 用于说明提交的影响范围，取值取决于项目。

**常见取值**：模块名（auth、user、database、api）、功能域（login、dashboard、settings）、层级（controller、service、dao）、组件（button、modal、form）。

```
feat(auth): 添加用户登录功能
fix(database): 修复连接超时问题
docs(api): 更新 API 接口文档
```

### Subject 主题

Subject 是对本次提交的简短描述。

**规则**：

- 使用中文或英文（保持一致）
- 不超过 50 个字符
- 不以句号结尾
- 使用祈使句（动词开头）
- 首字母小写（英文）

```
✅ 好的示例
feat: 添加用户登录功能
fix: 修复页面样式错误
docs: 更新安装文档

❌ 坏的示例
feat: 添加了用户登录功能。         # 多余字符、句号
Fix: 修复页面样式错误            # 首字母大写
feat: 我添加了登录功能            # 不必要的词
```

### Body 正文

Body 用于详细描述本次提交的内容，包含本次提交的动机和内容对比，可以分多个段落，使用列表列举多个要点，可以引用相关 Issue。

```
feat(auth): 添加 JWT 认证功能

- 实现 JWT token 生成和验证
- 添加 token 刷新机制
- 实现登出功能
- 添加相关单元测试

Closes #123
```

### Footer 脚注

Footer 用于补充说明和关联信息。

**常用脚注**：

- **Closes #123**：关闭 Issue #123
- **Refs #456**：关联 Issue #456
- **BREAKING CHANGE**：破坏性变更
- **Co-authored-by**：多人协作提交

```
feat(api): 添加用户注册接口

- 实现用户注册逻辑
- 添加参数验证
- 发送欢迎邮件

Closes #123
Refs #456
BREAKING CHANGE: 注册接口字段变更，不再支持 username 字段
```

## 完整示例

### 基础提交

```
feat: 添加用户头像上传功能

- 实现图片上传接口
- 添加图片压缩功能
- 支持裁剪和预览
- 添加上传进度显示

Closes #123
```

### 修复 Bug

```
fix(login): 修复登录后 token 未保存的问题

用户登录成功后，token 未正确保存到 localStorage，导致刷新页面后需要重新登录。

修改保存逻辑，确保 token 正确保存并设置过期时间。

Fixes #456
```

### 文档更新

```
docs: 更新 API 接口文档

- 添加新接口说明
- 更新请求参数示例
- 补充错误码说明
```

### 重构代码

```
refactor(user): 重构用户服务层代码

- 提取公共逻辑到工具函数
- 优化错误处理机制
- 统一返回数据格式
- 添加代码注释
```

### 性能优化

```
perf(image): 优化图片加载性能

- 实现图片懒加载
- 添加 WebP 格式支持
- 实现图片缓存机制
- 优化 CDN 加速策略

性能提升约 60%，首屏加载时间减少 2 秒。
```

### 破坏性变更

```
feat(api): 重构用户认证接口

BREAKING CHANGE:
- 认证接口路径从 /api/v1/auth 变更为 /api/v2/auth
- token 格式从 JWT 变更为 Bearer Token
- 移除旧的 Basic 认证方式

迁移指南详见文档：docs/migration-guide.md
```

### 回退提交

```
revert: feat: 移除用户头像功能

This reverts commit 1a2b3c4d.

Reason: 头像功能存在安全隐患，需要重新设计
```

## 最佳实践

### 1. 保持提交原子性

每个提交只做一件事。

```
✅ 好的实践
feat: 添加用户登录功能
fix: 修复登录样式错误
docs: 更新登录文档

❌ 坏的实践
feat: 添加登录功能和修复样式并更新文档
```

### 2. 及时提交

```
✅ 好的实践
- 完成一个功能点就提交
- 修复一个 Bug 就提交
- 保持每次提交的逻辑完整

❌ 坏的实践
- 工作一天结束才提交
- 多个不相关的修改混在一起提交
```

### 3. 编写清晰的提交信息

```
✅ 好的实践
feat: 添加用户头像上传功能

- 实现图片上传接口
- 添加图片压缩功能
- 支持裁剪和预览

❌ 坏的实践
feat: 更新代码
fix: 修复问题
```

### 4. 使用模板

创建提交信息模板 `.gitmessage`：

```
# <type>(<scope>): <subject>
#
# type: 必选，提交类型
#   feat: 新功能
#   fix: 修复 Bug
#   docs: 文档变更
#   style: 代码格式（不影响代码运行）
#   refactor: 重构代码
#   perf: 性能优化
#   test: 测试相关
#   build: 构建系统
#   ci: CI/CD 配置
#   chore: 其他变更
#
# scope: 可选，影响范围
#
# subject: 必选，简短描述
#
# 详细描述（可选）：
#   列举本次提交的具体内容
#
# 关联 Issue（可选）：
#   Closes #123
#   Refs #456
```

配置 Git 使用模板：

```bash
git config --global commit.template .gitmessage
```

### 5. 团队规范

建议在团队中制定统一的规范：

1. **语言选择**：中文或英文，保持一致
2. **提交频率**：避免过大或过小的提交
3. **代码审查**：基于提交信息进行 PR 审查
4. **自动化工具**：强制使用 Commitizen + Commitlint
5. **文档维护**：定期更新 CHANGELOG

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular 提交规范](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Commitlint](https://github.com/conventional-changelog/commitlint)
- [Husky](https://github.com/typicode/husky)
- [Standard Version](https://github.com/conventional-changelog/standard-version)
