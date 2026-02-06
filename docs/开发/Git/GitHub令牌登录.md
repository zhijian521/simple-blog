---
title: GitHub 令牌登录
date: 2026-02-06
category: 开发/Git
description: 使用 Personal Access Token 代替账号密码进行 GitHub 登录与 Git 操作
tags:
  - GitHub
  - 令牌
  - 安全
id: f1n46p7i
---

> Github 已弃用账号密码进行操作。因此我们在使用 Git 拉去代码时，输入 Github 普通的账号密码会报错。
> 我们需要申请对应的令牌当成密码使用。


## 操作步骤

1. 登录到 Github 网站。
2. 点击头像找到 `Setting` 项，点击进入。
3. 下拉找到 `Developer settings` 项，点击进入。
4. 点击 `Personal access tokens` 。根据需要进入对应的菜单，我们进入  
`Tokens (classic)` 。
5. 点击右上角 `Generate new token` 按钮。根据需要进行设置，然后拉去到最下方创建。

![Image](/images/Image_1765179017769.png)

需要注意创建完成后，请及时复制保存创建的 `token`，后面将不再显示。
