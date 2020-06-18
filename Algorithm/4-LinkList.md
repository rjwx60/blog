---
typora-root-url: ../Source
---

### 一、基本

#### 1-1、定义

 	**链表**(LinkList)，是由一组节点组成的线性集合数据结构，每个节点由数据和到序列中下一个节点的引用(指针/链接)组成。最简单的链表允许在迭代期间有效地从序列中的任何位置插入或删除元素。更复杂的变体链表能添加额外的链接，并允许有效地插入或删除任意元素引用。注意链表不像数组，其中的元素在内存中并非连续存放；

<img src="/Image/Algorithm/LinkList/1.png" style="zoom:50%;" />

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