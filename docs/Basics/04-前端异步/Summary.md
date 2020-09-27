# 总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092815.png" style="zoom:60%;" />

## 1-1、异步编程发展历程简述

- 阶段一：回调函数
  - 问题1：缺乏顺序性：其导致调试困难，并与大脑线性思维方式不符；
  - 问题2：缺乏可信任性： 控制反转导致系列信任问题；
- 阶段二：Promise 基于 PromiseA+ 规范的实现
  - 解决：上述问题2，重掌代码执行主动权；
- 阶段三：Generator(生成器函数) 用同步方式来书写代码
  - 解决：上述问题1，但需手动调用 next 方法，将回调成功返回的数据送回 JS 主流程中；
- 阶段四：Async/Await (结合 Promise & Generator)，在 await 后面跟 Promise，自动等待 Promise 决议值
  - 解决：Generator需要手动控制next(...)执行的问题、真正实现了用同步的方式书写异步代码；




## 1-2、基本介绍

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092746.png" style="zoom:50%;" align="" />

回调函数
- 优点：解决同步问题；
- 缺点：地狱缺乏顺序性，调试困难，与大脑思维方式不符、函数间存在耦合性牵一发动全身(控制反转)、难以处理错误；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092747.png" style="zoom:50%;" align="" />

Promise
- 优点：解决回调地狱问题，可链式调用，自动执行，符合大脑线性思维模式；
- 缺点： 仍然没有摆脱回掉函数，虽改善了回掉地狱…
- 缺点：一旦新建即立即执行则无法停止、错误需通过回调函数来捕获、处于 pending 态时无法得知具体状态(刚开始/即将完成 )；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092748.png" style="zoom:50%;" align="" />

Generator
- 优点：执行可控；(利用协程完成 Generator 函数，用 co 库让代码依次执行完，同时以同步方式书写，也让异步操作按顺序执行)；
- 缺点：执行需手动触发、不够自动化；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092749.png" style="zoom:50%;" align="" />

Async/await
- 优点：代码结构清晰(无需 then 链)；以同步的方式来书写，且无需借助第三方库的支持；
- 缺点：将异步改为同步，多个无依赖的异步操作将导致性能降低；
- 缺点：由于 async 函数本身返回一个 promise，也很容易产生 async 嵌套地狱





## 1-3、异步发展

每个异步解决方案不是无中生有，都是为了解决问题的集合性方案：

**<u>1-3-1、阶段一：回调函数</u>**

问题：诸多问题：<u>缺乏顺序性</u>：其导致调试困难，并与大脑线性思维方式不符；<u>缺乏可信任性</u>： 控制反转导致系列信任问题；

其实：最直观问题是：回调结构问题(回调地狱)，多层嵌套、调试复杂，维护困难；

但是：最大的问题是：控制反转问题，异步事件完全由三方控制，不由主程控制，无法控制异步行为，异步回调或多次调用/不调用/调用报错；



**<u>1-3-2、阶段二：Promise 基于 PromiseA+ 规范的实现</u>**

解决：通过规范(PromiseA+规范)来约定异步行为，来<u>解决了可信任性问题</u>，重掌代码执行主动权；

其次，并通过链式调用，<u>一定程度上缓解顺序性问题</u> (注意：只是缓解，并无摆脱回调，直线递增式回调)；

规范：即约定异步行为的方式或表现规则，即 Promise 规范；**<u>*个人认为最重要的是下面 2点!!：*</u>**

- **<u>不变性：某个 Promise 必处于3态之1且不变(一旦决议，状态不再改变)</u>**：
  - pending(激发)、fulfilled(稳定)、rejected(稳定)—(状态机—单向改变)；
- **<u>可信任性：then 总能返回一个Promise</u>**；
  - 通过 Promise 抽象过程实现，将非标准的值规范为标准 Promise：类Promise接口、对象、函数或值；
- then 方法接收 2 个可选参数，分别对应状态改变时触发的回调；
- then 方法返回 promise；
- then 可被同一个 promise 调用多次；



**<u>1-3-3、阶段三：Generator(生成器函数) 用同步方式来书写代码</u>**

基本：Generator 使用 ES6 的两个新增协议：可迭代协议、迭代器协议(个人感觉只是利用了迭代器协议……)；

基本： Generator 是对 `协程` 的一种实现，虽语法简单，但引擎在背后做了大量工作；

**<u>原理：其利用了上述协议，实现 next ()，方法返回一个含有属性：done、value 的对象，并利用协程思想进行代码执行对象的切换和挂起；</u>**

- 可迭代协议，允许 Js 对象去定义或定制自身迭代行为；
  - 比如：定义在一个 for...of 结构中，什么值可被循环得到；
  - 注意：**<u>为变成可迭代对象，1个对象必须实现 @@iterator方法；即此对象须有一名为 [Symbol.iterator] 的属性，其值为返回一个对象(须符合迭代器协议)的无参函数 (或对象原型链 prototype chain上的某个对象含有)；而当一个对象需要被迭代的时候 (比如开始用于一个for...of循环中) ，其 @@iterator 方法被调用，且无参数，最后返回一个用于在迭代中获得值的迭代器</u>**；
  - 比如 Array、Map、Set、String、NodeList
- 迭代器协议：协议定义一种标准方式，来产生一个有限或无限序列的值；
  - 比如：当1个对象被认为是1个迭代器时，其实现了1个next 方法(无参函数)，方法是返回一对象，对象拥有2个属性；done & value；

解决：缺乏顺序性，执行可控；(用 co 库依次执行，同时以同步方式书写，也让异步操作按顺序执行)，将回调返回数据送回 JS 主流程中；

缺点：须手动调用 next 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092803.png" style="zoom:50%;" align="" />



**<u>1-3-4、阶段四：Async/Await (结合 Promise & Generator)，在 await 后面跟 Promise，自动等待 Promise 决议值</u>**

基本：利用 `协程` 和 `Promise ` 实现同步方式编写异步代码的效果；是一通过异步执行并隐式 **<u>返回 Promise 作为结果</u>** 的函数；

- 相比于 Promise 不断调用 then 方式，语义化明显、优雅流畅；
- 相比于 co + Generator 性能更高，标准化、无需引用三方库、自动调用；

解决：完全解决基于传统回调的异步流程存在的两个问题，自动调用，同步书写与执行(引擎支持)，逻辑清晰、可读提高；

缺点：错误处理过于安静，往往需要用 try-catch 来捕获；

注意：Await 能暂停异步方法(仅限 Promise 方法才有效果)的执行，等待 Promise 方法完成并返回其结果；







## 1-4、细说 Promise 

**<u>*Promise 本质上并没有完全摆脱回调；但就是这样比单纯使用回调更值得信任，因为它使用了 Promise.resolve，它总能返回一个 Promise!!，then 的内部实现就是调用了 Promise.resolve!!，所以可信任性就这么来的!!!，没有了控制反转，所以可控!!*</u>**；Promise.resolve  接收值对应返回内容：

- 传入真 Promise：返回传递过去的同一 Promise；图1；
- 传入非 Promise、非 thenable 立即值：返回一用此值填充的 Promise；图2；
- 传入非 Promise、真 thenable 立即值，Promise.resolve 会试图展开此值 ，展开过程会持续到取出一具体、非类 Promise 的、规范后的最终值：图3；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092755.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092756.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092757.png" style="zoom:50%;" align="" />

**<u>*所以不管传入什么值，均能返回规范化后的 Promise，由此解决了过往回调存在的诸多不可信问题：*</u>**

<u>不可信之—回调调用过早</u>：Promise 调用 then，即之前已经被 resolve，resolve 才会调用 then，此时 Promise 已决议，也总会在当前 Js 事件处理完后再调用提供给 then 的回调；**<u>也就是说调用的刚刚好</u>**

<u>不可信之—回调调用过晚：</u>：Promise 对象调用 resolve 或 reject 时，通过 then 注册的回调会在下一个异步时间点上被触发；而若多个通过 then 注册的回调，都会在下一个异步时间点上被依次调用，这些注册回调中的异步回调均无法影响或延误对其他 then 上回调的调用；**<u>内部原因是微任务实现；</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092753.png" style="zoom:50%;" align="" />

<u>不可信之—回调调用次数过多/少</u>：

- Promise 的定义方式使得它 **<u>只能被决议一次</u>**，且会默默忽略任何后续调用，因此任何通过 then 注册的回调就只会被调用一次；

<u>不可信之—回调无法成功接收所传参数</u>：

- resolve 或 reject，默认传值 undefined
- resolve 或 reject，中的值不管是什么，都会被传给所有注册在 then 中的回调函数
- resolve 或 reject，中传递多个参数时，第一个参数后的所有参数都会被忽略；故<u>多参数传递需通过对象传递；</u>

<u>不可信之—回调吞掉错误或异常</u>：**<u>通过 then 接收 2 个可选参数，分别对应状态改变时触发的回调</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092754.png" style="zoom:50%;" align="" />

**<u>补充：上面提到的作为微任务引入</u>**：Promise 中的执行函数是同步进行，但其中可能存在着异步操作，在异步操作结束后，会调用 resolve 方法或中途遇到错误调用 reject 方法，而两者均作为微任务进入到 EventLoop 中；其实就是如何处理回调的问题，总结起来有三种方式:

- 使用同步回调，直到异步任务进行完，再进行后面的任务；
  - 同步问题明显，阻塞整个脚本；
- 使用异步回调，将回调函数放在进行 **<u>宏任务队列的队尾</u>**；
  - 若宏任务队列非常长，那么回调迟迟得不到执行，造成应用卡顿；
- 使用异步回调，将回调函数放到  **<u>当前宏任务中的最后面</u>**；
  - 为解决上述方案问题，Promise 采取第三种方式， 即作为微任务引入：把 resolve(reject) 回调的执行放在当前宏任务的末尾；
  - 采用**异步回调**替代同步回调解决了浪费 CPU 性能的问题；
  - 放到**当前宏任务最后**执行，解决了回调执行的实时性问题；





### 1-4-1、Promise 手写

**<u>简单版本：</u>**

猜测实现：new Promise((resolve, reject) => { ... }) 立马执行，且只有调用 resolve 或 reject 才会执行 then 的参数函数方法，then 接收2个参数函数；

实现思路：resolve reject 起调用 then 参数函数方法的作用；在 new Promise 就要将其传入首个函数；then 控制将参数函数塞入(用队列实现吧)；

实现如下：new Promise 时传入 resolve reject 方便传入函数使用，then 则添加方法，等下一次 resolve 时执行队列方法； 

- 1、构建成功&失败回调队列；
- 2、resolve&reject 方法作用是只要队列不为空，则取出并执行(只要调用就执行)
- 3、then 方法是接收 resolveFn&rejectFn并推入队列；
- 4、excutor 即传入的第一个方法，立即调用，传入 resolve&reject

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913184724.png" alt="截屏2020-09-13 下午6.47.19" style="zoom:67%;" align=""/>

**<u>高级版本</u>**：

- 核心1：Promise 本质是状态机，且状态只能为以下三种：Pending-等待态、Fulfilled-执行态、Rejected-拒绝态，状态变更单向；
- 核心2：then 接收 2 个可选参数，分别对应状态改变时触发的回调，then 返回 promise，then 可被同一个 promise 调用多次；

基本实现1——状态机

猜测实现：只有 resolve 或 reject 才改变状态，所以应该有最初状态，且改变状态的逻辑在 resolve 或 reject

实现如下：设置常量，与Promise 初始状态，只有通过 resolve reject 才可改变

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913194556.png" alt="截屏2020-09-13 下午7.45.47" style="zoom:55%;" align=""/>

基本实现2——链式调用

猜测实现：then 总是返回 Promise 实例，或者说将 then 返回的内容包装成 Promise、而系列 then 的回调要等上一个 resolve 或 reject 才会执行；

实现思路：过去是不管三七二十一就将 resolveFn 推入队列中，现在先将它用 Promise 包裹，才塞入队列中；内部执行时，判断其执行返回值

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913200616.png" alt="截屏2020-09-13 下午8.06.10" style="zoom:50%;" align=""/>

**<u>*then 收集方法到队列，在 new Promise 执行 resolve 或 reject 时，才执行队列方法；上面只将方法直接填充队列，这里先将方法用新的 Promise 包裹并返回，从而实现了链式调用，但注意此时返回的 Promise 已经不同于首个 Promise!!!，而是新的 Promise；随后在新 Promise 内部，将包裹了的 resolveFn 塞入旧 Promise 队列，当旧 Promise 内部调用 resolve，就会调用队列中的所有方法，调用 fulfilledFn，然后计算 resolveFn 返回值，判断是否为 Promise，是则等待变更，否则直接调用新 Promise 的 resolve，传值并触发下一个 then，循环往复；*</u>**

基本实现3——值穿透&状态变更

猜测实现：

- 值穿透：即若 then 接收的参数类型不是 function 则应当忽略，让链式调用继续往下执行；

- 处理状态为 resolve/reject 的情况：一般情况下 then 对应状态 pending，但特殊情况比如 Promise.resolve()/reject().then() 则此时状态为 resolve/reject，此时若还按照 pending 态时的做法：将 then 中回调 push 进 resolve/reject 队列中的话，回调将不会正确执行，故需对上述特殊情况进行处理，即对 fulfilled 状态和 rejected 情况进行处理：直接执行回调；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092800.png" style="zoom:50%;" align="" />

基本实现4——实现同步任务的兼容

目前 Promise 执行顺序是 new Promise -> then()收集回调 -> resolve/reject执行回调，但前提是异步任务；

若为同步则会变为：new Promise -> resolve/reject执行回调 -> then() 收集回调，解决方式是为同步任务包裹 setTimeout 强行变为异步任务

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913204402.png" alt="截屏2020-09-13 下午8.43.58" style="zoom:67%;" align=""/>

基本实现5——在前面基础上，实现静态方法

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913204740.png" alt="截屏2020-09-13 下午8.47.36" style="zoom:55%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913204809.png" alt="截屏2020-09-13 下午8.48.02" style="zoom:50%;" />



### 1-4-2、Promise 实现思路

**<u>resolve 负责接收传入的 value、状态改变、执行 then 存入的系列回调—callback(value)；</u>**

- 首先，在异步事件调用 resolve(value) 时接收值；
- 随后进行状态检查，每个 Promise 只能进行一次的状态变更；
- 随后，执行由 then 存入的回调—callback(value)；
- 注意：目前 Promise 执行顺序是 new Promise -> then()收集回调 -> resolve/reject执行回调，但前提是异步任务；若为同步则会变为：new Promise -> resolve/reject执行回调 -> then() 收集回调，解决方式是为同步任务包裹 setTimeout 强行变为异步任务；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092801.png" style="zoom:40%;" align="" />

**<u>then 负责接收异步后的回调操作cb，存放到执行 then 的上一级 Promise 的队列中，但为了实现链式调用，需要进行包裹；</u>**

- 所以，then 必定返回一个新的 Promise 实例，以实现链式调用；
- 并且，包装异步后的回调操作cb，目的是让 resolve 触发执行队列cb时，先对cb返回值进行判断；
- 你品，你细品，如果执行完后，返回值为普通值，则调用 resolve，执行当前新的 Promise 的 then 存放的回调；
- **<u>就是，执行一开始，就将所有 then 中回调加入，只是所加入的 Promise 不同，一个 Promise 只负责一个 then 的回调，而 then 会返回下一个新的 Promise，新的 Promise 负责下一个 then 的回调存储和执行；当首个 Promise resolve 则执行 then 回调，执行完后(先有判断)通过变量搜索获取新的 Promise 的 resolve 并调用，调用新 Promise 的 then 存放的回调，如此实现链式调用；其中提到的判断是指若 then 异步回调返回 new Promise，会在此处检测到并进入此链式流程中，相当于从中插入了一条新 Promise 处理线路；</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200914091606.png" alt="截屏2020-09-14 上午9.16.02" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092753.png" style="zoom:50%;" align="" />

- 注意 then 接收的必须是 function，否则发生值穿透，其实就是直接返回，让新的 Promise resolve，执行下一个 then

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092800.png" style="zoom:50%;" align="" />

- 其他方法的实现：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913204740.png" alt="" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913204809.png" alt="" style="zoom:62%;" align=""/>



### 1-4-3、Promise 使用注意

then 及 catch 方法：

- Promise 状态一经改变就不能再改变：
  - 因 resolve、reject；
- .then 和 .catch 都会返回一个新的 Promise；
  - catch 即 this.then(undefined, rejectFun)
- .catch 不管被连接到哪里，都**<u>能捕获上层未捕捉过的错误</u>**；
- Promise 中，返回任意一个非 promise 的值都会被包裹成 promise 对象，比如 return 2 会被包装为 return Promise.resolve(2)；
- Promise 的 .then 或  .catch 可以被调用多次，但若 Promise 内部的状态一经改变，并且有了一个值，则后续每次调用.then或 .catch 时都会直接拿到该值；
- .then 或 .catch 中 return 一个 error 对象并不会抛出错误，所以不会被后续的 .catch 捕获；
- .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环；
- .then 或 .catch 的参数期望是函数，传入非函数则会发生值透传；
- .then 方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，某些时候可认为 catch 是 .then 第二个参数的简便写法；



finally 方法：

- .finally 方法不管 Promise 对象最后的状态如何都会执行
- .finally 方法的回调函数不接受任何参数，即在此函数中无法知道 Promise 最终状态是 resolved 还是 rejected
- .finally 最终返回的默认会是一个<u>**上一次的Promise对象值**</u>，不过若抛出的是一个异常则返回异常的Promise对象；
- .finally 方法也是返回一个 Promise，在 Promise 结束时，无论结果为 resolved 还是 rejected，都会执行里面的回调函数；



all 及 race 方法：

- Promise.all：作用是接收一组异步任务，然后<u>**并行执行异步任务**</u>，且在所有异步操作执行完后才执行回调；
- .race：作用同接收异步，然后**<u>并行执行异步任务</u>**，只保留取第一个执行完成的异步操作结果，其他方法仍在执行，但结果会被抛弃；
- Promise.all.then() 结果中数组的顺序和 Promise.all 接收到的数组顺序一致；
- all 和 race 传入的数组中若有会抛出异常的异步任务，则只有最先抛出的错误会被捕获，并且是被 then 的第二个参数或者后面的catch捕获；但并不会影响数组中其它的异步任务的执行；



### 1-4-4、使用示例

#### 1-4-4-1、基本

```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
})
console.log('1', promise1);
// 'promise1'
// '1' Promise{<pending>}
// 1、new Promise 执行、执行同步代码 1，此时 promise1 没有被 resolve 或者 reject，因此状态还是 pending


// Ex2
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
// 1 2 4 3
// 1、new Promise 执行
// 2、resolve('success')， 更改 promise 状态为 resolved 并将值保存
// 3、执行同步代码2
// 4、跳出 promise，往下执行，碰到 promise.then 微任务，将其加入微任务队列
// 5、执行同步代码 4
// 6、本轮宏任务全部执行完毕，检查微任务队列，发现 promise.then 这个微任务且状态为 resolved，执行它。



// Ex3
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
// 1 2 4
// 1、在 promise 中并没有 resolve 或 reject 因此 promise.then 并不会执行，它只有在被改变了状态之后才会执行



// Ex4
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);
// 'promise1'
// '1' Promise{<resolved>: 'resolve1'}
// '2' Promise{<pending>}
// 'resolve1'

// 1、new Promise，执行
// 2、resolve 状态改变为 resolved, 并将结果保存下来
// 3、promise1.then 微任务，将它放入微任务队列
// 4、promise2 是一个新的状态为 pending 的Promise
// 5、执行同步代码1，同时打印出 promise1 状态 resolved
// 6、执行同步代码2，同时打印出 promise2 状态 pending
// 7、宏任务执行完毕，查找微任务队列，发现 promise1.then 且状态为 resolved，执行它


// Ex5
const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')
// 1
// 'start'
// 'success'


// Ex6
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then(res => {
  console.log(res);
});
// 'start'
// 1
// 'success'
```



#### 1-4-4-2、基本 + setTimeout

```js
console.log('start')
setTimeout(() => {
  console.log('time')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')
// 'start'
// 'end'
// 'resolve'
// 'time'

// 1、同步代码直接压入执行栈进行执行
// 2、setTimout 作为一个宏任务被放入下一个宏任务队列
// 3、Promise.then 作为一个微任务被放入微任务队列
// 4、本次宏任务执行完，检查微任务，发现 Promise.then，执行
// 5、进入下一个宏任务，发现 setTimeout，执行


// Ex2
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
// 1 2 4 timeStart timerEnd success

// 1、new Promise，执行
// 2、定时器，存入下一个宏任务的延迟队列中等待执行
// 3、执行同步代码2
// 4、跳出 promise 函数，遇到 promise.then，但其状态还是为 pending，理解为先不执行
// 5、执行同步代码4
// 6、一轮循环过后，进入二次宏任务，发现延迟队列中有 setTimeout 定时器，执行它
// 7、resolve，将 promise 状态改为 resolved 且保存结果，并将之前的 promise.then 推入微任务队列(???这里才加入么???)
// 8、继续执行同步代码 timerEnd
// 9、宏任务全部执行完毕，查找微任务队列，发现 promise.then 微任务，执行它

// Ex3-1
setTimeout(() => {
  console.log('timer1');
  setTimeout(() => {
    console.log('timer3')
  }, 0)
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
// start timer1 timer2 timer3

// Ex3-2
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
// start timer1 timer2 promise

// Ex3-3
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
// start promise1 timer1 promise2 timer2



// Ex4
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)
// 'promise1' Promise{<pending>}
// 'promise2' Promise{<pending>}
// test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
// 'promise1' Promise{<resolved>: "success"}
// 'promise2' Promise{<rejected>: Error: error!!!}



// Ex5 - 注意 resolve/reject 后才会执行 then
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1 ok");
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
// promise1 ok
// 'promise1' Promise{<pending>}
// 'promise2' Promise{<pending>}
// timer1
// test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
// timer2
// 'promise1' Promise{<resolved>: "success"}
// 'promise2' Promise{<rejected>: Error: error!!!}
```

#### 1-4-4-3、基本 + then/catch/finally

1. `Promise` 状态一经改变就不能再改变；
   1. `Promise` 的 `.then` 或 `.catch` 可被调用多次, 当若 `Promise `内部状态一经改变，且有一个值，则后续每次调用 `.then` 或 `.catch` 时都会直接拿到该值；
2. `.then` 和 `.catch` 都会返回一新 `Promise`
   1. `Promise`  中，返回任意一个非 `promise`  值都会被包裹成 `promise` 对象，比如 `return 2`  会被包装为 `return Promise.resolve(2)`；
   2. `.then` 或 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，故不会被后续的 `.catch` 捕获；
   3. `.then` 或 `.catch` 返回值不能是 promise 本身，否则会造成死循环；
   4. `.then` 或 `.catch` 参数期望是函数，传入非函数则会发生值透传；
3. `catch ` 不管被连接到哪里，都能捕获上层的错误；
4. `.then` 能接收两个参数，第一个是处理成功的函数，第二个是处理失败的函数，某些时候可认为 `catch` 是 `.then` 第二个参数的简便写法；
5. `.finally` 返回一个 `Promise`，在  `Promise` 结束时，无论结果为  `resolved` 还是  `rejected`(无论状态如何均为执行)，都会执行里面的回调函数；也正因如此，finally 回调函数不接受任何的参数，即在 `.finally()` 函数中无法知道 `Promise` 最终状态；其最终返回的默认会是一个<u>上一次的 Promise 对象值</u>，不过如果抛出的是一个异常则返回异常的`Promise`对象；
6. `.finally` 报错方式有二且各自归属不同方法，`return new Error` 归属 then，throw new Error 归属 catch，两者同时存在时，后者覆盖前者;
7. `.finally` 行为与 `.then` 一致，只是执行行为存在不同 (本质上是 then 方法的特例)；

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
```

```js
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});
promise
.then(res => {
	console.log("then: ", res);
}).catch(err => {
	console.log("catch: ", err);
})
// "then: success1"


// Ex2 - catch() 也会返回一个 Promise，且由于这个 Promise 没有返回值，所以打印出来的是 undefined
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise.then(res => {
  console.log("then1: ", res);
}).then(res => {
  console.log("then2: ", res);
}).catch(err => {
  console.log("catch: ", err);
}).then(res => {
  console.log("then3: ", res);
})
// "catch: " "error"
// "then3: " undefined



// Ex3 - return 2 会被包装成 resolve(2)
Promise.resolve(1).then(res => {
  console.log(res);
  return 2;
})
  .catch(err => {
  return 3;
})
  .then(res => {
  console.log(res);
});
// 1 2

// Ex3-1
Promise.reject(1)
  .then(res => {
  console.log(res);
  return 2;
})
  .catch(err => {
  console.log(err);
  return 3
})
  .then(res => {
  console.log(res);
});
// 1 3



// Ex4 - .then 或者 .catch 可以被调用多次，但 Promise 构造函数只执行一次
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('timer')
    resolve('success')
  }, 1000)
})
const start = Date.now();
promise.then(res => {
  console.log(res, Date.now() - start)
})
promise.then(res => {
  console.log(res, Date.now() - start)
})
// 'timer'
// success 1001
// success 100x/1001 - 前提 - 足够快




// Ex5 - 非 promise 的值都会被包裹成 promise 对象
// 因此 return new Error('error!!!') 也被包裹成了 return Promise.resolve(new Error('error!!!'))
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
// "then: " "Error: error!!!"
// 注意：若想抛出错误请:
// return Promise.reject(new Error('error!!!'));
// or
// throw new Error('error!!!')



// Ex7 - .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>



// Ex8 - .then 或者 .catch 的参数期望是函数，传入非函数则会发生值透传
// 一个是数字类型，一个是对象类型，因此发生了透传，将resolve(1) 的值直接传到最后一个then里
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
// 1



// Ex9
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)
  })
// 'error' 'error!!!' 
// 如果去掉第二函数，则进入 catch: 'catch' 'error!!!'

// Ex9-1
Promise.resolve()
  .then(function success (res) {
    throw new Error('error!!!')
  }, function fail1 (err) {
    console.log('fail1', err)
  }).catch(function fail2 (err) {
    console.log('fail2', err)
  })
// fail2 Error: error!!!    at success (<anonymous>:3:11)




// Ex10
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })



// Ex11 - return 的报错方式会被 then 捕获
Promise.resolve('1')
  .finally(() => {
    console.log('finally2')
    return new Error('finally return error')
  })
  .then(res => {
    console.log('then catch: ', res)
  })
  .catch(err => {
    console.log('catch catch: ', err)
  })
// finally2
// then catch 1

// Ex11 - 1 - throw 报错方式会被 catch 捕获
Promise.resolve('1')
  .finally(() => {
    console.log('finally1')
    throw new Error('finally throw error')
  })
  .then(res => {
    console.log('then catch: ', res)
  })
  .catch(err => {
    console.log('catch catch: ', err)
  })
// finally1
// catch catch Error finally throw error


// Ex11 - 2 - 两种报错方式同在则还是会被 catch 捕获
Promise.resolve('1')
  .finally(() => {
    console.log('finally1')
    throw new Error('finally throw error')
  })
  .finally(() => {
    console.log('finally2')
    return new Error('finally return error')
  })
  .then(res => {
    console.log('then catch: ', res)
  })
  .catch(err => {
    console.log('catch catch: ', err)
  })
// finally1
// finally2
// catch catch Error finally throw error

// Ex11 - 2 - 两种报错方式同在则还是会被 catch 捕获，不管顺序
Promise.resolve('1')
  .finally(() => {
    console.log('finally2')
    return new Error('finally return error')
  })
  .finally(() => {
    console.log('finally1')
    throw new Error('finally throw error')
  })
  .then(res => {
    console.log('then catch: ', res)
  })
  .catch(err => {
    console.log('catch catch: ', err)
  })
// finally2
// finally1
// catch catch Error finally throw error



// Ex12
// 1、最终返回的默认会是一个上一次的 Promise 对象值，不过如果抛出的是一个异常则返回异常的 Promise 对象
// 2、.finally() 方法不管 Promise 对象最后的状态如何都会执行
// 3、.finally() 方法的回调函数不接受任何的参数，也即在 .finally() 函数中无法得知 Promise 最终状态
// 4、关于 finally2 为何先执行，看 Ex13 系列, 实际上是关于微任务的添加顺序，
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return 'finally2 return'
  })
  .then(res => {
    console.log('finally2 then', res)
  }
// '1'
// 'finally2'
// 'finally'
// 'finally2 then' '2'
        
        
// Ex13 - 1
function promise1 () {
  return new Promise((resolve) => {
    resolve('p1')
  })
}
function promise2 () {
  return new Promise((resolve, reject) => {
   	resolve('p2')
  })
}
promise1()
  .then(res => console.log(res + ' p1t1'))
  .then(res => console.log(res + ' p1t2'))
  .catch(err => console.log(err + ' p1e1'))
  .finally(() => console.log('finally1'))
  .then(res => console.log(res + ' p1t3'))
promise2()
  .then(res => console.log(res + ' p2t1'))
  .then(res => console.log(res + ' p2t2'))
  .catch(err => console.log(err + ' p2e1'))
  .finally(() => console.log('finally2'))
  .then(res => console.log(res + ' p2t3'))
// p1 p1t1
// p2 p2t1
// undefined p1t2
// undefined p2t2
// finally1
// finally2
// undefined p1t3
// undefined p2t3
```



#### 1-4-4-4、基本 + all/race

- `Promise.all()`的作用是接收一组异步任务，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调；
- `.race()` 作用是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，其他方法仍在执行，不过执行结果会被抛弃；
- `Promise.all().then()` 结果中数组的顺序和 `Promise.all()` 接收到的数组顺序一致；

```js
// all
// 立即执行
const p1 = new Promise(r => console.log('立即打印'))

// 函数包裹控制执行
var runP1 = () => new Promise(r => console.log('立即打印')
runP1()

// all 并发执行，全部执行完毕才返回
var runAsync = (x) => new Promise(r => setTimeout(() => r(x, console.log(x)), 1000 * x));
Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then(res => console.log(res))

// all .catch 会捕获最先的那个异常 - 懵逼 - all/race 用法
var runReject = (x) => new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x));
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))
// 1 3 2s后输出: 2Error: 2  4s后输出: 4





// race
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log('result: ', res))
  .catch(err => console.log(err))
// 1 
// 'result: ' 
// 1 
// 2 
// 3
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log("result: ", res))
  .catch(err => console.log(err));
// 0 'Error: 0'
// 1
// 2
// 3
```







## 1-5、细说 Generator

其实也不算细说，大致了解即可；

**<u>Generator—生成器</u>** 是一个带 <u>星号</u> 的 "函数"(注意：并非真正函数)，可通过  `yield` 关键字  <u>暂停执行</u> 和 <u>恢复执行</u>；执行关键点:

- 调用 gen() 后，程序会阻塞住，不会执行任何语句；调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停；
- next 方法 <u>返回有两个属性 value 和 done 的对象</u>：
  - 前者为当前 yield 后面的结果；
  - 后者表示是否执行完，遇到 return 后，done 会由 false 变为 true；

```js
function* gen() {
  console.log("gen enter");
  let a = yield 1;
  let b = yield (function () {return 2})();
  return 3;
}
// 生成迭代器实例
// 阻塞住，不会执行任何语句
var g = gen() 

console.log(typeof g)  
// object 注意不是 "function"
// gen enter
console.log(g.next())  
// { value: 1, done: false }
console.log(g.next())  
// { value: 2, done: false }
console.log(g.next())  
// { value: 3, done: true }
console.log(g.next()) 
// { value: undefined, done: true }
```

**<u>协程</u>**：是一种比线程更加轻量级的存在，协程处在线程的环境中，<u>一个线程可存在多个协程</u>，可将协程理解为线程中的一个个任务；不像进程和线程，<u>协程并不受操作系统的管理，而是被具体的应用程序代码所控制</u>；

- 注意：JS 是单线程执行，**<u>多协程无法同时执行，一个线程一次只能执行一个协程</u>**；
- 比如：当前执行 A 协程，另外尚有 B 协程，若想执行 B 任务，则须在 A 协程中，<u>将 JS 线程控制权转交给 B协程</u>，而在 B 执行时，A 就会处于暂停状态；

```js
function* A() {
  console.log("我是A");
  yield B(); // A停住，在这里转交线程执行权给B
  console.log("结束了");
}
function B() {
  console.log("我是B");
  return 100;// 返回，并且将线程执行权还给A
}
let gen = A();
gen.next();
gen.next();

// 我是A
// 我是B
// 结束了

// A 将执行权交给 B，也就是 A 启动 B，我们也称 A 是 B 的父协程。因此 B 当中最后return 100其实是将 100 传给了父协程。
// 注意：对于协程来说，其并不受操作系统控制，完全由用户自定义切换，因此并没有进程/线程上下文切换的开销，此乃高性能的重要原因

// 示例
// 生成器调用另生成器
function* gen1() {
    yield 1;
    yield 4;
}
function* gen2() {
    yield 2;
    yield 3;
}

// 输出 1 2 3 4
function* gen1() {
    yield 1;
    yield* gen2();
    yield 4;
}
```









## 1-6、细说 Async/Await

Async/Await 利用 `协程` 和 `Promise ` 实现同步方式编写异步代码的效果，其中 `Generator` 是对 `协程` 的一种实现，虽然语法简单，但引擎在背后做了大量的工作，用 `async/await` 写出的代码也更加优雅、美观；

- 相比于之前的 `Promise` 不断调用then的方式，语义化更加明显；

- 相比于 `co + Generator` 性能更高，上手成本也更低；

```js
async function func() {
  return 100;
}
console.log(func());
// Promise {<resolved>: 100}
```

```js
async function test() {
  console.log(100)
  let x = await 200
  // let promise = new Promise((resolve,reject) => {
  //	resolve(200);
  //  // 调用 resolve, 进入微任务队列
  //	// JS 引擎将暂停当前协程的运行，把线程的执行权交给父协程
  // })
  // 回到父协程中，父协程的第一件事情就是对 await 返回的 Promise 调用 then, 来监听这个 Promise 的状态改变
  // promise.then(value => {
  //  // 相关逻辑，在resolve 执行之后来调用
  //  // 1. 将线程的执行权交给test协程
  //  // 2. 把 value 值传递给 test 协程
	// })
  console.log(x)
  console.log(200)
}
// 首先, 代码同步执行，打印出 0，然后将 test 压入执行栈, 打印 100
console.log(0)
// 然后，遇到 await，被 JS 引擎转换成一个 Promise
test()
// 然后往下执行，打印出300。
// 根据 EvLoop 机制，当前主线程的宏任务完成，现在检查微任务队列, 发现还有一个Promise的 resolve，执行，现在父协程在then中传入的回调执
console.log(300)

// 0 100 300 200 200
```

Promise 一旦新建即立即执行则无法停止，错误需通过回调函数来捕获，而 async/await 可进行更细粒度的操作；

而 async/await 实际上是对 Generator(生成器) 的封装，是一个语法糖，为何前者盛行是因为后者刚出现不久就被前者取代；

```js
// Promise 立即执行则无法停止
Promise.resolve(a).then(b => {}).then(c => {})
// Async/await
async function test() { 
	const a = await Promise.resolve(a);
  // do something else ..
  const b = await Promise.resolve(b);
  // do something else ..
  const c = await Promise.resolve(c);
  // do something else ..
}

// testGenerator1
function* testG1() {
  yield 'hello'
  yield 'guys'
  return '!'
}

const gen1 = testG1();
console.log(gen1.next()); // {value: "hello", done: false}
console.log(gen1.next()); // {value: "guys", done: false}
console.log(gen1.next()); // {value: "!", done: true}

// testGenerator2
function* testG2() {
  console.log(yield 'hello');
  console.log(yield 'guys');
  return '!'
}

const gen2 = testG2();
gen2.next();
// value: "hello", done: false}
gen2.next('anybody');
// anybody
// {value: "guys", done: false}
gen2.next('here');
// here
// {value: "!", done: true}
gen2.next('!!!');
// {value: undefined, done: true}
```



### 1-6-1、Async 实现

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200914113810.png" alt="截屏2020-09-14 上午11.38.05" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200914113830.png" alt="截屏2020-09-14 上午11.38.20" style="zoom:50%;" align=""/>



### 1-6-2、使用示例

```js
// Ex1 - 可理解为 await 后面的内容就相当于放到了 Promise.then 中
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log('start')
// 'async1 start'
// 'async2'
// 'start'
// 'async1 end'


// Ex2
async function async1() {
  console.log("async1 start");
  new Promise(resolve => {
    console.log('promise')
  })
  console.log("async1 end");
}
async1();
console.log("start")
// 'async start'
// 'promise'
// 'async1 end'
// 'start'


// Ex3
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  setTimeout(() => {
    console.log('timer')
  }, 0)
  console.log("async2");
}
async1();
console.log("start")
// 'async1 start'
// 'async2'
// 'start'
// 'async1 end'
// 'timer'




// Ex4
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  setTimeout(() => {
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")
// 'async1 start'
// 'async2'
// 'start'
// 'async1 end'
// 'timer2'
// 'timer3'
// 'timer1'



// Ex5 - async 中的 await 命令是一个 Promise 对象，返回该对象的结果,
// 但若非 Promise 对象，就会直接返回对应的值，相当于 Promise.resolve()
async function fn () {
  // return await 1234
  // 等同于
  return 123
}
fn().then(res => console.log(res))



// Ex6 - async1 中 await 后面的 Promise 是没有返回值的，也就是它的状态始终是 pending 状态，因此相当于一直在 await
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
// 'script start'
// 'async1 start'
// 'promise1'
// 'script end'

// Ex6-1 - 有了返回值，await 后面的内容将会被执行
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise1 resolve')
  }).then(res => console.log(res))
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
// 'script start'
// 'async1 start'
// 'promise1'
// 'script end'
// 'promise1 resolve'
// 'async1 success'
// 'async1 end'



// Ex7
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise resolve')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => {
  console.log(res)
})
new Promise(resolve => {
  console.log('promise2')
  setTimeout(() => {
    console.log('timer')
  })
})
// 'script start'
// 'async1 start'
// 'promise1'
// 'promise2'
// 'async1 success'
// 'sync1 end'
// 'timer'



// EX8
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function() {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')
// ss async1-start async2 promise1 se async-end promise2 se




// Ex9
async function testSometing() {
  console.log("执行testSometing");
  return "testSometing";
}

async function testAsync() {
  console.log("执行testAsync");
  return Promise.resolve("hello async");
}

async function test() {
  console.log("test start...");
  const v1 = await testSometing();
  console.log(v1);
  const v2 = await testAsync();
  console.log(v2);
  console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
  console.log("promise start...");
  resolve("promise");
});
promise.then(val => console.log(val));

console.log("test end...");
// 'test start...'
// '执行testSometing'
// 'promise start...'
// 'test end...'
// 'testSometing'
// '执行testAsync'
// 'promise'
// 'hello async'
// 'testSometing' 'hello async'





// Ex10 - 若在 async 函数中抛出了错误，则终止错误结果，不会继续向下执行
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))
// 'async2'
// Uncaught (in promise) error


// Ex10 - 1 - 改为 throw new Error 也是一样
async function async1 () {
  console.log('async1');
  throw new Error('error!!!')
  return 'async1 success'
}
async1().then(res => console.log(res))
// 'async1'
// Uncaught (in promise) Error: error!!!



// Ex11 - 针对上述问题，可用 try-catch 不影响后续执行
async function async1 () {
  try {
    await Promise.reject('error!!!')
  } catch(e) {
    console.log(e)
  }
  console.log('async1');
  return Promise.resolve('async1 success')
}
async1().then(res => console.log(res))
console.log('script start')
// 'script start'
// 'error!!!'
// 'async1'
// 'async1 success'

// 或直接在 Promise.reject 后面跟着一个 catch() 方法
async function async1 () {
  // try {
  //   await Promise.reject('error!!!')
  // } catch(e) {
  //   console.log(e)
  // }
  await Promise.reject('error!!!')
    .catch(e => console.log(e))
  console.log('async1');
  return Promise.resolve('async1 success')
}
async1().then(res => console.log(res))
console.log('script start')
// 'script start'
// 'error!!!'
// 'async1'
// 'async1 success'
```





## 1-7、综合示例

### 1-7-1、综合题

```js
// Ex1
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(5);
            resolve(6);
            console.log(p)
        }, 0)
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);
    });
}));
first().then((arg) => {
    console.log(arg);
});
console.log(4);
// 3 7 4 1 2 5 Promise{<resolved>: 1}



// Ex2
// async 函数中 await 的 new Promise 要是没有返回值的话则不执行后面的内容
// .then 函数中的参数期待的是函数，如果不是函数的话会发生透传
// 注意定时器的延迟时间
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)
// 'script start'
// 'async1'
// 'promise1'
// 'script end'
// 1
// 'timer2'
// 'timer1'




// Ex3
// Promise 状态一旦改变就无法改变
// finally 不管 Promise的状态是 resolved 还是 rejected 都会执行，且它的回调函数是接收不到 Promise 结果，所以 finally() 中的 res 是一个迷惑项
// 最后一个定时器打印出的 p1 其实是 .finally 返回值，.finally 返回值如果在没有抛出错误的情况下默认会是上一个 Promise 返回值, 而这道题中 .finally 上一个 Promise 是 .then()，但这个 .then() 并无返回值，故 p1 打印出来的 Promise 值是 undefined，若在定时器的下面加上一个 return 1，则值就会变成1
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)
  setTimeout(() => {
    console.log(p1)
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})
// 'resolve1'
// 'finally' undefined
// 'timer1'
// Promise{<resolved>: undefined}
```



### 1-7-2、红绿灯闪烁

红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯

```js
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
const light = function (timer, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb()
      resolve()
    }, timer)
  })
}
const step = function () {
  Promise.resolve().then(() => {
    return light(3000, red)
  }).then(() => {
    return light(2000, green)
  }).then(() => {
    return light(1000, yellow)
  }).then(() => {
    return step()
  })
}

step();
```



### 1-7-3、mergePromise 实现

实现 mergePromise 函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组 data 中

```js
// 将零碎合整，化为链式调用
const time = (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
const ajax1 = () => time(2000).then(() => {
  console.log(1);
  return 1
})
const ajax2 = () => time(1000).then(() => {
  console.log(2);
  return 2
})
const ajax3 = () => time(1000).then(() => {
  console.log(3);
  return 3
})

function mergePromise (ajaxArray) {
  // 存放每个ajax的结果
  const data = [];
  let promise = Promise.resolve();
  ajaxArray.forEach(ajax => {
  	// 第一次的then为了用来调用ajax
  	// 第二次的then是为了获取ajax的结果
    promise = promise.then(ajax).then(res => {
      data.push(res);
      return data; // 把每次的结果返回
    })
  })
  // 最后得到的promise它的值就是data
  return promise;
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]
```







## 1-8、请求库

### 1-8-1、Ajax

**<u>*Ajax—Asynchronous JS And XML*</u>** (异步的 JS 和 XML)

Ajax 是一种用于创建快速动态网页的技术；通过在后台与服务器进行少量数据交换，Ajax 可使网页实现异步更新；其最大特点也即实现局部刷新；

- 核心：**<u>*XMLHttpRequest*</u>** 对象 (老版本是ActiveXObject)，其并非单一技术实现，而是有机利用一系列交互式网页应用相关的技术所形成的结合体；

- 前身：过去使用 JS 向服务器发出 [HTTP](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen%2FHTTP) 请求，故需要负责此功能的类实例，此亦 <u>**XMLHttpRequest**</u> 的由来，此类最初是在 IE 中作为一个名为 **<u>XMLHTTP</u>** 的**<u>ActiveX</u>** 对象引入；然后，Mozilla、Safari、其他浏览器，实现一个 **<u>XMLHttpRequest</u>** 类，支持 Microsoft 的原始 <u>**ActiveX**</u> 对象的方法和属性，同时微软也实现了 **<u>XMLHttpRequest</u>**；浏览器实现对象：XMLHttpRequest、IE7-ActiveXObject；
- 注意：虽名称包含 XML，但实际上数据格式可由 [JSON](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FJSON) 代替，以进一步减少数据量，形成所谓的 Ajaj；

Ajax 优点：

- 无刷新更新数据，用户体验好；
- 异步通信，更加快的响应能力；
- 基于标准化的并被广泛支持的技术，无需下载插件或小程序；
- 减少冗余请求，减少了带宽占用，减轻了服务器负担、场地租用成本；
- 数据与呈现分离，有利于分工合作、减少非技术人员对页面的修改造成的 WEB 应用程序错误、提高效率；

Ajax 缺点：

- 不支持浏览器回退功能和加入收藏书签功能，即破坏了浏览器后退机制；
  - 现象：在动态更新页面情况下，用户无法回到上一页面状态；
  - 解决：
    - [HTML5](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FHTML5)  前可使用 [URL](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FURL) 片断标识符 ([锚点](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%E9%94%9A%E7%82%B9)，即URL中#后面的部分)来保持追踪，允许用户回到指定的某个应用程序状态；
    - [HTML5](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FHTML5)  后可直接操作浏览历史，并以字符串形式存储网页状态，将网页加入网页收藏夹或书签时状态会被隐形地保留；
- 存在一定的安全问题，因其暴露了与服务器交互的细节；容易受攻击：跨站点脚步攻击、SQL注入攻击和基于Credentials的安全漏洞等；
- 对搜索引擎的支持比较弱；
- 无法用URL直接访问，不易调试；



### 1-8-2、Fetch

可理解为 Ajax 的 Promise 化，在 Ajax 基础上增加更多扩展，比如 CORS、HTTP、流程化等；

问题：因 fetch 为底层 API，故没有太多封装

- 需要自己判断返回值类型，并执行响应获取返回值的方法；

- 获取返回值方法只能调用一次，不能多次调用；

- 老版浏览器不会默认携带 cookie；

- 不能直接传递 JS 对象作为参数；

- 无法正常的捕获异常；

- 不支持超时控制；

- 不支持 jsonp；



### 1-8-3、Axios

基本：Axios 也是对原生 XHR 的封装，是基于 promise 的 HTTP 库，它有以下几大特性，[文档](https://www.kancloud.cn/yunye/axios/234845)：

- 提供了并发请求的接口；
- 可在 Node 与浏览器中使用；
- 支持 Promise API，客户端支持防御 XSRF；
- 可拦截请求和响应、转换请求数据&响应数据、取消请求、自动转换 JSON 数据；

```js
// 1、简单使用1
axios({
    method: 'GET',
    url: url,
})
.then(res => {console.log(res)})
.catch(err => {console.log(err)})


// 2、简单使用2
axios.post('/user', {
    name: 'zxm',
    age: 18,
  })
  .then(function (response) {
    console.log(response);
  })


// 3、并发请求
function getUserAccount() {
  return axios.get('/user/12345');
}
function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
  // Both requests are now complete
}));
```



