# 三、Generator

**<u>意义：解决顺序性问题</u>**

优点：解决不符合大脑顺序、线性的思维方式问题；缺点：需要手动控制next()执行；



## 3-1、ES6 新增协议

### 3-1、可迭代协议

协议允许 Js 对象去定义或定制它们的迭代行为；比如：定义在一个 for...of 结构中，什么值可被循环得到；

注意：**<u>为变成可迭代对象，1个对象必须实现@@iterator方法；即此对象须有一名为 [Symbol.iterator] 的属性，其值为返回一个对象(须符合迭代器协议)的无参函数 (或对象原型链 prototype chain上的某个对象含有)；而当一个对象需要被迭代的时候 (比如开始用于一个for...of循环中) ，其 @@iterator 方法被调用，且无参数，最后返回一个用于在迭代中获得值的迭代器</u>**

其中：内置可迭代对象且有默认迭代行为如下 (注意：Object不符合可迭代协议，[但可实现](https://www.imooc.com/qadetail/265962?lastmedia=1))：

- Array
- Map
- Set
- String
- TypeArray
- 函数的 Arguments 对象
- NodeList 对象



### 3-2、迭代器协议

协议定义一种标准方式，来产生一个有限或无限序列的值；

比如：当1个对象被认为是1个迭代器时，其实现了1个next 方法(无参函数)，方法是返回一对象，对象拥有2个属性；

- **done：boolean**
  - 若迭代器已经过了被迭代序列时，则为 true，此时 value 可能描述了该迭代器的返回值；
  - 若迭代器可产生序列中的下1个值，则为 false，这等效于连同 done 属性也不指定；
- **value：any**
  - 迭代器返回的任何 JS 值，done 为 true 时可忽略；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092802.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908092803.png" style="zoom:50%;" align="" />



## 3-2、Generator

### 3-2-1、基本

**<u>Generator—生成器</u>** 是一个带 <u>星号</u> 的 "函数"(注意：但并非真正函数)，可通过  `yield` 关键字  <u>暂停执行</u> 和 <u>恢复执行</u>；其执行有这样几个关键点:

- 调用 gen() 后，程序会阻塞住，不会执行任何语句；
- 调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停；
- next 方法 <u>返回有两个属性的对象</u>：`value` 和 `done`；
  - 前者为`当前 yield 后面的结果`；
  - 后者表示`是否执行完`，遇到`return` 后，`done` 会由`false`变为`true`；

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



### 3-2-2、生成器的自动化实现

Generator执行方式为暂停-恢复、暂停-恢复…且每次执行都要手动调用 next，无法自动执行；且与异步无关联，但可用 thunk(偏函数) 和 promise 实现异步关联

### 3-2-2-1、thunk 自动化实现

```js
let isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
};
let isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
let isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
let isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]';
};
// ...
// 对上述进行合并
let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
}
// isString 和 isFunction 是由 isType 生产出来的函数，可以实现相同功能且代码简洁化
let isString = isType('String');
let isFunction = isType('Function');
// ...

isString("123");
isFunction(val => val);

// isType 函数即称为 thunk 函数: 其核心逻辑是接收一定的参数，生产出定制化的函数(类似工厂模式)，然后使用定制化的函数去完成功能
// thunk 函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作；
```

**<u>thunk 函数</u>**: 其核心逻辑是：**<u>接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能</u>**；虽然其实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作；

**<u>即将 thunk 是返回可传参函数的函数；此点可结合生成器，既然 thunk 返回函数，那传入回调，即可实现异步、一次执行等</u>**

**<u>thunk 关联 generator</u>**：

```js
// readFileThunk 就是一个 thunk 函数
// 异步操作核心的一环就是绑定回调函数，而 thunk 函数可以辅助实现；
// 首先传入文件名(参数)，然后生成一个针对某个文件的定制化函数，若在这个函数中传入回调参数，则此回调就会成为异步操作的回调；
// 即将其想象为 isType 函数 返回值是一个可传参的函数；
const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback);
  }
}

const gen = function* () {
  const data1 = yield readFileThunk('001.txt')
  console.log(data1.toString())
  const data2 = yield readFileThunk('002.txt')
  console.log(data2.toString)
}

let g = gen();
// 第一步: 由于进场是暂停的，我们调用next，让它开始执行。
// next 返回值中有一个 value 值，value 即 yield 后的结果，放在这里也就是是 thunk 函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用 next, 将结果作为参数传入，程序继续执行。
  // 同理，value 传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  })
})
```

```js
// 上述封装结果如下
function run(gen){
  const next = (err, data) => {
    let res = gen.next(data);
    if(res.done) return;
    res.value(next);
  }
  next();
}
run(g);
```



### 3-2-2-2、promise 自动化实现

```js
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      }else {
        resolve(data);
      }
    })
  }).then(res => res);
}
const gen = function* () {
  const data1 = yield readFilePromise('001.txt')
  console.log(data1.toString())
  const data2 = yield readFilePromise('002.txt')
  console.log(data2.toString)
}

let g = gen();
function getGenPromise(gen, data) { 
  return gen.next(data).value;
}
getGenPromise(g).then(data1 => {
  return getGenPromise(g, data1);
}).then(data2 => {
  return getGenPromise(g, data2)
})
```

```js
// 上述封装结果如下
function run(g) {
  const next = (data) => {
    let res = g.next();
    if(res.done) return;
    res.value.then(data => {
      next(data);
    })
  }
  next();
}
```



### 3-2-2-3、co 库自动化实现

```js
const co = require('co');
let g = gen();
co(g).then(res =>{
  console.log(res);
})
```



### 3-2-3、协程 

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



