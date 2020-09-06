#### [0498.Diagonal Traverse](https://leetcode-cn.com/problems/diagonal-traverse/)

Given a matrix of M x N elements (M rows, N columns), return all elements of the matrix in diagonal order as shown in the below image.

给定一个含有 M x N 个元素的矩阵（M 行，N 列），请以对角线遍历的顺序返回这个矩阵中的所有元素，对角线遍历如下图所示。



#### Example：

```
Input:
[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
]

Output:  [1,2,4,7,5,3,6,8,9]

Explanation:
```

<img src="/Users/rjwx60/Documents/FE/Github/Blog/Source/Image/Algorithm/Algorithm/0498.png" style="zoom:50%;" align="left" />

#### Note：

The total number of elements of the given matrix will not exceed 10,000.



#### Code1：2020-07-11

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var findDiagonalOrder = function (matrix) {
  if(!matrix.length) return [];
  if(matrix.length === 1) return matrix[0];
  let rowLen = matrix.length;
  let columnLen = matrix[0].length;
  let maxCycNum = rowLen + columnLen - 1;
  let i = m = 0, j = n = 0, cache = [], result = [];
  for(let k = 0; k < maxCycNum; k++) {
    // 斜打印有规律，matrix[i][j] = matrix[m][n] 中，m 逐渐变小(-1)，n 则变大(+1)
    m = i;
    n = j;
    cache = [];
    while(matrix[m] && (matrix[m][n] !== undefined)) {
      cache.push(matrix[m][n]);
      m--;
      n++;
    }
    // k 为偶数数则将数组先翻转再插入
    if(k % 2) {
      result.push(...(cache.reverse()));
    } else {
      result.push(...cache);
    }
    // 初始序号变化 分 2 阶段
    if(i < rowLen - 1) {
      // 上到下段
      i++;
    } else if(j < columnLen - 1) {
      // 左到右段
      j++;
    }
  }
  return result;
};
// 执行用时：108 ms, 在所有 JavaScript 提交中击败了87.43%的用户
// 内存消耗：43.1 MB

// 思路:
// 1、斜向打印，并对偶数行进行翻转，即可得到结果
// 2、由 1 知循环次数为行数+列数-1
// 3、以斜向行为行，设每行首个元素地址索引为 (x, y), 并取行数为 row 列数为 column，发现规律A: 当 x < row - 1 时，不断增加，直至为 row - 1, 此时 y 才开始增加；可画图示意; 
// 4、确定每行开始索引后，又发现规律B: 即斜向行索引变化规律为: 由首索引开始，x 不断 - 1，且 y 不断 + 1，直至无此元素；比如：
// 某斜向行索引为: (x, y), 则此斜向行下一元素索引为 (x-1,y+1), 以此类推，直至数组无此元素；
```



#### More：

##### More1：

作者：lvshanke
链接：https://leetcode-cn.com/problems/diagonal-traverse/solution/dan-ke-xi-lie-yong-shi-9799nei-cun-10000-by-lvshan/

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var findDiagonalOrder = function(matrix) {
    if(!matrix.length) return [];
    let l_row = matrix.length - 1;
    let l_col = matrix[0].length - 1;
    let row = 0, col = 0;
    let is_up = true;
    let fun = (res) => {
        res.push(matrix[row][col]);
        if(row == l_row && col == l_col){
            return res;
        }
        if(is_up){
            if(col < l_col && row > 0){
                col++;
                row--;
            }else{
                is_up = !is_up;
                col < l_col ? col++ : row++;
            }
        }else{
            if(col > 0 && row < l_row){
                col--;
                row++;
            }else{
                is_up = !is_up;
                row < l_row ? row++ : col++;
            }
        }
        return fun(res);
    }
    return fun([]);
};
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/diagonal-traverse/solution/



#### Top：

```javascript
// top1: 88ms
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var findDiagonalOrder = function (matrix) {
  if (matrix.length === 0) return []

  let flag = false
  const res = []
  let x = 0, y = 0

  while (x < matrix[0].length && y < matrix.length) {
    res.push(matrix[y][x])

    if (y === 0 && !flag && x + 1 < matrix[0].length) {
      x++
      flag = true
    } else if (y === matrix.length - 1 && flag) {
      x++
      flag = false
    } else if (x === 0 && flag) {
      y++
      flag = false
    } else if (x === matrix[0].length - 1 && !flag) {
      y++
      flag = true
    } else {
      y = flag ? y + 1 : y - 1
      x = flag ? x - 1 : x + 1
    }
  }
  return res
}
// 感悟:

// top2: 92ms
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var findDiagonalOrder = function (matrix) {
    if (matrix.length === 0) return [];
    const M = matrix.length;
    const N = matrix[0].length;
    const MatrixNum = M * N;
    let count = 0;
    let x = y = 0;
    let result = [];
    let direction = 'up';
    while (count < MatrixNum) {
        count++;
        result.push(matrix[x][y]);
        if (direction === 'up') {
            if (x > 0 && y < N - 1) {
                x--;
                y++;
                continue;
            } else {
                direction = 'down'
                if (x === 0 && y < N - 1) y++;
                else if (y === N - 1) x++;
            }

        } else {
            if (x < M - 1 && y > 0) {
                x++;
                y--;
                continue;
            } else {
                direction = 'up';
                if (y === 0 && x < M - 1)
                    x++;
                else if (x === M - 1)
                    y++;
            }
        }
    }
    return result;
};
// 感悟:
```



#### Think：

#### Expand：

