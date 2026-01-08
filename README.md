<div align="center">

# ✨ Simple Blog

**A minimal, elegant static blog system built with modern web technologies**

[![Vue](https://img.shields.io/badge/Vue-3.4-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[![demo](https://img.shields.io/badge/demo-online-orange.svg)](https://your-demo-url.com)
[![npm](https://img.shields.io/npm/v/simple-blog)](https://www.npmjs.com/package/simple-blog)

</div>

---

## 📖 Overview

Simple Blog is a lightweight, performant static blog system that prioritizes simplicity and elegance. Built with Vue 3 and Vite, it offers a modern development experience with instant hot module replacement (HMR) and optimized production builds.

**Perfect for**: Personal blogs, technical writing, documentation sites, and anyone who values content over complexity.

---

## ✨ Features

- 🚀 **Blazing Fast** - Powered by Vite with instant HMR and optimized builds
- 📝 **Markdown Support** - Write posts in Markdown with front-matter metadata
- 🎨 **Minimal Design** - Clean, distraction-free reading experience
- 📱 **Fully Responsive** - Perfect display on all devices
- 🔒 **Secure by Default** - DOMPurify sanitization prevents XSS attacks
- 🎯 **Type-Safe** - Built with TypeScript for better development experience
- 🌙 **Theme System** - CSS variables for easy customization
- ⚡ **Zero Config** - Works out of the box, minimal setup required

---

## 🎯 Tech Stack

| Technology                                                                      | Version | Purpose               |
| :------------------------------------------------------------------------------ | :------ | :-------------------- |
| ![Vue](https://img.shields.io/badge/-Vue-42b883?logo=vue.js)                    | 3.4+    | Progressive Framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript)  | 5.3+    | Type Safety           |
| ![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite)                    | 5.0+    | Build Tool            |
| ![Vue Router](https://img.shields.io/badge/-Vue_Router-42b883?logo=vue.js)      | 4.2+    | Routing               |
| ![Markdown-it](https://img.shields.io/badge/-Markdown--it-083fa1?logo=markdown) | 14.0+   | Markdown Parser       |
| ![DOMPurify](https://img.shields.io/badge/-DOMPurify-4a5c6c?logo=html5)         | 3.3+    | XSS Protection        |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/simple-blog.git
cd simple-blog

# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Writing Articles

Create a new Markdown file in the `blogs/` directory:

```markdown
---
title: Your Article Title
date: 2024-01-01
excerpt: A brief summary of your article
author: Your Name
tags:
  - JavaScript
  - Vue
---

# Your Content Here

Write your article in **Markdown** format.
```

**Article Location**:

```
blogs/
├── Development/
│   ├── Vue/
│   │   └── vue-composition-api.md
│   └── TypeScript/
│       └── ts-best-practices.md
└── Life/
    └── about-me.md
```

---

## 📁 Project Structure

```
simple-blog/
├── blogs/                  # 📝 Markdown articles
├── public/                 # 🖼️ Static assets
├── src/
│   ├── components/         # 🧩 Reusable components
│   │   ├── article/       # Article-related components
│   │   ├── effects/       # Visual effects (snowfall, ink)
│   │   └── ui/            # UI components
│   ├── pages/             # 📄 Page components
│   │   ├── HomePage.vue
│   │   ├── ArticlesPage.vue
│   │   └── ArticleDetailPage.vue
│   ├── router/            # 🛣️ Vue Router config
│   ├── styles/            # 🎨 Global styles
│   │   ├── variables.css  # Design tokens
│   │   ├── base.css       # Reset & base styles
│   │   └── common.css     # Common components
│   ├── types/             # 📋 TypeScript definitions
│   ├── utils/             # 🛠️ Utility functions
│   ├── constants/         # ⚙️ Configuration
│   ├── App.vue            # Root component
│   └── main.ts            # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🎨 Customization

### Site Configuration

Edit `src/constants/index.ts`:

```typescript
export const SITE_CONFIG = {
  title: 'Your Blog Name',
  description: 'Your blog description',
  author: 'Your Name',
  icp: {
    number: 'Your ICP Number',
    url: 'https://beian.miit.gov.cn/',
  },
  copyright: {
    startYear: 2024,
    owner: 'Your Website Name',
  },
}
```

### Theme Variables

Edit `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --color-text: #3a3a3a;
  --color-bg: #ffffff;
  --color-accent: #1a1a1a;

  /* Spacing */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-base: 1rem;
  --font-weight-medium: 400;
}
```

See [docs/CONFIG.md](docs/CONFIG.md) for more details.

---

## 🚢 Deployment

### Static Hosting

The project builds to static files in `dist/`, deployable anywhere:

| Service              | Status         | Link                                   |
| :------------------- | :------------- | :------------------------------------- |
| **Vercel**           | ✅ Recommended | [Deploy](https://vercel.com)           |
| **Netlify**          | ✅ Supported   | [Deploy](https://netlify.com)          |
| **GitHub Pages**     | ✅ Supported   | [Guide](https://pages.github.com)      |
| **Cloudflare Pages** | ✅ Supported   | [Deploy](https://pages.cloudflare.com) |

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📜 Available Scripts

| Command                | Description               |
| :--------------------- | :------------------------ |
| `npm run dev`          | Start development server  |
| `npm run build`        | Build for production      |
| `npm run preview`      | Preview production build  |
| `npm run format`       | Format code with Prettier |
| `npm run lint`         | Lint code with ESLint     |
| `npm run format:check` | Check code formatting     |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/simple-blog&type=Date)](https://star-history.com/#yourusername/simple-blog&Date)

---

## 💖 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive Framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown Parser
- All contributors and supporters

---

<div align="center">

**Made with ❤️ by [Your Name]**

[⬆ Back to Top](#-simple-blog)

</div>
