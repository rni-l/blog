了；‘h# Centos8 环境安装 NodeJS、 Docker 和 Java

> 在搭建 jeecg 环境时，需要用到 NodeJS、 Docker 和 Java，所以这里记录一下安装命令和过程

整个安装过程，基本上都是使用 `yum` 进行

## 安装 Centos 需要的工具

有一些基础工具，比如 nasm、libtools 等，要看具体的 centos 环境有没有，这里就不一一列出，看报错信息进行安装即可

## 安装 Docker

```shell
sudo yum install -y yum-utils
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker # 启动
```

这里也已经安装了 `docker-compose` 了，如果要使用 `docker-compose`，直接这样输入： `docker compose [option]`

## 安装 Java

> 这里安装的是 Java11

```shell
sudo yum install java-11-openjdk-devel
sudo yum install java-11-openjdk
sudo yum install java-11-openjdk-headless

sudo alternatives ––config java # 设置默认 java
```

### 配置环境变量

```shell
# 获取 openjdk 的目录
which java # -> /usr/bin/java
ll /usr/bin/java # -> /etc/alternatives/java
ll /etc/alternatives/java # -> /usr/lib/jvm/java.......x86_64/bin/java

# 在 /etc/profile.d 新增一个配置文件 my_conf.sh
# 添加下面的内容
# JAVA configuration
export JAVA_HOME={上面的那段配置，后面的“/bin/java”不需要}

# 生效配置文件
source my_conf.sh
```

## 安装 Maven

```shell
yum install maven # 安装 maven，这里要看清楚安装的版本是否你需要的
```

### 手动安装

```shell
tar -xf apache-maven-3.8.4-bin.tar.gz -C /usr/local/

mv /usr/local/apache-maven-3.8.4/ /usr/local/maven3.8

ln -s /usr/local/maven3.8/ /usr/local/maven

```



### 配置环境变量

如果是用 yum 安装 maven，则不需要配置

```shell
# 在之前的 my_conf.sh 继续
export MAVEN_HOME=/home/apache-maven-x.x
export PATH=${MAVEN_HOME}/bin:${PATH}

source my_conf.sh

mvn -v # 验证
java -v # 验证
```



## 安装 MySql@5.7

```shell
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 

sudo yum localinstall https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm 

sudo yum install mysql-community-server 

sudo systemctl start mysqld 

# 获取初始账号密码
grep 'A temporary password' /var/log/mysqld.log |tail -1 

# 修改密码
/usr/bin/mysql_secure_installation 

```





## 安装 nginx 和 git

Git:

```shell
yum install git # 安装 git

# 初始化 git 信息
git config --global user.name ""
git config --global user.email ""
```

SSH:

```shell
ssh-keygen -t rsa # 直接回车确认
```

Nginx:

```shell
yum install nginx
```



## 参考资料

1. [安装 Docker](https://docs.docker.com/engine/install/centos/)
2. [安装 Java](https://phoenixnap.com/kb/how-to-install-java-centos-8)
3. [配置 Java 环境变量](https://www.jianshu.com/p/a19871138761)
4. [手动安装指定版本的 maven](https://cloud.tencent.com/developer/article/1962156)