---
typora-root-url: ../../Source

---



### 一、XSS(CSS)

1-1、定义

​	跨站脚本攻击 - Cross Site Scripting。攻击者通过注入非法的 html 标签或 JS 代码，从而当用户浏览该网页时，进行某种操作。(因浏览器无法区分脚本是被恶意注入的还是正常的内容，它都会执行，且 HTML 非常灵活，可在任何时候对它进行修改)；攻击完成后可进行伪造请求、数据窃取(Cookie、SessionID等)、未授权操作、修改 DOM、刷浮窗广告、发动 XSS 蠕虫攻击、劫持用户行为、渗透内网并引入外部脚本实施更复杂攻击；

- 注意：为与前端的 CSS 有所区别，安全领域叫 XSS；
- 注意：XSS 攻击完成后，攻击者能对用户当前浏览页面置入恶意脚本(统称XSS Payload)以实现各种目的；
- 注意：过往此种攻击案例是跨域的，故称跨站脚本，但发展至今，是否跨域已不再重要，可名称却保留下来；
- 注意：HTML转移复杂，不同情况需用不同的转义规则，使用不当还会埋下隐患，故应使用成熟通用的转义库；



1-2、本质

​	代码注入问题。数据被浏览器当成页面代码的一部分执行，从而混淆原语义并产生新语义；



1-3、案例

- 2005年，19岁的 Samy Kamkar 发起了对 MySpace.com 的 XSS Worm 攻击。 此蠕虫在短短几小时内就感染了100万用户，其在每个用户的自我简介后加增加 “but most of all, Samy is my hero.”，这是 Web 安全史上第一个重量级的、具有里程碑意义的 XSS Worm；
- 2007年12月，百度空间受到 XSS Worm攻击，用户间不断转发垃圾消息；
- 2011年某月，新浪微博被黑客 XSS 攻击，黑客诱导用户点击诱惑性链接，便会自动发送一条带有同样诱惑性链接微博；



1-4、来源

​	URL 参数、POST 参数、第三方的链接、用户的 UGC 信息、Cookie (可能来自其他子域注入)、Referer (可能来自不可信来源)



1-5、分类

- 按恶意输入脚本是否在应用中存储可分：

  - 存储型 XSS (持久性 XSS)

    - 定义：黑客将恶意脚本保存在服务端数据库中，用户访问相关页面，恶意脚本被浏览器执行；
    - 场景：常见于带有保存用户数据功能的网站，比如论坛、商品评论区、用户私信等；
    - 步骤：
      - 首先，攻击者将恶意代码提交到目标网站的数据库中；
      - 然后，用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器；
      - 然后，用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行；
      - 最后，恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作；
    - 示例：https://github.com/YvetteLau/Blog/tree/master/Security
    - <img src="/Image/Basics/Special/Security/type-2.png" style="zoom:50%;" align="left"/>

  - 反射型 XSS (非持久性 XSS)

    - 定义：恶意脚本属于用户发送请求的一部分，随后服务端又将这部分返回给用户，恶意脚本被浏览器执行；

    - 场景：常见于通过 URL 传递参数功能的网站，比如网站搜索、链接跳转等；

    - 步骤：

      - 首先，攻击者构造出特殊的 URL，其中包含恶意代码；
      - 然后，用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器；
      - 然后，用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行；
      - 最后，恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作；

      - 示例：https://github.com/YvetteLau/Blog/tree/master/Security
        - 根据 README.md 的提示进行操作(真实情况下是需要诱导用户点击的，上述代码仅是用作演示)
        - 注意Chrome 和 Safari 能够检测到 url 上的xss攻击，将网页拦截掉，但是其它浏览器不行，如Firefox
        - <img src="/Image/Basics/Special/Security/type-1.png" style="zoom:50%;" align="left"/>

  - 异同：

    - 前者恶意代码存在服务器数据库中，后者恶意代码存在 URL中；
    - 均为从服务端取出恶意代码后，插入到响应 HTML 中，攻击者刻意编写的攻击脚本被内嵌到正常代码中，并被浏览器执行；

  - 注意：POST 的内容亦可触发反射型 XSS，但触发条件较苛刻 (需要构造表单提交页面，并引导用户点击)，较少见；

  - 注意：由于需要用户主动打开恶意 URL 才能生效，攻击者往往会结合多种手段诱导用户点击；

- 按是否和服务器有交互可分：

  - DOM 型 XSS
    - 定义：无需服务端参与，不同于前两种服务端安全漏洞，此种方式中，取出和执行恶意代码由浏览器端完成，属于前端 JS 自身安全漏洞；
    - 场景：即前端 JS 代码本身不够严谨，将不可信数据当作代码执行；
    - 步骤：
      - 首先，攻击者构造出特殊数据，其中包含恶意代码；
      - 然后，用户浏览器执行了恶意代码；
      - 最后，恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作；
      - 示例：https://github.com/YvetteLau/Blog/tree/master/Security
      - <img src="/Image/Basics/Special/Security/type-3.png" style="zoom:50%;" align="left"/>
  - ServerSide XSS
    - 待整理



1-6、攻击方式

- 方式1：通过评论、论坛等用户输入入口，输入非法代码；(在 HTML 中内嵌文本中，恶意内容以 script 标签形成注入)；

- - 比如A：

  - - 首先，input 输入：`><script>alert('XSS');</script>`；
    - 然后，浏览器请求： `http://xxx/search?keyword="><script>alert('XSS');</script>`；
    - 最后，服务端解析出请求参数 keyword，得到 `><script>alert('XSS');</script>`，拼接并返回，用户访问时受攻击；

  - 应对：前端使用HTML转义控制请求输入，escapeHTML；

  - <img src="/Image/Basics/Special/Security/attack-1.png" style="zoom:50%;" align="left"/>

- 方式2：通过 query string 参数解析的漏洞， 插入非法代码(在标签的 href、src 等属性中，包含 javascript: 等可执行代码)；

  - 原理： javascript: 字符、特殊字符若出现在特定位置会引发 XSS 攻击；

- - 比如A：

  - - 首先，input 输入；
    - 然后，浏览器请求： `http://xxx/?redirect_to=javascript:alert('XSS’)`；或 `http://xxx/?redirect_to=jAvascRipt:alert('XSS')`
    - 最后，服务端解析成 `<a href="javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；

  - 比如B：

  - - 首先，input 输入；
    - 然后，浏览器请求： `http://xxx/?redirect_to=%20javascript:alert('XSS’)`；
    - 最后，服务端解析成 `<a href=" javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；

  - 应对：前端控制请求输入，对于链接跳转如 `<a href="xxx"` 或 `location.href="xxx"`，要检验其内容并禁止以 "javascript:" 开头链接和非法 scheme；

  - <img src="/Image/Basics/Special/Security/attack-2.png" style="zoom:50%;" align="left"/>

- 方式3：内联 JSON 漏洞

- - 比如：

  - - 首先，插入 JSON 的地方不能使用 `escapeHTML()`，因转义 " 后，JSON 格式会被破坏；
    - 然后，当 JSON 中包含 U+2028 或 U+2029 这两个字符时，不能作为 JS 的字面量使用，否则会抛出语法错误；
    - 然后，当 JSON 中包含字符串 `</script>` 时，当前 script 标签将会被闭合，后面字符串内容浏览器会按照 HTML 进行解析；
    - 最后，通过增加下一个 `<script>` 标签等方法就可以完成注入；

  - 应对：对内联 JSON 进行转义，`escapeEmbedJSON()` 函数；

  - <img src="/Image/Basics/Special/Security/attack-3.png" style="zoom:50%;" align="left"/>

- 方式4：SQL 注入

  - 原理：通过把 SQL 命令插入到 Web 表单提交或页面请求的查询字符串，最终达到对服务器执行恶意的 SQL 命令；
  - 比如：利用现有应用程序，将(恶意) 的 SQL 命令注入到后台数据库引擎执行的能力，可通过在 Web 表单中输入 (恶意) SQL 语句得到一个存在安全漏洞的网站上的数据库，而不是按照设计者意图去执行 SQL 语句；
  - 应对：永远不要相信客户端返回任意内容
    - 永远不要相信用户输入: 通过正则表达式、限制长度、对单引号和双"-"进行转换等方式对用户输入进行校验；
    - 永远不要使用动态拼接 SQL，可使用参数化的 SQL 或直接使用存储过程进行数据查询存取；
    - 永远不要使用管理员权限的数据库连接，为每个应用使用单独的权限有限的数据库连接；
    - 永远不要把机密信息直接存放，加密密码和敏感的信息；
- 其他：标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签；
- 其他：内联 Js 中，拼接数据突破了原本限制(字符串，变量，方法名等)；
- 其他：在 onload、onerror、onclick 等事件中，注入不受控制代码；
- 其他：在 style 属性和标签中，包含类似 background-image:url("javascript:..."); 的代码 (新版本浏览器已经可以防范)；
- 其他：在 style 属性和标签中，包含类似 expression(...)的 CSS 表达式代码 (新版本浏览器已经可以防范)；



1-7、防御方式

1-7-1、防御存储型和反射型 XSS 攻击(服务端漏洞)

- 方式1：改成纯前端渲染，把代码和数据分隔开；

  - 场景：适用于内部、管理系统，对性能要求较高，或有 SEO 需求的页面，此外仍需考虑拼接 HTML 问题；

- - 比如A：

  - - 首先，前端数据传递给服务器之前，先转义/过滤(防范不了抓包修改数据的情况)；
    - 然后，服务器接收到数据，在存储到数据库之前，进行转义/过滤；
    - 最后，前端接收到服务器传递过来的数据，在展示到页面前，先进行转义/过滤；

  - 比如B：

  - - 首先，浏览器先加载一个静态 HTML，此 HTML 中不包含任何跟业务相关的数据；
    - 然后，浏览器执行 HTML 中的 Js；
    - 最后，Js 通过 Ajax 加载数据，调用 DOM API 更新到页面上；明确告知浏览器设置内容的属性状态，防止浏览器被轻易欺骗，执行预期外代码；

  - 注意：需避免DOM型XSS漏洞；

- 方式2：后端对 HTML 作充分转义；

- - 基本：若拼接 HTML 是必要的，则需采用合适转义库，对 HTML 模板各处插入点进行充分转义；
  - 注意：常用模板引擎：doT.js、ejs、FreeMarker 等，但要完善 XSS 防护措施，需使用更完善更细致的转义策略；
  - 注意：需要针对上下文制定多种规则、还需根据每个插入点所处的上下文，选取不同的转义规则；
  - 问题：转义库是无法判断插入点上下文的 (Not Context-Aware)，实施转义规则责任交由人工处理，且工作量巨大，难以发现全部隐患；
  - 解决：09年谷歌推出：[Automatic Context-Aware Escaping](https://security.googleblog.com/2009/03/reducing-xss-by-way-of-automatic.html)
  - 原理：模板引擎在解析模板字符串时，就解析模板语法，分析出每个插入点所处的上下文，据此自动选用不同的转义规则；
  - 支持：目前已经支持 Automatic Context-Aware Escaping 的模板引擎有：[go html/template](https://golang.org/pkg/html/template/)、[Google Closure Templates](https://developers.google.com/closure/templates/docs/security) 等；

- 方式3：对url的查询参数进行转义后再输出到页面
  - <img src="/Image/Basics/Special/Security/defend-1.png" style="zoom:50%;" align="left"/>

1-7-2、防御DOM型 XSS 攻击（客户端漏洞）

- 方式1：前端慎重使用输出类 API，比如 innerHTML、outerHTML、document.write()，或改用安全性更高的 textContent、setAttribute、innerText，框架同理，比如 vue 不使用 v-html / dangerouslySetInnerHTML；避免使用能将字符串作为代码执行的API，比如 JS 的 eval()、setTimeout()、setInterval() 等，和内联事件监听器，比如 location、onclick、onerror、onload、onmouseover 等，和某些标签属性比如  a 标签的 herf 属性；

- 方式2：前端避免将不可信数据交由执行 API 和特殊属性；

- 方式3：前端对用户输入内容均进行转义；比如 GET 请求的 url 参数、POST 请求的 body 数据等；

- - 对于 url 链接，比如图片的src属性，则直接使用 encodeURIComponent 来转义；
  - 对于非 url，对下述符号进行转码：
  - <img src="/Image/Basics/Special/Security/defend-2.png" style="zoom:50%;" align="left"/>

1-7-3、防御其他类型攻击

- 方式1：CSP：

- - 基本：CSP-Content Security Policy，W3 org 草案，主要用于定义页面可加载资源类型，减少 XSS 发生；

  - 作用：

  - - 禁止加载外域代码，防止复杂的攻击逻辑；
    - 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）
    - 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域；
    - 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）
    - 合理使用上报可及时发现 XSS，利于问题的快速修复；

  - 使用：在服务端使用 HTTP的 Content-Security-Policy 头部来指定策略，或在前端设置 meta 标签 (两种方式设置 CSP 效果相同，后者无法使用report)；

  - 比如：只允许加载本域下的脚本：`Content-Security-Policy: **default**-src 'self'`

  - 比如：`<meta http-equiv="Content-Security-Policy" content="form-action 'self';">`

  - 详看：

  - <img src="/Image/Basics/Special/Security/csp-1.png" style="zoom:50%;" align="left"/>

- 方式2：输入内容限制

- - 作用：对于部分输入，可限定不能包含特殊字符或者仅能输入数字、或限定一合理长度，增加 XSS 攻击难度；

- 方式3：HTTP-only Cookie

  - 作用：禁止 JS 脚本读取 cookie 信息

- - 注意：在 Cookie 中设置此项，目的并非对抗 XSS，而是解决 XSS 后的 Cookie 劫持问题；
  - 注意：若服务器设置多个 Cookie，则每一 Cookie 均需设置此字段；

- 方式4：验证码

  - 作用：防止脚本冒充用户操作；

- 方式5：XSS Auditor

  - 基本：Chrome 和 Safari中，内建的一个防御xss攻击的功能模块，相当于一审计器，有预设规则;
  - 作用：防御链接 XSS 攻击，触发后可将内容上报，便于分析跟踪，并同时展示一个空白页面给用户：

- - 比如：`X-XSS-Protection: 1; report=http://example.com/your_report_URI；mode=block`
  - 注意：后端可绕开，仅适用于字符编码，大小写变化；

- 方式8：静态脚本拦截

- 方式9：检测是否有新增的 html 并移除，重写 document.write 方法阻止广告代码写入；

- 方式10：锁死 apply、call

- 方式x：更多防御方式
  - 详看：https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting
  - 详看：https://juejin.im/entry/58a598dc570c35006b5cd6b4



1-8、检查漏洞

- 方式1：使用通用 XSS 攻击字符串手动检测 XSS 漏洞；

- - 代码：`jaVasCript:/*-/*/*\/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e` 
  - 作用：能检测到存在于 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JS 字符串、内联 CSS 样式表等多种上下文中的 XSS 漏洞;
  - 作用：亦能检测 eval()、setTimeout()、setInterval()、Function()、innerHTML、document.write() 等 DOM 型 XSS 漏洞，并且能绕过一些 XSS 过滤器；
  - 使用：在网站的各输入框中提交这个字符串，或者把它拼接到 URL 参数上，即可进行检测；
  - 详看：[Unleashing an Ultimate XSS Polyglot](https://github.com/0xsobky/HackVault/wiki/Unleashing-an-Ultimate-XSS-Polyglot)

- 方式2：使用扫描工具自动检测 XSS 漏洞

  - 比如：[Arachni](https://github.com/Arachni/arachni)、[Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory/)、[w3af](https://github.com/andresriancho/w3af)
  - <img src="/Image/Basics/Special/Security/check-1.png" style="zoom:50%;" align="left"/>



1-9、总结

​	整体 XSS 防范是非常复杂和繁琐，不仅需要在全部需要转义的位置，对数据进行对应的转义而且要防止多余和错误的转义，避免正常用户输入出现乱码，虽然很难通过技术手段完全避免 XSS，但可总结以下原则减少漏洞产生：

<img src="/Image/Basics/Special/Security/summary-1.png" style="zoom:50%;" align="left"/>



1-10、题目



### 二、CSRF

2-1、定义

​	跨站点请求伪造 - Cross-Site Request Forgeries (或 One-click attack、Session riding)；攻击者诱导受害者进入第三方网，在第三方网站中，向被攻击网站发送跨站请求，利用受害者在被攻击网站已获取的注册凭证绕过后台用户验证，以达到冒充用户，对被攻击网站执行某项操作的目的；(即黑客引诱用户打开黑客的网站，利用用户的登陆状态发起跨站请求);

- 注意：CSRF 并非均需 Cookie 才能发送攻击，某些无需认证的操作亦可实现；
- 注意：CSRF 并非只能通过 Get 请求实现，还可通过 POST 请求实现(构造表单)；

<img src="/Image/Basics/Special/Security/csrf.png" style="zoom:50%;" />



2-2、本质

​	HTTP问题；



2-3、案例

- 示例：转账操作：A -> Bank 转账、发起银行请求并得到 Bank 网派发的 cookie、A 访问 C 伪造的网站、C 利用 A 本地 cookie 并加以利用；
- 示例：邮件窃取：A登录邮箱网 -> 打开奇怪邮件中的链接，跳转到空白页面，然后 C 利用 A cookie 进行 A 邮箱的过滤器器配置，使得可将所有邮件发往 C；
- 详看：https://juejin.im/post/5bc009996fb9a05d0a055192#heading-30
- 详看：[www.davidairey.com/google-Gmai…](https://www.davidairey.com/google-gmail-security-hijack/)
- 详看：[github.com/YvetteLau/B…](https://github.com/YvetteLau/Blog/tree/master/Security)



2-4、区别

- XSS 需要注入恶意代码以实施攻击；
- CSRF 无需将恶意代码注入用户页面，仅利用服务器漏洞和用户登录状态来实施攻击；
- XSS 是获取信息，无需提前获知其他用户页面的代码和数据包；
- CSRF 是代替用户完成指定的动作，需要知道其他用户页面的代码和数据包；
- XSS 是用户过分相信网站、认为服务器返回内容总是正确、将攻击者的输入当代码执行；
- CSRF 是网站过分相信用户、认为发起请求总是真实用户；
- CSRF 是由 XSS 实现的，CSRF 也可称为 XSRF；但其本质，XSS 是代码注入问题，CSRF 是 HTTP 问题；
- CSRF 攻击成本比 XSS 低，因用户每天都要访问大量网页，且无法确认每一网页安全性；
- CSRF 发生在第三方域名，而非被攻击网，被攻击网站无法阻止攻击这一行为的发生；

- CSRF 攻击利用受害者在被攻击网的登录凭证，冒充受害者提交操作；而非直接窃取数据，只是使用数据；
- CSRF 通常是跨域操作，因外域更容易被攻击者所控制，但若本域下有容易被利用的功能，比如可发图和链接的论坛，则可直接在本域进行且此类型更危险；
- CSRF 攻击方式更加多样， 只要可以发起请求就能实施相应的攻击；



1-5、分类

- 类型1：GET类型的CSRF
  - 基本：受害者访问诱导页即可触发攻击；
  - <img src="/Image/Basics/Special/Security/type-csrf-1.png" style="zoom:50%;" align="left" />
- 类型2：POST类型的CSRF
  - 基本：使用自动提交表单，受害者访问诱导页即可触发攻击，后端接口不能将安全寄托在仅允许POST上面；
  - <img src="/Image/Basics/Special/Security/type-csrf-2.png" style="zoom:50%;" align="left"/>
- 类型3：链接类型的CSRF：
  - 基本：需要用户点击链接才会触发且需用户在此前登录被攻击网站并保持登录有效状态，常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式；
  - <img src="/Image/Basics/Special/Security/type-csrf-3.png" style="zoom:50%;" align="left"/>



2-6、攻击方式

- 通过在黑客网站中，构造隐藏表单来自动发起 Post 请求；
- 通过引诱链接诱惑用户点击触发请求，利用 a 标签的 href；
- 通过 form 表单、img 图片加载、img的 src 属性来自动发起请求；
- 通过ajax请求， 跨域调用可以加上withCredentials，用于带上被攻击站点的cookie



2-7、防御方式

基本：服务端防止被攻击是不可能的，但可提升防护能力：

- 因CSRF通常从第三方网站发起，被攻击网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性；

方式：根据 CSRF 特点制定防护策略：

- CSRF通常发生在第三方域名 ====> 阻止不明外域的访问：同源检测、Samesite Cookie等 (详看1-7-1)
- CSRF攻击者只是使用而不能获取到Cookie等信息 ====> 提交时要求附加本域才能获取的信息：CSRF Token、双重Cookie验证 (详看1-7-2)

注意：服务端防止被黑客利用成为攻击源头：

- 严格管理所有的上传接口，防止任何预期之外的上传内容(比如HTML)；
- 添加`Header X-Content-Type-Options: nosniff` 防止黑客上传HTML内容的资源(比如图片)被解析为网页；
- 对于用户上传的图片，进行转存或校验，不直接使用用户填写的图片链接；
- 当前用户打开其他用户填写的链接时，需告知风险 (此亦是很多论坛不允许直接在内容中发布外域链接的原因之一，不仅仅是为了用户留存，也有安全考虑)；

注意：客户端提升防护能力：

- 避免打开可疑链接，非要打开时，先清空本地记录和 cookie 信息或使用不常用的浏览器，比如IE；
- 使用网页版浏览邮件或新闻也会带来额外风险，因查看邮件或者新闻消息有可能导致恶意代码攻击；

2-7-1、防御方式-阻止不明外域的访问：利用CSRF通常发生在第三方域名；

- 方式1：同源检测:

- - 原理：利用请求头字段 Origin Header、Referer Header，服务器可通过解析此中域名确定请求来源域 ，且此字段在浏览器发起请求时，大多数情况会自动带上，且不能由前端自定义内容；
  - 作用：通过 Header 验证，可获悉发起请求的来源域名 (本域/子域名/有授权三方域/不可信未知域)，阻止无法确认来源域名情况；

- - - 使用 Origin Header 确定源域名：

    - - 基本：此字段包含请求的域名；

      - 注意：若存在此字段，则进行域名判断；

      - 注意：若不存在字段，则分2种情况处理：

      - - IE11同源策略：

        - - IE 11 不会在跨站 CORS 请求上添加 Origin 标头，Referer 头仍将是唯一标识，根本原因是 IE 11 对同源的定义与其他浏览器不同；
          - 详看：https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#IE_Exceptions

        - 302 重定向：

        - - 302 重定向后的 Origin 不包含在重定向请求中，因 Origin 可能会被认为是其他来源的敏感信息；
          - 措施：302 重定向的情况，基本是重定向到新服务器上的URL，因此浏览器不想将 Origin 泄漏到新服务器上；

    - 使用 Referer Header 确定源域名：

    - - 基本：此字段记录请求来源地址；

      - 注意：对于 Ajax 请求、图片、script 等资源请求，Referer 为发起请求的页面地址；

      - 注意：对于页面跳转，Referer 为打开页面历史记录的前一个页面地址；

      - 问题1：浏览器对于 Referer 具体实现有所差别，并不能保证浏览器自身无安全漏洞，且使用验证 Referer 方法，将安全性转为依赖于第三方(即浏览器)保障，但部分情况下攻击者可隐藏甚至修改请求 Referer；

      - 解决1：2014 年 W3C 发布 Referrer Policy 草案和规定，规定5种设置策略，如下图；

        - <img src="/Image/Basics/Special/Security/referer.png" style="zoom:50%;" align="left"/>
        - <img src="/Image/Basics/Special/Security/referer-1.png" style="zoom:50%;" align="left"/>

      - 使用：若想实现 Referer Header 确定域名的功能，则需配置 Referrer Policy 策略为 same-origin，此后对于同源链接和引用会发送 Referer，此时的 Referer 值为 Host 且不带Path，而当跨域访问时则不会携带 Referer；

        - 设置 Referrer Policy 方法：
          - 方法1：在CSP设置
          - 方法2：页面头部增加 meta 标签
          - 方法3：a标签增加 referrerpolicy 属性

      - 问题2：攻击者仍可控制攻击不携带 Referer

        - 比如：`<img src="http://bank.example/withdraw?amount=10000&for=hacker" referrerpolicy="no-referrer">` 

      - 问题3：其他没有 Referer 情况甚至 Referer 不可信的情况；

      - - IE6、7下使用 window.location.href=url 进行界面的跳转，会缺失 Referer；
        - IE6、7下使用 window.open，也会缺失 Referer；
        - HTTPS 页面跳转到 HTTP 页面，所有浏览器 Referer 都丢失；
        - 点击 Flash 上到达另外一个网站时，Referer 的情况则较杂乱，不太可信；

    - 注意：当以页面请求而来源又是搜索引擎的链接，则亦会被当做 CSRF 攻击，故需判断并过滤；

    - 注意：此类页面请求就暴露在了 CSRF 的攻击范围中，比如：`GET https://example.com/addComment?comment=XXX&dest=orderId；`

    - 注意：CSRF大多数情况下来自三方域名，但并不能排除本域发起，若攻击者有权限在本域发布评论(含链接、图片等，统称UGC)，则其可直接在本域发起攻击，此时同源策略无法达到防护作用；

    - 总结：同源验证是一个相对简单的防范方法，能够防范绝大多数的CSRF攻击，但不适用于对于安全性要求较高，或有较多用户输入内容情况；

- 方式2：Samesite Cookie (从源头解决问题-但有兼容问题)

- - 原理：即在 Set-Cookie 响应头新增 Samesite 属性，以此标明此 Cookie 为“同站 Cookie”，同站 Cookie 只能作为第一方Cookie，不能作为三方Cookie；

  - 作用：能有效防御，但兼容性不佳；

  - 使用：Strict 和 Lax 

  - - 严格模式-Strict：表明此 Cookie 在任何情况下都不能作为三方 Cookie，绝无例外；

    - - 比如：b.com 设置了如下 Cookie：Set-Cookie: foo=1; Samesite=Strict、Set-Cookie: bar=2; Samesite=Lax、Set-Cookie: baz=3；当在 [a.com](http://a.com/) 下发起对 [b.com](http://b.com/) 的请求时，Cookie foo 均不会被包含在 Cookie 请求头中，但 bar 会；
      - 比如：从百度搜索页面甚至天猫页面的链接点击进入淘宝后，淘宝都不会是登录状态，因为淘宝的服务器不会接受 foo cookie；

    - 宽松模式-Lax：比 Strict 放宽限制：允许在发送安全的 HTTP 方法中带上 Cookie，比如 `Get` / `OPTIONS` 、`HEAD` 请求，但不安全方法则不能，比如： `POST`, `PUT`, `DELETE` ；

    - - 比如：请求是这种请求(改变了当前页面或打开了新页面)且同时是个GET请求，则这个Cookie可作为第三方Cookie；
      - 比如：b.com 设置如下 Cookie：Set-Cookie: foo=1; Samesite=Strict、Set-Cookie: bar=2; Samesite=Lax、Set-Cookie: baz=3；当  [a.com](http://a.com/) 点击链接进入 [b.com](http://b.com/) 时，foo 的 Cookie 不会被包含在 Cookie 请求头中，但 bar 和 baz 会，即用户在不同网站之间通过链接跳转是不受影响，因 cookie 可利用，但若请求从 [a.com](http://a.com/) 发起的对 [b.com](http://b.com/) 的异步请求，或页面跳转是通过表单 post 提交触发的不合条件的请求，则 bar 也不会发送；

  - 问题1：宽松模式下，其他网站通过页面跳转过来时可使用Cookie，但安全性降低；

  - 问题2：严格模式下，跳转子域名或新标签重新打开的、刚登陆的网站，之前的 Cookie 都将不复存在，影响用户体验；

  - 问题3：无论何种模式，均不支持子域：比如：种在子域 topic.a.com下的Cookie，并不能使用主域 a.com下种植的 SamesiteCookie，当网站有多个子域名时，不能使用 SamesiteCookie 在主域名存储用户登录信息；

  - 总结：可替代同源验证的方案，但目前尚未成熟，其应用场景有待观望；

2-7-2、防御方式：提交时要求附加本域才能获取的信息：利用CSRF攻击者只是使用而不能获取到Cookie等信息；

- 方式1：CSRF Token(主流) + 验证码

- - 原理：CSRF 攻击者无法直接窃取用户信息(Cookie/Header/网站内容..)，而 CSRF 攻击之所以能成功，是因服务器误将攻击者发送请求当成用户的请求，综合此两点，可要求所有用户请求时均需携带 CSRF 攻击者无法获取到的 Token，服务器通过校验请求是否携带合法 Token，来将正常请求和攻击请求区分开，从而实现 CSRF 攻击防御 (与验证码机制、再次输入密码类似，均可极好遏制 CSRF，只是 Token 方式用户无感知，验证码则适用安全性要求更为严格的场景)；

  - 作用：较之前的同源检测(Referer 检查或 Origin 验证)安全；

  - 使用(简明)：

    - 服务端给用户生成一个 token，加密后返回给用户；
    - 用户在发送请求时，均需携带此 token；
    - 服务端验证 token 是否正确，正确则返回相应信息；

  - 使用(详细)：

  - - 首先，将 CSRF Token 输出到页面中；

    - - 注意：用户打开页面时，服务器为其生成通过加密算法加密的 Token，然后将 Token 保存在 Session 中，并在页面所有 a 和 form 标签中加入；
      - 注意：上述方法适用于服务器返回前端展示的静态页面，若页面加载后动态生成的 HTML，则需前端手动加入 Token；

    - 然后，页面发送请求携带这个Token；

    - - 注意：对于 GET 请求，Token 附在请求地址后，比如：`http://url?csrftoken=tokenvalue`
      - 注意：对于 POST 请求，则在 form 上加入，比如：`<input type="hidden" name="csrftoken" value="tokenvalue"/>`

    - 最后，服务器验证 Token  是否正确；

    - - 注意：判断过程需先解密，然后对比加密字符串和时间戳，校验通过即可；
      - 注意：若在请求中找不到 Token，或提供值与会话中值不匹配，则应 中止请求，并重置 Token、并将事件记录为正在进行的潜在CSRF攻击；

  - 问题1：大型网站中使用 Session 存储 CSRF Token 给服务器带来负担，且 Session 机制会在分布式环境下失效；

  - 解决1：分布式集群， 在 Redis 存储 CSRF Token；

  - 问题2：使用 Session 存储、读取和验证 CSRF Token 会产生较大的复杂度和性能问题；

  - 解决2：采用 Encrypted Token Pattern 方式，此方式中的 Token 是一个计算结果(使用 UserID、时间戳、随机数加密生成)，而非随机字符串，故校验时无需再去读取存储 Token，只需再次计算即可，保证分布式服务下 Token 一致性，又保证不易被破解；计算通过后，再去校验时间戳并做其他校验处理；

  - 总结：只要页面没有 XSS 漏洞泄露 Token，则接口的 CSRF 攻击就无法成功；缺点是实现较复杂，后端需给每个页面写入 Token，或前端每个Form/Ajax请求都携带 Token，而后端则需对每一个接口都进行校验，并保证页面 Token 及请求 Token 一致；工作量较大(鸡蛋里挑骨头)；

- 方式2：双重 Cookie 验证(主流加强)

- - 原理：利用 CSRF 攻击不能获取用户数据特点，可要求 Ajax 和表单请求携带一个 Cookie 中的值；

  - 作用：较上述 CSRF Token 简单方便，可直接通过前后端拦截方式自动化实现，后端校验方便，只需进行请求中字段的对比，无需再进行查询和存储Token；

  - 使用：

  - - 首先，在用户访问网站页面时，(服务端) 向请求域名注入 Cookie，内容为随机字符串(比如 `csrfcookie=v8g9e4ksfhw`)；
    - 然后，在前端向后端发起请求时，取出(上述) Cookie，并添加到 URL 参数中(接上例 `POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw`)；
    - 最后，后端接口验证 Cookie 中的字段与URL参数中的字段是否一致，不一致则拒绝；

  - 问题：

  - - 安全性不高：在大型网站上的安全性不如 CSRF Token 高，不适合大规模应用；
    - 跨域访问失效：若用户访问网站为 `www.a.com`，而后端的 api 域名为 `api.a.com`，则在`www.a.com`下，前端拿不到 `api.a.com` 的Cookie(无法跨域获取)，也即无法完成双重 Cookie 认证；除非认证 Cookie 必须被种在 `a.com` 下，如此实现访问；
    - XSS 漏洞失效：某个子域名存在漏洞被 XSS 攻击，攻击者则可修改主域 a.com下的Cookie (比如延长过期时间)或使用自己配置的 cookie 进行攻击；

  - 优点：

  - - 无需使用 Session，适用面更广、易于实施；
    - Token 储存于客户端中，不会给服务器带来压力；
    - 相对于 CSRF Token，实施成本更低，可在前后端统一拦截校验，而不需要一个个接口和页面添加；

  - 缺点：

  - - Cookie 中增加了额外的字段；
    - 如果有其他漏洞(比如 XSS)，攻击者可以注入 Cookie，那么该防御方式失效；
    - 难以做到子域名的隔离；
    - 为了确保 Cookie 传输安全，采用这种防御方式的最好确保用整站 HTTPS 的方式，如果还没切 HTTPS 的使用这种方式也会有风险；

- 方法3：Anti CSRF Token (待整理)

- - 优势：防御 CSRF 公认最合适方案、token 存放用户页面表单和 Session/Cookie 中，提交请求时，服务端验证两者是否一致；
  - 注意：确保 Token 的 URL 保密性、尽可能地使用 Post 请求 ;
  - 注意：可考虑生成多个有效 Token，避免多页共存场景；

- 方式4：短信验证、双重验证；

2-7-3、防御方式：其他防御方式

- 方式1：CSRF 测试：
  - <img src="/Image/Basics/Special/Security/csrf-1.png" style="zoom:50%;" align="left"/>
- 方式2：CSRF 监控：
  - <img src="/Image/Basics/Special/Security/csrf-2.png" style="zoom:50%;" align="left"/>
- 方式3：随机值法：
  - <img src="/Image/Basics/Special/Security/csrf-3.png" style="zoom:50%;" align="left"/>





2-8、检查漏洞

- 目标表单是否带有 Token 验证
- 是否有验证码
- 是否判断了 Referer
- Allow-access 相关参数设置是否有漏洞
- 目标 jsonp 数据是否可以自定义 callback

2-9、总结

- CSRF自动防御策略：同源检测 (Origin 和 Referer 验证)；
- CSRF主动防御措施：Token验证 或者 双重Cookie验证 以及配合Samesite Cookie；
- 保证页面的幂等性，后端接口不要在GET页面中做用户操作；

2-10、题目



### 三、劫持

#### 	3-1、界面操作劫持

​		3-1-1、定义：点击劫持 - 界面伪装(UI Redressing)；

​		3-1-2、本质：基于视觉欺骗的web会话劫持攻击(用户安全防范意识差)；

​		3-1-3、案例

- 比如A：

- - 攻击者精心伪造诱导点击内容、将此 iframe 置于目标网站上方、设置透明度、点击触发执行某些行为；
  - 比如：Flash 点击劫持、图片覆盖攻击、拖拽劫持、触屏劫持；

- 比如B：

- - 攻击者构建了一个非常有吸引力的网页；
  - 将被攻击的页面放置在当前页面的 iframe 中；
  - 使用样式将 iframe 叠加到非常有吸引力内容的上方；
  - 将iframe设置为100%透明；
  - 你被诱导点击了网页内容，你以为你点击的是***，而实际上，你成功被攻击了；

​		3-1-4、分类

- 类别A：Clickjacking
  - 透明 iframe：覆盖网页之上，诱使用户操作；
  - 注意：属于网络劫持的一种，使用 https 或非对称加密可有效防范数据被中间代理层的劫持者所截获；
  - <img src="/Image/Basics/Special/Security/iframe-1.png" style="zoom:50%;" align="left"/>

- 类别B：DragDrop Jacking
  - 利用页面拖拽功能， 将被攻击页面作为拖拽对象 (IE9以下， ff低版本浏览器)
- 类别C：Tapjacking
  - 待整理‘；
- 类别D：图片覆盖攻击
  - 遮挡网页原有位置含义；

​		3-1-5、防御

- - 方法1：设置 X-Frame-Options：

  - - 基本：微软提出的 http 头部字段，专用于防御 iframe Clickjacking；

    - 作用：设置值，指示浏览器是否允许 `<frame>、<iframe>、<object>` 等标签展示；

      - DENY：          告知浏览器，不允许将响应内容在 frame 中展示，即便域名相同的页面中嵌套也不允许；
      - SAMEORIGIN：    告知浏览器，允许将响应内容在，同域页面的 frame 中展示； 
      - ALLOW-FROM url：告知浏览器，允许将响应内容在，指定来源的 frame 中展示；

    - 使用：

    - - IIS：         配置 Web.config 文件：
      - Apache：配置 `’site'： Header always append X-Frame-Options SAMEORIGIN`
      - nginx：    配置 `'http', 'server'` 或者 `'location’：add_header X-Frame-Options SAMEORIGIN;`
      - <img src="/Image/Basics/Special/Security/iframe-2.png" style="zoom:50%;" align="left"/>

  - 方法2：frame 属性设置  (csp、referrerpolicy、sandbox)

  - - 基本：比如可设置 HTML5 中 iframe 的 sandbox 属性、IE中 iframe 的 security 属性等，专用于防御 iframe Clickjacking；
    - 作用：对 iframe 的行为进行各种限制，充分实现“最小权限“原则；比如：`<iframe sandbox src="..."> ... </iframe>`
    - 使用：
      - 空值/不设值：最严厉调控限制，仅限显示静态资源，无法进行其他操作；
      - allow-scripts：允许 iframe 中执行  JS；
      - allow-forms：允许 iframe 中提交 form表单；
      - allow-same-origin：允许 iframe 中的网页开启同源策略；
      - allow-popups：允许 iframe 中弹出新窗口或标签页 (比如：window.open()，showModalDialog()，target=”_blank”等)；
    - 详看：https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe
    - <img src="/Image/Basics/Special/Security/iframe-3.png" style="zoom:50%;" align="left"/>

  - 方法3：通过 JS 限制 iframe 嵌入规则

    - 基本：用以阻止 iframe 嵌套形式的跳转(代码会修改 iframe-即重定向回主页)
    - <img src="/Image/Basics/Special/Security/iframe-4.png" style="zoom:50%;" align="left" />

  - 方法4：其他方法

    - 详看：https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet



#### 	3-2、运营商劫持

<img src="/Image/Basics/Special/Security/jc-3.png" style="zoom:50%;" />

3-2-1、基本：分四类：DNS劫持、内容劫持、HTTP劫持、HTTPS劫持

- DNS劫持：亦称域名劫持，将用户重新定位到其它网站，比如钓鱼网站，现已被严厉监管；

- - 补充：旨在劫持的网络范围内拦截域名解析请求并分析，将审查范围以外请求放行，否则返回假的 IP 地址或什么都不做使请求失去响应；
  - 效果：无法访问特定网络或访问的是假网址；
  - 本质：对 DNS 解析服务器做手脚，或使用伪造 DNS 解析服务器，通过某些手段取得域名解析记录控制权，进而修改域名解析结果；
  - 注意：用户上网的 DNS 服务器均为运营商分配，故运营商可为所欲为，但不排除运营商被黑可能；
  - <img src="/Image/Basics/Special/Security/jc-1.png" style="zoom:50%;" align="left" />

- 内容劫持：在 DNS 劫持基础上发展过来，目前无解；

- - 前身：运营商为了加快用户的访问速度同时减少自己的流量损耗而做的一个缓存机制；
  - 含义：用户在像服务器请求数据时运营商会将用户请求转移到此缓存池中，若缓存中有则直接返回，无则再去像服务器请求然后拦截并缓存服务端给用户的回调数据；
  - 作用：极大的降低运营商像服务器请求的次数，也能加快用户的访问；
  - 问题：非法商家对缓存池内部作某种处理，比如直接对返回的内容进行修改，使得用户获取到错误数据；
  - <img src="/Image/Basics/Special/Security/jc-2.png" style="zoom:50%;" align="left" />

- HTTP劫持：在运营商的路由器节点上，设置协议检测，一旦发现是 HTTP 请求且是 html 类型请求，则拦截处理；

- - 比如：类似 DNS 劫持返回 302 让用户浏览器跳转到另外的地址，钓鱼网站；
  - 比如：运营商在服务器返回给用户的 HTML  数据中插入 js 或 dom 节点，比如弹窗广告，以获取相应利益；

- HTTPS劫持：此劫持方式有2种：

- - 伪造证书：通过病毒或其他方式将伪造证书的根证书安装在用户系统中(较少)；
  - 代理服务器也有客户的证书与私钥，或客户端与代理认证时不校验合法性，导致可通过代理来与服务端进行数据交互(较多)；

3-2-2、方式

- iframe展示原来正常网页；
- 直接返回一个带广告的HTML；
- 在原html中插入js，再通过js脚本安插广告；
- 注意：劫持方式多种多样，详搜网；

3-2-3、防御

防御方式A：防御 DNS 劫持：

- 方式1：或域名备份或提高安全意识或专门应急小组；
- 详看：https://www.4hou.com/info/news/7597.html
- 方式2：不使用运营商的DNS解析服务，而使用自己的解析服务器或提前在自己的App中将解析好的域名以IP的形式发出去即可绕过运营商DNS解析；
- 详看：https://juejin.im/post/59ba146c6fb9a00a4636d8b6

防御方式B：防御 HTTP/HTTPS 劫持：

- 方式1：加入防运营商劫持代码，能防大部分注入型劫持；

- - 思路：用JS 代码检查所有的外链是否属于白名单
  - 核心：MutationObserver — 监视DOM树所的更改；
  - 随后：加入运营商劫持代码后，不在白名单和安全标签（shendun-eddy）内的script或者iframe都会被remove掉；
  - 问题：http劫持插入的代码往往在第一行， 同步加载的代码已经被执行了，并不能做到百分百拦截；

- 方式2：全站 HTTPS，最根本的解决方式 (一劳永逸)；

- 方式3：进行日志监控，记录证据，向工信部投诉；

- 方式4：增加 CSP 内容安全策略，定义页面可以加载哪些资源，减少 XSS 的发生，详看：1-7-3

防御方式C：其他防御方式

- 方式1：利用 mutationObserver 对 dom 节点监控，若发现非白名单的标签，进行移除

- ```javascript
  var MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  var whiteListForCSP = [
    "http(s)?://(.)+.xxx.com",
    "http(s)?://hm.baidu.com",
    "http(s)?://res.wx.qq.com",
  ];
  
  // Mutation 观察者对象能监听在某个范围内的 DOM 树变化
  if (MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        // 返回被添加的节点,或者为null.
        var nodes = mutation.addedNodes;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var tagName = node.tagName && node.tagName.toLowerCase();
          if (
            (tagName === "script" ||
              tagName === "iframe" ||
              tagName === "img" ||
              tagName === "link") &&
            node.src &&
            node.src.indexOf(
              window.location.protocol + "://" + window.location.hostname
            ) != 0 &&
            !new RegExp("^(" + whiteListForCSP.join(")|(") + ")").test(node.src)
          ) {
            try {
              node.parentNode.removeChild(node);
              console.log("拦截非白名单文件:", node.src);
            } catch (e) {}
          }
        }
      });
    });
  }
  // 传入目标节点和观察选项
  observer.observe(document, {
    subtree: true,
    childList: true,
  });
  
  ```



#### 	3-3、CDN劫持-静态资源完整性校验缺乏

- 基本：因性能考虑，静态资源一般存储到 CDN 以提高应用访问速度，但攻击者可劫持 CDN并污染其中资源，以进行某种操作比如贴片广告、XSS注入等；且攻击者往往使用某种算法或随机进行劫持，故难以定位；

- 防御：使用 SRI，全称 Subresource Integrity - 子资源完整性，指浏览器通过验证资源完整性 (通常从 CDN 获取) 来判断其是否被篡改的安全特性；

- 使用：开启浏览器提供的 SRI (Subresource Integrity-子资源完整性) 功能，即 HTML 页面中通过 `<script>` 和 `<link>` 元素所指定的资源文件，通过给 link 标签或 script 标签增加 integrity 属性即可开启；

- 原理：

- - 当浏览器在 script 或 link 标签中遇到 integrity 属性后，会在执行脚本或者应用样式表前，对比所加载文件的哈希值和期望的哈希值；
  - 当脚本或者样式表的哈希值与期望值不一致时，浏览器必须拒绝执行脚本或应用样式表，且必须返回一网络错误，说明获得脚本或样式表失败；
  - 即浏览器在处理 script 元素时，须检查对应 JS 脚本文件完整性，检查其是否与元素 integrity 属性所指定的 SRI 值一致，若不匹配则中止对此脚本处理；

- 组成：

- - 一部分：指定哈希值的生成算法(sha256、sha384 及 sha512)；

  - 二部分：经过 base64 编码的实际哈希值(经过Base64编码后的该资源文件的Hash值)；

  - 两者间：通过一个短横(-)分割；integrity 值可包含多个由空格分隔的哈希值，只要文件匹配其中任意一个哈希值，即可通过校验并加载该资源；

    ```html
    <script src="https://xxx.js" integrity="sha384-eivAQsRgJIi2KsTdSnfoEGIRTo25NCAqjNJNZalV63WKX3Y51adIzLT4So1pk5tX"></script>
    ```

- 注意：crossorigin="anonymous" 作用是引入跨域脚本，在 H5 中有一种方式可获取到跨域脚本的错误信息：

- - 首先，跨域脚本的服务器须通过 `Access-Controll-Allow-Origin` 头信息允许当前域名可以获取错误信息；
  - 然后，当前域名 script 标签也须声明支持跨域，即 crossorigin 属性，link、img 等标签均支持跨域脚本，若上述2条件无法满足则可使用 trycatch 方案；

- 配置：

- - 首先：利用 webpack 的 `html-webpack-plugin` 和 `webpack-subresource-integrity` 生成包含 integrity 属性 script 标签；

  - ```javascript
    import SriPlugin from "webpack-subresource-integrity";
    
    const compiler = webpack({
      output: {
        crossOriginLoading: "anonymous",
      },
    
      plugins: [
        new SriPlugin({
          hashFuncNames: ["sha256", "sha384"],
          enabled: process.env.NODE_ENV === "production",
        }),
      ],
    });
    ```

  - 然后：利用 webpack 的 `script-ext-html-webpack-plugin` 将 onerror 事件和 onsuccess 事件注入到 script 标签中，当浏览器对资源 SRI 校验失败或请求超时时，便会触发 onerror 事件，进而执行自定操作比如：重新 load 静态文件服务器、或上报异常；

  - ```javascript
    const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
    
    module.exports = {
      //...
      plugins: [
        new HtmlWebpackPlugin(),
        new SriPlugin({
          hashFuncNames: ["sha256", "sha384"],
        }),
    
        new ScriptExtHtmlWebpackPlugin({
          custom: {
            test: /\/*_[A-Za-z0-9]{8}.js/,
            attribute: "onerror",
            value: "loadScriptError.call(this, event)",
          },
        }),
    
        new ScriptExtHtmlWebpackPlugin({
          custom: {
            test: /\/*_[A-Za-z0-9]{8}.js/,
            attribute: "onsuccess",
            value: "loadScriptSuccess.call(this, event)",
          },
        }),
      ],
    };
    ```

  - 然后：将loadScriptError 和 loadScriptSuccess 两个方法注入到 html 中，可以使用 inline 的方式；

  - ```javascript
    (function () {
      function loadScriptError(event) {
        // 上报
        // ...
        // 重新加载 js
        return new Promise(function (resolve, reject) {
          var script = document.createElement("script");
          script.src = this.src.replace(/\/\/11.src.cn/, "https://x.y.z");
          // 替换 cdn 地址为静态文件服务器地址
          script.onload = resolve;
          script.onerror = reject;
          script.crossOrigin = "anonymous";
          document.getElementsByTagName("head")[0].appendChild(script);
        });
      }
    
      function loadScriptSuccess() {
        // 上报
        // ...
      }
      window.loadScriptError = loadScriptError;
      window.loadScriptSuccess = loadScriptSuccess;
    })();
    ```

  - 最终：

  - ```html
    <script type="text/javascript" src="//11.url.cn/aaa.js" integrity="sha256-xxx sha384-yyy" crossorigin="anonymous"
    		onerror="loadScriptError.call(this, event)" onsuccess="loadScriptSuccess"></script>
    ```

  - 注意：触发 onerror 事件时，无法进一步细分 onerror 原因，或校验失败，或请求超时；

  - 注意：假若要判断 CDN 劫持，可通过再请求一次数据，并比较文件部分内容即可(前n或后n字符)；

  - 注意：通常 CDN 劫持者会在 js 文件最前面注入一些代码来达到其目的，因注入中间代码需要 AST 解析，成本较高，故比较全部字符串没有意义；

  - <img src="/Image/Basics/Special/Security/cdn-1.png" style="zoom:50%;" align="left"/>

- 详看：[使用 SRI 解决 CDN 劫持](https://mp.weixin.qq.com/s?__biz=MzIzNjcwNzA2Mw==&mid=2247486163&idx=1&sn=92105500004f64e3b946a6a2010b69c8&chksm=e8d2874bdfa50e5d547a731e33e6e7fc12bf4e0e8993176d763b91626528ecdc45226bb87e79&mpshare=1&scene=1&srcid=0110F1yAtDRU1nbbRs3oo4kO&rd2werd=1#wechat_redirect)



#### 	3-4、流量劫持

- 防御：`<script>` 加上onerror监测劫持，资源去除js后缀防劫持；

- 详看：https://www.zhihu.com/question/35720092

- 详看：https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

- ```javascript
  var path = require("path");
  var writeJson = require("write-json");
  var HtmlWebpackPlugin = require("html-webpack-plugin");
  var SriPlugin = require("webpack-subresource-integrity");
  var WebpackAssetsManifest = require("webpack-assets-manifest");
  var ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
  var ScriptExtInlineHtmlWebpackPlugin = require("script-ext-inline-html-webpack-plugin");
  
  var attackCatch = `
  (function () {
    function log(url, ret) {
      return fetch(url, {
        method: "post",
        body: encodeURIComponent(
          JSON.stringify({
            sizes: ret.sizes,
            diff: ret.diff,
            jscontent: ret.context,
            cdn: ret.cdn,
            edge: ret.edge,
            url: ret.url,
            protocol: ret.protocol,
          })
        ),
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      });
    }
    function fetchError(res) {
      return Promise.resolve({
        text: function () {
          return res.status;
        },
        headers: res.headers || {},
        status: res.status,
      });
    }
    function loadscript(url) {
      return fetch(url)
        .then(function (res) {
          if (res.ok) {
            return res;
          }
          return fetchError(res);
        })
        .catch(function (err) {
          return fetchError({ status: err });
        });
    }
    function getHeader(res1, res2, key) {
      if (res1.headers.get) {
        return res1.headers.get(key);
      } else if (res2.headers.get) {
        return res2.headers.get(key);
      } else {
        return "";
      }
    }
    window.attackCatch = function (ele) {
      var src = ele.src;
      var protocol = location.protocol;
      function getSourceData(res1, res2, len1, len2, context1) {
        return Promise.resolve({
          diff: len1 === len2 ? 0 : 1,
          sizes: [len1, len2].join(","),
          cdn: getHeader(res1, res2, "X-Via-CDN"),
          edge: getHeader(res1, res2, "X-via-Edge"),
          context: context1 ? context1 : res1.status + "," + res2.status,
          url: src,
          protocol: protocol,
        });
      } //如果不支持fetch，可能就是404或者cdn超时了，就不发log了。
      if (window.fetch) {
        //加载2次，对比有缓存无缓存的size
        Promise.all([
          loadscript(src),
          loadscript(src + "?vt=" + new Date().valueOf()),
        ])
          .then(function (values) {
            var res1 = values[0],
              res2 = values[1];
            //如果支持fetch，我们二次获取时根据http.status来判断，只有200才回报。
            if (res1.status == "200" && res2.status == "200") {
              var cdn = res1.headers.get("X-Via-CDN");
              var edge = res1.headers.get("X-Via-Edge");
              return Promise.all([res1.text(), res2.text()]).then(function (
                contexts
              ) {
                var context1 = contexts[0];
                var len1 = context1.length,
                  len2 = contexts[1].length;
                return getSourceData(res1, res2, len1, len2, context1);
              });
            } else if (res1.status == "200") {
              return res1.text().then(function (context) {
                var len1 = context.length;
                return getSourceData(res1, res2, len1, -1);
              });
            } else if (res2.status == "200") {
              return res2.text().then(function (context) {
                var len2 = context.length;
                return getSourceData(res1, res2, -1, len2);
              });
            } else {
              return getSourceData(res1, res2, -1, -1);
            }
          })
          .then(function (ret) {
            if (ret && ret.context) log("日志服务接口，", ret);
          });
      }
    };
  })();
  `;
  
  module.exports = {
    entry: {
      index: "./index.js",
    },
    output: {
      path: __dirname + "/dist",
      filename: "[name].js",
      crossOriginLoading: "anonymous",
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new SriPlugin({
        hashFuncNames: ["sha256", "sha384"],
        enabled: true,
      }),
      new WebpackAssetsManifest({
        done: function (manifest, stats) {
          var mainAssetNames = stats.toJson().assetsByChunkName;
          var json = {};
          for (var name in mainAssetNames) {
            if (mainAssetNames.hasOwnProperty(name)) {
              var integrity =
                stats.compilation.assets[mainAssetNames[name]].integ;
              //重新⽣成⼀次integrity的json⽂件，因为版本问题，webpack4才⽀持直接⽣成。
              json[mainAssetNames[name]] = integrity;
            }
          }
          writeJson.sync(__dirname + "/dist/integrity.json", json);
        },
      }),
      new ScriptExtHtmlWebpackPlugin({
        custom: {
          test: /.js$/,
          attribute: 'onerror="attackCatch(this)"',
        },
      }),
      new ScriptExtInlineHtmlWebpackPlugin({
        prepend: attackCatch,
      }),
    ],
  };
  ```

#### 	3-5、JSON劫持

- 详看：https://paper.seebug.org/130/



### 四、前端加密

RSA非对称加密方式



### 五、其他安全问题

5-1、DDOS攻击 (分布式拒绝服务攻击 (DDoS-Distributed Denial of Service))

- 基本：指借助于客户/服务器技术，将多个计算机联合起来作为攻击平台，对一或多个目标发动攻击，从而成倍地提高拒绝服务攻击的威力；
- 目的：利用目标系统网络服务功能缺陷或直接消耗其系统资源，使该目标系统无法提供正常服务；
- 形式：通过大量合法请求，占用大量网络资源，以达到瘫痪网络目的：
  - 通过使网络过载来干扰甚至阻断正常的网络通讯；
  - 通过向服务器提交大量请求，使服务器超负荷；
  - 阻断某服务与特定系统或个人的通讯；
  - 阻断某一用户访问服务器；

5-1-1、SYN Flood Attack

- 背景：在三次握手过程中，服务器发送 SYN-ACK 之后，收到客户端的 ACK 前的 TCP 连接称为半连接 (half-open connect)，此时服务器处于 SYN_RCVD 状态，而当收到 ACK 后，服务器才转入 ESTABLISHED 状态；
- 基本：属于 DDOS 攻击中的一种具体表现形式，攻击者在短时间内，伪造大量不存在的 IP 地址，不断向服务器发送 SYN 包，服务器则不断响应确认包，并等待客户确认，而由于源地址不存在，服务器则需不断地重发直至超时，同时这些伪造的 SYN 包，将长时占用服务端的未连接队列，此时正常的 SYN 请求将会被丢弃，导致目标系统运行缓慢，严重者会引起网络堵塞甚至系统瘫痪；
- 检测：检测 SYN 攻击非常方便，当在服务器上拥有大量的半连接状态连接时，尤其是源 IP 地址是随机的，基本上可断定 SYN 攻击；
- 防御：
  - 缩短超时 (SYN Timeout) 时间；
  - 增加最大半连接数；
  - 过滤网关防护；

5-2、接口防刷

- 基本：API 频繁调用
- 防御：IP限制、验证码、请求头消息校验等；
- 详看：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/254
- <img src="/Image/Basics/Special/Security/else-1.png" style="zoom:50%;" align="left"/>

5-3、第三方依赖包：

- 基本：第三方包的安全漏洞导致的风险；
- 防御：自动化检查漏洞工具：NSP、Snyk；

5-4、错误内容推断

- 基本：攻击者提交脚本文件，躲过了文件类型校验，服务端存储，小白访问时会请求伪装成图片的 JS 脚本，此时若浏览器错误推断此响应内容类型(MIME types)，则会将此图片文件当做 JS  脚本执行；
- 原因：后端服务器在返回响应中设置的 Content-Type Header 仅供浏览器提供当前响应内容类型的建议，而浏览器有可能会自作主张地，根据响应中实际内容去推断内容类型；
- 防御：设置 `X-Content-Type-Options` 这个 HTTP Header 明确禁止浏览器去推断响应类型；
- 详看：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options

5-5、本地存储泄露

- 基本：前端通过 cookie 存储用户信息支撑应用运行、前后分离、离线模式、SPA 应用趋势，若前端应用存在漏洞，则容易被窃取；
- 防御：前端不存储敏感信息；

5-6、控制台代码注入

- 基本：黑客诱骗用户去控制台粘贴恶意代码；

5-7、HTTPS流程、证书与安全问题

5-8、npm audit

5-9、github security