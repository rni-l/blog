---
title: linux指令和操作
date: 2017-07-17 21:28:17
tags: ["linux"]
categories: ["记录"]
---

> 最要记录我平时用的linux指令，方便查找

## 常用命令

* touch [file]: 创建空文件
* more [file]: 按页查看文件

### 查看命令

#### 查看空间

* du -h : 查看当前文件夹内所有文件的大小
* du -h --max-depth=1： 查看当前文件夹的大小，深度为 1
* du -s： 查看当前文件夹总大小
* df: 查看磁盘空间情况

#### 搜索

*  grep [pattern] file: 搜索内容，显示文件对应行的内容

#### xx

* netstat -plntu : 查看端口

* ps -ef|grep xxx : 查看 xxx 的进程

* top -H -p {pid}: 查看某进程下的线程数

* kill -9 123123 : 杀掉 123123 的进程

* vi filename : 新建打开一个文件

* chmod -R 777 xxx : 给权限

* netstat -tunpl : 查看端口

* tree:  tree -I '*git|*svn|*node_modules*|dist' -C 查看当前文件夹的文件列表

* tail: 查看日志

  *  tail:  
           -n  是显示行号；相当于nl命令；例子如下：
                tail -100f test.log      实时监控100行日志
                tail  -n  10  test.log   查询日志尾部最后10行的日志;

      ```shell
      tail -n +10 test.log    查询10行之后的所有日志;
      ```
      
  * head:  
  
       ```shell
       跟tail是相反的，tail是看后多少行日志；例子如下：
       
           head -n 10  test.log   查询日志文件中的头10行日志;
       
           head -n -10  test.log   查询日志文件除了最后10行的其他所有日志;
       ```

  * cat： 
  
    tac是倒序查看，是cat单词反写；例子如下：
  
     cat -n test.log |grep "debug"   查询关键字的日志

查看进程

```

```

### 查看 cpu

```shell
# 总核数 = 物理CPU个数 X 每颗物理CPU的核数 
# 总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数

# 查看物理CPU个数
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l

# 查看每个物理CPU中core的个数(即核数)
cat /proc/cpuinfo| grep "cpu cores"| uniq

# 查看逻辑CPU的个数
cat /proc/cpuinfo| grep "processor"| wc -l
```



### 查看内存

```shell
free -m // 查看内存信息
df -h // 查看硬盘信息
top // 查看内存使用情况
dmidecode | more // 查看系统硬件配置信息

// 下面的解析，来自(https://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316399.html)

// top 命令，各个参数的作用

total 进程总数
running 正在运行的进程数
sleeping 睡眠的进程数
stopped 停止的进程数
zombie 僵尸进程数
Cpu(s): 
0.3% us 用户空间占用CPU百分比
1.0% sy 内核空间占用CPU百分比
0.0% ni 用户进程空间内改变过优先级的进程占用CPU百分比
98.7% id 空闲CPU百分比
0.0% wa 等待输入输出的CPU时间百分比
0.0%hi：硬件CPU中断占用百分比
0.0%si：软中断占用百分比
0.0%st：虚拟机占用百分比

Mem:
191272k total    物理内存总量
173656k used    使用的物理内存总量
17616k free    空闲内存总量
22052k buffers    用作内核缓存的内存量
Swap: 
192772k total    交换区总量
0k used    使用的交换区总量
192772k free    空闲交换区总量
123988k cached    缓冲的交换区总量,内存中的内容被换出到交换区，而后又被换入到内存，但使用过的交换区尚未被覆盖，该数值即为这些内容已存在于内存中的交换区的大小,相应的内存再次被换出时可不必再对交换区写入。

序号  列名    含义
a    PID     进程id
b    PPID    父进程id
c    RUSER   Real user name
d    UID     进程所有者的用户id
e    USER    进程所有者的用户名
f    GROUP   进程所有者的组名
g    TTY     启动进程的终端名。不是从终端启动的进程则显示为 ?
h    PR      优先级
i    NI      nice值。负值表示高优先级，正值表示低优先级
j    P       最后使用的CPU，仅在多CPU环境下有意义
k    %CPU    上次更新到现在的CPU时间占用百分比
l    TIME    进程使用的CPU时间总计，单位秒
m    TIME+   进程使用的CPU时间总计，单位1/100秒
n    %MEM    进程使用的物理内存百分比
o    VIRT    进程使用的虚拟内存总量，单位kb。VIRT=SWAP+RES
p    SWAP    进程使用的虚拟内存中，被换出的大小，单位kb。
q    RES     进程使用的、未被换出的物理内存大小，单位kb。RES=CODE+DATA
r    CODE    可执行代码占用的物理内存大小，单位kb
s    DATA    可执行代码以外的部分(数据段+栈)占用的物理内存大小，单位kb
t    SHR     共享内存大小，单位kb
u    nFLT    页面错误次数
v    nDRT    最后一次写入到现在，被修改过的页面数。
w    S       进程状态(D=不可中断的睡眠状态,R=运行,S=睡眠,T=跟踪/停止,Z=僵尸进程)
x    COMMAND 命令名/命令行
y    WCHAN   若该进程在睡眠，则显示睡眠中的系统函数名
z    Flags   任务标志，参考 sched.h
```



### 修改防火墙端口

```shell
vi /etc/sysconfig/iptables
service iptables restart
```



## 环境变量

* 查看全局变量：
  * env, printenv
* 常见的变量文件：
  * /etc/profile：只要打开 shell，就会先执行该文件
  * ~/.bash_profile
  * ~/.bashrc
  * ~/.bash_login
  * ~/.profile



## 用户权限

* /etc/passwd: 默认账号密码存放位置
* useradd -m {name}: 创建用户 
  * 创建完成后，会在 /home/{name} 有对应的账号配置
* userdel {name}: 删除用户
  * 加上 -r，会把对应的配置文件夹也删除
* usermod: 修改用户信息
  * passwd {name}: 修改密码，按提示输入密码
  * chpasswd < {.txt}: 批量修改账号密码，{userid}:{passwd}
  * usermod -L {name}: 锁定用户
  * usermod -U {name}: 解锁用户
  * usermod -G {groupname} {username}: 添加用户到组里
  * usermod -g {groupname} {username}: 替换用户的默认组为当前组
* /etc/group: 默认组存放位置
* groupadd {name}: 添加组



### 文件权限

```shell
# 当执行 ll 查看文件目录时，看到每个文件的权限
{type}rwxrwxrwx 1 {属主} {属组}
```

* type: 代表的是对象类型
  * -: 文件
  * d: 目录
  * l: 链接
  * c: 字符型设备
  * b: 块设备
  * n: 网络设备
* 后面有三组重复的编码，每组为 3 位
  * 第一位：文件属主权限
  * 第二位：属组成员权限
  * 第三位：其他用户权限
* rwx 分别的意思：
* r: 可读
* w: 可写
* x: 可执行
* -: 都没权限

#### 权限设置

* chmod {options} {mode} {file}

`chmod` 命令的 `mode` 使用的是八进制的写法

| 权限 | 二进制 | 八进制 |
| ---- | ------ | ------ |
|      | 000    | 0      |
| —x   | 001    | 1      |
| -w-  | 010    | 2      |
| -wx  | 011    | 3      |
| r--  | 100    | 4      |
| r-x  | 101    | 5      |
| rw-  | 110    | 6      |
| rwx  | 111    | 7      |

我们可以看到，用三位数的二进制描述不同的权限，然后转成一位数的八进制，虽然有点绕，但还是很清晰地描述

| 命令      | 属主 | 属组   | 其他用户 |
| --------- | ---- | ------ | -------- |
| chmod 777 | 全部 | 全部   | 全部     |
| chmod 760 | 全部 | 读写   | 无权限   |
| chmod 706 | 全部 | 无权限 | 读写     |

 

## 安装软件

### centos

我用的是`cent     os` ， `centos` 使用 `yum` 进行包的管理

`yum -y install nginx` 直接按照 `nginx` 和 所依赖的包

`service nginx start` 就能开启服务，不用带路径那样输入命令开启服务

### nginx 配置

yum install nginx

`yum` 安装的 `nginx` 在 `etc/nginx`

### linux 安装git

如果有`yum`

`yum install git-core`

安装完毕后，设置用户

`git config --global user.name "Your Name"`

`git config --global user.email "youremail@domain.com"`

设置ssh`ssh-keygen -t rsa -C "youremail@163.com"`，连续回车即可

`cat ~/.ssh/id_rsa.pub`，复制ssh，在`github`添加

### 安装nvm

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

查看所有`node`版本：`nvm ls-remote node `

安装指定版本`node`：`nvm install v6.9.4`

使用指定版本：`nvm use v6.9.4`

设置默认版本：`nvm alias default v4.6.0`

##### 安装 443 问题

add '199.232.68.133 raw.githubusercontent.com' to /etc/hosts



### 安装node包

安装淘宝镜像：`npm install -g cnpm --registry=https://registry.npm.taobao.org`

### 安装mongodb

设置配置文件`vim /etc/yum.repos.d/mongodb-org-3.4.repo`

添加以下内容：

```shell
[mongodb-org-3.4]  
name=MongoDB Repository  
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/  
gpgcheck=1  
enabled=1  
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc  
```

开始安装`mongodb`：`yum -y install mongodb-org`

安装完后，`log`和`db`位置都配置好了

`systemctl start mongod.service` // `service mongod start` ，开启mongodb服务

`systemctl status mongod.service`，查看mongodb开启状态

如果`Active`不是`active`，就是失败了。查看`/var/log/mongodb/mongod.log`日志，看看是否有这样的错误`Failed to unlink socket file /tmp/mongodb-27017.sock Operation not permitted`，如果有，就去`/tmp`下，删除那个`.sock`文件。然后重新运行成功

#### 操作mongodb

`mongo`，运行`shell`



##### brew 安装 mongodb

配置文件：`/opt/homebrew/etc/mongod.conf`



### nodejs - nginx配置

阿里云配置`DNS`


```shell
server {
  listen 80;
  server_name canvas-Image-processing.rni-l.com;

  charset utf-8;

  location / {
    proxy_pass  http://localhost:6363/;

    proxy_set_header  Host  $host;
    proxy_set_header  X-Real-IP  $remote_addr;
    proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
  }
}
```

pkill php-fpm: 关闭php-fpm
https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/



## 编写脚本

脚本第一行一定要加：`#! /bin/bash`

常见用法：

```shell
# 声明变量
test="haha"

# 输出字符串变量的长度
# 重点在 #test
${#test}

# let，let 命令可以直接进行基本算术操作，且声明的变量无需加 $
n1=5
n2=4
let res=n1+n2
echo ${res}

# echo 快速生成文件；这命令会清空改文件内容，并输出对应文字
echo "hah test" > test.txt
# >> 会在源文件后面追加内容
echo "hah test2" >> test.txt

# 文件描述符有三种：0，1，2，分别对应输入、输出和 标准错误
# 我们可以命令的内容输出到一个文件里面；下面的命令会把 ls 命令操作后的结果，追加到文件里面
# 同样可以使用 0,1,2
echo ls 1>> test.txt

# tee 可以将命令输出到可视区，并生成文件；-a 是追加内容
ls | tee test.txt
ls | tee -a test.txt

```

数组

```shell
# 定义数组
arr=(1 2 3 55)
arr2[0]="1"
arr2[1]="2"
echo ${arr[2]} 

# 打印全部
echo ${arr[*]}
# 打印长度
echo ${#arr[*]}
```

判断

```shell
# 判断文件是否存在
$file=""
if [ ! -f "$file" ]; then
  echo "不存在"
fi

# 判断文件夹是否存在
$dir=""
if [ ! -d "$dir" ]; then
  echo "不存在"
fi

```



