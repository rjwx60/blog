# 一、发展

## 		1-1、问题

传统 HTTP 先天不支持持久连接(HTTP2支持—通过数据帧)，而 HTTP1并发能力是依赖同时发起多个 TCP 连接访问服务器实现(但并发数受限于浏览器允许的最大并发连接数)，且还有 TCP 慢启动特性(新连接速度提升需要时间)，及连接本身握手损耗等问题；

虽可通过下列方式建立长连接，但这些长连接是伪的，因为<u>通讯双方需携带几百上千字节的大量重复 header(甚至数据部分还没有头部部分大)</u>(无状态协议，须头部以鉴别)，信息交换效率低下，但实现简单，无需作架构升级即可使用：

- keep-alive：HTTP1.1引入，即在一个 TCP 连接中完成多个 HTTP 请求，但每次请求仍需单独发送 Header；
- polling：指客户端不断向服务器发送 HTTP 请求，查询是否有新数据；

此种背景下，若客户端想要及时获取最新信息(即时通讯技术)，一般基于 4(+2)种形式：

<u>轮询-polling</u>：客户端和服务器间会一直进行连接，每隔一段时间就询问一次；前端通常采取setInterval 或 setTimeout 去不断的请求服务器数据；

- 优点：实现简单，适合处理的异步查询业务；
- 缺点：轮询时间通常固定，过长不实时过短增加服务端负担；而请求大部分无意义，浪费服务端资源；且要求服务端有较快处理速度与相应资源；

<u>长轮询-long polling</u>：即轮询+阻塞模型；客户端发送请求到服务端，若服务端没有新的数据，就保持住这个连接直到有数据。一旦服务端有了数据(消息)给客户端，它就使用这个连接发送数据给客户端；接着连接关闭；随后客户端再次发起同样连接，循环往复；

- 优点：对比轮询做了优化，有较好的时效性；
- 缺点：占较多的内存资源与请求数；<u>服务端仍无法主动联系客户端，且需要有高并发处理能力</u>；

<u>iframe流</u>：即在浏览器中动态载入一个 iframe，并让其地址指向请求的服务器地址(即向服务器发送了一个http请求)，然后在浏览器端创建一个处理数据的函数，在服务端通过 iframe 与浏览器的长连接定时输出数据给客户端，iframe 页面接收到此数据就会将其解析成代码并传给父页面从而实现即时通讯目的；

- 优点：对比轮询做了优化，有较好的时效性；
- 缺点：兼容性与用户体验不好。服务器维护一个长连接会增加开销。一些浏览器的的地址栏图标会一直转菊花。

<u>Server-sent Events(SSE)</u>：与长轮询机制类似，区别是每个连接不只发送一个消息；客户端发送一个请求，服务端保持这个连接直到有新消息发送回客户端，仍然保持着连接，如此连接就可以实现消息的再次发送，由服务器单向发送给客户端；

- 优点：HTML5 标准；实现较为简单；一个连接可以发送多个数据；
- 缺点：兼容性不好(IE，Edge不支持)；服务器只能单向推送数据到客户端；

<u>WebSocket</u>：HTML5 WebSocket 规范定义了一种 API，使 Web 页面能够使用 WebSocket 协议与远程主机进行双向通信；其属于应用层协议；基于 TCP 传输协议，并复用 HTTP 握手通道；但并非基于 HTTP 协议，其只是在建立连接前须借助 HTTP(在首次握手时升级协议为 ws 或 wss)；其允许在一条 ws 连接上同时并发多个请求，即在 A 请求发出后 A 响应还未到达，就可继续发出 B 请求；

- 优点：与轮询和长轮询相比，巨大减少了不必要的网络流量和等待时间；开销小，双向通讯，支持二进制传输；
- 缺点：开发成本高，需要额外做重连保活；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200924231830.png" alt="截屏2020-09-24 下午11.18.20" style="zoom:67%;" />

<u>基于 UDP 的 WebRTC</u>：暂无；

<u>MQTT</u>：为了物联网场景设计的基于TCP的 Pub/Sub 协议，有许多为物联网优化的特性，比如适应不同网络的QoS、层级主题、遗言等等；而WebSocket是为了HTML5应用方便与服务器双向通讯而设计的协议，HTTP握手然后转TCP协议，用于取代之前的Server Push、Comet、长轮询等老旧实现；







## 	1-2、解决

为彻底解决 server 主动向 client 发送数据问题，W3C 在 HTML5 中提供了一种 client 与 server 间进行全双工通讯的网络技术 WebSocket；其是一个全新的、独立的协议，基于 TCP 协议，是 HTML5 新出的持久化协议(相对于非持久协议 HTTP)，与 HTTP 协议兼容却不会融入 HTTP 协议，仅仅作为 HTML5 的一部分；WebSocket 是一种协议，是一种与 HTTP 同等的网络协议，两者都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关；

- 注意：与 HTTP/2 一样，均为解决 HTTP 某些方面的缺陷而诞生；但解决方式略不同，HTTP/2 针对  <u>队头阻塞</u>，WebSocket 针对 <u>请求-应答</u> 的通信模式；
- 注意：HTTP 请求应答模式，即半双工的通信模式，不具备服务器推送能力；故限制了 HTTP 在实时通信领域的发展；
- HTTP的生命周期通过 Request 来界定，即 One Request One Response；
  - HTTP1.0 中，完成上述 One 即结束；
  - HTTP1.1中，进行改进：Keep-alive，使得一次 HTTP 连接中，可发送多个Request，接收多个 Response；但终究还是 Request = Response——One Request One Response；且此 response 也是被动，不能主动发起；WebSocket 由此应运而生；
  - WebSocket 是一个全双工通信协议，具备服务端主动推送的能力；本质上是对 TCP 做的一层包装，让它可运行在浏览器环境中；
  - Websocket 基于 HTTP 协议，但更准确地说是借用 HTTP 协议来完成一部分握手；

<u>Websocket 通过首个 HTTP Request 建立 TCP 连接后(通讯双方须进行协议升级-后文提到)，后续进行数据交换时便不用再发 HTTP header、双方可同时收发信息(双通道)，由被动发送变为主动发送，减轻了服务端的负担，且拥有 multiplexing 功能(不用 URI 复用同一 Websocket 连接)、且能维持连接状态(通讯双方能发送 Ping/Pong Frame 监控中间节点的异常情况的发生)；</u>




# 二、优劣

## 		2-1、优点

可概括为与 HTTP 区别：

- 支持双向通信，双方均可主动发送，同时收发，实时性更强；
- 可发送文本(HTTP1)，也可发送二进制文件(HTTP2)；
- 协议标识符是 ws，加密后是 wss ；支持扩展；ws 协议定义了扩展，用户可扩展协议，或实现自定义的子协议(比如支持自定义压缩算法等)；
- 较少的控制开销；连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小；提高信息交换效率、减轻服务端负担；
  - 不包含头部情况下，服务端到用户包头只有 2~10 字节，相反则需要加上额外 4字节掩码；而 HTTP 每次通信都需携带完整头部；
- 无跨域问题；实现简单，服务端库如 `socket.io`、`ws` ，而客户端也只需要参照 api 实现即可；
- Websocket 只需一次HTTP握手，整个通讯过程是建立在一次连接/状态中，避免了HTTP的非状态性；



## 		2-2、缺点

兼容问题(对旧式等不支持 websocket 的浏览器须作系列兼容处理)、宽带与耗电问题(ping/pong机制-已有相应优化)、可伸缩性较差、操作复杂：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001127.png" style="zoom: 33%;" align=""  />

如上图所示：普通连接实现较websocket简单，websocket则较复杂，上述图中的消息分发系统可能是 Kafaka、Redis、RMQ；

缺点：对开发者要求高。对前端开发者，往往要具备数据驱动使用 JS 能力，且需要维持住 ws 连接(否则消息无法推送)；对后端开发者而言，难度增大了很多，一是长连接需要后端处理业务的代码更稳定(不要随便把进程和框架都 crash 掉)，二是推送消息相对复杂一些，三是成熟的 http 生态下有大量的组件可以复用，websocket 则太新了一点;





# 三、协议格式

http 基于流，websocket 基于帧，其中帧格式如下图1所示、其中红色部分2字节8位内容一定存在，但后面内容并非一定存在、其中RSV(1/2/3)为保留位、opcode 用于定义帧类型如图2所示：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001128.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001129.png" style="zoom:40%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001130.png" style="zoom:40%;" />





## 3-1、传递消息时的编码格式

3-1-1、消息与帧的区别：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001131.png" style="zoom:50%;" align="" />

​	消息由一或多个数据帧组成时的字段区别：

- 示例1：一个消息由一或多个数据帧组成；
  - op为1或2，非持续帧，FIN为0，未结束；
  - op为0，持续帧(持续帧类型取决于前一个帧类型)，FIN为0，未结束；
  - op为A，控制帧，FIN=1，可插入，标志不能再插入其他数据帧；
  - op为0，非控制帧，FIN=1，已结束，程序此后会将上述3个拼装为同1消息；
- 示例2：一个消息由一个数据帧组成；
  - op大于0，FIN=1；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001132.png" style="zoom:50%;" align="" />

3-1-3、消息内容长度-Payload len

​	消息内容长度，描述应用消息和扩展数据的总长度，因历史原因，不得大于127字节，且会根据消息内容长度的不同采用不同的格式，若小于125字节，则只使用 payloadLen，其他情况则相应处理，如下图所示：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001133.png" style="zoom:50%;" align=""/>

## 		3-2、ABNF 描述的帧格式

​	较上面一种更为完整和标准：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001134.png" style="zoom:50%;" align=""/>



# 四、实现

## 		4-1、新建连接

### 4-1-1、完成握手

会话建立第一步：完成 websocket 握手，**<u>而握手本质是由借由 HTTP1.1 实现(传送含有特定字段的报文请求升级)</u>**，握手 URI 格式如下图所示：

- 注意：除子协议、扩展协议、CORS跨域三字段外均为必选项：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001135.png" style="zoom:40%;" align=""/>



### 4-1-2、建立连接

建立 websocket 连接时候所需消息有如下内容 [upgrade_mechanism 规范](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)：

- 首先，客户端利用 HTTP 发送报文，报文含构建 websocket 连接客户所需告知服务端的消息

  - ```http
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13
    // ...
    ```
    
  - <u>**Connection 设置 Upgrade，告知服务端，该 request 类型需要进行升级为 websocket；**</u>

  - **<u>Sec-WebSocket-Key：通过规范中定义算法计算得出，用以验证对方 websocket 服务真伪(不安全，但可阻止websocket 请求误操作)；</u>**

  - Sec-WebSocket-Protocol：指定有限使用的 Websocket协议，可以是一个协议列表(list)；服务端在 response 中返回列表中支持的第一个值；

  - Sec-WebSocket-Version：指定通信时使用的Websocket协议版本。最新版本:13，[历史版本](https://www.iana.org/assignments/websocket/websocket.xml#version-number)

  - Sec-WebSocket-Extensions 客户端向服务端发起请求扩展列表(list)，供服务端选择并在响应中返回；

- 然后，服务端响应，消息响应完成后，即可认为 websocket 建立成功；

  - ```http
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
    Sec-WebSocket-Protocol: chat
    // ...
    ```
    
  - Sec-WebSocket-Accept：经过服务器确认，并且加密过后的 Sec-WebSocket-Key，用以证明服务器自身身份；

- 其中：按等级分如下，一类红色信息；二类绿色信息；三类蓝色信息；四类黑色信息；

  - 红色：须基于HTTP/1.1、须为GET方法、须为Host头部、须为版本13、Connection 须传 Upgrade 表示升级、须传 Upgrade 字段且值为 websocket（HTTP/1.1）
  - 绿色：须传随机数，而服务端须根据此随机数按照一定规则(见下文)生成新的Base64 随机数
  - 蓝色：跨域信息(非必须)
  - 黑色：扩展信息(非必须)

- 其中：服务端根据客户端所给随机数生成新随机数规则 (客户端以返回值判断握手是否为服务端所接受)：

  - 首先，客户端 SWK 与 GUID(标准文档，值固定) 拼接；
  - 然后，SHA1加密；
  - 最后，进行 Base64混淆；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001136.png" style="zoom:50%;" align=""/>

### 4-1-3、示例

使用 HTTP 建立 websocket 握手示例：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001137.png" style="zoom:50%;" align=""/>

### 4-1-X、实现

```js
// 客户端
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = function () {
  ws.send("123");
  console.log("open");
};
ws.onmessage = function () {
  console.log("onmessage");
};
ws.onerror = function () {
  console.log("onerror");
};
ws.onclose = function () {
  console.log("onclose");
};

// 客户端心跳检测
this.heartTimer = setInterval(() => {
  if (this.heartbeatLoss < MAXLOSSTIMES) {
    events.emit("network", "sendHeart");
    this.heartbeatLoss += 1;
    this.phoneLoss += 1;
  } else {
    events.emit("network", "offline");
    this.stop();
  }
  if (this.phoneLoss > MAXLOSSTIMES) {
    this.PhoneLive = false;
    events.emit("network", "phoneDisconnect");
  }
}, 5000);


// 服务端
const express = require("express");
const { Server } = require("ws");
const app = express();
const wsServer = new Server({ port: 8080 });
wsServer.on("connection", (ws) => {
  ws.onopen = function () {
    console.log("open");
  };
  ws.onmessage = function (data) {
    console.log(data);
    ws.send("234");
    console.log("onmessage" + data);
  };
  ws.onerror = function () {
    console.log("onerror");
  };
  ws.onclose = function () {
    console.log("onclose");
  };
});

app.listen(8000, (err) => {
  if (!err) {
    console.log("监听OK");
  } else {
    console.log("监听失败");
  }
});

// 自定义通讯协议
const {Socket} = require('net') 
const tcp = new Socket()
// 保持底层 tcp 链接不断，长连接
tcp.setKeepAlive(true);
tcp.setNoDelay(true);
// 指定对应域名端口号链接
tcp.connect(80,166.166.0.0)

// 建立连接后根据后端传送的数据类型 使用对应不同的解析
// readUInt8 readUInt16LE readUInt32LE readIntLE 等处理后得到 myBuf 
// 从对应的指针开始的位置截取 buffer
const myBuf = buffer.slice(start);
// 截取对应的头部 buffer
const header = myBuf.slice(headstart,headend)
// 精确截取数据体的 buffer, 并且转化成 js 对象
const body = JSON.parse(myBuf.slice(headend-headstart,bodylength).tostring())

// https://segmentfault.com/a/1190000019891825
```



## 		4-2、保持心跳

心跳帧间隔**<u>可通过应用端 websocket 库的 heartbeat 设置</u>**

但除非涉及业务一般不做处理(监听、劫持)，心跳帧含有服务健康检查的功能，心跳帧可双向进行；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001138.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001139.png" style="zoom:50%;" align=""/>



## 		4-3、关闭连接

websocket 为双向传输协议，关闭时需双向关闭，且因其承载在 TCP 协议之上，故需在 TCP 关闭前，先关闭 websocket 会话，可基于关闭帧关闭(也是双向的)，关闭会话的方式有2种：

- 控制帧中的关闭帧，在 TCP 连接之上的双向关闭；
  - 发送关闭帧后，不能再发送任何数据；
  - 接收到关闭帧后，不再接收任何到达的数据；
- TCP 连接意外中断；

关闭帧格式与错误码及示例

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001140.png" style="zoom:80%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001141.png" style="zoom:80%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001142.png" style="zoom:50%;" align=""/>



## 4-4、实现

编写 websocket 服务，需要克服2个难点：

- 熟练掌握 Websocket 的协议；
- 操作二进制数据流(Node 的 Buffer)；

以及了解2个基本点：

- 网络编程中使用大端次序—Big endian表示大于一字节的数据，称之为网络字节序；
- 最高有效位—MSB(MostSignificantBit)；

而实现过程中，最核心的部分是解析或生成 Frame(帧)；

![截屏2020-10-02 下午3.31.59](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002153203.png)

[过程伪码实现](https://www.zhihu.com/question/37647173/answer/1403359896)、[前文行文比较散乱，这个比较好](https://zhuanlan.zhihu.com/p/37350346)：

- 1、构造响应头 resHeaders 部分：获取升级请求头：sec-websocket-key，服务段接收并计算值；
- 2、通过 socket 接口监听事件(数据与关闭)，并存储接收的 Buffer 数据通过 BufferAPI 连接；
- 3、通过专门函数，处理解析最小通讯单位帧数据，其中包含大量的位操作符以及 Buffer 类操作；
  - 注意：每个帧含有操作码，表明当前帧身份为数据帧或控制帧(看上图，Payload 才是数据载体)；根据操作码的不同进行不同处理；或转为 utf8 编码，或二进制则直接交付，发送 pong 响应；
- 4、数据分片，对于大数据，wb 支持数据分片；分片利于发送方发送时不必等待长度的统计(服务端可通过缓冲队列控制分片)、也利于多路复用，提高网络利用效率；分片数据的拼接可参考 FIN 控制帧相关规则；WebSocket 是一个 message-based 协议，可自动将数据分片，且自动将分片的数据组装；

Node 提供了 EventEmitter 类自带事件循环，http 模块让你直接使用封装好的 socket 对象，所以只需按照 Websocket 协议实现 Frame 解析和组装即可；

- Websocket 是一种应用层协议，是为了提供 Web 应用程序和服务端全双工通信而专门制定；
- WebSocket 和 HTTP 都是基于 TCP 协议实现；
- WebSocket 和 HTTP 唯一关联是 HTTP 客户端需发送 "Upgrade" 请求，即 101 Switching Protocol 到 HTTP 服务端，然后由其进行协议转换；
- WebSocket 使用 HTTP 来建立连接，但定义一系列新的 header 域，这些域在 HTTP 中并不会使用；
- WebSocket 能和 HTTP Server 共享同一 port；
- WebSocket 的 数据帧有序；





# 五、安全

## 		5-1、代理污染攻击与掩码防御

- 首先，存在实现不当的代理服务器 (无法识别 websocket 协议)
- 然后，黑客构建恶意服务器与恶意页面，并试图建立与上述服务器的 websocket 连接
- 然后，恶意页面与恶意服务器建立 websocket 连接(实际通过 http1.1长连接实现)，此时恶意页面伪造 GET 请求，此请求改变 host 为被攻击的服务器，恶意服务器伪造被攻击服务器的响应，期间代理服务器缓存了虚假的结果；
- 最后，当正常用户访问被攻击服务器时，则实际返回的是缓存中的内容；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001143.png" style="zoom:50%;" align="" />

本质：代理服务器问题(无法识别 websocket 协议会将握手请求识别为 HTTP1.1请求，并将当前连接识别为 HTTP1.1长连接)、浏览器问题；

解决：浏览器须对客户端发送内容均做掩码 (frame-masking-key) 处理，使其无法伪造，强制合法；以减少针对代理服务器的缓存处理攻击风险；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001144.png" style="zoom:70%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001145.png" style="zoom:70%;" align=""/>

总结：虽代理无法识别 websocket 而会建立长连接，但目的是建立长连接后伪造 HTTP GET 请求，伪造请求后恶意服务器伪造响应，迷惑代理服务器并使其缓存结果，从而让用户无法访问正确服务器；

补充：
- 虽可模仿浏览器绕开浏览器自动强制生成掩码这一安全机制实施攻击，但模仿成本高(还需大范围铺开供用户使用)，故攻击成本高，情况罕见；
- 代理缓存污染攻击成本低(只需铺开恶意页面即可)，而之所以加掩码即可防御，是因为 JS 无法获取掩码内容，确保了唯一性；
- 浏览器强制执行加密、自动生成掩码是 websocket 特性；









# 六、使用

## 6-1、基本封装

涉及基础搭建、消息收发(ID控制执行回调)；

涉及鉴权机制(须自实现—比如通过验证 token)：

- socket 连接建立时，检查连接的 HTTP 请求头信息(比如cookies中关于用户的身份信息、登录信息(加密))；
- socket 建立连接后，客户端必须携带授权内容，如此服务端在接收到消息时，检查连接是否已授权过，及授权是否过期；
- 以上两点，只要答案为否，则服务端主动关闭 socket 连接

涉及房间分配：主要通过 Node 服务端存储和管理房间，用户进退房间时，服务端鉴权后，根据返回房间信息(ID)，向房间内所有成员进行 broadcast：

[详看文章1](https://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-si)、[详看文章2](https://github.com/gw19/join-and-chat-in-multiple-rooms-with-socket-io/blob/master/server/server.js)

```js
import io from 'socket.io-client';
import EventEmitter from 'EventEmitter';
class Ws extends EventEmitter {
    constructor (options) {
        super();
        //...
        this.init();
    }
    init () {
        const socket  = this.link = io('wss://x.x.x.x');
        socket.on('connect', this.onConnect.bind(this));
        socket.on('message', this.onMessage.bind(this));
        socket.on('disconnect', this.onDisconnect.bind.(this);
        socket.on('someEvent', this.onSomeEvent.bind(this));
    }
    onMessage(packet) {
        const data = this.parseData(packet);
        // ...
        this.$emit('message', data);
    }
  
  	// 发送消息
  	// 需要使用唯一标识来处理消息回调
  	seq = 0;
    cmdTasksMap = {};
    // ...
    sendCmd(cmd, params) {
        return new Promise((resolve, reject) => {
            this.cmdTasksMap[this.seq] = {
                resolve,
                reject
            };
            const data = genPacket(cmd, params, this.seq++);
            this.link.send({ data });
        });
    }
		// 接收消息
    onMessage(packet) {
      	const data = parsePacket(packet);
        if (data.seq) {
            const cmdTask = this.cmdTasksMap[data.seq];
            if (cmdTask) {
                if (data.body.code === 200) {
                    cmdTask.resolve(data.body);
                } else {
                    cmdTask.reject(data.body);
                }
                delete this.cmdTasksMap[data.seq];
            }
        }
    }
}
```







## 6-2、实际优化

- 连接保持：超时处理、心跳包(检查长链接存活的关键)、重连退避机制；
  - 心跳包：在客户端和服务器间定时通知对方自身状态的自定义的命令字端，按一定时间间隔发送，类似于心跳；
  - 应用中加入心跳检测可检测是否正常可响应，TCP KeepAlive 只是连接保活，无法完全确保无异常(服务器死锁仍可收到)
  - 通常使用空内容的心跳包，并设定合适发送频率与超时时间来作为连接保持的判断；

```js
// 超时处理
class Ws extends EventEmitter {
    // ...
    sendCmd(cmd, params) {
        return new Promise((resolve, reject) => {
            this.cmdTasksMap[this.seq] = {
                resolve,
                reject
            };
            // 加个定时器
            this.timeMap[this.seq] = setTimeout(() => {
                const err = new newTimeoutError(this.seq);
                reject({ ...err });
            }, CMDTIMEOUT);

            const data = genPacket(cmd, params, this.seq++);
            this.link.send({ data });
        });
    }
    onMessage(packet) {
        const data = parsePacket(packet);
        if (data.seq) {
            const cmdTask = this.cmdTasksMap[data.seq];
            if (cmdTask) {
                clearTimeout(this.timeMap[this.seq]);
                delete this.timeMap[this.seq];
                if (data.body.code === 200) {
                    cmdTask.resolve(data.body);
                } else {
                    cmdTask.reject(data.body);
                }
                delete this.cmdTasksMap[data.seq];
            }
        }
    }
}
```

```js
// 心跳重连
// 若服务端只认心跳包作为连接存在判断，那就在连接建立后定时发心跳就行
// 若以收到包为判断存活，那就在每次收到消息重置并起个定时器发送心跳包
class Ws extends EventEmitter {
    // ...
     onMessage(packet) {
        const data = parsePacket(packet);
        if (data.seq) {
            const cmdTask = this.cmdTasksMap[data.seq];
            if (cmdTask) {
                clearTimeout(this.timeMap[this.seq]);
                if (data.body.code === 200) {
                    cmdTask.resolve(data.body);
                } else {
                    cmdTask.reject(data.body);
                }
                delete this.cmdTasksMap[data.seq];
            }
        }
        this.startHeartBeat();
    }
    startHeartBeat() {
        if (this.heartBeatTimer) {
            clearTimeout(this.heartBeatTimer);
            this.heartBeatTimer = null;
        }
        this.heartBeatTimer = setTimeout(() => {
            // 在 sendCmd 中指定 heartbeat 类型 seq 为 0，让业务包连续编号
            this.sendCmd('heartbeat').then(() => {
                // 发送成功了就不管
            }).catch((e) => {
                this.heartBeatError(e);
            });
        }, HEARTBEATINTERVAL);
    }
}
```

- 流量优化：持久化存储；
  - 使用 H5 的大容量存储方案：indexedDB，配合使用成熟的  [Dexie.js](https://link.zhihu.com/?target=https%3A//github.com/dfahlander/Dexie.js)，[db.js](https://link.zhihu.com/?target=https%3A//github.com/aaronpowell/db.js) 二次封装库；
  - 并用时间戳进行增量同步，优先从存储获取；
  - 消息的通知则通过缓存队列维护保证入库时序(顺序)；
- 流量优化：减少连接数；
  - WebWorker 线程可执行任务而不干扰用户界面；且可将消息发送到创建它 JS 代码, 通过将消息发布到该代码指定的事件处理程序(反之亦然)；
  - WebWorker 能够使用：WebSocket、XHR，等通讯 API，能操作本地存储；
  - 遂可通过 SharedWorker API 创建一个执行指定脚本来共享 web worker 来实现多个 tab 间的通讯复用，来达到减少连接数目的；



## 6-3、一般示例

**<u>*心跳检测重连*</u>**

```js
let ws, tt;
// 避免重复连接
let lockReconnect = false;
let wsUrl = "wss://echo.websocket.org";

function createWebSocket() {
  try {
    ws = new WebSocket(wsUrl);
    init();
  } catch(e) {
    // console.log('失败重连');
    reconnect(wsUrl);
  }
}

// 事件初始化
function init() {
  ws.onclose = function () {
    // console.log('连接关闭');
    reconnect(wsUrl);
  };
  ws.onerror = function() {
    // console.log('发生异常了');
    reconnect(wsUrl);
  };
  ws.onopen = function () {
    // 心跳检测重置
    heartCheck.start();
  };
  ws.onmessage = function (event) {
    // console.log('接收到消息');
    heartCheck.start();
  }
}
function reconnect(url) {
  if(lockReconnect) return;
  // 避免瞬时多次触发重连
  lockReconnect = true;
  // 没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
    // 间隔 4s 尝试重连
  }, 4000);
}

// 心跳检测 - 实现1
var heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function(){
    // console.log('start');
    var self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function(){
      // 发送心跳，后端收到后，返回一个心跳消息，
      ws.send("123456789");
      self.serverTimeoutObj = setTimeout(function() {
        // console.log(ws);
        ws.close();
        // createWebSocket();
      }, self.timeout);

    }, this.timeout)
  }
}
createWebSocket(wsUrl);
// 详看:
// https://blog.csdn.net/Toleranty/article/details/80911093


// 心跳检测 - 实现2
var heartCheck = {
    timeout: 60000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
　　　　 this.start();
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            ws.send("HeartBeat");
            self.serverTimeoutObj = setTimeout(function(){
                ws.close();
              	// 若直接执行 reconnect 会触发 onclose 导致重连2次
            }, self.timeout)
        }, this.timeout)
    },
}

ws.onopen = function () {
   heartCheck.start();
};
ws.onmessage = function (event) {
    heartCheck.reset();
}
ws.onclose = function () {
    reconnect();
};
ws.onerror = function () {
    reconnect();
};
// 详看: 
// https://www.cnblogs.com/rsapaper/p/12585070.html
```





# X、其他

## X-1、ngSocketIo

[ng-socket-io](https://github.com/bougarfaoui/ng-socket-io)  是 socket.io-client 的 angular 版本，其内部只是对 socket.io-client 的 [angular 化](https://github.com/bougarfaoui/ng-socket-io/blob/master/socket-io.service.ts) 封装(并利用 Observable 封装了一个 socket.on 事件—更友好地使用 angular 化的 socket)；关键：`this.ioSocket = io(url, options);`

```js
import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share'; 

import * as io from 'socket.io-client';

import { SocketIoConfig } from './socketIoConfig';
import { SOCKET_CONFIG_TOKEN } from './socket-io.module';

export class WrappedSocket {
    subscribersCounter = 0;
    ioSocket: any;

    constructor(@Inject(SOCKET_CONFIG_TOKEN) config: SocketIoConfig) {
        const url: string = config.url || '';
        const options: any = config.options || {};
      	// 关键对象
        this.ioSocket = io(url, options);
    }

    on(eventName: string, callback: Function) {
        this.ioSocket.on(eventName, callback);
    }

    once(eventName: string, callback: Function) {
        this.ioSocket.once(eventName, callback);
    }

    connect() {
        return this.ioSocket.connect();
    }

    disconnect(close?: any) {
        return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
    }

    emit(eventName: string, data?: any, callback?: Function) {
        return this.ioSocket.emit.apply(this.ioSocket, arguments);
    }

    removeListener(eventName: string, callback?: Function) {
        return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
    }

    removeAllListeners(eventName?: string) {
        return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
    }

    /** create an Observable from an event */
    fromEvent<T>(eventName: string): Observable<T> {
        this.subscribersCounter++;
        return Observable.create( (observer: any) => {
             this.ioSocket.on(eventName, (data: T) => {
                 observer.next(data);
             });
             return () => {
                 if (this.subscribersCounter === 1)
                    this.ioSocket.removeListener(eventName);
            };
        }).share();
    }
   
    /* Creates a Promise for a one-time event */
    fromEventOnce<T>(eventName: string): Promise<T> {
        return new Promise<T>(resolve => this.once(eventName, resolve));
    }
}
```



## X-2、socket.io-client

[socketClient 文档](https://socket.io/docs/client-api/)、[socketClientGithub](https://github.com/socketio/socket.io-client)

socket 核心对象 io 由 Manager 类负责创建；

```js
// https://github.com/socketio/socket.io-client/blob/master/lib/index.js
var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}
```

Manager 类负责连接的核心操作通过 [engine.io-client](https://github.com/socketio/engine.io-client) 实现，而事件发布特性则由 Emitter = require('component-emitter'); 实现

```js
// https://github.com/socketio/socket.io-client/blob/master/lib/manager.js
var eio = require('engine.io-client');
var Socket = require('./socket');
var Emitter = require('component-emitter');

// ...

module.exports = Manager;

function Manager (uri, opts) {
  // 单例
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};
  opts.path = opts.path || '/socket.io';
	// 一些初始化配置
}

// ... 

Manager.prototype.open = Manager.prototype.connect = function (fn, opts) {
  // 单例
  if (~this.readyState.indexOf('open')) return this;
  // 核心
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;

    // set timer
    var timer = setTimeout(function () {
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};
```



## X-3、engine.io

先不说它基本内容，先从这个库的示例文件出发，观察知：

- 通过 const io = require('engine.io').attach(server); 构建 socket 服务端并开始监听； 
- 通过 const socket = new eio.Socket(); 建立客户端并开始监听； 

```js
// 1、engine.io 示例工程 socket Server
// 通过 const io = require('engine.io').attach(server); 构建服务器
const app = express();
const express = require('express');
const enchilada = require('enchilada');
const server = require('http').createServer(app);

const io = require('engine.io').attach(server);

app.use(enchilada({
  src: __dirname + '/public',
  debug: true
}));
app.use(express.static(__dirname + '/public'));

// 静态服务路由
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/engine.io.min.js', (req, res) => {
  res.sendFile(require.resolve('engine.io-client/dist/engine.io.min.js'));
});

io.on('connection', (socket) => {
  socket.on('message', () => {
    socket.send('pong');
  });
});

const port = process.env.PORT || 3000;

// 监听
server.listen(port, () => {
  console.log('\x1B[96mlistening on localhost:' + port + ' \x1B[39m');
});
```

```js
// 2、engine.io 示例工程 socket Client
// 切换路由，获取 engine.io-client/dist/engine.io.min.js 并建立客户端: const socket = new eio.Socket(); 开始监听
function $ (id) { return document.getElementById(id); }

let smoothie;
let time;

function render () {
  // ...
}

// socket
const socket = new eio.Socket();

let last;
function send () {
  last = new Date();
  socket.send('ping');
  $('transport').innerHTML = socket.transport.name;
}
socket.on('open', () => {
  if ($('chart').getContext) {
    render();
    window.onresize = render;
  }
  send();
});
socket.on('close', () => {
  if (smoothie) smoothie.stop();
  $('transport').innerHTML = '(disconnected)';
});
socket.on('message', () => {
  const latency = new Date() - last;
  $('latency').innerHTML = latency + 'ms';
  if (time) time.append(+new Date(), latency);
  setTimeout(send, 100);
});
```

- 通过 const io = require('engine.io').attach(server); 构建 socket 服务端并开始监听； 
- 通过 const socket = new eio.Socket(); 建立客户端并开始监听； 

```js
// 观察 socket Server 构建
const server = require('http').createServer(app);
const io = require('engine.io').attach(server); 
// ...
server.listen(port, () => {})


// engine.io.js
const http = require("http");
const Server = require("./server");
// ...
function listen(port, options, fn) {
  if ("function" === typeof options) {
    fn = options;
    options = {};
  }
  const server = http.createServer(function(req, res) {
    res.writeHead(501);
    res.end("Not Implemented");
  });
  // create engine server
  const engine = exports.attach(server, options);
  engine.httpServer = server;
  server.listen(port, fn);
  return engine;
}

function attach(server, options) {
  const engine = new Server(options);
  engine.attach(server, options);
  return engine;
}
// ...
// 发现知调用了 Server 实例的 attach 方法, 若有传入 httpServer 则利用，否则通过 listen 调用时自构造 httpServer



// server.js
// ...
  attach(server, options) {
    const self = this;
    options = options || {};
    let path = (options.path || "/engine.io").replace(/\/$/, "");

    const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
    // normalize path
    path += "/";
    function check(req) {
      return path === req.url.substr(0, path.length);
    }

    // cache and clean up listeners
    const listeners = server.listeners("request").slice(0);
    server.removeAllListeners("request");
    server.on("close", self.close.bind(self));
    server.on("listening", self.init.bind(self));

    // add request handler
    // 注意到若没有后续的 if 与普通的 httpServer 无太大区别，监听 request，然后通知
    server.on("request", function(req, res) {
      if (check(req)) {
        debug('intercepting request for path "%s"', path);
        self.handleRequest(req, res);
      } else {
        let i = 0;
        const l = listeners.length;
        for (; i < l; i++) {
          listeners[i].call(server, req, res);
        }
      }
    });

    // 若模式是 websocket 
    if (~self.opts.transports.indexOf("websocket")) {
      // 监听 upgrade 事件,并通过 handleUpgrade 进行 socket 协议升级
      server.on("upgrade", function(req, socket, head) {
        if (check(req)) {
          self.handleUpgrade(req, socket, head);
        } else if (false !== options.destroyUpgrade) {
          // default node behavior is to disconnect when no handlers
          // but by adding a handler, we prevent that
          // and if no eio thing handles the upgrade
          // then the socket needs to die!
          setTimeout(function() {
            if (socket.writable && socket.bytesWritten <= 0) {
              return socket.end();
            }
          }, destroyUpgradeTimeout);
        }
      });
    }
  }
}
// 先是进行某些认证，然后 Buffer 处理协议升级所需请求头，最后通过 self.ws.handleUpgrade(req, socket, head, function(conn) 升级
handleUpgrade(req, socket, upgradeHead) {
  this.prepare(req);

  const self = this;
  this.verify(req, true, function(err, success) {
    if (!success) {
      abortConnection(socket, err);
      return;
    }
    const head = Buffer.from(upgradeHead); // eslint-disable-line node/no-deprecated-api
    upgradeHead = null;

    // delegate to ws
    self.ws.handleUpgrade(req, socket, head, function(conn) {
      self.onWebSocket(req, conn);
    });
  });
}
// self.ws.handleUpgrade 即 this.ws.handleUpgrade, 而 this.ws 由 this.ws = new wsModule.Server({ 创建
init() {
  if (!~this.opts.transports.indexOf("websocket")) return;

  if (this.ws) this.ws.close();

  // add explicit require for bundlers like webpack
  const wsModule = this.opts.wsEngine === "ws" ? require("ws") : require(this.opts.wsEngine);
  this.ws = new wsModule.Server({
    noServer: true,
    clientTracking: false,
    perMessageDeflate: this.opts.perMessageDeflate,
    maxPayload: this.opts.maxHttpBufferSize
  });
}
// 溯源成功，由 ws 库实现…
// 溯源成功，由 ws 库实现…
// 溯源成功，由 ws 库实现…
```

观察可知，Socket.io 基于 engine.io 库，而其本质还是由 ws 库实现，即为 websocket 的又一层封装，但做了向下兼容处理，若环境不支持，则使用 Polling 方式替代(XHR、JSONP)；(Polling—长轮询：客户端发送一次 request，当服务端有消息推送时会 push 一条 response 给客户端；客户端收到 response 后，会再次发送 request，重复上述过程，直到其中一端主动断开连接为止)；以实现跨浏览器/跨设备的双向通信功能；



## X-4、Socket

网络应用中，两应用同时需要向对方发送消息的能力，所利用到的技术就是 socket，其能够提供端对端的通信；对于程序员而言，其需要在 A 端创建一个 socket 实例，并为这个实例提供其所要连接的 B 端的 IP 地址和端口号，而在 B 端创建另一个 socket 实例，并且绑定本地端口号来进行监听。当 A 和 B 建立连接后，双方就建立了一个端对端的 TCP 连接，从而可以进行双向通信；

WebSocekt 是 HTML5 规范中的一部分，其借鉴 socket 思想，为 client 和 server 间提供了类似的双向通信机制；同时，WebSocket 又是一种新的应用层协议，包含一套标准的 API；而 socket 并不是一个协议，而是一组接口，其主要方便大家直接使用更底层的协议(比如 TCP 或 UDP)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002151932.png" alt="截屏2020-10-02 下午3.19.23" style="zoom:67%;" />











