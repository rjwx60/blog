(window.webpackJsonp=window.webpackJsonp||[]).push([[101],{530:function(t,_,a){"use strict";a.r(_);var v=a(4),s=Object(v.a)({},(function(){var t=this,_=t.$createElement,a=t._self._c||_;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"四、其他安全问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#四、其他安全问题"}},[t._v("#")]),t._v(" 四、其他安全问题")]),t._v(" "),a("h2",{attrs:{id:"_4-1、ddos攻击"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-1、ddos攻击"}},[t._v("#")]),t._v(" 4-1、DDOS攻击")]),t._v(" "),a("p",[t._v("基本：即分布式拒绝服务攻击 (DDoS-Distributed Denial of Service)，指借助于客户/服务器技术，将多个计算机联合起来作为攻击平台，对一或多个目标发动攻击，从而成倍地提高拒绝服务攻击的威力；")]),t._v(" "),a("p",[t._v("目的：利用目标系统网络服务功能缺陷或直接消耗其系统资源，使该目标系统无法提供正常服务；")]),t._v(" "),a("p",[t._v("形式：通过大量合法请求，占用大量网络资源，以达到瘫痪网络目的：")]),t._v(" "),a("ul",[a("li",[t._v("通过使网络过载来干扰甚至阻断正常的网络通讯；")]),t._v(" "),a("li",[t._v("通过向服务器提交大量请求，使服务器超负荷；")]),t._v(" "),a("li",[t._v("阻断某服务与特定系统或个人的通讯；")]),t._v(" "),a("li",[t._v("阻断某一用户访问服务器；")])]),t._v(" "),a("h3",{attrs:{id:"_4-1-1、syn-flood-attack"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-1、syn-flood-attack"}},[t._v("#")]),t._v(" 4-1-1、SYN Flood Attack")]),t._v(" "),a("p",[t._v("背景：在三次握手过程中，服务器发送 SYN-ACK 之后，收到客户端的 ACK 前的 TCP 连接称为半连接 (half-open connect)，此时服务器处于 SYN_RCVD 状态，而当收到 ACK 后，服务器才转入 ESTABLISHED 状态；")]),t._v(" "),a("p",[t._v("基本：属于 DDOS 攻击中的一种具体表现形式，攻击者在短时间内，伪造大量不存在的 IP 地址，不断向服务器发送 SYN 包，服务器则不断响应确认包，并等待客户确认，而由于源地址不存在，服务器则需不断地重发直至超时，同时这些伪造的 SYN 包，将长时占用服务端的未连接队列，此时正常的 SYN 请求将会被丢弃，导致目标系统运行缓慢，严重者会引起网络堵塞甚至系统瘫痪；")]),t._v(" "),a("p",[t._v("检测：检测 SYN 攻击非常方便，当在服务器上拥有大量的半连接状态连接时，尤其是源 IP 地址是随机的，基本上可断定 SYN 攻击；")]),t._v(" "),a("p",[t._v("防御：")]),t._v(" "),a("ul",[a("li",[t._v("缩短超时 (SYN Timeout) 时间；")]),t._v(" "),a("li",[t._v("增加最大半连接数；")]),t._v(" "),a("li",[t._v("过滤网关防护；")])]),t._v(" "),a("h2",{attrs:{id:"_4-2、接口防刷"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-2、接口防刷"}},[t._v("#")]),t._v(" 4-2、接口防刷")]),t._v(" "),a("p",[t._v("基本：API 频繁调用")]),t._v(" "),a("p",[t._v("防御：IP限制、验证码、请求头消息校验等；")]),t._v(" "),a("p",[t._v("详看：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/254")]),t._v(" "),a("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918162432.png",align:""}}),t._v(" "),a("h2",{attrs:{id:"_4-3、第三方依赖包"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-3、第三方依赖包"}},[t._v("#")]),t._v(" 4-3、第三方依赖包：")]),t._v(" "),a("p",[t._v("基本：第三方包的安全漏洞导致的风险；")]),t._v(" "),a("p",[t._v("防御：自动化检查漏洞工具：NSP、Snyk；")]),t._v(" "),a("h2",{attrs:{id:"_4-4、错误内容推断"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-4、错误内容推断"}},[t._v("#")]),t._v(" 4-4、错误内容推断")]),t._v(" "),a("p",[t._v("基本：攻击者提交脚本文件，躲过了文件类型校验，服务端存储，小白访问时会请求伪装成图片的 JS 脚本，此时若浏览器错误推断此响应内容类型(MIME types)，则会将此图片文件当做 JS  脚本执行；")]),t._v(" "),a("p",[t._v("原因：后端服务器在返回响应中设置的 Content-Type Header 仅供浏览器提供当前响应内容类型的建议，而浏览器有可能会自作主张地，根据响应中实际内容去推断内容类型；")]),t._v(" "),a("p",[t._v("防御：设置 "),a("code",[t._v("X-Content-Type-Options")]),t._v(" 这个 HTTP Header 明确禁止浏览器去推断响应类型；")]),t._v(" "),a("p",[t._v("详看：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options")]),t._v(" "),a("h2",{attrs:{id:"_4-5、本地存储泄露"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-5、本地存储泄露"}},[t._v("#")]),t._v(" 4-5、本地存储泄露")]),t._v(" "),a("p",[t._v("基本：前端通过 cookie 存储用户信息支撑应用运行、前后分离、离线模式、SPA 应用趋势，若前端应用存在漏洞，则容易被窃取；")]),t._v(" "),a("p",[t._v("防御：前端不存储敏感信息；")]),t._v(" "),a("h2",{attrs:{id:"_4-6、控制台代码注入"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-6、控制台代码注入"}},[t._v("#")]),t._v(" 4-6、控制台代码注入")]),t._v(" "),a("p",[t._v("基本：黑客诱骗用户去控制台粘贴恶意代码；")]),t._v(" "),a("h2",{attrs:{id:"_4-7、中间人攻击"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-7、中间人攻击"}},[t._v("#")]),t._v(" 4-7、中间人攻击")]),t._v(" "),a("p",[t._v("即攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但实际上整个通信过程都被攻击者控制；")]),t._v(" "),a("p",[t._v("攻击者不仅能获得双方的通信信息，还能修改通信信息；")]),t._v(" "),a("p",[t._v("防御：增加一个安全通道来传输信息，比如全链路 HTTPS 就可以用来防御中间人攻击；")]),t._v(" "),a("p",[t._v("注意：若非全链路，则可通过某些方式将 HTTPS 降级为 HTTP 从而实现中间人攻击；")]),t._v(" "),a("h2",{attrs:{id:"_4-8、npm-audit"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-8、npm-audit"}},[t._v("#")]),t._v(" 4-8、npm audit")]),t._v(" "),a("h2",{attrs:{id:"_4-9、github-security"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-9、github-security"}},[t._v("#")]),t._v(" 4-9、github security")])])}),[],!1,null,null,null);_.default=s.exports}}]);