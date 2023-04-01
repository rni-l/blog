---
title: VsCode
date: 2023-03-27 16:28:33
tags: ["VsCode"]
categories: ["其他"]
---

# VsCode 使用记录

## 使用 VsCode Debug  Chrome 应用

在 `.vscode` 添加 `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch my cool app",
      "url": "http://localhost:5222"
    }
  ]
}
```

1. 首先开启你要调试的服务
2. 然后 FN + F5 就可以在 VsCode 调试 Chrome  的应用

### 参考链接

1. [官方文档](https://code.visualstudio.com/docs/nodejs/browser-debugging)
