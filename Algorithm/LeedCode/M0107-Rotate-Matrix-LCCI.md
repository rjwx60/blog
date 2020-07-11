#### [M0107.Rotate Matrix LCCI](https://leetcode-cn.com/problems/rotate-matrix-lcci/)

Given an image represented by an N x N matrix, where each pixel in the image is 4 bytes, write a method to rotate the image by 90 degrees. Can you do this in place?

给你一幅由 `N × N` 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。**不占用额外内存空间能否做到**？

#### Example：

```
Given matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

Rotate the matrix in place. It becomes:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]

Given matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 

Rotate the matrix in place. It becomes:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]
```



#### Code1：2020-07-11

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    if(matrix.length < 2) return;
    let len = matrix.length, result = [];
    for(let i = 0; i < len; i++) {
        let row = [];
        for(let j = len - 1; j >= 0; j--) {
            row.push(matrix[j][i]);
        }
        result.push(row);
    }
    matrix.length = 0;
    matrix.push(...result);
};
// 注意: 
// 通常手段，比如上面用 result 缓存再处理是可以得出结果，但题目要求不占用额外内存空间，即不能使用额外变量，全程只能在 matrix 上操作，所以本题关键非单纯得出结果，而是要在 matrix 上直接操作，得出结果

// 正确做法:
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  let len = matrix.length;
  for(let row = 0; row < len; row++) {
      // 若 column = row + 1 则还可忽略对角线上的值，提升速度
      for(let column = row; column < len; column++) {
          // ES6 解构赋值交换元素
          [matrix[row][column], matrix[column][row]] = [matrix[column][row], matrix[row][column]];
      }
  };
  for(let row = 0; row < len; row++) {
    matrix[row].reverse();
  };
};
// 执行用时： 68 ms , 在所有 JavaScript 提交中击败了 68.12% 的用户 
// 内存消耗： 33 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路: 
// 本题关键在对矩形的空间感的理解(或矩形计算的理解-线性代数), 若理解则可得知可先通过对角线的值交换，然后再进行行翻转得到最终结果
```



#### More：

##### More1：

作者：lvshanke
链接：https://leetcode-cn.com/problems/rotate-matrix-lcci/solution/dan-ke-xi-lie-yong-shi-9800nei-cun-10000-by-lvshan/

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;
    let count = (n / 2) | 0;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < n; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[n-i-1][j];
            matrix[n-i-1][j] = tmp;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    }
};
// 思路与 Code1 一致，只是未用 ES6
// 时间复杂度是O(n^2) ，空间复杂度是O(1)
// 与之思路相一致的但对角线不一样的还有: 
// https://leetcode-cn.com/problems/rotate-matrix-lcci/solution/pythonjavascript-liang-ci-fan-zhuan-mian-shi-ti-01/
```



##### More2：

作者：francis_yang
链接：https://leetcode-cn.com/problems/rotate-matrix-lcci/solution/zhi-jie-huan-jiu-xing-liao-by-francis_yang/

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    var n = matrix.length;
    for (let i = 0; i < n / 2; i++) {
        for (let j = i; j < n - 1 - i; j++) {
            [matrix[n-1-j][i],matrix[i][j]]=[matrix[i][j], matrix[n-1-j][i]];
            [matrix[n-1-i][n-1-j],matrix[n-1-j][i]]=[matrix[n-1-j][i], matrix[n-1-i][n-1-j]];
            [matrix[j][n-1-i],matrix[n - 1 - i][n - 1 - j]]=[matrix[n - 1 - i][n - 1 - j], matrix[j][n-1-i]];
        }
    }
    return matrix;
};
// 真大佬，将翻转也一并解决了

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    var n = matrix.length;
    for (let i = 0; i < n / 2; i++) {
        for (let j = i; j < n - 1 - i; j++) {
            let temp = matrix[n-1-j][i];
            matrix[n-1-j][i] = matrix[i][j];
            matrix[i][j] = temp;

            let temp2 = matrix[n-1-i][n-1-j];
            matrix[n-1-i][n-1-j] = matrix[n-1-j][i];
            matrix[n-1-j][i] = temp2;

            let temp3 = matrix[j][n-1-i];
            matrix[j][n-1-i] = matrix[n - 1 - i][n - 1 - j];
            matrix[n - 1 - i][n - 1 - j] = temp3;
        }
    }
    return matrix;
};
// 执行用时： 64 ms , 在所有 JavaScript 提交中击败了 85.33% 的用户 
// 内存消耗： 32.5 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户
```



##### More3：

作者：gatsby-23
链接：https://leetcode-cn.com/problems/rotate-matrix-lcci/solution/javascripttong-su-yi-dong-zhu-shi-xiang-jin-yi-k-3/

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const length = matrix.length;

    for(let i = length - 1; i >= 0; i--) {
        for(let j = 0; j < length; j++) {
            matrix[j].push(matrix[i][j]);
        }
    }

    for(let i = 0; i < length; i++) {
        matrix[i].splice(0, length);
    }
};

// 思路:
// 若使用额外空间的做法...自由度高了许多
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/rotate-matrix-lcci/solution/xuan-zhuan-ju-zhen-by-leetcode-solution/



#### Top：

```javascript
// top1: 48ms
var rotate = function(matrix) {
    const n = matrix.length;
    let count = (n / 2) | 0;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < n; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[n-i-1][j];
            matrix[n-i-1][j] = tmp;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    }
};
// 感悟: ...


// top2: 52ms
var rotate = function(matrix) {
  const length = matrix.length;
  for(let i = length - 1; i >= 0; i--) {
    for(let j = 0; j < length; j++) {
      matrix[j].push(matrix[i][j]);
    }
  }
  for(let i = 0; i < length; i++) {
    matrix[i].splice(0, length);
  }
};
// 感悟: ...
```



#### Think：



#### Expand：