# 样式系统使用指南

## 引入方式

在 `main.ts` 中统一引入：

```typescript
import './styles/index.css'
```

## 文件结构

```
src/styles/
├── index.css        # 样式入口文件
├── variables.css    # CSS 变量（设计规范）
├── base.css         # 基础样式（重置 + 基础元素 + 滚动条）
├── components.css   # 通用组件样式
└── utilities.css    # 工具类
```

## 设计规范

### 颜色系统

- `--color-text`: 主要文本 (#3a3a3a)
- `--color-text-light`: 次要文本 (#666666)
- `--color-text-lighter`: 辅助文本 (#999999)
- `--color-bg`: 主背景 (#ffffff)
- `--color-bg-page`: 页面背景 (#fafafa)
- `--color-accent`: 强调色 (#1a1a1a)
- `--color-border`: 边框色 (#e5e5e5)

### 间距系统

- `--spacing-xs`: 0.25rem
- `--spacing-sm`: 0.5rem
- `--spacing-md`: 1rem
- `--spacing-lg`: 1.5rem
- `--spacing-xl`: 2rem
- `--spacing-2xl`: 3rem

### 字体系统

- 字号：`--font-size-xs` 到 `--font-size-4xl`
- 字重：`--font-weight-normal`/`medium`/`semibold`/`bold`

### 圆角与阴影

- 圆角：`--radius-sm`/`md`/`lg`/`full`
- 阴影：`--shadow-sm`/`md`/`lg`

## 使用示例

### CSS 变量

```css
.my-component {
  color: var(--color-text);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

### 通用组件类

```vue
<div class="container">
    <div class="card">
        <span class="tag">标签</span>
        <a class="btn">按钮</a>
        <a class="btn btn-outline">轮廓按钮</a>
    </div>
</div>
```

### 工具类

```vue
<div class="text-center mb-lg">
    <div class="flex flex-between gap-md">
        <span class="text">主要文本</span>
        <span class="text-light">次要文本</span>
    </div>
</div>
```

## 极简风格特点

- 网格背景（40px 间距，透明度 0.01）
- 细边框设计
- 微妙的阴影效果
- 黑白灰色系
- 简洁的交互反馈
