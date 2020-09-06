---
typora-root-url: ../../../BlogImgsBed/Source
---



### 关键词 & 路线：翻墙文章 How Node work internally + 书

https://medium.com/@sahityakumarsuman/how-nodejs-works-internally-6cf508e61548

[https://stackoverflow.com/questions/9497076/how-node-js-works#:~:text=Node%20JS%20applications%20uses%20single,accommodate%20the%20main%20event%20loop.](https://stackoverflow.com/questions/9497076/how-node-js-works#:~:text=Node JS applications uses single,accommodate the main event loop.)









### 一、基本

#### 1-1、诞生

​	缘由：其他语言存在各种问题，诸如开发门槛高、包含很多阻塞 I/O 库、性能缺陷，而 JS 无后端历史包袱、符合事件驱动、V8高性能、无压导入非阻塞 I/O 库；

​	诞生：09年3月 RyanDahl，基于 V8 引擎，轻量级 Web 服务器，12年1月转由 Isaac Z. Schlueter 接手；因目的为构建大型网络应用，而每一 Node 进程均参与构成此网络应用的节点，故取名 Node；相比于 Chrome，缺少 Webkit 布局引擎、Html 层、显卡支持等，但支持访问本地文件，基于事件驱动的异步架构；此外还有 node-webkit 项目，其将 Node 与 Webkit 的事件循环相融合，使得既可 UI 构建，又可访问本地资源，实现桌面开发；总结即Node 是 JS 在服务端的运行环境，构建在 chrome 的 V8 引擎之上；



#### 1-2、特点

1.异步非阻塞 IO：底层拥有大量异步 IO(从文件读取到网络请求)，可实现并行 IO 操作，并拥有提升效率方式；

2.事件编程：轻量级、轻耦合，只关注事务，回调通知机制，有回调问题但可通过 Promise 改善，程序无需阻塞等待结果返回，原因同步模式等待的时间则可来处理其它任务；

3.单线程：无状态同步问题，无死锁，无线程上下文交换导致的性能开销，但也无法利用多核、缺乏健壮性、执行时间长也会导致线程阻塞，但可通过 child_process 子进程改善；

4.跨平台：通过 libuv (操作系统与 Node 上层模块间的平台架构层)，兼容统一多平台接口；

- 注意：Nginx 也是采用事件驱动机制，其避免多线程的线程创建、线程上下文切换的开销；但 Nginx 采用 C 语言编写，主用于高性能 Web 服务器，不适合业务开发；
- 注意：虽单线程模型，但却基于事件驱动和异步非阻塞模式，可用于高并发场景，避免线程创建、线程间上下文切换产生资源开销；
- 注意：实际上，应结合场景，单核 CPU 系统上，可采用单进程 + 单线程 模式开发；多核则可采用多进程 + 单线程模式开发；
  - 补充：进程：系统进行资源分配和调度的基本单位；计算机中程序关于某数据集合上的一次运行活动，线程的容器，是操作系统结构的基础，每当启动一个服务、运行一个实例即开辟一个服务进程；比如 JVM、node app.js；多进程即进程复制，复制出的每个进程均拥有独立空间地址、数据栈等资源；此时 A 进程无法访问 B 进程中定义的变量、数据结构，只有建立 IPC 通信，进程间才可进行数据通信与共享；
  - 补充：线程：操作系统能够进行运算调度的最小单位；隶属于进程，被包含于进程中，一线程只能隶属于一进程，但1进程可拥有多个线程；单线程即一进程只开一线程；
- 注意：开启多进程并非解决高并发，而主要解决单进程模式下 CPU 利用率不足情况以充分利用多核性能；

- - 使用：通过 child_process.fork 开启多进程 (Node 在 v0.8 版本后新增 Cluster 实现多进程架构)；

- 注意：Node 开发过程中，错误会引起整个应用退出，故需考虑应用健壮性(异常抛出、进程守护等)；
- 注意：单线程无法利用多核 CPU，但后来 Node 提供相应 API 以及三方工具以解决；



#### 1-3、场景

IO 密集型：

- 优势：利用事件驱动，而非启动线程为每一请求服务，资源占用极少；
- 优势：异步非阻塞IO，极好解决单线程上，CPU 与 IO 间阻塞无法重叠问题，IO 阻塞造成的性能浪费远比 CPU 影响要小；

CPU 密集型：

- 劣势：执行时间长的计算，将导致 CPU 时间片不能释放，导致无法发起后续 IO；
- 解决1：可适当调整/分解大型计算任务为小任务(时间分片??)，使运算及时释放；
- 解决2：可编写 C/C++ 扩展，以高效地利用 CPU，实现某些 V8 自身难以实现的需求；
- 解决3：倘若单线程 Node、C/C++ 扩展均无法满足需求，还可将部分 Node 进程当做常驻服务用于计算，然后利用进程间消息传递结果，将计算与IO分离，充分利用多核 CPU；



#### 1-4、结构

<img src="/Image/Chromium/3.png" style="zoom:50%;" align="center"/>

- V8：谷歌开源项目，目的是在浏览器之外执行 JS 代码；V8 为 Node 提供底层网络访问，并帮助 Node 处理并发性问题等的各个方面；此项目中 70% 的代码是用 C++ 编写，另外 30% 则是用 JS 编写；
- libuv：libuv 是位于 libeio、 libev、 c-ares (用于DNS)和 iocp (用于 windows asynchronous-io)顶部的抽象层；libuv 执行、维护和管理事件池中的所有 I/O操作和事件；(如果是 libeio 线程池)；它允许 JS 代码执行 I/O 操作(无论是网络操作还是文件操作等)；该库执行所有 TCP 级别的连接和文件/系统操作；此库完全由 C++ 编写；
- 注意：NodeJs 只是作为编写的 JS 代码，与其他用 JS 或 C++ 编写的代码 (***<u>V8和 libuv</u>***)间的接口；这使得 JS 开发者不必直接与 C++ 代码交互，并将应用程序的 JS 部分同运行在计算机中的实际 C++ 代码相关联起来，以编译和执行 JS 代码；此外 NodeJS 还提供了系列包装器和统一的 API，以供在项目中使用，比如库模块，如 http，fs，crypto，path 等非常一致的 API，用户不能直接访问 C++ 编写的代码，而只需使用 JS 函数，函数最终调用 node.js libuv 项目；

<img src="/Image/Chromium/4.png" style="zoom:50%;" align="center"/>



。



### 二、运作机制

### 三、模块机制

#### 3-1、基本：

Node 借鉴 CommonJS 的 Modules 规范实现自身模块系统；

#### 3-2、分类

3-2-1、核心模块：

- 描述：由 Node 自身提供，其在源码编译时即被编译进二进制执行文件，当进程启动时便被直接加载进内存；
- 注意：因上述原因，此类模块的引入/文件定位/编译执行步骤均可忽略，而在路径分析中，其优先级更高，加载速度也更快；

3-2-2、文件模块：用户提供的，运行时加载的，速度比核心慢，需经过3阶段：路径分析、文件定位、编译执行；

3-2-3、模块异同：

- 相同：引入的模块均会进行缓存(缓存内容：编译 & 执行后的对象)，以减少二次引入时的开销；
- 不同：
  - 缓存检查优先度中，核心模块依然优先于文件模块；
  - 文件模块无须将源代码编译进 Node，而是通过 `dlopen` 方法动态加载；
  - 文件模块在编写时无须将源代码写入 Node 命名空间，也无需提供头文件；



#### 3-3、路径分析

3-3-1、描述

模块标识符分析(require() 中的标识符参数分析)，基于此标识符进行模块查找；等同npm包路径分析；

- 核心模块：http、fs、path 等；

- - 首先，路径优先级最高，其次是缓存；
  - 其次，无需定位、无需编译，直接使用；

- 文件模块：以点开始的相对路径文件模块 & 以斜杠开始的绝对路径文件模块；

- - 首先，`require` 会将其转为真实路径，并以此作为索引；
  - 然后，根据模块路径查找策略定位文件，并进行编译；
  - 随后，将编译后的执行结果存放在缓存，以便二次加载更快；

- 自定模块：非路径形式的文件模块，形式为文件/包，比如自定义 connect 模块；

- - 首先，根据模块路径查找策略定位文件；
  - 注意：自定义模块均在文件最外层，故加载速度最慢 (除非写在当前文件的 `node_modules` 中..)；



3-3-2、路径形式

模块路径具体表现为由路径组成的数组；

- 生成方式：创建任意 JS 文件，内容为 `console.log(module.paths)`，然后 `node 目标文件.js` 即可输出；



3-3-3、模块查找策略

加载过程中，Node 会逐个尝试模块路径中的路径，直到找到目标文件为止，路径越深，模块查找耗时越多；

- 搜寻当前文件目录下的 `node_modules` 目录；
- 搜寻父级文件目录下的 `node_modules` 目录；
- 搜寻爷级文件目录下的 `node_modules` 目录；
- 沿路径向上逐级递归，直至根目录下的 `node_modules` 目录；



#### 3-4、文件定位

文件扩展名分析：

若不包含扩展名，则调用 fs 模块同步阻塞式判断文件是否存在，并按 `.js > .json > .node` 顺序补足扩展名；

- 注意：对 node、json 文件，可在使用 require 时，顺带添加扩展名，以稍微提高速度；
- 注意：因缓存优化策略，二次引入时无需路径分析、文件定位、编译执行等过程；

3-4-2、目录与包分析：

若通过文件扩展名分析后，仍无法找到对应文件(或得到一个目录<常见于自定义模块，逐个模块路径查找时>)，此时 Node 会将目录当作包来处理；

- 首先，在所在目录查找 `package.json`：
  - 若有，则通过 `JSON.parse` 解析出包描述对象，并取出 main 属性指定的文件名进行定位；
    - 若缺少文件名扩展名，则进入文件扩展名分析流程；
    - 若文件名错误，则将 index 作为默认文件名，依次查找 `index.js  index.json index.node；`
  - 若无，则将 index 作为默认文件名，依次查找 `index.js  index.json index.node；`
- 最后，若还是没有成功定位任何文件，则继续查找下一个模块路径，直至路径数组遍历完毕，若依然没有找到，则向上抛出查找失败错误；
- 示例：
  - <img src="/Image/Chromium/1.png" style="zoom:50%;" align="left" />



#### 3-5、模块编译

编译后进行加载并导出，此节亦是 CommonJS 模块规范的 Node 实现 

- 原理：编译过程中，Node 对获取到的 JS 文件，进行头尾包装，以实现每个模块文件的作用域隔离：

- - 头部增加：`(function(*exports*, *require*, *module*, *__filename*, *__dirname*){ \n；` 
  - 尾部增加：`\n })`

- 然后，通过执行 vm 原生模块的 `runInThisContext` ，返回一个具体的 function 对象，并将当前模块的 exports、require、module(模块自身)、查找到的文件路径、文件目录作为参数传递此 function 执行；

- - 这也是为何：`require、exports、module` 变量没有在模块中定义，却可在每个模块中存在的原因；

- 最后，对象执行后，将模块的 `exports` 属性返回给调用方，此后属性上的方法 & 属性，均可被外部调用，但其余变量则不可直接调用；

- <img src="/Image/Chromium/2.png" style="zoom:50%;" align="left" />



3-5-1、文件模块编译

- 普通文件模块：

- - 首先，定位到具体文件后，新建模块对象；

  - 然后，按照路径 & 文件扩展名载入并进行相应编译 (具体编译实现看核心模块的JS模块编译)：

  - - `.js`：用 fs 模块同步读取，随后编译执行；
    - `.json` ：用 fs 模块同步读取并用 `JSON.parse` 解析，将结果赋给模块对象的 `exports` 供外部调用；
    - `.node` ：使用 dlopen 方法加载最后编译生成的文件；
    - `.else`  ：处理同 `.js` 文件；

  - 最后，编译成功的模块，将其文件路径作为索引，在 `Module._cache` 对象上缓存以提高二次导入性能；

- 特殊文件模块：C/C++ 模块

  - 描述：即上述提到的 node 文件，用于提升性能与执行效率；

- - 注意：使用 `dlopen` 方法动态加载最后编译生成的文件；
  - 注意：`dlopen` 的实现因平台而不同，但均通过 libux 兼容层封装统一；
  - 注意：实际上，node 文件是用 C/C++ 编写的扩展文件，经编译后生产，故无需编译，只需加载 & 执行；
  - 注意：执行时，模块的 exports 与 .node 模块相关联，然后返回给调用者；

- 特殊文件模块：C/C++扩展模块

- - 编写：与核心模块相比，无需编写如 node 命名空间，即 `namespace node { ..`
  - 加载：仅通过 `process.dlopeen` 动态加载；
  - 导出：详看 31-33；



3-5-2、核心模块编译

核心模块实际可分成 C/C++ 编写部分和 JS 编写两部分：

- 核心模块 JS 编写部分：

- - 存储：在 lib 目录；

  - 转换：使用 V8 的 `js2c.py` 工具，将 JS 代码 (`src/node.js & lib/*.js`) 转换成 C++ 数组，生成 `node_natives.h` 文件，并存储在 `NativeModule._source` 中；

  - - 首先，通过 `process.binding(‘natives’)` 取出上述通过 `js2c.py` 转换的字符串数组，并将其重新转为普通字符串；
    - 然后，进行头尾包装以导出 `export` 对象；
    - 最后，编译成功的模块，将其文件路径作为索引，缓存在 `NativeModule._cache` 对象上；
    - 注意：转换 JS 码时，JS 代码以字符串形式，存储在 node 命名空间中，不可直接执行；
    - 注意：核心模块需编译，而文件模块还需进行路径分析、文件定位；
    - 注意：文件模块缓存中在 `Module._cache` 对象中；
    - 注意：当 Node 进程启动时，JS 代码将直接加载进内存JS 核心模块经标识符分析后直接定位到内存；

- 核心模块 C/C++ 编写部分：

- - 存储：在 src 目录；

  - 转换：因原本即用 C/C++ 编写，随后又被编译成二进制文件，故无需再转换；

  - - 注意：当 Node 进程启动时，便被直接加载进内存，无需定位、分析、编译等步骤，直接可执行；
    - 协助加载：在 Node 启动过程中，还会生成全局变量 `process`，其提供 `Binding` 方法协助加载；
    - 真正加载：此时，会先构建 `exports` 对象，调用 `get_builtin_module` 方法取出模块，执行 `register_func` 填充 `exports` 对象，最后 `exports` 对象按模块名缓存，并返回给调用方完成导出；







### 四、异步机制

Node 中阻塞IO与异步IO的实现：

- 阻塞和非阻塞 I/O 其实是针对操作系统内核而言：
  - 阻塞 I/O：**<u>一定要等到操作系统完成所有操作后才表示调用结束</u>**；
  - 非阻塞 I/O：**<u>调用后立马返回不等操作系统内核完成操作</u>**；
- Node 的异步 I/O 采用多线程的方式，由 `EventLoop`、`I/O 观察者`，`请求对象`、`线程池 `四大要素相互配合，共同实现；



#### 4-1、I/O

**<u>I/O 即 Input/Output</u>**；在浏览器端，只有一种 I/O(网络I/O)，即利用 Ajax 发送网络请求，然后读取返回的内容；而 Node 则有相对广泛的 I/O 的场景：

- **<u>文件 I/O</u>**：比如用 fs 模块对文件进行读写操作；
- **<u>网络 I/O</u>**：比如用 http 模块发起网络请求；



#### 4-2、阻塞和非阻塞I/O

阻塞和非阻塞 I/O 其实是针对操作系统内核而言：

- 阻塞 I/O：**<u>一定要等到操作系统完成所有操作后才表示调用结束</u>**；
- 非阻塞 I/O：**<u>调用后立马返回不等操作系统内核完成操作</u>**；

使用前者，在操作系统进行 I/O 操作过程中，应用程序实际一直处于等待状态；

使用后者，调用返回后 Node 应用程序可完成其他事情，而系统同时也在进行 I/O，充分利用等待时间，提高执行效率，但应用无法得知系统已完成 I/O 操作；

为让 Node 获悉操作系统已做完 I/O 操作，需要重复地去操作系统那里判断是否完成，这种重复判断的方式就是 **<u>轮询</u>**，方案如下：

- 一直轮询检查I/O状态，直到 I/O 完成；**<u>最原始的方式性能也最低</u>**，会让 CPU 一直耗用在等待上，效果等同于阻塞 I/O；
- 遍历 <u>文件描述符</u> 来确定 I/O 是否完成，I/O 完成则 <u>文件描述符</u> 的状态改变，缺点是 CPU 轮询消耗还是很大；
  - 补充：文件描述符： 即 文件I/O 时操作系统与 Node 间的文件凭证；
- epoll模式：即进入轮询时，若 I/O 未完成CPU就休眠，完成后再唤醒 CPU；

**<u>现实是：CPU要么重复检查I/O，要么重复检查文件描述符，要么休眠，均无高效利用；理想是：Node 应用发起 I/O 调用后，可直接去执行别的逻辑，操作系统默默地做完 I/O 后，给 Node 发送完成信号，Node 执行回调操作</u>**；



#### 4-3、异步 I/O 本质

上述理想般的实现，其实在 Linux 已原生实现—AIO，但两个致命缺陷:

- 只有 Linux 下存在，其他系统中没有异步 I/O 支持；
- 无法利用系统缓存；



#### 4-4、Node 异步 I/O 实现

**<u>上述情况单线程无解，但多线程可实现；所以可以让一个进程进行计算操作，另外一些进行 I/O 调用，当 I/O 完成后将信号传给计算的线程，进而执行回调；所以，异步 I/O 就是使用这样的线程池来实现；</u>**



##### 4-4-1、系统支持

只是在不同的系统下面表现会有所差异：

- 在 Linux 下可直接使用线程池来完成；
- 在 Window 下则采用 IOCP 这个系统 API (内部还是用线程池完成)；

有了操作系统的支持，那 nodejs 如何来对接这些操作系统从而实现异步 I/O 呢？



##### 4-4-2、libuv 兼容统一

以文件 I/O 为例：

```js
let fs = require('fs');

fs.readFile('/test.txt', function (err, data) {
    console.log(data); 
});
```

**Node 执行代码的大致过程：**

- 首先，fs.readFile 调用 Node 核心模块 fs.js ；
- 然后，Node <u>核心模块调用内建模块</u> node_file.cc，创建对应的文件 **<u>I/O观察者对象</u>**
- 最后，根据不同平台，<u>内建模块</u> 通过 **<u>libuv 中间层</u>** 进行系统调用(此处是利用 uv_fs_open()  实现)；

<img src="/Image/Chromium/30.png" style="zoom:50%;" />



**libuv 的 uv_fs_open 进行系统调用的大致过程：**

- 首先，创建请求对象

以 Windows 为例，在函数 uv_fs_open 的调用过程中，创建了一个 <u>文件I/O的</u> **<u>请求对象</u>**，并往里面注入了回调函数。

```c++
req_wrap->object_->Set(oncomplete_sym, callback);
// req_wrap 即请求对象，req_wrap 中 object_ 的 oncomplete_sym 属性对应的值便是 Node 应用代码中传入的回调函数
```

- 然后，推入线程池，调用返回

上述请求对象包装完成后，`QueueUserWorkItem()` 方法将此对象推进线程池中等待执行；

**至此，现在 JS 的调用即直接返回，<u>JS 应用代码</u>可 <u>继续往下执行</u>；同时当前 <u>I/O 操作</u> <u>也在线程池中将被执行</u>；异步目的实现；**

- 最后，回调通知
  - 首先，当对应线程中的 I/O 完成后，会将获得的结果 <u>存储</u> 起来，保存到  <u>**相应的请求对象**</u> 中；
  - 然后调用 `PostQueuedCompletionStatus()` 向 <u>IOCP</u> 提交执行完成的状态，并将线程归还给系统；
  - 随后，一旦 Node EvLoop 在轮询操作中，调用 `GetQueuedCompletionStatus` 时检测到了完成状态，就会将 <u>**请求对象**</u> 塞给上述提及的 <u>**I/O观察者对象**</u>；
  - 最后，**<u>I/O 观察者对象</u>** 取出 **<u>请求对象</u>** 的 <u>存储结果</u>，同时也取出它的 `oncomplete_sym` 属性，即回调函数，将前者(存储结果)作为函数参数传入后者(回调)，并执行后者，即执行回调函数；
  - 补充： `GetQueuedCompletionStatus` 和 `PostQueuedCompletionStatus`
    - `GetQueuedCompletionStatus`：在 NodeEvLoop 的描述中(<u>详看V8—EvLoop—NodeEvLoop小节</u>)，每一个 Tick 当中均会调用 `GetQueuedCompletionStatus`，以检查线程池中是否有执行完的请求，若有则表示时机已成熟，可执行回调；
    - `PostQueuedCompletionStatus`：负责向 IOCP 提交状态，告知当前 I/O 已完成；



##### 4-4-3、总结

Node 中阻塞IO与异步IO的实现：

- 阻塞和非阻塞 I/O 其实是针对操作系统内核而言：
  - 阻塞 I/O：**<u>一定要等到操作系统完成所有操作后才表示调用结束</u>**；
  - 非阻塞 I/O：**<u>调用后立马返回不等操作系统内核完成操作</u>**；
- Node 的异步 I/O 采用多线程的方式，由 `EventLoop`、`I/O 观察者`，`请求对象`、`线程池 `四大要素相互配合，共同实现；





### 五、内存管理



### 六、事件机制

#### 6-1、node 内部回调机制

回调内部利用了`发布-订阅`模式，下面模拟实现 Node 中的 Event 模块为例来写实现回调函数的机制，详看： [Event 模块](https://github.com/Gozala/events/blob/master/events.js) 

```js
// 原理: 
// 通过 Map 管理存放的回调，addListener 为存入，emit 为调用，removeListener 为取出，once 为根据标记选择性调用
function EventEmitter() {
  this.events = new Map();
}

// once 参数表示是否只是触发一次
const wrapCallback = (fn, once = false) => ({ callback: fn, once });

EventEmitter.prototype.addListener = function (type, fn, once = false) {
  let handler = this.events.get(type);
  if (!handler) {
    // 为 type 事件绑定回调
    this.events.set(type, wrapCallback(fn, once));
  } else if (handler && typeof handler.callback === 'function') {
    // 目前 type 事件只有一个回调
    this.events.set(type, [handler, wrapCallback(fn, once)]);
  } else {
    // 目前 type 事件回调数 >= 2
    handler.push(wrapCallback(fn, once));
  }
}

EventEmitter.prototype.removeListener = function (type, listener) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (!Array.isArray(handler)) {
    if (handler.callback === listener.callback) this.events.delete(type);
    else return;
  }
  for (let i = 0; i < handler.length; i++) {
    let item = handler[i];
    if (item.callback === listener.callback) {
      // 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 -- 
      handler.splice(i, 1);
      i--;
      if (handler.length === 1) {
        // 长度为 1 就不用数组存了
        this.events.set(type, handler[0]);
      }
    }
  }
}

EventEmitter.prototype.removeAllListener = function (type) {
  let handler = this.events.get(type);
  if (!handler) return;
  else this.events.delete(type);
}

EventEmitter.prototype.emit = function (type, ...args) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (Array.isArray(handler)) {
    // 遍历列表，执行回调
    handler.map(item => {
      item.callback.apply(this, args);
      // 标记的 once: true 的项直接移除
      if (item.once) this.removeListener(type, item);
    })
  } else {
    // 只有一个回调则直接执行
    handler.callback.apply(this, args);
  }
  return true;
}

EventEmitter.prototype.once = function (type, fn) {
  this.addListener(type, fn, true);
}

// 测试
let e = new EventEmitter();
e.addListener('type', () => {
  console.log("type事件触发！");
})
e.addListener('type', () => {
  console.log("WOW!type事件又触发了！");
})

function f() { 
  console.log("type事件我只触发一次"); 
}
e.once('type', f)
e.emit('type');
e.emit('type');
e.removeAllListener('type');
e.emit('type');

// type事件触发！
// WOW!type事件又触发了！
// type事件我只触发一次
// type事件触发！
// WOW!type事件又触发了！

// 缺点:
// 1、在参数少的情况下，call 的性能优于 apply，反之 apply 的性能更好。因此在执行回调时候可以根据情况调用 call 或者 apply。
// 2、考虑到内存容量，应该设置回调列表的最大值，当超过最大值的时候，应该选择部分回调进行删除操作。
// 3、鲁棒性有待提高。对于参数的校验很多地方直接忽略掉了。
```

