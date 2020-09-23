# 总结

主要厘清实例、构造函数、原型间的关系，这样 `__proto__` 和 prototype 就明白了；然后适当研究继承的发展历程(大致如下)，主要是寄生组合继承的研究与应用；设计模式单独拎出来说其实有点别扭，主要是思想层面上；

- 首先，最初是 **<u>原型链继承</u>**，通过将子类实例的原型指向父类实例来继承父类的属性和方法，但原型链继承的缺陷在于<u>对子类实例继承的引用类型的修改会影响到所有的实例对象，以及无法向父类的构造方法传参</u>；
- 因此，引入 **<u>构造函数继承</u>**, 通过在子类构造函数中调用父类构造函数并传入子类 this 来获取父类的属性和方法，但构造函数继承也存在缺陷，<u>构造函数继承不能继承到父类原型链上的属性和方法</u>；
- 所以，综合两种继承的优点，提出 **<u>组合式继承</u>**，但组合式继承也引入新问题：<u>其每次创建子类实例都执行两次父类构造方法</u>；最后，通过将子类原型指向父类实例，改为子类原型指向父类原型的浅拷贝来解决这一问题，也即最终实现：**<u>寄生组合式继承</u>**



## 一、基本内容

### 1-1、关系

**<u>*原型*</u>**：显式原型；每个函数特有的属性 prototype，其指向一个对象，此对象及原型；本质是函数在构造调用时，即创建实例过程中，系统自动创建的与函数相关的一个对象；隐式原型；每个对象均有属性 `__proto__`；鉴于这种隐式原型指向显式原型对象，而对象的隐式原型又指向下一个显式原型对象，而形成的一种的链条结构即 **<u>*原型链*</u>**；本质即链表的数据结构，`__proto__` 即结点；

- 注意：本来(原型)是内部对象，无法访问的，但浏览器最初却自实现了一个 `__proto__` 方法，使得实例可通过此来访问得到函数原型；后来被标准化为 prototype；
- 注意：感觉上不管 `__proto__` 还是 prototype 都能指向原型，只是依附的主体不一样，前者是对象，后者是函数，而隐式还是显式，更多的是代表其过去的历史…(这段话有点表述不清)
- 注意：一般讲到原型链，就会涉及查找更新操作，即 GetSet 操作，若在对象上没有找到需要的属性或者方法引用，引擎就会继续在 [[Prototype]] 关联的对象上进行查找；还涉及 Object.definedProperty 操作，还涉及操作符的操作：
  - in 操作符(遍历链上所有属性) 等内容；
  - for...in... 能获取到实例对象自身的属性和原型链上的属性(可枚举属性)；
  - Object.keys() 和 Object.getOwnPropertyNames()只能获取实例对象自身属性(可枚举属性)；
  - Object.hasOwnProperty() 方法传入属性名来判断某属性是不是实例自身属性(可枚举属性)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091153.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091157.png" style="zoom:50%;" align="" />

**<u>*构造函数*</u>**：即函数的构造调用，即函数的 new 调用；并非特殊函数，只是函数在此场景下的别称；

**<u>*实例*</u>**：即函数构造调用得到的产物；本质是中间对象，或中间对象环境下调用产生的结果(涉及 new 过程)；

**<u>*关系*</u>**：

- 实例与构造：`实例.__proto__ 指向构造它的函数的原型`；遂可通过 `__proto__` 找到其原型并使用其属性和属性；比如：`实例.__proto__.constructor ` (绕来绕去实际就那么回事)；
- 实例与原型：函数与实例间是构造关系
- 构造与原型：函数.prototype 指向函数原型，函数原型即：函数.prototype(没有实体，用属性指向)；而原型，可通过：原型.constructor 指回构造函数；
- 显式与隐式原型关系：对象的隐式原型 `__proto__` 指向，创建这个对象的函数，的显式原型 prototype；
  - 前者是任意函数在创建后均拥有的属性，其指向函数的原型对象；作用是：实现基于原型的继承与属性共享；
    - 注意：通过 Function.prototype.bind 构造出的函数是例外，其没有 prototype 属性；
  - 后者是任意 JS 对象，都有内置属性 [[prototype]]，指向创建此对象的函数的显式原型；作用是：构成原型链，同样可用以实现基于原型的继承与属性共享，当找寻某对象属性或方法时，便会沿此进行搜索；
    - ES5 前，没有标准方法访问此属性(prototype)，但大多数浏览器均支持通过 `__proto__` 访问；
    - ES5 后，有标准方法可访问：Object.getPrototypeOf()：`Object.getPrototypeOf(fn) == test.prototype // true`
    - 注意：Object.prototype 是唯一的，没有原型的对象：

```js
// 三者的关系(再述):
实例.__proto__ === 原型

原型.constructor === 构造函数

构造函数.prototype === 原型

实例.constructor === 构造函数
// 注意: 其实实例上并不是真正有 constructor 这个指针，它其实是从原型链上获取的: 
// instance.hasOwnProperty('constructor') === false 

// 例如: 
// const o = new Object()
// o.constructor === Object   --> true
// o.__proto__ = null;
// o.constructor === Object   --> false 

// 对象原型 prototype 属性 与 构造函数 prototype 属性间区别：
// 前者可通过 Object.getPrototypeOf(obj) 或，已被弃用的 __proto__ 属性获得
// 前者是每个实例上都有的属性，后者是构造函数的属性
// 也就是说，Object.getPrototypeOf(new Foobar())和 Foobar.prototype 指向着同一个对象
// function Foobar(){} -> undefined
// foobar = new Foobar() -> Foobar {}
// Object.getPrototypeOf(foobar) == Foobar.prototype -> true
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091146.png" style="zoom:50%;" align="" />

- <u>别再留意下面的注意了!!! 其实没什么特别需要注意的，厘清它们之间的关系就够了!!!</u>
- 看上面的图，实例的隐式指向构造它的函数的显式、而函数除了有显式，还应当注意其也是一个对象也有一个隐式原型，而函数的隐式，均指向函数的显式，即 Function.prototype，而原型对象又 TM 是对象，好了，对象又 TM 有隐式，最终指向 Object.prototype，好了，这是老大了，JS  一切均对象就是这么由来的，老大的本源是什么?? null，无中生有；(这段语气有点暴躁，其实是暴躁自己为何这么简单的内容——就一链表，还要跟自己解释这么久…请忽略)；
- 所以注意点只有函数的隐式原型指向 Function.prototype…其实也没啥好注意的，只是大多数人忽略了原来函数也有隐式指向；
- 别再留意下面的注意了!!! 其实没什么特别需要注意的，厘清它们之间的关系就够了!!!

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091158.png" style="zoom:50%;" />

**<u>*注意*</u>** (感觉实际上不用注意，略看)：

- 任何对象均函数，均继承 Function 所有属性和方法，而 Function 是内置的构造函数也是对象，均继承 Object 的所有属性方法；
- 各种 function、Object、Function 等实际上均为 new Function() 后的实例，而这些实例原型 `__proto__` 均指向 Function.prototype；同理：Object、Number、String、Array、Function、Date 等均为函数，而所有函数均由 Function 创建，故其原型 `__proto__` 指向 Function.prototype：

- `__proto__` 为 构造器原型；

  - ```js
    __proto__ == constructor.prototype // true
    // 实际上是 - 饶了一圈...
    window.__proto__ == window.constructor.prototype
    window.__proto__ == window.__proto__.constructor.prototype
    ```

- `__proto__` 实际上是 getter setter，源于 Object.prototype，使用时可理解成返回 Object.getPrototypeOf(obj)；

  - ```js
    Object.getPrototypeOf(fn) == fn__proto__ // true
    ```

- `__proto__` 指向取决于对象创建的实现方式，图3-5；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091141.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091142.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091143.png" style="zoom:50%;" align=""/>



### 1-2、new & instanceof

**<u>*new 过程*</u>**：看下面描述即可：

- **1、new 过程中，内部会创建一中间对象，并继承构造函数 prototype**；以继承构造函数原型上的属性和方法；
- **2、在中间对象中执行构造函数(apply)，以修改 this 指向为返回值/中间对象**；以实现构造函数内的赋值操作；
- **3、返回值** (规范规定，若构造方法返回对象，则返回该对象，否则返回中间对象)；

```js
// new 是关键字, 这里用函数来模拟, new Foo(args) <=> myNew(Foo, args)
function myNew(foo, ...args) {
  // 1、创建新对象, 并继承构造方法的 prototype 属性
  // 为了把 obj 挂原型链上, 继承构造函数原型上的属性和方法，相当于 obj.__proto__ = Foo.prototype 
  let obj = Object.create(foo.prototype)  
  
  // 2、执行构造方法, 并为其绑定新 this
  // 为了让构造方法能进行 this.name = name 类似操作,为了执行构造函数内的赋值操作, args 是构造方法的入参, 因为此处用 myNew 模拟, 故入参从 myNew 传入
  let result = foo.apply(obj, args)

  // 3、若构造方法已 return 了一个对象，则就返回该对象，否则返回 myNew 创建的新对象
  // 一般情况下，构造方法不会返回新实例，但使用者可以选择返回新实例来覆盖 new 创建的对象
  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj
}

// 测试：
function Foo(name) {
  this.name = name
}
const newObj = myNew(Foo, 'zhangsan')
console.log(newObj)                 // Foo {name: "zhangsan"}
console.log(newObj instanceof Foo)  // true
```

**<u>*instanceof 过程*</u>**：即遍历搜索左侧的隐式原型，是否存在与右边显式原型相等的对象；

即 `left Value.__proto__.__proto__.__proto__`... ，直至找到 / 到达顶层为止

```js
function instance_of(L, R) {
  var O = R.prototype // 取 R 显式原型
  L = L.__proto__;		// 取 L 隐式原型
  while(true) {
    if(L === null) return false;
    if(L === O) return true;	// 注意严格相等
    L = L.__proto__;
  }
}
```

**<u>*instanceof 其他注意事项：*</u>**

注意：过去 instanceof 用于判断数组是否属于 Array 对象，但问题是数组 instanceof Object 仍为 true，皆因其内部的遍历搜索，数组.隐式原型 ==  Array.prototype == true，Array.prototype.隐式原型也 == Object.prototype，所以无法准确判断；不能用来作为判断数据类型的方法，或基本只用于判断数组类型值；

注意：若修改 prototype 的 值，则会改变原有(图2)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091202.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091203.png" style="zoom:50%;" align="" />

注意：Fun 是单纯的函数，`Fun.__proto__` 属于 Function.prototype，但除非 new 出来，否则不属于 Fun.prototype；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923100809.png" alt="截屏2020-09-23 上午10.08.02" style="zoom: 67%;" />

注意：JS 在访问 str 属性时创建临时 String 对象 (假设叫tmpStr)，并在得到此返回值时销毁临时对象，故此处是 `tmpStr.__proto__` 的值；而引用类型的字面量和基础类型的不一样(图2)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091205.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091206.png" style="zoom:50%;" align="" />

注意：对于三种基本类型的字面声明，instanceof 均返回 false；而其他类型的字面量声明则为 true；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091207.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091208.png" style="zoom:50%;" align="" />

注意：`Object.prototype.__proto__` 为 null，但 null 不等于 `Object.prototype`；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091209.png" style="zoom:50%;" align="" />

注意：Object instanceof Object

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091210.png" style="zoom:50%;" align="" />

注意：Function instanceof Function

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091211.png" style="zoom:50%;" align="" />

注意：Foo instanceof Foo

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091212.png" style="zoom:50%;" align="" />





## 二、面向对象编程

面向对象编程：OOP：将构成问题事务分解成单或多个对象，但分拆成对象并非为了完成某一步骤，而为描述某个事物在整个解决问题的步骤中的行为；示例：Eat(Dog，Apple)；具有良好的可移植性和可扩展性；特性：多态、封装、继承

面向过程编程：POP：分析出解决问题所需步骤，然后用方法将各个步骤逐一实现，使用时依次调用；示例：Dog.eat(apple)；优点：同步思维开发；但牵一发而动全身，移植性和可扩展性差；

面向组件编程：COP；面向方面编程——AOP；面向服务编程：SOP；

但是：JS 很容易模拟一个类，且可一定程度上做到面向对象中的三大特性：封装、继承、多态；尤其是继承，从 ES5 的模拟到 ES6 的语法糖，但最终目的，还是为方便程序员用面向对象的方式来组织代码；





### 2-1、多态&封装

**<u>*多态*</u>**：即根据传入参数的个数不同，调用相应的方法，而 JS 是弱类型，不存在编译时要确定类型，天然支持多态；即在对象内部通过判断类型进行多态开发；

**<u>*封装*</u>**：将客观事物封装成抽象的类，隐藏属性和方法的实现细节，仅对外公开接口(可见性控制)；JS 通过闭包实现封装；

ES6 class 为语法糖， JS 没有类，只是模拟行为，均借助于：原型对象、构造函数来实现；

- 私有属性/方法：只能在构造函数内访问不能被外部所访问：构造函数内使用 var 等声明的属性/方法；

- 公有属性/方法(实例方法)：对象外可访问到对象内的属性和方法：构造函数内使用 this 或构造函数原型 prototype 上设置；

- 静态属性/方法：定义在构造函数上的方法，无需实例即可调用；

- 注意：类不会提升(不像普通变量和函数)，注意报错；

- 注意：constructor 的 var 等声明变量为私有变量不可获取

- ```js
  class TLP {
    constructor () {
      // 在 constructor 声明，通过 var 声明 - undefined window
      // var type = 'fykms'
      // 在 constructor 声明，且不通过 var 声明 - undefined oldman1
      // type = 'old man1'
      this.name = 'tlp'
    }
    // 不在 constructor 声明，且不通过 var 声明 - hi3 window
    // type = 'hi3'
    // 不在 constructor 声明，通过 var 声明 - 报错: Uncaught SyntaxError: Unexpected identifier
    // var type = 'hi4';
    getType = function () {
      console.log(this.type)
      console.log(type)
    }
  }
  var type = 'window'
  var tlp = new TLP()
  tlp.getType()
  ```

- 注意：ES6 的 ES5 对应转换：
  - Constructor **<u>外部</u>**：箭头函数方法、属性最终变为实例 this 上的方法/属性，优先级较低；
  - Constructor **<u>内部</u>**：this 方法、this 属性最终变为实例 this 上的方法/属性，优先级较高，会覆盖前者同名值；
  - Constructor **<u>内部</u>**：普通定义的方法/属性最终变为实例的普通方法/属性；
  - Constructor **<u>外部</u>**：普通定义的方法，最终变为原型链方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091213.png" style="zoom:70%;" />





### 2-2、继承

**<u>*继承*</u>**：将属性和方法组装成一个类的过程(私有化变量和方法 (通过 this 创建的属性视作为公有变量，通过 <u>闭包</u> 还可实现对私有变量的访问))；JS 中没有类概念；可通过作用域的变量访问限制，以模拟类实现，比如：构造函数、`Object.create()`、点语法；

- 方法1：<u>通过构造函数添加类</u>：在函数中创建 this 相关属性和方法，再通过 new 生成实例和绑定 this，例略；
  - 好处：实例间相互独立，不受影响；
  - 坏处：好处即坏处，通过 this 定义的属性或方法，每次实例化都复制一份，内存消耗大、复杂、可读性；
- 方法2：<u>通过原型添加类</u>：基于 `实例.__proto__` 指向 函数原型，从而使用原型上的方法；
  - 好处：原型链上的属性和方法只需建立一次;
  - 坏处：原型链上的属性和方法为全体实例共用，若链上的属性是引用类型则会被改变(而链上的方法铁定会改变)，不能实现私有属性和私有方法；
- 方法3：<u>通过点语法</u>：在构造函数身上通过点语法增加属性或方法；
  - 好处：仅创建一次；
  - 坏处：显而易见，实例无法访问，仅能用过自身访问；

**<u>继承发展</u>**：这个跟模块化发展一样，细节颇多…反正历经数代、多种模式的发展，最终形成以寄生组合式继承为核心的模式：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091215.png" style="zoom:50%;" align="" />

**<u>1、构造函数继承-不使用 Object.create：</u>**

- **<u>1-1、原型链继承</u>**：即直接让子类原型对象指向父类实例，当子类实例找不到相应属性和方法时，就会往其原型对象，也即父类实例上找，从而实现对父类属性和方法的继承；**<u>关键</u>**：`子类.prototype = new 父类();  子类.prototype.constructor = 子类;`

- ```js
  // 父类
  function Parent() { this.name = '特朗普' }
  // 父类原型方法
  Parent.prototype.getName = function() { return this.name }
  // 子类
  function Child() {}
  // 1、让子类的原型对象指向父类实例, 当子类实例找不到相应属性和方法时，就会往其原型对象(父类实例)上找
  Child.prototype = new Parent()
  // 1-1、但凡对 prototype 作赋值操作，均需重新将 prototype.constructor 修正为子类构造函数
  Child.prototype.constructor = Child 
  
  
  // 2、测试
  const child = new Child()
  child.name          // '特朗普'
  child.getName()     // '特朗普'
  // 3、缺点: 
  // 3-1、覆盖了子类.prototype 方法属性, 不解释
  // 3-2、父类引用属性被全体子类实例所公用即相互影响，这是一个多对一结构；
  // 3-3、无法向父类传参，仅 prototype 连接，告诉我怎么传
  // 4、优点
  // 4-1、可使用父类方法
  ```

- **<u>1-2、构造函数继承：</u>**即在子类的构造函数中执行父类的构造函数，并为其绑定子类的 `this`，让父类的构造函数将成员属性和方法，都挂到 `子类的 this`上去，避免原型继承中，实例间共享同一原型实例问题，此外还能向父类构造方法传参；**<u>关键</u>**： 在子类函数中执行：`父类函数.apply/call(this, arguments/…arguments);`

- ```js
  // 父类
  function Parent(name) { this.name = [name] }
  // 父类原型方法
  Parent.prototype.getName = function() { return this.name }
  // 子类
  function Child(...args) {
    	// 1、单纯执行父类构造方法并绑定子类 this, 使父类中的属性能够赋到子类的 this 上
      Parent.call(this, args)   
  }
  
  
  // 2、传参测试
  const child1 = new Child('test1')
  const child2 = new Child('test2')
  // 3、共享测试
  child1.name[0] = 'foo'
  console.log(child1.name)          // ['foo'] 
  console.log(child2.name)          // ['test2']
  // 4、原型链继承测试
  child2.getName()                  // Error
  // 5、缺点:
  // 5-1、无法继承父类原型上的属性和方法，因为只是单纯的在子类执行，获取父类构造中的方法和属性
  // 5-2、无法实现复用，每个子类都有父类实例函数的副本，影响性能 (无法复用是因为父类原型链上属性方法子类完全无法用到)
  // 6、优点:
  // 6-1、父类引用属性不被共享
  // 6-2、子类构建实例时可向父类传递参数；
  ```

- **<u>1-3、组合式继承：</u>**即将原型链继承和构造函数继承各有互补的优缺点，合体为组合式继承；

- ```js
  // 父类
  function Parent(name) {
      this.name = [name];
    	this.play = [1, 2, 3];
  }
  // 父类原型方法
  Parent.prototype.getName = function() { return this.name }
  // 子类
  function Child(name, age) {
      // 1、构造函数的继承 复制父类构造属性方法给子类实例 - 二次调用 Parent
      Parent.call(this, name);
    	// 1-1、为避免被父类同名属性覆盖，在 call/apply 后才为子类创建属性值
    	this.age = age;
  }
  // 2、原型链的继承 - 一次调用 Parent
  Child.prototype = new Parent()
  // 2-1、但凡对 prototype 作赋值操作，均需重新将 prototype.constructor 修正为子类构造函数
  Child.prototype.constructor = Child
  // 子类原型方法
  Child.prototype.getAge = function() { return this.age }
  
  
  // 3、传参测试
  const child1 = new Child('TPP', 20)
  const child2 = new Child('TLP', 70)
  // 4、原型链继承测试
  console.log('child1', child1);		
  console.log(child1.getName(), child1.getAge()) // ['TPP'] 20
  console.log(child1 instanceof Child, child1 instanceof Parent) // true true
  // 5、共享测试
  child1.name[0] = 'foo'
  child1.play.push(4);
  console.log(child1.play, child2.play); // [1,2,3,4] [1,2,3]
  console.log(child1.name)          // ['foo']
  console.log(child2.name)          // ['TLP']
  child2.getName()                  // ['TLP']
  // 6、优点:
  // 父类的方法可以被复用；
  // 父类的引用属性不会被共享；
  // 子类构建实例时可以向父类传递参数；
  // 7、缺点:
  // 每次创建子类实例都执行了两次构造函数，虽不影响对父类的继承，但子类创建实例时，原型中会存在两份相同的属性和方法
  // 一次调用 Parent()：给 Child.prototype 写入两个属性 name，play (可通过 child1.__proto__.play 访问得到)
  // 二次调用 Parent()：给 Child 写入两个属性 name、play；
  // 再解释：实例对象 child1 上的两个属性就屏蔽了其原型对象 Child.prototype 的两个同名属性；
  // 所以，缺点是在使用子类创建实例对象时，其原型中会存在两份相同的父类实例的属性/方法；这种被覆盖的情况造成性能浪费
  ```

  <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091215.png" style="zoom:50%;" align="" />

**<u>2、非构造函数继承-使用 Object.create：(其实主看上面，而非此小节，因思路很…)</u>**

- **<u>2-1、原型式继承</u>**：即对传入其中的对象执行一次浅拷贝，将构造函数 `F` 的原型直接指向传入的对象；(略)

- ```js
  // ES5 规范为 Object.create 方法
  function object(obj) {
    function F() {}
    F.prototype = obj
    return new F()
  }
  
  let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
  };
  
  let p1 = object(person);
  p1.name = "Greg";
  p1.friends.push("Rob");
  
  let p2 = object(person);
  p2.name = "Linda";
  p2.friends.push("Barbie");
  console.log(person.friends);   // "Shelby,Court,Van,Rob,Barbie"
  // 1、优点:
  // 1-1、父类方法可以复用
  // 2、缺点
  // 2-1、原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
  // 2-2、子类构建实例时不能向父类传递参数
  ```

- **<u>2-2、寄生式继承：</u>**使用原型式继承获得一份目标对象的 `浅拷贝`，然后增强了此浅拷贝的能力；优缺点：其实和原型式继承一样，寄生式继承说白了就是：能在拷贝来的对象上加点方法，也就是所谓增强能力；

- ```js
  function object(obj) {
    function F() { }
    F.prototype = obj
    return new F()
  }
  function p2(original) {
    // 通过调用函数创建一个新对象
    let clone = object(original)
    // 以某种方式来增强对象
    clone.getName = function () { ...  }
    return clone
  }
  
  let person = {
    name: 'Asuna',
    friends: ['Kirito', 'Yuuki', 'Sinon']
  }
  
  let inst1 = p2(person)
  let inst2 = p2(person)
  // 1、优点:
  // 1-1、父类方法可以复用
  // 2、缺点
  // 2-1、原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
  // 2-2、子类构建实例时不能向父类传递参数
  ```

**<u>3、终极形态：寄生组合式继承：</u>**专注于构造函数继承中的组合式继承改进：组合继承会有两次调用父类的构造函数而造成浪费的缺点，寄生组合继承核心即在解决此问题：<u>让子类的 prototype 指向父类原型的拷贝</u>，如此就不会调用父类的构造函数，进而引发内存的浪费问题；即构造函数被执行两次的问题，将 `指向父类实例` 改为 `指向父类原型`，减去一次构造函数的执行；

但由于子类原型和父类原型指向同一个对象：`Child.prototype = Parent.prototype`，故对子类原型的操作会影响到父类原型；

- 比如：给 `Child.prototype` 增加一个getName() 方法，会导致 `Parent.prototype` 也增加或被覆盖一个 getName() 方法；

- 解决：可对 `Parent.prototype` 做浅拷贝，利用 <u>空对象</u> 作为中介，此几乎不占内存，且修改 子类 的 prototype 对象，也不会影响到 父类 的 prototype 对象；注意：后续演进中的 super() 作用也大致如此；

- ```js
  // 父类
  function Parent(name) {
      this.name = [name];
    	this.play = [1, 2, 3];
  }
  // 父类原型方法
  Parent.prototype.getName = function() { return this.name }
  // 子类
  function Child(name, age) {
      // 1、构造函数的继承 
    	// 复制父类构造属性方法给子类实例
      Parent.call(this, name);
    	this.age = age;
  }
  // 2、原型链的继承
  // Child.prototype = new Parent()
  // 3、组合继承
  // Child.prototype = Parent.prototype  
  // 4、寄生组合继承
  // 寄生组合式继承中，将组合式继承的 指向父类实例 改为 指向父类原型，并使用浅拷贝避免父子原型间的影响
  Child.prototype = Object.create(Parent.prototype)  
  // 但凡对 prototype 作赋值操作，均需重新将 prototype.constructor 修正为子类构造函数
  Child.prototype.constructor = Child
  Child.prototype.getAge = function() {
      return this.age
  }
  
  // 5、传参测试
  const child1 = new Child('TPP', 20)
  const child2 = new Child('TLP', 70)
  // 6、原型链继承测试
  console.log('child1', child1);		
  console.log(child1.getName(), child1.getAge()) // ['TPP'] 20
  console.log(child1 instanceof Child, child1 instanceof Parent) // true true
  child1.name[0] = 'foo'
  child1.play.push(4);
  // 7、共享测试
  console.log(child1.play, child2.play); // [1,2,3,4] [1,2,3]
  console.log(child1.name)          // ['foo']
  console.log(child2.name)          // ['TLP']
  child2.getName()                  // ['TLP']
  ```

**<u>4、最优解</u>**

首先，最初是 **<u>原型链继承</u>**，通过将子类实例的原型指向父类实例来继承父类的属性和方法，但原型链继承的缺陷在于<u>对子类实例继承的引用类型的修改会影响到所有的实例对象，以及无法向父类的构造方法传参</u>；

因此，引入 **<u>构造函数继承</u>**, 通过在子类构造函数中调用父类构造函数并传入子类 this 来获取父类的属性和方法，但构造函数继承也存在缺陷，<u>构造函数继承不能继承到父类原型链上的属性和方法</u>；

所以，综合两种继承的优点，提出 **<u>组合式继承</u>**，但组合式继承也引入了新的问题：<u>它每次创建子类实例都执行了两次父类构造方法</u>；最后，通过将子类原型指向父类实例，改为子类原型指向父类原型的浅拷贝来解决这一问题，也即最终实现：**<u>寄生组合式继承</u>**

```js
var inherit = (function(c,p){
	var F = function(){};
	return function(c,p){
    // 中间对象
		F.prototype = p.prototype;
    // 子类 prototype 通过中间对象寻找 父类 prototype, 避免子类原型操作影响父类
		c.prototype = new F();
    // 备用: 为子对象设置 uber 属性，其指向父对象的 prototype 属性，仅用欧冠与实现继承完备性，纯属备用性质
		c.uber = p.prototype;
		// 修复子类实例的构造函数错误指向
		c.prototype.constructor = c;
	}
})();



// 其他: ES6 语法糖 class / extends
// 拓展: Extend 编译源码
function _possibleConstructorReturn(self, call) {
    // ...
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

// 核心
function _inherits(subClass, superClass) {
    // ...
 		// 子类的原型的__proto__指向父类的原型
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      	// 给子类添加 constructor 属性 subclass.prototype.constructor === subclass
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
  	// 用来继承父类的静态方法, 寄生组合遗漏地方
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}


var Parent = function Parent() {
    // 验证是否是 Parent 构造出来的 this
    _classCallCheck(this, Parent);
};

var Child = (function (_Parent) {
  	// 采用寄生组合继承方式
    _inherits(Child, _Parent);
  	
    function Child() {
        _classCallCheck(this, Child);
        return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
    }
    return Child;
}(Parent));

// _possibleConstructorReturn 实现了 super
function _possibleConstructorReturn(self, call) {
  if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); 
  // 显示绑定 Child 的内置 [[prototype]] 到 this，即在 Child 中执行 Child 原型链上关联的属性
  return call && (typeof call === "object" || typeof call === "function") ? call : self; 
}
// 核心: _inherits 函数，采用的依然也是第五种方式————寄生组合继承方式，同时证明了这种方式的成功; 
// 注意: 此处增加 Object.setPrototypeOf(subClass, superClass)，用来继承父类的静态方法, 此乃寄生组合遗漏地方
```



### 2-3、ES6 Class 实现

关于 ES6 写法与 ES5 的 Babel 对应(涉及super、extend实现原理，还有 getSet、公私静属性方法)；emmm，先不整，代码量偏多；



### 2-4、多继承

别搞多继承，JS Class 写法不是给你写这个的，而是方便你开发，多继承会有很多状态二义性、执行优先级等问题；现有方式与语言特性难以实现；





## 三、设计模式

设计模式的使用多见于模块制作、组件抽离、npm包(比如 vue-rx 内部使用到了单例模式、原型模式、适配器模式等)、软件架构设计乃至系统架构设计上(Rxjs + Node 的事件发布机制)；个人感觉它们所体现的开发设计思想比各类实现更为重要(当然代码实现也很重要不能停留书上 =。=)；此处只列举 JS 常见的设计模式(跟业务相关，业务复杂才能接触到更多更强大巧妙的设计模式，憾恨毕业去不成大厂…)：

软件(还包括类/函数)设计模式的设计原则，其中 JS 世界中最常用到的是：单一职责原则SRP、开放封闭原则OP；

- S一Single Responsibility Principle单一职责原则
  - 一个程序只做好一 -件事
  - 如果功能过于 复杂就拆分开，每个部分保持独立
- O—OpenClosed Principle 开放/封闭原则
  - 对扩展开放，对修改封闭
  - 增加需求时，扩展新代码，而非修改已有代码
- L—Liskov Substitution Principle 里氏替换原则
  - 子类能覆盖父类
  - 父类能出现的地方子类就能出现
- I—Interface Segregation Principle接口隔离原则
  - 保持接口的单一独立
  - 类似单一职责原则，这里更关注接口
- D—Dependency Inversion Principle 依赖倒转原则
  - 面向接口编程， 依赖于抽象而不依赖于具体
  - 使用方只关注接口 而不关注具体类的实现

**<u>JS常用之一：单一职责原则—SRP(Single Responsibility Principle)-</u>**

- 基本：一个方法、一个类只负责一个职责，各个职责的程序改动，不影响其它程序；
- 比如：组件化、模块化；

**<u>JS常用之二：开放封闭原则—OP(OpenClosed Principle)</u>**

- 基本：核心思想是软件实体(类、模块、函数等)是可扩展的、但不可修改；即对扩展是开放的，而对修改是封闭的
- 比如：类、模块和函数，应当对扩展开放，但对修改关闭；



### 3-1、单例模式

顾名思义，保证只有一个类实例，并提供访问其的全局访问点；优点有很多，比如划分命名空间，减少全局变量、实例仅需1次、简化代码，便于调试和维护、增强模块性；但缺点也明显：单点访问、可能导致模块间的强耦合，不利于单元测试(无法单独测试一个调用了来自单例的方法的类，而只能把它与那个单例作为一个单元一起测试)；应用就更多了：登录控件、模态框、注销删除控件、vuex、redux 中的 store、`JQ的$` 都有它的身影；可细分为惰性单例(即利用闭包去延迟执行)

```js
class SingletonLogin {
  constructor(name,password){
    this.name = name
    this.password = password
  }
  static getInstance(name,password){
    // 经典实现: if(!this.xxx) Vuex 里面也有体现
    // 判断对象是否已经被创建,若创建则返回旧对象
    if(!this.instance) {
      this.instance = new SingletonLogin(name,password)
    }
    return this.instance
  }
}
 
let obj1 = SingletonLogin.getInstance('TLP','123')
let obj2 = SingletonLogin.getInstance('TLP','321')
 
console.log(obj1===obj2)    // true
console.log(obj1)           // {name:TLP,password:123}
console.log(obj2)           // {name:TLP,password:123} - same result
```



### 3-2、工厂模式

个人感觉其是一种多态实现；用于创建对象的接口，此接口由子类决定实例化哪个类(而这些类 **<u>通常都拥有相同的接口(属性和方法</u>**))；

意义在于：父类即抽象类，存放一般性问题的处理与相同方法，随着子类构建而被其继承，子类间相互独立，负责具体业务逻辑；减少了代码冗余、降低了耦合度、提高了扩展性、灵活性高(子类可在父类基础上自定义接口)；此外，还使得构造函数和创建者分离，相同方法在父类中编写，符合 OP—开闭原则；但是，扩展时须引入抽象类，需要理解其内部实现才可扩展(但实际开发中人员水平是参差不齐的，容易埋 bug)；应用地方也有很多： JQ(所用思想真滴厉害)、`React.createElement()`、`Vue.component()` 

```js
// 简单工厂模式
class User {
  constructor(name, auth) {
    this.name = name
    this.auth = auth
  }
}
class UserFactory {
  static createUser(name, auth) {
    // 工厂内部封装了创建对象的逻辑:
    if(auth === 'admin')  new User(name, 1)
    if(auth === 'user')  new User(name, 2)
  }
}
const admin = UserFactory.createUser('TLP', 'admin');
const user = UserFactory.createUser('TLP', 'user');
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200909091219.png" style="zoom:50%;" align=""/>



### 3-3、观察者与发布订阅模式

前者估计是前端最原始、最常用的开发模式了，为何? 抛你一个 addEventListener…；

至于为何放在一起讲，因为感觉两者区别不大，后者比前者多了一个调度中心 (ps：此乃思考不成熟的体现，两者还是有较大差异的，体现在前者只有两点关系，若这种关系过多，管理就会显得十分复杂、代码也会变得臃肿，久而久之会出大问题；而后者通过中间调度器去管理，也有配套的取消订阅的操作(前者取消观察需要自实现)，在大型应用或软件开发中更显效率与精简)；

**<u>观察者模式</u>**：一种一对一或一对多的关系模式，观察者监听被观察者的变化，被观察者发生改变时，通知所有的观察者；较适用于小型的、一对象的改变需同时改变其它对象且不知道有多少对象需要改变时的场景；优点显而易见，灵活性相当高(坑点)，类似广播通信，自动通知所有已订阅过的对象、解耦(让耦合双方均依赖于抽象，而非依赖具体，使各自变化而不会影响另一边)，能单独扩展及重用；缺点：过度使用会导致对象与对象间联系弱化，难以跟踪维护和理解(比如 Angular 的 Subject…)；

```js
// 观察者
class Observer {    
  constructor (fn) {      
    this.update = fn    
  }
}
// 被观察者
class Subject {    
    constructor() {        
        this.observers = []          // 观察者队列    
    }    
    addObserver(observer) {          
        this.observers.push(observer)// 往观察者队列添加观察者    
    }    
    notify() {                       // 通知所有观察者,实际上是把观察者的 update()都执行了一遍       
        this.observers.forEach(observer => {        
            observer.update()        // 依次取出观察者,并执行观察者的 update 方法        
        })    
    }
}
var subject = new Subject()       // 被观察者
const update = () => {console.log('被观察者发出通知')}  //收到广播时要执行的方法
var ob1 = new Observer(update)    // 观察者1
var ob2 = new Observer(update)    // 观察者2
subject.addObserver(ob1)          // 观察者1订阅 subject 的通知
subject.addObserver(ob2)          // 观察者2订阅 subject 的通知
subject.notify()                  // 发出广播,执行所有观察者的 update 方法
```

**<u>发布订阅模式</u>**：

```js
var Event = (function () {
  var list = {};
  // 监听函数
  var listen; 
  // 移除监听函数
  var remove; 
  // 触发监听
  var trigger; 

  listen = function (key, fn) {
    if (!list[key]) { list[key] = {}; }
    list[key].push(fn);
  };
	// 触发器 - 调度器
  trigger = function () {
    var key = Array.prototype.shift.call(arguments), fns = list[key];
    if (!fns || fns.length === 0) { return false; }
    for (var i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
  };

  remove = function (key, fn) {
    var fns = list[key];
    if (!fns) { return false; }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var i = fns.length - 1; i >= 0; i--) {
        var _fn = fns[i];
        if (_fn === fn) {
          fns.splice(i, 1);
        }
      }
    }
  };
  // 返回
  return {
    listen,
    trigger,
    remove,
  };
})();

function d1() { console.log("first"); }
function d2() { console.log("second"); }
Event.listen("color", d1); 	// d1
Event.listen("color", d2); 	// d2
Event.remove("color", d1); 	// d1
Event.trigger("color"); 		// second
```



### 3-X、其他模式

待添加：适配器模式、代理模式、装饰器模式(TS、Angular)；面向组合设计；



## 四、架构模式

如何区分设计模式与架构模式，emmm，后者是一个根的定性问题，前者是枝的处理方式；比如种树，架构模式偏向于你要选用什么树、种在哪里、成本维护算计、种多少、用来干嘛等等，而设计模式更偏向于树种了之后，怎么培育、怎么打理、怎么束型等等；

软件架构模式—**<u>*Architectural Pattern*</u>**：MVC，MVP，MVVM，均是常见的软件架构模式(Architectural Pattern)；

软件架构模式通过分离关注点，来改进代码的组织方式，且相对独立不影响；

- 相同部分：**<u>*MV(Model-View)*</u>**
- 不同部分：**<u>*C(Controller)、P(Presenter)、VM(View-Model)*</u>**

架构模式不同于设计模式 (Design Pattern)(明显比我上面说的更专业………)

- 前者往往使用了多种设计模式；
- 后者只是为了解决一类问题而总结出的抽象方法；

- **<u>Model</u>**：应用程序中，用于处理应用程序数据逻辑的部分；
  - 用于封装和应用程序的业务逻辑相关的数据以及对数据的处理方法；
  - 通常负责在数据库中存取 **<u>管理数据</u>**；

- **<u>View</u>**：应用程序中，用于处理数据显示的部分；
  - 通常依据模型数据 **<u>依据数据创建视图</u>**；

- **<u>Controller</u>**：应用程序中，用于处理用户交互的部分；
  - 用于连接 Model & View，控制应用程序流程，定义用户界面对用户输入响应方式，处理用户行为和数据上的改变；
  - 通常负责从 View 读取数据，控制用户输入，并向 Model 发送数据，是一个 **<u>业务逻辑处理—中间件</u>**；

待添加：MVC、MVP、MVVM 