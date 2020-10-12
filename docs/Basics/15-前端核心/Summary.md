# 总结

例子太多，故篇幅会很长……



## 一、代码执行

包含：执行上下文、作用域链、变量对象、this确定、作用域、变量提升、闭包、执行栈等内容；实际上关系紧密但不深奥，从代码是如何在计算机内部执行(各种寄存器，加法器)的角度看会更容易理解；



### 1-1、代码执行



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123716.png" style="zoom:50%;" align="" />

**<u>*1、从物理层面上看*</u>**：JS 代码的执行，首先会通过 <u>**预解析-parser**</u> 检查语法错误；然后经过分词、语法/词法分析 <u>**生成AST**</u>；然后通过 <u>基线编译器-Ignition</u> 将其转换为 <u>**字节码**(一种形如汇编码的码 Ldar a1 Add a0, [0]...，过去是直接生成机器码，但有内存占用问题)</u>；然后通过 <u>优化编译器-Turbofan</u> 将字节码转为 **<u>机器码</u>** (转换是通过执行字节码实现的，若某段代码经常被执行，则会被标记为 <u>热点代码-HotSpot</u> 并将其机器码缓存起来以便后续快速利用)；最后 **<u>执行</u>** 机器码；

- 注意：**<u>JS 并非纯粹的解释器语言，因为字节码不仅配合解释器，还有编译器的参与</u>**，而<u>两者根本区别</u>在于：前者会编译生成二进制文件，但后者不会；此外，这种字节码跟编译器、解释器结合的技术，称为 **<u>即时编译(JIT)</u>**；

**<u>*2、从逻辑层面上看*</u>**：<u>在调用函数，执行函数代码前，会有两个阶段：内存分配的创建阶段、以及代码执行阶段；</u>

- 注意：红宝石书的描述很含糊，强调函数调用时创建执行上下文但无进一步的细分；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123717.png" style="zoom:50%;" align="" />

- **<u>创建阶段—CreationPhase</u>**：**完成执行上下文/执行环境(执行代码时的运行环境)的创建，上下文的创建还包含以下对象的创建：**
  - 2-1、**作用域链 ScopeChain 的初始化：**
    - 可理解为一个链表，而函数的 [[scope]] 指针指向此链表的头结点，可理解为作用域链对象存储在 [[scope]] 属性中，其复制外层函数 [[scope]] 属性中的对象，若嵌套越深，复制的对象越多；
  - 2-2、**变量对象 VO 的创建**：此对象形成所有可访问变量，可理解为 **<u>作用域</u>** 实体，进入变量的生命周期(声明/初始化/定义)；
    - 创建实参对象 (arguments object)
    - 检查 context 形参 (parameters)，初始化参数名和参数值，并创建一份引用拷贝；
- 扫描 context 中函数声明：
    
      - 为每一函数在 VO 上创建属性，属性名即函数名，含有一个指向内存中函数的引用指针，进行声明/初始化/赋值操作；
  - 若函数名已存在，则此引用指针值将会被重写；
    - 扫描 context 中变量声明：
      - 为每一变量在 VO 上创建属性， 属性名即变量名：
        - 若为 var 变量，则将变量值初始化为 undefined； 所以才会有 **<u>变量提升—Hoisting</u>** 的错觉；
        - 若为 let 变量，则不进行初始化；而在 let 真正被初始化前使用，即使用已声明但未初始化变量，则进入 TDZ 报错；xx is not defined
      - 若变量名已存在：
        - 若为 var 变量，则什么均不会发生，并继续扫描；
        - 若为 let 变量，则报错重复声明；
  - 2-3、**this 值的确定：**
    - 所以说 **<u>this 指向在函数被调用时才发生绑定，this 指向最近的调用方(匿名函数除外)</u>**，
  - 2-4、其他信息的创建：函数在哪被调用(调用栈)，函数的调用方法等；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123718.png" style="zoom:50%;" align="" />

- **<u>执行阶段—ExecutionPhase</u>**：执行上下文被推入 **<u>执行栈</u>**，运行/解释 执行上下文 中函数代码，并且根据代码一行一行的执行；
  - 2-1、**变量对象的转换**：由 VO 转为 AO，实际乃同一对象不同时期的称呼；执行时发生变量的赋值也即定义操作；
    - 若为 var 变量，则简单的定义操作；
    - 若为 let 变量，则进入变量的初始化，后续若有别的赋值操作则进行赋值操作；
  - 2-2、**作用域链的确定**：上述的变量对象，在执行时被推入当下执行上下文的 ScopeChain 的前端：
    - **<u>确定</u>**：创建阶段的作用域链—ScopeChain 复制了父级 [[scope]] 属性中的对象，也即复制了作用域链中的对象，而父级被创建时的作用域链对象，又复制了爷级的………所以此时的作用域链对象：由当前执行上下文的 AO、同所有外层已完成的激活对象组成，即包含：当前本地 VO(AO)—父级AO—爷级AO—……—全局AO；至此，作用域链被确定下来；
    - **<u>本质</u>**：作用域链的本质，即存放系列变量对象的指针列表；但注意，其存放的只是引用，而不包含实际变量对象的；
    - **<u>查询</u>**：此道工序保证了变量和函数的有序访问；即查找一个变量时，若当前变量对象(作用域)中未找到对应，则会通过作用域链，继续逐个向上查找(神似 node 模块的查找机制)；
    - **<u>循环</u>**：如果后续执行再遇函数调用，则再创建、初始、填充、为变量赋值、新一轮的函数创建-压栈执行；
- **<u>*执行完毕—FinshPhase*</u>**：执行完毕，切换上下文，进行退栈操作；
  - 注意：若退栈时，返回了函数或函数的引用，而函数包含了 [[scope]] 属性，即包含作用域链，就成为了 <u>**闭包**</u>；所以其可通过作用域链来访问系列上级函数中的变量；但同时因为引用被确定，执行栈虽然切换了上下文，但实际内存并未清除，容易导致内存泄露；

**<u>*3、两个层面的区别*</u>**：两个阶段并不冲突，个人认为：在生成字节码时，即进入逻辑层面上的内存分配阶段，包含变量对象、作用域链、this 对象等内容的生成；而在转换为机器码时，**<u>需要逐行执行字节码</u>，而这即进入 "代码执行阶段——包含作用域链的完善、赋值操作等"**，最后才将机器码真正执行；



### 1-2、其他内容再述

详看前面内容；

**<u>执行上下文</u>**：个人认为其乃字节码执行时创建的隐式的对象，包含众多辅助代码执行的对象，比如变量对象、this、作用域链，为方便分析还分为几类：全局执行上下文、函数执行上下文、eval 函数执行上下文；

**<u>执行栈</u>**：执行上下文创建后，进入执行阶段，将执行上下文压栈执行；从机器码执行层面上看，更感觉是 ESP 指针移动，进入此对象的引用地址的区域执行代码；亦可理解为一个存储函数调用的栈结构；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123737.png" style="zoom:80%;" align="" />

**<u>闭包</u>**：一般情况下，在函数执行完毕并出栈时，函数内局部变量在下一个垃圾回收节点会被回收，该函数对应的执行上下文将会被销毁，这也正是在外界无法访问函数内定义的变量的原因；即只有在函数执行时，相关函数可以访问该变量，该变量在预编译阶段进行创建，在执行阶段进行激活，在函数执行完毕后，相关上下文被销毁；

但非正常情况下，父级上下文返回了一个子函数，子函数内部的`[[scope]]`(指向作用域链) 中仍保留系列父级变量对象，因此可继续访问到父级的变量对象；这样函数或函数引用的变量称为闭包，因其保留着引用，所以执行上下文无法通过正常模式销毁，而作为活动对象长期存在，并从新生代提升至老生代，占用内存，容易导致内存泄露；

闭包用于实现 OOP 的封装性(特权方法)、模块化、命名空间、函数工厂、延期执行等，实际上利用的是当前执行上下文的作用域链对象没有包含父级VO，变量查找不到==私有变量；注意：在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers 或任何异步中，只要使用回调函数，实际上就是在使用闭包；

**<u>*作用域及其查找*</u>**：作用域其实就是变量对象的实体，作用域查找其实就是变量对象上的检索；但若当前 AO(VO) 找不到，就从 [[scope]] 指向的作用域链上的 AO 列表逐个查找，行为表现类似依据作用域链查找，而实际上是 VO 链表的查询；为便于分析，衍生为全局、函数作用域等概念；至于 **<u>块级作用域</u>**，个人觉得与创建变量对象时，变量生命周期有关，引擎限定了 let/const 在初始化-定义前不得使用，故存在 TDZ，存在块级作用域；

```js
// 块级作用域示例
// Ex1
let xx = yyy
// Uncaught ReferenceError: yyy is not defined

// Ex2
// 注意: 除了块级作用域以外，函数参数默认值也会受到 TDZ 影响；
function foo(arg1 = arg2, arg2) { ... }
// Uncaught ReferenceError: arg2 is not defined
foo(undefined, 'arg2')  
// 将函数参数默认值区域也想象成为一个 TDZ 范围会比较容易理解
// 即 arg2 虽然已经声明但未初始化-定义，在执行阶段 arg1 的初始化时，寻找 arg2 就会报错
                                 
// Ex3
// 至于为何下面传入 null 没有报错是因为前者传 undefined 相当于不传值，使用 arg2，后者则替代了 arg2 避免了出错
function foo(arg1 = arg2, arg2) { ... }
foo(null, 'arg2') // null arg2
```

**<u>变量提升</u>**：变量对象创建的衍生概念，即开始进入变量的生命周期的系列现象：声明(Declaration)、初始化(Initialization) 与赋值(Assignment)；

- Var：在内存分配阶段，进行变量的创建-声明与初始化-定义，最后在代码执行阶段进行赋值操作；
- Function：在内存分配阶段就已经完成三个变量周期；同名情况下，比 Var 优先级高；
- Let：在内存分配阶段仅完成变量的创建-声明，并未初始化-定义，只有在执行阶段的 let x = xxx 时才进行首次初始化-定义，若后续还有操作才是赋值行为；所以，在 let x = xx 前就使用就会报错：x is not define，即 TDZ—未初始化-定义前不准使用变量；

- Const：在代码执行阶段进行创建-声明与初始化-定义，没有赋值行为；

```js
// Ex1
var liList = document.querySelectorAll('li') // 共5个li
for( var i=0; i<liList.length; i++){
  liList[i].onclick = function(){
    console.log(i)
  }
}

// Ex2
var liList = document.querySelectorAll('li') // 共5个li
for( let i=0; i<liList.length; i++){
  liList[i].onclick = function(){
    console.log(i)
  }
}
// for( let i = 0; i< 5; i++) 这句话的圆括号之间，有一个隐藏的作用域
// for( let i = 0; i< 5; i++) { 循环体 } 在每次执行循环体之前，JS 引擎会把 i 在循环体的上下文中重新声明及初始化一次

// Ex3
var liList = document.querySelectorAll('li') // 共5个li
for( let i=0; i<liList.length; i++){
  // let i = 隐藏作用域中的i 
  // 5 次循环，就会有 5 个不同的 i，console.log 出来的 i 当然也是不同的值
  liList[i].onclick = function(){
    console.log(i)
  }
}
```

注意：变量提升只对 var 命令声明的变量有效，若一变量不是用 var 命令声明的，就不会发生变量提升：其实变量提升概念模糊，标准协会内部也存在争议，但更倾向于创建阶段变量的处理；

注意：函数表达式也会提升，但作为普通变量提升，而非函数提升；而同名函数和变量同存时，函数优先，变量延后提升，相当于变量会覆盖函数声明；





### 1-3、作用域查找

万变不离其宗——VO 对象的值的查找—>[父级VO集合]上的值的查找

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
// setTimeout 宏任务, JS 单线程、 EvLoop 机制，在主线程同步任务执行完后才去执行宏任务，此时循环已结束，i 也已变成 6；
// loop 结束后, setTimeout 依次执行回调，但输出时在当前变量对象无 i，遂通过作用域链向上寻找 i, 因此会全部输出6；


// 解决1
// 利用 IIFE，使得每次 for 均创建不一样的 VO(每 VO 含有不一样的 j——虽然同名)，但注意到均包含父级 VO，均能找到 a
// 输出 5 个 6，1-5
for(var i = 1;i <= 5;i++){
  var a = 1
  (function(j){
    setTimeout(function timer(){
      console.log(j)
      console.log(a)
    }, 0)
  })(i)
}

// 解决2
// 给定时器传入第三个参数, 与 IIFE 原理类似，创建单独的 VO，但注意到均包含父级 VO，均能找到 i
// 输出 5 个 6，1-5
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, 0, i)
}
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(i); console.log(j)
  }, 0, i)
}


// 解决3
// 使用块级作用域 let 使 JS 发生革命性的变化，让 JS 有函数作用域变为块级作用域
// 原理其实还是一样，利用 VO 的查找层级
for(let i = 1; i <= 5; i++){
  setTimeout(function timer(){
    console.log(i)
  },0)
}
// babel 转译后结果
"use strict";
var _loop = function _loop(i) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
};
for (var i = 1; i <= 5; i++) {
  _loop(i);
}
// 加个 const 怎么样
for(let i = 1; i <= 5; i++){
  const a = 1;
  setTimeout(function timer(){
    console.log(i)
  },0)
}
// babel 转译后结果
"use strict";
var _loop = function _loop(i) {
  // 啊哈
  var a = 1;
  setTimeout(function timer() {
    console.log(i);
  }, 0);
};
for (var i = 1; i <= 5; i++) {
  _loop(i);
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123746.png" style="zoom:50%;" align="" />

```js
// 前面考虑的是多个子函数的 ScopeChain 包含的 父级 VO 是一样的，所以输出为：undefined 0 0 0 
// 中间考虑的是嵌套子函数的 VO 查找，单纯考你思维性，输出为：undefined 0 1 2
// 后面就是上面的多个利用，无他，输出为：undefined 0 1 1
```





### 1-4、this指向

其实 this 指向不难，在函数调用时确定，除了箭头函数的引擎特殊处理外的类型外，其他修改 this 执行的行为，比如 apply、call，无外乎进行多一次的函数创建操作，重新为 this 指向赋值；而 new 内部，也有这种操作，且更为间接和隐秘，故优先级也最高；但理论与实际是存在差异的，this 不难，也不能说完全不难，其难就难在复杂的多种情况下的 this 指向确定；

**<u>this 值</u>**，在上下文创建时的 this 确定，即外层调用，而 call/apply/bind 形式的调用是重新进行了一次执行上下文创建过程，修改调用主体，修改 this 确定；

- 默认绑定：this 指向全局对象，严格模式指向 undefined；

  - 注意，非严格模式下，var 默认绑定到 window，可通过 this 获取，但 let/const 不会绑定到 window；
  - 注意，赋值操作，因赋值后的调用又创建了一次上下文，又进行了一次 this 确定；
  - 注意，虽然严格模式下，函数体内 this 指向 undefeind，但在全局环境的 this 还是会指向 window 无报错…

- 隐式绑定：即对象点方法的形式调用；

  - 注意，赋值操作，因赋值后的调用又创建了一次上下文，又进行了一次 this 确定；
  - 注意：赋值操作并不限于等号/冒号/传参/逗号操作符；

- 显式绑定：即 call/apply(obj, ...) 绑定，意为：在 obj 中使用 function；在对象上强制调用函数，直接指定 this 绑定对象；

  - 注意：一参是：空/null/undefined，则效果与不传参数一致(占位、普通调用)
  - 注意：从 this 绑定角度上看，两者本质相同，区别在参数2，前者数组形式传入，后者元素形式传入；

- 显式硬绑：显式绑定的变种 (本质是：在显式绑定的基础上用一层函数包裹)

  - 无法再次修改 this 指向，除非 new 操作
  - bind 会判断硬绑定函数，是否是被 new 调用，若是则使用 new 操作中新创建的 this 替换硬绑定的 this (确保 new 最高优先)
  
- new 绑定：构造函数中的 this 指向实例对象；个人理解为内部做了一层无法改变的 this 绑定；

  - 1、创建一个新的对象；2、将构造函数的 `this` 指向这个新对象；3、为这个对象添加属性、方法等；4、最终返回新对象；

  - 注意：若在构造函数中出现了显式 `return` 的情况

    - 若构造函数中显式返回一个值，且返回的是对象，则 `this` 就指向这个返回的对象；

    - 若构造函数中显式返回一个值，且返回的非对象，则 `this` 仍然指向实例；

    - ```js
      // 返回对象
      function Foo(){
          this.user = "TLP"
          const o = {}
          return o
      }
      const instance = new Foo()
      console.log(instance.user) // undefined
      
      // 返回非对象
      function Foo(){
          this.user = "TLP"
          return 1
      }
      const instance = new Foo()
      console.log(instance.user) // TLP
      ```

- 特殊：DOM 事件绑定：onclick 和  addEventerListener中 this 默认指向绑定事件的元素；

- 特殊：箭头函数，根据外层上下文绑定的 `this` 决定 `this` 指向；

- 特殊：匿名函数：默认指向全局对象，严格模式指向 undefined；比如 setTimeout、匿名函数的赋值调用而非对象点方法调用；

- 注意：赋值操作(=/:/传参/)+匿名函数-> 全局环境下调用匿名函数(个人认为是因为赋值的是一个地址引用，最后调用时，凭空创建上下文，this 默认绑定全局)

**<u>this 指向绑定优先级</u>**：默认绑定 < 隐式绑定 < 显式绑定 < 显式硬绑定 < new 绑定；以及判断 this 绑定位置：

1. 函数是否在 new 中调用(new 绑定)？如果是的话 this 绑定的是，新创建的对象；var bar = new foo()
2. 函数是否通过 call、apply(显式绑定)或者 bind (显示硬绑定)调用？如果是的话this 绑定的是，指定的对象；var bar = foo.call(obj2)
3. 函数是否在某个上下文对象中调用(隐式绑定)？如果是的话this 绑定的是，那个上下文对象；var bar = obj1.foo()
4. 若都不是的话，使用默认绑定。严格模式下，就绑定到 undefined，否则绑定到，全局对象；var bar = foo()

注意：箭头函数不遵从上述规则，其 this 的指向 根据外层(函数或者全局)作用域来决定，且这种绑定无法被修改，常用于回调中；

注意：箭头函数使用了词法作用域取代传统的 this 机制，同 self = this 机制一致；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913134636.png" alt="截屏2020-09-13 下午1.46.33" style="zoom:50%;" />



### 1-5、this 示例

万变不离其宗：调用，创建上下文，this 指向 确定——即调用即确定；注意匿名、注意赋值操作(=或:)(实际上还是通过调用即指向)；

```js
// 1、默认绑定
// 1、默认绑定
// 1、默认绑定
// Ex1
// 匿名函数实际上还是走那个形式，只不过它因为是宏任务，先交给浏览器 WebAPI, 完成计时后放入队列，等真正执行时是 window 执行
var a = {
  name: 'tlp',
  fun1: function(){ this.name },
  fun2: function(){
    setTimeout(function(){
      this.fun1() // TypeError: fun1 is not a function "undefined"
    },0)
  }
}



// 2、隐式绑定
// 2、隐式绑定
// 2、隐式绑定
// Ex1
function foo () { console.log(this.a) };
var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo2: obj.foo }

obj.foo(); 		// 1 隐式绑定；调用者为 obj 没毛病
foo2(); 			// 2 隐式丢失，赋值方式-等号；赋值后，调用时，上下文，this 为 window	 
obj2.foo2(); 	// 3 隐式丢失，赋值方式-冒号；foo2: obj.foo 乃赋值的另一种形式，所以最后调用者为 obj2 


// Ex2
function foo () { console.log(this.a)}
function doFoo (fn) {
  console.log(this) // window
  fn()
}
var obj = { a: 1, foo }
var a = 2
doFoo(obj.foo) // 2	隐式丢失，赋值方式-传参；参数传参也是赋值操作，随后 doFoo 创建上下文时，this 为 window


// Ex3
function foo () { console.log(this.a) }
function doFoo (fn) {
  console.log(this) // obj2
  console.log(this.a) // 3
  fn() // 2
}
var obj = { a: 1, foo }
var a = 2
var obj2 = { a: 3, doFoo }
obj2.doFoo(obj.foo) // 2 隐式丢失，赋值方式-传参；
// 迷惑题，但本质还是一样，虽然 obj2.doFoo 形式，让 doFoo this 指向 obj2, 但 fn 调用时，采取的是变量对象寻值的方式!!


// Ex4
var x = 10;
var foo = {
  x: 20,
  bar: function() {
    var x = 30;
    return this.x;
  }
};
console.log(foo.bar(), (foo.bar)(), (foo.bar = foo.bar)(), (foo.bar, foo.bar)())
// 隐式丢失，赋值方式-等号/逗号操作符；20 20 10 10 


// Ex5
var x = 3;
var foo = {
  x: 2,
  baz: {
    x: 1,
    bar: function() {
      return this.x;
    }
  }
}
var go = foo.baz.bar;
console.log(go());  // 3
// 隐式丢失，赋值方式-等号
console.log(foo.baz.bar()); // 1
// 指向最后



// 3、显式绑定
// 3、显式绑定
// 3、显式绑定
// Ex1
var obj1 = { a: 1 }
var obj2 = {
  a: 2,
  foo1: function () {
    console.log(this.a)
  },
  foo2: function () {
    setTimeout(function () {
      console.log(this)
      console.log(this.a)
    }.call(obj1), 0)
    // 注意：不能是 obj2.foo2.call(obj1) 写法，否则改变 this 为 foo1 环境，但内部计时器存在仍会指向 window
    // 相当于为匿名函数的作用域链增加 obj1 的变量对象，好让其搜索得到变量
  }
}
var a = 3
obj2.foo1() // 2
obj2.foo2() // obj1 1 改变的不是匿名函数，而是匿名的回调


// Ex2
var obj1 = { a: 1 }
var obj2 = {
  a: 2,
  foo1: function () {
    console.log(this.a)
  },
  foo2: function () {
    function inner () {
      console.log(this)
      console.log(this.a)
    }
    inner()
  }
}
var a = 3
obj2.foo1() // 2
obj2.foo2() // window 3  若 inner.call(obj1) 则 obj1 1
// 迷惑题，obj2.foo2 是隐式绑定，但执行 inner 时，就变为默认绑定了!!! 


// Ex3
function foo () {
  console.log(this.a)
  return function () {
    console.log(this.a)
  }
}
var obj = { a: 1 }
var a = 2

foo() 					// 2
foo.bind(obj) 	// function point
foo().bind(obj) // 2 function point
// 考察 bind 返回值形式


// Ex4
function foo (item) {
  console.log(item, this.a)
}
var obj = {
  a: 'obj'
}
var a = 'window'
var arr = [1, 2, 3]
// arr.forEach(foo, obj)
// arr.map(foo, obj)
arr.filter(function (i) {
  // 1 'obj'
  // 2 'obj'
 	// 3 'obj'
  console.log(i, this.a)
  return i > 2
}, obj) 
// forEach、map、filter 函数的第二个参数也是能显式绑定 this


// Ex5
var obj = {
  a: 1,
  foo: function (b) {
    b = b || this.a
    return function (c) {
      console.log(this.a + b + c)
    }
  }
}
var a = 2
var obj2 = { a: 3 }
obj.foo(a).call(obj2, 1)
// 3 + 2 + 1 == 6 
obj.foo.call(obj2)(1) 
// 2 + 3 + 1 == 6
// 综合考察传参、默认绑定、隐式绑定、闭包






// 4、显示硬绑
// 4、显示硬绑
// 4、显示硬绑






// 5、new 绑定
// 5、new 绑定
// 5、new 绑定
// Ex1
var name = 'window'
function Person (name) {
  this.name = name
  this.foo = function () {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')
person1.foo.call(person2)() // person2 window 
// 最后返回匿名函数并在 window 下调用，除非改变匿名绑定
person1.foo().call(person2) // person1 person2 


// Ex2
function Foo() {
    Foo.a = function() {
        console.log(1)
    }
    this.a = function() {
        console.log(2)
    }
}
Foo.prototype.a = function() {
    console.log(3)
}
Foo.a = function() {
    console.log(4)
}
Foo.a(); // 4
let obj = new Foo();
obj.a(); // 2
Foo.a(); // 1






// 6、箭头函数
// 6、箭头函数
// 6、箭头函数
// Ex1
var name = 'window'
var obj1 = {
  name: 'obj1',
  foo: function () {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var obj2 = {
  name: 'obj2',
  foo: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
var obj3 = {
  name: 'obj3',
  foo: () => {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var obj4 = {
  name: 'obj4',
  foo: () => {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
obj1.foo()() // obj1 window
obj2.foo()() // obj2 obj2
obj3.foo()() // window window
obj4.foo()() // window window
// 箭头函数指向外层，但并非指对象中的层级，而是以函数为层级区分，其中的 foo 与 name 是同层的, 所以最终指向 window
// 即字面量创建的对象，作用域是 window，若里面有箭头函数属性的话，this 指向的是 window



// Ex2
var obj = {
  name: 'obj',
  foo1: () => {
    console.log(this.name)
  },
  foo2: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
var name = 'window'
obj.foo1() // window 注意: window.obj.foo1 故应为 window
obj.foo2()() // obj obj




// Ex3
// 箭头函数的 this 无法通过 bind、call、apply 来直接修改，但可通过改变作用域中 this 的指向来间接修改
var name = 'window'
var obj1 = {
  name: 'obj1',
  foo1: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  },
  foo2: () => {
    console.log(this.name)
    return function () {
      console.log(this.name)
    }
  }
}
var obj2 = {
  name: 'obj2'
}
obj1.foo1.call(obj2)() // obj2 obj2
obj1.foo1().call(obj2) // obj1 obj1
obj1.foo2.call(obj2)() // window window
obj1.foo2().call(obj2) // window obj2
// 箭头函数里面的 this 是由外层作用域来决定的，且指向函数定义时的 this 而非执行时
// 箭头函数的 this 无法通过 bind、call、apply 来直接修改，但可通过改变作用域中 this 的指向来间接修改



// Ex4
var a = 123
const foo = () => a => {
    console.log(this.a)
}
const obj1 = {
    a: 2
}
const obj2 = {
    a: 3
}
var bar = foo.call(obj1)
console.log(bar.call(obj2)) // 123




// 7、匿名函数永远指向 window
// 7、匿名函数永远指向 window
// 7、匿名函数永远指向 window






// 综合示例
const o1 = {
    text: 'o1',
    fn: function() {
        return this.text
    }
}
const o2 = {
    text: 'o2',
    fn: function() {
        return o1.fn()
    }
}
const o3 = {
    text: 'o3',
    fn: function() {
        var fn = o1.fn
        return fn()
    }
}
console.log(o1.fn()) // o1
console.log(o2.fn()) // o1
console.log(o3.fn()) // undefined




// 综合示例2：字面量对象中的各种场景
var name = 'window'
var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name)
    }
  }
}
var person2 = { name: 'person2' }

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // window
person1.foo2.call(person2) // window

person1.foo3()() // window
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1




// 综合示例3：构造函数中的各种场景
var name = 'window'
function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // person1
person1.foo2.call(person2) // person1

person1.foo3()() // window
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1




// 综合示例4:
var name = 'window'
function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() // window
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

person1.obj.foo2()() // obj
person1.obj.foo2.call(person2)() // person2
person1.obj.foo2().call(person2) // obj




// 综合示例5
function foo() {
  console.log( this.a );
}
var a = 2;
(function(){
  "use strict";
  console.log(this) // undefined
  foo(); // 2
})();
```







## 二、EventLoop

大体就是，JS引擎通过将一个一个执行上下文放入执行栈依次执行，若遇到微任务则将其放入当前的微任务队列中，若遇到宏任务则将其交由事件触发线程管理的宏任务队列中；当栈内所有内容执行完毕，则将微任务队列中的内容放入执行栈执行；当这个也执行完毕，则进行 UI 渲染(实际上发生的内容还有很多，见下方)，然后从事件触发线程处获取下一个宏任务，存入栈并执行；循环往复；

- 首先，当执行完微任务后，会判断 `document` 是否需要更新，因为浏览器是 60Hz 的刷新率，每 16.6ms 才会更新一次；
- 然后，判断是否有 `resize` 或 `scroll` 事件，有则触发，故两事件也是至少 16ms 才会触发一次，且自带节流功能；
- 然后，判断是否触发了 media query；
- 然后，更新动画并且发送事件；
- 然后，判断是否有全屏操作事件；
- 然后，执行 `requestAnimationFrame` 回调(主线程之外)；
- 然后，执行 `IntersectionObserver` 回调，该方法用于判断元素是否可见，可用于懒加载，但兼容性不好；
- 最后，更新界面(宏任务)；
- 注意：以上是一帧中可能会做的事情；若在一帧中有空闲时间，就会去执行 `requestIdleCallback` 回调；[详看](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)





### 2-1、EventLoop

浏览器包含诸多线程：Browser进程(浏览器的主进程)、三方插件进程、GPU进程等，其中 GPU 进程包含以下线程：

- **JS引擎线程**
  - 注意：GUI渲染线程、JS引擎线程互斥，为防止DOM渲染不一致性，其中一线程执行时另一线程会被挂起，脚本置底
- **GUI渲染线程**
  - 负责 UI 渲染；
- **事件触发线程**
  - 与 EventLoop 密切相关；
- **定时触发器线程**
- **异步HTTP请求线程**
  - 配合 Browser 主线程与跨域拦截相关；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123824.png" style="zoom:40%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123825.png" style="zoom:40%;" align="" />

**<u>*浏览器页面初次渲染完毕后，JS引擎线程结合事件触发线程的工作流程如下(事件循环机制)：*</u>**

- 首先，JS 引擎线程执行 JS 代码，将整段脚本作为首个 **宏任务** 执行；即将执行上下文推入执行栈依次执行
- 然后，代码直接执行过程中，若发现**新的宏任务** 交由事件触发线程管理(推入宏任务队列)，**微任务** 则推入事件触发线程的微任务队列；
- 然后，当前宏任务执行完全，执行栈为空，检查微任务队列，若有则依次执行，直到微任务队列为空；若此时遇到新的宏任务，则将其再次移交事件触发线程管理，**<u>若遇到新的微任务，则将其推入事件触发线程的新的微任务队列中，并在执行栈内容执行为空后再去执行；</u>**
- 然后，执行浏览器 UI 线程的渲染工作；
- 然后，检查是否有 Webworker 任务，有则执行；
- 最后，从事件触发线程获取队首新的宏任务并执行，回到第二步，依此循环，直到宏任务和微任务队列都为空；
- 注意：垃圾回收通过增量标记发生在上述过程的间隙中；
- 所以：浏览器 EventLoop 按：宏-微-其他(UI/WebWorker/rAF/Else)-宏-微…次序执行；

**<u>*宏任务(macrotask—task)、微任务(microtask—jobs) 由来：*</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200913140611.png" alt="截屏2020-09-13 下午2.06.08" style="zoom:50%;" />

**<u>*宏任务(macrotask—task)、微任务(microtask—jobs) 分类：*</u>**

- **宏任务**：script (主代码块)、`setTimeout` 、`setInterval` 、`setImmediate` 、I/O 、UI rendering、WebWorker；
  - 注意：并非所有均为异步；
- **微任务**：process.nextTick、Promises.then/reject-catch-finally、Object.observe、MutationObserver、以 Promise 为基础开发的其他技术(比如 fetch API)、<u>V8 的垃圾回收过程</u>等；
  - 注意：宏微任务由来：

**<u>*宏任务(macrotask—task)、微任务(microtask—jobs) 区别：*</u>**

- 宏任务：由事件触发线程来维护，执行栈中首次执行或从事件触发线程的事件队列中获取的任务；
  - 浏览器为使 JS引擎线程与GUI渲染线程有序切换，会在当前宏任务结束后，下一宏任务执行开始前，对页面进行重新渲染；
  - 当前宏任务执行后，会将在它执行期间产生的所有微任务都执行一遍，但嵌套更深的微任务不予处理；
- 微任务：同由事件触发线程维护；当前宏任务执行结束后立即执行的任务，在 UI渲染前执行；



### 2-2、EventLooop 示例

- 代码考察的话不考虑 UI 等内容，而只按照：宏-微-宏-微次序执行，但若有 rAF，则须考虑回调的执行；
- await 处理关键：将 await 同行代码化为 new Promise 内容(同步)，将 await 后行内容化为 promise.then 内容即可
- new Promise 相当于同步任务，会立即执行；
- 内里 return new Promise 处理：相当于回归链式调用，由上往下执行；
- 嵌套 promise 处理关键：厘清微任务，执行顺序还是宏微宏微，若无宏任务，则连续执行微任务，**<u>但执行顺序是按加入微任务队列的先后执行的</u>**；

```js
// Ex1
console.log('ss');
setTimeout(function() {
  console.log('setTimeout');
}, 0)
Promise.resolve().then(function() {
  console.log('p1t1');
}).then(function() {
  console.log('p1t2')
})
console.log('se');
// ss se p1t1 p1t2 setTimeout
// 宏 script -> 微 promise1 2，-> 宏 setTimeout



// Ex2
console.log('ss');
setTimeout(function() {
  console.log('setTimeout');
}, 0)
Promise.resolve().then(function() {
  console.log('p1t1');
}).then(function() {
  console.log('p1t2')
})
Promise.resolve().then(function() {
  console.log('p2t1');
}).then(function() {
  console.log('p2t2')
})
console.log('se');
// ss se p1t1 p2t1 p1t2 p2t2 setTimeout
// 注意: 链式调用并非链式添加微任务，每当添加完后就离开执行外面内容，而非一直链式添加微任务队列



// Ex3
// 1
console.log('ss');
// 16
setTimeout(function() {
  console.log('setTimeout');
}, 0)
// 执行时发现微任务 3-p1t1，塞入微任务队列1
Promise.resolve().then(function() {
  // 3
  console.log('p1t1');
  // 执行时发现微任务 5-p1t2，塞入微任务队列2
}).then(function() {
  // 5
  console.log('p1t2');
  // 执行时发现微任务 7-p1t3，塞入微任务队列3
}).then(function() {
  // 7
  console.log('p1t3');
  // 执行时发现微任务 10-p1t3-t1，塞入微任务队列4
  Promise.resolve().then(function(){
    // 10
    console.log('p1t3-t1');
    // 执行时发现微任务 12-p1t3-t1-t1，塞入微任务队列5
    Promise.resolve().then(function(){
      // 12
    	console.log('p1t3-t1-t1');
  	})
    // 执行时发现微任务 13-p1t3-t2，塞入微任务队列5
  }).then(function(){
    // 13
    console.log('p1t3-t2');
  })
})
// 执行时发现微任务 4-p2t1，塞入微任务队列1
Promise.resolve().then(function() {
  // 4
  console.log('p2t1');
  // 执行时发现微任务 6-p2t2，塞入微任务队列2
}).then(function() {
  // 6
  console.log('p2t2');
  // 执行时发现微任务 8-p2t2-t1，塞入微任务队列3
  Promise.resolve().then(function(){
    // 8
    console.log('p2t2-t1');
    // 执行时发现微任务 11-p2t2-t2，塞入微任务队列4
  }).then(function(){
    // 11
    console.log('p2t2-t2');
    // 执行时发现微任务 14-p2t2-t2-t1，塞入微任务队列5
    Promise.resolve().then(function(){
      // 14
    	console.log('p2t2-t2-t1');
      // 执行时发现微任务 15-p2t2-t2-t1-t1，塞入微任务队列6
      Promise.resolve().then(function(){
        // 15
    		console.log('p2t2-t2-t1-t1');
  		})
  	})
  })
  // 执行时发现微任务 9-p2t3，塞入微任务队列3
}).then(function() {
  // 9
  console.log('p2t3')
})
// 2
console.log('se');

// ss
// se
// p1t1
// p2t1
// p1t2
// p2t2
// p1t3
// p2t2-t1
// p2t3
// p1t3-t1
// p2t2-t2
// p1t3-t1-t1
// p1t3-t2
// p2t2-t2-t1
// p2t2-t2-t1-t1
// setTimeout
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123847.png" style="zoom:50%;" align=""/>

```js
// 先宏任务124 -> 再微任务then-53 -> 再宏任务6
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123848.png" style="zoom:50%;" align=""/>

```js
// 1 8(宏) 3 4 5 7(微) 2(宏) 6(宏)
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123849.png" style="zoom:50%;" align=""/>

```js
// click(宏) promise(微) mutate(微) click(宏) promise(微) mutate(微) timeout(宏) timeout(宏)
// 相当于两个 onClick 事件函数展开，mutationOb 是微任务
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123850.png" style="zoom:50%;" align=""/>

```js
// 1 3 5(宏) 4(微) 2(宏)
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123851.png" style="zoom:50%;" align=""/>

```js
// "马上..、代码..."(宏) "then"(微) "定时器"(宏)
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123852.png" style="zoom:50%;" align=""/>

```js
// 2 3 5(宏) 4(微) 1(宏)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123853.png" style="zoom:50%;" align=""/>

```js
// 1 10(宏) 5 8 7 9(微-注意顺序) 2(宏) 3 4(微) 6(宏) 
// 执行微任务遇到微任务，先塞入队列，注意顺序
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123834.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123835.png" style="zoom:50%;" align=""/>

```js
console.log('script start')

async function async111() {
  await async2222()
  console.log('async1 end')
}
async function async2222() {
  console.log('async2 end')
}
async111()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
.then(function() {
  console.log('promise1')
})
  .then(function() {
  console.log('promise2')
})

console.log('script end')
// script start => async2 end => Promise => script end => async1 end => promise1 => promise2 => setTimeout
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123836.png" style="zoom:50%;" align=""/>

```js
// scriptStart => async1Start => async2 => promise1 => scriptEnd => async1End => promise2 => setTimeout
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123837.png" style="zoom:50%;" align=""/>

```js
// scriptStart => async1Start => promise1 => promise3 => scriptEnd => promise2 => async1End(注意顺序) => promise4 => setTimeout
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123838.png" style="zoom:50%;" align=""/>

```js
// scriptStart => async1Start => promise1 => scriptEnd => promise2 => setTimeout3 => setTimeout2 => setTimeout1
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123839.png" style="zoom:50%;" align=""/>

```js
// scriptStart => a1Start => a2 => promise2 => scriptEnd => promise1 => a1End => promise2Then => promise3 => setTimeout
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123840.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123841.png" style="zoom:50%;" align=""/>

比如：上图一轮：promise1 后只有 then 微任务，遂进入 then 执行，输出 then11 和 promise2，随后发现 2 个微任务：一个是里面的 then，一个是外面的 then，然后执行…

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123842.png" style="zoom:50%;" align=""/>

```js
// promise1 => then11 => promise2 => then21 => then12 => then23
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123843.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123844.png" style="zoom:50%;" align=""/>

```
// promise1 => promise3 => then11 => promise2 => then31 => then21 => then12 => then23
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123845.png" style="zoom:50%;" align=""/>

```js
// 1 2 3 4 5 6 7 8 9
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123846.png" style="zoom:50%;" align=""/>

```js
// promise1 => then11 => promise2 => then21 => then23 => then12
```













### 2-3、NodeEvLoop

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123826.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123827.png" style="zoom:50%;" />

**<u>*一、宏任务 macrotask 执行情况(繁琐)：*</u>**

**<u>1、timer 阶段</u>**：检查定时器诸如 setTimeout、setInterval，若到时间，就执行回调；

- **<u>注意，此阶段由 poll 阶段控制；</u>**

**<u>2、I/O 异常回调阶段</u>**：处理上一轮循环中的 <u>少数未执行</u> 的 I/O 回调，比如 TCP 连接遇到 ECONNREFUSED，就会在此时执行回调；

**<u>3、空闲、预备状态</u>**：第 2 阶段结束，poll 阶段未触发之前；

**<u>4、poll 阶段</u>**：此阶段会做两件事：

- 4-1、回到 timer 阶段执行回调；
- 4-2、执行 I/O 回调；具体做法是：
  - 若存在定时器，且 poll callback 函数队列为空，且有定时器到达时间，EvLoop 回到  **<u>timer 阶段</u>**(拿出到时定时器回调执行)；
  - 若不存在定时器, 则查看 poll callback 函数队列；
    - 若队列不为空，便遍历 poll callback 队列并同步执行，直到队列为空或者达到系统限制；
      - **<u>关键：当 Node 代码异步操作(比如 文件I/O、网络I/O等)执行完成后，就会通过 `data`、 `connect` 等事件通知，使得 Ev Loop 到达  `poll` 阶段;</u>**
    - 若队列为空，则检查是否有 setImmdiate 回调；
      - 若有则前往 **<u>check 阶段</u>**；
      - 若无则继续等待，相当于阻塞了一段时间，等待 callback 被加入到队列中并立即执行，达到超时时间后则自动进入 **<u>check 阶段</u>**；

**<u>5、check 阶段</u>**：相对简单的阶段，直接执行 setImmdiate 的回调；

**<u>6、关闭事件的回调阶段</u>**：若一个 socket 或句柄 (handle) 被突然关闭，比如 socket.destroy()， `close` 事件回调就会在此阶段执行；



**<u>*一、宏任务 macrotask 执行情况(精简-适合记忆)：*</u>**

 **<u>1、timer 阶段</u>**：检查定时器诸如 setTimeout、setInterval，若到时间，就执行回调；

 **<u>2、poll 阶段</u>**：Node 代码的异步操作，比如 文件I/O、网络I/O等执行完成后，就会通过 `data`、 `connect` 等事件，使得事件循环到达  `poll` 阶段，以通知 JS 主线程，到达了这个阶段后：

- 若当前已存在定时器，且有定时器到达时间，便拿出执行，EventLoop 将回到  **<u>timer 阶段</u>**；
- 若无定时器, 便会查看回调函数队列；
  - 若队列不为空，便遍历 callback 队列并同步执行，直到队列为空或者达到系统限制；
  - 若队列为空，则检查是否有 `setImmdiate` 回调；
    - 若有则前往 **<u>check 阶段</u>**；
    - 若无则继续等待，相当于阻塞了一段时间，等待 callback 被加入到队列中并立即执行，达到超时时间后则自动进入 **<u>check 阶段</u>**；

**<u>3、check 阶段</u>**：相对简单的阶段，直接执行 `setImmdiate` 的回调；

**<u>*二、微任务 microtask 执行情况：*</u>**在以上每个阶段完成前 清空  microtask 队列，下图中的 Tick 就代表了 microtask

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123828.png" style="zoom:50%;" align=""/>







**<u>*与EvLoop 区别：浏览器中的微任务是在 每个相应的宏任务 间执行的，而 Node  中的微任务是在 不同阶段间 执行；浏览器执行流程是：宏-微-其他(UI/WebWorker/rAF/Else)-宏-微…次序，而 Node 则还分版本：*</u>**

- node 版本 >= 11：与浏览器表现一致，定时器运行完立即运行相应的微任务；

- node 版本 < 11：若第一个定时器任务出队并执行完，发现队首任务仍是一个定时器，则将微任务暂时保存，直接去执行新的定时器任务，当新的定时器任务执行完后，再一一执行中途产生的微任务；**<u>*宏任务-微-timer阶段(定时器)-微-Poll阶段(或跳转 timer 阶段，或check阶段，或IO回调等待执行超时则进入 check 阶段)-微-check阶段(setImmdiate 回调)-微-…*</u>**

- ```js
  setTimeout(()=>{
      console.log('timer1')
      Promise.resolve().then(function() {
          console.log('promise1')
      })
  }, 0)
  setTimeout(()=>{
      console.log('timer2')
      Promise.resolve().then(function() {
          console.log('promise2')
      })
  }, 0)
  // node 版本 >= 11
  timer1
  promise1
  time2
  promise2
  // node 版本 < 11
  timer1
  timer2
  promise1
  promise2
  ```

  



### 2-4、NodeEvLoop 示例

- process.nextTick 是独立于 Node EvLoop 的任务队列；当每个 NodeEvLoop 阶段完成后，若存在 nextTick 队列，就会 **<u>清空队列中的所有回调函数</u>**，且**<u>优先于其他微任务</u>** 执行；



```js
setTimeout(() => {
 console.log('timer1')

 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)

process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
// 以上代码，无论如何，永远都是先把 nextTick 全部打印出来


// Ex2
setTimeout(function() {
  console.log('timeout')
})

process.nextTick(function(){
  console.log('nextTick 1')
})

new Promise(function(resolve){
  console.log('Promise 1')
  resolve();
  console.log('Promise 2')
}).then(function(){
  console.log('Promise Resolve')
})

process.nextTick(function(){
  console.log('nextTick 2')
})
// Node环境(10.3.0版本)中打印的顺序： Promise 1 > Promise 2 > nextTick 1 > nextTick 2 > Promise Resolve > timeout
// Node.js的v10.x版本中对于 process.nextTick 的说明如下：
The process.nextTick() method adds the callback to the "next tick queue". Once the current turn of the event loop turn runs to completion, all callbacks currently in the next tick queue will be called.
This is not a simple alias to setTimeout(fn, 0). It is much more efficient. It runs before any additional I/O events (including timers) fire in subsequent ticks of the event loop.
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123829.png" style="zoom:50%;" align=""/>

```js
// Node 环境下:
// 1 7(主阶段) 6(process.nextTick在阶段间、微任务前执行) 8(微任务) 2 4 9 11(poll 执行 timer 回调) 3 10(阶段间、微任务前) 5 12(微任务)

// 浏览器下: 可用 Promise.resolve().then(()=>{ 替换 process.nextTick；
//  1 7 6 8 2 4 3 5 9 11 10 12
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123830.png" style="zoom:50%;" align=""/>

```js
// 1 10(宏) 8 9(nextTick) 5 7(微) 2 6(timer) 3(微) 4(nextTick)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123831.png" style="zoom:50%;" align=""/>

```js
// 1 7(宏) 6(nextTick) 8(微) 2 4 9 11(timer) 3 10(nextTick) 5 12(微)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123832.png" style="zoom:50%;" align=""/>

```js
// 1 7 6 8 2 4 3 5 9 11 10 12
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123833.png" style="zoom:50%;" align=""/>

```js
// 1 7 6 8 9 11 10 12 2 4 3 5
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123854.png" style="zoom:40%;" align=""/>

```js
// start end(宏) promise3(微) timer1 timer2(timer阶段) promise1 promise2(微)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123855.png" style="zoom:60%;" align=""/>

```js
// scriptStart async1Start async2 promise1 scriptEnd(宏，其中 async 同行等同 new promise, 而行后内容可视为 promise.then) process(nextTick) async1End promise2(微) setTimeout(timer阶段) setImmediate(check阶段)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909123856.png" style="zoom:60%;" align=""/>

```js
// scriptStart async1Start async2 promise1 scriptEnd(宏) async1End promise2(微) setTimeout(timer 阶段)
```





## 三、垃圾回收

数据分基本数据类型与引用数据类型，前者存储在栈内存中，随 ESP 切换而销毁，后者存储在堆内存中，堆内存使用新生代老生代两种垃圾回收方式，新生代采用 Scavenge 算法，其采用复制方式，将新生代内存空间一分为二FromTo，前者存放分配后的对象，当 From 快被写满时，为对象们增添标记，进入清理阶段，若为存活对象，则迁移到 To，否则销毁，随后FromTo角色翻转；上述过程循环；若某对象多次复制还存活，或迁移过程中，某对象刚好超过 To 空间的 ¼，则将其晋升到老生代；老生代则采用标记清除、标记整理算法，前者在标记阶段标记堆中所有对象，随后取消环境中使用中的变量或存在强引用的对象的标记，随后清理掉还附有标记的的对象；然后进入标记整理，将存活对象全部往一端靠拢(类似磁盘碎片整理)，此过程耗时长，容易造成卡顿；注意：这些垃圾回收算法均会导致应用逻辑的暂停，即全停顿；新生代与老生代的标记清除过程短暂影响不大，标记整理耗时过长；后续 V8 进行优化，引入增量标记，将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JS 应用逻辑交替进行，直到标记阶段完成，才进入内存碎片的整理；使用增量标记算法，可将一完整的垃圾回收任务拆分为很多小的任务，而小任务执行时间较短，可穿插在其他的 JS 任务中间执行，如此当执行某些动画效果时，就不会让用户因为垃圾回收任务而感受到页面的卡顿；使得垃圾回收过程对 JS 应用的阻塞时间减少为原来的 1 / 6；

内存泄露：即不再用到的内存也无及时释放，一般而言，JS 内存泄露基本是人为导致，常见于闭包、为正确关闭的定时器、未正确销毁的 DOM 引用、不规范声明变量导致的全局变量溢出等；应加强规范，或使用各类 lint 加以约束开发者行为；





