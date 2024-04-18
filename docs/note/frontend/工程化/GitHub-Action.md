---
title: GitHub-Action
date: 2023-07-12 23:25:00
tags: ["github"]
categories: ["记录"]
---

> 使用 GitHub action 来进行一些自动化的操作

## 自动发布到 Npm

### 添加配置文件
可以在GitHub 在线配置，也可以自己新增，下面是一个实例：
```yaml
# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

name: xxx

on:
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm install
      - run: npm run build

  publish-npm:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: https://registry.npmjs.org/
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

```
这里有两个 Job: 构建和发布。当在 GitHub 的仓库里添加一个 Release 时，就会触发该 action，然后将打包后的文件，发布到 Npm 中

这里要配置 Npm 的 token 来授权

### 配置 Npm token

去 npmjs.com 里添加一个 token:
1. 点击 access tokens
2. Generate New Token
3. Classic Token
4. 选择 “Automation” 类型
5. 完成

然后去对应的 GitHub 仓库中配置变量：
1. 点击仓库的 setting
2. 点击 Secrets and Variables
3. 点击 Actions
4. 点击 New Repository Token
5. Key 为 NPM_TOKEN
6. Value 为 Npm 的 token

这样时候就完成所有的配置了