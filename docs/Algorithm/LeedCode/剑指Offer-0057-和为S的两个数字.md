#### [剑指 Offer 57. 和为s的两个数字](https://leetcode-cn.com/problems/he-wei-sde-liang-ge-shu-zi-lcof/)

来源：力扣（LeetCode）

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



### 一、Content

输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

 

#### 1-1、Example

```
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
示例 2：

输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]
```



#### 1-2、Note

1 <= nums.length <= 10^5
1 <= nums[i] <= 10^6



#### 1-3、Tag

Array、双向指针



### 二、思路与解答

#### 2-1、思路

##### 2-1-1、自思路

双指针夹逼法：因为数据本身已是递增排序的序列，故返回的第一个即乘积最小，比如[3,8] < [5,7]



#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/he-wei-sde-liang-ge-shu-zi-lcof/solution/

##### 2-2-2、自实现

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  if (nums && nums.length > 0) {
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
      const s = nums[left] + nums[right];
      if (s > target) {
        right--;
      } else if (s < target) {
        left++;
      } else {
        return [nums[left], nums[right]]
      }
    }
  }
  return [];
};
```



##### 2-2-3、综合实现

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let left=0, right=nums.length-1;
  while(left<=right){
    let sum=nums[left]+nums[right];
    if(sum===target){
      return [nums[left],nums[right]];
    }else if(sum>target){
      right--;
    }else{
      left++;
    }
  }
  return [];
};

// 作者：lisa-6
// 链接：https://leetcode-cn.com/problems/he-wei-sde-liang-ge-shu-zi-lcof/solution/jian-zhi-offfer57zui-you-de-shuang-zhi-zhen-suan-f/
```



### 三、Top

#### 3-1、88ms

```js
var twoSum = function(nums, target) {
   let left =0
   let right = nums.length-1
   while(left<right){
       let sum = nums[left] + nums[right]
     if(sum === target){
         return [ nums[left] , nums[right]]
     }else if(sum > target){
         --right
     }else if(sum < target){
         ++left
     }
   }
   return -1
};
```



#### 3-2、52860kb

```js
var twoSum = function(nums, target) {
    var len = nums.length;
    var left = 0;
    var right = len-1;
    var arr = []
    for(var i = 0; i<len ;i++){
        if(nums[left]+nums[right] == target){
            return  [nums[left],nums[right]]
        };
        if(nums[left]+nums[right] > target){
            right--
        }
        if(nums[left]+nums[right] < target){
            left++
        }
    }
};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx