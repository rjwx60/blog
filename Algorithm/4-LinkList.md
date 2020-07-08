---
typora-root-url: ../Source
---

### 一、基本

#### 1-1、定义

 	**链表**(LinkList)，是由一组节点组成的线性集合数据结构，每个节点由数据和到序列中下一个节点的引用(指针/链接)组成。最简单的链表允许在迭代期间有效地从序列中的任何位置插入或删除元素。更复杂的变体链表能添加额外的链接，并允许有效地插入或删除任意元素引用。注意链表不像数组，其中的元素在内存中并非连续存放；此外，链表在开发中也是经常用到的数据结构，`React16`的 `Fiber Node`连接起来形成的`Fiber Tree`, 就是个单链表结构。

- 需要遍历才能查询到元素，查询慢。
- 插入元素只需断开连接重新赋值，插入快。

<img src="/Image/Algorithm/LinkList/1.png" style="zoom:50%;" />

<img src="/Image/Algorithm/LinkList/8.png" style="zoom:30%;" />

#### 1-2、特点

链表在在添加或移除元素时却无需像数组那样移动其他元素，但访问则无法实现像数组那样的快速访问，比如随机访问；

<img src="/Image/Algorithm/LinkList/2.png" style="zoom:50%;" />

<img src="/Image/Algorithm/LinkList/7.png" style="zoom:50%;" />

- 注意：插入结点时，一定要注意操作的顺序，避免指针丢失和内存泄漏

<img src="/Image/Algorithm/LinkList/6.png" style="zoom:50%;" />

```java
x->next = p->next;  // 将x的结点的next指针指向b结点；
p->next = x;  			// 将p的next指针指向x结点；
```

- 注意：删除链表结点时，也一定要记得手动释放内存空间
- 注意：针对链表插入、删除操作，需要对插入首个结点和删除最后一个结点的情况进行特殊处理，若欲降低复杂度可引入哨兵结点；

##### 1-2-1、分类

1-2-1-1、静态链表：用数组描述的链表

1-2-2-2、双向链表：在单链表的每个结点中，再设置一个指向前驱结点的指针域；

<img src="/Image/Algorithm/LinkList/4.png" style="zoom:50%;" />

1-2-2-3、循环链表：特殊的单链表，跟单链表唯一的区别就在尾结点，将单链表中终端结点的指针端由空指针改为指向头结点，如此整个单链表形成一个环，如此头尾相接的单链表称为单循环链表，亦称循环链表；

<img src="/Image/Algorithm/LinkList/3.png" style="zoom:50%;" />

1-2-2-4、双向循环链表：双向与循环链表的综合

<img src="/Image/Algorithm/LinkList/5.png" style="zoom:50%;" />



##### 1-2-2、时间复杂度

1-2-2-1、链表的访问操作：时间复杂度为O(n)；

1-2-2-2、链表的删除/插入操作：

- 删除/插入结点中“值等于某个给定值”的结点；
  - 不管是单链表还是双向链表，为了查找到值等于给定值的结点，都需从头结点开始一个一个依次遍历对比，直到找到值等于给定值的结点，然后再通过我前面讲的指针操作将其删除，后者时间复杂度为O(1)，但前者时间复杂度为O(n)，综合复杂度为O(n)；
- 删除/插入给定指针指向的结点；
  - 此时已经有要删除的结点，但删除某个结点 q 需知道其前驱结点，而单链表并不支持直接获取前驱结点，所以为找到前驱结点，单链表还须从头结点开始遍历链表，直到 p->next=q，说明 p 是 q 的前驱结点，而双向链表则不用，故此种情况下，单向链表时间复杂度为O(n)，双向链表复杂度为O(1)；

##### 1-2-3、应用

1-2-3-1、LRU 缓存淘汰算法

​	维护一个有序单链表，越靠近链表尾部的结点是越早之前访问的。当有一个新的数据被访问时，从链表头开始顺序遍历链表；

- 若此数据之前已被缓存在链表中，则遍历得到这个数据对应的结点，并将其从原来的位置删除，然后再插入到链表的头部；
- 若此数据没有在缓存链表中，又可分为两种情况：
  - 若此时缓存未满，则将此结点直接插入到链表的头部；
  - 若此时缓存已满，则链表尾结点删除，将新的数据结点插入链表的头部；

##### 1-2-4、场景



#### 1-3、Java实现

1-3-1、基本实现

```java
public class LinkedList<E> {
    private class Node{
        public E e;
        public Node next;

        public Node(E e, Node next){
            this.e = e;
            this.next = next;
        }
        public Node(E e){
            this(e, null);
        }
        public Node(){
            this(null, null);
        }
        @Override
        public String toString(){
            return e.toString();
        }
    }

    private Node dummyHead;
    private int size;

    public LinkedList(){
        dummyHead = new Node();
        size = 0;
    }

    // 获取链表中的元素个数
    public int getSize(){
        return size;
    }

    // 返回链表是否为空
    public boolean isEmpty(){
        return size == 0;
    }

    // 在链表的index(0-based)位置添加新的元素e
    // 在链表中不是一个常用的操作，练习用：）
    public void add(int index, E e){
        if(index < 0 || index > size)
            throw new IllegalArgumentException("Add failed. Illegal index.");

        Node prev = dummyHead;
        for(int i = 0 ; i < index ; i ++)
            prev = prev.next;

        prev.next = new Node(e, prev.next);
        size ++;
    }

    // 在链表头添加新的元素e
    public void addFirst(E e){
        add(0, e);
    }

    // 在链表末尾添加新的元素e
    public void addLast(E e){
        add(size, e);
    }

    // 获得链表的第index(0-based)个位置的元素
    // 在链表中不是一个常用的操作，练习用：）
    public E get(int index){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Get failed. Illegal index.");

        Node cur = dummyHead.next;
        for(int i = 0 ; i < index ; i ++)
            cur = cur.next;
        return cur.e;
    }

    // 获得链表的第一个元素
    public E getFirst(){
        return get(0);
    }

    // 获得链表的最后一个元素
    public E getLast(){
        return get(size - 1);
    }

    // 修改链表的第index(0-based)个位置的元素为e
    // 在链表中不是一个常用的操作，练习用：）
    public void set(int index, E e){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Update failed. Illegal index.");

        Node cur = dummyHead.next;
        for(int i = 0 ; i < index ; i ++)
            cur = cur.next;
        cur.e = e;
    }

    // 查找链表中是否有元素e
    public boolean contains(E e){
        Node cur = dummyHead.next;
        while(cur != null){
            if(cur.e.equals(e))
                return true;
            cur = cur.next;
        }
        return false;
    }

    // 从链表中删除index(0-based)位置的元素, 返回删除的元素
    // 在链表中不是一个常用的操作，练习用：）
    public E remove(int index){
        if(index < 0 || index >= size)
            throw new IllegalArgumentException("Remove failed. Index is illegal.");

        // E ret = findNode(index).e; // 两次遍历
        Node prev = dummyHead;
        for(int i = 0 ; i < index ; i ++)
            prev = prev.next;

        Node retNode = prev.next;
        prev.next = retNode.next;
        retNode.next = null;
        size --;

        return retNode.e;
    }

    // 从链表中删除第一个元素, 返回删除的元素
    public E removeFirst(){
        return remove(0);
    }

    // 从链表中删除最后一个元素, 返回删除的元素
    public E removeLast(){
        return remove(size - 1);
    }

    // 从链表中删除元素e
    public void removeElement(E e){
        Node prev = dummyHead;
        while(prev.next != null){
            if(prev.next.e.equals(e))
                break;
            prev = prev.next;
        }

        if(prev.next != null){
            Node delNode = prev.next;
            prev.next = delNode.next;
            delNode.next = null;
            size --;
        }
    }
}
```

1-3-2、链表实现队列和栈

```java
// 1.链表实现队列
public class LinkedListQueue<E> implements Queue<E> {
    private class Node{
        public E e;
        public Node next;
        public Node(E e, Node next){
            this.e = e;
            this.next = next;
        }
        public Node(E e){
            this(e, null);
        }
        public Node(){
            this(null, null);
        }
        @Override
        public String toString(){
            return e.toString();
        }
    }

    private Node head, tail;
    private int size;

    public LinkedListQueue(){
        head = null;
        tail = null;
        size = 0;
    }

    @Override
    public int getSize(){
        return size;
    }

    @Override
    public boolean isEmpty(){
        return size == 0;
    }

    @Override
    public void enqueue(E e){
        if(tail == null){
            tail = new Node(e);
            head = tail;
        }
        else{
            tail.next = new Node(e);
            tail = tail.next;
        }
        size ++;
    }

    @Override
    public E dequeue(){
        if(isEmpty())
            throw new IllegalArgumentException("Cannot dequeue from an empty queue.");

        Node retNode = head;
        head = head.next;
        retNode.next = null;
        if(head == null)
            tail = null;
        size --;
        return retNode.e;
    }

    @Override
    public E getFront(){
        if(isEmpty())
            throw new IllegalArgumentException("Queue is empty.");
        return head.e;
    }
}


// 2.链表实现栈
public class LinkedListStack<E> implements Stack<E> {
    private LinkedList<E> list;

    public LinkedListStack(){
        list = new LinkedList<>();
    }
    @Override
    public int getSize(){
        return list.getSize();
    }
    @Override
    public boolean isEmpty(){
        return list.isEmpty();
    }
    @Override
    public void push(E e){
        list.addFirst(e);
    }

    @Override
    public E pop(){
        return list.removeFirst();
    }
    @Override
    public E peek(){
        return list.getFirst();
    }
}
```



#### 1-4、Js实现

1-4-1、按上述  Java 形式的 Js 实现

```javascript
// 1.基本实现1
class Node {
  constructor(element, next) {
    this.element = element ? element : null;
    this.next = next ? next : null;
  }
}

class LinkedList {
  constructor() {
    this.dummyHead = new Node();
    this.size = 0;
  }

  // 获取链表中元素个数
  getSize() {
    return this.size;
  }

  // 返回链表是否为空
  isEmpty() {
    return this.size === 0;
  }

  // 在链表 index 位置添加元素 element
  // 注意: 此非链表常用操作
  add(index, element) {
    if (index < 0 || index > this.size) {
      throw new Error('Add failed. Illegal index.');
    }

    // 获取头虚拟节点
    var prev = this.dummyHead;
    for(var i = 0; i < index; i++) {
      // 取得 index 位置上的 node 节点
      prev = prev.next;
    }
    prev.next = new Node(element, prev.next);
    this.size++;
  }

  // 链表头部添加元素
  addFirst(element) {
    this.add(0, element);
  }

  // 填表尾部添加元素
  addLast(element) {
    this.add(this.size, element);
  }

  // 获取链表 index 个位置的元素
  // 注意: 此非链表常用操作
  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('Get failed. Illegal index.');
    }
    
    var cur = this.dummyHead.next;
    for(var i = 0; i < index; i++) {
      cur = cur.next;
    }
    return cur.element;
  }

  // 获取链表头部元素
  getFirst() {
    this.get(0);
  }

  // 获取链表尾部元素
  getLast() {
    this.get(this.size - 1);
  }

  // 设置链表 index 个位置的元素
  // 注意: 此非链表常用操作
  set(index, element) {
    if (index < 0 || index >= this.size) {
      throw new Error('Update failed. Illegal index.');
    }

    var cur = this.dummyHead.next;
    for(var i = 0; i < index; i++) {
      cur = cur.next;
    }
    cur.element = element;
  }

  // 查找链表中是否有元素 element
  contains(element) {
    var cur = this.dummyHead.next;
    while(cur !== null) {
      if(cur.element === element) {
        return true;
      }
      cur = cur.next;
    }
    return false;
  }

  // 从链表删除 index 位置的元素并返回
  // 注意: 此非链表常用操作
  remove(index, element) {
    if (index < 0 || index >= this.size) {
      throw new Error('Remove failed. Illegal index.');
    }

    var prev = this.dummyHead;
    for(var i = 0; i < index; i++) {
      prev = prev.next;
    }
    var retNode = prev.next;
    prev.next = retNode.next;
    retNode.next = null;
    this.size--;

    return retNode.element;
  }

  // 删除链表头部元素
  removeFirst() {
    return this.remove(0);
  }

  // 删除链表尾部元素
  removeLast() {
    return this.remove(this.size - 1);
  }

  // 从链表中删除元素 element
  removeElement(element) {
    var prev = this.dummyHead;
    while(prev.next !== null) {
      if(prev.next.element === element) {
        break;
      }
      prev = prev.next;
    }

    if(prev.next !== null) {
      var delNodde = prev.next;
      prev.next = delNodde.next;
      delNodde.next = null;
      this.size--;
    }
  }
}
```



1-4-2、基本实现

```javascript
function defaultEquals(a, b) {
  return a === b;
}

class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}
class DoublyNode extends Node {
  constructor(element, next, prev) {
    super(element, next);
    this.prev = prev;
  }
}

class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.equalsFn = equalsFn;
    this.count = 0;
    this.head = undefined;
  }
  push(element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      // catches null && undefined
      this.head = node;
    } else {
      current = this.head;
      while (current.next != null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count++;
  }
  getElementAt(index) {
    if (index >= 0 && index <= this.count) {
      let node = this.head;
      for (let i = 0; i < index && node != null; i++) {
        node = node.next;
      }
      return node;
    }
    return undefined;
  }
  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1);
        node.next = previous.next;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }
  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.size() && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.count;
  }
  getHead() {
    return this.head;
  }
  clear() {
    this.head = undefined;
    this.count = 0;
  }
  toString() {
    if (this.head == null) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
}
```



1-4-3、双向链表

```javascript
function defaultEquals(a, b) {
  return a === b;
}

class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}
class DoublyNode extends Node {
  constructor(element, next, prev) {
    super(element, next);
    this.prev = prev;
  }
}

class DoublyLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
    super(equalsFn);
    this.tail = undefined;
  }
  push(element) {
    const node = new DoublyNode(element);
    if (this.head == null) {
      this.head = node;
      this.tail = node; // NEW
    } else {
      // attach to the tail node // NEW
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.count++;
  }
  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode(element);
      let current = this.head;
      if (index === 0) {
        if (this.head == null) { // NEW
          this.head = node;
          this.tail = node; // NEW
        } else {
          node.next = this.head;
          this.head.prev = node; // NEW
          this.head = node;
        }
      } else if (index === this.count) { // last item NEW
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        node.next = current;
        previous.next = node;
        current.prev = node; // NEW
        node.prev = previous; // NEW
      }
      this.count++;
      return true;
    }
    return false;
  }
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = this.head.next;
        // if there is only one item, then we update tail as well //NEW
        if (this.count === 1) {
          // {2}
          this.tail = undefined;
        } else {
          this.head.prev = undefined;
        }
      } else if (index === this.count - 1) {
        // last item //NEW
        current = this.tail;
        this.tail = current.prev;
        this.tail.next = undefined;
      } else {
        current = this.getElementAt(index);
        const previous = current.prev;
        // link previous with current's next - skip it to remove
        previous.next = current.next;
        current.next.prev = previous; // NEW
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
  indexOf(element) {
    let current = this.head;
    let index = 0;
    while (current != null) {
      if (this.equalsFn(element, current.element)) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.tail;
  }
  clear() {
    super.clear();
    this.tail = undefined;
  }
  toString() {
    if (this.head == null) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    while (current != null) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
  inverseToString() {
    if (this.tail == null) {
      return '';
    }
    let objString = `${this.tail.element}`;
    let previous = this.tail.prev;
    while (previous != null) {
      objString = `${objString},${previous.element}`;
      previous = previous.prev;
    }
    return objString;
  }
}
```

1-4-4、循环链表

```javascript
function defaultEquals(a, b) {
  return a === b;
}

class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

class CircularLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
    super(equalsFn);
  }
  push(element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      this.head = node;
    } else {
      current = this.getElementAt(this.size() - 1);
      current.next = node;
    }
    // set node.next to head - to have circular list
    node.next = this.head;
    this.count++;
  }
  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      let current = this.head;
      if (index === 0) {
        if (this.head == null) {
          // if no node  in list
          this.head = node;
          node.next = this.head;
        } else {
          node.next = current;
          current = this.getElementAt(this.size());
          // update last element
          this.head = node;
          current.next = this.head;
        }
      } else {
        const previous = this.getElementAt(index - 1);
        node.next = previous.next;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        if (this.size() === 1) {
          this.head = undefined;
        } else {
          const removed = this.head;
          current = this.getElementAt(this.size() - 1);
          this.head = this.head.next;
          current.next = this.head;
          current = removed;
        }
      } else {
        // no need to update last element for circular list
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
}
```





### 二、LeedCode

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5e5b4698f265da5749474beb

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cea46d451882504fc0a6351

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cf4c68b6fb9a07eaf2b7b44

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-22



#### 2-1、类型

- ##### 基本应用

- ##### 环形链表

- ##### 双向指针

- ##### 双向链表



##### 2-1、基本应用

##### 2-1-1、打印链表结点(从尾结点开始)

输入一个链表(即给你头结点)，按链表值从尾到头的顺序返回一个`ArrayList`

```javascript
/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function printListFromTailToHead(head)
{
    const array = [];
    while(head){
        array.unshift(head.val);
        head = head.next;
    }
    return array;
}

// 思路:
// 遍历链链表即不断找到当前节点的 next 结点，当 next 结点为 null 则说明此乃最后一个结点，停止遍历；而因为是从尾到头的顺序，可使用JS 数组来存储打印结果，每次从队列头部插入
```



##### 2-1-2、删除链表中的结点

给定单链表的头指针和要删除的指针节点，在O(1)时间内删除该节点；

```javascript
var deleteNode = function (head, node) {
  // 1、删除的节点不是尾部节点 - 将next节点覆盖当前节点
  if (node.next) {
    node.val = node.next.val;
    node.next = node.next.next;
  // 2、删除的节点是尾部节点且等于头节点，只剩一个节点 - 将头节点置为null
  } else if (node === head) {
    node = null;
    head = null;
  // 3、删除的节点是尾节点且前面还有节点 - 遍历到末尾的前一个节点删除
  } else {
    node = head;
    // 遍历直至尾结点的前一结点，尾结点.next = null
    while (node.next.next) {
      node = node.next;
    }
    // 尾结点的上一结点.next = null 即可将尾结点删除
    node.next = null;
    // 疑问: 此时尾结点的上一结点已经成了尾结点了呀，为何还要置 null ?
    node = null;
  }
  return node;
};

// 思路:
// 删除操作中，当知道被删结点即可操作，
// 前两种情况时间复杂度是 O(1) 第三种情况时间复杂度是 O(n)，且这种情况只会出现1/n次，所以算法时间复杂度是O(1)
```



##### 2-1-3、删除链表中重复结点

```javascript
// 若链表无序
function deleteDuplication(pHead) {
  const map = {};
  if (pHead && pHead.next) {
    let current = pHead;
    // 计数
    while (current) {
      const val = map[current.val];
      map[current.val] = val ? val + 1 : 1;
      current = current.next;
    }
    current = pHead;
    while (current) {
      const val = map[current.val];
      if (val > 1) {
        // 删除节点
        console.log(val);
        if (current.next) {
          current.val = current.next.val;
          current.next = current.next.next;
        } else if (current === pHead) {
          current = null;
          pHead = null;
        } else {
          current = pHead;
          while (current.next.next) {
            current = current.next;
          }
          current.next = null;
          current = null;
        }

      } else {
        current = current.next;
      }
    }
  }
  return pHead;
}

// 思路:
// 用 map 存储每个结点出现的次数，并删除出现次数大于1的结点，时间复杂度：O(n)，空间复杂度：O(n)


// 若链表有序
function deleteDuplication(pHead) {
  // 1、当前结点或当前结点的next为空，返回该结点
  if (!pHead || !pHead.next) {
    return pHead;
  // 2、当前结点是重复结点：找到后面第一个不重复的结点
  } else if (pHead.val === pHead.next.val) {
    let tempNode = pHead.next;
    while (tempNode && pHead.val === tempNode.val) {
      tempNode = tempNode.next;
    }
    return deleteDuplication(tempNode);
  // 3、当前结点不重复：将当前的结点的next赋值为下一个不重复的结点
  } else {
    pHead.next = deleteDuplication(pHead.next);
    return pHead;
  }
}

// 思路:
// 上述方式时间复杂度：O(n)、空间复杂度：O(1)
// 运用迭代思想，处理好边界问题，很多模式均为: 迭代 + 边界问题的处理
```



##### 2-1-4、反转链表

输入一个链表，反转链表后，输出新链表的表头

```javascript
// H -> A -> B -> C -> D 反转为 
// D -> C -> B -> A -> H

var reverseList = function (head) {
  let currentNode = null;
  // 1、缓存头结点为: headNode
  let headNode = head;
  while (head && head.next) {
    // 2、缓存头结点的下一结点为: currentNode
    // H -> A -> B -> C -> D
    // cacheNode = currentNode = A
    currentNode = head.next;
    
    // 2、更改头结点的下一结点 A 为: A 的下一结点 B (即删除 A 结点)
    // H -> B -> C -> D
    // cacheNode = currentNode = A
    head.next = currentNode.next;
    
    // 3、将游离结点 A 重新固定，固定到头结点前面，注意此时使用的是缓存值，如此语义更清晰
    // A - H -> B -> C -> D
    currentNode.next = headNode;
    // 4、更新缓存点为: 新的头结点 A, 即 currentNode 开始新一轮的迭代过程
    headNode = currentNode;
  }
  return headNode;
};

// 思路:
// 以链表的头部结点为基准点，先将基准点的下一个结点从链表剥离，然后将头结点则下一结点的下一结点连接，然后将剥离出的结点挪到头部作为头结点，最后当基准结点的 next 为 null，则其已经成为最后一个结点，此时链表已经反转完成
```



##### 2-1-5、[复杂链表的复制]([http://www.conardli.top/docs/dataStructure/%E9%93%BE%E8%A1%A8/%E5%A4%8D%E6%9D%82%E9%93%BE%E8%A1%A8%E7%9A%84%E5%A4%8D%E5%88%B6.html#%E9%A2%98%E7%9B%AE](http://www.conardli.top/docs/dataStructure/链表/复杂链表的复制.html#题目))

输入一个复杂链表(每结点中有结点值、以及2个指针：一个指向下一个结点，另一个指针则指向任意一个结点)，返回结果为：复制后的复杂链表的 head；





##### 2-2、环形链表

##### 2-2-1、[寻找链表环入口]([http://www.conardli.top/docs/dataStructure/%E9%93%BE%E8%A1%A8/%E9%93%BE%E8%A1%A8%E4%B8%AD%E7%8E%AF%E7%9A%84%E5%85%A5%E5%8F%A3%E8%8A%82%E7%82%B9.html#%E9%A2%98%E7%9B%AE](http://www.conardli.top/docs/dataStructure/链表/链表中环的入口节点.html#题目))

给一个链表，若其中包含环，请找出该链表的环的入口结点，否则，输出null

##### 2-2-2、[约瑟夫环]([http://www.conardli.top/docs/dataStructure/%E9%93%BE%E8%A1%A8/%E5%9C%88%E5%9C%88%E4%B8%AD%E6%9C%80%E5%90%8E%E5%89%A9%E4%B8%8B%E7%9A%84%E6%95%B0%E5%AD%97.html#%E9%A2%98%E7%9B%AE](http://www.conardli.top/docs/dataStructure/链表/圈圈中最后剩下的数字.html#题目))



##### 2-3、双向指针

##### 2-4、双向链表