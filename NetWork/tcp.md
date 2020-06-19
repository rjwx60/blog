---
typora-root-url: ../Source
---

### 一、历史

#### 1-1、NCP协议：TCP/IP协议前身ARPA

<img src="/Image/NetWork/tcp/1.png" style="zoom:50%;" align="left"/>

#### 1-2、TCP/IP的七个设计理念

- Internet communication must continue despite loss of networks or gateways. 
- The Internet must support multiple types of communications service. 
- The Internet architecture must accommodate a variety of networks. 
- The Internet architecture must permit distributed management of its resources. 
- The Internet architecture must be cost effective. 
- The Internet architecture must permit host attachment with a low level of effort. 
- The resources used in the internet architecture must be accountable.
- More：https://zoo.cs.yale.edu/classes/cs633/Reviews/Cla88.msl38.html

#### 1-3、TCP/IP协议发展

​	1973年，Vinton Gray Cerf 和 Robert Elliot Kahn 提出 TCP/IP 协议，此时的 TCP 协议包含 IP 功能，随后历经几次版本升级，并于1980 TCPv4 中进行协议分层，分层后如图2；

- TCP：面向连接的、可靠的、基于字节流的传输层通信协议；
- IP：根据 IP 地址穿越网络传送数据；

<img src="/Image/NetWork/tcp/2.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/3.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/4.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/5.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/6.png" style="zoom:50%;" align="center"/>

#### 1-4、TCP协议解决

​	互联网由用户网络、企业内部网络、骨干网等复数多个网络组成，IP层及其之下的数据链路层负责如何选择和跨越不同网络，TCP上层负责如何构造消息、TCP层则负责如何将任意长度的消息可靠有序发送；



### 二、TCP协议

​	TCP是面向连接的、可靠的、基于字节流的传输层通信协议；

- 基于字节流：1、消息无边界，无论消息多长均能传输；2、有序；即便先到达，也不能交予应用层处理；
- 可靠传输：无论网络出现何种状况，均能保证信息可达；
- 面向连接：一对一；



#### 2-1、协议特点

在 IP 协议之上，解决网络通讯可依赖问题

- 点对点：无法广播多播，面向连接，仅连接存在时才可传输数据；
- 双向传递：即全双工；HTTP1.1协议实际为单向协议，只能 client 发送请求 server 响应；但TCP 是全双工 
  - 注意：Websocket 也是全双工(实际是将 TCP 全双工特点暴露到应用层中))；
- 字节流：打包成报文段、保证有序接收、重复报文自动丢弃
  - 优点：不强制要求应用必须离散地创建数据块、不限制数据块大小；
  - 缺点：不维护应用报文边界(对比HTTP、GRPC)，需由上层协议定义结尾，比如 /n/n、contentLength；
- 流量缓冲：解决双方处理速度不匹配问题；
- 可靠传输：保证可达，丢包时通过重发进而增加时延实现可靠性；
- 拥塞控制：不仅解决通讯双方问题，双方通讯经由的网络也在考虑范围之内；



#### 2-2、协议任务

- 主机内的进程寻址；
- 创建、管理、终止连接；
- 处理并将字节流打包成报文段；
- 传输数据；
- 保证可靠性与传输质量；
- 流控制与拥塞控制；



#### 2-3、报文格式

2-3-1、IP头部

<img src="/Image/NetWork/tcp/7.png" style="zoom:50%;" align="left"/>

2-3-2、UDP头部

<img src="/Image/NetWork/tcp/8.png" style="zoom:50%;" align="left"/>

2-3-3、TCP头部(Segment报文段)

<img src="/Image/NetWork/tcp/9.png" style="zoom:50%;" align="left"/>

- 补充：通过 TCP 四元组标识一个连接：源地址、源端口、目的地址、目的端口；
  - 注意：对于 IPv4 地址，单主机最大 TCP 连接数为 2^(32+16+32+16)；
  - 注意：并非都得通过四元组标识连接：QUIC 协议；
  - <img src="/Image/NetWork/tcp/11.png" style="zoom:50%;" align="left"/>
- 补充：Source Port & Destination Port 定义TCP连接，Sequence Number & Acknowledgment Number 用以唯一标识TCP报文，类似物流系统中的订单号，Acknowledgment Number 还用于确认报文以实现数据可达性；
- 补充：常用的TCP Options
- <img src="/Image/NetWork/tcp/10.png" style="zoom:50%;" align="center"/>
- <img src="/Image/NetWork/tcp/12.png" style="zoom:50%;" align="center"/>
  - MSS：最大段大小项
  - SACK：选择确认项：
  - WSOPT：窗口缩放项：
  - TSOPT：时间戳项：
  - UTO：用户超时项：
  - TCP-AO：TCP 认证选项：



### 三、连接创建、管理、终止

#### 3-1、三次握手

##### 3-1-1、握手目的

- 同步双方 Squence 序列号 (初始序列号 ISN-Initaial Sequence Number)；
- 交换 TCP 通讯参数；比如 MSS、窗口比例因子、选择性确认、指定校验和算法；
  - 注意：每个初始序列号-ISN 均会标识一个字节 (面向字节流的字节)，服务端与客户端所使用的初始序列号 ISN 不同，故需三次握手分别交换 ISN；

##### 3-1-2、握手流程

<img src="/Image/NetWork/tcp/13.png" style="zoom:50%;" align="left"/>

- 首先，客户端发送 SYN 将自身 ISN 发往服务端；
- 然后，后者确认收到后，响应 SYN/ACK，同时发送自身 ISN， 所以 SYN 标志位置1；
- 最后，客户端收到响应后，回响 ACK 确认；
  - 注意：SYN：同步报文、ACK：确认报文；
  - 注意：ISN 是随机数，此举可确保不同连接的唯一性，避免相互影响(延迟、重发、丢失)；

##### 3-1-3、三次握手

- 一次握手：SYN 报文：
  - 描述：将 TCP 头部的 Flag 中的第7位置 1 即表示 SYN，在 Sequence 中填入客户端的序列号码 ISN：
  - <img src="/Image/NetWork/tcp/15.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/NetWork/tcp/18.png" style="zoom:50%;" align="left"/>
- 二次握手：SYN/ACK 报文
  - 描述：将 TCP  头部的 Flag 中的第 7 位置 1 即表示 SYN，将第 4 位置 1 即表示 ACK，在 Sequence 中填入服务端的序列号码ISN，在 Acknowlage number 中填入 (客户端 ISN+1)表示确认收到：
  - <img src="/Image/NetWork/tcp/16.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/NetWork/tcp/19.png" style="zoom:50%;" align="left"/>
- 三次握手：ACK 报文
  - 描述：将 TCP 头部的 Flag 中第4位置1表示 ACK，在 Acknowlage number 中填入 (服务端 ISN+1)表示确认收到；
  - <img src="/Image/NetWork/tcp/17.png" style="zoom:50%;" align="left"/>

##### 3-1-4、状态变迁

三次握手涉及的五种状态：CLOSE、LISTEN(服务器常驻状)、SYN-SENT、SYN-RECEIVED、ESTABLISHED(三次握手后)，而理解状态变迁对在复杂网络环境中定位问题很有帮助；(图2是双方同时发送 SYN 的状态变化图，情况罕见)

<img src="/Image/NetWork/tcp/21.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/22.png" style="zoom:50%;" align="center"/>

- 首先，客户端发起 SYN，随后即由 **CLOSED** 进入 **SYN-SENT** 状态；
- 然后，服务端收到后，从 <u>***LISTEN***</u> 常驻状态进入 <u>***SYN-RECEIVED***</u> 状态并回送 SYN/ACK 报文；
- 然后，客户端收到 SYN/ACK 后，由 **SYN-SENT** 进入 **ESTABLISHED**，并回送 ACK 报文；
- 最后，服务端收到 ACK 报文，进入 <u>***ESTABLISHED***</u> 状态；
  - 注意：Passive Open 被动打开，Active Open 主动打开；
  - 注意：若为双方同时发送 SYN，则客户端多出 SYN-RECEIVED 状态，服务端多出 SYN-SENT 状态；
  - 注意：TCB：Transmission Contril Block，保存连接使用的源端口、目的端口、目的IP、序号、应答序号、对方窗口大小、己方窗口大小、TCP状态、TCP输入输出队列、应用层输出队列、TCP重传相关变量等；
  - 注意：图1 中的服务端 TCB 建立在 LISTEN之前，是因为被动监听的句柄也要建立 TCB，其不表达一具体连接，但必须存在才能维护建链过程的相关信息；



##### 3-1-5、握手示例

- 通过 tcpdump 监听端口：tcpdump -i lo port 80 -c 3 -S
  - ![](/Image/NetWork/tcp/14.png)
  - 注意：缩写表示：S (SYN), F (FIN), P (PUSH), R (RST), U (URG), W (ECN CWR), E (ECN-Echo) , '.' (ACK),  'none' (无任何标志位)；
- 通过 netstat 查看连接相关状态：netstat -anp | grep tcp
  - ![](/Image/NetWork/tcp/23.png)
  - 注意：不同平台均可通过 netstat 工具查看相应状态



##### 3-1-6、性能优化

<img src="/Image/NetWork/tcp/24.png" style="zoom:40%;" align="left"/>

3-1-6-1：优化1：调整超时时间与缓存队列长度

​	描述：服务器三次握手示例如上 SYN 到达，插入 SYN 队列同时发送 SYN/ACK 分组，若 ACK 到达则取出连接套接字并插入 ACCEPT 队列，当上层应用程序需要时，则调用 accept 方法取出连接套接字供上层使用；而对于几十万数百万请求的网络环境，服务端SYN 和 ACCEPT 队列势必要延长(操作系统内核层级)，此外还可在客户端调整应用层 connect 超时时间(Connec Timeout)；

- 客户端可在应用层调整 connect 超时时间；
- 服务端可调整操作系统内核限制：
  - 服务端 SYN_RCV 状态：
    - `net.ipv4.tcp_max_syn_backlog`：SYN_RCVD 状态连接的最大个数；
    - `net.ipv4.tcp_synack_retries`：被动建立连接时，发出 SYN/ACK 的重试次数；
  - 客户端 SYN_SENT 状态：
    - `net.ipv4.tcp_syn_retries = 6`：主动建立连接时，发 SYN 的重试次数；
    - `net.ipv4.ip_local_port_range = 32768 60999`：建立连接时的本地端口可用范围；
  - ACCEPT 队列设置

3-1-6-2：优化2：TFO

​	描述：快速建立 TCP 连接，TFO-TCP-FastOpen：首次连接多传送 Cookie，以供客户端缓存，若后续再次建立连接时，客户端一并传送 Cookie，服务端识别后将 Data 随 SYN/ACK 报文回传；(省去客户端 ACK 确保报文)，此举可降低二次连接时的时延；

​	实现：开启系统 TFO 功能：`net.ipv4.tcp_fastopen`：关闭-0、作为客户端时可使用 TFO-1、作为服务端时可使用 TFO-2、无论哪端均可使用 TFO-3；注意：服务端为客户端建立 Cookie 的前提是双方均支持 TFO，随后当客户端再次向服务器建立连接时，则复用缓存 cookie，服务端验证通过后才能在首次握手中传递消息；

<img src="/Image/NetWork/tcp/25.png" style="zoom:50%;" />

3-1-6-3：优化3：TCP_DEFER_ACCEPT

​	描述：当服务器收到 ACK 分组后，并将 SYN 放入相应 ACCEPT 队列中，但内核不立即激活相应应用程序，而是等待后续数据到达再激活，以提升效率；



##### 3-1-7、安全问题

3-1-7-1、SYN 攻击

​	描述：攻击者短时间内伪造不同 IP 地址的SYN报文但不发送 ACK，以实现快速占满 backlog (SYN)队列，使服务器不能为正常用户；(可按照TCP协议格式来构造SYN帧，大多数编程语言都支持，在基于socket 编程时设置为 RAW_SOCKET 大概类似的字样，此时相当于在 IP 层之上编程)；

​	防御方式1：调整 SYN 队列、连接数

`net.core.netdev_max_backlog`：接收来自网卡，但未被内核协议栈处理的报文队列长度；

`net.ipv4.tcp_max_syn_backlog`：SYN_RCVD 状态连接的最大个数；

`net.ipv4.tcp_abort_on_overflow`：超出处理能力时，对新来的 SYN 直接回包 RST，丢弃连接；

​	防御方式2：tcp_syncookies

![](/Image/NetWork/tcp/26.png)

​	若应用程序过慢则导致 Accept 队列满，若受到 SYN 攻击则导致 SYN 队列满，此时可启用 cookie：`net.ipv4.tcp_syncookies = 1` 为连接生成唯一 cookie 并随 SYN/ACK 返回给客户端，客户端在随后的请求中携带 cookie 并由服务器认证并响应；即 SYN 队列满时亦可建立连接；注意：(感觉) syn_cookie 与 TFO 中的 cookie 不同，前者保证当前连接的合法性、后者保证再次连接的合法性；





#### 3-x、四次挥手

#### 3-y、状态转换

补充：建立连接的性能优化FTO、安全问题



四、