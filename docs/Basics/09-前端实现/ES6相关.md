# 七、ES6相关

## 7-1、let、const

### 7-1-1、利用 IIFE 实现 let

```js
(function(){
  for(var i = 0; i < 5; i ++){
    console.log(i)  // 0 1 2 3 4
  }
})();
console.log(i)      // Uncaught ReferenceError: i is not defined
```

- var 声明的变量会挂到 window 上，而 let 和 const 不会；
- var 声明的变量存在变量提升，而 let 和 const 不会；
- let 和 const 声明形成块作用域，只能在块作用域里访问，不能跨块访问，也不能跨函数访问；
- 同一作用域下 let 和 const 不能声明同名变量，而 var 可以；
- 暂时性死区，let 和 const 声明的变量不能在声明前被使用；



### 7-1-2、defineProperty 实现 const

实现 const 的关键在于 `Object.defineProperty()` ，此API用于在一个对象上增加或修改属性；

通过配置属性描述符，可精确地控制属性行为；`Object.defineProperty(obj, prop, desc)` 其接收三个参数：

- obj：要在其上定义属性的对象；
- prop：要定义或修改的属性的名称；
- descriptor：将被定义或修改的属性描述符；
  - value：该属性对应的值；可以是任何有效的 JS 值(数值，对象，函数等)；
    - 默认为 undefined；
  - get：一个给属性提供 getter 的方法，若没有 getter 则为 undefined；
  - set：一个给属性提供 setter 的方法，若没有 setter 则为 undefined；
    - 当属性值修改时，触发执行该方法；
  - writable：当且仅当该属性的 writable 为 true 时，value 才能被赋值运算符改变；
    - 默认为 false；
  - enumerable：定义对象的属性是否可在 for...in 循环和 Object.keys() 中被枚举；
    - 默认为 false；
  - Configurable：表示对象属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可被修改；
    - 默认为 false；

```js
function _const(key, value) {    
    const desc = {        
        value,        
        writable: false    
    }    
    Object.defineProperty(window, key, desc)
}
    
_const('obj', {a: 1})   // 定义obj
obj.b = 2               // 可以正常给obj的属性赋值
obj = {}                // 无法赋值新对象
```







## 7-2、继承

### 7-2-1、class

### 7-2-1-1、ES6 实现

```js
class B {
  constructor(opt) {
    this.BName = opt.name;
  }
}
class A extends B {
  constructor() {
    // 向父类传参
    super({ name: 'B' });
    // this 必须在 super() 下面使用
    console.log(this);
  }
}
```

### 7-2-1-2、ES5 实现

使用寄生组合继承的方式

1. 原型链继承，使子类可以调用父类原型上的方法和属性
2. 借用构造函数继承，可以实现向父类传参
3. 寄生继承，创造干净的没有构造方法的函数，用来寄生父类的 prototype

```js
// 实现继承，通过继承父类 prototype
function __extends(child, parent) {
  // 修改对象原型
  Object.setPrototypeOf(child, parent);
  // 寄生继承，创建一个干净的构造函数，用于继承父类的 prototype
  // 这样做的好处是，修改子类的 prototype 不会影响父类的 prototype
  function __() {
    // 修正 constructor 指向子类
    this.constructor = child;
  }
  // 原型继承，继承父类原型属性，但是无法向父类构造函数传参
  child.prototype =
    parent === null
      ? Object.create(parent)
      : ((__.prototype = parent.prototype), new __());
}

var B = (function() {
  function B(opt) {
    this.name = opt.name;
  }
  return B;
})();

var A = (function(_super) {
  __extends(A, _super);
  function A() {
    // 借用继承，可以实现向父类传参, 使用 super 可以向父类传参
    return (_super !== null && _super.apply(this, { name: 'B' })) || this;
  }
  return A;
})(B);

// 测试
const a = new A();
console.log(a.BName, a.constructor); // B ,ƒ A() {}
```







## 7-3、异步

### 7-3-1、Promise 低配版1

原理：发布订阅模式

- 构造函数接收一个 `executor` 函数，并会在 `new Promise()` 时立即执行该函数
- then 时收集依赖，将回调函数收集到成功/失败队列
- `executor` 函数中调用 `resolve/reject` 函数
- `resolve/reject` 函数被调用时会通知触发队列中的回调

```js
const isFunction = variable => typeof variable === 'function';

// 定义Promise的三种状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  // 构造函数，new 时触发
  constructor(handle: Function) {
    try {
      handle(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }
  }
  // 状态 pending fulfilled rejected
  private _status: string = PENDING;
  // 储存 value，用于 then 返回
  private _value: string | undefined = undefined;
  // 失败队列，在 then 时注入，resolve 时触发
  private _rejectedQueues: any = [];
  // 成功队列，在 then 时注入，resolve 时触发
  private _fulfilledQueues: any = [];
  // resovle 时执行的函数
  private _resolve = val => {
    const run = () => {
      if (this._status !== PENDING) return;
      this._status = FULFILLED;
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = value => {
        let cb;
        while ((cb = this._fulfilledQueues.shift())) {
          cb(value);
        }
      };
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = error => {
        let cb;
        while ((cb = this._rejectedQueues.shift())) {
          cb(error);
        }
      };
      /*
       * 如果resolve的参数为Promise对象，
       * 则必须等待该Promise对象状态改变后当前Promsie的状态才会改变
       * 且状态取决于参数Promsie对象的状态
       */
      if (val instanceof MyPromise) {
        val.then(
          value => {
            this._value = value;
            runFulfilled(value);
          },
          err => {
            this._value = err;
            runRejected(err);
          }
        );
      } else {
        this._value = val;
        runFulfilled(val);
      }
    };
    // 异步调用
    setTimeout(run);
  };
  // reject 时执行的函数
  private _reject = err => {
    if (this._status !== PENDING) return;
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED;
      this._value = err;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run);
  };
  // then 方法
  then(onFulfilled?, onRejected?) {
    const { _value, _status } = this;
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功时执行的函数
      const fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            const res = onFulfilled(value);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err);
        }
      };

      // 封装一个失败时执行的函数
      const rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error);
          } else {
            const res = onRejected(error);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err);
        }
      };

      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fulfilledQueues.push(fulfilled);
          this._rejectedQueues.push(rejected);
          break;
        // 当状态已经改变时，立即执行对应的回调函数
        case FULFILLED:
          fulfilled(_value);
          break;
        case REJECTED:
          rejected(_value);
          break;
      }
    });
  }
  // catch 方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  // finally 方法
  finally(cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      reason =>
        MyPromise.resolve(cb()).then(() => {
          throw reason;
        })
    );
  }
  // 静态 resolve 方法
  static resolve(value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
  // 静态 reject 方法
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value));
  }
  // 静态 all 方法
  static all(list) {
    return new MyPromise((resolve, reject) => {
      // 返回值的集合
      let values = [];
      let count = 0;
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(
          res => {
            values[i] = res;
            count++;
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === list.length) resolve(values);
          },
          err => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err);
          }
        );
      }
    });
  }
  // 添加静态race方法
  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}
```



### 7-3-2、低配版2

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



### 7-3-3、高配版

即结合 Promise/A 规范实现版本；

### 7-3-3-1、基本骨架的实现

- 核心1：Promise 本质是状态机，且状态只能为以下三种：Pending-等待态、Fulfilled-执行态、Rejected-拒绝态，状态变更单向；
  核心2：then 接收 2 个可选参数，分别对应状态改变时触发的回调，then 返回 promise，then 可被同一个 promise 调用多次；

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

### 7-3-3-2、实现链式调用

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
      return new MyPromise((resolve, reject) => {
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

### 7-3-3-3、实现值透、状态变更处理

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

### 7-3-3-4、实现同步任务兼容

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

### 7-3-3-5、实现静态方法

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







### 7-3-4、Async/Await

原理：利用 `generator` (生成器)分割代码片段，然后我们使用一个函数让其自迭代，每一个`yield` 用 `promise` 包裹起来，执行下一步的时机由 `promise` 来控制；

```js
// 异步迭代，模拟异步函数
function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    // 将返回值promise化
    return new Promise(function(resolve, reject) {
      // 获取迭代器实例
      var gen = fn.apply(self, args);
      // 执行下一步
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      // 抛出异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      // 第一次触发
      _next(undefined);
    });
  };
}
// 执行迭代步骤，处理下次迭代结果
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    // 迭代器完成
    resolve(value);
  } else {
    // -- 这行代码就是精髓 --
    // 将所有值promise化
    // 比如 yield 1
    // const a = Promise.resolve(1) a 是一个 promise
    // const b = Promise.resolve(a) b 是一个 promise
    // 可以做到统一 promise 输出
    // 当 promise 执行完之后再执行下一步
    // 递归调用 next 函数，直到 done == true
    Promise.resolve(value).then(_next, _throw);
  }
}
// 测试
const asyncFunc = _asyncToGenerator(function*() {
  const e = yield new Promise(resolve => {
    setTimeout(() => {
      resolve('e');
    }, 1000);
  });
  const a = yield Promise.resolve('a');
  const d = yield 'd';
  const b = yield Promise.resolve('b');
  const c = yield Promise.resolve('c');
  return [a, b, c, d, e];
});

asyncFunc().then(res => {
  console.log(res); // ['a', 'b', 'c', 'd', 'e']
});
```





### 7-3-5、异步请求顺序执行

- 利用 `reduce`，初始值传入一个`Promise.resolve()`，之后往里面不停的叠加`.then()`

  - ```js
    const arr = [1, 2, 3]
    arr.reduce((p, x) => {
      return p.then(() => {
        return new Promise(r => {
          setTimeout(() => r(console.log(x)), 1000)
        })
      })
    }, Promise.resolve())
    
    // Way - 2
    const arr = [1, 2, 3]
    arr.reduce((p, x) => p.then(() => new Promise(r => setTimeout(() => r(console.log(x)), 1000))), Promise.resolve())
    // 每隔1秒输出1,2,3
    ```

- 利用 `forEach`，本质和 `reduce` 原理相同；

  - ```js
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
    
    function mergePromise () {
      // 存放每个 ajax 的结果
      const data = [];
      let promise = Promise.resolve();
      ajaxArray.forEach(ajax => {
      	// 第一次的 then 为了用来调用 ajax
      	// 第二次的 then 是为了获取 ajax 的结果
        promise = promise.then(ajax).then(res => {
          data.push(res);
          return data; // 把每次的结果返回
        })
      })
      // 最后得到的 promise 它的值就是 data
      return promise;
    }
    
    mergePromise([ajax1, ajax2, ajax3]).then(data => {
      console.log("done");
      console.log(data); // data 为 [1, 2, 3]
    });
    
    // 1
    // 2
    // 3
    // done
    // [1, 2, 3]
    ```

- 用`ES9`中的`for...await...of`来实现

- Rxjs 实现；



