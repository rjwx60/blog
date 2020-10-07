# 五、RXJS

## 5-1、传统异步问题

Race Condition - 竞态条件；

- 比如数据的异步获取导致状态先后问题；

Memory Leak - 内存泄露；

- 常规网站开发切换页面会重绘，内存会得到释放，而SPA网站则需注意(引擎升级的GC回收策略略过)；

Complex State - 复杂状态；

- 多个异步行为的叠加导致的复杂状态行为以及管理问题；

Exception Handling - 错误处理；

- 同步发生错误可通过 try-catch 捕获，而异步则不可；

Async APIS - 各种异步API；

- DOM Events、XMLHttpRequest、Fetch、WebSockets、
- Server Send Events、Service Worker、Node Stream、Timer

数据流的处理问题；

- Websocket



## 5-2、函数式编程

注意，此小节仅做了解，略读即可；

注意，此小节仅做了解，略读即可；

注意，此小节仅做了解，略读即可；

以函数作为主要载体的编程方式，用函数去拆解和抽象一般的表达式 

语义清晰、复用性高、维护性好、易于扩展、作用域包裹减少污染

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061649.png" alt="img" style="zoom:67%;" />

函数式写法一：表意清晰，易于维护/复用/扩展；

- 利用函数封装性将功能做拆解(粒度不唯一)，并封装为不同函数，而再利用组合的调用达到目的；

- 利用高阶函数，Array.map 代替 for…of 做数组遍历，减少中间变量和操作；

函数式写法二：容易造成横向延展，产生多层嵌套，可读性低，Bug 出现率上升；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061650.png" alt="img" style="zoom:67%;" />

改写：结构变得清晰；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061651.png" alt="img" style="zoom: 50%;" />

函数的嵌套和链式的对比还有一个很好的例子，即回调函数 和 Promise 模式：

- 随着回调函数嵌套层级和单层复杂度增加，它将会变得臃肿且难以维护，
- 而 Promise 的链式结构，在高复杂度时，仍能纵向扩展，而且层次隔离很清晰

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061652.png" alt="img" style="zoom: 50%;" />

###  5-2-1、 函数式编程模型 

- 闭包(Closure)，关于闭包定义、用途、弊端在前端核心已经讲得很清楚了，此处不再赘述
- 高阶函数：接受或者返回一个函数的函数称为高阶函数；
- 柯里化(Currying)：给定一函数的部分参数，生成一个接受其他参数的新函数； 比如：_.partial 函数，产生新的函数 relativeFromBase ，这个函数在调用时就相当于调用 path.relative ，并默认将第一个参数传入 BASE ，后续传入的参数顺序后置；柯里化可使开发者只关心函数部分参数，使函数用途更加清晰，调用更加简单；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061656.png" alt="img" style="zoom:67%;" />

 

- 组合(Composing)：将多个函数的能力合并，创造一个新函数，比如：_.flow 将转大写和转 Base64 的函数的能力合并，生成一个新函数；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007061657.png" alt="img" style="zoom:67%;" />

 







## 5-3、Rxjs

Rxjs 是一套借由 Observable 序列来组合非同步行为 & 事件基础程序的库；

- 注意：异步同步的处理方式只是 Rxjs "能解决" 的方面，而非 Rxjs 库所主要解决的问题；其独特的事件流 "推"+"订阅" 方式，能降低系统模块耦合度，减少程序状态，减少状态机(可利用 Operator 操作符将非关注内容过滤掉，减少IfElse，减少状态机减少 Bug)，才是它主要解决的问题；而这也是所有有价值框架或者软件的主要需要解决的问题之一；
- 注意：此优点并非 Rxjs 库独有，而是它采用了函数式编程方式编写，是有 FP 特点附加的；

Rxjs 引用了2个重要思想：函数式编程、响应式编程：

- 函数式编程(Functional Programming)
  - Deeclarative - 声明式：不管传入什么数据，均能返回相同形式处理后的数据；
  - Pure Function - 纯函数：函数执行由输入参数决定(即不受除参数意外的任何数据影响)、函数不修改任何外部状态，即不改变传入参数；
    - 此外，满足纯函数特性亦称，Referential Transparency - 引用透明；
    - 优势：极利于单元测试；
  - Immutability - 数据不可变性：只要传参相同，返回结果必定相同、不可修改传入数据；
  - 优势：可读性好、可维护性高、易于并行管理，不用处理IO，没有副作用，不用担心死锁；
  - 区别：与面向对象编程相比：
    - 前者：数据即数据，函数即函数，函数不改变原数据，而是产生新数据作为结果；
    - 后者：将数据封装在类的实例对象中，隐藏数据，提供实例方法读取或修改；
- 响应式编程(Reactive Programming)
  - 解释：即当数据或资源发生改动时，其使用到的地方能即时做出响应；
    - 发生改动 => 非同步：无法得知时刻，通知
    - 改动后立即响应 => 自动同步；
  - Reactive Extension - Rx - 可通过监听流来做异步编程的API；
    - 数据流抽象很多问题；
    - 擅长处理异步操作；
    - 将复杂问题简单化组合；
    - 有诸多实现，RxJava、Rxjs 等；

其他：[FRP介绍](https://www.youtube.com/watch?v=Agu6jipKfYw)、[Rxjs文档](https://www.learnrxjs.io/)、[Rxjs各类操作符](https://reactive.how/)、[Rxjs知乎](https://www.zhihu.com/topic/20036245/hot)

区别：与 Promise 区别

- 前者支持多种操作符(Operators)，且与时间维度相关，乃多次异步；
- 前者是懒惰的，observable对象建立并不立即输出值，而是等到 subscribe 时才开始输出；
- 后者功能相对单⼀、乃单次异步，只能 resolve一次，输出单值，后者则能输出多值；
- [更多二者区别：RxJS Observables vs Promises](https://link.zhihu.com/?target=https%3A//egghead.io/lessons/rxjs-rxjs-observables-vs-promises)；

注意：不要强行使用(为了用而用) Rxjs，需根据相关情况来具体使用(团队、应用复杂度、测试、必要性、性能等)；

缺点：基于发布订阅模式，代码置于黑盒中，很难调试；





### 5-3-1、Observable

RXJS 是 Observable 的 JS 实现，而 RxJS 整个库的基础就是 Observable(非 Observer，有别于观察者模式)；Observable 表示一个可观察对象，表示一个可调用的未来值或事件的集合，其融合了2种设计思想模式：

- Observer Pattern：事件发布、监听注册、发生时自动执行，比如 DOM Event，低耦合；

- Iterator Pattern
  - Iterator 为能遍历数据集合的对象，通用方法：next；
  - 可用于延迟运算，处理大数据结构，因其本身为序列，可配合 map、filter 等使用；

`Observable` 方法接收一个函数参数，而此函数接收一个含有 `next`, `error`, `complete` 等属性的对象参数；而此对象是 `Observable` 实例却是在调用 `subscribe` 方法时才传进去；Observable 模拟实现：[200行实现 Observable](https://zhuanlan.zhihu.com/p/146795979?utm_source=wechat_session&utm_medium=social&utm_oi=78859378622464)

```js
import { Observable } from 'rxjs';
// Observable 接收一个函数作为参数
const dataStream$ = new Observable(observer => {
  observer.next(1);
  setTimeout(() => {
    observer.next(2);
    observer.complete();
  }, 1000)
  observer.next(3);
});

const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}
// 函数接收一个特殊对象，在 Observable 调用 subscribe 时传入
dataStream$.subscribe(observer);

// 1、Observable 模拟实现
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  // observer 特殊对象，subscribe 调用时传入
  subscribe(observer) {
    // 交由定义时传入的方法处理
    this._subscribe(observer);
  }
}



import { of } from 'rxjs';
const dataStream$ = of(1, 2, 3)
const observer = {
  next: x => console.log(x),
  error: err => console.error(err),
  complete: () => console.log('done'),
}
dataStream$.subscribe(observer);

// 2、Of 模拟实现
export function of(...args) {
  return new Observable(observer => {
    args.forEach(arg => {
      observer.next(arg);
    })
    observer.complete();
  })
}
```

Observable.subscribe 可传入一个方法作为参数，将模拟的 `subscribe` 适当改造一下

```js
import { of } from 'rxjs';
const dataStream$ = of(1, 2, 3)
dataStream$.subscribe(console.log);

// 改造
export class Observable {
  _subscribe;
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    const defaultObserver = {
      next: () => { },
      error: () => { },
      complete: () => { }
    }
    if (typeof observer === 'function') {
      return this._subscribe({ ...defaultObserver, next: observer });
    } else {
      return this._subscribe({ ...defaultObserver, ...observer });
    }
  }
}
```









Observable：负责数据/事件产生、是发布者、Publisher + Iterator、并控制调用 subscribe 时刻；用于事件处理、异步编程、处理多个值、状态管理、可发布任意类型值，无关其同/异步状态、各种流、亦或定时器；

subscribe：Observable 对象函数，由 Observable 调用，用以关联上下两者；

Observer：数据处理、事件处理、观察者；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092840.png" style="zoom:50%;" align="" />

二态：Observable 只有 2 种状态，正常 & 出错/完结态；

退订：通过发布者 - 被订阅 - 观察者绑定关系式的返回值来退订；

[退订与完成区别](https://stackoverflow.com/questions/52198240/rxjs-difference-between-complete-and-unsubscribe-in-observable)：不想监听可调用 unsubscribe，任务结束/终止可调用 complete (非下面的 complete 事件)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092841.png" style="zoom:50%;" align="" />

分类：Hot Observable & Cold Observable

- 定义：冷热相对于生产者而言，若订阅时，已有生产者准备好，即为 Hot；
- 而若：每次订阅均需产生一个新的生产者则为 Cold；
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092842.png" style="zoom:50%;" align="" />





### 5-3-2、适用场景

Rxjs 适用于复杂场景下的异步操作：

- WebSocket(字节流) 数据流处理、
- 不同数据源的更新需求(Wb与Ajax共用)、
- 复杂应用逻辑(数据层级：如有大量异步数据更新且数据间还存在相互依赖的关系的大型应用)、
- 业务实体间有依赖关系的系统(实体层级)、富事件驱动的场景(要处理各种键盘事件、鼠标事件等)；

比如：基于 websocket 的聊天信息的间隔批量渲染；

```js
// JS 原生实现
// 需要维护一队列池和一定时器，收到消息，先放进队列池，然后定时器负责把消息渲染
let messagePool = []
ws.on('message', (message) => {
    messagePool.push(message)
})

setInterval(() => {
    render(messagePool)
    messagePool = []
}, 1000)

// Rxjs 实现
Rx.Observable
    .fromEvent(ws, 'message')
    .bufferTime(1000)
    .subscribe(messages => render(messages))
```

比如：特定按键顺序触发事件机制(彩蛋)

```js
// JS 原生实现
// 需要维护一个队列，队列中放入最近 12 次用户输入，然后每次按键时都要去识别
// 略

// Rxjs 实现
const code = [
   "ArrowUp",
   "ArrowUp",
   "ArrowDown",
   "ArrowDown",
   "ArrowLeft",
   "ArrowRight",
   "ArrowLeft",
   "ArrowRight",
   "KeyB",
   "KeyA",
   "KeyB",
   "KeyA"
]
Rx.Observable.fromEvent(document, 'keyup')
    .map(e => e.code)
    .bufferCount(12, 1)
    .subscribe(last12key => {
        if (_.isEqual(last12key, code)) {
            console.log('First to the Egg!!')
        }
    })
```

比如：上述附加要求：只有在两秒内连续输入秘籍，才能触发彩蛋

```js
// JS 原生实现
// 需要维护一个队列，队列中放入最近 12 次用户输入，然后每次按键且两次间隔通过定时器判断(或 new Date)，先不说实现与否，性能消耗巨大
// 略

// Rxjs 实现
// RxJS v6+
import { fromEvent } from 'rxjs';
import { map, bufferCount, timeInterval, tap } from 'rxjs/operators';

const isArrayEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((cv, index) => cv === arr2[index]);
};

const isTimeOut = (resultArr: any[], timeout = 3000): (boolean | any) => {
  let totaltime = 0;
  //  只处理前 11 个值，因为计算的是当前值与前一个值的间隔，第 13 个之前的数值无需理会，故忽略第1个
  for (let i = 1; i < resultArr.length; i++) {
    totaltime += resultArr[i].interval;
  }
  return totaltime < timeout ? resultArr.map(cv => cv.value) : false;
};

// 方式1: 循环监听、性能有点差
const fromEvent21 = fromEvent(document, 'keyup').pipe(
  map((event: KeyboardEvent) => event.code),
  // 收集发出的值，直到所提供的时间过去为止，以数组形式发出
  bufferTime(2000),
);
fromEvent21.subscribe(last12key => {
  if (isArrayEqual(last12key, codeMap)) {
    console.log('First to the egg \(^o^)/~');
  }
});

// 方式2: 加入时间戳，不够优雅与函数式子
const fromEvent22 = fromEvent(document, 'keyup').pipe(
  map((event: KeyboardEvent) => {
    return {
      code: event.code,
      timestamp: Date.now()
    };
  }),
  // 收集缓冲区并在指定数量的值后, 作为数组发出
  bufferCount(12, 1),
);
fromEvent22.subscribe(last12key => {
  if (isArrayEqual(last12key, codeMap)) {
    console.log('First to the egg \(^o^)/~');
  }
});

// 方式3: 通过获取每个键值间的停留时间，然后再累加计算，并判断是否超时
const fromEvent22 = fromEvent(document, 'keyup').pipe(
  map((event: KeyboardEvent) => event.code),
  timeInterval(),
  tap(),
  // 收集缓冲区并在指定数量的值后, 作为数组发出
  bufferCount(12, 1),
);
fromEvent22.subscribe(last12key => {
  const result = isTimeOut(last12key);
  if (!result) {
    return;
  }
  if (isArrayEqual(result, codeMap)) {
    console.log('First to the egg \(^o^)/~');
  }
});
```

比如：输入框用户输入 a，然后 300 毫秒后输入 b，发送两个请求，一个请求查询 a 相关的热词，一个请求查询 ab 相关的热词，并保证这两个请求响应的顺序

```js
import { fromEvent } from 'rxjs';
import { map, bufferCount, timeInterval, tap } from 'rxjs/operators';

const search = fromEvent(document, 'keypress').pipe(
  	debounce(250),
    map(key =>
        getJSON('/search?q=' + input.value)
        .retry(3)
        .takeUntil(keyPresses)
       )
    .concatAll()
)
search.forEach(
    results => updateUI(results),
    error => showMessage(error)
)
```







## 5-3、Concepts

### 5-3-1、Observable

An observable represents a stream, or source of data that can arrive over time

```js
// import the fromEvent operator
import { fromEvent } from 'rxjs';

// grab button reference
const button = document.getElementById('myButton');

// create an observable of button clicks
const myObservable = fromEvent(button, 'click');
```

At this point we have an observable but it's not doing anything. 

This is because observables are cold, or do not activate a producer (like wiring up an event listener)



### 5-3-2、Subscriptions

Subscriptions are what set everything in motion(运转). 

You can think of this like a faucet(水龙头), you have a stream of water ready to be tapped (observable), someone just needs to turn the handle. In the case of observables, that role belongs to the `subscriber`.

To create a subscription, you call the `subscribe` method, supplying a function (or object) - also known as an `observer`. This is where you can decide how to react(-ive programming)(响应式编程) to each event.

```js
// import the fromEvent operator
import { fromEvent } from 'rxjs';

// grab button reference
const button = document.getElementById('myButton');

// create an observable of button clicks
const myObservable = fromEvent(button, 'click');

// for now, let's just log the event on each click
const subscription = myObservable.subscribe(event => console.log(event));
```

In the example above, calling `myObservable.subscribe()` will:

1. Set up an event listener on our button for click events.
2. Call the function we passed to the subscribe method (observer) on each click event.
3. Return a subscription object with an `unsubscribe` which contains clean up logic, like removing appropriate event listeners.

The subscribe method also accepts an object map to handle the case of error or completion. You probably won't use this as much as simply supplying a function, but it's good to be aware of should the need arise:

```js
// instead of a function, we will pass an object with next, error, and complete methods
const subscription = myObservable.subscribe({
  // on successful emissions
  next: event => console.log(event),
  // on errors
  error: error => console.log(error),
  // called once on completion
  complete: () => console.log('complete!')
});
// It's important to note that each subscription will create a new execution context. This means calling subscribe a second time will create a new event listener:
```

By default, a subscription creates a one on one, one-sided conversation between the observable and observer. This is like your boss (the observable) yelling (emitting) at you (the observer) for merging a bad PR. This is also known as unicasting(单播). If you prefer a conference talk scenario - one observable, many observers - you will take a different approach which includes multicasting(多播) with `Subjects` (either explicitly or behind the scenes).

It's worth noting that when we discuss an Observable source emitting data to observers, this is a push based model(基于推送模型). The source doesn't know or care what subscribers do with the data, it simply pushes it down the line.



### 5-3-3、Opeartors

Operators offer a way to manipulate values from a source, returning an observable of the transformed values. Many of the RxJS operators will look familiar if you are used to JavaScripts `Array` methods

```js
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
/*
 *  'of' allows you to deliver values in a sequence
 *  In this case, it will emit 1,2,3,4,5 in order.
 */
const dataSource = of(1, 2, 3, 4, 5);

// subscribe to our source observable
const subscription = dataSource
  .pipe(
    // add 1 to each emitted value
    map(value => value + 1)
  )
  // log: 2, 3, 4, 5, 6
  .subscribe(value => console.log(value));



import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

const dataSource = of(1, 2, 3, 4, 5);

// subscribe to our source observable
const subscription = dataSource
  .pipe(
    // only accept values 2 or greater
    filter(value => value >= 2)
  )
  // log: 2, 3, 4, 5
  .subscribe(value => console.log(value));
```



## 5-4、Subjects

Subjects 是一种特殊的Observable类型，在观察者之间共享一个执行路径；

You can think of this as a single speaker talking at a microphone in a room full of people. Their message (the subject) is being delivered to many (multicast) people (the observers) at once. This is the basis of multicasting(多播/组播). Typical observables would be comparable to a 1 on 1 conversation.

- **Subject** - No initial value or replay behavior(无初始值或重载行为)；

- **AsyncSubject** - Emits latest value to observers upon completion(在完成时向观察者发送最新值).
- **BehaviorSubject** - Requires an initial value and emits its current value (last emitted item) to new subscribers.
- **ReplaySubject** - Emits specified number of last emitted values (a replay) to new subscribers.

```js
/*
                   s1    n(r)   n(x)    s2     n(j)   c    n(s)
Subject            
        s1         ^-----r------x--------------j------|----------
        s2         ---------------------^------j------|----------
AsyncSubject       
        s1         ^----------------------------------j|---------
        s2         ---------------------^-------------j|---------
BehaviorSubject    
        s1         ^a----r------x--------------j------|----------
        s2         ---------------------^x-----j------|----------
ReplaySubject      
        s1         ^-----r------x--------------j------|----------
        s2         ---------------------^r-x---j------|----------
*/
// Subject 普通的多播发布器
// BehaviorSubject 一旦订阅 subscribe 就会得到初始值，除此以外，当 next 时，与普通 subject 行为类似
// ReplaySubject 二次订阅时，才真正输出，输出首次订阅时一直缓存的值，当 next 时，与普通 subject 行为类似，分属两个输出
// AsyncSubject 完成时才触发，输出最后一个值；

// RxJS v6+
import { Subject, AsyncSubject, BehaviorSubject, ReplaySubject } from 'rxjs';

const subject = new Subject();
const asyncSubject = new AsyncSubject();
const behaviorSubject = new BehaviorSubject('a');
const replaySubject = new ReplaySubject(2);

// subjects 数组
const subjects = [subject, asyncSubject, behaviorSubject, replaySubject];
const log = subjectType => e => console.log(`${subjectType}: ${e}`);

console.log('SUBSCRIBE 1');
subject.subscribe(log('s1 subject'));
asyncSubject.subscribe(log('s1 asyncSubject'));
behaviorSubject.subscribe(log('s1 behaviorSubject'));
replaySubject.subscribe(log('s1 replaySubject'));
// SUBSCRIBE 1
// s1 behaviorSubject: a
// behaviorSubject 一旦订阅 subscribe 就会得到初始值

console.log('\nNEXT(r)');
subjects.forEach(o => o.next('r'));
// NEXT(r)
// s1 subject: r
// s1 behaviorSubject: r
// s1 replaySubject: r
// 当 next 时，与普通 subject 行为类似


console.log('\nNEXT(x)');
subjects.forEach(o => o.next('x'));
// NEXT(x)
// s1 subject: x
// s1 behaviorSubject: x
// s1 replaySubject: x
// 当 next 时，与普通 subject 行为类似


console.log('\nSUBSCRIBE 2');
subject.subscribe(log('s2 subject'));
asyncSubject.subscribe(log('s2 asyncSubject'));
behaviorSubject.subscribe(log('s2 behaviorSubject'));
replaySubject.subscribe(log('s2 replaySubject'));
// SUBSCRIBE 2
// s2 behaviorSubject: x
// s2 replaySubject: r
// s2 replaySubject: x

console.log('\nNEXT(j)');
subjects.forEach(o => o.next('j'));
// NEXT(j)
// s1 subject: j
// s2 subject: j
// s1 behaviorSubject: j
// s2 behaviorSubject: j
// s1 replaySubject: j
// s2 replaySubject: j

console.log('\nCOMPLETE');
subjects.forEach(o => o.complete());
// COMPLETE
// s1 asyncSubject: j
// s2 asyncSubject: j
// asyncSubject 完成时才发送，发送最后一个值

console.log('\nNEXT(s)');
subjects.forEach(o => o.next('s'));
// NEXT(s)
// 结束订阅后便不再接收值
```



## 5-5、Operators

参考：https://www.zhihu.com/question/303073602

参考：https://zhuanlan.zhihu.com/p/146795979

参考：https://www.zhihu.com/question/277530559





