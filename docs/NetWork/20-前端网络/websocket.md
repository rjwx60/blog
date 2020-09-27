# 零、问题区



## 0-1、websocket 区别

与 http 区别，协议层面的连接实现、心跳机制、安全防范等—见下方



## 0-2、websocket ⽤法

### 0-2-1、鉴权

websocket 本身没有鉴权机制，只能自己实现：

- socket 连接建立时，检查连接的 HTTP 请求头信息(比如cookies中关于用户的身份信息、登录信息(加密))；
- socket 建立连接之后，客户端必须携带授权内容，如此服务端在接收到消息时，检查连接是否已授权过，及授权是否过期；
- 以上两点，只要答案为否，则服务端主动关闭 socket 连接

websocket 鉴权机制的实现：

- websocket 的增加一个自定义的 channleHandle 在 webscoketChannleHandle 前，每次判断 body 里面的 token 信息；
- 若不合格，则直接用 channel.close(); 关闭连接
- 详看：https://www.cnblogs.com/duanxz/p/5440716.html

### 0-2-2、房间分配

主要方式是 node 服务端存储和管理房间，而当客户进入房间、留言、退出房间等操作时，服务端鉴权后，根据返回的房间信息，向 房间内所有成员进行 broadcast(广播)；详看下链，极佳；

https://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-si

https://github.com/gw19/join-and-chat-in-multiple-rooms-with-socket-io/blob/master/server/server.js

### 0-2-3、心跳重连

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













# 一、发展

## 		1-1、问题

HTTP 先天不支持持久连接(HTTP2支持—通过数据帧)，虽然可通过下列方式建立长连接，但这些长连接是伪的，因为<u>通讯双方需大量交换HTTP header</u>(无状态协议，须头部以鉴别)，信息交换效率低下，但实现简单，无需作架构升级即可使用：

- keep-alive：HTTP1.1引入，即在一个 TCP 连接中完成多个 HTTP 请求，但每次请求仍需单独发送 Header；
- polling：指客户端不断向服务器发送 HTTP 请求，查询是否有新数据；

此种背景下，若客户端想要及时获取最新信息(即时通讯技术)，一般基于 4 种形式：

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

<u>WebSocket</u>：HTML5 WebSocket 规范定义了一种 API，使 Web 页面能够使用 WebSocket 协议与远程主机进行双向通信；WebSocket 属于应用层协议；其基于 TCP 传输协议，并复用 HTTP 握手通道；但并非基于 HTTP 协议，其只是在建立连接前须借助 HTTP(在首次握手时升级协议为 ws 或 wss)；

- 优点：与轮询和长轮询相比，巨大减少了不必要的网络流量和等待时间；开销小，双向通讯，支持二进制传输；
- 缺点：开发成本高，需要额外做重连保活；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200924231830.png" alt="截屏2020-09-24 下午11.18.20" style="zoom:67%;" />





## 	1-2、解决

引入 Websocket，WebSocket 是一种基于 TCP 的轻量级网络通信协议，是 HTML5 新出的持久化协议(相对于非持久的 HTTP)，可看作是 HTTP 协议的补充(或拓展补丁)，其旨在实现通讯双方长连接(真)，是解决 HTTP 本身无法解决的问题而做出的一个改良设计；

- 注意：与 HTTP/2 一样，均为解决 HTTP 某些方面的缺陷而诞生；但解决方式略不同，HTTP/2 针对  <u>队头阻塞</u>，WebSocket 针对 <u>请求-应答</u> 的通信模式；
- 注意：请求应答模式，即半双工的通信模式，不具备服务器推送能力；所以限制了 HTTP 在实时通信领域的发展。虽可使用轮询来不停的向服务器发送 HTTP 请求，但缺点巨大，反复的无效请求会占用大量的带宽和 CPU 资源；所以，WebSocket 应运而生；WebSocket 是一个全双工通信协议，具备服务端主动推送的能力；本质上是对 TCP 做了一层包装，让它可运行在浏览器环境中；

Websocket 通过首个 HTTP Request 建立 TCP 连接后(通讯双方须进行协议升级-后文提到)，后续进行数据交换时便不用再发 HTTP header、双方可同时收发信息(双通道)，由被动发送变为主动发送，减轻了服务端的负担，且拥有 multiplexing 功能(不用 URI 复用同一 Websocket 连接)、且能维持连接状态(通讯双方能发送 Ping/Pong Frame 监控中间节点的异常情况的发生)；




# 二、优劣

## 		2-1、优点

- 支持双向通信，可主动发送，同时收发，实时性更强；
- 可发送文本，也可发送二进制文件；
- 协议标识符是 ws，加密后是 wss ；
- 较少的控制开销；连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有2~10字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的4字节的掩码。而HTTP协议每次通信都需要携带完整的头部；提高信息交换效率、减轻服务端负担等；
- 支持扩展；ws 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）
- 无跨域问题；
- 实现简单，服务端库如 `socket.io`、`ws` ，而客户端也只需要参照 api 实现即可；

## 		2-2、缺点

​		兼容问题(对旧式等不支持 websocket 的浏览器须作系列兼容处理)、宽带与耗电问题(ping/pong机制-已有相应优化)、可伸缩性较差、操作复杂：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001127.png" style="zoom: 33%;" align=""  />

​	如上图所示：普通连接实现较websocket简单，websocket则较复杂，上述图中的消息分发系统可能是 Kafaka、Redis、RMQ；



# 三、协议格式

​	http 基于流，websocket 基于帧，其中帧格式如下图1所示、其中红色部分2字节8位内容一定存在，但后面内容并非一定存在、其中RSV(1/2/3)为保留位、opcode 用于定义帧类型如图2所示：

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

会话建立的第一步，即完成 websocket 握手，**<u>而握手本质是由 HTTP1.1 协议升级所得</u>**，握手 URI 格式如下图所示：

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
    ```
    
  - Connection 设置 Upgrade，通知服务端，该 request 类型需要进行升级为 websocket；

  - Sec-WebSocket-Key 秘钥的值是通过规范中定义的算法进行计算得出，因此是不安全的，但是可以阻止一些误操作的 websocket 请求；

  - Sec-WebSocket-Protocol 指定有限使用的Websocket协议，可以是一个协议列表(list)。服务端在 response 中返回列表中支持的第一个值；

  - Sec-WebSocket-Version 指定通信时使用的Websocket协议版本。最新版本:13，[历史版本](https://www.iana.org/assignments/websocket/websocket.xml#version-number)

  - Sec-WebSocket-Extensions 客户端向服务端发起请求扩展列表(list)，供服务端选择并在响应中返回；

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

心跳帧间隔**<u>可通过应用端 websocket 库的 heartbeat 设置</u>**，但除非涉及业务一般不做处理(监听、劫持)，心跳帧含有服务健康检查的功能，心跳帧可双向进行；

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



# 五、安全

## 		5-1、代理污染攻击与掩码防御

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





# 六、其他

## 6-1、ngSocketIo

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



## 6-2、socket.io-client

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



## 6-3、engine.io

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

观察服务端 socket 生成可知，engine.io 本质还是由 ws 库实现(即其为 websocket 的又一层封装)，但做了向下兼容处理，如果环境不支持则使用 Polling 方式替代(XHR、JSONP)；(长轮询：客户端发送一次 request，当服务端有消息推送时会 push 一条 response 给客户端；客户端收到 response 后，会再次发送 request，重复上述过程，直到其中一端主动断开连接为止) 







Socket.io 基于 engine.io 这个库，engine.io 使用  Websocket 和 XHR 方式封装了一套 socket 协议； 为其提供跨浏览器/跨设备的双向通信功能；而因低版本浏览器不支持 Websocket，则会使用长轮询(polling)替代兼容；[目录结构](https://github.com/socketio/engine.io/tree/master/lib)

- transports file
- engine.io.js
- server.js
- socket.js
- transports.js





 engine.io 原理、其他即时方案补充、科普文、长连接实现原理、Node Socket实现(自定义)、Chrome实现、Socket与WebSocket、大文件传输、优缺点及使用；









