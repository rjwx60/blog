#### [剑指 Offer 66. 构建乘积数组](https://leetcode-cn.com/problems/gou-jian-cheng-ji-shu-zu-lcof/)

来源：力扣（LeetCode）

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。



### 一、Content

给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B 中的元素 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。



#### 1-1、Example

```
输入: [1,2,3,4,5]
输出: [120,60,40,30,24]
```



#### 1-2、Note

- 所有元素乘积之和不会溢出 32 位整数
- `a.length <= 100000`



#### 1-3、Tag

Array、多维数组



### 二、思路与解答

#### 2-1、思路

##### 2-1-1、自思路

- 注意到 B[i] = A组每元素乘积 / A[i], 即效果图如下
  - <img src="../../../../BlogImgsBed/Source/Image/Algorithm/Array/5.png" style="zoom:50%;" align="left"/>
- 考察抽象空间思维与边界值的处理



##### 2-1-2、其他思路

left从左往右遍历，逐个求出从索引0对应值一直乘到 到当前索引的乘积结果；

right从右往左遍历，逐个求出从最后一个值乘到当前值得乘积结果。

然后 结果就是b[i] = left[i-1] *right[i+1];





#### 2-2、题解

##### 2-2-1、官解

https://leetcode-cn.com/problems/gou-jian-cheng-ji-shu-zu-lcof/solution/

##### 2-2-2、自实现

```js
/**
 * @param {number[]} a
 * @return {number[]}
 */
var constructArr = function(A) {
  var B = [];
  if (Array.isArray(A) && A.length > 0) {
    // 计算下三角
    B[0] = 1;
    for (let i = 1; i < A.length; i++) {
      B[i] = B[i - 1] * A[i - 1];
      // B1 = B0 * A0 = A0
      // B2 = B1 * A1 = A0 * A1
      // B3 = B2 * A2 = A0 * A1 * A2
      // ......
    }
    // 乘上三角
    let temp = 1;
    for (let i = A.length - 2; i >= 0; i--) {
      temp = temp * A[i + 1];
      // A1 ... A[length - 1]
      B[i] = B[i] * temp;
    }
  }
  return B;
};
```



##### 2-2-3、综合实现

```js
/**
 * @param {number[]} a
 * @return {number[]}
 */
// 暴力法
// var constructArr = function(a) {
//     let b=[];
//     let pre=1
//     a.forEach((v,i)=>{
//         let j=i+1;
//         let muti=1;
//         while(j<a.length){
//             muti *=a[j];
//             j++;
//         }

//         b.push(pre*muti);
//         pre *= a[i];
//     })

//     return b;
// };

// 对称遍历
var constructArr = function(a) {
    let left=[];
    let right=[];
    let len = a.length;
    for(let i = 0;i < len ; i++){
        let j=len-i-1;
        if(i == 0){
            left[i] = a[i];
            right[j] = a[j];
        }else{
            left[i] = left[i-1] * a[i];
            right[j] = right[j+1] * a[j]; 
        }
       
    }
    // console.log(left);
    // console.log(right);

    let b=[];
    for(let i=0;i<len;i++){
        if(i===0)b[i]=right[i+1];
        else if(i===len-1)b[i]=left[i-1];
        else b[i] = left[i-1] *right[i+1];
    }
    return b;
};

// 作者：heronwan
// 链接：https://leetcode-cn.com/problems/gou-jian-cheng-ji-shu-zu-lcof/solution/jsshuang-xiang-bian-li-by-heronwan/
```



### 三、Top

#### 3-1、100ms

```js
var constructArr = function(a) {
    const len = a.length;
    if (!len) return [];
    const b = new Array(len);
    b[0] = 1;
    let tmp = 1;

    for (let i = 1; i < a.length; i++) {
        b[i] = b[i - 1] * a[i - 1];
    }

    for (let i = len - 2; i >= 0; i--) {
        tmp *= a[i + 1];
        b[i] *= tmp;
    }
    return b;
};
```



#### 3-2、49224kb

```js
var constructArr = function(a) {
    if(a.length==0) return [];
    let b = Array.from({length: a.length});
    b[0] = 1;
    let temp = 1;
    for(let i=1;i<a.length;i++){
        b[i] = b[i-1]*a[i-1];
    }
    for(let j=a.length-2;j>=0;j--){
        temp = temp*a[j+1];
        b[j] = temp*b[j];
    }
    return b;

};
```



### 四、拓展

#### 4-1、xxx

#### 4-2、xxx

