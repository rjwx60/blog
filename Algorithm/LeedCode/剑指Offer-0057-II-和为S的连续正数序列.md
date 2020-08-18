#### [剑指 Offer 57 - II. 和为s的连续正数序列](https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

来源：力扣（LeetCode）

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



### 一、Content

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。



#### 1-1、Example

```
输入：target = 9
输出：[[2,3,4],[4,5]]
示例 2：

输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```



#### 1-2、Note

1 <= target <= 10^5



#### 1-3、Tag

Queue、双向指针



### 二、思路与解答

#### 2-1、思路

##### 2-1-1、自思路

- 提示很明显了，关键是连续，可联想到队列；
- 构建一虚拟队列，初始元素 1，2，队列头尾分别对应头尾指针，若头右移，则队列增加一个数，若尾右移，则队列减少一个数(队列头方向居右)；当队列和大于目标值，尾指针右移，以谨慎缩小与目标值的差值；当队列和小于目标值，头指针右移，以大胆增加自身值；

##### 2-1-2、其他思路

先把数分解 9=1+8=2+7=3+6=4+5，按这种，找到可能组成正确结果的数组，根据数的结构，易知结果可能存在 [1,2,3,4,5] 中，不难发现数组最后一个数；如果target是偶数就是 target/2，如果是奇数就是 target/2 取整+1，即 Math.floor(target/2)+1或采用二进制取整 (target/2 | 0) + 1，再对找到的数组采用滑动窗口模型，找出答案；

 

#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/solution/

##### 2-2-2、自实现

```js
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function(target) {
  var result = [];
  var child = [1, 2];
  let big = 2;
  let small = 1;
  let currentSum = 3;
  while (big < target) {
    while (currentSum < target && big < target) {
      child.push(++big);
      currentSum += big;
    }
    while (currentSum > target && small < big) {
      child.shift();
      currentSum -= small++;
    }
    if (currentSum === target && child.length > 1) {
      result.push(child.slice());
      child.push(++big);
      currentSum += big;
    }
  }
  return result;
};
```



##### 2-2-3、综合实现

```js
/**
 * @param {number} target
 * @return {number[][]}
 */
var findContinuousSequence = function (target) {
  let index = target % 2 === 0 ? target / 2 : (target / 2 | 0) + 1
  let res = []
  let temp = []
  let sum = 0
  for (let i = 1; i <= index; i++) {
    temp.push(i)
    sum = sum + i
    while (sum > target) {
      sum -= temp[0]
      temp.shift()
    }
    if (sum === target) {
      temp.length >= 2 && res.push([...temp])
    }
  }
  return res;
};

// 作者：minCoding
// 链接：https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/solution/javascripthua-dong-chuang-kou-hen-rong-yi-li-jie-d/
```



### 三、Top

#### 3-1、56ms

```js
var findContinuousSequence = function(target) {
    if(target < 3) return [];
    let res = [], sum = 0;
    for(let i = 1, j = 2;  j <= Math.round(target / 2), i < j; ) {
        sum = (i + j) *  (j - i + 1) / 2;
        if(sum < target) {
            j++;
        }
        else if(sum > target) {
            i++;
        }
        else if(sum === target) {
            let tar = [];
            for(let l = i; l <= j; l++) {
                tar.push(l);
            }
            res.push(tar);
            i++;
        }
    }
    return res;
};
```



#### 3-2、36920kb

```js
var findContinuousSequence = function (target) {
	if (target < 3) {
		return []
	}
	let ans = [],
		find = [1, 2],
		small = 1,
		big = 2,
		stop = Math.floor(target + 1) / 2
	let sum = small + big
	for (let i = 3; i <= stop; i++) {
		big += 1
		sum += big
		find.push(big)
		while (sum > target) {
			sum -= small
			small += 1
			find.shift()
		}
		if (sum === target) {
			ans.push([...find])
		}
	}
	return ans
}



var findContinuousSequence = function(target) {
    let res = [];
    let i = 1;
    let j = 2;
    let sum = 3;
    while(i <= target / 2){
        if(sum === target){
            let arr = [];
            for(let t = i; t <= j; ++ t){
                arr.push(t);
            }
            res.push(arr);
            sum -= i;
            ++ i;
        }
        else if(sum < target){
            ++ j;
            sum += j;
        }
        else{
            sum -= i;
            ++ i;
        }
    }
    return res;
};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx

