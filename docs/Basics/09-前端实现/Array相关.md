# 一、数组相关

- map：遍历数组，返回回调返回值组成的新数组；
- forEach：无法 break，可用 try/catch 中 throw new Error 来停止；
- filter：过滤；
- some：有一项返回true，则整体为true；
  every：有一项返回false，则整体为false；
- join：通过指定连接符生成字符串；
- push / pop：末尾推入和弹出，改变原数组， `push` 返回数组长度, `pop` 返回原数组最后一项；
- unshift / shift：头部推入和弹出，改变原数组，`unshift` 返回数组长度，`shift` 返回原数组第一项 ；
- sort(fn) / reverse：排序与反转，改变原数组；
- concat：连接数组，不影响原数组， 浅拷贝；
- slice(start, end)：返回截断后的新数组，不改变原数组；
- splice(start, number, value...)：返回删除元素组成的数组，value 为插入项，改变原数组；
- indexOf / lastIndexOf(value, fromIndex)：查找数组项，返回对应的下标；
- reduce / reduceRight(fn(prev, cur)， defaultPrev)：两两执行，prev 为上次化简函数的`return`值，cur 为当前值；
  - 当传入 `defaultPrev` 时，从第一项开始；
  - 当未传入时，则为第二项；

- 补充：右移操作，将前面的空位用0填充，可用于保证某变量为数字且为整数

- ```js
  null >>> 0  //0
  
  undefined >>> 0  //0
  
  void(0) >>> 0  //0
  
  function a (){};  a >>> 0  //0
  
  [] >>> 0  //0
  
  var a = {}; a >>> 0  //0
  
  123123 >>> 0  //123123
  
  45.2 >>> 0  //45
  
  0 >>> 0  //0
  
  -0 >>> 0  //0
  
  -1 >>> 0  //4294967295
  
  -1212 >>> 0  //4294966084
  ```

  

## 1-1、map

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100659.png" style="zoom:50%;" align="" />

```js
// 关键：使用 in 来进行原型链查找。同时，如果没有找到就不处理，能有效处理稀疏数组的情况
Array.prototype.map = function(callbackFn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  // 草案中提到要先转换为对象
  let O = Object(this);
  let T = thisArg;

  
  let len = O.length >>> 0;
  let A = new Array(len);
  for(let k = 0; k < len; k++) {
    // 还记得原型链那一节提到的 in 吗？in 表示在原型链查找
    // 如果用 hasOwnProperty 是有问题的，它只能找私有属性
    if (k in O) {
      let kValue = O[k];
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, KValue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
}


// V8 实现
function ArrayMap(f, receiver) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.map");

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  if (!IS_CALLABLE(f)) throw %make_type_error(kCalledNonCallable, f);
  var result = ArraySpeciesCreate(array, length);
  for (var i = 0; i < length; i++) {
    if (i in array) {
      var element = array[i];
      %CreateDataProperty(result, i, %_Call(f, receiver, element, i, array));
    }
  }
  return result;
}
```



## 1-2、reduce

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100700.png" style="zoom:50%;" align="" />

```js
// 关键：初始值不传怎么处理、回调函数的参数有哪些，返回值如何处理；
// 关键：从最后一项开始遍历，通过原型链查找跳过空项
Array.prototype.reduce  = function(callbackfn, initialValue) {
  // 异常处理，和 map 一样
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue;
  if (accumulator === undefined) {
    for(; k < len ; k++) {
      // 查找原型链
      if (k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  // 表示数组全为空
  if(k === len && accumulator === undefined) 
    throw new Error('Each element of the array is empty');
  for(;k < len; k++) {
    if (k in O) {
      // 注意，核心！
      accumulator = callbackfn.call(undefined, accumulator, O[k], k, O);
    }
  }
  return accumulator;
}

// 实现2
Array.prototype.myreduce = function reduce(callbackfn) {
  // 拿到数组
  const O = this,
    len = O.length;
  // 下标值
  let k = 0,
    // 累加器
    accumulator = undefined,
    // k下标对应的值是否存在
    kPresent = false,
    // 初始值
    initialValue = arguments.length > 1 ? arguments[1] : undefined;

  if (typeof callbackfn !== 'function') {
    throw new TypeError(callbackfn + ' is not a function');
  }

  // 数组为空，并且有初始值，报错
  if (len === 0 && arguments.length < 2) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  // 如果初始值存在
  if (arguments.length > 1) {
    // 设置累加器为初始值
    accumulator = initialValue;
    // 初始值不存在
  } else {
    accumulator = O[k];
    ++k;
  }

  while (k < len) {
    // 判断是否为 empty [,,,]
    kPresent = O.hasOwnProperty(k);

    if (kPresent) {
      const kValue = O[k];
      // 调用 callbackfn
      accumulator = callbackfn.apply(undefined, [accumulator, kValue, k, O]);
    }
    ++k;
  }
  return accumulator;
};



// 测试
const rReduce = ['1', null, undefined, , 3, 4].reduce((a, b) => a + b, 3);
const mReduce = ['1', null, undefined, , 3, 4].myreduce((a, b) => a + b, 3);
console.log(rReduce, mReduce);
// 31nullundefined34 31nullundefined34



// V8 实现
function ArrayReduce(callback, current) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.reduce");

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArrayReduce(callback, current, array, length,
                          arguments.length);
}

function InnerArrayReduce(callback, current, array, length, argumentsLength) {
  if (!IS_CALLABLE(callback)) {
    throw %make_type_error(kCalledNonCallable, callback);
  }

  var i = 0;
  find_initial：if (argumentsLength < 2) {
    for (; i < length; i++) {
      if (i in array) {
        current = array[i++];
        break find_initial;
      }
    }
    throw %make_type_error(kReduceNoInitial);
  }

  for (; i < length; i++) {
    if (i in array) {
      var element = array[i];
      current = callback(current, element, i, array);
    }
  }
  return current;
}
```



## 1-3、push/pop

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100701.png" style="zoom:50%;" align="" />

```js
// push
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = this.length >>> 0;
  let argCount = items.length >>> 0;
  // 2 ** 53 - 1 为JS能表示的最大正整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value restricted!")
  }
  for(let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}

// pop
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len --;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
}
```



## 1-4、filter

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100702.png" style="zoom:50%;" align="" />

```js
Array.prototype.filter = function(callbackfn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'filter' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let resLen = 0;
  let res = [];
  for(let i = 0; i < len; i++) {
    if (i in O) {
      let element = O[i];
      if (callbackfn.call(thisArg, O[i], i, O)) {
        res[resLen++] = element;
      }
    }
  }
  return res;
}
```



## 1-5、splice

- splice(position, count) 表示从 position 索引的位置开始，删除count个元素
- splice(position, 0, ele1, ele2, ...) 表示从 position 索引的元素后面插入一系列的元素
- splice(postion, count, ele1, ele2, ...) 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素
- 返回值为`被删除元素`组成的`数组`。

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100703.png" style="zoom:50%;" align="" />

### 1-5-1、基本骨架

```js
Array.prototype.splice = function(startIndex, deleteCount, ...addElements)  {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length;
  let deleteArr = new Array(deleteCount);
   
  // 1-2、拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // 1-3、移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);
  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
}

// 1-2、拷贝删除的元素实现
const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};
```

### 1-5-2、移动删除元素后的元素

对删除元素后面的元素进行挪动, 挪动分为三种情况:

- 添加的元素和删除的元素个数相等

  - ```js
    // 1-3、移动删除元素后面的元素
    const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
      // 1-3-1、添加的元素和删除的元素个数相等
      if (deleteCount === addElements.length) return;
    }
    ```

- 添加的元素个数小于删除的元素

  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100704.png" style="zoom:35%;" align="" />

  - ```js
    // 1-3、移动删除元素后面的元素
    const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
      //...
      // 1-3-1、添加的元素和删除的元素个数相等
      // 1-3-2、添加的元素个数小于删除的元素
      // 添加的元素和删除的元素个数不相等，则移动后面的元素
      if(deleteCount > addElements.length) {
        // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
        // 一共需要挪动 len - startIndex - deleteCount 个元素
        for (let i = startIndex + deleteCount; i < len; i++) {
          let fromIndex = i;
          // 将要挪动到的目标位置
          let toIndex = i - (deleteCount - addElements.length);
          if (fromIndex in array) {
            array[toIndex] = array[fromIndex];
          } else {
            delete array[toIndex];
          }
        }
        // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
        // 目前长度为 len + addElements - deleteCount
        for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {
          delete array[i];
        }
      } 
    };
    ```

- 添加的元素个数大于删除的元素

  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100705.png" style="zoom:35%;" align="" />

  - ```js
    // 1-3、移动删除元素后面的元素
    const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
      //...
      // 1-3-1、添加的元素和删除的元素个数相等
      // 1-3-2、添加的元素个数小于删除的元素
      // 1-3-3、添加的元素个数大于删除的元素
      if(deleteCount < addElements.length) {
        // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
        // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
        for (let i = len - 1; i >= startIndex + deleteCount; i--) {
          let fromIndex = i;
          // 将要挪动到的目标位置
          let toIndex = i + (addElements.length - deleteCount);
          if (fromIndex in array) {
            array[toIndex] = array[fromIndex];
          } else {
            delete array[toIndex];
          }
        }
      }
    };
    ```

### 1-5-3、优化参数边界情况

当用户传来非法的 startIndex 和 deleteCount 或者负索引的时候，需要我们做出特殊的处理。

```js
const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len: 0;
  } 
  return startIndex >= len ? len: startIndex;
}

const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) 
    return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) 
    return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex) 
    return len - startIndex;
  return deleteCount;
}

Array.prototype.splice = function (startIndex, deleteCount, ...addElements) {
  //,...
  let deleteArr = new Array(deleteCount);
  
  // 下面参数的清洗工作
  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);
   
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  //...
}
```

### 1-5-4、优化密封对象/冻结对象情况

- 密封对象：不可扩展对象，且已有成员的 [[Configurable]] 属性被设置 false，意味着无法添加、删除方法和属性；但属性值可修改；
- 冻结对象：最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值；

```js
// 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
if (Object.isSealed(array) && deleteCount !== addElements.length) {
  throw new TypeError('the object is a sealed object!')
} else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
  throw new TypeError('the object is a frozen object!')
}
```

### 1-5-5、完整实现

```js
const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};

const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
  // 如果添加的元素和删除的元素个数相等，相当于元素的替换，数组长度不变，被删除元素后面的元素不需要挪动
  if (deleteCount === addElements.length) return;
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  else if(deleteCount > addElements.length) {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
    for (let i = startIndex + deleteCount; i < len; i++) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i - (deleteCount - addElements.length);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {
      delete array[i];
    }
  } else if(deleteCount < addElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for (let i = len - 1; i >= startIndex + deleteCount; i--) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i + (addElements.length - deleteCount);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
  }
};

const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len: 0;
  } 
  return startIndex >= len ? len: startIndex;
}

const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) 
    return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) 
    return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex) 
    return len - startIndex;
  return deleteCount;
}

Array.prototype.splice = function(startIndex, deleteCount, ...addElements)  {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length >>> 0;
  let deleteArr = new Array(deleteCount);

  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);

  // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
  if (Object.isSealed(array) && deleteCount !== addElements.length) {
    throw new TypeError('the object is a sealed object!')
  } else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
    throw new TypeError('the object is a frozen object!')
  }
   
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);

  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }

  array.length = len - deleteCount + addElements.length;

  return deleteArr;
}
```



## 1-6、sort

### 1-6-1、V8 实现思路

V8 源码中排序的思路：假设要排序的元素个数是 n：

- 当 n <= 10 时，采用 **<u>插入排序</u>**；
- 当 n > 10 时，采用 **<u>三路快速排序</u>**：
  - 10 < n <= 1000，<u>采用中位数作为哨兵元素</u>；
  - n > 1000，每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数

- 注意：虽 <u>插入排序</u> 理论上是 O(n^2) 算法，<u>快速排序</u> 是 O(nlogn) 级算法；但实际情况中，当 n 越小，快排优势会越来越小，若 n 足够小，插入甚至会比快排高效；因此，对于很小的数据量，V8 应用的是 插入排序；
- 注意：费力选择哨兵元素的原因是避免快排效率退化：快排性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或最大元素，此时进行 partition时(一边是小于哨兵的元素，另一边是大于哨兵的元素)，就会有一边是空的，如此下去，递归层数就达到 n 次，而每一层的复杂度是 O(n)，因此快排此时会退化成 O(n^2) 级别；
- 所以：让哨兵元素尽可能地处于数组中间位置，让最大或最小的情况尽可能减少；所以 V8 才做了如此多的优化；

### 1-6-2、插入排序及优化

```js
// 插入排序
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for(let i = start; i < end; i++) {
    let j;
    for(j = i; j > start && arr[j - 1] > arr[j]; j --) {
      let temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
    }
  }
  return;
}

// 交换元素会有相当大的性能消耗，可用变量覆盖的方式代替

// 排序优化
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for(let i = start; i < end; i++) {
    let e = arr[i];
    let j;
    for(j = i; j > start && arr[j - 1] > e; j --)
      arr[j] = arr[j-1];
    arr[j] = e;
  }
  return;
}
```



### 1-6-3、哨兵元素

```js
// sort 基本骨架
Array.prototype.sort = (comparefn) => {
  let array = Object(this);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
}

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (Object.prototype.toString.call(callbackfn) !== "[object Function]") {
    comparefn = function (x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = () => {
    //...
  }
  const getThirdIndex = (a, from, to) => {
    // 元素个数大于1000时寻找哨兵元素
  }
  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while(true) {
      if(to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if(to - from > 1000) {
        thirdIndex = getThirdIndex(a, from , to);
      }else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
    }
    //下面开始快排
  }
}

// 哨兵位置寻找实现
const getThirdIndex = (a, from, to) => {
  let tmpArr = [];
  // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
  let increment = 200 + ((to - from) & 15);
  let j = 0;
  from += 1;
  to -= 1;
  for (let i = from; i < to; i += increment) {
    tmpArr[j] = [i, a[i]];
    j++;
  }
  // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
  tmpArr.sort(function(a, b) {
    return comparefn(a[1], b[1]);
  });
  let thirdIndex = tmpArr[tmpArr.length >> 1][0];
  return thirdIndex;
}
```



### 1-6-4、快速排序

```js
const _sort = (a, b, c) => {
  let arr = [a, b, c];
  insertSort(arr, 0, 3);
  return arr;
}

const quickSort = (a, from, to) => {
  //...
  // 上面我们拿到了thirdIndex
  // 现在我们拥有三个元素，from, thirdIndex, to
  // 为了再次确保 thirdIndex 不是最值，把这三个值排序
  [a[from], a[thirdIndex], a[to - 1]] = _sort(a[from], a[thirdIndex], a[to - 1]);
  // 现在正式把 thirdIndex 作为哨兵
  let pivot = a[thirdIndex];
  // 正式进入快排
  let lowEnd = from + 1;
  let highStart = to - 1;
  // 现在正式把 thirdIndex 作为哨兵, 并且lowEnd和thirdIndex交换
  let pivot = a[thirdIndex];
  a[thirdIndex] = a[lowEnd];
  a[lowEnd] = pivot;
  
  // [lowEnd, i)的元素是和pivot相等的
  // [i, highStart) 的元素是需要处理的
  for(let i = lowEnd + 1; i < highStart; i++) {
    let element = a[i];
    let order = comparefn(element, pivot);
    if (order < 0) {
      a[i] = a[lowEnd];
      a[lowEnd] = element;
      lowEnd++;
    } else if(order > 0) {
      do{
        highStart--;
        if(highStart === i) break;
        order = comparefn(a[highStart], pivot);
      }while(order > 0)
      // 现在 a[highStart] <= pivot
      // a[i] > pivot
      // 两者交换
      a[i] = a[highStart];
      a[highStart] = element;
      if(order < 0) {
        // a[i] 和 a[lowEnd] 交换
        element = a[i];
        a[i] = a[lowEnd];
        a[lowEnd] = element;
        lowEnd++;
      }
    }
  }
  // 永远切分大区间
  if (lowEnd - from > to - highStart) {
    // 继续切分lowEnd ~ from 这个区间
    to = lowEnd;
    // 单独处理小区间
    quickSort(a, highStart, to);
  } else if(lowEnd - from <= to - highStart) {
    from = highStart;
    quickSort(a, from, lowEnd);
  }
}
```



### 1-6-5、完整实现

```js
const sort = (arr, comparefn) => {
  let array = Object(arr);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
}

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (Object.prototype.toString.call(comparefn) !== "[object Function]") {
    comparefn = function (x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = (arr, start = 0, end) => {
    end = end || arr.length;
    for (let i = start; i < end; i++) {
      let e = arr[i];
      let j;
      for (j = i; j > start && comparefn(arr[j - 1], e) > 0; j--)
        arr[j] = arr[j - 1];
      arr[j] = e;
    }
    return;
  }
  const getThirdIndex = (a, from, to) => {
    let tmpArr = [];
    // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
    let increment = 200 + ((to - from) & 15);
    let j = 0;
    from += 1;
    to -= 1;
    for (let i = from; i < to; i += increment) {
      tmpArr[j] = [i, a[i]];
      j++;
    }
    // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
    tmpArr.sort(function (a, b) {
      return comparefn(a[1], b[1]);
    });
    let thirdIndex = tmpArr[tmpArr.length >> 1][0];
    return thirdIndex;
  };

  const _sort = (a, b, c) => {
    let arr = [];
    arr.push(a, b, c);
    insertSort(arr, 0, 3);
    return arr;
  }

  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while (true) {
      if (to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to);
      } else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
      let tmpArr = _sort(a[from], a[thirdIndex], a[to - 1]);
      a[from] = tmpArr[0]; a[thirdIndex] = tmpArr[1]; a[to - 1] = tmpArr[2];
      // 现在正式把 thirdIndex 作为哨兵
      let pivot = a[thirdIndex];
      [a[from], a[thirdIndex]] = [a[thirdIndex], a[from]];
      // 正式进入快排
      let lowEnd = from + 1;
      let highStart = to - 1;
      a[thirdIndex] = a[lowEnd];
      a[lowEnd] = pivot;
      // [lowEnd, i)的元素是和pivot相等的
      // [i, highStart) 的元素是需要处理的
      for (let i = lowEnd + 1; i < highStart; i++) {
        let element = a[i];
        let order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[lowEnd];
          a[lowEnd] = element;
          lowEnd++;
        } else if (order > 0) {
          do{
            highStart--;
            if (highStart === i) break;
            order = comparefn(a[highStart], pivot);
          }while (order > 0) ;
          // 现在 a[highStart] <= pivot
          // a[i] > pivot
          // 两者交换
          a[i] = a[highStart];
          a[highStart] = element;
          if (order < 0) {
            // a[i] 和 a[lowEnd] 交换
            element = a[i];
            a[i] = a[lowEnd];
            a[lowEnd] = element;
            lowEnd++;
          }
        }
      }
      // 永远切分大区间
      if (lowEnd - from > to - highStart) {
        // 单独处理小区间
        quickSort(a, highStart, to);
        // 继续切分lowEnd ~ from 这个区间
        to = lowEnd;
      } else if (lowEnd - from <= to - highStart) {
        quickSort(a, from, lowEnd);
        from = highStart;
      }
    }
  }
  quickSort(array, 0, length);
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100706.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100707.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100708.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100709.png" style="zoom:50%;" align=""/>



## 1-7、findIndex

1. `findIndex`方法对数组中的每个数组索引`0..length-1`（包括）执行一次`callback`函数，直到找到一个`callback`函数返回真实值（强制为`true`）的值。
2. 如果找到这样的元素，`findIndex`会立即返回该元素的索引。
3. 如果回调从不返回真值，或者数组的`length`为0，则`findIndex`返回-1。
4. 回调函数调用时有三个参数：元素的值，元素的索引，以及被遍历的数组。
5. 如果一个 `thisArg` 参数被提供给 `findIndex`, 它将会被当作`this`使用在每次回调函数被调用的时候。如果没有被提供，将会使用[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。
6. `findIndex`不会修改所调用的数组。

```js
Array.prototype.myFindIndex = function (cb, context = undefined) {
  if (typeof cb !== 'function') {
    throw new TypeError('cb must be a function');
  }
  var arr = [].slice.call(this);
  var len = arr.length >>> 0;
  let i = 0;
  while (i < len) {
    if (cb.call(context, arr[i], i, arr)) {
      return i;
    }
    i++;
  }
  return -1;
}
function isEven (num) {
  return num % 2 === 0;
}
console.log([3, 4, 5].myFindIndex(isEven)) // 1

// Else
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
```









# 一-2、常见实现

## 2-1、数组扁平化

扁平化即多维数组转为一维数组：`[1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]`

### 2-1-1、ES6 flat

```js
const arr = [1, [1,2], [1,2,3]]
arr.flat(Infinity)  // [1, 1, 2, 1, 2, 3]
```

### 2-1-2、replace + split

```js
ary = str.replace(/(\[|\])/g, '').split(',')
```

### 2-1-3、replace + JSON.parse

```js
str = str.replace(/(\[|\])/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
```

### 2-1-4、普通递归

```js
let result = [];
let fn = function(ary) {
  for(let i = 0; i < ary.length; i++) {
    let item = ary[i];
    if (Array.isArray(ary[i])){
      fn(item);
    } else {
      result.push(item);
    }
  }
}

// 实现2
const arr = [1, [1,2], [1,2,3]]
function flat(arr) {
  let result = []
  for (const item of arr) {
    item instanceof Array ? result = result.concat(flat(item)) : result.push(item)
  }
  return result
}
flat(arr) // [1, 1, 2, 1, 2, 3]
```

### 2-1-5、利用 reduce 函数迭代

```js
const ary = [1, [1,2], [1,2,3]]
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) ：cur);
    }, []);
}
console.log(flatten(ary)) // [1, 1, 2, 1, 2, 3]
```

### 2-1-6、ES6 展开运算符

```js
// 每次 while 都会合并一层的元素，这里第一次合并结果为 [1, 1, 2, 1, 2, 3, [4,4,4]]
// 然后 arr.some 判定数组中是否存在数组，因为存在 [4,4,4]，继续进入第二次循环进行合并
let arr = [1, [1,2], [1,2,3,[4,4,4]]]
while (arr.some(Array.isArray)) {
  arr = [].concat(...arr);
}
console.log(arr)  // [1, 1, 2, 1, 2, 3, 4, 4, 4]
```

### 2-1-7、序列化 + 正则

```js
const arr = [1, [1,2], [1,2,3]]
const str = `[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`
JSON.parse(str)   // [1, 1, 2, 1, 2, 3]
```



## 2-2、数组寻值

### 2-2-1、indexOf(ele)

```js
// 判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
var arr=[1,2,3,4];
var index=arr.indexOf(3);
console.log(index);
```

### 2-2-2、includes(ele [,fromIndex])

```js
// 判断数组中是否存在某个值，如果存在返回 true，否则返回 false
var arr=[1,2,3,4];
if(arr.includes(3))
    console.log("存在");
else
    console.log("不存在");
```

### 2-2-4、find(cb [,thisArg])

```js
// 数组中满足条件的第一个元素的值，如果没有，返回 undefined
var arr=[1,2,3,4];
var result = arr.find(item =>{
    return item > 3
});
console.log(result);
```

### 2-2-5、findeIndex(cb [,thisArg])

```js
// 返回数组中满足条件的第一个元素的下标，如果没有找到，返回 -1
var arr=[1,2,3,4];
var result = arr.findIndex(item =>{
    return item > 3
});
console.log(result);
```



## 2-3、数组乱序

### 2-3-1、sort + random

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.sort(function () {
    return Math.random() - 0.5;
});
```





## 2-4、数组去重

- `Array.from(new Set(arr))`

  - ```js
    var arr = [1,1,2,5,6,3,5,5,6,8,9,8];
    console.log(Array.from(new Set(arr)))
    // console.log([...new Set(arr)])
    ```

- `[...new Set(arr)]`

- `for `循环嵌套，利用 `splice` 去重

  - ```js
    function unique (origin) {
      let arr = [].concat(origin);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    }
    var arr = [1,1,2,5,6,3,5,5,6,8,9,8];
    console.log(unique(arr))
    ```

- 新建数组，利用 `indexOf` 或 `includes` 去重

  - ```js
    function unique (arr) {
      let res = []
      for (let i = 0; i < arr.length; i++) {
        if (!res.includes(arr[i])) {
          res.push(arr[i])
        }
      }
      return res;
    }
    var arr = [1,1,2,5,6,3,5,5,6,8,9,8];
    console.log(unique(arr))
    ```

- 先用 `sort `排序，然后用一个指针从第`0`位开始，配合 `while` 循环去重

  - ```js
    function unique (arr) {
      arr = arr.sort(); // 排序之后的数组
      let pointer = 0;
      while (arr[pointer]) {
        if (arr[pointer] != arr[pointer + 1]) { // 若这一项和下一项不相等则指针往下移
          pointer++;
        } else { // 否则删除下一项
          arr.splice(pointer + 1, 1);
        }
      }
      return arr;
    }
    var arr = [1,1,2,5,6,3,5,5,6,8,9,8];
    console.log(unique(arr))
    ```

    





