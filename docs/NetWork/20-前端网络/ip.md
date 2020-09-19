# 一、基本

越往下，抽象层次越低(OSI 七层协议)；

- 应用层：HTTP1.1、HTTP2、Websocket；
- 表示层：TLS；对象：Web容器(封装协议解析、线程管理、网络资源等接口)、中间件(不同层级软件间的连接组件)；
- 会话层
- 传输层：TCP、UDP；对象：操作系统内核；
- 网络层：如何把各个网络连接起来组成大网；
- 链路层
- 物理层

## 1-1、网络层功能(与地位)

- IP寻址：如何根据IP地址找到目标主机所在网络；
- 选路：到达目标网络由很多路径，如何选择最优解；
- 封装打包：网络层需要添加IP头部；
- 分片：若传输层所给报文过大，超出MQ，则需进行分片；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000132.png" style="zoom:50%;" />

IP 层是一个细腰结构：网络层只有 IP 协议，其他诸如 ARQ、ICMP 均为辅助协议；其处于核心地位，须首先关注性能；其特点如下：

- 无连接：管理连接成本过高；
- 非可靠：不会使用 TCP 类似的 ACK 确认报；
- 无确认：同上；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000133.png" style="zoom:50%;" />



## 1-2、数据链路层功能

- 逻辑链路控制
- 媒体访问控制
- 封装链路层帧
- 负责 MAC 寻址
- 差错检测与处理
- 定义物理层标准

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000134.png" style="zoom:50%;" />

## 1-3、路由器与交换机

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000135.png" style="zoom:50%;" />

- 全球作用域
- 组织内作用域
- 场点内作用域
- 本地链路层
- 本机作用域

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000136.png" style="zoom:50%;" />

## 1-4、网络传输示例

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000137.png" style="zoom:50%;" />



# 二、地址与转换

## 2-1、IPv4 分类地址

IPv4 地址用点分十进制表示，它是一个 32 位的二进制数，可表示 2^32 个地址空间，由全球各大机构层次分配与管理：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000138.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000139.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000140.png" style="zoom:50%;" />

### 2-1-1、优缺点

IPv4 分类地址是简单明了、具有 3 个级别(网络规模)的灵活性、选路(基于网络地址)简单，但缺少私有网络下的的地址灵活性：同一网络下没有地址层次，且 3 类地址块太少，无法与现实网络很好匹配；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000141.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000142.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000143.png" style="zoom:50%;" />

### 2-1-2、特殊的 IP 地址

全 0 或全 1 的特殊含义、预留的 IP 地址：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000144.png" style="zoom:40%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000145.png" style="zoom:40%;" />



## 2-2、CIDR-无分类地址

(Classless Inter-Domain Routing) 无分类地址；子网掩码，表示方法：`A.B.C.D/N`，其中 N 的范围是 `[0, 32]`，匹配示例：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000146.png" style="zoom:50%;" />

`71.94.0.0/15` 多级子网划分示例：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000147.png" style="zoom:50%;" />

`208.130.29.33` 寻址历程：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000148.png" style="zoom:50%;" />





## 2-3、ARP 与 RARP 协议

即将 IP 地址与 MAC 地址进行转换的两个协议，前者 IP(Internet Protocol Address) 地址，用于实现大型网络间的传输，后者 MAC 地址 (Media Access Control Address)，用于实现本地网络设备间的直接传输；另外可通过 `Window: ipconfig/all、Mac: ifconfig` 查看MAC 地址



### 2-3-1、ARP

2.5层协议 ARP-Address Resolution Protocol：从 IP 地址寻找 MAC 地址，动态地址解析协议，通过广播的形式询问当前网络谁是目标 IP：

- 检查本地缓存 `Window: arp -a、Linux: arp -nv、Mac: arp -nla`
- 广播形式请求
- 单播形式应答

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000149.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000150.png" style="zoom:50%;" />

ARP 报文格式：FrameType = 0x0806，与硬件类型与操作码(图2)：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000151.png" style="zoom:40%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000152.png" style="zoom:40%;" />



### 2-3-2、RARP

2.5层协议 RARP-Reverse Address Resolution Protocol：从 MAC 地址寻找 IP 地址，动态地址解析协议，通过广播的形式询问当前网络谁是目标 MAC：

- 广播形式请求
- 单播形式应答

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000153.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000154.png" style="zoom:50%;" />

RARP 报文格式：FrameType = 0x8035：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000155.png" style="zoom:50%;" />



### 2-3-3、安全问题

### 2-3-3-1、ARP spoofing

poisoning-ARP欺骗，即 ARP 广播形式发出后，恶意用户主动发送 MAC 地址，且难以判断孰正孰伪，但可通过从其他途径获取 MAC 地址，然后在路由器或交换机设立 MAC 白名单来防御；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000156.png" style="zoom:50%;" />





## 2-4、NAT 地址转换与 LVS 负载均衡

NAT-(IP NetWork Address Translator) 

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000157.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000158.png" style="zoom:50%;" />

单纯的 IPv4 存在以下问题:

- IPv4 地址短缺
- IP 仅提供少量公网 IP，但主机数在不断增加

此时利用 NAT 可让大量内网主机访问互联网，缓解 IPv4 短缺问题，但 NAT 的应用有前提：

- 内网中主要用于客户端访问互联网
- 同一时间仅少量主机访问互联网
- 内网中存在一个路由负责访问外网

NAT 优点是：共享公共 IP 节约开支、扩展主机时不涉及公共地址、更换 ISP(公网IP) 不对主机产生影响、更好的安全性与隔离性(外部无法主动访问内网服务)；缺点也明显：网络管理复杂、性能下降、需重新修改校验和、客户端缺乏公网 IP 可能导致功能缺失、某些应用协议由于传递网络层信息而功能受限；此外还有 NAPT，即在 NAT 基础上转换端口，由此可接受少量 IP 支持大量设备上网；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000159.png" style="zoom:50%;" />

注意：IPv6 亦可使用 NAT，但全部是 IPv6 则没必要使用；



### 2-4-1、单向转换 NAT：动态映射

单向(向外)转换 NAT：动态映射

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000200.png" style="zoom:50%;" />

### 2-4-2、双向转换 NAT：静态映射

双向(向外)转换 NAT：静态映射

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000201.png" style="zoom:50%;" />



### 2-4-3、其他 LVS/ NAT 工作模式

LVS-Linux Virtual Server

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908000202.png" style="zoom:40%;" />

