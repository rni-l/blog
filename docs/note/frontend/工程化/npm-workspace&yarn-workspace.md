---
lltitle: npm-workspace & yarn-workspace
date: 2022-04-18 15:00:00
tags: ["workspace"]
categories: ["记录"]
---

# npm-workspace & yarn-workspace

> Workspace 多用于在 Monorepo 的工程架构中，而 npm(7) 和 yarn 都支持 workspace 的配置

## npm-workspace

上手很简单，直接根据 [npm workspace 文档](https://docs.npmjs.com/cli/v8/using-npm/workspaces) 的教程就行了，这里不再赘述。下面我基于一个简单的 monorepo 结构，说明下在不同的业务场景中去使用 npm 的 workspace 功能。

项目目录结构：

```shell
.
├── lib
│   └── index.js
├── node_modules
│   ├── a -> ../packages/a
│   └── b -> ../packages/b
├── package-lock.json
├── package.json
└── packages
    ├── a
    │   ├── index.js
    │   └── package.json
    └── b
        ├── index.js
        └── package.json
```

可以看到在 node_module 里面的 a 和 b 依赖，都是一个软链接的形式，链接到源文件的路径。

### 安装依赖，添加 workspace

>通过 workspace 指令安装的依赖，依赖都只会安装在项目根路径上的 node_modules 上

```shell
npm init -w ./packages/a
```

这里会初始化一个 npm 项目，并在根 package.json 配置 `workspaces`:

```json
{
  "workspaces": [
    "packages/a",
    "packages/b"
  ]
}
```

给某个子包添加依赖：

```shell
npm install vue -w a
```

给多个包添加依赖：

```shell
npm i vue -w a -w b
```

给所有配置的包添加依赖：

```shell
npm i vue -ws
```

重新安装依赖：

```shell
npm i -ws
```



### 某个子包需要不同版本的依赖，如何安装？

比如先执行了以下的命令：

```shell
npm i -ws vue@latest
```

所有的包都安装了最新版本的 vue，但是 a 项目需要改成 2.0 版本的，则再执行：

```shell
npm i vue@2 -w a
```

npm 会在 `node_modules/a/node_modules` 安装 2.0 版本的 vue 依赖



### 批量执行命令

为 a 和 b 包分别添加下面的命令：

```json
{
  "scripts": {
    "test": "echo 1", // a
    "test": "echo 2", // b
  }
}
```

执行所有包的 `test` 命令：

```shell
npm run test -ws
```

单独执行 a 和 b 包的 test 命令：

```shell
npm run test -w a -w b
```



### 发布

配置 .npmrc，这里我发到私有的 npm 源上：

```shell
echo "registry=http://my.com" >> .npmrc
```

发布所有的包：

```shell
npm publish -ws
```

发布单独的包：

```shell
npm publish -w a
```



## yarn-workspace

我们根据上面的 npm 例子，使用 yarn 来实现一遍，先构建一个项目，项目结构如下：

```shell
.
├── lib
│   └── index.js
├── node_modules
│   ├── a -> ../packages/a
│   └── b -> ../packages/b
├── package-lock.json
├── package.json
└── packages
    ├── a
    │   ├── index.js
    │   └── package.json
    └── b
        ├── index.js
        └── package.json
```

### 安装依赖，添加 workspace
```shell
// 建议用 npm init 命令，更方便，可以直接生成文件夹和文件
npm init -w ./packages/a
```

在根 package.json 配置 `workspaces`:

```json
{
  "workspaces": [
    "packages/a",
    "packages/b"
  ]
}
```

给某个子包添加依赖：

```shell
yarn workspace a add lodash -D
```

给多个包添加依赖：

在 yarn 的文档没找到相关的方法....

给所有配置的包添加依赖：

同上

重新安装依赖：

```shell
yarn
```



### 某个子包需要不同版本的依赖，如何安装？

a 包需要安装指定版本的 lodash

```shell
yarn workspace a add lodash@4.16.0 -D
```

Yarn 会在 `packages/a/node_modules` 安装对应版本的 lodash 依赖



### 批量执行命令

为 a 和 b 包分别添加下面的命令：

```json
{
  "scripts": {
    "test": "echo 1", // a
    "test": "echo 2", // b
  }
}
```

执行所有包的 `test` 命令：

```shell
yarn workspaces run test
```

单独执行 a 包的 test 命令：

```shell
yarn workspace a run test
```

不支持多个指定包执行命令...



### 发布

配置 .npmrc，这里我发到私有的 npm 源上：

```shell
echo "registry=http://my.com" >> .npmrc
```

发布所有的包：

不支持...

发布单独的包：

```shell
yarn workspace a publish
```



## 总结

从上面的对比来说，yarn 的功能比 npm 差不少，但我上面用的是 yarn@1 的版本，而我看了下 yarn@2 workspace 提供的 cli 会多点，和 npm 类似，所以建议还是使用 npm 或 yarn@2 版本的 workspace 功能

总的来说，npm 和 yarn 提供的 workspace 功能，提供的是底层的功能，比如文件的链接，包的依赖安装和命令执行等，那这和 lerna 有什么区别？

1. 默认情况下，文件的链接是 lerna 自己实现的，同时它也可以支持 lerna 和 npm/yarn 的 workspace 共同使用
2. lerna 提供更多的命令使用，例如发布（生成 tag）、内置的根据 git commit 生成 changelog、子包的版本号管理

相对于来说，lerna 的功能更加自动化，但现在 lerna 已经不维护了（该记录是在 2022-04-18 写的），所以对于我个人来说，应该不会再在新项目使用 lerna



## 参考资料

1. [npm workspace 文档](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
2. [yarn2 workspace 文档](https://yarnpkg.com/features/workspaces)
3. [yarn1 workspace 文档](https://classic.yarnpkg.com/en/docs/cli/workspace)
