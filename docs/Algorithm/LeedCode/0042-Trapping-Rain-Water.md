#### [42. Trapping Rain Water](https://leetcode-cn.com/problems/trapping-rain-water/)

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.

给定 *n* 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

<img src="/Users/rjwx60/Documents/FE/Github/Blog/Source/Image/Algorithm/Algorithm/0042.png" style="zoom:50%;" />

The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped. Thanks Marcos for contributing this image!

上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 感谢 Marcos 贡献此图。



#### Example：

```
Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```



#### Code1：2020-07-13

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  let layers = [], trapNums = 0;
  // 分层
  layered(height, layers);
  // 处理 - 计算两个 1 间的 0 的个数
  for (let m = 0; m < layers.length; m++) {
    let stack = [], mLen = layers[m].length, cacheTrap = 0;
    console.log("第", m + 1, "层", layers[m]);
    for (let n = 0; n < mLen; n++) {
      const value = layers[m][n];
      // 遇到 1 即出栈
      if (value === 1 && stack.length) {
        stack.pop();
      }
      // 入栈或再入栈 再入栈时的 cacheTrap 即真实 cacheTrap
      if (value === 1 && !stack.length) {
        stack.push(cacheTrap);
        continue;
      }
      // 累计空洞
      if (value === 0 && stack.length) {
        cacheTrap++;
      }
    }
    trapNums += stack.pop();
  }

  function layered(target) {
    let layer = [];
    for (let i = 0; i < target.length; i++) {
      if (target[i]) {
        layer.push(1);
        target[i]--;
      } else {
        layer.push(0);
      }
    }
    layers.push(layer);
    if (target.filter((cv) => cv).length) layered(target);
  }

  return trapNums;
};
// 思路:
// 概念为层层剖析，削去二层以上，先计算最底层，填满后再将二层安放远处，以此类推
// [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
// [
//   [0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
//   [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
// ];
// 但实际上是不行的，如果数目很大，迭代速度很慢



/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let max = 0, sum = 0;
    const leftMax = [], rightMax = [], len = height.length;

    for(let i = 0; i < len; i++) {
        leftMax[i] = max = Math.max(height[i], max);
    }
    max = 0;
    for(let i = len - 1; i >= 0; i--) {
        rightMax[i] = max = Math.max(height[i], max);
    }
    for(let i = 0; i < len; i++) {
        sum +=  (Math.min(leftMax[i], rightMax[i]) - height[i])
    }
    return sum;
};
// 执行用时： 96 ms , 在所有 JavaScript 提交中击败了 30.54% 的用户 
// 内存消耗： 37.8 MB , 在所有 JavaScript 提交中击败了 11.11% 的用户
// 思路: 
// 求助外援

```



#### More：

##### More1：

作者：fe-lucifer
链接：https://leetcode-cn.com/problems/trapping-rain-water/solution/python3javascript-shuang-shu-zu-kong-jian-huan-shi/

```javascript
var trap = function(height) {
    let max = 0;
    let volumn = 0;
    const leftMax = [];
    const rightMax = [];

    for(let i = 0; i < height.length; i++) {
        leftMax[i] = max = Math.max(height[i], max);
    }

    max = 0;

    for(let i = height.length - 1; i >= 0; i--) {
        rightMax[i] = max = Math.max(height[i], max);
    }

    for(let i = 0; i < height.length; i++) {
        volumn = volumn +  Math.min(leftMax[i], rightMax[i]) - height[i]
    }

    return volumn;
};
// 关键: h[i] = Math.min(左边柱子最大值, 右边柱子最大值)(h为下雨之后的水位)
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/trapping-rain-water/solution/jie-yu-shui-by-leetcode/



#### Top：

https://leetcode-cn.com/submissions/detail/87401565/

```javascript
// top1: ms
// 感悟:

// top2: ms
// 感悟:
```



#### Think：

#### Expand：

