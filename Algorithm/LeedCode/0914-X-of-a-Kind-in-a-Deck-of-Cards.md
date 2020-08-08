#### [914. X of a Kind in a Deck of Cards](https://leetcode-cn.com/problems/x-of-a-kind-in-a-deck-of-cards/)

In a deck of cards, each card has an integer written on it.

Return true if and only if you can choose X >= 2 such that it is possible to split the entire deck into 1 or more groups of cards, where:

Each group has exactly X cards.
All the cards in each group have the same integer.

给定一副牌，每张牌上都写着一个整数。

此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：

每组都有 X 张牌。
组内所有的牌上都写着相同的整数。
仅当你可选的 X >= 2 时返回 true。

#### Example

```
Input: deck = [1,2,3,4,4,3,2,1]
Output: true
Explanation: Possible partition [1,1],[2,2],[3,3],[4,4].

Input: deck = [1,1,1,2,2,2,3,3]
Output: false
Explanation: No possible partition.

Input: deck = [1]
Output: false
Explanation: No possible partition.

Input: deck = [1,1]
Output: true
Explanation: Possible partition [1,1].

Input: deck = [1,1,2,2,2,2]
Output: true
Explanation: Possible partition [1,1],[2,2],[2,2].
```



#### Node

1. `1 <= deck.length <= 10000`
2. `0 <= deck[i] < 10000`



#### Think：

关键：只有当 X 为所有 Y 的约数，即所有 Y 的最大公约数的约数时，才存在可能的分组；

公式化来说，我们假设牌中存在的数字集合为 `a, b, c, d, e`，那么只有当 `X` 为 gcd(count a,count b,count c,count d,count e) 的约数时才能满足要求；因此我们只要求出所有 counti 最大公约数 g，判断 g 是否大于等于 2 即可，若大于等于 2，则满足条件，否则不满足



#### Code1：2020-08-08

```javascript
/**
 * @param {number[]} deck
 * @return {boolean}
 */
var hasGroupsSizeX = function(deck) {
  // 存储每张卡牌的总数
  // 修改排序的方式修改为直接统计每个相同字符的数量，思路不变（LeetCode测试用例）
  let group = []
  let tmp = {}
  deck.forEach(item => {
    tmp[item] = tmp[item] ? tmp[item] + 1 : 1
  })
  for (let v of Object.values(tmp)) {
    group.push(v)
  }
  // 此时group已经存放的是每张牌的总数了（数组只遍历一遍，避免了排序和正则的耗时）
  // 求两个数的最大公约数
  let gcd = (a, b) => {
    if (b === 0) {
      return a
    } else {
      return gcd(b, a % b)
    }
  }
  while (group.length > 1) {
    let a = group.shift()
    let b = group.shift()
    let v = gcd(a, b)
    if (v === 1) {
      return false
    } else {
      group.unshift(v)
    }
  }
  return group.length ? group[0] > 1 : false
};
```



#### More：

##### More1：

##### MoreX：

更多解法：

https://leetcode-cn.com/problems/x-of-a-kind-in-a-deck-of-cards/solution/

#### Top：

```javascript
// top1: 60ms
var hasGroupsSizeX = function(deck) {
    // 获取最大公约数
   function divisor (number1, number2) {
       return number1 % number2 === 0 ? number2 : divisor(number2, number1 % number2)
   }
   let map = {}
   if (deck.length) {
       deck.forEach(item => {
           map[item] = map[item] ? map[item]+1 : 1
       })
   }
   let tempArr = []
   for (let item in map) {
       tempArr.push(map[item])
   }
   let max = 0
   if (tempArr.length > 1) {
       for (let i=0; i<tempArr.length - 1; i++) {
         max = max ? divisor(max, tempArr[i+1]) : divisor(tempArr[0], tempArr[1])
       }
   } else {
       max = tempArr.length ? tempArr[0] : 0
   }
   return max >= 2
};

// top2: 64ms
var hasGroupsSizeX = function(deck) {
    // var arr = Array.from(new Set(deck))
    var obj = {}
    deck.forEach(e => {
        if (!obj[e]) {
            obj[e] = 1
        } else {
            obj[e] = obj[e] + 1
        }
    })

    var arr = Object.values(obj)

    // 计算最大公约数
    function gcd(num1, num2) {
        return num2 === 0 ? num1 : gcd(num2, num1 % num2)
    }
    var g = arr[0] 
    arr.forEach(e => {
        g = gcd(g, e)
    })
    return g >= 2    
};
```











#### Expand：

