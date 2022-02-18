---
title: vue@2问题汇总
date: 2020-01-10
tags: ["js", "vue"]
categories: ["记录"]
draft: true
---


## 常问问题

### Vue 原理

参考：

1. [Vue 的双向绑定讨论](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/34)

2. 我个人理解，Vue 的核心是基于 `defineProperty` 和发布订阅模式的组合，实现 MVVM 模式的。当 Vue 初始化 `data` 属性时，通过 `defineProperty` 的 `get`、`set` 拦截器拦截每一个属性。当有使用某个属性时，会收集关于该依赖；当该属性要被修改时，会触发 `set` 拦截器，修改值并通知收集的依赖，通知执行相关回调操作。这时候就会对相关的 DOM 进行更新。

#### 这个所谓的依赖指的是什么？

首先我们要理清哪个是发布者哪个是订阅者

在使用 `defineProerty` 配置属性的时候，里面的 `set` 拦截器相当于发布者，它通过一个 `Dep` 的类，去管理订阅者，而订阅者就是 `Watcher`。我们在目标上使用了某个属性时，就会开始收集依赖。这时候会触发属性的 `get` 拦截器，让当前的 `Watcher` 缓存当前属性的 `Dep`，并让 `Dep` 收集依赖 `Watcher`。

在源码里，这个依赖就是 `Watcher` 类，它相当于 MVVM 模式中的 `VM`，是用于视图和控制层之间通信的。

该属性收集到依赖，就是为了后面更新的时候使用。当我们修改属性时的时候，就会触发 `set` 拦截器，让当前属性的 `Dep` 通知收集到的依赖做相关操作。

#### get 拦截器是如何收集依赖？

Vue 中有一个叫 `Dep` 的类，专门来收集管理 `Watcher`，而这个 `Dep` 类有一个静态属性，控制当前是哪个 `Watcher`。Vue 这里有个限制，同一时间内只能有一个全局的 `Watcher` 进行处理，不然会乱套了，比如可能会出现 a 组件的 `Watcher` 来处理 b 组件的更新。

每个属性在使用 `defineProperty` 配置的时候，都会初始化一个 `Dep` 的实例来收集改属性的依赖。比如我们再模板上使用了一个属性，会设置当前组件的 `Watcher` 为 `Dep` 的静态属性，然后会触发 `get` 拦截器，就当前的依赖 `Watcher`。

#### 为什么使用 vue

简单易上手，官方文档、教程很友好，很快就可以开发项目。而且官方有一套完整的生态，可以很快得开发一个简单的项目。而 vue 的单文件组件，我觉得开发起来更方便，不需要不断地切换文件

vue-cli 3.x 版本，可以快速建一个 TypeScript 项目，而且 vue3.0 版本是用 TypeScript 重构的，未来 vue 对 TypeScript 会更加得友好

而且 vue 在国内的生态非常得热，对于项目出现问题的解决办法，也会有很多

#### vue 的生命周期

有 beforeCreate, created, beforeMount, mounted, update, beforeDestory, destoryed；如果该组件是在 keep-alive 组件内的，还会有 activited 和 deactivited；主要过程就是初始化 option 、各种内置方法和组件数据，编译模板、挂载 dom，到渲染、更新、卸载等

#### v-model 原理

原理就是一个语法糖，它会帮你创建一个回调事件，当表单控件的数据更改后，触发这个回调事件去修改绑定的属性的值

#### 组件通信的方式

父子：

1. 通过传入 props，给到子组件
2. 通过 refs 直接获取子组件的属性、或调用方法
3. provide/inject，这个甚至可以隔代，让它的所有子组件都有生效

子父：

1. 通过 emit 方法，通知父组件
2. 获取 this.$parent ，得到父组件

兄弟、或无关联组件

1. eventBus
2. vuex

#### computed 和 watch 区别

computed：

1. 可以对多个属性进行监控，某个属性发生变化，就会调用定义的函数，相当于声明一个新的属性
2. 而且 computed 会基于里面的属性进行缓存，只有相关的属性发生变化才会重新求值。所以当里面的属性没有变化时，重复的获取 computed 的值，只是从缓存里拿，而没有再次执行里面的代码

watch：

1. 对某个属性近监控，当这个属性发生变化，就会调用定义的函数
2. 只有属性变化才会触发这个回调，更多地是当属性变化从而处理一些业务逻辑

#### nextTick 原理

> `Vue` 的 `nextTick` 原理，利用了 `JS` 的事件循环机制去，按一定的规则去执行回调

##### nextTick 有什么用

查看 `src/core/util/next-tick.js` 方法，可以看到 `nextTick` 方法并不复杂，主要分成两个部分：

1. 采取什么方式执行回调
2. 收集回调函数和执行

第一点，`nextTick` 执行回调时采取的是异步的形式，根据情况采用 microtask 或 marcotask 去执行回调，默认 microtask 的形式，当使用事件回调时（`v-on`）则会使用 marco task。并且还会查看当前执行的宿主环境，比如在浏览器，默认采取 `promise` 的形式，而在服务器中，会使用 `setImmediate`。

第二点，`nextTick` 会使用一个数组队列收集你传入的回调，等上一批 `nextTick` 执行完后，会执行下一批的 `nextTick`。为什么这里会分批次执行？因为是异步执行的形式，根据 JS 的事件循环机制，当某段时间内，你的同步代码执行完毕后，会先执行 mircotask，这时候会将收集到的 `nextTick` 回调逐一执行，并且清空回调数组。而在执行回调函数期间生成的新 `nextTick` 则会重新添加到数组中，等待这一批次的回调执行完，再执行。

###### 为什么不采用同步的方式执行回调？

##### 为什么有这个方法

`nextTick` 的存在，其实就是为了执行同一时刻下的异步回调。

而 `nextTick` 主要在两个地方被使用到，一个是 Vue 内部，另一个是用户手动触发。这里主要说下在 Vue 内部的使用。

在 Vue 源码中全局搜索下 `nextTick` 的调用地方，并不多，核心逻辑在 `src/core/observer/scheduler.js` 中的 `queueWatcher` 方法。当 `queueWatcher` 执行时，会传入一个 watcher，接着当 `waiting === false` 时，就会执行 `nextTick` 回调，并传入 `flushSchedulerQueue` 方法。

比如，在执行一个方法时，会循环 1 万次，逐次修改一个属性的值，这时候 Vue 内部却不会触发更新 DOM 1 万次，而只会触发一次，从 1 直接修改为 1 万。这里主要是 `queueWatcher` 的功能，根据传入的 `watcher` 的 id 进行判断，只收集不重复的 `watcher`，减少重复地更新。

总结下：

1. `nextTick` 只是一个简单地异步执行回调的工具函数
2. 而 `nextTick` 在 Vue 内部，主要是在执行 `watcher` 更新的操作，这里 `Vue` 会根据 `watcher` 的 id 减少重复性地更新操作

##### 参考资料

1. [github - nextTick 原理](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/281)
2. [掘金 - nextTick](https://juejin.cn/post/6844903711249022984)



#### $set 方法原理

首先会判断是数组还是对象，如果是数组：

则会调用 splice 进行更新

如果是对象，如果当前要修改属性存在，就直接进行修改；如果该对象不是响应式数据，直接赋值；否则对属性进行响应式处理

##### 为什么 this.xxx 可以直接获取到属性

去到 vue 2.x 源码阅读总结 proxy 栏

#### key 的作用

1. 判断两个节点是否相同。相同就复用，不相同就删除旧的创建新的。简单来说，就是为了提升查找性能。
2. 可以对组件设置 key 值，当我想强制更新该组件的时候，通过修改不同的 key 值进行触发

##### 如果不带 Key 会如何？

1. 如果组件状态比较复杂，比如使用个了多个属性或有一些逻辑判断，会导致渲染结果和预期不一致，无法维持组件的状态

#### 如何渲染大量的数据？

1. 添加加载动画，优化用户体验
2. 有能力的情况下，使用 SSR 渲染
3. 可以使用懒加载、异步渲染、分页渲染、切片渲染或虚拟列表等技术进行渲染 DOM
4. 对于固定的非响应式的数据，使用 Object.freeze 冻结数据，减少 Vue 内部 get set 拦截的处理逻辑

#### 为什么 vue@2 不能监听数组的变化？要对数组方法进行重写才行？

1. Vue@2 能不能监听数组的变化？

   1. 可以，Vue@2 通过改写原生数组的方法，达到监听效果。

   2. > vue对push,pop,splice等方法进行了hack，hack方式很简单，如果加入新对象，**对新对象进行响应式化**
      > 举例来说对于push和unshift会推入一个新的对象到数组里(不管从前还是从后),记录这个加入的对象，并调用Observe方法将加入的对象转换成响应式对象,对于splice方法，如果加入了新对象也是将该对象响应式化。
      > 最后一步是向外抛出数组变化，提醒观察者进行更新。

2. 是 Vue@2 不能监听还是 `Object.defineProperty` 不能监听？

   1. Vue@2 不能监听数组项的变化和数组长度的变化，`Object.defineProperty` 是可以监听数组项的值的变化

3. `Object.defineProperty` 不能监听 `length` 的变化，因为 `length` 默认设置了 `non-configurable，non-enumerable`，不可配置和不可枚举

参考代码：`Object.defineProperty` 是可以监听数组的变化

```javascript
let testArray = [0];
function test(data, key, val) {
  Object.defineProperty(data, key, {
    get() {
      console.log(val);
      return val
    },
    set(newV) {
      if (newV !== val) {
        val = newV;
        console.log('检测到变更', val ,newV);
      }
    },
  });
}
test(testArray, 0, 0);

testArray[0] = 1 // 会显示打印信息
console.log(testArray); // [1]
```



参考文章：

1. [掘金](https://juejin.cn/post/7008710100005158926)
2. [vue@2 文档 - 数组](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E6%95%B0%E7%BB%84)
3. [github - vue 如何对数组方法变异](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/239)

## 源码

![vue 生命周期](http://md.rni-l.com/md/vuelifecycle.png)

### 初始化

#### initGlobalAPI - core/index.js

初始化配置，内部工具，全局方法(set, delete, nextTick)，添加公共组件(keep-alive)

先后执行 4 个初始化方法：initUse, initMixin, initExtend, initAssetRegisters

##### initUse

`initUse` 方法，就是为 Vue 添加 `.use` 方法

```javascript
Vue.use = function (plugin: Function | Object) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  // additional parameters
  const args = toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return this
}
```

每当我们执行 Vue.use 就是执行上面的内容

首先查找是否有已经注册过的组件 ->

然后判断这个对象是否是函数 || 它的 .install 属性是否是函数 ->

是的话缓存起来 ->

返回 this，方便链式操作

##### initMixin

```javascript
Vue.mixin = function (mixin: Object) {
  this.options = mergeOptions(this.options, mixin)
  return this
}
```

就是合并 option 操作~

##### initExtend(TODO)

通过 extend 方法继承的，每个 Class 都会有一个唯一的 cid；会重复对象执行了 extend，会从缓存里返回出去

然后就会进行原型继承，并手动初始化子类的 options, extend, mixin, use 等等属性

##### initAssetRegisters

```javascript
ASSET_TYPES.forEach(type => {
  Vue[type] = function (
    id: string,
    definition: Function | Object
  ): Function | Object | void {
    if (!definition) {
      return this.options[type + 's'][id]
    } else {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && type === 'component') {
        validateComponentName(id)
      }
      if (type === 'component' && isPlainObject(definition)) {
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }
      if (type === 'directive' && typeof definition === 'function') {
        definition = { bind: definition, update: definition }
      }
      this.options[type + 's'][id] = definition
      return definition
    }
  }
})
```

`ASSET_TYPES` 就是 filter, component, directive；这里据说初始化它的三个静态方法

#### initMixin - instance/index.js

##### _init

在 Vue.prototype 添加 _init 方法，接收一个参数：options

每个 Vue 实例都会有一个 _uid 记录着

如果 _options 有_isComponent 的标识：

执行 initInternalComponent 方法

如果没有，则将 vm.constructor 和 options 进行合并，生成 vm.$options 对象

然后继续初始化操作和执行生命钩子

```
initLifecycle
initEvents
initRender
callHook
initInjections
initState
initProvide
callHook
```

最后再执行 $mount

###### initInternalComponent(TODO)

##### resolveConstructorOptions

根据当前组件对象，一层层递归它的父类，去处理、剔除重复属性的 options，最终还是志贤 `mergeOptons`

##### mergeOptions

执行下面三个方法，对 options 里面的初始化

然后再处理父类和子类的 options，根据 start 进行合并，赋值到 options

###### normalizeProps

props 支持数组和对象格式，这里主要做了兼容处理而已

里面有个方法，将 ‘-’ 去除，并转为驼峰格式

处理成一个 Object 类型，并赋值到 options 上

###### normalizeInject

和 normalizeProps 大同小异

###### normalizeDirectives

和 normalizeProps 大同小异

###### starts(TODO)

源码的注解：

> Option overwriting strategies are functions that handle how to merge a parent option value and a child option value into the final value.

首先创建一个空对象：`const strats = config.optionMergeStrategies -> Object.create(null)`

```javascript
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

定义一个 data 的方法，对父类的 val 和子类的 val 进行合并

添加一些 compute, props, components, inject, filters….. 等必有的属性

它的作用，**muwoo** 总结是这样的：

>Vue提供了一个strats对象，其本身就是一个hook,如果strats有提供特殊的逻辑，就走strats,否则走默认merge逻辑

##### initLifecycle

定义一些字段，和生命周期的状态值

##### initEvents(TODO)

初始化事件，添加监听器

##### initRender

给 vm 添加属性：

* $slots
* $scopedSlots
* _c
* $createElement
* $attrs
* $listeners

resolveSlots, createElement, defineReactive 后面再讲

## 核心模块

### Observer

先上源码：

```javascript
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

```

初始化的时候，对属性判断，根据是否数组类型进行额外操作，每个子项执行 `observe` ，否则执行 `defineReactive`

### observe

### defineReactive

源码经过删减：

```javascript
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

主要是根据该属性的原型配置，再使用 `defineProperty`，对该属性的 `get`, `set` 进行拦截

`get` 主要做了 `dep.depend()`

`set` 主要做了 `dep.notify()`

### Dep

这是 Dep 的源码

```javascript
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

```

### Watcher

```javascript
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // ...
    this.value = this.lazy
      ? undefined
      : this.get()
  }
  // ...
}
```

### initData

核心代码：

```javascript
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
```

在初始化 data 的时候，会从 data, props, methods 组成一个集合；如果有重复就会报错

`proxy(vm,`_data`, key)` 这里有个代理的操作

proxy 源码：

```javascript
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

data 的值是挂在 `vm._data` 上面的，但我们平时是 `this.xxx` 就可以获取到，原理就是 proxy 做了一层类似转发的功能，当我们访问 `this.xxx` 是，其实就是访问到 `this._data.xxx`

props 的值也是一样

而 methods 的值，是直接挂在 `this` 上

## 参考资料

1. [muwoo](https://github.com/muwoo/blogs)
2. [染陌](https://github.com/answershuto/learnVue)
2. [掘金 - Vue 监听数组的问题](https://juejin.cn/post/7008710100005158926)
2. [github - vue 如何对数组方法变异](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/239)
2. [github - nextTick 原理](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/281)
