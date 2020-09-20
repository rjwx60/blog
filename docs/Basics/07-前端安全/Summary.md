# 总结

前端安全的保证主要靠服务端，前端再怎么处理，也只是混淆(手动二哈狗头)



## 一、XSS

**<u>*XSS(Cross Site Script)跨站脚本攻击*</u>**：即攻击者想方设法向用户页面注入恶意脚本，在浏览器渲染数据时进行攻击；主分为三种：

- **存储型**：即攻击脚本被存储在服务端，每当无辜用户请求某页面时，页面携带恶意脚本返回，并随页面渲染而执行攻击；
- **反射型**：将攻击脚本混在URL中，服务端接收并将恶意代码当做参数取出、拼接在页面中返回，浏览器解析后即执行恶意代码；
- **DOM型**：将攻击脚本写在URL中，诱导用户点击该URL，若 URL 被解析，则攻击脚本就会被运行；此类型攻击不经过服务端；

**<u>*不管何种 XSS 攻击，均需被浏览器执行才可发起攻击，故可以此作为防御切入口：*</u>**

- 首先，**<u>输入输出检查</u>**；不能相信任何用户输入数据、与服务端返回数据，要进行各种转义与过滤；
  - 发送服务端数据要进行 URL 的 encodeURIComponetn 转义与特定标签符转义；
  - 服务端返回的 URL 要 encodeURIComponetn 转义再输出；
  - 服务端返回数据谨慎选择输出类 API，而应使用 textContent、setAttribute、innerText；避免使用 能将字符串作为代码执行的API，比如 JS 的 eval()、setTimeout()、setInterval()，避免 innerHTML、outerHTML、document.write()，比如 vue 不使用 v-html / dangerouslySetInnerHTML；
- 然后，鉴于 XSS 目标多数是获取用户 Cookie，可设置 **<u>Cookie:HttpOnly</u>** 字段，使 JS 无法都去 Cookie 值；
- 然后，**<u>后端配置 CSP</u>**，让服务器决定浏览器可加载的资源白名单，阻止名单以外的资源加载与运行；具体是配置 HTTPHeader 中的  `Content-Security-Policy`，可实现：
  - 禁止加载外域代码，防止复杂的攻击逻辑；
  - 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）
  - 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域；
  - 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）
  - 合理使用上报可及时发现 XSS，利于问题的快速修复；

<img src="https://i.loli.net/2020/09/07/Uy8B5P7WVOLXITD.png" style="zoom:50%;" align=""/>

- 最后，还有锁死 apply、call、document.write，XSSAuditor 等方法







## 二、CSRF

**<u>*CSRF攻击(Cross-site request forgery)跨站请求伪造*</u>**：是一种劫持受信任用户向服务器发送非预期请求的攻击方式，通常情况下，它是攻击者借助受害者的 Cookie 骗取服务器的信任，但是它并不能拿到Cookie，也看不到Cookie的内容，它能做的就是给服务器发送请求，然后执行请求中所描述的命令，以此来改变服务器中的数据，也就是并不能窃取服务器中的数据；防御主要有三种：

- 验证`Referer`：服务端通过验证请求头的 Referer、Origin 字段来验证来源站点，但请求头很容易伪造
- 设置`SameSite`：设置 Cookie: SameSite 字段，让 Cookie 不随跨站请求发出，但浏览器兼容不一；
- 验证`Token`：既然是利用浏览器的自携带 Cookie 发起请求，则让其不能自携带的内容即可；遂使用 Token，请求服务器时，服务器返回一个 token，后续每个请求都需同时携带 token 和 cookie 才会被认为是合法请求；
- 其他方式：短信认证、Anti CSRF Token(防御 CSRF 公认最合适方案、token 存放用户页面表单和 Session/Cookie 中，提交请求时，服务端验证两者是否一致)





## 三、挟持

劫持一般会发生在报文传输时的内容改造，常见为 **<u>界面劫持</u>**，即透明的 iframe 或 图片，点击目的地与最终目的地不符；预防策略：

- 服务端添加 X-Frame-Options 响应头，如此浏览器就会阻止嵌入网页的渲染；
- 利用 JS 判断顶层视口的域名是否与本页域名一致，不一致则不允许操作
  - `top.location.hostname === self.location.hostname`；
- 敏感操作使用更复杂的步骤（验证码、输入项目名称以删除)
- 全链路 HTTPS；

