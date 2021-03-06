# 一、基本

## 1-1、基本

DNS (Domain Name System)，是一种组织成：域层次结构的计算机和网络服务命名系统，<u>提供将主机名和域名转换为IP地址的服务</u>，是将人类可读域名与服务器 IP 进行映射的数据库，使用户更为方便访问网络；

DNS 运行在 UDP 协议之上，使用端口 53；(网络通讯大部分基于 TCP/IP，虽 IP 不方便记忆，但机器不认域名)

DNS 是互联网中的重要基础设施，为保证高可用、高并发和分布式，它设计成了树状的层次结构；

DNS 由<u>根DNS服务器、顶级域 DNS 服务器、权威 DNS 服务器</u> 组成；解析顺序是：

首先从 <u>浏览器缓存</u>、<u>操作系统缓存</u> 及 <u>本地 DNS 缓存 (/etc/hosts)</u> 逐级查找，然后从 <u>本地 DNS 服务器</u>、<u>根 DNS</u>、<u>顶级 DNS</u> 及 <u>权威 DNS</u> 层层递归查询；还可基于域名在内网、外网进行负载均衡；

传统 DNS 有很多问题(解析慢、更新不及时)，但是 <u>HTTP DNS</u> 通过客户端 SDK 和服务端配合，直接通过 HTTP 调用解析 DNS 的方式，从而绕过传统 DNS 缺点，实现智能调度；



## 1-2、域名结构

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234809.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234830.png" style="zoom:50%;" />

### 1-2-1、根子结构

DNS服务器一般分三种，根DNS服务器，顶级DNS服务器，权威DNS服务器；

**<u>根域</u> **名服务器，只保存下一级域名( **<u>顶级域</u>** 名服务器，保存下级域名服务器 IP)，比如 com、net、org 等，此外还有国家域名 jp、cn 等，而 [全球只有13台](https://www.zhihu.com/question/22587247/answer/66417484) 根服务器；而顶级域名服务器则保存更下级的域名服务器 IP(**<u>第二层域</u>** 名服务器)，第二层域下含有 **<u>子域</u>** 名服务器；

- 根 DNS 服务器 ：返回顶级域 DNS 服务器的 IP 地址；
- 顶级域 DNS 服务器：返回权威 DNS 服务器的 IP 地址；
- 权威 DNS 服务器 ：返回相应主机的 IP 地址；



### 1-2-2、分布式

DNS 使用分布式的层次数据库模式缓存方法，来解决单点集中式的问题：

- 故障影响大(因特网规模持续增长，集中式设计一旦发生故障，全球通讯失败)
- 通信容量(上亿台主机发送查询DNS报文请求，包括但不限于 HTTP请求，电子邮件报文、TCP长连接服务)
- 远距离的时间延迟；
- 维护开销大(因所有主机名的 IP 映射都要在同一服务站点更新)



## 1-3、查询工具 Dig

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234831.png" style="zoom:50%;" align=""/>

注意：资源记录：DNS 数据库中包含的 **<u>资源记录 (RR)</u>**，每个 RR 标识数据库中的特定资源；

- 在建立 DNS 服务器时，常用到 SOA、NS、A 记录；
- 在维护 DNS 服务器时，则用到 MX、CNAME 记录

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234832.png" style="zoom:50%;" align=""/>





## 1-4、DNS 解析流程

[How DNS query works](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc775637(v=ws.10)?redirectedfrom=MSDN)

1、首先：浏览器中输入域名 `www.baidu.com` ，然后浏览器搜索  **<u>自身 DNS 缓存</u>** (时效1min可存1000条，可通过地址栏输入 `chrome://net-internals/#dns` 查看)，若无则该请求会传递到 DNS 客户端服务，以使用计算机本地缓存的信息进行解析， **<u>本地解析器缓存</u>** 可从2个可能的来源获得名称信息：(查看本机 DNS 缓存方式详看：[stackoverflow](https://stackoverflow.com/questions/38867905/how-to-view-dns-cache-in-osx) )

- 若在本地配置 Hosts 文件，则在启动 DNS 客户端服务时，该文件中所有的主机到地址的映射均会预加载到缓存中；
- 从以前的 DNS 查询的答复中获得的资源记录将添加到缓存中并保留一段时间；

2、然后，若查询与缓存中的条目不匹配，则解析过程将继续进行，客户端将向 **<u>本地配置的首选DNS 服务器</u>** 发起 <u>*递归*</u> 的域名解析请求，当运营商 DNS 服务器收到查询时，首先根据服务器本地配置区域中包含的资源记录信息，检查是否可权威地回答查询，若查询名称与本地区域信息中相应资源记录相匹配，则以此来解析查询名称以进行权威应答；若查询名称不存在于当前区域，则使用先前查询的本地缓存结果 (**<u>本地DNS服务器已缓存的映射关系</u>**) 进行检查，若匹配且未过期，则表示查询成功 (但此结果不具有权威性)；

- 注意：本地配置的首选DNS 服务器，一般是电信运营商提供的，也可是 Google 提供的 DNS 服务器；

- 注意：浏览器发起 DNS 的系统调用，在很多基于UNIX的机器上，应用程序需调用函数 `gethostbyname()` ，用户主机的DNS客户端接收到后，便向网络中发送 DNS 查询报文；
- 注意：查询其他DNS服务器使用递归查询，而为了使 DNS 服务器正确进行递归，需要一些有关 DNS 域名称空间中其他 DNS 服务器的有用的联系信息。此信息以 ***根提示 root hints*** 的形式提供(若下图)，***根提示***是可以由  DNS 服务用来查找对 DNS 域名称空间树的根具有权威性的其他 DNS 服务器的初步资源记录的列表；通过 ***根提示*** 查找根服务器，DNS 服务器可完成递归使用；

3、然后，若查询不得，则过程继续，DNS 服务器为用户发起 DNS 解析<u>*迭代*</u> 请求；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234833.png" style="zoom:50%;" />

- 注意：DNS的域名查找，在客户端和浏览器，本地DNS之间的查询方式是递归查询；在本地DNS服务器与根域及其子域之间的查询方式是迭代查询；递归查询与迭代查询区别：
  - **递归查询-Recursive resolution (query)**：在递归解析中，如果客户机被授权使用域名，它就向第一服务器(the.edu)发送请求，否则就向下一服务器发送客户机请求，直到正确的服务器解析查询并向客户机发送应答；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234834.png" style="zoom:50%;" align=""/>
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234835.png" style="zoom:50%;" align=""/>
  - **迭代查询-Iterative resolution**：客户端向第一个服务器发送查询，如果服务器被授权使用域名，它就会发送应答(IP 或域名) ，否则它就会发送下一个服务器的 IP 地址来解决查询。现在客户端将查询发送到第二台服务器。客户端继续这个向服务器发送查询的过程，直到查询被解析；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234836.png" style="zoom:50%;" align=""/>
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234837.png" style="zoom:30%;" align=""/>
  - 综上，递归查询时客户单只发送查询到第一个服务器，然后服务器将请求发送到下一个服务器，直到查询被解析；而在迭代查询中，客户端负责将查询发送到不同的服务器，直到查询被解析；

4、然后，若上述过程均解析失败，则根据本地 DNS 服务器的设置(是否设置转发器)进行查询：

- 若未开启转发模式：
  - 首先，本地 DNS 服务器会向 13台 <u>*根 DNS 服务器*</u> 发起查询(DNS 服务器均内置13台根域的 DNS 的 IP 地址)，后者收到请求后会判断(.com) 由谁授权管理，并会返回负责该顶级域名的服务器的 IP (<u>*下一级DNS服务器*</u>)；
  - 然后，本地 DNS 服务器收到响应后，向负责 .com 域的服务器发起查询，若服务器自身无法解析，则会将管理 `baidu.com` 域的<u>*下一级 DNS服务器*</u> IP 地址返回给本地 DNS 服务器；
  - 最后，当本地 DNS 服务器收到后，查询负责 `baidu.com`  域的服务器；
  - 重复上述动作进行查询，直至 `www.baidu.com` ，最后返回给 DNS 服务器，服务器将结果返回给主机，主机再交给浏览器；
- 若已开启转发模式：本地 DNS服务器就会将请求转发至上一级 DNS服务器，由上一级服务器进行解析，若上级服务器无法解析，则或寻找根DNS或把转请求转至上上级，循环往复，最后返回给 DNS 服务器，服务器将结果返回给主机，主机再交给浏览器；

5、最后，若上述方法 (本地、DNS 服务器、缓存、迭代查询)均失败，操作系统则会：

- 首先，查询 **<u>NetBIOS name Cache (NETBIOS名称缓存，存放最近一段时间内成功通讯的计算机的机名与 IP 地址)</u>**，
- 然后，若还失败，则查询 **<u>WINS 服务器(NETBIOS 名称和 IP 地址对应的服务器)</u>**，
- 倘若，还失败，则客户端进行广播查找 
- 假若，还失败，客户端读取 **<u>LMHOSTS 文件 (类似 Hosts)</u>**；
- 最后，解析失败

注意：无论本地DNS服务器开启转发模式与否，最后均将结果返回给自身，本地DNS服务器再将其返回给用户；从 **客户端到本地DNS服务器是递归查询，而DNS服务器间的交互查询是迭代查询**；



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234838.png" style="zoom:50%;" />

注意：**主机向本地域名服务器的查询一般都是采用递归查询**：若主机所询问的本地域名服务器不知道被查询的域名的IP地址，则本地域名服务器就以 DNS客户身份，向其它根域名服务器继续发出查询请求报文(即替主机继续查询)，而不是让主机自己进行下一步查询。因此，递归查询返回的查询结果或者是所要查询的IP地址，或者是报错，表示无法查询到所需的IP地址；而**本地域名服务器向根域名服务器的查询的迭代查询**：当根域名服务器收到本地域名服务器发出的迭代查询请求报文时，要么给出所要查询的IP地址，要么告诉本地服务器：“下一步应当向哪个域名服务器进行查询”。然后让本地服务器进行后续的查询。根域名服务器通常是将自己知道的顶级域名服务器的IP地址告诉本地域名服务器，让本地域名服务器再向顶级域名服务器查询。顶级域名服务器在收到本地域名服务器的查询请求后，要么给出所要查询的IP地址，要么告诉本地服务器下一步应当向哪一权限域名服务器进行查询。最后，知道了所要解析的IP地址或报错，然后把这个结果返回给发起查询的主机；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234839.png" style="zoom:50%;" />



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234840.png" style="zoom:50%;" />

注意：查找过程中，优化点如下：

- DNS 存在着多级缓存，从离浏览器的距离排序的话，有以下几种：
- 浏览器缓存，系统缓存，路由器缓存，IPS服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存；
- 在域名和 IP 的映射过程中，给了应用基于域名做负载均衡的机会，可以是简单的负载均衡，也可以根据地址和运营商做全局的负载均衡；





# 二、DNS 报文

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234841.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234842.png" style="zoom:50%;" />

- 注意：请求和响应格式为同一结构，只是部分字段内容的有无；
- 注意：query：查询域名；response：返回 IP 地址；



## 2-1、DNS 请求报文

### 2-1-1、Question 字段格式

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234843.png" style="zoom:40%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234844.png" style="zoom:50%;" align=""/>

## 2-2、DNS 响应报文

### 2-2-1、Answer 字段格式

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234845.png" style="zoom:40%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200907234846.png" style="zoom:50%;" />



## 2-3、DNS 使用 UDP

<u>DNS 使用 UDP 传输原因：减小响应时间</u> (响应时间= DNS域名解析时间(域名解析时间越小越好)+ TCP 连接建立时间(固定的三次握手很难有进一步缩小的空间) + HTTP交易时间(基于Request / Response很难有提升的空间))；

- 采用TCP传输，则域名解析时间为：
  - DNS域名解析时间 = TCP连接时间 + DNS交易时间(若查询冷门域名信息，则还可能会经过域名根服务器、一二级域名服务器迭代查询，成本高昂)；
- 采用UDP传输，则域名解析时间为：
  - DNS域名解析时间 = DNS交易时间，减小响应时间，有效信息占比高；





# 三、安全与优化

## 3-1、DNS 安全问题

### 3-1-1、DNS DDoS 攻击

DNS 分布式拒绝服务 (DDoS) 带宽洪泛攻击，即攻击者向每个 DNS 根服务器/顶级域名服务器发送大量分组，使得大多数合法  DNS 请求无法得到应答；

- 对策A：使用分组过滤器保护，阻挡所偶有指向根服务器的 ICMP ping 报文；
- 对策B：启动本地服务器的缓存技术，本地服务器缓存顶级域名服务器地址(便可绕过迭代查询根级服务器)；



## 3-2、DNS 优化方式

### 3-2-1、减少主机名

当客户端 DNS 缓存为空，DNS 查找数量与要加载的  Web 页面中唯一主机名的数量相同(含各类资源主机名)，

所以：减少主机名数量可减少 DNS 查找数量，提升页面加载速度；

注意：减少主机名与尽可能让浏览器并行下载相冲突，需合理处理关系；

建议：将组件放到至少2个但不多于4个的主机名下，减少 DNS 查找的同时也允许高度并行下载；