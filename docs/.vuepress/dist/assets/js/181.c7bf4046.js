(window.webpackJsonp=window.webpackJsonp||[]).push([[181],{568:function(_,v,e){"use strict";e.r(v);var t=e(4),i=Object(t.a)({},(function(){var _=this,v=_.$createElement,e=_._self._c||v;return e("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[e("h1",{attrs:{id:"一、基本"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#一、基本"}},[_._v("#")]),_._v(" 一、基本")]),_._v(" "),e("h2",{attrs:{id:"_1-1、诞生"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-1、诞生"}},[_._v("#")]),_._v(" 1-1、诞生")]),_._v(" "),e("p",[_._v("其他语言存在各种问题，诸如开发门槛高、包含很多阻塞 I/O 库、性能缺陷，而 JS 无后端历史包袱、符合事件驱动、V8高性能、无压导入非阻塞 I/O 库；")]),_._v(" "),e("p",[_._v("于是：09年3月 RyanDahl 基于 V8 引擎，造了一款轻量级 Web 服务器，12年1月转由 Isaac Z. Schlueter 接手；因目的为构建大型网络应用，而每一 Node 进程均参与构成此网络应用的节点，故取名 Node；相比于 Chrome，缺少 Webkit 布局引擎、Html 层、显卡支持等，但支持访问本地文件，基于事件驱动的异步架构；此外还有 node-webkit 项目，其将 Node 与 Webkit 的事件循环相融合，使得既可 UI 构建，又可访问本地资源，实现桌面开发；总结即Node 是 JS 在服务端的运行环境，构建在 chrome 的 V8 引擎之上；")]),_._v(" "),e("h2",{attrs:{id:"_1-2、特点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-2、特点"}},[_._v("#")]),_._v(" 1-2、特点")]),_._v(" "),e("p",[e("strong",[e("u",[e("em",[_._v("异步非阻塞 IO")])])]),_._v("：")]),_._v(" "),e("ul",[e("li",[_._v("底层拥有大量异步 IO(从文件读取到网络请求)，可实现并行 IO 操作，并拥有提升效率方式；")])]),_._v(" "),e("p",[e("strong",[e("u",[e("em",[_._v("事件驱动机制")])])]),_._v("：")]),_._v(" "),e("ul",[e("li",[_._v("轻量级、轻耦合，只关注事务，回调通知机制，有回调问题但可通过 Promise 改善；")]),_._v(" "),e("li",[_._v("程序无需阻塞等待结果返回，原因同步模式等待的时间则可来处理其它任务；")])]),_._v(" "),e("p",[e("strong",[e("u",[e("em",[_._v("单线程机制")])])]),_._v("：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("无状态同步问题，无死锁，无线程上下文交换导致的性能开销；")])]),_._v(" "),e("li",[e("p",[_._v("但也无法利用多核、缺乏健壮性、执行时间长也会导致线程阻塞，但可通过 child_process 子进程改善；")])])]),_._v(" "),e("p",[e("strong",[e("u",[e("em",[_._v("跨平台特点")])])]),_._v("：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("通过 libuv (操作系统与 Node 上层模块间的平台架构层)，兼容统一多平台接口；")])]),_._v(" "),e("li",[e("p",[_._v("比如：Nginx 也采用事件驱动机制，避免多线程的：线程创建、线程上下文切换开销；但其采用 C 语言编写，主用于高性能服务器，不适合业务开发；")])]),_._v(" "),e("li",[e("p",[_._v("注意：虽单线程模型，但却基于事件驱动和异步非阻塞模式，可用于高并发场景，避免线程创建、线程间上下文切换产生资源开销；")])]),_._v(" "),e("li",[e("p",[_._v("注意：实际上，应结合场景，单核 CPU 系统上，可采用单进程 + 单线程 模式开发；多核则可采用多进程 + 单线程模式开发；")])])]),_._v(" "),e("p",[e("strong",[e("u",[e("em",[_._v("进程与线程区别")])])]),_._v("：")]),_._v(" "),e("ul",[e("li",[_._v("前者：系统进行资源分配和调度的基本单位；\n"),e("ul",[e("li",[_._v("计算机中程序关于某数据集合上的一次运行活动，线程的容器，是操作系统结构的基础；")]),_._v(" "),e("li",[_._v("每当启动一个服务、运行一个实例即开辟一个服务进程；比如 JVM、node app.js；")]),_._v(" "),e("li",[_._v("多进程即进程复制，复制出的每个进程均拥有独立空间地址、数据栈等资源；此时 A 进程无法访问 B 进程中定义的变量、数据结构，只有建立 IPC 通信，进程间才可进行数据通信与共享；开启多进程主要解决单进程模式下 CPU 利用率不足情况以充分利用多核性能；并非解决高并发；")])])]),_._v(" "),e("li",[_._v("后者：是操作系统能够进行运算调度的最小单位；\n"),e("ul",[e("li",[_._v("隶属于进程，被包含于进程中，一线程只能隶属于一进程，但一进程可拥有多个线程；")]),_._v(" "),e("li",[_._v("单线程即一进程只开一线程；")])])]),_._v(" "),e("li",[_._v("注意：Node 开发过程中，错误会引起整个应用退出，故需考虑应用健壮性(异常抛出、进程守护等)；")]),_._v(" "),e("li",[_._v("注意：单线程无法利用多核 CPU，但后来 Node 提供相应 API 以及三方工具以解决；")]),_._v(" "),e("li",[_._v("使用：通过 child_process.fork 开启多进程 (Node 在 v0.8 版本后新增 Cluster 实现多进程架构)；")])]),_._v(" "),e("h2",{attrs:{id:"_1-3、场景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-3、场景"}},[_._v("#")]),_._v(" 1-3、场景")]),_._v(" "),e("p",[_._v("Node 应用场景：")]),_._v(" "),e("p",[_._v("IO 密集型：")]),_._v(" "),e("ul",[e("li",[_._v("优势：利用事件驱动，而非启动线程为每一请求服务，资源占用极少；")]),_._v(" "),e("li",[_._v("优势：异步非阻塞IO，极好解决单线程上，CPU 与 IO 间阻塞无法重叠问题，IO 阻塞造成的性能浪费远比 CPU 影响要小；")])]),_._v(" "),e("p",[_._v("CPU 密集型：")]),_._v(" "),e("ul",[e("li",[_._v("劣势：执行时间长的计算，将导致 CPU 时间片不能释放，导致无法发起后续 IO；")]),_._v(" "),e("li",[_._v("解决1：可适当调整/分解大型计算任务为小任务(时间分片)，使运算及时释放；")]),_._v(" "),e("li",[_._v("解决2：可编写 C/C++ 扩展，以高效地利用 CPU，实现某些 V8 自身难以实现的需求；")]),_._v(" "),e("li",[_._v("解决3：倘若单线程 Node、C/C++ 扩展均无法满足需求；\n"),e("ul",[e("li",[_._v("可将部分 Node 进程当做常驻服务用于计算，然后利用进程间消息传递结果，将计算与IO分离，充分利用多核 CPU；")])])])]),_._v(" "),e("h2",{attrs:{id:"_1-4、结构"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-4、结构"}},[_._v("#")]),_._v(" 1-4、结构")]),_._v(" "),e("p",[_._v("V8：谷歌开源项目，目的是在浏览器之外执行 JS 代码；V8 为 Node 提供底层网络访问，并帮助 Node 处理并发性问题等的各个方面；")]),_._v(" "),e("ul",[e("li",[_._v("项目中 70% 的代码是用 C++ 编写，30% 用 JS 编写；")])]),_._v(" "),e("p",[_._v("libuv：是位于 libeio、 libev、 c-ares (for DNS) 和 iocp (for windows asynchronous-io) 顶部抽象层；libuv 执行、维护和管理事件池中的所有 I/O操作和事件；(若是 libeio 线程池)；其允许 JS 代码执行 I/O 操作(无论是网络操作还是文件操作等)；该库执行所有 TCP 级别的连接和文件/系统操作；")]),_._v(" "),e("p",[_._v("注意：Node 只是作为编写的 JS 代码，与其他用 JS 或 C++ 编写的代码 (V8和 libuv) 间的接口；这使得 JS 开发者不必直接与 C++ 代码交互，并将应用的 JS 部分，同运行在计算机中的实际 C++ 代码相关联，以编译和执行 JS 代码；")]),_._v(" "),e("p",[_._v("此外 Node 还提供系列包装器与统一 API，以供在项目中使用，比如库模块：http，fs，crypto，path 等 API，但用户无法直接访问 C++ 代码，而只需使用 JS 函数，函数最终调用 node.js libuv 库；")]),_._v(" "),e("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918140135.png",align:"center"}}),_._v(" "),e("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918140136.png",align:"center"}}),_._v(" "),e("p",[_._v("。")])])}),[],!1,null,null,null);v.default=i.exports}}]);