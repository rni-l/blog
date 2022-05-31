---
title: scp输出日志问题
date: 2022-05-31 11:00:00
tags: ["linux", "scp"]
categories: ["记录"]
---

# Scp 输出日志问题

当我们在命令行执行：`scp .. ..` 时，会输出传输文件的进度条日志，但我在使用 NodeJS 的 child_process 模块执行 scp 命令的时候，`process.stdout` 无法捕获 scp 的任何日志输出，这是为啥？要如何处理？

想要的效果：

```shell
favicon.ico 100% 4286   104.8KB/s   00:00    
index.html 100%  610    12.8KB/s   00:00    
app.2cf79ad6.css 100%  343    24.6KB/s   00:00    
app.c01c98ec.js 100%   13KB  29.8KB/s   00:00    
chunk-vendors.4fdc3465.js 100%   75KB 221.1KB/s   00:00    
app.c01c98ec.js.map 100%   13KB 286.5KB/s   00:00    
chunk-vendors.4fdc3465.js.map 100%  650KB 273.3KB/s   00:02 
```

现实：

```shell
# stdout 是空的
```



## 原因

查看网上讨论的信息：

>来源：https://www.tek-tips.com/viewthread.cfm?qid=1321480
>
>原文：**scp** will display that progress bar if stdout is to your terminal. But if you try and redirect the output to a file, **scp** is smart enough to realise that it is not a terminal any more, and does not display the progress bar. The reason is because normally no-one needs to see the progress in a log file, and displaying a progress bar requires use of various screen control codes which would be make a log file messy. If you like you could use the following to produce verbose output, including the duration of the transfer:
>
>scp -v [source] [destination] > logfile.txt 2>&1
>
>Annihilannic.

`scp` 命令只会在 terminal 显示，并且是以进度条的显示显示。同时给出了解决方案：显示 `scp` 执行的动作日志。



## 结论

既然无法显示每个文件的，只能显示执行的动作信息，那我们先看下有什么信息打印出来：

```shell
# scp -v ... ...
OpenSSH_8.6p1, LibreSSL 3.3.5
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: /etc/ssh/ssh_config line 21: include /etc/ssh/ssh_config.d/* matched no files
debug1: /etc/ssh/ssh_config line 54: Applying options for *
debug1: Authenticator provider $SSH_SK_PROVIDER did not resolve; disabling
debug1: Connecting to 0.0.0.x [0.0.0.x] port 22.
debug1: Connection established.
debug1: identity file /Users/ddd/.ssh/id_rsa type 0
debug1: identity file /Users/ddd/.ssh/id_rsa-cert type -1
debug1: identity file /Users/ddd/.ssh/id_dsa type -1
debug1: identity file /Users/ddd/.ssh/id_dsa-cert type -1
debug1: identity file /Users/ddd/.ssh/id_ecdsa type -1
debug1: identity file /Users/ddd/.ssh/id_ecdsa-cert type -1
debug1: identity file /Users/ddd/.ssh/id_ecdsa_sk type -1
debug1: identity file /Users/ddd/.ssh/id_ecdsa_sk-cert type -1
debug1: identity file /Users/ddd/.ssh/id_ed25519 type -1
debug1: identity file /Users/ddd/.ssh/id_ed25519-cert type -1
debug1: identity file /Users/ddd/.ssh/id_ed25519_sk type -1
debug1: identity file /Users/ddd/.ssh/id_ed25519_sk-cert type -1
debug1: identity file /Users/ddd/.ssh/id_xmss type -1
debug1: identity file /Users/ddd/.ssh/id_xmss-cert type -1
debug1: Local version string SSH-2.0-OpenSSH_8.6
debug1: Remote protocol version 2.0, remote software version OpenSSH_7.4
debug1: compat_banner: match: OpenSSH_7.4 pat OpenSSH_7.0*,OpenSSH_7.1*,OpenSSH_7.2*,OpenSSH_7.3*,OpenSSH_7.4*,OpenSSH_7.5*,OpenSSH_7.6*,OpenSSH_7.7* compat 0x04000002
debug1: Authenticating to 0.0.0.x:22 as 'root'
debug1: load_hostkeys: fopen /Users/ddd/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
debug1: kex: algorithm: curve25519-sha256
debug1: kex: host key algorithm: ssh-ed25519
debug1: kex: server->client cipher: aes128-ctr MAC: umac-64-etm@openssh.com compression: none
debug1: kex: client->server cipher: aes128-ctr MAC: umac-64-etm@openssh.com compression: none
debug1: expecting SSH2_MSG_KEX_ECDH_REPLY
debug1: SSH2_MSG_KEX_ECDH_REPLY received
debug1: Server host key: ssh-ed25519 SHA256:bHkyxWmGEYY17E6CcgUbmV9Y3NJjP8ei74BnZ1SO8aI
debug1: load_hostkeys: fopen /Users/ddd/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: Host '0.0.0.x' is known and matches the ED25519 host key.
debug1: Found key in /Users/ddd/.ssh/known_hosts:13
debug1: rekey out after 4294967296 blocks
debug1: SSH2_MSG_NEWKEYS sent
debug1: expecting SSH2_MSG_NEWKEYS
debug1: SSH2_MSG_NEWKEYS received
debug1: rekey in after 4294967296 blocks
debug1: Will attempt key: /Users/ddd/.ssh/id_rsa RSA SHA256:PiSTYbirScWrhje99Fq9iMmKkdtJS/68a4hEG0h/qIw
debug1: Will attempt key: /Users/ddd/.ssh/id_dsa 
debug1: Will attempt key: /Users/ddd/.ssh/id_ecdsa 
debug1: Will attempt key: /Users/ddd/.ssh/id_ecdsa_sk 
debug1: Will attempt key: /Users/ddd/.ssh/id_ed25519 
debug1: Will attempt key: /Users/ddd/.ssh/id_ed25519_sk 
debug1: Will attempt key: /Users/ddd/.ssh/id_xmss 
debug1: SSH2_MSG_EXT_INFO received
debug1: kex_input_ext_info: server-sig-algs=<rsa-sha2-256,rsa-sha2-512>
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey,gssapi-keyex,gssapi-with-mic,password
debug1: Next authentication method: publickey
debug1: Offering public key: /Users/ddd/.ssh/id_rsa RSA SHA256:PiSTYbirScWrhje99Fq9iMmKkdtJS/68a4hEG0h/qIw
debug1: Server accepts key: /Users/ddd/.ssh/id_rsa RSA SHA256:PiSTYbirScWrhje99Fq9iMmKkdtJS/68a4hEG0h/qIw
debug1: Authentication succeeded (publickey).
Authenticated to 0.0.0.x ([0.0.0.x]:22).
debug1: channel 0: new [client-session]
debug1: Requesting no-more-sessions@openssh.com
debug1: Entering interactive session.
debug1: pledge: filesystem full
debug1: client_input_global_request: rtype hostkeys-00@openssh.com want_reply 0
debug1: client_input_hostkeys: searching /Users/ddd/.ssh/known_hosts for 0.0.0.x / (none)
debug1: client_input_hostkeys: searching /Users/ddd/.ssh/known_hosts2 for 0.0.0.x / (none)
debug1: client_input_hostkeys: hostkeys file /Users/ddd/.ssh/known_hosts2 does not exist
debug1: client_input_hostkeys: no new or deprecated keys from server
debug1: Sending environment.
debug1: channel 0: setting env LANG = "en_US.UTF-8"
debug1: Sending command: scp -v -r -t /data/www/project/test-publish
Entering directory: D0755 0 dist
Sink: D0755 0 dist
Sending file modes: C0644 4286 favicon.ico
Sink: C0644 4286 favicon.ico
favicon.ico 100% 4286   209.9KB/s   00:00    
Sending file modes: C0644 610 index.html
Sink: C0644 610 index.html
index.html 100%  610    46.4KB/s   00:00    
Entering directory: D0755 0 css
Sink: D0755 0 css
Sending file modes: C0644 343 app.2cf79ad6.css
Sink: C0644 343 app.2cf79ad6.css
app.2cf79ad6.css 100%  343    20.1KB/s   00:00    
Sink: E
Entering directory: D0755 0 js
Sink: D0755 0 js
Sending file modes: C0644 13378 app.c01c98ec.js
Sink: C0644 13378 app.c01c98ec.js
app.c01c98ec.js 100%   13KB 792.5KB/s   00:00    
Sending file modes: C0644 77211 chunk-vendors.4fdc3465.js
Sink: C0644 77211 chunk-vendors.4fdc3465.js
chunk-vendors.4fdc3465.js 100%   75KB 199.0KB/s   00:00    
Sending file modes: C0644 13189 app.c01c98ec.js.map
Sink: C0644 13189 app.c01c98ec.js.map
app.c01c98ec.js.map 100%   13KB 140.8KB/s   00:00    
Sending file modes: C0644 665340 chunk-vendors.4fdc3465.js.map
Sink: C0644 665340 chunk-vendors.4fdc3465.js.map
chunk-vendors.4fdc3465.js.map 100%  650KB 288.2KB/s   00:02    
Sink: E
Sink: E
debug1: client_input_channel_req: channel 0 rtype exit-status reply 0
debug1: channel 0: free: client-session, nchannels 1
debug1: fd 0 clearing O_NONBLOCK
Transferred: sent 779148, received 3744 bytes, in 3.1 seconds
Bytes per second: sent 252334.1, received 1212.5
debug1: Exit status 0
```

可以看到，其实还是有文件传输的信息，但同时还有很多其他信息，这里我不需要，所以需要过滤下：

```shell
# scp -vr .. .. 2>&1 | grep 'Sending:\|Sink:\|Transferred:\|Bytes per'

Sink: D0755 0 dist
Sink: C0644 4286 favicon.ico
Sink: C0644 610 index.html
Sink: D0755 0 css
Sink: C0644 343 app.2cf79ad6.css
Sink: E
Sink: D0755 0 js
Sink: C0644 13378 app.c01c98ec.js
Sink: C0644 77211 chunk-vendors.4fdc3465.js
Sink: C0644 13189 app.c01c98ec.js.map
Sink: C0644 665340 chunk-vendors.4fdc3465.js.map
Sink: E
Sink: E
Transferred: sent 779164, received 3744 bytes, in 2.3 seconds
Bytes per second: sent 339476.9, received 1631.2
```

根据实际情况去进行过滤输出。



### 2>&1 是什么？

这是将输入/输出进行重定向的操作

> *文件描述符 0 通常是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）*

 `>` 代表输出操作，`<` 代表输入操作。`2>1`组合起来就是：将 STDERR 输出到 STDOUT 中

`>&` 是将 STDOUT 和 STDERR 组合起来输出

`scp -vr .. .. 2>&1 | grep 'Sending:\|Sink:\|Transferred:\|Bytes per'` 这个命令，就是将 `scp` 所有的动作信息，包含 STDOUT 和 STDERR 给到 `grep` 进行操作。



## 参考资料

1. [tek-tips.com 有关 scp 的讨论](https://www.tek-tips.com/viewthread.cfm?qid=1321480)
1. [菜鸟输入/输出重定向](https://www.runoob.com/linux/linux-shell-io-redirections.html)



