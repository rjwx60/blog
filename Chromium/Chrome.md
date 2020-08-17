---
typora-root-url: ../Source
---



### 一、基本



### 二、浏览器缓存

浏览器中的缓存作用分为 2 种情况，一种是需要发送 HTTP 请求(强缓)，另一种则不用(协缓)；

#### 2-1、强缓存

首先检查强缓存，通过检查字段来实现；但注意 HTTP/1.0 和 HTTP/1.1 所检查的字段不一样：

##### 2-1-1、Expires—HTTP/1.0时期

Expires 即过期时间，告知浏览器在此日期前可直接从缓存中获取数据，而无需再次请求；

**<u>缺点</u>**：**服务器时间与浏览器本地时间可能不一致(修改时间会使缓存失效)**，即时间计算基准不同就会有问题 (已在 HTTP/1.1版本抛弃)

```http
// 位于服务端返回的响应头
// 表示资源在 2020 年 07 月 21 号 8 点 41 分过期，若过期就得向服务端请求重新获取资源
Expires: Tue, 21 July 2020 08:41:00 GMT
```



##### 2-1-2、Cache-Control—HTTP/1.1时期

采用字段 Cache-Control 控制缓存，并用属性 **max-age** 表示缓存过期时间(与 Expires 不同，采用时间段而非具体时间点)；

```
// 位于服务端返回的响应头
// 表示从收到此响应开始计算，往后的 3600 秒内，均可直接使用缓存
Cache-Control:max-age=3600
```

Cache-Control 还有诸多属性值来对缓存作更细粒度的操作：

- **public**：客户端、中间代理服务器均允许缓存资源；
- **private**：只有客户端能缓存，中间代理服务器不能缓存；
- **no-cache**：跳过当前强缓存检查阶段，直接发送 HTTP 请求，即直接进入协商缓存阶段；
- **no-store**：不进行任何形式的缓存；
- **s-max-age**：作用同 max-age，但针对对象是代理服务器；
- 注意：若 **Expires** 和 **Cache-Control** 同时存在，则优先考虑 **Cache-Control**；



#### 2-2、协商缓存

即若强缓存失效，即资源缓存超时，浏览器在请求头中携带相应的 <u>缓存tag</u> 来向服务器发请求，服务器根据此 tag，来告知浏览器是否继续使用缓存；缓存 Tag 有两种，无分优劣， **Last-Modified**、 **ETag**

<img src="/Image/Chromium/22.png" style="zoom:50%;" align="left"/>

##### 2-2-1、Last-Modified

响应报文字段，表示资源最后修改时间；使用机制如下：

- 首先，当浏览器首次向服务器发送请求后，服务器会在响应头中加上此字段；
- 然后，而浏览器接收到后，若再次请求，则会在请求头中携带  **If-Modified-Since** 字段，此字段值即服务器传来的最后修改时间；

- 然后，服务器拿到  请求头中的 **If-Modified-Since** 字段，<u>随即与服务器中该资源的最后修改时间作对比</u>:
  - 若请求头中的值 < 服务器上的最后修改时间，即说明资源已更新，服务端返回新资源，与常规 HTTP 请求响应流程一致；
  - 否则返回 304 状态码，告诉浏览器直接用缓存；

##### 2-2-2、ETag

响应报文字段，此字段是服务器基于当前文件内容，给文件生成的唯一标识，即值会随内容更新而改变；使用机制如下：

- 首先，浏览器接收到 **ETag** 值，若再次请求，则会在请求头中携带 **If-None-Match**  字段，此字段值即 **ETag** 值；
- 然后，服务器接收到 **If-None-Match **后，<u>随即与服务器中该资源的 ETag 作对比</u>: 
  - 若两者不相同，即说明资源已更新，服务端返回新资源，与常规 HTTP 请求响应流程一致；
  - 否则返回 304 状态码，告诉浏览器直接用缓存；

##### 2-2-3、两者对比

- 精度上，<u>**ETag** 优于 **Last-Modified**</u>：原因是前者按照内容给资源上标识，能准确感知资源变化，而后者在某些特殊情况下无法准确感知资源变化：
  - **<u>不该重新请求时，重新请求：</u>**编辑文件，但实际上文件内容并无变更，服务端并不清楚文件是否真正改变，仍通过最后编辑时间进行判断，此时资源再次被请求时，会被当做新资源处理，缓存作用失效；
  - **<u>该重新请求时，无重新请求：</u>**Last-Modified 能感知的最小单位时间是秒，若文件在 1 秒内发生多次改变则无法表现出修改，具有局限性；
- 性能上，<u>**Last-Modified** 优于 **ETag**</u>：前者仅记录时间点，而后者需要服务器根据文件具体内容生成唯一哈希值；
- 优先上，若两种方式均支持，服务器会<u>优先考虑 **ETag 机制 (客户端接收角度为 ETag 优先，服务端接收角度为 If-None-Match 优先)**；</u>



#### 2-3、缓存存放位置

浏览器中的缓存位置一共有四种，按优先级从高到低排列分别是：

- Service Worker
- Memory Cache
- Disk Cache
- Push Cache
- 网络请求



##### 2-3-1、Service Worker 

**Service Worker**：与 Web Worker类似，是独立的线程(无法直接访问 DOM，无法干扰页面性能)，可帮助实现：<u>离线缓存</u>、<u>消息推送</u>、<u>网络代理</u> 等功能；借助 Service worker 实现的离线缓存即称 <u>Service Worker Cache</u>：可自由选择缓存哪些文件，以及文件的匹配与读取规则，且缓存是持续性的；SW 特点如下:

- 借鉴 `Web Worker` 思路，且是 `PWA` 重要实现机制；

- 使用 `Service Worker` 会涉及到请求拦截，所以需要用 HTTPS 协议来保证安全，即传输协议必须是 `HTTPS`；

- 生命周期包括： install、active、working 三个阶段；一旦 Service Worker 被 install，就将始终存在，只会在 active 与 working 间切换，除非主动终止；这是它可用来实现 <u>离线存储</u> 的重要先决条件；

  

##### 2-3-2、Memory Cache

**Memory Cache**：即内存缓存，<u>存取效率最高、但存活时间最短</u>，非持续性，随进程释放而释放；

主要存储当前页面已抓取到的资源, 比如已下载的样式、脚本、图片；特点如下：

- 存取效率快，但缓存持续时间短，会随着进程释放而释放(一旦关闭 Tab 页即被释放，未关闭但, 排在前排缓存失效)；
- 从其中读取缓存时，浏览器会忽视 `Cache-Control`中的一些 `max-age、no-cache` 等头部配置, 除非设置  `no-store` 头部配置；
- 几乎所有的请求资源都能进入 <u>Memory Cache</u>，主要分为 <u>preloader</u> 、<u>preload</u> ：
  - preloader：用于 <u>当浏览器打开网页时，能边解析执行 js/css，边请求下一资源</u>，被请求的资源会被放入 `Memory Cache` 中，供后续解析执行操作使用；
  - preload：用于显式指定预加载的资源，比如： `<link rel="preload">`



##### 2-3-3、Disk Cache / HTTP Cache

**Disk Cache**：即存储在磁盘中的缓存，<u>存取效率较低，但存储容量大和存储持续时间长</u>；

会根据 HTTP header 中的缓存字段来判断哪些资源需要缓存、哪些不需要请求而直接使用、哪些已过期需要重新获取，而若是命中缓存，浏览器会从硬盘中直接读取资源，虽无从内存中读取的快，但却比网络缓存快；

- 注意：强缓存、协商缓存也是属于 `Disk Cache`，它们最终都存储在硬盘里；
- 区别：Memory Cache 与 Disk Cache 存储位置选择的策略如下：
  - 较大的 JS、CSS 文件会直接存入磁盘，反之内存；
  - 当系统内存使用率比较高时，文件优先放入磁盘；



##### 2-3-4、Push Cache

Push Cache 是指 HTTP2 在 server push 阶段存在的缓存，是浏览器缓存最后一道防线(国内尚未普及)，([资料1](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/)、[资料2](https://www.jianshu.com/p/54cc04190252))：

- Push Cache 是缓存的最后一道防线；浏览器只有在 Memory Cache、HTTP Cache 和 Service Worker Cache 均未命中的情况下才会去询问 Push Cache；
- Push Cache 是一种存在于会话—Session 阶段的缓存，当 session 终止时(关闭连接、关闭 Tab)，缓存也随之释放，且缓存时间短暂(Chrome 中只有5分钟)；
- 不同的页面只要共享同一个 HTTP2 连接，则就可共享同一个 Push Cache；
  - 注意：视浏览器实现而定，某些浏览器出于对性能考虑，会对相同域名但不同 Tab 标签使用同一 HTTP 连接；

- 所有资源都能被推送，且能够被缓存，但 Edge 和 Safari 支持相对较差
- 可推送 no-cache 和 no-store 资源；
- Push Cache 中的缓存只能被使用一次；
- 浏览器可以拒绝接收已存在的资源推送；
- 可以给其他域名推送资源；





### 2-4、实际应用与场景

##### 2-4-1、实际应用

- 频繁变动的资源使用：`Cache-Control: no-cache`；
  - 注意：使得浏览器每次都请求服务器，然后配合 `ETag` 或 `Last-Modified` 来验证资源是否有效；虽不能节省请求数量，但能显著减少响应数据大小；
- 不频繁变动的资源使用：`Cache-Control: max-age=31536000`，一年的总秒数…
  - 注意：为解决更新问题，可在文件名添加 `hash`、版本号等动态字段，以实现更改 <u>引用URL</u> 目的(实现更新内容-重新请求资源)；



##### 2-4-2、用户场景

- 地址输入栏：先查找 Disk Cache 是否有匹配，否则发送请求； 
- 普通 F5 刷新：优先使用 Memory Cache，其次是 Disk Cache；
- 强制 CtrlF5 刷新：浏览器不使用缓存



#### 2-5、缓存过程总结

首次，浏览器发起 HTTP 请求到获得请求结果，可分为以下几个过程：

- 首先，浏览器首次发起 HTTP 请求，在浏览器缓存中没有发现请求的缓存结果和缓存标识；
- 然后，浏览器向服务器发起 HTTP 请求，获得该请求响应与缓存规则(即 `Last-Modified` 或 `ETag`)；
- 然后，浏览器将响应内容存入 `Disk Cache`，将响应内容的引用，存入 `Memory Cache`；
- 最后，将响应内容存入 `Service Worker` 的 `Cache Storage`  (若 `Service Worker` 的脚本调用了 `cache.put()`)

然后，在下一次请求相同资源时:

- 调用 `Service Worker` 的 `fetch `  事件响应；
- 查看 `Memory Cache`
- 查看 `Disk Cache`，并通过 **Cache-Control** 验证 <u>强缓存</u> 是否可用
  - 若可用，直接使用，返回 200 状态码
  - 否则进入 <u>协商缓存</u>，即发送 HTTP 请求，服务器通过请求头中的 **If-Modified-Since** 或 **If-None-Match** 字段检查资源是否更新
    - 若资源更新，返回资源和  200 状态码；
    - 否则，返回 304 状态码，告诉浏览器直接从缓存获取资源；

<img src="/Image/Chromium/16.png" style="zoom:40%;" align="left" />





### 三、浏览器存储

浏览器的本地存储主要分为： **Cookie**、**WebStorage(可再分为 localStorage 和 sessionStorage)**、**IndexedDB**；

#### 3-1、Cookie

Cookie 设计之处并非用于本地存储，而是为了弥补 HTTP 在状态管理上的不足(无状态协议，服务端无法辨别每次请求的客户端的具体情况)；

Cookie 本质是浏览器中存储的一个很小的、内容以键值对形式存储的文本文件，每次向同一域名发送请求，均会自动携带相同 Cookie，服务器拿到 Cookie 后进行解析，即可获取客户端状态；即 Cookie 用于 <u>状态存储</u>，但缺点有如下：

- 容量缺陷：体积上限只有`4KB`，只能存储少量信息；
- 性能缺陷：Cookie 紧跟域名发送而不管是否真正需要，随着请求数增多性能浪费越严重——请求携带不必要数据；
- 安全缺陷：Cookie 纯文本形式，在飞行途中很容易被非法用户截获篡改，在有效期内发送给服务器更是危险操作；
  - 此外，若 **HttpOnly** 字段为 false，Cookie 信息还可直接通过 JS 脚本来读取；



#### 3-2、localStorage

##### 3-2-1、与 Cookie 的异同

同一个域名下，会存储相同一段 **localStorage / Cookie**，而不同在：

- 容量：针对每个域名，均有上限为 5M 的存储容量；
- 安全：只存在客户端，默认不参与与服务端通信；
- 接口：接口友好，通过 `localStorage` 全局暴露，拥有诸多方法可供操作(Cookie 只能自定义)；

##### 3-2-2、操作方式

**localStorage**  存储的都是字符串，若是存储对象需要调用 `JSON.stringify`方法，并且用 `JSON.parse `来解析成对象；

##### 3-2-3、应用场景

适合存储一些内容稳定的资源，比如官网的`logo`，存储`Base64`格式的图片资源，因此利用`localStorage`；



#### 3-3、sessionStorage

##### 3-3-1、与 sessionStorage 的异同

最大区别在：**sessionStorage** 只是会话级别的存储，并非持久化存储，一旦会话结束(当前 tab 页面关闭)就消失；

- 容量：容量上限也为 5M；
- 安全：只存在客户端，默认不参与与服务端的通信；
- 接口：接口友好，类似 **localStorage**；

##### 3-3-2、应用场景

- 表单信息进行维护：将表单信息存储在里面，可保证页面即使刷新也不会让先前表单信息丢失；
- 存储本次浏览记录：因关闭页面后不需要这些记录；



#### 3-5、IndexedDB

其实运行在浏览器中的 <u>非关系型数据库</u>，理论上容量是无上限；[使用文档](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)，其拥有数据库本身的特性，比如：支持事务，存储二进制数据，还有其他特殊特性：

- 键值对存储：内部采用 <u>对象仓库</u> 存放数据，在此仓库中数据采用 <u>键值对</u> 形式存储；
- 异步操作：数据库的读写属于 I/O 操作，浏览器中对异步 I/O 提供了支持；
- 受同源策略限制，无法访问跨域的数据库；



#### 3-6、总结

- Cookie 并不适合存储，而且存在非常多的缺陷；
- Web Storage 包括 localStorage 和 sessionStorage，默认不会参与和服务器的通信；
- IndexedDB 为运行在浏览器上的非关系型数据库，为大型数据的存储提供了接口；





### 四、浏览器跨域

浏览器遵循 **同源政策(scheme(协议)、host(主机)、port(端口)三种均同)**，而非同源站点有如下限制:

- 不能读取和修改对方的 DOM；
- 不读访问对方的 Cookie、IndexDB 和 LocalStorage；
- 限制 XMLHttpRequest 请求；

而当浏览器发起某次 Ajax 请求(<u>跨域请求</u>)时，只要当前 URL 和目标 URL 不同源，就会产生 **跨域**，表现为：请求发出，服务器也成功响应，但前端就是拿不到响应；实际上，跨域请求的响应已到达客户端，只是被浏览器所拦截 (跨域是由于浏览器的同源策略引起的)；



#### 4-1、跨域拦截机制

<img src="/Image/Chromium/5.png" style="zoom:50%;" align="left"/>



- 首先，浏览器是多进程的，而 WebKit 渲染引擎 和 V8 引擎 都在渲染进程当中；所以当 `xhr.send` 被调用时(即请求准备发送时)，尚在渲染进程的处理；
  - 注意：为防止黑客通过脚本触碰系统资源，浏览器将每一<u>渲染进程分配进沙箱</u>，同时为防止 CPU 芯片一直存在的 <u>Spectre</u> 和  <u>Meltdown</u> 漏洞，采取 <u>站点隔离</u>  的手段，给每一<u>不同站点(一级域名不同)分配沙箱</u>，使其互不干扰；[YouTube上Chromium安全团队的演讲视频](https://www.youtube.com/watch?v=dBuykrdhK-A&feature=emb_logo)；
- 然后，沙箱中的渲染进程无法发送网络请求(只能通过网络进程来发送)，所以就需要 **<u>进程间通信(IPC，Inter Process Communication)</u>**， 来将数据传递给浏览器主进程，主进程接收到后，才真正地发出相应网络请求；chromium  中进程间通信的源码调用顺序如下：[IPC源码地址](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/ipc/)、[Chromium IPC源码解析文章](https://blog.csdn.net/Luoshengyang/article/details/47822689)；
  - <img src="/Image/Chromium/6.png" style="zoom:50%;" align="left"/>
  - 总结：利用 `Unix Domain Socket`套接字，配合事件驱动的高性能网络并发库  `libevent` 完成进程通信 IPC 过程；
- 最后，服务端处理完并将响应返回，主进程检查到跨域行为，且无配置 CORS 响应头，遂将响应体全部丢弃，而不会发往渲染进程，实现了拦截数据的目的；



#### 4-2、跨域操作方案

##### 4-2-1、CORS

CORS—跨域资源共享，是 W3C 标准之一，其允许浏览器向跨源服务器，发出 `XMLHttpRequest` 或 `Fetch` 请求，且整个 `CORS` 通信过程均由浏览器自动完成，无需要用户参与；**<u>完成 CORS 须要前提</u>**：浏览器须支持此功能：<u>**非 IE 和 IE10 以上**</u>、且服务器端也须同意此种跨域请求：<u>**服务器需附加特定的响应头**</u>；[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Preflighted_requests)

- **Access-Control-Allow-Origin**：表示可允许请求的源；可填具体源名，亦可填 `*` 表示允许任意源请求；
- **Access-Control-Allow-Methods**：表示允许的请求方法列表；
- **Access-Control-Allow-Headers**：表示允许发送的请求头字段；
- **Access-Control-Allow-Credentials**：略；
- **Access-Control-Max-Age**：表示预检请求的有效期，在此期间，不必发出另外一条预检请求；



##### 4-2-1-1、一般流程

- 首先，客户端先根据同源策略，对前端请求 URL 与后台交互地址 API 做匹配：
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



注意：浏览器根据跨域请求方法和跨域请求头的特定字段，将跨域请求分为两类，凡满足下面条件的属于 **<u>简单请求</u>**，否则为 **<u>非简单请求</u>**，前者只是单纯请求，后者则会先使用 `OPTIONS` 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求，避免跨域请求对服务器的用户数据产生未预期的影响；

- 请求方法为 GET、POST、HEAD 之一；
- 请求头取值范围：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`DPR`、`Downlink`、`Save-Data`、`Viewport-Width`、`Width`
  - 注意：`Content-Type` 仅限3值：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
- 请求中的任意 [XMLHttpRequestUpload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象均无注册任何事件监听器；[XMLHttpRequestUpload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象可使用 [XMLHttpRequest.upload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 属性访问；
- 请求中没有使用 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象



##### 4-2-1-2、简单请求

在请求发出前，浏览器会自动为请求头中，添加字段 `Origin`，用以说明请求来源；当服务器拿到请求并回应时，会相应地添加字段 `Access-Control-Allow-Origin`，并设置字段值(或请求 Origin 值，或别的值)；然后，当浏览器收到时，若发现 `Origin` 的值不在此字段范围内时，就会将响应拦截；所以，**<u>字段 `Access-Control-Allow-Origin` 是服务器用来决定浏览器是否拦截此响应的必需字段</u>**；

```javascript
// 1、./index
...
<a href="/cors">CORS跨域</a>
...

// 1-1、./cors/index
...
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<button id="getName">get name</button>
<script>
  getName.onclick = () => {
  // 简单请求
  axios.get("http://127.0.0.1:8080/api/corsname");
}
</script>
...

// 2、client.js
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();

app.use(async (ctx) => {
  if (ctx.method === 'GET' && ctx.path === '/') {
    ctx.body = fs.readFileSync('./index.html').toString();
  }
  if (ctx.method === 'GET' && ctx.path === '/cors') {
    ctx.body = fs.readFileSync('./cors/index.html').toString();
  }
})
console.log('client 8000...')
app.listen(8000);


// 3、server.js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  // 关键之处:
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
  await next();
  if (ctx.path === '/api/corsname') {
    ctx.body = {
      data: 'Test'
    }
    return;
  }
})
console.log('server 8080...')
app.listen(8080);
```

此外，还有其他可选的功能性字段，用以描述若不拦截时，则字段将会发挥各自的作用：

- **Access-Control-Allow-Credentials**：布尔值，表示是否允许发送 Cookie，对于跨域请求，浏览器默认值设为 false，否则需要设置为 true，并需在前端也需设置 `withCredentials` 属性:

```http
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

- **Access-Control-Expose-Headers**：给 XMLHttpRequest 对象赋能，使此对象不仅可拿到基本的 6 个响应头字段(`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`)，还可拿到此字段声明的 **响应头字段**：

```http
// 服务端设置响应
Access-Control-Expose-Headers: xxx
// 前端可通过 `XMLHttpRequest.getResponseHeader('xxx')` 拿到 `xxx` 这个字段的值
```





##### 4-2-2-3、非简单请求

非简单请求不同于简单请求，前者只是单纯请求，后者则会先使用 `OPTIONS` 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求，避免跨域请求对服务器的用户数据产生未预期的影响；即主要体现在两方面：**<u>预检请求</u>**、**<u>响应字段</u>**，主流程是：

- 首先，客户端先发送 <u>**预检请求(而非实际请求)**</u>，用以告知服务器接下来的 CORS 请求的具体信息(方法、请求头)；
  - Access-Control-Request-Method：指出 (接下来的)CORS 请求用到哪个 HTTP 方法；
  - Access-Control-Request-Headers：指出 (接下来的)CORS 请求将要加上什么请求头；

```javascript
// 以非简单请求 PUT 方法为例
var url = 'http://xxx.com';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'xxx');
xhr.send();
```

```http
// 预检请求请求头 - 代码执行后浏览器随即自动发送 预检请求
// 预检请求方法为 OPTIONS
OPTIONS / HTTP/1.1
Origin: 源地址
Host: xxx.com - 目的地址
Access-Control-Request-Method: PUT - 非简单请求标志之一
Access-Control-Request-Headers: X-Custom-Header - 非简单请求标志之一
```

- 然后，服务端接收并返回 <u>**预检请求的响应**</u>，客户端检查此响应：
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

- Access-Control-Allow-Credentials：略；

- Access-Control-Allow-Methods：表示允许的请求方法列表；
- Access-Control-Allow-Headers：表示允许发送的请求头字段；
- Access-Control-Max-Age：表示预检请求的有效期，在此期间，不必发出另外一条预检请求；
- Access-Control-Allow-Origin：表示可允许请求的源；可填具体源名，亦可填 `*` 表示允许任意源请求；
- 最后，若一切允许，则客户端发送真正的 CORS 跨域请求：流程同简单请求：客户端自动加上 `Origin` 字段，服务端返回  `Access-Control-Allow-Origin`；



##### 4-2-2-4、注意事项

##### 4-2-2-4-1、减少预检请求次数：

- 尽量发出简单请求；
- 服务端设置 `Access-Control-Max-Age` 字段：在有效时间内浏览器无需再为同一请求发送预检请求；
  - 局限性：只能为同一请求缓存，无法针对整个域或模糊匹配 URL 做缓存；

##### 4-2-2-4-2、携带身份凭证

跨域 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 或 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 请求，浏览器默认 **<u>不会</u> **发送身份凭证信息比如 Cookie，若要坚持发送凭证信息，则需满足 3 个条件：

- 客户端请求头设置 `withCredentials` 为 `true`；
- 服务器设置首部字段 `Access-Control-Allow-Credentials` 为 `true`；
- 服务器的 `Access-Control-Allow-Origin` 不能为 `*`；

```javascript
// 1、login
...
<script>
// 关键 1:
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8080'
login.onclick = () => {
	axios.post('/api/login')
}
</script>
...

// 2、server.js
const Koa = require("koa");
const router = require("koa-router")();
const koaBody = require("koa-body");
const app = new Koa();
const TOKEN = "xxxxxxx-yyyyyyy-zzzzzzzz";

app.use(async (ctx, next) => {
  // 关键 2:
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin);
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Access, cc"
  );
  // 关键 3: 
  ctx.set("Access-Control-Allow-Credentials", true);
});
app.use(async (ctx, next) => {
  // 若是登录接口则跳过后面的token验证
  if (ctx.path === "/api/login") {
    await next();
    return;
  }
  // 对所有非登录的请求验证 token
  const cookies = ctx.cookies.get("token");
  console.log(cookies);
  if (cookies && cookies === TOKEN) {
    await next();
    return;
  }
  ctx.body = {
    code: 401,
    msg: "权限错误",
  };
  return;
});
// 若不加 multipart：true ctx.request.body 会获取不到值
app.use(koaBody({ multipart: true }));

router.get("/api/corsname", async (ctx) => {
  ctx.body = {
    data: "Test",
  };
});

router.post("/api/login", async (ctx) => {
  ctx.cookies.set("token", TOKEN, {
    expires: new Date(+new Date() + 1000 * 60 * 60 * 24 * 7),
  });
  ctx.body = {
    msg: "成功",
    code: 0,
  };
});

app.use(router.routes());
console.log("server 8080...");
app.listen(8080);
```





##### 4-2-2、JSONP

XMLHttpRequest 对象遵循同源政策，但 `script` 标签没有跨域限制，可通过 src 填上目标地址发出 GET 请求，实现跨域请求，也即 JSONP 原理，最大优势是兼容性好(兼容 IE 低版本)，但缺点也明显：只支持 GET 请求；

- 首先，前端定义一个解析函数；比如： `jsonpCallback = function (res) {}`
- 然后，通过 `params`  的形式包装 `script` 标签的请求参数，并声明为上述执行函数名；比如：`cb=jsonpCallback`；
- 然后，后端获取到前端声明的执行函数(`jsonpCallback`)，并以带上参数且调用执行函数的方式传递给前端
- 最后，前端在 `script` 标签请求返回资源时就会去执行 `jsonpCallback`，并通过回调的方式拿到数据；

```html
// 1、创建全局函数，等待执行
<script type='text/javascript'>
    window.jsonpCallback = function (res) {
        console.log(res)
    }
</script>
// 2、构建请求脚本，等待请求内容返回
<script src='http://localhost:8080/api/jsonp?id=1&cb=jsonpCallback' type='text/javascript'></script>
// 3、服务端拿到 URL 参数，处理请求，最后在响应体中写入 jsonpCallback(...)，并将处理后的内容以函数参数形式传入
// 4、前端拿到后台内容并执行，执行调用全局函数，并将参数传入函数中执行；
```

```javascript
// 1、前端
const jsonp = ({ url, params, callbackName }) => {
  const generateURL = () => {
    let dataStr = '';
    for(let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callbackName}`;
    return `${url}?${dataStr}`;
  };
  return new Promise((resolve, reject) => {
    // 初始化回调函数名称
    callbackName = callbackName || Math.random().toString.replace(',', ''); 
    // 创建 script 元素并加入到当前文档中
    let scriptEle = document.createElement('script');
    scriptEle.src = generateURL();
    document.body.appendChild(scriptEle);
    // 绑定到 window 上，为了后面调用
    window[callbackName] = (data) => {
      resolve(data);
      // script 执行完了，成为无用元素，需要清除
      document.body.removeChild(scriptEle);
    }
  });
}

// 3、调用
jsonp({
  url: 'http://localhost:3000',
  params: { 
    a: 1,
    b: 2
  }
}).then(data => {
  // 拿到数据进行处理
  console.log(data); // 数据包
})
```

```javascript
// 2、后端
let express = require('express')
let app = express()
app.get('/', function(req, res) {
  let { a, b, callback } = req.query
  console.log(a); // 1
  console.log(b); // 2
  // 注意哦，返回给 script 标签，浏览器直接把这部分字符串执行
  res.end(`${callback}('数据包')`);
})
app.listen(3000)
```

[JSONP 封装]([https://github.com/LinDaiDai/niubility-coding-js/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%B7%A8%E5%9F%9F/JSONP%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0.md](https://github.com/LinDaiDai/niubility-coding-js/blob/master/计算机网络/跨域/JSONP原理及实现.md))



##### 4-2-3、Nginx 代理服务

- 正向代理服务器是帮助 **客户端**，访问自身无法访问的服务器并将结果返回客户端；
- 反向代理服务器是帮助其他 **服务器**，获取到客户端发送请求并转交服务器；

<img src="/Image/Chromium/7.png" style="zoom:40%;" align="left"/>

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



##### 4-2-4、题外话

其实还有一些不太常用的方式，大家了解即可，比如`postMessage`，当然`WebSocket`也是一种方式，但是已经不属于 HTTP 的范畴，另外一些奇技淫巧就不建议大家去死记硬背了，一方面从来不用，名字都难得记住，另一方面临时背下来，面试官也不会对你印象加分，因为看得出来是背的。当然没有背并不代表减分，把跨域原理和前面三种主要的跨域方式理解清楚，经得起更深一步的推敲，反而会让别人觉得你是一个靠谱的人。



#### 4-X、跨标签通讯

不同标签页间的通讯，本质原理就是去运用一些可以 <u>共享的中间介质</u>，常用以下方法:

- 通过父页面 `window.open()`和子页面 `postMessage`；
  - 异步下，通过 `window.open('about: blank')` 和 `tab.location.href = '*'；`
- 设置同域下共享的 `localStorage `与监听  `window.onstorage`；
  - 重复写入相同的值无法触发；
  - 会受到浏览器隐身模式等的限制；
- 设置共享 `cookie ` 与不断轮询脏检查( `setInterval `)；
- 借助服务端或者中间层实现；



### 五、浏览器应用

#### 5-1、防抖与节流

防抖与节流函数是一种最常用的 **高频触发优化方式**，均为缓解函数频繁调用、在时间轴上控制函数的执行次数、控制事件触发频率；

<img src="/Image/Chromium/333.png" style="zoom:50%;" align="left"/>



##### 5-1-1、防抖 (debounce)

基本：等待一定时间再触发，概念衍生自机械开关和继电器的 "去弹跳"(debounce)；

<u>防抖，即短时间内大量触发同一事件，只会执行一次函数，将多次高频操作优化为只在最后一次执行；</u>

原理：为设置一个定时器，约定在xx毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到xx毫秒内无第二次操作；

场景：输入验证过滤、表单提交、滚动条的监听事件处理、只需再输入完成后做一次输入校验即可；

- 按钮提交场景：防止多次提交按钮，只执行最后提交的一次、表单验证
- 后台验证场景：表单验证需要服务端配合，只执行一段连续的输入事件的最后一次，还有搜索联想词功能类似
- 用户窗口缩放：resize事件(如窗口停止改变大小之后重新计算布局)等，没错，这里也可以用防抖
- 搜索输入查询：用户在输入时，没有必要不停地调用去请求服务端接口，等用户停止输入的时候，再调用，设置一个合适的时间间隔，有效减轻服务端压力
- 更多：[input 搜索防抖处理中文输入](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/129) - <u>提示：利用 e.target.compositionstart-ed 事件</u>

```js
// 思路：每次触发事件时都取消之前的延时调用方法；
// 思路：将多个信号合并成一个信号；防抖意味着 N 秒内函数只会被执行一次，若 N 秒内再次被触发，则重新计算延迟时间；
// 思路：持续触发不执行、不触发一段时间后再执行；

// 实现1
function debounce(func, wait) {
    let timeout = null
    // 将 debounce 处理结果当做函数返回
    return function() {
      	// 保留调用时的 this 上下文
        let context = this
        // 保留调用时传入的参数
        let args = arguments
        // 事件触发时清除先前旧的定时器
        if (timeout) clearTimeout(timeout)
      	// 设立新定时器
        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
}

// 实现2
function debounce(fn, wait, immediate) {
    let timer = null
    return function() {
        let args = arguments
        let context = this
        if (immediate && !timer) {
            fn.apply(context, args)
        }
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, wait)
    }
}

// 实现3
function debounce(func, wait) {
  let timeout;
  return function() {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
// 使用
window.onscroll = debounce(function() {
  console.log('debounce');
}, 1000);
// 使用2
document.addEventListener('scroll', debounce(() => consol.log('debounce done'), 1000));
```

<img src="/Image/Chromium/334.png" style="zoom:80%;" align="left"/>



##### 5-1-2、节流 (throttle)

区别：防抖是延迟执行，而节流是间隔执行；防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器；

<u>节流，即每隔一段时间就执行一次；每隔一段时间后执行一次，也就是降低频率(稀释函数的执行频率)，将高频操作优化成低频操作；</u>

原理：设置一个定时器，约定xx毫秒后执行事件，若时间到了，则执行函数并重置定时器；

场景：滚动条事件、resize 事件，通常每隔 100~500 ms 执行一次即可；

- 拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动
- 缩放场景：监控浏览器resize
- 动画场景：避免短时间内多次触发动画引起性能问题
- 其他场景：按钮点击事件、拖拽事件、onScoll、计算鼠标移动的距离(mousemove)

```js
// 思路：每次触发事件时都判断当前是否有等待执行的延时函数；
// 思路：规定在单位时间内，只能触发一次函数，若这个单位时间内触发多次函数，只有一次生效；
// 思路：持续触发并不会执行多次，到一定时间再去执行；

// 实现1
function throttle(func, wait) {
    let timeout = null
    return function() {
        let context = this
        let args = arguments
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null
                func.apply(context, args)
            }, wait)
        }

    }
}

// 实现2
// 使用两个时间戳 prev 旧时间戳和 now 新时间戳，每次触发事件都判断二者的时间差，如果到达规定时间，执行函数并重置旧时间戳
function throttle(func, wait) {
    var prev = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - prev > wait) {
            func.apply(context, args);
            prev = now;
        }
    }
}


// 实现3
function throttle(fn, wait, immediate) {
    let timer = null
    let callNow = immediate
    
    return function() {
        let context = this,
            args = arguments

        if (callNow) {
            fn.apply(context, args)
            callNow = false
        }

        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args)
                timer = null
            }, wait)
        }
    }
}

// 实现4
function throttle(fn, delay) {
  var prevTime = Date.now();
  return function() {
    var curTime = Date.now();
    if (curTime - prevTime >= delay) {
      fn.apply(this, arguments);
      prevTime = curTime;
    }
  };
}
// 实现5
function throttle(fn, delay = 500) {
  let flag = true;
  return function() {
    if(!flag) return;
    flag = false
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, delay);
  };
}
// ES6
const throttle = (fn, delay = 500) => {
  let flag = true;
  return (...args) => {
    if(!flag) return;
    flag = false
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
}
// 实现6


// 使用
var throtteScroll = throttle(function() {
  console.log('throtte');
}, 1000);
window.onscroll = throtteScroll;
```

<img src="/Image/Chromium/335.png" style="zoom:50%;" align="left"/>

<img src="/Image/Chromium/336.png" style="zoom:50%;" align="left"/>



5-1-3、用 Throttle 来优化 Debbounce

<img src="/Image/Chromium/337.png" style="zoom:50%;" align="left"/>





#### 5-2、图片懒加载

#### 5-3、WebWorker

现代浏览器为 JS 创造的 **多线程环境**；可新建并将部分任务分配到`worker`线程并行运行，两个线程可 **独立运行，互不干扰**，可通过自带的 **消息机制** 相互通信；

- 同源限制
- 无法使用 `document` / `window` / `alert` / `confirm`
- 无法加载本地资源

```js
// 创建 worker
const worker = new Worker('work.js');

// 向 worker 线程推送消息
worker.postMessage('Hello World');

// 监听 worker 线程发送过来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
}
```




### 六、输入URL到展示过程

- DNS 解析：通过域名查询到具体的 IP (详看 DNS 章节)
  - 操作系统会在本地缓存中查询 IP；若无则去系统配置的 DNS 服务器中查询；若无则直接去 DNS <u>根服务器查询</u>，查询会找出负责 `com` 这个一级域名的服务器；然后去 <u>一级域名服务器</u> 查询 `google` 这个二级域名，直至找到最终匹配域名 IP；
  - 上述为 DNS 迭代查询，还有种递归查询，区别是前者是由客户端发起请求，后者是由系统配置的 DNS 服务器做请求，得到结果后将数据返回给客户端；
- TCP 三次握手；
  - 应用层会下发数据给传输层，TCP 协议会指明两端的端口号，然后下发给网络层；网络层中的 IP 协议会确定 IP 地址，并且指示数据传输中如何跳转路由器；然后包会再被封装到数据链路层的数据帧结构中，最后就是物理层面的传输；
- TLS 握手；握手流程与加密方式发展；
- 分析 URL，设置请求报文(头，主体)，发送请求；
- 服务器响应；
- 浏览器解析与渲染；
  - 解析时，若是 gzip 格式的话则先解压，然后通过文件的编码格式知道该如何去解码文件；
  - 若遇到 script 标签，判断是否存在 async 或 defer ：
    - 前者会并行进行下载和执行 JS，后者会先下载文件，后等待 HTML 解析完成后顺序执行；否则阻塞渲染；
  - HTML parser --> DOM Tree
    - 标记化算法，进行元素状态的标记；
    - DOM 树构建；
  - CSS parser --> Style Tree
    - 解析 CSS 代码，生成样式树；
  - attachment --> Render Tree
    - 结合 DOM 树 与 style 树，生成渲染树；
  - Layout：布局
  - GPU painting: 像素绘制页面



#### 6-1、网络相关

##### 6-1-1、网络请求

- 构建请求：浏览器会构建请求行 `GET / HTTP/1.1`

- 查找强缓存：检查强缓存，若命中直接使用，否则进入下一步；

- DNS 解析：域名与 IP 的转换系统，但浏览器提供 <u>DNS数据缓存功能</u>，若某域名已解析过，则会将结果缓存再利用；默认端口 80；

- 建立 TCP 连接：Chrome 在同一域名下要求同时最多只能有 6 个 TCP 连接，超过则需等待；<u>详看 TCP 协议</u>；

- 发送 HTTP 请求：请求体只在 POST 方式才会存在；<u>详看 HTTP 协议</u>；

```http
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Cookie: ......
Host: www.google.com
Pragma: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
```

##### 6-1-2、网络响应

HTTP 请求到达服务器，服务器进行相关处理并响应；<u>详看 HTTP 协议</u>；

响应头包含了服务器及其返回数据的一些信息、服务器生成数据的时间、返回的数据类型以及对即将写入的 Cookie 等信息；

注意：若请求或响应头中包含 **Connection: Keep-Alive**，则表示建立 <u>持久连接</u>，随后请求统一站点的资源会复用此连接，否则断开连接, 流程结束；

```http
Cache-Control: no-cache
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Wed, 04 Dec 2019 12:29:13 GMT
Server: apache
Set-Cookie: rsv_i=f9a0SIItKqzv7kqgAAgphbGyRts3RwTg%2FLyU3Y5Eh5LwyfOOrAsvdezbay0QqkDqFZ0DfQXby4wXKT8Au8O7ZT9UuMsBq2k; path=/; domain=.google.com
```

<img src="/Image/Chromium/15.png" style="zoom:50%;" />



#### 6-X、浏览器解析渲染流程

<img src="/Image/Chromium/17.png" style="zoom:50%;" />

- 渲染进程将 HTML 内容转换为能够读懂的 **<u>DOM 树</u>**；
- 渲染引擎将 CSS 样式表转化为浏览器可理解的 styleSheets，计算出 DOM 节点的样式；
- 创建 **<u>布局树</u>**，并计算元素的布局信息；
- 对布局树进行分层，并生成 **<u>分层树</u>**；
- 为每个图层生成 **<u>绘制列表</u>**，并将其提交到 **<u>合成线程</u>**，合成线程将图层分图块，并栅格化将图块转换成位图；
- 合成线程发送绘制图块命令给浏览器进程，浏览器进程根据指令生成页面，并显示到显示器上；





#### 6-2、解析相关

完成网络请求，若响应头中  `Content-Type` 值是 `text/html`，则**<u>进入浏览器解析与渲染工作</u>**，解析部分主要分为以下几个步骤:

- **<u>构建 DOM 树</u>**
- **<u>样式计算</u>**
- <u>**生成布局树(Layout Tree)**</u>



**<u>注意：下述内容极为简略，只作为回忆说明：</u>**

- DOM 树：字节数据—>字符串—>Token—>Node—>DOM
  - 网络01 <u>字节数据</u>—>
  - <u>HTML字符串</u>—>
  - 通过词法分析转换为 <u>标记(标记化—tokenization)(标记还是字符串，是构成代码的最小单位)</u>—>
  - 转换为 Node，并根据不同 Node 之前的联系构建为一颗 DOM 树；
- CSSOM 树(同步进行)：字节数据—>字符串—>Token—>Node—>CSSOM
  - 格式化、标准化、并根据继承与层叠规则计算节点具体样式；
- 生成渲染树(旧式)
- 布局显示(旧式)



##### 6-2-1、构建 DOM 树

由于浏览器无法直接理解 **<u>HTML字符串</u>**，因此需要先将 HTML 的原始字节数据，转换为文件指定编码的字符，然后浏览器会根据 HTML 规范来将字符串转换成各种令牌标签，最终解析成一个树状的对象数据结构——**<u>DOM树</u>**；其本质上是一个以 `document` 为根节点的多叉树；



##### 6-2-1-1、HTML 文法本质

注意：此处的 HTML 的文法并非指 **<u>上下文无关文法</u>**；在计算机科学 <u>编译原理</u> 学科中，有非常明确的定义:

> 若一个形式文法G = (N, Σ, P, S) 的产生式规则都取如下的形式：V->w，则叫上下文无关语法。其中 V∈N ，w∈(N∪Σ)* 。

其中把 G = (N, Σ, P, S) 中各个参量的意义解释一下:

1. N 是<u>**非终结符**</u>(即最后的符号不是它，下同)集合；
2. Σ 是<u>**终结符**</u>集合；
3. P 是**<u>开始符</u>**，它必须属于 N ，也即非终结符；
4. S 就是不同的产生式的集合；比如 S -> aSb 等等；

用人话讲，**<u>上下文无关的文法，就是这个文法中所有产生式的左边都是一个非终结符</u>** ，比如：

```
// 下面文法中，每个产生式左边都会有一个非终结符，这就是: 上下文无关的文法; 此时，`xBy`一定是可以规约出`xAy`的；
A -> B
```

```
// 反例:
// 下面就是: 非上下文无关的文法; 当遇到 B 时，无法判断是否可以规约出 A，因为取决于左边或右边是否有 a 存在, 故下面是和上下文有关的
aA -> B
Aa -> B
```

注意：**<u>规范的 HTML 语法</u>**，**<u>是符合上下文无关文法的</u>**，能够体现它 **<u>非上下文无关文法的</u>** 在它的 **不标准的语法**，比如反例证明如下：

因为：解析器扫描到 `form` 标签时，**<u>上下文无关文法</u>** 的处理方式是直接创建对应 form 的 DOM 对象，而真实 HTML5 场景中却不是这样，解析器会查看 `form` 上下文，若此 `form` 标签的父标签也是 `form`，则 **直接跳过** 当前 `form` 标签，否则才创建 DOM 对象；

所以：在不标准的语法时，是非上下文无关文法，则标准语法中，就是上下文无关文法(注意多重否定表肯定)；

**<u>注意：上面的叙述想表达的是规范的 HTML 语法是符合上下文无关文法的，但真实场景和实际解析中，考虑到不标准语法的行为，所以是非上下文无关文法；</u>**

**<u>注意：即理论与实际不符，表示 HTML 不能使用常规语言解析器(常规编程语言一般为上下文无关)完成 HTML Parse；</u>**



##### 6-2-1-2、解析算法

HTML5 [规范](https://html.spec.whatwg.org/multipage/parsing.html) 详细地介绍解析算法，算法分为两个阶段:

- **标记化算法**；对应过程为 **词法分析**；
- **建树算法**；对应过程为 **语法分析**；

##### 6-2-1-2-1、标记化算法

算法输入为 <u>HTML文本</u>，输出为 <u>HTML标记</u>，故亦称 <u>**标记生成器**</u>；

算法运用 **<u>有限自动状态机</u>** 来完成：即在当前状态下，接收一或多个字符，就会更新到下一状态；比如：

```html
// 标记化过程展示示例
<html>
  <body>
    Hello Beijing
  </body>
</html>
```

- 首先，遇到 `<`, 状态为 **标记打开**；
- 然后，接收 `[a-z]` 字符，并进入 **标记名称状态**；
- 然后，上述状态一直保持，直到遇到 `>`，表示标记名称记录完成，此时进入 **数据状态**；
- 然后，后续的 `body`  标签做同样处理；
- 然后，当来到 `<body>` 中的 `>`，进入**数据状态**，之后保持此状态接收后面字符 **hello sanyuan**；
- 接着，接收 `</body>`  中的 `<`，回到 **标记打开**，在接收下一个字符 `/`  时，此时会创建一个 `end tag` 的 token；
- 随后，进入 **标记名称状态**，遇到 `>` 则回到**数据状态**；
- 最后，以同样的样式处理 `</html>`；

##### 6-2-1-2-2、建树算法

​	回顾一下，解析第一步是构建 **<u>DOM 树</u>**，是因为浏览器无法直接理解 **<u>HTML字符串</u>**，因此需要先将这系列的字节流，转换为一种有意义的、且方便操作的数据结构——**<u>DOM 树</u>**；而 **<u>DOM 树</u>**是一个以 `document` 为根节点的多叉树；所以，<u>**解析器**</u>  首先会创建一个 `document` 对象 (作为 **<u>DOM 树</u>** 的根节点)；

​	随后，<u>**标记生成器**</u> 会将每个标记的信息发送给 **<u>建树器</u>**，**<u>建树器</u>**  接收到相应的标记时，会 **创建对应的 DOM 对象**，在创建这个 `DOM对象` 后会做两件事：

- 将 `DOM对象` 加入 **<u>DOM 树</u>** 中；
- 将对应标记，压入存放 **开放(与<u>闭合标签</u>意思对应)元素** 的栈中；

```
<html>
  <body>
    Hello Beijing
  </body>
</html>
```

- 首先，状态为  **初始化状态**；
- 然后，(**<u>建树器</u>**)接收到 **<u>标记生成器</u>** 传来的 `html` 标记，此时状态变为 **before html状态**，同时创建一个 `HTMLHtmlElement` DOM 元素，并将其添加到 `document` 根对象上，并进行压栈操作；
- 随后，状态自动变为 **before head**，此时从标记生成器那边传来 `body` 标记，表示并没有 `head` 标签， 此时 **<u>建树器</u>** 会自动创建一个 `HTMLHeadElement`  (DOM 元素)，并将其添加入到 **<u>DOM 树</u>** 中；
- 然后，进入到 **in head** 状态，随机直接跳到  **after head**；
- 然后，现在 **<u>标记生成器</u>** 传来了 `body ` 标记，创建 `HTMLBodyElement`(DOM 元素)，插入到 **<u>DOM 树</u>** 中，同时压入开放标记栈；
- 随后，状态变为 **in body**，然后接收后面系列字符：**Hello Beijing**，接收到第一个字符时，会创建 **Text** 节点并将字符插入其中，然后把 **Text** 节点插入到 **<u>DOM 树</u>** 中的 `body元素`的下面；后续不断接收后面字符，字符会附在 **Text** 节点上；
- 然后，**标记生成器** 传过来一个 `body` 的结束标记，进入 **after body** 状态；
- 最后，**标记生成器 **传过来一个 `html` 的结束标记，进入 **after after body** 状态，表示解析过程到此结束；

##### 6-2-1-2-3、容错机制

HTML5规范宽容策略十分强悍，接下来是 WebKit 中一些经典的容错示例：

- 表单元素嵌套：直接忽略里面的 `form`；

- 使用 `</br>`  而不是 `<br>`

```
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
  reportError(MalformedBRError);
  t->beginTag = true;
}
// 全部换为 <br> 形式
```

- 表格离散

```
<table>
  <table>
    <tr><td>inner table</td></tr>
  </table>
  <tr><td>outer table</td></tr>
</table>
```

```
// WebKit 会自动转换为:
<table>
    <tr><td>outer table</td></tr>
</table>
<table>
    <tr><td>inner table</td></tr>
</table>
```



##### 6-2-1-2-4、流程总结

<img src="/Image/Chromium/18.png" style="zoom:50%;" align="left"/>

- **转码(Bytes -> Characters)**
  - 读取接收到的 HTML 二进制数据，按指定编码格式将字节转换为 HTML 字符串；
- **Tokens 化(Characters -> Tokens)**
  -  解析 HTML，将 HTML 字符串转换为结构清晰的 Tokens，每个 Token 都有特殊的含义同时有自己的一套规则；
- **构建 Nodes(Tokens -> Nodes)**
  - 每个 Node 都添加特定的属性(或属性访问器)，通过指针能够确定 Node 的父、子、兄弟关系和所属 treeScope
  - 比如：iframe 的 treeScope 与外层页面的 treeScope 不同；
- **构建 DOM 树(Nodes -> DOM Tree)**
  - 最重要的工作是建立起每个结点的父子兄弟关系；





##### 6-2-2、样式计算

即渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式；

<img src="/Image/Chromium/19.png" style="zoom:50%;" align="left"/>

上图即将所有值转换为渲染引擎容易理解、标准化的计算值，此过程为 **<u>属性值标准化</u>**，处理完成后再处理样式的 **<u>继承和层叠</u>**，整一过程亦称 CSSOM 构建过程；

##### 6-2-2-1、格式化样式表

CSS 样式来源有三种：link 标签引用、style 标签样式、元素的内嵌 style 属性；

浏览器是无法直接识别 CSS 样式文本，因此渲染引擎收到 CSS 文本后第一件事情就是将其转化为一个结构化的对象 **<u>styleSheets</u>**；在浏览器控制台能够通过`document.styleSheets `来查看这个最终结构，结构包含了以上 3 种 CSS来源，为后面的样式操作提供基础；

补充：格式化的过程过于复杂，而且对于不同的浏览器会有不同的优化策略，这里就不展开了；

##### 6-2-2-2、标准化样式属性

有些 CSS 样式的数值并不容易被渲染引擎所理解，因此在计算样式前需要将它们标准化；比如 `em->px、red->#ff0000、bold->700` 等；

##### 6-2-2-3、计算每个节点的具体样式

CSS 样式被 <u>格式化</u> 和 <u>标准化</u> 后，便可计算每个节点的具体样式信息；计算遵从两个规则：**继承**、**层叠**；

- 继承规则：每个子节点均默认继承父节点样式属性，若父节点中没有找到，则采用浏览器默认样式 `UserAgent样式`；
- 层叠规则：<u>CSS 最大特点在于它的层叠性，也即最终样式取决于各个属性共同作用的效果</u>；
- 注意：在计算完样式之后，所有样式值会被挂在到 `window.getComputedStyle` 当中，故可通过 JS 来获取计算后的样式；



##### 6-2-3、生成布局树

布局过程即：利用前面的 **<u>DOM 树</u>** 和 **<u>DOM 样式</u>** ，排除 `script、meta` 等功能化、非视觉节点，排除 `display: none` 的节点，并通过浏览器的布局系统 <u>计算元素位置信息</u>、<u>确定元素位置</u>，构建一棵只包含可见元素的 **<u>布局树(Layout Tree)</u>**；

<img src="/Image/Chromium/20.png" style="zoom:50%;" align=""/>

- 遍历生成的 **<u>DOM 树</u>** 节点，并将它们添加到 **<u>布局树</u>** 中；
- 计算 **<u>布局树</u>** 节点的坐标位置；
- 注意：**<u>布局树</u>**  包含可见元素，设置`display: none`的元素和 `head` 等功能标签，将不会被放入其中；
- 注意：现在 Chrome 团队已经做了大量重构，已经没有生成 **<u>渲染树(Render Tree)</u>** 的过程(布局树的信息已非常完善，完全拥有 Render Tree 的功能)；
- 补充：[从Chrome源码看浏览器如何layout布局](https://www.rrfed.com/2017/02/26/chrome-layout/)。

<img src="/Image/Chromium/9.png" style="zoom:50%;" align="left" />



#### 6-3、渲染相关

渲染分为几个步骤：

- **<u>建立 图层树(Layer Tree)</u>**
- **<u>生成 绘制列表</u>**
- **<u>生成 图块 并 栅格化(生成位图)</u>**
- **<u>显示器显示内容</u>**



##### 6-3-1、建图层树/分层树(Layer Tree)

​	解析阶段得到 DOM节点、样式、位置信息，但还不足以开始绘制页面，因还需考虑页面中的复杂效果与场景，比如复杂 3D 动画变换效果、页面滚动、元素含层叠上下文时的显示与隐藏、使用 z-indexing 做 z 轴排序等；而为更加方便地实现这些效果，在浏览器在构建完 **<u>布局树</u>** 后(解析阶段最后一步)，渲染引擎还需为特定的节点生成专用图层，构建一棵 **<u>图层树(Layer Tree)</u>**；

<img src="/Image/Chromium/21.png" style="zoom:50%;" />

​	图层树通过显示隐式合成构建，一般情况下，节点的图层会默认属于父节点的图层(**亦称合成层**)，某些条件会触发将 **<u>多个合成层</u>** 提升为 **<u>单独合成层</u>**，可分两种情况讨论：**显式合成**、**隐式合成**

##### 6-3-1-1、显式合成

- 拥有 <u>层叠上下文</u> 属性的元素会单独提升为单独一层：层叠上下文是 HTML 元素的三维概念，这些 HTML 元素在一条假想的、相对于面向视窗或用户的 z 轴上延伸，HTML 元素依据其自身属性，按照优先级顺序占用层叠上下文空间；
  - **根元素(HTML)** 本身就具有层叠上下文；
  - 元素的 **filter** 值不为 none；
  - 元素的 **clip-path** 值不为 none；
  - 元素的 **transform** 值不为 none；
  - 元素的 **perspective** 值不为 none；
  - 元素的 **mix-blend-mode** 值不为 normal；
  - 元素的 **z-index** 值不为 auto，且为 flex 子项；
  - 元素的 **z-index** 值不为 auto，且为 grid 子项；
  - 元素的 **z-index** 值不为 auto，且为绝对/相对定位元素；
  - 元素的 **mask**、**mask-image**、**mask-border** 不为 none；
  - 元素的 **isolation** 值是 isolate；
  - 元素的 **-webkit-overflow-scrolling** 值是 touch；
  - 元素的 **contain** 值是 layout、paint、strict、content；
  - 元素的 **opacity** 值是小于 1；(the specification for opacity)
  - 元素的 **will-change ** 值是指定的任意属性；([详看](https://dev.opera.com/articles/css-will-change-property/) )

- 需要 <u>剪裁</u> 的地方也会被创建为图层：
  - 比如某个翠存放巨量文字的 100 * 100 像素大小的 DIV，超出的文字部分就需要被剪裁；若出现滚动条，则滚动条会被单独提升为一个图层；

##### 6-3-1-2、隐式合成

<u>层叠等级低</u> 的节点被提升为单独图层后，则 <u>所有层叠等级比它高</u> 的节点 **都会 **成为一个单独的图层；

- 注意：隐式合成隐藏巨大风险：若在一个大型应用中，当某个`z-index` 比较低的元素，被提升为单独图层后，层叠在它上面的元素统统都会被提升为单独的图层，此时瞬间可能会增加上千个图层，大大增加内存压力，甚至直接让页面崩溃；此乃 **<u>层爆炸</u>** 原理，[例子在此](https://segmentfault.com/a/1190000014520786)；
- 注意：但当需要 `repaint` 时，只需 `repaint` 本身，而不会影响到其他的层；

##### 6-3-2、生成绘制列表

然后渲染引擎会将图层的绘制拆分成一个个绘制指令；比如先画背景、再描绘边框等，然后将这些指令按顺序组合成一个 **<u>待绘制列表</u>**，相当于制作一份绘制操作任务清单，可在 Chrome 开发者工具中的`Layers`面板观察绘制列表:

<img src="/Image/Chromium/11.png" style="zoom:50%;" />



##### 6-3-3、生成图块并栅格化(生成位图)

实际上在渲染进程中，绘制操作由专门的线程—**<u>合成线程</u>** 来完成：

- 首先，当绘制列表准备好后，**<u>渲染进程的主线程</u>** 会给 **<u>合成线程</u>** 发送 `commit` 消息，将 **<u>绘制列表</u>** 提交给 **<u>合成线程</u>**；
- 然后，为避免：<u>在有限视口内一次性绘制所有页面</u> 而造成的性能浪费，**<u>合成线程</u>** 需要先将图层 **分块**；
  - 注意：分块大小规格一般为 256 * 256 或 512 * 512 ，以加速页面首屏展示；
  - 注意：图块数据要进入 GPU 内存，而将数据从浏览器内存上传到 GPU 内存的操作较慢(即使绘制一部分图块也可能会耗费大量时间)，为解决此问题，Chrome 采用如下策略：首次合成图块时只采用一个 <u>低分辨率的图片</u> ，故首屏展示时只是展示此图片，继续进行合成操作，当正常图块内容绘制完毕后，才将当前低分辨率的图块内容替换；此亦 Chrome 底层优化首屏加载速度的一个手段；
- 然后，**<u>合成线程</u>** 会选择视口附近的 **图块**，优先将其交给 **<u>栅格化线程池</u>** 来生成位图；
  - 注意：渲染进程中专门维护一个 **<u>栅格化线程池</u>**，负责将 **图块** 转换为 **位图数据**；
  - 注意：生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给 **<u>合成线程</u>**；



##### 6-3-4、显示器显示内容

生成图块并栅格化操作完成后，**<u>合成线程</u>** 会生成一个绘制命令—`DrawQuad`，并发送给浏览器进程的 **<u>viz组件</u>**，组件根据这个命令，将页面内容绘制到内存(缓冲)，然后把这部分内存数据发送给显卡；所以，当某个动画大量占用内存时，浏览器生成图像的速度变慢，图像传送显卡数据不及时，而显示器还是以不变频率刷新，因此会出现卡顿，出现明显的掉帧现象；

- 注意：无论是 PC 显示器还是手机屏幕，都有一个固定的刷新频率，一般是 60 HZ(60 帧、每秒更新60张图，停留 16.7 ms/图)，而每次更新的图片均来自于显卡的 **<u>前缓冲区</u>**；当显卡接收到浏览器进程传来的新的页面后，会合成相应的新图像，并将新图像保存到  <u>**后缓冲区**</u>；然后系统自动将 **<u>前缓冲区</u>** 和  **<u>后缓冲区</u>** 对换位置，如此循环更新；

<img src="/Image/Chromium/10.png" style="zoom:50%;" />





#### 6-4、重排、重绘、合成

回顾渲染流水线：

<img src="/Image/Chromium/12.png" style="zoom:50%;" align="left"/>

- 重绘是：当节点需要更改外观而不会影响布局的，比如改变 `color` 就叫称为重绘；
- 回流是：布局或几何属性需要改变就称为回流；



##### 6-4-1、重排/回流

DOM 修改导致元素尺寸或位置发生变化时，浏览器需要重新计算渲染树，触发重排/回流；

- 触发条件：对 DOM 结构的修改引发 DOM 几何尺寸变化时，会导致 **<u>重排(reflow)</u>**；
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
  - 注意：部分浏览器缓存一个 flush 队列，存放触发回流与重绘的任务，等队列任务足够量、或达到一定时间间隔、或“不得已”时，再将任务一次性全部出队；而当访问一些即使属性时，浏览器会为获得此时此刻的、最准确的属性值，而提前将 flush 队列的任务出队，降低性能；
  
- 回流过程：依照上面的渲染流水线，触发重排/回流时，若 DOM 结构发生改变，则重新渲染 DOM 树，然后将后续流程(包括主线程之外的任务)全部走一遍；

<img src="/Image/Chromium/13.png" style="zoom:50%;" align="left"/>

- 注意：相当于将解析和合成的过程重新又走了一篇，开销巨大；



##### 6-4-2、重绘

DOM 修改导致样式发生变化，但无影响其几何属性，触发重绘，而不触发回流；而由于 DOM 位置信息无需更新，省去布局过程，性能上优于回流；

- 触发条件：当 DOM 的修改导致样式变化，且没有影响几何属性时，会导致 **<u>重绘(repaint)</u>**；

- 重绘过程：由于没有导致 DOM 几何属性变化，故元素的位置信息无需更新，从而省去布局过程：

<img src="/Image/Chromium/14.png" style="zoom:50%;" align="left"/>

- 注意：重排跳过了 <u>生成布局树</u> 和 <u>建图层树</u> 阶段，直接生成绘制列表，然后继续进行分块、生成位图等后面一系列操作；
- 注意：重绘不一定导致回流，但回流一定发生了重绘。



##### 6-4-3、合成

直接合成，比如利用 CSS3 的 `transform`、`opacity`、`filter` 等属性可实现合成效果，即  **<u>GPU加速</u>**；

- GPU 加速原因：在合成的情况下，会直接跳过布局和绘制流程，直接进入`非主线程`处理的部分，即直接交给 **<u>合成线程</u>** 处理：
  - 充分发挥 GPU 优势：**<u>合成线程</u>** 生成位图的过程中会调用线程池，并在其中使用 GPU 进行加速生成，而 GPU 是擅长处理位图数据；
  - 没有占用主线程资源：即使主线程卡住，但效果依然能够流畅地展示；
- GPU 使用注意：GPU 渲染字体会导致字体模糊，过多 GPU 处理会导致内存问题；



##### 6-4-4、注意事项

**回流必定触发重绘，重绘不一定触发回流；重绘的开销较小，回流的代价较高**；改变父节点里的子节点很可能会导致父节点的一系列回流；



##### 6-4-4-1、最佳实践

CSS：

- CSS 选择符 <u>从右往左</u> 匹配查找，避免节点层级过多；
- 使用 `visibility` 替换 `display: none`，前者只引起重绘，后者则触发回流；
- 避免使用 `table` 布局，可能很小的一个小改动会造成整个 `table` 的重新布局；

- 使用 `transform` 替代 `top`，`transform` 和 `opacity` 效果，不会触发 `layout` 和 `repaint;`
- 动画效果/动画元素，可使用绝对定位使其脱离文档流；减少频繁地触发回流重绘；比如将动画效果应用到 `position`  属性为 `absolute` 或 `fixed` 元素上；

JavaScript：

- 避免频繁操作样式，可汇总后统一 <u>一次修改</u>；
- 避免频繁使用 `style`，而采用修改 `class` 方式；
- 极限优化时，修改样式可将其`display: none`后修改；
- 使用 `resize`、`scroll`  时进行防抖和节流处理，减少回流次数；
- 减少 `dom `的增删次数，可使用 <u>字符串</u> 或者 `documentFragment` 一次性插入；
  
  - 比如：使用 `createDocumentFragment` 进行批量 DOM 操作，修改完毕后，再放入文档流；
- 避免多次触发上面提到的那些会触发回流的方法，可使用变量将查询结果缓存，避免多次查询；
- 动画实现的速度的选择，动画速度越快，回流次数越多，也可选择使用 `requestAnimationFrame;`

- 将频繁重绘或者回流的节点提升为合成层，图层能够阻止该节点的渲染行为影响别的节点；比如对于 `video` 标签来说，浏览器会自动将该节点变为图层；

  - 设置节点为图层的方式有很多，我们可以通过以下几个常用属性可以生成新图层：
  - `will-change`
  - `video`、`iframe` 标签

- 添加 `will-change: tranform`：让渲染引擎为节点单独实现一图层；在变换发生时，仅利用 **<u>合成线程</u>** 去处理这些变换而不牵扯主线程，提高渲染效率；

  - 注意：值并非限制 tranform，任何可实现合成效果的 CSS 属性均可使用 `will-change` 来声明；[使用例子](https://juejin.im/post/5da52531518825094e373372)；

  - ```css
    #divId {
      will-change: transform;
    }
    ```



##### 6-4-4-2、优化检测

当发生 `DOMContentLoaded` 事件后，就会生成渲染树，生成渲染树就可以进行渲染了，这一过程更大程度上和硬件有关系：

<img src="/Image/Chromium/23.png" style="zoom:50%;" />



##### 6-4-5、与EventLoop关系

- 首先，当 Eventloop 执行完 Microtasks 后，会判断 `document` 是否需要更新，因为浏览器是 60Hz 的刷新率，每 16.6ms 才会更新一次；
- 然后，判断是否有 `resize` 或者 `scroll` 事件，有则触发，所以 `resize` 和 `scroll` 事件也是至少 16ms 才会触发一次，并且自带节流功能；
- 然后，判断是否触发了 media query；
- 然后，更新动画并且发送事件；
- 然后，判断是否有全屏操作事件；
- 然后，执行 `requestAnimationFrame` 回调；
- 然后，执行 `IntersectionObserver` 回调，该方法用于判断元素是否可见，可用于懒加载，但兼容性不好；
- 最后，更新界面；
- 注意：以上是一帧中可能会做的事情；若在一帧中有空闲时间，就会去执行 `requestIdleCallback` 回调；[详看](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)



#### 6-X、实际问题

##### 6-X-1、DOM 操作性能问题

原因：因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西；通过 JS 操作 DOM 时，涉及到两个线程间的通信，势必会带来一些性能上的损耗。操作 DOM 次数一多，也就等同于一直在进行线程间的通信，且操作 DOM 可能还会带来重绘回流的情况，所以也就导致了性能上的问题；

改进：

- `requestAnimationFrame`  方式去循环的插入 DOM；
- 虚拟滚动 (virtualized scroller)：只渲染可视区域内的内容，非可见区域的完全不渲染，当用户在滚动的时就实时去替换渲染的内容  [react-virtualized](https://github.com/bvaughn/react-virtualized)；



##### 6-X-2、渲染阻塞问题

- 首先，渲染的前提是生成渲染树，故 HTML 和 CSS 势必会阻塞渲染；
  - 优化：若想渲染快，可降低初始所需的渲染的文件 大小，并且扁平层级，优化选择器；
- 然后，当浏览器在解析到  `script ` 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始；
  - 优化：若想首屏渲染快，一般而言不应在首屏时就加载 JS 文件，而将 `script` 标签放在 `body` 标签底部；
  - 优化：若想首屏渲染快，亦可给 `script` 标签添加 `defer` 或者 `async` 属性：
    - `defer` 属性表示该 JS 文件会并行下载，但会放到 HTML 解析完成后顺序执行，此时的 `script` 标签可放在任意位置；
    - 对于没有任何依赖的 JS 文件可以加上 `async` 属性，表示 JS 文件下载和解析不会阻塞渲染；

##### 6-X-2-1、script 引入方式

- HTML 静态引入 `<script>` 
- JS 动态插入 `<script>`
- `<script defer>`：延迟加载，元素解析完成后执行；
- `<script async>`：异步加载，但执行时会阻塞元素渲染；



##### 6-X-3、关键渲染路径问题

不考虑缓存和优化网络协议，只考虑可以通过哪些方式来最快的渲染页面：

- 从文件大小：前略；
- 从 `script` 标签使用：前略；
- 从 CSS、HTML 的代码书写：前略；
- 从需要下载的内容是否需要在首屏使用：前略；





### X、打开页面需要启动的进程-简略

浏览器从关闭状态进行启动，然后新开 1 个页面至少需要 1 个网络进程、1 个浏览器进程、1 个 GPU 进程以及 1 个渲染进程，共 4 个进程；

后续再新开标签页，浏览器、网络进程、GPU进程是共享的，不会重新启动，若 2 个页面属于同一站点的话，并且从a页面中打开的b页面，则他们也会共用一个渲染进程，否则新开一个渲染进程；

最新的 Chrome 浏览器包括：1 个浏览器（Browser）主进程、1 个 GPU 进程、1 个网络（NetWork）进程、多个渲染进程和多个插件进程：

- 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能；
- 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下；
- GPU 进程：其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了 GPU 进程；
- 网络进程：主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程；
- 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响；



### Y、浏览器架构

- 用户界面
- 主进程
- 内核
  - 渲染引擎
  - JS 引擎
    - 执行栈
  - 事件触发线程
    - 消息队列
      - 微任务
      - 宏任务
  - 网络异步线程
  - 定时器线程

https://juejin.im/post/5e11cd225188253a73288212

https://juejin.im/post/5e572a34518825490f722b9e#heading-2

