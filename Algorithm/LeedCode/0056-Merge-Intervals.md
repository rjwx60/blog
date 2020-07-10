#### [56.Merge-Intervals](https://leetcode-cn.com/problems/merge-intervals/)

Given a collection of intervals, merge all overlapping intervals.

给出一个区间的集合，请合并所有重叠的区间。



#### Example：

```
Input: [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].

Input: [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```



#### NOTE: 

input types have been changed on April 15, 2019. Please reset to default code definition to get new method signature.



#### Code1：2020-07-10

```javascript
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  if (intervals.length < 2) return intervals;
  // 限定为升序区间
  intervals.sort((a, b) => a[0] - b[0]);
  var result = [], max, min;
  for(let i = 0; i < intervals.length; i++) {
      // 当前项
      current = intervals[i];
      currentNext = intervals[i+1];
      // 将区间固定在最大范围
      if (max !== undefined) {
        current[0] = min <= current[0] ? min : current[0];
        current[1] = max >= current[1] ? max : current[1];
      }
      // 若当前项[1]大于等于后一项[0]，则表示有交集，与当前区间进行判断，取更广范围区间
      if (currentNext && current[1] >= currentNext[0]) {
          max = Math.max(current[1], currentNext[1]);
          min = Math.min(current[0], currentNext[0]);
          continue;
      } else{
        // 若当前项[1]小于等于后一项[0]，则表示无交集，存储已获取到的区间，并开始新一轮的操作
        max ? result.push([min, max]) : result.push([current[0], current[1]]);
        if(!currentNext) break;
        min = currentNext[0];
        max = currentNext[1];
      }
  }
  return result;
};
// 执行用时： 88 ms , 在所有 JavaScript 提交中击败了 71.64% 的用户 
// 内存消耗： 38.2 MB , 在所有 JavaScript 提交中击败了 22.22% 的用户

// 思路:
// 思路一开始就有，即当前值[1] > 下一值[0] 即表示有交集，但一开始未考虑乱序元素故未排序导致许多报错(题目无写明即须要考虑...)
// 小区间、大区间、不相关区间；大区间、小区间、不相关区间；一开始只考虑了小大区间的交集，未考虑大小区间的交集情况，故未将最大区间范围固定，故同样导致许多报错
```



#### More：

##### More1：

作者：jsyt
链接：https://leetcode-cn.com/problems/merge-intervals/solution/js-jian-dan-yi-dong-jie-fa-by-jsyt/

```javascript
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    if (!intervals || !intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    let ans = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        if (ans[ans.length - 1][1] >= intervals[i][0]) {
            ans[ans.length - 1][1] = Math.max(ans[ans.length - 1][1], intervals[i][1])
        } else {
            ans.push(intervals[i])
        }
    }
    return ans;
};

// 思路:
// 牛皮，四两拨千斤，由存入结果区间与现其他区间相比较，取最大值；若无交集则直接塞入；
```



##### More2：

作者：caifeng123
链接：https://leetcode-cn.com/problems/merge-intervals/solution/he-bing-qu-jian-chao-rong-yi-li-jie-93100-by-caife/

```javascript
var merge = function(intervals) {
  if(intervals.length === 0)
    return []
  var res = []
  intervals.sort(function(a,b){
    return a[0] - b[0]
  })
  res.push(intervals[0]);
  // i 取 1
  for(var i = 1; i < intervals.length; i++){
    if(intervals[i][0] > res[res.length-1][1])
      res.push(intervals[i])
    else
      if(intervals[i][1] > res[res.length-1][1])
        res[res.length-1][1] = intervals[i][1]
  }
  return res
};

// 思路:
// 将数组按左边界排序以得到向上递增的数组，然后前一项的右边界 >= 当后一项的左边界即证明有相交
// 合并前需要进行判断 若前一项右边界 >= 后一项的右边界则跳过不动
```





#### Think：

- 关键，许多题目的关键，找准临界值或判定条件，然后将其具象化，代码化，可能一遍不能实现的完美，那就多次；



#### Expand：