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

