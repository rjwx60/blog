# 二、CSS

## 2-1、盒模型

### 2-1-1、问题

不加声明：浏览器自身理解，IE 使用 IE盒子模型；

- 盒子范围：margin、content (元素宽高 - width & height：border、padding、content)


加上声明：浏览器遵从标准，均使用 标准盒子模型；

- 盒子范围：margin、border、padding、content (内容宽高 - width、height)
- 导致 content-box 情况下，宽高设置与实际表现不符 (设置的是内容宽高，但想要效果为元素宽高)

### 2-1-2、解决

`box-sizing: content-box`：W3C盒模型，又名标准盒模型，元素的宽高大小表现为内容的大小；

`box-sizing: border-box`：IE盒模型，又名怪异盒模型，元素的宽高表现为内容 + 内边距 + 边框的大小、背景会延伸到边框的外沿；

- inherit：继承父级 box-sizing 属性值；
- content-box：计算 content 宽高；(整体宽高会改变)
- padding-box：计算 content + padding 宽高；(整体宽高不随后期 border 值改变而改变)
- border-box：计算 content + padding + border 宽高；(整体宽高不随后期 padding、border 值改变而改变)

### 2-1-3、注意事项

- 盒子高度，使用百分比，则总会采用盒子内容高度；
- 盒子背景，由颜色、图像组成，可通过 background 引入，还可通过 background-clip 设置画布；
- 盒子轮廓，outline 不属于盒模型一部分，在盒子的上面一层，ouline 是画在边界框之外，外边距区域之内；

```js
// 只能获取内联样式设置的宽高
dom.style.width/height

// 获取渲染后即使运行的宽高，只支持IE
dom.currentStyle.width/height

// 获取渲染后即时运行的宽高，兼容性很好
dom.getComputedStyle.width/height

// 获取渲染后即时运行的宽高，兼容性很好，一般用来获取元素的绝对位置
dom.getBoundingClientRect().width/height
```



### 2-1-X、display 补充

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151258.png" style="zoom:50%;" align=""/>





## 2-2、层叠上下文

<u>**层叠上下文是元素提升为一个比较特殊的图层(GPU加速，效率提升)，在三维空间中 (z轴) 高普通元素一等；**</u>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151259.png" style="zoom:30%;" align=""/>

**<u>*触发条件*</u>**

- 根层叠上下文(`html`)
- `position`
- css3属性
  - `flex`
  - `transform`
  - `opacity`
  - `filter`
  - `will-change`
  - `-webkit-overflow-scrolling`

**<u>*层叠等级：层叠上下文在z轴上的排序*</u>**

- 在同一层叠上下文中，层叠等级才有意义；
- `z-index` 的优先级最高；



### 2-2-1、z-index 

**<u>z-index 深度属性：默认值auto = 0；</u>**

**<u>生效条件：除 static 以外的值：fixed、relative、absolute</u>**（貌似加了float属性会令z-index失效，待证）

**<u>继承父级：z-index: inherit；</u>**

注意：父级设置有效的z-index，则子级无论设置如何的z-index，均会在父级上方；

情景1：如下例题：如何让 subtop 在 insert上面，subbottom 在 insert 下面:

- 解释1：如下解题；

情景2：两同级、Azindex > Bzindex；

- 解释2：若 A子zindex < B子zindex、A 还是覆盖 B；

情景3：两元素，一定位，一无定位；

- 解释3：定位元素覆盖未定位元素，即便定位的那个只是用了position: relative；

情景4：两元素，均无定位，或均设置定位且值相同，z-index也相同

- 解释4：按文档流顺序显示；

情景5：

```
<div class="insert"></div>  
<div class="parent">  
    <div class="subtop"></div>  
    <div class="subbottom"></div>  
</div>  
```

insert 设置 relative，z-index层级为100

parent 不做任何设置

subtop 设置 relative，z-index层级为<100

subbottom 设置 relative，z-index层级为>100

但若上述父标签 position 属性为relative，就会无效，即不能置底



### 2-2-2、position

**<u>*absolute*</u>** ：**<u>含义：生成绝对定位的元素，相对于 static 定位以外的第1个父元素进行位移、不占位、默认相对于 html 元素；</u>**

- 注意： position 的属性值为 absolute 或者 relative 即可充当相对父级；


**<u>*relative*</u>**：生成相对定位的元素，相对于其自身位置进行位移、占位、不改变原有 display 属性；

- 注意：应用 relative / absolute 元素，margin属性仍有效、应避免如此使用，减少干扰因素；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912173420.png" alt="截屏2020-09-12 下午5.34.13" style="zoom:50%;" align=""/>

- 应用 absolute 会忽略根元素 padding (很废我也知道)

- 行内元素应用 absolute 后会改变display (很废我也知道)

- 在 IE6/7 中设置 position 会导致 z-index 属性失效

- - 解决：父元素设置更大的 z-index 值即可；

- 应用 absolute / relative 后，会覆盖其他非定位元素

- - 可将 z-index 设置成-1解决；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912173504.png" alt="截屏2020-09-12 下午5.34.58" style="zoom:50%;" align=""/>

**<u>*static*</u>**：默认值、正常流；

**<u>*inherit*</u>**：从父元素继承 position 属性值； 

**<u>*fixed*</u>**：**<u>生成绝对定位的元素，相对于浏览器窗口进行位移</u>**、不占位；fixed 与 absolute 共同点：

- 均会改变行内元素的呈现模式，改变 display 为 block；
- 均会让元素脱离普通流，不占据空间；
- 默认会覆盖到非定位元素上；

fixed 与 absolute 区别：前者固定为浏览器窗口，后者可设置相对父级；

**<u>*sticky*</u>**：实验属性





## 2-3、浮动

### 2-3-1、浮动初衷

**<u>初衷是用于文字环绕，即在图文混排时可很好的使文字环绕在图片周围；</u>**

**<u>当元素浮动后可向左或向右移动，直到它的外边缘碰到包含它的框或者另外一个浮动元素的边框为止；</u>**



### 2-3-2、浮动特性

破坏性：<u>**浮动元素脱离普通流(引起高度塌陷—一个块级元素如果没有设置高度，其高度是由子元素撑开的。如果对子元素设置了浮动，那么子元素就会脱离文档流，也就是说父元素没有内容可以撑开其高度，这样父级元素的高度就会被忽略)**</u>，且 display 值变为 block ；

包裹性：**<u>体现在原本默认撑满行的 div 缩小至内容宽度</u>**；

- 补充：只有横向浮动；浮动元素的前一元素不会受到任何影响，但后一元素会围绕着浮动元素
- 补充：若 position: relative  同处 float，先浮动，再根据 position 的 left 等值移动，可清浮动，因为创建了BFC；
- 补充：若 position: absolute 同处 float，float失效，也无法清浮动；

重叠问题：

*   行内元素与浮动元素发生重叠，其边框、背景和内容都会显示在浮动元素之上
*   块级元素与浮动元素发生重叠时，边框和背景会显示在浮动元素之下，内容会显示在浮动元素之下

浮动元素的展示在不同情况下会有不同的规则

*   浮动元素在浮动的时候，其 margin 不会超过包含块的 padding
*   如果两个元素一个向左浮动，一个向右浮动，左浮动元素的 margin-right 不会和右元素的 margin-left 相邻
*   如果有多个浮动元素，浮动元素会按顺序排下来而不会发生重叠
*   如果有多个浮动元素，后面的元素高度不会超过前面的元素，并且不会超过包含块
*   如果有非浮动元素和浮动元素同时存在，并且非浮动元素在前，则浮动元素不会高于非浮动元素
*   浮动元素会尽可能地向顶端对齐、向左或向右对齐





### 2-3-3、闭合浮动

- **<u>*添加额外标签*</u>**

  - FD元素后面 + clear: both 的兄弟元素；有违结构与表现的分离

  - FD元素后面 + clear="all | left | right | none" 的  br 元素；有违结构与表现的分离 

  - ```html
    <div class="parent">
        // 添加额外标签并且添加 clear 属性
        <div style="clear:both"></div>
        //亦可添加 br 标签
    </div>
    ```

- **<u>*触发 BFC*</u>**：

  - FD元素父级 + overflowHidden/Auto 触发 BFC；IE6 则加 zoom 触发 hasLayout；

  - FD元素父级 + displayTable 触发 BFC；

  - FD元素父级 + 浮动 触发 BFC；破坏布局；

  - ```html
    <div class="parent" style="overflow:hidden">//auto 也可以
        //将父元素的overflow设置为hidden
        <div class="f"></div>
    </div>
    ```

上述闭合浮动的本质：

- 或末尾创建元素，闭合之前元素的浮动；
- 或触发BFC / hasLayout 闭合浮动；

但或多或少存在问题，比如<u>触发 BFC 衍生各种问题、影响布局 & 结构分离</u>等；

解决：<u>使用伪元素，FD元素父级 + 伪元素 content、height: 0、display: block、*zoom:1、clear:both</u>

- **<u>*建立伪类选择器清除浮动：*</u>**

  - ```html
    // 在 css 中添加 :after 伪元素
    .parent:after{
        /* 设置添加子元素的内容是空 */
        content: '';  
        /* 设置添加子元素为块级元素 */
        display: block;
        /* 设置添加的子元素的高度0 */
        height: 0;
        /* 设置添加子元素看不见 */
        visibility: hidden;
        /* 设置clear：both */
        clear: both;
    }
    <div class="parent">
        <div class="f"></div>
    </div>
    
    // 更为规范的写法1
    .clearfix:after {
    	content: '/200B',
    	display: block;
    	height: 0;
    	clear: both;
    }
    .clearfix {
    	*zoom: 1;
    }
    
    // 更为规范的写法2
    .clearfix:after {
    	content: '/200B',
    	display: table;
    	clear: both;
    }
    .clearfix {
    	*zoom: 1;
    }
    ```

  - 注意：**<u>*clear：是对当前元素产生约束，约束的边界为其他的浮动元素，以避免其某一边有浮动元素*</u>**；已浮动的元素，设置 *clear* 是无效;

  - 注意：display:table 和 display:block区别：前者会创建一个匿名框，其创建 BFC 以闭合浮动；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151300.png" style="zoom:50%;" align=""/>





### 2-3-X、BFC

含义：Block Formatting Context—**<u>BFC 块级格式上下文、页面盒模型布局中的一种 CSS 渲染模式、隔离的渲染区域；</u>**

**<u>Box：CSS 布局的基本单位</u>**

Box 是 CSS 布局的对象和基本单位，直观来说，一个页面有很多个 Box 组成。元素的类型和 display 属性，决定了这个 box 类型；不同的 box，会参与不同的 Formatting Context(一个决定如何渲染文档的容器)，因此 box 内的元素会以不同的方式渲染；常见盒子：

*   block-level box：display 属性为 block，list-item，table 元素，会生成 block-level box
*   inline-level box：display 属性为 inline，inline-block，inline-table 的元素，会生成 inline-level box
*   run-in box：css3 特有

**<u>Formatting Context</u>**

Formatting Context 是 W3C CSS2.1 规范中的一个概念；它是页面的一块渲染区域，且有一套渲染规则，决定了其子元素如何定位，以及和其他元素的关系和相互作用；常见的 Formatting Context 有 Block formatting context 和 Inline formatting context

特点：**<u>相当于一个独立的容器，里面的元素和外部的元素相互不影响</u>；**

创建：

- 根元素
- `float` !== `none`
- `ovevflow` !== `visible`
- `position: absolute/fixed`
- `display: inline-block / table / table-cell / grid / table-caption / flex / inline-flex`
- 其他方式：网格布局、contain 值为 layout、content 或 strict 的元素等；

特性：

- 不同 BFC 间，不会发生外边距塌陷(可用于解决相邻元素边距塌陷问题)；
- 计算 BFC 高度时，浮动元素也参与计算(即内部有浮动元素时也不会发生高度塌陷，可用于解决子元素浮动父级高度塌陷问题)；
- BFC 区域，不会与 float 元素区域重叠 (可用于去除文字环绕)；
- BFC 中每个子元素的左外边缘(margin-left)会触碰到容器的左边缘(border-left)(对于从右到左的格式来说，则触碰到右边缘)；
- BFC 是页面上的一个隔离、独立容器，不受外界干扰或干扰外界；
  - 属于同一个 BFC 的两个相邻 Box 垂直排列
  - 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠

应用：

- 固定浮动 (上述特性2，BFE高度计算包含浮动元素)
- 避免外边距重叠问题：防止同一 BFC 容器中的，相邻元素间的，外边距重叠问题 (上述特性1)
- 防止父级，与第一个子级元素的 margin-top 重叠
- 去除 float 文字环绕 (上述特性3)
- 自适应两栏布局
- 注意 - 创建 BFC 带来衍生问题：
  - position： 脱离文档流
  - float：包裹性，失去流体自适应性；
  - overflow:hidden：无法整站地，大规模地使用；
  - display:inline-block：元素尺寸包裹收缩 失去block水平的流动特性；



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151301.png" style="zoom:45%;" align=""/>









### 2-3-Y、IFC

含义：Inline Formatting Context—IFC 内联格式化上下文，我理解为 4 种内联盒子：

**<u>*containing box*</u>**

- 外层盒子模型，包含以下盒子，高度由一个个 line box 堆叠而成：
- **<u>*line box*</u>**
- 高度：由其包含的所有 inline boxes 中 line-height 最高者决定；
- 作用：监听 inline boxes 的 line-height 值，获取最大值后上传父级，最后形成高度；
  - **<u>*inline boxes*</u>** 
  - 作用：定义 line-height；
  - 意义：CSS中起高度作用的是 height & line-height；
  - 注意：若无定义 height 属性，则最终呈表现作用一定为 line-height；
    - **<u>*content area*</u>**
    - 无描述

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912162548.png" alt="截屏2020-09-12 下午4.25.43" style="zoom:50%;" align=""/>

注意：line boxes 高度实际是由 line-height 来决定

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912162812.png" alt="截屏2020-09-12 下午4.28.07" style="zoom:50%;" align=""/>

注意：vertical-middle 起效前提：元素为 inline水平元素、table-cell元素、display 为 inline、display 为 table-cell 元素；

- 比如：span、img、input、button、td；

注意：display:inline-block + text-align:justify 可实现自动等宽水平排列，并随浏览器自适应；问题：换行符/空格间隙：

- block 元素 inline-block，IE6/7无此，其他均有；
- inline 元素 inline-block，所有均有；

解决1：font-size:0，去除换行符间隙，在IE6/7下残留1像素间隙，Chrome浏览器无效，其他浏览器都完美去除；

解决2：letter-spacing 负值，可去除所有浏览器换行符间隙，但Opera下极限间隙1像素，而0像素会反弹；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912162735.png" alt="截屏2020-09-12 下午4.27.19" style="zoom:50%;" align=""/>

注意：vertical-middle 取值：

baseline：默认值，基线对齐，与父元素的基线对齐；

top：与行中最高元素顶端对齐，一般是父级元素最顶端；

middle：与父元素中线对齐（近似但不绝对垂直居中）

bottom：与行中最低元素顶端对齐；

sub、super：以合适基线作为对齐基线进行对齐，效果类似super & sub标签，但不缩放字体大小；

text-top：与父级元素 content area 顶端对齐，不受行高以及周边其他元素影响；

text-bottom：与父级元素content area的低端对齐，不受行高以及周边其他元素影响；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912163007.png" alt="截屏2020-09-12 下午4.30.01" style="zoom: 33%;" align=""/>

注意：纯div下加img元素，底部会有间隙；原因是默认状态时，文本按照基线对齐，图片和div底部空隙是为了留出空间给文本基线以下内容

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912163113.png" alt="截屏2020-09-12 下午4.31.08" style="zoom:50%;" align=""/>





### 2-3-G、区别

**<u>*BFC、IFC、GFC 和 FFC 区别*</u>**

块级格式化上下文 BFC：

- 定义：同上
- 使用：常见布局、或需要相对隔离环境下的元素；

内联格式化上下文 IFC：

- 定义：自行搜索；
- 使用：设置IFC后，通过 text-align:center 或 vertical-align:middle 可实现行内水平垂直居中；

网格布局格式化上下文 GFC：

- 定义：为元素设置display：grid 时获得的独立渲染区域；
- 使用：自行搜索；

自适应格式化上下文 FFC：

- 定义：为元素设置display：flex/inline-flex 时获得的自适应容器：
- 使用：自行搜索；



### 2-3-Z、margin 塌陷 + 负值

- 常用：margin: 0 auto 居中
- margin 在空间有剩余的同时，若左右margin为auto，将会均分剩余空间，但若上下margin为auto，其计算值为0



### 2-3-Z-1、margin 塌陷

定义：普通文档流中，相邻块级元素的垂直外边距合并(非缺陷，段落相邻需要塌陷)；问题如下：

- 比如：同级、相邻元素合并(1个marginBottom，1个marginTop)；
- 比如：父子、首个元素合并(marginTop)；
- 比如：父子、末个元素合并(marginBottom)；
- 比如：空块，元素上下合并；
- 注意：自身元素，需保证无 minHeight、height、lineBox(即没有内容)才能触发；
- 注意：相邻元素，需保证无 padding、bord

<u>*解决：创建 BFC，比如：行内框、浮动框、定位框；*</u>

- 计算：同号计算，Math.max(绝对值1，绝对值2)；
- 计算：异号计算，绝对值后相加；



### 2-3-Z-2、margin 负值

- 静止元素负值 margin(left/top)，元素向 left/top 位移；
- 静止元素负值 margin(right/bottom)，元素却不向 right/bottom 位移，而会减少自身供 CSS 读取的高度，影响下方元素位置；
  - 表现：后续的元素拖拉进来并覆盖当前元素；

- 注意：元素不存在宽度值，或 width: auto 时，负值 margin 会增加元素宽度；
- 注意：元素上下相邻，且两者 margin 均为负值时，效果不叠加，取负值最大的效果；

- 注意：单独使用负值 margin 不会破坏页面的文档流；使用负 margin 上移一个元素，所有跟随的元素都会被上移，而 relative 定位的负值 margin 元素则不同，会保留原位置，影响文档流；



## 2-4、布局

水平居中

- 行内元素: `text-align: center`
- 块级元素: `margin: 0 auto`
- `absolute + transform`
- `flex + justify-content: center`

垂直居中

- `line-height: height`
- `absolute + transform`
- `flex + align-items: center`
- `table`

水平垂直居中

- `absolute + transform`
- `flex + justify-content + align-items`





### 2-4-1、经典布局

DIV+CSS 布局

1. 代码精简，且结构与样式分离，易于维护
2. 代码量减少了，减少了大量的带宽，页面加载的也更快，提升了用户的体验
3. 对SEO搜索引擎更加友好，且H5又新增了许多语义化标签更是如此
4. 允许更多炫酷的页面效果，丰富了页面
5. 符合W3C标准，保证网站不会因为网络应用的升级而被淘汰
6. 缺点：不同浏览器对web标准默认值不同，所以更容易出现对浏览器的兼容性问题



### 2-4-1-1、垂直居中

- verticalAlignMiddle
- verticalAlignMiddle+displayInlineBlock+伪元素
- 单个元素：position + transformY
- 单行文本：height + line-height
- 多个元素：flex 或 嵌套 使用flex

- **<u>*单行文本+行内+行内块级元素：*</u>**
  - 父级：设置 等值高度 + 行高
  - 父级：设置 after 伪类 displayInlineBlock、verticalAlignMiddle、content、height100%；
    - 元素：设置 displayInlineBlock、verticalAlignMiddle(未经验证)；
  - 元素：内联、设置同值上下内边距
  - 优劣：简单、兼容性、单行、固定高度
- **<u>*多行文本+行内+行内块级元素：*</u>**
  - 父级：设置高度+行高 (行高值根据行数划分，如150高，分5行，则设30)
    - 元素：文本用span包裹；
  - 父级：设置 textAlignCenter
    - 元素：文本用span包裹、设置 margin，故意让其 margin 塌陷；
  - 父级：设置 displayTable、textAlignCenter
    - 元素：文本间用 `<br>` 分割、设置 displayTableCell、verticalAlignMiddle；
  - 父级：设置 displayTableCell、verticalAlignMiddle、宽高；
    - 元素：设置 displayInlineBlock、verticalAlignMiddle；
  - 父级：设置 displayTableCell、verticalAlignMiddle、testAlignCenter
    - 元素：文本用span包裹、设置 displayInlineBlock、verticalAlignMiddle、fontSize0；
    - 注意：父级不能浮动，元素 verticalAlignMiddle 可省略
    - 注意：设置fontSize0，因为里面有文字啊
    - 注意：displayTableCell & margin共用，margin失效，可用padding替换解决
    - 注意：父级宽度足够，以上操作不会换行；宽度不够，才会居中文本
  - flex布局
- **<u>*图片*</u>**
  - 父相子绝 + transform
  - 父级：设置高度 + 行高、并用 fontSize0 消除幽灵空白节点影响；
    - 元素：设置 verticalAlignMiddle
    - 注意：不加 fontSize0，位置会偏上；
    - 注意：或将verticalAlign设为Bottom / top
    - 注意：或将Img元素变为块级元素，使其脱离行内基线影响 
    - 注意：慎用line-height为0
    - 优劣：简单、兼容、需加 fontSize0、父级和元素之间需有换行/空格
- **<u>*单个元素*</u>**
  - 父级：设置 displayTabel、加高度(不可为%值)；
    - 元素：设置 displayTableCell + VerticalAlignMiddle
    - 注意：因设置table-cell，故元素宽高度百分比值无效，需要给它的父元素设置display: table; 才生效； 
    - 注意：table-cell不感知margin，在父元素上设置table-row等属性，也会使其不感知height；
    - 注意：设置float或position会对默认布局造成破坏
    - 注意：内容溢出时会自动撑开父元素
    - 注意：使用displayTableCell，会占满一行影响右边内容的布局
  - 结构：A -> (B+C)
    - A 设置高度，相对定位 
      - B&C 设置 displayInlineBlock + verticalAlignMiddle 
      - B/C 设置与A一致的高度 + fontSize0 
  - 父相子绝，设置 transform、top  (用于未知高度)
  - 父相子绝，设置 marginTop、top (元素高度需设置)
  - 父相子绝，设置 top0、bottom0、margin auto 0、高度
    - 原理：当top、bottom为0、margin-top + bottom会无限延伸占满空间并且平分；
    - 注意：文艺点的说法是格式化宽度；
  - 父级：设置displayFlex、AlignItemsCenter
  - 父级：设置displayFlex、元素：设置 AlignSelfCenter
  - 父级：设置displayFlex、元素：设置 margin auto 0
    - IE89不支持，需要浏览器前缀
- **<u>*多个元素*</u>**
  - 父级设置：displayFlex、AlignItemsCenter；
  - 父级设置：displayFlex、元素：设置 AlignSelfCenter；
  - 父级设置：displayFlex、FlexDirectionColumn、JustifyContentCenter；



### 2-4-1-2、水平居中

- 不限元素：text-align:center + display:inline-block；
- 单个元素：margin: 0 auto + 定宽且宽度小于父级的宽；
- 单个元素：position + transform:translateX()；
- 不限元素：display:flex + justify-content: center ；
- 不限元素：display:flex +  margin: 0 auto；
- 单个浮动：width:fit-content +  margin: 0 auto；
- 多个浮动：去除覆盖浮动再处理；

- **<u>*文本+行内+行内块级元素*</u>**
  - 父级：设置 text-align:center
  - 优劣：简单、兼容好、自由宽高、仅限行内有效、属性有继承性(前提:后代内容宽度<此宽度)
- **<u>*单个块级元素*</u>**
  - 元素：设置 margin: 0 atuo、定宽且宽度<父级；
    - 注意：低版本的浏览器还需设置父级 textAlignCenter；
  - 元素：设置 display:table、margin:0 auto；
    - 优劣：简单、兼容性好、须定宽、子宽须<父级；
- **<u>*多个块级元素*</u>**
  - 父级：设置 text-align:center；
    - 元素：设置 display:inline-block；
  - flex布局
    - 优劣：简单、兼容性好、仅限行内有效、属性有继承性、换行/空格会产生元素间隔；
- **<u>*单个不论块级行内元素*</u>**
  - 绝对定位：父级相对，子级绝对，利用 left:50% 和 transform:translateX(-50%)
  - flex布局：
    - 优劣：简单、宽高可不定、脱离文档流、兼容性差ie9+；
- **<u>*多个不论块级行内元素*</u>**
  - flex布局：
    - 父级：设置 display:flex；
    - 子级：设置 margin: 0 auto
      - 优劣：简单、宽高可不定、兼容性差
- **<u>*单个浮动元素*</u>**
  - 父级：设置 margin0 auto、宽度 fit-content (收缩但保持block水平);
    - 缺点：严重兼容性问题；
- **<u>*多个浮动元素*</u>**
  - 去浮动、去margin、加 display:inline-block + text-align:center；
  - 父相子绝：宽度固定、left50%、marginLeft负值0.5*元素宽度值；
  - 父相子绝：宽度固定、left0、right0、margin0 auto；
    - 缺点：须知宽高

- **<u>*宽度确定的块级元素*</u>**
  - width和margin实现。margin: 0 auto;
  - 绝对定位和margin-left: -width/2, 前提是父元素position: relative

- **<u>*宽度未知的块级元素*</u>**
  - table 标签配合margin左右auto实现水平居中。使用table标签(或直接将块级元素设值为display:table)，再通过给该标签添加左右margin为auto。
  - inline-block 实现水平居中方法。display：inline-block和text-align:center实现水平居中。
  - 绝对定位+transform，translateX可以移动本身元素的50%。
  - flex布局使用 justify-content:center



### 2-4-1-3、垂直水平居中

<u>flex布局：</u>

- **<u>父级：设置 JustifyContentCenter、AlignItemsCenter</u>**
- **<u>父级：设置 JustifyContentCenter，元素：设置 AlignSelfCenter 或 MarginAuto</u>**

**<u>相对绝对布局，父相子绝</u>**

- 元素：**<u>设置 Transform、 left、top；</u>**
- 元素：**<u>设置 left、top、bottom、right均=0、marginAuto；</u>**
- 元素：设置 负值margin宽高值、left=0、top=0 (宽高已知)；

table布局

- 父级：设置 displayTableCell、textAlignCenter、verticalAlignMiddle；
  - 元素：设置 displayInlineBlock、verticalAlignMiddle；
- 父级：设置 displayTableCell、textAlignCenter、verticalAlignMiddle；
  - 元素：设置 margin0 auto；
  - 注意：设置tabl-cell的元素的宽高百分比无效，需将父级设置display: table；
  - 注意：内容溢出时会自动撑开父元素；

传统布局：

- 父级：设置 固定lineHeight、textAlignCenter、fontSize0；
  - 元素：设置 displayInlineBlock、verticalAlignMiddle；
  - 注意：须知元素高度
- 父级：使用button标签、设置outlineNone、borderNone；
  - 元素：设置 displayInlineBlock；
  - 注意：button 在IE下点击会有凹陷效果；
  - 注意：button 自带 textAlignCenter；
- 伪元素实现：
  - 父级：设置 textAlignCenter
  - 父级 before 或 after 伪元素：displayInlineBlock + verticalAlignMiddle、高度100%、宽度0、content为空；
    - 子级：设置 displayInlineBlock、verticalAlignMiddle
- calc实现
  - 元素：设置padding: calc((100% - 100px) / 2); 

- Grid布局：
  - 父级：设置display: grid;
    - 元素：设置justify-self: center、align-self: center;

相对于屏幕的垂直水平居中

- 结构：A->B->C三层结构
  - A：displayTable + positionAbsolute + width: 100% + height: 100%
    - B：displayTableCell + verticalAlignMiddle
      - C：margin: 0 auto; width: xxpx；

另类布局：

- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151302.png" style="zoom:45%;" align=""/>
- 结构：A+B
  - A 左浮动，设置高度50%，负值marginBottom120px
  - B clearBoth，高度240px; 相对定位
  - 优势：适用于所有浏览器；
  - 缺点：空间不够时，B不会截断，会出现滚动条；



### 2-4-2、常见布局

### 2-4-2-1、多列布局

flex 实现

- 父级 flex、子级设置 flexNumber；

table 实现

- 父级 displayTable + table-layoutFixed、子级 displayTableCell；

float 实现

- 父级 BFC、子级 floatLeft；

Grid 实现

- 。。。

### 2-4-2-2、两列布局

### 2-4-2-2-1、左列定宽+右列自适应

普通布局：

- 结构：1+2相邻；
- 其中：1floatLeft、宽度固定；
- 其中：2marginLeft值为1宽、1+2高度固定；

左右浮动+负值margin

- 结构：1+2相邻、2含子3；
- 其中：1floatLeft、宽度固定；
- 其中：2floatRight、宽度100%、2marginLeft负值为1宽；
- 其中：3marginLeft值为1宽、1+3高度固定；

BFC 布局

- 结构：1+2相邻；
- 其中：1floatLeft、宽度固定；
- 其中：2设置BFC、1+2高度固定；

table 布局

- 结构：1>(2+3)；
- 其中：1displayTable、宽度100%、高度固定；
- 其中：2+3displayTableCell、2宽度固定；

position 布局

- 结构：1>(2+3)；
- 其中：1positionRelative
- 其中：2+3positionAbsolute、2left0、宽高固定、3left值为2宽、right0、高度固定；

flex 布局

- 结构：1>(2+3)；
- 其中：1displayFlex、宽度100%、高度固定；
- 其中：2宽度固定；
- 其中：3flex为1；

grid 布局

- 。。。

- 双 inline-block 实现
  - 。。。
- 双 float 实现
  - 。。。

### 2-4-2-2-2、左列自适应+右列固定

布局1：

- 结构：1>(2+3)；
- 其中：1paddingLeft值为3宽；
- 其中：2floatLeft、宽度100%，marginLeft为负值3宽；
- 其中：3floatRight；

布局2：

- 结构：1>(3+2)；
- 其中：2floatRight、marginLeft为0、宽度固定；
- 其中：3overflowHidden；

布局3：

- 结构：1>(2+3)；
- 其中：1displayTable、宽度100%、高度固定；
- 其中：2+3displayTableCell、3宽度固定；

布局4：绝对定位、flex、grid



### 2-4-2-3、三列布局

### 2-4-2-3-1、左中定宽+右侧自适应

flex 实现：

- 父1、子2+3+4、其中2+3定宽、4设置flex=1；

BFC 实现：

- 父1、子2+3+4、其中2+3floatLeft、4设置BFC；

margin 实现：

- 父1、子2+3+4、其中2+3floatLeft、4设置marginLeft为2+3的宽度和；

table 实现： 

- 父1、子2+3+4、其中1displayTable、2+3+4displayTableCell、2+3定宽；

Grid 实现：

- 。。。





### 2-4-2-3-2、左右定宽+中间自适应

**<u>*左右浮动+margin正值*</u>**

- 结构：1+2+3同级；

- 其中：设置1floatLeft、2floatRight、设置3margin右左值分别为2宽和1宽、父级固定浮动；

**<u>*双飞翼布局*</u>**

- 结构：1+2+3、1有子4(其中1为center、2为left、3为right)
- 其中：设置1floatLeft、宽度100%、高度固定；
- 关键：设置4margin右左值分别为3宽和2宽度
- 此外：设置2floatLeft、marginLeft负值100% (移动到center1左边)、宽度固定；
- 此外：设置3floatLeft、marginLeft负值selfWidth(移动到center1右边)、宽度固定；

**<u>*圣杯布局*</u>**

- 结构：1>(2+3+4)(其中1为container、2为center、3为left、4为right)
- 关键：设置2宽度100%、2+3+4floatLeft (依据流体布局，3+4将会被下挤)；
- 此后：设置3marginLeft值负值100% (margin百分比值相对于父级宽度，此后3将移动到2左侧)；
- 此后：设置4marginLeft值负值selfWidth (此后4将移动到2右侧)；
- 此后：设置1padding左右值分别为3宽和4宽(避免内容被遮盖)；
- 此后：设置3+4positionRelative值各自左右移动自身宽度(解决上一步出现的白条问题)；

**<u>*table布局*</u>**

- 结构：parent1、sonLeft2、sonCenter3、sonRight4；
- 其中：设置1displayTable、宽度100%、高度固定；
- 其中：设置2+3+4displayTableCell、2+4宽度固定；

**<u>*flex布局*</u>**

- 结构：parent1，sonLeft2，sonCenter3，sonRight4；
- 其中：设置1displayFlex、高度固定；
- 其中：设置3Flex、2+4宽度固定；

**<u>*使用position实现*</u>**

- 结构：parent1，sonLeft2，sonCenter3，sonRight4；
- 其中：设置1positionRelative；
- 其中：设置2+3+4positionAbsolute、2Left0、4Right0、宽度固定、高度固定；
- 其中：设置3marginLeft值2宽、3marginRight值4宽；

**<u>*Grid 实现*</u>**

- 。。。

### 2-4-2-3-3、双飞和圣杯布局区别

- 解决一致：左右定宽，中间自适应，中间栏要在放在文档流前面以优先渲染；
- 思路相似：
  - 首先，三栏全部 float 浮动；
  - 然后，让中间盒子 100% 宽度占满同一高度的空间，此时左右两个盒子被挤出中间盒子所在区域；
  - 再用，margin-left 的负值将左右两个盒子拉回与中间盒子同一高度的空间；
  - 然后，调整来避免中间盒子的内容被左右盒子遮挡；
- 主要区别：
  - 在第4步：如何使中间盒子的内容不被左右盒子遮挡：
  - 前者：在中间盒子里再增加一个子盒子，直接设置这个子盒子的 margin 值来让出空位，而不用再调整左右盒子；
  - 后者：设置父盒子的 padding 值为左右盒子留出空位，再利用相对布局对左右盒子调整位置占据 padding 出来的空位；



### 2-4-X、Flex

Flex 结构由 Container & Item 组成；

兼容性：`IE6~9` 不支持，`IE10~11 `部分支持 `flex的2012版`，但需要`-ms-`前缀；其它的主流浏览器包括安卓和`IOS`基本上均已支持；

- IE10部分支持2012，需要-ms-前缀
- *Android4.1/4.2-4.3部分支持2009* ，需要-webkit-前缀
- Safari7/7.1/8部分支持2012， *需要-webkit-前缀*
- IOS Safari7.0-7.1/8.1-8.3部分支持2012，需要-webkit-前缀



### 2-4-X-1、容器属性

使用在flex布局容器上的属性

### 2-4-X-1-1、flex-direction

决定横着排还是竖着排列

```css
.container {
    flex-direction: row | row-reverse | column | column-reverse;
    /* 主轴方向：水平由左至右排列(默认值) | 水平由右向左 | 垂直由上至下 | 垂直由下至上 */
}
```

### 2-4-X-1-2、flex-wrap

控制换行

```css
.container {
    flex-wrap: nowrap | wrap | wrap-reverse;
    /* 换行方式：不换行(默认值) | 换行 | 反向换行 */
}
```

### 2-4-X-1-3、flex-flow

前两者的复合属性

```css
.container {
    flex-flow: <flex-direction> || <flex-wrap>;
    /* 默认值：row nowrap */
}
```

### 2-4-X-1-4、justify-content

用于控制行内项目分布情况(定义子元素在主轴(横轴)上的对齐方式)；

```css
.container {
    justify-content: center | flex-start | flex-end | space-between | space-around;
    /* 主轴对齐方式：居中 | 左对齐(默认值) | 右对齐 | 两端对齐(子元素间边距相等) | 周围对齐(每个子元素两侧margin相等) */
}
```

### 2-4-X-1-5、align-items

用于控制列内项目的分布情况(定义项目在交叉轴(竖轴)上对齐方式)；

```css
.container {
    align-items: center | flex-start | flex-end | baseline | stretch;
    /* 侧轴对齐方式：居中 | 上对齐 | 下对齐 | 项目的第一行文字的基线对齐 | 如果子元素未设置高度，将占满整个容器的高度(默认值) */
}
```

### 2-4-X-1-6、align-content

定义多根轴线的对齐方式；

```css
.container {
    align-content: center | flex-start | flex-end | space-between | space-around | stretch;
    /* 默认值：与交叉轴的中点对齐 | 与交叉轴的起点对齐 | 与交叉轴的终点对齐 | 与交叉轴两端对齐 | 每根轴线两侧的间隔都相等 | (默认值)：轴线占满整个交叉轴 */
}
```



### 2-4-X-2、项目属性

使用在容器内子元素上的属性

### 2-4-X-2-1、flex-grow

**<u>*用于定义项目放大比例*</u>**，若均为1，则均分空间，以此类推，如下所示；

默认为0，即便有剩余空间也不放大；

- 若所有子元素 flex-grow 为 1，则将等分剩余空间；
- 若某个子元素 flex-grow 为 2，则这个子元素将占据 2 倍的剩余空间；

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

### 2-4-X-2-2、flex-shrink

**<u>*用于定义项目的缩小比例*</u>**；

默认为 1，即若空间不足，子元素将缩小；

若所有子元素 `flex-shrink` 都为1，某个子元素 `flex-shrink` 为 0，则该子元素将不缩小

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

### 2-4-X-2-3、flex-basis

定义在分配多余空间之前，项目占据的主轴空间，作用看计算规则；

注意：浏览器根据此属性，计算主轴是否有多余空间；

默认auto，即子元素本来的大小；

若设定为一个固定的值，则子元素将占据固定空间；

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

### 2-4-X-2-4、flex

前三者的复合属性；`<flex-grow> || <flex-shrink> || <flex-basis>`；

**<u>*默认值为 0 1 auto；*</u>**

即有剩余空间不放大，剩余空间不够将缩小，子元素占据自身大小

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

flex有两个快捷值：`auto `和 `none`，分别代表：

- `1 1 auto`：有剩余空间则平均分配，空间不够等比缩小，子元素占据空间等于自身大小；
- `0 0 auto`：有剩余空间也不分配，空间不够也不缩小，子元素占据空间等于自身大小；

flex 值的其他表示意思：

- flex: none -->> flex: 0 0 auto;
- flex: auto -->> flex: 1 1 auto;
- flex: 1个非负数字如2 -->> flex: 2 1 0%;
- flex: 2个非负数字如2 3 -->> flex: 2 3 0%;

- flex: 一个长度值如24px -->> flex: 1 1 24px;
- flex: 一个百分比值如20% -->> flex: 1 1 20%;
- flex: 一个非负+一个长度值或百分比值如8 50px/20% -->> flex: 8 1 50px/20%;

### 2-4-X-2-5、align-self

定义单个子元素的排列方式；

用于继承父级 align-items 值，若无父级，则等同于stretch，常用于，覆盖旧属性自定义列内排列方式；

比如之前的项目属性 align-items 设置了 center，使得所有子元素居中对齐，则可通过给某个子元素设置 align-self 来单独设置子元素的排序方式；

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```



### 2-4-X-2-6、order

定义项目的排列顺序；数值越小，排列越靠前，默认为 0

```css
.item {
  order: <integer>;
}
```



### 2-4-X-3、计算规则

**<u>*flex 计算规则相关属性：margin，flex-grow，flex-shrink，flex-basis；*</u>**

### 2-4-X-3-1、margin 计算属性

- 注意：Flex 容器每行宽度 = 所有子容器宽度 + 子容器左右 margin 值；
- 故而：所有子容纳器宽度 = Flex 容器每行宽度 - 子容器左右 margin 值：400 - 2 * 50；
- 一般：子容器宽度 = 所有子容器宽度 与 自身 flex-grow 值占总比重的乘积：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151303.png" style="zoom:50%;" align=""/>



### 2-4-X-3-2、其他计算属性

### 3-4-X-3-2-1、flex-grow

**<u>*不足容器大小时的伸张比例*</u>**

值为0，则不伸张；

值非0，且 Max (项目 flex-basis 总值 或 宽度总值) < 容器 padding-box 宽度时，则按各项目 flex-grow 值，所占百分比来分配剩余空间；

- 比如：容器宽度 400，2子均为 100，其中1子设置 flex-grow，则将剩余的200分予此，故最后有200原 + 200分配空间；
- 比如：容器宽度 400，2子均为 300，超出容器宽度，此时 flex-grow 就失效，而2子以均为 200 被限定在 400 内；
- 而若：完整显示 300 宽度：则可设置 flex-wrap：wrap 换行显示、亦可设置 flex-shrink 为 0 禁止压缩；

### 3-4-X-3-2-2、flex-shrink

**<u>*超过容器大小时的压缩比例 - 默认1*</u>**

- 比如：容器宽度400，2子均为300，超出容器宽度，剩余空间为 -200px；
- 若项目均设置 flex-shrink 为0不能压缩，则会溢出容器显示；
- 若设置1个 flex-shrink 为 0，另 1 个为 1，则将剩余空间全部给取值为 1 项目，即：300 - 200 = 100px；
- 若分别设置 flex-shrink为 2 和 8，则分别为：300 + (-40) = 260、300 + (-160) = 140；

### 3-4-X-3-2-3、flex-basis 

**<u>*结合 flex-basis 的真实计算过程 <<flex原理>>*</u>**

结构：容器宽度200 + 3子；

分别设置：flex-basis 40px、flex-basis 40px、宽度200；

分别设置：flex-shrink = 1、flex-shrink = 2、flex-shrink = 3；

第1步，计算加权值：

- A = … +（ 各自 flex-shrink 值 * 各自的 width 或 flex-basis ）+ …
- 比如：1*40 + 2*40 + 3*200 = 720;

第2步，求各自的缩小比例：

- Rate =（ 各自 flex-shrink 值 * 各自的 width 或 flex-basis ） / A
- 比如：(40*1) / 720、(40*2) / 720、(200*3) / 720

第3步：得到最后的计算值

- 最终：结果 =（ 超出的值 * 各自的rate ） + 各自的 width/flex-basis 值

注意：若未设置 flex-basis，则依据 width 值；

注意：若 width值也未设置，则依据其内容宽度；

注意：flex-basis 和 width 并存，前者优先，忽略width值；

注意：若 flex-basis 为百分值，则相对于，祖先声明了display:flex的元素；

注意：若 flex-basis 为auto默认值，则代表项目本来的大小；



### 2-4-X-4、示例

示例A：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151304.png" style="zoom:50%;" align=""/>

超出值：0

基准值：0*1 + 100*1 + 200*1 = 300

然后，因为项目总宽不足容器，所以会伸张：

公式：项目宽度 + flex-grow所占比例 * 基准值

Item1为0 + 300*0.4 = 120

Item2为100 + 300*0.4 = 220

Item3为200 + 300*0.2 = 260



示例B：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912151305.png" style="zoom:50%;" align=""/>

超出值：600

基准值：600*4 + 200*4 + 400*2 = 4000

然后，因为项目总宽超过容器，所以会压缩：

公式：项目宽度 - 超出值 * 项目宽度 * flex-shrink值 / 基准值

Item1：600 - 600 * (600 * 4)/4000 = 240

Item2：200 - 600 * (200 * 4)/4000 = 80

Item3：400 - 600 * (400 * 2)/4000 = 280





问题：父级设置 flex-column，子级也设置 flex，则子级会被压缩；

解决：子级同时设置 flex-shrink = 0 不允许压缩即可

参考：https://blog.csdn.net/weixin_37221852/article/details/83141874







### 2-4-Y、Grid 



### 2-4-Z、特殊布局

- **<u>*多个元素、宽高已知、实现垂直水平居中、间隔等距布局*</u>**
  - flex思路一：
    - 父级：设置displayFlex，元素间插入li空标签，并设置flex1；
    - 元素：使用中级标签包裹、设置宽度；若有3个元素，则第1、3中级标签设置flex1，第2个中级标签设置宽高度；
  - flex思路二：
    - 手动计算间隔宽度；如(100% - 80px * 3)/ 4 = 25% - 60px；
    - 配合父级before、after伪元素实现；
  - table思路
  - position思路

- **<u>*图片大小不固定、实现垂直水平居中布局*</u>**
  - 父级：设置宽高固定；
    - 元素：设置宽高 100%、display-block、background:posiiton-center；
    - 注意：元素 background-url 需写在内嵌样式中；
  - 父级：设置 display：Inline-block、宽度固定、text-align：center、vertical-align:middle；
    - 元素：设置 vertical-align:middle；
  - 父级：设置text-align：center、fontSize0；
    - 增加空白图片元素：高度100%、宽度1px、设置vertical-align:middle；
    - 元素：设置 vertical-align:middle；
  - 父级：设置test-align：center，fontSize0；
    - 父级after伪元素：设置content为空、vertical-align:middle；
    - 元素：设置vertical-align:middle；
- <u>**父级垂直居中，高度适中为宽度一半，且含垂直水平居中子级**</u>
  - 思路1：三层结构：
    - 外层控制垂直居中，比如 flex 控制
    - 中层使用 width: 100%; height: 0; padding-bottom: 50%; 控制；
    - 内层使用垂直水平居中方案；
  - 思路2：calc布局
    - width: calc(100vw - 20px); height: calc(50vw - 10px); 
    - position: absolute;   top: 50%; transform: translateY(-50%);
    - display: flex;  align-items: center;  justify-content: center;

- **<u>*父级高度自适应，1子级高度固定，另1子级高度自动填满*</u>**
  - flex思路一：
    - 父级：设置 display：flex、flex-direction：colum、height：100%；
    - 上子级：设置高度固定；
    - 下子级：设置flex1；
  - flex思路二：
    - 父级：设置 box-sizing：border-box、paddingTop为上子级高度、height随意；
    - 上子级：设置 position-absolute、top0、left0、width100%；
    - 下子级：设置高度100%；
  - calc思路：
    - 父级：设置 calc(100% - xxpx)；
    - 注意：calc 减号两侧需有空格；

- **<u>*3元素高度固定、“品”字布局*</u>**
  - 思路：
    - 上方：设置 margin 0 auto；
    - 下方：按两列布局设置；

- **<u>*九宫格布局*</u>**

- - 结构：3个子级、每个子级3个孙级：

  - - 父级：设置 display：table、table-layout：fixed；
    - 子级：设置 display：table-row；
    - 孙级：设置 display：table-cell、高度；

  - 结构：3个子级、每个子级3个孙级：

  - - 父级：设置 display：flex、flex-direction：column；
    - 子级：设置 display：flex；
    - 孙级：设置 flex1

- **<u>*文字环绕图片*</u>**

- - 父级：设置 work-break：break-all(为了让英文内容换行)
  - 子级一：设置 float：left、或right、或none+clear：both；
  - 子级二：使用标签包裹、或文字内容；

- **<u>*高度随自身宽度变化、而变化布局*</u>**

- - padding-bottom 百分比思路：

  - - 父级：设置 top、bottom、left、right为0，margin-auto、width100% 

    - - 子级：设置 before 伪元素 padding-bottom100%、width0.1px、vertical-align：middle；

    - 父级：设置宽度 

    - - 子级：设置 paddingBottom 

  - JS 实现思路：

  - - 使用JS判断图片具体数值、再设置图片高度；
    - 缺点：只能在页面刷新时触发，浏览器屏幕变动时不能触发

- **<u>*底部置底*</u>**
  - 方法1：绝对定位
    - 结构：父级 + 子级 content、子级 footer
    - 父级：PositionRelative、HeightAuto、MinHeight100%(heightAuto 保证页面能撑开浏览器高度时正常显示)
    - 子级 footer：positionAbsolute、left0、botton0，高度固定
    - 子级 content：设置PaddingBottom、值为 footer 高度
  - 方法2：margin负值
    - 结构：content + footer
    - content：MinHeight100%、负值 MarginBottom、值为 footer 高度；
    - footer：高度固定；
    - 结构：container + footer、其中 container 中有子级 header + main；
    - container：MinHeight100%；
    - main：设置 PaddingBottom 为 footer 高度；
    - footer：负值 MarginTop、值为自身高度；
  - 方法3：利用calc()
    - 结构：content + footer；
    - content：设置 MinHeight: calc( 100vh - footer高度 )；
    - footer：高度固定；
  - 方法4：Flex布局
    - 结构：父级 + 子级 content + 子级 footer；
    - 父级：设置 Flex 布局 和 Column 排列；
  - 方法5：Grid布局
    - 结构：父级 + 子级 content + 子级 footer；
    - 父级：设置 MinHeight100%、DisplayGrid、grid-template-rows: 1fr auto;
    - 子级：grid-row-start: 2、grid-row-end: 3; 
    - 注意：各方法的 MinHeight 生效前提为父级设置 Height；



### 2-4-K、自适应与响应式

### 2-4-K-1、自适应(AWD)

不同设备上，网站样式风格、内容、网址、数据库、模板不同或部分相同；

- 使用media query 技术，加载不同css样式文件来控制
- 用户请求访问时，夹带设备信息，后端据此，调整响应内容(或删减增加部分内容)；

优缺：

- 设计灵活、风格个性化；
- CDN、SEO不友好、权重分散不便于优化；

适用场景： 

- 建站后期、需求和网站规模增加



### 2-4-K-2、响应式(RWD)

不同设备上，网站样式风格、内容、网址、数据库、模板相互一致

- 使用media query 技术，加载不同css样式文件来控制；
- 后端推送数据，前端脚本或CSS自行检测设备屏幕大小，然后执行对应的样式表内容；
- 通过本地脚本监听屏幕大小变化，以随时响应变化；
- 内部资源、素材需是自适应的图片/视频；

优缺：

- 方便浏览、增加访客体验、无需单独设计、利于SEO；
- 风格局限、难以实现复杂结构、制作流程复杂、代码兼容性要求高；

适用场景： 

- 建站初期、或无需顾及网站优化及数据同步场合

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912163712.png" alt="截屏2020-09-12 下午4.37.06" style="zoom:50%;" align=""/>



### 2-4-K-3、渐进增强 & 优雅降级

- 前者构建完整功能，随后逐步添加新式浏览器才支持的功能
- 前者因为用户在PC上用过一个功能，但是在手机上怎么都找不到，用户体验极差

- 后者针对低版本浏览器进行构建页面，完成基本功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验；



## 2-5、布局适配方案

### 2-5-1、CSS 单位

### 2-5-1-1、相对绝对单位

相对单位值不固定：

- rem、em；
- 相对&继承根元素html字体大小、相对&继承父级元素字体大小；

- ex、px
- 字母 "x" 高度、像素，制作时需根据设备DPI换算成物理长度 (常见设备DPI略)；

绝对单位值固定：

- pc、pt、in 、cm 、mm
- 1帕=12点、1点=1/72英寸、1英寸=2.54厘米、厘米、毫米

注意：rem转px会导致精读问题，需用 px 配合 dpr 来实现

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161057.png" alt="截屏2020-09-12 下午4.10.53" style="zoom:50%;" align=""/>



### 2-5-1-2、百分比单位

position 各属性值的%值：

- static：不存在；
- fixed：相对于浏览器视窗宽高值；
- relative：相对于父元素宽高值；(附：px值大小则相对于自身位置移动)
- absolute：相对于当前元素的相对元素宽高值；

margin、padding 的%值：

- 相对于父元素宽度；(不管哪个方向)；
- 误解：浏览器渲染机制由外到内，故不会引起循环渲染；
- 场景：利用 padding 可构建 16:9 4:3 的等比例响应式图片/视频盒子，但需配合子元素+定位来添加内容；

font-size 的%值：

- 相对于父级字体大小；

text-indent 的%值：

- 相对于父级宽度；

background-size 的%值：

- 相对于自身宽高；

translate 的%值：

- 相对于自身宽高；(注意：transform3d 第3值的%值无效、默认值auto、表示z轴上偏移)；

line-height 的%值：

- 相对于元素字体大小；(附：无单位数字则表示数字与该元素字体大小的乘积)；line-height 的 各单位值使用比较：

- 1.5：继承父级后，重新根据自身字体大小重新计算 (推荐)；
- 1.5em、150%：继承父级行高值后乘积结果；

border-radius 的%值：

- 相对于自身的宽高
- 注意：border是不存在%值，而 border-width 暂时不支持；

vertical-align 的%值：

- 注意：vertical-align 百分比值相对于 line-height 计算；
- line-height: 30px; vertical-align: -10%; === vertical-align: -3px;



### 2-5-1-3、视口单位

问题：各布局的不足：

- flex布局：兼容性(IE10+)；

- 响应式布局：只能选择典型主流设备尺寸、切换瞬间不流畅，体验性差；

- rem 布局：只能控制尺寸、需内嵌脚本辅助，监听设备分辨率变化、动态改变根元素字体大小；

方案：视口布局：相对于视口的高度和宽度；

- PC端视口：浏览器的可视区域；
- 移动端视口：3个Viewport中的 LayoutViewport 布局视口；

单位：视口单位

- vw、vh  vmin、vmax
- 视口宽高、两者最小最大；
- 1vw == 视宽1%；1vh == 视高1%；100vw/vh 即整个浏览器宽高；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161455.png" alt="截屏2020-09-12 下午4.14.52" style="zoom:50%;" align=""/>

注意：

- 兼容性 (IOS8+、android4.4+)
- 可搭配 mediaQuery 使用；
- 可搭配 Sass 使用；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161537.png" alt="截屏2020-09-12 下午4.15.31" style="zoom:50%;" align=""/>



### 2-5-1-4、注意事项

**<u>*1、增加大小限制：*</u>**

1、根元素设置 vw，随着视口变化而变化，如此实现大小动态改变；

2、限制根元素字体变化范围，配合 body 加上最大、最小宽度，便于项目从rem到vw单位过渡；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161635.png" alt="截屏2020-09-12 下午4.16.30" style="zoom:50%;" align=""/>

**<u>*2、解决普通屏幕1px，高清屏幕下.5px 问题：*</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161801.png" alt="截屏2020-09-12 下午4.17.55" style="zoom:50%;" align=""/>

**<u>*3、保持宽高比：*</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912161740.png" alt="截屏2020-09-12 下午4.17.34" style="zoom:50%;"  align=""/>







### 2-5-2、像素比

### 2-5-2-1、概念区分

设备像素：亦称物理像素，生产即决定的值、固定值；

- 比如：iPhone5分辨率为640 x 1136px，代表屏幕由640行，1136列像素点组成；

CSS像素：类似于在设备上的一层布，CSS像素并不总等于物理像素；1个CSS像素相当于多少个物理像素，取决于：页面缩放比、屏幕密度；

像素密度PPI：每平方英寸的面积上排列的像素点数量，1英寸等于2.54厘米；

- PPI越高，代表这个2.54cm²区域内所有用的像素点越多，屏幕显示效果越精细；比如：

- 分辨率为 320 x 480 手机A，显示1条163像素的线，即CSS像素为163 像素；
- 分辨率为 640 × 960 手机B，但此线在此手机B表示实际长度应该只有A的一半，但实际中并未出现此情况；因为:
  - A用 1:1 比例显示，即同 1个CSS像素，A用1个设备像素显示
  - B用 2:1 比例显示，即同 1个CSS像素，B用4个设备像素去显示，故画面细腻。



### 2-5-2-2、高PPI问题与解决

问题：高密度分辨率屏幕（高清屏）会带来以上的适配问题

解决A：引入逻辑像素(dp，pt)：

iOS & Android 2个平台分别提出了pt（point）与 dp (device-independent pixel) 两个单位： PPI越高，1pt的所覆盖的物理像素就越多；

- 比如：苹果 4/4s 逻辑像素为 320 x 480pt（横向X轴 320pt，纵向Y轴 480pt；而其自身的设备像素：640 x 960px）安卓同理；

解决B：引入设备像素比(DPR，Device Pixel Ratio)：

设备像素 与 逻辑像素的比值（DRP：物理像素/dp或pt）

- 1倍：1pt=1dp=1px（iPhone 3GS）
- 2倍：1pt=1dp=2px（iPhone 4s/5/6）
- 3倍：1pt=1dp=3px（iPhone 6 plus）

获得设备像素比后，便可得知设备像素与CSS像素之间的比例。

- 当这个比率为1:1时，使用1个设备像素显示1个CSS像素。
- 当这个比率为2:1时，使用4个设备像素显示1个CSS像素。
- 当这个比率为3:1时，使用9（3*3）个设备像素显示1个CSS像素。

注意：设计师一般按照设备像素(device pixel)为单位制作设计稿；前端工程师，参照相关的设备像素比(device pixel ratio)，进行换算以及编码；

- 比如：iPhone5 设计稿：有1个 width:100px，height:200px 按钮；前端在编码web页面时，应根据设备像素比，换算为 width:50px，height:100px；





### 2-5-X、初始化根元素字体大小

页面开头处引入下面这段代码，用于动态计算`font-size`：

```js
// 假设需要 1rem = 20px
(function () {
  var html = document.documentElement;
  function onWindowResize() {
    // 获取 html 的宽度(窗口的宽度)
    html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
  }
  // 监听 window 的 resize 事件
  window.addEventListener('resize', onWindowResize);
  onWindowResize();
})();
```

```html
// 并配合 meta 头：
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-sacle=1.0, maximum-scale=1.0, user-scalable=no" />
```

移动端布局总结：

1. 移动端布局的方式主要使用rem和flex，可以结合各自的优点，比如flex布局很灵活，但是字体的大小不好控制，我们可以使用rem和媒体查询控制字体的大小，媒体查询视口的大小，然后不同的上视口大小下设置设置html的font-size。
2. 可单独制作移动端页面也可响应式pc端移动端共用一个页面。没有好坏，视情况而定，因势利导











## 2-6、隐藏

### 2-6-1、文字总结

常规法:

- 法1：display: none 
- 法2：visibility: hidden  
- 法3：opacity: 0
- 法4：高度控制 + overflow: hidden；

定位法：

- 绝对定位 + visibility: hidden 
- 绝对定位 + zoom + 变形 
- 绝对定位 + clip；
- 绝对定位 + opacity: 0 
- 绝对定位 + 方位大幅移动 
- 相对定位 + 方位大幅移动 



### 2-6-2、实例总结

- 能否点击：涉及变形、裁剪、定位移动、VisibilityHidden、高度控制均不可点击；透明度控制可点击；
- 是否占据空间：仅相对定位、透明度控制、VisibilityHidden 占据空间 ；

**<u>占据空间，可点击：</u>**

- opacity: 0; 或 filter: Alpha(opacity*=0*);

**<u>占拒空间，不可点击：</u>**

方法1：

- position: relative;
- top: -999em;

方法2：

- visibility: hidden;

**<u>不占空间，可点击：</u>**

- position: absolute;
- opacity: 0; 或 filter: Alpha(opacity*=0*);

**<u>不占空间不可点击：</u>**

方法1：display: none;

方法2：

- position: absolute;
- visibility: hidden;

方法3：

- position: absolute;
- zoom: 0.001;
- transform: scale(0);

方法4：

- position: absolute;
- clip: rect(1px 1px 1px 1px);

方法5：

- position: absolute;
- top: -999em; 或 -999%;  
- 或 left: -999em; 或 -999%;)

方法6：

- height: 0;
- overflow: hidden;
- 注意：若子元素应用了 absolute、fixed，但紧邻，父级无 relative 声明则不会隐藏，如下图：
- 注意：[反利用上述失效机制，构建父级隐藏，子级不隐藏的效果](https://www.zhangxinxu.com/study/201202/text-align-right-position-absolute-height-0.html)

特殊：IE6、7、9不占空间、不可点击；IE8、Opera、火狐、谷歌占据空间、不可点击：

- zoom: 0.001;
- transform: scale(0);

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912155602.png" alt="截屏2020-09-12 下午3.55.51" style="zoom:50%;" align="" />

### 2-6-3、隐藏属性对比

### 2-6-3-1、opacity: 0;

- DOM 结构：渲染树保留、不可见、可点；
- 事件监听：可进行 DOM 事件监听；
- 性 能：动态改变此属性时会引起重绘，性能较高；(疑问：说法不一：提升合并层不引起重绘；重建图层)
- 继 承：可被子元素继承，子元素无法通过逆向操作 opacity: 1 取消隐藏；
- transition：不支持；
- 无障碍：
- 场景：跟transition搭配、自定义图片上传按钮

### 2-6-3-2、visibility: hidden;

- DOM 结构：渲染树保留、不可见、不可点；
- 事件监听：无法进行 DOM 事件监听；
- 性 能：动态改变此属性时会引起重绘，性能较高；
- 继 承：可被子元素继承，子元素可通过逆向操作 visibility: visible 取消隐藏；
- transition：不支持；
- 无障碍：读屏器会读取 visibility: hidden 元素内容
- 场景：显示不会导致页面结构发生变动；

### 2-6-3-3、display: none;

- DOM 结构：渲染树不保留、不可见、不可点；
- 事件监听：无法进行 DOM 事件监听；
- 性能：动态改变此属性时会引起重排、性能较差；
- 继承：不可被子元素继承，因子类并无渲染；
- transition：不支持；
- 无障碍：读屏器不读取 display: none 元素内容；
- 场景：显示出本不存在的结构；

附属补充1：visibility

默认 visible、常用 hidden；

罕见 Collapse (表格元素表现为隐藏整行整列；一般元素表现为 hidden，火狐、IE、opera 等同 displaynone；



## 2-7、边框

### 2-7-1、border

- 属性：复合属性：宽度、种类、颜色；
- 位置：略、占据空间、影响布局；



### 2-7-1-1、border-radius

- 单一赋值：border-top-left-radius….；
- 表现形式1：左上 右上 右下 左下；
- 表现形式2：左 右 右 左 / 上 上 下 下；
- 表现形式3：值1  值2  ===  值1  值2  值1  值2；
- 表现形式4：值1  值2  值3  ===  值1  值2  值3  值2；



### 2-7-1-2、border-image

[border-image](http://www.w3school.com.cn/css/css_border.asp)、[border-image-xxx](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Styling_boxes/Borders)



### 2-7-1-3、border 实现多边形

圆角胶囊：https://www.cnblogs.com/pigtail/archive/2013/02/17/2914119.html

圆 & 半圆：https://www.cnblogs.com/masanhe/p/8358963.html

三角形：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171657.png" alt="截屏2020-09-12 下午5.16.50" style="zoom:50%;" align=""/>

梯形：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171833.png" alt="截屏2020-09-12 下午5.18.27" style="zoom:50%;" align=""/>

平行四边形：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171808.png" alt="截屏2020-09-12 下午5.18.02" style="zoom:50%;" align=""/>





### 2-7-2、outline

- 属性：复合属性
- 位置：边框边缘外围、不占据空间、不影响布局；
- 作用：突出元素位置、浏览器默认行为；
- 触发：鼠标click、tab键；
- 触发对象：链接、radio 元素、表单控件、ImageMap等可聚集元素；
- [示例1](http://www.zhangxinxu.com/wordpress/?p=505)、[示例2](https://codepen.io/Dudy/pen/PwMxGN?editors=110@)、[示例3](http://www.zhangxinxu.com/wordpress/2015/04/css3-radius-outline/)





### 2-7-3、box-shadow

- 属性：复合属性：水平偏移(+右-左)  垂直偏移(+下-上)  模糊半径(0+)  扩展半径(∞)  颜色 阴影(默认和inset)；
- 兼容性：IE9+、FF3.5+、Chrome2.0+、Opera10.6+、Safari4+；注：IE9-使用看3-3：

使用注意事项：

- 使用1：不计算为内容、不占据空间、不影响布局
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171309.png" alt="截屏2020-09-12 下午5.13.06" style="zoom:50%;" align=""/>
- 使用2：阴影层级：边框 > inset阴影 > 背景 > 背景颜色 > normal阴影
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171248.png" alt="截屏2020-09-12 下午5.12.44" style="zoom:50%;" align=""/>
- 使用3：模糊和扩展半径对比1：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171229.png" alt="截屏2020-09-12 下午5.12.25" style="zoom:33%;" align=""/>
- 使用4：模糊和扩展半径对比2：
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171153.png" alt="截屏2020-09-12 下午5.11.50" style="zoom:33%;" align=""/>
- 使用5：阴影覆盖：先写优先级更高；R前<R后，前面位于后上；R前>R后，前面覆盖后面；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171117.png" alt="截屏2020-09-12 下午5.11.14" style="zoom:33%;" align=""/>
- 使用6：模拟 border (不占空间) - 图略；
- IE9-兼容解决：
  - 方法1：使用 IE shadow阴影滤镜实现 (须配合背景属性使用)：
  - filter: progid:DXImageTransform*.Microsoft*.Shadow(color=’颜色值’, Direction=阴影角度(数值), Strength=阴影半径(数值));
  - ![截屏2020-09-12 下午5.14.02](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200918143310.png)
  - 方法2：使用 JQ、JQ 插件: 
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912171434.png" alt="截屏2020-09-12 下午5.14.30" style="zoom:50%;" align=""/>





## 2-10、动画

动画属性: 尽量使用动画属性进行动画，能拥有较好的性能表现

- `translate`
- `scale`
- `rotate`
- `skew`
- `opacity`
- `color`





### 2-10-1、Transition

- `transition-property`: 属性
- `transition-duration`: 间隔
- `transition-timing-function`: 曲线
- `transition-delay`: 延迟
- 常用钩子: `transitionend`



### 2-10-2、Animation

animation / keyframes：animation: name duration timing-function delay iteration-count direction;

```css
// 一直旋转的动画
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}
```

- 常用钩子: `animationend`

| 值                                                           | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| *[animation-name](https://www.w3school.com.cn/cssref/pr_animation-name.asp)* | 规定需要绑定到选择器的 keyframe 名称。(spin)                 |
| *[animation-duration](https://www.w3school.com.cn/cssref/pr_animation-duration.asp)* | 规定完成动画所花费的时间，以秒或毫秒计。(2s)                 |
| *[animation-timing-function](https://www.w3school.com.cn/cssref/pr_animation-timing-function.asp)* | 规定动画的速度曲线。(ease\|linear\|ease-in\|cubic-bezier(n,n,n,n)) |
| *[animation-delay](https://www.w3school.com.cn/cssref/pr_animation-delay.asp)* | 规定在动画开始之前的延迟。(2s)                               |
| *[animation-iteration-count](https://www.w3school.com.cn/cssref/pr_animation-iteration-count.asp)* | 规定动画应该播放的次数。(n \| infinite) n次/无限             |
| *[animation-direction](https://www.w3school.com.cn/cssref/pr_animation-direction.asp)* | 规定是否应该轮流反向播放动画。(normal \| alternate) 正常/反向 |
| *[animation-fill-mode](https://www.w3school.com.cn/cssref/pr_animation-fill-mode.asp)* | 规定动画在播放之前或之后，其动画效果是否可见。(forwards\|backwards\|both)停止时保留末帧/回到首帧/同时运用 |

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912155839.png" alt="x" style="zoom:40%;" />



### 2-10-2-1、逐帧动画

**<u>*实现一：动作分割，百分比设置：*</u>**

缺点：存在动画真空期、真空期由原有 animation-timing-function 掌控；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912160151.png" alt="截屏2020-09-12 下午4.01.48" style="zoom:50%;" align=""/>

**<u>*实现二：steps 函数：*</u>**

animation-timing-function:step-start/step-end

step-start：效果等同于 steps(1,start)；step-end：效果等同于steps(1,end)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200912160236.png" alt="截屏2020-09-12 下午4.02.09" style="zoom:50%;" align=""/>

```css
// 可以让动画不连续
steps(number, position)
// number: 数值，表示把动画分成了多少段
// poosition: 表示动画是从时间段的开头连续还是末尾连续。支持 start-表示直接开始 & end-表示戛然而止-默认值;
```

地位和作用：和贝塞尔曲线(`cubic-bezier()`修饰符)一样，都可以作为`animation`的第三个属性值；

和 cubic-bezier 的区别：贝塞尔曲线像是滑梯且有4个关键字(参数)，而`steps`像是楼梯坡道且只有`number`和`position`两个关键字；





### 2-10-2-2、cubic-bezier 





## 2-X、其他

### 2-X-1、CSS 选择器优先级

- `!important` > 行内样式 > `#id` > `.class` > `tag` > * > 继承 > 默认
- 选择器 **从右往左** 解析

### 2-X-2、link 与 @import

- `link` 功能较多，可以定义 RSS，定义 Rel 等作用，而`@import`只能用于加载 css

- **当解析到 `link`时，页面会同步加载所引的 css，而 `@import` 所引用的 css 会等到页面加载完才被加载**
- `@import` 需要 IE5 以上才能使用

- `link` 可使用 js 动态引入，`@import`不行

*   link 是从 html 引入的，@import 是从 css 引入的
*   link 会在浏览器加载页面是同步加载 css；页面加载完成后再加载 @import 的 css
*   优先级 link > @import
*   @import 是 css2.1 加入的语法，只有 IE5+ 才可识别，link 无兼容问题



### 2-X-3、CSS 单位

- `em`：**<u>定义字体大小时以父级的字体大小为基准；定义长度单位时以当前字体大小为基准；</u>**
  - 比如：父级 `font-size: 14px`，则子级 `font-size: 1em;` 为 `font-size: 14px;`；
  - 比如：定义长度时，子级的字体大小为 `14px`，则子级 `width: 2em;` 为 `width: 24px`；
- `rem`：**<u>以根元素的字体大小为基准；</u>**
  - 比如：`html` 的 `font-size: 14px`，则子级`1rem = 14px`；
- `%`：以父级的宽度为基准；
  - 比如：父级 `width: 200px`，则子级 `width: 50%;height:50%;` 为 `width: 100px;height: 100px;`；
- `vw 和 vh`：基于视口的宽度和高度(视口不包括浏览器的地址栏工具栏和状态栏)；
  - 比如：视口宽度为 `1000px`，则 `60vw = 600px;`；
- `vmin 和 vmax`：`vmin` 为当前 `vw`  和 `vh` 中较小的一个值；`vmax`为较大的一个值；
  - 比如：视口宽度 `375px`，视口高度 `812px`，则 `100vmin = 375px;`，`100vmax = 812px;`；

- `ex 和 ch`：`ex` 以字符  `"x" ` 的高度为基准；`ch` 以数字 `"0"` 的宽度为基准；
  - 比如：`1ex` 表示和字符 `"x"` 一样长；
  - 比如：`2ch` 表示和2个数字`"0"`一样长；





### 2-X-4、伪元素与伪类

**<u>伪类：</u>**用于当已有元素处于某种状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化；

- 比如：hover、visited、link等；


**<u>伪元素</u>**：用于创建一些不在文档树中的元素，并为其添加样式；

- 比如：`:before ` 来为一个元素前增加一些文本，并为这些文本增加样式。用户虽然可以看到这些文本，但是这些文本实际并不在文档树中。


**<u>两者区别</u>**

- 有没有创建一个文档树之外的元素；伪类的操作对象时文档树中已有的元素，而伪元素则创建一个文档树以外的元素；

- CSS3 规范中要求使用双冒号(::) 表示伪元素，单冒号(:) 表示伪类；






### 2-X-5、1px 问题

**<u>原因</u>**：由于不同手机有不同的像素密度，所以 CSS 中的 `1px` 并不等于移动设备的 `1px`；

在 `window` 对象中有一个 `devicePixelRatio` 属性，它可以反映 CSS 中的像素和设备的像素比；

devicePixelRatio 的官方定义：设备物理像素和设备独立像素的比例

**<u>解决：</u>**

<u>1、直接使用 0.5px 边框</u>

WWWDC 对 IOS 的建议：直接使用 `0.5px` 边框；缺点：仅支持 IOS 8+，不支持安卓；

<u>2、使用边框图片 border-image</u>：优点：可以设置单条、多条边框；缺点：修改颜色麻烦，圆角需要特殊处理

```css
.border-image-1px {
  border: 1px solid transparent;
  border-image: url('../img/border') 2 repeat;
}
```

<u>3、使用 box-shadow 模拟</u>：优点：使用简单，圆角也能实现；缺点：边框有阴影，百分百过不了视觉走查

```css
.box-shadow-1px {
  box-shadow: inset 0 -1px 1px -1px #e5e5e5;
}
```

<u>4、伪类 + transform + 绝对定位实现</u>：优点：所有场景都能满足，支持圆角；缺点：伪类冲突

```css
.scale-1px {
  position: relative;
}

.scale-1px::after {
  content: ' ';
  width: 100%;
  height: `px; /* no */
  background: #e5e5e5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scaleY(0.5);
}
```









