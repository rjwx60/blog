#### [724.find-pivot-index](https://leetcode-cn.com/problems/find-pivot-index/)

Given an array of integers `nums`, write a method that returns the "pivot" index of this array.

We define the pivot index as the index where the sum of all the numbers to the left of the index is equal to the sum of all the numbers to the right of the index.  If no such index exists, we should return -1. If there are multiple pivot indexes, you should return the left-most pivot index.

给定一个整数类型的数组 nums，请编写一个能够返回数组 “中心索引” 的方法。

我们是这样定义数组 中心索引 的：数组中心索引的左侧所有元素相加的和等于右侧所有元素相加的和。

如果数组不存在中心索引，那么我们应该返回 -1。如果数组有多个中心索引，那么我们应该返回最靠近左边的那一个。



#### Example：

```
Input: nums = [1,7,3,6,5,6]
Output: 3
Explanation:
The sum of the numbers to the left of index 3 (nums[3] = 6) is equal to the sum of numbers to the right of index 3.
Also, 3 is the first index where this occurs.

Input: nums = [1,2,3]
Output: -1
Explanation:
There is no index that satisfies the conditions in the problem statement.
```



#### **Constraints:**

- The length of `nums` will be in the range `[0, 10000]`.
- Each element `nums[i]` will be an integer in the range `[-1000, 1000]`.



#### Code-1：2020-07-08

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
    if(!nums.length) {
        return -1;
    }
    var map = {};
    var total = 0;
    for(var i = 0; i < nums.length; i++) {
        // 相邻元素累计值和值
        var sum = total + total + nums[i];
        if (map[sum] === undefined) {
            map[sum] = i;
        }
        total += nums[i];
    }
    return map[total] !== undefined ? map[total] : -1;
};
// 执行用时：124 ms, 在所有 JavaScript 提交中击败了34.06%的用户
// 内存消耗：43.7 MB, 在所有 JavaScript 提交中击败了100.00%的用户

// 思路: 
// 1、因数组元素累加值 = 当前索引所在值的累计值 + 后续元素索引累计值，故可视为寻找相邻元素累计值，如下表: 11 + 17 = 28
// value: 1   7   3   6   5   6
// index: 0   1   2   3   4   5
// total: 1   8   11  17  22  28
// 2、故计算累计和值，然后寻找数组中的任意相邻两个元素相加得终值，结果为第二个相邻元素的索引；
// 3、构建 map 存储相邻和值与第二相邻位索引
```



#### More：

##### More1：

作者：缺失-作者链接是后期补上，但这题找不到出处…

链接：https://leetcode-cn.com/problems/find-pivot-index/solution/gong-shi-fa-by-diao-min-bu-ke-hai-zhen/

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
  if(nums.length < 3) return -1;
  let sum = 0, left = 0;
  for(let i = 0; i < nums.length; i++) {
      sum += nums[i];
  }
  for(let i = 0; i < nums.length; i++){
      if((sum - nums[i]) / 2  === left){
        return i;
      }
      left += nums[i]
  }
  return -1;
};
// 执行用时： 92 ms , 在所有 JavaScript 提交中击败了 71.42% 的用户 
// 内存消耗： 37.4 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 1、思路是相通的: S 是数组的和，当索引 i 是中心索引时，位于 i 左边数组元素的和 leftsum 满足 S - nums[i] - leftsum, 只需要判断当前索引 i 是否满足 leftsum==S-nums[i]-leftsum 并动态计算 leftsum 的值;
// 2、但这比前一方法快，虽然用了两次循环，但上一方法将所有累计值均存储起来最后一步才判断，而此方法则将计算和与判断操作分离，一旦检索到结果就提前结束，故更快；
```





##### More2：

作者：lvshanke
链接：https://leetcode-cn.com/problems/find-pivot-index/solution/dan-ke-xi-lie-yong-shi-9375nei-cun-10000-by-lvshan/

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
    let sum = 0;
    nums.forEach(num => sum += num);
    let leftSum = 0;
    for(i = 0; i < nums.length; i++){
        if((sum - nums[i]) - leftSum == leftSum){
            return i;
        }else{
            leftSum += nums[i];
        }
    }
    return -1;
};
// 执行用时： 80 ms , 在所有 JavaScript 提交中击败了 93.75% 的用户 
// 内存消耗： 37.7 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户
```



#### Think：

- Code1 未考虑 map[sum] 为 0 的特殊值情况，而使用 !map[sum] 判断(应使用 undefined)，导致没有考虑 [-1,-1,0,1,1,-1] 的情况;
- 若题目隐晦难懂，不要光在大脑里死磕、模拟，人脑不是 matlab，不要勉强，可通过手写画图提高认知；
- 对比 Code1 与 Code2 有时将操作分离能带来更好的效率；



#### Expand：

