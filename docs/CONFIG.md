# 项目配置说明

本项目的所有可配置内容都在 `src/constants/index.ts` 文件中。

## 站点信息配置

修改 `SITE_CONFIG` 对象来自定义你的站点信息：

```typescript
export const SITE_CONFIG = {
  title: '你的博客名称', // 网站标题
  description: '网站描述', // 网站描述
  author: '你的名字', // 作者名称

  // ICP 备案信息
  icp: {
    number: '你的ICP备案号', // 例如：京ICP备XXXXXXXX号
    url: 'https://beian.miit.gov.cn/',
  },

  // 版权信息
  copyright: {
    startYear: 2026, // 建站年份
    owner: '你的网站名称', // 版权所有者
  },
}
```

## 快速配置步骤

1. **打开配置文件**

   ```bash
   src/constants/index.ts
   ```

2. **修改站点信息**
   - `title`: 修改为你的博客名称
   - `description`: 修改为你的网站描述
   - `author`: 修改为你的名字

3. **配置 ICP 备案**（如果需要）
   - 修改 `icp.number` 为你的备案号
   - 如果不需要备案，可以删除 ICP 链接显示

4. **配置版权信息**
   - `startYear`: 设置建站年份
   - `owner`: 设置网站名称

5. **删除 ICP 显示**（可选）

   如果你不需要显示 ICP 备案信息，可以：

   **方法一：** 修改配置

   ```typescript
   icp: {
       number: '',  // 清空备案号
       url: '',
   }
   ```

   **方法二：** 删除 Footer 组件中的 ICP 部分

   ```vue
   <!-- src/components/common/Footer.vue -->
   <template>
     <footer class="site-footer">
       <div class="site-footer-content">
         <p class="site-footer-copyright">
           Copyright © {{ startYear }}-{{ currentYear }} {{ owner }}
         </p>
       </div>
     </footer>
   </template>
   ```

## 其他配置

### 修改日期格式

修改 `DATE_FORMAT` 对象：

```typescript
export const DATE_FORMAT = {
  FULL: 'YYYY年MM月DD日', // 完整日期
  SHORT: 'YYYY-MM-DD', // 短日期
  MONTH_YEAR: 'YYYY年MM月', // 年月
}
```

### 修改路由路径

修改 `ROUTES` 对象：

```typescript
export const ROUTES = {
  HOME: '/', // 首页路径
  ARTICLES: '/articles', // 文章列表路径
  ARTICLE: slug => `/article/${slug}`, // 文章详情路径
}
```

### 修改分页配置

修改 `PAGINATION` 对象：

```typescript
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10, // 每页显示文章数量
}
```

## 注意事项

- 所有配置都在 `src/constants/index.ts` 中，修改一处即可全局生效
- Footer 组件会自动读取配置，无需手动修改组件代码
- 修改配置后记得保存并重启开发服务器
