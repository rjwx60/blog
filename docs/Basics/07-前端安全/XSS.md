# 一、XSS(CSS)

## 1-1、基本

跨站脚本攻击 - Cross Site Scripting：是指浏览器中执行恶意脚本(无论是跨域还是同域)，从而拿到用户的信息并进行操作；完成窃取 Cookie、监听用户行为，比如输入账号密码后直接发送到黑客服务器、修改 DOM 伪造登录表单、在页面中生成浮窗广告等非法行为；

- 注意：XSS 攻击完成后，攻击者能对用户当前浏览页面置入恶意脚本(统称XSS Payload)以实现各种目的；
- 注意：过往此种攻击案例是跨域的，故称跨站脚本，但发展至今，是否跨域已不再重要，但名称却保留了下来；
- 注意：HTML转移复杂，不同情况需用不同的转义规则，使用不当还会埋下隐患，故应使用成熟通用的转义库；



## 1-2、本质与案例

本质是代码注入问题；数据被浏览器当成页面代码的一部分执行，混淆了原语义并产生新语义，案例如下：

- 2005年，19岁的 Samy Kamkar，发起了针对 MySpace.com 的 XSS Worm 攻击， 此次攻击在数几小时内就感染了100万用户；其在每个用户的自我简介后加增加 “but most of all, Samy is my hero”，这是 Web 安全史上第一个重量级的、具有里程碑意义的 XSS Worm；
- 2007年12月，百度空间受到 XSS Worm攻击，用户间不断转发垃圾消息；
- 2011年某月，新浪微博被黑客 XSS 攻击，黑客诱导用户点击诱惑性链接，便会自动发送一条带有同样诱惑性链接微博；



## 1-4、来源

URL 参数、POST 参数、第三方的链接、用户的 UGC 信息、Cookie (可能来自其他子域注入)、Referer (可能来自不可信来源)



## 1-5、分类

### 1-5-1、按恶意脚本是否在应用中存储

### 1-5-1-1、存储型 XSS

定义：将恶意脚本存储在服务端数据库中，当用户访问相关页面时，脚本在客户端执行，从而达到攻击的效果；

场景：常见于带有保存用户数据功能的网站，比如论坛、商品评论区、用户私信等；

步骤：

- 首先，攻击者将恶意代码提交到目标网站的数据库中；
- 然后，用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器；
- 然后，用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行；
- 最后，恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作；

示例：https://github.com/YvetteLau/Blog/tree/master/Security

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162412.png" style="zoom:50%;" align=""/>



### 1-5-1-2、反射型 XSS

定义：恶意脚本作为网络请求的一部分，随后服务端又将这部分返回给用户，恶意脚本被浏览器执行；

注意：**<u>反射型</u>** 是因为恶意脚本是通过作为网络请求的参数，经过服务器，然后再反射到HTML文档中，执行解析;

场景：常见于通过 URL 传递参数功能的网站，比如网站搜索、链接跳转等；

步骤：

- 首先，攻击者构造出特殊的 URL，其中包含恶意代码；
  - 比如：`http://xxxxxx.com?query=<script>loop("sendPersonalMessage")..</script>`
- 然后，用户打开带有恶意代码的 URL 时，网站服务端将代码参数 `query` 从 URL 中取出，并将其作为 HTML 内容返回给浏览器；
- 最后，客户端接收响应后解析执行，被攻击；

示例：https://github.com/YvetteLau/Blog/tree/master/Security

- 根据 README.md 的提示进行操作(真实情况下是需要诱导用户点击的，上述代码仅是用作演示)
- 注意 Chrome 和 Safari 均能检测到 url 上的 XSS 攻击，并将网页拦截掉，但其它浏览器不行，比如 Firefox (旧版)
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162413.png" style="zoom:50%;" align=""/>

异同：

- 前者恶意代码存在服务器数据库中，后者恶意代码存在 URL中；
- 均为从服务端取出恶意代码后，插入到响应 HTML 中，攻击者刻意编写的攻击脚本被内嵌到正常代码中，并被浏览器执行；

注意：POST 的内容亦可触发反射型 XSS，但触发条件较苛刻 (需要构造表单提交页面，并引导用户点击)，较少见；

注意：由于需要用户主动打开恶意 URL 才能生效，攻击者往往会结合多种手段诱导用户点击；



### 1-5-2、按是否同服务器有交互

### 1-5-2-1、DOM型 XSS

定义：无需服务端参与，不同于前两种服务端安全漏洞，而是作为中间人的角色，在数据传输过程劫持到网络数据包，然后<u>修改里面的 html 文档</u>

- 注意：劫持方式包括 **WIFI路由器劫持** 或 **本地恶意软件** 等；

步骤：

- 首先，攻击者构造出特殊数据，其中包含恶意代码；
- 然后，用户浏览器执行了恶意代码；
- 最后，恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作；
- 示例：https://github.com/YvetteLau/Blog/tree/master/Security
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162414.png" style="zoom:50%;" align=""/>



### 1-5-2-2、ServerSide XSS

- 待整理



## 1-6、攻击方式

### 1-6-1、评论等输入入口

通过评论、论坛等用户输入入口，输入非法代码；(在 HTML 中内嵌文本中，恶意内容以 script 标签形成注入)；

- 首先，input 输入：`><script>alert('XSS');</script>`；
  - 然后，浏览器请求： `http://xxx/search?keyword="><script>alert('XSS');</script>`；
  - 最后，服务端解析出请求参数 keyword，得到 `><script>alert('XSS');</script>`，拼接并返回，用户访问时受攻击；
- 应对：前端使用HTML转义控制请求输入，escapeHTML；

  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162415.png" style="zoom:50%;" align=""/>

### 1-6-2、参数解析漏洞

通过 query string 参数解析的漏洞， 插入非法代码(在标签的 href、src 等属性中，包含 JS: 等可执行代码)；

原理： JS: 字符、特殊字符若出现在特定位置会引发 XSS 攻击；

- 比如A：
  - 首先，input 输入；
  - 然后，浏览器请求： `http://xxx/?redirect_to=javascript:alert('XSS’)`；或 `http://xxx/?redirect_to=jAvascRipt:alert('XSS')`
  - 最后，服务端解析成 `<a href="javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；
- 比如B：

  - 首先，input 输入；
  - 然后，浏览器请求： `http://xxx/?redirect_to=%20javascript:alert('XSS’)`；
  - 最后，服务端解析成 `<a href=" javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；

应对：前端控制请求输入，对于链接跳转如 `<a href="xxx"` 或 `location.href="xxx"`，要检验其内容并禁止以 "javascript:" 开头链接和非法 scheme；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162416.png" style="zoom:50%;" align=""/>

### 1-6-3、内联 JSON 漏洞

- 首先，插入 JSON 的地方不能使用 `escapeHTML()`，因转义 " 后，JSON 格式会被破坏；
- 然后，当 JSON 中包含 U+2028 或 U+2029 这两个字符时，不能作为 JS 的字面量使用，否则会抛出语法错误；
- 然后，当 JSON 中包含字符串 `</script>` 时，当前 script 标签将会被闭合，后面字符串内容浏览器会按照 HTML 进行解析；
- 最后，通过增加下一个 `<script>` 标签等方法就可以完成注入；

应对：对内联 JSON 进行转义，`escapeEmbedJSON()` 函数；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162417.png" style="zoom:50%;" align=""/>

### 1-6-4、SQL 注入

原理：通过把 SQL 命令插入到 Web 表单提交或页面请求的查询字符串，最终达到对服务器执行恶意的 SQL 命令；

比如：利用现有应用程序，将(恶意)  SQL 命令注入到后台数据库引擎以执行，可通过在 Web 表单中输入 (恶意) SQL 语句得到一个存在安全漏洞的网站上的数据库，而非按照设计者意图去执行 SQL 语句；

应对：

- 永远不要相信客户端返回任意内容；
- 永远不要相信用户输入: 通过正则表达式、限制长度、对单引号和双"-"进行转换等方式对用户输入进行校验；
- 永远不要使用动态拼接 SQL，可使用参数化的 SQL 或直接使用存储过程进行数据查询存取；
- 永远不要使用管理员权限的数据库连接，为每个应用使用单独的权限有限的数据库连接；
- 永远不要把机密信息直接存放，加密密码和敏感的信息；

其他：标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签；

其他：内联 Js 中，拼接数据突破了原本限制(字符串，变量，方法名等)；

其他：在 onload、onerror、onclick 等事件中，注入不受控制代码；

其他：在 style 属性和标签中，包含类似 background-image:url("javascript:..."); 的代码 (新版本浏览器已经可以防范)；

其他：在 style 属性和标签中，包含类似 expression(...)的 CSS 表达式代码 (新版本浏览器已经可以防范)；



## 1-7、防御方式

### 1-7-1、防御存储型和反射型

### 1-7-1-1、纯前端渲染

将把代码和数据分隔开；

场景：适用于内部、管理系统，对性能要求较高，或有 SEO 需求的页面，此外仍需考虑拼接 HTML 问题；

比如A：

- 首先，前端数据传递给服务器之前，先转义/过滤(防范不了抓包修改数据的情况)；
- 然后，服务器接收到数据，在存储到数据库之前，进行转义/过滤；
- 最后，前端接收到服务器传递过来的数据，在展示到页面前，先进行转义/过滤；

比如B：

- 首先，浏览器先加载一个静态 HTML，此 HTML 中不包含任何跟业务相关的数据；
- 然后，浏览器执行 HTML 中的 Js；
- 最后，Js 通过 Ajax 加载数据，调用 DOM API 更新到页面上；明确告知浏览器设置内容的属性状态，防止浏览器被轻易欺骗，执行预期外代码；

注意：需避免 DOM 型 XSS 漏洞；

### 1-7-1-2、服务端对请求数据转义

基本：若拼接 HTML 是必要的，则需采用合适转义库，对 HTML 模板各处插入点进行充分转义；

- 注意：常用模板引擎：doT.js、ejs、FreeMarker 等，但要完善 XSS 防护措施，需使用更完善更细致的转义策略；
- 注意：需要针对上下文制定多种规则、还需根据每个插入点所处的上下文，选取不同的转义规则；

问题：转义库是无法判断插入点上下文的 (Not Context-Aware)，实施转义规则责任交由人工处理，且工作量巨大，难以发现全部隐患；

解决：09年谷歌推出：[Automatic Context-Aware Escaping](https://security.googleblog.com/2009/03/reducing-xss-by-way-of-automatic.html)

原理：模板引擎在解析模板字符串时，就解析模板语法，分析出每个插入点所处的上下文，据此自动选用不同的转义规则；

支持：目前已经支持 Automatic Context-Aware Escaping 的模板引擎有：[go html/template](https://golang.org/pkg/html/template/)、[Google Closure Templates](https://developers.google.com/closure/templates/docs/security) 等；

### 1-7-1-3、URL 参数转义

对 url 查询参数进行转义后再输出到页面

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162418.png" style="zoom:50%;" align=""/>



### 1-7-2、防御 DOM/文档型

### 1-7-2-1、慎重使用输出类 API

比如 innerHTML、outerHTML、document.write()，或改用安全性更高的 textContent、setAttribute、innerText；

框架同理，比如 vue 不使用 v-html / dangerouslySetInnerHTML；

避免使用能将字符串作为代码执行的API，比如 JS 的 eval()、setTimeout()、setInterval() 等；

避免使用内联事件监听器，比如 location、onclick、onerror、onload、onmouseover 等，和某些标签属性比如  a 标签的 herf 属性；

### 1-7-2-2、避免数据泄露

前端避免将不可信数据交由执行 API 和特殊属性；

### 1-7-2-3、转义所有输入内容

前端对用户输入内容均进行转义；比如 GET 请求的 url 参数、POST 请求的 body 数据等；

- 对于 url 链接，比如图片的src属性，则直接使用 encodeURIComponent 来转义；
- 对于非 url，对下述符号进行转码：
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162419.png" style="zoom:50%;" align=""/>



### 1-7-3、防御其他类型攻击

### 1-7-3-1、[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

基本：CSP-Content Security Policy，浏览器内容安全策略，主要用于定义页面可加载资源类型，减少 XSS 发生；通俗说就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行；只需要配置规则，如何拦截是由浏览器自己实现，作用如下：

- 禁止加载外域代码，防止复杂的攻击逻辑；
- 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）
- 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域；
- 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）
- 合理使用上报可及时发现 XSS，利于问题的快速修复；

使用：

- 设置 HTTP Header 中的 `Content-Security-Policy`
  - 只允许加载本站资源：`Content-Security-Policy: default-src ‘self’`
  - 只允许加载 HTTPS 协议图片：`Content-Security-Policy: img-src https://*`
  - 允许加载任何来源框架：`Content-Security-Policy: child-src 'none'`
- 设置 `meta` 标签的方式 `<meta http-equiv="Content-Security-Policy">`，但后者无法使用 report；
  - 比如：`<meta http-equiv="Content-Security-Policy" content="form-action 'self';">`

- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162420.png" style="zoom:50%;" align=""/>
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162421.png" style="zoom:50%;" align=""/>

### 1-7-3-2、输入内容限制

作用：对于部分输入，可限定不能包含特殊字符或者仅能输入数字、或限定一合理长度，增加 XSS 攻击难度；

### 1-7-3-3、HTTP-only Cookie

作用：禁止 JS 脚本读取 cookie 信息

- 注意：在 Cookie 中设置此项，目的并非对抗 XSS，而是解决 XSS 后的 Cookie 劫持问题；
- 注意：若服务器设置多个 Cookie，则每一 Cookie 均需设置此字段；

### 1-7-3-4、验证码

作用：防止脚本冒充用户操作；

### 1-7-3-5、XSS Auditor

基本：Chrome 和 Safari中，内建的一个防御xss攻击的功能模块，相当于一审计器，有预设规则;

作用：防御链接 XSS 攻击，触发后可将内容上报，便于分析跟踪，并同时展示一个空白页面给用户：

- 比如：`X-XSS-Protection: 1; report=http://example.com/your_report_URI；mode=block`
- 注意：后端可绕开，仅适用于字符编码，大小写变化；

### 1-7-3-7、静态脚本拦截

### 1-7-3-8、劫持 document.write

检测是否有新增的 html 并移除，重写 document.write 方法阻止广告代码写入；

### 1-7-3-9、锁死 apply、call

### 1-7-3-X、更多防御方式

详看：https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting

详看：https://juejin.im/entry/58a598dc570c35006b5cd6b4



## 1-8、检查漏洞

- 方式1：使用通用 XSS 攻击字符串手动检测 XSS 漏洞；

  - 代码：`jaVasCript:/*-/*/*\/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e` 
  - 作用：能检测到存在于 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JS 字符串、内联 CSS 样式表等多种上下文中的 XSS 漏洞;
  - 作用：亦能检测 eval()、setTimeout()、setInterval()、Function()、innerHTML、document.write() 等 DOM 型 XSS 漏洞，并且能绕过一些 XSS 过滤器；
  - 使用：在网站的各输入框中提交这个字符串，或者把它拼接到 URL 参数上，即可进行检测；
  - 详看：[Unleashing an Ultimate XSS Polyglot](https://github.com/0xsobky/HackVault/wiki/Unleashing-an-Ultimate-XSS-Polyglot)

- 方式2：使用扫描工具自动检测 XSS 漏洞

  - 比如：[Arachni](https://github.com/Arachni/arachni)、[Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory/)、[w3af](https://github.com/andresriancho/w3af)
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162422.png" style="zoom:50%;" align=""/>



## 1-9、总结

**存储型**：即攻击被存储在服务端，常见的是在评论区插入攻击脚本，如果脚本被储存到服务端，那么所有看见对应评论的用户都会受到攻击。

**反射型**：攻击者将脚本混在URL里，服务端接收到URL将恶意代码当做参数取出并拼接在HTML里返回，浏览器解析此HTML后即执行恶意代码

**DOM型**：将攻击脚本写在URL中，诱导用户点击该URL，如果URL被解析，那么攻击脚本就会被运行。和前两者的差别主要在于DOM型攻击不经过服务端

不管何种 XSS 攻击，**<u>其最终目标都是让恶意脚本直接能在浏览器中执行</u>**，因此可以此作为切入口，做到**一个信念，两个利用**：

- 信念：千万不要相信任何用户的输入：对输入内容中均进行转义或过滤；
- 利用1：利用 CSP：核心思想是服务器决定浏览器加载哪些资源，即开启白名单，可阻止白名单以外的资源加载和运行；具体来说可以完成以下功能:

  - 限制其他域下的资源加载；
  - 禁止向其它域提交数据；
  - 提供上报机制，能帮助及时发现 XSS 攻击；

- 利用2：利用 HttpOnly：很多 XSS 攻击脚本都是用来窃取 Cookie，而设置 Cookie 的 HttpOnly 属性后，JS 便无法读取 Cookie 值；

<img src="https://i.loli.net/2020/09/07/Uy8B5P7WVOLXITD.png" style="zoom:50%;" align=""/>

