---
typora-root-url: ../../../BlogImgsBed/Source
---

### 一、基本

#### 1-1、定义

**树**(*Tree*)，是 n(n ≥ 0) 个结点的有限集。n=0 时称为空树。在任意一课非空树中：

- 有且仅有一个特定的、称为根(Root)的节点；
- 当 n ＞ 1 时，其余结点可分为 m(m ＞ 0) 个互不相交的有限集 T1、T2、...、Tm，其中每个集合本身又是一棵树，并且称为根到的子树(SubTree)；
  - 注意：n ＞ 0 时，根节点是唯一的，不可能存在多个根节点；
  - 注意：m ＞ 0 时，子树的个数没有限制，但它们一定互不相交；

<img src="/Image/Algorithm/Tree/1.png" style="zoom:50%;" />

#### 1-2、相关概念

##### 1-2-1、结点分类

​	树的结点包含一个数据元素及若干指向其子树的分支。结点拥有的子树数称为结点的度 (Degree)。度为 0 的结a点称为叶结点 (Leaf)或终端结点；度不为 0 的结点称为非终端结点或分支结点。除根结点之外，分支结点也称为内部结点。树的度是树内各结点的度的最大值。下图该树结点的度的最大值是结点D的度为3，故整棵树的度也为3。

<img src="/Image/Algorithm/Tree/2.png" style="zoom:30%;" />

##### 1-2-2、树的深度(高度)

​	结点层次从根开始定义，根为第一层，根的孩子为第二层。树中结点的最大层次称为树的深度或高度；

##### 1-2-3、其他概念

- 森林：是 m 棵互不相交的树的集合；
- 有序/无序树：树中结点各子树从左到右有次序、不能互换，则称有序树，否则无序树；

#### 1-3、树的抽象数据类型



### 二、种类

#### 2-1、二叉树-Binary Tree

二叉树是 n 个结点的有限集合，该集合或为空集(空二叉树)，或由一个根结点和两棵互不相交的、分别称为根结点的左子树和右子树的二叉树组成；

##### 2-1-1、特点

- 每结点最少没有子树最多两棵子树，故二叉树中不存在度 > 2 的结点；
- 左子树和右子树有顺序，次序不能任意颠倒；
- 即使某结点只有一棵子树，也要区分左子树和右子树；

##### 2-1-2、形态

- 空二叉树
- 只有一个根结点
- 根结点只有左子树；
- 根结点只有右子树；
- 根结点既有左子树又有右子树；



##### 2-1-3、特殊二叉树

##### 2-1-3-1、斜树

即所有结点均只有左子树的二叉树(左斜树)，或所有结点均只有右子树的二叉树(右斜树)的二叉树统称；

##### 2-1-3-2、满二叉树

即一棵所有分支结点均存在左右子树，且所有叶子均在同一层上的二叉树；故有如下特征：

- 叶子结点只能出现在最底层；
- 非叶子结点的度一定为2；
- 同样深度的二叉树中，属满二叉树结点个数最多，叶子数最多；

##### 2-1-3-3、完全二叉树

对一棵具有 n 个结点的二叉树按层序编号，若编号为 i (1≤ i ≤ n) 的结点，与同样深度的满二叉树中编号为 i 的结点在二叉树中的位置完全相同，则称此二叉树为完全二叉树；满二叉树是完全二叉树，但完全二叉树不一定是满二叉树；可简易理解为完全二叉树是尾部连续缺失结点的满二叉树；完全二叉树有如下特征：

- 叶子结点只能出现在最下2层；
- 最下层的叶子结点一定集中在左部连续位置；
- 倒数二层，若有叶子结点，则一定都在右部连续区域；
- 若结点度为1，则该结点只有左孩子，即不存在只有右子树的情况；
- 同样结点数的二叉树，完全二叉树的深度最小；



##### 2-1-4、性质

- 性质1：在二叉树的第 i 层至多有 `2^(i - 1) (i≥1)` 个结点；比如 1层1，2层2，3层4，4层8..；
- 性质2：深度为 k 的二叉树至多有 `2^k (k≥1) - 1` 个结点；比如 1层共1，2层共3，3层共7，4层共15...；
- 性质3：对任意一棵二叉树 T，若其叶子结点数(亦称终端结点)为 n0，度为2的结点数为 n2，则 n0 = n2 + 1；

<img src="/Image/Algorithm/Tree/3.png" style="zoom:50%;" />

- 性质4：具有 n 个结点的完全二叉树的深度为 `[log2N] + 1`；([x]表示不大于 x 的最大整数)；
- 性质5：若对一棵有 n 个结点的完全二叉树的结点按层序编号(从1层到第[log2N]+1层)，则对任一结点 i 有：
  - 若 i = 1，则结点 i 是二叉树的根，无双亲；若 i > 1，则其双亲是结点 [i/2]；
  - 若 2i > n，则结点 i 无左孩子；否则其左孩子是结点 2i；
  - 若 2i + 1 >  n，则结点 i 无右孩子；否则其右孩子是结点 2i + 1；

<img src="/Image/Algorithm/Tree/4.png" style="zoom:50%;" />

