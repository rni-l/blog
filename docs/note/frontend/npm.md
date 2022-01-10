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

简单来讲：



## package-lock.json 属性详解

## Npm 包发布流程

## Npm 安装依赖流程

## Npm 常用命令

## Npm 私有源的搭建

## 常见问题





## 参考资料

1. [npm 官方文档](https://docs.npmjs.com/)
2. [CornardLi 的 blog - npm 的包管理机制](http://www.conardli.top/blog/article/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96-%E5%89%96%E6%9E%90npm%E7%9A%84%E5%8C%85%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6%EF%BC%88%E5%AE%8C%E6%95%B4%E7%89%88%EF%BC%89.html#%E5%AF%BC%E8%AF%BB)
3. [nrm](https://www.npmjs.com/package/nrm)
4. [yrm](https://www.npmjs.com/package/yrm)

