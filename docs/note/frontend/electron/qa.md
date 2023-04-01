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



##### 使用 Vite 的问题

##### 引入 Jest 问题



## 打包

### macOS 环境打包 Windows

#### macOS Catalina doesn't support 32-bit executables and as result Wine cannot run Windows 32-bit applications too  

打包配置如下：

```json
{
  "mac": {
    "target": ["dmg"]
  },
  "win": {
    "target": [
      {
        "target": "msi"
      }
    ]
  }
}
```

但是会出现异常：

```shell
• building        target=DMG arch=x64 file=dist/ok-1.1.0.dmg
  • packaging       platform=win32 arch=x64 electron=17.1.0 appOutDir=dist/win-unpacked
  • building        target=MSI arch=x64 file=dist/ok 1.1.0.msi
  • Manufacturer is not set for MSI — please set "author" in the package.json
  ⨯ macOS Catalina doesn't support 32-bit executables and as result Wine cannot run Windows 32-bit applications too  
  • building block map  blockMapFile=dist/ok-1.1.0.dmg.blockmap
  ⨯ /xxx/node_modules/app-builder-bin/mac/app-builder_amd64 exited with code ERR_ELECTRON_BUILDER_CANNOT_EXECUTE  failedTask=build stackTrace=Error: /xxx/node_modules/app-builder-bin/mac/app-builder_amd64 exited with code ERR_ELECTRON_BUILDER_CANNOT_EXECUTE
```

简单来说，就是不支持 x32 位的 windows  打包，那我们改成 `nsis`即可：

```shell
{
  "mac": {
    "target": ["dmg"]
  },
  "win": {
    "target": [
      {
        "target": "nsis"
      }
    ]
  }
}
```

或者直接用 Windows 环境进行打包。

参考资料：https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2362#issuecomment-739585694



### Windows 打包 msi 时 name 有特殊字符时异常 errors CNDL0014

electron-builder@23.0.0 版本解决了此问题，更新即可

参考资料： https://github.com/electron-userland/electron-builder/pull/6530



### macOS electron-builder autoupdate Error: ZIP file not provided

打包配置如下：

```json
{
  "mac": {
    "target": {
      "target": "dmg"
    }
  }
}
```

打包发布到 github 的时候是没有 .zip 文件的，这时候应用触发更新时会报错：

```shel
Error: ZIP file not provided:
```

解决方法，参考 `kap` 的配置，改成这样：

```shell
{
  "mac": {
    "target": {
      "target": "default",
      "arch": ["x64"]
    }
  }
}
```

[zip file not provided issue](https://github.com/electron-userland/electron-builder/issues/2199)

[kap 仓库的配置](https://github.com/wulkano/Kap/blob/d336fd46ce40fbc8a0cf73ba0603a80edcb07cdb/package.json)

### 下载新版本时出现 Https 问题：ERR_HTTP2_PROTOCOL_ERROR

添加下面的配置：

```javascript
app.commandLine.appendSwitch('disable-http2');

autoUpdater.requestHeaders = {'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'};
```

[github - electron-builder - issue net::ERR_HTTP2_PROTOCOL_ERROR thrown when an update is available ](https://github.com/electron-userland/electron-builder/issues/4987)

### 打包没有生成 latest.yml 文件

添加 publish 配置：

```json
{
  "publish":[{"provider": "generic", "url": "your url (it could be localhost)"}]
}
```



[github - elctron-builder - issue 解决没有 latest.yml 的问题](https://github.com/electron-userland/electron-builder/issues/925#issuecomment-282008092)

### Windows 没有 app-update.yml 文件

1. [stackoverflow](https://stackoverflow.com/questions/67191654/problem-with-app-update-yml-files-is-not-generated-in-electron)
2. [github - Auto update doesn't work: app-update.yml is missing](https://github.com/electron-userland/electron-builder/issues/4233)


## 性能问题

### 页面节点过多，如何优化？

### 如何定位性能问题



## 参考资料

* [MDN - multiple/form-data 说明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)

* [为什么需要设置 boundary](https://stackoverflow.com/questions/3508338/what-is-the-boundary-in-multipart-form-data)

* [解决 macos 打包 windows 异常问题](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2362#issuecomment-739585694)

* [zip file not provided issue](https://github.com/electron-userland/electron-builder/issues/2199)

* [kap 仓库的配置](https://github.com/wulkano/Kap/blob/d336fd46ce40fbc8a0cf73ba0603a80edcb07cdb/package.json)

* [github - electron-builder - issue net::ERR_HTTP2_PROTOCOL_ERROR thrown when an update is available ](https://github.com/electron-userland/electron-builder/issues/4987)

  

