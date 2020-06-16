---
typora-root-url: ../Source
---

### 一、基本

#### 1-1、定义：

​	队列是只允许在一端进行插入操作，而在另一端进行删除操作的线性表。主要有两种操作：入队enqueue：向队列的后端位置添加实体，出队dequeue：从队列的前端位置移除实体，队列是一种操作受限的、先进先出 FIFO (first in, first out)的线性表数据结构；

- 补充：若使用数组实现的队列，则叫顺序队列，用链表实现的队列，则叫作链式队列；

<img src="/Image/Algorithm/Queue/1.png" style="zoom:50%;" align="left"/>

#### 1-2、特点

1-2-1、时间复杂度

​	

1-2-2、应用

​	队列应用非常广泛，特别是一些具有某些额外特性的队列，比如循环队列、阻塞队列、并发队列。它们在很多偏底层系统、框架、中间件的开发中，起着关键性作用。比如高性能队列 Disruptor、Linux 环形缓存，都用到了循环并发队列；Java concurrent 并发包利用 ArrayBlockingQueue 来实现公平锁等；

1-2-3、场景

​	实际上，对于大部分资源有限的场景，当没有空闲资源时，基本上都可以通过“队列”这种数据结构来实现请求排队



#### 1-3、Java队列实现

1-3-1、顺序队列

<img src="/Image/Algorithm/Queue/2.png" style="zoom:50%;" align="left"/>

```java
// 1.基本实现-用数组实现的队列
public class ArrayQueue {
  // 数组：items，数组大小：n
  private String[] items;
  private int n = 0;
  // head表示队头下标，tail表示队尾下标
  private int head = 0;
  private int tail = 0;

  // 申请一个大小为capacity的数组
  public ArrayQueue(int capacity) {
    items = new String[capacity];
    n = capacity;
  }

  // 入队-将item放入队尾
  public boolean enqueue(String item) {
    // tail == n表示队列末尾没有空间了
    if (tail == n) {
      // tail ==n && head==0，表示整个队列都占满了
      if (head == 0) return false;
      // 数据搬移：
      // 当队列的 tail 指针移动到数组的最右边后
      // 若有新的数据入队，可将 head 到 tail 间数据，整体搬移到数组中 0 到 tail-head 的位置，参见下图1
      for (int i = head; i < tail; ++i) {
        items[i-head] = items[i];
      }
      // 搬移完之后重新更新head和tail
      tail -= head;
      head = 0;
    }
    
    items[tail] = item;
    ++tail;
    return true;
  }

  // 出队
  public String dequeue() {
    // 如果head == tail 表示队列为空
    if (head == tail) return null;
    // 为了让其他语言的同学看的更加明确，把--操作放到单独一行来写了
    String ret = items[head];
    ++head;
    return ret;
  }
}


// 2.支持动态扩容的队列
public class ArrayQueue<E> implements Queue<E> {
    private Array<E> array;

    public ArrayQueue(int capacity){
        array = new Array<>(capacity);
    }

    public ArrayQueue(){
        array = new Array<>();
    }

    @Override
    public int getSize(){
        return array.getSize();
    }

    @Override
    public boolean isEmpty(){
        return array.isEmpty();
    }

    public int getCapacity(){
        return array.getCapacity();
    }

    @Override
    public void enqueue(E e){
        array.addLast(e);
    }

    @Override
    public E dequeue(){
        return array.removeFirst();
    }

    @Override
    public E getFront(){
        return array.getFirst();
    }
}
```

1-3-2、链式队列

​	同样含两个指针：head 指针和 tail 指针，并分别指向链表的第一个结点和最后一个结点；入队时，`tail->next= new_node`, `tail = tail->next`；出队时，`head = head->next`；

<img src="/Image/Algorithm/Queue/3.png" style="zoom:50%;" align="left"/>

1-3-3、循环队列

​	用数组来实现队列的时候，在 `tail==n` 时，会有数据搬移操作，而使用循环队列可避免数据迁移；虽避免迁移但实现难度大，关键是确定好队空和队满的判定条件，用数组实现的非循环队列中，队满的判断条件是 tail == n，队空的判断条件是 head == tail，而循环队列，队列为空的判断条件仍然是 `head == tail`，而当队满时，`(tail+1)%n=head`；

- 注意：当队列满时，图中的 tail 指向的位置实际上是没有存储数据的。所以，循环队列会浪费一个数组的存储空间；

- <img src="/Image/Algorithm/Queue/6.png" style="zoom:50%;" align="left" />

  ```java
  // 1.基本实现
  public class CircularQueue {
    // 数组：items，数组大小：n
    private String[] items;
    private int n = 0;
    // head表示队头下标，tail表示队尾下标
    private int head = 0;
    private int tail = 0;
  
    // 申请一个大小为capacity的数组
    public CircularQueue(int capacity) {
      items = new String[capacity];
      n = capacity;
    }
  
    // 入队
    public boolean enqueue(String item) {
      // 队列满了
      if ((tail + 1) % n == head) return false;
      items[tail] = item;
      tail = (tail + 1) % n;
      return true;
    }
  
    // 出队
    public String dequeue() {
      // 如果head == tail 表示队列为空
      if (head == tail) return null;
      String ret = items[head];
      head = (head + 1) % n;
      return ret;
    }
  }
  
  
  // 2.基于前文 Queue 实现的循环队列
  public class LoopQueue<E> implements Queue<E> {
      private E[] data;
      private int front, tail;
      private int size;
  
      public LoopQueue(int capacity){
          data = (E[])new Object[capacity + 1];
          front = 0;
          tail = 0;
          size = 0;
      }
  
      public LoopQueue(){
          this(10);
      }
  
      public int getCapacity(){
          return data.length - 1;
      }
  
      @Override
      public boolean isEmpty(){
          return front == tail;
      }
  
      @Override
      public int getSize(){
          return size;
      }
  
      @Override
      public void enqueue(E e){
          if((tail + 1) % data.length == front)
              resize(getCapacity() * 2);
  
          data[tail] = e;
          tail = (tail + 1) % data.length;
          size ++;
      }
  
      @Override
      public E dequeue(){
          if(isEmpty())
              throw new IllegalArgumentException("Cannot dequeue from an empty queue.");
  
          E ret = data[front];
          data[front] = null;
          front = (front + 1) % data.length;
          size --;
          if(size == getCapacity() / 4 && getCapacity() / 2 != 0)
              resize(getCapacity() / 2);
          return ret;
      }
  
      @Override
      public E getFront(){
          if(isEmpty())
              throw new IllegalArgumentException("Queue is empty.");
          return data[front];
      }
  
      private void resize(int newCapacity){
          E[] newData = (E[])new Object[newCapacity + 1];
          for(int i = 0 ; i < size ; i ++)
              newData[i] = data[(i + front) % data.length];
  
          data = newData;
          front = 0;
          tail = size;
      }
  }
  ```

  

1-3-4、阻塞队列

​	即在队列基础上增加了阻塞操作。简单来说，就是在队列为空的时候，从队头取数据会被阻塞。因为此时还没有数据可取，直到队列中有了数据才能返回；如果队列已经满了，那么插入数据的操作就会被阻塞，直到队列中有空闲位置后再插入数据，然后再返回 (生产者消费者模型)；

<img src="/Image/Algorithm/Queue/4.png" style="zoom:50%;" align="left" />

<img src="/Image/Algorithm/Queue/5.png" style="zoom:50%;" align="left" />



1-3-5、并发队列

​	即线程安全的队列；最简单直接的实现方式是直接在 enqueue()、dequeue() 方法上加锁，但是锁粒度大并发度会比较低，同一时刻仅允许一个存或者取操作；实际上，基于数组的循环队列，利用 CAS 原子操作，可实现非常高效的并发队列；这也是循环队列比链式队列应用更加广泛的原因；



#### 1-4、Js队列实现

1-4-1、顺序队列

```javascript
class QueueJs {
  constructor() {
    this.queue = new ArrayJs();
  }

  // 时间复杂度: O(1)
  getSize() {
    return this.queue.getSize();
  }

  // 时间复杂度: O(1)
  isEmpty() {
    return this.queue.isEmpty();
  }

  getCapacity() {
    return this.queue.getCapacity();
  }

  // 时间复杂度: O(1) 均摊
  // 尾部入队操作
  enqueue(element) {
    this.queue.addLast(element);
  }

  // 时间复杂度: O(n)
  // 头部出队操作
  dequeue() {
    return this.queue.removeFirst();
  }

  // 时间复杂度: O(1)
  // 获取队首元素
  getFront() {
    return this.queue.getFirst();
  }
}
```



1-4-2、循环队列

```javascript
class LoopQueueJs {
  constructor(capacity) {
    this.data = new Array(capacity ? capacity + 1 :  10);
    // 队首指针
    this.front = 0;
    // 队尾指针 - 指向队尾元素的下一位置
    this.tail = 0;
    this.size = 0;
  }

  getCapacity() {
    return this.data.length - 1;
  }

  // 时间复杂度: O(1)
  isEmpty() {
    return this.front === this.tail;
  }

  // 时间复杂度: O(1)
  getSize() {
    return this.size;
  }

  // 时间复杂度: O(1) 均摊
  // 循环队列的入队操作
  enqueue(element) {
    // e.g: arr = [0, 1, 2, 3, 4] arr.length = 5;
    // 当队列满时，有两种情况:
    // 情况A: front = 0, tail = 4, (tail + 1) % length = 0 === front
    // 情况B: front = x, tail = x, (tail + 1) % length = x === front
    if ((this.tail + 1) % this.data.length === this.front) {
      this.resize(this.getCapacity() * 2);
    }
    this.data[this.tail] = element;
    // 队尾添加元素后，更新 tail 位置
    // e.g: arr = [0, 1, 2, 3, 4] arr.length = 5;
    // 情况A: 
    // front = 0, tail = 4, 增加元素至arr[4]后, (tail + 1) % length = 0 (tail == front, 下次操作会先进行 resize)
    // 情况B: 
    // front = 2, tail = 1, 增加元素至arr[1]后, (tail + 1) % length = 2 (tail == front, 下次操作会先进行 resize)
    this.tail = (this.tail + 1) % this.data.length;
    this.size++;
  }

  // 时间复杂度: O(1) 均摊
  // 循环队列的出队操作
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Cannot dequeue from an empty queue.');
    }

    var ret = this.data[this.front];
    // 出队后置空，不像 ArrayJava 影响整体
    this.data[this.front] = null;
    // 取余操作是为了当 front 到达队列尾部时能还原为 0，除此以外只需理解为 front += 1
    this.front = (this.front + 1) % this.data.length;
    this.size--;
    
    if (this.size === this.getCapacity() / 4 && this.getCapacity() / 2 !== 0) {
      this.resize(this.getCapacity() / 2);
    }
    return ret;
  }

  resize(newCapacity) {
    var newData = new Array(newCapacity + 1);
    for(var i = 0; i < this.size; i++) {
      newData[i] = this.data[(i + this.front) % this.data.length];
    }
    this.data = newData;
    // 重新赋值头尾指针
    this.front = 0;
    this.tail = this.size;
  }

  // 时间复杂度: O(1)
  // 获取队首元素
  getFront() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty.');
    }
    return this.data[this.front];
  }
}
```



### 二、LeedCode示例

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-32

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cf4c699f265da1bc23f6252

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cea46f55188253a275a3a04