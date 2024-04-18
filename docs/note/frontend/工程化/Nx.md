---
title: nx
date: 2023-09-15 10:40:00
tags: ["nx", "monorepo"]
categories: ["记录"]
---
## 实践

### 搭建 monorepo

项目结构：
```shell
|-- [  92]  README.md
|-- [ 212]  index.js
|-- [ 246]  nx.json
|-- [327K]  package-lock.json
|-- [ 274]  package.json
`-- [ 128]  packages
    |-- [ 160]  is-even
    |   |-- [  49]  index.ts
    |   `-- [ 278]  package.json
    `-- [ 160]  is-odd
        |-- [  82]  index.ts
        `-- [ 231]  package.json
```

可以直接按照[官方教程](https://nx.dev/getting-started/tutorials/package-based-repo-tutorial)来构建
### 添加依赖
和 `turborepo` 一样，还是要依赖 `npm` 相关工具来安装依赖

### 执行命令

```shell
# 对所有项目执行 build 命令
nx run-many -t build
# 对 is-odd 项目执行 build 命令
nx build is-odd
# 单个连续执行命令
nx run-many -t test build -p is-odd
# 所有项目连续执行命令
nx run-many -t test build
```

### 发布
没有相关封装，用 `lerna` 处理

## 参考资料
1. [nx](https://nx.dev/getting-started/tutorials/package-based-repo-tutorial)