---
typora-root-url: ../Source
---



### 一、基本

#### 1-1、基本

​	DNS( Domain Name System)，是一种组织成域层次结构的计算机和网络服务命名系统，提供将主机名和域名转换为IP地址的服务，是将人类可读域名与服务器 IP 进行映射的数据库，使用户更为方便访问网络；DNS 运行在 UDP 协议之上，使用端口 53；(网络通讯大部分基于TCP/IP，IP 不方便记忆，但机器不认域名)

#### 1-2、域名结构

<img src="/Image/NetWork/dns/1.png" style="zoom:50%;" />



#### 1-3、查询工具 Dig

<img src="/Image/NetWork/dns/8.png" style="zoom:50%;" />



### 二、DNS 报文

<img src="/Image/NetWork/dns/2.png" style="zoom:50%;" />

<img src="/Image/NetWork/dns/3.png" style="zoom:50%;" />

- 注意：请求和响应格式为同一结构，只是部分字段内容的有无；

- 注意：query：查询域名；response：返回 IP 地址；

#### 2-1、DNS 请求报文

##### 2-1-1、Question 字段格式

<img src="/Image/NetWork/dns/5.png" style="zoom:40%;" align="left"/>

<img src="/Image/NetWork/dns/4.png" style="zoom:50%;" />

#### 2-2、DNS 响应报文

##### 2-2-1、Answer 字段格式

<img src="/Image/NetWork/dns/7.png" style="zoom:40%;" align="left"/>

<img src="/Image/NetWork/dns/6.png" style="zoom:50%;" />





### 三、安全与优化

#### 3-1、安全问题

##### 3-1-1、DNS DDoS 攻击

​	DNS 分布式拒绝服务 (DDoS) 带宽洪泛攻击，即攻击者向每个 DNS 根服务器/顶级域名服务器发送大量分组，使得大多数合法  DNS 请求无法得到应答；

- 对策A：使用分组过滤器保护，阻挡所偶有指向根服务器的 ICMP ping 报文；
- 对策B：启动本地服务器的缓存技术，本地服务器缓存顶级域名服务器地址(便可绕过迭代查询根级服务器)；



##### 3-1-2、DNS 劫持