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

**<u>缺点</u>**：**服务器时间与浏览器本地时间可能不一致**，即时间计算基准不同就会有问题 (已在 HTTP/1.1版本抛弃)

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
- **s-maxage**：作用同 max-age，但针对对象是代理服务器；
- 注意：若 **Expires** 和 **Cache-Control** 同时存在，则优先考虑 **Cache-Control**；



#### 2-2、协商缓存

即若强缓存失效，即资源缓存超时，浏览器在请求头中携带相应的 <u>缓存tag</u> 来向服务器发请求，服务器根据此 tag，来告知浏览器是否继续使用缓存；缓存 Tag 有两种，无分优劣， **Last-Modified**、 **ETag**

##### 2-2-1、Last-Modified

响应报文字段，表示资源最后修改时间；使用机制如下：

- 首先，当浏览器首次向服务器发送请求后，服务器会在响应头中加上此字段；
- 然后，而浏览器接收到后，若再次请求，则会在请求头中携带  **If-Modified-Since** 字段，此字段值即服务器传来的最后修改时间；

- 然后，服务器拿到  请求头中的 **If-Modified-Since** 字段，<u>随即与服务器中该资源的最后修改时间作对比</u>:
  - 若请求头中的值 < 服务器上的最后修改时间，即说明资源已更新，服务端返回新资源，与常规 HTTP 请求响应流程一致；
  - 否则返回 304 状态码，告诉浏览器直接用缓存；

##### 2-2-2、ETag

响应报文字段，此字段是服务器根据当前文件内容，给文件生成的唯一标识，即值会随内容更新而改变；使用机制如下：

- 首先，浏览器接收到 **ETag** 值，若再次请求，则会在请求头中携带 **If-None-Match**  字段，此字段值即 **ETag** 值；
- 然后，服务器接收到 **If-None-Match **后，<u>随即与服务器中该资源的 ETag 作对比</u>: 
  - 若两者不相同，即说明资源已更新，服务端返回新资源，与常规 HTTP 请求响应流程一致；
  - 否则返回 304 状态码，告诉浏览器直接用缓存；

##### 2-2-3、两者对比

- 精度上，**ETag** 优于 **Last-Modified**：原因是前者按照内容给资源上标识，能准确感知资源变化，而后者在某些特殊情况下无法准确感知资源变化：
  - 编辑资源文件，但实际上文件内容并无变更，也会造成缓存失效；
  - Last-Modified 能够感知的单位时间是秒，若文件在 1 秒内发生多次改变则无法表现出修改；
- 性能上，**Last-Modified** 优于 **ETag**：原因是前者仅记录时间点，而后者需要根据文件具体内容生成唯一哈希值；
- 注意：若两种方式均支持，服务器会优先考虑 **ETag**；



#### 2-3、缓存存放位置

浏览器中的缓存位置一共有四种，按优先级从高到低排列分别是：

浏览器中的缓存位置一共有四种，按优先级从高到低排列分别是：

- Service Worker
- Memory Cache
- Disk Cache
- Push Cache

##### 2-3-1、Service Worker

其借鉴 Web Worker 思路，让  JS 运行在主线程之外，但由于它脱离了浏览器窗体，故无法直接访问 DOM；但功能仍然强大，比如：<u>离线缓存</u>、<u>消息推送</u>、 <u>网络代理</u> 等功能；同时，Service Worker  也是 PWA 的重要实现机制；

##### 2-3-2、Memory Cache 和 Disk Cache

- **Memory Cache**：即内存缓存，效率最快、但存活时间最短，随渲染进程的结束而结束；
- **Disk Cache**：即存储在磁盘中的缓存，存取效率较慢，但优势在于存储容量和存储时长；
- 存储位置选择的策略如下：
  - 较大的 JS、CSS 文件会直接存入磁盘，反之内存；
  - 内存使用率比较高时，文件优先放入磁盘；

##### 2-3-3、Push Cache

即推送缓存，是浏览器缓存的最后关卡，属于 HTTP/2 内容，目前应用并不广泛，但可[提前了解](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/)



#### 2-4、总结

- 首先通过 **Cache-Control** 验证 <u>强缓存</u> 是否可用
  - 若可用，直接使用
  - 否则进入 <u>协商缓存</u>，即发送 HTTP 请求，服务器通过请求头中的 **If-Modified-Since** 或 **If-None-Match** 字段检查资源是否更新
    - 若资源更新，返回资源和  200 状态码；
    - 否则，返回 304 状态码，告诉浏览器直接从缓存获取资源；





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

CORS—跨域资源共享，是 W3C 标准之一，需要浏览器与服务器共同支持：<u>非 IE 和 IE10 以上</u>、<u>服务器需要附加特定的响应头</u>；

首先，浏览器根据请求方法和请求头的特定字段，将请求作两种分类，凡满足下面条件的属于 **简单请求**，否则为 **非简单请求**：

- 请求方法为 GET、POST、HEAD
- 请求头取值范围：Accept、Accept-Language、Content-Language、Content-Type
  - 注意：这里的 Content-Type 仅限3值：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

##### 4-2-1-1、简单请求

在请求发出前，浏览器会自动为请求头中，添加字段 `Origin`，用以说明请求来源；当服务器拿到请求并回应时，会相应地添加字段 `Access-Control-Allow-Origin`；当浏览器收到时，发现 `Origin` 不在此字段范围内时，就会将响应拦截；

所以，**<u>字段 `Access-Control-Allow-Origin` 是服务器用来决定浏览器是否拦截此响应的必需字段</u>**；此外，还有其他可选的功能性字段，用以描述若不拦截时，则字段将会发挥各自的作用：

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



##### 4-2-2-2、非简单请求

非简单请求不同于简单请求，主要体现在两方面：**预检请求**、**响应字段**，而主流程是：

- 首先，客户端先发送 <u>**预检请求**</u>，用以告知服务器接下来的 CORS 请求的具体信息(方法、请求头)；
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
// 代码执行后随后发送 预检请求, 请求航与请求体如下：
// 注意预检请求方法为 OPTIONS, 并带有 Origin 源地址与 Host 目的地址字段, 和两个 Access-XX 字段
OPTIONS / HTTP/1.1
Origin: 当前地址
Host: xxx.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
```

- 然后，服务端接收并返回 <u>**预检请求的响应**</u>，客户端检查此响应：
  - 若 CORS 请求不满足预检请求响应头的条件，则触发 `XMLHttpRequest` 的 `onerror `方法，后续 CORS 请求不发出；
  - 若 CORS 请求满足，则发出真正的 CORS 请求；
  - Access-Control-Allow-Credentials：略；
  - Access-Control-Allow-Methods：表示允许的请求方法列表；
  - Access-Control-Allow-Headers：表示允许发送的请求头字段；
  - Access-Control-Max-Age：表示预检请求的有效期，在此期间，不必发出另外一条预检请求；
  - Access-Control-Allow-Origin：表示可允许请求的源；可填具体源名，亦可填 `*` 表示允许任意源请求；

```http
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

- 最后，若一切允许，则客户端发送跨域请求：浏览器自动加上 `Origin` 字段，服务端响应头返回  `Access-Control-Allow-Origin`，流程同简单请求；



##### 4-2-2、JSONP

XMLHttpRequest 对象遵循同源政策，但 `script`标签不一样，可通过 src 填上目标地址发出 GET 请求，实现跨域请求，也即 JSONP 原理，最大优势是兼容性好(兼容 IE 低版本)，但缺点也明显：只支持 GET 请求；

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




### 五、浏览器应用

#### 5-1、防抖与节流

#### 5-2、图片懒加载



### 六、输入URL到展示过程

#### 6-1、网络相关

#### 6-2、解析相关

#### 6-3、渲染相关

#### 6-4、后期相关

