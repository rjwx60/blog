---
typora-root-url: ../Source
---



### 一、基本

#### 1-1、基本

​	DNS( Domain Name System)，是一种组织成域层次结构的计算机和网络服务命名系统，提供将主机名和域名转换为IP地址的服务，是将人类可读域名与服务器 IP 进行映射的数据库，使用户更为方便访问网络；DNS 运行在 UDP 协议之上，使用端口 53；(网络通讯大部分基于TCP/IP，IP 不方便记忆，但机器不认域名)

#### 1-2、域名结构

<img src="/Image/NetWork/dns/1.png" style="zoom:50%;" />

根域名服务器，只保存下一级域名，比如 com、net、org 等，此外还有国家域名 jp、cn 等；



#### 1-3、查询工具 Dig

<img src="/Image/NetWork/dns/8.png" style="zoom:50%;" />



#### 1-4、查询过程—[How DNS query works](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc775637(v=ws.10)?redirectedfrom=MSDN)

当在浏览器中输入域名 `www.baidu.com` 时，首先浏览器会搜索  **<u>浏览器自身 DNS 缓存</u>** (时效1min可存1000条，可通过 `chrome://net-internals/#dns` 查看)，然后浏览器会搜索 <u>**系统自身 DNS 缓存**</u> 是否有此域名映射关系，若未过期则搜索结束 (注：查看本机 DNS 缓存方式详看：[stackoverflow](https://stackoverflow.com/questions/38867905/how-to-view-dns-cache-in-osx) ) (注：若未找到且若在 Window 中还会查询 **<u>hosts 文件</u>**)

- 若有，则获取 IP 地址映射，完成域名解析；
- 若无，浏览器则会发起 DNS 系统调用，向 **<u>本地配置的首选 DNS 服务器</u>** 发起域名查询 <u>*递归请求*</u> (即服务器必须给用户返回 IP 地址)，服务器响应对本地配置区域资源的查询结果，结果具有权威性；DNS 服务器首先检查自身缓存，找到对应条目且无过期则解析成功，否则为用户发起DNS 解析<u>*迭代请求*</u>； (注意：若要查询的域名，不由服务器解析，而是使用 **<u>本地DNS服务器已缓存的映射关系</u>**，则调用此IP地址映射完成的域名解析，不具有权威性)； 
  - 若上述两者均解析失败，则根据本地 DNS 服务器的设置(是否设置转发器)进行查询：
    - 若未开启转发模式：1、首先，本地DNS服务器会向 13台 <u>*根 DNS 服务器*</u> 发起查询，后者收到请求后会判断(.com) 由谁授权管理，并会返回负责该顶级域名的服务器的 IP (<u>*下一级DNS服务器*</u>)；2、然后，本地DNS服务器收到响应后，向负责.com域的服务器发起查询，若服务器自身无法解析，则会将管理 `baidu.com` 域的<u>*下一级 DNS服务器*</u> IP 地址返回给本地DNS服务器；3、最后，当本地DNS服务器收到后，查询负责 `baidu.com`  域的服务器；4、重复上述动作进行查询，直至 `www.baidu.com` 
    - 若已开启转发模式：1、本地 DNS服务器就会将请求转发至上一级 DNS服务器，由上一级服务器进行解析，若上级服务器无法解析，则或寻找根DNS或把转请求转至上上级，循环往复；
- 若上述方法 (本地、DNS 服务器、迭代查询)均失败，操作系统则会：1、首先查询 **<u>NetBIOS name Cache (NETBIOS名称缓存，存放最近一段时间内成功通讯的计算机的极机名与 IP 地址)</u>**，2、然后若还失败，则查询 **<u>WINS 服务器(NETBIOS 名称和 IP 地址对应的服务器)</u>**，3、然后若还失败，则客户端进行广播查找 4、然后若还失败，客户端读取 **<u>LMHOSTS 文件 (类似 Hosts)</u>**；5、解析失败

注意：无论本地DNS服务器开启转发模式与否，最后均将结果返回给自身，本地DNS服务器再将其返回给用户；从 **客户端到本地DNS服务器是递归查询，而DNS服务器间的交互查询是迭代查询**；

<img src="/Image/NetWork/dns/10.png" style="zoom:50%;" />

<img src="/Image/NetWork/dns/9.png" style="zoom:50%;" />







### 二、DNS 报文

<img src="/Image/NetWork/dns/2.png" style="zoom:50%;" />

<img src="/Image/NetWork/dns/3.png" style="zoom:50%;" />

- 注意：请求和响应格式为同一结构，只是部分字段内容的有无；
- 注意：query：查询域名；response：返回 IP 地址；



​	DNS 使用 UDP 传输原因：减小响应时间 (响应时间= DNS域名解析时间(域名解析时间越小越好)+ TCP 连接建立时间(固定的三次握手很难有进一步缩小的空间) + HTTP交易时间(基于Request / Response很难有提升的空间))；

- 采用TCP传输，则域名解析时间为：DNS域名解析时间 = TCP连接时间 + DNS交易时间(若查询冷门域名信息，则还可能会经过域名根服务器、一二级域名服务器迭代查询，成本高昂)；
- 采用UDP传输，则域名解析时间为：DNS域名解析时间 = DNS交易时间，减小响应时间，有效信息占比高；



#### 2-1、DNS 请求报文

##### 2-1-1、Question 字段格式

<img src="/Image/NetWork/dns/5.png" style="zoom:40%;" align="left"/>

<img src="/Image/NetWork/dns/4.png" style="zoom:50%;" />

#### 2-2、DNS 响应报文

##### 2-2-1、Answer 字段格式

<img src="/Image/NetWork/dns/7.png" style="zoom:40%;" align="left"/>

<img src="/Image/NetWork/dns/6.png" style="zoom:50%;" />









### 三、安全与优化

#### 3-1、DNS 安全问题

##### 3-1-1、DNS DDoS 攻击

​	DNS 分布式拒绝服务 (DDoS) 带宽洪泛攻击，即攻击者向每个 DNS 根服务器/顶级域名服务器发送大量分组，使得大多数合法  DNS 请求无法得到应答；

- 对策A：使用分组过滤器保护，阻挡所偶有指向根服务器的 ICMP ping 报文；
- 对策B：启动本地服务器的缓存技术，本地服务器缓存顶级域名服务器地址(便可绕过迭代查询根级服务器)；



##### 3-1-2、DNS 劫持



#### 3-2、DNS 优化方式

##### 3-2-1、减少主机名

​	当客户端 DNS 缓存位空，DNS 查找数量与要加载的  Web 页面中唯一主机名的数量相同(含各类资源主机名)，减少主机名数量可减少 DNS 查找数量，提升页面加载速度；但注意减少主机名与尽可能让浏览器并行下载相冲突，需合理处理关系；

