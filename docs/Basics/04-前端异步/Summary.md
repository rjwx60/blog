# 八、总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092815.png" style="zoom:60%;" />

## 8-1、异步编程发展历程简述

- 阶段一：回调函数
  - 问题1：缺乏顺序性：其导致调试困难，并与大脑线性思维方式不符；
  - 问题2：缺乏可信任性： 控制反转导致系列信任问题；
- 阶段二：Promise 基于 PromiseA+ 规范的实现
  - 解决：上述问题2，重掌代码执行主动权；
- 阶段三：Generator(生成器函数) 用同步方式来书写代码
  - 解决：上述问题1，但需手动调用 next 方法，将回调成功返回的数据送回 JS 主流程中；
- 阶段四：Async/Await (结合 Promise & Generator)，在 await 后面跟 Promise，自动等待 Promise 决议值
  - 解决：Generator需要手动控制next(...)执行的问题、真正实现了用同步的方式书写异步代码；




## 8-2、总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092746.png" style="zoom:50%;" align="" />

- 回调函数
  - 优点：解决同步问题；
  - 缺点：地狱缺乏顺序性，调试困难，与大脑思维方式不符、函数间存在耦合性牵一发动全身(控制反转)、难以处理错误；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092747.png" style="zoom:50%;" align="" />

- Promise
  - 优点：解决回调地狱问题，可链式调用，自动执行，符合大脑线性思维模式；
  - 缺点： 仍然没有摆脱回掉函数，虽改善了回掉地狱…
  - 缺点：一旦新建即立即执行则无法停止、错误需通过回调函数来捕获、处于 pending 态时无法得知具体状态(刚开始/即将完成 )；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092748.png" style="zoom:50%;" align="" />

- Generator
  - 优点：执行可控；(利用协程完成 Generator 函数，用 co 库让代码依次执行完，同时以同步方式书写，也让异步操作按顺序执行)；
  - 缺点：执行需手动触发、不够自动化；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092749.png" style="zoom:50%;" align="" />

- Async/await
  - 优点：代码结构清晰(无需 then 链)；以同步的方式来书写，且无需借助第三方库的支持；
  - 缺点：将异步改为同步，多个无依赖的异步操作将导致性能降低；
  - 缺点：由于 async 函数本身返回一个 promise，也很容易产生 async 嵌套地狱

