# 一、整体流程

分析对象为 Vue2.x 完整版(Runtime+Compiler)；

- **<u>*完整版*</u>** ：运行时版 + Compiler (将字符串模板 template 编译为 render 函数)；
  - entry-runtime-with-compiler，挂载前需做编译处理，所以其重写了 Vue.prototype.$mount 方法，并添加了 Vue.compile 全局API；
  - 使用完整版，允许在代码运行的时现场编译模板，在不配合构建工具的情况下可直接使用，但包体积偏大；
- **<u>*运行时版*</u>**：将编译步骤(Compiler)交给构建工具处理(在脚手架配置 vue-loader )的版本；
  - entry-runtime，最后直接输出 Vue 实例，编译部分交由构建工具处理、可减少包体积 30%；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200927100917.png" alt="截屏2020-09-27 上午10.09.10" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132749.png" style="zoom:50%;" />

**<u>*构建流程*</u>**：

- <u>初始化前</u>，创建 Vue 实例对象
- <u>初始化-init</u>，初始化生命周期、事件中心和渲染、执行 `beforeCreate` 钩子、初始化 `data`、`props`、`computed`、`watcher`、执行 `created` 钩子等
  - 注意：初始化阶段涉及的数据绑定过程略过，请看响应式过程；
  - 注意：初始化阶段为 Vue 原型添加属性和方法，即实例属性和实例方法，并添加全局的API，也就是静态的方法和属性：
    - 初始化原型链属性 sateMixin：`$data(只读属性)、$props(只读属性)、$set、$delete、$watch`；
    - 初始化原型链方法(事件) eventsMixin：`$on、$once、$off、$emit`；
    - 初始化原型链方法(生命周期) lifecycleMixin：`_update、$forceUpdate、$destory`；
    - 初始化(渲染函数) renderMixin、nextTick：`installRenderHelpers、_render、nextTick`；
    - 在 Vue 构造函数上添加全局 API(initGlobalAPI)，类似整理 Vue.prototype 上的属性和方法：
      - 比如：get(只读)、util(独立、非公共API)、set、util、set、delete、nextTick、options；
      - 比如：Vue.use(initUse)、Vue.component+Vue.directive+Vue.filter(initAssetRegisters)、Vue.mixin(initMixin)、Vue.extend(initExtend)；
      - 总结：即 Vue 构造函数相关的2个文件：core/instance/index.js，即其父级文件：core/index.js：
        - 前者：定义 Vue 构造函数，并对其原型添加属性和方法，即实例属性和实例方法，是 Vue 构造函数的定义文件；
        - 后者：为 Vue 添加全局的API，也就是静态的方法和属性；
    - 设置平台化的 Vue.config；
      - Vue.options：混合2个指令(directives)：model、show；
      - Vue.options：混合2个组件(components)：Transition、TransitionGroup；
      - Vue.prototype：2个方法：`__patch__`、$mount；
    - 补充：比较 entry-runtime-with-compiler 与 entry-runtime：
      - 后者运行时直接导出 Vue(交给构建工具的编译器编译，所以直接输出Vue)；
      - 前者包含 compiler，挂载前需要做编译处理，故其重写 Vue.prototype.$mount 方法，并添加了 Vue.compile 全局API，最后通过 compilerToFunctions 编译；
    - 补充：mergeOptions：涉及处理太多，不一展开，只大概叙述下：
      - 校验组件名字(checkComponents)；
      - 规范化参数(normalize)，统一数组和对象形式为对象；
      - 对于 el、propsData 选项，使用默认的合并策略 defaultStrat(只要子选项不是 *undefined* 就使用子选项，否则使用父选项)；
      - 对于 data 选项，使用 mergeDataOrFn 函数进行处理，最终结果是 data 选项将变成一个函数，且该函数的执行结果为真正的数据对象；
      - 对于 生命周期钩子 选项，将合并成数组，使得父子选项中的钩子函数都能够被执行；
      - 对于 directives、filters 以及 components 等资源选项，父子选项将以原型链的形式被处理，所以才能在任何地方都使用内置组件&指令等；
      - 对于 watch 选项的合并处理，类似于生命周期钩子，若父子选项都有相同的观测字段，将被合并为数组，这样观察者都将被执行；
      - 对于 props、methods、inject、computed 选项，父选项始终可用，但是子选项会覆盖同名的父选项字段；
      - 对于 provide 选项，其合并策略使用与 data 选项相同的 mergeDataOrFn 函数；
      - 最后，以上没有提及到的选项都将使默认选项 defaultStrat(只要子选项不是 *undefined* 就使用子选项，否则使用父选项)
- <u>初始化后</u>，调用 `$mount` 方法对 Vue 实例进行挂载(挂载的核心过程包括：**<u>模板编译、渲染、更新</u>**  三个过程)；
- <u>编译</u>：若无在 Vue 实例上定义 `render` 方法而定义 `template`，则需经历编译阶段：先将 `template字符串` 编译成 `render function`；编译如下： 
  - 首先，`parse  ` 正则解析 `template` 字符串形成 AST(抽象语法树，源代码的抽象语法结构的树状表现形式)
  - 然后，`optimize ` 标记静态节点跳过 Diff 算法 (Diff 算法是逐层进行比对，只有同层级的节点进行比对，因此时间的复杂度只有 O(n)；
  - 最后，`generate` 将 AST 转化成 `render function` 字符串；
- <u>渲染</u>，编译成 `render函数` 后，调用 `$mount` 的 `mountComponent ` 方法：其先执行 `beforeMount` 钩子，然后实例化一个 `渲染Watcher` (方法核心)，在其回调函数(初始化时执行，及组件实例中监测到数据发生变化时执行)中，调用 `updateComponent` 方法(此法调用 `render` 方法将 `render函数` 生成 `虚拟Node`，最终调用 `update` 方法更新 DOM，见下方 <u>更新</u> 部分)；
  - 补充：`render` 方法参一是 `createElement` (或说是 `h` 函数)；
  - 注意：真实 DOM 元素庞大，而浏览器标准将 DOM 设计地十分复杂；若频繁操作 DOM 会有性能问题；而 `虚拟DOM` 是用原生 JS 对象去描述 DOM 节点，故其比创建 DOM 代价要小，且便于修改属性、对比差异、还能实现跨平台方案；
- <u>更新</u>，生成 `虚拟DOM树` 后，需要将 `虚拟DOM树` 转化成 `真实DOM节点`，此时需要调用 `update` 方法，`update `方法会调用 `pacth` 方法将 `虚拟DOM` 转换成 真正DOM 节点；(注意上图忽略了新建真实 DOM 的情况—若无旧的虚拟 Node，则可直接通过 `createElm` 创建真实 DOM 节点)，而此处重点分析在已有虚拟 Node 的情况下，会通过 `sameVnode` 判断当前需要更新的 Node节点，是否与旧的 Node 节点相同(比如若设置的 `key` 属性发生了变化，则节点显然不同—所以 key 作用在于节点的最大化复用)，若节点不同则利用新节点替换旧节点，若相同且存在子节点，则需调用 `patchVNode ` 方法执行 Diff 算法更新 DOM，从而提升 DOM 操作的性能；

**<u>*响应式流程*</u>**：

- 在 `Init` 初始化过程中会利用  `Object.defineProperty` 方法(不兼容 IE8)，以监听 Vue 实例的响应式数据的变化从而实现数据劫持能力 (利用了 JS 对象的访问器属性 `Get/Set`，而在 Vue3 中则使用了 ES6 的 `Proxy` 来优化响应式原理)；然后在初始化流程中的编译阶段，当 `render function` 被渲染时，会读取Vue 实例中和视图相关的响应式数据，此时便会触发 `getter`  函数进行 **<u>依赖收集</u>** (将观察者 `Watcher` 对象存放到当前闭包的订阅者 `Dep` 的 `subs` 中)，此时的数据劫持功能和观察者模式就实现了一个 MVVM 模式中的  **<u>Binder</u>**，之后就是正常的渲染和更新流程；
- 然后，当数据发生变化或视图导致的数据发生了变化时，会触发数据劫持的 `setter` 函数，`setter ` 会通知初始化 **<u>依赖收集</u>** 中的 `Dep` 中的与视图相应的`Watcher`，告知需要重新渲染视图，`Wather` 就会再次通过 `update` 方法来更新视图；

- 注意：可发现只要视图中添加监听事件(Get/Set+处理函数)，自动变更对应的数据变化时，就可实现数据和视图的双向绑定；





# 二、Vue相关