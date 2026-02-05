---
title: NPM 常见问题
date: 2024-08-20
category: 开发/NPM
description: NPM 使用中常见问题及解决方法
tags:
  - NPM
  - 问题解决
  - 前端工具
id: ngbqsy5p
---

用 npm 装包经常遇到各种问题，这里记录了常见问题的解决方法。

## 安装失败

### npm install 报错

先试试万能三连：

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

还不行就用这个：

```bash
npm install --legacy-peer-deps  # 忽略依赖冲突
```

## 网络问题

### 安装太慢/卡住

换成淘宝镜像：

```bash
# 永久配置
npm config set registry https://registry.npmmirror.com

# 查看当前源
npm config get registry
```

或者用 `nrm` 管理镜像源：

```bash
npm install -g nrm
nrm ls          # 列出所有源
nrm use taobao  # 切换源
```

### 网络错误 ECONNRESET

```
npm ERR! network request failed, reason: read ECONNRESET
```

**解决**：换镜像源，或者增加超时时间：

```bash
npm install --fetch-timeout=60000 --fetch-retries=5
```

## 权限问题

### EACCES 权限错误

全局安装时提示权限不足。

```
npm ERR! code EACCES
npm ERR! Error: EACCES: permission denied
```

**推荐方法**：用 nvm 管理 Node（一劳永逸）

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node
nvm install node

# 之后不需要 sudo 就能全局安装
npm install -g <package>
```

**临时方法**：用 sudo（不推荐）

```bash
sudo npm install -g <package>
```

## 版本冲突

### peer dependency 警告

```
npm WARN xxx requires a peer of yyy@^2.0.0 but none is installed
```

**解决**：安装缺失的依赖，或者强制安装：

```bash
npm install yyy
# 或
npm install --legacy-peer-deps
```

### 依赖树冲突 ERESOLVE

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决**：

```bash
npm install --legacy-peer-deps  # 忽略冲突
```

或者：

```bash
rm package-lock.json node_modules
npm install
```

## 锁文件问题

### package-lock.json 冲突

多人开发时经常冲突。

**解决**：

```bash
rm package-lock.json
npm install
```

**预防**：团队统一 npm 版本，或者用 `.npmrc` 固定配置。

## 全局包问题

### 全局安装后命令找不到

```bash
npm install -g <package>
xxx: command not found
```

**解决**：把 npm 全局路径加到 PATH：

```bash
# 查看全局路径
npm config get prefix

# 添加到 ~/.bashrc 或 ~/.zshrc
export PATH="$(npm config get prefix)/bin:$PATH"

# 重新加载
source ~/.bashrc
```

## 缓存问题

### 缓存损坏 EINTEGRITY

```
npm ERR! code EINTEGRITY
npm ERR! sha1 checksum check failed
```

**解决**：

```bash
npm cache clean --force
npm install
```

### 清理缓存

```bash
npm cache verify  # 清理并验证
```

## Node 版本问题

### 切换 Node 版本

某些包要求特定的 Node 版本。

**用 nvm 切换**：

```bash
nvm install 16    # 安装 Node 16
nvm use 16        # 切换到 Node 16
nvm ls            # 查看已安装的版本
```

**用 n 切换**（Mac/Linux）：

```bash
sudo npm install -g n
sudo n 16
```

**用 nvm-windows**（Windows）：

下载安装器：https://github.com/coreybutler/nvm-windows

### .nvmrc 文件

项目根目录创建 `.nvmrc`：

```
16
```

团队成员执行 `nvm use` 自动切换版本。

## 常用命令

### 查看包信息

```bash
npm info <package>            # 查看包详情
npm view <package> versions   # 查看所有版本
npm outdated                  # 查看过期的包
```

### 卸载包

```bash
npm uninstall <package>       # 卸载本地包
npm uninstall -g <package>    # 卸载全局包
```

### 升级 npm

```bash
npm install -g npm@latest
```

## .npmrc 配置

项目根目录创建 `.npmrc`：

```ini
# 使用淘宝镜像
registry=https://registry.npmmirror.com

# 保存时用精确版本
save-exact=true
```

常用配置：

```bash
# 设置默认仓库
npm config set registry https://registry.npmmirror.com

# 查看所有配置
npm config list

# 删除配置
npm config delete registry
```

## 最佳实践

1. **统一版本**：团队用同一个 npm 和 Node 版本
2. **锁文件**：package-lock.json 要提交到 Git
3. **定期更新**：定期 `npm outdated` 查看过期包
4. **清理缓存**：安装问题先清缓存
5. **用镜像源**：国内用淘宝镜像

## 相关文档

- [npm 官方文档](https://docs.npmjs.com/)
- [nvm 使用指南](https://github.com/nvm-sh/nvm)
- [nrm 使用指南](https://github.com/Pana/nrm)
