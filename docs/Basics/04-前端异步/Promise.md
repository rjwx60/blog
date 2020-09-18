# 二、Promise

**<u>意义：解决因控制反转导致的信任问题(此外还一定程度上解决了回调函数的书写结构问题，逻辑性、可读性增强，依赖层级清晰)</u>**



## 2-1、Promise/A+规范

### 2-1-1、基本内容

- 不变性：某个 Promise 必处于3态之一且不变(一旦决议，状态不再改变)：
  - 激发态——pending —> fulfilled——稳定态；
  - 激发态——pending —> rejected——稳定态；
- 可信任性
  - then 总能返回一个Promise：
    - 涉及 Promise 解析过程的抽象过程 [[Resolve]](promise, x)，可将某些非标准的：类Promise接口、对象、函数或值规范为标准 Promise；
    - 注意：若 then  函数的2个参数不是函数，会导致 then 函数 返回一个与之前 promise 状态相同的 promise(值穿透)
- 核心1：Promise 本质是状态机，且状态只能为以下三种：Pending-等待态、Fulfilled-执行态、Rejected-拒绝态，状态变更单向；
- 核心2：then 接收 2 个可选参数，分别对应状态改变时触发的回调，then 返回 promise，then 可被同一个 promise 调用多次；



### 2-1-2、基本原则

原则1：当通过 ***new Promise*(*function* (*resolve*, *reject*)*{}*)** 形式定义 *Promise* 时，构造用到函数就已在被执行，见下图；

原则*2*：函数在没有返回值时，会默认返回 *undefined*；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092752.png" style="zoom:50%;" align="" />



### 2-1-3、解决的问题

- 解决了回调，调用过早问题：
  - Promise 调用 then 时，即使 Promise 已决议，也总会在当前 Js 事件处理完后再调用提供给 then 的回调
- 解决了回调，调用过晚问题：
  - Promise 对象调用 resolve 或 reject 时，通过 then 注册的回调会在下一个异步时间点上被触发；而若多个通过 then 注册的回调，都会在下一个异步时间点上被依次调用，这些注册回调中的异步回调均无法影响或延误对其他 then 上回调的调用；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092753.png" style="zoom:50%;" align="" />

- 解决了回调，调用次数太多或太少问题：
  - Promise 的定义方式使得它只能被决议一次，且会默默忽略任何后续调用，因此任何通过 then 注册的回调就只会被调用一次；
- 解决了回调，无法成功接收所传参数的问题：
  - resolve 或 reject，默认传值 undefined
  - resolve 或 reject，中的值不管是什么，都会被传给所有注册在 then 中的回调函数
  - resolve 或 reject，中传递多个参数时，第一个参数后的所有参数都会被忽略；故多参数传递需通过对象传递；
- 解决了吞掉可能出现的错误或异常问题：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092754.png" style="zoom:50%;" align="" />



### 2-1-4、返回值

Promise 只是改变了传递回调的位置，只是将 callback 放到可信任的中间机构，并由这个机构去连接代码与接口；

所以本质上并没有完全摆脱回调；但就是这样比单纯使用回调更值得信任，因为 Promise.resolve：

- 若向 Promise.resolve 传递1个真 Promise，则得到传递过去的同1个 Promise：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092755.png" style="zoom:50%;" align="" />
- 若向 Promise.resolve 传递1个非 Promise、非 thenable 的立即值，则得到1个用这个值填充的 Promise：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092756.png" style="zoom:50%;" align="" />
- 若向 Promise.resolve 传递1个非 Promise、真 thenable 的立即值，Promise.resolve 则会试图展开此值 ，且展开过程中会持续到提取出一个具体的非类 Promise 的规范后的最终值：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092757.png" style="zoom:50%;" align="" />



### 2-1-5、总结

**<u>*无论传递什么值，从 Promise.resolve 得到的都是一个真正的  Promise，是一个可信任的值*</u>**，所以通过Promise.resolve 过滤，以获取可信任性；故有跟传统回调相比，Promise 更值得信任的说法；

`then`以及`catch`方法：

1. `Promise`的状态一经改变就不能再改变；
2. `.then`和`.catch`都会返回一个新的`Promise`；
3. `catch`不管被连接到哪里，都能捕获上层未捕捉过的错误；
4. 在`Promise`中，返回任意一个非 `promise` 的值都会被包裹成 `promise` 对象，例如`return 2`会被包装为`return Promise.resolve(2)`；
5. `Promise` 的 `.then` 或者 `.catch` 可以被调用多次, 但如果`Promise`内部的状态一经改变，并且有了一个值，那么后续每次调用`.then`或者`.catch`的时候都会直接拿到该值；
6. `.then` 或者 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，所以不会被后续的 `.catch` 捕获；
7. `.then` 或 `.catch` 返回的值不能是 promise 本身，否则会造成死循环；
8. `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值透传；
9. `.then`方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，再某些时候你可以认为`catch`是`.then`第二个参数的简便写法；
10. `.finally`方法也是返回一个`Promise`，他在`Promise`结束的时候，无论结果为`resolved`还是`rejected`，都会执行里面的回调函数；

另外也可以说一下`finally`方法：

1. `.finally()`方法不管`Promise`对象最后的状态如何都会执行
2. `.finally()`方法的回调函数不接受任何的参数，也就是说你在`.finally()`函数中是没法知道`Promise`最终的状态是`resolved`还是`rejected`的
3. 它最终返回的默认会是一个<u>上一次的Promise对象值</u>，不过如果抛出的是一个异常则返回异常的`Promise`对象；

`all`以及`race`方法：

- `Promise.all()`：作用是接收一组异步任务，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调；
- `.race()`：作用也是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，其他方法仍在执行，但执行结果会被抛弃；
- `Promise.all().then()` 结果中数组的顺序和 `Promise.all()`接收到的数组顺序一致；
- `all和race ` 传入的数组中若有会抛出异常的异步任务，则只有最先抛出的错误会被捕获，并且是被`then`的第二个参数或者后面的`catch`捕获；但并不会影响数组中其它的异步任务的执行；






## 2-2、Promise 解决

### 2-2-1、回调地狱问题

回调地狱：存在两问题：<u>多层嵌套的问题</u>，且<u>每种任务的处理结果存在两种可能性(成或败)，则就需要在每种任务执行结束后分别处理这两种可能性</u>。

Promise 的诞生就是为了解决这两个问题，Promise 利用了三大技术手段来解决：

- **回调函数延迟绑定**；

```js
// 回调函数非直接声明，而是通过后面的 then 方法传入的，即延迟传入，此乃 回调函数延迟绑定
let readFilePromise = (filename) => {
  fs.readFile(filename, (err, data) => {
    if(err) {
      reject(err);
    }else {
      resolve(data);
    }
  })
}
readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')
});
```

- **返回值穿透**；

```js
// 首先，根据 then 中回调函数的传入值创建不同类型的Promise
// 然后，把返回的 Promise 穿透到外层, 以供后续的调用；x 即内部返回的 Promise
// 最后，在 x 后面可以依次完成链式调用；此乃 返回值穿透的效果

let x = readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')// 这是返回的Promise
});
x.then(/* 内部逻辑省略 */)

// 链式调用，解决了多层嵌套的问题
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
});
```

- **错误冒泡**；

```js
// 使用错误冒泡，以应对每次任务执行结束后分别处理成功和失败的情况
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
}).catch(err => {
  // xxx
})
```



### 2-2-2、作为微任务引入

Promise 中的执行函数是同步进行，但其中可能存在着异步操作，在异步操作结束后，会调用 resolve 方法或中途遇到错误调用 reject 方法，而两者均作为微任务进入到 EventLoop 中；其实就是如何处理回调的问题，总结起来有三种方式:

- 使用同步回调，直到异步任务进行完，再进行后面的任务；
  - 同步问题明显，阻塞整个脚本；
- 使用异步回调，将回调函数放在进行 **<u>宏任务队列的队尾</u>**；
  - 若宏任务队列非常长，那么回调迟迟得不到执行，造成应用卡顿；
- 使用异步回调，将回调函数放到  **<u>当前宏任务中的最后面</u>**；
  - 为解决上述方案问题，Promise 采取第三种方式， 即作为微任务引入：把 resolve(reject) 回调的执行放在当前宏任务的末尾；
  - 采用**异步回调**替代同步回调解决了浪费 CPU 性能的问题。
  - 放到**当前宏任务最后**执行，解决了回调执行的实时性问题。





## 2-3、Promise 实现

### 2-3-1、低配版

```javascript
/**
 * 1、低配版 Promise
 */
class MyPromise1 {
  // 构造方法接收一个回调
  constructor(executor) {
    // then 收集的执行成功的回调队列
    this._resolveQueue = [];
    // then 收集的执行失败的回调队列
    this._rejectQueue = [];

    // 实现 resolve
    let _resolve = val => {
      // 从成功队列里取出回调依次执行
      while (this._resolveQueue.length) {
        const callback = this._resolveQueue.shift();
        callback(val);
      }
    };
    
    // reject 实现同 resolve
    let _reject = val => {
      // 从失败队列里取出回调依次执行
      while (this._rejectQueue.length) {
        const callback = this._rejectQueue.shift();
        callback(val);
      }
    };
    // new Promise()时立即执行 executor,并传入 resolve 和 reject
    executor(_resolve, _reject);
  }

  // then 方法,接收一个成功的回调和一个失败的回调，并 push 进对应队列
  then(resolveFn, rejectFn) {
    this._resolveQueue.push(resolveFn);
    this._rejectQueue.push(rejectFn);
  }
}

// 测试用例
const p1 = new MyPromise1((resolve, reject) => {
  setTimeout(() => {
    resolve("result");
  }, 1000);
});
// 1秒后输出 result
p1.then(res => console.log(res));
```



### 2-3-2、高配版

即结合 Promise/A 规范实现版本；

### 2-3-2-1、基本骨架实现

- 核心1：Promise 本质是状态机，且状态只能为以下三种：Pending-等待态、Fulfilled-执行态、Rejected-拒绝态，状态变更单向；
- 核心2：then 接收 2 个可选参数，分别对应状态改变时触发的回调，then 返回 promise，then 可被同一个 promise 调用多次；

```javascript
function P2() {
  //Promise/A+规范的三种状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  class MyPromise2 {
    // 构造方法接收一个回调
    constructor(executor) {
      // Promise 状态
      this._status = PENDING;
      // 成功队列, resolve 时触发
      this._resolveQueue = [];
      // 失败队列, reject 时触发
      this._rejectQueue = [];

      // 实现同 reject
      let _resolve = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = FULFILLED;

        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };
      // 实现同 resolve
      let _reject = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = REJECTED;

        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift();
          callback(val);
        }
      };
      // new Promise()时立即执行 executor, 并传入 resolve 和 reject
      executor(_resolve, _reject);
    }
    // then 方法,接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
      this._resolveQueue.push(resolveFn);
      this._rejectQueue.push(rejectFn);
    }
  }
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092758.png" style="zoom:50%;" align="" />

### 2-3-2-2、链式调用实现

- 将 then 方法的返回值包装成 promise 
- then 的回调需要顺序执行，需要等待当前 Promise 状态变更后，才执行下一 then 收集的回调

```javascript
function P3() {
  // Promise/A+规范的三种状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  class MyPromise3 {
    // 构造方法接收一个回调
    constructor(executor) {
      // Promise 状态
      this._status = PENDING;
      // 成功队列, resolve 时触发
      this._resolveQueue = [];
      // 失败队列, reject 时触发
      this._rejectQueue = [];

      // 实现同 reject
      let _resolve = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = FULFILLED;
        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };
      // 实现同 resolve
      let _reject = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = REJECTED;

        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift();
          callback(val);
        }
      };
      // new Promise()时立即执行 executor, 并传入 resolve 和 reject
      executor(_resolve, _reject);
    }

    // then 方法
    then(resolveFn, rejectFn) {
      // return 一个新的 promise
      return new MyPromise3((resolve, reject) => {
        // 把 resolveFn 重新包装一下, 再 push 进 resolve 执行队列, 这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            // 执行第一个(当前的) Promise 的成功回调,并获取返回值
            let x = resolveFn(value);
            // 分类讨论返回值,如果是 Promise, 那么等待 Promise 状态变更,否则直接 resolve
            x instanceof MyPromise3 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };
        // 把后续 then 收集的依赖都 push 进当前 Promise 的成功回调队列中(_rejectQueue), 这是为了保证顺序调用
        this._resolveQueue.push(fulfilledFn);

        // reject 同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error);
            x instanceof MyPromise3 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };
        this._rejectQueue.push(rejectedFn);
      });
    }
  }
}

// 测试用例
const p3 = new MyPromise3((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
});

p3.then(res => {
  console.log(res);
  return 2;
})
.then(res => {
  console.log(res);
  return 3;
})
.then(res => {
  console.log(res);
});
// 1
// 2
// 3
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092759.png" style="zoom:50%;" align="" />

### 2-3-2-3、值穿透+状态变更实现

- **<u>值穿透</u>**：即若 then 接收的参数类型不是 function 则应当忽略，让链式调用继续往下执行；
- **<u>处理状态为 resolve/reject 的情况</u>**：一般情况下 then 对应状态 pending，但特殊情况比如 Promise.resolve()/reject().then() 则此时状态为 resolve/reject，此时若还按照 pending 态时的做法：将 then 中回调 push 进 resolve/reject 队列中的话，回调将不会正确执行，故需对上述特殊情况进行处理，即对 fulfilled 状态和 rejected 情况进行处理：直接执行回调；

```javascript
function P4() {
  //Promise/A+规范的三种状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  class MyPromise4 {
    // 构造方法接收一个回调
    constructor(executor) {
      // Promise 状态
      this._status = PENDING;
      // 成功队列, resolve 时触发
      this._resolveQueue = [];
      // 失败队列, reject 时触发
      this._rejectQueue = [];

      // 实现同 reject
      let _resolve = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = FULFILLED;

        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };
      // 实现同 resolve
      let _reject = val => {
        // 实现规范要求的 "状态只能由 pending 到 fulfilled 或 rejected"
        if (this._status !== PENDING) return;
        // 变更状态
        this._status = REJECTED;

        // 使用一个队列来储存回调，实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 若使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift();
          callback(val);
        }
      };
      // new Promise()时立即执行 executor, 并传入 resolve 和 reject
      executor(_resolve, _reject);
    }

    // then 方法,接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
      // 根据规范，若 then 参数不是 function，则需要忽略它, 让链式调用继续往下执行
      typeof resolveFn !== "function" ? (resolveFn = value => value) : null;
      typeof rejectFn !== "function"
        ? (rejectFn = reason => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          })
        : null;

      // return 一个新的 promise
      return new MyPromise4((resolve, reject) => {
        // 把 resolveFn 重新包装一下, 再 push 进 resolve 执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            // 执行第一个(当前的) Promise 的成功回调,并获取返回值
            let x = resolveFn(value);
            // 分类讨论返回值,如果是 Promise, 那么等待 Promise 状态变更, 否则直接 resolve
            x instanceof MyPromise4 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        // reject 同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error);
            x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        switch (this._status) {
          // 当状态为 pending 时, 把 then 回调 push 进 resolve/reject 执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn);
            this._rejectQueue.push(rejectedFn);
            break;
          // 当状态已经变为 resolve/reject 时,直接执行 then 回调
          case FULFILLED:
            fulfilledFn(this._value);
            // this._value 是上一个 then 回调 return 的值(见完整版代码)
            break;
          case REJECTED:
            rejectedFn(this._value);
            break;
        }
      });
    }
  }
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092800.png" style="zoom:50%;" align="" />

### 2-3-2-4、同步任务兼容实现

目前 Promise 执行顺序是 new Promise -> then()收集回调 -> resolve/reject执行回调，但前提是异步任务；

若为同步则会变为：new Promise -> resolve/reject执行回调 -> then() 收集回调，解决方式是为同步任务包裹 setTimeout 强行变为异步任务

```javascript
function P5() {
  //Promise/A+规定的三种状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  class MyPromise5 {
    // 构造方法接收一个回调
    constructor(executor) {
      // Promise 状态
      this._status = PENDING;
      // 储存 then 回调 return 的值
      this._value = undefined;
      // 成功队列, resolve 时触发
      this._resolveQueue = [];
      // 失败队列, reject 时触发
      this._rejectQueue = [];

      // 由于 resolve/reject 是在 executor 内部被调用, 因此需要使用箭头函数固定 this 指向, 否则找不到 this._resolveQueue
      let _resolve = val => {
        // 把 resolve 执行回调的操作封装成一个函数, 放进 setTimeout 里, 以兼容 executor 是同步代码的情况
        const run = () => {
          // 对应规范中的" 状态只能由 pending 到 fulfilled 或 rejected"
          if (this._status !== PENDING) return;
          this._status = FULFILLED; // 变更状态
          this._value = val; // 储存当前 value

          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
          // 如果使用一个变量而非队列来储存回调,那么即使多次 p1.then() 也只会执行一次回调
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift();
            callback(val);
          }
        };
        setTimeout(run);
      };
      // 实现同 resolve
      let _reject = val => {
        const run = () => {
          if (this._status !== PENDING) return;
          // 对应规范中的"状态只能由 pending 到 fulfilled 或 rejected"
          this._status = REJECTED; // 变更状态
          this._value = val; // 储存当前 value
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift();
            callback(val);
          }
        };
        setTimeout(run);
      };
      // new Promise() 时立即执行 executor, 并传入 resolve 和 reject
      executor(_resolve, _reject);
    }

    // then 方法,接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
      // 根据规范，如果 then 的参数不是 function，则我们需要忽略它, 让链式调用继续往下执行
      typeof resolveFn !== "function" ? (resolveFn = value => value) : null;
      typeof rejectFn !== "function"
        ? (rejectFn = reason => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          })
        : null;

      // return 一个新的 promise
      return new MyPromise5((resolve, reject) => {
        // 把 resolveFn 重新包装一下, 再 push 进 resolve 执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            // 执行第一个(当前的)Promise 的成功回调,并获取返回值
            let x = resolveFn(value);
            // 分类讨论返回值, 如果是 Promise,那么等待 Promise 状态变更,否则直接 resolve
            x instanceof MyPromise5 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        // reject 同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error);
            x instanceof MyPromise5 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        switch (this._status) {
          // 当状态为 pending 时,把 then 回调 push 进 resolve/reject 执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn);
            this._rejectQueue.push(rejectedFn);
            break;
          // 当状态已经变为 resolve/reject 时,直接执行 then 回调
          case FULFILLED:
            fulfilledFn(this._value); // this._value 是上一个 then 回调 return 的值(见完整版代码)
            break;
          case REJECTED:
            rejectedFn(this._value);
            break;
        }
      });
    }
  }
}

// 测试用例
const p5 = new MyPromise5((resolve, reject) => {
  resolve(1); // 同步 executor 测试
});

p5.then(res => {
  console.log(res);
  return 2; // 链式调用测试
})
.then() // 值穿透测试
.then(res => {
  console.log(res);
  return new MyPromise5((resolve, reject) => {
    resolve(3); //返回 Promise 测试
  });
})
.then(res => {
  console.log(res);
  throw new Error("reject 测试"); //reject 测试
})
.then(
  () => {},
  err => {
    console.log(err);
  }
);
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092801.png" style="zoom:50%;" align="" />

### 2-3-2-5、静态方法实现

诸如 race/all/catch/resolve/reject/finally

```javascript
function P6() {
  //Promise/A+规定的三种状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";

  class MyPromise6 {
    // 构造方法接收一个回调
    constructor(executor) {
      // Promise 状态
      this._status = PENDING; 
      // 储存 then 回调 return 的值
      this._value = undefined; 
      // 成功队列, resolve 时触发
      this._resolveQueue = []; 
      // 失败队列, reject 时触发
      this._rejectQueue = []; 

      // 由于 resolve/reject 是在 executor 内部被调用, 因此需要使用箭头函数固定 this 指向, 否则找不到 this._resolveQueue
      let _resolve = val => {
        //把 resolve 执行回调的操作封装成一个函数,放进 setTimeout 里,以兼容 executor 是同步代码的情况
        const run = () => {
          if (this._status !== PENDING) return; // 对应规范中的"状态只能由 pending 到 fulfilled 或 rejected"
          this._status = FULFILLED; // 变更状态
          this._value = val; // 储存当前 value

          // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
          // 如果使用一个变量而非队列来储存回调,那么即使多次 p1.then()也只会执行一次回调
          while (this._resolveQueue.length) {
            const callback = this._resolveQueue.shift();
            callback(val);
          }
        };
        setTimeout(run);
      };
      // 实现同 resolve
      let _reject = val => {
        const run = () => {
          if (this._status !== PENDING) return; // 对应规范中的"状态只能由 pending 到 fulfilled 或 rejected"
          this._status = REJECTED; // 变更状态
          this._value = val; // 储存当前 value
          while (this._rejectQueue.length) {
            const callback = this._rejectQueue.shift();
            callback(val);
          }
        };
        setTimeout(run);
      };
      // new Promise()时立即执行 executor,并传入 resolve 和 reject
      executor(_resolve, _reject);
    }

    // then 方法, 接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
      // 根据规范，如果 then 的参数不是 function，则我们需要忽略它, 让链式调用继续往下执行
      typeof resolveFn !== "function" ? (resolveFn = value => value) : null;
      typeof rejectFn !== "function"
        ? (rejectFn = reason => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          })
        : null;

      // return 一个新的 promise
      return new MyPromise6((resolve, reject) => {
        // 把 resolveFn 重新包装一下,再 push 进 resolve 执行队列,这是为了能够获取回调的返回值进行分类讨论
        const fulfilledFn = value => {
          try {
            // 执行第一个(当前的)Promise 的成功回调,并获取返回值
            let x = resolveFn(value);
            // 分类讨论返回值,如果是 Promise,那么等待 Promise 状态变更,否则直接 resolve
            x instanceof MyPromise6 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        // reject 同理
        const rejectedFn = error => {
          try {
            let x = rejectFn(error);
            x instanceof MyPromise6 ? x.then(resolve, reject) : resolve(x);
          } catch (error) {
            reject(error);
          }
        };

        switch (this._status) {
          // 当状态为 pending 时,把 then 回调 push 进 resolve/reject 执行队列,等待执行
          case PENDING:
            this._resolveQueue.push(fulfilledFn);
            this._rejectQueue.push(rejectedFn);
            break;
          // 当状态已经变为 resolve/reject 时,直接执行 then 回调
          case FULFILLED:
            fulfilledFn(this._value); // this._value 是上一个 then 回调 return 的值(见完整版代码)
            break;
          case REJECTED:
            rejectedFn(this._value);
            break;
        }
      });
    }

    // catch 方法其实就是执行一下 then 的第二个回调
    catch(rejectFn) {
      return this.then(undefined, rejectFn);
    }

    // finally 方法
    finally(callback) {
      return this.then(
        value => MyPromise.resolve(callback()).then(() => value), //执行回调,并 returnvalue 传递给后面的 then
        reason =>
          MyPromise.resolve(callback()).then(() => {
            throw reason;
          }) //reject 同理
      );
    }

    // 静态的 resolve 方法
    static resolve(value) {
      if (value instanceof MyPromise6) return value; //根据规范, 如果参数是 Promise 实例, 直接 return 这个实例
      return new MyPromise6(resolve => resolve(value));
    }

    // 静态的 reject 方法
    static reject(reason) {
      return new MyPromise6((resolve, reject) => reject(reason));
    }

    // 静态的 all 方法
    static all(promiseArr) {
      let index = 0;
      let result = [];
      return new MyPromise6((resolve, reject) => {
        promiseArr.forEach((p, i) => {
          //Promise.resolve(p)用于处理传入值不为 Promise 的情况
          MyPromise.resolve(p).then(
            val => {
              index++;
              result[i] = val;
              if (index === promiseArr.length) {
                resolve(result);
              }
            },
            err => {
              reject(err);
            }
          );
        });
      });
    }

    // 静态的 race 方法
    static race(promiseArr) {
      return new MyPromise6((resolve, reject) => {
        // 同时执行 Promise,如果有一个 Promise 的状态发生改变,就变更新 MyPromise 的状态
        for (let p of promiseArr) {
          MyPromise.resolve(p).then(
            //Promise.resolve(p)用于处理传入值不为 Promise 的情况
            value => {
              resolve(value); //注意这个 resolve 是上边 new MyPromise 的
            },
            err => {
              reject(err);
            }
          );
        }
      });
    }
  }

  
  // 测试用例
  const p6 = new MyPromise6((resolve, reject) => {
    resolve(1); // 同步 executor 测试
  });
  
  p6.then(res => {
    console.log('res1', res);
    return 2; // 链式调用测试
  })
  .then() // 值穿透测试
  .then(res => {
    console.log('res2', res);
    return new MyPromise6((resolve, reject) => {
      resolve(3); //返回 Promise 测试
    });
  })
  .then(res => {
    return new MyPromise6((resolve, reject) => {
      setTimeout(() => {
        console.log('timer1');
        resolve();
      }, 1000);
    });
  })
  .then(res => {
    return new MyPromise6((resolve, reject) => {
      setTimeout(() => {
        console.log('timer2');
        resolve();
      }, 10000);
    });
  })
  .then(res => {
    console.log(res);
    throw new Error("reject 测试"); //reject 测试
  })
  .then(
    () => {},
    err => {
      console.log(err);
    }
  );

  const p7 = new MyPromise6((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    },1000)
  })
  
  const p8 = new MyPromise6((resolve, reject) => {
    setTimeout(() => {
      reject('failed..')
    }, 5000)
  })
  
  MyPromise6.race([p7, p8]).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)  // 打开的是 'failed'
  })

    
  MyPromise6.all([p7, p8]).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)  // 打开的是 'failed'
  })
}
```



