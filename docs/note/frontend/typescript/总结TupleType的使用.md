---
title: 总结 Tuple Type 的使用
date: 2017-06-27 00:00:00
tags: ["typescript"]
categories: ["记录"]
---

# 总结 Tuple Type 的使用

## 起源

在写代码的时候，需要定义一个类型

> 有一个 test 函数
>
> 1. 接收一个参数，该参数的类型为函数数组，每个函数返回一个 Promise
> 2. 执行 test 函数后，会返回一个数组，数组内的每个值会对应传入的函数数组执行后的结果

```typescript
// 伪代码
function test(data) {}

const [r1,r2] = await test([ () => Promise.resolve(1), () => Promise.resolve(true) ])
// 类型：[number, boolean]
```

这里需要用到 `Promise` 的类型，所以我参考了 `Promise.all` 的类型定义：

```typescript
all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
```

改造成这样：

```typescript
function test<T extends readonly (() => Promise<any>)[]>(data: T): Promise<{
  -readonly [p in keyof T]: Awaited<
    T[p] extends () => Promise<any> ? ReturnType<T[p]> : T[p]
  >
}> {}
```

但推断出来的类型是这样的：

```typescript
const [r1,r2] = await test([ () => Promise.resolve(1), () => Promise.resolve(true) ])
// 类型：[number | boolean, number | boolean]
```

没有精确地推断出每个项是什么类型，而我想要的效果是能精确推断出来，因为我传入的值是可知的，这时候就要用到这篇记录的主题：Tuple Type



## Tuple Type 是什么？

> 官方定义：
>
> A *tuple type* is another sort of `Array` type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.

```typescript
type StringNumberPair = [string, number]; // tuple type
type StringNumberArr = Array[string | number];
```

`tuple type` 是另一种数组，能精确地知道你的数组有多少个值，每个值的类型是什么，上面的例子可以看到，`array` 是每个值的类型都是同一种

这样 `tuple type` 刚好符合上面例子要达到的效果；上面推断出来的类型是一个 `array`，而我们要使它变为 `tuple type` 

有两种方式：

> 要注意，下面的转换方式要 TypeScript 版本 >= 4.0 才行，旧版本是没这功能

添加多一个 `| []` 的定义：

```typescript
// 伪代码
type A<T extends () => Promise<any>)[] | []> = (data: T)
```

使用 `...`:

```typescript
// 伪代码
type A<T extends () => Promise<any>)[] | []> = (data: [...T])
```



### 改造

```typescript
function test<T extends readonly (() => Promise<any>)[] | []>(data: T): Promise<{
  -readonly [p in keyof T]: Awaited<
    T[p] extends () => Promise<any> ? ReturnType<T[p]> : T[p]
  >
}> {}
```



## 参考资料

1. [TypeScript 文档 - tuple type 说明](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
2. [TypeScript 文档 - v4.0 版本有关 tuple type 的变更](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

