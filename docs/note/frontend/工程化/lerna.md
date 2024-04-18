---
title: lerna
date: 2020-04-10 09:06:00
tags: ["lerna", "npm"]
categories: ["记录"]
draft: true
---

# Lerna 实践

>lerna 主要管理项目中多个 npm 包，通过链接将项目内的多个包进行关联，解决频繁发布包版本的问题和优化开发环境功能。

[项目 demo 地址](https://github.com/rni-l/monorepo-practices)

## 实践

### 快速开始

全局安装

```shell
npm i lerna -g
```

建文件夹并初始化

```shell
mkdir quickStart && cd quickStart
lerna init
```

添加模块

```shell
lerna create test1 -y # -y 是忽略所有的提示
lerna create test2 -y
```

将 test1 模块添加到 test2

```shell
// 使用 lerna add 的方式添加，会自动生成软链接，test1 模块修改后，test2 自动会更新
lerna add test1 --scope=test2

// 生成软链接
lerna bootstrap
```

我们将 `test1` 的依赖添加到 `test2` 中，接着在 `packages/test2/lib/test2.js`  使用 `test1` 模块，然后执行 `test2.js` 文件，就会发现执行了 `test1` 依赖的代码。

```shell
# 执行代码
node packages/test2/lib/test2.js
```

这时候每当我们修改 `test1` 模块后再执行 `test2` 的代码，可以无需更新依赖包，直接执行最新的代码。



### 优化本地依赖体积


使用 `lerna` 的 `hoist` 进行优化，它会使用项目根目录下的 `node_modules` 代替里面包的 `node_modules`，统一管理。

假设当前项目有两个端：PC 和 H5，都是使用 `vue-cli` 构建项目，如果不做优化，两个端的所有依赖都放在各个端内（除去项目内包之间的依赖），相当于这个项目的依赖有两套 `vue-cli`，那体积会不少。

#### 构建项目

使用 `@vue/cli` 创建项目，先安装到全局：`npm i g @vue/cli`

创建 pc 包（把 Eslint, TypeScript, Vue-Router, Vuex, CSS 预处理器, Jest 统统选上，尽量模拟业务项目的依赖环境）

`vue create pc`

创建 h5 包（同上）

`vue create h5`

现在可以看到两个包都有各自的依赖 node_modules，查看下体积：`du -h -d=1`，是 660M 。我们把 node_modules 都删除，然后在 `lerna.json` 添加下面的内容：

```json
{
  "command": {
    "bootstrap": {
      "hoist": true
    }
  }
}
```

然后再执行 `lerna bootstrap` 安装依赖，再执行 `du -h -d=1` 是 388M 。明显缩小了。再看下 PC 或 H5 的依赖，只剩 `.bin` 了。

我们再来验证下 `vue-cli` 的一些指令是否正常使用：

运行 PC 和 H5:

```shell
cd packages/h5
npm run serve

cd ../pc
npm run serve
```

`npm run lint`, `npm run test:unit` 都是正常运行。

#### 新增依赖

我们现在要给 PC 包添加 `element-ui` 依赖：`lerna add --scope=pc element-ui`。因为我们在 `lerna.json` 设置了 `hoist`，所以依赖被添加到了 `node_modules`。

比如一些特殊情况，PC 和 H5 用的同一个依赖但不同版本，这时候要如何处理？我们给 h5 添加不同版本的依赖：`lerna add --scoe=h5 element-ui@12.14.0`:

```shell
lerna WARN EHOIST_PKG_VERSION "h5" package depends on element-ui@2.14.1, which differs from the hoisted element-ui@2.15.6.
```

在使用了 `hoist` 的情况下，`lerna` 给了一个警告，因为两个包用的依赖版本不一样。这时候 `lerna` 的处理会将新的版本放在项目根目录的 `node_modules`，而另外一个版本的依赖会放到对应的包内，变成私有依赖。

除非特殊情况，建议还是同一个依赖用一个版本号。



## 问题

### 如何批量添加依赖？

```shell
lerna add xxx
```

如果想添加依赖到对应一个包：

```shell
lenra add xxx --scope=package
```

添加多个依赖：

```shell
lerna add xxx --scope=a1 --scope=a2
```





## 参考链接

1. [medium- lenra JS package 管理工具](https://medium.com/lion-f2e/lerna-js-package-管理工具-e9ed360d1143)
3. [juejin](https://juejin.im/post/5a989fb451882555731b88c2#heading-1)
4. [中文文档](https://github.com/chinanf-boy/lerna-zh#入门)
5. [cz-lerna-changelog](https://github.com/atlassian/cz-lerna-changelog)
6. [lerna-hoist](https://github.com/lerna/lerna/blob/main/doc/hoist.md)

