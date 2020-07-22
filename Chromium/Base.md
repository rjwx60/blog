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

完成网络请求，若响应头中  `Content-Type` 值是 `text/html`，则进入浏览器解析与渲染工作，解析部分主要分为以下几个步骤:

- **<u>构建 DOM 树</u>**
- **<u>样式计算</u>**
- <u>**生成布局树(Layout Tree)**</u>



##### 6-2-1、构建 DOM 树

由于浏览器无法直接理解 **<u>HTML字符串</u>**，因此需要先将这系列的字节流，转换为一种有意义的、且方便操作的数据结构——**<u>DOM树</u>**；其本质上是一个以 `document` 为根节点的多叉树；

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



##### 6-2-2、样式计算

CSS 样式来源有三种：link 标签引用、style 标签样式、元素的内嵌 style 属性；

##### 6-2-2-1、格式化样式表

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

有了前面的 **<u>DOM 树</u>** 和 **<u>DOM 样式</u>** 后，便通过浏览器的布局系统 <u>确定元素位置</u>，也就是生成一棵 **<u>布局树(Layout Tree)</u>**；

- 遍历生成的 **<u>DOM 树</u>** 节点，并将它们添加到 **<u>布局树</u>** 中；
- 计算 **<u>布局树</u>** 节点的坐标位置；
- 注意：**<u>布局树</u>**  包含可见元素， `head`标签和设置`display: none`的元素，将不会被放入其中；
- 注意：现在 Chrome 团队已经做了大量重构，已经没有生成 **<u>渲染树(Render Tree)</u>** 的过程(布局树的信息已非常完善，完全拥有 Render Tree 的功能)；
- 补充：[从Chrome源码看浏览器如何layout布局](https://www.rrfed.com/2017/02/26/chrome-layout/)。

<img src="/Image/Chromium/9.png" style="zoom:50%;" align="left" />



#### 6-3、渲染相关

渲染分为几个步骤：

- **<u>建立 图层树(Layer Tree)</u>**
- **<u>生成 绘制列表</u>**
- **<u>生成 图块 并 栅格化(生成位图)</u>**
- **<u>显示器显示内容</u>**



##### 6-3-1、建图层树(Layer Tree)

解析阶段得到 DOM节点、样式、位置信息，但还不足以开始绘制页面，因还需考虑某些复杂的场景，比如3D动画变换效果、元素含层叠上下文时的显示与隐藏；所以，在浏览器在构建完 **<u>布局树</u>** 后(解析阶段最后一步)，还会对特定节点进行分层，构建一棵 **<u>图层树(Layer Tree)</u>**；通过显示隐式合成构建。一般情况下，节点的图层会默认属于父节点的图层(**亦称合成层**)，某些条件会触发将 **<u>多个合成层</u>** 提升为 **<u>单独合成层</u>**，可分两种情况讨论：**显式合成**、**隐式合成**

##### 6-3-1-1、显式合成

- 拥有 <u>层叠上下文</u> 的节点：层叠上下文也基本上是由一些特定的 CSS属性创建的，一般有以下情况:
  - HTML根元素本身就具有层叠上下文。
  - 普通元素设置 **position 不为 static** 且 **设置了z-index属性**，会产生层叠上下文；
  - 元素的 **opacity** 值不是 1；
  - 元素的 **transform** 值不是 none；
  - 元素的 **filter** 值不是 none；
  - 元素的 **isolation** 值是 isolate；
  - **will-change **指定的属性值为上面任意一个；

- 需要 <u>剪裁</u> 的地方：
  - 比如某个翠存放巨量文字的 100 * 100 像素大小的 DIV，超出的文字部分就需要被剪裁；若出现滚动条，则滚动条会被单独提升为一个图层；

##### 6-3-1-2、隐式合成

<u>层叠等级低</u> 的节点被提升为单独图层后，则 <u>所有层叠等级比它高</u> 的节点 **都会 **成为一个单独的图层；

- 注意：隐式合成隐藏巨大风险：若在一个大型应用中，当某个`z-index` 比较低的元素，被提升为单独图层后，层叠在它上面的元素统统都会被提升为单独的图层，此时瞬间可能会增加上千个图层，大大增加内存压力，甚至直接让页面崩溃；此乃 **<u>层爆炸</u>** 原理，[例子在此](https://segmentfault.com/a/1190000014520786)；
- 注意：但当需要 `repaint` 时，只需 `repaint` 本身，而不会影响到其他的层；

##### 6-3-2、生成绘制列表

然后渲染引擎会将图层的绘制拆分成一个个绘制指令；比如先画背景、再描绘边框等，然后将这些指令按顺序组合成一个 **<u>待绘制列表</u>**，相当于制作一份绘制操作任务清单，可在 Chrome 开发者工具中的`Layers`面板观察绘制列表:

<img src="/Image/Chromium/11.png" style="zoom:50%;" />



##### 6-3-3、生成图块并栅格化(生成位图)

实际上在渲染进程中，绘制操作由专门的线程—**<u>合成线程</u>** 来完成；

- 首先，当绘制列表准备好后，**<u>渲染进程的主线程</u>** 会给 **<u>合成线程</u>** 发送 `commit` 消息，将 **<u>绘制列表</u>** 提交给 **<u>合成线程</u>**；
- 然后，为避免：<u>在有限视口内一次性绘制所有页面</u> 而造成的性能浪费，**<u>合成线程</u>** 需要先将图层 **分块**；
  - 注意：分块大小规格一般为 256 * 256 或 512 * 512 ，以加速页面首屏展示；
  - 注意：图块数据要进入 GPU 内存，而将数据从浏览器内存上传到 GPU 内存的操作较慢(即使绘制一部分图块也可能会耗费大量时间)，为解决此问题，Chrome 采用如下策略：首次合成图块时只采用一个 <u>低分辨率的图片</u> ，故首屏展示时只是展示此图片，继续进行合成操作，当正常图块内容绘制完毕后，才将当前低分辨率的图块内容替换；此亦 Chrome 底层优化首屏加载速度的一个手段；
- 然后，**<u>合成线程</u>** 会选择视口附近的 **图块**，把它交给**栅格化线程池**生成位图；
  - 注意：渲染进程中专门维护一个 **<u>栅格化线程池</u>**，负责将 **图块** 转换为 **位图数据**；
  - 注意：生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给 **<u>合成线程</u>**；

##### 6-3-4、显示器显示内容

生成图块并栅格化操作完成后，**<u>合成线程</u>** 会生成一个绘制命令—`DrawQuad`，并发送给浏览器进程的 **<u>viz组件</u>**，组件根据这个命令，将页面内容绘制到内存(缓冲)，然后把这部分内存数据发送给显卡；所以，当某个动画大量占用内存时，浏览器生成图像的速度变慢，图像传送显卡数据不及时，而显示器还是以不变频率刷新，因此会出现卡顿，出现明显的掉帧现象；

- 注意：无论是 PC 显示器还是手机屏幕，都有一个固定的刷新频率，一般是 60 HZ(60 帧、每秒更新60张图，停留 16.7 ms/图)，而每次更新的图片均来自于显卡的 **<u>前缓冲区</u>**；当显卡接收到浏览器进程传来的新的页面后，会合成相应的新图像，并将新图像保存到  <u>**后缓冲区**</u>；然后系统自动将 **<u>前缓冲区</u>** 和  **<u>后缓冲区</u>** 对换位置，如此循环更新；

<img src="/Image/Chromium/10.png" style="zoom:50%;" />

#### 6-4、重排/回流、重绘、合成

回顾渲染流水线：

<img src="/Image/Chromium/12.png" style="zoom:50%;" align="left"/>

##### 6-4-1、重排/回流

- 触发条件：对 DOM 结构的修改引发 DOM 几何尺寸变化时，会导致 **<u>重排(reflow)</u>**；
  - DOM 元素的几何属性变化，常见的比如：`width`、`height`、`padding`、`margin`、`left`、`top`、`border` 等；
  - 使 DOM 节点发生 `增减` 或 `移动`；
  - 读写 `offset `族、`scroll `族、`client` 族属性时，浏览器为了获取这些值，需要进行回流操作；
  - 调用   `window.getComputedStyle` 方法；

- 回流过程：依照上面的渲染流水线，触发重排/回流时，若 DOM 结构发生改变，则重新渲染 DOM 树，然后将后续流程(包括主线程之外的任务)全部走一遍；
- <img src="/Image/Chromium/13.png" style="zoom:50%;" align="left"/>
  - 注意：相当于将解析和合成的过程重新又走了一篇，开销巨大；



##### 6-4-2、重绘

- 触发条件：当 DOM 的修改导致样式变化，且没有影响几何属性时，会导致 **<u>重绘(repaint)</u>**；

- 重绘过程：由于没有导致 DOM 几何属性变化，故元素的位置信息无需更新，从而省去布局过程：
- <img src="/Image/Chromium/14.png" style="zoom:50%;" align="left"/>
  - 注意：重排跳过了 <u>生成布局树</u> 和 <u>建图层树</u> 阶段，直接生成绘制列表，然后继续进行分块、生成位图等后面一系列操作；
  - 注意：重绘不一定导致回流，但回流一定发生了重绘。



##### 6-4-3、合成

直接合成，比如利用 CSS3 的 `transform`、`opacity`、`filter` 等属性可实现合成效果，即  **<u>GPU加速</u>**；

- GPU加速原因：在合成的情况下，会直接跳过布局和绘制流程，直接进入`非主线程`处理的部分，即直接交给 **<u>合成线程</u>** 处理：
  - 能够充分发挥 GPU 优势：**<u>合成线程</u>** 生成位图的过程中会调用线程池，并在其中使用 GPU 进行加速生成，而 GPU 是擅长处理位图数据；
  - 没有占用主线程资源：即使主线程卡住，但效果依然能够流畅地展示；

- 实践意义
  - 避免频繁使用 style，而采用修改 `class` 方式；
  - 使用 `createDocumentFragment` 进行批量 DOM 操作；
  - 对于 resize、scroll 等进行防抖/节流处理；
  - 添加 will-change: tranform：让渲染引擎为节点单独实现一个图层；在变换发生时，仅利用 **<u>合成线程</u>** 去处理这些变换而不牵扯主线程，提高渲染效率；
    - 注意：值不限制 tranform，任何可以实现合成效果的 CSS 属性均能使用`will-change`来声明；[使用例子](https://juejin.im/post/5da52531518825094e373372)；



