#### [17. Letter Combinations of a Phone Number](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

给定一个仅包含数字 `2-9` 的字符串，返回所有它能表示的字母组合。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。



#### Example：

```
Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```



#### Note：

Although the above answer is in lexicographical order, your answer could be in any order you want.



#### Code1：2020-08-08

```javascript
var letterCombinations = function(digits) {
  // 对输入做处理，如果小于1返回空（LeetCode测试用例）
  if (digits.length < 1) return []
  // 建立电话号码键盘映射
  let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
  // 若只给了一个按键，直接把按键内容取出来并按单个字符分组即可
  if (digits.length < 2) return map[digits].split('')
  // 将输入字符串按单字符 分隔成 数组，234=>[2,3,4]
  let num = digits.split('')
  // 保存键盘映射的字母内容，如 23=>['abc','def']
  let code = []
  num.forEach(item => {
    if (map[item]) {
      code.push(map[item])
    }
  })
  let comb = (arr) => {
    // 临时变量用来保存前两个组合的结果
    let tmp = []
    // 最外层的循环是遍历第一个元素，里层的循环是遍历第二个元素
    for (let i = 0, il = arr[0].length; i < il; i++) {
      for (let j = 0, jl = arr[1].length; j < jl; j++) {
        tmp.push(`${arr[0][i]}${arr[1][j]}`)
      }
    }
    arr.splice(0, 2, tmp)
    if (arr.length > 1) {
      comb(arr)
    } else {
      return tmp
    }
    return arr[0]
  }
  return comb(code)
};
```





#### More：

##### More1：



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/solution/



#### Top：

```javascript
// top1: 44ms
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    let numMap = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    }
    if (digits.length === 0) return []
    if (digits.length === 1) return numMap[digits].split('')
    
    let d = digits.split('')
    d = d.map(num => {
        return numMap[num].split('')
    })
    
    let arr = []

    help(d[0], d[1])

    function help(arr1, arr2) {
        arr1.forEach(a1 => {
             arr2.forEach(a2 => {
                 arr.push(`${a1}${a2}`)
            })
        })
        d.splice(0, 2, arr)
        if (d.length > 1) {
            arr = []
            help(d[0], d[1])
        }
    }

    return arr
};
// 感悟:
// 可读性对效率执行有一定帮助


// top2: 48ms
var letterCombinations = function(digits) {
  let result = ['']

  if (digits.length === 0) return []

  const letterMap = {
      2: ['a', 'b', 'c'],
      3: ['d', 'e', 'f'],
      4: ['g', 'h', 'i'],
      5: ['j', 'k', 'l'],
      6: ['m', 'n', 'o'],
      7: ['p', 'q', 'r', 's'],
      8: ['t', 'u', 'v'],
      9: ['w', 'x', 'y', 'z'],
  }

  const addLetter = (num) => {
    const letters = letterMap[num]
    const output = []

    for (let i = 0, len = letters.length; i < len; i++) {
      const letter = letters[i]

      for (let j = 0, lenR = result.length; j < lenR; j++) {
        output.push(result[j] + letter)
      }
    }

    return output
  }

  for (let i = 0, len = digits.length; i < len; i++) {
    result = addLetter(digits[i])
  }

  return result
};
// 感悟:
// 同上


// top: 52ms
var letterCombinations = function(digits) {
    var map = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz',
    };

    function backtrace(digits) {
        if (digits.length === 0) {
            return [];
        }

        if (digits.length === 1) {
            return map[digits].split('');
        }

        var lastNum = digits[digits.length - 1];
        var arr = backtrace(digits.substr(0, digits.length - 1));
        var _arr = [];
        for (var i = 0; i < arr.length; i++) {
            var str = map[lastNum];
            for (var j = 0; j < str.length; j++) {
                _arr.push(arr[i] + str[j]);
            }
        }

        return _arr;
    }

    return backtrace(digits);
};
```



#### Think：

- 使用回溯，回溯是一种通过穷举所有可能情况来找到所有解的算法。如果一个候选解最后被发现并不是可行解，回溯算法会舍弃它，并在前面的一些步骤做出一些修改，并重新尝试找到可行解；如 Code1；



时间复杂度：O(3^N  X 4^M)，其中 N 是输入数字中对应 3 个字母的数目（比方说 2，3，4，5，6，8）， M 是输入数字中对应 4 个字母的数目（比方说 7，9），N+M 是输入数字的总数；

空间复杂度：O(3^N  X 4^M)，这是因为需要保存 3^N  X 4^M 个结果；



#### Expand：

