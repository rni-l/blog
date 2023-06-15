---
title: chalk 源码学习
date: 2023-04-06 17:49:00
tags: ["js", "chalk"]
categories: ["记录"]
---

> chalk 是一个 node.js 在终端处理文字效果的库，可以设置字体样式和颜色


## 目标
1. 实现原理
2. demo

## 如何使用？

> 来自源 chalk 的 README.MD

``` javascript
import chalk from 'chalk';

console.log(chalk.blue('Hello world!'));
console.log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
console.log(chalk.hex('#DEADED').bold('Bold gray!'));
```

## 原理

基于 ASNI 转义字符实现：
* 用于设置文字的颜色
* 实现原理
  * 其原理是通过控制台中 ANSI 转义序列来实现彩色输出
  * ANSI 转义序列是一组特殊的字符，用于在终端或控制台中控制输出的颜色、样式和位置
  * 面是一些常用的 ANSI 转义序列：
    - \x1b[0m：重置所有样式
    - \x1b[1m：加粗
    - \x1b[2m：弱化
    - \x1b[3m：斜体
    - \x1b[4m：下划线
    - \x1b[30m - \x1b[37m：设置前景色（30-37 对应不同颜色）
    - \x1b[40m - \x1b[47m：设置背景色（40-47 对应不同颜色）




## Demo

### 第一版 Demo

``` javascript
const stdout = process.stdout
function render(txt) {
  let time
  let count = 0
  time = setInterval(() => {
    count++
    stdout.clearLine()
    stdout.write(`\x1b[31m${txt}: \x1b[0m${count}\r`)
    if (count >= 10) {
      clearInterval(time)
      stdout.clearLine()
      console.log('Finished');
    }
  }, 100);
}

render('loading:')
```

回答上面的三个问题：
1. 如何重复在同一行输出内容
	1. 我这里和 ora 的处理不一样，使用 `process.stdout` ，并且在文本最后加上 `\r`
2. 如何清空某一行的内容
	1. `process.stdout.clearLine()` 可以清空当前行
3. loading 效果和颜色效果
	1. loading 效果其实就是几个不同的 icon/字符 循环显示
	2. 颜色效果:
	3. ![[问题聚合#chalk]]

## 总结

我看了 `ora` 的源码，总共也才 420 行不到，但作者用了很多库：

``` javascript
import process from 'node:process';

import chalk from 'chalk';

import cliCursor from 'cli-cursor';

import cliSpinners from 'cli-spinners';

import logSymbols from 'log-symbols';

import stripAnsi from 'strip-ansi';

import wcwidth from 'wcwidth';

import isInteractive from 'is-interactive';

import isUnicodeSupported from 'is-unicode-supported';

import stdinDiscarder from 'stdin-discarder';
```

有不少是该作者开发的，而且我看了某些源码，其实都很简单...

总结来说 `ora` 的实现很简单，十几行代码就能复刻核心功能

## 参考资料
1.  [tty - node.js](https://nodejs.org/api/tty.html#tty)
2. [process - node.js](https://nodejs.org/api/process.html#a-note-on-process-io)
3. chatGPT4
