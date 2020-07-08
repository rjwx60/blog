---
typora-root-url: ../Source
---



### 一、基本

#### 1-1、背景

- **集合**：由一个或多个确定的元素所构成的整体，即将一组事物组合在一起，集合中的元素类型不一定相同、没有顺序；
- **列表**：亦称线性列表，是一种数据项构成的有限序列，即按照一定的线性顺序，排列而成的数据项的<u>集合</u>，列表的概念是在集合的特征上形成的，但具有顺序，且长度可变；列表最常见的表现形式有数组和链表，而栈和队列则是两种特殊类型的列表；
- **数组**：数组是列表的实现方式之一，具有列表的特征，同时也具有自己的一些特征，区分列表和数组的<u>最大不同点</u>在于：列表没有索引，而<u>数组有索引</u>——数字来标识每项数据在数组中的位置；其次，不同点在于：<u>数组元素在内存中是连续存储</u>的，<u>且每个元素占用相同大小的内存</u>，而列表中的元素在内存中可相邻也可不相邻，即不连续的；



#### 1-2、定义

**数组**(Array)，是一种使用一组连续的内存空间，来存储一组具有相同类型的数据的线性表数据结构；

- 注意：字符串是由字符数组形成的，所以二者是相似的；

- 连续的内存空间和相同类型的数据：见1-1特点；此使得数组访问效率极高，可实现随机访问，但删除和插入效率低下，因为了保证连续性，就需做大量的数据搬移工作；

  - 高效访问：

    - 计算机会给每个内存单元分配一个地址，并通过地址来访问内存中的数据；

    - 计算机会为数组分配一块连续内存空间；

    - 当计算机需要随机访问数组中的某个元素时，首先通过寻址公式，计算出该元素存储的内存地址；

    - ```c
      a[i]_address = base_address + i * data_type_size
      ```

    - 注意：数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)，并非指数组查找操作均为O(1)；

  - 低效插入：

    - 时间复杂度：最坏情况下，在数组开头插入元素，此时最坏时间复杂度是 O(n)，一般情况下，向每个位置插入元素的概率是一样的，故平均情况时间复杂度为 (1+2+…n)/n=O(n)；
    - 性能优化：上述为有序数组插入，若数组无序，仅作为存储数据的集合，则可通过将被插入位置的数组搬移到数组末尾，而原位置由新数据代替的方式提升效率，此时时间复杂度为O(1)，此种思想，在快排也有体现；
    - <img src="/Image/Algorithm/Array/3.png" style="zoom:50%;" align="left"/>

  - 低效删除：

    - 时间复杂度：同插入，也为O(n)；
    - 性能优化：实际上，在某些特殊场景下，并不一定非得追求数组中数据连续性，若将多次删除操作集中在一起执行，可大大提升处理效率，比如可先记录下已删除的数据，然后每次的删除操作并非真正地搬移数据，只是记录数据已经被删除，当数组没有更多空间存储数据时，再触发执行一次真正的删除操作，此种思想，即 JVM 标记清除垃圾回收算法的核心思想；
    - <img src="/Image/Algorithm/Array/4.png" style="zoom:50%;" align="left"/>

- 补充：越界访问、容器ArrayList、数组从0开始编号、补充自：https://time.geekbang.org/column/article/40961 评论区更精彩



#### 1-3、特点与操作

##### 1-3-1、特点

- 数组空间连续：内存相邻、连续空间存储、是一种线性存储结构；
- 数组长度固定：因数组空间连续，内存中会有一整块空间来存放数组，若非长度固定则位于数组后方的区域将无法分配；此外，长度固定界定了数组可使用的内存界限；
- 数据类型相同：因数组长度固定，若非相同数据类型，则长度不一，就无法保证存放数据个数(长度)，此有悖固定长度；

##### 1-3-2、操作

- 读取元素

通过数组的索引访问数组中的元素，索引其实就是内存地址，计算机会为数组在内存中申请一段 **连续** 的空间，并记下索引为 `0` 处的内存地址，当访问数组中索引为 `3` 处的元素时，计算机会进行如下计算：

- 找到该数组的索引 `0` 的内存地址： `2008`；
- `pears` 的索引为 `3`，计算该元素的内存地址为 `2008 + 3 = 2011`；
- 计算机直接通过该地址访问到数组中索引为 `3` 的元素；

<img src="/Image/Algorithm/Array/8.png" style="zoom:50%;" align="left"/>



- 查询元素

当计算机想要知道数组中是否包含某个元素时，只能从索引 `0` 处开始，逐步向后查询，最坏情况下需要查询数组中的每个元素，此时的时间复杂度为 O*(*N*)，*N* 为数组的长度；



- 插入元素

  - 若插入末尾，则只需一步：即计算机通过数组的长度和位置计算出即将插入元素的内存地址，然后将该元素插入到指定位置；

  - 若插入其他位置，则需先为该元素所要插入的位置`腾出` 空间，然后进行插入操作；

    

- 删除元素

删除元素与插入元素的操作类似，当删除掉数组中的某个元素后，数组中会留下 `空缺` 的位置，而数组中的元素在内存中是连续的，这就使得后面的元素需对该位置进行 `填补` 操作；



#### 1-4、Java数组实现

```java
public class Array<E> {
    private E[] data;
    private int size;

    // 构造函数，传入数组的容量 capacity 构造 Array
    public Array(int capacity){
        data = (E[])new Object[capacity];
        size = 0;
    }

    // 无参数的构造函数，默认数组的容量 capacity=10
    public Array(){
        this(10);
    }

    // 获取数组的容量
    public int getCapacity(){
        return data.length;
    }

    // 获取数组中的元素个数
    public int getSize(){
        return size;
    }

    // 返回数组是否为空
    public boolean isEmpty(){
        return size == 0;
    }

    // 关键方法1 - add
    // 在 index 索引位置插入新元素 e 
    public void add(int index, E e){
        if(index < 0 || index > size)
            throw new IllegalArgumentException("Add failed. Require index >= 0 and index <= size.");

        if(size == data.length)
            resize(2 * data.length);

        for(int i = size - 1; i >= index ; i --)
            data[i + 1] = data[i];

        data[index] = e;
        size ++;
    }

    // 向所有元素后添加新元素
    public void addLast(E e){
        add(size, e);
    }

    // 在所有元素前添加新元素
    public void addFirst(E e){
        add(0, e);
    }

    // 获取 index 索引位置元素
    public E get(int index){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Get failed. Index is illegal.");
        return data[index];
    }

    // 修改 index 索引位置元素为 e
    public void set(int index, E e){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Set failed. Index is illegal.");
        data[index] = e;
    }

    // 查找数组中是否有元素 e
    public boolean contains(E e){
        for(int i = 0 ; i < size ; i ++){
            if(data[i].equals(e))
                return true;
        }
        return false;
    }

    // 查找数组中元素 e 所在的索引，如果不存在元素 e，则返回-1
    public int find(E e){
        for(int i = 0 ; i < size ; i ++){
            if(data[i].equals(e))
                return i;
        }
        return -1;
    }

  	// 关键方法2 - remove
    // 从数组中删除 index位置的元素, 返回删除元素
    public E remove(int index){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Remove failed. Index is illegal.");

        E ret = data[index];
        for(int i = index + 1 ; i < size ; i ++)
            data[i - 1] = data[i];
        size --;
        data[size] = null; // loitering objects != memory leak

        if(size == data.length / 4 && data.length / 2 != 0)
            resize(data.length / 2);
        return ret;
    }

    // 从数组中删除第一个元素, 返回删除的元素
    public E removeFirst(){
        return remove(0);
    }

    // 从数组中删除最后一个元素, 返回删除的元素
    public E removeLast(){
        return remove(size - 1);
    }

    // 从数组中删除元素 e
    public void removeElement(E e){
        int index = find(e);
        if(index != -1)
            remove(index);
    }

  	// 关键方法3 - resize
    // 将数组空间的容量变成 newCapacity 大小
    private void resize(int newCapacity){
        E[] newData = (E[])new Object[newCapacity];
        for(int i = 0 ; i < size ; i ++)
            newData[i] = data[i];
        data = newData;
    }
}
```

注意：Java 的数组实现需手动维护数组大小；

- 每增加一元素需遍历数组元素，并在数组满盈时进行扩容(开辟新空间，遍历赋值)，扩容后新数组长度为原来的2倍；
- 每减少一元素需遍历数组元素，并当数组满盈时进行缩容(开辟新空间，遍历赋值)，缩容后新数组长度为原来的0.5倍；



#### 1-5、Js 数组实现

- 注意：不用刻意模拟 Java 实现方式 (下述代码仅为 Java Array 的 JS 实现)，否则会创建出含有许多空洞元素的数组，而空洞元素会导致 JS 引擎内部频繁在快慢数组间切换，从而导致性能低下；故下述实现中虽通过传入 size 限制了 JS 数组大小，但不够灵活，且实际场景下不应约束数组大小，而应将其交由优化策略已相当完备的引擎代为管理；

```javascript
class ArrayJava {
  // 传入数组容量 capacity 构造 Array
  constructor(capacity) {
    this.size = 0;
    this.data = new Array(capacity ? capacity : 10);
  }

  // 获取数组容量
  getCapacity() {
    return this.data.length;
  }

  // 获取元素个数
  getSize() {
    return this.size;
  }

  // 获取元素个数
  isEmpty() {
    return this.size === 0;
  }

  // 时间复杂度: O(n/2) = O(n)
  // 在 index 索引位置插入新元素 element
  add(index, element) {
    var size = this.size;
    var length = this.data.length;

    if(index < 0 || index > size) {
      throw new Error('Add failed. Require index >= 0 and index <= size.');
    }

    if(size === length) {
      // throw new Error('Add failed. Array is full');
      // Dynamic Array - 动态数组
      this.resize(2 * length);
    }

    for(var i = size - 1; i >= index; i--) {
      this.data[i + 1] = this.data[i];
    }
    this.data[index] = element;
    
    this.size++;
  }

  // 时间复杂度: O(1)
  // 末尾增加元素
  addLast(element) {
    this.add(this.size, element);
  }

  // 时间复杂度: O(n)
  // 头部增加元素
  addFirst(element) {
    this.add(0, element);
  }

  // 时间复杂度: O(1)
  // 获取 index 索引位置的元素
  get(index) {
    if(index < 0 || index >= this.size) {
      throw new Error('Get failed. Index is illegal');
    }
    return this.data[index];
  }

  // 时间复杂度: O(1)
  // 修改索引 index 位置元素为 element
  set(index, element) {
    if(index < 0 || index >= this.size) {
      throw new Error('Set failed. Index is illegal');
    }
    this.data[index] = element;
  }

  // 时间复杂度: O(1)
  // 获取尾部元素并返回
  getLast() {
    return this.get(this.size - 1);
  }

  // 时间复杂度: O(1)
  // 获取头部元素并返回
  getFirst() {
    return this.get(0);
  }

  // 时间复杂度: O(n)
  // 查找数组中是否有元素 element 所在的索引，若不存在则返回 -1
  find(element) {
    var size = this.size;
    for(var i = 0; i < size; i++) {
      if (this.data[i] === element) {
        return i;
      }
    }
    return -1;
  }

  // 时间复杂度: O(n)
  // 查找数组中是否有元素e
  conotains(element) {
    return this.find(element) === -1 ? false : true;
  }

  // 时间复杂度: O(n/2) = O(n)
  // 从数组中删除 index 位置元素，返回删除元素
  remove(index) {
    var size = this.size;

    if(index < 0 || index >= size) {
      throw new Error('Remove failed. Index is illegal.');
    }

    var ret = this.data[index];
    for(var i = index; i < size; i++) {
      // 问题: 末尾元素如何去除，不能直接赋 null，下述方法也会赋 undefined
      // this.data[i] = this.data[i + 1] && this.data[i + 1];
      this.data[i] = this.data[i + 1];
    }
    this.size--;
    // 解决: 通过 JS 特有值 length
    var oldLen = this.data.length;
    this.data.length = this.size;
    this.data.length = oldLen;
    // 均摊复杂度 - lazy
    if((this.size === this.data.length / 4) && (this.data.length / 2 !== 0) ) {
      this.resize(this.data.length / 2);
    }
    return ret;
  }

  // 时间复杂度: O(n)
  // 删除头部元素并返回
  removeFirst() {
    this.remove(0);
  }

  // 时间复杂度: O(1)
  // 删除尾部元素并返回
  removeLast() {
    return this.remove(this.size - 1);
  }

  // 删除元素 element
  removeElement(element) {
    var index = this.find(element);
    if(index !== -1) {
      this.remove(index);
    }
  }

  // 时间复杂度: O(n)
  // 动态数组
  resize(newCapacity) {
    var size = this.size;
    var newData = new Array(newCapacity);
    for(var i = 0; i < size; i++) {
      newData[i] = this.data[i];
    }
    this.data = newData;
  }
}
```



### 二、JS数组

#### 2-1、JS 数组特点

- JS 数组可存放多种数据类型；
- JS 数组可动态改变数组大小，并根据元素数量来进行扩容、收缩；
- JS 数组提供多种方法 (可利用 pushpop 表现栈，亦可利用 shiftpush 表现队列)；

总结：空间不连续、长度不固定、类型可不同 => 注定其底层实现并非真正数组；



#### 2-2、JS 数组实质

##### 2-2-1、基本

​	JS 中，JSArray 继承自 JSObject，或者说它就是一个特殊的对象，内部是以 key-value 键值对形式存储数据，所以 JS 中的数组可以存放不同类型值。JSArray 有两种存储方式，快数组与慢数组。初始化空数组时，使用快数组，快数组使用连续的内存空间，当数组长度达到最大时，JSArray 就会进行动态扩容以存储更多元素，而当数组中 hole (空洞元素) 过多时，则会转变为慢数组，以哈希表形式存储数组，以节省内存空间；相对于慢数组，快数组性能要好得多；

##### 2-2-2、示例：

##### 2-2-3、快数组

##### 2-2-4、慢数组

##### 2-2-5、两者切换





### 三、LeedCode示例

详看：https://leetcode-cn.com/problemset/all/?search=Array

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-27

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cea46ce51882521ee5fc965



#### 3-1、类型

- ##### 基本操作

- ##### 双向指针

- ##### N数之和

- ##### 多维数组

- ##### 数据统计



##### 3-1-1、基本操作

##### 3-1-1、[寻找数组的中心索引](https://leetcode-cn.com/explore/learn/card/array-and-string/198/introduction-to-array/770/)

Given an array of integers `nums`, write a method that returns the "pivot" index of this array.

We define the pivot index as the index where the sum of all the numbers to the left of the index is equal to the sum of all the numbers to the right of the index.

If no such index exists, we should return -1. If there are multiple pivot indexes, you should return the left-most pivot index.

##### Example：

```
// Example1:
Input: nums = [1,7,3,6,5,6]
Output: 3
Explanation:
The sum of the numbers to the left of index 3 (nums[3] = 6) is equal to the sum of numbers to the right of index 3.
Also, 3 is the first index where this occurs.

// Example2:
Input: nums = [1,2,3]
Output: -1
Explanation:
There is no index that satisfies the conditions in the problem statement.
```

**Constraints:**

- The length of `nums` will be in the range `[0, 10000]`.
- Each element `nums[i]` will be an integer in the range `[-1000, 1000]`.

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
    if(!nums.length) {
        return -1;
    }
    var map = {};
    var total = 0;
    for(var i = 0; i < nums.length; i++) {
        // 相邻元素累计值和值
        var sum = total + total + nums[i];
        if (map[sum] === undefined) {
            map[sum] = i;
        }
        total += nums[i];
    }
    return map[total] !== undefined ? map[total] : -1;
};
// 执行用时：124 ms, 在所有 JavaScript 提交中击败了34.06%的用户
// 内存消耗：43.7 MB, 在所有 JavaScript 提交中击败了100.00%的用户

// 思路: 
// 1、因数组元素累加值 = 当前索引所在值的累计值 + 后续元素索引累计值，故可视为寻找相邻元素累计值，如下表: 11 + 17 = 28
// value: 1   7   3   6   5   6
// index: 0   1   2   3   4   5
// total: 1   8   11  17  22  28
// 2、故计算累计和值，然后寻找数组中的任意相邻两个元素相加得终值，结果为第二个相邻元素的索引；
// 3、构建 map 存储相邻和值与第二相邻位索引



/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
  if(nums.length < 3) return -1;
  let sum = 0, left = 0;
  for(let i = 0; i < nums.length; i++) {
      sum += nums[i];
  }
  for(let i = 0; i < nums.length; i++){
      if((sum - nums[i]) / 2  === left){
        return i;
      }
      left += nums[i]
  }
  return -1;
};
// 执行用时： 92 ms , 在所有 JavaScript 提交中击败了 71.42% 的用户 
// 内存消耗： 37.4 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户

// 思路:
// 1、思路是相通的: S 是数组的和，当索引 i 是中心索引时，位于 i 左边数组元素的和 leftsum 满足 S - nums[i] - leftsum, 只需要判断当前索引 i 是否满足 leftsum==S-nums[i]-leftsum 并动态计算 leftsum 的值;
// 2、但这个比前一个方法快，虽然用了两次循环，但上一个方法将所有累计值均存储起来，最后一步才判断，而此方法则将计算和与判断操作分离，故一旦检索到结果就提前结束，所以更快；



/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
    let sum = 0;
    nums.forEach(num => sum += num);
    let leftSum = 0;
    for(i = 0; i < nums.length; i++){
        if((sum - nums[i]) - leftSum == leftSum){
            return i;
        }else{
            leftSum += nums[i];
        }
    }
    return -1;
};
// 执行用时： 80 ms , 在所有 JavaScript 提交中击败了 93.75% 的用户 
// 内存消耗： 37.7 MB , 在所有 JavaScript 提交中击败了 100.00% 的用户



// 反思:
// 1、在解法1中，未考虑 map[sum] 为 0 的特殊值情况，而使用 !map[sum] 判断(应该使用 undefined)，导致没有考虑 [-1,-1,0,1,1,-1] 的情况;
// 2、若题目隐晦难懂，不要光在大脑里死磕、模拟，人脑不是 matlab，不要勉强，可通过手写画图提高认知；
// 3、有时将操作分离能带来更好的效率；
```







##### 3-1-2、搜索插入位置



##### 3-1-3、合并区间



##### 3-1-2、双向指针

##### 3-1-2-1、**<u>调整数组元素顺序使奇前偶后</u>**

输入整数数组，实现函数来调整该数组中数字的顺序，使所有奇数位于数组前半部分，所有偶数位于数组的后半部分；

```javascript
function reOrderArray(array) {
  if (Array.isArray(array)) {
    let start = 0;
    let end = array.length - 1;
    while (start < end) {
      while (array[start] % 2 === 1) {
        start++;
      }
      while (array[end] % 2 === 0) {
        end--;
      }
      if (start < end) {
        [array[start], array[end]] = [array[end], array[start]]
      }
    }
  }
  return array;
}

// 思路:
// 1、头尾各放置一指针，向内逼近移动，若符合条件则交换位置
```

##### 3-1-2-2、**<u>调整数组元素顺序使奇前偶后2</u>**

输入整数数组，实现函数来调整该数组中数字的顺序，使所有奇数位于数组前半部分，所有偶数位于数组的后半部分，<u>**但相对顺序不发生变化**</u>

```javascript
// 1、3-1-1-1中，相对顺序会发生变化，比如 [1,2,3,4,5,6] -> [1,5,3,4,2,6]
// 2、3-1-1-2中，则要求不能发生变化，比如 [1,2,3,4,5,6] -> [1,3,5,2,4,6]
function reOrderArray(array) {
  if (Array.isArray(array)) {
    let headO = 0;
    let headT = 0
    while (start < end) {
      while (array[start] % 2 === 1) {
        start++;
      }
      while (array[end] % 2 === 0) {
        end--;
      }
      if (start < end) {
        [array[start], array[end]] = [array[end], array[start]]
      }
    }
  }
  return array;
}

// 思路:
// 1、可构建两个空数组进行存放，然后再合并
// 2、可利用冒泡思想，前后若不同则前后两两交换
// 3、可嵌套循环，偶数取出放最后，后数前移；
```

##### 3-1-2-3、**<u>和为 S 的两个数字</u>**

输入一个递增排序的数组和一个数字`S`，在数组中查找两个数，使得他们的和正好是`S`，如果有多对数字的和等于`S`，输出两个数的乘积最小

```javascript
function FindNumbersWithSum(array, sum) {
  if (array && array.length > 0) {
    let left = 0;
    let right = array.length - 1;
    while (left < right) {
      const s = array[left] + array[right];
      if (s > sum) {
        right--;
      } else if (s < sum) {
        left++;
      } else {
        return [array[left], array[right]]
      }
    }
  }
  return [];
}

// 思路:
// 1、双指针夹逼法
// 2、因为数据本身已是递增排序的序列，故返回的第一个即乘积最小，比如[3,8] < [5,7]
```

##### 3-1-2-4、**<u>和为 S 的连续正数序列</u>**

输入一个正数`S`，打印出所有和为S的连续正数序列。

例如：输入`15`，有序`1+2+3+4+5` = `4+5+6` = `7+8` = `15` 所以打印出3个连续序列`1-5`，`5-6`和`7-8`

```javascript
function FindContinuousSequence(sum) {
  var result = [];
  var child = [1, 2];
  let big = 2;
  let small = 1;
  let currentSum = 3;
  while (big < sum) {
    while (currentSum < sum && big < sum) {
      child.push(++big);
      currentSum += big;
    }
    while (currentSum > sum && small < big) {
      child.shift();
      currentSum -= small++;
    }
    if (currentSum === sum && child.length > 1) {
      result.push(child.slice());
      child.push(++big);
      currentSum += big;
    }
  }
  return result;
}

// 思路:
// 1、提示很明显了，关键是连续，可联想到队列
// 2、构建一虚拟队列，初始元素 1，2，队列头尾分别对应头尾指针，若头右移，则队列增加一个数，若尾右移，则队列减少一个数(队列头方向居右)；当队列和大于目标值，尾指针右移，以谨慎缩小与目标值的差值；当队列和小于目标值，头指针右移，以大胆增加自身值；
```





##### 3-1-3、N数之和

详见 TwoSum 及其下 More 部分



##### 3-1-4、多维数组

##### 3-1-4-1、构建乘积数组

给定一个数组A`[0,1,...,n-1]`,请构建一个数组B`[0,1,...,n-1]`,其中B中的元素 `B[i]=A[0]*A[1]*...*A[i-1]*A[i+1]*...*A[n-1]`。注意不能使用除法。

```javascript
function multiply(A) {
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
}

// 思路:
// 1、注意到 B[i] = A组每元素乘积 / A[i], 即效果图如下
// 2、考察抽象空间思维与边界值的处理
```

<img src="/Image/Algorithm/Array/5.png" style="zoom:50%;" align="center"/>

##### 3-1-4-2、顺时针打印矩阵

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

```
例如，如果输入如下4 X 4矩阵：
1 2 3 4 
5 6 7 8
9 10 11 12 
13 14 15 16 
则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10
```

```javascript
function printMatrix(matrix) {
  var start = 0;
  var result = [];
  var rows = matrix.length;
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
}

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

// 思考:
// 1、不要复杂化，单一问题单一解决，这样会容易理解和清晰的多
// 2、将打印一圈拆解为四部: 第一步：从左到右打印一行、第二步：从上到下打印一列、第三步：从右到左打印一行、第四步：从下到上打印一列;
// 3、最后一圈很有可能出现几种异常情况,打印矩阵最里面一圈可能只需三步、两步、甚至一步
```

<img src="/Image/Algorithm/Array/6.png" style="zoom:30%;" align="center"/>

<img src="/Image/Algorithm/Array/7.png" style="zoom:50%;" align="center"/>







##### 3-1-5、数据统计

##### 3-1-5-1、某元素个数超出数组长度一半

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。例如输入一个长度为9的数组{1,2,3,2,2,2,5,4,2}。由于数字2在数组中出现了5次，超过数组长度的一半，因此输出2。如果不存在则输出0

```javascript
function MoreThanHalfNum_Solution(numbers) {
  if (numbers && numbers.length > 0) {
    var length = numbers.length;
    var temp = {};
    for (var i = 0; i < length; i++) {
      // 判断逻辑
      if (temp['s' + numbers[i]]) {
        temp['s' + numbers[i]]++;
      } else {
        temp['s' + numbers[i]] = 1;
      }
      // 结束边界
      if (temp['s' + numbers[i]] > length / 2) {
        return numbers[i];
      }
    }
    return 0;
  }
}
// 思路1: 开辟额外空间存储每个值出现的次数，时间复杂度最大为O(n)，逻辑简单


function MoreThanHalfNum_Solution(numbers) {
  if (numbers && numbers.length > 0) {
    var target = numbers[0];
    var count = 1;
    for (var i = 1; i < numbers.length; i++) {
      if (numbers[i] === target) {
        count++;
      } else {
        count--;
      }
      if (count === 0) {
        target = numbers[i];
        count = 1;
      }
    }
    count = 0;
    for (var i = 0; i < numbers.length; i++) {
      if (numbers[i] === target) count++;
    }
    return count > numbers.length / 2 ? target : 0;
  }
}
// 思路2: 记录两个变量: 数组中某个值以及它出现的次数，时间复杂度O(n) 无需开辟额外空间
```



##### 3-1-5-2、首个出现1次字符

在一个字符串(`0<=字符串长度<=10000`，全部由字母组成)中找到第一个只出现一次的字符,并返回它的位置, 如果没有则返回`-1`

注意：需要区分大小写

```javascript
function FirstNotRepeatingChar(str) {
  if (!str) {
    return -1;
  }
  let countMap = {};
  const array = str.split('');
  const length = str.length;
  for (let i = 0; i < length; i++) {
    const current = array[i];
    let count = countMap[current];
    if (count) {
      countMap[current] = count + 1;
    } else {
      countMap[current] = 1;
    }
  }
  for (let i = 0; i < length; i++) {
    if (countMap[array[i]] === 1) {
      return i;
    }
  }
  return -1;
}
// 思路1: 用 Map 存储每个字符出现的字数, 第一次循环存储次数，二次循环 Map 找到首个出现一次的字符。时间复杂度O(n)、空间复杂度O(n)

function FirstNotRepeatingChar(str) {
  // write code here
  for (var i = 0; i < str.length; i++) {
    if (str.indexOf(str[i]) == str.lastIndexOf(str[i])) {
      return i;
    }
  }
  return -1;
}
// 思路2: 使用 API 方法，indexOf 与 lastIndexOf 判断索引是否一致，但因 indexOf 自身复杂度为 O(n), 故整体的时间复杂度为O(n2)，空间复杂度为0
```



##### 3-1-5-3、扑克牌顺子-懵逼

扑克牌中随机抽`5`张牌，判断是否是顺子，即这`5`张牌是否连续。现假设 `2-10`为数字本身，`A`为`1`，`J`为`11` ，`Q` 为 `12` ， `K` 为 `13` ，鬼牌可看成任何数字，也可将其当作`0`处理；

```javascript
function IsContinuous(numbers) {
  if (numbers && numbers.length > 0) {
    numbers.sort();
    let kingNum = 0;
    let spaceNum = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === 0) {
        kingNum++;
      } else {
        const space = numbers[i + 1] - numbers[i];
        if (space == 0) {
          return false;
        } else {
          spaceNum += space - 1;
        }
      }
    }
    return kingNum - spaceNum >= 0;
  }
  return false;
}

1.数组排序
2.遍历数组
3.若为0，记录0的个数加1
4.若不为0，记录和下一个元素的间隔
5.最后比较0的个数和间隔数，间隔数>0的个数则不能构成顺子
6.注意中间如果有两个元素相等则不能构成顺子
```



##### 3-1-5、其他

##### 3-1-6-1、连续子数组最大和-懵逼

输入一个整型数组，数组里有正数也有负数。数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值，要求时间复杂度为`O(n)` 例如:`{6,-3,-2,7,-15,1,2,2}`,连续子向量的最大和为8(从第0个开始,到第3个为止)

```javascript
function FindGreatestSumOfSubArray(array) {
  if (Array.isArray(array) && array.length > 0) {
    let sum = array[0];
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (sum < 0) {
        sum = array[i];
      } else {
        sum = sum + array[i];
      }
      if (sum > max) {
        max = sum;
      }
    }
    return max;
  }
  return 0;
}

// 思路:
// 记录一个当前连续子数组最大值 max 默认值为数组第一项
// 记录一个当前连续子数组累加值 sum 默认值为数组第一项

// 1.从数组第二个数开始，若 sum<0 则当前的sum不再对后面的累加有贡献，sum = 当前数
// 2.若 sum>0 则sum = sum + 当前数
// 3.比较 sum 和 max ，max = 两者最大值
```



##### 3-1-5-2、将数组元素排成最小序列输出-懵逼

输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

例如输入数组`{3，32，321}`，则打印出这三个数字能排成的最小数字为`321323`

```javascript
function PrintMinNumber(numbers) {
  if (!numbers || numbers.length === 0) {
    return "";
  }
  return numbers.sort(compare).join('');
}

function compare(a, b) {
  const front = "" + a + b;
  const behind = "" + b + a;
  return front - behind;
}

// 思路:
// 定义一种新的排序规则，将整个数组重新排序：
// a和b两个数字可以有两种组合：ab和ba，若ab<ba则ab应该排在ba前面，否则ab应该排在ba后面。
// 使用数组的sort方法，底层是快排，也可以手写一个快排。
// sort方法接收一个比较函数，compareFunction：如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前
```



##### 3-1-6-3、[数组+归并排序](http://www.conardli.top/docs/dataStructure/数组/数组中的逆序对.html#题目)

##### 3-1-6-4、[统计数组元素出现次数](http://www.conardli.top/docs/dataStructure/数组/在排序数组中查找数字.html#题目)