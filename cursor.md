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
   - 只有在用户明确说“提交代码”“commit”等指令时才能执行 `git commit`

## 当前项目信息

- 构建工具：Vite
- 框架：Vue 3
- 语言：TypeScript
- 路由：Vue Router

## 开发要求与最佳实践

### 代码总体要求

1. **符合资深开发规范**
   - 代码需具备可维护性、可读性和可扩展性，避免“临时代码”长期存在
   - 避免重复代码（DRY 原则），相似逻辑抽离为公共函数或模块
   - 尽量保持函数/组件“单一职责”，文件过大时及时拆分

2. **符合当前流行的最佳实践**
   - 优先使用组合式 API（Vue 3 风格）
   - 使用类型系统（TS）增强可维护性，避免滥用 `any`
   - 遵循语义化 HTML 和可访问性（a11y）基本要求
   - 尽量保持无副作用的纯函数，副作用集中在少数可控位置（如 composables、store）

3. **符合模块化实践**
   - 页面展示、业务逻辑、数据访问等层次分离，避免所有逻辑堆在页面组件中
   - 公共逻辑抽离到 `src/*` 下的明确分层目录（见下方“企业级目录结构”）
   - 组件拆分遵循：UI 组件（展示为主）、业务组件（承载业务流程）、布局组件（整体框架）

### 注释与文档要求

1. **注释策略**
   - 为重要模块、关键业务流程、复杂算法或易误解逻辑编写简洁清晰的注释
   - 避免解释“代码本身已经很清楚”的注释，减少噪音
   - 当代码意图不能通过命名充分表达时，使用注释补充“为什么这么做”（why），而非“做了什么”（what）

2. **方法与模块注释**
   - 对重要的公共函数、核心模块，使用简要块注释，说明：
     - 功能/职责
     - 关键入参和返回值含义（如有必要）
     - 可能的边界情况或注意事项

3. **文档同步**
   - 如引入新的全局约定（如目录组织、命名规范、状态管理策略等），应在 `cursor.md` 中补充或更新说明

### 代码风格与结构

1. **命名规范**
   - 组件/类：`PascalCase`
   - 变量/函数：`camelCase`
   - 常量：全部大写，使用下划线分隔

2. **文件与目录结构（企业级建议）**

说明：该结构参考当前主流前端工程实践（分层 + 按业务模块聚合），兼顾可扩展性与可维护性。

- `app/`：应用初始化层（router、全局样式、providers、入口组装）
- `pages/`：页面层（路由承载页面；只做编排，避免堆业务）
- `features/`：业务功能模块（推荐按领域/功能拆分，每个模块自带组件、API、类型、状态）
- `entities/`：领域实体（可复用的数据模型与业务规则，如 Article、User）
- `shared/`：跨业务复用（UI 组件、工具函数、通用 hooks、基础样式、类型）

推荐结构：

```
src/
  app/
    router/
      index.ts
    styles/
      main.css
    main.ts

  pages/
    Home/
      HomePage.vue
    Articles/
      ArticlesPage.vue
      ArticleDetailPage.vue

  features/
    search/
      ui/
      model/
      lib/
      index.ts

  entities/
    article/
      model/
      api/
      lib/
      index.ts

  shared/
    ui/
    composables/
    lib/
    styles/
    types/

  App.vue
  env.d.ts

index.html
vite.config.ts
```

落地规则：
- 页面文件统一放在 `src/pages/**`，路由只引用 pages 层组件。
- 业务逻辑优先放 `features/*` 或 `entities/*`，页面只负责组合与展示。
- 通用 UI（Button、Alert、Modal 等）放 `shared/ui`；业务 UI 放各自 feature 的 `ui/`。
- 与后端交互封装在 `entities/*/api`（按领域），不要散落在页面里。

3. **复杂度控制**
   - 尽量避免深层嵌套逻辑和超长函数，复杂逻辑及时抽取
   - 控制单文件/单函数责任范围，使项目结构清晰易懂
