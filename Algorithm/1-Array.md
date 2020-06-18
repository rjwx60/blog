---
typora-root-url: ../Source
---

### 一、基本

#### 1-1、定义

​	**数组**(Array)，是一种使用一组连续的内存空间，来存储一组具有相同类型的数据的线性表数据结构；

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



#### 1-2、特点

- 数组空间连续：内存相邻、连续空间存储、是一种线性存储结构；
- 数组长度固定：因数组空间连续，内存中会有一整块空间来存放数组，若非长度固定则位于数组后方的区域将无法分配；此外，长度固定界定了数组可使用的内存界限；
- 数据类型相同：因数组长度固定，若非相同数据类型，则长度不一，就无法保证存放数据个数(长度)，此有悖固定长度；



#### 1-3、Java数组实现

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



#### 1-3、Js 数组实现

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

2-2-1、基本

​	JS 中，JSArray 继承自 JSObject，或者说它就是一个特殊的对象，内部是以 key-value 键值对形式存储数据，所以 JS 中的数组可以存放不同类型值。JSArray 有两种存储方式，快数组与慢数组。初始化空数组时，使用快数组，快数组使用连续的内存空间，当数组长度达到最大时，JSArray 就会进行动态扩容以存储更多元素，而当数组中 hole (空洞元素) 过多时，则会转变为慢数组，以哈希表形式存储数组，以节省内存空间；相对于慢数组，快数组性能要好得多；

2-2-2、示例：

2-2-3、快数组

2-2-4、慢数组

2-2-5、两者切换





### 三、LeedCode示例

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-27

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cea46ce51882521ee5fc965