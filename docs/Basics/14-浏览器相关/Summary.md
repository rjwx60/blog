# 总结

## 一、基础

关于浏览器架构相关的，比如 WebKit 内核，需要 C++ 知识…2020末研究方向之一



## 二、缓存

主要有三个板块：强缓存、协商缓存、缓存位置(DiskCache、MemoryCache)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001813.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001815.png" style="zoom:50%;" align=""/>

- 地址输入栏：先查找 Disk Cache 是否有匹配，否则发送请求； 
- 普通 F5 刷新：优先使用 Memory Cache，其次是 Disk Cache；
- 强制 CtrlF5 刷新：浏览器不使用缓存

每当打开一个页面或请求一个资源时，**<u>首先</u>** 会检查强缓存(通过检查字段来实现，又可细分为 HTTP1.0 和 HTTP1.1 的字段)，会先从 Memory Cache 查找资源引用，然后根据引用从 Disk Cache 获取资源，然后检查与资源过期相关的字段：

- Expires(服务端最初返回此内容时，标记上的字段，表示过期时间—缺点明显—服务客户两端时间不一致)
- Cache-control 下的 max-age 键—客户端接收后开始计算，资源的最长存活时间；它还有很多 key !!!
  - **public**：客户端、中间代理服务器均允许缓存资源；
  - **private**：只有客户端能缓存，中间代理服务器不能缓存；
  - **no-cache**：跳过当前强缓存检查阶段，直接发送 HTTP 请求，即直接进入协商缓存阶段；
  - **no-store**：不进行任何形式的缓存；
  - **s-max-age**：作用同 max-age，但针对对象是代理服务器；

**<u>然后</u>**，若强缓存失效，即资源缓存超时，浏览器在请求头中携带相应的 <u>缓存 Tag</u> 来向服务器发请求，服务器根据此 Tag，来告知浏览器是否继续使用缓存；缓存 Tag 有两种：Last-Modified、 ETag：

- 注意：若协商请求是跨域请求，则还会发生简单/非简单请求，而在此之前，还会发生 DNS 查询获取 IP，然后才发起 HTTP 请求，协议处理，再封装 TCP，TCP 请求，三次握手、长连接…每一次回车确认，都会发生上述反应，在获取资源后系统和浏览器还会进行系列处理，可谓相当厉害了…扯远了，回来回来=。=
- 注意：实际上这两个缓存 Tag 是在接收资源那一刻获取到的，前者意为资源最后修改的时间，后者是服务器为资源生成的唯一 标识，一旦文件有更新或修改，这个标识就会发生变化(服务器重新计算生成)；当浏览器需要发起协商请求时，会将这两个 Tag 分别放在 If-Modified-Sine 和 If-None-Match 中，然后随请求报文传送；服务器收到后，查找该资源，并判断这两个资源是否发生了变化(对比前后 Last-Modified 和 ETag )，若不一致，则说明资源已更新，服务端返回新资源，与常规 HTTP 请求响应流程一致；否则返回 304 状态码，告诉浏览器直接用缓存；精度上，ETag 由于 LastModified，服务器也会优先考虑(原因如下)；但性能上不如 LastModified；
  - **<u>不该重新请求时，重新请求：</u>**编辑文件，但实际上文件内容并无变更，服务端并不清楚文件是否真正改变，仍通过最后编辑时间进行判断，此时资源再次被请求时，会被当做新资源处理，缓存作用失效；
  - **<u>该重新请求时，无重新请求：</u>**Last-Modified 能感知的最小单位时间是秒，若文件在 1 秒内发生多次改变则无法表现出修改，具有局限性；

**<u>*最后*</u>**，关于缓存位置，按优先级从高到低排列：Service Worker、Memory Cache、Disk Cache、Push Cache、网络请求，上图吧：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923165034.png" alt="截屏2020-09-23 下午4.50.31" style="zoom:50%;" />

**<u>注意</u>**：实际场景中：

- 对于频繁变动的资源使用：`Cache-Control: no-cache`；
- 对于不频繁变动的资源使用：`Cache-Control: max-age=31536000`；
- 此外，为解决文件及时更新问题()，可通过 webpack 的文件指纹策略，为文件名添加 `hash`、版本号等动态字段，以实现更改 <u>引用URL</u> 目的(实现更新内容-重新请求资源)；





## 三、存储

主要在于：Cookie、SessionStorage (区别：会话层级区别)、IndexedDB

**<u>Cookie</u>** 设计之初并非用于本地存储，而是为弥补 HTTP 在状态管理上的不足(无状态协议，服务端无法辨别每次请求的客户端的具体情况—只能通过头部信息识别连接对象，无法确认上下文)；

Cookie 本质是浏览器中存储的一个很小的、内容以键值对形式存储的文本文件，每次向同一域名发送请求，均会自动携带相同Cookie(这点被 CSRF 利用，可设置 Samesite：Strict 禁止随同发送；或使用 Token—毕竟不会自携带 Token)；服务器拿到 Cookie 后进行解析，即可获取客户端状态(Cookie 多用于存储用户状态，所以被 XSS 利用，可利用 Cookie: HttpOnly 字段禁止 JS 读取)；即 Cookie 用于 <u>状态存储</u>，但缺点也很多：

- 容量缺陷：体积上限只有`4KB`，只能存储少量信息；
- 性能缺陷：Cookie 紧跟域名发送而不管是否真正需要，随着请求数增多性能浪费越严重——请求携带不必要数据；
- 安全缺陷：Cookie 纯文本形式，在飞行途中很容易被非法用户截获篡改，在有效期内发送给服务器更是危险操作；

**<u>SessionStorage</u>**：与 Cookie 区别是不随请求发送、容量大、接口友好，细分为 Session 与 Local，两者差别在于生命周期，前者会话级别，后者持久化；注意使用时，存储对象需要调用 `JSON.stringify`方法，并且用 `JSON.parse ` 来解析成对象；

**<u>IndexedDB</u>**：这个相当少用了，理论容量无上限，为大型数据的存储提供了接口；

具有数据库特性：支持事务，存储二进制数据，还有其他特殊特性：

- 键值对存储：内部采用 <u>对象仓库</u> 存放数据，在此仓库中数据采用 <u>键值对</u> 形式存储；
- 异步操作：数据库的读写属于 I/O 操作，浏览器中对异步 I/O 提供了支持；
- 受同源策略限制，无法访问跨域的数据库；

但问题是如果前端需要存储这么多的信息，估计需要考虑前后衔接，甚至是软件设计问题了；现提倡云开发，而非本地；









## 四、跨域

主要是同源策略引发的跨域拦截、以及跨域方案(CORS、JSONP、Nginx 等)

### 4-1、跨域原理

浏览器具有 **<u>同源策略</u>**：协议、主机-host、端口；同源策略限制了非同源网站的 DOM 操作、Cookie、SessionStorage、IndexedDB、XMLHttpRequest 操作；而若某次请求不符合同源策略，就会产生跨域问题，跨域报错；

**<u>浏览器跨域</u>**，其实是浏览器自身的一个安全防控行为；不管跨域与否，假设每个请求都能到达服务器，又假设服务器、网络没问题，响应返回后，经浏览器检测后，若发现是跨域请求，就会被拦截并警告；因为其不符合浏览器的同源策略；

**<u>可以说跨域问题源自于同源策略，而跨域拦截的实现是通过进程通信 IPC 实现；</u>**

**<u>为何会有跨域拦截行为</u>**，为何又会有同源策略?? 假设没有跨域拦截，也即没有同源策略，这样的后果是相当恐怖的：非同源的响应数据能肆意修改 DOM，发送 cookie，获取用户状态，如果配合 XSS 漏洞，注入非法代码，那攻击者就可以为所欲为了；互联网的思想是开放的，但更多的时候，需要用某些规章制度，来约束/限制这种极其容易泛滥的行为，所以就有了同源策略，有了不符合同源策略的跨域拦截，以保证用户信息安全，防止恶意网站窃取数据；**<u>此外</u>**，我还将其理解为，跨域问题，是浏览器检测到了非同源请求的响应数据，浏览器无法确定这段响应信息是否安全(除非配置 CSP 白名单等)，从安全防范角度，将其拦截是最合适的处理方式；

**<u>跨域拦截实现</u>**：

- 1、浏览器是多进程的(渲染进程、网络进程、主进程等)，而 WebKit 渲染引擎 和 V8 引擎 都在渲染进程当中；
- 2、 `xhr.send` 被调用时(即请求准备发送时)，尚在渲染进程的处理；沙箱中的渲染进程无法发送网络请求(只能通过网络进程来发送)，故需 **<u>进程间通信(IPC，Inter Process Communication)</u>**， 来将数据传递给浏览器主进程，主进程接收到后，才(通知网络进程)真正地发出相应网络请求；
  - 注意：为防止黑客通过脚本触碰系统资源，浏览器将每一<u>渲染进程分配进沙箱</u>，同时为防止 CPU 芯片一直存在的 <u>Spectre</u> 和  <u>Meltdown</u> 漏洞，采取 <u>站点隔离</u>  的手段，给每一<u>不同站点(一级域名不同)分配沙箱</u>，使其互不干扰；[YouTube上Chromium安全团队的演讲视频](https://www.youtube.com/watch?v=dBuykrdhK-A&feature=emb_logo)；
  - 注意：chromium  中进程间通信的源码调用顺序如下：[IPC源码地址](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/ipc/)、[Chromium IPC源码解析文章](https://blog.csdn.net/Luoshengyang/article/details/47822689)；
  - 总结：利用 `Unix Domain Socket`套接字，配合事件驱动的高性能网络并发库  `libevent` 完成进程通信 IPC 过程；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001818.png" style="zoom:50%;"/>

- 3、服务端处理完并将响应返回，主进程检查到跨域行为，且无配置 CORS 响应头，遂将响应体全部丢弃，上报错误日志输出；而不会发往渲染进程，实现了拦截数据的目的；

### 4-2、跨域实现

主要是 CORS 的简单非简单请求、JSONP；

### 4-2-1、CORS

CORS 跨域资源共享、W3C 标准；

CORS 允许浏览器向跨源服务器，发出 `XMLHttpRequest` 或 `Fetch` 请求，整个 `CORS` 通信过程均由浏览器自动完成；

**<u>CORS 前提：1、浏览器支持此功能 IE10+、2、服务器须同意跨域请求(即须附加特定响应头(以供浏览器"放行"))：</u>**

- Access-Control-Allow-Origin：表示可允许请求的源；可填具体源名，亦可填 `*` 表示允许任意源请求；
- Access-Control-Max-Age：表示预检请求的有效期，在此期间，不必发出另外一条预检请求；
- Access-Control-Allow-Headers：表示允许发送的请求头字段；
- Access-Control-Allow-Methods：表示允许的请求方法列表；
- Access-Control-Allow-Credentials：表示是否允许发送 Cookie，对于跨域请求，浏览器默认值设为 false，否则需要设置为 true，前端也需设置 `withCredentials` 属性：`xhr.withCredentials = true;`

**<u>基本流程</u>**：只管看跨域请求即可：

首先，客户端先根据同源策略，对前端请求 URL 与后台交互地址 API 做匹配：

- 若同源则直接发送数据请求；
- 若不同源，则发送跨域请求；
- 然后，服务器收到客户端跨域请求后，根据自身配置返回相应文件头：
  - 若未配置允许跨域，则文件头不包含 `Access-Control-Allow-origin` 字段；
  - 若已配置跨域允许，则返回 `Access-Control-Allow-origin + 相应配置规则中的域名的方式`；
- 最后，浏览器根据与接收到的响应头中的 `Access-Control-Allow-origin` 字段匹配：
  - 若无该字段，则说明不允许跨域，抛出错误；
  - 若有该字段，则将 <u>字段内容</u> 同 <u>当前域名</u> 做比对，
    - 若同源，则说明可跨域，浏览器接受该响应；
    - 若不同源，则说明该域名不可跨域，浏览器不接受该响应，并抛出错误；

浏览器根据跨域请求方法和跨域请求头的特定字段，将跨域请求分为两类，凡满足下面条件的属于 **<u>简单请求</u>**，否则为 **<u>非简单请求</u>**；

- 请求方法为 GET、POST、HEAD 之一；
- 请求头取值范围：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`DPR`、`Downlink`、`Save-Data`、`Viewport-Width`、`Width`
  - 注意：`Content-Type` 仅限3值：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
- 请求中的任意 [XMLHttpRequestUpload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象均无注册任何事件监听器；[XMLHttpRequestUpload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象可使用 [XMLHttpRequest.upload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 属性访问；
- 请求中没有使用 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象；

**<u>简单跨域请求</u>**：只是单纯的请求；流程同上面的基本流程神似：

请求发出前，浏览器会自动为请求头中，添加字段 `Origin`，用以说明请求来源；当服务器拿到请求并回应时，会相应地添加字段 `Access-Control-Allow-Origin`，并设置字段值(或请求 Origin 值，或别值)；然后，当浏览器收到时，若发现 `Origin` 值不在此字段范围内时，就会将响应拦截；所以**<u>字段 `Access-Control-Allow-Origin` 是服务器用来决定浏览器是否拦截此响应的必需字段</u>**；

```js
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx, next) => {
  // 关键之处:
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
  await next();
  if (ctx.path === '/api/corsname') { ... }
})
console.log('server 8080...')
app.listen(8080);
```

**<u>非简单跨域请求</u>**：浏览器则会先使用 `OPTIONS` 方法，自动发起预检请求到服务器，以获知服务器是否允许该实际请求，避免跨域请求对服务器的用户数据产生未预期的影响；主要体现在两方面：**<u>预检请求</u>**、**<u>响应字段</u>**，主流程是：

首先，客户端先发送 <u>**预检请求(而非实际请求)**</u>，用以告知服务器接下来的 CORS 请求的具体信息(方法、请求头)；

- Access-Control-Request-Method：指出 (接下来的)CORS 请求用到哪个 HTTP 方法；
- Access-Control-Request-Headers：指出 (接下来的)CORS 请求将要加上什么请求头；

```js
// 以非简单请求 PUT 方法为例
var url = 'http://xxx.com';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'xxx');
xhr.send();

// 预检请求请求头 - 代码执行后浏览器随即自动发送 预检请求
// 预检请求方法为 OPTIONS
OPTIONS / HTTP/1.1
Origin: 源地址
Host: xxx.com - 目的地址
Access-Control-Request-Method: PUT - 非简单请求标志之一
Access-Control-Request-Headers: X-Custom-Header - 非简单请求标志之一
```

然后，服务端接收并返回 <u>**预检请求的响应**</u>，客户端检查此响应：

- 若 CORS 请求不满足预检请求响应头的条件，则触发 `XMLHttpRequest` 的 `onerror `方法，后续真正 CORS 请求不发出；
- 若 CORS 请求满足，则发出真正 CORS 请求；

```http
// 预检请求响应头
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
```

最后，若一切允许，则客户端发送真正的 CORS 跨域请求：流程同简单请求：客户端自动加上 `Origin` 字段，服务端返回  `Access-Control-Allow-Origin`；

**<u>非简单跨域请求优化</u>**：

- 尽量发出简单请求；
- 服务端设置 `Access-Control-Max-Age` 字段：在有效时间内浏览器无需再为同一请求发送预检请求；局限性：只能为同一请求缓存，无法针对整个域或模糊匹配 URL 做缓存；





### 4-2-2、JSONP

原理主要是利用 `script` 标签 `src` 属性没有跨域限制，通过 src 填上目标地址发出 GET 请求，由服务端返回一个预先定义好的 JS 函数调用，并将服务器数据以该函数参数形式响应；JSONP 需要前后端配合完成；最大优势是兼容性好(兼容 IE 低版本)，但缺点明显：只支持 GET 请求；执行过程如下：

- 首先，前端定义一个解析函数；比如： `jsonpCallback = function (res) {}`
- 然后，通过 `params`  的形式包装 `script` 标签的请求参数，并声明为上述执行函数名；比如：`cb=jsonpCallback`；
- 然后，后端获取到前端声明的执行函数(`jsonpCallback`)，并以带上参数且调用执行函数的方式传递给前端
- 最后，前端在 `script` 标签请求返回资源时就会去执行 `jsonpCallback`，并通过回调的方式拿到数据；

```js
// 1、创建全局函数，等待执行
<script type='text/javascript'>
window.jsonpCallback = function (res) { ... }
</script>
// 2、通过下方代码 jsonp 构建的请求脚本，写入 html 后便等待请求内容返回
<script src='http://localhost:8080/api/jsonp?id=1&cb=jsonpCallback' type='text/javascript'></script>
// 3、服务端拿到 URL 参数，处理请求，最后在响应体中写入 jsonpCallback(...)，并将处理后的内容以函数参数形式传入
// 4、前端拿到后台内容并执行，执行调用全局函数，并将参数传入函数中执行；
```

```js
// 1、前端
function JSONP({ url, params = {}, callbackKey = "cb", callback }) {
  // 定义本地的唯一 callbackId，若是没有的话则初始化为 1
  JSONP.callbackId = JSONP.callbackId || 1;
  let callbackId = JSONP.callbackId;
  // 把要执行的回调加入到 JSON 对象中，避免污染 window
  JSONP.callbacks = JSONP.callbacks || [];
  JSONP.callbacks[callbackId] = callback;
  // 把这个名称加入到参数中: 'cb=JSONP.callbacks[1]'
  params[callbackKey] = `JSONP.callbacks[${callbackId}]`;
  // 得到'id=1&cb=JSONP.callbacks[1]'
  const paramString = Object.keys(params).map((key) => {
  	return `${key}=${encodeURIComponent(params[key])}`;
  }).join("&");
  // 创建 script 标签
  const script = document.createElement("script");
  script.setAttribute("src", `${url}?${paramString}`);
  document.body.appendChild(script);
  // id 自增，保证唯一
  JSONP.callbackId++;
}
JSONP({
  url: "http://localhost:8080/api/jsonps",
  params: {
    a: "2&b=3",
    b: "4",
  },
  callbackKey: "cb",
  callback(res) { ... },
});
JSONP({
  url: "http://localhost:8080/api/jsonp",
  params: { id: 1, },
  callbackKey: "cb",
  callback(res) { ... },
});
// 注意: encodeURI 和 encodeURIComponent 区别：
// 前者不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；
// 后者则会对它发现的任何非标准字符进行编码
```

```js
// 2、后端
const Koa = require('koa');
const app = new Koa();
const items = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }]

app.use(async (ctx, next) => {
  if (ctx.path === '/api/jsonp') {
    const { cb, id } = ctx.query;
    const title = items.find(item => item.id == id)['title']
    ctx.body = `${cb}(${JSON.stringify({title})})`;
    return;
  }
  if (ctx.path === '/api/jsonps') {
    const { cb, a, b } = ctx.query;
    ctx.body = `${cb}(${JSON.stringify({ a, b })})`;
    return;
  }
})
console.log('listen 8080...')
app.listen(8080);
```



### 4-2-3、Nginx

正向代理服务器是帮助 **客户端**，访问自身无法访问的服务器并将结果返回客户端；

反向代理服务器是帮助其他 **服务器**，获取到客户端发送请求并转交服务器；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001819.png" style="zoom:40%;" align=""/>

Nginx 是一种高性能的反向代理服务器，可解决跨域问题：

```nginx
server {
  listen  80;
  server_name  client.com;
  location /api {
    proxy_pass server.com;
  }
}
```

Nginx 相当于是一个跳板机，域名是 `client.com`，客户端首先访问 `client.com/api`，然后 Nginx 服务器作为反向代理，将请求转发给 `server.com`，当响应返回时又将响应给到客户端，完成整个跨域请求；





## 五、应用

图片懒加载、WebWorker，详看实现章节；



## 六、输入URL到展示

这题目太难了，往深还可挖：输入设备历史、输出设备历史、浏览器历史、计算机系统历史、编译原理…

同为 2020年研究方向之一，加油吧；



### 6-1、基本流程

强缓存检查(命中则使用)、DNS 解析(DNS缓存)、协商缓存或直接获取数据，TCP建立连接、HTTP发起请求—HTTP(头部含 Connection:Keep-Alive 则保持长连接—TCP连接不关闭—多个HTTP请求复用同一 TCP 连接)、TCP—IP 寻址—服务器处理并响应；

浏览器获取相关资源文件，若响应头 Content-Type 为 gzip 则先解压，若为 text/html 则进入解析渲染过程；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001821.png" style="zoom:50%;" />

- 解析1：浏览器无法识别 HTML，须先将 HTML内容转换为能被理解的 **<u>DOM 树(本质是一以 document 为根节点的多叉树)</u>**；
  - <u>字节数据</u> 0100101110—> <u>HTML 字符串</u>—><u>Token</u> (通过词法分析转换为 标记；标记化—Tokenization；标记还是字符串，是构成代码的最小单位)—> <u>Node</u> —>根据不同 Node 之前的联系构建 <u>DOM 树</u>；解析算法如下：
    - 1-1、标记化算法—词法分析：算法输入为 <u>HTML文本</u>，输出为 <u>HTML标记</u>，故亦称 <u>**标记生成器**</u>；标记打开-标记名称状态-数据状态-标记打开-.....
    - 1-2、建树算法—语法分析；首先，<u>**解析器**</u> 会创建一个 `document` 对象 (作为 **<u>DOM 树</u>** 的根节点)；随后，<u>**标记生成器**</u> 会将每个标记的信息发送给 **<u>建树器</u>**，**<u>建树器</u>**  接收到相应的标记时，会 **创建对应的 DOM 对象**，在创建这个 `DOM对象` 后会做两件事：将 `DOM对象` 加入 **<u>DOM 树</u>** 中、将对应标记，压入存放 **开放(与<u>闭合标签</u>意思对应)元素** 的栈中；
- 解析2：渲染引擎将 CSS 样式表转化为浏览器可理解的 styleSheets，计算出 DOM 节点的样式；
  - CSSOM 树(同步进行)：格式化、标准化、并根据继承与层叠规则计算节点具体样式；
  - 格式化：浏览器无法直接识别 CSS 样式文本，因此渲染引擎收到 CSS 文本后须将其转化为结构化的对象： **<u>styleSheets</u>**；(可通过 `document.styleSheets ` 查看)，结构包含 3 种 CSS 来源：link/style/内嵌style；
  - 标准化：有些 CSS 样式的数值不容易被渲染引擎所理解，在计算样式前需将其标准化；比如 em->px；
  - 计算每个节点的具体样式信息：遵从两个规则：继承、层叠；计算完样式后，所有样式值会被挂在到 `window.getComputedStyle` 中，可通过 JS 来获取计算后的样式；
- 解析3：创建 **<u>布局树</u>**，并计算元素的布局信息；
  - 利用前面的 **<u>DOM 树</u>** 和 **<u>DOM 样式</u>** ，排除 `script、meta` 等功能化、非视觉节点，排除 `display: none` 的节点，并通过浏览器的布局系统 <u>计算元素位置信息</u>、<u>确定元素位置</u>，构建一棵只包含可见元素的 **<u>布局树(Layout Tree)</u>**；1、遍历生成的 **<u>DOM 树</u>** 节点，并将它们添加到 **<u>布局树</u>** 中；2、计算 **<u>布局树</u>** 节点的坐标位置；3-1、注意：**<u>布局树</u>**  包含可见元素，设置 `display: none`的元素和 `head` 等功能标签，将不会被放入其中；3-2、注意：现在 Chrome 团队已经做了大量重构，已无生成 **<u>渲染树(Render Tree)</u>** 的过程(布局树的信息已非常完善，完全拥有 Render Tree 的功能)；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001824.png" style="zoom:50%;" align=""/>
- 渲染1：对布局树进行分层，并生成 **<u>分层树</u>**；
  - 解析阶段得到 DOM节点/样式/位置信息，但不足以开始绘制页面，因还需考虑页面中的复杂效果与场景，比如复杂 3D 动画变换效果、页面滚动、元素含层叠上下文时的显示与隐藏、使用 z-indexing 做 z 轴排序等；而为更加方便地实现这些效果，在浏览器在构建完 **<u>布局树</u>** 后，渲染引擎还需为特定节点生成专用图层，构建一棵 **<u>图层树(Layer Tree)</u>**；
  - Layer Tree 通过显式合成及隐式合成来进行合成的条件；前者会对含有特殊 CSS 属性的节点提升为单独一层(z-index/filter/根元素/will-change/transform/opacity等)；后者则将<u>层叠等级低</u> 的节点被提升为单独图层后，则 <u>所有层叠等级比它高</u> 的节点 **都会 **成为一个单独的图层；
- 渲染2：为每个图层生成 **<u>绘制列表</u>**；
  - 渲染引擎会将图层的绘制拆分成一个个绘制指令；比如先画背景、再描绘边框等，然后将这些指令按顺序组合成一个 **<u>待绘制列表</u>**，相当于制作一份绘制操作任务清单，可在 Chrome 开发者工具中的`Layers`面板观察绘制列表:
- 渲染3：**<u>渲染进程的主线程</u>** 会给 **<u>合成线程</u>** 发送 `commit` 消息，将 **<u>绘制列表</u>** 提交给 **<u>合成线程</u>**；合成线程将图层分块(避免<u>在有限视口内一次性绘制所有页面</u> 而造成的性能浪费)，即选择视口附近的 **图块**，优先将其交给 **<u>栅格化线程池</u>** 来生成位图；
  - 注意：渲染进程中专门维护一个 **<u>栅格化线程池</u>**，负责将 **图块** 转换为 **位图数据**；
  - 注意：生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给 **<u>合成线程</u>**；
- 渲染4：合成线程发送绘制图块命令给浏览器进程，浏览器进程根据指令生成页面，并显示到显示器上；
  - 生成图块并栅格化操作完成后，**<u>合成线程</u>** 会生成一个绘制命令—`DrawQuad`，并发送给浏览器进程的 **<u>viz组件</u>**，组件根据这个命令，将页面内容绘制到内存(缓冲)，然后把这部分内存数据发送给显卡；所以，当某个动画大量占用内存时，浏览器生成图像的速度变慢，图像传送显卡数据不及时，而显示器还是以不变频率刷新，因此会出现卡顿，出现明显的掉帧现象；

  - 注意：无论是 PC 显示器还是手机屏幕，都有一个固定的刷新频率，一般是 60 HZ(60 帧、每秒更新60张图，停留 16.7 ms/图)，而每次更新的图片均来自于显卡的 **<u>前缓冲区</u>**；当显卡接收到浏览器进程传来的新的页面后，会合成相应的新图像，并将新图像保存到  <u>**后缓冲区**</u>；然后系统自动将 **<u>前缓冲区</u>** 和  **<u>后缓冲区</u>** 对换位置，如此循环更新；

**<u>解析过程：解析DOM、解析CSS、布局树；</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001825.png" style="zoom:50%;" align="" />

<u>**渲染过程：分层树、绘制列表、生成图块并栅格化、显示内容**；</u>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001828.png" style="zoom:50%;" />



### 6-2、重排/重绘/合成

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001829.png" style="zoom:50%;" align=""/>

**<u>重排</u>**：对 DOM 修改导致元素的尺寸或位置发生变化时，浏览器需要重新计算渲染树，触发重排/回流；

- **<u>重排触发条件</u>**：对 DOM 结构的修改引发 DOM 几何尺寸变化时，会导致 **<u>重排(reflow)</u>**；
  - 页面初次渲染；
  - 元素字体大小变化；
  - 浏览器窗口大小改变；
  - 激活 CSS 伪类；比如 :hover；
  - DOM 元素的几何属性变化，常见的比如：`width`、`height`、`padding`、`margin`、`left`、`top`、`border` 等；
  - 元素尺寸、位置、内容发生改变；
  - 使 DOM 节点发生 `增减` 或 `移动`；
  - 读写 `offset ` 族、`scroll  `族、`client` 族属性时，浏览器为获取这些值，需要进行回流操作；
  - 查询某些属性或调用某些方法
    - clientWidth、clientHeight、clientTop、clientLeft
    - offsetWidth、offsetHeight、offsetTop、offsetLeft
    - scrollWidth、scrollHeight、scrollTop、scrollLeft
    - getComputedStyle()
    - getBoundingClientRect()
    - scrollTo()
- **<u>重排过程</u>**：依照下面的渲染流水线，触发重排/回流时，若 DOM 结构发生改变，则重新渲染 DOM 树，然后将后续流程(含主线程外的任务)全部走一遍；相当于将解析和合成的过程重新又走了一篇，开销巨大；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001830.png" style="zoom:50%;" align=""/>

**<u>重绘</u>**：DOM 修改导致样式发生变化，但无影响其几何属性，触发重绘，而不触发回流；而由于 DOM 位置信息无需更新，省去布局过程，性能上优于回流；

- **<u>重绘触发条件</u>**：当 DOM 的修改导致样式变化，且没有影响几何属性时，会导致 **<u>重绘(repaint)</u>**；

- **<u>重绘过程</u>**：由于没有导致 DOM 几何属性变化，故元素的位置信息无需更新，从而省去布局与建图层树过程，然后继续进行分块、生成位图等后面系列操作；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001831.png" style="zoom:50%;" align=""/>

- 注意：重绘跳过了 <u>生成布局树</u> 和 <u>建图层树</u> 阶段，直接生成绘制列表，然后继续进行分块、生成位图等后面一系列操作；
- 注意：重绘不一定导致重排，但重排一定发生了重绘；
- 注意：**<u>*重排比重绘的代价要更高*</u>**；有时即使仅仅重排一个单一的元素，其父元素及任何跟随它的元素也会产生重排；为避免频繁重排导致的性能问题，现代浏览器会对频繁的重排或重绘操作进行**<u>*优化*</u>**：浏览器会维护一个 flush 队列，以存放触发重排与重绘的任务，若队列中任务数量或时间间隔达到一个阈值时，浏览器就会将此队列任务一次性出队清空，进行一次批处理，如此可将多次重排和重绘变成一次；**<u>*但当*</u>**访问一些即使属性时，为获得此时此刻的、最准确的属性值，浏览器会提前将 flush 队列的任务出队：clientwidth、clientHeight、clientTop、clientLeftoffsetwidth、offsetHeight、offsetTop、offsetLeftscrollwidth、scrollHeight、scrollTop、scrollLeftwidth、heightgetComputedStyle()、getBoundingClientRect() 

**<u>合成</u>**：直接合成，比如利用 CSS3 的 `transform`、`opacity`、`filter` 等属性可实现合成效果，即  **<u>GPU加速</u>**；

补充：GPU加速即：在使用`CSS3`中的`transform`、`opacity`、`filter`属性时，跳过布局和绘制流程，直接进入非主线处理的部分，即交给合成线程；

- GPU 加速原因：在合成的情况下，会直接跳过布局和绘制流程，直接进入`非主线程`处理的部分，即直接交给 **<u>合成线程</u>** 处理：
  - 充分发挥 GPU 优势：**<u>合成线程</u>** 生成位图的过程中：会调用线程池，并在其中使用 GPU 进行加速生成，而 GPU 是擅长处理位图数据；
  - **<u>*无占用主线程资源*</u>**：即使主线程卡住，但效果依然能够流畅地展示；
- GPU 使用注意：GPU 渲染字体会导致字体模糊，过多 GPU 处理会导致内存问题；

**<u>最佳实践</u>**：

CSS：

- 避免使用多层内联样式；
- 避免使用 CSS 表达式，比如 `clac()`；
- CSS 选择符 <u>从右往左</u> 匹配查找，避免节点层级过多；
- 使用 `visibility` 替换 `display: none`，前者只引起重绘，后者则触发回流；
- 避免使用 `table` 布局，可能很小的一个小改动会造成整个 `table` 的重新布局；
- 使用 `transform` 替代 `top`，`transform` 和 `opacity` 效果，不会触发 `layout` 和 `repaint;`
- 动画效果/动画元素，可使用绝对定位使其脱离文档流；减少频繁地触发回流重绘；
  - 比如：将动画效果应用到 `position`  属性为 `absolute` 或 `fixed` 元素上；

JavaScript：

- 避免频繁操作样式，可汇总后统一 <u>一次修改</u>；

- 避免频繁使用 `style`，而采用修改 `class` 方式；

- 极限优化时，修改样式可将其 `display: none` 后修改；

- 使用 `resize`、`scroll`  时进行防抖和节流处理，减少回流次数；

- 避免频繁读取会引发回流重绘的属性，若需多次使用则可考虑缓存；

- 避免频繁操作 DOM，减少 `dom `的增删次数，可使用 <u>字符串</u> 或 `documentFragment` 一次性插入；

  - 比如：使用 `createDocumentFragment` 进行批量 DOM 操作，修改完毕后，再放入文档流；
  - 比如：先使用 `display:none` 避开回流重绘，操作结束后再显示；

- 避免多次触发上面提到的那些会触发回流的方法，可使用变量将查询结果缓存，避免多次查询；

- 动画实现的速度的选择，动画速度越快，回流次数越多，也可选择使用 `requestAnimationFrame;`

- 将频繁重绘或者回流的节点提升为合成层，图层能够阻止该节点的渲染行为影响别的节点；比如对于 `video` 标签来说，浏览器会自动将该节点变为图层；

  - 设置节点为图层的方式有很多，我们可以通过以下几个常用属性可以生成新图层：
  - `will-change`
  - `video`、`iframe` 标签

- 添加 `will-change: tranform`：让渲染引擎为节点单独实现一图层；在变换发生时，仅利用 **<u>合成线程</u>** 去处理这些变换而不牵扯主线程，提高渲染效率；

  - 注意：值并非限制 tranform，任何可实现合成效果的 CSS 属性均可使用 `will-change` 来声明；[使用例子](https://juejin.im/post/5da52531518825094e373372)；

  - 注意：通俗说即利用 CSS3 的`transform`、`opacity`、`filter` 这些属性，以实现合成的效果，即`GPU`加速；

  - ```css
    #divId {  will-change: transform; }
    ```





### 6-3、实际问题

**<u>DOM 操作性能问题</u>**

原因：跨线程操作；DOM 属于渲染引擎、脚本属于 JS 引擎；通过 JS 操作 DOM 就涉及两线程通信问题；操作 DOM 次数多，跨线程间通信频繁，且操作 DOM 可能带来重排情况，导致性能问题；改进：

- `requestAnimationFrame`  方式去循环的插入 DOM；
- 虚拟滚动 (virtualized scroller)：只渲染可视区域内的内容，非可见区域的完全不渲染，当用户在滚动时实时去替换渲染内容  [react-virtualized](https://github.com/bvaughn/react-virtualized)；

**<u>渲染阻塞问题</u>**

首先，渲染前提是生成分层树，故 HTML 和 CSS 势必会阻塞渲染；

- 优化：若想渲染快，可降低初始所需的渲染的文件 大小，并且扁平层级，优化选择器；
- 注意：CSS 由单独的下载线程异步下载，由于 DOM 树的解析和构建此步与 css 并无关系，故并不会影响 DOM 解析，但最终布局树需要 DOM 树和 DOM 样式的，因此 CSS 会阻塞布局树的建立；

然后，当浏览器在解析到  `script ` 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始(即 script 会阻塞页面渲染)；

- 因为：JS属于单线程，在加载 `script` 标签内容时，渲染线程会被暂停，因 `script`标签中内容可能会操作`DOM`，若加载`script`标签的同时渲染页面就会产生冲突，渲染线程(`GUI`)和 JS 引擎线程是互斥的；
- 优化：若想首屏渲染快，一般而言不应在首屏时就加载 JS 文件，而将 `script` 标签放在 `body` 标签底部；
- 优化：若想首屏渲染快，亦可给 `script` 标签添加 `defer` 或 `async` 属性：
  - `defer` 属性：表示该 JS 文件会并行下载，但会放到 HTML 解析完成后顺序执行，此时 `script` 标签可放在任意位置；
  - `async` 属性：对于没有任何依赖的 JS 文件可加上此属性 ，表示 JS 文件下载和解析不会阻塞渲染；
  - 注意：一般脚本与 DOM 元素和其它脚本间的依赖关系不强时会选用 async；当脚本依赖于 DOM 元素和其它脚本的执行结果时会选用 defer；

**<u>关键渲染路径问题</u>**

不考虑缓存和优化网络协议，只考虑可以通过哪些方式来最快的渲染页面：

- 从文件大小：前略；
- 从 `script` 标签使用：前略；
- 从 CSS、HTML 的代码书写：前略；
- 从需要下载的内容是否需要在首屏使用：前略；

**<u>DOM 树的构建是文档加载何时开始：</u>** 

- 构建 `DOM` 树是一渐进过程，为达到更好用户体验，渲染引擎会尽快将内容显示在屏幕上，而不必等到整个 `HTML` 文档解析完后才开始构建与布局；

<u>**三树构建顺序关系：**</u> 

- 三个过程在实际进行的时候并不是完全独立的，而是交叉，一边加载，一边解析，一边渲染；









































