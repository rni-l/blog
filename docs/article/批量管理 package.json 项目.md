---
title: 批量管理 package.json 项目
date: 2021-10-10 00:00:00
tags: ["nodejs", "cli"]
categories: ["分享"]
---



> 本篇文章首发于掘金


## 概述

大家好，本篇文章的内容主要分为两部分：

1. 开发 [multi-dependent-management](https://github.com/rni-l/multi-dependent-management) 工具库，解决在业务上遇到的问题
2. 关于开发这个工具库时的一些总结

而 `multi-dependent-management` 是一个基于 NodeJS 开发的，在命令行中使用的工具库，主要用于批量管理基于 Npm 的 `package.json` 项目依赖。它可以批量对你的项目进行依赖升级、移除、查看差异、执行 shell 命令等操作。

首先我们先来介绍下为什么要开发这样一个工具。

## 背景

我现在的公司，前端开发只有 3 人，但内部使用的管理系统和 H5 就有 27 个了（大部分都是维护状态），而这些前端应用，都是基于一套组件库去开发的：

![p2.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41beb71fbe124f239ef2dd4f7f30d44d~tplv-k3u1fbpfcp-watermark.image?)

现有的 Npm 包会有多个，当我们出现 Bug 或有新功能迭代时，要同时更新多个系统并统一发布上线（因为是对内使用的，而且技术管理比较松，测试没问题就可以在某个时间段上线），这时候就有下面的流程：

![p3.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f57582cd1ab4f4f895d64fa3d4e7c52~tplv-k3u1fbpfcp-watermark.image?)

不需更新业务代码，只更新依赖版本，就是上面的流程。

如果同时有多个系统要更新，这里的操作就很麻烦。有一次因为用户模块出了问题，所有使用该模块的系统（二十多个）都要更新，那时候非常痛苦。

因为项目维护都集中在一两个人，所以项目都会在我们电脑本地。这时候我就想，有没有工具可以批量更新多个项目的依赖，然后直接 `git commit` 提交到 gitlab 上？（公共模块要迭代，比如侧边栏、导航栏、页面初始化等操作，都已经封装好了，所以大部分时候我们的组件库更新都是只需更新版本号）

这种操作，有点像 [npkill](https://github.com/voidcosmos/npkill)，它会扫描的目标路径，让你选择对应含有 `node_modules` 的文件夹，进行选择删除。

还有 [npm-check-updates](https://github.com/raineorshine/npm-check-updates) 可以帮你进行依赖检查并更新的操作。

我自己搜索了下，没找到可以集成上面我所说的内容的工具库，所以就打算自己搞一个，功能如下：

1. 批量依赖升级
2. 批量依赖移除
3. 批量依赖变更
4. 批量执行 shell 命令
5. 查看项目依赖版本差异

这样就可以解决我上面所说的需求，通过执行命令，帮我把重复类似的工作处理掉。



## 使用

详细的使用教程在 [github 仓库](https://github.com/rni-l/multi-dependent-management) 有详细说明了，这里主要分享下如何快速使用，并使用该工具快速解决上面的问题。

这个工具库是用 NodeJS 进行开发的，在命令行执行操作，和我们平时使用的一些命令类似，比如：`vue create test`。

整个工具库的操作流程，基本如下：

![d1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e64574b3c334d00bfaacd48659c2529~tplv-k3u1fbpfcp-watermark.image?)



按照上面背景所说的需求，我们需要通过命令行批量更新依赖版本，并提交到 gitlab。

首先安装工具库：

```shell
# 全局安装
npm i multi-dependent-management -g
```



### 解决方式一

假设我要修改的项目都在 `./demo` 下面。

首先进行依赖更新：

```shell
# 全局安装完依赖后，使用 mdm 简写去使用
mdm upgrade -p ./demo
```

* `mdm` 就是 `multi-dependent-management` 这个库的简写
* `upgrade` 是这个库可以触发的动作
* `-p ./demo` 是一个参数，告诉这个工具库要从哪个路径进行查询

![upgrade01.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e2ca09a20047f6950c358216d3e26b~tplv-k3u1fbpfcp-watermark.image?)

首先会递归查询该路径下所有的 `package.json` 文件，然后使用 [npm-check-updates](https://github.com/raineorshine/npm-check-updates) 检查每个项目的依赖版本是否最新，将可以更新的依赖一一展现出来，让你选择哪个依赖需要更新：

![upgrade02.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc24c36115694cfcacab1909785a0222~tplv-k3u1fbpfcp-watermark.image?)

当我们选择要更新的依赖后，就会通过 `fs` 直接修改文件的版本号，而不会安装依赖。

接着就要把修改记录提交到 gitlab，这时候用到的是 `shell` 命令：

```shell
mdm shell -p ./project
```

会根据你选中的项目，执行相关的脚本命令，该功能自由度比较高，可以搭配不同的操作。

选完要处理的项目后，需要先输入共同执行的命令，没有的话，不输入保存就行了：

![Xnip2021-10-08_10-16-20.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b960b52e35a40428a83e7442c29da6e~tplv-k3u1fbpfcp-watermark.image?)

我们这里输入了 `git` 提交的命令。

二次确认后，执行结果：

![Xnip2021-10-08_10-17-13.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b09b736e17424fe28cd1be059c655ca6~tplv-k3u1fbpfcp-watermark.image?)

成功将多个项目提交到 `gitlab`。



### 解决方式二

方式一分别用了两个命令去操作：`upgrade` + `shell`。但其实我们可以直接 `shell` 一次性完成。

同样假设我们的项目在 `./demo` 下，现在需要更新 `vue` 的版本，并提交到 `gitlab`。

```shell
mdm shell -p ./demo
```



将依赖升级的命令，也放到 `shell` 去操作：

![Xnip2021-10-08_10-24-31.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f618872492a3447c94f96f723a0f9573~tplv-k3u1fbpfcp-watermark.image?)

安装完依赖后，接着就提交代码到 gitlab：

![1633660057148.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89b594f848ee4726bb90f07e13fbca7c~tplv-k3u1fbpfcp-watermark.image?)



### 总结

上面两种方式都可以解决我在“背景”所说的问题，具体使用哪种，看你的需求，使用 `upgrade` 命令，会自动帮你查找每个依赖可以升级的版本，而 `shell` 是纯手动模式，让你完全控制要升级的依赖版本。

除去这两个功能，[`multi-dependent-management`](https://github.com/rni-l/multi-dependent-management) 工具库还有其他的功能，具体的使用大家可以去 [`github`](https://github.com/rni-l/multi-dependent-management) 或者 [`npm`](https://www.npmjs.com/package/multi-dependent-management) 查看。



## 关于开发

### 技术栈

该工具的开发，使用的技术栈：

1. 有关命令行操作的工具
    1. commander
    2. enquirer（命令行交互）
    3. ora
    4. shelljs
    5. npm-check-updates（检查依赖版本是否需要升级）
2. 单元测试
    1. jest
    2. memfs（使用内存模拟 fs）
3. 工具库
    1. lodash
    2. just-diff
    3. semver
4. 其他
    1. typescript
    2. commitlint
    3. husky
    4. lint-staged
    5. standard-version
    6. eslint

整个开发，就是上面所展示的库，像单测、工具库、husky、commitlint 这些都是很常用的，这里就不一一展开。




### 开发工作流

使用 `eslint` 规范代码样式，`jest` 做单元测试， `husky` + `lint-staged` + `git hook` 进行相关命令操作。

下图就是我在开发这个工具库时，执行的流程：

![a2.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ee97b2d0d0c4d8f8a02093d9c30c8cd~tplv-k3u1fbpfcp-watermark.image?)



下面我们从零开始，实现上面的工作流程配置，如果嫌麻烦，我这里已经按照下面的流程，配好了一个现成的[模板](https://github.com/rni-l/base-utils-template)。



#### 准备工作

整个配置，大概需要 10 - 15 分钟左右。

我们首先要建一个项目，使用 `typescript`  进行开发。

```shell
mkdir test && cd test # 新建文件

npm init # npm 初始化

git init # 初始化 git

mkdir lib && mkdir tests # 添加文件夹

npm i typescript -S

# 添加忽略文件：node_modules coverage dist
vim .gitignore
```

添加文件：

`vim lib/a.ts`

```typescript
export function getName() {
  return 'ok'
}
export function getData() {
  return {
    name: getName()
  }
}
```

`vim lib/index.ts`

```typescript
import { getData } from './a'

console.log(getData())

```



因为我们用的是 `typescript`，所以需要先编译才能用 `node.js` 执行

在 `package.json` 添加脚本命令：

```json
{
  "scripts": {
    "tsc": "tsc",
    "start": "npm run tsc && node ./dist/index.js"
  }
}
```

`tsc` 命令是用来编译 `.ts` 文件，变为  `.js`。然后使用 `node` 执行相关文件。

添加 `tsconfig.json`，告诉 `typscript` 要如何进行编译。

 `vim tsconfig.json`：

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "./dist",
    "declaration": true,
  },
}
```

这里主要说下 `outDir` 和 `declaration`。当你执行 `tsc` 时，会将转译文件放到指定目录，而 `declaration` 会生成 `.d.ts` 文件。



配置完成后， 我们执行下命令：`npm start`，会有下面的日志显示：

```shell
npm start

> test-ddd@1.0.0 start ~/Downloads/test-ddd
> npm run tsc && node ./dist/index.js


> test-ddd@1.0.0 tsc ~/Downloads/test-ddd
> tsc

{ name: 'ok' }
```

看到日志成功打印，我们的准备工作完成了，目录结构是这样的：

```shell
.
├── lib
│   ├── a.ts
│   └── index.ts
├── package-lock.json
├── package.json
├── tests
└── tsconfig.json
```

下面就开始配置开发工作流。



#### 配置 husky

husky 是按官方教程来的，这里用的版本是 7.x，要注意版本号，很多以前的教程是在 `package.json` 配置，那个是要用 4.x 版本才行。

```shell
# 先保证当前项目有 .git 文件
# 初始化并安装
npx husky-init && npm install
# 这时候，项目根目录会生成一个 .husky 文件，里面包含了一个钩子文件：pre-commit
```

![Xnip2021-09-30_10-31-51.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c85d4f04f4554e63ba0782cfe1c4c398~tplv-k3u1fbpfcp-watermark.image?)

修改 `.husky/pre-commit` 文件，将里面的 `npm test` 改为 `npm run lint-staged`，后面会用到。



#### 配置 lint-staged

`npm i lint-staged -D`

在 `package.json` 添加相关配置：

```json
{
  "scripts": {
    "lint-staged": "lint-staged",
    "lint": "eslint --fix lib/**",
    "test:unit": "jest"
  },
  "lint-staged": {
    "{lib,tests}/**/*": [
      "npm run lint",
      "npm run test:unit",
      "git add"
    ]
  },
}
```

这里我们我们配置了 `lint-staged` 和 3 个脚本命令。`lint` 和 `test:unit` 是执行 `eslint` 和 `jest` 用的，下面我们继续配置这两个工具。



#### 配置 eslint

安装：

```shell
npm i eslint -D
# 初始化
./node_modules/.bin/eslint --init
# 按着指示进行配置即可
# 这是我选择的配置：
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1 || ^5.0.0 @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? · No / Yes

```

添加 `.eslintignore` 忽略不必要的文件，`vim .eslintignore`：

```shell
package.json
package-lock.json

```

配置完成后，我们看下相关命令：`    "lint": "eslint --fix lib/**”`

这里是指定要 `fix` 的文件路径，根据你的项目进行相关变动即可。

最后可以试下执行 `npm run lint` 看看是否成功。



#### 配置 jest

```shell
npm i jest -D
# 初始化配置
./node_modules/.bin/jest --init
# 按照你自身的需求进行配置即可
```

配置 `babel` 和 `typescript`：

```shell
npm i babel-jest @babel/core @babel/preset-env @babel/preset-typescript ts-node @types/jest @types/node -D
```

修改 `tsconfig.json` ：

```shell
{
  ...,
  // 添加：
  "compilerOptions": {
    ...,
    "types": [
      "jest",
      "node"
    ]
  }
}
```

添加 `babel.config.js` 文件：

```shell
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

我们添加一个测试文件，验证下是否成功：

`vim tests/a.spec.ts`：

```typescript
import { getName } from '../lib/a'

describe('测试 getName', () => {
  test('执行 getName，返回字符串 "ok" ', () => {
    expect(getName()).toBe('ok')
  })
})

```

修改在 `package.json` 的 `lint` 命令：`"lint": "eslint --fix lib/** tests/**”`，添加对 `tests` 文件的检查。

我们执行之前添加的脚本命令：`npm run test:unit`



```shell
npm run test:unit

> test-ddd@1.0.0 test:unit ~/Downloads/test-ddd
> jest

 PASS  tests/a.spec.ts
  测试 getName
    ✓ 执行 getName，返回字符串 "ok"  (2 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |      50 |      100 |      50 |      50 |
 a.ts     |      50 |      100 |      50 |      50 | 5
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.914 s
Ran all test suites.
```

看到执行成功了，`jest` 的配置也完成了。



#### 试验

准备工作都准备好，我们来提交下代码试试：

```shell
git add ./
git commit -m 'test'
```

这时候会看到触发钩子，使 `lint-staged` 开始工作：

```shell
lint-staged

⚠ Skipping backup because there’s no initial commit yet.

⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.

✔ Preparing...
⚠ Running tasks...
  ❯ Running tasks for {lib,tests}/**/*
    ✖ npm run lint [FAILED]
    ◼ npm run test:unit
    ◼ git add
✔ Applying modifications...

✖ npm run lint:

...

~/Downloads/test-ddd/tests/a.spec.ts
  3:1  error  'describe' is not defined  no-undef
  4:3  error  'test' is not defined      no-undef
  5:5  error  'expect' is not defined    no-undef
```

有个文件的代码格式没通过，所以整个 `commit` 操作被拦截下来，无法成功 `commit`。同理，如果 `lint` 命令通过，但 `test:unit` 命令没通过，也是会被拦截下来。

我们来修复下这个问题：

在 `./eslintrc.js` 添加下面的配置：

```javascript
module.exports = {
  env: {
    jest: true,
  },
}
```

再次 `commit` 后，提交成功，`eslint` 和单测都成功。

```shell
git commit -m 'test'

> test-ddd@1.0.0 lint-staged ~/Downloads/test-ddd
> lint-staged

⚠ Skipping backup because there’s no initial commit yet.

⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.

✔ Preparing...
✔ Running tasks...
✔ Applying modifications...
[master (root-commit) 658c2dd] test
 12 files changed, 6339 insertions(+)
 .....
```

到这里，已经完成我们的配置。整个工程配置，可以当成一个工具库模板，后面有新的工具开发，直接使用该模板，快速搭建基础功能。




### 单元测试

这个工具库我是有写单元测试，因为写得不是很多，只能根据覆盖率去写，哪里没有覆盖到，就补用例，一些重点的环节，就尽量测试不同的情况。

![Coverage Status](https://coveralls.io/repos/github/rni-l/multi-dependent-management/badge.svg)

整个单测过程，我想总结下两个点：

1. 使用 `memfs` 这个库是 mock `fs`
2. 使用 `Jest` 的 `spyOn` 方法，mock 模块内的某个函数

这两个 Mock，是我在写单测中，经常要用到的。



#### 使用 `memfs` mock `fs`

因为 `fs` 是属于 `io` 操作，而且工具方法涉及到对文件的操作，如果不 mock `fs`，需要写一些重置方法，重置用于单测的文件。

或者还可以直接 mock 使用了 `fs` 的方法，但这个我觉得非常麻烦，因为有大量的测试用例需要用到，并且用到的场景有些会不同，所以这个方法我也没采用。

最后我是看到这篇文章 [Testing filesystem in Node.js: The easy way](https://medium.com/nerd-for-tech/testing-in-node-js-easy-way-to-mock-filesystem-883b9f822ea4) 后，知道了 `memfs` 这个库，使用内存模式去模拟 `fs`。个人体验非常好，只需简单的配置，就可以解决 `fs` mock 问题，并且还能自定义文件目录和内容。

首先添加文件：

`tests/__mocks__/fs.ts`

文件内容：

```typescript
import { fs } from 'memfs';

export default fs;
```

使用：

```typescript
const packageJson = { ... }
describe('test', () => {
  beforeEach(() => {
    // 每次执行用例钱，重置内容
    vol.reset();
    // 设置路径、目录和相关文件的内容
    vol.fromNestedJSON({
      p1: {
        'package.json': JSON.stringify(packageJson),
      },
      p2: {
        'package.json': JSON.stringify(packageJson),
      },
    }, '/abc');
  });

  describe('test...', () => {
    it('获取内容', async () => {
      // 使用 fs（已经 mock 处理了）获取对应路径的文件内容
      const data = JSON.parse(fs.readFileSync('/abc/p1/package.json', { encoding: 'utf-8' }));
      // 判断获取的文件内容是否和开始配置的数据一致
      expect(data).toBe(packageJson); // pass
    });
  });
```

可以看到配置过程非常简单，而使用效果和 `fs` 没什么区别。



#### Mock 模块内的某个函数

我们看下要测试的这个方法：


```typescript
// 伪代码
import {
  getConfirmPrompt,
} from './utils';
import * as upgradeUtils from './upgrade';

export async function upgrade(paths: string[]): Promise<void> {
  await upgradeUtils.getMultiSelectProject(paths);
  await.getConfirmPrompt().run();
}
```

这里只展示了关键点，我们要 mock 上面的两个函数：

* `getConfirmPrompt` 函数是另一个文件引入的
* `getMultiSelectProject` 函数是同一个文件的



要 mock `getConfirmPrompt` 函数很简单，直接使用 `spyOn` 就行了：

```typescript
// 伪代码
import * as utils from '../lib/utils';

describe('test', () => {
  test('upgrade.js', () => {
    jest.spyOn(utils, 'getConfirmPrompt').mockImplementation(() => ([
      { ... }, { ... }
    ]));
  })
})
```



另一个要 mock 的函数是 `getMultiSelectProject`，它是和 `upgrade` 方法在同一个文件，这里的解决方法有点绕。

首先在**该函数**的文件，添加这样一行代码：

`import * as upgradeUtils from './upgrade';`

需要 mock 的函数，要这样调用：

`upgradeUtils.getMultiSelectProject()`

接着在测试文件，同样也是要先引入：

```typescript
// 伪代码
import * as upgradeUtils from '../lib/upgrade';

describe('test', () => {
  test('upgrade.js', () => {
    // 使用 jest.spyOn 去 mock 函数
    // 首先传入该函数的模块，第二个参数是你要 mock 的方法名
    // 再使用 mockImplementation 返回你要 mock 的值
    jest.spyOn(upgradeUtils, 'getMultiSelectProject').mockImplementation(() => ([
      { ... }, { ... }
    ]));
  })
})
```

再使用 `spyOn` 和 `mockImplementation` 对 `getMultiSelectProject` 函数 mock 就行了。

这里我还没搞懂为什么要这样处理，后面再归纳下不同情况的 mock 方式。



## 总结

这次分享的内容，主要是如何使用 `multi-dependent-management` 这工具去解决在开发遇到的问题，并总结在开发这个工具时的功能。 虽然平时有做一些小工具的开发，应用到工作上，但都很少进行这样的总结，所以这次尝试下，锻炼自己的总结能力和表达能力。

以上就是本文章的全部内容了，如果有不正确的地方，感谢指正~



画图工具：`miro`

录屏工具：`kap`

[multi-dependent-management 工具仓库地址](https://github.com/rni-l/multi-dependent-management)


## 参考链接

1. [Testing filesystem in Node.js: The easy way](https://medium.com/nerd-for-tech/testing-in-node-js-easy-way-to-mock-filesystem-883b9f822ea4)
2. [typescript 快速开始](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)
3. [husky 文档](https://typicode.github.io/husky/#/)
4. [eslint](http://eslint.cn/docs/user-guide/getting-started)
5. [jest](https://jestjs.io/zh-Hans/docs/getting-started#%E4%BD%BF%E7%94%A8-typescript)