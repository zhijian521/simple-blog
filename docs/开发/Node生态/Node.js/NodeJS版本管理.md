---
title: Node.js 版本管理
date: 2024-06-01
category: 开发/Node生态/Node.js
id: zjfqwa97
description: Node.js 版本管理工具, 推荐使用 nvm 进行 Node.js 版本管理。
tags:
  - NodeJS
  - 前端开发
  - NodeJS版本管理
  - nvm
  - nvm-windows
  - 内网
---

Node.js 版本管理工具：来确保开发环境的一致性。推荐使用 **nvm** 进行 Node.js 版本管理。

---

## nvm

nvm 是一个 Node.js 版本管理工具，可以轻松地在不同版本的 Node.js 之间切换。它支持 Windows、macOS 和 Linux 等操作系统。

### 下载

Linux 与 Mac 可以在 [NodeJS](https://nodejs.org/en/download) 官网 查看命令直接下载最新版本的 nvm ，Windows 则用户可以使用 nvm-windows 安装器。

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [nvm-windows Releases](https://github.com/coreybutler/nvm-windows/releases)

## 常用命令

- `nvm install <version>`：安装指定版本的 Node.js。
- `nvm use <version>`：切换到指定版本的 Node.js。
- `nvm ls`：列出已安装的 Node.js 版本。
- `nvm current`：显示当前使用的 Node.js 版本。

### 内网使用

在内网环境下，可能无法直接访问互联网资源，可以使用以下方法解决：

1. 在互联网下载对应版本的 NodeJS 独立文件包。
2. 将下载好的文件包上传到内网服务器。
3. 在内网解压并重命名为 `vxx.xx.x` (例如: v22.21.1) 实际对应版本号，并放到 nvm 安装目录下。
4. 运行 `nvm ls` 即可查看已安装的 Node.js 版本。使用 `nvm use <version>` 切换到指定版本。

## 📚参考资料

- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [nvm-windows Releases](https://github.com/coreybutler/nvm-windows/releases)
- [n GitHub](https://github.com/tj/n)
- [Node.js 官网下载](https://nodejs.org/en/download)



