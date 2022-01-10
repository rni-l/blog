---
title: 从零开始，快速开发一个 chrome 插件，爬取网页内容
date: 2021-10-15 14:14:14
tags: ["chrome 插件"]
categories: ["分享"]
---

## 概述

最近在边学边开发一个 chrome 插件，帮人家爬取网站的内容，所以总结下开发时遇到的问题，怎么从零开始开发一个 chrome 插件，实现爬取网站内容、脚本间数据通信、脚本权限和  Tab 的控制等功能。

其实 `chrome` 的文档有很详细的快速开始的教程，有兴趣的可以看官方教程：[Getting started](https://developer.chrome.com/docs/extensions/mv3/getstarted/)。本篇总结的内容，主要记录我在开发插件时遇到的问题，会比官方的快速教程涉及的内容更多点。

## 准备

我们要做一个 chrome插件，功能是根据网站的列表，点击对应的详情，获取里面的详细内容，最后在一个自定义页面查看爬取的内容。



我这里已经把下面的内容整合成一个项目了，如果嫌麻烦，可以直接 clone 这个仓库：[chrome 插件 demo](https://github.com/rni-l/chrome-extension-demo)



首先需要新建一个项目，添加对应的文件，文件结构如下：

```shell
.
├── data.json # list.html 和 detail.html 使用到的数据
├── demo
│   ├── background.js
│   ├── common.js
│   ├── getDetail.js
│   ├── getList.js
│   ├── jquery.min.js
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── detail.html # 要爬取的详情页
└── list.html # 要爬取的列表页
```

整个插件的开发，上面的文件都会用到，后面会一一对其补充内容，用到哪个文件，再解释其作用。



### 准备爬取的网页内容

我这里截取了一部分的数据，但也足够使用，修改 `data.json`：

```json
const DATA = {
    "array": [
        {
            "name": "Amy Rodriguez",
            "id": "63000019860511796X"
        },
        {
            "name": "Jose Harris",
            "id": "14000019891212344X"
        },
        {
            "name": "Kenneth Jones",
            "id": "150000200908039343"
        },
        {
            "name": "Elizabeth Wilson",
            "id": "630000197205295754"
        },
        {
            "name": "Elizabeth Hall",
            "id": "32000020040726080X"
        },
        {
            "name": "Frank Garcia",
            "id": "410000199606123660"
        },
        {
            "name": "George White",
            "id": "320000198909170249"
        },
        {
            "name": "Susan Walker",
            "id": "610000198001276878"
        },
        {
            "name": "Deborah Brown",
            "id": "810000200504028347"
        },
        {
            "name": "Angela Hernandez",
            "id": "630000197207149056"
        },
        {
            "name": "Jason Hall",
            "id": "620000198209225078"
        },
        {
            "name": "Robert Clark",
            "id": "350000197212127591"
        },
        {
            "name": "Shirley Thomas",
            "id": "50000020100911686X"
        },
        {
            "name": "Mark Miller",
            "id": "650000200506212412"
        },
        {
            "name": "Dorothy Jones",
            "id": "610000200708203138"
        },
        {
            "name": "Gary Lopez",
            "id": "140000198703280844"
        },
        {
            "name": "Margaret Davis",
            "id": "520000200206107072"
        },
        {
            "name": "Steven Allen",
            "id": "330000201501316327"
        },
        {
            "name": "Brenda Lewis",
            "id": "520000199709270757"
        }
    ]
}
```



`list.html` 有一些我自己测试的逻辑，不用关心这个文件，修改 `list.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .item {
      display: flex;
      width: 500px;
    }
    .page {
      display: flex;
    }
    .prev, .next {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px;
    }
  </style>
  <script src="./data.json"></script>
</head>
<body>
  <div class="wrap">
    <div class="content"></div>
    <div class="page">
      <button class="prev">上</button>
      <div class="pageNum">1</div>
      <button class="next">下</button>
    </div>
  </div>
  <script>
    const oContent = document.querySelector('.content')
    const oNext = document.querySelector('.next')
    const page = 10
    // const total = Math.ceil(DATA.array / page)
    const total = 10
    let pageNum = 1
    let isPending = false
    function insertItem(pageNum) {
      const time = (300 - 100) * Math.random() + 100
      console.log(time)
      isPending = true
      setTimeout(() => {
        const dom = DATA.array.filter((_, i) => i >= ((pageNum - 1) * page) && i < (pageNum * page)).map((v) => {
          return `<div class="item">
            <div class="item-title">${v.name}</div>
            <a class="item-id" href="./detail.html?id=${v.id}" target="_blank">${v.id}</a>
          </div>`
        }).join('')
        oContent.innerHTML = dom
        updateDom()
        isPending = false
      }, time);
    }

    function updateDom() {
      document.querySelector('.pageNum').innerHTML = pageNum
    }

    insertItem(pageNum)
    document.querySelector('.prev').addEventListener('click', () => {
      if (isPending) return
      oNext.removeAttribute('disabled')
      pageNum -= 1
      if (pageNum < 1) pageNum = 1
      insertItem(pageNum)
    })
    oNext.addEventListener('click', () => {
      if (isPending || oNext.getAttribute('disabled')) return
      pageNum += 1
      oNext.removeAttribute('disabled')
      if (pageNum > total) {
        pageNum = total
        oNext.setAttribute('disabled', 'disabled')
      }
      insertItem(pageNum)
    })
  </script>
</body>
</html>
```

修改 `detail.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./data.json"></script>
</head>
<body>
  <div class="wrap">

  </div>
  <script>
    const { search } = location
    const id = search.replace('?id=', '')
    function getData() {
      return DATA.array.find(v => v.id === id)
    }
    setTimeout(() => {
      const data = getData()
      const oWrap = document.querySelector('.wrap')
      oWrap.innerHTML = `<div class="name">${data.name}</div><div class="id">${data.id}</div>`
    }, (1000 - 500) * Math.random() + 1000);
  </script>
</body>
</html>
```

`list.html` 和 `detail.html` 为了模拟更真实的情况，我采用异步渲染数据的形式。



### mainfest.json 配置

首先我们修改 `manifest.json`

```json
{
  "name": "Test",
  "description": "chrome 插件",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "storage",
    "tabs"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["file:///*/chrome-extension-demo/detail.html*"],
      "js": [ "getDetail.js"]
    },
    {
      "matches": ["file:///*/chrome-extension-demo/list.html"],
      "js": ["getList.js"]
    }
  ]
}
```

像 `name`、`description`、`version` 这些字段，就是字面意思，对该插件的一些信息声明。

`background`：相当于整个插件的核心，管理事件。

`permissions`: 告诉浏览器你需要用到什么权限。

`popup`：弹窗页面，其实都是 html，只不过它的打开形式是通过点击在浏览器右上方的 icon，一个弹窗的形式。

`content_scripts`：接收一个数组，根据你的 `matches` 注入对应的 `js` 到页面内执行。



### 导入到 chrome

我们现在可以把插件导入到 chrome，在浏览器输入 chrome://extensions/ 并打开，会看到下图：

![a1](/chrome-plugin/a1.jpg)

我们打开开发者模式，并点击加载扩展程序，选择我们的插件根目录

![a1](/chrome-plugin/a2.jpg)

会看到插件导入成功，现在是启动状态，然后在浏览器盯住显示：

![a1](/chrome-plugin/a3.jpg)

现在插件导入成功了。



### 基本运行原理

我们的准备工作完成了，在开发前要明白我们 chrome 插件基本的运行逻辑：

![a1](/chrome-plugin/d1.jpg)

简单来说：

当我们将插件导入到 `chrome` 并启动后，`background.js` 就会执行。

当我们点击右上角的 icon 时，就会渲染 `popup.html`，当弹窗关闭后，`popup.html` 就会销毁。

当我们访问网页时，如果命中 `manifest.json` 的 `content_scripts` 时，就会执行对应的脚本，每当刷新页面，都会重新执行脚本，这个要注意。

![a1](/chrome-plugin/a4.jpg)

> 来自于 chorme 官方文档：https://developer.chrome.com/docs/extensions/mv3/architecture-overview/

这图是来自于官方文档的，是关于不同的脚本之间是如何通信的，可以看到整个通信的流程，核心是 `background.js`。

总结一下，`popup` 是帮助我们更方便地使用插件，不是必须；`contentscript` 是我们的处理网页内容的核心，`background.js` 是用于管理整个插件的事件通信和做一些全局性的操作。

## 开发

### 使用 `content_scripts` 获取列表和详情的内容

第一步，我们要实现下面的三个功能：

1. 通过  `getList.js` 检查列表页的内容
2. 找到详情链接点击
3. 在详情页使用 `getDetail.js` 获取详情内容并存储到插件缓存
4. 详情页发送后，关闭当前页面



#### 列表页的脚本

修改 `getList.js`：

```javascript
function checkData(executeNum, callback, maxNum = 10) {
  if (executeNum >= maxNum) {
    console.log('100秒过去了，但没有检查到内容')
    return
  }
  setTimeout(() => {
    if (!!document.querySelector('.item')) {
      callback()
    } else {
      checkData(executeNum + 1, callback)
    }
  }, 1000);
}

function getData() {
  const items = document.querySelectorAll('.item')
  console.log(items)
  items.forEach(item => {
    item.querySelector('.item-id').click()
  })
}

checkData(0, getData)
```

我们逐行分析，为什么要这样写。

首先，整个 `js` 文件的代码是没有被嵌套的，但这些生命的函数是不会被注入到页面的全局对象，`chrome` 会提供类似沙箱的效果进行隔离的。但如果你想在页面的全局对象添加属性或方法，可以直接 `widnow.a = 1` 进行添加。

该文件有两个个函数，`checkData` 和 `getData` 。

先看下 `checkData`，它是用于检测页面的内容是否符合我们需要，因为我们处理的网页大部分都是异步的，当浏览器执行你的脚本时，你的数据可能还没渲染出来，所以这时候需要一个轮询的逻辑，不断地检测页面内容，是否符合要求

```javascript
function checkData(executeNum, callback, maxNum = 10) {
  if (executeNum >= maxNum) {
    console.log('100秒过去了，但没有检查到内容')
    return
  }
  setTimeout(() => {
    if (!!document.querySelector('.item')) {
      callback()
    } else {
      checkData(executeNum + 1, callback)
    }
  }, 1000);
}
```

每次等待 1s ，再次进行检测。我们检测的依据，就是这个 `dom` 是否存在，当发现存在时，则只需回调。这里的回调，我们用的是  `getData` 函数：

```javascript
function getData() {
  document.querySelectorAll('.item').forEach(item => {
    item.querySelector('.item-id').click()
  })
}
```

我们这里是简单处理，直接打开所有的内容详情页，但我个人比较倾向于设计一个任务队列，按量去执行任务。

到这里，`getList.js` 任务已经完成了，我们再看下 `getDetail.js`：



#### 详情页的脚本

```javascript
function checkData(executeNum, callback, maxNum = 10) {
  if (executeNum >= maxNum) {
    console.log('100秒过去了，但没有检查到内容')
    return
  }
  setTimeout(() => {
    if (!!document.querySelector('.id')) {
      callback()
    } else {
      checkData(executeNum + 1, callback)
    }
  }, 1000);
}

function getData() {
  const name = document.querySelector('.name').innerHTML
  const id = document.querySelector('.id').innerHTML
  chrome.runtime.sendMessage({ data: { name, id }, close: true })
}

checkData(0, getData)

```

和列表有点类似，同样是一个检测函数和一个获取数据函数。我们主要看下这个：

```javascript
chrome.runtime.sendMessage({ data: { name, id }, close: true })
```

`chrome` 这属性，如果没有注入对应的脚本进去，是不会找到的，这行代码的功能是将数据发送给 `background`。

详情页只做一个获取数据并发送给 `background` 的操作，这里发送了爬取的数据和 `close` 。`close` 是告诉 `background` 这次的发送事件，要把对应的 tab 关闭。



#### 存储数据和关闭 Tab

发送事件写好了，现在要添加一个监听事件，这才能获取详情页发送的数据，修改 `background.js`：

```javascript

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.close) {
    chrome.tabs.remove(sender.tab.id)
  }
  if (msg.data) {
    chrome.storage.sync.get(['data'], function(result) {
      chrome.storage.sync.set({ data: [...result.data, msg.data] }, function() {
        console.log('设置数据成功')
      });
    });
  }
})
```

这里添加了一个监听事件，当任何一个页面使用了 `sendMessage` 都会在这里接收到。

当 `msg.close` 存在时，就会根据 `sender.tab.id` ，使用 `chrome.tabs.remove` 关闭对应的 tab。

当 `msg.data` 存在时，使用 `chrome.storage.sync` API，进行数据缓存。因为我们是增量添加，所以每次存储前都需要先获取之前的值。

我们可以打开 `list.html` 试试效果。在打开前，要先对插件进行刷新操作，只要你修改了代码，就需要进行刷新。

![a1](/chrome-plugin/a8.gif)

可以看到现在已经实现了上面所说的功能，进入列表页，会自动打开详情页，而详情页会爬取内容发送给 `background`，`background` 将数据缓存并关闭对应的 tab。



### 查看爬取的内容

现在已经将内容爬取完了，需要查看爬取数据，我们使用 `popup.html` 把爬取内容展示出来。

修改 `popup.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .wrap {
      width: 300px;
      padding: 24px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <button id="show">显示数据</button>
    <div class="log"></div>
  </div>
  <script src="./popup.js"></script>
</body>
</html>
```

修改 `popup.js`：

```javascript
const btn = document.querySelector('#show')

function log(txt) {
  document.querySelector('.log')
      .appendChild(document.createElement('div'))
      .innerText = "> " + txt;
}

btn.addEventListener('click', () => {
  document.querySelector('.log').innerHTML = ''
  chrome.storage.sync.get(['data'], function(result) {
    (result.data || []).forEach(({ name }) => {
      log(name)
    })
  })  
})

```

这里的逻辑很简单，`popup.html` 就是弹窗渲染的内容，`popup.js` 是对应执行的脚本，点击按钮，把 `chrome.storage.sync` 的数据展示出来。

要注意一点，在开头有说过，我们所用的 `chrome` API 基本上都要在 `manifest.json` 进行声明：

```json
{
  "permissions": [
    "storage",
    "tabs"
  ]
}
```

至此，我们这个小 demo 已经开发完了，功能很简单，但已经覆盖了很多常用的功能，我这里没有对每个使用到的 API 进行详细解释，只是简单说明而已，具体的 API 说明还是要去官方文档查阅。



## 注意事项

在整个开发插件的过程中，还是遇到不少的问题。

### 加载第三方库

如果我们要开发一个稍微复杂的插件，可能需要引入一些第三方库，这里我们来演示下，引入 jquery 并在 `getDetail.js` 使用。首先修改 `background.js` 的 `content_scripts`：

```json
{
  "content_scripts": [
    {
      "matches": ["file:///*/chrome-extension-demo/detail.html*"],
      "js": ["jquery.min.js", "getDetail.js"]
    },
    {
      "matches": ["file:///*/chrome-extension-demo/list.html"],
      "js": ["getList.js"]
    }
  ]
}
```

添加了之后，修改 `getDetail.js` 的 `getData`：

```javascript
function getData() {
  const name = $('.name').text()
  const id = $('.id').text()
  chrome.runtime.sendMessage({ data: { name, id }, close: true })
}
```

刷新插件，运行一下，可以看到数据是正常上报的。

```javascript
"js": ["jquery.min.js", "getDetail.js"]
```

这段的配置，当命中对应的配置后，会按顺序加载你的 `js` 文件。



### 优化通用代码

在开发时，多个文件大部分情况都会出现通用代码或配置的，但 `chrome` 插件不支持原生的 `import`，我这里想到的解决方法有两个：

1. 使用 `webpack` 等工具，每次修改完代码，先编译，再刷新使用
2. 通过 `contents_script` 可加载多个脚本的特点，先加载通用代码文件，这样后加载的文件都可以使用通用代码文件声明的对象、函数。

第一种这里就不多说了，有点麻烦，但这个是最完美的，完美解决通用代码的问题。

第二种，我们分别修改 `common.js`、`getList.js`、`getDetail.js` 和 `manifest.json`  文件。

修改 `common.js`：

```javascript
function checkData(checkDomTxt, executeNum, callback, maxNum = 10) {
  if (executeNum >= maxNum) {
    console.log('100秒过去了，但没有检查到内容')
    return
  }
  setTimeout(() => {
    if (!!document.querySelector(checkDomTxt)) {
      callback()
    } else {
      checkData(checkDomTxt, executeNum + 1, callback, maxNum)
    }
  }, 1000);
}
```



`getList.js` 全覆盖：

```javascript
function getData() {
  const items = document.querySelectorAll('.item')
  items.forEach(item => {
    item.querySelector('.item-id').click()
  })
}

checkData('.item', 0, getData)
```

`getDetail.js` 全覆盖：

```javascript
function getData() {
  const name = $('.name').text()
  const id = $('.id').text()
  chrome.runtime.sendMessage({ data: { name, id }, close: true })
}

checkData('.id', 0, getData)

```



`manifest.json` 修改 `content_scripts`：

```json
{
  "content_scripts": [
    {
      "matches": ["file:///*/chrome-extension-demo/detail.html*"],
      "js": ["common.js", "jquery.min.js", "getDetail.js"]
    },
    {
      "matches": ["file:///*/chrome-extension-demo/list.html"],
      "js": ["common.js", "getList.js"]
    }
  ]
}
```

我们刷新下插件和 `list.html` 页面，可以看到插件还是正常运行的，证明了这种加载通用代码的方法是可行的。

当然这种方法虽然相对来说方便，但也有不少问题：

1. 当代码量多起来后，不知道哪个变量是来自哪个文件
2. 命名冲突问题
3. 像 `background.js` 和 `popup.js` 不能通过这个方法解决



### 权限与通信

我们关注三个对象：`background`、`popup` 和页面的 `content_scripts`，这三者之间是如何通信的。

#### `background` 和 `popup` 通信

`background` 或 `popup` 发送：

```javascript
chrome.runtime.sendMessage(...)
```

`background` 或 `popup` 监听：

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender) => {})
```

`background` 和 `popup` 的通信是最简单的，直接使用 `chrome.runtime` 的 `sendMessage` 和 `onMessage` 就行了。

![a1](/chrome-plugin/a5.jpg)



#### `background` 与 `popup`  和 `content_scripts` 通信

`background` 或 `popup` 发送：

```javascript
// 这里改成了 tabs，不是 runtime
chrome.tabs.sendMessage(tabId, data)
```

`content_scripts` 监听：

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender) => {})
```

`background` 和 `popup` 不能类似广播那样发送给 `content_scripts`，只能根据你要发送的那个网页的 `tabId` ，调用 `chrome.tabs.sendMessage`。

你可以在 `background.js` 和 `popup` 添加对应的代码：

```javascript
chrome.tabs.query({}, function(tabs){
  const tab = tabs.find(v => v.url.includes('list.html'))
  if (!tab) return
  chrome.tabs.sendMessage(tab.id, 'ok')
});
```

找到对应的要发送的 tab，进行指定发送。

`background`或 `popup` 监听：

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender) => {})
```

`content_scripts` 发送：

```javascript
chrome.runtime.sendMessage(...)
```

![a1](/chrome-plugin/a6.jpg)



####  `content_scripts` 之间通信

这里就稍微麻烦点，需要通过 `background.js` 进行转发，我们在 `getList.js` 添加发送的事件，在 `getDetail.js` 进行监听。

`getList.js`：

```javascript
chrome.runtime.sendMessage('list send')
```

`background.js`：

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg === 'list send') {
    chrome.tabs.query({}, function(tabs){
      const tab = tabs.find(v => v.url.includes('detail.html'))
      if (!tab) return
      chrome.tabs.sendMessage(tab.id, 'to detail')
    });
  }
})
```

`detail.js`：

```javascript
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg)
})
```

这样就可以了，当 `getList.js` 发送了 `list send` 信息后，`background.js` 会接受到，转发给 `detail.js`，完成了 `content_scripts` 之间的通信。

![a1](/chrome-plugin/a7.jpg)

## 总结

这篇文章，主要总结我在开发时遇到的一些问题，是如何解决的，没有具体的解释为什么这样做，希望可以给到大家一个参考，解决在开发 chrome 插件时遇到的问题。

