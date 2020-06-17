---
typora-root-url: ../Source
---

### 一、总结

<img src="/Image/Basics/EventLoop/1.png" style="zoom:50%;" align="left"/>

#### 1-3、浏览器的事件循环机制EventLoop

##### 1-3-1、基本

浏览器为单线程的运行环境，有且只有一个调用栈，每次只能做一件事(若为多线程则有执行优先级判断问题：交互数据、请求数据冲突)；

- 补充：调用栈是一记录当前程序所在位置的数据结构，执行某个函数就将其压入栈，离开函数则将其弹出栈；
  - 注意：调用栈有最大容量限制，若超出此容量就会发生内存泄露，或超出最大可调用栈数，警告如下；
  - <img src="/Image/Basics/EventLoop/2.png" style="zoom:50%;" align="left"/>

- 问题：仅靠单栈处理不足：体现在当执行处理时间很长的函数时，会导致极差体验 (Blocking)；此时进行别的操作，比如点击别的跳转按钮也不会执行，因引擎是单线程的，它只会将新事件压入栈顶；
- 缓解：可通过引入并发模型和事件循环缓解；
  - 详看：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop
  - 注意：此机制只针对于异步处理：“挂起异步代码，先执行别的同步代码，异步代码则通过 WebAPI 通知、存入 Queue 中、Event Loop 机制，压栈执行，用户点击、触发动画和计算，动画异步交由 WebAPI 和 EventLoop，计算在点击之后立马执行，不被阻塞”(有误，应为交由WebApi维护，WebAPi是浏览器)
  - 详看：https://juejin.im/post/59e85eebf265da430d571f89#heading-6
- 问题：并发模型和事件循环只是处理异步任务，而当遇到某些执行时长的同步代码时仍会发生阻塞；此时队列中等待的任务比如：渲染、异步处理完的任务等，均无法压栈执行 (Blocking again)；
- 解决：引入事件循环EventLoop：旨在观察堆栈和任务队列，当堆栈为空，则将队列中任务出列并压入栈中；
- 解释：事件循环 EventLoop 运行机制
  - 主线程自上而下执行所有代码；
  - 同步任务直接进入到主线程被执行，而异步任务则进入到 Event Table 并注册相对应的回调函数；
  - 异步任务完成后，Event Table 会将这个函数移入 Event Queue；
  - 主线程任务执行完了以后，会从Event Queue中读取任务，进入到主线程去执行；
  - 循环如上；
  - <img src="/Image/Basics/EventLoop/3.png" style="zoom:50%;" align="left"/>

- 注意：同步和异步任务分别进入不同执行场所，前者进入主线程，后者进入Event Table 并注册函数执行；而当指定任务完成时，Event Table 会将此函数移入 Event Queue；而当主线程内的任务执行完毕为空，则会去Event Queue 读取对应函数，并进入主线程执行；最终上述过程不断重复，也即 Event Loop (事件循环)；比如：setInterval 会每隔指定的时间将注册的函数置入Event Queue；

- 注意：不管异步同步任务，均会先压栈：若为同步，则留存执行；若为异步任务，则交由 WebAPI 处理，若 WebAPI 处理结束，WebAPI 则会通知引擎推入队列；另一方面引擎不断检查栈堆，栈空则出队压栈，栈满则等待处理；

- <img src="/Image/Basics/EventLoop/5.png" style="zoom:50%;" align="left"/>

- <video src="/Image/Basics/EventLoop/7.mov" style="zoom:50%;" align="left"></video>

  注意：队列可增加渲染队列，当 Stack 不为空，则渲染队列会被阻塞；

  <img src="/Image/Basics/EventLoop/6.png" style="zoom:50%;" align="left"/>

- 注意：可利用 Error 对象，来打印整个栈树：

- <img src="/Image/Basics/EventLoop/7.png" style="zoom:50%;" align="left"/>



##### 1-3-2、分类

​	任务可分为同步异步任务(前者能立即执行)，亦可分为宏任务(macro-task)与微任务(micro-task)；(注意不同任务被派分的任务队列也不尽相同)，最终基本的执行顺序：script(宏任务) —> 微任务 —> 新的宏任务… —> 结束；

<img src="/Image/Basics/EventLoop/4.png" style="zoom:50%;" align="left"/>

- 宏任务—MacroTask：整体代码、setTimeout、setInterval、setImmediate、I/O、UI rendering 等；
- 微任务—MicroTask：process.nextTick、Promises.then-catch-finally、Object.observe、MutationObserver 等；
- 详看：https://juejin.im/post/59e85eebf265da430d571f89#heading-2

#### 1-4、EventLoop机制(Node)



### 二、答疑

### 三、示例A

#### 3-1、示例1

<img src="/Image/Basics/EventLoop/A-1.tiff" style="zoom:50%;" align="left"/>

解释：node环境：跑完微任务 跑所有宏任务 再次跑所有微任务

```javascript
// 1 7 6 8 2 4 9 11 3 10 5 12
```

解释：浏览器环境：需先用 Promise.resolve().then(()=>{ 替换 process.nextTick；

注意：process.nextTick 的概念和 then 不太一样，前者是加入到执行栈底部，故与其他表现并不一致；

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







### 四、示例集合B

