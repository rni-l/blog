---
title: docker 命令
date: 2020-12-28 15:35:12
tags: ["docker"]
categories: ["记录"]

---

> 记录了 docker 常用命令

 # Docker

#### 镜像

* 拉取镜像：`docker pull name[:TAG]`
* 查看当前的镜像：`docker image ls`
* 查看镜像历史修改记录：`docker history IMAGE`
* 运行镜像，并命名：`docker run --name webserver -d -p 80:80 nginx`
* `docker exec -it webserver bash`
* 生成镜像：`docker build -t IMAGE {执行的上下文路径}`



#### Dockerfile

* copy

  * 复制当前上下文的文件到镜像
  * `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`

* ADD

  * 复制文件，并进行解压
  * `ADD [--chown=<user>:<group>] <源路径>... <目标路径>`

* CMD

  * 指定默认的容器主进程的启动命令的
  * shell 格式：`CMD <命令>`
  * exec 格式：`CMD ["可执行文件", "参数1", "参数2"…]`

* ENTRYPOINT

  * 和 CMD 类似功能，不过可以在启动镜像时，将传入的参数给到 ENTRYPOINT

    ```shell
    docker run test -i
    -> ENTRYPOINT ['curl', 'http://baidu.com', '-i'] # 多了传入的命令
    ```

  * shell 格式：`CMD <命令>`

  * exec 格式：`CMD ["可执行文件", "参数1", "参数2"…]`

* ENV

  * 设置镜像的环境变量
  * `ENV <key> <value>`
  * `ENV <key1>=<value1> <key2>=<value2>…`

* VOLUME

  * 定义卷
  * `VOLUME ["<路径1>", "<路径2>"…]`
  * `VOLUME <路径>`

* WORKDIR

  * 修改当前的工作路径
  * `WORKDIR <PATH>`

* USER

  * 修改当前用户
  * `USER <用户名>[:<用户组>]`

* 



#### 容器

* 运行容器：`docker run IMAGE`
  * `-d`
    * 使该容器启动后进入后台
  * `-p`
    * 随机映射一个端口到内部容器开放的网络端口
    * 将服务器的 4444 端口指向容器的 80 端口：`-p 4444:80`
* 停止容器：`docker stop CONTAINER-ID`
* 删除容器：`docker rm CONTAINER-ID`
* 查看容器进程：docker ps
* 查看当前运行容器：`docker container ls`
* 查看容器日志：`docker container logs [container ID or NAMES]`
* 执行命令：`docker exec [options] {container id} {bash}`
  * `exec` 命令不会因为输入终止而把容器进程关闭；但 `attach` 会



### Volume

* 创建 volume: `docker volume create {name}`
* 查看 volume 信息：`docker volme inspect {name}`





### 存储概念

![](http://md.rni-l.com/md/docker-types-of-mounts.png)





## QA

### arm 架构问题

添加 `--platform "linux/amd64"` 声明平台

