---
title: ssh 连接问题
date: 2022-06-02 09:00:00
tags: ["linux", "ssh"]
categories: ["记录"]
---

# SSH 连接问题



## 问题

在使用 `ssh root@ip` 登录服务器时，要求输入密码，但之前一直是用 ssh 免密登录的，公钥也配置好了，这个问题搞了我一个下午。



## 解决

用 `ssh -vvv root@ip` 来查看执行日志：

```shell
debug2: we did not send a packet, disable method
```

可以看到一条稍微重要的信息，接着再看下服务器的日志文件，具体看哪个看你的系统，我这里看的是：`/var/log/secure`：

```shell
Authentication refused: bad ownership or modes for directory /root
xxx sshd[25813]: debug1: restore_uid: 0/0
xxx sshd[25813]: Failed publickey xxxx
```

跟着这些信息搜索下解决方法，大致解决方法有几个



### 确定你的 authorized_keys 有配置你机器的公钥

确认下 `authorized_keys` 是否真的有存储你的公钥



### 配置权限

根据大神的说法，ssh 连接对文件的权限管控得很严，请按照下发的命令按序执行：

```shell
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 644 ~/.known_hosts # 不要漏了这个，我就是漏了这个，导致不行...
```

具体链接：[stackoverflow  - Configuring SSH with Keys in Slackware 13.0](https://stackoverflow.com/questions/20293981/configuring-ssh-with-keys-in-slackware-13-0)



### 修改 sshd_config 文件

确定你的 sshd_config 文件的相关配置如下：

```shell
PubkeyAuthentication yes
AuthorizedKeysFile      .ssh/authorized_keys
```



### 另外的

有另外的解决方法：`.ssh 目录没有 ssh_home_t 标签`,这个我没验证过，但这里也记录下：

```shell
restorecon -r -vv ~/.ssh
# 查看
ls -laZ
# drwx------. root root unconfined_u:object_r:ssh_home_t:s0 .ssh
```

具体链接：[segmentfault - CentOS SSH公钥登录问题](https://segmentfault.com/q/1010000000445726)



## 参考资料

1. [stackoverflow  - Configuring SSH with Keys in Slackware 13.0](https://stackoverflow.com/questions/20293981/configuring-ssh-with-keys-in-slackware-13-0)
1. [segmentfault - CentOS SSH公钥登录问题](https://segmentfault.com/q/1010000000445726)