## 问题

### no live upstreams while connecting to upstream client

```shell
        proxy_pass    http://localhost:5001 -> http://127.0.0.1:5001;
```

*  [no live upstreams while connecting to upstream client?](https://stackoverflow.com/questions/49767001/how-to-solve-nginx-no-live-upstreams-while-connecting-to-upstream-client)



### nginx 访问资源 403

https://stackoverflow.com/questions/25774999/nginx-stat-failed-13-permission-denied

从两个点查找：
1. nginx 运行用户是否 root 或有权限的用户
	1. `ps aux | grep nginx` 可以查看
2. selinux 是什么模式运行？
	1. 修改 `sudo nano /etc/selinux/config` -> `SELINUX=permissive`，成宽松模式