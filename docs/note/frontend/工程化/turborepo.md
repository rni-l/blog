---
title: turborepo
date: 2022-05-05 11:00:00
tags: ["turborepo", "monorepo"]
categories: ["记录"]
---
# Turborepo 实践

## 实践
### 快速开始
快速创建项目：`npx create-turbo@latest`

运行：`npm run dev`

这里执行运行 命令后，会触发 `turbo run dev`，然后 `turbo` 这个库会根据该项目内的子包触发对应的 `npm run dev` 命令
### 构建项目
`npm run build` -> `turbo run build`

`turbo` 提供命令批处理功能，你可以在 `turbo.json` 配置相关的执行流程，设置命令之间的顺序、依赖关系、是否使用缓存和输出等等

### 新增依赖
`turborepo` 其实就是一个支持 monorepo 的命令管理库，所以它不支持依赖安装、包的发布等功能。所以需要别的工具来管理依赖的安装，你可以使用 npm, yarn 和 pnmn 来实现，这里使用 npm 来实现：

```shell
# 新增一个依赖给全部包
npm i vue -ws
# 新增一个依赖给 a 包
npm i pinia -w=a
```

### 构建缓存
turborepo 的一大特性就是构建缓存，可以提升你的整体构建速度
[turbo cache](https://turbo.build/repo/docs/core-concepts/caching)
总结来说，每次 turbo 进行构建后，会将构建文件进行缓存，本地或远程。然后下一次构建前，会先判断当前包的版本、文件、依赖版本和环境变量等信息，如果有差异就会重新构建，否则使用缓存

### 发布
和依赖管理一样，`turborepo` 不支持 npm 发布功能，官方推荐使用 `changeset` 来管理发布，我这边使用的流程基本是这样：
```shell
1. 构建：`npm run build`
2. 准备要提交版本时，使用 `npx changeset` 生成该版本的信息
3. `npx changeset version` 替换版本号和生成 changelog
4. `git commit `
5. `npx changeset publish` 发布版本
6. git push origin master --follow-tags 
```

但有一个问题，`changeset` 不知道要如何支持 CI & CD，它有一个 github bot 的工具，只支持 github 的 CI，如果我们要在其他 ci 平台使用，则无法支持。
## 优势
1. 支持多任务并行编排与执行
2. 构建缓存、云缓存

## 参考链接

1. [掘金](https://juejin.cn/post/7129267782515949575?searchId=202309141134252335519EA616CAB39031#heading-3)
2. [turborepo](https://turbo.build/repo/docs)

|      |      | Lerna.js                          | turborepo |
| ---- | ---- | --------------------------------- | --------- |
| 优点 |      |                                   |           |
|      |      |                                   |           |
| 缺点 |      | 在 2021 ~ 2202 年时，一直没有维护 |           |
|      |      |                                   |           |

