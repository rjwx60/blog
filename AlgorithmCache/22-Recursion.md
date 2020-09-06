---
typora-root-url: ../../BlogImgsBed/Source
---



### 一、递归

递归，是一种解决问题的有效方法，在递归过程中，函数将自身作为子例程调用；

即自己调用自己；***<u>很多时候做题觉得麻烦或感觉 "想象不过来"，主要是自己和自己较真</u>***，此时交给递归吧，它自己会帮你完成需要做的；

<img src="/Image/Algorithm/Recursion/1.png" style="zoom:50%;" />

递归步骤：

- 寻找出口，递归一定有一个出口，锁定出口，保证不会死循环；
  - 一个简单的基本案例 —— 能够不使用递归来产生答案的终止方案；
  - 一组规则，也称作递推关系，可将所有其他情况拆分到基本案例；
- 递归条件，符合递归条件，自己调用自己；

递归经典：斐波那契数列、对象深克隆 Deep Clone；本例从选 Deep Clone 作为起始 ：实现对一个对象(object)的深度克隆：

- 寻找出口： 遍历对象结束后 return
- 递归条件： 遇到引用值 Array 或 Object

```js
// 所谓深度克隆，即当对象的某个属性值为 object 或 array 时，要获得一份 copy，而不是直接拿到引用值
function deepClone(origin,target) {  	// origin 是被克隆对象，target 是我们获得 copy
    var target = target || {}; 				// 定义target
    for(var key in origin) {  				// 遍历原对象
        if(origin.hasOwnProperty(key)) {
            if(Array.isArray(origin[key])) { // 如果是数组
                target[key] = [];
                deepClone(origin[key],target[key]) // 递归
            } else if (typeof origin[key] === 'object' && origin[key] !== null) {
                target[key] = {};
                deepClone(origin[key],target[key]) // 递归
            } else {
                target[key] = origin[key];
            }
        }
    }
    return target;
}
```

#### 1-1、递归示例

##### Q1、Array 数组的 flat 方法实现

题目：请写一个 flat 方法，实现扁平化嵌套数组：

```js
// 比如 [1,2,[3,4]] => [1,2,3,4]
Array.prototype.flat = function() {
    var arr = [];
    this.forEach((item,idx) => {
        if(Array.isArray(item)) {
            arr = arr.concat(item.flat()); // 递归去处理数组元素
        } else {
            arr.push(item)   // 非数组直接 push 进去
        }
    })
    return arr;   // 递归出口
}

// 或者
arr.prototype.flat = function() {
    this.toString().split(',').map(item=> +item )
}
// toString 方法，连接数组并返回一个字符串 '2,2,3,2,3,4'
// split 方法分割字符串，变成数组 ['2','2','3','2','3','4']
// map 方法，将 string 映射成为 number 类型`2,2,3,2,3,4
```

##### Q2 实现简易版的co，自动执行generator

题目：比如实现如下的功能：[从 Co 剖析和解释 generator 的异步原理](https://juejin.im/post/6844903648883900429)，剖析如下：

```js
const co = require('co');
co(function *() {
    const url = 'http://jasonplacerholder.typecoder.com/posts/1';
    const response = yield fetch(url);
    const post = yield response.json();
    const title = post.title;
    console.log('Title: ',title);
})
```

- 第一步找出口，执行器返回的iterator如果状态为`done`，代表结束，可以出去
- 递归条件： 取到下一个iterator，进行递归，自我调用

```js
function run(generat) {
    const iterator = generat();
    function autoRun(iteration) {
        if(iteration.done) {return iteration.value}  // 出口
        const anotherPromise = iteration.value;
        anoterPromise.then(x => {
            return autoRun(iterator.next(x))  // 递归条件
        })
    }
    return autoRun(iterator.next()) 
}
```

##### Q3、爬楼梯问题

题目：有一楼梯共M级，刚开始时在第一级，若每次只能跨上一级或二级，要走上第 M 级，共有多少种走法？

分析： 此问题要倒过来看，要到达 n 级楼梯，只有两种方式，从 (n-1) 级 或 (n-2) 级到达；

所以：可用递推思想去解题，假设有一个数组 s[n]，则 s[1] = 1 (于一开始就在第一级，只有一种方法)， s[2] = 1 (只能从s[1]上去 没有其他方法)；

那么：就可推出 s[3] ~ s[n] 了；

模拟：s[3] = s[1] + s[2]， 因为只能从第一级跨两步， 或第二级跨一步；

```js
function cStairs(n) {
    if(n === 1 || n === 2) {
        return 1;
    } else {
        return cStairs(n-1) + cStairs(n-2)
    }
}
```

##### Q4、二分查找

二分查找，即在一有序序列中查找某一个值，与掌门人爆气球玩法非常类似：

```js
A: 0 ~ 100 猜一个数字
B: 50
A: 大了
B: 25
A: 对头，就是25
```

二分查找有递归、非递归两种写法，递归方法：

- 设定区间，low & high；
- 寻找出口： 找到 target，返回 target；
- 否则寻找，当前次序没有找到，把区间缩小后递归；

```js
function binaryFind(arr,target,low = 0,high = arr.length - 1) {
    const n = Math.floor((low+high) /2);
    const cur = arr[n];
    if(cur === target) {
        return `找到了${target},在第${n+1}个`;
    } else if(cur > target) {
        return binaryFind(arr,target,low, n-1);
    } else if (cur < target) {
        return binaryFind(arr,target,n+1,high);
    }
    return -1;
}
```

非递归方法：即使用循环来实现二分查找，其实思路基本一致：

```js
function binaryFind(arr, target) {
    var low = 0,
        high = arr.length - 1,
        mid;
    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        if (target === arr[mid]) {
            return `找到了${target},在第${mid + 1}个`
        }
        if (target > arr[mid]) {
            low = mid + 1;
        } else if (target < arr[mid]) {
            high = mid - 1;
        }
    }
    return -1
}
```





#### 1-X、注意事项

##### 1-X-1、重复计算

- 注意：一些问题使用递归考虑，思路是非常清晰的，但却不推荐使用递归，比如下面几个问题，使用递归都有一个共同的缺点，那就是包含大量的重复计算，若递归层次较深，则会直接会导致 JS 进程崩溃：
  - <img src="/Image/Algorithm/Recursion/2.png" style="zoom:30%;" align="left"/>
  - [斐波拉契数列](http://www.conardli.top/docs/algorithm/递归和循环/斐波拉契数列.html)
  - [跳台阶](http://www.conardli.top/docs/algorithm/递归和循环/跳台阶.html)
  - [矩形覆盖](http://www.conardli.top/docs/algorithm/递归和循环/矩形覆盖.html)

- 解决：可使用 `记忆化` 的方法来避免重复计算，即开辟一个额外空间来存储已计算过的值，但却浪费一定内存空间；故上述问题一般使用动态规划求解；
- 所以，在使用递归前，一定要判断代码是否含有重复计算，若有则不推荐使用递归；







作者：Vincent Ko
链接：https://juejin.im/post/6844903656865677326

