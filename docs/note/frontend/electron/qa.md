---
title: Electron-qa
date: 2022-01-03 00:00:00
tags: ["js", "electron"]
categories: ["记录"]
---

# Electron-qa

> 记录在开发 electron 时遇到的问题



## 生产模式如何解决请求跨域问题？

> 通常情况，生产模式的渲染进程，访问的是本地文件，也就是页面 url 是 ‘file:///index.html’ 这样的路径，会出现跨域问题。

### 请求跨域

这里主要是生产模式的处理，开发模式，可以使用 webpack/vite 进行代理。

#### 使用本地文件

详细看 [Electron 跨域问题处理](/note/frontend/electron/跨域问题.html)



### Cookie 处理

同上。



### 请求一致处理

> 是否需要将主进程的请求和渲染进程的请求使用同一个模块？

在进行 Http 请求时，可以有两种方式，一种是用主进程的 `net.request` 模块进行请求，另一种是用渲染进程的 `XMLHttpRequest` 对象，也就是 `Ajax`。

这里说下两种的方式的区别：

* `net.request`
  * 相当于后端发起一个 HTTP 请求，没有浏览器的限制，比如没有跨域限制，可以获取响应返回的 `Set-Cookie`
  * 需要自己处理上传的数据封装，比如 `Form-Data` 要处理文件内容，设置 `multiple/orm-Data` 的 `boundary`
  * 需要自己手动处理请求结果，比如 `buffer` -> `string` 或 `buffer` -> `json` 等
* `XMLHttpRequest`
  * 不能操作 `cookie`



## 应用体积

### node_modules 处理

非主进程使用的依赖，放到 `devDependencies` 内



## 升级

### 升级方案



## 进程间的通信

### 通信方式



## 应用安全问题

### 是否要开启 csp 模式？

### 开启 csp 模式后，如何处理请求跨域问题？



## 快捷键处理

### 快捷键类型

全局

本地

渲染进程



## 应用缓存

### electron-store



## 优化开发模式

### 使用 Vite



## 使用 Vite 的问题

### 引入 Jest 问题



## 性能问题

### 页面节点过多，如何优化？

### 如何定位性能问题



## 参考资料

* [MDN - multiple/form-data 说明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
* [为什么需要设置 boundary](https://stackoverflow.com/questions/3508338/what-is-the-boundary-in-multipart-form-data)

