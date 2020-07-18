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
- 收发有来回：一发一收、有来有回；

##### 2-1-2、缺点/不足

- 无状态(优缺同体)：状态指通信过程的上下文信息；无状态指每次请求均为独立无关联，默认不保留状态信息；具体场景具体分析；
  - 比如在需要长连接的场景中，需要保存大量的、上下文信息，以免传输大量重复信息，此时优点就成了缺点；
- 明文传输：即报文传输(头部)使用文本形式而非二进制形式，虽便于调试但暴露了内部信息；
  - 比如连接公共 WIFI 热点可能会被攻击者截获敏感信息；
- 队头阻塞：当 http 开启长连接时将共用一个 TCP 连接，同一时刻只能处理一个请求，此时若某请求耗时过长，则会导致其它请求处于阻塞状态；



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

<img src="/Image/NetWork/http/6.png" style="zoom:60%;" align="left"/>

此类字段用于双方确定对方可接收的 **<u>数据格式、压缩方式、支持语言和所使用的字符集</u>**：

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






#### 2-x、其他补充

##### 2-x-1、URI—统一资源标识符

URI(Uniform Resource Identifie) 包含 URL 与 URN 两部分，其作用是区分互联网上不同的资源，只能使用 ASCII 编码，ASCII 以外字符不支持显示，为表示其他字符，URI 引入了一套编码机制，将所有 **<u>非 ASCII 码字符和界定符</u>** 转为十六进制字节值，然后在前面加个 `%`；比如：空格被转义成了 `%20`；URI 结构如下：
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

### 四、HTTP2.0/3.0

### X、转载