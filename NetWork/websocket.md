---
typora-root-url: ../Source
---

### 一、问题与解决

#### 		1-1、问题

​		HTTP不支持持久连接。所谓的 keep-alive(1.1) 是指在一次TCP连接中完成多个HTTP请求，但每一请求仍需单独发送header；所谓的 polling 是指客户端不断主动向服务器发送 HTTP 请求查询是否有新数据；上述模式建立的长连接是长连接(伪)，<u>通讯双方需大量交换HTTP header</u>(无状态协议，须头部以鉴别)，信息交换效率低下(但实现简单，无需作架构升级即可使用)；

​		在这种环境下，过去客户端想要及时获取更新一般基于两种形式：Ajax轮询 和 long poll；前者原理简单粗暴，每间隔一定时间就向服务器发送请求，询问是否有最新消息；后者则在轮询基础上，采取阻塞模型(客户端发起连接后，服务器等待直至有新消息才响应请求，随后客户端再次发起同样连接，循环往复)；<u>服务端无法主动联系客户端</u>，应对轮询需要有较快的处理速度与相应资源，应对 long poll 需要有高并发处理能力，不管如何都会<u>增加服务端的压力</u>；

#### 	1-2、解决

​		Websocket，HTML5 新出的持久化协议(相对于非持久的HTTP)，可看作是 HTTP 协议的补充或拓展补丁，旨在实现通讯双方长连接(真)，是解决 HTTP 本身无法解决的问题而做出的一个改良设计。

​		Websocket 通过首个 HTTP Request 建立 TCP 连接后(通讯双方须进行协议升级-后文提到)，后续进行数据交换时便不用再发 HTTP header、双方可同时收发信息(双通道)，由被动发送变为主动发送，减轻了服务端的负担、拥有 multiplexing 功能(不用URI复用同一 Websocket 连接)、维持连接状态(通讯双方能发送 Ping/Pong Frame 监控中间节点的异常情况的发生)；

### 二、优劣

#### 		2-1、优点

​		可主动发送、可同时收发、不必每次发送 header 提高信息交换效率、减轻服务端负担等

#### 		2-2、缺点

​		兼容问题(对旧式等不支持 websocket 的浏览器须作系列兼容处理)、宽带与耗电问题(ping/pong机制-已有相应优化)、可伸缩性较差操作复杂：

<img src="/Image/Basics/Websocket/1.png" style="zoom: 33%;" align="left"  />

​	如上图所示：普通连接实现较websocket简单，websocket则较复杂，上述图中的消息分发系统可能是Kafaka、Redis、RMQ；



### 三、协议格式

​	http 基于流，websocket 基于帧，其中帧格式如下图1所示、其中红色部分2字节8位内容一定存在，但后面内容并非一定存在、其中RSV(1/2/3)为保留位、opcode 用于定义帧类型如图2所示：

<img src="/Image/NetWork/websocket/1.png" style="zoom:50%;" />

<img src="/Image/NetWork/websocket/2.png" style="zoom:40%;" />

<img src="/Image/NetWork/websocket/3.png" style="zoom:40%;" />

#### 3-1、传递消息时的编码格式

3-1-1、消息与帧的区别：

<img src="/Image/NetWork/websocket/8.png" style="zoom:50%;" align="left" />

​	消息由一或多个数据帧组成时的字段区别：

- 示例1：一个消息由一或多个数据帧组成；
  - op为1或2，非持续帧，FIN为0，未结束；
  - op为0，持续帧(持续帧类型取决于前一个帧类型)，FIN为0，未结束；
  - op为A，控制帧，FIN=1，可插入，标志不能再插入其他数据帧；
  - op为0，非控制帧，FIN=1，已结束，程序此后会将上述3个拼装为同1消息；
- 示例2：一个消息由一个数据帧组成；
  - op大于0，FIN=1；

<img src="/Image/NetWork/websocket/9.png" style="zoom:50%;" align="left" />

3-1-3、消息内容长度-Payload len

​	消息内容长度，描述应用消息和扩展数据的总长度，因历史原因，不得大于127字节，且会根据消息内容长度的不同采用不同的格式，若小于125字节，则只使用 payloadLen，其他情况则相应处理，如下图所示：

<img src="/Image/NetWork/websocket/10.png" style="zoom:50%;" align="left"/>

#### 		3-2、ABNF 描述的帧格式

​	较上面一种更为完整和标准：

<img src="/Image/NetWork/websocket/4.png" style="zoom:50%;" align="left"/>

### 四、实现

#### 		4-1、新建连接

​	4-1-1、websocket  会话建立的第一步，即完成 websocket 握手，而其本质是由HTTP1.1协议升级所得，握手URI格式如下图所示，注意：除子协议、扩展协议、CORS跨域三字段外均为必选项：

<img src="/Image/NetWork/websocket/5.png" style="zoom:50%;" align="left"/>

​	4-1-2、建立 websocket 连接时候所需消息有如下内容：

- 首先，客户端利用 HTTP 发送报文，报文含构建 websocket 连接客户所需告知服务端的消息

  - ```http
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
    ```

- 然后，服务端响应，消息响应完成后即可认为 websocket 建立成功；

  - ```http
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
    Sec-WebSocket-Protocol: chat
    ```

- 其中：按等级分如下，一类红色信息；二类绿色信息；三类蓝色信息；四类黑色信息；

  - 红色：须基于HTTP/1.1、须为GET方法、须为Host头部、须为版本13、Connection 须传 Upgrade 表示升级、须传 Upgrade 字段且值为 websocket（HTTP/1.1）
  - 绿色：须传随机数，而服务端须根据此随机数按照一定规则(见下文)生成新的Base64 随机数
  - 蓝色：跨域信息(非必须)
  - 黑色：扩展信息(非必须)

- 其中：服务端根据客户端所给随机数生成新随机数规则 (客户端以返回值判断握手是否为服务端所接受)：

  - 首先，客户端 SWK 与 GUID(标准文档，值固定) 拼接；
  - 然后，SHA1加密；
  - 最后，进行 Base64混淆；

- <img src="/Image/NetWork/websocket/6.png" style="zoom:50%;" align="left"/>

​	4-1-3、使用HTTP建立 websocket 握手示例：

- <img src="/Image/NetWork/websocket/7.png" style="zoom:50%;" align="left"/>



#### 		4-2、保持心跳

​	心跳帧间隔可通过应用端 websocket 库的 heartbeat 设置，除非涉及业务一般不做处理、心跳帧含有服务健康检查的功能、心跳帧可双向进行；

<img src="/Image/NetWork/websocket/11.png" style="zoom:50%;" align="left"/>

<img src="/Image/NetWork/websocket/12.png" style="zoom:50%;" align="left"/>

#### 		4-3、关闭连接

​	4-3-1、websocket 为双向传输协议，关闭时需双向关闭，且因其承载在 TCP 协议之上，故需在 TCP 关闭前，先关闭 websocket 会话，可基于关闭帧关闭(也是双向的)，关闭会话的方式有2种：

- 控制帧中的关闭帧，在 TCP 连接之上的双向关闭；
  - 发送关闭帧后，不能再发送任何数据；
  - 接收到关闭帧后，不再接收任何到达的数据；
- TCP 连接意外中断；

4-3-2、关闭帧格式与错误码及示例

<img src="/Image/NetWork/websocket/13.png" style="zoom:80%;" align="left"/>

<img src="/Image/NetWork/websocket/14.png" style="zoom:80%;" align="left"/>

<img src="/Image/NetWork/websocket/15.png" style="zoom:50%;" align="left"/>

### 五、安全

#### 		5-1、代理污染攻击与掩码防御

- 问题：
  - 首先，存在实现不当的代理服务器 (无法识别websocket协议)
  - 然后，黑客构建恶意服务器与恶意页面，并试图建立与上述服务器的  websocket 连接
  - 然后，恶意页面与恶意服务器建立 websocket 连接(实际通过http1.1长连接实现)，此时恶意页面伪造GET请求，此请求改变 host 为被攻击的服务器，恶意服务器伪造被攻击服务器的响应，期间代理服务器缓存了虚假的结果；
  - 最后，当正常用户访问被攻击服务器时，则实际返回的是缓存中的内容；
  - <img src="/Image/NetWork/websocket/16.png" style="zoom:50%;" align="left" />
- 本质：代理服务器问题(无法识别 websocket协议会将握手请求识别为 HTTP1.1请求，并将当前连接识别为HTTP1.1长连接)、浏览器问题；
- 解决：浏览器须对客户端发送内容均做掩码 (frame-masking-key) 处理，使其无法伪造，强制合法；以减少针对代理服务器的缓存处理攻击风险；
- <img src="/Image/NetWork/websocket/17.png" style="zoom:70%;" align="left"/>
- <img src="/Image/NetWork/websocket/18.png" style="zoom:70%;" align="left"/>
- 总结：虽代理无法识别 websocket 而会建立长连接，但目的是建立长连接后伪造 HTTP GET 请求，伪造请求后恶意服务器伪造响应，迷惑代理服务器并使其缓存结果，从而让用户无法访问正确服务器；
- 补充：
  - 虽可模仿浏览器绕开浏览器自动强制生成掩码这一安全机制实施攻击，但模仿成本高(还需大范围铺开供用户使用)，故攻击成本高，情况罕见；
  - 代理缓存污染攻击成本低(只需铺开恶意页面即可)，而之所以加掩码即可防御，是因为 JS 无法获取掩码内容，确保了唯一性；
  - 浏览器强制执行加密、自动生成掩码是 websocket 特性；

### 六、其他

6-1、知乎问答：https://www.zhihu.com/topic/19657811/top-answers

6-2、Chrome 源码看实现：https://www.zhihu.com/topic/19657811/top-answers

### 七、转自





