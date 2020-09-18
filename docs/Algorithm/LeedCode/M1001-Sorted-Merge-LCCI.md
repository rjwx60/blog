#### [M1001. Sorted Merge LCCI](https://leetcode-cn.com/problems/sorted-merge-lcci/)

You are given two sorted arrays, A and B, where A has a large enough buffer at the end to hold B. Write a method to merge B into A in sorted order.

Initially the number of elements in A and B are m and n respectively.

#### Example：

```
Input:
A = [1,2,3,0,0,0], m = 3
B = [2,5,6],       n = 3

Output: [1,2,2,3,5,6]
```



#### Code1：2020-07-13

```javascript
/**
 * @param {number[]} A
 * @param {number} m
 * @param {number[]} B
 * @param {number} n
 * @return {void} Do not return anything, modify A in-place instead.
 */
var merge = function(A, m, B, n) {
    A.splice(m, m-n, ...B);
    A.length = (m+n);
    A.sort((a,b) => a - b);
};
// 执行用时： 64 ms , 在所有 JavaScript 提交中击败了 88.67% 的用户 
// 内存消耗： 32.6 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 使用 API 的做法
var merge = function (A, m, B, n) {
    for (let i = 0; i < n; i++) {
        A[m + i] = B[i]
    }
    A.sort((a, b) => a - b)
};

var merge = function(A, m, B, n) {
    A.splice(m, n, ...B)
    return A.sort((a, b) => a - b)
};

// 思路:
// 使用 API 实现的话没什么好说的，但 LeedCode 题目最好是不要使用 API...失策
```



#### More：

##### More1：

作者：a-mo-xi-lin-5
链接：https://leetcode-cn.com/problems/sorted-merge-lcci/solution/javascript-shuang-100-by-a-mo-xi-lin-5/

```javascript
/**
 * @param {number[]} A
 * @param {number} m
 * @param {number[]} B
 * @param {number} n
 * @return {void} Do not return anything, modify A in-place instead.
 */
var merge = function(A,m,B,n){
       while (m > 0 && n > 0) {
            // 对比选出较大的数放在 m + n - 1 的位置，并将选出此数的指针向前移动
            A[m + n - 1] = A[m - 1] > B[n - 1] ? A[m-- -1] : B[n-- - 1];
        }
        // 剩下的数都比已经遍历过的数小
        // 如果 m 不为 0，则 A 没遍历完，都已经在 A 中不用再管
        // 如果 n 不为 0，则 B 没遍历完，直接全移到 A 中相同的位置
        while (n > 0) {
            A[n - 1] = B[n - 1];
            n--;
        }
};
// 思路:
// 由于两个数组的特殊性：两个数组都是排序后的数组。同时数组A有足够的缓冲空间。所以选择A存储排序后的数组。
// 步骤：比较A[m-1]和B[n-1]的数，将较大的数保存在数组A的末尾，同时移动数组中的位置
// 注意：A[m-- -1]记得建议，因为数组从0开始编号，数组的下标等于数组长度减1
```



##### More2：

作者：hyj8
链接：https://leetcode-cn.com/problems/sorted-merge-lcci/solution/gui-bing-pai-xu-de-bing-by-hyj8/

```javascript
const merge = (nums1, m, nums2, n) => {
  let index1 = m - 1
  let index2 = n - 1
  let tail = m + n - 1
  while (index2 >= 0) {
    if (nums1[index1] > nums2[index2]) { 
      nums1[tail] = nums1[index1]
      index1--
      tail--
    } else {
      nums1[tail] = nums2[index2]
      index2--
      tail--
    }
  }
}
// 思路:
// 合并两个有序数组, 使用归并排序
// 归并排序会开辟一个长度为 nums1 + nums2 的空间，用两个指针遍历两个数组，把小的放到原数组 nums1 里
// 注意: 后序遍历是因为先比较较大的数，只需要把大的数放到数组 nums1 的后面即可，若先从小的比较，需要把数组 nums1 的所有数往后挪一位，时间复杂度较高
```

<img src="/Users/rjwx60/Documents/FE/Github/Blog/Source/Image/Algorithm/Algorithm/M1001.png" style="zoom:50%;" align=""/>



##### MoreX：

更多解法：

https://leetcode-cn.com/problems/sorted-merge-lcci/solution/



#### Top：

```javascript
// top1: 48ms
var merge = function(A, m, B, n) {
   let p1=0,p2=0,tmp=[],cur=0
   while(p1<m || p2<n){
        if(p1===m) cur=B[p2++]
        else if(p2===n) cur=A[p1++]
        else if(A[p1]<B[p2]) {
            cur=A[p1++]
       }else{
           cur=B[p2++]
       }
        tmp[p1+p2-1]=cur
   }
    for(let i=0;i<tmp.length;i++)
        A[i]=tmp[i]
};

// top2: 52ms
var merge = function(A, m, B, n) {
   let lastZero = m+n-1;
   let aLast = m-1;
   let bLast = n-1;
   while(bLast >= 0){
       if(aLast < 0){
           A[lastZero--] = B[bLast--];
       }else if(A[aLast]<=B[bLast]) {
           A[lastZero--] = B[bLast--];

       }else{
           A[lastZero] = A[aLast--];
           lastZero--;
       }
   }
   return A;
};

// top3: 56ms
var merge = function(A, m, B, n) {
  let i = m - 1, j = n - 1, p = m + n - 1;
  while (i >= 0 || j >= 0) {
    let l = i >= 0 ? A[i] : -Infinity,
        r = j >= 0 ? B[j] : -Infinity;
    if (l > r) {
      A[p] = l;
      i--;
    } else {
      A[p] = r;
      j--;
    }
    p--;
  }
}
// 感悟: 倒序，从后向前进行遍历
// -Infinity 是因为索引已经小于0了，说明这个数组的所有值已经遍历完了(从后向前遍历)，则此时给它一个 -Infinity，一定会小于另一个没有遍历完的数组的任何元素，保证插入的是未遍历完的那个数组的元素
```



#### Think：

#### Expand：



