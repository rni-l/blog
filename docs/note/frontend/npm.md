---
title: Npm
date: 2021-07-27 00:00:00
tags: ["js", "npm", "package.json"]
categories: ["记录"]
---

# Npm

> 为了方便查阅相关内容，本文只是详细记录 Npm 有关的内容，所以会从不同的资料、文档、文章摘取内容。相关链接在“参考资料”有显示。

## 什么是 Npm

> `Npm` 是用于管理 `NodeJS` 包的版本控制工具，通过 `Npm` 的命令和相关配置使你的项目可以使用 `Npm` 源内的开放的包。

它是一个基于 NodeJS 实现的 CLI 工具，用于管理 JavaScript/TypeScript 等项目的依赖

### 它能做什么?

1. 发布属于你自己的代码包
2. 通过相关配置，下载使用开源的包
3. 可以搭建属于自己的组织或私有源，去管控发布的包
4. 可以通过 `npx` 命令快速执行包的脚本

### 源、权限、作用域

`Npm` 有有不同的源、不同的权限和不同的作用域。

包可以从不同的源下载、上传

包可以是公有的（`public`），也可以是私有的（`private`）

包可以有作用域，例如：`{scopeA}/test`,`{scopeB}/test2`。这两个包分别在 scopeA 和 scopeB 两个作用域下，包名为 test 和 test2

`Npm` 的所有配置，都是基于 `.npmrc` 文件，而这个文件会存在不同的地方，比如内置级别、系统级别、用户级别、项目级别等。这里的权限是从小到大，项目级别是最大的。

### 源的作用

源就是控制你的包放到哪里存储。默认源是 `https://registry.npm.com`，我们下载的包、上传的包，默认都是从这个源获取和上传。

我们可以通过命令、配置、工具等，去管理你的源。

命令：

```shell
# npm 命令
npm get registry # 获取当前文件夹的源
npm set registry {url} # 设置源
```

配置：

```shell
touch ./.npmrc # 在相关项目文件夹的根目录内，添加 .npmrc 文件
registry = http://test.com # 添加对应的内容
```

工具：

使用 `nrm` 或 `yrm` 工具，可以管理多个源，推荐使用。下面的事列使用 `nrm` 展示，详细看文档

```shell
npm i nrm -g # 全局安装依赖
nrm ls # 查看当前可使用的源
nrm use <registry>                       # Change registry to registry
nrm add <registry> <url> [home]          # Add one custom registry
```

源的获取，是有一条作用域链去检测的：

1. 首先检查当前文件夹目录的 .npmrc 文件
2. 检查当前系统用户的 .npmrc 文件（用户配置位置）
3. 检查全局的 .npmc 文件（就是 npm 安装的位置）

### 权限

 包有分公有、私有，在 `package.json` 的配置有一个属性：`private: boolean` 配置，声明该包是公有还是私有。

### 作用域

我们可以看到很多的包都有一个前缀，例如：`vue/cli-service`，`vue/babel` 之类的，如果去 `node_modules` 看的话，可以看到都会有一个文件包裹相同前缀的包。比如 `vue` 这里的两个包，就会有一个 `vue` 文件夹，里面有 `cli-service` 和 `babel` 这两个包。

作用域的效果相当于一个命名空间，使你的包更方便管理。

## package.json 属性详解

当一个项目有了 `package.json` 文件，才能使用 `Npm` 的功能，`package.json` 就是这个项目的配置文件，告诉 `Npm` 这个项目是什么，有什么内容、依赖等。

`package.json` 必须有的两个字段：`name` 和 `version`，分别告诉该包叫什么，版本号是多少。如果该项目要发布到 `Npm`，则 `name` 要唯一值、小写、可以含有 `-`。

版本号规范：

[semantic versioning](https://docs.npmjs.com/about-semantic-versioning) ，使用该规则。

[`Npm` 版本计算器](https://semver.npmjs.com/)

* `^`: 首先匹配该版本最左侧第一个非零位的、最大的版本
  * 比如有 0.1.0, 0.1.1, 0.2.0, 1.0.0，这时候最左侧第一个非零位的是 minor 位，最大的是 2，所以会安装 0.2.0 的版本
* ~: 安装 minor 为最大的版本

#### dependencies & devDependencies & peerDependencies

* dependencies: 必须需要安装的依赖列表

* devDependencies: 本地开发时需要安装的依赖列表

  * 可以通过 `npm i --product` 或者 `npm i --omit=dev` 不按照该列表

* peerDependencies: 用于自己在开发包，提示使用者的一些信息

  * > When a user installs your package, npm will emit warnings if packages specified in `peerDependencies` are not already installed

  * 如果使用该包的那个项目没有安装它要求的依赖，就会提示信息:

    ```shell
    npm WARN ERESOLVE overriding peer dependency
    npm WARN While resolving: test-npm@1.0.0
    npm WARN Found: vue-router@4.1.6
    npm WARN node_modules/vue-router
    npm WARN   peer vue-router@"^4.1.6" from test-npm-pkg@1.0.1
    npm WARN   node_modules/test-npm-pkg
    npm WARN     test-npm-pkg@"^1.0.1" from the root project
    npm WARN   1 more (the root project)
    npm WARN 
    npm WARN Could not resolve dependency:
    npm WARN peer vue-router@"^4.1.6" from test-npm-pkg@1.0.1
    npm WARN node_modules/test-npm-pkg
    npm WARN   test-npm-pkg@"^1.0.1" from the root project
    ```

    

可输入的版本内容：

```json
{
  "dependencies": {
    "foo": "1.0.0 - 2.9999.9999",
    "bar": ">=1.0.2 <2.1.2",
    "baz": ">1.0.2 <=2.3.4",
    "boo": "2.0.1",
    "qux": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
    "asd": "http://asdf.com/asdf.tar.gz",
    "til": "~1.2",
    "elf": "~1.2.3",
    "two": "2.x",
    "thr": "3.3.x",
    "lat": "latest",
    "dyl": "file:../dyl"
  }
}
```



## Npm 安装依赖的缓存逻辑

## Npm 包发布流程

## Npm 安装依赖流程

## Npm 私有源的搭建

使用 `verdaccio` 进行搭建

[verdaccio](https://verdaccio.org/zh-cn/docs/cli/)



## Npm vs Yarn vs Pnpm

这三个都是管理 NodeJs 的依赖的工具。

Npm 是最早的包管理工具

Yarn 的出现是解决 Npm 早期依赖包是树形结构的问题而出现的

Pnpm 的出现是解决 Npm 依赖占用的磁盘空间过大的问题

Pnpm 会将安装的新依赖统一存储在一个文件夹内，旧依赖就会使用链接的方式访问，这会解决两个问题：

1. 不会像 Npm 那样占用大量的磁盘空间
2. NodeJs 的 `require` 无法引入不在 `dependencies` 中的依赖
   1. Npm 和 Yarn 会有，因为它们会出现依赖提升，`dependencies` 依赖中需要安装的依赖，会被提升到 项目根目录中的 `node_modules` 



![npm1](../../../../../hugo/static/img/npm1.png)



## 常见问题

## 参考资料

1. [npm 官方文档](https://docs.npmjs.com/)
2. [CornardLi 的 blog - npm 的包管理机制](https://blog.conardli.top/2019/12/17/engineering/npm/)
3. [nrm](https://www.npmjs.com/package/nrm)
4. [yrm](https://www.npmjs.com/package/yrm)
5. [npm - package.json 属性说明](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies)
6. [pnpm](https://pnpm.io/motivation)
7. [pnpm - 介绍](https://juejin.cn/post/6932046455733485575#heading-8)
