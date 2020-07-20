---
typora-root-url: ../Source
---



### 一、历史



### 二、HTTP协议

#### 2-1、协议特点

##### 2-1-1、优点/特点

- 无状态(优缺同体)：状态指通信过程的上下文信息；无状态指每次请求均为独立无关联，默认不保留状态信息；具体场景具体分析；
  - 比如若仅为获取某些数据的场景下，而无需保存连接的上下文信息，此时的无状态能有效减少网络开销；
- 灵活可扩展
  - 语义自由：只规定基本格式(分隔符、换行分隔等)，而其他部分无严格语法限制；
  - 形式多样：传输形式多样，可传输文本、图片、视频等任意数据；
- 可靠传输：HTTP 基于 TCP/IP；
- 请求-应答模式：报文须一发一收、有来有回；

##### 2-1-2、缺点/不足

- 无状态(优缺同体)：状态指通信过程的上下文信息；无状态指每次请求均为独立无关联，默认不保留状态信息；具体场景具体分析；
  - 比如在需要长连接的场景中，需要保存大量的、上下文信息，以免传输大量重复信息，此时优点就成了缺点；
- 明文传输：即报文传输(头部)使用文本形式而非二进制形式，虽便于调试但暴露了内部信息；
  - 比如连接公共 WIFI 热点可能会被攻击者截获敏感信息；
- 队头阻塞：当 http 开启长连接时将共用一个 TCP 连接，同一时刻只能处理一个请求，此时若某请求耗时过长，则会导致其它请求处于阻塞状态；

##### 2-1-3、缺点应对

- 无状态：详看：WebSocket
- 明文传输：HTTPS，详看：三：HTTPS
- 队头阻塞：HTTP 传输基于`请求-应答` 模式，报文须一发一收，而其中任务放在任务队列中串行执行，一旦队首请求处理太慢，就会阻塞后续请求的处理：
  - 并发连接：一个域名允许分配多个长连接，相当于增加任务队列数量；
    - 注意：RFC2616 规定过客户端最多并发 2 个连接，而实际中的浏览器上限要比它大，比如 Chrome 中是 6；
  - 域名分片：通过增加域名以实现增加发送数量；
    - 比如：content1.sanyuan.com 、content2.sanyuan.com
  - HTTP/2 的多路复用：上述 HTTP/1.1 方式并无真正从协议层面解决问题，只是增加 TCP 连接分摊风险，且多条 TCP 连接也会竞争有限的带宽，让真正优先级高的请求不能优先处理；而 HTTP/2 的多路复用真正从协议层面解决此问题，详看 4-1-2；



#### 2-2、报文格式

与TCP 的`tcp头部 + 数据部分`类似，即`http头部(header) + 数据部分(body)`，还可进一步分拆为 `header(起始行 + 头部 + 空行) + body(实体)`，其中头部又可分为请求头部和响应头部；

##### 2-2-1、起始行

请求报文起始行由：`方法 + 路径 + http版本` 组成，比如：`GET /home HTTP/1.1`

响应报文起始行由：`http版本 + 状态码 + 原因` 组成，比如：`HTTP/1.1 200 OK`

- 注意：响应报文的起始行也叫做状态行；

- 注意：起始行中每2个部分间用**空格**隔开，最后一部分后还应接**换行**，遵循 [ABNF规范](https://en.wikipedia.org/wiki/Augmented_Backus–Naur_form)

##### 2-2-2、头部

下图分别为请求头部与响应头部，其中各个字段须遵循以下格式：

- 字段名不区分大小写、不允许出现空格，不可出现下划线 `_`
- 字段名后面必须紧跟冒号 `:` 不得空隙；

<img src="/Image/NetWork/http/1.png" style="zoom:35%;" align="left" />

<img src="/Image/NetWork/http/2.png" style="zoom:35%;" align="left" />

##### 2-2-3、空行

用以区分头部与实体，若将空行位置上移，则往后内容均被视为实体部分；

##### 2-2-4、实体

即数据部分；



#### 2-3、报文字段

##### 2-3-1、Request Method

Http1.1 规定的以下请求方法(大写)：

- GET：通常用来获取资源；
- HEAD：获取资源的元信息；
- POST：提交数据，即上传数据；
- PUT：修改数据；
- DELETE：删除资源；
- CONNECT：建立连接隧道，用于代理服务器；
- OPTIONS：列出可对资源实行的请求方法，用来跨域请求；
- TRACE：追踪请求-响应的传输路径；

##### 2-3-2、Status Code

RFC 规定 HTTP 的状态码为三位数，被分为五类:

- 1XX：表示目前是协议处理的中间状态，还需后续操作；
  - 100 Continue：继续，客户端应继续其请求；
  - 101 Switching Protocols：切换协议；服务器根据客户端的请求切换协议，但注意只能切换到更高级的协议；
    - 比如：切换到 HTTP 的新版本协议；
    - 比如：当 HTTP 升级为 WebSocket 时，若服务器同意变更，也会回送此码；
- 2XX：表示成功状态；
  - 200 OK：成功状态码；响应体有数据；一般用于GET与POST请求；
  - 201 Created：已创建；成功请求服务端并创建了新的资源；
  - 202 Accepted：已接受；服务端已接受请求但未处理完成；
  - 203 Non-Authoritative Information：非授权信息；请求成功，但返回的 meta 信息不在原始服务器，而是一个副本；
  - 204 No Content：含义与 200 类似，服务器成功处理，但未返回内容(响应体无数据)；
    - 比如：在未更新网页的情况下，可确保浏览器继续显示当前文档；
  - 205 Reset Content：重置内容；表示服务器处理成功，此时用户终端应重置文档视图；
    - 比如：可通过此返回码清除浏览器的表单域；
  - 206 Partial Content：表示部分内容，服务器成功处理了部分GET请求；
    - 比如：使用场景为 HTTP 分块下载和断点续传，当然也会带上相应的响应头字段 Content-Range；
- 3XX：表示重定向状态，资源位置发生变动，需重新请求；
  - 300 Multiple Choices：多种选择，请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表以供用户选择；
  - 301 Moved Permanently：永久重定向，请求的资源已被永久移动到新 URI，返回信息会包括新 URI，浏览器会自动定向到新 URI，且浏览器会作缓存优化，后续访问时自动访问缓存后的新 URI；
  - 302 Found：临时重定向，与301类似，但资源只是临时被移动，客户端应继续使用原有URI，浏览器不作缓存优化；
  - 303 See Other：查看其它地址。与301类似。使用GET和POST请求查看
  - 304 Not Modified：未修改，所请求的资源未修改，服务器返回此状态码时，不会返回任何资源；当协商缓存命中时返回的状态码；
  - 305 Use Proxy：使用代理，所请求的资源必须通过代理访问；
  - 306 Unused：已经被废弃的HTTP状态码；
  - 307 Temporary Redirect：临时重定向，与302类似，使用GET请求重定向；

- 4XX：表示请求报文有误；
  - 400 Bad Request：客户端请求的语法错误，服务器无法理解；
  - 401 Unauthorized：请求要求用户的身份认证；
  - 402 Payment Required：保留码，将来使用；
  - 403 Forbidden：服务器理解请求客户端的请求，但是拒绝执行此请求(原因有很多，比如法律禁止、信息敏感、数据保护等)；
  - 404 Not Found：服务器无法根据客户端的请求找到资源；
  - 405 Method Not Allowed：客户端请求中的方法被禁止；
  - 406 Not Acceptable：服务器无法根据客户端请求的内容特性完成请求；
  - 407 Proxy Authentication Required：请求要求代理的身份认证，与 401 类似，但请求者应当使用代理进行授权；
  - 408 Request Timeout：服务器等待客户端发送的请求时间过长，超时；
  - 409 Conflict：服务器处理请求时发生了冲突；
    - 比如：服务器完成客户端的 PUT 请求；
  - 410 Gone：客户端请求的资源已不存在；
    - 注意：410 不同于 404：若资源过去存在，但现在被永久删除可使用 410 代码，亦可通过 301 码指定资源新位置；
  - 411 Length Required：服务器无法处理客户端发送的不带Content-Length的请求信息
  - 412 Precondition Failed：客户端请求信息的先决条件错误
  - 413 Request Entity Too Large：请求体过大，服务器无法处理，因此拒绝请求；
    - 注意：为防止客户端的连续请求，服务器可能会关闭连接。若只是服务器暂时无法处理，则会返回包含 Retry-After 的响应信息；
  - 414 Request-URI Too Long：请求行的 URI 过长，服务器无法处理；
  - 415 Unsupported Media Type：服务器无法处理请求附带的媒体格式；
  - 416 Requested range not satisfiable：客户端请求的范围无效；
  - 417 Expectation Failed：服务器无法满足 Expect 的请求头信息；
  - 429 Too Many Request：客户端发送请求过多；
  - 431 Request Header Fields Too Large：请求头的字段内容太大；

- 5XX：表示服务器端发生错误；
  - 500 Internal Server Error：服务器内部错误，且无提示具体错误原因，无法完成请求；
  - 501 Not Implemented：表示服务器不支持请求的功能，无法完成请求
  - 502 Bad Gateway：表示充当网关或代理的服务器，从远端服务器接收到了一个无效的请求；
  - 503 Service Unavailable：表示服务器当前正忙(由于超载或系统维护)，服务器暂时的无法处理客户端的请求；
  - 504 Gateway Time-out：充当网关或代理的服务器，未及时从远端服务器获取请求；
  - 505 HTTP Version not supported：服务器不支持请求的 HTTP 协议版本，无法完成处理；

<img src="/Image/NetWork/http/3.png" style="zoom:50%;" align="left"/>

<img src="/Image/NetWork/http/4.png" style="zoom:50%;" align="left"/>



##### 2-3-3、Accept-### & Content-###

此类字段用于双方确定对方可接收的 **<u>数据格式、压缩方式、支持语言和所使用的字符集</u>**：

<img src="/Image/NetWork/http/6.png" style="zoom:60%;" align="left"/>

<u>*注意：下述内容中，将接收端想象为客户端，将发送端想象为服务端会较好理解；*</u>

- 数据类型：标记数据类型
  - 接收端通过 Accept 字段表示想接收到的数据类型；
  - 发送端通过 Content-type 表示发送数据的类型；
    - text： text/html, text/plain, text/css 等；
    - image: image/gif, image/jpeg, image/png 等；
    - audio/video: audio/mpeg, video/mp4 等；
    - application: application/json, application/javascript, application/pdf, application/octet-stream；
    - 注意：上述取值参考于 **标准 MIME(Multipurpose Internet Mail Extensions, 多用途互联网邮件扩展)**；
- 压缩方式：标记对数据编码压缩的方式
  - 接收端通过 Accept-Encoding 表示可接受的压缩方式；
  - 发送端通过 Content-Encoding 表示对数据采取了何种压缩方式；
    - gzip: 当今最流行的压缩格式；
    - deflate：另外一种著名的压缩格式；
    - br：一种专门为 HTTP 发明的压缩算法；
- 支持语言：标记本机环境所支持的语言
  - 接收端通过 Accept-Language 表示可支持的语言；
  - 发送端通过 Content-Language 表示可支持的语言；
- 字符集：标记可接受的字符集
  - 接收端通过 Accept-Charset 表示可支持的字符集；
  - 发送端通过 Content-Type 表示可支持的字符集；

<img src="/Image/NetWork/http/7.png" style="zoom:40%;" align="left"/>



##### 2-3-4、Cookie

HTTP 是一个无状态的协议，每次请求均为独立、无关，默认不需要保留状态信息，为保存状态，HTTP 引入了 Cookie 字段；**<u>其本质是浏览器中内部以键值对形式存储的、很小的一个文本文件</u>**，浏览器向同一域名下发送请求，都会自动携带相同的 Cookie，服务器拿到 Cookie 进行解析，就能拿到客户端状态；服务端可通过设置响应头的 `Set-Cookie` 字段来为客户端写入`Cookie`，缺点有下：

```http
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx
```

- 容量缺陷：Cookie 体积上限只有 `4KB`；
- 性能缺陷：Cookie 紧跟域名，同域所有地址均自动携带发送完整 Cookie，随着请求数的增多，造成性能损耗，可通过 `Domain` 和 `Path` 指定 **作用域** 解决；
- 安全缺陷：Cookie 以纯文本形式在网络中传递，易被非法用户截获和篡改(尤其在有效期内发送)；此外在 `HttpOnly: false` 情况下，Cookie 能直接通过 JS 脚本来读取；



##### 2-3-4-1、Cookie 生存周期与作用域

Cookie 的有效期可通过 **Expires** 和 **Max-Age** 两个属性来设置，若 Cookie 过期，则 Cookie 会被删除，并不会发送给服务端：

- **Expires**：即过期时间；
- **Max-Age**：即时间间隔，单位秒，从浏览器收到报文开始计算；

Cookie 的作用域可通过 **Domain **和 **path** 两个属性来设置，若给 Cookie 绑定域名和路径后，在发送请求前，发现域名或路径与属性不匹配，则不会带上 Cookie；注意：若 Path 设置 `Path: /`：表示域名下任意路径均允许 Cookie；



##### 2-3-4-2、Cookie 安全

- 若 Cookie 字段带上 `Secure`，表示只能通过 HTTPS 传输 cookie；
- 若 Cookie 字段带上`HttpOnly`，表示只能通过 HTTP 协议传输，不能通过 JS 访问，**<u>此乃预防 XSS 攻击的重要手段</u>**；



##### 2-3-5、SameSite

`SameSite `属性用于防御 CSRF 攻击，可设置 3 个值，`Strict`、`Lax`和`None`：

- None 模式：默认模式，请求会自动携带 Cookie；

- Strict 模式：浏览器完全禁止三方请求携带Cookie；
  - 比如：请求 `bilili.com` ，则只能在 `bilili.com ` 域名下的请求才能携带 Cookie，其他网站请求均不能；

- Lax 模式：宽松模式，但只能在 `get 方法提交表单` 或 `a 标签发送 get 请求` 的情况下才可携带 Cookie，其他情况均不能；



##### 2-3-6、Content-Length

用于标识报文长度(body 部分)，**<u>发送定长包体</u>**，此属性对于 http 传输过程起十分关键的作用，若设置不当可直接导致传输失败；

- 若设置值 < 实际报文长度会根据设置值截断；
- 若设置值 > 实际报文长度则会报错："该网页无法正常运作"；

```javascript
res.setHeader('Content-Type', 'text/plain');
// ContentLength = "helloworld".length 输出正常
res.setHeader('Content-Length', 10);
res.write("helloworld");
// helloworld

// ContentLength < "helloworld".length 输出被截断
res.setHeader('Content-Length', 5);
res.write("helloworld");
// hello

// ContentLength > "helloworld".length 报错
res.setHeader('Content-Length', 11);
res.write("helloworld");
// error
```



##### 2-3-7、Transfer-Encoding: chunked

用于表示分块传输数据，**<u>发送不定长包体</u>**，设置此字段后会自动产生 2 个效果:

- Content-Length 字段会被忽略；
- 基于长连接持续推送动态内容；

```javascript
const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  if(req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf8');
    // Content-Length 会被忽略
    res.setHeader('Content-Length', 10);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write("<p>来啦</p>");
    setTimeout(() => {
      res.write("第一次传输<br/>");
    }, 1000);
    setTimeout(() => {
      res.write("第二次传输");
      res.end()
    }, 2000);
  }
})
server.listen(8009, () => { console.log("成功启动");})
```

<img src="/Image/NetWork/http/14.png" style="zoom:50%;" align="left"/>

```
chunk长度(16进制的数)
第一个chunk的内容
chunk长度(16进制的数)
第二个chunk的内容
......
0

```



##### 2-3-8、Content-Type

HTTP 有 2 种主要的表单提交方式，体现在 2 种不同的`Content-Type`取值：

- application/x-www-form-urlencoded
- multipart/form-data

因表单提交一般是 `POST`请求，很少考虑`GET`，故此处默认提交的数据放在请求体中；

##### 2-3-8-1、application/x-www-form-urlencoded

对于 `application/x-www-form-urlencoded` 格式的表单内容，有以下特点:

- 数据会被编码成以`&`分隔的键值对；
- 字母原样，但字符以 <u>URL编码方式</u> 编码；

```
// 转换过程: 
{a: 1, b: 2} -> a=1&b=2 -> "a%3D1%26b%3D2"
```

##### 2-3-8-2、multipart/form-data

`multipart/form-data` 格式最大特点在于：**每个表单元素均为独立的资源表述**；实际场景中，对于图片等文件的上传，基本采用 `multipart/form-data` 字段而非 `application/x-www-form-urlencoded`，原因是没必要做 URL 编码；

- 请求头中的 `Content-Type` 字段会包含 `boundary(分隔符)`，此值值由浏览器默认指定；
  - 比如： `Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe`；
  - 注意：`boundary` 是切实存在的，但浏览器和 HTTP 封装了这一系列操作；
- 数据会被拆分成多个部分、部分之间通过分隔符分隔、每部分的表述均有 HTTP 头部描述子包体，比如 `Content-Type`，在最后的分隔符会加上`--`表示结束；
  - 比如：相应的请求体是下面这样:

```http
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```



##### 2-3-9、Range

对于大文件上传，为避免影响用户体验，HTTP 提供 <u>范围请求</u> 方式，允许客户端仅请求资源的某部分(前提是服务端支持 <u>范围请求</u>，可从服务端的响应报文获悉)，

```http
// 服务端告知客户端自身支持范围请求
Accept-Ranges: none
```

具体请求哪部分，客户端可通过 Range 请求字段确定，格式为 `bytes=x-y`，书写格式如下：

- **0-499**：表示从开始到第 499 个字节；
- **500**- ：表示从第 500 字节到文件终点；
- **-100**：表示文件的最后100个字节；

当服务器收到请求后，首先会验证范围 **是否合法**，若越界则返回 `416` 错误码，否则读取相应片段，返回 `206` 状态码；同时，服务器还会在响应报文头部添加  `Content-Range` 字段，此字段的格式根据请求头中 `Range` 字段的不同而不同；具体来说，请求 `单段数据` 和请求 `多段数据`，响应头是不一样的：

##### 2-3-9-1、Range—单段数据

```javascript
// 单段数据
Range: bytes=0-9
// 响应报文:
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

hello world

```

其中 Content-Range 字段，0-9 表示请求的返回，100 表示资源的总大小；

##### 2-3-9-2、Range—多段数据

```javascript
// 多段数据
Range: bytes=0-9, 30-39
// 响应报文:
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--

```

其中 `Content-Type: multipart/byteranges;boundary=00000010101`，表示：

- 请求一定是多段数据请求
- 响应体中的分隔符是 00000010101

因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上`--`表示结束；



##### 2-3-10、代理相关字段

代理服务器有诸多作用：

- **负载均衡**：客户端请求只会先到达代理服务器，随后通过特定算法(随机算法、轮询、一致性hash、LRU)分发给不同源服务器，让各源服务器负载尽量均衡；
- **保障安全**：利用心跳机制监控后台服务器，一旦发现故障机就移出服务器集群，并对其上下行数据进行过滤，对非法 IP 限流等；
- **缓存代理**：将内容缓存到代理服务器，使客户端可直接从代理获取资源而不用去源服务器；

##### 2-3-10-1、Via

代理服务器需表明自身身份，在 HTTP 传输中留下痕迹，可通过字段 Via 实现记录，其值为在 HTTP 传输中报文传达的顺序：

```javascript
// 客户端 -> 代理1 -> 代理2 -> 源服务器
// 源服务器收到请求后，在请求头部拿到:
Via: proxy_server1, proxy_server2

// 客户端收到响应后，在响应头部拿到:
Via: proxy_server2, proxy_server1
```

##### 2-3-10-2、X-Forwarded-For

记录 <u>请求方(包括代理)</u> IP 地址的字段，表示为谁转发；

- 此外：还有 `X-Forwarded-Host` 和 `X-Forwarded-Proto`，分别记录 `域名` 和 `协议名` (注意：此刻又不包括代理)；
- 问题：`X-Forwarded-For` 的值会随着代理的变更而变更，即代理必须解析 HTTP 请求头，然后才可进行修改，比直接转发数据效率低；且在 HTTPS 通信加密的过程中，原始报文是不允许修改的；
- 解决：通过 <u>代理协议</u> 解决：在HTTP 请求行上面加上以下格式文本：

```http
// PROXY + TCP4/TCP6 + 请求方地址 + 接收方地址 + 请求端口 + 接收端口
PROXY TCP4 0.0.0.1 0.0.0.2 1111 2222
GET / HTTP/1.1
...
```

##### 2-3-10-3、X-Real-IP

记录最初客户端的 IP 的字段，而不管经过多少代理；



##### 2-3-11、缓存相关字段

强缓存与协商缓存请看浏览器一章，总结如下：

- 首先，通过 `Cache-Control` 验证强缓存是否可用
  - 若强缓存可用，直接使用，不发送请求；
  - 否则进入协商缓存，发送 HTTP 请求，服务器通过请求头中的 `If-Modified-Since` 或 `If-None-Match` 的这些 <u>条件请求字段</u> 检查资源是否更新
    - 若资源更新，则返回资源和 200 状态码
    - 否则返回 304 状态码，告诉浏览器应直接从缓存获取资源；

代理缓存：即专门负责提供资源缓存服务的代理服务器，分管源服务器的 HTTP 缓存，减少源服务器压力(尤其是流量巨大时段)，客户端缓存过期后可 <u>就近</u> 到代理缓存中获取，而代理缓存过期时则请求源服务器，缓存代理的控制分为 2 部分：<u>源服务器端的控制</u>，<u>客户端的控制</u>：

- **<u>源服务器的缓存控制</u>**

##### 2-3-11-1、private 和 public

源服务器通过在响应中加上 `Cache-Control` 字段来进行缓存控制，其值通常为：

- `public`：允许代理服务器缓存；
- `private`：禁止代理服务器缓存；
  - 注意：此举能防范极私密数据，缓存到代理服务器，从而被恶意用户访问获取；

##### 2-3-11-2、proxy-revalidate

- `must-revalidate`：指示**客户端**缓存过期就去源服务器获取；

- `proxy-revalidate`：指示**代理服务器**缓存过期后到源服务器获取；

##### 2-3-11-3、s-maxage

限定缓存在 <u>代理服务器</u> 中可存放多长时间，`s` 即 `share`，与限制客户端缓存时间的 `max-age` 并不冲突

```javascript
// 源服务器在响应头
Cache-Control: public, max-age=1000, s-maxage=2000
// 表示此响应允许代理服务器缓存，客户端缓存过期则到代理中拿，且在客户端的缓存时间为 1000 s，在代理服务器中的缓存时间为 2000 s;
```



- **<u>客户端的缓存控制</u>**

##### 2-3-11-4、max-stale 和 min-fresh

客户端的请求头中，可加入这 2 个字段，来对代理服务器上的缓存进行 <u>宽容</u> 和 <u>限制</u> 操作：

```
max-stale: 10
// 表示客户端从代理服务器上拿缓存时，即使代理缓存过期也不要紧，只要过期时间在 10 秒之内，就可从代理中获取
min-fresh: 5
// 表示代理缓存需要一定新鲜度，不要等到缓存刚好到期再拿，一定要在到期前 5 秒前的时间拿，否则拿不到
```



##### 2-3-11-5、only-if-cached

表明客户端只接受代理缓存，而不接受源服务器响应；若代理缓存无效，则直接返回 `504（Gateway Timeout）`





#### 2-x、其他补充

##### 2-x-1、URI—统一资源标识符

**<u>*URI(Uniform Resource Identifie)*</u>** 包含 URL 与 URN 两部分，其作用是区分互联网上不同的资源；其只能使用 ASCII 编码，不支持显示 ASCII 以外字符，为顺利表示其他字符，URI 引入一套编码机制：将所有 **<u>非 ASCII 码字符和界定符</u>** 转为十六进制字节值，然后在前面加个 `%`；比如空格被转义成了 `%20`；URI 结构如下：
<img src="/Image/NetWork/http/5.png" style="zoom:40%;" align="center"/>

- **scheme**：协议名；诸如 `http`、 `https`、 `file` 等，须跟 `://` 连用；
- **user:passwd@**：表示登录主机时的用户信息，不安全，不推荐使用，不常用；
- **host:port**：主机名:端口；
- **path**：请求路径，标记资源所在位置；
- **query**：查询参数，键值对形式，键值对间用 `&` 分隔；path 与 query 则用 `?` 分隔；
- **fragment**：URI 所定位的资源内的<u>锚点</u>，浏览器可根据此<u>锚点</u>跳转到对应的位置；

```http
https://www.baidu.com/s?wd=HTTP&rsv_spt=1
scheme = https
host:port = www.baidu.com (http 和 https 的默认端口分别为80、443)
path = /s
query = ?wd=HTTP&rsv_spt=1
```







### 三、HTTPS

#### 3-1、基本介绍

​	HTTP 特性是明文传输，对外完全透明，传输的任一环节(TCP、路由、运营商等)都有可能被第三方窃取或篡改(中间人攻击)，为确保安全性，继而诞生 HTTPS，但实际上 HTTPS 并非新协议，而是在 HTTP 之下新增一层 SSL/TLS 协议的集合的统称，即：`HTTPS = HTTP + SSL/TLS`；通俗点说就是在 HTTP 与  TCP 间加入中间层，HTTP 向 TCP 通讯时，须先经过中间层进行加密，中间层则将加密后的数据传给 TCP；TCP 向 HTTP 通讯时，须将数据交由中间层解密才能传给上层 HTTP；这个中间层也叫安全层，其核心作用是对数据加解密；



#### 3-2、TLS (SSL)

​	***SSL(Secure Sockets Layer—安全套接层)***，在 OSI 七层模型中处于第5层会话层；此前 SSL 出过 3 个大版本，当它发展到第 3 个版本时被标准化，成为 ***TLS(Transport Layer Security—传输层安全)***，并称 TLS1.0 版本 (SSL3.1)；目前主流版本是 <u>TLS1.2</u>，之前的 TLS1.0、TLS1.1 均被认为是不安全，在不久将来会被完全淘汰；而在 2018 年 <u>TLS1.3</u> 问世，更大大优化 TLS 握手过程；



#### 3-3、TLS 握手过程

##### 3-3-1、传统 TLS 握手

 RSA 版本，是因为它在加解密`pre_random`的时候采用的是 RSA 算法



##### 3-3-2、TLS1.2 握手

<img src="/Image/NetWork/http/8.png" style="zoom:60%;" />

##### 3-3-2-1、Client 协商

浏览器向服务端发送 TLS 版本、client_random、加密套件列表：

- TLS 版本：略；

- `client_random`：用以最终生成 secret 的一个参数；
- 使用的加密套件列表：`TLS_ECDHE_WITH_AES_128_GCM_SHA256`(类似形式)
  - 含义：`TLS` 握手过程中，使用 `ECDHE` 算法生成 `pre_random`，并用 `128` 位的 `AES` 算法进行对称加密，且加密过程中使用主流的 `GCM `分组模式(如何分组是对称加密中很重要的问题)，并告知采用 `SHA256` 算法作为 <u>哈希摘要算法</u>；



##### 3-3-2-2、Server 协商

服务端向客户端回送 `server_random`、`server_params`、确认 TLS 版本、使用的加密套件列表、服务器使用证书；

- 确认 TLS 版本：略；

- `server_random`：用以最终生成 `secret` 的一个参数；
- 使用的加密套件列表：`TLS_ECDHE_WITH_AES_128_GCM_SHA256`(类似形式)
  - 含义：`TLS` 握手过程中，使用 `ECDHE` 算法生成 `pre_random`，并用 `128` 位的 `AES` 算法进行对称加密，且加密过程中使用主流的 `GCM `分组模式(如何分组是对称加密中很重要的问题)，并告知采用 `SHA256` 算法作为 <u>哈希摘要算法</u>；
- 服务器使用证书：用于供客户端验证(验证通过则生成 `client_params`：用于计算 `pre_random` 的一个参数2/1)

- `server_params`：用于计算 `pre_random` 的一个参数2/2；



##### 3-3-2-3、Client 验证证书并生成 secret

客户端验证服务端传来的证书和签名是否通过，若验证通过，则生成并传递参数 `client_params` 给服务器；随后客户端通过 `ECDHE` 算法，传入参数 `server_params` 和 `client_params`，计算出 `pre_random`；(`ECDHE` 基于椭圆曲线离散对数，传入的两个参数也称作椭圆曲线的公钥)；此刻客户端拥有 **<u>client_random</u>**、**<u>server_random</u>**、**<u>pre_random</u>**，最后利用此 3 个数，通过一个伪随机数函数来计算出最终 `secret`；



##### 3-3-2-4、Server 生成 secret

服务端接收客户端的 `client_params`，通过 `ECDHE` 算法，传入参数 `server_params` 和 `client_params`，计算出 `pre_random`；最后，使用与客户端同样的伪随机数函数生成最终 `secret`；



##### 3-3-2-5、注意事项

- 注意：验证数字证书阶段：服务端利用自身数字证书信息，通过哈希摘要算法，生成一个 **摘要(字符串)** ，用以 **标识** 自身身份，并利用私钥加密，随后将 **加密后的标识(摘要)**，连同 **自身公钥** 传给客户端；随后客户端通过 **公钥** 来解密，生成另外一份摘要；对前后 2 个摘要进行对比，若相同则能确认服务端的身份；此亦就 **数字签名** 原理；整一过程中，除了哈希算法，最重要 **私钥加密，公钥解密**；
  - 若传输过程信息被窃取，则窃取人可获取公钥、解密标识…
  - 若不考虑传输过程的信息窃取，则关键是对数字证书的可信任性；

- 综述：TLS 目的是双方约定唯一 `serect` 进行加密解密操作，类似过去的密码表，但现今还要先确认双方关系，及避免传输过程被三方窃取篡改；`serect` 通过 **<u>client_random</u>**、**<u>server_random</u>**、**<u>pre_random</u>** 生成，前两者通过双方协商传输获得，后者须通过 **<u>server_params</u>** 和 **<u>client_params</u>** 计算得到，而这两个值须通过各自校验后才会生成并发送对方；比如 client_params 的生成须先验证服务端响应的数字证书，通过后才生成，如此确认双方身份；

- 注意：TLS 握手是一个双向认证的过程：前两次传输中，双方均向对方发送了：TLS版本相关内容、**<u>xxx_random</u>**、使用的加密套件列表，而服务端向客户端多发送了数字证书与 **<u>server_params</u>**，目的是供客户端校验服务端身份；校验通过后，客户端生成 **<u>client_params</u>** 并回传，此时服务端也要验证客户端身份，即同样需要走：哈希摘要 + 私钥加密 + 公钥解密 的认证流程；

- 注意：客户端生成 `secret` 后，会给服务端发送一收尾消息，告诉服务器之后内容都用对称加密，对称加密的算法就用首次约定的方式；服务端亦然；而此收尾消息包括 2 部分：

  - Change Cipher Spec：表示后续内容加密传输；
  - Finished消息：此消息是对之前所有发送的数据做的摘要，对摘要进行加密，让对方验证一下；

  当双方均验证通过后，TLS 握手才正式结束，后续 HTTP 正式开始传输加密报文；

- 注意：`RSA` 和 `ECDHE` 握手过程的区别：

  - `ECDHE` 握手，即主流的 TLS1.2 握手中，使用 `ECDHE` 实现 `pre_random` 的加密解密，没有用到 `RSA`；
  - 使用 `ECDHE`，客户端发送完收尾消息后即可提前抢跑，直接发送 HTTP 报文，不必等到收尾消息到达服务器，节省一个 RTT；然后等服务器返回收尾消息给自己，直接开始发请求。这也叫`TLS False Start`；



##### 3-3-2-6、疑问合集

- 若握手期间信息被三方窃取(WIFI)并最终掌握 sercet 怎么办? 与 [TLS 中间人攻击](https://www.zhihu.com/question/20744215) 有何不同?



#### 3-4、TLS 1.3

TLS 1.3 主要对 TLS 1.2 做了系列改进：废除大量算法，提升安全性，同时利用会话复用，节省重新生成密钥时间，并利用 `PSK`  实现 `0-RTT` 连接：

##### 3-4-1、安全提升

TLS1.3 废除大量有安全漏洞的加密算法，且最后只保留 5 个加密套件：

`TLS_AES_128_GCM_SHA256`、`TLS_AES_256_GCM_SHA384`、`TLS_CHACHA20_POLY1305_SHA256`、`TLS_AES_128_GCM_SHA256`、`TLS_AES_128_GCM_8_SHA256`

- 对称加密算法：保留 **AES** 和 **CHACHA20**；
- 分组模式：保留 **GCM** 和 **POLY1305**；
- 哈希摘要算法：保留 **SHA256** 和 **SHA384**；



那你可能会问了, 之前`RSA`这么重要的非对称加密算法怎么不在了？

我觉得有两方面的原因:

**第一**、2015年发现了`FREAK`攻击，即已经有人发现了 RSA 的漏洞，能够进行破解了。

**第二**、一旦私钥泄露，那么中间人可以通过私钥计算出之前所有报文的`secret`，破解之前所有的密文。

为什么？回到 RSA 握手的过程中，客户端拿到服务器的证书后，提取出服务器的公钥，然后生成`pre_random`并用**公钥**加密传给服务器，服务器通过**私钥**解密，从而拿到真实的`pre_random`。当中间人拿到了服务器私钥，并且截获之前所有报文的时候，那么就能拿到`pre_random`、`server_random`和`client_random`并根据对应的随机数函数生成`secret`，也就是拿到了 TLS 最终的会话密钥，每一个历史报文都能通过这样的方式进行破解。

但`ECDHE`在每次握手时都会生成临时的密钥对，即使私钥被破解，之前的历史消息并不会收到影响。这种一次破解并不影响历史信息的性质也叫**前向安全性**。

`RSA` 算法不具备前向安全性，而 `ECDHE` 具备，因此在 TLS1.3 中彻底取代了`RSA`。



##### 3-4-2、性能提升

<img src="/Image/NetWork/http/9.png" style="zoom:60%;" />

TLS 1.3 握手流程大体与 TLS1.2 类似，但比后者减少一个 RTT， 服务端不必等待对方验证数字证书后才能拿到 `client_params`，而是直接在首次握手时即可拿到， 拿到后由 **<u>client_random</u>**、**<u>server_random</u>**、**<u>pre_random(client_params、server_params)</u>  **立即计算 `secret`，节省大量非必需等待时间；此种握手方式亦称 **1-RTT 握手**，此外还可在此基础上进行进一步优化：

- 会话复用—1RTT优化
  - Session ID 方式：首先，客户端和服务器首次连接后各自保存会话 ID，并存储会话密钥；然后，当再次连接时，客户端发送会话 ID，服务器根据 ID 是否存在，选择直接复用先前会话状态、重用会话密钥；或拒绝；缺点是当客户端数量庞大时，对服务端存储、性能要求非常大；
  - Session Ticket 方式：针对上一种方式存在的问题，将服务端压力分摊给客户端(卑鄙)；首先，双方连接成功后，服务器 加密并将 Session Ticket 发给客户端并告知存储；然后客户端下次重连时，发送 Ticket，服务端解密后验证过期与否，若无则直接恢复先前会话状态；缺点是存在安全问题，每次用一个固定密钥来解密 Ticket 数据，一旦黑客拿到密钥，先前所有历史记录也被破解，故密钥需要定期进行更换；

- PSK(Pre-Shared Key)—0RTT优化：
  - 优化至 0RTT：在发送 Session Ticket 的同时携带应用数据，而不用等到服务端确认；缺点是存在安全问题，中间人截获 PSK 数据，不断向服务器发送，类似于 TCP 首次握手即携带数据，增加了服务器被攻击的风险；





### 四、HTTP/2

​	HTTPS 专注于安全提升，而 HTTP/2 则专注性能方面的提升(头部压缩、多路复用)，并增加诸多功能(设置请求优先级、服务器推送)；

​	

#### 4-1、二进制帧

​	HTTP/2 将报文全部换成二进制格式，即全部传输`01`串，以方便机器解析，减少因字符多义性的状态问题的判断，提升解析效率；原来的 `Headers + Body` 的报文格式被分拆成<u>**二进制帧**</u>，并使用 <u>Headers帧</u> 存放头部字段，用 <u>Data帧</u> 存放请求体数据；HTTP/2 传输的二进制帧格式如下：

<img src="/Image/NetWork/http/12.png" style="zoom:50%;" />

​	每个二进制帧由 **<u>帧头—Frame Header</u>** 和 **<u>帧体—Frame Payload</u>** 组成；

- 帧长度：表示 <u>帧体</u> 的长度；
- 帧类型：可分为 **数据帧** 和 **控制帧** 2 种；前者用来存放 HTTP 报文，后者用来管理 <u>流</u> 的传输，比如实现 **优先级** 与 **流量控制**；
- 帧标志：共有 8 个标志位，常用的有 **END_HEADERS **表示头数据结束，**END_STREAM **表示单方向数据发送结束；
- 流标识符—Stream ID：供接收方从乱序二进制帧中选择出 ID 相同的帧，并按顺序(ID按顺序递增)还原成请求/响应报文；
  - 注意：所谓乱序，指的是不同 ID 的 Stream 乱序发送，但同一 Stream ID 的帧一定是按顺序传输。二进制帧到达后对方会将 Stream ID 相同的二进制帧顺序组装(通过 TCP 顺序性实现)成完整的报文；



##### 4-1-1、流及流的状态变化

通信双方均可给对方发送二进制帧，这种二进制帧的<u>**双向传输的序列**</u>，称作 **<u>*流(Stream)*</u>**；而在 HTTP/2 请求和响应过程中，流的状态变化是通过标志位实现：

<img src="/Image/NetWork/http/13.png" style="zoom:60%;" />

- 首先，双方均未空闲状态，当客户端发送 `Headers帧` 后，开始分配 `Stream ID` ，此时客户端的 <u>流(序列)</u> 打开，而服务端在接收后也打开 <u>流(序列)</u> ，双方均打开 <u>流(序列)</u>  后，即可互相传递二进制帧；
- 然后，当客户端需要关闭时，向服务端发送 `END_STREAM帧`，进入 `半关闭状态`，此时客户端只能接收数据，不能发送数据；
- 然后，当服务端收到 `END_STREAM帧`，也进入 `半关闭状态`，此时服务端只能发送数据，不能接收数据，与客户端情况相反；
- 随后，服务端向客户端发送 `END_STREAM帧`，表示数据发送完毕，双方进入 `关闭状态`；
- 注意：若下次开启新的 <u>流(序列)</u> ，流 ID 需自增直到上限为止(4字节，最高位保留，范围 0-2^31 ≈ 21 亿)，到达上限后开一个新的 TCP 连接重头开始计数；



##### 4-1-2、流的传输特性

- 并发性：一个 HTTP/2 连接可同时发送多个帧，与 HTTP/1 不同，**<u>这是实现多路复用的基础</u>**；
- 自增性：流 ID 不可重用，按顺序递增，达到上限之后又新开 TCP 连接从头开始(没有回绕问题)；
- 双向性：客户端和服务端均可创建流，互不干扰，双方均可作为发送方或接收方；
- 可设置优先级：通过设置数据帧的优先级，让服务端先处理重要资源，优化用户体验；



#### 4-2、性能提升

##### 4-2-1、头部压缩

HTTP/1.1 及低版本中，<u>请求报文请求体</u>可通过 `Content-Encoding` 头部字段来指定压缩算法压缩请求体，而 HTTP/2 后，<u>请求报文头部</u> 也可通过 HPACK 压缩算法压缩(GET 请求头部往往是主体，优化力度大)，HPACK 特点有二：

- 首先，在服务器和客户端间建立哈希表，将用到的字段存放在此表中，随后在传输时对于先前出现过的值，只需将把索引值传给对方即可，对方拿到索引后查表即可完成字段搜索；让请求头字段得到极大程度的精简和复用；
- 然后，对于整数和字符串进行 <u>哈夫曼编码</u>，此编码原理是：先将所有出现的字符建立一张索引表，然后让出现次数多的字符对应的索引尽可能短，传输时也是传输这样的**索引序列**，可达到非常高的压缩率；
- 注意：HTTP/2 废除了起始行概念，将起始行中的请求方法、URI、状态码转换成头字段，并用前缀 `:` 区分请求头；

<img src="/Image/NetWork/http/10.png" style="zoom:40%;" />

##### 4-2-2、多路复用

多路复用即 HTTP/2 用 <u>流</u> 来在一个 TCP 连接上来进行多个数据帧的通信；因通过拆分报文为二进制帧，而一个 HTTP/2 连接可同时发送多个帧，且接收端可通过相同 StreamID 帧顺序组合还原报文，发送无先后关系，不用排队发送，故 HTTP/2 从协议层面解决 HTTP队头阻塞问题(前一请求未处理完，后续请求被阻塞(不同于 TCP 队头阻塞，后者是前一个报文数据包未收到就不会将提前到达的后续数据包向上传递，为数据包层面，HTTP 队头阻塞是请求层面))



#### 4-3、功能增加

##### 4-3-1、设置请求优先级

##### 4-3-2、服务器推送(Server Push)

在 HTTP/2 当中，服务器已不再是完全被动地接收响应请求，服务器也能新建 stream 向客户端发送消息；当 TCP 连接建立之后，比如浏览器请求一个 HTML 文件，服务器就可在返回 HTML 基础上，将 HTML 中引用到的其他资源一并返回给客户端，减少客户端的等待；

<img src="/Image/NetWork/http/11.png" style="zoom:40%;" />





### X、转载