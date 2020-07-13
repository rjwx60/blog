#### [27. Remove Element](https://leetcode-cn.com/problems/remove-element/)

Given an array nums and a value val, remove all instances of that value in-place and return the new length.

Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.

The order of elements can be changed. It doesn't matter what you leave beyond the new length.

给定一个排序数组，你需要在**[ 原地](http://baike.baidu.com/item/原地算法)** 删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。

不要使用额外的数组空间，你必须在 **[原地 ](https://baike.baidu.com/item/原地算法)修改输入数组** 并在使用 O(1) 额外空间的条件下完成。



#### Example：

```
Given nums = [3,2,2,3], val = 3,
Your function should return length = 2, with the first two elements of nums being 2.
It doesn't matter what you leave beyond the returned length.

Given nums = [0,1,2,2,3,0,4,2], val = 2,
Your function should return length = 5, with the first five elements of nums containing 0, 1, 3, 0, and 4.
Note that the order of those five elements can be arbitrary.
It doesn't matter what values are set beyond the returned length.
```



#### Clarification:

Confused why the returned value is an integer but your answer is an array?

Note that the input array is passed in by reference, which means modification to the input array will be known to the caller as well.

Internally you can think of this:

```javascript
// nums is passed in by reference. (i.e., without making a copy)
int len = removeElement(nums, val);

// any modification to nums in your function would be known by the caller.
// using the length returned by your function, it prints the first len elements.
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```



#### Code1：2020-07-13

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let point = 0;
    for(let i = 0; i < nums.length; i++) {
        if(nums[i] === val) continue;
        nums[point] = nums[i];
        point++;
    }
  	nums.length = point;
    return point;
};
// 执行用时： 76 ms , 在所有 JavaScript 提交中击败了 35.97% 的用户 
// 内存消耗： 33.2 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 题目要求返回剔除后的长度，而非数组，此题乃借鉴
```



#### More：

##### More1：

作者：guanpengchn
链接：https://leetcode-cn.com/problems/remove-element/solution/hua-jie-suan-fa-27-yi-chu-yuan-su-by-guanpengchn/

作者：hyj8
链接：https://leetcode-cn.com/problems/remove-element/solution/javascript-si-chong-fang-fa-you-xian-zhang-wo-qian/

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = (nums, val) => {
  let index = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[index] = nums[i]
      index++
    } 
  }
  return index
}
// 思路: 直接覆盖
// 遇到不同于 val 的项，就将它直接覆盖到 nums 数组中，从第一项开始覆盖
// 遍历完数组，不同于 val 的项都安排到了 nums 数组的前头
// 这种思路在移除元素较多时更适合使用，最极端的情况是全部元素都需要移除，遍历一遍结束即可
// 时间复杂度：O(n)，空间复杂度：O(1)



/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = (nums, val) => {
  let index = 0, last = nums.length - 1
  while (index <= last) {
    if (nums[index] === val) {
      nums[index] = nums[last]
      last--
    } else {
      index++
    }
  }
  return index
}
// 思路: 双指针
// 指向头尾的双指针
// 遇到等于val的项，就拿数组的末尾项覆盖它
// 末尾项搬到前面来了，将尾指针左移一位
// 如果遇到不同于val的项，左指针就+1，考察下一项
// 循环结束的条件是两个指针交叉相遇
// 这种思路在移除元素较少时更适合使用，最极端的情况是没有元素需要移除，遍历一遍结束即可
// 时间复杂度：O(n)，空间复杂度：O(1)


// splice 删除
var removeElement = (nums, val) => {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i]===val) {
      nums.splice(i, 1)
      i--
    }
  }
  return nums.length
}
// 遇到和val相同的，直接删除，导致后面的项前移一位
// 指针 i 要 -1，考察前移过来的新来的项，不然会漏掉考察它

var removeElement = (nums, val) => {
  while (nums.indexOf(val) !== -1) {
    nums.splice(nums.indexOf(val),1)
  }
  return nums.length
}
// 只要数组中还存在和val相同的项，就删除，删完了就返回数组的长度
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/remove-element/solution/



#### Top：

```javascript
// top1: 44ms
var removeElement = function(nums, val) {
    if(nums.length===0){
        return nums.length
    }
    let temp = val
    for(let i = 0;i<nums.length;){
        if(temp === nums[i]){
            nums.splice(i,1)
        }else{
            i++
        }
}
return nums.length
};



// top2: 48ms
var removeElement = function (nums, val) {
    let i = 0;
    for (let j = 0; j < nums.length; j++) {
        if(nums[j] !== val) {
            nums[i] = nums[j];
            i++;
        }
    }
    return i
};

// top3: 52ms
var removeElement = function(nums, val) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    if (nums[left] === val) {
      nums[left] = nums[right--]
    } else {
      left++
    }
  }
  return left
};
// 感悟: 双指针夹逼交换位置，目标值后移
```



#### Think：

#### Expand：

