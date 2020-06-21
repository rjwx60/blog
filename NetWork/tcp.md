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

<img src="/Image/NetWork/tcp/5.png" style="zoom:50%;" align="left"/>

##### 2-3-1、IP头部

<img src="/Image/NetWork/tcp/7.png" style="zoom:50%;" align="left"/>

##### 2-3-2、UDP头部

<img src="/Image/NetWork/tcp/8.png" style="zoom:50%;" align="left"/>

##### 2-3-3、TCP头部(Segment报文段)

<img src="/Image/NetWork/tcp/9.png" style="zoom:50%;" align="left"/>

##### 2-3-3-1、Source Port(源端口)、Destination Port(目的端口) 

​	用于定义TCP连接，通过 TCP 四元组唯一标识一个连接：源地址、源端口、目的地址、目的端口；

- 注意：源地址、目的地址即源IP、目的IP，在IP层处理，TCP层只需记录端口；
- 注意：对于 IPv4 地址，单主机最大 TCP 连接数为 2^(32+16+32+16)；
- 注意：并非都得通过四元组标识连接，还可使用 QUIC 协议标识；
- <img src="/Image/NetWork/tcp/11.png" style="zoom:50%;" align="left"/>

##### 2-3-3-2、SequenceNumber(序列号)、AcknowledgmentNumber(确认号)

用以唯一标识TCP报文，类似物流系统的订单号，ACK 还用于确认报文，以实现数据可达性；

- SequenceNumber：指的是本报文段第一个字节的序列号。长度为 4 字节(32 位)的无符号整数，表示范围为 0 ~ 2^32 - 1。若到达最大值则循环到 0，作用有二：
  - 在 SYN 报文中交换彼此的初始序列号；
  - 保证数据包按正确的顺序组装；
- AcknowledgmentNumber：用以告知对方下一个期望接收的序列号，**小于ACK**的所有字节已全部收到；

##### 2-3-3-3、ISN-Initial Sequence Number(初始序列号)

因 TCP 报文段在经过网络路由后会存在延迟抵达或排序混乱情况，故需要 ISN，而三次握手核心目的之一就是交换双方 ISN，交换后才可得知对方发送信息的初始位置；

- 注意：ISN 的构建使用半随机方法构建(基于时钟+偏移量+加密散列函数+每隔 4 ms 加1)，以确保不同连接间唯一性，防止重叠，避免不同连接间的相互影响，也为了避免连接被攻击者预测、伪造报文；

##### 2-3-3-4、Window(窗口大小)、Checksum(校验和)

- Window：占 2 字节16 位，但实际中不够用，故 TCP 引入窗口缩放的选项(Options类)，作为窗口缩放的比例因子，此值范围在 0 ~ 14，比例因子可将窗口值扩大为原来的 2 ^ n 次方；
- Checksum：占 2 字节16 位，防止传输过程中数据包损坏，若此值校验错误，TCP 会直接丢弃并等待重传；

##### 2-3-3-5、TCP Flags(标志位)

常见标记位：SYN、ACK、FIN、RST、PSH

- RST：即 Reset，重置报文标志，用来强制断开连接；
- FIN： 即 Finish，结束报文标志，表示发送方准备断开连接；
- PSH： 即 Push, 告知对方这些数据包收到后应该马上交给上层的应用，不能缓存；

##### 2-3-3-6、UrgentPointer(紧急指针)

若设置 URG 位，则此域将被检查作为额外指令，告诉 CPU 从数据包的某个位置开始读取数据；

##### 2-3-3-7、TCP Options



<img src="/Image/NetWork/tcp/10.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/12.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/28.png" style="zoom:40%;" align="center"/>

- TSOPT(TimeStamp)：时间戳项：
  - 描述：种类为 8，总长为 10 字节，由 Options 通用格式知，TSOPT 值占 8 个字节，：`kind(1 字节) + length(1 字节) + info(8 个字节)`，其中 info 由 2 部分组成：**timestamp**、**timestamp echo**，各占 4 字节；作用有二：
    - 计算往返时延 RTT(Round-Trip Time)；
    - 防止序列号回绕；
  - 作用A：计算往返时延 RTT(Round-Trip Time)；
    - <img src="/Image/NetWork/tcp/29.png" style="zoom:50%;" align="left" />
    - 问题：若采用首次发包，则 RTT 偏大；若采用二次发包，则RTT偏小，即无法使用发包时间作为计算准确 RTT 的依据；
    - 解决：引入时间戳：比如：A 向 B 站发送报文 s1，B站回复给 A 一个 ACK 报文 s2 ，则：
      - **首先:**  A 向 B站发送时，`timestamp` 中存放 A 主机发送时的内核时刻 `tA-1`；
      - **然后:**  B 站向 A 回复 s2 报文时，`timestamp` 中存放 B站主机时刻 `tB-1`，而 `timestamp echo` 存放从 s1 报文中解析出来的 `tA-1`；
      - **最后:**  A 收到 B站 s2 报文后，假设此时 A 主机内核时刻为 tA-2，则可从 s2 报文中的 `timestamp echo` 选项得到 `tA-1` 值，也即 s2 对应报文最初发送时刻；然后就简单了，直接将 tA-2 和 tA-1相减即可得到准确 RTT 值；
  - 作用B：防止序列号回绕；
    - <img src="/Image/NetWork/tcp/30.png" style="zoom:50%;" align="left" />
    - 问题：正如上文介绍，序列号是有值范围的(0~2^32-1)，若超出范围就会重新由0开始计算，但若某序号报文滞留在网络中，当序列号回绕时，发出与滞留报文序列号相同的报文，此时就会存在两个序号相同的报文，就会产生接收方的消息混乱；
    - 解决：引入时间戳；因每次发包时均将发包机器当前内核时间记录在报文中，则即使2次发包序列号相同，时间戳也不可能相同，如此即可区分数据报，解决回绕问题；
- MSS：允许的从对方接收的最大报文段；
- SACK：选择确认项：
- WSOPT：窗口缩放项：
- UTO：用户超时项：
- TCP-AO：TCP 认证选项：









### 三、连接创建、管理、终止

#### 3-1、三次握手

##### 3-1-1、握手目的

- 交换双方 Squence 序列号 (初始序列号 ISN-Initaial Sequence Number)；
- 交换 TCP 通讯参数；比如 MSS、窗口比例因子、选择性确认、指定校验和算法；
  - 注意：每个初始序列号-ISN 均会标识一个字节 (面向字节流的字节)，服务端与客户端所使用的初始序列号 ISN 不同，故需三次握手分别交换 ISN；

##### 3-1-2、三次原因

- 若为二次握手：两次握手，即服务端只要接收客户端请求回送 SYN/ACK 后即建立连接，并发送相应的数据，此时缺少客户端的再次确认环节(三握第三步)；此时若关闭连接后，收到许久前滞留网络的握手请求，服务端就会再次建立连接，但实际上客户端并不需要数据，如此就会白白浪费服务器资源；总之，前两次握手是必须的，关键在第三步，第三步主要是防止已失效请求报文段突然又传送到服务端而产生连接的误判；
- 若为四次握手：3次是最简、最优的建立 TCP 连接次数，3次以上就会降低建立连接的效率

##### 3-1-3、握手流程与状态变迁

​	握手涉及的5种状态：CLOSED、LISTEN(服务器常驻状)、SYN-SENT、SYN-RECEIVED、ESTABLISHED(握手后)，而理解状态变迁对在复杂网络环境中定位问题很有帮助；

<img src="/Image/NetWork/tcp/21.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/31.png" style="zoom:50%;" align="center"/>

- 首先，双方都处于 ***CLOSED*** 状态，随后服务端开始监听端口，进入 ***<u>LISTEN</u>*** 状态；
- 然后，客户端主动发起连接，发送 SYN报文，并由 **CLOSED** 进入 **SYN-SENT** 状态；
  - Flags SYN 置1，seq设x；
  - “这是我这边的情况，现在我要你的数据，快给我”
- 然后，服务端收到后，回送 SYN/ACK报文 ，并由 <u>***LISTEN***</u> 常驻态进入 <u>***SYN-RECEIVED***</u> 状态；
  - Flags SYN 和 ACK 置1，seq设y，ack设x+1；
  - “好的收到，这是我这边的情况，但你当真要我的数据？”
- 然后，客户端收到 SYN/ACK 后，回送 ACK 报文 ，并由 **SYN-SENT** 进入 **ESTABLISHED**态；
  - Flags ACK 置1，ack设y+1
  - “NNND，别磨磨唧唧的，是的，快给我”
- 最后，服务端收到 ACK 报文，进入 <u>***ESTABLISHED***</u> 状态；
  - 注意：Passive Open 被动打开，Active Open 主动打开；
  - 注意：凡需要对端确认的一定要消耗 TCP 报文序列号，即发送 SYN 需要消耗序列号，而 ACK 不用；
  - 注意：TCB：TransmissionContril Block：保存连接使用的源端口、目的端口、目的IP、序号、应答序号、对/己方窗口大小、TCP状态、TCP输入输出队列、应用层输出队列、TCP重传相关变量等；
  - 注意：图1 中的服务端 TCB 建立在 LISTEN之前，是因为被动监听的句柄也要建立 TCB，其不表达一具体连接，但必须存在才能维护建链过程的相关信息；

##### 3-1-3-1、同时连接(情况罕见)

<img src="/Image/NetWork/tcp/22.png" style="zoom:50%;" align="center"/>

<img src="/Image/NetWork/tcp/32.png" style="zoom:30%;" align="center"/>

- 首先，情况发生在双方同时给对方发送 SYN 报文；
- 然后，双方发送后，双方的状态均由 CLOSED 变为  SYN-SENT；
- 然后，在各自收到对方的 SYN 后，回送对方 SYN/ACK，两者状态均由 SYN-SENT 变为 SYN-REVD；
- 最后，双方接收到对方报文后，状态由 SYN-REVD 变为 ESTABLISHED；
- 注意：相比于常见连接，客户端多出 SYN-RECEIVED 状态，服务端多出 SYN-SENT 状态；



##### 3-1-4、握手报文

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



##### 3-1-5、握手示例

- 通过 tcpdump 监听端口：tcpdump -i lo port 80 -c 3 -S
  - ![](/Image/NetWork/tcp/14.png)
  - 注意：缩写表示：S=SYN，F=FIN，P=PUSH，R=RST，U=URG，W=ECN-CWR，E=ECN-Echo，'.'=ACK，'none'=无任何标志位；
- 通过 netstat 查看连接相关状态：netstat -anp | grep tcp
  - ![](/Image/NetWork/tcp/23.png)
  - 注意：不同平台均可通过 netstat 工具查看相应状态



##### 3-1-6、性能优化

<img src="/Image/NetWork/tcp/24.png" style="zoom:40%;" align="left"/>

描述：三次握手前，服务端状态从`CLOSED`变为`LISTEN`，同时在内部创建2个队列：

- **半连接队列/SYN队列**：当客户端发送`SYN`到服务端，服务端收到后回复 `ACK`和`SYN`，状态由`LISTEN`变为`SYN_RCVD`，此时连接套接字就被推入半连接队列(SYN Queue)；
- **全连接队列/ACCEPT队列**：当客户端返回`ACK`，服务端接收后，三次握手完成；此时连接套接字将被推入另一个 TCP 维护队列，也即全连接队列(Accept Queue)，并等待被具体应用调用 accept 方法取走；

##### 3-1-6-1：优化1：调整超时时间与缓存队列长度

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

##### 3-1-6-2：优化2：TFO

​	描述：快速建立 TCP 连接，TFO-TCP-FastOpen：首次连接服务端多回送 Cookie 供客户端缓存，若后续再次建立连接时，客户端一并传送 Cookie，服务端识别后将 Data 随 SYN/ACK 报文回传；TFO 充分利用一个RTT，省去客户端 ACK 确保报文，降低二次连接时的时延，提前进行数据传输；过程如下：

- 首先，客户端发送 SYN；
- 然后，服务器收到后，通过计算得到 SYN Cookie，并将此值存放到 TCP 的 FastOpen 选项中，回送客户端 SYN/ACK 报文；
- 然后，客户端接收并缓存此 Cookie，回送 ACK 完成三次握手；
- 然后，当客户端想再次建立握手建立连接，则将先前缓存的 Cookie 随 SYN 一并 HTTP GET发送给服务端；
- 然后，服务端校验通过后，即可回送包含数据的 SYN/ACK 报文；

​	实现：开启系统 TFO 功能：`net.ipv4.tcp_fastopen`：关闭-0、作为客户端时可使用 TFO-1、作为服务端时可使用 TFO-2、无论哪端均可使用 TFO-3；

​	注意：服务端为客户端建立 Cookie 的前提是双方均支持 TFO，随后当客户端再次向服务器建立连接时，则复用缓存 cookie，服务端验证通过后才能在首次握手中传递消息；

<img src="/Image/NetWork/tcp/25.png" style="zoom:50%;" />

##### 3-1-6-3：优化3：TCP_DEFER_ACCEPT

​	描述：当服务器收到 ACK 分组后，并将 SYN 放入相应 ACCEPT 队列中，但内核不立即激活相应应用程序，而是等待后续数据到达再激活，以提升效率；



##### 3-1-7、安全问题

##### 3-1-7-1、SYN 攻击 / SYN Flood 攻击

描述：典型的 DoS/DDoS 攻击，攻击者在短时间内，伪造大量不存在的 IP 地址的 SYN 报文 (可按照 TCP 协议格式来构造 SYN 帧，大多数编程语言都支持，在基于socket 编程时设置为 RAW_SOCKET 类似字样，此时相当于在 IP 层之上编程)；

影响：	

- 服务器回送 ACK 但无法收到对方 ACK，使 backlog (SYN)队列被大量处于`SYN_RCVD`状态的连接占满，无法处理正常的请求；
- 服务端长时间收不到客户端`ACK`，导致服务端不断重发数据，耗费服务器资源；

防御：

- 方式1：调整 SYN 队列连接数
  - `net.ipv4.tcp_max_syn_backlog`：SYN_RCVD 状态连接的最大个数；
  - `net.core.netdev_max_backlog`：接收来自网卡，但未被内核协议栈处理的报文队列长度；
  - `net.ipv4.tcp_abort_on_overflow`：超出处理能力时，对新来的 SYN 直接回包 RST，丢弃连接；
- 方式2：减少 SYN + ACK 重试次数，避免大量的超时重发；
- 方式3：tcp_syncookies

![](/Image/NetWork/tcp/26.png)

​	若应用程序过慢则导致 Accept 队列满，若受到 SYN 攻击则导致 SYN 队列满，此时可启用cookie：

```http
net.ipv4.tcp_syncookies = 1
```

​	为连接生成唯一 cookie 并随 SYN/ACK 返回给客户端，客户端在随后的请求中携带 cookie 并由服务器认证并响应；即 SYN 队列满时亦可建立连接；

​	注意：(感觉) syn_cookie 与 TFO 中的 cookie 不同，前者保证当前连接合法性、后者保证再次连接的合法性；



##### 3-1-8、其他问题

##### 3-1-8-1、握手携带数据

​	分情况，若为普通握手连接，则第三次可携带，前两次不可携带，以减少服务器被攻击风险，提升连接效率(三次握手时，客户端已处于 ESTABLISHED 状态，且已确认服务器收发能力，故可携带)；若为开启了 TFO 的握手连接，则二次建立连接时，首次握手可携带一次建立连接服务器下发的 cookie 认证信息，二次握手(服务端响应)则可携带响应相关数据，详见上述 TFO 内容；

##### 3-1-8-2、连接建立超时

​	若连接不存在主机，则会先发生连接建立超时现象，后续客户端会收到“无法到达主机”消息；连接建立超时，若首次发送 SYN 失败，第二次尝试连接时间隔会变长，比如首次发送后，二次发送在 3 秒后，三次发送在6秒后，四次在 12 秒…此行为亦称*指数回退* ；以太网中最大回退数值是上次的2倍，实际回退数值则会随机选取；系统可配置发送初始 SYN 的次数；

- 主动打开申请中尝试重新发送 SYN 的最大次数(默认5次)

```http
net.ipv4.tcp_syn_retries
```

- 主动打开申请中尝试重新发送 SYN/ACK 的最大次数(默认5次)

```http
net.ipv4.tcp_synack_retries
```







#### 3-2、四次挥手

##### 3-2-1、四次原因

因服务端在接收到 FIN 后，往往不会立即返回 FIN，而须等到服务端将所有报文均发送完毕/处理请求完成后，才能发 FIN；此时先发送 ACK 表示已收到客户端的 FIN，等服务端处理完毕后才发 FIN，再加上客户端的 ACK 确认，导致四次挥手；

- 若为三次挥手：等同于服务端将 ACK 和 FIN 发送合二为一，某些情况可以实现，但更多的是其中的长时间延迟可能会导致客户端误以为 FIN 没有到达服务端而不断重发 FIN；

##### 3-2-2、挥手流程与状态变迁

​	挥手涉及的5种状态：CLOSE-WAIT、LAST-ACK、FIN-WAIT1、FIN-WAIT2、CLOSING、TIME-WAIT

<img src="/Image/NetWork/tcp/50.png" style="zoom:50%;" />

<img src="/Image/NetWork/tcp/52.png" style="zoom:50%;" />

- 首先，双方均处于 ***ESTABLISHED*** 状态，然后客户端想关闭连接，发送 FIN 报文，并改为 **FIN-WAIT-1**态；

  - 注意：此时客户端进入 `half-close(半关闭)`状态，只能接收而无法再向服务端发送消息；

- 然后，服务端接收后，回送 ACK，并由 **<u>*ESTABLISHED*</u>** 进入**<u>*CLOSED-WAIT*</u>** 状态；

- 然后，客户端收到服务端确认，并由 **FIN-WAIT-1** 进入 **FIN-WAIT-2** 态；

- 随后，服务器向客户端发送 FIN 报文，并由  **<u>*CLOSED-WAIT*</u>** 进入 **<u>*LAST-ACK*</u>** 态；

- 然后，客户端收到服务端 FIN，由 **FIN-WAIT-2**  进入 **TIME-WAIT** 态，并回送 ACK；

  - 注意：此时客户端可发送报文；

  - 注意：主动关闭连接一方此后会等待 **2MSL(Maximum Lifetime，报文最大生存时间)**，此段期间若无收到服务端的重发请求，则表示 ACK 成功到达，挥手结束，否则客户端重发 ACK;

  - 注意：等待 2MSL 原因：

    - <img src="/Image/NetWork/tcp/54.png" style="zoom:50%;" align="left"/>
    - 保证 TCP 协议全双工连接可靠关闭
      - 若客户端回送 ACK 后直接 CLOSED，此时，若出现网络原因导致 ACK 报文丢失，服务端则会在超时后重发 FIN，此时若客户端在原有端口上已建立别的连接，就会造成信息混乱；
    - 保证至少一次报文往返时间内端口不可复用；
      - 若客户端回送 ACK 后直接 CLOSED，此时，若客户端重新向服务端发起连接，且若使用相同端口(新旧连接)建立连接，此时，若旧连接的数据仍滞留网络中，并在建立新连接后到达，则会误将旧数据包当作新连接，导致数据混淆；(若TIME_WAIT过短或没有，若后续复用端口，则会导致接收方数据错乱，TIME_WAIT 有保护作用，避免延迟到达数据扰乱新连接)

    - 1 个 MSL 确保四次挥手中主动关闭方最后的 ACK 报文最终能达到对端；
    - 1 个 MSL 确保对端没有收到 ACK 重传的 FIN 报文可以到达；

- 注意：并非仅客户端关闭连接，服务端亦可主动关闭连接，比如短连接；如此可快速释放资源，此外当服务端发现请求有误，或处理过程出错，也会发送错误信息后主动关闭；

- 注意：主动发起关闭方会经历 2MSL 时期，此时端口被占用，对要同时处理大量TCP连接的服务器是负担；

- 注意：客户端复用 time_wait 端口风险较服务端小，因为前者概率小且 TCP 四元组作为客户端有 65535 种可能，且自身知道打开了 reuse 功能可控，而后者遇到同IP同端口客户端事件是不可控的，故需做处理；

- 注意：若时机恰好，中间的 FIN 与 ACK 是可以合并发送的；

- 注意：若出现数据包混乱，TCP 会直接发送 RST 重置报文；

  - <img src="/Image/NetWork/tcp/55.png" style="zoom:50%;" />
  - <img src="/Image/NetWork/tcp/56.png" style="zoom:50%;" />

##### 3-2-2-1、同时挥手(情况罕见)

<img src="/Image/NetWork/tcp/51.png" style="zoom:50%;" />

<img src="/Image/NetWork/tcp/53.png" style="zoom:50%;" />

##### 3-2-3、性能优化

​	主动发起关闭方会经历 2MSL 时期，此时端口被占用，若发起方位服务端，还需同时处理大量TCP连接，可通过几个方式优化关闭流程；

##### 3-2-3-1、优化方式1：tcp_tw_reuse

```http
net.ipv4.tcp_tw_reuse = 1
```

- 开启后，作为客户端时，新连接可以使用仍处于 TIME-WAIT 状态的端口；
- 由于 timestamp 存在，操作系统可拒绝迟到报文：`net.ipv4.tcp_timestamps = 1`
  - timestamp 扩展包含两字段：发送时间 & ACK 时间，相减得到 RTT，可通过 RTT 判断是否是延迟报文；

##### 3-2-3-2、优化方式2：tcp_tw_recycle & tcp_max_tw_buckets

```http
net.ipv4.tcp_tw_recycle = 0
```

- 开启后，客户端和服务器均可使用 TIME-WAIT 状态端口；
- 不安全，无法避免报文延迟、重复等，会给新连接造成混乱；

```http
net.ipv4.tcp_max_tw_buckets = 262144
```

- 控制 time_wait 状态连接的最大数量；
- 超出后直接关闭连接；