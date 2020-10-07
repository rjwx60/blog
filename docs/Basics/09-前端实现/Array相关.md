# 一、数组基本

unshift、shift、pop、push、splice、sort、reverse

concat、join、

indexOf、lastIndexOf、find、findIndex、includes

forEach、map、filter、some、every、reduce、reduceeRight

slice、fill



## 1-1、数组基本

### 1-1-1、定义

数组是索引，到任意值，的映射，映射的范围称为数组元素；



### 1-1-2、创建

构造法创建数组时：new Array 和 Array 调用相同，等同于直接量 []；

- 使用 Array 构建时，数字会被认为是数组的长度；字符串才会被认为是数组的元素；
- 普通构建时，用负数或非整数来索引数组时，数值将被先转为字符串，然后通过字符串来索引；非负整数的字符串被转为数字，范围是 [ 0, 2^32 -1 )，故数组最大长度是 2^32 -1(真的是这样嘛)；而范围以外的索引被视为普通的属性键(字符串)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152310.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152311.png" alt="img" style="zoom:67%;" />

### 1-1-3、索引

数组的索引，仅仅是对象属性名的一种特殊类型；





### 1-1-4、空缺数组

即数组不连续：数组索引个数 < 数组长度；

- 注意现代引擎会自动去除空缺优化数组，并连续存储元素；
- 注意：空缺数组，有重复的逗号时，最后的逗号会被忽略，图1：
- 注意：读取空缺会返回 undefined，但与读取真的值不同，前者无值赋予 undefined，后者有值为 undefined，图2；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152305.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152306.png" alt="img" style="zoom:67%;" />

 

- 提示：forEach、every、some、for-in 会跳过处理空缺
- 提示：join 把空缺、undefined、null转为空字符串，图1；
- 提示：sort 会保留空缺，图2；
- 提示：可利用 filter 去除空缺，图3；
- 提示：可利用 result[i] = arr[i] 将空缺转换为 undefined；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152307.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152308.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152309.png" alt="img" style="zoom:67%;" />

 

 

 

### 1-1-5、操作符

- delete 操作符能删除对象属性，也能删除数组元素，只是删除元素会产生空缺，不改变原有 length，图1；
- in 操作符可检查对象是否存在某个属性，亦可检查数组某<<索引>>上是否存在值(是否非空缺)，图2；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152312.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152313.png" alt="img" style="zoom:67%;" />



### 1-1-6、判定

- Object.prototype.toString.call(arg) === '[object Array]';
- Array.isArray()
- typeof、instanceof (有隐患—被修改后会错误)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152314.png" alt="img" style="zoom:67%;" />

### 1-1-7、长度

数组长度，表示数组总的元素个数(含空缺)，而非属性；可读可写，可利用此控制元素增减；

将数组长度设为0，可将数组置空，但性能比直接赋空值的略差，还会影响引用此值的对象(置空不会)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152315.png" alt="img" style="zoom:67%;" />

 

### 1-1-8、万能数组

可作为普通数组使用、可作为栈使用、可作为队列使用、可作为哈希表使用

JS Array有两种模式：快速模式使用索引定位，慢速使用哈希查找，[详看此文Greate](http://www.cnblogs.com/yincheng/p/chrome-js-array.html )

- push：使用汇编实现(C++中嵌入汇编调用)，计算新容量，申请内存，整段拷贝，新元素放到 length 位置，并对 length 加1；
- pop：使用C++实现，获取值，调整容量，计算释放空间大小，标记空间，返回，GC回收；
- shift：判断是否为最开始，计算释放空间大小，标记，返回，GC回收；
- unshift：判断容量是否足够；
  - 若是则直接移动内存空间、传入、更新 length；
  - 否则扩展，然后将老元素移到新内存空间偏移为 unshift 元素个数的位置(用以存放新元素)；
- splice：同样，缩减或增加空间，随后进行容量调整和移动元素；
- join：JS实现，然后再用 wasm 打包成 native code，对于慢元素，会先经过排序处理，然后创建字符串数组连接；
- sort：当数组元素不超过10个使用插入排序，否则使用快速排序；

 

 

## 1-2、数组方法

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152317.png" alt="img" style="zoom:67%;" />

### 1-2-1、添加删除元素类

**<u>添加-删除——添加-删除：unshift-shift——pop-push</u>**

添加返回新长度，删除返回被删元素

队列先进先出；反向队列先进先出；栈后进先出

[关于 push](http://www.cnblogs.com/yincheng/p/chrome-js-array.html)：源码中用汇编实现 push(因操作常用)：在C++里面嵌入的汇编，目的是提高执行速度；

[关于 pop、shift、splice](http://www.cnblogs.com/yincheng/p/chrome-js-array.html)；



**<u>splice ( 索引，值的选择功能，项目1，…..，项目N )</u>** 

- splice ( 索引，假值，项目1，…..，项目N ) === 插入 ——>> 空数组；

- splice ( 索引，真值，项目1，…..，项目N ) === 删除 ——>> 被删元素组成数组；

- splice ( 索引，1，项目1，…..，项目N ) === 替换 ——>> 被替换元素组成数组；

- splice ( 索引，空，空 ) === 分割 ——>> 索引对应值起始往后的所有元素组成的数组；

- 注意：在索引对应值前插入；图1；

- 注意：在索引对应值前插入；

- 注意：无参数3，只有删除功能；有参数3，原数组在删除后插入参数3内容(图略)；

- 注意：参数2会经过某些”转换”(完备的预处理机制，避免错误)

- 注意：若索引为负值，则先加 length 值转正值，而若转换后仍为负值，则置0；图3

  注意：索引为负的转换操作适用于任何情况；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152318.png" alt="img" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152319.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152318.png" alt="img" style="zoom:80%;" />

 

### 1-2-2、排序类

**<u>reverse()：操作原数组，返回倒序数组，略；</u>**

**<u>sort(cpFun?)：排序，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)</u>**，排序机制如下；

- 若 a < b，cpFun返回值 < 0，则位置前移（把数组中的 a，放到 b 前面)；
- 若 a = b，cpFun返回值 == 0，则位置不变
- 若 a > b，cpFun返回值 > 0，则位置后移（把数组中的 a，放到 b 后面)；

- 注意：默认根据字符串Unicode码点由小到大排序 (转为字符串后的第一个字符编码)；图1；
- 注意：不同浏览器会有不同效果，不一定准确，无法保证排序的时间和空间复杂性；
- 注意：直接返回值会有奇特的输出，图2-3；
- 注意：常用的使用，图4；
- 注意：貌似只会根据返回值的大于小于0的情况做决定，图5；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152321.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152322.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152323.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152324.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152325.png" alt="img" style="zoom:67%;" />

- 提示：较为准确的排序判断，图1-2；
- 提示：二维排序，图3；
- 提示：字符串排序：stringObject.localeCompare(target)，前者小于后者，返回负值；相反返回正值；相同返回0；图4-5；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152326.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152327.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152328.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152329.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152330.png" alt="img" style="zoom:67%;" />

 





### 1-2-3、合并切分连接类

**<u>array.concat(value1[, value2[, ...[, valueN]]])，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)</u>**

- 注意：concat 会对数组参数进行首层解构，无值数组将忽略，图1；
- 注意：解构出来的字符串和数字将，通过值复制，复制到新数组中；图2，而对象引用则将，通过引用复制，复制到新数组中；图3-4

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152331.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152332.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152333.png" alt="img" style="zoom:67%;" />

**<u>join [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join)</u>**：通过指定连接符(默认逗号)，处理数组或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)的所有元素，连接元素为字符串并返回；

- 注意：返回字符串，若数组为空，则直接返回空字符串
- 注意：null、undefined不处理：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152334.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152336.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152335.png" alt="img" style="zoom:67%;" />

 

 

### 1-2-4、查找类

<u>**indexOf (targetElement，startIndex=0)，lastIndexOf 略；[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)**</u>

- 注意：startIndex 默认为0：
  - 若大于数组长度直接返回-1 (可跟~搭配使用)；
  - 若小于0则进行加length处理，若处理后仍小于0，则直接设为0 (同splice)
- 注意：不传参即为匹配 undefined，indexOf 内部使用三等，无法判断 NaN、正负0；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152337.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152338.png" alt="img" style="zoom:67%;" />

**<u>find (callback [, thisArg]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)</u>**

返回 callback 返回值为真值 时索引对应的值

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152340.png" alt="img" style="zoom:67%;" />

点1：因为使用的是 while 循环，不会想之前的那些array方法用 in 排除空值，故这种寻找方法效率低于只遍历有值索引方法

点2：根据 callback 返回内容的真假来返回当前值，而不是返回 callback 的返回值，若没有返回，则恒返回 undefined

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152341.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152342.png" alt="img" style="zoom:67%;" />

**<u>findIndex(cb [, thisArg]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)</u>**

返回 callback 返回为真值 时对应的索引；



**<u>arr.includes (targetElement, fromIndex=0)，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)</u>**

返回布尔值，无法判断+0、-0，但可判断 NaN，判断空值为 undefined：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152346.png" alt="img" style="zoom:67%;" />

点1：对 fromIndex 与 index 方法的不同，前者是图1，后者是图2：

点2：方法只返回 true 或 false，fromIndex 的处理跟 index 的一致；polyfill 中的判断相等使用的是三等法，故特殊值无法判断；

点3：一旦找到即返回 true，否则恒返 false

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152347.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152348.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152349.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152350.png" alt="img" style="zoom:67%;" />

  





 

### 1-2-5、迭代类

forEach、map、filter、some、every、reduce、reduceeRight

返回值、对元素的处理方式、对空元素等特殊值的处理方式、this使用、迭代时改变原数组、polyfill



**<u>array.forEach ( cb [, thisArg] ) [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)</u>**

注意：不影响原数组、返回 undefined (即使里面有显式 return)、会跳过处理空值empty、箭头函数使用外围 this 而非 thisArg 的

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152708.png" alt="img" style="zoom:67%;" />



点1：forEach 处理的并不是原数组的拷贝，而是引用值，若内部改变原数组是会影响迭代结果的

注意：但一种情况例外，就是为原数组赋新值，这会分配新的内存空间，与之前指向的内存地址脱离

点2：forEach 返回 undefined，是因为没有显式 return

注意：有些人不明白为何 callback 里面的 return 不起作用，是因为 callback 的 return 并不等同于 forEach 的 return

点3：forEach 跳过空值，是因为使用 in 遍历

点4：迭代不同操作原数组的方法得到不同结果，因为赋值不等同于引用

点5：index顺序迭代不因迭代中处理原数组而改变，因为 indexLength 在循环体开始前就已获取到

点6：若 callback 为箭头函数，则 thisArg 绑定无效，因为 callback 内部 this 机制是词法作用域而非传统 this 机制

主要流程：

解读1：this 是调用 forEach 的对象，若为null则抛出异常，这里是模拟，实际中是 Uncaught TypeError: Cannot read property 'for' of null

解读2：随后用 Object 包裹成对象，意义不明….

解读3：O.length >>> 0 ，无符号移位 0 位，因为移位 0 位，所以值上没有变化，关键是无符号位移 >>>，包含两种转换：toNumber & toUnit32

解读4：对 callback、thisArg 基本的容错措施，提高健壮性

解读5：可以理解 len 为 index序列，注意到是内部迭代前，len 就已经确定，若迭代内部改变了原数组，那么 len 值也不会发生改变

解读6：使用 in 修饰符，间接过滤了空值，并获取整数属性(索引)的值（数组是对象，数组索引是对象的属性）

解读7：然后逐个将 索引出来的值，传给 callback 使用：callback.call(T, kValue, k, O); 注意到 T—thisArg 的绑定是 call绑定，这种绑定可通过箭头函数取代

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152709.png" alt="img" style="zoom:67%;" />

- 其他：for 与 forEach 在变量声明与不声明情况下的性能比对(我也服了居然有这种比对，权当无聊)：
  - for 不加声明速度最快、for加声明次之、然后是forEach、最后才是 for-in；
- 其他：for 的参数表现：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152710.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152711.png" alt="img" style="zoom:67%;" />

 

**<u>array.map(callback[, thisArg]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)</u>**

注意：不影响原数组、返回由 callback 返回结果组成的新数组(callback默认返回 undefined，须显式 return 目标值)、会处理空值empty、箭头函数使用外围 this 而非 thisArg 的

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152712.png" alt="img" style="zoom:67%;" />

点1：与 forEach 的 polyfill 不同，判断 callback 上：

- 前者用的是：*Object*.prototype.toString.call(callback) != "[object Function]"，后者用的是：typeof callback !== "function"，

点2：与 forEach 的 polyfill 不同，判断thisArg 上：

- 前者用的是：if (thisArg) {，后者用的是：if (*arguments*.length > 1) {

点3：上述两点只是修正，最主要的不同在对元素的处理：

- 前者：mappedValue = callback.call(T, kValue, k, O);  A[ k ] = mappedValue; 并返回 A；后者只是单纯处理并无返回内容：callback.call(T, kValue, k, O);

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152713.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152714.png" alt="img" style="zoom:67%;" />

map使用1：结合字符串使用，图1；

map使用2：callback 还可将如：Number()、Math类、parseInt()，但须注意传入函数的参数接收情况，图2；

map使用3：将类数组转为数组，图3；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152715.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152716.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152717.png" alt="img" style="zoom:67%;" />

 

**<u>array.filter (callback[, thisArg]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)</u>**

注意：不影响原数组、返回由 cb 返回结果的真假情况、组成的新数组(filter默认返回[])、会跳过处理空值 empty、箭头函数使用外围 this 而非 thisArg 的

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152718.png" alt="img" style="zoom:67%;" />

点1：三个风格不一样诶，这里的判定 this 和 前面的稍微不一样，thisArg 的获取也一样

点2：同样是 callback.call(T, kValue, k, O); 但此处加了层判断，根据返回内容的真假来填充新数组

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152719.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152720.png" alt="img" style="zoom:67%;" />

 





**<u>array.some (callback[, thisArg]) & array.every (callback[, thisArg]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)、[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)</u>**

注意：不影响原数组、返回布尔值(根据 callback 返回值的真假，来控制流程的进行)、会跳过处理空值empty、箭头函数使用外围 this 而非 thisArg 的

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152721.png" alt="img" style="zoom:67%;" />

点1：不管与谁相比，都是万变不离其宗，大同小异，还是遍历调用 callback，只是处理返回值的方式上不同

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152722.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152723.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152724.png" alt="img" style="zoom:67%;" />

 

**<u>array.reduce (callback [,initialValue])；callback (accumulator, currentValue?, currentIndex?, array?) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)</u>**

返回值：要加 return ，遍历数组元素并执行，将结果汇总为单值并返回。 图1

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152725.png" alt="img" style="zoom:67%;" />

- 提供了 initialValue，accumulator取值为 initialValue，currentValue取数组中的第1个值；
- 无提供 initialValue，accumulator取值为数组第1个值，currentValue取数组中的第2个值;

若数组为空，且有提供 initialValue，callback不会被执行，直接返回此唯一值；

若数组为空，且无提供 initialValue，报错 [TypeError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)；

若数组仅有1个元素，且无提供 initialValue， callback不会被执行，直接返回此唯一值；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152726.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152727.png" alt="img" style="zoom:67%;" />

- reduce的调用过程：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152728.png" alt="img" style="zoom:67%;" />

reduce使用1：实际上，还是对元素的遍历调用，只是返回值作为新的 accumulator 供下一个索引位置的值使用；下面是，遍历 people 元素，获取每个元素的 age 属性值，判断是否在 accumulator 中，不存在新建，存在则推入；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152729.png" alt="img" style="zoom:67%;" />

 

reduce 使用2：计算数组中每个元素出现的次数，注意返回的是对象，而下面虽然精简了，但是返回的是 字符串，导致第2次遍历时报错

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152730.png" alt="img" style="zoom:67%;" />

 

reduce 使用3 + 4 + 5:

- 所以渐渐地可以发现，reduce 最好写入初始值，然后遍历元素，
- 或像图3那样用 then 连接下一个元素
- 或像图2那样判断当前值和累积值
- 或像图1那样拼接

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152731.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152732.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152733.png" alt="img" style="zoom:67%;" />

reduce 使用6 - 进阶：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152734.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152735.png" alt="img" style="zoom:67%;" />

 reduce 使用7 - 模拟map、filter：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152736.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152737.png" alt="img" style="zoom:67%;" />

点1：先排除所有元素为空或[0]为空的数组

点2：若参数小于2，则将 accmulate 设为 o[k++]，即 o[0]，注意这里是后置加，先操作，后加1

点3：注意到与别的方法的最大不同是没有使用 call，而是将返回值传给下一个元素调用

点4：其中的 Object(this) 是值的引用 ，图1-2

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152738.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152739.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152740.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152741.png" alt="img" style="zoom:67%;" />

### 1-2-6、其他

**<u>slice，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)</u>**

注意：返回浅拷贝新数组，begin和end只是定位(结果不包含end，单个参数情况除外)，只能由左往右截取，否则为空数组

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152824.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152825.png" alt="img" style="zoom:67%;" />

点1：数组的使用原生方法，类数组的再处理：图1-2

点2：其中对于类数组的处理，若对象有 charAt，则使用 charAt 来获取索引，否则使用 [索引] 获取

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152826.png" alt="img" style="zoom:67%;" />

![img](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152827.png)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152828.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152829.png" alt="img" style="zoom:67%;" />

 

**<u>array.fill (value [, start[, end]]) [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152830.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152831.png" alt="img" style="zoom:67%;" />



# 二、数组相关

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

- 补充：右移操作，将前面的空位用0填充，可用**<u>于保证某变量为数字且为整数</u>**

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

  

## 2-1、map

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



// forEach 区别，没有返回值
Array.prototype.forEach = function(callback, thisArg) {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + ' is not a function');
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      callback.call(thisArg, O[k], k, O);
    }
    k++;
  }
}
```



## 2-2、reduce

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



## 2-3、push/pop

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



## 2-4、filter

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



## 2-5、splice

- splice(position, count) 表示从 position 索引的位置开始，删除count个元素
- splice(position, 0, ele1, ele2, ...) 表示从 position 索引的元素后面插入一系列的元素
- splice(postion, count, ele1, ele2, ...) 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素
- 返回值为`被删除元素`组成的`数组`。

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908100703.png" style="zoom:50%;" align="" />

### 2-5-1、基本骨架

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

### 2-5-2、移动删除元素后的元素

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

### 2-5-3、优化参数边界情况

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

### 2-5-4、优化密封对象/冻结对象情况

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

### 2-5-5、完整实现

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



## 2-6、sort

见算法专题-排序-快排实现一栏



## 2-7、findIndex

1. `findIndex` 方法对数组中的每个数组索引`0..length-1`（包括）执行一次`callback`函数，直到找到一个`cb` 函数返回真实值（强制为`true`）的值。
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

点1：因为使用的是 while 循环，不会想之前的那些array方法用 in 排除空值，故这种寻找方法效率低于只遍历有值索引方法

点2：与 find 不同的是，当 callback 返回真值，则返回当前索引值，findIndex 是返回索引值对应值，若没有返回，则恒返回 -1

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152344.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152345.png" alt="img" style="zoom:67%;" />







## 2-8、Index/LastIndexOf

点1：若数组长度为空，则直接返回 -1

点2：fromIndex 会经过 toNumber 操作，若操作不成功，则直接用默认值处理

点3：若传入无限值，则直接用默认值处理

点4：若绝对值处理后仍大于数组长度，则直接用默认值处理

点5：关键是：k in O && O[k] === searchElement

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201007152339.png" alt="img" style="zoom:67%;" />

```c++
// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// https://github.com/v8/v8/blob/master/src/builtins/array-lastindexof.tq

namespace array {
macro LoadWithHoleCheck<Elements : type extends FixedArrayBase>(
    elements: FixedArrayBase, index: Smi): JSAny
    labels IfHole;

LoadWithHoleCheck<FixedArray>(implicit context: Context)(
    elements: FixedArrayBase, index: Smi): JSAny
    labels IfHole {
  const elements: FixedArray = UnsafeCast<FixedArray>(elements);
  const element: Object = elements.objects[index];
  if (element == TheHole) goto IfHole;
  return UnsafeCast<JSAny>(element);
}

LoadWithHoleCheck<FixedDoubleArray>(implicit context: Context)(
    elements: FixedArrayBase, index: Smi): JSAny
    labels IfHole {
  const elements: FixedDoubleArray = UnsafeCast<FixedDoubleArray>(elements);
  const element: float64 = elements.floats[index].Value() otherwise IfHole;
  return AllocateHeapNumberWithValue(element);
}

macro FastArrayLastIndexOf<Elements : type extends FixedArrayBase>(
    context: Context, array: JSArray, from: Smi, searchElement: JSAny): Smi {
  const elements: FixedArrayBase = array.elements;
  let k: Smi = from;

  // Bug(898785): Due to side-effects in the evaluation of `fromIndex`
  // the {from} can be out-of-bounds here, so we need to clamp {k} to
  // the {elements} length. We might be reading holes / hole NaNs still
  // due to that, but those will be ignored below.
  if (k >= elements.length) {
    k = elements.length - 1;
  }

  while (k >= 0) {
    try {
      const element: JSAny = LoadWithHoleCheck<Elements>(elements, k)
          otherwise Hole;

      const same: Boolean = StrictEqual(searchElement, element);
      if (same == True) {
        assert(Is<FastJSArray>(array));
        return k;
      }
    } label Hole {}  // Do nothing for holes.

    --k;
  }

  assert(Is<FastJSArray>(array));
  return -1;
}

transitioning macro
GetFromIndex(context: Context, length: Number, arguments: Arguments): Number {
  // 4. If fromIndex is present, let n be ? ToInteger(fromIndex);
  //    else let n be len - 1.
  const n: Number =
      arguments.length < 2 ? length - 1 : ToInteger_Inline(arguments[1]);

  // 5. If n >= 0, then.
  let k: Number = SmiConstant(0);
  if (n >= 0) {
    // a. If n is -0, let k be +0; else let k be min(n, len - 1).
    // If n was -0 it got truncated to 0.0, so taking the minimum is fine.
    k = Min(n, length - 1);
  } else {
    // a. Let k be len + n.
    k = length + n;
  }
  return k;
}

macro TryFastArrayLastIndexOf(
    context: Context, receiver: JSReceiver, searchElement: JSAny,
    from: Number): JSAny
    labels Slow {
  const array: FastJSArray = Cast<FastJSArray>(receiver) otherwise Slow;
  const length: Smi = array.length;
  if (length == 0) return SmiConstant(-1);

  const fromSmi: Smi = Cast<Smi>(from) otherwise Slow;
  const kind: ElementsKind = array.map.elements_kind;
  if (IsFastSmiOrTaggedElementsKind(kind)) {
    return FastArrayLastIndexOf<FixedArray>(
        context, array, fromSmi, searchElement);
  }
  assert(IsDoubleElementsKind(kind));
  return FastArrayLastIndexOf<FixedDoubleArray>(
      context, array, fromSmi, searchElement);
}

transitioning macro GenericArrayLastIndexOf(
    context: Context, object: JSReceiver, searchElement: JSAny,
    from: Number): JSAny {
  let k: Number = from;

  // 7. Repeat, while k >= 0.
  while (k >= 0) {
    // a. Let kPresent be ? HasProperty(O, ! ToString(k)).
    const kPresent: Boolean = HasProperty(object, k);

    // b. If kPresent is true, then.
    if (kPresent == True) {
      // i. Let elementK be ? Get(O, ! ToString(k)).
      const element: JSAny = GetProperty(object, k);

      // ii. Let same be the result of performing Strict Equality Comparison
      //     searchElement === elementK.
      const same: Boolean = StrictEqual(searchElement, element);

      // iii. If same is true, return k.
      if (same == True) return k;
    }

    // c. Decrease k by 1.
    --k;
  }

  // 8. Return -1.
  return SmiConstant(-1);
}

// https://tc39.github.io/ecma262/#sec-array.prototype.lastIndexOf
transitioning javascript builtin ArrayPrototypeLastIndexOf(
    js-implicit context: NativeContext, receiver: JSAny)(...arguments): JSAny {
  // 1. Let O be ? ToObject(this value).
  const object: JSReceiver = ToObject_Inline(context, receiver);

  // 2. Let len be ? ToLength(? Get(O, "length")).
  const length: Number = GetLengthProperty(object);

  // 3. If len is 0, return -1.
  if (length == SmiConstant(0)) return SmiConstant(-1);

  // Step 4 - 6.
  const from: Number = GetFromIndex(context, length, arguments);

  const searchElement: JSAny = arguments[0];

  try {
    return TryFastArrayLastIndexOf(context, object, searchElement, from)
        otherwise Baseline;
  } label Baseline {
    return GenericArrayLastIndexOf(context, object, searchElement, from);
  }
}
}
```











# 三、常见实现

## 3-1、数组扁平化

扁平化即多维数组转为一维数组：`[1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]`

### 3-1-1、ES6 flat

```js
const arr = [1, [1,2], [1,2,3]]
arr.flat(Infinity)  // [1, 1, 2, 1, 2, 3]

arr = [1, [1,2], [1,2,[1,2,3],3]]
arr.flat(Infinity)  // [1, 1, 2, 1, 2, 1, 2, 3, 3]
```

### 3-1-2、replace + split

```js
ary = str.replace(/(\[|\])/g, '').split(',')
// 上面是过去的写法了，新写法如下(没想到吧，V8 牛逼)
`${arr}`.split(',');
(arr + '').split(',');
```

### 3-1-3、replace + JSON.parse

```js
str = str.replace(/(\[|\])/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
// 上面是过去的写法了，新写法如下(没想到吧，V8 牛逼)
`${arr}`.split(',');
(arr + '').split(',');
```

### 3-1-4、函数递归

```js
// 递归方式略过
// 递归方式略过
// 递归方式略过
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

### 3-1-5、利用 reduce 函数迭代

```js
const ary = [1, [1,2], [1,2,3]]
function flatten(ary) {
    return ary.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flatten(cur) ：cur), []);
}
console.log(flatten(ary)) // [1, 1, 2, 1, 2, 3]
```

### 3-1-6、ES6 展开运算符

```js
arr = [1, [2, [3, [4, 5]]], 6];
while (arr.some(Array.isArray)) {
  arr = [].concat(...arr);
}
console.log(arr)  // [1, 2, 3, 4, 5, 6]
```

### 3-1-7、序列化 + 正则

```js
const arr = [1, [1,2], [1,2,3]]
const str = `[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`
JSON.parse(str)   // [1, 1, 2, 1, 2, 3]
// 上面是过去的写法了，新写法如下(没想到吧，V8 牛逼)
`${arr}`.split(',');
(arr + '').split(',');
```



## 3-1、对象扁平化

```js
function objectFlat(obj = {}) {
  const res = {}
  function flat(item, preKey = '') {
    Object.entries(item).forEach(([key, val]) => {
      const newKey = preKey ? `${preKey}.${key}` : key
      if (val && typeof val === 'object') {
        flat(val, newKey)
      } else {
        res[newKey] = val
      }
    })
  }
  flat(obj)
  return res
}

// 测试
const source = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } }
console.log(objectFlat(source));
```



## 3-2、数组寻值

### 3-2-1、indexOf(ele)

```js
// 判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1
var arr=[1,2,3,4];
var index=arr.indexOf(3);
console.log(index);
```

### 3-2-2、includes(ele [,fromIndex])

```js
// 判断数组中是否存在某个值，如果存在返回 true，否则返回 false
var arr=[1,2,3,4];
if(arr.includes(3))
    console.log("存在");
else
    console.log("不存在");
```

### 3-2-3、find(cb [,thisArg])

```js
// 数组中满足条件的第一个元素的值，如果没有，返回 undefined
var arr=[1,2,3,4];
var result = arr.find(item =>{
    return item > 3
});
console.log(result);
```

### 3-2-4、findeIndex(cb [,thisArg])

```js
// 返回数组中满足条件的第一个元素的下标，如果没有找到，返回 -1
var arr=[1,2,3,4];
var result = arr.findIndex(item =>{
    return item > 3
});
console.log(result);
```



## 3-3、数组乱序

### 3-3-1、sort + random

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.sort(function () {
    return Math.random() - 0.5;
});
```





## 3-4、数组去重

### 3-4-1、new Set

`Array.from(new Set(arr))`、`[...new Set(arr)]`

- ```js
  var arr = [1,1,2,5,6,3,5,5,6,8,9,8];
  console.log(Array.from(new Set(arr)))
  console.log([...new Set(arr)])
  ```





### 3-4-2、嵌套 for + splice

for 循环嵌套，利用 splice 去重

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



### 3-4-3、indexOf/includes/filter/map

新建数组，利用 `indexOf` 或 `includes` 去重

- ```js
  const unique2 = arr => {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      if (res.indexOf(arr[i]) === -1) res.push(arr[i]);
    }
    return res;
  }
  
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
  
  const unique4 = arr => {
    return arr.filter((item, index) => {
      return arr.indexOf(item) === index;
    });
  }
  
  const unique5 = arr => {
    const map = new Map();
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      if (!map.has(arr[i])) {
        map.set(arr[i], true)
        res.push(arr[i]);
      }
    }
    return res;
  }
  ```



### 3-4-4、sort + while

先用 `sort `排序，然后用一个指针从第`0`位开始，配合 `while` 循环去重

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




## 3-5、类数组转换

类数组是具有 length 属性，但不具有数组原型方法；比如 arguments、DOM操作方法返回的结果(NodeList)；

### 3-5-1、Array.from

```js
Array.from(document.querySelectorAll('div'))
```



### 3-5-2、Array.prototype.slice.call()

```js
Array.prototype.slice.call(document.querySelectorAll('div'))
```



### 3-5-3、扩展运算符

```js
[...document.querySelectorAll('div')]
```



### 3-5-4、concat

```js
Array.prototype.concat.apply([], document.querySelectorAll('div'));
```





