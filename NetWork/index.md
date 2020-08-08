---
typora-root-url: ../Source
---



### 一、OSI 七层模型

即应用层、表示层、会话层、传输层、网络层、数据链路层、物理层

```
application layer、presentation layer、session layer、transport layer、network layer、data link layer、physical layer
```



<img src="/Image/NetWork/index/17.png" style="zoom:50%;" />

<img src="/Image/NetWork/index/18.png" style="zoom:50%;" />





### 二、CDN

CDN（Content Delivery Network）就是内容分发网络；

为突破现实生活中的光速、传输距离等物理限制，CDN 投入了大量资金，在全球范围内各大枢纽城市建立机房，部署大量高存储高带宽的节点，构建跨运营商、跨地域的专用高速传输网络；其中分为中心节点、区域节点、边缘节点等，在用户接入网络后，首先通过全局负载均衡 `(Global Sever Load Balance)`，简称 GSLB 算法负责调度，找到离用户最合适的节点。然后通过 HTTP 缓存代理技术进行缓存，缓存命中就返回给用户，否则就回源站去取。CDN 擅长缓存静态资源(图片、音频等)，当然也支持动态内容的缓存；