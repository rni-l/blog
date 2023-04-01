---
title: Windows 配置 openSSH
date: 2022-06-15 14:40:00
tags: ["windows", "openSSH"]
categories: ["记录"]
---

# Windows 配置 openSSH

## 安装配置

看这篇教程就行了：[openSSH 安装配置教程](https://creodias.eu/-/how-to-install-openssh-on-windows-server-2016-vm-)

按着这教程配置，但最终不是我们想要的结果，这里配置完后需要用密码进行登录的

## 配置 SSH 免密登录

这步骤的教程看这里：[windows 公钥配置方式](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

我这里简单说下配置步骤：

1. 如果你是用 administrators 账号登录，将你的公钥，放到 Windows 系统的：`C:\ProgramData\ssh\administrators_authorized_keys` 里
2. 如果是其他用户，则放在 `~/.ssh/authorized_keys` 里





## 参考资料

1. [openSSH 下载地址](https://github.com/PowerShell/Win32-OpenSSH/releases)
2. [windows 公钥配置方式](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)
3. [openSSH 安装配置教程](https://creodias.eu/-/how-to-install-openssh-on-windows-server-2016-vm-)