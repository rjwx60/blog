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

互联网由用户网络、企业内部网络、骨干网等复数多个网络组成，IP层及其之下的数据链路层负责如何选择和跨越不同网络，TCP上层负责如何构造消息、TCP层则负责如何将任意长度的消息可靠、有序发送；



### 二、TCP协议

TCP是面向连接的、可靠的、基于字节流的传输层通信协议；

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

2-3-2、UDP头部

2-3-3、TCP头部/TCP Segment报文段？

补充：消息传输的核心要素、如何标识连接、报文段、TCP Options



### 三、连接创建、管理、终止

#### 3-1、三次握手

#### 3-x、四次挥手

#### 3-y、状态转换

补充：建立连接的性能优化FTO、安全问题



四、