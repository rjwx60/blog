#### [605. Can Place Flowers](https://leetcode-cn.com/problems/can-place-flowers/)

Suppose you have a long flowerbed in which some of the plots are planted and some are not. However, flowers cannot be planted in adjacent plots - they would compete for water and both would die.

Given a flowerbed (represented as an array containing 0 and 1, where 0 means empty and 1 means not empty), and a number n, return if n new flowers can be planted in it without violating the no-adjacent-flowers rule.

假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死

给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花？能则返回True，不能则返回False。

#### Example

```
Input: flowerbed = [1,0,0,0,1], n = 1
Output: True

Input: flowerbed = [1,0,0,0,1], n = 2
Output: False
```

#### Note

The input array won't violate no-adjacent-flowers rule.
The input array size is in the range of [1, 20000].
n is a non-negative integer which won't exceed the input array size.



Think：

思路：边界处理与连续三值为0

```
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function(flowerbed, n) {
  // 计数器
  let max = 0
  // 右边界补充[0,0,0],最后一块地能不能种只取决于前面的是不是1，所以默认最后一块地的右侧是0（无须考虑右侧边界有阻碍）
  flowerbed.push(0)
  for (let i = 0, len = flowerbed.length - 1; i < len; i++) {
    if (flowerbed[i] === 0) {
      // 左边界判断
      if (i === 0 && flowerbed[1] === 0) {
        max++
        i++
      // 三者均为 0 即可种花
      } else if (flowerbed[i - 1] === 0 && flowerbed[i + 1] === 0) {
        max++
        i++
      }
    }
  }
  return max >= n
};
```

https://leetcode-cn.com/problems/can-place-flowers/solution/