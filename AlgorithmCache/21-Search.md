---
typora-root-url: ../../BlogImgsBed/Source
---



### 一、查找

查找是计算机中最基本也是最有用的算法之一。 它描述了在有序集合中搜索特定值的过程；

#### 1-1、二分查找-BinarySearch

二分查找维护查找空间的左、右和中间指示符，并比较查找目标或将查找条件应用于集合的中间值；如果条件不满足或值不相等，则清除目标不可能存在的那一半，并在剩下的一半上继续查找，直到成功为止。如果查以空的一半结束，则无法满足条件，并且无法找到目标。

<img src="/Image/Algorithm/Search/1.png" style="zoom:50%;" />

- [二维数组查找](http://www.conardli.top/docs/algorithm/查找/二维数组查找.html)
- [旋转数组的最小数字](http://www.conardli.top/docs/algorithm/查找/旋转数组的最小数字.html#题目)
- [在排序数组中查找数字](http://www.conardli.top/docs/dataStructure/数组/在排序数组中查找数字.html)
- [x 的平方根](https://leetcode-cn.com/problems/sqrtx/?utm_source=LCUS&utm_medium=ip_redirect_q_uns&utm_campaign=transfer2china)
- [猜数字大小](https://leetcode-cn.com/problems/guess-number-higher-or-lower/)



#### 1-2、BFS

广度优先搜索，是一种遍历或搜索数据结构(比如树或图)的算法，也可在更抽象的场景中使用；其特点是：越是接近根结点的结点将越早地遍历；比如，可使用 BFS 找到从起始结点到目标结点的路径，特别是最短路径；注意：BFS 中，结点的处理顺序，与它们添加到队列的顺序是完全相同的顺序，即先进先出，故广度优先搜索一般使用队列实现；

<img src="/Image/Algorithm/Search/2.png" style="zoom:50%;" />

- [从上到下打印二叉树](http://www.conardli.top/docs/dataStructure/二叉树/从上到下打印二叉树.html)
- [单词接龙](https://leetcode-cn.com/problems/word-ladder/)
- [员工的重要性](https://leetcode-cn.com/problems/employee-importance/)
- [岛屿数量](https://leetcode-cn.com/problems/number-of-islands/)



#### 1-3、DFS

深度优先搜索，是一种遍历或搜索数据结构(比如树或图)的算法，也可在更抽象的场景中使用；但与 BFS 不同，更早访问的结点可能不是更靠近根结点的结点。因此在 DFS 中找到的第一条路径<u>可能不是</u>最短路径；DFS中，结点的处理顺序，是完全相反的顺序，就像它们被添加到栈中一样，是后进先出，故深度优先搜索一般使用栈实现；

<img src="/Image/Algorithm/Search/2.png" style="zoom:50%;" />

- [二叉树的中序遍历](http://www.conardli.top/docs/dataStructure/二叉树/二叉树的中序遍历.html)
- [二叉树的最大深度](http://www.conardli.top/docs/dataStructure/二叉树/二叉树的最大深度.html)
- [路径总和](https://leetcode-cn.com/problems/path-sum/)
- [课程表](https://leetcode-cn.com/problems/course-schedule/)
- [岛屿数量](https://leetcode-cn.com/problems/number-of-islands/)