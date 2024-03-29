---
title: vim
date: 2020-12-17 11:19:00
tags: ["vim"]
categories: ["记录"]
---

> 记录 vim 操作

![](http://md.rni-l.com/md/vi-vim-cheat-sheet-sch.gif)



 ![](http://md.rni-l.com/md/vim2.jpg)



### 编辑

下面所有操作，基于“可视模式”下进行

#### 插入

在光标位置插入：i

在行尾插入：A



#### 删除

删除光标位置内容：x

删除单词（在光标开始的位置，删除至这单词的末尾，不要在单词中部使用），到下个单词起始处：dw

删除单词，和 dw 类似，但只删除单词：de

删除光标位置到行末尾：d$

删除整行：dd



##### 解释

d 是一个操作符，后面要跟一个动作，才构成一个具体的命令

```bash
 d   motion

  其中：
    d      - 删除操作符。
    motion - 操作符的操作对象(在下面列出)。

  一个简短的动作列表：
    w - 从当前光标当前位置直到下一个单词起始处，不包括它的第一个字符。
    e - 从当前光标当前位置直到单词末尾，包括最后一个字符。
    $ - 从当前光标当前位置直到当前行末。

```



#### 撤销

撤销最后执行的命令：u

撤销对整行的修改： U

撤销以前的撤销命令：ctrl + R



#### 置入

d{x} 删除后的内容，输入 p，会在光标下方插入（因为删除后的内容，会保存到 vim 的寄存器中）



#### 替换

单字符替换：在光标位置，输入 r + 要替换的字符，进行替换

单词替换：在光标位置，输入 ce 。会把光标后的单词移除，并进入编辑状态

行搜索替换：

1. :s/abc/edf  ->  将光标所在的行的 abc 替换成 edf
2. :s/abc/edf/g  ->  替换整行，全部匹配的
3. :%s/abc/edf/g  ->  替换整个文件，全部匹配的
4. :%s/abc/edf/gc  ->  替换整个文件，全部匹配的，并且每个替换进行提示确认



##### 解释

c 命令和 d 命令类似，也是一个组合命令

动作参数和 d 的一样





### 移动

#### 定位

移动到首行：gg

移动到末尾：G

移动到指定行：5g   ->  {number}g

查找配对的 ) ] }

1. 光标在对应的 () [] {} 中
2. 输入 % 进行定位
3. 再次输入会回到原位

移动到末尾：G

移动到指定行：5g   ->  {number}g





### 搜索

搜索字符串：

1. 输入 /
2. 再输入对应要搜索的字符串
3. 回车
4. 输入 n 移动匹配的位置

逆向查找：?





### 高级操作



计数： 在所有的动作前输入数字，则会执行后面动作 x 次

查看文件状态和光标位置：ctrl + gG

执行外部命令：:!{外部命令}

显示行数：编辑模式下输入： set number；全局修改：在 ~/.vimrc 文件最后一行添加 set number



