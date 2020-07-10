#### [35.Search Insert Position](https://leetcode-cn.com/problems/search-insert-position/)

Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You may assume no duplicates in the array.





#### Example :

```
Input: [1,3,5,6], 5
Output: 2

Input: [1,3,5,6], 2
Output: 1

Input: [1,3,5,6], 7
Output: 4

Input: [1,3,5,6], 0
Output: 0
```



#### Code1：2020-07-10

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  // 特殊值
  if(!target) {
    nums.unshift(target);
    return 0;
  }
  // 这里用了迭代导致性能低下
  return shrinkArea(nums, target, 0, nums.length)
};

function shrinkArea(nums, target, leftIndex, rightIndex) {
  var midIndex = Math.floor((leftIndex + rightIndex) / 2);
  var value = nums[midIndex];
  if(value === target) {
      return midIndex;
  }
  // number = 2 避免进入死循环
  if((rightIndex - leftIndex ) === 1) {
      return target > nums[leftIndex] ? leftIndex + 1 : leftIndex;
  }
  // numbers > 2
  if(value > target) {
      return shrinkArea(nums, target, leftIndex, midIndex);
  }
  if(value < target) {
      return shrinkArea(nums, target, midIndex, rightIndex);
  }
}
// 执行用时： 72 ms , 在所有 JavaScript 提交中击败了 50.08% 的用户 
// 内存消耗： 33.2 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 1、用类似二分法处理：搜寻中间值，然后比对，若大于中间值则取后半段，再取其中中间值，以此类推...
```



#### More：

##### More1：

作者：joeyzhouyicheng

链接：https://leetcode-cn.com/problems/search-insert-position/solution/js-by-joeyzhouyicheng-4/

```javascript
// 1、暴力解法
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  if (nums[0] > target) {
    return 0;
  }
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) {
      return i;
    }
  }
  return nums.length;
};
// Runtime: 52 ms, faster than 85.47% of JavaScript online submissions for Search Insert Position.
// Memory Usage: 34.3 MB, less than 41.45% of JavaScript online submissions for Search Insert Position.


// 2、双指针
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  if (nums[0] > target) {
    return 0;
  } else if (nums[nums.length - 1] < target) {
    return nums.length;
  }
  let start = 0;
  end = nums.length - 1;
  while (start <= end) {
    let mid = Math.round((start + end) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return start;
};

// Runtime: 76 ms, faster than 5.48% of JavaScript online submissions forSearch Insert Position.
// Memory Usage: 33.9 MB, less than 59.44% of JavaScript online submissions for Search Insert Position.


// 3、二分法
var searchInsert = function(nums, target) {
  let left = 0;
  right = nums.length - 1;
  while (left <= right) {
    let mid = Math.round((left + right) / 2);
    if (target === nums[mid]) {
      return mid;
    } else if (target < nums[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left;
};
// Runtime: 64 ms, faster than 22.58% of JavaScript online submissions for Search Insert Position.
// Memory Usage: 33.7 MB, less than 98.01% of JavaScript online submissions for Search Insert Position.

// 3-1、二分法优化
var searchInsert = function(nums, target) {
  const length = nums.length;
  // 优化: 特殊值处理
  if (nums[length - 1] < target) {
    return length;
  } else if (length === 0) {
    return 0;
  }
  let left = 0;
  right = length - 1;
  // 
  while (left < right) {
    // 优化: 位运算，不怕大数计算，不怕溢出
    let mid = (left + right) >>> 1;
    if (target > nums[mid]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return right;
};
// Runtime: 52 ms, faster than 83.92% of JavaScript online submissions for Search Insert Position.
// Memory Usage: 33.9 MB, less than 67.81% of JavaScript online submissions for Search Insert Position.




```





#### Think：

- Code1 思路一开始就是对的，但临界值没有考虑好，比如最先使用的是 ceil 而非 floor，就会有若 nums 只有一个元素，取中间值 0.5，使用 floor 的话就会变为 1 溢出；比如未考虑 target 为 0 的情况；但普遍行为却处理的还好，可能因为判断条件简单?
- Code1 最大的感悟是，对临界、特殊情况的掌控感不足，导致卡在这上面的时间很长(一开始还看错题，以为除了要返回插入索引还要进行插入操作)
- Code1 的性能真的不忍直视…



