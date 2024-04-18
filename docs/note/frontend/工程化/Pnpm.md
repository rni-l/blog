---
title: pnpm
date: 2023-09-21 17:22:00
tags:
  - monorepo
  - pnpm
categories:
  - 记录
---
## 概述

> 记录 pnpm 的使用过程、特性和总结

`pnpm` 是一个 `nodejs` 的包管理工具，和 `npm` 类似，它的主要特性是：
> 1. 快速
> 2. 高效
> 3. 支持 Monorepos
> 4. 严格
> -- 官方

这里总结下为什么是这几个特性（其实官方文档也很清楚说明了）：
1. `pnpm` 会记录你下载依赖和其版本，保证你不会重复下载某个依赖的版本
2. `pnpm` 通过硬链接的方式关联你的依赖，避免重复下载
3. `pnpm` 不会创建平铺的 `node_modules` 文件夹结构

### 什么是硬链接？
![[软链接和硬链接#软链接和硬链接的区别]]

## 使用

###  创建项目
项目结构：
```shell
packages
  pa
    package.json
  pb
    package.json
package.json
```
pa 包使用了 pb 包

在根目录添加配置文件：
pnpm-workspace.yaml:

```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
```
### 为单个包添加/删除依赖

添加：`pnpm --filter {package name} add {dependency name}`
删除：`pnpm --filter pa un  axios`

### 为多个包添加/删除依赖

添加：`pnpm --filter {package name} --filter {package2 name}  add {dependency name}`
删除：`pnpm --filter {package name} --filter {package2 name} un {dependency name}`

### 为所有包添加/删除依赖
添加：`pnpm --filter="*" add {dependency name}`
删除：`pnpm --filter="*" un {dependency name}`

### 安装依赖

`pnpm i`

### 生成链接
pa 需要用到 pb，先去到 pa 的目录，再执行： `pnpm link ../pb`

注意，如果是首次链接包，这操作不是会在 pa 的 package.json 中添加 pb 的依赖，我们可以手动添加：`"pb": "workspace:*"`

[参考文档](https://pnpm.io/workspaces#referencing-workspace-packages-through-aliases)

### 发布包
没这功能

## 特性
### 节省空间
利用硬链接，避免重复下载相同依赖相同版本
### 速度快
原理同上
### 避免幽灵依赖
#### 什么是幽灵依赖
是指代码中使用了 package.json 没出现的包。
为什么可以使用？
因为 npm 安装依赖的机制，默认是将所有安装的包都近可能平铺在 node_modules 下，这样会使 node_modules 的第一级目录出现 package.json 不存在的包。
#### pnpm 解决方式
pnpm 安装依赖时，默认采取的方式是按下载的包的依赖结构进行的。比如 a 依赖有 a1, a2 依赖，那 a1, a2 的依赖是不会出现在 node_modules 的一级目录中，而是出现在 a 包里的 node_modules 的一级目录中。简单来说，就是 pnpm 安装依赖时，是按依赖树的形式下载或关联的，而不像 npm 那样尽可能的平铺。（当然 npm 其实也是一棵树，但只有出现相同依赖且不同版本的时候，才会将对应版本的依赖放到子包里面）

### 支持 monorepo
内置了一些命令，比如  link，可以支持 monorepo

## 总结

## 参考资料
1. [pnpm - website](https://pnpm.io/)
2. [how pnpm link - 知乎](https://zhuanlan.zhihu.com/p/609430861)