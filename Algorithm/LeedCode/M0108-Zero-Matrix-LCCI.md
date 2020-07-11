#### [M0108.Zero Matrix LCCI](https://leetcode-cn.com/problems/zero-matrix-lcci/)

Write an algorithm such that if an element in an MxN matrix is 0, its entire row and column are set to 0.

编写一种算法，若M × N矩阵中某个元素为0，则将其所在的行与列清零。



#### Example：

```
Input: 
[
  [1,1,1],
  [1,0,1],
  [1,1,1]
]
Output: 
[
  [1,0,1],
  [0,0,0],
  [1,0,1]
]

Input: 
[
  [0,1,2,0],
  [3,4,5,2],
  [1,3,1,5]
]
Output: 
[
  [0,0,0,0],
  [0,4,5,0],
  [0,3,1,0]
]
```



#### Code1：2020-07-11

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
  let rowZeroMap = {},
    columnZeroMap = {},
    len = matrix.length;
  for (let row = 0; row < len; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      if (matrix[row][column] === 0) {
        rowZeroMap[row] = 1;
        columnZeroMap[column] = 1;
      }
    }
  }
  for (let row = 0; row < len; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      if (columnZeroMap[column] !== undefined) {
        matrix[row][column] = 0;
      }
      if(rowZeroMap[row] !== undefined) {
        matrix[row][column] = 0;
      }
    }
  }
};
// 执行用时： 88 ms , 在所有 JavaScript 提交中击败了 98.44% 的用户 
// 内存消耗： 38 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 用 map 存储值为 0 的行列数，随后根据情况赋 0
```



#### More：

##### More1：

作者：luoboo
链接：https://leetcode-cn.com/problems/zero-matrix-lcci/solution/ling-ju-zhen-js-jian-dan-yi-dong-by-luoboo/

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
    let column = [] //清除列
    for( let i=0; i<matrix.length; i++ ){
        let row = null;
        for( let j=0; j<matrix[i].length; j++){
            if( matrix[i][j] == 0 ){
                row = i
                column.push(j)
            }
        }
        if( row != null ){
            for( let j=0; j<matrix[i].length; j++){
                matrix[i][j] = 0
            }
        }
    }
    for( let i=0; i<matrix.length; i++ ){
        for( let j of column){
            matrix[i][j] = 0
        }
    }
    return matrix
};
```



##### More2：

作者：lvshanke
链接：https://leetcode-cn.com/problems/zero-matrix-lcci/solution/dan-ke-xi-lie-yong-shi-8980nei-cun-10000-by-lvshan/

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function(matrix) {
    let rows = new Set(), cols = new Set();
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 0) {
                rows.add(row);
                cols.add(col);
            }
        }
    }
    //行清零
    for (let row of rows) {
        for (let col = 0; col < matrix[row].length; col++) {
            matrix[row][col] = 0;
        }
    }
    //列清零
    for (let col of cols) {
        for(let row = 0; row < matrix.length; row++) {
            matrix[row][col] = 0;
        }
    }
    return matrix;
};
```



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/zero-matrix-lcci/solution/dan-ke-xi-lie-yong-shi-8980nei-cun-10000-by-lvshan/



#### Top：

```javascript
// top1: 80ms
var setZeroes = function(matrix) {
    const row = matrix.length;
    const column = matrix[0].length;
    const newMatrix = JSON.parse(JSON.stringify(matrix));
    for (let i = 0; i<row; i++){
        for (let j = 0; j < column; j++){
            if (newMatrix[i][j] === 0) {
                for (let i1 = 0; i1<row; i1++){
                    matrix[i1][j] = 0;
                }
                for (let j1 = 0; j1<column; j1++){
                    matrix[i][j1] = 0;
                }
            }
        }
    }
    return matrix;
};
// 感悟: 
// 先复制一份，用空间换时间，每在克隆体找到 0 元素，即对原个体进行行赋值或列赋值，对比 Code1 搜索和赋值操作分开(未考虑用克隆体解决)，导致时间复杂度上升

// top4: 92ms
var setZeroes = function(matrix) {
    const rSet = new Set();
    const cSet = new Set();
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                rSet.add(i);
                cSet.add(j);
            }
        }    
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (rSet.has(i) || cSet.has(j)) {
                matrix[i][j] = 0;
            }
        }    
    }
    return matrix;
};
// 感悟:
// ES11都出来了，就不要用 {} 而应该用高级语法了亲~
```



#### Think：

#### Expand：

