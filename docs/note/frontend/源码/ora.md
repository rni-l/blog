---
title: Ora 源码学习
date: 2023-04-03 16:06:00
tags: ["js", "ora"]
categories: ["记录"]
---

> ora 是一个 node.js 在终端显示 loading 效果的库


## 目标
1. 实现原理
2. demo

## 原理

整个效果看起来并不是很复杂，要实现的功能主要以下几点：
1. 如何重复在同一行输出内容
2. 如何清空某一行的内容
3. loading 效果和颜色效果

### 如何在同一行输出

ora 库添加了一个定时任务，执行 `render` 进行重绘：
``` javascript
// 伪代码：
render() {
	this.clear();
	this.#stream.write(this.frame());
	this.#linesToClear = this.#lineCount;

	return this;
}
```

这里使用了 `#stream.write` 去渲染内容，这里的 `#stream` 默认就是 `process.stderr`

我们再来看下 `frame` 函数：
``` javascript
// 伪代码：
frame() {
	const {frames} = this.#spinner;
	let frame = frames[this.#frameIndex];

	if (this.color) {
		frame = chalk[this.color](frame);
	}

	this.#frameIndex = ++this.#frameIndex % frames.length;
	const fullPrefixText = (typeof this.#prefixText === 'string' && this.#prefixText !== '') ? this.#prefixText + ' ' : '';
	const fullText = typeof this.text === 'string' ? ' ' + this.text : '';
	const fullSuffixText = (typeof this.#suffixText === 'string' && this.#suffixText !== '') ? ' ' + this.#suffixText : '';
	return fullPrefixText + frame + fullText + fullSuffixText;
}
```

这里只是将要输出的文本拼合，没有加什么特别的内容。如果我按照这逻辑去实现：

``` javascript
// 我的 demo
const stdout = process.stdout
function render(txt) {
  let time
  let count = 0
  time = setInterval(() => {
    count++
    stdout.clearLine()
    stdout.write(`{count} `)
    if (count >= 10) {
      clearInterval(time)
      stdout.clearLine()
      console.log('Finished');
    }
  }, 100);
}

render('loading:')
```
每次输出的内容会在上一次输出内容的后面

**我 demo 的问题是没有将终端的光标设回原来的位置**

在 ora 的源码是有设置的：

``` javascript
// 伪代码：
clear() {
	if (this.#indent || this.lastIndent !== this.#indent) {
		this.#stream.cursorTo(this.#indent);
	}
}
```

这里用了 TTY 模块的 `cursorTo` 方法，将光标设到指定位置

![[标准输出和输入#什么是 TTY？]]

### 如何清空某行的内容

``` javascript
// 伪代码：
clear() {
	if (!this.#isEnabled || !this.#stream.isTTY) {
		return this;
	}

	this.#stream.cursorTo(0);

	for (let index = 0; index < this.#linesToClear; index++) {
		if (index > 0) {
			this.#stream.moveCursor(0, -1);
		}

		this.#stream.clearLine(1);
	}

	if (this.#indent || this.lastIndent !== this.#indent) {
		this.#stream.cursorTo(this.#indent);
	}

	this.lastIndent = this.#indent;
	this.#linesToClear = 0;

	return this;
}
```

原理就是记录好位置，循环执行 `moveCursor` 和 `clearLine`，逐行清空（`clearLine` 只支持逐行清空）

### loading 效果和颜色效果

它这里用了 `cli-spinners` 和 `chalk` 来实现，留到以后分析

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
	3. ![[chalk#原理]]

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
