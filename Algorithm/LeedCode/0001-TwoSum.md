#### [1. Two Sum](https://leetcode-cn.com/problems/two-sum/)

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。



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
// 执行用时：68 ms, 在所有 JavaScript 提交中击败了89.84%的用户
// 内存消耗：33.7 MB, 在所有 JavaScript 提交中击败了98.31%的用户
// 空间复杂度 O(n) 时间复杂度O(n)

// 思路：
// 嵌套循环固然可以实现要求，但复杂度为 O(n^2)，不可行；
```



#### More：

##### More-1：

作者：LeetCode
链接：https://leetcode-cn.com/problems/two-sum/solution/liang-shu-zhi-he-by-leetcode-2/

```javascript
// 1、暴力法
// 暴力法很简单，遍历每个元素 xx，并查找是否存在一个值与 target - xtarget−x 相等的目标元素
// 时间复杂度：O(n^2), 对于每个元素，我们试图通过遍历数组的其余部分来寻找它所对应的目标元素，这将耗费 O(n)O(n) 的时间
// 空间复杂度：O(1)

// 2、两遍哈希表
// 保持数组中的每个元素与其索引相对应的最好方法是哈希表，通过以空间换取速度的方式，可将查找时间从 O(n) 降低到 O(1)
// 哈希表正支持以近似恒定的时间进行快速查找。近似是因为一旦出现冲突，查找用时可能会退化到 O(n)。但只要你仔细地挑选哈希函数，在哈希表中进行查找的用时应当被摊销为 O(1)
// 实现：使用两次迭代。一次迭代中，将每个元素的值和它的索引添加到表中。然后在二次迭代中，将检查每个元素所对应的目标元素（target - nums[i]target−nums[i]）是否存在于表中。注意，该目标元素不能是 nums[i] 本身
// 时间复杂度：O(n)，将包含有 n 个元素的列表遍历两次。由于哈希表将查找时间缩短到 O(1)，所以时间复杂度为 O(n)
// 空间复杂度：O(n)，所需的额外空间取决于哈希表中存储的元素数量，该表中存储了 n 个元素

// 3、一遍哈希表
// 在进行迭代并将元素插入到表中的同时，回过头来检查表中是否已存在当前元素所对应的目标元素。若存在，则已找到对应解，并立即将其返回
// 时间复杂度：O(n)，只遍历了包含有 n 个元素的列表一次。在表中进行的每次查找只花费 O(1) 的时间
// 空间复杂度：O(n)，所需的额外空间取决于哈希表中存储的元素数量，该表最多需要存储 n 个元素
```



##### More-2：

作者：kurna
链接：https://leetcode-cn.com/problems/two-sum/solution/liang-shu-zhi-he-java-jsshi-xian-shi-jian-fu-za-du/

```javascript
// 1、暴力法
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for (var i = 0; i < nums.length; i++) {
        var dif = target - nums[i];
        // j = i + 1 的目的是减少重复计算和避免两个元素下标相同
        for (var j = i + 1; j < nums.length; j++) {
            if(nums[j] == dif)
                return [i,j];
        }
    }
};


// 2、类 HashMap
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    var temp = [];
    for(var i=0;i<nums.length;i++){
        var dif = target - nums[i];
        if(temp[dif] != undefined){
            return [temp[dif],i];
        }
        temp[nums[i]] = i;
    }
};
// 思路: 
// 使用一层循环，每遍历到一个元素就计算该元素与 target 之间的差值 dif，然后以 dif 为下标到数组temp中寻找，若 temp[dif] 有值则返回两个元素在数组 nums 的下标，如果没有找到，则将当前元素存入数组 temp 中(下标: nums[i], Value: inums[i],Value:i) 
// 注意: 用结果当做数组索引实现类似 hashMap 思路，有趣，但问题是 JS 对含有许多空洞元素的数组的处理性能是较差的，直接用 map 会更好
```



##### More-2：

作者：shuke-2
链接：https://leetcode-cn.com/problems/two-sum/solution/javascriptliang-shu-zhi-he-cong-gui-su-dao-zui-su-/

```javascript
// 1、暴力法
var twoSum = function(nums, target) {
  let arr = nums;
  let arrs = new Array()
  for(let i =  0; i < arr.length - 1; i++){
    for(let j = 0; j < arr.length; j++){
      if ( arr[i] + arr[j] === target) {
        arrs.push(i, j)
        return arrs
      }
    }
  }
}

// 2、两遍 map
var twoSum = function(nums, target) {
  let map = new Map();
  let arr = new Array()
  for(let i in nums){
    map.set(
      nums[i],
      i
    )
  }
  for(let j = 0; j < nums.length - 1; j++){
    if(map.has( target - nums[j] ) && map.get( target - nums[j]) != j ){
      arr.push( j , map.get( target - nums[j] ) );
      return arr
    }
  }
}

// 3、一遍 map
var twoSum = function(nums, target) {
  const map = {}
  for (let i = 0; i < nums.length; i++){
    if(map[target - nums[i] ] >= 0){
      return [ map[target - nums[i] ], i]
    }
    map[nums[i]] = i;            
  }
}
var twoSum = function(nums, target) {
    let map = {}, loop = 0;
    let dis;// 目标与当前值的差
    while(loop < nums.length){
        dis = target - nums[loop];
        if(map[dis] != undefined){
            return [map[dis], loop];
        }
        map[nums[loop]] = loop;
        loop++;
    }
    return;
};


// 3.5、一遍 map 基础上 + 尾递归 
var twoSum = function(nums, target, i = 0, maps = {}) {
  const map = maps
  if(map[target - nums[i] ] >= 0 ) {
    return [ map[target - nums[i] ], i]
  } else {
    map[ nums[i] ] = i;
    i++;
    if(i < nums.length){
      return twoSum(nums, target, i, map)
    }else {
      throw 'error: twoSum is not find'
    }
  }
}

```



#### Think：

- Code1 属于一遍哈希表
- 题目关键是使用 hashMap





#### Expand：

1. N 数之和
2. 改为减、乘、除 (考虑边界处理问题)

##### Expand-1：三数之和

给定包含 `n` 个整数的数组`nums`，判断 `nums` 中是否存在三个元素`a，b，c` ，使得 `a + b + c = 0 ？`找出所有满足条件且不重复三元组

注意：答案中不可包含重复的三元组。

##### Expand-1-Example：

```
Give nums = [-1, 0, 1, 2, -1, -4]，
Return:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

##### Expand-1-Code：

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





##### Expand-2：四数之和

给定包含 `n` 个整数的数组`nums`，判断 `nums` 中是否存在四个元素`a，b，c，d` ，使得 `a + b + c + d = 0 ？`找出所有满足条件且不重复的四元组。

注意：答案中不可包含重复的四元组。

##### Expand-2-Example：

```
Give nums = [1, 0, -1, 0, -2, 2]，and target = 0。
Return:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]
```

##### Expand-2-Code：

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



