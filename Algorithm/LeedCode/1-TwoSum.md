#### [1. Two Sum](https://leetcode-cn.com/problems/two-sum/)

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.



#### Example:

```
Given nums = [2, 7, 11, 15], target = 9,
Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```



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

// 思路：
// 嵌套循环固然可以实现要求，但复杂度为 O(n^2)，不可行；

// 结果：
// 执行结果：通过
// 执行用时：68 ms, 在所有 JavaScript 提交中击败了89.84%的用户
// 内存消耗：33.7 MB, 在所有 JavaScript 提交中击败了98.31%的用户
```



#### Code-2：

#### ...



#### More：

1. 拓展==>N 数之和
2. 改为减、乘、除 (考虑边界处理问题)



##### More-1：三数之和

给定包含 `n` 个整数的数组`nums`，判断 `nums` 中是否存在三个元素`a，b，c` ，使得 `a + b + c = 0 ？`找出所有满足条件且不重复三元组

注意：答案中不可包含重复的三元组。

##### More-1-Example：

```
Give nums = [-1, 0, 1, 2, -1, -4]，
Return:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

##### More-1-Code：

```javascript
var threeSum = function(nums) {
  if (nums.length < 3) return [];
  var result  = [];
  // 小到大排序
  nums.sort((a, b) => a - b);
  for(let i = 0; i < nums.length; i++) {
    // 去重-基准值的去重
    if(i && nums[i] === nums[i - 1]) continue;
    let leftPoint = i + 1;
    let rightPoint = nums.length - 1;
    while(leftPoint < rightPoint) {
      let sum = nums[i] + nums[leftPoint] + nums[rightPoint];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
      }
      // 去重-双指针间的去重
      if (sum <= 0) {
        while (nums[leftPoint] === nums[++leftPoint]);
      } else {
        while (nums[rightPoint] === nums[--rightPoint]);
      }
    }
  }
  return result;
}

// 思路:
// 1、因为要求返回的是数值而非索引，且要求答案中不可包含重复结果，所以要考虑去重，而为了方便去重，先将数组排序，且避免使用繁杂的去重逻辑，在排序基础上与前一值比对即可完成去重
// 2.遍历，将每一值 nums[i] 作为基准数，并继续遍历此数后面的数组，设定双指针，最左侧的 left(i+1) 和最右侧的 right(length-1)
// 3.判断 nums[i] + nums[left] + nums[right]是否等于0，若等于0则并入结果，并分别将 left 和 right 移动一位
// 4.若结果大于0，则缩小值范围，将 right 左移动一位，如此逐渐逼近结果
// 5.若结果小于0，则扩大值范围，将 left 右移动一位，如此逐渐逼近结果
```



##### More-2：四数之和

给定包含 `n` 个整数的数组`nums`，判断 `nums` 中是否存在四个元素`a，b，c，d` ，使得 `a + b + c + d = 0 ？`找出所有满足条件且不重复的四元组。

注意：答案中不可包含重复的四元组。

##### More-2-Example：

```
Give nums = [1, 0, -1, 0, -2, 2]，and target = 0。
Return:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]
```

##### More-2-Code：

```javascript
var fourSum = function (nums, target) {
    if (nums.length < 4) {
        return [];
    }
  	// 小到大排序
    nums.sort((a, b) => a - b);
    var result = [];
  	// i 循环-末尾3个不作考虑
    for (let i = 0; i < nums.length - 3; i++) {
      	// 去重-基准值i去重
        if (i > 0 && nums[i] === nums[i - 1]) continue;
      	// 边界处理-若前四个的和即大于 target 则表明无解
        if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
     		// j 循环-末尾2个不作考虑
        for (let j = i + 1; j < nums.length - 2; j++) {
          	// 去重-基准值j去重
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            let left = j + 1;
            let right = nums.length - 1;
            while (left < right) {
                var sum = nums[i] + nums[j] + nums[left] + nums[right];
                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                }
                if (sum <= target) {
                    while (nums[left] === nums[++left]);
                } else {
                    while (nums[right] === nums[--right]);
                }
            }
        }
    }
    return result;
};
```

