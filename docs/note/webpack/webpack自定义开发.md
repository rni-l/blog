---
title: webpack 自定义开发
date: 2021-04-12 12:00:00
tags: ["webpack"]
categories: ["记录"]

---

> webpack 自定义 loader 和 plugin



## 如何自定义

`webpack` 可以自定义 `loader` 和 `plugin`，可以看下官方教程就行，一个官方模板：

```javascript
const { getOptions } = require('loader-utils'); // loader 的工具方法
const { validate } = require('schema-utils'); // loader 配置校验

// 该 loader options 的属性结构
const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string',
    },
  },
  additionalProperties: false
};

module.exports = function (source) {
  const options = getOptions(this);
  console.log(options, source)

  // 校验用户的配置 options 是否符合要求
  validate(schema, options, {
    name: 'Example Loader',
    baseDataPath: 'options',
  });

  // Apply some transformations to the source...

  return `export default ${JSON.stringify(source)}`;
}

```

## 自定义 Loader

### 注意点

函数里面一定要返回字符串出去，且必须带有 `export default/module.exports` 模块的代码

```javascript
module.exports = function(source) {
  return `export default ${source}`;
}
```





## 链接：

1. [webpack 官方教程](https://webpack.js.org/contribute/)
2. [loader-api](https://webpack.js.org/api/loaders/#thisemitfile)
3. [schema-utils](https://github.com/webpack/schema-utils)
4. [loader-utils](https://github.com/webpack/loader-utils)

