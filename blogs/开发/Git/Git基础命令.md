---
title: Git 基础命令
date: 2024-05-11
category: 开发/Git
description: Git 版本控制常用命令汇总
tags:
  - Git
  - 版本控制
  - 开发工具
id: nwd0bpy4
---

## 初始化配置

### 基础配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 仓库操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone <repository-url>

# 克隆指定分支
git clone -b <branch-name> <repository-url>
```

## 日常操作

### 文件管理

```bash
# 查看状态
git status

# 添加文件到暂存区
git add <file-name>
git add .          # 当前目录所有文件
git add -A         # 所有文件（包括删除）

# 取消暂存
git reset <file-name>
git restore --staged <file-name>

# 恢复工作区文件
git restore <file-name>
git restore .      # 丢弃所有修改
```

### 提交更改

```bash
# 提交暂存区
git commit -m "message"

# 添加并提交
git commit -am "message"

# 修改最后一次提交
git commit --amend
git commit --amend -m "new message"
```

### 查看差异

```bash
git diff              # 工作区 vs 暂存区
git diff --cached     # 暂存区 vs 本地仓库
git diff HEAD         # 工作区 vs 本地仓库
git diff <commit1> <commit2>
```

## 分支管理

### 分支操作

```bash
# 查看分支
git branch            # 本地分支
git branch -a         # 包含远程分支

# 创建分支
git branch <branch-name>

# 切换分支
git switch <branch-name>
git checkout <branch-name>

# 创建并切换
git switch -c <branch-name>
git checkout -b <branch-name>

# 删除分支
git branch -d <branch-name>
git branch -D <branch-name>     # 强制删除

# 重命名分支
git branch -m <old-name> <new-name>
```

### 合并与变基

```bash
# 合并分支
git merge <branch-name>
git merge --no-ff <branch-name>   # 禁用快进合并

# 变基
git rebase <branch-name>
git rebase --continue             # 继续变基
git rebase --abort                # 终止变基

# 解决冲突后
git add <resolved-files>
git commit
```

## 远程操作

### 远程仓库

```bash
# 查看远程仓库
git remote
git remote -v                     # 详细信息

# 添加远程仓库
git remote add <name> <url>

# 删除远程仓库
git remote remove <name>

# 修改远程 URL
git remote set-url <name> <new-url>
```

### 拉取与推送

```bash
# 拉取
git pull                          # 拉取并合并
git fetch                         # 拉取但不合并
git pull origin <branch-name>      # 拉取指定分支

# 推送
git push
git push origin <branch-name>      # 推送指定分支
git push -u origin <branch-name>   # 设置上游分支
git push --tags                    # 推送所有标签

# 强制推送（谨慎使用）
git push -f
git push --force-with-lease        # 更安全的强制推送

# 删除远程分支
git push -d origin <branch-name>
```

## 历史记录

### 查看历史

```bash
git log                           # 查看提交历史
git log --oneline                 # 简洁显示
git log --graph --oneline         # 图形化显示
git log -n 5                      # 最近 5 条
git log <file-name>               # 指定文件历史
git log --author="name"           # 指定作者
git log --since="2025-01-01"      # 指定时间范围
```

### 查看详情

```bash
git show <commit-hash>            # 查看提交详情
git show <commit-hash>:<file>     # 查看指定文件
git blame <file-name>             # 查看文件修改记录
git reflog                        # 查看 HEAD 移动记录
```

## 撤销与回退

### 撤销操作

```bash
# 撤销工作区修改
git restore <file-name>
git restore .

# 撤销暂存区
git reset HEAD <file-name>

# 撤销提交
git reset --soft HEAD^            # 保留更改
git reset --hard HEAD^            # 不保留更改
git reset --hard <commit-hash>    # 回退到指定提交
git revert <commit-hash>          # 创建新提交撤销
```

### 恢复文件

```bash
git restore --staged <file-name>  # 从暂存区恢复
git restore -s <commit-hash> <file>  # 从指定提交恢复
```

## 标签管理

```bash
# 查看标签
git tag

# 创建标签
git tag <tag-name>                # 轻量标签
git tag -a <tag-name> -m "msg"    # 附注标签
git tag <tag-name> <commit-hash>  # 为指定提交打标签

# 查看标签信息
git show <tag-name>

# 删除标签
git tag -d <tag-name>             # 删除本地标签
git push -d origin <tag-name>     # 删除远程标签

# 推送标签
git push origin <tag-name>        # 推送单个标签
git push --tags                   # 推送所有标签

# 检出标签
git checkout <tag-name>
```

## 储藏功能

```bash
# 储存工作
git stash
git stash save "message"         # 添加说明

# 查看储藏列表
git stash list

# 应用储藏
git stash pop                     # 应用并删除
git stash apply                   # 应用但不删除
git stash pop stash@{n}           # 应用指定储藏

# 删除储藏
git stash drop stash@{n}
git stash clear                   # 清空所有
```

## 其他命令

```bash
# 清理未跟踪文件
git clean -f
git clean -fd                     # 包含目录
git clean -n                      # 预览

# 垃圾回收
git gc

# 忽略文件
echo "node_modules/" > .gitignore

# 移除已追踪文件的版本控制
git rm --cached <file-name>
```

## 常用场景

### 开发新功能

```bash
# 1. 创建功能分支
git switch -c feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: add new feature"

# 3. 推送
git push -u origin feature/new-feature

# 4. 合并到主分支
git switch main
git merge feature/new-feature
git push
```

### 修复紧急 Bug

```bash
# 1. 储存当前工作
git stash

# 2. 创建修复分支
git switch main
git switch -c fix/urgent-bug

# 3. 修复并提交
git add .
git commit -m "fix: urgent bug"

# 4. 合并并推送
git switch main
git merge fix/urgent-bug
git push

# 5. 恢复工作
git switch feature/new-feature
git stash pop
```

### 同步远程更新

```bash
# 获取远程更新
git fetch origin

# 查看差异
git log HEAD..origin/main

# 合并更新
git merge origin/main
# 或使用 rebase
git rebase origin/main
```

## 常见问题

### 提交信息错误

```bash
# 修改最后一次提交信息
git commit --amend -m "correct message"
```

### 推送被拒绝

```bash
# 先拉取远程更新
git pull --rebase

# 再推送
git push
```

### 撤销已推送的提交

```bash
# 回退并强制推送
git reset --hard <commit-hash>
git push --force-with-lease
```

### 合并冲突

```bash
# 1. 查看冲突
git status

# 2. 手动解决冲突

# 3. 标记已解决
git add <resolved-file>

# 4. 完成合并
git commit
```
