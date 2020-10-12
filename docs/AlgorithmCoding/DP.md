# 一、动态规划

[动态规划](https://zhuanlan.zhihu.com/p/91582909?utm_source=wechat_session&utm_medium=social&utm_oi=78859378622464)，无非就是利用**历史记录**，来避免我们的重复计算。而这些**历史记录**，我们得需要一些**变量**来保存，一般是用**一维数组**或者**二维数组**来保存。下面我们先来讲下做动态规划题很重要的三个步骤，

**第一步骤**：**定义数组元素的含义**；我们会用一个数组，来保存历史数组，假设用一维数组 dp[] 吧。这个时候有一个非常非常重要的点，就是规定你这个数组元素的含义，例如你的 dp[i] 是代表什么意思？

**第二步骤**：**找出数组元素之间的关系式**；我觉得动态规划，还是有一点类似于我们高中学习时的**归纳法**的，当我们要计算 dp[n] 时，是可以利用 dp[n-1]，dp[n-2].....dp[1]，来推出 dp[n] 的，也就是可以利用**历史数据**来推出新的元素值，所以我们要找出数组元素之间的关系式，例如 dp[n] = dp[n-1] + dp[n-2]，这个就是他们的关系式了。而这一步，也是最难的一步，后面我会讲几种类型的题来说。

> 学过动态规划的可能都经常听到**最优子结构**，把大的问题拆分成小的问题，说时候，最开始的时候，我是对**最优子结构**一梦懵逼的。估计你们也听多了，所以这一次，我将**换一种形式来讲，不再是各种子问题，各种最优子结构**。所以大佬可别喷我再乱讲，因为我说了，这是我自己平时做题的套路。

**第三步骤**：**找出初始值**；学过**数学归纳法**的都知道，虽然我们知道了数组元素之间的关系式，例如 dp[n] = dp[n-1] + dp[n-2]，我们可以通过 dp[n-1] 和 dp[n-2] 来计算 dp[n]，但是，我们得知道初始值啊，例如一直推下去的话，会由 dp[3] = dp[2] + dp[1]。而 dp[2] 和 dp[1] 是不能再分解的了，所以我们必须要能够直接获得 dp[2] 和 dp[1] 的值，而这，就是**所谓的初始值**。

由了**初始值**，并且有了**数组元素之间的关系式**，那么我们就可以得到 dp[n] 的值了，而 dp[n] 的含义是由你来定义的，你想**求什么，就定义它是什么**，这样，这道题也就解出来了；



## 1-0、模板

**<u>1、定义数组元素的含义；</u>**

**<u>2、找出数组元素间的关系式</u>**

**<u>3、找出初始条件</u>**



## 1-0、注意事项

注意：90% 的字符串问题都可以用动态规划解决，并且90%是采用二维数组；

注意：80% 的动态规划题都可以画图，其中 80% 的题都可以通过画图一下子知道怎么优化



## 1-1、070—爬楼梯

**<u>简单一维DP</u>**

**<u>1、定义数组元素的含义；</u>**

**第一个难点，就是如何定义**；可定义 dp[i] 的含义为：**跳上一个 i 级的台阶总共有 dp[i] 种跳法**；所以计算出 dp[n] 就能求出跳法；

**<u>2、找出数组元素间的关系式</u>**

动态规划的题，其实就是将一个**规模**较大的问题分成几个**规模**较小的问题，然后由小问题推导出大问题；

即比如说 dp[n] 的规模为 n，比它规模小的是 n-1, n-2, n-3.... 也就是说，dp[n] 一定会和 dp[n-1], dp[n-2]....存在某种关系；DP 关键之一就是找出这种关系

可问题是，怎么找？这个怎么找，**是最核心最难最变态的点**，找到即成功，dp[n] 究竟会等于什么呢？

对于这道题，由于情况可以选择跳一级，也可以选择跳两级，所以青蛙到达第 n 级的台阶有两种方式

- 一种是从第 n-1 级跳上来
- 一种是从第 n-2 级跳上来

由于是要算所有可能的跳法的，所以有 dp[n] = dp[n-1] + dp[n-2]；

**<u>3、找出初始条件</u>**

当 n = 1 时，dp[1] = dp[0] + dp[-1]，而我们是数组是不允许下标为负数的；

所以对于 dp[1]，必须要**直接给出它的数值**，相当于初始值，显然，dp[1] = 1。一样，dp[0] = 0.(因为 0 个台阶，那肯定是 0 种跳法了(错误的))

于是得出初始值：dp[0] = 0. dp[1] = 1. 即 n <= 1 时，dp[n] = n.

但其实这种初始值是错误的，dp[0] 应该是 1，dp[0] = 1. dp[1] = 1

```js
var climbStairs = function(n) {
  if(n <= 1) return n;
  const dp = [1, 1];
  for(let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
// 时间复杂度为 O(n)
```



## 1-2、062—不同路径

**<u>二维DP</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201010221136.png" alt="截屏2020-10-10 下午10.11.31" style="zoom:50%;" />

**<u>1、定义数组元素的含义；</u>**

**第一个难点，就是如何定义**；此处可定义 dp[i] [j]的含义为：**当机器人从左上角走到(i, j) 这个位置时，一共有 dp[i] [j] 种路径**；那么，dp[m-1] [n-1] 就是要的答案；因网格相当于一个二维数组，数组是从下标为 0 开始算起的，所以 右下角的位置是 (m-1, n - 1)，所以 dp[m-1] [n-1] 就是要找的答案；

**<u>2、找出数组元素间的关系式</u>**

那么机器人如何才能到达 (i, j) 这个位置？由于机器人可以向下走或者向右走，所以有两种方式到达：

- 一种是从 (i-1, j) 这个位置走一步到达
- 一种是从(i, j - 1) 这个位置走一步到达

因为是计算所有可能的步骤，所以是把所有可能走的路径都加起来，所以关系式是 dp[i] [j] = dp[i-1] [j] + dp[i] [j-1]

**<u>3、找出初始条件</u>**

显然，当 dp[i] [j] 中，如果 i 或者 j 有一个为 0，则不能使用上述关系式；因为这个时候把 i - 1 或者 j - 1，就变成负数了，数组就会出问题，所以初始值是计算出所有的 dp[0] [0….n-1] 和所有的 dp[0….m-1] [0]。这个还是非常容易计算的，相当于计算机图中的最上面一行和左边一列。因此初始值如下：

- dp[0] [0….n-1] = 1; // 相当于最上面一行，机器人只能一直往左走
- dp[0…m-1] [0] = 1; // 相当于最左面一列，机器人只能一直往下走

```js
var uniquePaths = function (m, n) {
  if (m <= 0 || n <= 0) return 0;
  const dp = new Array(m).fill(new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let i = 0; i < n; i++) {
    dp[0][i] = 1;
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};
// 空间复杂度 O(n*m) 
```

**<u>4、图表优化</u>**

上述画图，真的要画图，根据图可发现计算新dp[i,j]值只需同列前值与同行前值，则可理解为只需一个数组即可实现；若不明白这句话请画图；

```js
var uniquePaths = function (m, n) {
  if (m <= 0 || n <= 0) return 0;
  let dp = [];
  // m 列
  for (let i = 0; i < m; i++) {
    dp[i] = 1;
  }
  // 从虚拟 2 行开始计算，素材取自上一行
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      dp[j] = dp[j - 1] + dp[j];
    }
  }
  return dp[m - 1];
};
// 空间复杂度 O(n) 
```





## 1-3、064—最小路径和

**<u>二维DP</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201010223217.png" alt="截屏2020-10-10 下午10.32.12" style="zoom:50%;" />

**<u>1、定义数组元素的含义；</u>**

**第一个难点，就是如何定义**；此处可定义 dp[i] [j]的含义为：**当从左上角走到(i, j) 这个位置时，所有路径和的最小值**

**<u>2、找出数组元素间的关系式</u>**

那么机器人如何才能到达 (i, j) 这个位置？由于机器人可以向下走或者向右走，所以有两种方式到达：

- 一种是从 (i-1, j) 这个位置走一步到达
- 一种是从(i, j - 1) 这个位置走一步到达

不过这次不是计算所有可能路径，而是**计算哪一个路径和是最小的**，那么我们要从这两种方式中，选择一种，使得dp[i] [j] 的值是最小的，显然有

- dp[i] [j] = Math.min(dp[i] [j] +  dp[i-1] [j]，dp[i] [j] + dp[i] [j-1])
- dp[i] [j] = Math.min(dp[i-1] [j]，dp[i] [j]) + dp[i] [j-1]

**<u>3、找出初始条件</u>**

显然，当 dp[i] [j] 中，如果 i 或者 j 有一个为 0，则不能使用上述关系式；因为这个时候把 i - 1 或者 j - 1，就变成负数了，数组就会出问题，所以初始值是计算出所有的 dp[0] [0….n-1] 和所有的 dp[0….m-1] [0]。这个还是非常容易计算的，相当于计算机图中的最上面一行和左边一列。因此初始值如下：

- dp[0] [j] = arr[0] [j] + dp[0] [j-1]; // 相当于最上面一行，机器人只能一直往左走
- dp[i] [0] = arr[i] [0] + dp[i] [0]; // 相当于最左面一列，机器人只能一直往下走

```js
var minPathSum = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  if (m <= 0 || n <= 0) return 0;
  let dp = [];
  for (let i = 0; i < m; i++) {
    dp.push([]);
    for (let j = 0; j < n; j++) {
      dp[i].push(0);
    }
  }
  dp[0][0] = grid[0][0];
  // 初始化最左边的列
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  // 初始化最上边的行
  for (let i = 1; i < n; i++) {
    dp[0][i] = dp[0][i - 1] + grid[0][i];
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
};
```





## 1-4、072—编辑距离

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201011064033.png" alt="截屏2020-10-11 上午6.40.29" style="zoom:50%;" />

注意：90% 的字符串问题都可以用动态规划解决，并且90%是采用二维数组；

注意：80% 的动态规划题都可以画图，其中 80% 的题都可以通过画图一下子知道怎么优化

**<u>1、定义数组元素的含义；</u>**

根据目标，可定义为：**当字符串 word1 的长度为 i，字符串 word2 的长度为 j 时，将 word1 转化为 word2 所使用的最少操作次数为 dp[i] [j]**。

**<u>2、找出数组元素间的关系式</u>**

不管多难找，大部分情况下，dp[i] [j] 和 dp[i-1] [j]、dp[i] [j-1]、dp[i-1] [j-1] 肯定存在某种关系。因为我们的目标就是，**从规模小的，通过一些操作，推导出规模大的；此题可对 word1 进行三种操作：插入一个字符 删除一个字符 替换一个字符：

由于要让操作的次数最小，所以要寻找最佳操作；则有如下关系式：

一、如果 word1[i] 与 word2 [j] 相等，此时不需要进行任何操作，显然有 dp[i] [j] = dp[i-1] [j-1]；i != 0；

二、如果 word1[i] 与 word2 [j] 不相等，则须进行调整，而调整的操作有 3 种，我们要选择一种。三种操作对应的关系试如下（注意字符串与字符的区别）：

（1）替换操作，替换后字符 word1[i] 替换成与 word2[j] 相等，则有 dp[i] [j] = dp[i-1] [j-1] + 1;

（2）插入操作，在字符串 word1末尾插入一个与 word2[j] 相等字符，则有 dp[i] [j] = dp[i-1+1] [j-1] + 1;

（3）删除操作，将字符 word1[i] 删除，则有 dp[i] [j] = dp[i-1] [j] + 1;

随机触发一种操作，使得 dp[i] [j] 的值最小，显然有：**dp[i] [j] = min(dp[i-1] [j-1]，dp[i] [j-1]，dp[[i-1] [j]]) + 1;**

**<u>3、找出初始条件</u>**

在 dp[i] [j] 中， i 或者 j 不能为 0，否则减1时数组就会出问题，所以初始值是计算出所有的 dp[0] [0….n] 和所有的 dp[0….m] [0]；因为当有一个字符串的长度为 0 时，转化为另外一个字符串，则只能一直进行插入或删除操作；

```js
var minDistance = function (word1, word2) {
  const n1 = word1.length;
  const n2 = word2.length;
  let dp = [];
  for (let i = 0; i < n1 + 1; i++) {
    dp.push([]);
    for (let j = 0; j < n2 + 1; j++) {
      dp[i].push(0);
    }
  }
  
  // dp[0][0...n2]的初始值
  for (let j = 1; j <= n2; j++) {
    dp[0][j] = dp[0][j - 1] + 1;
  }
  // dp[0...n1][0] 的初始值
  for (let i = 1; i <= n1; i++) {
    dp[i][0] = dp[i - 1][0] + 1;
  }

  // 通过公式推出 dp[n1][n2]
  for (let i = 1; i <= n1; i++) {
    for (let j = 1; j <= n2; j++) {
      // 如果 word1[i] 与 word2[j] 相等。第 i 个字符对应下标是 i-1
      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
      }
    }
  }
  return dp[n1][n2];
};
// 空间复杂度 O(n*m) 
```

**<u>4、图表优化</u>**

emmm，较上一个偏复杂，重点在理解三个状态

```js
var minDistance = function (word1, word2) {
  const n1 = word1.length;
  const n2 = word2.length;
  let dp = [];
  for (let i = 0; i < n2 + 1; i++) {
    dp[i] = i;
  }

  for (let i = 1; i <= n1; i++) {
    let temp = dp[0];
    // 相当于初始化
    dp[0] = i;
    for (let j = 1; j <= n2; j++) {
      let pre = temp;
      temp = dp[j];
      // 如果 word1[i] 与 word2[j] 相等。第 i 个字符对应下标是 i-1
      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
        dp[j] = pre;
      } else {
        dp[j] = Math.min(dp[j - 1], dp[j], pre) + 1;
      }
    }
  }
  return dp[n2];
};
```





## 1-5、221—最大正方形

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201011140729.png" alt="截屏2020-10-11 下午2.07.25" style="zoom:50%;" />

**<u>1、定义数组元素的含义；</u>**

此处可定义 dp[i] [j]的含义为：**<u>此位置上表示能成为最大正方形的边长</u>**

**<u>2、找出数组元素间的关系式</u>**

注意观察，能形成正方形的，由 d[i-1] [j]、d[i] [j-1]、d[i-1] [j-1] 三方控制，而能否继续延伸成为正方形又要看这三者的情况，所以有：

- **dp[i] [j] = Math.min(dp[i-1] [j], dp[i-1] [j-1], dp[i] [j-1]) + 1**

**<u>3、找出初始条件</u>**

首行、首列组成最小正方形边长为1，故原样保留，构成初始条件；

```js
var maximalSquare = function(matrix) {
  if(!matrix.length) return 0;
  const row = matrix.length;
  const colum = matrix[0].length;
  let maxSql = 0; 
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < colum; j++) {
      if(+matrix[i][j]) {
        // 不为首行首列
        if(i != 0 && j != 0) {
          matrix[i][j] = Math.min(matrix[i-1][j], matrix[i-1][j-1], matrix[i][j-1]) + 1;
        }
        maxSql = Math.max(maxSql, matrix[i][j]);
      }
    }
  }
  return maxSql ** 2
};
console.log(maximalSquare([
  [ 1, 0, 1, 0, 0],
  [ 1, 0, 1, 1, 1],
  [ 1, 1, 1, 1, 1],
  [ 1, 0, 0, 1, 0]
]));
```

**<u>4、图表优化</u>**

不好优化…





## 1-6、322—零钱兑换

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201011154501.png" alt="截屏2020-10-11 下午3.44.57" style="zoom: 50%;" />

**<u>1、定义数组元素的含义；</u>**

可定义 dp[i] 为：总金额为 i 的时最优解法的硬币数

**<u>2、找出数组元素间的关系式</u>**

由上述定义，dp[200] = Math.min(dp[119] + 1, dp[118] + 1, dp[115] + 1)，假设 115 不能凑出，则自然为 -1 相加即为0；所以先拆分子问题；

所以归纳有：dp[i] = Math.min(dp[i - coin] + 1, dp[i - coin] + 1, ...)，进一步有：**dp[i] = Math.min(dp[i], dp[i - coin] + 1)**

**<u>3、找出初始条件</u>**

初始条件，dp[0] = 0;

```js
var coinChange = function(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for(let i = 1; i <= amount; i++) {
      for(let coin of coins) {
          if (i - coin >= 0) {
              // dp[i]本身的解法 和 dp[当前的总金额i(即amount) - 遍历的icon] + 1(遍历的icon) 的解法的最小值
              dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          }
      }
  }
  // 若结果为无穷大，则无解
  return dp[amount] === Infinity ? -1 : dp[amount];
};
```









## 1-7、120—三角形最小路径和

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201011161331.png" alt="截屏2020-10-11 下午4.13.28" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006073010.png" alt="截屏2020-10-06 上午7.30.07" style="zoom:50%;" />

**<u>1、定义数组元素的含义；</u>**

可定义 dp[i] [j]为：最小三角路径和；

**<u>2、找出数组元素间的关系式</u>**

因为当前值等于同列下行2值最小值 + 自身， 所以有： **d[i] [j] = Max.min(dp[i+1] [j], dp[i+1] [j+1]) + d[i] [j]**

**<u>3、找出初始条件</u>**

没有初始条件；<u>但注意从倒数第二行开始计算，这样才能得出最小值；</u>

```js
var minimumTotal = function (triangle) {
  for (let i = triangle.length - 2; i >= 0; i--) {
    for (let j = 0; j < triangle[i].length; j++) {
      triangle[i][j] =
        Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]) + triangle[i][j];
    }
  }
  return triangle[0][0];
};
```



