# 二、函数相关

## 2-1、柯里化

无时无刻不在使用柯里化函数，只是没有将它总结出来而已；其本质就是将一个参数很多的函数分解成单一参数的多个函数。

- 延迟计算 （用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，开始执行函数）
- 动态创建函数 （参数不够时会返回接受剩下参数的函数）
- 参数复用（每个参数可以多次复用）

```js
const curry = fn =>
  (judge = (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...arg) => judge(...args, ...arg));

const sum = (a, b, c, d) => a + b + c + d;
const currySum = curry(sum);

currySum(1)(2)(3)(4); // 10
currySum(1, 2)(3)(4); // 10
currySum(1)(2, 3)(4); // 10
```



## 2-2、Sleep 函数

实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现：

```js
// Promise
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve,time))
}
sleep(1000).then(()=>{
  // ...
})

// Generator
function* sleepGenerator(time) {
  yield new Promise(function(resolve,reject){
    setTimeout(resolve,time);
  })
}
sleepGenerator(1000).next().value.then(()=>{console.log(1)})

// async
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve,time))
}
async function output() {
  let out = await sleep(1000);
  // ...
  return out;
}
output();

// ES5
function sleep(callback,time) {
  if(typeof callback === 'function')
    setTimeout(callback,time)
}

function output(){
  // ...
}
sleep(output,1000);
```



## 2-3、LazyMan 函数 

```
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

```js
class LazyManClass {
    constructor(name) {
        this.taskList = [];
        this.name = name;
        console.log(`Hi I am ${this.name}`);
        setTimeout(() => {
            this.next();
        }, 0);
    }
    eat (name) {
        var that = this;
        var fn = (function (n) {
            return function () {
                console.log(`I am eating ${n}`)
                that.next();
            }
        })(name);
        this.taskList.push(fn);
        return this;
    }
    sleepFirst (time) {
        var that = this;
        var fn = (function (t) {
            return function () {
                setTimeout(() => {
                    console.log(`等待了${t}秒...`)
                    that.next();
                }, t * 1000);  
            }
        })(time);
        this.taskList.unshift(fn);
        return this;
    }
    sleep (time) {
        var that = this
        var fn = (function (t) {
            return function () {
                setTimeout(() => {
                    console.log(`等待了${t}秒...`)
                    that.next();
                }, t * 1000); 
            }
        })(time);
        this.taskList.push(fn);
        return this;
    }
    next () {
        var fn = this.taskList.shift();
        fn && fn();
    }
}
function LazyMan(name) {
    return new LazyManClass(name);
}
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(4).eat('junk food');



// 1、简易版
class LazyManClass {
  constructor(name) {
    this.name = name
    this.queue = []
    console.log(`Hi I am ${name}`)
    setTimeout(() => {
      this.next()
    },0)
  }

  sleepFirst(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`)
        this.next()
      }, time)
    }
    this.queue.unshift(fn)
    return this
  }

  sleep(time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`)
        this.next()
      },time)
    }
    this.queue.push(fn)
    return this
  }

  eat(food) {
    const fn = () => {
      console.log(`I am eating ${food}`)
      this.next()
    }
    this.queue.push(fn)
    return this
  }

  next() {
    const fn = this.queue.shift()
    fn && fn()
  }
}
function LazyMan(name) {
  return new LazyManClass(name)
}



// 2、Proxy 实现
function LazyMan(username) {
  console.log(' Hi I am ' + username);

  var temp = {
    taskList: [],
    sleepFirst(timeout) {
      return () => {
        setTimeout(() => {
          console.log(`等待了${timeout}秒...`);
          this.next();
        }, timeout * 1000);
      };
    },
    sleep(timeout) {
      return () => {
        setTimeout(() => {
          console.log(`等待了${timeout}秒...`);
          this.next();
        }, timeout * 1000);
      };
    },
    eat(type) {
      return () => {
        console.log(`I am eating ${type}`);
        this.next();
      };
    },
    next() {
      var fn = this.taskList.shift();
      fn && fn();
    }
  };

  var proxy = new Proxy(temp, {
    get(target, key, receiver) {
      return function(...rest) {
        if (key === 'sleepFirst') {
          target.taskList.unshift(target[key](rest));
        } else {
          target.taskList.push(target[key](rest));
        }
        return receiver;
      };
    }
  });

  setTimeout(() => {
    temp.next();
  }, 0);
  return proxy;
}
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food



// 3、链表实现
class Node {
  constructor(func = null) {
    this.func = func;
    this.next = null;
  }

  async exec() {
    if (this.func) {
      await this.func();
    }
    if (this.next && this.next.func) {
      this.next.exec();
    }
  }
}

function delayFunc(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`等待了${delay}秒...`);
      resolve();
    }, delay * 1000);
  });
}

class Lazy {
  constructor(name) {
    this.name = name;
    this.head = new Node();
    this.current = this.head;
    Promise.resolve().then(() => this.head.exec());
  }

  eat(sth) {
    const log = () => {
      console.log("I am eating " + sth);
    };
    this.current.next = new Node(log);
    this.current = this.current.next;
    return this;
  }

  sleep(delay) {
    this.current.next = new Node(() => delayFunc(delay));
    this.current = this.current.next;
    return this;
  }

  sleepFirst(delay) {
    let head = new Node(() => delayFunc(delay));
    if (!this.head.func) {
      head.next = this.head.next;
    } else {
      head.next = this.head;
    }
    this.head = head;
    return this;
  }
}

function LazyMan(name) {
  console.log("I am " + name);
  return new Lazy(name);
}
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
```





## 2-4、setTimeout/setInterval/Req

屏幕绘制频率：普通屏电子束每秒击打荧光粉的次数或通电持续发光、显示器高频更新屏幕图像；

视觉停留效应：图像停留在大脑的印象还没消失，紧接着图像又被移到了下一个位置，因人眼视觉停留效应，当前位置图像停留在大脑印象尚未消失；

CSS 动画原理：图像被绘制而引起变化的视觉效果，比如 60Hz，每16.7ms 绘制一次；

动画的 JS实现：受 setTimeout 执行时间和设备的屏幕绘制频率影响；

动画卡顿现象：上述因素中，setTimeout 是唯一人为可控，但其执行时间无法确定；若其执行步调和屏幕刷新步调不同，引起丢帧/动画不连贯导致肉眼可视卡顿

- 比如：setTimeout 每隔10s设置图像向左移动1px,就会出现如下绘制过程：

- ```js
  第 0 ms:    屏幕未绘制，等待中，setTimeout 也未执行，等待中；
  第 10 ms:   屏幕未绘制，等待中，setTimeout 开始执行并设置元素属性 left=1px;
  第 16.7ms:  屏幕开始绘制，屏幕上的元素向左移动了 1px, setTimeout 未执行，继续等待中；
  第 20 ms:   屏幕未绘制，等待中，setTimeout 开始执行并设置 left=2px;
  第 30 ms:   屏幕未绘制，等待中，setTimeout 开始执行并设置 left=3px;
  第 33.4 ms: 屏幕开始绘制，屏幕上的元素向左移动了 3px, setTimeout 未执行，继续等待中；
  // 上面的绘制过程中可以看出，屏幕没有更新 left=2px 的那一帧画面，元素直接从 left=1px 的位置跳到了 left=3px的的位置
  // 这就是丢帧现象，这种现象就会引起动画卡顿
  ```

- 注意：RAF 可实现 setTIme/setInterVal，但受外界影响，后者却无法实现 RAF；

- 注意：setTimeout 动画效果卡顿原因：执行步调和屏幕刷新步调不一致；

- 注意：函数 setTImeout 的二参为最少延迟时间，而非确切等待时间；

- 注意：函数 setTImeout 的二参为零，并不意味着回调会立即执行，其等待时间取决于队列里待处理的消息数量；



### 2-4-1、setTime/setInterval 

`setTimeout` 运行机制：执行该语句时，是立即把当前定时器代码推入事件队列，当定时器在事件列表中满足设置的时间值时将传入的函数加入任务队列，之后的执行就交给任务队列负责；但若此时任务队列不为空，则需等待，所以执行定时器内代码的时间可能会大于设置的时间；

```js
// 使用技巧
// 1、setTimeout/setInterval(函数参数，时间，[函数参数所接受参数, ...])
setTimeout(function(...args) {
	console.log(args);
}, 1000, [1,2,3], 4, 5, 6);
// [Array(3), 4, 5, 6]

setInterval(function(...args) {
	console.log(args);
}, 1000, [1,2,3], 4, 5, 6);
// [Array(3), 4, 5, 6]

// 2、可通过强绑定形式传参
setTimeout(function(a, b) {
  // 3 4
}.bind(Object.create(null), 3, 4), 1000);

// 3、参数一有两种形式：不加括号的函数名形式，与加括号的字符串形式
setTimeout(test, 1000);
setTimeout('test()', 1000);
setTimeout(test(), 1000);
// TypeError: callback argument must be a function

// 4、无法动态改变 Interval 间隔值，需先暂停，再赋值重新启动
var time = 2000;
var set1 = setInterval(fn, time);
function fn() {
  time -= 10;
  clearInterval(set1);
  if(time > 0) {
    set1 = setInterval(fn, time);
  }
}
```



### 2-4-2、两者区别&实现

前者，时间指：Math.max (其他代码执行时间 与 setTime设定时间)；

后者，时间指：定期将任务加入事件队列中(但需注意，若内部执行代码时长 > setInterval 耗时则会被忽略)；

注意：定期清除，搭配 null 使用，即：timer = serInterVal 并 clearInterVal 后，timer = null；

问题：setInterval 设置的间隔时间过短时，若代码块里的代码并没有执行完也会重新开始执行(比如内部执行较大循环)；

解决：但使用 setTimeout 实现 setInterval 的效果就无此问题：必然会把代码块中的代码运行玩后，然后才会再次调用该函数；

```js
// 用 setTimeout 实现 setInterval
function timeoutBuildInterval() {
  timeoutBuildInterval.timer = setTimeout(() => {
    arguments[0]();
    timeoutBuildInterval(...arguments);
  }, arguments[1]);
}

timeoutBuildInterval.clear = function () {
  clearTimeout(timeoutBuildInterval.timer);
};

timeoutBuildInterval(() => {
  console.log(11111);
}, 1000);

setTimeout(() => {
  // 5s 后清理
  timeoutBuildInterval.clear();
}, 5000);
```



### 2-4-3、[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

注意：rAF 不属于宏任务也不属于微任务，它是独立于主线程之外的任务，不归主线程管；

传统的 JS 动画是通过定时器 `setTimeout ` 或 `setInterval` 实现，但定时器动画一直存在两个问题：

- 动画循时间环间隔不确定，间隔过长则动画显得不够平滑流畅，间隔过短则遇浏览器重绘频率瓶颈，推荐最佳循环间隔是`17ms`；
- 定时器第二个时间参数只指定多久后将动画任务添加到浏览器的UI线程队列中，而非执行；此时若 UI 线程忙碌，则动画不会立刻执行；

为了解决这些问题，H5 中加入了 `requestAnimationFrame` 及 `requestIdleCallback`

- `requestAnimationFrame` 会将每帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，且重绘或回流的时间间隔，跟随浏览器刷新频率
  - 此外：在隐藏/不可见元素中，`requestAnimationFrame` 将不会进行重绘或回流，即更少的 CPU、GPU 和内存使用量；
- `requestAnimationFrame` 是由浏览器专门为动画提供的 API，在运行时会自动优化方法的调用，且若页面非激活态，动画就会自动暂停，节省 CPU 开销；
- 注意：`requestAnimationFrame` 回调会在每一帧确定执行，属于高优先级任务，而 `requestIdleCallback` 回调则不一定，属于低优先级任务；
- 注意：所看到的网页，都是浏览器逐帧绘制，通常认为 FPS 60 时较流畅，而 FPS 为个位数时用户就会感知到卡顿；每帧包含用户的交互、JS 的执行、及requestAnimationFrame 调用，布局计算以及页面的重绘等工作；
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123857.png" style="zoom:50%;" align=""/>
- 假如某帧中要执行任务不多，在不到 16ms(1000/60)的时间内就完成了上述任务的话，则此帧就会有一定的空闲时间，这段时间就可用来执行requestIdleCallback
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123858.png" style="zoom:50%;" align=""/>

参数：cb：下次重绘前要执行的函数；

- cb 会被传入 [DOMHighResTimeStamp](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp) 参数；
- 其由 RAF 排队的回调开始触发的时间 (不明)；
- 其当前被 RAF 排序的回调函数被触发的时间 (不明)；

返回：返回值作为回调列表中唯一标识的非零整数，可传予 [window.cancelAnimationFrame()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelAnimationFrame) 取消回调；

优势：CPU节能：

- 当页面隐藏时，setTimeout 仍在后台执行，而 rAF 在页面未激活状态下，该页面屏幕绘制任务也会被系统暂停，因此跟着系统步伐走的 rAF 也会停止渲染；
- 当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销；

优势：函数节流：

- 在高频率事件(resize,scroll 等)中，为防止在一个刷新间隔内发生多次函数执行，使用 rAF 可保证每个绘制间隔内，函数只被执行一次，如此既能保证流畅性，又能更好的节省函数执行的开销；
- 因为一个绘制间隔内函数执行多次时没有意义的，因为显示器每16.7ms 绘制一次，多次绘制并无意义；

原理：系统每次绘制之前会主动调用 rAF 中的回调函数，由系统决定回调函数执行时机，并保证回调函数在屏幕每一次的绘制间隔中只被执行一次；

- 注意：刷新频率值因浏览器刷新频率不同而不同，通常执行次数：60次/s；
- 注意：大多数浏览器，会将暂停后台标签页/隐藏 iframe 中的 RAF 调用，以提升性能和电池寿命；
- 注意：RAF 只会在下次重绘前调用1次，若想连续调用需配合递归使用；
- 注意：如果同一帧中，存在多个 cb，则它们均会收一个相同时间戳(ms)，即便执行上一个 cb 已消耗一些时间；

兼容：

```js
// 使用 setTimeout 兼容 raf

// 简化版
// 没有考虑 cancelAnimationFrame 的兼容性，并且不是所有的设备绘制时间间隔都是 1000/60
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// 优化版
if (!Date.now) Date.now = function() { return new Date().getTime(); };
(function() {
    'use strict';
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

// https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
```

**<u>*RAF 实现 setInterval：*</u>**

```js
// 实现1
function setInterval2(cb, delay, ...args) {
  // 记录所有正在运⾏的 interval ⽤于撤销
  let pool = window[Symbol.for("IntervalPool")];
  if (!pool) {
    pool = {};
    window[Symbol.for("IntervalPool")] = pool;
  }
  // interval 最低 10ms，虽然每 frame ⾄少得 16ms
  delay = delay >= 10 ? delay : 10;
  // interval id
  let ticket = Date.now();
  // 每次 interval 开始时间
  let startTime = ticket;
  pool[ticket] = true;
  loop();
  return ticket;
  function loop() {
    if (!pool[ticket]) {
      return;
    }
    const now = Date.now();
    if (now - startTime >= delay) {
      startTime = now;
      cb(...args);
    }
    requestAnimationFrame(loop);
  }
}
function clearInterval2(ticket) {
  let pool = window[Symbol.for("IntervalPool")];
  if (pool && pool[ticket]) {
    delete pool[ticket];
  }
}




// 实现2
var timer = null;
function newSetInterval(callback, time, ...args){
  var set = function(callback, time, ...args){
    return function(){
      var start = +new Date();
      var end = start;
      while(end-start<time){
        end = +new Date();
      }
      callback(...args);
      timer = requestAnimationFrame(set(callback, time, ...args));
    }
  }
  set(callback, time, ...args)();
}
function newClearInterval(timer){
  cancelAnimationFrame(timer);
}

// 实践
$("#run").on("click", function(){
  newSetInterval(function(a, b){
    console.log(a+b);
  }, 500, 1, 2);
});
$("#stop").on("click", function(){
  console.log("stop", timer);
  newClearInterval(timer);
});
// https://segmentfault.com/q/1010000013909430
// https://blog.csdn.net/csm0912/article/details/84066966
```

**<u>*RAF 实现 setTimeout：*</u>**

```js
// 示例
var i = 0;
fun();
function fun() {
  console.log(i);
  if (i < 100) {
    requestAnimationFrame(fun);
  }
  i++;
}
// 封装
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
// https://blog.csdn.net/u011500781/article/details/51953217
```

RAF 和 setInterval 在浏览器标签页闲值时的频率(主因是浏览器的线程管理问题)：

- 详看：[文1](https://segmentfault.com/a/1190000000386368)、[文2](https://stackoverflow.com/questions/15871942/how-do-browsers-pause-change-javascript-when-tab-or-window-is-not-active)

RAF 使用示例：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123859.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123900.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123901.png" style="zoom:50%;" align=""/>



