(window.webpackJsonp=window.webpackJsonp||[]).push([[182],{569:function(t,_,s){"use strict";s.r(_);var v=s(4),e=Object(v.a)({},(function(){var t=this,_=t.$createElement,s=t._self._c||_;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"四、异步机制"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#四、异步机制"}},[t._v("#")]),t._v(" 四、异步机制")]),t._v(" "),s("p",[t._v("阻塞和非阻塞 I/O 其实是针对操作系统内核而言：")]),t._v(" "),s("ul",[s("li",[t._v("阻塞 I/O："),s("strong",[s("u",[t._v("一定要等到操作系统完成所有操作后才表示调用结束")])]),t._v("；")]),t._v(" "),s("li",[t._v("非阻塞 I/O："),s("strong",[s("u",[t._v("调用后立马返回不等操作系统内核完成操作")])]),t._v("；")])]),t._v(" "),s("p",[t._v("Node 中阻塞IO与异步IO的实现中：采用多线程方式，由 EventLoop、I/O观察者，请求对象、线程池 四大要素相互配合，共同实现；")]),t._v(" "),s("h2",{attrs:{id:"_4-1、阻塞和非阻塞i-o"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-1、阻塞和非阻塞i-o"}},[t._v("#")]),t._v(" 4-1、阻塞和非阻塞I/O")]),t._v(" "),s("p",[s("strong",[s("u",[t._v("I/O 即 Input/Output")])]),t._v("；在浏览器端，只有一种 I/O(网络I/O)，即利用 Ajax 发送网络请求，然后读取返回的内容；而 Node 则有相对广泛的 I/O 的场景：")]),t._v(" "),s("ul",[s("li",[s("strong",[s("u",[t._v("文件 I/O")])]),t._v("：比如用 fs 模块对文件进行读写操作；")]),t._v(" "),s("li",[s("strong",[s("u",[t._v("网络 I/O")])]),t._v("：比如用 http 模块发起网络请求；")])]),t._v(" "),s("p",[t._v("阻塞和非阻塞 I/O 其实是针对操作系统内核而言：")]),t._v(" "),s("ul",[s("li",[t._v("阻塞 I/O："),s("strong",[s("u",[t._v("一定要等到操作系统完成所有操作后才表示调用结束")])]),t._v("；")]),t._v(" "),s("li",[t._v("非阻塞 I/O："),s("strong",[s("u",[t._v("调用后立马返回不等操作系统内核完成操作")])]),t._v("；")])]),t._v(" "),s("p",[t._v("使用前者，在操作系统进行 I/O 操作过程中，应用程序实际一直处于等待状态；")]),t._v(" "),s("p",[t._v("使用后者，调用返回后 Node 应用可完成其他事情，而系统同时也在进行 I/O，充分利用等待时间，提高执行效率，但应用无法得知系统已完成 I/O 操作；")]),t._v(" "),s("p",[t._v("为让 Node 获悉操作系统已做完 I/O 操作，需要重复地去操作系统那里判断是否完成，这种重复判断的方式就是 "),s("strong",[s("u",[t._v("轮询")])]),t._v("，方案如下：")]),t._v(" "),s("ul",[s("li",[t._v("轮询模式：检查I/O状态，直到 I/O 完成；"),s("strong",[s("u",[t._v("最原始的方式性能也最低")])]),t._v("，会让 CPU 一直耗用在等待上，效果等同于阻塞 I/O；")]),t._v(" "),s("li",[t._v("遍历 "),s("u",[t._v("文件描述符(即 文件I/O 时操作系统与 Node 间的文件凭证)")]),t._v(" 来确定 I/O 是否完成，完成则 "),s("u",[t._v("文件描述符")]),t._v(" 状态改变，缺点是 CPU 轮询消耗还是很大；")]),t._v(" "),s("li",[t._v("epoll模式：即进入轮询时，若 I/O 未完成CPU就休眠，完成后再唤醒 CPU；")])]),t._v(" "),s("p",[s("strong",[s("u",[t._v("现实是：CPU要么重复检查I/O，要么重复检查文件描述符，要么休眠，均无高效利用；理想是：Node 应用发起 I/O 调用后，可直接去执行别的逻辑，操作系统默默地做完 I/O 后，给 Node 发送完成信号，Node 执行回调操作")])]),t._v("；")]),t._v(" "),s("h2",{attrs:{id:"_4-2、异步i-o本质与node实现"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-2、异步i-o本质与node实现"}},[t._v("#")]),t._v(" 4-2、异步I/O本质与Node实现")]),t._v(" "),s("p",[t._v("上述理想般的实现，其实在 Linux 已原生实现—AIO，但两个致命缺陷:")]),t._v(" "),s("ul",[s("li",[t._v("只有 Linux 下存在，其他系统中没有异步 I/O 支持；")]),t._v(" "),s("li",[t._v("无法利用系统缓存；")])]),t._v(" "),s("p",[s("strong",[s("u",[t._v("上述情况单线程无解，但多线程可实现；所以可以让一个进程进行计算操作，另外一些进行 I/O 调用，当 I/O 完成后将信号传给计算的线程，进而执行回调；所以，异步 I/O 就是使用这样的线程池来实现；")])])]),t._v(" "),s("h3",{attrs:{id:"_4-2-1、系统支持"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-1、系统支持"}},[t._v("#")]),t._v(" 4-2-1、系统支持")]),t._v(" "),s("p",[t._v("只是在不同的系统下面表现会有所差异：")]),t._v(" "),s("ul",[s("li",[t._v("在 Linux 下可直接使用线程池来完成；")]),t._v(" "),s("li",[t._v("在 Window 下则采用 IOCP 这个系统 API (内部还是用线程池完成)；")])]),t._v(" "),s("h3",{attrs:{id:"_4-2-2、libuv-兼容统一"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-2-2、libuv-兼容统一"}},[t._v("#")]),t._v(" 4-2-2、libuv 兼容统一")]),t._v(" "),s("p",[t._v("以文件 I/O 为例：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" fs "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'fs'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nfs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("readFile")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/test.txt'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" data")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[s("strong",[t._v("Node 执行代码的大致过程：")])]),t._v(" "),s("ul",[s("li",[t._v("首先，fs.readFile 调用 Node 核心模块 fs.js ；")]),t._v(" "),s("li",[t._v("然后，Node "),s("u",[t._v("核心模块调用内建模块")]),t._v(" node_file.cc，创建对应的文件 "),s("strong",[s("u",[t._v("I/O观察者对象")])])]),t._v(" "),s("li",[t._v("最后，根据不同平台，"),s("u",[t._v("内建模块")]),t._v(" 通过 "),s("strong",[s("u",[t._v("libuv 中间层")])]),t._v(" 进行系统调用(此处是利用 uv_fs_open()  实现)；")])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918140139.png"}}),t._v(" "),s("p",[s("strong",[t._v("libuv 的 uv_fs_open 进行系统调用的大致过程：")])]),t._v(" "),s("p",[t._v("首先，创建请求对象")]),t._v(" "),s("ul",[s("li",[t._v("比如：以 Windows 为例，在函数 uv_fs_open 的调用过程中，创建了一个 "),s("u",[t._v("文件I/O的")]),t._v(" "),s("strong",[s("u",[t._v("请求对象")])]),t._v("，并往里面注入了回调函数。")])]),t._v(" "),s("div",{staticClass:"language-c++ extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("req_wrap->object_->Set(oncomplete_sym, callback);\n// req_wrap 即请求对象，req_wrap 中 object_ 的 oncomplete_sym 属性对应的值便是 Node 应用代码中传入的回调函数\n")])])]),s("p",[t._v("然后，推入线程池，调用返回")]),t._v(" "),s("p",[t._v("上述请求对象包装完成后，"),s("code",[t._v("QueueUserWorkItem()")]),t._v(" 方法将此对象推进线程池中等待执行；")]),t._v(" "),s("p",[s("strong",[t._v("至此，现在 JS 的调用即直接返回，"),s("u",[t._v("JS 应用代码")]),t._v("可 "),s("u",[t._v("继续往下执行")]),t._v("；同时当前 "),s("u",[t._v("I/O 操作")]),t._v(" "),s("u",[t._v("也在线程池中将被执行")]),t._v("；异步目的实现；")])]),t._v(" "),s("p",[t._v("最后，回调通知")]),t._v(" "),s("ul",[s("li",[t._v("首先，当对应线程中的 I/O 完成后，会将获得的结果 "),s("u",[t._v("存储")]),t._v(" 起来，保存到  "),s("u",[s("strong",[t._v("相应的请求对象")])]),t._v(" 中；")]),t._v(" "),s("li",[t._v("然后调用 "),s("code",[t._v("PostQueuedCompletionStatus()")]),t._v(" 向 "),s("u",[t._v("IOCP")]),t._v(" 提交执行完成的状态，并将线程归还给系统；")]),t._v(" "),s("li",[t._v("随后，一旦 Node EvLoop 在轮询操作中，调用 "),s("code",[t._v("GetQueuedCompletionStatus")]),t._v(" 时检测到了完成状态，就会将 "),s("u",[s("strong",[t._v("请求对象")])]),t._v(" 塞给上述提及的 "),s("u",[s("strong",[t._v("I/O观察者对象")])]),t._v("；")]),t._v(" "),s("li",[t._v("最后，"),s("strong",[s("u",[t._v("I/O 观察者对象")])]),t._v(" 取出 "),s("strong",[s("u",[t._v("请求对象")])]),t._v(" 的 "),s("u",[t._v("存储结果")]),t._v("，同时也取出它的 "),s("code",[t._v("oncomplete_sym")]),t._v(" 属性，即回调函数，将前者(存储结果)作为函数参数传入后者(回调)，并执行后者，即执行回调函数；补充： GetQueuedCompletionStatus 和 PostQueuedCompletionStatus\n"),s("ul",[s("li",[t._v("GetQueuedCompletionStatus：在 NodeEvLoop 的描述中，每一个 Tick 当中均会调用 GetQueuedCompletionStatus，以检查线程池中是否有执行完的请求，若有则表示时机已成熟，可执行回调；")]),t._v(" "),s("li",[t._v("PostQueuedCompletionStatus：负责向 IOCP 提交状态，告知当前 I/O 已完成；")])])])])])}),[],!1,null,null,null);_.default=e.exports}}]);