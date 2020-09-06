---
typora-root-url: ../../BlogImgsBed/Source
---

### 一、基本

#### 1-1、定义

​	**哈希表/散列表**(HashTable/HashMap)，是一种实现 *关联数组(associative array)* 的抽象数据类型, 该结构可以将 *键映射到值*；

哈希表使用 *哈希函数/散列函数* 来计算一个值，在数组/桶(buckets)/槽(slots)中对应的索引，并可使用该索引找到所需的值；理想情况下,散列函数将为每个键分配给一个唯一的桶(bucket)，但是大多数哈希表设计时，采用不完美的散列函数，这可能会导致"哈希冲突(hash collisions)"，也即散列函数为多个键(key)生成了相同的索引，这种碰撞须以某种方式进行处理；

<img src="/Image/Algorithm/HashMap/1.png" style="zoom:50%;" align="center"/>

通过单独的链接解决哈希冲突：

<img src="/Image/Algorithm/HashMap/2.png" style="zoom:50%;" align="center"/>

#### 1-2、特点

##### 1-2-1、时间复杂度

##### 1-2-2、应用

##### 1-2-3、场景

​	适用于模拟映射关系、防止重复、缓存数据；

#### 1-3、Java实现

#### 1-4、Js实现

### 二、LeedCode

补充：https://juejin.im/post/5d5b307b5188253da24d3cd1#heading-33