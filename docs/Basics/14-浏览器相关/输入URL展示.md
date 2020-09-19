# 六、输入URL到展示过程

- DNS 解析：通过域名查询到具体的 IP 
  - 操作系统会在本地缓存中查询 IP；若无则去系统配置的 DNS 服务器中查询；若无则直接去 DNS <u>根服务器查询</u>，查询会找出负责 `com` 这个一级域名的服务器；然后去 <u>一级域名服务器</u> 查询 `google` 这个二级域名，直至找到最终匹配域名 IP；
  - 上述为 DNS 迭代查询，还有种递归查询，区别是前者是由客户端发起请求，后者是由系统配置的 DNS 服务器做请求，得到结果后将数据返回给客户端；
- TCP 三次握手；
  - 应用层会下发数据给传输层，TCP 协议会指明两端的端口号，然后下发给网络层；网络层中的 IP 协议会确定 IP 地址，并且指示数据传输中如何跳转路由器；然后包会再被封装到数据链路层的数据帧结构中，最后就是物理层面的传输；
- TLS 握手；握手流程与加密方式发展；
- 分析 URL，设置请求报文(头，主体)，发送请求；
- 服务器响应；
- 浏览器解析与渲染；
  - 解析时，若是 gzip 格式的话则先解压，然后通过文件的编码格式知道该如何去解码文件；
  - 若遇到 script 标签，判断是否存在 async 或 defer ：
    - 前者会并行进行下载和执行 JS，后者会先下载文件，后等待 HTML 解析完成后顺序执行；否则阻塞渲染；
  - HTML parser --> DOM Tree
    - 标记化算法，进行元素状态的标记；
    - DOM 树构建；
  - CSS parser --> Style Tree
    - 解析 CSS 代码，生成样式树；
  - attachment --> Render Tree
    - 结合 DOM 树 与 style 树，生成渲染树；
  - Layout：布局
  - GPU painting: 像素绘制页面



## 6-1、网络相关

### 6-1-1、网络请求

- 构建请求：浏览器会构建请求行 `GET / HTTP/1.1`

- 查找强缓存：检查强缓存，若命中直接使用，否则进入下一步；

- DNS 解析：域名与 IP 的转换系统，但浏览器提供 <u>DNS数据缓存功能</u>，若某域名已解析过，则会将结果缓存再利用；默认端口 80；

- 建立 TCP 连接：Chrome 在同一域名下要求同时最多只能有 6 个 TCP 连接，超过则需等待；<u>详看 TCP 协议</u>；

- 发送 HTTP 请求：请求体只在 POST 方式才会存在；<u>详看 HTTP 协议</u>；

```http
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Cookie: ......
Host: www.google.com
Pragma: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
```

### 6-1-2、网络响应

HTTP 请求到达服务器，服务器进行相关处理并响应；<u>详看 HTTP 协议</u>；

响应头包含了服务器及其返回数据的一些信息、服务器生成数据的时间、返回的数据类型以及对即将写入的 Cookie 等信息；

注意：若请求或响应头中包含 **Connection: Keep-Alive**，则表示建立 <u>持久连接</u>，随后请求统一站点的资源会复用此连接，否则断开连接, 流程结束；

```http
Cache-Control: no-cache
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Wed, 04 Dec 2019 12:29:13 GMT
Server: apache
Set-Cookie: rsv_i=f9a0SIItKqzv7kqgAAgphbGyRts3RwTg%2FLyU3Y5Eh5LwyfOOrAsvdezbay0QqkDqFZ0DfQXby4wXKT8Au8O7ZT9UuMsBq2k; path=/; domain=.google.com
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001820.png" style="zoom:50%;" />



## 6-X、浏览器解析渲染流程

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001821.png" style="zoom:50%;" />

- 渲染进程将 HTML 内容转换为能够读懂的 **<u>DOM 树</u>**；
- 渲染引擎将 CSS 样式表转化为浏览器可理解的 styleSheets，计算出 DOM 节点的样式；
- 创建 **<u>布局树</u>**，并计算元素的布局信息；
- 对布局树进行分层，并生成 **<u>分层树</u>**；
- 为每个图层生成 **<u>绘制列表</u>**，并将其提交到 **<u>合成线程</u>**，合成线程将图层分图块，并栅格化将图块转换成位图；
- 合成线程发送绘制图块命令给浏览器进程，浏览器进程根据指令生成页面，并显示到显示器上；





## 6-2、解析相关

完成网络请求，若响应头中  `Content-Type` 值是 `text/html`，则**<u>进入浏览器解析与渲染工作</u>**，解析部分主要分为以下几个步骤:

- **<u>构建 DOM 树</u>**
- **<u>样式计算</u>**
- <u>**生成布局树(Layout Tree)**</u>



**<u>注意：下述内容极为简略，只作为回忆说明：</u>**

- DOM 树：字节数据—>字符串—>Token—>Node—>DOM
  - 网络01 <u>字节数据</u>—>
  - <u>HTML字符串</u>—>
  - 通过词法分析转换为 <u>标记(标记化—tokenization)(标记还是字符串，是构成代码的最小单位)</u>—>
  - 转换为 Node，并根据不同 Node 之前的联系构建为一颗 DOM 树；
- CSSOM 树(同步进行)：字节数据—>字符串—>Token—>Node—>CSSOM
  - 格式化、标准化、并根据继承与层叠规则计算节点具体样式；
- 生成渲染树(旧式)
- 布局显示(旧式)



### 6-2-1、构建 DOM 树

由于浏览器无法直接理解 **<u>HTML字符串</u>**，因此需要先将 HTML 的原始字节数据，转换为文件指定编码的字符，然后浏览器会根据 HTML 规范来将字符串转换成各种令牌标签，最终解析成一个树状的对象数据结构——**<u>DOM树</u>**；其本质上是一个以 `document` 为根节点的多叉树；



### 6-2-1-1、HTML 文法本质

注意：此处的 HTML 的文法并非指 **<u>上下文无关文法</u>**；在计算机科学 <u>编译原理</u> 学科中，有非常明确的定义:

> 若一个形式文法G = (N, Σ, P, S) 的产生式规则都取如下的形式：V->w，则叫上下文无关语法。其中 V∈N ，w∈(N∪Σ)* 。

其中把 G = (N, Σ, P, S) 中各个参量的意义解释一下:

1. N 是<u>**非终结符**</u>(即最后的符号不是它，下同)集合；
2. Σ 是<u>**终结符**</u>集合；
3. P 是**<u>开始符</u>**，它必须属于 N ，也即非终结符；
4. S 就是不同的产生式的集合；比如 S -> aSb 等等；

用人话讲，**<u>上下文无关的文法，就是这个文法中所有产生式的左边都是一个非终结符</u>** ，比如：

```
// 下面文法中，每个产生式左边都会有一个非终结符，这就是: 上下文无关的文法; 此时，`xBy`一定是可以规约出`xAy`的；
A -> B
```

```
// 反例:
// 下面就是: 非上下文无关的文法; 当遇到 B 时，无法判断是否可以规约出 A，因为取决于左边或右边是否有 a 存在, 故下面是和上下文有关的
aA -> B
Aa -> B
```

注意：**<u>规范的 HTML 语法</u>**，**<u>是符合上下文无关文法的</u>**，能够体现它 **<u>非上下文无关文法的</u>** 在它的 **不标准的语法**，比如反例证明如下：

因为：解析器扫描到 `form` 标签时，**<u>上下文无关文法</u>** 的处理方式是直接创建对应 form 的 DOM 对象，而真实 HTML5 场景中却不是这样，解析器会查看 `form` 上下文，若此 `form` 标签的父标签也是 `form`，则 **直接跳过** 当前 `form` 标签，否则才创建 DOM 对象；

所以：在不标准的语法时，是非上下文无关文法，则标准语法中，就是上下文无关文法(注意多重否定表肯定)；

**<u>注意：上面的叙述想表达的是规范的 HTML 语法是符合上下文无关文法的，但真实场景和实际解析中，考虑到不标准语法的行为，所以是非上下文无关文法；</u>**

**<u>注意：即理论与实际不符，表示 HTML 不能使用常规语言解析器(常规编程语言一般为上下文无关)完成 HTML Parse；</u>**



### 6-2-1-2、解析算法

HTML5 [规范](https://html.spec.whatwg.org/multipage/parsing.html) 详细地介绍解析算法，算法分为两个阶段:

- **标记化算法**；对应过程为 **词法分析**；
- **建树算法**；对应过程为 **语法分析**；

### 6-2-1-2-1、标记化算法

算法输入为 <u>HTML文本</u>，输出为 <u>HTML标记</u>，故亦称 <u>**标记生成器**</u>；

算法运用 **<u>有限自动状态机</u>** 来完成：即在当前状态下，接收一或多个字符，就会更新到下一状态；比如：

```html
// 标记化过程展示示例
<html>
  <body>
    Hello Beijing
  </body>
</html>
```

- 首先，遇到 `<`, 状态为 **标记打开**；
- 然后，接收 `[a-z]` 字符，并进入 **标记名称状态**；
- 然后，上述状态一直保持，直到遇到 `>`，表示标记名称记录完成，此时进入 **数据状态**；
- 然后，后续的 `body`  标签做同样处理；
- 然后，当来到 `<body>` 中的 `>`，进入**数据状态**，之后保持此状态接收后面字符 **hello TLP**；
- 接着，接收 `</body>`  中的 `<`，回到 **标记打开**，在接收下一个字符 `/`  时，此时会创建一个 `end tag` 的 token；
- 随后，进入 **标记名称状态**，遇到 `>` 则回到**数据状态**；
- 最后，以同样的样式处理 `</html>`；

### 6-2-1-2-2、建树算法

​	回顾一下，解析第一步是构建 **<u>DOM 树</u>**，是因为浏览器无法直接理解 **<u>HTML字符串</u>**，因此需要先将这系列的字节流，转换为一种有意义的、且方便操作的数据结构——**<u>DOM 树</u>**；而 **<u>DOM 树</u>**是一个以 `document` 为根节点的多叉树；所以，<u>**解析器**</u>  首先会创建一个 `document` 对象 (作为 **<u>DOM 树</u>** 的根节点)；

​	随后，<u>**标记生成器**</u> 会将每个标记的信息发送给 **<u>建树器</u>**，**<u>建树器</u>**  接收到相应的标记时，会 **创建对应的 DOM 对象**，在创建这个 `DOM对象` 后会做两件事：

- 将 `DOM对象` 加入 **<u>DOM 树</u>** 中；
- 将对应标记，压入存放 **开放(与<u>闭合标签</u>意思对应)元素** 的栈中；

```
<html>
  <body>
    Hello Beijing
  </body>
</html>
```

- 首先，状态为  **初始化状态**；
- 然后，(**<u>建树器</u>**)接收到 **<u>标记生成器</u>** 传来的 `html` 标记，此时状态变为 **before html状态**，同时创建一个 `HTMLHtmlElement` DOM 元素，并将其添加到 `document` 根对象上，并进行压栈操作；
- 随后，状态自动变为 **before head**，此时从标记生成器那边传来 `body` 标记，表示并没有 `head` 标签， 此时 **<u>建树器</u>** 会自动创建一个 `HTMLHeadElement`  (DOM 元素)，并将其添加入到 **<u>DOM 树</u>** 中；
- 然后，进入到 **in head** 状态，随机直接跳到  **after head**；
- 然后，现在 **<u>标记生成器</u>** 传来了 `body ` 标记，创建 `HTMLBodyElement`(DOM 元素)，插入到 **<u>DOM 树</u>** 中，同时压入开放标记栈；
- 随后，状态变为 **in body**，然后接收后面系列字符：**Hello Beijing**，接收到第一个字符时，会创建 **Text** 节点并将字符插入其中，然后把 **Text** 节点插入到 **<u>DOM 树</u>** 中的 `body元素`的下面；后续不断接收后面字符，字符会附在 **Text** 节点上；
- 然后，**标记生成器** 传过来一个 `body` 的结束标记，进入 **after body** 状态；
- 最后，**标记生成器 **传过来一个 `html` 的结束标记，进入 **after after body** 状态，表示解析过程到此结束；

### 6-2-1-2-3、容错机制

HTML5规范宽容策略十分强悍，接下来是 WebKit 中一些经典的容错示例：

- 表单元素嵌套：直接忽略里面的 `form`；

- 使用 `</br>`  而不是 `<br>`

```
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
  reportError(MalformedBRError);
  t->beginTag = true;
}
// 全部换为 <br> 形式
```

- 表格离散

```
<table>
  <table>
    <tr><td>inner table</td></tr>
  </table>
  <tr><td>outer table</td></tr>
</table>
```

```
// WebKit 会自动转换为:
<table>
    <tr><td>outer table</td></tr>
</table>
<table>
    <tr><td>inner table</td></tr>
</table>
```



### 6-2-1-2-4、流程总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001822.png" style="zoom:50%;" align=""/>

- **转码(Bytes -> Characters)**
  - 读取接收到的 HTML 二进制数据，按指定编码格式将字节转换为 HTML 字符串；
- **Tokens 化(Characters -> Tokens)**
  -  解析 HTML，将 HTML 字符串转换为结构清晰的 Tokens，每个 Token 都有特殊的含义同时有自己的一套规则；
- **构建 Nodes(Tokens -> Nodes)**
  - 每个 Node 都添加特定的属性(或属性访问器)，通过指针能够确定 Node 的父、子、兄弟关系和所属 treeScope
  - 比如：iframe 的 treeScope 与外层页面的 treeScope 不同；
- **构建 DOM 树(Nodes -> DOM Tree)**
  - 最重要的工作是建立起每个结点的父子兄弟关系；





### 6-2-2、样式计算

即渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001823.png" style="zoom:50%;" align=""/>

上图即将所有值转换为渲染引擎容易理解、标准化的计算值，此过程为 **<u>属性值标准化</u>**，处理完成后再处理样式的 **<u>继承和层叠</u>**，整一过程亦称 CSSOM 构建过程；

### 6-2-2-1、格式化样式表

CSS 样式来源有三种：link 标签引用、style 标签样式、元素的内嵌 style 属性；

浏览器是无法直接识别 CSS 样式文本，因此渲染引擎收到 CSS 文本后第一件事情就是将其转化为一个结构化的对象 **<u>styleSheets</u>**；在浏览器控制台能够通过`document.styleSheets `来查看这个最终结构，结构包含了以上 3 种 CSS来源，为后面的样式操作提供基础；

补充：格式化的过程过于复杂，而且对于不同的浏览器会有不同的优化策略，这里就不展开了；

### 6-2-2-2、标准化样式属性

有些 CSS 样式的数值并不容易被渲染引擎所理解，因此在计算样式前需要将它们标准化；比如 `em->px、red->#ff0000、bold->700` 等；

### 6-2-2-3、计算每个节点的具体样式

CSS 样式被 <u>格式化</u> 和 <u>标准化</u> 后，便可计算每个节点的具体样式信息；计算遵从两个规则：**继承**、**层叠**；

- 继承规则：每个子节点均默认继承父节点样式属性，若父节点中没有找到，则采用浏览器默认样式 `UserAgent样式`；
- 层叠规则：<u>CSS 最大特点在于它的层叠性，也即最终样式取决于各个属性共同作用的效果</u>；
- 注意：在计算完样式之后，所有样式值会被挂在到 `window.getComputedStyle` 当中，故可通过 JS 来获取计算后的样式；



### 6-2-3、生成布局树

布局过程即：利用前面的 **<u>DOM 树</u>** 和 **<u>DOM 样式</u>** ，排除 `script、meta` 等功能化、非视觉节点，排除 `display: none` 的节点，并通过浏览器的布局系统 <u>计算元素位置信息</u>、<u>确定元素位置</u>，构建一棵只包含可见元素的 **<u>布局树(Layout Tree)</u>**；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001824.png" style="zoom:50%;" align=""/>

- 遍历生成的 **<u>DOM 树</u>** 节点，并将它们添加到 **<u>布局树</u>** 中；
- 计算 **<u>布局树</u>** 节点的坐标位置；
- 注意：**<u>布局树</u>**  包含可见元素，设置`display: none`的元素和 `head` 等功能标签，将不会被放入其中；
- 注意：现在 Chrome 团队已经做了大量重构，已经没有生成 **<u>渲染树(Render Tree)</u>** 的过程(布局树的信息已非常完善，完全拥有 Render Tree 的功能)；
- 补充：[从Chrome源码看浏览器如何layout布局](https://www.rrfed.com/2017/02/26/chrome-layout/)。

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001825.png" style="zoom:50%;" align="" />



## 6-3、渲染相关

渲染分为几个步骤：

- **<u>建立 图层树(Layer Tree)</u>**
- **<u>生成 绘制列表</u>**
- **<u>生成 图块 并 栅格化(生成位图)</u>**
- **<u>显示器显示内容</u>**



### 6-3-1、建图层树/分层树(Layer Tree)

​	解析阶段得到 DOM节点、样式、位置信息，但还不足以开始绘制页面，因还需考虑页面中的复杂效果与场景，比如复杂 3D 动画变换效果、页面滚动、元素含层叠上下文时的显示与隐藏、使用 z-indexing 做 z 轴排序等；而为更加方便地实现这些效果，在浏览器在构建完 **<u>布局树</u>** 后(解析阶段最后一步)，渲染引擎还需为特定的节点生成专用图层，构建一棵 **<u>图层树(Layer Tree)</u>**；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001826.png" style="zoom:50%;" />

​	图层树通过显示隐式合成构建，一般情况下，节点的图层会默认属于父节点的图层(**亦称合成层**)，某些条件会触发将 **<u>多个合成层</u>** 提升为 **<u>单独合成层</u>**，可分两种情况讨论：**显式合成**、**隐式合成**

### 6-3-1-1、显式合成

- 拥有 <u>层叠上下文</u> 属性的元素会单独提升为单独一层：层叠上下文是 HTML 元素的三维概念，这些 HTML 元素在一条假想的、相对于面向视窗或用户的 z 轴上延伸，HTML 元素依据其自身属性，按照优先级顺序占用层叠上下文空间；
  - **根元素(HTML)** 本身就具有层叠上下文；
  - 元素的 **filter** 值不为 none；
  - 元素的 **clip-path** 值不为 none；
  - 元素的 **transform** 值不为 none；
  - 元素的 **perspective** 值不为 none；
  - 元素的 **mix-blend-mode** 值不为 normal；
  - 元素的 **z-index** 值不为 auto，且为 flex 子项；
  - 元素的 **z-index** 值不为 auto，且为 grid 子项；
  - 元素的 **z-index** 值不为 auto，且为绝对/相对定位元素；
  - 元素的 **mask**、**mask-image**、**mask-border** 不为 none；
  - 元素的 **isolation** 值是 isolate；
  - 元素的 **-webkit-overflow-scrolling** 值是 touch；
  - 元素的 **contain** 值是 layout、paint、strict、content；
  - 元素的 **opacity** 值是小于 1；(the specification for opacity)
  - 元素的 **will-change ** 值是指定的任意属性；([详看](https://dev.opera.com/articles/css-will-change-property/) )

- 需要 <u>剪裁</u> 的地方也会被创建为图层：
  - 比如某个存放巨量文字的 100 * 100 像素大小的 DIV，超出的文字部分就需要被剪裁；若出现滚动条，则滚动条会被单独提升为一个图层；

### 6-3-1-2、隐式合成

<u>层叠等级低</u> 的节点被提升为单独图层后，则 <u>所有层叠等级比它高</u> 的节点 **都会 **成为一个单独的图层；

- 注意：隐式合成隐藏巨大风险：若在一个大型应用中，当某个`z-index` 比较低的元素，被提升为单独图层后，层叠在它上面的元素统统都会被提升为单独的图层，此时瞬间可能会增加上千个图层，大大增加内存压力，甚至直接让页面崩溃；此乃 **<u>层爆炸</u>** 原理，[例子在此](https://segmentfault.com/a/1190000014520786)；
- 注意：但当需要 `repaint` 时，只需 `repaint` 本身，而不会影响到其他的层；

### 6-3-2、生成绘制列表

然后渲染引擎会将图层的绘制拆分成一个个绘制指令；比如先画背景、再描绘边框等，然后将这些指令按顺序组合成一个 **<u>待绘制列表</u>**，相当于制作一份绘制操作任务清单，可在 Chrome 开发者工具中的`Layers`面板观察绘制列表:

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001827.png" style="zoom:50%;" />



### 6-3-3、生成图块并栅格化(生成位图)

实际上在渲染进程中，绘制操作由专门的线程—**<u>合成线程</u>** 来完成：

- 首先，当绘制列表准备好后，**<u>渲染进程的主线程</u>** 会给 **<u>合成线程</u>** 发送 `commit` 消息，将 **<u>绘制列表</u>** 提交给 **<u>合成线程</u>**；
- 然后，为避免：<u>在有限视口内一次性绘制所有页面</u> 而造成的性能浪费，**<u>合成线程</u>** 需要先将图层 **分块**；
  - 注意：分块大小规格一般为 256 * 256 或 512 * 512 ，以加速页面首屏展示；
  - 注意：图块数据要进入 GPU 内存，而将数据从浏览器内存上传到 GPU 内存的操作较慢(即使绘制一部分图块也可能会耗费大量时间)，为解决此问题，Chrome 采用如下策略：首次合成图块时只采用一个 <u>低分辨率的图片</u> ，故首屏展示时只是展示此图片，继续进行合成操作，当正常图块内容绘制完毕后，才将当前低分辨率的图块内容替换；此亦 Chrome 底层优化首屏加载速度的一个手段；
- 然后，**<u>合成线程</u>** 会选择视口附近的 **图块**，优先将其交给 **<u>栅格化线程池</u>** 来生成位图；
  - 注意：渲染进程中专门维护一个 **<u>栅格化线程池</u>**，负责将 **图块** 转换为 **位图数据**；
  - 注意：生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给 **<u>合成线程</u>**；



### 6-3-4、显示器显示内容

生成图块并栅格化操作完成后，**<u>合成线程</u>** 会生成一个绘制命令—`DrawQuad`，并发送给浏览器进程的 **<u>viz组件</u>**，组件根据这个命令，将页面内容绘制到内存(缓冲)，然后把这部分内存数据发送给显卡；所以，当某个动画大量占用内存时，浏览器生成图像的速度变慢，图像传送显卡数据不及时，而显示器还是以不变频率刷新，因此会出现卡顿，出现明显的掉帧现象；

- 注意：无论是 PC 显示器还是手机屏幕，都有一个固定的刷新频率，一般是 60 HZ(60 帧、每秒更新60张图，停留 16.7 ms/图)，而每次更新的图片均来自于显卡的 **<u>前缓冲区</u>**；当显卡接收到浏览器进程传来的新的页面后，会合成相应的新图像，并将新图像保存到  <u>**后缓冲区**</u>；然后系统自动将 **<u>前缓冲区</u>** 和  **<u>后缓冲区</u>** 对换位置，如此循环更新；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001828.png" style="zoom:50%;" />





## 6-4、重排、重绘、合成

回顾渲染流水线：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001829.png" style="zoom:50%;" align=""/>

- 重绘是：当节点需要更改外观而不会影响布局的，比如改变 `color` 就叫称为重绘；
- 回流是：布局或几何属性需要改变就称为回流；



### 6-4-1、重排/回流

对 DOM 修改导致元素的尺寸或位置发生变化时，浏览器需要重新计算渲染树，触发重排/回流；

- 触发条件：对 DOM 结构的修改引发 DOM 几何尺寸变化时，会导致 **<u>重排(reflow)</u>**；
  - 页面初次渲染；
  - 元素字体大小变化；
  - 浏览器窗口大小改变；
  - 激活 CSS 伪类；比如 :hover；
  - DOM 元素的几何属性变化，常见的比如：`width`、`height`、`padding`、`margin`、`left`、`top`、`border` 等；
  - 元素尺寸、位置、内容发生改变；
  - 使 DOM 节点发生 `增减` 或 `移动`；
  - 读写 `offset ` 族、`scroll  `族、`client` 族属性时，浏览器为获取这些值，需要进行回流操作；
  - 查询某些属性或调用某些方法
    - clientWidth、clientHeight、clientTop、clientLeft
    - offsetWidth、offsetHeight、offsetTop、offsetLeft
    - scrollWidth、scrollHeight、scrollTop、scrollLeft
    - getComputedStyle()
    - getBoundingClientRect()
    - scrollTo()
- 回流过程：依照下面的渲染流水线，触发重排/回流时，若 DOM 结构发生改变，则重新渲染 DOM 树，然后将后续流程(含主线程外的任务)全部走一遍；相当于将解析和合成的过程重新又走了一篇，开销巨大；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001830.png" style="zoom:50%;" align=""/>



### 6-4-2、重绘

DOM 修改导致样式发生变化，但无影响其几何属性，触发重绘，而不触发回流；而由于 DOM 位置信息无需更新，省去布局过程，性能上优于回流；

- 触发条件：当 DOM 的修改导致样式变化，且没有影响几何属性时，会导致 **<u>重绘(repaint)</u>**；

- 重绘过程：由于没有导致 DOM 几何属性变化，故元素的位置信息无需更新，从而省去布局与建图层树过程，然后继续进行分块、生成位图等后面系列操作；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001831.png" style="zoom:50%;" align=""/>

- 注意：重绘跳过了 <u>生成布局树</u> 和 <u>建图层树</u> 阶段，直接生成绘制列表，然后继续进行分块、生成位图等后面一系列操作；
- 注意：重绘不一定导致重排，但重排一定发生了重绘；
- 注意：**<u>*重排比重绘的代价要更高*</u>**；有时即使仅仅重排一个单一的元素，其父元素及任何跟随它的元素也会产生重排；为避免频繁重排导致的性能问题，现代浏览器会对频繁的重排或重绘操作进行**<u>*优化*</u>**：浏览器会维护一个 flush 队列，以存放触发重排与重绘的任务，若队列中任务数量或时间间隔达到一个阈值时，浏览器就会将此队列任务一次性出队清空，进行一次批处理，如此可将多次重排和重绘变成一次；**<u>*但当*</u>**访问一些即使属性时，为获得此时此刻的、最准确的属性值，浏览器会提前将 flush 队列的任务出队：clientwidth、clientHeight、clientTop、clientLeftoffsetwidth、offsetHeight、offsetTop、offsetLeftscrollwidth、scrollHeight、scrollTop、scrollLeftwidth、heightgetComputedStyle()、getBoundingClientRect() 



### 6-4-3、合成

直接合成，比如利用 CSS3 的 `transform`、`opacity`、`filter` 等属性可实现合成效果，即  **<u>GPU加速</u>**；

补充：GPU加速即：在使用`CSS3`中的`transform`、`opacity`、`filter`属性时，跳过布局和绘制流程，直接进入非主线处理的部分，即交给合成线程；

- GPU 加速原因：在合成的情况下，会直接跳过布局和绘制流程，直接进入`非主线程`处理的部分，即直接交给 **<u>合成线程</u>** 处理：
  - 充分发挥 GPU 优势：**<u>合成线程</u>** 生成位图的过程中：会调用线程池，并在其中使用 GPU 进行加速生成，而 GPU 是擅长处理位图数据；
  - **<u>*无占用主线程资源*</u>**：即使主线程卡住，但效果依然能够流畅地展示；
- GPU 使用注意：GPU 渲染字体会导致字体模糊，过多 GPU 处理会导致内存问题；



### 6-4-4、注意事项

**回流必定触发重绘，重绘不一定触发回流；重绘的开销较小，回流的代价较高**；改变父节点里的子节点很可能会导致父节点的一系列回流；



### 6-4-4-1、最佳实践

CSS：

- 避免使用多层内联样式；
- 避免使用 CSS 表达式，比如 `clac()`；
- CSS 选择符 <u>从右往左</u> 匹配查找，避免节点层级过多；
- 使用 `visibility` 替换 `display: none`，前者只引起重绘，后者则触发回流；
- 避免使用 `table` 布局，可能很小的一个小改动会造成整个 `table` 的重新布局；
- 使用 `transform` 替代 `top`，`transform` 和 `opacity` 效果，不会触发 `layout` 和 `repaint;`
- 动画效果/动画元素，可使用绝对定位使其脱离文档流；减少频繁地触发回流重绘；
  - 比如：将动画效果应用到 `position`  属性为 `absolute` 或 `fixed` 元素上；

JavaScript：

- 避免频繁操作样式，可汇总后统一 <u>一次修改</u>；

- 避免频繁使用 `style`，而采用修改 `class` 方式；

- 极限优化时，修改样式可将其 `display: none` 后修改；

- 使用 `resize`、`scroll`  时进行防抖和节流处理，减少回流次数；

- 避免频繁读取会引发回流重绘的属性，若需多次使用则可考虑缓存；

- 避免频繁操作 DOM，减少 `dom `的增删次数，可使用 <u>字符串</u> 或 `documentFragment` 一次性插入；

  - 比如：使用 `createDocumentFragment` 进行批量 DOM 操作，修改完毕后，再放入文档流；
  - 比如：先使用 `display:none` 避开回流重绘，操作结束后再显示；

- 避免多次触发上面提到的那些会触发回流的方法，可使用变量将查询结果缓存，避免多次查询；

- 动画实现的速度的选择，动画速度越快，回流次数越多，也可选择使用 `requestAnimationFrame;`

- 将频繁重绘或者回流的节点提升为合成层，图层能够阻止该节点的渲染行为影响别的节点；比如对于 `video` 标签来说，浏览器会自动将该节点变为图层；

  - 设置节点为图层的方式有很多，我们可以通过以下几个常用属性可以生成新图层：
  - `will-change`
  - `video`、`iframe` 标签

- 添加 `will-change: tranform`：让渲染引擎为节点单独实现一图层；在变换发生时，仅利用 **<u>合成线程</u>** 去处理这些变换而不牵扯主线程，提高渲染效率；

  - 注意：值并非限制 tranform，任何可实现合成效果的 CSS 属性均可使用 `will-change` 来声明；[使用例子](https://juejin.im/post/5da52531518825094e373372)；

  - 注意：通俗说即利用 CSS3 的`transform`、`opacity`、`filter` 这些属性，以实现合成的效果，即`GPU`加速；

  - ```css
    #divId {
      will-change: transform;
    }
    ```



### 6-4-4-2、优化检测

当发生 `DOMContentLoaded` 事件后，就会生成渲染树，生成渲染树就可以进行渲染了，这一过程更大程度上和硬件有关系：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001832.png" style="zoom:50%;" />



### 6-4-5、与EventLoop关系

- 首先，当 Eventloop 执行完 Microtasks 后，会判断 `document` 是否需要更新，因为浏览器是 60Hz 的刷新率，每 16.6ms 才会更新一次；
- 然后，判断是否有 `resize` 或者 `scroll` 事件，有则触发，所以 `resize` 和 `scroll` 事件也是至少 16ms 才会触发一次，并且自带节流功能；
- 然后，判断是否触发了 media query；
- 然后，更新动画并且发送事件；
- 然后，判断是否有全屏操作事件；
- 然后，执行 `requestAnimationFrame` 回调；
- 然后，执行 `IntersectionObserver` 回调，该方法用于判断元素是否可见，可用于懒加载，但兼容性不好；
- 最后，更新界面；
- 注意：以上是一帧中可能会做的事情；若在一帧中有空闲时间，就会去执行 `requestIdleCallback` 回调；[详看](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)



## 6-X、实际问题

### 6-X-1、DOM 操作性能问题

原因：因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西；通过 JS 操作 DOM 时，涉及到两个线程间的通信，势必会带来一些性能上的损耗。操作 DOM 次数一多，也就等同于一直在进行线程间的通信，且操作 DOM 可能还会带来重绘回流的情况，所以也就导致了性能上的问题；改进：

- `requestAnimationFrame`  方式去循环的插入 DOM；
- 虚拟滚动 (virtualized scroller)：只渲染可视区域内的内容，非可见区域的完全不渲染，当用户在滚动的时就实时去替换渲染的内容  [react-virtualized](https://github.com/bvaughn/react-virtualized)；



### 6-X-2、渲染阻塞问题

- 首先，渲染的前提是生成渲染树，故 HTML 和 CSS 势必会阻塞渲染；
  - 优化：若想渲染快，可降低初始所需的渲染的文件 大小，并且扁平层级，优化选择器；
  - 注意：CSS 由单独的下载线程异步下载，由于 DOM 树的解析和构建此步与 css 并无关系，故并不会影响 DOM 解析，但最终布局树需要 DOM 树和 DOM 样式的，因此 CSS 会阻塞布局树的建立；
- 然后，当浏览器在解析到  `script ` 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始(即 script 会阻塞页面渲染)；
  - 因为：JS属于单线程，在加载 `script` 标签内容时，渲染线程会被暂停，因 `script`标签中内容可能会操作`DOM`，若加载`script`标签的同时渲染页面就会产生冲突，渲染线程(`GUI`)和 JS 引擎线程是互斥的；
  - 优化：若想首屏渲染快，一般而言不应在首屏时就加载 JS 文件，而将 `script` 标签放在 `body` 标签底部；
  - 优化：若想首屏渲染快，亦可给 `script` 标签添加 `defer` 或 `async` 属性：
    - `defer` 属性表示该 JS 文件会并行下载，但会放到 HTML 解析完成后顺序执行，此时的 `script` 标签可放在任意位置；
    - 对于没有任何依赖的 JS 文件可以加上 `async` 属性，表示 JS 文件下载和解析不会阻塞渲染；
    - 注意：一般脚本与 DOM 元素和其它脚本间的依赖关系不强时会选用 async；当脚本依赖于 DOM 元素和其它脚本的执行结果时会选用 defer；

### 6-X-2-1、script 引入方式

- JS 动态插入 `<script>`

- HTML 静态引入 `<script>` 
  - `<script defer>`：延迟加载，元素解析完成后执行；
  - `<script async>`：异步加载，但执行时会阻塞元素渲染；



### 6-X-3、关键渲染路径问题

不考虑缓存和优化网络协议，只考虑可以通过哪些方式来最快的渲染页面：

- 从文件大小：前略；
- 从 `script` 标签使用：前略；
- 从 CSS、HTML 的代码书写：前略；
- 从需要下载的内容是否需要在首屏使用：前略；



