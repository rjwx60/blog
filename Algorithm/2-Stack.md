---
typora-root-url: ../Source
---

### 一、基本

#### 1-1、定义

​	**栈**(Stack)，是限定仅在表尾进行插入和删除操作的线性表。主要有两种操作：`push` 添加元素到栈的顶端(末尾)，`pop` 移除栈最顶端(末尾)的元素，此外应有一个 `peek` 操作用于访问栈当前顶端(末尾)的元素，栈是后进先出(LIFO = last in, first out)的线性表数据结构；

- 补充：若使用数组实现的栈，则叫顺序栈，用链表实现的栈，则叫作链式栈；

<img src="/Image/Algorithm/Stack/1.png" style="zoom:40%;" align="left"/>

补充：内存中的堆栈和数据结构堆栈不是一个概念，可以说内存中的堆栈是真实存在的物理区，数据结构中的堆栈是抽象的数据存储结构。内存空间在逻辑上分为三部分：代码区、静态数据区、动态数据区，动态数据区又分为栈区和堆区。

- 代码区：存储方法体的二进制代码；高级调度(作业调度)、中级调度(内存调度)、低级调度(进程调度)控制代码区执行代码的切换；
- 静态数据区：存储全局变量、静态变量、常量(final修饰的常量和String常量)；由系统自动分配和回收；
- 动态数据区：
  - 栈区：存储运行方法的形参、局部变量、返回值；由系统自动分配和回收；
  - 堆区：new一个对象的引用或地址存储在栈区，指向该对象存储在堆区中的真实数据；



#### 1-2、特点

1-2-1、时间复杂度

​	入栈出栈均为O(1)；

1-2-2、应用

- A：表达式求值：一个保存操作数的栈，另一个是保存运算符的栈。我们从左向右遍历表达式，当遇到数字，我们就直接压入操作数栈；当遇到运算符，就与运算符栈的栈顶元素进行比较。如果比运算符栈顶元素的优先级高，就将当前运算符压入栈；如果比运算符栈顶元素的优先级低或者相同，从运算符栈中取栈顶运算符，从操作数栈的栈顶取 2 个操作数，然后进行计算，再把计算完的结果压入操作数栈，继续比较；

  - <img src="/Image/Algorithm/Stack/2.png" style="zoom:50%;" align="left"/>

- B：函数调用栈-略

- C：括号的匹配-略

- D：进制的转换

  - ```javascript
    const Stack  = (function() {
      const items = new WeakMap();
      class Stack {
        constructor() {
          // 以 this 为键，将代表栈的数组存入 items
          items.set(this, []);
        }
        push(element)  {
          items.get(this).push(element);
        }
        pop() {
          return items.get(this).pop();
        }
        isEmpty() {
          return items.get(this).length === 0;
        }
        // else function  
      };
      return Stack;
    })();
    
    
    function baseConverter(decNumber, base){
      var remStack = new Stack();
      var rem = null, baseString = '', digits = '0123456789ABCDEEF';
      
      while(decNumber > 0) {
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
      }
    
      while (!remStack.isEmpty()) {
        baseString += digits[remStack.pop()];
      }
    
      return baseString;
    }
    
    console.log(baseConverter(100345, 2));
    // 11000011111111001
    console.log(baseConverter(100345, 8));
    // 303771
    console.log(baseConverter(100345, 16));
    // 187E9
    ```

    



#### 1-3、Java栈实现

```java
// 1.基本实现-基于数组实现的顺序栈
public class ArrayStack {
  private String[] items;  // 数组
  private int count;       // 栈中元素个数
  private int n;           // 栈的大小

  // 初始化数组，申请一个大小为n的数组空间
  public ArrayStack(int n) {
    this.items = new String[n];
    this.n = n;
    this.count = 0;
  }

  // 入栈操作
  public boolean push(String item) {
    // 数组空间不够了，直接返回false，入栈失败。
    if (count == n) return false;
    // 将item放到下标为count的位置，并且count加一
    items[count] = item;
    ++count;
    return true;
  }
  
  // 出栈操作
  public String pop() {
    // 栈为空，则直接返回null
    if (count == 0) return null;
    // 返回下标为count-1的数组元素，并且栈中元素个数count减一
    String tmp = items[count-1];
    --count;
    return tmp;
  }
}

// 2.支持动态扩容的栈
public class ArrayStack<E> implements Stack<E> {
    private Array<E> array;

    public ArrayStack(int capacity){
        array = new Array<>(capacity);
    }

    public ArrayStack(){
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
    public void push(E e){
        array.addLast(e);
    }

    @Override
    public E pop(){
        return array.removeLast();
    }

    @Override
    public E peek(){
        return array.getLast();
    }
}
```

#### 1-4、Js栈实现

```javascript
class StackJs {
  constructor() {
    this.stack = new ArrayJs();
  }

  // 时间复杂度: O(1)
  getSize() {
    return this.stack.getSize();
  }

  // 时间复杂度: O(1)
  isEmpty() {
    return this.stack.isEmpty();
  }

  getCapacity() {
    return this.stack.getCapacity();
  }

  // 时间复杂度: O(1) 均摊
  // 入栈操作
  push(element) {
    this.stack.addLast(element);
  }

  // 时间复杂度: O(1) 均摊
  // 出栈操作
  pop() {
    return this.stack.removeLast();
  }

  // 时间复杂度: O(1)
  // 获取栈顶元素
  peek() {
    return this.stack.getLast();
  }
}
```



### 二、LeedCode示例

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-32

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cf4c699f265da1bc23f6252

补充：https://juejin.im/book/5cb42609f265da035f6fcb65/section/5cea46f55188253a275a3a04



#### 2-1、题目

##### 2-1-1、栈实现队列

用两个栈来实现一个队列，完成队列的Push和Pop操作；

```javascript
const stack1 = [];
const stack2 = [];

function push(node)
{
    stack1.push(node);
}
function pop()
{
    if(stack2.length === 0){
       while(stack1.length>0){
        stack2.push(stack1.pop());
       }
    }
    return stack2.pop() || null;
}

// 思路:
// 用栈1入栈实现队列的 push 操作, 而当队列 pop 时，先将栈1所有数据拿出并放入栈2，栈2再排出
```

<img src="/Image/Algorithm/Stack/3.png" style="zoom:50%;" align=""/>





##### 2-1-2、队列实现栈

用两个队列实现栈，完成栈的Push和Pop操作；

```javascript
const queue1 = []
const queue2 = []

function push(x) {
  if (queue1.length === 0) {
    queue1.push(x)
		
    // push 的时候完成位置的逆序
    while (queue2.length) {
      queue1.push(queue2.shift())
    }
  } else if (queue2.length === 0) {
    queue2.push(x)

    while (queue1.length) {
      queue2.push(queue1.shift())
    }
  }
};

function pop() {
  if (queue1.length !== 0) {
    return queue1.shift()
  } else {
    return queue2.shift()
  }
};

// 思路:
// 关键在 push 时完成元素的逆序，因为队列先进先出，只有逆序后才能实现栈的先进后出
// 每次只将元素 push 到空队列中，随后才将另一队列元素加入，如此实现先入元素后放，实现逆序
```



##### 2-1-3、包含 min 函数的栈

定义栈的数据结构，请在该类型中实现一个能够得到栈中所含最小元素的min函数（时间复杂度应为O（1））

```javascript
var dataStack = [];
var minStack = [];
 
function push(node)
{
    dataStack.push(node);
    if(minStack.length === 0 ||  node < min()){
        minStack.push(node);
    }else{
        minStack.push(min());
    }
}
function pop()
{
    minStack.pop();
    return dataStack.pop();
}
function top()
{
    var length = dataStack.length;
    return length>0&&dataStack[length-1]
}
function min()
{
    var length = minStack.length;
    return length>0&&minStack[length-1]
}

// 思路:
// 关键在于要求复杂度为 O(1), 栈的操作中只有 push 和 pop 复杂度为1, 由此确定大致方向, 更由此推断 min 值应存放在栈顶
// 1.定义两个栈，一个栈用于存储数据，另一个栈用于存储每次数据进栈时栈的最小值.
// 2.每次数据进栈时，将此数据和最小值栈的栈顶元素比较，将二者比较的较小值再次存入最小值栈.
// 3.数据栈出栈，最小值栈也出栈。
```



##### 2-1-4、滑动窗口最大值

给定一个数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口 k 内的数字。滑动窗口每次只向右移动一位。 返回滑动窗口最大值，具体如下：详见：[链接](http://www.conardli.top/docs/dataStructure/栈和队列/滑动窗口的最大值.html#思路)

```
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 

  滑动窗口位置                  最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```





##### 2-1-5、[栈的压入弹出序列](http://www.conardli.top/docs/dataStructure/栈和队列/栈的压入弹出序列.html#栈的压入、弹出序列)

##### 2-1-6、[接雨水](https://leetcode-cn.com/problems/trapping-rain-water/)

##### 2-1-7、棒球比赛—详见0682题

##### 2-1-8、最大矩形—详见00题