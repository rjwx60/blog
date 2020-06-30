#### [1. Two Sum](https://leetcode-cn.com/problems/two-sum/)

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

#### Example:

```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```



#### Thinking-1：

#### Code-1：2020-06-30

```javascript

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    var map = new Map();
    for(var i = nums.length - 1; i >= 0; i--) {
        var value = nums[i];
        if (map.has(target - value)) {
            return [i, map.get(target - value)]
        } else {
            map.set(value, i);
        }
    }
};
```

执行结果：通过

执行用时：68 ms, 在所有 JavaScript 提交中击败了89.84%的用户

内存消耗：33.7 MB, 在所有 JavaScript 提交中击败了98.31%的用户





