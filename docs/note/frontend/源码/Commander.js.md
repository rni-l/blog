---
title: Ora 源码学习
date: 2023-04-03 16:06:00
tags: ["js", "ora"]
categories: ["记录"]
---

> commander.js 是一个 NodeJS 库，它可以帮忙你的 cli 应用程序提供参数处理和提示、文档显示、命令执行等功能


## 目标
1. 梳理核心功能
2. 实现一个简单的 demo

## 原理

### 基本使用
> 来自源 GitHub 文档

``` javascript
const { Command } = require('commander');
const program = new Command();

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();
```

``` shell
$ node string-util.js help split
Usage: string-util split [options] <string>

Split a string into substrings and display as an array.

Arguments:
  string                  string to split

Options:
  --first                 display just the first substring
  -s, --separator <char>  separator character (default: ",")
  -h, --help              display help for command

$ node string-util.js split --separator=/ a/b/c
[ 'a', 'b', 'c' ]
```

### 参数处理
解析命令内容：
``` shell
node x.js --a // { a: true }
node x.js --a=b --c // { a: 'b', c: true }
node x.js dc --b=b -d // dc.action.str { b: 'b', d: true }
node x.js --z // 没有配置 z 参数，throw error
```

### 命令

### 验证和提示

### 文档生成



## Demo


## 总结


## 参考资料
1. [github - commander.js](https://github.com/tj/commander.js)
2. chatGPT4
