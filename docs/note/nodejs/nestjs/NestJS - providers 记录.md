---
title: NestJS - providers 记录
date: 2023-05-31 17:42:00
tags: ["nodejs", "nestjs"]
categories: ["记录"]
---

## 简介
1. 如何基于 NestJS 这套依赖管理机制，去封装公共依赖
2. 什么时候用 inject


## 如何基于 NestJS 这套依赖管理机制，去封装公共依赖

### 全局注入

首先定义一个 `Injectable` 的 `Class`:

``` typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  add(val: number) {
    return val + 2;
  }
}
```

在 `.module` 注入这个依赖

``` typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Utils } from './utils';

@Module({
  controllers: [UserController],
  providers: [UserService, Utils],
})
export class UserModule {}
```

然后就可以在同样是 `Injectable` 的 `.service` 使用：
``` typescript
import { Injectable } from '@nestjs/common';
import { Utils } from './utils';

@Injectable()
export class UserService {
  constructor(readonly utils: Utils) {}
  findAll() {
    console.log(this.utils.add(2));
    return `This action returns all user`;
  }
}

```

同理，也能在这个 `module` 下的 `controller` 使用

同理，如果想将这个 `Class` 在全局都使用，可以直接在 `app.module` 进行注入

### 通过 import module 来获取依赖

定义一个 `common.module.ts`:
``` typescript
import { Module } from '@nestjs/common';
import { Utils } from './user/utils';

@Module({
  providers: [Utils],
  exports: [Utils],
})
export class CommonModule {}

```

通过 `exports` 暴露你想要暴露的依赖，然后对应模块引入该模块：

``` typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { Utils } from './utils';
import { CommonModule } from 'src/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

```

这样 user 模块中的依赖，还是能使用 `Utils`

### 总结

1. 通过模块的全局注入，比较简单直接，一劳永逸
2. 而通过 `import module` 来获取该模块暴露的依赖，我个人感觉这比较倾向于在一些工具库封装时才用到

## 为什么有些依赖注入需要用到 `Inject`

在上面的例子中，都是不需要 `Inject` 装饰器，但在使用一些库的时候，则需要使用：

``` typescript
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PersonalService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
}
```


当你定义 `providers` 时要规定 `provide` 值，就需要用到 `Inject`
``` typescript
import { Module } from '@nestjs/common';
import { Utils } from './user/utils';

@Module({
  providers: [
    {
      provide: 'ddd',
      useClass: Utils,
    },
  ],
  exports: ['ddd'],
})
export class CommonModule {}

```

``` typescript
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from './utils';

@Injectable()
export class UserService {
  constructor(
    @Inject('ddd')
    readonly utils: Utils,
  ) {}
  findAll() {
    console.log(this.utils.add(2));
    return `This action returns all user`;
  }
}

```



