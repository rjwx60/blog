# 总结

前端安全的保证主要靠服务端，前端再怎么处理，也只是混淆(手动二哈狗头)，当然这里不是说前端无任何作用，基本的过滤实现、可以减轻大量服务端的工作任务、XSS 的部分攻击，比如发射型，就是前端没做好基本过滤导致的；



## 一、XSS

### 1-1、定义与形式

**<u>*XSS(Cross Site Script)跨站脚本攻击*</u>**：即攻击者想方设法向用户页面注入恶意脚本，在浏览器渲染数据时进行攻击；主分三种：

- **存储型**：即攻击脚本被存储在服务端，每当无辜用户请求某页面时，页面携带恶意脚本返回，并随页面渲染而执行攻击；
- **反射型**：将攻击脚本混在URL中，服务端接收并将恶意代码当做参数取出、拼接在页面中返回，浏览器解析后即执行恶意代码；
- **DOM型**：将攻击脚本写在URL中，诱导用户点击该URL，若 URL 被解析，则攻击脚本就会被运行；此类型攻击不经过服务端；
- 注意：过往此种攻击案例是跨域的，故称跨站脚本，但发展至今，是否跨域已不再重要，但名称却保留了下来；



**<u>形式1：评论等输入入口</u>**

通过评论、论坛等用户输入入口，输入非法代码；(在 HTML 中内嵌文本中，恶意内容以 script 标签形成注入)；

首先，input 输入：`><script>alert('XSS');</script>`；

- 然后，浏览器请求： `http://xxx/search?keyword="><script>alert('XSS');</script>`；
- 最后，服务端解析出请求参数 keyword，得到 `><script>alert('XSS');</script>`，拼接并返回，用户访问时受攻击；

应对：前端使用HTML转义**<u>控制请求输入，escapeHTML</u>**；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162415.png" style="zoom:50%;" align=""/>

**<u>形式2：参数解析漏洞</u>**

通过 query string 参数解析的漏洞， 插入非法代码(在标签的 href、src 等属性中，包含 JS: 等可执行代码)；

原理： JS: 字符、特殊字符若出现在特定位置会引发 XSS 攻击；

比如A：

- 首先，input 输入；
- 然后，浏览器请求： `http://xxx/?redirect_to=javascript:alert('XSS’)`；或 `http://xxx/?redirect_to=jAvascRipt:alert('XSS')`
- 最后，服务端解析成 `<a href="javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；

比如B：

- 首先，input 输入；
- 然后，浏览器请求： `http://xxx/?redirect_to=%20javascript:alert('XSS’)`；
- 最后，服务端解析成 `<a href=" javascript:alert(&#x27;XSS&#x27;)">跳转...</a>` 并返回，用户点击触发；

应对：前端**<u>控制请求输入</u>**，对于链接跳转如 `<a href="xxx"` 或 `location.href="xxx"`，要检验其内容并禁止以 "javascript:" 开头链接和非法 scheme；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162416.png" style="zoom:50%;" align=""/>

**<u>形式3：内联 JSON 漏洞</u>**

首先，插入 JSON 的地方不能使用 `escapeHTML()`，因转义 " 后，JSON 格式会被破坏；

然后，当 JSON 中包含 U+2028 或 U+2029 这两个字符时，不能作为 JS 的字面量使用，否则会抛出语法错误；

然后，当 JSON 中包含字符串 `</script>` 时，当前 script 标签将会被闭合，后面字符串内容浏览器会按照 HTML 进行解析；

最后，通过增加下一个 `<script>` 标签等方法就可以完成注入；

应对：**<u>对内联 JSON 进行转义</u>**，`escapeEmbedJSON()` 函数；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162417.png" style="zoom:50%;" align=""/>



### 1-2、防御方式

**<u>*不管何种 XSS 攻击，均需被浏览器执行才可发起攻击，故可以此作为防御切入口：*</u>**

首先，**<u>输入输出检查/转义/过滤(HTML标签、URL-encodeURIComponent)</u>**；不能相信任何输入数据；而不管接收什么，或发送什么，都需进行各种转义过滤；

- 向服务端发送数据要进行 URL 的 `encodeURIComponent` 转义与特定标签符转义；而接收服务端返回数据则同理；
- 对于服务端返回的数据，要谨慎选择输出类 API，而应使用 textContent、setAttribute、innerText；避免使用能将字符串作为代码执行的 API，比如 JS 的 eval()、setTimeout()、setInterval()，避免 innerHTML、outerHTML、document.write()，比如 vue 不使用 v-html / dangerouslySetInnerHTML；

然后，鉴于 XSS 目标多数是获取用户 Cookie，可设置 **<u>Cookie:HttpOnly</u>** 字段，使 JS 无法操作 Cookie 值；

然后，后端若需要进行 HTML 拼接，则须**<u>选择安全、成熟的转义库</u>** 基础之上，进行更细致的转义策略制定；

然后，**<u>后端配置 CSP-浏览器内容安全策略(兼容性问题不大)</u>**，让服务器决定浏览器可加载的资源白名单，阻止名单以外的资源加载与运行；告诉浏览器哪些外部资源可加载和执行；只需配置规则，如何拦截是由浏览器自实现；具体做法是：配置 HTTP Header 中的  `Content-Security-Policy`；(还可设置 meta 标签 `<meta http-equiv="Content-Security-Policy" content="form-action 'self';">`)

- 只允许加载本站资源：`Content-Security-Policy: default-src ‘self’`
- 只允许加载 HTTPS 协议图片：`Content-Security-Policy: img-src https://*`
- 允许加载任何来源框架：`Content-Security-Policy: child-src 'none'`

CSP 可实现：

- 禁止加载外域代码，防止复杂的攻击逻辑；
- 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）
- 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域；
- 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）
- 合理使用上报可及时发现 XSS，利于问题的快速修复；

然后，**<u>重写 XSS 常用方法</u>**；锁死 apply/call(函数劫持，若非本站脚本无法执行…Soon)、document.write(重写方法阻止广告代码注入)，XSSAuditor(Chrome内建防御模块—后端可绕开仅适用于字符编码) 等方法；

最后，**<u>漏洞检测</u>**；使用 XSS 攻击字符串检测 XSS 漏洞(输入框输入)、并使用扫描工具进行 XSS 漏洞检测；[Arachni](https://github.com/Arachni/arachni)、[Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory/)、[w3af](https://github.com/andresriancho/w3af)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923225423.png" style="zoom:50%;" align=""/>

最后的最后，使用成熟的 JS XSS 过滤库，比如：[兔展大佬写的](https://github.com/leizongmin/js-xss)|[介绍MD](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)

```js
// 极简输入过滤
function filterXSS (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/ /g, '&nbsp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\r{0,}\n/g, '<br/>')
}
```







## 二、CSRF

### 2-1、定义与形式

**<u>*CSRF攻击(Cross-site request forgery)跨站请求伪造*</u>**：指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户 **<u>目前的登录状态</u>** 发起跨站请求；

- 比如：攻击者诱导受害者进入第三方网站A，利用受害者在被攻击网站B已获取的注册凭证绕过后台用户验证，由此向被攻击网站B发起跨站请求，以达到冒充用户、对被攻击网站B执行非法操作的目的；

- 通俗：黑客引诱用户打开黑客的网站，利用用户的登陆状态发起跨站请求)；

**<u>CSRF 与 XSS 攻击差别：</u>**

XSS 需注入恶意代码以实施攻击；

- CSRF 无需将恶意代码注入用户页面，仅利用服务器漏洞和用户登录状态来实施攻击；

XSS 是获取信息，无需提前获知其他用户页面的代码和数据包；

- CSRF 是代替用户完成指定的动作，需要获知其他用户页面的代码和数据包；

XSS 是用户过分相信网站、认为服务器返回内容总是正确、将攻击者的输入当代码执行；

- CSRF 是网站过分相信用户、认为发起请求总是真实用户；

CSRF 攻击方式更加多样， 只要可以发起请求就能实施相应的攻击；

CSRF 发生在第三方域名，而非被攻击网，被攻击网站无法阻止攻击这一行为的发生；

CSRF 攻击成本比 XSS 低，因用户每天都要访问大量网页，且无法确认每一网页安全性；

CSRF 是由 XSS 实现的，CSRF 也可称为 XSRF；但其本质，XSS 是代码注入问题，CSRF 是 HTTP 问题；

CSRF 攻击利用受害者在被攻击网的登录凭证，冒充受害者提交操作；而非直接窃取数据，只是使用数据；

CSRF 通常是跨域操作，因外域更容易被攻击者所控制，但若本域下有容易被利用的功能，比如可发图和链接的论坛，则可直接在本域进行且此类型更危险；

CSRF 攻击无需将恶意代码注入用户当前页面中，而是跳转新页面，利用服务器 **<u>验证漏洞</u>** 和 **<u>用户先前登录状态</u>** 来模拟用户行为；

**<u>CSRF 攻击形式：</u>**

GET 类型的 CSRF：自动发送 GET 请求，比如：

- ```html
  <img src="https://xxx.com/info?user=hhh&count=100">
  ```

- 此时，请求会自动携带此网站的 Cookie 信息，若服务端无相应验证，就会允许操作；

POST 类型的 CSRF：自动发送 POST 请求，提交表单，比如：

- ```html
  <form id='hacker-form' action="https://xxx.com/info" method="POST">
    <input type="hidden" name="user" value="hhh" />
    <input type="hidden" name="count" value="100" />
  </form>
  <script>document.getElementById('hacker-form').submit();</script>
  ```

链接类型的 CSRF：诱导点击发送 GET 请求：

- ```html
  <a href="https://xxx/info?user=hhh&count=100" taget="_blank">点击进入修仙世界</a>
  ```

  

### 2-2、防御方式

- CSRF自动防御策略：同源检测 (Origin 和 Referer 验证)(请求头易伪造)；
- CSRF主动防御措施：Token 验证 或者 双重 Cookie 验证 以及配合 Samesite Cookie(兼容性)；
- 保证页面的幂等性，后端接口不要在 GET 页面中做用户操作； 



**<u>CSRF "通常"发生在三方域名 ====> 阻止不明外域的访问：同源检测(Origin、Referer)、Samesite Cookie 等；</u>**

**<u>CSRF 攻击者只能使用而不能获取 Cookie 等信息 ====> 提交时要求附加本域才能获取的信息：CSRF Token、双重Cookie验证；</u>**

其他：服务端应防止被黑客利用，成为攻击源头：

- 严格管理所有的上传接口，防止任何预期之外的上传内容 (比如 HTML)；
- 添加 `Header X-Content-Type-Options: nosniff` 防止黑客上传 HTML 内容的资源(比如图片)被解析为网页；
- 对于用户上传的图片，进行转存或校验，不直接使用用户填写的图片链接；
- 当前用户打开其他用户填写的链接时需告知风险 (这也是很多论坛不允许直接在内容中发布外链的原因之一，不全是为用户留存度，更有安全考虑)；

其他：客户端应提升防护能力：

- 避免打开可疑链接，非要打开时，先清空本地记录和 cookie 信息或使用不常用的浏览器，比如IE；
- 使用网页版浏览邮件或新闻也会带来额外风险，因查看邮件或者新闻消息有可能导致恶意代码攻击；



**<u>阻止不明外域访问：</u>**

- **<u>验证 Referer</u>**：服务端通过验证请求头的 Referer(记录请求来源地址)、Origin(记录请求域名) 字段来验证来源站点，但两者请求头很容易伪造(通过 Ajax 中自定义请求头)、本域发起的 CSRF 攻击无法防御、HTTPS 页面跳转到 HTTP 页面所有浏览器 Referer 都丢失；总结：同源验证是相对简单的防范方法，能够防范绝大多数的CSRF  攻击，但不适用于对于安全性要求较高，或有较多用户输入内容情况(问题多多)；

- **<u>设置 Cookie SameSite</u>**：让 Cookie 不随跨站请求发出(Strict—完全禁止三方携带、Lax—GET方式表单或a标签GET请求、None—默认模式)；缺点明显：严格模式下，跳转子域名或新标签重新打开、刚登陆的网站，之前的 Cookie 都将不复存在，影响用户体验；无论何种模式，均不支持子域：比如：种在子域 topic.a.com下的 Cookie，并不能使用其主域下种植的 SamesiteCookie，当网站有多个子域名时，不能使用 SamesiteCookie 在主域名存储用户登录信息；总结：可替代同源验证的方案，但目前尚未成熟，其应用场景有待观望；

**<u>请求附加本域信息</u>**：

- **<u>验证 Token</u>**：

既然 CSRF 攻击多利用浏览器的自携带 Cookie 发起请求的这一特性，则让其不能自携带的内容即可；遂使用 Token；用户请求服务器时，服务器返回一个 token，后续每个请求均需同时携带 token 和 cookie 才会被认为是合法请求；使用(详细)：

- 首先，将 CSRF Token 输出到页面中；
  - 注意：用户打开页面时，服务器为其生成通过加密算法加密的 Token，然后将 Token 保存在 Session 中，并在页面所有 a 和 form 标签中加入；
  - 注意：上述方法适用于服务器返回前端展示的静态页面，若页面加载后动态生成的 HTML，则需前端手动加入 Token；

- 然后，页面发送请求携带这个Token；

  - 注意：对于 GET 请求，Token 附在请求地址后，比如：`http://url?csrftoken=tokenvalue`
  - 注意：对于 POST 请求，则在 form 上加入，比如：`<input type="hidden" name="csrftoken" value="tokenvalue"/>`

- 最后，服务器验证 Token  是否正确；

  - 注意：判断过程需先解密，然后对比加密字符串和时间戳，校验通过即可；
  - 注意：若在请求中找不到 Token，或提供值与会话中值不匹配，则应 中止请求，并重置 Token、并将事件记录为正在进行的潜在CSRF攻击；

问题1-1：大型网站中使用 Session 存储 CSRF Token 给服务器带来负担，且 Session 机制会在分布式环境下失效；

解决1-1：分布式集群， 在 Redis 存储 CSRF Token；

问题1-2：使用 Session 存储、读取和验证 CSRF Token 会产生较大的复杂度和性能问题；

解决1-2：采用 Encrypted Token Pattern 方式，此方式中的 Token 是一计算结果(使用 UserID、时间戳、随机数加密生成)，而非随机字符串，故校验时无需再去读取存储 Token，只需再次计算即可，保证分布式服务下 Token 一致性，又保证不易被破解；计算通过后，再去校验时间戳并做其他校验处理；

总结：只要页面没有 XSS 漏洞，泄露 Token，则接口的 CSRF 攻击就无法成功；缺点是实现较复杂，后端需给每个页面写入 Token，或前端每个Form/Ajax 请求都携带 Token，而后端则需对每一个接口都进行校验，并保证页面 Token 及请求 Token 一致；工作量较大(鸡蛋里挑骨头)；

- **Anti CSRF Token**：防御 CSRF 公认最合适方案、token 存放用户页面表单和 Session/Cookie 中，提交请求时，服务端验证两者是否一致；感觉类似 CSRF token；只是存放位置不同；前者分开存放，这里合并存放；

- **<u>其他方式：短信认证</u>**

**<u>漏洞检查</u>**：

- 是否有验证码、是否判断 Referer、目标表单是否带有 Token 验证；
- Allow-access 相关参数设置是否有漏洞、目标 jsonp 数据是否可以自定义 callback、CSRF Tester；







## 三、挟持

劫持一般会发生在报文传输时的内容改造，常见为 **<u>界面劫持</u>**，即透明的 iframe 或 图片，点击目的地与最终目的地不符；预防策略：

- 服务端添加 X-Frame-Options 响应头，如此浏览器就会阻止嵌入网页的渲染；
- 利用 JS 判断顶层视口的域名是否与本页域名一致，不一致则不允许操作
  - `top.location.hostname === self.location.hostname`；
- 利用 JS 完成渲染后，修改所有 ifame 属性值，添加 csp、referrerpolicy、sandbox 属性，限制 iframe 行为；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162426.png" style="zoom:50%;" align=""/>

- 敏感操作使用更复杂的步骤（验证码、输入项目名称以删除—Github)
- 全链路 HTTPS；

其他形式的还有：DNS劫持(错误导向)、CDN 劫持(劫持 CDN 并污染其中资源)

