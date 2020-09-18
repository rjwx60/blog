---
typora-root-url: ../../../BlogImgsBed/Source
---



### 零、问题区

#### 0-1、websocket 区别

与 http 区别，协议层面的连接实现、心跳机制、安全防范等—见下方

#### 0-2、websocket ⽤法

##### 0-2-1、鉴权

websocket 本身没有鉴权机制，只能自己实现：

- socket 连接建立时，检查连接的 HTTP 请求头信息(比如cookies中关于用户的身份信息、登录信息(加密))；
- socket 建立连接之后，客户端必须携带授权内容，如此服务端在接收到消息时，检查连接是否已授权过，及授权是否过期；
- 以上两点，只要答案为否，则服务端主动关闭 socket 连接

websocket 鉴权机制的实现：

- websocket 的增加一个自定义的 channleHandle 在 webscoketChannleHandle 前，每次判断 body 里面的 token 信息；
- 若不合格，则直接用 channel.close(); 关闭连接
- 详看：https://www.cnblogs.com/duanxz/p/5440716.html

##### 0-2-2、房间分配

主要方式是 node 服务端存储和管理房间，而当客户进入房间、留言、退出房间等操作时，服务端鉴权后，根据返回的房间信息，向 房间内所有成员进行 broadcast(广播)；详看下链，极佳；

https://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-si

https://github.com/gw19/join-and-chat-in-multiple-rooms-with-socket-io/blob/master/server/server.js

##### 0-2-3、心跳重连

心跳机制是每隔一段时间向服务器发送一个数据包，告诉服务器自身状况，与此同时确认服务器端是否连接正常(后者正常会回传数据包)

```javascript
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

其他：https://blog.csdn.net/du591310450/article/details/86717727

其他：https://my.oschina.net/714593351/blog/1583592

其他：https://www.imooc.com/article/35114







### 一、发展

#### 		1-1、问题

HTTP 不支持持久连接，下述模式建立的长连接是长连接(伪)，<u>通讯双方需大量交换HTTP header</u>(无状态协议，须头部以鉴别)，信息交换效率低下(但实现简单，无需作架构升级即可使用)；

- 所谓的 keep-alive(1.1)，是指在一次 TCP 连接中完成多个 HTTP 请求，但注意这里的每次请求仍需单独发送header；
- 所谓的 polling，是指客户端不断主动向服务器发送 HTTP 请求查询是否有新数据；

在这种环境下，过去客户端想要及时获取更新一般基于 2 种形式：Ajax 轮询 和 long poll；但是应对 Ajax 轮询需要有较快的处理速度与相应资源，应对 long poll 需要有高并发处理能力，不管如何都会<u>增加服务端的压力</u>；

- 前者，原理简单粗暴，每间隔一定时间就向服务器发送请求，询问是否有最新消息；
- 后者，则在轮询基础上，采取阻塞模型(客户端发起连接后，服务器等待直至有新消息才响应请求，随后客户端再次发起同样连接，循环往复)；<u>服务端无法主动联系客户端</u>；



#### 	1-2、解决

引入 Websocket，WebSocket 是一种基于 TCP 的轻量级网络通信协议，是 HTML5 新出的持久化协议(相对于非持久的 HTTP)，可看作是 HTTP 协议的补充(或拓展补丁)，其旨在实现通讯双方长连接(真)，是解决 HTTP 本身无法解决的问题而做出的一个改良设计；

- 注意：与 HTTP/2 一样，均为解决 HTTP 某些方面的缺陷而诞生；但解决方式略不同，HTTP/2 针对  <u>队头阻塞</u>，WebSocket 针对 <u>请求-应答</u> 的通信模式；
- 注意：请求应答模式，即半双工的通信模式，不具备服务器推送能力；所以限制了 HTTP 在实时通信领域的发展。虽可使用轮询来不停的向服务器发送 HTTP 请求，但缺点巨大，反复的无效请求会占用大量的带宽和 CPU 资源；所以，WebSocket 应运而生；WebSocket 是一个全双工通信协议，具备服务端主动推送的能力；本质上是对 TCP 做了一层包装，让它可运行在浏览器环境中；

Websocket 通过首个 HTTP Request 建立 TCP 连接后(通讯双方须进行协议升级-后文提到)，后续进行数据交换时便不用再发 HTTP header、双方可同时收发信息(双通道)，由被动发送变为主动发送，减轻了服务端的负担，且拥有 multiplexing 功能(不用 URI 复用同一 Websocket 连接)、且能维持连接状态(通讯双方能发送 Ping/Pong Frame 监控中间节点的异常情况的发生)；




### 二、优劣

#### 		2-1、优点

- 支持双向通信，可主动发送，同时收发，实时性更强；
- 可发送文本，也可发送二进制文件；
- 协议标识符是 ws，加密后是 wss ；
- 较少的控制开销；连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有2~10字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的4字节的掩码。而HTTP协议每次通信都需要携带完整的头部；提高信息交换效率、减轻服务端负担等；
- 支持扩展；ws 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）
- 无跨域问题；
- 实现简单，服务端库如 `socket.io`、`ws` ，而客户端也只需要参照 api 实现即可；

#### 		2-2、缺点

​		兼容问题(对旧式等不支持 websocket 的浏览器须作系列兼容处理)、宽带与耗电问题(ping/pong机制-已有相应优化)、可伸缩性较差、操作复杂：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001127.png" style="zoom: 33%;" align=""  />

​	如上图所示：普通连接实现较websocket简单，websocket则较复杂，上述图中的消息分发系统可能是 Kafaka、Redis、RMQ；



### 三、协议格式

​	http 基于流，websocket 基于帧，其中帧格式如下图1所示、其中红色部分2字节8位内容一定存在，但后面内容并非一定存在、其中RSV(1/2/3)为保留位、opcode 用于定义帧类型如图2所示：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001128.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001129.png" style="zoom:40%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001130.png" style="zoom:40%;" />



#### 3-1、传递消息时的编码格式

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

#### 		3-2、ABNF 描述的帧格式

​	较上面一种更为完整和标准：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001134.png" style="zoom:50%;" align=""/>



### 四、实现

#### 		4-1、新建连接

##### 4-1-1、完成握手

会话建立的第一步，即完成 websocket 握手，**<u>而握手本质是由 HTTP1.1 协议升级所得</u>**，握手 URI 格式如下图所示：

- 注意：除子协议、扩展协议、CORS跨域三字段外均为必选项：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001135.png" style="zoom:40%;" align=""/>

##### 4-1-2、建立连接

建立 websocket 连接时候所需消息有如下内容：

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


<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001136.png" style="zoom:50%;" align=""/>

##### 4-1-3、示例

使用 HTTP 建立 websocket 握手示例：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001137.png" style="zoom:50%;" align=""/>

##### 4-1-X、实现

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



#### 		4-2、保持心跳

心跳帧间隔**<u>可通过应用端 websocket 库的 heartbeat 设置</u>**，但除非涉及业务一般不做处理(监听、劫持)，心跳帧含有服务健康检查的功能，心跳帧可双向进行；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001138.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001139.png" style="zoom:50%;" align=""/>



#### 		4-3、关闭连接

websocket 为双向传输协议，关闭时需双向关闭，且因其承载在 TCP 协议之上，故需在 TCP 关闭前，先关闭 websocket 会话，可基于关闭帧关闭(也是双向的)，关闭会话的方式有2种：

- 控制帧中的关闭帧，在 TCP 连接之上的双向关闭；
  - 发送关闭帧后，不能再发送任何数据；
  - 接收到关闭帧后，不再接收任何到达的数据；
- TCP 连接意外中断；

关闭帧格式与错误码及示例

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001140.png" style="zoom:80%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001141.png" style="zoom:80%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001142.png" style="zoom:50%;" align=""/>



### 五、安全

#### 		5-1、代理污染攻击与掩码防御

问题：
- 首先，存在实现不当的代理服务器 (无法识别 websocket 协议)
- 然后，黑客构建恶意服务器与恶意页面，并试图建立与上述服务器的 websocket 连接
- 然后，恶意页面与恶意服务器建立 websocket 连接(实际通过 http1.1长连接实现)，此时恶意页面伪造 GET 请求，此请求改变 host 为被攻击的服务器，恶意服务器伪造被攻击服务器的响应，期间代理服务器缓存了虚假的结果；
- 最后，当正常用户访问被攻击服务器时，则实际返回的是缓存中的内容；
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001143.png" style="zoom:50%;" align="" />

本质：代理服务器问题(无法识别 websocket 协议会将握手请求识别为 HTTP1.1请求，并将当前连接识别为 HTTP1.1长连接)、浏览器问题；

解决：浏览器须对客户端发送内容均做掩码 (frame-masking-key) 处理，使其无法伪造，强制合法；以减少针对代理服务器的缓存处理攻击风险；

- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001144.png" style="zoom:70%;" align=""/>
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001145.png" style="zoom:70%;" align=""/>

总结：虽代理无法识别 websocket 而会建立长连接，但目的是建立长连接后伪造 HTTP GET 请求，伪造请求后恶意服务器伪造响应，迷惑代理服务器并使其缓存结果，从而让用户无法访问正确服务器；

补充：
- 虽可模仿浏览器绕开浏览器自动强制生成掩码这一安全机制实施攻击，但模仿成本高(还需大范围铺开供用户使用)，故攻击成本高，情况罕见；
- 代理缓存污染攻击成本低(只需铺开恶意页面即可)，而之所以加掩码即可防御，是因为 JS 无法获取掩码内容，确保了唯一性；
- 浏览器强制执行加密、自动生成掩码是 websocket 特性；



### 六、其他

6-1、知乎问答：https://www.zhihu.com/topic/19657811/top-answers

6-2、Chrome 源码看实现：https://www.zhihu.com/topic/19657811/top-answers



### 七、转自





