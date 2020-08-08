#### [14. Longest Common Prefix](https://leetcode-cn.com/problems/longest-common-prefix/)



### 一、内容

Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 `""`。

#### 1-1、Example

```
Input: ["flower","flow","flight"]
Output: "fl"

Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

#### 1-2、Note

All given inputs are in lowercase letters `a-z`.

#### 1-3、标签

String、TrieTree



### 二、思路与解答

#### 2-1、思路



#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/longest-common-prefix/solution/



##### 2-2-2、自实现

```js
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs, result = '') {
  let map = new Map();
  // 特殊值 [] [""] ["字母"] ["字母", ""]
  if(!strs.length) return result;
  if(strs.length === 1) return strs[0].slice(0,1);
  if(strs.findIndex(cv => !cv) !== -1) return result;


  for(let i = 0; i < strs.length; i++) {
    // 避免 ["", ""]
    let target = strs[i] && strs[i][0];
    if(!target) continue;
    if(map.has(target)) {
      let son = map.get(target);
      son.push(strs[i].slice(1));
      map.set(target, son);
    } else {
      map.set(target, [strs[i].slice(1)])
    }
  }
  // 排序 - 后续仅判断首个元素即可
  const strArr = Array.from(map).sort((b, a) => b[1].length - a[1].length);

  // 递归
  if (!strArr.length || strArr.length > 1 || strArr[0][1].length <= 1) {
    return result;
  } 
  if (strArr[0][1].findIndex(cv => !cv) !== -1 ) {
    return result + strArr[0][0];
  } else {
    return result + strArr[0][0] + longestCommonPrefix(strArr[0][1], result);
  }
};
// 执行用时： 80 ms , 在所有 JavaScript 提交中击败了 50.22% 的用户 
// 内存消耗： 38 MB , 在所有 JavaScript 提交中击败了 6.06% 的用户
```

思路: 
1、用 map 存储首字母，相同首字母的做合集
2、根据首字母合集的长度做排序，此后仅判断首个元素即可
3、因需取最小值(最长公共前缀取决于最短相同前缀的字符串)，所以后续递归的最终条件是 slice(0,1) 后元素不存在空洞元素
4、此外还需注意 strArr.length > 1 的情况，此时表示 sort 得到 2+ 结果，没有最长公共(最长==唯一)



##### 2-2-3、综合实现

```js
var longestCommonPrefix = function(strs) {
    strs.sort()//按编码排序
    if (strs.length === 0) return ''//空数组返回''
    var first = strs[0],
        end = strs[strs.length - 1]
    if(first === end || end.match(eval('/^' + first + '/'))){
        return first//first包含于end返回first
    }
    for(var i=0;i<first.length;i++){
        if(first[i] !== end[i]){
            return first.substring(0,i)//匹配失败时返回相应字符串
        }
    }
};
// 作者：leaveeel
// 链接：https://leetcode-cn.com/problems/longest-common-prefix/solution/js-fang-fa-by-leaveeel/
```

思路:
首先，利用sort的排序方法将数组按照编码排序，只需要校验array[0]和array[array.length-1]的值；
然后，判断是否存在包含关系即array[0]包含于array[array.length-1]；
最后，对首尾两个值进行字符串匹配，得到公共前缀；

```js
var longestCommonPrefix = function(strs) {
    if(!strs.length) return '';
    let [a, ...b] = strs;
    let result = '';
    for(let i = 0; i < a.length; i++){
        let flag = b.every(item => item[i] === a[i]);
        if(flag) result += a[i];
        else break;
    }
    return result;
};
// 作者：caoyq0521
// 链接：https://leetcode-cn.com/problems/longest-common-prefix/solution/zui-chang-gong-gong-qian-zhui-by-caoyq0521/
```

思路:
取出数组的第一个字符串依次和剩余的字符串去比较；



```javascript
var longestCommonPrefix = function(strs) {
  let str = strs[0]
  if(!str) return ''
  let res = ''
  for(let i = 0; i < str.length; i++){
    let flag = strs.every(item => item[i] == str[i])
    if (flag) {
      res += str[i]
    }else {
      return res
    }
  }
  return res
};

// 作者：shetia
// 链接：https://leetcode-cn.com/problems/longest-common-prefix/solution/zhong-suo-zhou-zhi-zhe-shi-dao-yue-du-ti-by-shetia/
```

思路:
题目要求的是：最长公共前缀, 第一次看还以为是找最长公共子串



https://leetcode-cn.com/problems/longest-common-prefix/solution/tu-jie-leetcodezui-chang-gong-gong-qian-zhui-lcp-b/





### 三、Top

#### 3-1、44ms

```js
var longestCommonPrefix = function(strs) {
    if(strs.length==0) return "";
    if(strs.length==1) return strs[0];
    if(strs.indexOf('')>-1) return "";

    let lens = strs.map(item => item.length);
    let minLen = Math.min.apply(null, lens);
    let str = strs[lens.indexOf(minLen)];
    let index=0, res="";
    while(index<str.length){
        let flag = strs.every((item)=>{
            return item[index]==str[index];
        });
        if(flag){
            res+=str[index];
            index++;
        }else{
            if(!index) return "";
            if(index) return res;
        }
    }
    return str;
};
```



#### 3-2、48ms

```js
var longestCommonPrefix = function(strs) {
    if (strs === null || strs.length === 0) return "";
    if(strs.length === 1) return strs[0]
    let min = 0, max = 0
    for(let i = 1; i < strs.length; i++) {
        if(strs[min] > strs[i]) min = i
        if(strs[max] < strs[i]) max = i
    }
    for(let j = 0; j < strs[min].length; j++) {
        if(strs[min].charAt(j) !== strs[max].charAt(j)) {
            return strs[min].substring(0, j)
        }
    }
    return strs[min]
};
```



#### 3-3、52ms

```js
var longestCommonPrefix = function(strs) {
    if(strs == '') return ''
    let newStrs = strs.sort((x, y) => x.length -y.length)
    let firstStr = newStrs[0];
    let len = firstStr.length
    let res = ''
    for(let i = len; i >= 0; i--) {
        res = firstStr.slice(0, i)
        let status = newStrs.every(item => item.indexOf(res) == 0)
        if(status) {
            break
        }
    }
    return res
};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx



