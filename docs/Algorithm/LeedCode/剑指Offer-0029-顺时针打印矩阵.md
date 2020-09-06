#### [剑指 Offer 29. 顺时针打印矩阵](https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/)



### 一、Content

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

 

#### 1-1、Example

```
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]

输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]
```



#### 1-2、Note

- `0 <= matrix.length <= 100`
- `0 <= matrix[i].length <= 100`



#### 1-3、Tag

Array、多维数组



### 二、思路与解答

#### 2-1、思路

##### 2-1-1、自思路

- 不要复杂化，单一问题单一解决，这样会容易理解和清晰的多；
- 将打印一圈拆解为四部: 第一步：从左到右打印一行、第二步：从上到下打印一列、第三步：从右到左打印一行、第四步：从下到上打印一列；
- 最后一圈很有可能出现几种异常情况,打印矩阵最里面一圈可能只需三步、两步、甚至一步；
- <img src="../../../../BlogImgsBed/Source/Image/Algorithm/Array/6.png" style="zoom:30%;" align="left"/>
- <img src="../../../../BlogImgsBed/Source/Image/Algorithm/Array/7.png" style="zoom:50%;" align="left"/>



#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/solution/

##### 2-2-2、自实现

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  var start = 0;
  var result = [];
  var rows = matrix.length;
  if(matrix.length < 1) return [];
  if(matrix.length < 2) return matrix[0];
  var coloums = matrix[0].length;
  if (!rows || !coloums) {
    return false;
  }
  
  // 关键: 循环结束的条件
  while (coloums > start * 2 && rows > start * 2) {
    printCircle(matrix, start, coloums, rows, result);
    start++;
    // start = 0-0 1-1 2-2 3-3 ...
  }
  return result;
};


// 打印一圈
function printCircle(matrix, start, coloums, rows, result) {
  // 行末尾 (x,?)
  var entX = coloums - start - 1;
  // 末尾列 (?,y)
  var endY = rows - start - 1;
  
  // 1、左到右打印
  for (var i = start; i <= entX; i++) {
    result.push(matrix[start][i]);
  }
  // 若非单行则继续打印
  if (endY > start) {
    // 2、上到下打印
    for (var i = start + 1; i <= endY; i++) {
      result.push(matrix[i][entX]);
    }
    // 若非单列则继续打印
    if (entX > start) {
      // 3、右到左打印
      for (var i = entX - 1; i >= start; i--) {
        result.push(matrix[endY][i]);
      }
      // 若行数不少于2则继续打印
      if (endY > start + 1) {
        // 4、下到上打印
        for (var i = endY - 1; i > start; i--) {
          result.push(matrix[i][start]);
        }
      }
    }
  }
}
```



##### 2-2-3、综合实现

https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/solution/shou-hui-tu-jie-liang-chong-bian-li-de-ce-lue-na-c/



### 三、Top

#### 3-1、76ms

```js
var spiralOrder = function (arr) {
  if(arr==null||arr.length==0||arr[0].length==0)return[];
  var x = 0,
      y = 0;
  var direction = 0; //0 右  1 下  2左  3右
  var result = [];
  var length = arr.length * arr[0].length;
  var t_val = [arr[0].length, arr.length, 1, 1];
  var val = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];
  for (var i = 0; i < length; i++) {
    result.push(arr[y][x]);
    if ((direction % 2 === 0 ? x : y) === t_val[direction] - 1 ) {
      var t = (direction + 3) % 4;
      t_val[t] += t > 1 ? 1 : -1;
      direction = (direction + 1) % 4;
    }
    x += val[direction].x;
    y += val[direction].y;
  }
  return result;
};




var spiralOrder = function(matrix) {
    if(matrix.length==0)return []
    else{
        var startR=0
        var startC=0
        var endR=matrix.length-1
        var endC=matrix[0].length-1
        var res=[]
        console.log(startR)
        console.log(startC)
        console.log(endR)
        console.log(endC)
        while(startR<=endR&&startC<=endC){
            printEdge(matrix,res,startR++,startC++,endR--,endC--)//调用了函数之后缩小圈圈范围
        }
        return res 
    }
};
var printEdge=function(matrix,res,sR,sC,eR,eC){
    if(sR===eR){
        for(var i=sC;i<=eC;i++){
            res.push(matrix[sR][i])
        }
    }else if(sC===eC){
        for(var i=sR;i<=eR;i++){
            res.push(matrix[i][sC])
        }
    }else{
        var cR=sR
        var cC=sC
        while(cC<eC){
            res.push(matrix[cR][cC++])
        }
        while(cR<eR){
            res.push(matrix[cR++][cC])
        }
        while(cC>sC){
            res.push(matrix[cR][cC--])
        }
        while(cR>sR){
            res.push(matrix[cR--][cC])
        }
    }
    return res
}
```



#### 3-2、40408kb

```js
var spiralOrder = function(matrix) {
    if(matrix.length===0) return [];
    var maxRow = matrix.length-1;
    var maxCol = matrix[0].length-1;
    var row=0; col=0;
    var result =[];
   
    var dic = [[0,1],[1,0],[0,-1],[-1,0]];
    var dir = 0;
   
   
    var canMove = function (){
       var nextRow = row + dic[dir][0];
       var nextCol = col + dic[dir][1];
       if(nextRow<0||nextRow>maxRow) return false;
       if(nextCol<0||nextCol>maxCol) return false;
       if(matrix[nextRow][nextCol]===true) return false;
       return true;
    }; 
    function changeDir(){
        dir = (dir+1)%4;
    }
    
    while(true){
       var cur = matrix[row][col];      
       result.push(cur);
       matrix[row][col] = true;
       if(canMove()){
         row = row + dic[dir][0];
         col = col + dic[dir][1];
       } else{
           changeDir();
           if(canMove()){
             row = row + dic[dir][0];
             col = col + dic[dir][1];
           }else{
               break;
           }
       }     
      
    }
    return result;
};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx





