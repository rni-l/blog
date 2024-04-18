## 前言
使用 Strapi 搭建一个 CMS 系统，从搭建、开发、配置、部署和运维各个方面进行总结，达到可以快速开发一个简单的系统。

## 功能清单

1. 微信小程序授权
2. strapi 的功能（已实现）
	1. 自定义模型
	2. 权限控制
	3. 用户模块，支持注册、登录
	4. 管理后台
3. 小程序用户端

输出清单：
1. 代码
	1. 小程序用户端代码
	2. strapi 代码（管理端 + 服务端）
2. 操作手册

## 实施
### 搭建
### Strapi 项目
创建 strapi 项目：
```shell
npx create-strapi-app@latest my-project --quickstart
cd my-project
npm run develop
```

### 用户小程序
直接根据微信小程序开发工具创建项目，使用微信小程序原生进行开发

### 开发

### strapi 开发
#### 获取用户 openid
![[Pasted image 20230913180414.png]]
> 微信官方文档流程图

当前我们只需要获取用户的 openid 做标识就行了。前端提供 code 给到后端，后端拿 code 去调用微信的接口获取用户的 openid。
#### 新增一个模型和相关的接口
比如当前新增一个 `client-user` 模型，在此目录新建相关文件：
```shell
# src/api/client-user

controllers
  wechat.ts
routes
  wechat.ts
services
  wechat.ts
```

路由：
```typescript
export default {
  routes: [
    {
      method: 'POST',
      path: '/client-users/wechat/authByCode',
      handler: 'wechat.authByCode'
    }
  ]
}
```

控制器：
```typescript
import { filterBody, getDefaultRes } from '../../../utils'
import { sanitize, validate } from '@strapi/utils'

const authByCode = async (ctx) => {
  const result = await strapi.service('api::client-user.wechat').authByCode(strapi, ctx.request.body);
  return getDefaultRes(result)
}

export default {
  authByCode
}

```

服务：
```typescript
/*
 * @Author: Lu
 * @Date: 2023-09-11 16:57:35
 * @LastEditTime: 2023-09-13 18:01:26
 * @LastEditors: Lu
 * @Description: 
 */

import { CLIENT_USER, WECHAT_API_URL } from "../../../constants";
import axios from 'axios'

const authByCode = async (strapi: Strapi.Strapi,params: Record<string, any>) => {
  const { data } = await axios({
    url: WECHAT_API_URL.jscode2session,
    params: {
      appid: process.env.WECHAT_APP_ID,
      secret: process.env.WECHAT_APP_SECRET,
      js_code: params.code,
      grant_type: 'authorization_code'
    }
  })
  console.log(data);
  if (!data || data.errmsg) throw new Error('登录异常')
  addUser(data.session_key, data.openid)
  return {
    openid: data.openid
  }
}

export default {
  authByCode,
}
```

前端调用 `/api/client-user/wechat/authByCode` 就行了
#### 小程序开发
##### 对接微信授权
这里就不贴代码了，展示一下整个用户交互过程：
![[minprogram-user-login.excalidraw]]

#### 其他
后续的开发就是在 strapi 配置模型，然后在小程序进行开发和对接，这里就不再展开了

### 配置

### 部署
这里主要说下 strapi 服务的部署。官网已经有很详细的配置步骤，所以这里只是单纯总结我这边的部署方式。
#### 配置 Nginx

```shell
# path: /etc/nginx/sites-available/strapi.conf

server {
    # Listen HTTP
    listen 80;
    server_name api.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    # Listen HTTPS
    listen 443 ssl;
    server_name api.example.com;

    # SSL config
    ssl_certificate /path/to/your/certificate/file;
    ssl_certificate_key /path/to/your/certificate/key;

    # Proxy Config
    location / {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass_request_headers on;
    }
}
```

#### 部署和执行
因为这是我自己一个开发的，所以直接一个脚本 + ssh + scp 就可以快速完成发布了。多人协作就上 CI & CD，比如 coding, gitlab, github
```javascript
const shell = require('shelljs')

shell.exec('npm run build')
shell.exec(`tar -czvf dist.tar.gz --exclude='.git' --exclude='*.tar.gz' .cache config database dist node_modules public src .env favicon.png  package.json package-lock.json tsconfig.json yarn.lock`)
shell.exec('scp dist.tar.gz root@100.100.100.100:/data/www/strapi/')
shell.exec(`ssh -T root@100.100.100.100 << 'EOL'
tar -zxvf /data/www/strapi/dist.tar.gz -C /data/www/strapi
pm2 stop service
pm2 del service
cd /data/www/strapi
rm -f ./env
echo "HOST=0.0.0.0 \n\
PORT=1337 \n\
APP_KEYS= \n\
API_TOKEN_SALT= \n\
ADMIN_JWT_SECRET= \n\
TRANSFER_TOKEN_SALT= \n\
# Database \n\
DATABASE_CLIENT=mysql \n\
DATABASE_HOST=127.0.0.1 \n\
DATABASE_PORT=3306 \n\
DATABASE_NAME=self_album \n\
DATABASE_USERNAME=root \n\
DATABASE_PASSWORD=pwd \n\
DATABASE_SSL=false \n\
JWT_SECRET=
#wechat
WECHAT_APP_ID=
WECHAT_APP_SECRET=
" > .env
cd /data/www/strapi && pm2 start npm --name 'service' -- run start:prod
exit`)
```
自己替换关键字

### 开发环境如何同步配置到生产环境

### 运维

## 总结


## 开发遇到的问题

### 字符编码问题
主要是 mysql 数据库会发生的，在 `config/database` 文件中添加配置：
```
charset   : 'utf8mb4',
collation : 'utf8mb4_unicode_ci',
```

解决方法：[strapi](https://forum.strapi.io/t/error-incorrect-string-value-xf0-x9d-x95-x92-xf0-x9d/17953/3)

## 参考资料

1. [strapi](https://strapi.io/)
2. [strapi - deployment](https://docs.strapi.io/dev-docs/deployment)