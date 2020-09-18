# 四、Async/Await

**<u>意义：解决 Generator 需手动控制 next 执行的问题(真正实现用同步方式书写异步代码)</u>**



## 4-1、基本

**<u>Async</u>**：是一个通过异步执行并隐式 **<u>返回 Promise 作为结果</u>** 的函数；<u>是 协程 和 Promise 的组合体</u>，完全解决了基于传统回调的异步流程存在的两个问题(见上方)，能够像 co + Generator 一样用同步的方式来书写异步代码，又得到底层的语法支持，无需借助任何第三方库；

Await：暂停异步函数的执行；注意 await 只能与 Promise 共用，无法与传统回调共用，await 等待 Promise 完成并返回其结果；

- 优点：解决了 Generator 需要手动控制 next 执行的问题；
- 优点：真正实现用同步的方式书写异步代码，逻辑和数据依赖清晰；
- 优点：无需写 .then、无需写匿名函数处理 Promise 的 resolve 值、无需定义多余变量、避免代码嵌套、提高可读性；
- 缺点：错误处理过于安静，往往需要用 try-catch 来捕获；

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

Async/Await 利用 `协程` 和 `Promise ` 实现同步方式编写异步代码的效果，其中 `Generator` 是对 `协程` 的一种实现，虽然语法简单，但引擎在背后做了大量的工作，用 `async/await` 写出的代码也更加优雅、美观，相比于之前的 `Promise` 不断调用then的方式，语义化更加明显；相比于`co + Generator`性能更高，上手成本也更低；




## 4-2、实现

Promise 一旦新建即立即执行则无法停止，错误需通过回调函数来捕获，而 async/await 可进行更细粒度的操作；

而 async/await 实际上是对 Generator(生成器) 的封装，是一个语法糖，为何前者盛行是因为后者刚出现不久就被前者取代；

```javascript
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
```



### 4-2-1、Generator 简介

ES6 的 Generator 函数，可通过 yield 关键字，将函数执行挂起，并通过 next 方法切换到下一状态，以改变执行流程；

```javascript
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



### 4-2-2、与 Generator 区别

- async/await 自带执行器，无需手动调用 next 方法即可自动执行下一步；
- async 函数返回值为 Promise 对象，Generator 则是生成器对象；
- await 能返回 Promise 的 resolve/reject 值；



### 4-2-3、基于 Generator 的实现

```javascript
// 1、让 Generator 类似 Async 行为第1步：让 yield(await) 能返回 resolve 值
function* myGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}
// 手动执行迭代器
const gen = myGenerator()
gen.next().value.then(val => {
  gen.next(val).value.then(val => {
    gen.next(val).value.then(val => {
      gen.next(val)
    })
  })
})


// 2、让 Generator 类似 Async 行为第2步：自动调用并输出(通过封装递归执行函数实现)
function run(gen) {
  var g = gen()   
  function _next(val) {             // 通过内部函数递归执行 g.next()
    var res = g.next(val)           // 获取迭代器对象 res，并传入上轮 resolve 出的值
    if(res.done) return res.value   // 根据 Generator 迭代器对象的值来作为递归终止判断
    res.value.then(val => {         // 通过 Promise 的 then 方法实现自动迭代
      _next(val)                    // 等待 Promise 完成就自动执行下一个 next，并传入 resolve 的值
    })
  };
  _next();
}
run(myGenerator)




// 3、让 Generator 类似 Async 行为第3步：返回 Promise、增加错误处理、基本类型值也能实现
function run(gen) {
  // 将返回值包装成 Promise
  return new Promise((resolve, reject) => {
    var g = gen()
    function _next(val) {
      // 用 tryCatch 实现错误处理
      try {
        var res = g.next(val) 
      } catch(err) {
        return reject(err); 
      }
      // 递归结束
      if(res.done) {
        return resolve(res.value);
      }
      // 利用 Promise 特性处理基本类型值，以兼容 yield 后面跟基本类型的情况
      // 将 res.value 包装为 Promise
      Promise.resolve(res.value).then(
        val => {
          _next(val);
        }, 
        err => {
          // 抛出错误
          g.throw(err)
        });
    }
    _next();
  });
}




// 4、测试
function* myGenerator() {
  try {
    console.log(yield Promise.resolve(1)) 
    console.log(yield 2)   //2
    console.log(yield Promise.reject('error'))
  } catch (error) {
    console.log(error)
  }
}
const result = run(myGenerator) // result是一个Promise
// 输出 1 2 error
```



### 4-2-4、Async 的 Babel 转译

```javascript
// 相当于 run()
function _asyncToGenerator(fn) {
  // return 一个 function，和 async 保持一致，而 run 直接执行了 Generator，略不符规范
  return function() {
    var self = this
    var args = arguments
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      // 相当于 _next()
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      // 处理异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}


// 测试
const foo = _asyncToGenerator(function* () {
  try {
    console.log(yield Promise.resolve(1))   //1
    console.log(yield 2)                    //2
    return '3'
  } catch (error) {
    console.log(error)
  }
})
foo().then(res => {
  console.log(res)                          //3
})
```





## 4-3、注意事项

### 4-3-1、forEach + await

```js
// 问题: 对于异步代码，forEach 并不能保证按顺序执行
async function test() {
	let arr = [4, 2, 1]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('结束')
}
function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}
test()
// 结束 1 2 4


// 原因:
// forEach 核心逻辑
// forEach 直接执行，无法保证异步任务的执行顺序
for (var i = 0; i < length; i++) {
  if (i in array) {
    var element = array[i];
    callback(element, i, array);
  }
}


// 解决: 使用 for...of
async function test() {
  let arr = [4, 2, 1]
  for(const item of arr) {
	const res = await handle(item)
	console.log(res)
  }
	console.log('结束')
}
// 4 2 1 结束


// 原理: for of 采用一种特别的手段——迭代器去遍历
// 且数组是一种可迭代数据类型: 原生具有[Symbol.iterator]属性数据类型为可迭代数据类型。如数组、类数组（如arguments、NodeList）、Set和Map
// 可迭代对象可以通过迭代器进行遍历:
let arr = [4, 2, 1];
// iterator 即迭代器
let iterator = arr[Symbol.iterator]();
console.log(iterator.next());
// {value: 4, done: false}
console.log(iterator.next());
// {value: 2, done: false}
console.log(iterator.next());
// {value: 1, done: false}
console.log(iterator.next());
// {value: undefined, done: true}


// 所以: 最初版本可通过以下实现
async function test() {
  let arr = [4, 2, 1]
  let iterator = arr[Symbol.iterator]();
  let res = iterator.next();
  while(!res.done) {
    let value = res.value;
    console.log(value);
    await handle(value);
    res = iterater.next();
  }
	console.log('结束')
}
// 4
// 2
// 1
// 结束
```

**<u>注意：生成器本身就是一个 迭代器</u>**，所以可以用 for...of 遍历；

```js
function* fibonacci(){
  // 1
  let [prev, cur] = [0, 1];
  console.log(cur);
  // 死循环
  while(true) {
    [prev, cur] = [cur, prev + cur];
    // 输出
    yield cur;
  }
}
// 用 for of 代替人工执行
for(let item of fibonacci()) {
  if(item > 50) break;
  console.log(item);
}
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
```



## 4-x、示例与

### 4-x-1、示例1

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092804.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092805.png" style="zoom:50%;" align="" />

### 4-x-2、示例2

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092806.png" style="zoom:50%;" align="" />

### 4-x-3、注意1

- 若不使用await，异步函数会被同步执行

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092807.png" style="zoom:50%;" align="" />



### 4-x-4、注意2

- async-await 主要解决的就是将异步问题同步化，降低异步编程的认知负担；
- async-await 是 promise 和 generator 的语法糖，故无法取代 Promsie 地位，如并行执行需要结合 Promise.all；
- async 函数执行后，总是返回一个 promise 对象，可调用 then 等方法，而里面 await 所在的行的语句是同步的；
- async 函数即将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await；
- async 函数的实现，即将 Generator 函数和自动执行器，包装在一个函数中；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092808.png" style="zoom:50%;" align="" />



### 4-x-5、注意3

- 同 Generator 函数一样，async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092809.png" style="zoom:50%;" align="" />



### 4-x-6、注意4

- await 命令后面的 Promise 对象，运行结果可能是 rejected，故最好将 await 命令放在 try...catch 中，try..catch 错误处理也比较符合我们平常编写同步代码时候处理的逻辑
- await 调用，是让其后的语句做一个递归执行，直到获取到结果并使其状态变更，才会 resolve 掉，而只有 resolve 掉，await 那行代码才算执行完，才继续往下一行执行
- awaiit 后面跟 promsie 才能有线程效果，且 promise 内必须加 resolve

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092810.png" style="zoom:50%;" align="" />



### 4-x-7、注意5

- async + 函数 的原型是一个 [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)，而紧跟 async 后的函数最终返回的是 Promise，

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092811.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092812.png" style="zoom:50%;" align="" />

- 即便函数 return 某些值，但最终都会封装成 Promsie

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092813.png" style="zoom:50%;" align="" />

