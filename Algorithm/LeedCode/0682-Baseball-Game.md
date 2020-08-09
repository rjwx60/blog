#### [682. Baseball Game](https://leetcode-cn.com/problems/baseball-game/)

### 一、Content

You're now a baseball game point recorder.

你现在是棒球比赛记录员。

Given a list of strings, each string can be one of the 4 following types:

Integer (one round's score): Directly represents the number of points you get in this round.
"+" (one round's score): Represents that the points you get in this round are the sum of the last two valid round's points.
"D" (one round's score): Represents that the points you get in this round are the doubled data of the last valid round's points.
"C" (an operation, which isn't a round's score): Represents the last valid round's points you get were invalid and should be removed.
Each round's operation is permanent and could have an impact on the round before and the round after.

You need to return the sum of the points you could get in all the rounds.

给定一个字符串列表，每个字符串可以是以下四种类型之一：

- 整数（一轮的得分）：直接表示您在本轮中获得的积分数。

- "+"（一轮的得分）：表示本轮获得的得分是前两轮有效 回合得分的总和。
- "D"（一轮的得分）：表示本轮获得的得分是前一轮有效 回合得分的两倍。
- "C"（一个操作，这不是一个回合的分数）：表示您获得的最后一个有效 回合的分数是无效的，应该被移除。

每一轮的操作都是永久性的，可能会对前一轮和后一轮产生影响。
你需要返回你在所有回合中得分的总和。



#### 1-1、Example

```
Input: ["5","2","C","D","+"]
Output: 30
Explanation: 
Round 1: You could get 5 points. The sum is: 5.
Round 2: You could get 2 points. The sum is: 7.
Operation 1: The round 2's data was invalid. The sum is: 5.  
Round 3: You could get 10 points (the round 2's data has been removed). The sum is: 15.
Round 4: You could get 5 + 10 = 15 points. The sum is: 30.

Input: ["5","-2","4","C","D","9","+","+"]
Output: 27
Explanation: 
Round 1: You could get 5 points. The sum is: 5.
Round 2: You could get -2 points. The sum is: 3.
Round 3: You could get 4 points. The sum is: 7.
Operation 1: The round 3's data is invalid. The sum is: 3.  
Round 4: You could get -4 points (the round 3's data has been removed). The sum is: -1.
Round 5: You could get 9 points. The sum is: 8.
Round 6: You could get -4 + 9 = 5 points. The sum is 13.
Round 7: You could get 9 + 5 = 14 points. The sum is 27.
```



#### 1-2、Note

The size of the input list will be between 1 and 1000.
Every integer represented in the list will be between -30000 and 30000.



#### 1-3、Tag

Stack



### 二、思路与解答

#### 2-1、思路

关键：用栈存储有效值



#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/baseball-game/solution/



##### 2-2-2、自实现

```js
/**
 * @param {string[]} ops
 * @return {number}
 */
var calPoints = function(ops) {
  let result = 0, effValStack = [];
  for(let i = 0; i < ops.length; i++) {
    let tail, tail2, value;
    switch(ops[i]) {
      case 'C':
        result -= +effValStack.pop();
        break;
      case 'D':
        tail = effValStack[effValStack.length - 1];
        tail = tail === undefined ? 0 : tail;
        value = tail * 2;
        effValStack.push(value);
        result += value;
        break;
      case '+':
        tail = effValStack[effValStack.length - 1];
        tail2 = effValStack[effValStack.length - 2];
        tail = tail === undefined ? 0 : tail;
        tail2 = tail2 === undefined ? 0 : tail2;
        value = +tail + +tail2;
        effValStack.push(value);
        result += value;
        break;
      default:
        effValStack.push(ops[i]);
        result += +ops[i];
        break;
    }
  }
  return result;
};
```



##### 2-2-3、综合实现



### 三、Top

#### 3-1、52ms

```js
var calPoints = function(ops) {
  let arr = [];
  let opera = {
    "+": function() {
      let total = arr.length > 1 ? Number(arr[arr.length - 1]) + Number(arr[arr.length -2]): arr[0];
      arr.push(total);
    },
    "D": function() {
      arr.length && arr.push(arr[arr.length - 1] * 2)
    },
    "C": function() {
      arr.pop();
    },
    'in': function(item) {
      arr.push(item);
    }
  };

  ops.forEach((item) => {
    if (item in opera) {
      opera[item]();
    } else {
      opera.in(item);
    }
  })

  return arr.reduce((total, num) =>  Number(total) + Number(num))

}
```



#### 3-2、56ms

```js
var calPoints = function(ops) {
    const stack = [];
    ops.forEach(value => {
        let len = stack.length,
            sum;
        if(value == "+" && len > 1) {
            sum = stack[len-1] + stack[len-2];
            stack.push(sum);
        }else if(value == "D" && len > 0) {
            sum = stack[len-1] * 2;
            stack.push(sum);
        }else if(value == "C" && len > 0) {
            stack.pop();
        }else {
            stack.push(parseInt(value));
        }
    });
    
    return stack.reduce((acc, current) => acc += current);
};
```



#### 3-3、60ms

```js
var calPoints = function (ops) {
    // 用数组来实现堆栈结构，因为数组有push、pop的功能
    var result = [];
    // 记录上一次数值
    var pre1;
    // 记录上上次数值
    var pre2;
    // 对数组进行遍历，遍历的目的是处理得分
    ops.forEach(item => {
        switch (item) {
            // 最后一个回合分无效，需移除
            case 'C':
                if (result.length) {
                    result.pop();
                }
                break;
            // 得分为前一轮得分的两倍
            case 'D':
                if (result.length) {
                    pre1 = result.pop();
                    result.push(pre1, pre1 * 2);
                }
                break;
            // 得分为前两轮得分的总和
            case '+':
                if (result.length) {
                    pre1 = result.pop();
                    pre2 = result.pop();
                    result.push(pre2, pre1, pre1 + pre2);
                }
                break;
            // 为数字的情况
            default:
                result.push(item * 1);
        }
    });

    return result.reduce((pre, curr) => {
        return pre + curr
    });
};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx

