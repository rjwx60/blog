# 二、CSRF

## 2-1、定义

**<u>跨站点请求伪造 - Cross-Site Request Forgeries (或 One-click attack、Session riding)</u>**：指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户 **<u>目前的登录状态</u>** 发起跨站请求；比如：攻击者诱导受害者进入第三方网站A，利用受害者在被攻击网站B已获取的注册凭证绕过后台用户验证，由此向被攻击网站B发起跨站请求，以达到冒充用户、对被攻击网站B执行非法操作的目的；(即黑客引诱用户打开黑客的网站，利用用户的登陆状态发起跨站请求);

- 注意：CSRF 并非均需 Cookie 才能发送攻击，某些无需认证的操作亦可实现；
- 注意：CSRF 并非只能通过 Get 请求实现，还可通过 POST 请求实现(构造表单)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162423.png" style="zoom:50%;" />



## 2-2、本质与案例

本质是 HTTP 问题；案例如下：

- 示例：转账操作：A -> Bank 转账、发起银行请求并得到 Bank 网派发的 cookie、A 访问 C 伪造的网站、C 利用 A 本地 cookie 并加以利用；
- 示例：邮件窃取：A登录邮箱网 -> 打开奇怪邮件中的链接，跳转到空白页面，然后 C 利用 A cookie 进行 A 邮箱的过滤器器配置，使得可将所有邮件发往 C；
- 详看：https://juejin.im/post/5bc009996fb9a05d0a055192#heading-30
- 详看：[www.davidairey.com/google-Gmai…](https://www.davidairey.com/google-gmail-security-hijack/)
- 详看：[github.com/YvetteLau/B…](https://github.com/YvetteLau/Blog/tree/master/Security)



## 2-4、区别

- XSS 需要注入恶意代码以实施攻击；
  - CSRF 无需将恶意代码注入用户页面，仅利用服务器漏洞和用户登录状态来实施攻击；
- XSS 是获取信息，无需提前获知其他用户页面的代码和数据包；
  - CSRF 是代替用户完成指定的动作，需要获知其他用户页面的代码和数据包；
- XSS 是用户过分相信网站、认为服务器返回内容总是正确、将攻击者的输入当代码执行；
  - CSRF 是网站过分相信用户、认为发起请求总是真实用户；
- CSRF 攻击方式更加多样， 只要可以发起请求就能实施相应的攻击；
- CSRF 发生在第三方域名，而非被攻击网，被攻击网站无法阻止攻击这一行为的发生；
- CSRF 攻击成本比 XSS 低，因用户每天都要访问大量网页，且无法确认每一网页安全性；
- CSRF 是由 XSS 实现的，CSRF 也可称为 XSRF；但其本质，XSS 是代码注入问题，CSRF 是 HTTP 问题；
- CSRF 攻击利用受害者在被攻击网的登录凭证，冒充受害者提交操作；而非直接窃取数据，只是使用数据；
- CSRF 通常是跨域操作，因外域更容易被攻击者所控制，但若本域下有容易被利用的功能，比如可发图和链接的论坛，则可直接在本域进行且此类型更危险；
- CSRF 攻击并不需要将恶意代码注入用户当前页面的`html`文档中，而是跳转到新的页面，利用服务器的 **<u>验证漏洞</u>** 和 **<u>用户先前登录状态</u>** 来模拟用户进行操作；



## 2-5、分类

受害者访问诱导页后可能会发生三种事：

- GET 类型的 CSRF：自动发送 GET 请求，比如：

  - ```html
    <img src="https://xxx.com/info?user=hhh&count=100">
    ```

  - 此时，请求会自动携带此网站的 Cookie 信息，若服务端无相应验证，就会允许操作；

- POST 类型的 CSRF：自动发送 POST 请求，提交表单，比如：

  - ```html
    <form id='hacker-form' action="https://xxx.com/info" method="POST">
      <input type="hidden" name="user" value="hhh" />
      <input type="hidden" name="count" value="100" />
    </form>
    <script>document.getElementById('hacker-form').submit();</script>
    ```

- 链接类型的 CSRF：诱导点击发送 GET 请求：

  - ```html
    <a href="https://xxx/info?user=hhh&count=100" taget="_blank">点击进入修仙世界</a>
    ```

    

## 2-6、攻击方式

- 通过在黑客网站中，构造隐藏表单来自动发起 Post 请求；
- 通过引诱链接诱惑用户点击触发请求，利用 a 标签的 href；
- 通过 form 表单、img 图片加载、img的 src 属性来自动发起请求；
- 通过ajax请求， 跨域调用可以加上 withCredentials，用于带上被攻击站点的 cookie



## 2-7、防御方式

基本：服务端防止被攻击是不可能的，但可提升防护能力：

因为 CSRF 通常从第三方网站发起，被攻击网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性；

方式：根据 CSRF 特点制定防护策略：

- CSRF 通常发生在第三方域名 ====> 阻止不明外域的访问：同源检测、Samesite Cookie 等；
- CSRF 攻击者只是使用而不能获取到Cookie等信息 ====> 提交时要求附加本域才能获取的信息：CSRF Token、双重Cookie验证；

  - 注意：服务端应防止被黑客利用，成为攻击源头：
    - 严格管理所有的上传接口，防止任何预期之外的上传内容 (比如 HTML)；
    - 添加 `Header X-Content-Type-Options: nosniff` 防止黑客上传 HTML 内容的资源(比如图片)被解析为网页；
    - 对于用户上传的图片，进行转存或校验，不直接使用用户填写的图片链接；
    - 当前用户打开其他用户填写的链接时需告知风险 (这也是很多论坛不允许直接在内容中发布外链的原因之一，不全是为用户留存度，更有安全考虑)；
  - 注意：客户端应提升防护能力：
    - 避免打开可疑链接，非要打开时，先清空本地记录和 cookie 信息或使用不常用的浏览器，比如IE；
    - 使用网页版浏览邮件或新闻也会带来额外风险，因查看邮件或者新闻消息有可能导致恶意代码攻击；



### 2-7-1、阻止不明外域访问

即利用 CSRF 通常发生在第三方域名；

### 2-7-1-1、同源检测

原理：服务器通过解析<u>请求头字段</u>  **<u>Origin</u>**、**<u>Referer</u>** 确定来源域，且字段在浏览器发起请求时自动携带(大多数情况)，前端无法自定义；

作用：通过请求头字段的验证，可获悉发起请求的来源域名 (本域/子域名/有授权三方域/不可信未知域)，阻止无法确认来源域名或黑名单域名；

缺点：两者均可伪造，通过 Ajax 中自定义请求头即可，安全性略差；

- 注意：当以页面请求而来源又是搜索引擎的链接，则亦会被当做 CSRF 攻击，故需判断并过滤；
- 注意：此类页面请求就暴露在了 CSRF 的攻击范围中，比如：`GET https://example.com/addComment?comment=XXX&dest=orderId；`
- 注意：CSRF 大多时候来自三方域名，但并不能排除本域发起，若攻击者有权限在本域发布评论(含链接、图片等统称UGC)，则其可直接在本域发起攻击，此时同源策略无法达到防护作用；

### 2-7-1-1-1、请求头 Origin 字段

字段包含请求的域名；注意：若存在此字段，则进行域名判断；若不存在字段，则分2种情况处理：

- IE11同源策略：
  - IE 11 不会在跨站 CORS 请求上添加 Origin 标头，Referer 头仍将是唯一标识，根本原因是 IE 11 对同源的定义与其他浏览器不同；
  - 详看：https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#IE_Exceptions

- 302 重定向：

  - 302 重定向后的 Origin 不包含在重定向请求中，因 Origin 可能会被认为是其他来源的敏感信息；
  - 措施：302 重定向的情况，基本是重定向到新服务器上的URL，因此浏览器不想将 Origin 泄漏到新服务器上；

### 2-7-1-1-2、请求头 Referer 字段

字段记录请求来源地址 (URL)；

- 注意：对于 Ajax 请求/图片/script 等资源请求，Referer 为发起请求的页面地址；对于页面跳转，Referer 则为打开页面历史记录的前一页地址；
- 问题A：浏览器对于 Referer 具体实现有所差别，无法保证浏览器自身无安全漏洞，且使用验证 Referer 方法，将安全性转为依赖于浏览器保障，此外某些情况下，攻击者可隐藏甚至修改请求 Referer；
- 解决A：2014 年 W3C 发布 Referrer Policy 草案和规定，规定5种设置策略，如下图；

<img src="https://i.loli.net/2020/09/06/BseNGqtAZcdYIyE.png" style="zoom:50%;" align=""/>

<img src="https://i.loli.net/2020/09/06/kLE9smfv5VuKtRb.png" style="zoom:50%;" align=""/>

- 使用：若想实现 Referer 字段确定域名的功能，则需配置 Referrer Policy 策略为 same-origin，此后对于同源链接和引用会发送 Referer，此时的 Referer 值为 Host 且不带 Path，而当跨域访问时则不会携带 Referer；

  - 设置 Referrer Policy 方法：
    - 方法1：在CSP设置
    - 方法2：页面头部增加 meta 标签
    - 方法3：a标签增加 referrerpolicy 属性


问题B：攻击者仍可控制攻击不携带 Referer，比如：

```http
<img src="http://bank.example/withdraw?amount=10000&for=hacker" referrer-policy="no-referrer">
```

问题C：其他没有 Referer 情况甚至 Referer 不可信的情况；

- IE6、7下使用 window.location.href=url 进行界面的跳转，会缺失 Referer；
- IE6、7下使用 window.open，也会缺失 Referer；
- HTTPS 页面跳转到 HTTP 页面，所有浏览器 Referer 都丢失；
- 点击 Flash 上到达另外一个网站时，Referer 的情况则较杂乱，不太可信；

总结：同源验证是相对简单的防范方法，能够防范绝大多数的CSRF  攻击，但不适用于对于安全性要求较高，或有较多用户输入内容情况(问题多多)；





### 2-7-1-2、Samesite Cookie

原理：CSRF 攻击关键点在于自动发送目标站点下的 Cookie 信息，而恰恰是这个 Cookie 导致服务端误认为是用户本身，因此防范重点在于限制 Cookie 行为；服务端可通过在响应头字段 Set-Cookie 增加 **<u>Samesite</u>** 属性，以对请求时 Cookie 的自动携带行为作限制：

- Strict 模式：严格模式，浏览器完全禁止第三方请求携带 Cookie，请求只能发起对本站当前域的请求；

- Lax 模式：宽松模式，只能在 <u>GET 方法提交表单</u>、或  <u>a 标签发送 GET 请求</u> 才可携带 Cookie；

- None 模式：默认模式，请求会自动携带 Cookie；

- 使用：Strict 和 Lax 

  - 严格模式-Strict：

    - 含义：表明此 Cookie 在任何情况下都不能作为三方 Cookie，绝无例外；

    - 比如：从百度搜索页面甚至天猫页面的链接点击进入淘宝后，淘宝都不会是登录状态，因为淘宝的服务器不会接受 foo cookie；

    - 比如：B站设置了如下 Cookie，当在A站下发起对B站请求时，Cookie foo 不会被包含在 Cookie 请求头中，但 bar 会；

    - ```http
      Set-Cookie: foo=1; Samesite=Strict、Set-Cookie: bar=2; Samesite=Lax、Set-Cookie: baz=3；
      ```

  - 宽松模式-Lax：

    - 含义：允许当发送安全 HTTP 方法时携带 Cookie，比如 `Get` 、`OPTIONS` 、`HEAD` 请求，否则不能，比如： `POST`、 `PUT`、 `DELETE` ；

    - 比如：请求是GET请求，且请求(改变了当前页面或打开了新页面)，则此 Cookie 可作为三方 Cookie；

    - 比如：B站设置如下 Cookie，当A站点击链接进入B站时，Cookie foo 不会被包含在 Cookie 请求头中，但 bar 和 baz 会，即用户在不同网站之间通过链接跳转不受影响，因为 cookie 可利用；但若A站发起的对B站的异步请求，或通过表单 Post 提交的(不合条件请求)，则 bar 也不会发送；

    - ```http
      Set-Cookie: foo=1; Samesite=Strict、Set-Cookie: bar=2; Samesite=Lax、Set-Cookie: baz=3；
      ```

- 缺点：

  - 宽松模式下，其他网站可通过页面跳转过来时可使用Cookie，但安全性降低；
  - 严格模式下，跳转子域名或新标签重新打开、刚登陆的网站，之前的 Cookie 都将不复存在，影响用户体验；
  - 无论何种模式，均不支持子域：比如：种在子域 topic.a.com下的 Cookie，并不能使用其主域下种植的 SamesiteCookie，当网站有多个子域名时，不能使用 SamesiteCookie 在主域名存储用户登录信息；

- 总结：可替代同源验证的方案，但目前尚未成熟，其应用场景有待观望；



### 2-7-2、请求要求附加本域信息

即利用 CSRF 攻击者只是使用而不能获取到  Cookie 等信息；

### 2-7-2-1、CSRF Token(主流)

原理：CSRF 攻击者无法直接窃取用户信息 (Cookie/Header/网站内容..)，而 CSRF 攻击之所以能成功，是因服务器误将攻击者发送请求当成用户的请求，综合此两点，可要求所有用户请求时均需携带 CSRF 攻击者无法获取到的 Token，服务器通过校验请求是否携带合法 Token，来区分正常与攻击请求，从而实现 CSRF 攻击防御 (与验证码机制、再次输入密码类似，均可极好遏制 CSRF，只是此处的 Token 方式用户无感知，后者则适用安全性要求严格的场景)；比如：浏览器向服务器发送请求时，服务器生成一个字符串，将其植入到返回的页面中；然后浏览器如果要发送请求，就必须带上这个字符串，然后服务器来验证是否合法，若不合法则不予响应，此字符串也就是 **<u>CSRF Token</u>**，通常第三方站点无法拿到此 Token，因此也就是被服务器给拒绝；

作用：较之前的同源检测 (Referer 检查或 Origin 验证)安全；

- 使用(简明)：

  - 服务端给用户生成一个 token，加密后返回给用户；
  - 用户在发送请求时，均需携带此 token；
  - 服务端验证 token 是否正确，正确则返回相应信息；

- 使用(详细)：

  - 首先，将 CSRF Token 输出到页面中；
    - 注意：用户打开页面时，服务器为其生成通过加密算法加密的 Token，然后将 Token 保存在 Session 中，并在页面所有 a 和 form 标签中加入；
    - 注意：上述方法适用于服务器返回前端展示的静态页面，若页面加载后动态生成的 HTML，则需前端手动加入 Token；

  - 然后，页面发送请求携带这个Token；

    - 注意：对于 GET 请求，Token 附在请求地址后，比如：`http://url?csrftoken=tokenvalue`
    - 注意：对于 POST 请求，则在 form 上加入，比如：`<input type="hidden" name="csrftoken" value="tokenvalue"/>`

  - 最后，服务器验证 Token  是否正确；

    - 注意：判断过程需先解密，然后对比加密字符串和时间戳，校验通过即可；
    - 注意：若在请求中找不到 Token，或提供值与会话中值不匹配，则应 中止请求，并重置 Token、并将事件记录为正在进行的潜在CSRF攻击；

- 问题1-1：大型网站中使用 Session 存储 CSRF Token 给服务器带来负担，且 Session 机制会在分布式环境下失效；

- 解决1-1：分布式集群， 在 Redis 存储 CSRF Token；

- 问题1-2：使用 Session 存储、读取和验证 CSRF Token 会产生较大的复杂度和性能问题；

- 解决1-2：采用 Encrypted Token Pattern 方式，此方式中的 Token 是一计算结果(使用 UserID、时间戳、随机数加密生成)，而非随机字符串，故校验时无需再去读取存储 Token，只需再次计算即可，保证分布式服务下 Token 一致性，又保证不易被破解；计算通过后，再去校验时间戳并做其他校验处理；

- 总结：只要页面没有 XSS 漏洞，泄露 Token，则接口的 CSRF 攻击就无法成功；缺点是实现较复杂，后端需给每个页面写入 Token，或前端每个Form/Ajax 请求都携带 Token，而后端则需对每一个接口都进行校验，并保证页面 Token 及请求 Token 一致；工作量较大(鸡蛋里挑骨头)；



### 2-7-2-2、双重 Cookie(主流加强)

原理：利用 CSRF 攻击不能获取用户数据特点，可要求 Ajax 和表单请求携带一个 Cookie 中的值；

作用：较 CSRF Token 简单方便，可直接通过前后端拦截方式自动化实现，后端校验方便，只需进行请求中字段的对比，无需再进行查询和存储Token；

使用：

- 首先，在用户访问网站页面时，(服务端) 向请求域名注入 Cookie，内容为随机字符串(比如 `csrfcookie=v8g9e4ksfhw`)；
- 然后，在前端向后端发起请求时，取出(上述) Cookie，并添加到 URL 参数中 (接上例 `POST https://www.a.com/comment?csrfcookie=v8g9e4ksfhw`)；
- 最后，后端接口验证 Cookie 中的字段与URL参数中的字段是否一致，不一致则拒绝；

问题：

- 安全性不高：在大型网站上的安全性不如 CSRF Token 高，不适合大规模应用；
- 跨域访问失效：若用户访问网站为 `www.a.com`，而后端的 api 域名为 `api.a.com`，则在`www.a.com`下，前端拿不到 `api.a.com` 的Cookie(无法跨域获取)，也即无法完成双重 Cookie 认证；除非认证 Cookie 必须被种在 `a.com` 下，如此实现访问；
- XSS 漏洞失效：某个子域名存在漏洞被 XSS 攻击，攻击者则可修改主域 a.com下的Cookie (比如延长过期时间)或使用自己配置的 cookie 进行攻击；

优点：

- 无需使用 Session，适用面更广、易于实施；
- Token 储存于客户端中，不会给服务器带来压力；
- 相对于 CSRF Token，实施成本更低，可在前后端统一拦截校验，而不需要一个个接口和页面添加；

缺点：

- Cookie 中增加了额外的字段；
- 若有其他漏洞(比如 XSS)，攻击者可以注入 Cookie，那么该防御方式失效；
- 难以做到子域名的隔离；
- 为了确保 Cookie 传输安全，采用这种防御方式的最好确保用整站 HTTPS 的方式，如果还没切 HTTPS 的使用这种方式也会有风险；

### 2-7-2-3、Anti CSRF Token 

- 优势：防御 CSRF 公认最合适方案、token 存放用户页面表单和 Session/Cookie 中，提交请求时，服务端验证两者是否一致；
- 注意：确保 Token 的 URL 保密性、尽可能地使用 Post 请求 ;
- 注意：可考虑生成多个有效 Token，避免多页共存场景；

### 2-7-2-4、短信验证、双重验证



### 2-7-3、其他防御方式

### 2-7-3-1、CSRF 监控

<img src="https://i.loli.net/2020/09/06/WkMfBnl2wFQ6u3P.png" style="zoom:50%;" align=""/>

### 2-7-3-2、随机值法

<img src="https://i.loli.net/2020/09/07/AQWRcnzsCE47DxB.png" style="zoom:50%;" align=""/>





## 2-8、检查漏洞

- 是否有验证码；
- 是否判断 Referer；
- 目标表单是否带有 Token 验证；
- Allow-access 相关参数设置是否有漏洞；
- 目标 jsonp 数据是否可以自定义 callback；
- CSRF Tester

<img src="https://i.loli.net/2020/09/06/qp3yEzljvQYHhdD.png" style="zoom:50%;" align=""/>





## 2-9、总结

- CSRF自动防御策略：同源检测 (Origin 和 Referer 验证)(请求头易伪造)；
- CSRF主动防御措施：Token 验证 或者 双重 Cookie 验证 以及配合 Samesite Cookie(兼容性)；
- 保证页面的幂等性，后端接口不要在 GET 页面中做用户操作； 



