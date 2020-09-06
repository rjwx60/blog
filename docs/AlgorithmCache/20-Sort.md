---
typora-root-url: ../../../BlogImgsBed/Source
---



### 一、基本排序

**<u>*基本排序的基本思想非常类似：重排列时用的技术基本都是一组嵌套的for循环: 外循环遍历数组的每一项，内循环则用于比较元素*</u>**



#### 1-1、冒泡排序-BubbleSort

最笨最基本最经典点的方法，无需多言：

![](/Image/Algorithm/Sort/1.gif )

```js
function bubleSort(arr) {
    var len = arr.length;
    for (let outer = len ; outer >= 2; outer--) {
        for(let inner = 0; inner <=outer - 1; inner++) {
            if(arr[inner] > arr[inner + 1]) {
              	// 数值交换 — 最经典的交换策略
                let temp = arr[inner];
                arr[inner] = arr[inner + 1];
                arr[inner + 1] = temp;
              	// 或可利用 ES6 的解构赋值
              	// [arr[inner],arr[inner+1]] = [arr[inner+1],arr[inner]]
            }
        }
    }
    return arr;
}
```

注意两点：

- 外层循环，从最大值开始递减，因为内层是两两比较，因此最外层当`>=2`时即可停止；
- 内层是两两比较，从0开始，比较 `inner` 与 `inner+1`，因此，临界条件是 `inner<outer -1`；

```js
// 优化后的冒泡排序
function bubbleSort (arr) {
  for (let i = 0; i < arr.length; i++) {
    let flag = true;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false;
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    // 使用一个 flag 来优化：若某一次循环中没有交换过元素，则意味着排序已经完成
    if (flag) break;
  }
  return arr;
}
// 优化原理：
// 冒泡排序总会执行 (N-1)+(N-2)+(N-3)+..+2+1 趟，但若运行到当中某一趟时排序已经完成，或输入的是一个有序数组，则后边的比较就都是多余的，为避免这种情况，可增加一个flag，判断排序是否在中途就已经完成 (也即判断有无发生元素交换)
```





#### 1-2、选择排序-SelectionSort

选择排序是从数组的开头开始，将第一个元素与其他元素比较，检查完所有的元素后，最小的放在第一个位置，接下来再开始从第二个元素开始，重复直到最后；

![](/Image/Algorithm/Sort/2.gif )

```js
// 外层循环从0开始到 length-1， 然后内层比较，最小的放开头
function selectSort(arr) {
    var len = arr.length;
    for(let i = 0 ;i < len - 1; i++) {
        for(let j = i ; j<len; j++) {
            if(arr[j] < arr[i]) {
                [arr[i],arr[j]] = [arr[j],arr[i]];
            }
        }
    }
    return arr
}

// 外层循环从0开始到 length-1， 然后内层比较，最小的放开头 - 感觉这个更好
function selectSort(arr) {
  for(let i = 0, len = arr.length; i < len-1; i++) {
    // 默认每次比较的起始作为最小值
    let min = i
    // 比较出以i为起始的最小值
    for(let j = i+1; j <= len-1; j++) {
      if(arr[min] > arr[j]) {
        min = j
      }
    }
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
}
```

注意：

- 外层循环的`i`表示第几轮，`arr[i]`就表示当前轮次最靠前(小)的位置；
- 内层从`i`开始，依次往后数，找到比开头小的，互换位置即可



#### 1-3、插入排序-InsertionSort

插入排序核心：扑克牌思想： 打扑克牌，接起来一张，放哪里无所谓，再接起来一张，比第一张小，放左边，继续接，可能是中间数，就插在中间....

![](/Image/Algorithm/Sort/3.gif )

其实每种算法，主要是理解其原理，至于写代码，都是在原理之上顺理成章的事情：

- 首先将待排序的第一个记录作为一个有序段
- 从第二个开始，到最后一个，依次和前面的有序段进行比较，确定插入位置

```js
function insertSort(arr) {
    for(let i = 1; i < arr.length; i++) {  // 外循环从1开始，默认 arr[0] 是有序段
        for(let j = i; j > 0; j--) {  //j = i,将arr[j]依次插入有序段中
            if(arr[j] < arr[j-1]) {
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]];
            } else {
                break;
            }
        }
    }
    return arr;
}

// Emmmmm....
function insertionSort(arr) {
  var temp, inner
  for (var outer = 1; outer <= arr.length - 1; ++outer) {
    // 待插入的数据
    temp = arr[outer]
    inner = outer
    // 找到需要插入的位置，其他数据往后移动，并为该位置提供空间
    while (inner > 0 && (arr[inner - 1] >= temp)) {
      arr[inner] = arr[inner - 1]
      --inner
    }
    // 将待插入数据插入适应位置
    arr[inner] = temp
  }
}
```

注意这里两次循环中，`i`和`j`的含义：

1. `i`是外循环，依次把后面的数插入前面的有序序列中，默认`arr[0]`为有序的，`i`就从1开始
2. `j`进来后，依次与前面队列的数进行比较，因为前面的序列是有序的，因此只需要循环比较、交换即可
3. 注意这里的`break`，因为前面是都是有序的序列，所以如果当前要插入的值`arr[j]`大于或等于`arr[j-1]`，则无需继续比较，直接下一次循环即可；



#### 1-X、时间复杂度对比

| 排序算法     | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 是否稳定 |
| ------------ | :------------: | :------------: | :--------: | :------: |
| 冒泡排序     |     O(n²)      |     O(n²)      |    O(1)    |    是    |
| 选择排序     |     O(n²)      |     O(n²)      |    O(1)    |   不是   |
| 直接插入排序 |     O(n²)      |     O(n²)      |    O(1)    |    是    |

- 注意：插入排序时，若序列逆序，则每次插入都要一次次交换，此时速度和冒泡排序是一样，时间复杂度O(n²)；
- 注意：基本排序算法 ：基本思想就是两层循环嵌套，第一遍找元素O(n),第二遍找位置O(n)，所以这几种方法，时间复杂度就可以这么简便记忆啦!
- 注意：排序数据较多时，插入排序最快，选择排序第二，冒泡排序最慢；



### 二、高级排序

如果所有排序都像上面的基本方法一样，那么对于大量数据的处理，将是灾难性的



#### 2-1、快速排序-QuickSort

快排是处理大数据最快的排序算法之一；

对前端来说，是最最最最重要的排序算法，没有之一(面试官大概率问)

快排是一种分而治之的算法，通过递归方式，将数据依次分解为包含较小元素和较大元素的不同子序列；该算法不断重复这个步骤直至所有数据都是有序；

比如，找一个数作为参考数 A，比这它大的数放在 A 左边，比它小的放在 A 右边； 然后分别再对左边和右变的序列做相同的操作:

1. 选择一个基准元素，将列表分割成两个子序列；
2. 对列表重新排序，将所有小于基准值的元素放在基准值前面，所有大于基准值的元素放在基准值的后面；
3. 分别对较小元素的子序列和较大元素的子序列重复步骤1和2
4. 注意：快速排序算法非常适用于大型数据集合；在处理小数据集时性能反而会下降；

![](/Image/Algorithm/Sort/4.gif )

```js
function quickSort(arr) {
    if(arr.length <= 1) {
        return arr;  // 递归出口
    }
    var left = [],
        right = [],
        current = arr.splice(0,1); // 注意 splice 后，数组长度少了一个
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < current) {
            left.push(arr[i])  // 放在左边
        } else {
            right.push(arr[i]) // 放在右边
        }
    }
    return quickSort(left).concat(current,quickSort(right)); // 递归
}


// Emmmmm....
function quickSort(arr) {
  if(arr.length === 0) {
    return []
  } 
  let left = []
  let right = []
  // 选择第一个元素为基准值
  let base = arr[0]
  for(let i = 1; i<arr.length; i++) {
    arr[i] < base ? left.push(arr[i]) : right.push(arr[i])
  }
  // 可见在数据比较小的时候递归执行的比较多，消耗了性能
  return quickSort(left).concat(base, quickSort(right))
}
```



#### 2-2、希尔排序-ShellSort

希尔排序是插入排序的改良算法，但是核心理念与插入算法又不同，它会先比较距离较远的元素，而非相邻的元素；

![](/Image/Algorithm/Sort/5.gif )

```js
// 插入排序
function insertSort(arr) {
    for(let i = 1; i < arr.length - 1; i++) {  //外循环从1开始，默认arr[0]是有序段
        for(let j = i; j > 0; j--) {  //j = i,将arr[j]依次插入有序段中
            if(arr[j] < arr[j-1]) {
                [arr[j],arr[j-1]] = [arr[j-1],arr[j]];
            } else {
                continue;
            }
        }
    }
    return arr;
}

// 希尔排序
// 不同之处: 让步长按照 3、2、1 来进行比较，相当于是三层循环和嵌套
insertSort(arr,[3,2,1]);
function shellSort(arr,gap) {
  	// 观察过程
    console.log(arr) 
  	// 最外层循环，一次取不同的步长，步长需要预先给出
    for(let i = 0; i<gap.length; i++) {  
      	//步长为 n
        let n = gap[i]; 
      	// 接下类和插入排序一样，j 循环依次取后面的数 - 插入排序部分，但区别是 1 变为了 n
      	// 也即三层循环的内两层完全就是一个插入排序，但略有不同
        for(let j = i + n; j < arr.length; j++) { 
          	// k 循环进行比较，和直接插入的唯一区别是 1 变为了 n
            for(let k = j; k > 0; k-=n) { 
                if(arr[k] < arr[k-n]) {
                    [arr[k],arr[k-n]] = [arr[k-n],arr[k]];
                  	// 观察过程
                    console.log(`当前序列为[${arr}] \n 交换了${arr[k]}和${arr[k-n]}`)
                } else {
                    continue;
                }
            }
        }
    }
    return arr;
}

// 运行
var arr = [3, 2, 45, 6, 55, 23, 5, 4, 8, 9, 19, 0];
var gap = [3,2,1];
console.log(shellSort(arr,gap))
// (12) [3, 2, 45, 6, 55, 23, 5, 4, 8, 9, 19, 0] // 初始值
// 当前序列为[3,2,23,6,55,45,5,4,8,9,19,0] 
//  交换了45和23
// 当前序列为[3,2,23,5,55,45,6,4,8,9,19,0] 
//  交换了6和5
// 当前序列为[3,2,23,5,4,45,6,55,8,9,19,0] 
//  交换了55和4
// 当前序列为[3,2,23,5,4,8,6,55,45,9,19,0] 
//  交换了45和8
// 当前序列为[3,2,8,5,4,23,6,55,45,9,19,0] 
//  交换了23和8
// 当前序列为[3,2,8,5,4,23,6,19,45,9,55,0] 
//  交换了55和19
// 当前序列为[3,2,8,5,4,23,6,19,0,9,55,45] 
//  交换了45和0
// 当前序列为[3,2,8,5,4,0,6,19,23,9,55,45] 
//  交换了23和0
// 当前序列为[3,2,0,5,4,8,6,19,23,9,55,45] 
//  交换了8和0
// 当前序列为[0,2,3,5,4,8,6,19,23,9,55,45] 
//  交换了3和0
// 当前序列为[0,2,3,5,4,8,6,9,23,19,55,45] 
//  交换了19和9
// 当前序列为[0,2,3,4,5,8,6,9,23,19,55,45] 
//  交换了5和4
// 当前序列为[0,2,3,4,5,6,8,9,23,19,55,45] 
//  交换了8和6
// 当前序列为[0,2,3,4,5,6,8,9,19,23,55,45] 
//  交换了23和19
// 当前序列为[0,2,3,4,5,6,8,9,19,23,45,55] 
//  交换了55和45



function shellSort(arr,gaps) {
  // 遍历间隔序列
  for(let g=0; g<gaps.length; g++) {
    let gap = gaps[g]
    // 使用间隔遍历数据
    for(let i=gap; i<arr.length; i++) {
      // 以下是插入操作
      // 例如[1,3,4,2]，其中最后一个数字2是带插入[1,3,4]中的数据，间隔如果是1
      // 先将2和4比较，因为2小于4，则4后移变成[1,3,4,4]
      // 再将2和3比较，因为2小于3，则3后移变成[1,3,3,4]
      // 再将2和1比较，因为2大于1，移动结束，将2插入最后一个移动的数字所在的位置，变成[1,2,3,4]
      let temp = arr[i]
      for(j=i; j>=gap && arr[j-gap] > temp; j-=gap) {
        arr[j] = arr[j - gap]
      }
      arr[j] = temp
    }
  }
}
```



#### 2-3、归并排序-MergeSort

归并排序是建立在归并操作上的一种有效的排序算法，采用分治法(Divide and Conquer)思想实现；

- 分治法将问题分成一些小的问题然后递归求解，而治的阶段则将分的阶段得到的各答案"修补"在一起，即分而治之；

将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为二路归并。

分割操作：

- 将数组从中点进行分割，分为左、右两个数组
- 递归分割左、右数组，直到数组长度小于`2`

归并操作：

- 若需合并，则左右两数组已有序；
- 创建一临时存储数组`temp`，比较两数组第一个元素，将较小的元素加入临时数组；
- 若左右数组有一个为空，则此时另一数组一定大于 `temp` 中的所有元素，直接将其所有元素加入 `temp`；

![](/Image/Algorithm/Sort/6.gif )



```js
// Way - 1
// 分割数组时直接将数组分割为两个数组，合并时直接合并数组。
// 优点：思路简单，写法简单 
// 缺点：空间复杂度略高，需要复制多个数组
function mergeSort(array) {
  if (array.length < 2) {
    return array;
  }
  const mid = Math.floor(array.length / 2);
  const front = array.slice(0, mid);
  const end = array.slice(mid);
  return merge(mergeSort(front), mergeSort(end));
}

function merge(front, end) {
  const temp = [];
  while (front.length && end.length) {
    if (front[0] < end[0]) {
      temp.push(front.shift());
    } else {
      temp.push(end.shift());
    }
  }
  while (front.length) {
    temp.push(front.shift());
  }
  while (end.length) {
    temp.push(end.shift());
  }
  return temp;
}




// Emmm...
function mergeSort (arr) {
  // 只有一个数组元素不需要排序
  if(arr.length < 2) {
    return
  }
  let left, right, step = 1
  // 如果 step 超过了数组长度，那么不需要拆分了
  // 例如以上示例中的第四趟，step = 8，但是数组长度只有7，因此已经排好序了，不需要在遍历了
  while(step < arr.length) {
    left = 0
    right = step
    // 第一次 step = 1，将一个数组拆分被只有一个元素的多个数组
    // 第二次 step = 2, 将拆分的只有一个元素的数组合并成排好序的只有2个元素的多个数组
    // ...
    // 注意: 这里考虑的是左右数组元素个数一致的情况
    while(right + step <= arr.length) {
      mergeArrays(arr, left, left+step, right, right+step)
      left = right + step
      right = left + step
    }
    // 注意: 这里考虑的是左右数组元素个数不一致的情况
    if(right < arr.length) {
      mergeArrays(arr, left, left+step, right, arr.length)
    }
    // 第一次step = 1,
    // 第二次step = 2, 因此进行两两合并，只是合并的每个数组长度是1
    // 第三次step = 4, 仍然进行两两合并，只是合并的每个数组长度是2
    step *= 2
  }
}
function mergeArrays(arr, leftStart, leftEnd, rightStart, rightEnd) {
  let rightArr = new Array(rightEnd - rightStart + 1)
  let leftArr = new Array(leftEnd - leftStart + 1)
  let k = rightStart

  // 对需要排序的数组按照 step 进行数组拆分，拆分成一个个小数组
  for(let i=0; i<rightArr.length - 1; i++) {
    rightArr[i] = arr[k]
    ++k
  }
  k = leftStart
  for(let i=0; i<leftArr.length - 1; i++) {
    leftArr[i] = arr[k]
    ++k
  }
  rightArr[rightArr.length-1] = Infinity // 哨兵值
  leftArr[leftArr.length-1] = Infinity // 哨兵值
  // 对拆分的数组进行从小到大排序
  let m=0, n=0;
  for(let k = leftStart; k < rightEnd; k++) {
    // 如果左数组小于右数组则当前序列插入左数组值
    // 需要如果右数组已经插入完毕了，那么右数组的值是Infinity，此时始终会插入左数组值
    if(leftArr[m] <= rightArr[n]) {
      arr[k] = leftArr[m]
      m++
    // 否则插入右数组值  
    // 如果左数组已经插入完毕，那么左数组的最后值是Infinity，此时始终会插入右数组值
    } else {
      arr[k] = rightArr[n]
      n++
    }
  }    
} 






// Way - 2
// 记录数组的索引，使用 left、right 两个索引来限定当前分割的数组。
// 优点：空间复杂度低，只需一个 temp 存储空间，不需要拷贝数组
// 缺点：写法复杂
function mergeSort(array, left, right, temp) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(array, left, mid, temp)
    mergeSort(array, mid + 1, right, temp)
    merge(array, left, right, temp);
  }
  return array;
}

function merge(array, left, right, temp) {
  const mid = Math.floor((left + right) / 2);
  let leftIndex = left;
  let rightIndex = mid + 1;
  let tempIndex = 0;
  while (leftIndex <= mid && rightIndex <= right) {
    if (array[leftIndex] < array[rightIndex]) {
      temp[tempIndex++] = array[leftIndex++]
    } else {
      temp[tempIndex++] = array[rightIndex++]
    }
  }
  while (leftIndex <= mid) {
    temp[tempIndex++] = array[leftIndex++]
  }
  while (rightIndex <= right) {
    temp[tempIndex++] = array[rightIndex++]
  }
  tempIndex = 0;
  for (let i = left; i <= right; i++) {
    array[i] = temp[tempIndex++];
  }
}
```



#### 2-4、堆排序-HeapSort-MB

堆排序是指利用堆这种数据结构所设计的一种排序算法；

堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点；



创建一个大顶堆，大顶堆的堆顶一定是最大的元素。

交换第一个元素和最后一个元素，让剩余的元素继续调整为大顶堆。

从后往前以此和第一个元素交换并重新构建，排序完成



- 将初始待排序关键字序列(R1,R2….Rn)构建成大顶堆，此堆为初始的无序区；
- 将堆顶元素R[1]与最后一个元素R[n]交换，此时得到新的无序区(R1,R2,……Rn-1)和新的有序区(Rn),且满足R[1,2…n-1]<=R[n]；
- 由于交换后新的堆顶R[1]可能违反堆的性质，因此需要对当前无序区(R1,R2,……Rn-1)调整为新堆，然后再次将R[1]与无序区最后一个元素交换，得到新的无序区(R1,R2….Rn-2)和新的有序区(Rn-1,Rn)。不断重复此过程直到有序区的元素个数为n-1，则整个排序过程完成。





![](/Image/Algorithm/Sort/7.gif )

```js
function heapSort(array) {
  creatHeap(array);
  console.log(array);
  // 交换第一个和最后一个元素，然后重新调整大顶堆
  for (let i = array.length - 1; i > 0; i--) {
    [array[i], array[0]] = [array[0], array[i]];
    adjust(array, 0, i);
  }
  return array;
}
// 构建大顶堆，从第一个非叶子节点开始，进行下沉操作
function creatHeap(array) {
  const len = array.length;
  const start = parseInt(len / 2) - 1;
  for (let i = start; i >= 0; i--) {
    adjust(array, i, len);
  }
}
// 将第target个元素进行下沉，孩子节点有比他大的就下沉
function adjust(array, target, len) {
  for (let i = 2 * target + 1; i < len; i = 2 * i + 1) {
    // 找到孩子节点中最大的
    if (i + 1 < len && array[i + 1] > array[i]) {
      i = i + 1;
    }
    // 下沉
    if (array[i] > array[target]) {
      [array[i], array[target]] = [array[target], array[i]]
      target = i;
    } else {
      break;
    }
  }
}
```





#### 2-X、时间复杂度对比

| 排序算法     | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 是否稳定 |
| ------------ | :------------: | :------------: | :--------: | :------: |
| 冒泡排序     |     O(n²)      |     O(n²)      |    O(1)    |    是    |
| 选择排序     |     O(n²)      |     O(n²)      |    O(1)    |   不是   |
| 直接插入排序 |     O(n²)      |     O(n²)      |    O(1)    |    是    |
| 快速排序     |    O(nlogn)    |     O(n²)      |  O(logn)   |   不是   |
| 希尔排序     |    O(nlogn)    |     O(n^s)     |    O(1)    |   不是   |
| 归并排序     |    O(nlogn)    |    O(nlogn)    |    O(n)    |    是    |
| 堆排序       |    O(nlogn)    |    O(nlogn)    |    O(1)    |   不是   |

- 注意：时间复杂度记忆
  - 冒泡、选择、直接 排序需要两个for循环，每次只关注一个元素，平均时间复杂度为O(n²)(一遍找元素O(n)，一遍找位置O(n)）
  - 快速、归并、希尔、堆基于二分思想，log以2为底，平均时间复杂度为O(nlogn)(一遍找元素O(n)，一遍找位置O(logn))





#### 2-Y、注意事项

##### 2-Y-1、稳定性

若不考虑稳定性，快排似乎是近乎完美的方法之一，但它不稳定的：稳定性：通俗的讲：有两个相同的数 A 和 B，在排序前 A 在 B 前面，而经过排序后，B 变成在 A 的前面；此种情况就称：**<u>*排序的不稳定性*</u>**，而快排在对存在相同数进行排序时就有可能发生这种情况；

- 比如：对 (5，3A，6，3B ) 进行排序，排序前相同的数 3A 与 3B，A 在 B 前面，经过排序后会变成 (3B，3A，5，6)
- 危害：在前端领域，不稳定排序或操作将会使本身不需要变化的东西变化，比如 ul 的列表项快排，虽然相同但交换位置，导致重新渲染，带来性能损耗；





作者：Vincent Ko
链接：https://juejin.im/post/6844903656865677326

