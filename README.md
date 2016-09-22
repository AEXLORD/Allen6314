# 简介 

网站地址：[https://www.wuhuachuan.com/](https://www.wuhuachuan.com/)

一个简单的个人博客代码。自己做感觉自由点。

- bkallenway：后端 java 代码。用的是 springboot + springdatajpa 
- frontallenway：前端 nodejs 代码。用的是 swig 模板。

类似前后端分离的一个结构。其他在服务器的一些组件有：

- nginx：主要功能是 静态文件 和 https。
- kong：用于做 api gateway。这里结合 oauth 用于做管理员登录。
- redis：后端缓存，前端没有用。
- mysql

运维上用的 docker 分离上面的组建。不过持续集成上之前用的 jenkins，用着感觉还不如直接去服务器上更新，所以现在更新代码就是直接去服务器docker里面， git fetch，merge，supervisorctl restart，就完事了。前端就 node app.js，倒没有用 pm2，懒得弄了。

其实前端估计要接个 redis，现在后端还是有状态的，管理员登录的 token 在数据库中有 token-user 的绑定，没做到完全的无状态，等以后把这个放在 kong 这层来做后端就能完全无状态了，不过到时候得用 lua 开发，表示对 lua 不感冒（囧ing）。


![blog](http://oag791r8q.bkt.clouddn.com/blog_structure.png?imageMogr2/thumbnail/!75p)

---

- [知乎](https://www.zhihu.com/people/wuhuachuan)
- [微博](http://weibo.com/1796766555/profile?topnav=1&wvr=6&is_all=1)
