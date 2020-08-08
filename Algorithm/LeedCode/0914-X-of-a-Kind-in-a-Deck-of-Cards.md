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
Output: false´
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



#### Code1：2020-08-08

```javascript

```

#### More：

##### More1：

##### MoreX：

更多解法：

#### Top：

```javascript
// top1: ms
// 感悟:

// top2: ms
// 感悟:
```



#### Think：

#### Expand：

