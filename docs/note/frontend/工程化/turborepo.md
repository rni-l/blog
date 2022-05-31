---
title: turborepo
date: 2022-05-05 11:00:00
tags: ["turborepo", "monorepo"]
categories: ["记录"]
---



## 问题

1. 缺少类似 lerna clean 一些便捷指令，需要自己实现
2. pipline 无法调用项目根目录的 script
   1. 如果在 script 添加的话，在 windows 会有兼容问题， powershell 是无法执行 && 指令的
3. 使用 turborepo 同时开启多个服务时，开发日志都混在一个 shell 里面，查看不方便
4. 