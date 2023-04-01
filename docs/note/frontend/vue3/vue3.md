#### Vue3 为什么要使用 proxy ?
#### 为什么要 proxy + reflect 搭配使用？

1. reflect 的使用，是为了解决 this 指向问题。
2. 举例，对象有一个 get 访问器的 b 属性，它通过 this 访问该对象的 a 属性，而副作用函数会读取代理对象的 b 属性，这样会使副作用函数对 a 属性进行依赖收集。因为 b 属性是一个访问器属性，并且返回的是 a 属性。如果不使用 reflect 的话，因为 proxy 的 get 拦截器中的第一个参数 target，是原始对象，这会导致的结果就是副作用函数是喝原始对象的 a 属性进行依赖，是没有响应能力的，所以这里我们要返回的的是代理对象的值。
  ```javascript
  const obj = {
    a: 1,
    get b() { return this. a }
  }
  effect(() => obj.b) // not working
  proxyObj.a++
  ```

  reflect 方法有三个参数：目标对象、key、是要操作的对象，我只需将 proxy.get 的第三个参数传给 reflect 就行了
##### 为什么 proxy.get 不能返回 receiver[key] 呢？

因为 receiver 就是代理对象，当你返回 receiver[key] 时，又会触发 proxy.get，这时候就会出现死循环

#### 为什么会有 ref 的存在？

因为 JS 无法对原始值进行代理操作，所以需要包裹一层转换为对象，从而间接对该原始值进行代理

而 ref 函数就是做这个包裹的操作，所以要读取代理原生值后的值，就要访问 ref 执行后的 .value

并且里面使用了 Object.defineProperty 来定义了一个 __v_isRef 的内置属性，来声明这是一个 ref 标识

#### 为什么 ... 解构操作会导致响应丢失？如何解决

因为解构操作相当于对对象重新赋值，它只是读取对象的值，而不是引用对象，不具有响应能力

Vue 提供了 toRef 和 toRefs 函数，原理是根据对象和对应的 key 返回一个新的对象，并且对新对象设置了 [get] 访问器，当读取新对象对应的 key 的值时，就会访问原始响应对象的 key 的值



#### 为什么 Vue3 可以多个根节点？

内部使用了 `fragment` 节点。在 DOM 中，`fragment` 节点渲染到 HTML 时是不会渲染的，它是一个虚拟节点

#### 什么是 DIFF 算法？

TODO



[https://juejin.cn/post/7010594233253888013#heading-4](https://juejin.cn/post/7010594233253888013#heading-4)

[https://juejin.cn/post/7092068900589797413#heading-3](https://juejin.cn/post/7092068900589797413#heading-3)



### 什么是 setup 函数

