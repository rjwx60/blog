---
typora-root-url: ../Source
---



### 零、问题区

##### 0-1、知道event loop是什么，能举例说明event loop怎么影响平时的编码

- 异步请求数据
- Angular 报错问题—衍生Angular机制

##### 0-2、知道event loop原理，知道宏微任务，并且能从个⼈理解层⾯说出为什么要区分，知道node和浏览器在实 现loop时候的差别

- 原理如下
- 宏微任务靠记忆
- 区分原因看 3-8
- 实现差别结合示例看图



### 一、总结

<img src="/Image/Basics/EventLoop/1.png" style="zoom:50%;" align="center"/>

<img src="/Image/Basics/EventLoop/300.png" style="zoom:50%;" align="center"/>

<img src="/Image/Basics/EventLoop/301.png" style="zoom:50%;" align="center"/>

<img src="/Image/Basics/EventLoop/302.png" style="zoom:50%;" align="center"/>

<img src="/Image/Basics/EventLoop/303.png" style="zoom:50%;" align="center"/>

<img src="/Image/Basics/EventLoop/304.png" style="zoom:50%;" align="center"/>





#### 1-1、背景

##### 1-1-1、进程线程

多进程：同一时间里，同一计算机系统中，允许 2/2+ 进程处于运行状态；

多线程：程序中包含多个执行流，单个程序中可同时运行多个不同线程，来执行不同任务；

- 比如：Chrome 的 Tab 页即一个进程，而一进程中可拥有多个线程，比如渲染、JS 引擎、HTTP 请求线程等；

两者关系：

- 1进程由 1/1+ 个线程组成，线程是1进程中代码的不同执行路线；
- 1进程的内存空间是共享的，每个线程都可用这些共享内存；



##### 1-1-2、任务分类

任务可分为同步异步任务(前者能立即执行)，亦可分为宏任务(macro-task)与微任务(micro-task)；

- 宏任务—MacroTask：整体代码、setTimeout、setInterval、setImmediate、I/O、UI rendering；
- 微任务—MicroTask：process.nextTick、Promises.then-catch-finally、Object.observe、MutationObserver；



##### 1-1-3、浏览器内核

作用：通过取得页面内容、整理信息、应用CSS、计算&组合、最终输出可视化图像结果；

多线程：内核是多线程，在内核控制下，各线程相互配合以保持同步，常驻线程：

- GUI 渲染线程：
  - 负责页面渲染、解析HTML、CSS，构建DOM树、布局、绘制等；重绘/回流，将执行该线程；
  - 注意：该线程与 JS 引擎线程互斥：
    - 当执行JS引擎线程时，GUI渲染会被挂起；
    - 当任务队列空闲时，主线程才会去执行GUI渲染；
- JS引擎线程：
  - 负责处理 JS 脚本、执行代码；
  - 负责执行待执行事件，即定时器计数结束，或者异步请求成功并正确返回时，将依次进入任务队列，等待 JS引擎线程的执行；
  - 注意：该线程与 GUI 渲染线程互斥：
    - 当 JS 引擎线程执行 JS 脚本时间过长，将导致页面渲染的阻塞；
- 定时触发器线程：
  - 负责执行异步定时器一类函数的线程，比如： setTimeout、setInterval；
    - 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理；
    - 当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待JS引擎线程执行；
- 事件触发线程：
  - 负责将准备好的事件交给 JS引擎线程执行；比如 setTimeout定时器计数结束、ajax等异步请求成功并触发回调函数，或用户触发点击事件时；该线程会将整装待发的事件，依次加入到任务队列队尾，并等待 JS 引擎线程的执行；
- 异步http请求线程：
  - 负责执行异步请求一类函数的线程，比如： Promise、axios、ajax 等；
    - 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理；
    - 当监听到状态码变更，若有回调函数，事件触发线程会将回调函数加入到任务队列尾部，并等待 JS 引擎线程执行；







#### 1-3、浏览器 EventLoop 事件循环机制

##### 1-3-1、基本

浏览器为单线程运行环境，有且只有一个调用栈，每次仅能做一件事(若为多线程则有执行优先级判断问题：交互数据、请求数据冲突)；

- **调用栈**：是一记录当前程序所在位置的数据结构，执行某个函数就将其压入栈，离开函数则将其弹出栈；但须注意调用栈有最大容量限制 ，若超出此容量就会发生内存泄露，或超出 *最大可调用栈数-Maximum call stack size*，警告如下；

- <img src="/Image/Basics/EventLoop/2.png" style="zoom:50%;" align="left"/>

- 问题：单栈形式处理不足：当执行处理时间很长的函数时，会导致极差体验 (Blocking)；此时进行别的操作，比如点击按钮也不会执行，因为引擎是单线程，它只会将新事件压入栈顶等待执行；

- 解决：引入并发模型和事件循环 EventLoop；后者旨在观察堆栈和任务队列，当堆栈为空，则将队列中任务出列并压入栈中；

  - 详看：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop

  - 详看：https://juejin.im/post/59e85eebf265da430d571f89#heading-6

- 注意：并发模型和事件循环 EventLoop 只处理异步任务 (挂起异步，先执行别的同步，前者则通过 WebAPI (浏览器) 维护，后通知并存入事件队列 Queue 中，随因 Event Loop 机制，压栈执行，比如用户点击触发动画和计算，在 EventLoop 机制下，动画异步交由 WebAPI 处理 ，而计算则在点击后立马执行，不被阻塞，动画)，但注意！当遇到某些执行时长的同步代码时仍会发生阻塞；此时队列中等待的任务比如渲染、异步处理完的任务等均无法压栈执行 (Blocking again)；



##### 1-3-2、事件循环 EventLoop 运行机制流程

1. 主线程自上而下执行所有代码；
2. 同步任务直接进入到主线程被执行，而异步任务则进入到 Event Table 并注册相对应的回调函数 (WebApi)；
3. 异步任务完成后，Event Table 将此函数移入 Event Queue；
4. 主线程任务执行完后，会从 Event Queue 中读取任务，并放入主线程执行；
5. 不断循环上述过程；

   <img src="/Image/Basics/EventLoop/3.png" style="zoom:50%;" align=""/>

- 注意：同步和异步任务会分别进入不同执行场所，前者进入主线程，后者进入Event Table 并注册函数执行；

  - 而当指定任务完成时，Event Table 会将此函数推入 Event Queue；
  - 而当主线程内任务执行完毕为空时，则会去Event Queue 读取对应函数，并进入主线程执行；最终上述过程不断重复，也即 Event Loop (事件循环)；比如：setInterval 会每隔指定的时间将注册的函数置入Event Queue；

- 注意：不管异步同步任务，均会先压栈：若为同步，则留存执行；若为异步任务，则交由 WebAPI 处理，若 WebAPI 处理结束，WebAPI 则会通知引擎推入队列；另一方面引擎不断检查栈堆，栈空则出队压栈，栈满则等待处理；

- <img src="/Image/Basics/EventLoop/5.png" style="zoom:50%;" align="left"/>

- <video src="/Image/Basics/EventLoop/7.mov" style="zoom:50%;" align="left"></video>

  注意：队列可增加渲染队列，当 Stack 不为空，则渲染队列会被阻塞；

  <img src="/Image/Basics/EventLoop/6.png" style="zoom:50%;" align="left"/>

- 注意：可利用 Error 对象，来打印整个栈树：

- <img src="/Image/Basics/EventLoop/7.png" style="zoom:50%;" align="left"/>



##### 1-3-3、分类

​	任务可分为同步异步任务(前者能立即执行)，亦可分为宏任务(macro-task)与微任务(micro-task)；(注意不同任务被派分的任务队列也不尽相同)，最终基本的执行顺序：script(宏任务) —> 微任务 —> 新的宏任务… —> 结束；

<img src="/Image/Basics/EventLoop/4.png" style="zoom:50%;" align="left"/>

- 宏任务—MacroTask：整体代码、setTimeout、setInterval、setImmediate、I/O、UI rendering 等；
- 微任务—MicroTask：process.nextTick、Promises.then-catch-finally、Object.observe、MutationObserver 等；
- 详看：https://juejin.im/post/59e85eebf265da430d571f89#heading-2



##### 1-3-4、补充-待整理

- 调用一个函数总是会为堆栈创造一个新的栈帧；
- JS 运行时，包含了一个待处理的消息队列 Message Queue；每一 Message 都关联着一个用以处理这个消息的函数；
- EventLoop 期间的某个时刻，运行时从最先进入队列的消息开始处理队列中的消息，此时，消息会被移出队列，并作为输入参数，调用与之关联的函数!!!!!!
- JS 函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息；
- JS 函数执行时，永远不会被抢占，并在其他代码运行之前完全运行，此时若运行时间过长就会发生阻塞；
- JS 永不阻塞，指的是处理 I/O 通常通过事件和回调来执行；比如：当执行异步操作时候，还可处理其它事情；
  - 例外：https://stackoverflow.com/questions/2734025/is-javascript-guaranteed-to-be-single-threaded/2734311#2734311
- 当异步方法如 setTimeout()、ajax请求、DOM事件执行，会交由浏览器内核的其他模块去管理；

<img src="/Image/Basics/EventLoop/110.png" style="zoom:50%;" />

<img src="/Image/Basics/EventLoop/111.png" style="zoom:50%;" />

<img src="/Image/Basics/EventLoop/112.png" style="zoom:50%;" />





#### 1-4、Node EventLoop 事件循环机制



##### 1-4-1、浏览器运行

<video src="/Image/Basics/EventLoop/8.mov" style="zoom:50%;" align="left"></video>





##### 1-4-2、Node运行

<video src="/Image/Basics/EventLoop/9.mov" style="zoom:50%;" align="left"></video>













### 二、答疑

##### 2-1、引擎如何区分同步和异步？

若所执行代码不属于引擎API，而属于外部API，则视为异步，详看：[这里](https://gist.github.com/jesstelford/9a35d20a2aa044df8bf241e00d7bc2d0)

“Executing setTimeout actually calls out to code that is *not* part of JS. It's part of a *Web API* which the browser provides for us” “setTimeout triggers the timeout Web API”—setTimeout 触发超时 Web API

<img src="/Image/Basics/EventLoop/101.png" style="zoom:50%;" align=""/>

“setTimeout is then finished executing; it has offloaded its work to the Web API which will wait for the requested amount of time (1000ms).”

<img src="/Image/Basics/EventLoop/102.png" style="zoom:50%;" align=""/>

“Once the timeout has expired, the Web API lets JS know by adding code to the Event Loop.”

“It doesn't push onto the Call Stack directly as that could intefere with already executing code.”

一旦执行完毕则通知引擎，并推入队列中，不压入栈堆是因为会干扰正在执行的代码(有的话)

<img src="/Image/Basics/EventLoop/102.png" style="zoom:50%;" align=""/>



##### 3-2、由3-1得，ES6中的 Promise 也是 WebAPI 么，同步留栈执行，那异步去哪了？

异步触发 Web API；



##### 3-3、若栈中任务N多，同时异步请求N多，并一直得不到响应，队列是否会满溢？栈溢出报错，队列溢出呢？

同类：若一执行时长N长函数(数学运算)，函数前有N多异步任务，并设置延迟为1秒，假设1秒内所有异步均已交由浏览器维护，当执行N长函数时，所有异步任务均完成，并加入队列中，问题是队列是否会溢出？

如此长时间的卡顿是不存在的，若如此多的同步任务需要处理以至于长时间不响应，栈堆早就溢出了；



##### 3-4、主线程有一执行时长长的同步任务，有几个异步任务，异步时长均小于同步所执行的时间，求输出顺序?

输出顺序由 WebAPI 向队列的通知时刻先后确定；

<img src="/Image/Basics/EventLoop/104.png" style="zoom:50%;" align="left"/>



##### 3-5、何时检查队列和栈堆为空的？

堆栈会一直检查，队列会在堆栈为空时检查；

原因：JS引擎存在 monitoring process 进程，会持续不断的检查栈堆是否为空。一旦为空，就会检查 Event Queue 是否有等待被调用的函数；详看：[这里](https://juejin.im/post/59e85eebf265da430d571f89#heading-6)



##### 3-6、3-5 中提到的那种检查相隔多久进行一次？

不明；



##### 3-7、Event loop 会耗费性能吗？

不会；

原因：Event loop 初始化时的 task 队列为空，并且每一个 Event loop 都有 a microtask checkpoint flag (一个是否有可执行 task 的标志，默认为 false)

“Each [event loop](https://www.w3.org/TR/2017/REC-html52-20171214/webappapis.html#event-loop) has a **currently running task**. Initially, this is null. It is used to handle reentrancy. Each [event loop](https://www.w3.org/TR/2017/REC-html52-20171214/webappapis.html#event-loop) also has a **performing a microtask checkpoint flag**, which must initially be false. It is used to prevent reentrant invocation of the [perform a microtask checkpoint](https://www.w3.org/TR/2017/REC-html52-20171214/webappapis.html#performs-a-microtask-checkpoint) algorithm.”

详看：[这里](https://www.cnblogs.com/dong-xu/p/7000163.html) [这里](https://www.w3.org/TR/2017/REC-html52-20171214/webappapis.html#event-loops) [还有这里](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)  





##### 3-8、如何分辨宏微任务？什么是宏任务 macro-task & 微任务 micro-task ? 为何分宏微任务? 

宏任务：整体代码，setTimeout， setInterval，setImmediate，I/O，UI rendering；

微任务：process.nextTick，Promises，Object.observe，MutationObserver；

详看：[这里](https://segmentfault.com/a/1190000014940904#articleHeader7) [和这里](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)

- 宏任务：即两次 render 间的任务；浏览器为了让 JS 内部 macro-task 与 DOM任务有序执行，会在旧 macro-task 执行结束后、新 macro-task 执行前，对页面进行重新渲染 render：
  - 旧宏 macro-task -> render -> 新宏 macro-task -> render -> …

- 微任务：即栈空且在当前 macro-task 执行结束后，在下一个新的 macro-task 执行前的任务；微任务的存在，使得无需再分配新的 macro-task，减小性能开销。只要栈空且当前宏任务执行完毕，微任务队列会立即执行。微任务执行期间，又有新的微任务，则推入队列尾部，后执行；

<img src="/Image/Basics/EventLoop/105.png" style="zoom:50%;" align=""/>





### 三、示例A-浏览器相关

#### 3-1、示例1

<img src="/Image/Basics/EventLoop/A-1.tiff" style="zoom:50%;" align="left"/>

解释：node环境：跑完微任务 跑所有宏任务 再次跑所有微任务

注意：process.nextTick 的概念和 then 不太一样，前者是加入到执行栈底部，故与其他表现并不一致；

```javascript
// 1 7 6 8 2 4 9 11 3 10 5 12
```

解释：浏览器环境：需先用 Promise.resolve().then(()=>{ 替换 process.nextTick；

```javascript
//  1 7 6 8 2 4 3 5 9 11 10 12
```



#### 3-2、示例2

<img src="/Image/Basics/EventLoop/A-21.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-22.png" style="zoom:50%;" align="left"/>

解释：先宏任务script，再微任务then，再异步宏任务setTimeout



#### 3-3、示例3

<img src="/Image/Basics/EventLoop/A-3.png" style="zoom:50%;" align="left"/>

解释：先同步宏任务124，再微任务then-53，再异步宏任务6



#### 3-4、示例4

<img src="/Image/Basics/EventLoop/A-4.png" style="zoom:50%;" align="left"/>

解释：Promise new 时会立即执行其中代码，而 then 是微任务，故会在本次任务执行完时执行， setTimeout 是宏任务，会在下次任务执行的时候执行；



#### 3-5、示例5

<img src="/Image/Basics/EventLoop/A-51.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-52.png" style="zoom:50%;" align="left"/>

解释：相当于两个 onClick 事件函数展开，但因为冒泡原因，所以先执行 inner，后执行 outer???，宏观script，到微任务then和mutationObserver，最后到宏任务setTimeout



#### 3-6、示例6

<img src="/Image/Basics/EventLoop/A-61.png" style="zoom:50%;" align="left"/>

解释：先宏任务135后微任务4再宏任务2；

<img src="/Image/Basics/EventLoop/A-62.png" style="zoom:50%;" align="left"/>

解释：先宏任务“马上、代码”，后微任务“then”再宏任务“定时器”；

<img src="/Image/Basics/EventLoop/A-63.tiff" style="zoom:50%;" align="left"/>

解释：先宏任务235，再微任务4，再宏任务1；



#### 3-7、示例7

<img src="/Image/Basics/EventLoop/A-7.png" style="zoom:50%;" align="left"/>



#### 3-8、示例8

<img src="/Image/Basics/EventLoop/A-81.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-82.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-83.png" style="zoom:50%;" align="left"/>



#### 3-9、示例9

<img src="/Image/Basics/EventLoop/A-91.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-92.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-93.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/A-94.png" style="zoom:50%;" align="left"/>



#### 3-10、示例10

详看：[这里](https://www.cnblogs.com/lpggo/p/8127604.html)











### 四、示例B-Node相关

#### 4-1、示例1：浏览器端与Node端区别：浏览器端：

<img src="/Image/Basics/EventLoop/200.png" style="zoom:50%;" align="left"/>

解释：浏览器没有 process.nexTick，故用promiseThen代替，但性质不一样(见下方)：

首先，执行外围宏任务110，发现新的宏任务setTimeoutA，加塞队列，后执行微任务then输出58；

然后，执行微任务时又发现新的宏任务setTimeoutB，加载宏任务队列中，还发现新的微任务，加载到微任务列表中，故随后输出79；

随后，执行下一个宏任务setTimeoutA输出2；

然后，执行微任务输出34；

最后，再执行下一个setTimeoutB输出6；





#### 4-1、示例1：浏览器端与Node端区别：Node端：

<img src="/Image/Basics/EventLoop/201.png" style="zoom:50%;" align="left"/>





#### 4-2、示例2：nextTick 探讨

<img src="/Image/Basics/EventLoop/202.png" style="zoom:50%;" align="left"/>

解释：先宏任务1、10，再来 nextTick8、9，然后微任务 then-5、7，然后宏任务 setTimeout2、6，再来微任务 then-3+nextTick-4

原因：process.nextTick 的概念和 then 不太一样：process.nextTick 是加入到执行栈底部，所以和其他的表现并不一致；





#### 4-3、示例3：

<img src="/Image/Basics/EventLoop/203.png" style="zoom:50%;" align="left"/>

解释：

宏任务—17、nextTick栈底—6、微任务—8、宏任务—249.11(同为setTimeout同一阶段同一处理)、nextTick栈底—3.10、微任务—5.12



#### 4-3-1、示例3-1：类似示例3，只是加大了setTimeout等待时间

<img src="/Image/Basics/EventLoop/204.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/205.png" style="zoom:50%;" align="left"/>





#### 4-4、示例4：

<img src="/Image/Basics/EventLoop/206.png" style="zoom:50%;" align="left"/>

25341



#### 4-4-1、示例4补充+疑问

<img src="/Image/Basics/EventLoop/207.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/208.png" style="zoom:50%;" align="left"/>

234



#### 4-4-2、

<img src="/Image/Basics/EventLoop/209.png" style="zoom:50%;" align="left"/>

注意：分析嵌套Promise关键是理清微任务有哪些，执行顺序还是宏微宏微，若无宏任务，则连续的微任务，但执行顺序是以加入队列的先后执行的，上图中一轮，promise1后只有then微任务，进入then执行，输出then11和promise2，随后发现2个微任务，一个是里面的then，一个是外面的then，然后执行…

<img src="/Image/Basics/EventLoop/210.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/211.png" style="zoom:50%;" align="left"/>





#### 4-4-3、

<img src="/Image/Basics/EventLoop/212.png" style="zoom:50%;" align="left"/>

注意：若内里return ，则回归正统的链式调用，由上往下执行，promise1、then11、promise2、then21、then23、then12



#### 4-4-4、

<img src="/Image/Basics/EventLoop/213.png" style="zoom:50%;" align="left"/>

<img src="/Image/Basics/EventLoop/214.png" style="zoom:50%;" align="left"/>

注意：若有多个Promise，执行效果同5-2，只是多了些代码，大体还是宏微宏微结构；



#### 4-4-5、

<img src="/Image/Basics/EventLoop/215.png" style="zoom:50%;" align="left"/>

注意：async类型题目，将async后的内容纳入 promise.then 即可

<img src="/Image/Basics/EventLoop/216.png" style="zoom:50%;" align="left"/>





#### 4-4-6、

<img src="/Image/Basics/EventLoop/217.png" style="zoom:50%;" align="left"/>

注意：nextTick 发生在宏任务之后，微任务之前，setImmediate为宏任务，将其与setTimeout并列即可

<img src="/Image/Basics/EventLoop/218.png" style="zoom:50%;" align="left"/>