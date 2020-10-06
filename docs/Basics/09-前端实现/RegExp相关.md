# 四、RegExp相关

string.search、string.replace、string.match、string.matchAll、string.split、regexp.exec

注意：RegExp对非正则内容的处理、正向负向先行后行断言、各API加g & 不加g情况

## 4-1、基本

### 4-1-1、创建

- 或 new RegExp，运行时编译，能动态生成；

- 或 直接量构建，加载时编译，仅可静态写死；
  - E3时，同一段，在每次运算都会返回，相同对象；
  - E5时，同一段，在每次运算都会返回，新的对象；



### 4-1-2、规则

#### 4-1-2-1、正则符号

特殊意义的字符需用反斜杠 \ 转义、点字符匹配任意 JS 字符(行结束符如换行、回车等除外)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204615.png" alt="img" style="zoom:60%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204616.png" alt="img" style="zoom:60%;" />

 

####  4-1-2-2、单个/重复/括号类

- **<u>单个类 []</u>**：如 /[0-35-9]/g  匹配 345678 中的3 | 5 | 6 | 7 | 8

- **<u>重复类 {}</u>**：注意稍加改动即变为贪婪字符：
  - 注意：{-1} {-1,} 等为非法量词，无法匹配；
  - 注意：前缀0会忽略；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204617.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204618.png" alt="img" style="zoom: 67%;" />

- **<u>括号类 ()</u>**
  - 功能一，组合表达式，实现字符集合选取和分割，图1：
  - 功能二，反向引用以约束，索引为从左到右的左括号数，多用于处理成对标签，图2：
  - 功能三，取消反向引用，顾名思义，不想实现引用，(?:)，图3：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204619.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204620.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204621.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204622.png" alt="img" style="zoom:67%;" />

#### 4-1-2-3、贪婪非贪婪

- 开启非贪婪匹配加 ? 即可，如：{ n, m }?、+？
- 注意：* 和 ? 最小匹配条件是0，使用非贪婪匹配无意义，图2
- 注意：若有别的字符，贪婪优先于非贪婪，原因不明，图3：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204623.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204624.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204625.png" alt="img" style="zoom:67%;" />

#### 4-1-2-4、断言与边界

**<u>断言</u>**

- 先行断言：`x(?=p)`：要求匹配项x后面有p，但匹配结果不能包含p，略；
- 负向先行断言：`x(?!p)`：要求匹配项x后面没有p：略；
- 后行断言：`(?<=p)x`：要求匹配项x前面有p，但匹配结果不能包含p：图1：
- 负向后行断言：`(?<!p)x`：要求匹配项x前面没有p：图2：
- 注意：问号开始的特殊字符：取消反向：`(?:)` 、断言：`(?!)(?=)(?<)(?>)`

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204626.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204627.png" alt="img" style="zoom:67%;" />

**<u>边界</u>**

- 匹配开头和结束：`^ $`；
- 注意：^ 和 $ 优先级比 | 大，但可用括号改变，图1：
- \b \B 匹配单词边界和非单词边界，理解上有点绕，图2：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204628.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204629.png" alt="img" style="zoom:67%;" />





## 4-2、相关—String

### 4-2-1、string.search

[string.search(匹配式)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search)：

返回：首个匹配内容下标值，匹配失败返回 -1；

- 注意：方法不支持二参，且不支持修饰符如 g；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204630.png" alt="img" style="zoom:67%;" />

- 注意：若 search 参数不是正则表达式，会先通过 RegExp 构造转换为正则，所以会有意料之外的结果：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204631.png" alt="img" style="zoom:67%;" />

-  注意：Symbol类型：匹配的结果其实是空??

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204632.png" alt="img" style="zoom:67%;" />



### 4-2-2、string.replace

[string.replace(匹配式/字符串，替换文本/生成替换文本的函数)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 

返回：新的匹配字符串(不改变原字符串)，每执行一次只匹配一处，根据是否加 ‘g’ 而又不同结果。

- 若参数1是字符串，则只能匹配1个且1次，单一功能；
- 若参数1是正则式，则可加修饰符如gi，多种功能：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204633.png" alt="img" style="zoom:67%;" />

- 若参数2是字符串，则为普通的替换；
- 若参数2是字符串且有美元符 $，则会变为特殊替换：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204634.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204635.png" alt="img" style="zoom:67%;" />

- 若参数2是字符串且有美元符 $，且参数1有分组，则 “$+数字(>0) ” 表示在替换中插入分组：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204636.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204637.png" alt="img" style="zoom:67%;" />

- 若参数2是函数，函数默认自带参数为：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204638.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204639.png" alt="img" style="zoom: 67%;" />

- 若参数1，无分组，则只有上述 group 以外的参数(两次次匹配结果)：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204640.png" alt="img" style="zoom:67%;" />

-  若参数1，有分组，则包含全部参数(两次次匹配结果)：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204641.png" alt="img" style="zoom:67%;" />

- 提示：若显式传参，则取代默认参数的位置，但作用不变：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204642.png" alt="img" style="zoom:67%;" />





### 4-2-3、string.match

[string.match(匹配式)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)

注意：方法不支持二参，且不支持修饰符如 g；

参数：正则对象，若非正则，会先隐式调用 new RegExp转换；

返回：根据有无带 g，返回纯元素数组/null，或以下形式数组：

- groups: 一个捕获组数组 或 [undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（如果没有定义命名捕获)；
- index: 匹配的结果的开始位置；
- input: 搜索的字符串；

注意：没有二参，传入二参无效；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204649.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204650.png" alt="img" style="zoom:67%;" />

 注意：若正则表达式不包含 g 标志，str.match() 将返回与 [RegExp.exec()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec). 相同的结果；

 注意：发生隐式转换、RegExp() 方法将忽略正号；

![img](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204651.png)

- 若参数不带 ‘g’，则返回具有特定参数的数组，只做1次匹配，匹配失败则返回 null；
- 若参数带 ‘g’，则返回由匹配结果组成的数组，匹配失败则返回 null；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204652.png" alt="img" style="zoom:67%;" />

- 若参数带 ‘g’，且带分组，返回结果不变；
- 若参数不带 ‘g’，但带分组，返回结果是在具有特定参数的数组的基础上包含分组内容 a[n] 存放的是 $n 的内容，如:

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204653.png" alt="img" style="zoom:67%;" />

不带g，每次执行均为初始位置（不像）

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204654.png" alt="img" style="zoom:67%;" />

 

### 4-2-4、string.split

[string.split([separator[, limit])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)

注意：参数可是正则，用以指定分隔符，分割成数组

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204655.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204656.png" alt="img" style="zoom:67%;" />

### 4-2-5、其他 string 相关

[string.matchAll](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)





## 4-3、相关—RegExp构造方法

RegExp 构造方法：参数1：字符串或正则；参数2：可选；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204657.png" alt="img" style="zoom:67%;" />

注意：每个RegExp对象都有5属性： 

| global     | 只读 | 注意事项                           | 原型链属性 | 不可枚举 |
| ---------- | ---- | ---------------------------------- | ---------- | -------- |
| ignoreCase | 只读 | -                                  | 原型链属性 | 不可枚举 |
| multiline  | 只读 | -                                  | 原型链属性 | 不可枚举 |
| source     | 只读 | 正则表达式体                       | 原型链属性 | 不可枚举 |
| lastIndex  | 读写 | 存储下一次检索开始的位置，初始值=0 | 实例属性   | 不可枚举 |

注意：lastIndex 从属于自身，其余属性是原型链属性：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204658.png" alt="img" style="zoom:67%;" />

### 4-3-1、RegExp.exec

返回：具有特定参数的数组：匹配项、分组、匹配值下标、输入文本

- 不加 ‘g’ ，只返回第一个（同一处）匹配信息，失败返回 null (循环操作需注意)，图1：
- 若加 ‘g’ ，每次返回后续匹配项信息，图2；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204700.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204701.png" alt="img" style="zoom:67%;" />

 

### 4-3-2、RegExp.test

返回： 布尔值，每执行一次匹配一处，返回 true；若无搭配则返回 false；

- 不加 ‘g’ ，只返回第一个（同一处）匹配信息，失败返回 false (循环操作需注意)；
- 若加 ‘g’ ，每次返回后续匹配项信息；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204702.png" alt="img" style="zoom:67%;" />

test 会对传入参数进行字符串化，undefined —> ’undefined‘

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204703.png" alt="img" style="zoom:67%;" />

 

 

 

 

## 4-X、示例

- 去除中括号 & 去中括号及其中内容：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204704.png" alt="img" style="zoom:67%;" />

-  每间隔3个数字添加符号(第一个可能有兼容问题，但可传参解决)：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204705.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204706.png" alt="img" style="zoom:67%;" />

- `"1 2 3".replace(/\d/g, parseInt)`

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204643.png" alt="img" style="zoom:67%;" />

- [去除空格，并大写首字母](https://stackoverflow.com/questions/6142922/replace-a-regex-capture-group-with-uppercase-in-javascript)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204644.png" alt="img" style="zoom:67%;" />

- 推导空格作用于实现转换；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204645.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204648.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006204647.png" alt="img" style="zoom:50%;" />

 