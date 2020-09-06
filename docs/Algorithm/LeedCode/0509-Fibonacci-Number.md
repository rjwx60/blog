#### [509. Fibonacci Number](https://leetcode-cn.com/problems/fibonacci-number/)

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

```
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), for N > 1.
```

Given `N`, calculate `F(N)`.



#### Example：

```
Input: 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.

Input: 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.

Input: 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.
```



#### Note:

0 ≤ `N` ≤ 30.



#### Code1：2020-07-13

```javascript
/**
 * @param {number} N
 * @return {number}
 */
var fib = function(N) {
    if(N > 1) return fib(N - 1) + fib(N - 2);
    return N === 1 ? 1 : 0;
};
// 执行用时： 92 ms , 在所有 JavaScript 提交中击败了 26.00% 的用户 
// 内存消耗： 33.6 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

var fib = function(N) {
    if(N < 2) return N
    return fib(N - 1) + fib(N - 2);
};
// 执行用时： 92 ms , 在所有 JavaScript 提交中击败了 26.00% 的用户 
// 内存消耗： 33.9 MB , 在所有 JavaScript 提交中击败了 84.00% 的用户

let map = new Map(), sum = 0;
map.set(0,0); map.set(1,1);
var fib = function(N) {
  sum = realFib(N);
  map.set(N, sum);
  return sum;
  function realFib(M) {
    if(map.has(M)) return map.get(M);
    return realFib(M - 1) + realFib(M - 2);
  }
};
// 执行用时： 68 ms , 在所有 JavaScript 提交中击败了 70.84% 的用户 
// 内存消耗： 32.1 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户



let map = new Map(), sum = 0, value = 0;
map.set(0,0); map.set(1,1);
var fib = function(N) {
  sum = realFib(N);
  map.set(N, sum);
  return sum;
  function realFib(M) {
    // 存在即返回
    if(map.has(M)) return map.get(M);
    value = realFib(M - 1) + realFib(M - 2);
    // 对未加入 map 的值进行存储
    map.set(M, value);
    return value;
  }
};
// 执行用时： 64 ms , 在所有 JavaScript 提交中击败了 85.24% 的用户 
// 内存消耗： 31.7 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 不难，难在如何提升速度
```



#### More：

##### More1：

作者：cctt-2
链接：https://leetcode-cn.com/problems/fibonacci-number/solution/di-gui-dong-tai-gui-hua-by-cctt-2/

作者：ziogie
链接：https://leetcode-cn.com/problems/fibonacci-number/solution/dong-tai-gui-hua-jie-ti-by-wei-san-dou-mi-zhe-yao/

```javascript
// 1、暴力
var fib = function(N) {
    if(N==0)return 0;
    if(N==1)return 1;
    return fib(N-1)+fib(N-2);
};

// 2、缓存值: 如 Code1 思路(但不是最佳)

// 3-1、动态规划: 数组存放所有值，返回最后一个即可
var fib = function(N) {
    var dp=[0,1,1];
    for(var i=3;i<=N;i++){
        dp[i]=dp[i-1]+dp[i-2];
    }
    return dp[N];
};
// 3-2、动态规划: 设置一个缓存res，res[i] = res[i-1] + res[i-2] ,每次遍历的结果都存放在res中，最后返回即可
var fib = function(N) {
  var res = new Array(N+1)  //用于缓存
  for (let i = 0; i < N+1; i++) {
    if (i < 2) {
      res[i] = i 
    } else {
      res[i] = res[i-1] + res[i-2]
    }
  }
  return res[N]
};


// 4、动态规划优化: 优化上述方法：只需要存放前两个值即可，减小空间消耗
var fib = function(N) {
    if(N==0)return 0;
    if(N==2||N==1)return 1;
    var prev=1,curr=1;
    for(var i=3;i<=N;i++){
        var sum=prev+curr;
        prev=curr;
        curr=sum;
    }
    return curr;
};
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/fibonacci-number/solution/



#### Top：

```javascript
// top1: 40ms
let resMap = {
    0:0,
    1:1
}
var fib = function(N) {
    if(resMap[N] == undefined) resMap[N] = fib(N-1) + fib(N-2)
    return resMap[N]
};

// top2: 44ms
var fib = function (N) {
    let cache = [0, 1]
    for (let i = 2; i <= N; i++) {
        cache[i] = cache[i - 1] + cache[i - 2]
    }
    return cache[N]
};

// top3: 48ms
var fib = function(N) {
    var fibArr =  [0, 1, 1];
    if(N <= 2) return fibArr[N];
    for(var i=2; i < N; i++) {
        fibArr[i+1]=fibArr[i] + fibArr[i-1]
    }
    return fibArr[N]
};

// top4: 52ms
var fib = function(N) {
    if (N <= 1) return N;
    let first = 0;
    let second = 1;
    for(let i = 0; i< N-1; i++) {
        const sum = first + second;
        first = second;
        second = sum;
    }
    return second;
};


// 56ms
var fib = function(N) {
    if (N < 2) return N;
    var arr = [0, 1];
    for (var i = 2; i <= N; i++){
        arr[i] = arr[i - 1] + arr[i - 2];
    }
    return arr[N];
};
```



#### Think：

#### Expand：

