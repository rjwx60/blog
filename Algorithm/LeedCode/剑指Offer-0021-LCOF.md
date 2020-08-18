#### [剑指 Offer 21. 调整数组顺序使奇数位于偶数前面 LCOF](https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

来源：力扣（LeetCode）

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



### 一、Content

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分；



#### 1-1、Example

```
输入：nums = [1,2,3,4]
输出：[1,3,2,4] 
注：[3,1,2,4] 也是正确的答案之一。
```



#### 1-2、Note

1. `1 <= nums.length <= 50000`
2. `1 <= nums[i] <= 10000`



#### 1-3、Tag

Array、双指针



### 二、思路与解答

#### 2-1、思路

##### 2-1-1、自思路

头尾各放置一指针，向内逼近移动，若符合条件则交换位置；



##### 2-1-2、其他思路

- 解法1：开辟新空间；此过程需要循环 2 次；过程如下：
  - 第一次循环依次找到偶数和奇数，并且将其分别存放到新开辟的空间中；
  - 第二次循环将存放偶数和奇数的空间“连接”在一起；
  - 时间复杂度 O(N), 空间复杂度 O(N)；
- 解法2：利用“双指针”，分别是指向数组头部的指针 i，与指向数组尾部的指针 j；过程如下：
  - i 向右移动，直到遇到偶数；j 向左移动，直到遇到奇数；
  - 检查 i 是否小于 j，若小于，交换 i 和 j 的元素，回到上一步骤继续移动；否则结束循环；
  - 时间复杂度是 O(N),空间复杂度是 O(1)





#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/solution/

##### 2-2-2、自实现

```js
function reOrderArray(array) {
  if (Array.isArray(array)) {
    let start = 0;
    let end = array.length - 1;
    while (start < end) {
      // 关键，向内逼近，若符合则继续执行，否则退出
      while (array[start] % 2 === 1) {
        start++;
      }
      while (array[end] % 2 === 0) {
        end--;
      }
      // 到这里时，指针所在位置均不符合条件，进行位置交换操作
      if (start < end) {
        [array[start], array[end]] = [array[end], array[start]]
      }
    }
  }
  return array;
}
```

##### 2-2-3、综合实现

```js
// 1、空间换时间
var exchange = function(nums) {
    const arr = []; // 奇数数组
    const brr = []; // 偶数数组
    nums.forEach(item => {
        item % 2 ? arr.push(item) : brr.push(item);
    });

    return arr.concat(brr);
};

// 2、双指针
var exchange = function(nums) {
    const length = nums.length;
    if (!length) {
        return [];
    }

    let i = 0,
        j = length - 1;
    while (i < j) {
        while (i < length && nums[i] % 2) i++;
        while (j >= 0 && nums[j] % 2 === 0) j--;

        if (i < j) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            i++;
            j--;
        }
    }

    return nums;
};

// 作者：xin-tan
// 链接：https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/solution/liang-chong-jie-fa-kai-pi-xin-shu-zu-shuang-zhi-zh/
```



### 三、Top

#### 3-1、88ms

```js
var exchange = function(nums) {
    let i = 0, j = nums.length -1;
    while (i < j) {
        while (nums[i] & 1 && i < j) {
            i += 1;
        }
        while (!(nums[j] & 1) && i < j) {
            j -= 1;
        }
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
};
```



#### 3-2、92ms

```js
var exchange = function(nums) {
    for(let i=0, j=0; i<nums.length; i++) {
        let cur = nums[i];
        // 奇数交换
        if(cur % 2) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            j++;
        }
    }
    return nums;
};
```



#### 3-3、44180kb

```js
var exchange = function (nums) {
   let j=0
   for(let i=0;i<nums.length;i++){
       if(nums[i]%2!==0){
           const temp=nums[j]
           nums[j]=nums[i]
           nums[i]=temp
           j++
       }
   }
   return nums
};
// 思路: 在原数组上作操作, 牛皮
```





### 四、拓展

#### 4-1、保持相对位置不变

题目加上：保证奇数和奇数，偶数和偶数之间的相对位置不变；

即输入整数数组，实现函数来调整该数组中数字的顺序，使所有奇数位于数组前半部分，所有偶数位于数组的后半部分，<u>**但相对顺序不发生变化**</u>

思路：与插入排序相似；时间复杂度 O(N^2)，空间复杂度 O(1)，此处时间复杂度主要浪费在“保持偶数和奇数原相对位置不变”这个要求上；

整体的思路：

- 指针 i 从 0 开始向右移动，如果遇到奇数，继续移动；遇到偶数，停下来，并进入循环
  - 设置新指针 j = i + 1，指针 j 向右移动，遇到偶数，继续移动；遇到奇数，停下来，并进入下一步
  - 将数组[i, j - 1] 的元素整体向右位移 1 位，然后将 j 上的元素赋给 i 上的元素
- 检测是否遍历完成，未完成则回到第一步

```js
function reOrderArray(array) {
    const length = array.length;
    if (!length) {
        return [];
    }

    let i = 0;
    while (i < length) {
        if (array[i] % 2 === 0) {
            // 如果指针i对应的元素是偶数
            // 那么就需要找到其后出现的第一个奇数
            // 然后和指针i的元素进行交换
            let j = i + 1;
            for (; j < length && array[j] % 2 === 0; ++j) {}
            if (j === length) {
                break;
            } else {
                // 整体右移，保证原元素的相对位置不变
                const tmp = array[j];
                for (let k = j; k > i; k--) {
                    array[k] = array[k - 1];
                }
                array[i] = tmp;
            }
        }
        i++;
    }

    return array;
}

// 作者：xin-tan
// 链接：https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/solution/liang-chong-jie-fa-kai-pi-xin-shu-zu-shuang-zhi-zh/
```



##### 4-1-1、自实现

- 思路1：可构建两个空数组进行存放，然后再合并；
- 思路1：可利用冒泡思想，前后若不同则前后两两交换；
- 思路1：可嵌套循环，偶数取出放最后，后数前移；

```js
// 1、3-1-1-1中，相对顺序会发生变化，比如 [1,2,3,4,5,6] -> [1,5,3,4,2,6]
// 2、3-1-1-2中，则要求不能发生变化，比如 [1,2,3,4,5,6] -> [1,3,5,2,4,6]
function reOrderArray(array) {
  if (Array.isArray(array)) {
    let headO = 0;
    let headT = 0
    while (start < end) {
      while (array[start] % 2 === 1) {
        start++;
      }
      while (array[end] % 2 === 0) {
        end--;
      }
      if (start < end) {
        [array[start], array[end]] = [array[end], array[start]]
      }
    }
  }
  return array;
}
```



#### 4-2、xxx