# Cursor AI 工作规范

## Git 提交规范

本项目遵循 **Conventional Commits** 规范，提交信息格式如下：

```
<type>(<scope>): <description>
```

### 提交类型（type）

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 代码重构
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `test`: 测试相关
- `ci`: CI 配置相关

### 提交示例

```
feat(config): add favicon configuration
fix(router): resolve navigation issue
docs(readme): update installation guide
refactor(components): optimize component structure
```

## 重要规则

### ⚠️ 代码提交规则

1. **禁止自动提交代码**
   - 只有在用户明确要求时才能执行 `git commit`
   - 不能在没有用户授权的情况下自动提交代码

2. **提交前必须**
   - 检查代码更改是否符合项目规范
   - 确保提交信息遵循上述 Conventional Commits 规范
   - 确认用户已明确要求提交

3. **工作流程**
   - 可以执行 `git add` 暂存更改
   - 可以执行 `git status` 查看状态
   - 只有在用户明确说"提交代码"、"commit" 等指令时才能执行 `git commit`

## 当前项目信息

- 框架：Nuxt.js
- 内容管理：@nuxt/content
- 语言：TypeScript + Vue 3

