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

**<u>*响应式流程总结*</u>**：

- 在 `Init` 初始化过程中，Vue 会遍历 data 选项属性，并利用  `Object.defineProperty` 方法(IE9+)(利用 JS 对象访问器属性 `Get/Set`，Vue3 中则使用 ES6 `Proxy` 来优化)，(重新定义 data 中的所有属性)以监听 Vue 实例的响应式数据的变化，从而实现 <u>数据劫持</u> 能力；
- 然后，在初始化流程中的编译阶段，当 `render function` 被渲染时，会读取 Vue 实例中和视图相关的响应式数据，此时触发 `Getter`  函数进行 <u>依赖收集</u> (将当前组件观察者 `Watcher` 对象存放到当前闭包的订阅者 `Dep` 的 `subs` 中，进行依赖收集还有 computed watcher,user watcher实例)，此时数据劫持功能和 <u>发布订阅模式</u>，就实现了一 MVVM 模式中的  <u>Binder</u>，之后就是正常的渲染和更新流程；
- 然后，当数据属性发生变化或视图导致的数据发生变化时，触发数据劫持的 `Setter` 函数，`Setter ` 会通知初始化时 <u>收集的依赖</u> 中的 `Dep` 中的与视图相应的 `Watcher`，`Wather` 就会再次通过 `update` 方法来更新视图，从而使它关联的组件重新渲染；
- 注意：可发现只要视图中添加监听事件(Get/Set+处理函数)，自动变更对应的数据变化时，就可实现数据和视图的双向绑定；

**<u>响应式流程实现要点：</u>**

监听器 Observer：

- 对数据对象进行遍历(含子属性对象属性)，利用 Object.defineProperty 为属性添加 Get/Set，定义依赖收集和派发更新行为；

解析器 Compile：

- 解析 Vue 模板，将模板中的变量，替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数(原生事件—关键)，添
  加监听数据的订阅者，一旦数据变化(原生触发)，触发收到通知，调用更新函数进行数据更新；

订阅者 Watcher：

- Watcher 是前两者间的通信桥梁，主要负责：订阅 Observer 中的属性值变化消息，当收到属性值变化消息时，触发解析器 Compile 中对应的更新函数；实际上 Watcher 实例分为渲染 watcher (render watcher)、计算属性 watcher (computed watcher)、侦听器 watcher (user watcher)三种；
  - initState 时，对 computed 属性初始化时触发 computed watcher 依赖收集；
  - initState 时，对侦听属性初始化时，触发 user watcher 依赖收集；
  - render   时，触发 render watcher 依赖收集；
  - re-render 时，vm.render 再次执行，会移除所有 subs 中的 watcer 的订阅，重新赋值；

订阅器 Dep：

- 订阅器采用发布订阅模式(即观察者基础之上增加一调度管理器)，用来收集订阅者 Watcher，以对监听器 Observer 和订阅者 Watcher 进行统一管理(每个响应式对象包括子对象，都拥有一个 Dep 实例(里面的 subs 是存放 Watcher 实例的数组)，当数据有变更时，会通过 dep.notify 通知各个 watcher)；

上述两者关系：

- Dep 是 Observer 与 Watcher 间的调度器，负责更好地、统一地管理 Watcher；

- Watcher 中实例化了 dep 并向 dep.subs 中添加了订阅者 watcher，而 dep 通过 notify 遍历了 dep.subs 通知每个 watcher 更新，最后调用每一个 watcher 的 update 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132750.png" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132751.png" style="zoom:50%;" />







# 二、Vue相关

## 2-1、双绑—v-model 

本质是语法糖，可看成 value + input 方法组合；可通过 model 属性的 prop 和 event 属性来进行自定义；

v-model，多用于表单 input、textarea、 select 等元素；

v-model，会根据标签的不同生成不同的事件和属性；

- text、textarea元素使用 value 属性和 input 事件；
- checkbox、radio使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件；

```html
// 1、表单元素 input
<input *v-model*=' something'>
// 相当于
<input *v-bind:* *va* *lue*="something" *v-on:* *input*="something = $event. target.value">

// 2、自定义组件，v-model 默认会利用名为 value 的 prop 和 input 事件
// 父组件:
<*ModelChild* *v-mode* *l*="message"></*ModelChild*>
// 子组件:
<div>{{value}}</div>
props:{
	value: *String*
}
methods: {
	test1(){
	this. $emit('input', 'TLP')
},
```





## 2-2、双绑—数组与对象监听

问题：由于 JS 限制，Vue 不能检测到以下数组操作改动：

- 利用索引直接设置一个数组项时，比如：`vm. items[indexOfItem] = newValue`
- 修改数组长度时，比如：`vm.items.length = newLength`

```js
// 解决问题1：
// Vue.set
Vue.set(vm.items, index0fItem, newValue)
// vm.$set, Vue.setá)- ↑5I5
vm.$set(vm.items, index0fItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)

// 解决问题2：splice
// Array.prototype. splice
vm.items.splice(newlength)
// 数组长度没有 Set/Get
// 因为：若知道数组长度，理论上可以预先给所有的索引设置 Set/Get，但实际场景中往往并不知道数组长度(不固定)；
// 此时：预加 Set/Get 成本过大；可通过 Proxy 改进
```

Vue 通过遍历数组/对象(若数组/对象中包含着引用类型， 则会对其中的引用类型再次递归遍历)，从而实现对数组和对象内部属性数据进行监听；

但对于数组操作的监听，则通过重写数组方法(原型链重写/劫持)：push、pop、shift、unshift、splice、sort、reverse；使之监听得到更新；

```ts
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];
/**
* Intercept mutating methods and emit events
*/
methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.ob;
    let inserted;
    switch
    (method) {
      case "push":
      case "unshift":
        inserted = args;
        break
      case "splice":
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});
/**
* Observe a list of Array item
*/
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  };
};

// ...

// Observe a list of Array items.
observeArray(items: Array<any>) {
  for (let i = 0; (l = items.length), i < l; i++) {
    observe(items[i]); // observe 功能为监测数据的变化
  }
}

// 对属性进行递归遍历
let child0b = !shallow && observe(val); // observe 功能为监测数据的变化

// ...
```



## 2-3、双绑—<u>Vue.$set</u>

Vue.set == vm.$set，而其内部，还是会通过 splice 实现变更检测；

- 若目标是数组，使用 vue 实现的数组重载方法 splice 实现响应式(所以本质还是通过 splice)；
- 若目标是对象，判断属性存在，若存在即为响应式，直接赋值；
- 若目标非响应式，则直接赋值；
- 若目标属性非响应式，则调用 defineReactive 方法进行响应式处理；

```ts
export function set(target: Array<any> | Object, key: any, val: any): any {
  // 若 target 为数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度，避免索引>数组长度导致 splcie 执行有误
    target.length = Math.max(target.length, key)
    // 利用数组的 splice 变异方法触发响应式
    target.splice(key, 1, val)
    return val
  }
  // 若 key 已存在，则直接修改属性值
  if (key in target && !(key in object.prototype)) {
    target[key] = val
    return va1
  }
  const ob = (target: any).__ob__
  // 若 target 非响应式数据，则直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 对属性进行响应式处理
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```





## 2-4、路由—Router

**<u>*基本介绍*</u>**：

Vue-router 有3种路由模式：hash、history、 abstract：

- hash：使用 URL hash 值来作路由；支持所有浏览器，包括不支持 H5 History Api 的浏览器；
  - 依靠 `onhashchange` 事件(监听`location.hash`的改变)；
- history：依赖 H5 History API 和服务器配置；
  - 依靠的`H5 history` 新增的两个方法：pushState() 改变 url 地址且不会发送请求；replaceState() 可读取历史记录栈，还可对浏览器记录进行修改；
- abstract：支持所有 JS 运行环境，如 Node.js 服务器端；若发现没有浏览器的API，则会自动强制进入此模式；

<u>hash 模式的实现原理</u>
早期前端路由的实现就是基于 location.hash，location.hash 值即 URL 中 # 后面的内容(含符号#)；hash 路由模式实现基于以下几个特性

- URL 中 hash值只是客户端的一种状态，也即当向服务器端发出请求时，hash 部分不会被发送；
- hash 值的改变，都会在浏览器访问历史中增加记录；因此能通过浏览器回退、前进按钮控制 hash 的切换；
- 可通过 a 标签，并设置 href 属性，当用户点击标签后，URL 的 hash 值就会发生改变；
- 或可通过 JS 来对 loaction.hash 进行赋值，改变 URL 的 hash值；
- 可使用 hashchange 事件来监听 hash 值变化，从而对页面进行跳转(渲染)；

<u>history 模式的实现原理</u>
H5 提供 History API 来实现 URL 变化；其中最主要的API有：historv.pushState()—新增历史记录、historv.repalceState()—直接替换当前的历史记录；此两个 API 可在不进行刷新的情况下，操作浏览器的历史纪录；history 路由模式实现基于以下几个特性：

- pushState 和 repalceState 操作实现 URL 变化；
- 使用 popstate 事件来监听 url 变化，从而对页面进行跳转(渲染)；
- 注意：history.pushState() 或 history.replaceState() 不会触发 popstate 事件，所以需要手动触发页面跳转(渲染)；

```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

**<u>*实现原理*</u>**：

根据浏览器功能选择 hash/historyRouter；不管通过 routerLink组件触发还是通过内部 this.router.push/replace 等触发，触发原生事件，hash 触发 onhashchange/popstate，H5 触发 popstate 事件；事件触发后，Router 实例获取当前变化 url 与 router 配置的 url，对比获知要更新的组件，随后获取相关组件相关系列钩子(被销毁组件钩子与新创建组件钩子)、依次执行，然后执行 beforeRouteEnter，然后执行 history.transitionTo 回调 onComplete，渲染，并替换 url；

- 挂载：获取 newVue({ router })，并挂载到 Vue 根组件 `this.$options` 中，然后通过 Vue.use 安装插件，加载 VueRouter install 方法，mixin，beforeCreate，router 实例的 init 方法；使用 Vue.util.defineReactive(..this.router.history.current) 响应触发更新，然后 registerInstance(this,this) 实现对 router-view 的挂载操作(router-view 定义 registerRouterInstance 函数，此方法主要用于 render 操作)；设置代理：this.$router == this._routerRoot.router；使用 Vue.component 注册 RouterLink、RouterView；最后合并钩子；
- 初始：即实例化 Router，此步发生在挂载前(只有实例化后才能调用 init 方法)，类似 new Router({mode:'history', route: [{}...]})，constructor 中会有一根据环境能力选用合适路由模式——mode，选用顺序为 history、hash、最后才是非浏览器环境下的 abstract；然后根据 mode 实例化相应对象；

```js
switch (mode) {
  case 'history':
    this.history = new HTML5History(this, options.base)
    break
  case 'hash':
    this.history = new HashHistory(this, options.base, this.fallback)
    break
  case 'abstract':
    this.history = new AbstractHistory(this, options.base)
    break
  default:
    if (process.env.NODE__ENV !== 'production') {
      assert(false, `invalid mode: ${mode}`);
    }
}
```

- 实现：通过 history.transitionTo 确定路由的切换操作；通过 history.listen 注册路由变化的响应回调：this.app.forEach(app => app._route = route)
- Hash模式：使用 HashHistory 作为演示例子；HashHistory 继承自 History 类，判断(保证 / 开头)，并获取 # 后部分内容；
- history.transitionTo：
  - 通过 this.router.match 创建匹配定义 URL 的 router 对象：通过目标路径匹配定义 route 数据，根据匹配到的记录，进行 _createRoute 操作，操作最后返回 router 对象；然后，得到对象后，通过 comfirmTransition 进行跳转操作；confirmTransition 函数：
    - confirmTransition 函数内部判断是否是需要跳转，若无需跳转，则直接中断返回；若需要跳转，则先得到钩子函数的任务队列 queue；
      - 即将被销毁组件的 beforeRouteLeave 钩子：extractLeaveGuards ( deactivated)；
      - 全局 router before hooks：this.router.beforeHooks；
      - 组件 updated 钩子：extractUpdateHooks (updated)；
      - 将要更新的路由的beforeEnter 钩子：activated.map(m => m. beforeEnter)；
      - 异步组件：resolveAsyncComponents (activated)
    - 通过 runQueue 函数来批次执行任务队列中的每个方法；注意：在执行 queue 中钩子时，通过 iterator 来构造迭代器由用户传入 next 方法，确定执行过程(即等待上一钩子执行完才执行下一个)；队列执行完后，处理完成后的回调；回调主要是接入路由组件后期的钩子函数beforeRouteEnter、beforeResolve，并进行队列执行；一切处理完后，执行 transitionTo 回调 onComplete；
  - onComplete 回调中，会调用 updateRoute 方法(因先前进行了双绑，所以会触发渲染)，ensureURL(更新浏览器URL)，readyCbs；
- H5History模式：同样调用 history.transitionTo，只是监听方法只是使用 popstate 事件，而 hash模式依靠 onhashchange/popstate (支持度)监听；
- 补充：router 实例调用的 push 实际是 history 方法，通过 mode 来确定匹配 history 的实现方案，从代码可知：
  - push 调用了 src/util/push-state.js 中被改写过的 pushState 方法，改写过的方法会根据传入的参数 replace?: boolean 来进行判断调用 pushState 还是 replaceState ，同时做了错误捕获；如果 history 无刷新修改访问路径失败，则调用 window.location.replace(url) ,有刷新的切换用户访问地址；同理 pushState 也是这样；这里的 transitionTo 方法主要的作用是：做视图的跟新及路由跳转监测，若 url 没有变化(访问地址切换失败的情况)，在 transitionTo 方法内部还会调用一个 ensureURL 方法，来修改 url；
- 注意：this.router.push 等路由方法，最后还是会调用 this.transitionTo；任何形式的路由相关操作，routerLink 组件还是 this.router.push，最后都会通过 history 触发变更，Vue Router 事件监听后，再进行相关操作(渲染、改变URL)；比如 routerLInk 组件，在 install 注册，在 render 时通过创建 a 标签并绑定相关原生方法，最后调用 router.replace、router.push 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200929083404.png" alt="截屏2020-09-29 上午8.33.58" style="zoom:50%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200929083435.png" alt="截屏2020-09-29 上午8.34.30" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200929083452.png" alt="截屏2020-09-29 上午8.34.46" style="zoom:50%;" />



## 2-5、状态—Vuex

Duck 不必看源码实现，很多细节内容，了解流程即可(我给你们浓缩了还看，而且那些内容只是截取版，强行看会懵的一愣一愣的!!)

**<u>*基本介绍与用法与疑问：*</u>**

- State：定义应用状态的数据结构，可在这里设置默认的初始状态；
  - 注意：Vuex 的单一状态与模块化并不冲突；前者表明实例单一，后者只是独立，但共用此实例；
  - 注意：可通过 mapState 将全局 state 和 getters 映射到当前组件的 computed 计算属性中；
- Getter：允许组件从 Store 中获取数据，类似 vue 计算属性，主用来过滤数据；
  - 注意：可通过 mapGetters 辅助函数仅将 store 中的 getter 映射到局部计算属性；
  - 注意：改变 state 中状态的唯一途径：显式地提交(commit) mutation，便于跟踪每一个状态变化；
- Mutation：唯一能更改 store 中数据状态的方法，须是同步函数；
- Action：可理解为：通过将 mutations 中，处理数据的方法变为可异步的处理数据的方法，即异步操作数据；view 层通过 store.dispath 来分发 action；
- Module：允许将单一 Store 拆分为多个 store 且同时保存在单一的状态树中；

疑问：开发时，改变数组或对象的数据，但是页面没有更新如何解决？

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132753.png" style="zoom:70%;" />

**<u>*基本原理：*</u>**Vuex 即 Vue 专用的状态管理库(多用于组件通信及作为数据中心集中式存储数据)；单例形式存放，利用 Vue 自身响应式机制实现(运行依赖于 Vue 内部数据双向绑定机制)；本质是存放多个对象的仓库；State 存放响应数据(各组件共享的数据中心—从而实现跨组件通讯，数据又完全与各自组件独立)；Vue 组件从 Store 读取数据，若 store 中数据发生改变，依赖数据的组件也会发生更新；<u>个人理解</u>：Vuex 是独立于应用 Vue实例的小型 Vue 实例，初始化时搜集 Store、Action、Mutation 等内容，在组件注入时将 State 绑定到 computed，当数据变化时，dispatch、commit、mutation[type]，并通过内部响应式变化通知订阅者，订阅者监听到变动，数据反映到 computed 中的 State 上，触发渲染；

大致流程：首先，在全局通过 State 存放数据，而所有修改 State 的操作，均须通过 Mutation 进行(Mutation 通过 Action)，同时其还提供订阅者模式以供外部插件调用获取 State 数据更新；然后，所有异步接口均须通过 Action 操作 (常见于调用后端接口异步获取更新数据)；最后根据 State 变化，渲染到视图；

```js
// 引入: import、提供 store，注入 Vue 实例；
Vue.use(Vuex);
// 将 store 放入 Vue 创建时的 option 中
new Vue({
    el: '#app',
    store
});
```

安装：三方插件统一通过 Vue.use 安装(单例模式避免重复安装)，其会调用插件 install 方法，Vuex.install 中会将 VuexInit 混合进 Vue 钩子中；注意：版本1直接将 VuexInit 放入 init 方法中，版本2则将 VuexInit mixin 进 beforeCreate 钩子中；而 VuexInit 会将 store 注入到 Vue 实例中；同时确保所有组件都公用了全局的同一份 store(根节点执行或使用 store，子组件则直接从父组件中获取 $store)；

```js
// Vuex 的 init 钩子，会存入每一个 Vue 实例等钩子列表
function vuexInit () {
  const options = this.$options
  // store injection
  if (options.store) {
    // 存在 store 其实代表的就是 Root 节点，直接执行 store(function时) 或使用 store(非function)
    this.$store = typeof options.store === 'function'
      ? options.store()
    : options.store
  } else if (options.parent && options.parent.$store) {
    // 子组件直接从父组件中获取 $store，以保证了所有组件都公用了全局的同一份 store
    // 如此便可以在每一个组件中通过 this.$store 访问全局的 Store 实例
    this.$store = options.parent.$store
  }
}
```

构建：store 即 Store 实例；Store 构造类初始化内部变量，并主要执行 installModule (初始化module) 以及 resetStoreVM (通过 VM 使 store "响应式")

- installModule 作用是用为 module 加上 namespace名字空间后，注册 mutation、action 及 getter，同时递归安装所有子 module；

- resetStoreVM 通过 vm 重设 store，新建 Vue 对象使用 Vue 内部的响应式实现注册 state 及 computed，关键是 Vuex 内部又 new 了一个 Vue 实例，来实现数据的"响应式化"，运用 Vue 内部提供的数据双向绑定功能来实现 store 的数据与视图的同步更新；

  - ```js
    //  存放之前的 vm 对象 
    const oldVm = store._vm 
    
    // bind store public getters
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    const computed = {}
    
    // 遍历 wrappedGetters，使用 Object.defineProperty 方法为每一个 getter 绑定上get方法
    // 如此在组件里访问 this.$store.getter.test 就等同于访问 store._vm.test，也即 Vue 对象的 computed 属性 
    forEachValue(wrappedGetters, (fn, key) => {
      // use computed to leverage its lazy-caching mechanism
      computed[key] = () => fn(store)
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key],
        enumerable: true // for local getters
      })
    })
    
    //  Vue.config.silent 暂时设置为 true，原因是 new 一个 Vue 实例过程中不会报出一切警告 
    const silent = Vue.config.silent
    Vue.config.silent = true
    
    // 此时访问 store._vm.test 也即访问 Vue 实例中的属性
    store._vm = new Vue({
      data: {
        ?state: state
      },
      computed
    })
    Vue.config.silent = silent
    
    // enable strict mode for new vm
    //  使能严格模式，保证修改 store 只能通过 mutation 
    if (store.strict) {
      enableStrictMode(store)
    }
    
    if (oldVm) {
      //  解除旧 vm 的 state 的引用，及销毁旧 Vue 对象 
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(() => {
          oldVm._data.?state = null
        })}
       Vue.nextTick(() => oldVm.$destroy())
    	}
    }
    // ...
    // 上述两步完成后，即可通过 this.$store.getter.test 访问 vm 中的 test 属性
    ```

- 单向保证：Store 中 option 有 strict 参数，可控制使用严格模式；resetStoreVM 的 enableStrictMode 即此作用；此时所有 state 修改操作均须通过 mutation 实现，否则会抛出错误；即全局标志位判断；只有正确方法调用标志位才会放开，从而实现 Vuex 单向数据流；

  - ```js
    function enableStrictMode (store) {
      // Vuex 利用 vm 的 $watch 方法来观察 ?state，也即 Store 的 state，在它被修改时进入回调
      // 回调中用 assert 断言来检测 store._committing，当 store._committing 为 false 时触发断言，抛出异常
      store._vm.$watch(function () { return this._data.?state }, () => {
        if (process.env.NODE_ENV !== 'production') {
          // 检测 store 中的 _committing 值，若是 true 代表不是通过 mutation 方法修改
          assert(store._committing, `Do not mutate vuex store state outside mutation handlers.`)
        }
      }, { deep: true, sync: true })
    }
    
    // Store 的 commit 方法中，执行 mutation 的语句
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    
    _withCommit (fn) {
      // 调用 withCommit 修改 state 值时，会将 store 的 committing 值置为 true，内部会有断言检查该值
      // 在严格模式下只允许使用 mutation 来修改 store 中值，而不允许直接修改 store 的数值
    
      // 通过 commit（mutation）修改 state 数据时，会再调用 mutation 方法之前将 committing 置为 true，
      // 然后再通过 mutation 函数修改 state 中数据，此时触发 $watch 中的回调断言 committing 是不会抛出异常的（此时committing为true）
      // 而当直接修改 state 数据时，触发 $watch 的回调执行断言，此时 committing 为 false，则会抛出异常
      const committing = this._committing
      this._committing = true
      fn()
      this._committing = committing
    }
    ```

方法：commit、dispatch、等方法；

- commit事件：commit 方法会根据 type 找到并调用 _mutations 中的所有 type 对应的 mutation 方法，然后会执行 _subscribers 中的所有订阅者；
- dispatch方法：调用 action 的 dispatch 方法，实则调用 dispatch 方法；
  - 在初始化，registerAction 时，会将推入进 _actions 队列的 action 进行一层封装(wrappedActionHandler)(所以在进行 dispatch 时能够在参数1获取 state、commit 等方法)；封装方法的执行结果 res，会被判断是否是 Promise，不是则进行 Promise 封装；
  - 在真正调用时，dispatch 方法会从 _actions 中取出 type 对应的 ation，只有一个时则直接返回，否则用 Promise.all 处理再返回；
- watch方法：实则 return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
  - 观察 getter 方法、_watcherVM 是一 Vue 实例，故 watch 就可直接采用 Vue 内部的 watch 特性观察数据 getter 变动；
- 其他 un/registerModule：注册一个动态 module，当业务进行异步加载时，可通过该接口进行注册动态 module；



## 2-6、解析—Compiler

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132806.png" style="zoom:50%;" align="" />



模板解析这种事，本质是将数据转化为一段html，最开始出现在后端，经过各种处理吐给前端；但随着各种 mv* 兴起，模板解析交由前端处理；

1、Vue complier 将 template 转化成一个 render 函数字符串，编译过程如下：

- parse函数：负责解析 template，利用正则生成 AST；
- optimize 函数：负责优化静态节点(AST上)(标记无需每次都更新的内容，DIFF 会直接跳过静态节点，以减少比较过程，优化 patch 性能)；
- generate 函数：将前两步生成完善的 AST 组装成 render 函数字符串；
- render 函数：非转换步骤，但函数字符串需转换成函数才可执行，`render = new Function(render)，vm.$options.render`

2、调用 new Watcher 函数，监听数据的变化，当数据发生变化时，Render 函数执行生成 vnode 对象；

3、调用 patch 方法，对比新旧 vnode 对象，通过DOM diff 算法添加、修改、删除真正的 DOM 元素；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124159.png" style="zoom:50%;" align=""/>



## 2-7、渲染—DOMDIFF

Vue 渲染 redner 就是构建虚拟 DOM，然后才构建到真实 DOM 上去，真实 DOM 与 虚拟 DOM 比对如下：

**<u>真实 DOM：</u>**

浏览器渲染引擎流程大致分5步：创建  `DOM` 树 —> 创建 `Style Rules` -> 构建 `Render` 树 —> 布局 `Layout` -—> 绘制 `Painting`：

- 第一步，构建 DOM 树：用 HTML 分析器，分析 HTML 元素，构建一棵 DOM 树；
- 第二步，生成样式表：用 CSS 分析器，分析 CSS 文件和元素上的 inline 样式，生成页面的样式表；
- 第三步，构建 Render 树：将 DOM 树和样式表关联，构建 Render 树(Attachment)；
  - 每个 DOM 节点都有 attach 方法，接受样式信息，返回一个 render 对象，这些对象最终会被构建成一棵 Render 树；
- 第四步，确定节点坐标：根据 Render 树结构，为每个 Render 树上节点确定一个在显示屏上出现的精确坐标；
- 第五步，绘制页面：根据 Render 树和节点显示坐标，然后调用每个节点的 paint 方法，将它们绘制出来；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124057.png" style="zoom:50%;" />

**<u>虚拟 DOM：</u>**

本质是用一原生的 JS 对象去描述一个 DOM 节点(对原生的抽象—性能提升(内存处理/频繁重排避免)、跨平台、无需操作DOM)(借鉴snabbdom、inferno)；

能应对绝大部分应用性能需求，但在某些性能要求极高的应用，虚拟DOM <u>无法进行针对性极致优化</u>；然后当变化产生时，比较虚拟DOM树差异，最后将之应用到真正 DOM 上；(初次渲染或更新时用 JS 对象将 DOM 化为虚拟 DOM，若为更新则按照一定规则(DIff)比对前后虚拟DOM树变化，随后将变化结果应用到真正DOM树上)；

**<u>*VueDIFF过程：*</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124105.png" style="zoom:50%;" align="" />

当数据发生改变时，set 方法会触发 Dep.notify 方法，通知所有订阅者 Watcher，订阅者就会调用 patch 给真实 DOM 打补丁，更新相应视图：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124106.png" style="zoom:50%;" align="" />



首先，正常情况下，Diff 两个树的时间复杂度是 O(n^3)—(旧树、新树、真实树)， 可实际中很少进行跨层级 DOM 移动，故 Vue 将这一流程进行了优化(看下方流程)，将时间复杂度降至 O(n)；Vue 版本与 DOMDIFF 关系：

- Vue2 DIFF 采用双端比较(新旧比较)的算法：同时从新旧 children 两端开始进行比较，并借助 key 值找到可复用节点，再进行相关操作；
- Vue3 借鉴 ivi 算法和 inferno 算法：创建 VNode 时就确定其类型，在 mount/patch 过程中采用位运算来判断 VNode 类型，并利用动态规划的思想求解最长递归子序列，最后才再配合双端比较的算法，进一步提升性能；


然后，Vue2 虚拟DOM 映射到真实DOM 要经过 VNode 的 create、diff 、patch 等阶段；Vue.init 初始化，vm.$mounnt 挂载 -> return mountCompent(this, el, …) -> 实例化 Watcher，然后再在里面调用 <u>updateComponent</u> -> vm.render 将实例渲染为 VNode(使用 createElement 创建 VNode) -> vm.update (vnode, …) -> `vm.__patch__`(核心方法：完成 preVnode 与 vnode 的 DIFF 并按需为 vdom 节点 patch)，最后生成新的真实 DOM 以完成视图更新操作；

- `vm.__patch__`：先用 sameVnode 比对新旧 Vnode 基本属性，若同则认为发生局部更新，然后 DIFF；否则直接跳过 DIFF，根据 vnode 新建真实 DOM，同时删除旧 dom 节点；DIFF：Vue2 Diff 实现主要通过两个方法：patchVnode(oldVnode, vnode)(及其 updateChildren 方法)：

- patchVnode如下：

  - 首先，若新旧树存在节点，且 if (oldVnode === vnode)，引用一致，无变化；

  - 然后，若新旧树存在节点，节点相同且为文本节点，则先进行文本节点判断，oldVnode.text !== vnode.text，不同则通过 Node.textContent = vnode.text 更换；

  - 然后，若新旧树存在节点，节点相同且非文本节点，若含有子节点且不相同，if( oldCh && ch && oldCh !== ch)，则进入子节点 DIFF(DIFF核心)，即调用 updateChildren 比较；即同级比较(只有两个新旧节点是相同节点时，才会去比较各自子节点)(优点也是缺点，前因省去大量比较，后因省去底层比较，浪费严重(分情况讨论))；也即只更新差异部分的 DOM，以减少更新量，提升效率；

    - updateChildren 首先会通过判断两节点的 key、tag、isComment、data同时定义或不定义，及当标签类型为 input 时 type 类型来确定两节点是否相同；若不是则将新节点替换旧节点，若相同则进入 pathVNode，如此迭代下去；

    - updateChildren 比较流程(夹逼法)：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex & newStartIndex、newEndIndex 之间两两相互比较，变量会往中间靠拢，一旦 Startldx > Endldx 则表明 oldCh 和 newCh 至少有一个已遍历完，就会结束比较；

    - 优化：通过模版编译时的静态标记来跳过静态节点比较；

    - 优化：通过 key 尽可能的复用DOM元素(同级且父节点一致才可复用)；key 是 vnode 的唯一标记， 通过 key，有助于 DIFF 过程高效准确：

      - 更准确：新旧 children 中的节点只有顺序是不同时，最佳操作应是通过移动元素位置来实现更新目的；(DIFF 比较是为了在新旧节点中找到相同节点，所以增加 Key 有利于节点复用，以快速找到相同节点而无需递归查找)；

      - 更快速：利用 key 的唯一性，在新旧 children 节点中保存映射关系 Map，以便能够在旧 children 节点中快速找到可复用节点；

      - ```js
        function createKeyToOldIdx (children, beginIdx, endIdx) {
          let i, key
        	const map = {}
        	for (i = beginIdx; i <= endIdx; ++i) {
        		key = children [i].key
        		if (isDef(key)) map[key] = i
        	}
        	return map 
        }
        ```

  - 然后，若新树存在旧树没有的节点，则调用 createEle(vnode)，vnode.el 已引用了老的 dom节点，故方法会在老 DOM 节点上添加子节点；

  - 最后，若新树不存在旧树子节点，则删除 elm 真实节点下的 oldVnode 子节点；

最后，应用到真实 DOM 上；DIFF 最终目的是为修改 DOM 树：页面 DOM 树、旧 VNode 树、新 Vnode 树；

- 页面 DOM 树与旧 VNode  树节点一一对应，而新 Vnode 树则是表示更新后页面 DOM 树 该有的样子；
  - 注意：在旧 Vnode 树与新 Vnode 树 进行比较过程中：不会对此两棵 Vode 树进行修改，而是以比较的结果，直接对真实 DOM 进行修改；
  - 比如：旧 Vnode 树同一层中，找到与新 Vnode 树中一样但位置不同的节点，此时需要移动节点，但不是移动旧树中节点，而是直接移动 DOM；
  - 即新旧 Vnode 树是拿来比较，最后只用比较结果对页面 DOM 树进行修改；

所以，Vue DOMDIFF 体现了：

- 首先，找到 不需要移动的相同节点(文本节点)，消耗最小；
- 然后，再找相同但是需要移动的节点，消耗次小；
- 最后，找不到才会去新建/删除节点，兜底处理；



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124107.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124108.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132803.png" style="zoom:50%;" />

**<u>*DOM Diff 比较示例*</u>**：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124112.png" style="zoom:50%;" align="" />

首轮，父节点相同，符合规则，进行子节点比较，进行第一流程：先找无需移动的相同节点，找到节点 2，根据比较结果，无需修改 DOM，则保留原位置；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124113.png" style="zoom:50%;" align="" />

二轮，再无<u>相同且无需移动的节点</u>，进行第二流程：找<u>相同但是需要移动的节点</u>，找到节点 5，根据比较结果，需要移动 DOM；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124114.png" style="zoom:50%;" align="" />

三轮，无相同节点，进行流程三，新建或删除节点，在旧 Vnode 中，若新 Vnode 不存在的节点要删除，在新 Vnode 中，旧 Vnode 不存在节点要新建；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124115.png" style="zoom:50%;" align="" />

最后，页面更新完毕；





## 2-8、钩子—生命周期

Vue 实例有一个完整的生命周期，也即从开始创建、初始化数据、编译模版、挂载DOM->渲染、更新->渲染、卸载等一系列过程，称之为 Vue 的生命周期；

创建前/后：

- beforeCreate：vue 实例的挂载元素 `$el` 和数据对象 data 都是 undefined，尚未初始化；
- created：完成 data 数据初始化，但 `$el` 还未初始化；

载入前/后：

- beforeMount：vue 实例的 `$el` 和 data 均已初始化，相关 render 函数首次被调用；实例已完成以下配置：编译模板，将 data里的数据和模板生成html；但注意此时还未挂载 html 到页面上；
- mounted：`el` 被新创建的 `vm.$el` 替换，并挂载到实例上后调用；实例已完成以下配置：用上面编译好的 html 内容替换 `el` 属性指向的 DOM 对象；完成将模板中的 html 渲染到 html 页面；此过程中进行 ajax 交互；

更新前/后：

- beforeUpdate：在数据更新前调用，发生在虚拟 DOM 重新渲染和打补丁前；可在此钩子中进一步地更改状态，且不会触发额外的重渲染过程；
- updated：在由于数据更改导致的虚拟 DOM 重新渲染和打补丁后调用；调用时，组件 DOM 已更新，故可执行依赖于 DOM 的操作；但注意：大多数情况下，应避免在此期间更改状态，因可能会导致更新无限循环(使用 this.$nextTick 缓解)；该钩子在服务器端渲染期间不被调用；

销毁前/后：

- beforeDestroy：在实例销毁前调用；实例仍然完全可用；
- destroyed：在实例销毁后调用；调用后所有的事件监听器会被移除，所有子实例也会被销毁；该钩子在服务器端渲染期间不被调用；

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 组件实例被创建之初，组件的属性生效前                         |
| Reated        | 组件实例已经完全创建，属性也绑定，但真实dom还没有生成，`$el` 还不可用 |
| beforeMount   | 在挂载开始之前被调用：相关的 render 函数首次被调用           |
| mounted       | el 被新创建的 vm.$el 替换，并挂载到实例上，之后调用该钩子    |
| beforeUpdate  | 组件数据更新之前调用，发生在虚拟 DOM 打补丁前                |
| update        | 组件数据更新之后                                             |
| activited     | keep-alive 专属，组件被激活时调用                            |
| deactivated   | keep-alive 专属，组件被销毁时调用                            |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |

- <u>发起异步请求时机</u>：可在钩子函数 created、beforeMount、 mounted 中进行调用，这三个钩子中，data 已经创建，可将服务端端返回的数据进行赋值；而在 created 钩子中调用异步请求还有以下优点：
  - 更快获取到服务端数据，减少页面 loading 时间；
  - ssr不支持 beforeMount、mounted 钩子函数，放在 created 有助于确保一致性；
- <u>操作 DOM 时机</u>：在钩子函数 mounted 被调用前，Vue 已将编译好的模板挂载到页面上，故在 mounted 中即可访问操作 DOM；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132752.png" style="zoom:50%;" />



**<u>*父子组件生命周期执行顺序*</u>**：Vue 父组件和子组件生命周期钩子函数执行顺序可为以下 4 部分：

- 加载渲染过程：父beforeCreate ->父created ->父beforeMount ->子beforeCreate ->子created ->子beforeMount ->子mounted ->父mounted；
- 子组件更新过程：父beforeUpdate ->子beforeUpdate ->子updated ->父updated；
- 父组件更新过程：父beforeUpdate ->父updated；
- 销毁过程：父beforeDestroy ->子beforeDestroy ->子destroyed ->父destroyed

总即：组件调用顺序是：先父后子，渲染完成顺序是：先子后父；

总即：组件销毁顺序是：先父后子，销毁完成顺序是：先子后父；

```js
// 注意：父组件监听子组件生命钩子调用方式：
// 方式1: 通过 $emit 触发父组件事件
// Parent.vue
<Child @mounted="doSomething"/>
// Child. vue
mounted() {
	this.$emit("mounted”); 
}

             
// 方式2: 在父组件引用子组件时, 通过 @hook 监听
// Parent. vue
<Child @hook :mounted="doSomething"></Child>
doSomething() {
	// ... B
}
// Child. vue
mounted(){
	// ... A
},
// 以上输出顺序为: A -> B
// @hook 方法不仅可监听 mounted, 还可监听其它生命周期事件，比如 created, updated 等
```





## 2-9、其他—CWM

即 computed/watch/methods；

**<u>*computed浓缩：*</u>**

computed 计算就是调用设置的 get 函数，然后得到返回值；其能控制缓存的重要一点是它的属性：脏数据标志位 dirty；

- 当 dirty 为 true 时，读取 computed 会重新计算
- 当 dirty 为 false 时，读取 computed 会使用缓存

1、开始每个 computed 新建自己的 watcher 时，会设置 watcher.dirty = true，以便于 computed 被使用时，会计算得到值；

2、当依赖数据发生变化后，通知 computed 时，会设置 watcher.dirty = true，以便于其他地方重新渲染、重新读取 computed 时，computed 重新计算

3、当 computed 计算完成后，会设置 watcher.dirty = false，以便于其他地方再次读取时，使用缓存，免于计算； 

- data C 开始变化后.......

- 通知 computed B watcher 更新，并只重置脏数据标志位 dirty = true，而不会计算值；
- 通知 页面 A watcher 进行更新渲染，进而重新读取 computed B ，然后 computed B 开始重新计算；

为什么 data C 能通知 页面 A：因为 data C 的依赖收集器会同时收集到 computed B 和 页面 A 的 watcher

为什么 data C 能收集到 页面A 的watcher：因为 computed 在 页面 A 在读取 computed B 时，data C 就会收集到页面A watcher

为什么 computed 能够更新：因为被依赖通知更新后，computed 重置了脏数据标志位(放开权限)，允许页面读取 computed 时再更新值；

**<u>*computed流程：*</u>**

<u>初始化时</u>：init—>initComputed—>页面初次渲染，此时 Dep.target 为页面 Watcher—>触发用 createComputed包装的 get 函数 createComputedGetter，createComputedGetter 主要执行了：`if (watcher.dirty) { watcher.evaluate(); }`、`if (Dep.target) { watcher.depend(); }`   

- 前者：执行前者；此时 watcher.dirty = true，因使用的是 lazy 的初始值 (initComputed 中 `new Watcher(vm, getter, { lazy: true });`)，所以 `watcher.evaluted` 可以被调用 (注意：调用完毕就要设置 dirty 为 false，此后除非与 computed 相关 data  发生变化，否则不会触发，即此值控制着缓存，是 computed 的核心实现)，随即 `computed.watcher.get` 被调用，进行 `pushTarget`，导致 `Dep.target` 被修改为 computed-watcher，而原来的值(页面 Watcher)会先被缓存到 targetStack 中；同时，computed 的计算会读取 data，因为双绑机制，此时 data 就能收集到 computed-watcher，即computed-watcher 也会保存到 data 的依赖收集器 dep.subs 中；随后，computed 计算完毕，执行 popTarget，释放 Dep.target，并将 Dep.target 恢复上一个 watcher(页面watcher)；
- 后者，执行后者；即 `watcher.depend`，即执行 `dep.addSub(Dep.target)`，目的是让 data 再收集一次 Dep.target， 即收集页面 watcher；

- 此时，`data 的依赖收集器 = [ computed-watcher, 页面-watcher]`

<u>数据更新时</u>：即 computed 所依赖的 data 更新时，触发 `dep.nodify`，依次触发依赖数组下的每一watcher：

- 先执行 computed-watcher 计算值(调用了 `watcher.update`，而其中包含了 `if (this.lazy)  this.dirty = true;`，但注意此时尚未计算结果，只是控制计算的阀门打开，计算行为由 `watcher.evaluate()` 负责，而此方法在 `get:createComputedGetter(key),`，注意 get，所以 get 时，也即页面渲染时，读取值时才做真正计算 )；
- 再执行页面-watcher 渲染页面做真正计算；
- 即 data 改变，正序遍历通知，computed 先更新，页面再更新，所以页面才能读取到最新的 computed 值；

<u>最后总结</u>：由双绑控制变化的触发，值相等则不触发，值不等才触发 watcher.update，而平时的刷新渲染不会触发 computed 的计算求值，因为 watcher.dirty 为 false，但 watcher 监听属性则会随着页面刷新而触发，即使它所绑定的值未发生值变化，因为它没有设置 watcher.dirty 变量去阻止；所以可以理解为 computed 计算属性是带有 dirty 标记的 watch，也正因为通过此标记，才能阻止不随页面刷新而计算；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124201.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124202.png" style="zoom:50%;" align=""/>

**<u>*三者的对比：*</u>**

computed：计算属性，依赖其它属性值，有缓存性，只有所依赖属性值发生改变，下一次获取 computed 时才会重新计算新值；

- 本质是一个惰性求值的观察者，其内部实现了一个具有缓存功能的 watcher，也即 computed watcher，watcher 不会立刻求值，同时其持有一个 dep 实例；实例内部通过 this.dirty 属性标记计算属性是否需要重新求值；然后，当 computed 的依赖状态发生改变时，就会通知这个惰性的 watcher；然后，computed watcher 通过  this.dep.subs.length 判断有没有订阅者：
  - 若有则会重新计算，然后对比新旧值，有变化就会重新渲染；注意：Vue 想确保不仅是计算属性依赖的值发生变化就触发渲染，而是当计算属性最终计算的值发生变化，才会触发渲染 watcher 重新渲染，本质上是一种优化；
  - 若无则仅将 this.dirty = true；注意：当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性时，它才会真正计算，即具备 lazy 特性；
- 注意：computed 是在 DOM加载后马上执行，比如赋值操作；
- 注意：计算属性计算时所依赖的属性一定是响应式依赖，否则计算属性不会执行；
- 注意：计算属性是基于依赖进行缓存，若依赖无更新，调用计算属性并不会重新计算，因此可减少开销，只有在其依赖的属性值改变后的下一次获取computed 值时才会重新调用对应的 getter 来计算出相应新值；

watch：侦听器，多起观察作用，无缓存性，可以监听某些数据执行回调，每当监听的数据变化时，都会执行回调进行后续操作；

- 注意：当需要进行深度监听对象中属性时，可打开 deep: true 选项，这样便会对对象中的每一项进行监听，虽会带来性能问题，但可使用字符串形式监听来优化；此外如果没有写到组件中，需要注意使用 unWatch 手动注销；

methods：方法，无缓存性，不像 computed 在 DOM 加载后可自动执行，必须有一定触发条件才被执行，如点击事件等；

- 区别：与 computed 区别在于：前者必须有一定的触发条件才能执行，比如重渲染，异步绑定事件等；而后者则基于它的依赖进行缓存，若多次访问的时候(值不变情况下)，计算属性会立即返回数据，而不必再次执行函数，另外还可自动执行(依赖变化且被读取)；

**<u>*三者使用场景对比:*</u>**

- 当数值计算并依赖于其它数据、计算耗性能的计算场景、模板表达式过于复杂时、复杂渲染数据的计算、不必重新计算数值，可利用 computed 缓存特性，避免每次获取值时都重新计算；
- 当需要在数据变化时执行异步或开销较大操作时，可使用 watch，注意限制执行该操作的频率，并在得到最终结果前，设置中间状态；
- 注意：能使用 watch 属性的场景基本上都可使用 computed 属性，且 computed 属性开销小性能高，故因尽量使用 computed 属性，除非要执行异步或昂贵的操作以响应不断变化的数据；
- 比如：点击搜索按钮的时候才进行数据的响应和操作，使用 computed；获取当前时间，使用 methods；





## 2-10、其他—NextTick

官方描述：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM；(nextTick 在下次DOM更新循环结束后执行延迟回调；主要使用了宏&微任务，并根据环境分别尝试使用 Promise、MutationObserver、setlmmediate、setTimeout)

个人理解：Vue 向外暴露的接口，通过微任务实现渲染后的即时数据操作，但为了兼容性考虑，甚至使用宏任务去向下降级；

Vue 并非每次数据变化即进行页面的渲染更新操作，而是通过异步来实现 DOM 更新；

首先，只要观察到数据变化，Vue 就会开启一个队列，并缓冲在同一事件循环中发生的所有数据改变；若同个 watcher 被多次触发，则最好只会被推入一次，以减少不必要的计算和 DOM 操作；

然后，在下一事件循环 tick 中，Vue 刷新队列并执行相关方法；

- microtask 因其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕；

- 回顾：主线程的执行过程就是一个 tick，而所有的异步结果都是通过"任务队列"来调度；比如消息队列中存放的是一个个的任务 (task)；规范中规定 task 分为两大类，分别是 macro task(宏) 和 micro task(微)，且每个 macro task 结束后，都要清空所有的 micro task；

- Vue 内部对异步队列，会依次尝试使用原生 Promise.then、MutationObserver、setlmmediate，若执行环境均不支持，则会采用 setTimeout(fn, 0)代替；在 vue2.5 源码中，macrotask 降级的方案依次是：setlmmediate、 MessageChannel、 setTimeout；

比如：vm.someData = 'new value' 后，在同一事件循环内，组件不会立即渲染；而是在队列刷新时，组件才会在事件循环队列清空时的下一 "tick" 更新；

问题：难以在 DOM 状态更新后立即做某些处理；

解决：为实现上述场景，可在数据变化后立即使用 Vue.nextTick(callback)；如此回调会在 DOM 更新完成后立即调用；

注意：Vue 在版本2.4—2.6中，对 `nextTick` 的反复改动，是浏览器对微任务的兼容性问题影响、宏微任务特点衡量的结果；

- 若 Vue 使用<u>宏任务函数</u>，则势必要等待UI渲染完成后的下一个<u>宏任务</u>执行；
- 若 Vue 使用<u>微任务函数</u>，则无需等待UI渲染完成即可进行 nextTick 回调；

```js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick()
 .then(function () {
  // DOM 更新了
})
// 2.1.0 起新增：若无提供回调且在支持 Promise 的环境中，则返回一个 Promise；
// 注意 Vue 不自带 Promise 的 polyfill，所以若目标浏览器不原生支持 Promise，得自己提供 polyfill... =。=
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124203.png" style="zoom:50%;" align=""/>











## 2-11、其他—KeepAlive

keep-alive 是 Vue内置的一个组件，可使被包含的组件保留状态，避免重新渲染，一般结合路由和动态组件一起使用，用于缓存组件：

keep-alive 可实现组件缓存，在组件切换时不会对当前组件进行卸载 (即将组件包含在 keep-alive 元素，组件就会被缓存，在组件切换时就不会重新渲染而是直接使用，响应速度也更快)；常用的两个属性 include/exclude 允许组件有条件的进行缓存，两者都支持字符串或正则表达式

- include 表示只有名称匹配的组件会被缓存；
- exclude 表示任何名称匹配的组件都不会被缓存，其中 exclude 优先级比 include 高；

- 两个钩子 activated/deactivated，用来得知当前组件是否处于活跃状态；当组件被激活时，触发钩子 activated，当组件被移除时，触发 deactivated；

**<u>*KeepAlive 实现原理与缓存策略*</u>**：

- 首先，获取 keep-alive 包裹着的第一个子组件对象及其组件名：getFirstComponentChild；
- 然后，根据设定的 include/exclude 进行条件匹配，决定是否缓存；不匹配，则直接返回组件实例；
- 然后，根据组件 ID 和 tag 生成缓存 Key，并在缓存对象中查找是否已缓存过该组件实例；
  - 若存在，则直接取出缓存值并更新该 key 在 this.keys 中的位置 (更新 key 的位置是实现 LRU 置换策略的关键)
- 然后，在 this.cache 对象中存储该组件实例并保存 key 值；
- 然后，检查缓存的实例数量是否超过 max 设置值，若超过则根据 LRU 置换策略删除最近最久未使用的实例(即是下标为0的那个key)；
  - LRU(Least recently used)，缓存淘汰算法，根据数据历史访问记录来进行淘汰数据，核心思想是"若数据最近被访问过，则将来被访问的几率也更高"
  - keep-alive 的实现正是利用了 LRU 策略，将最近访问的组件 push 到 this.keys 末尾，this.keys[0] 也即最久没被访问的组件；
- 最后，将组件实例的 keepAlive 属性设置为 true，此在渲染和执行被包裹组件的钩子函数会用到；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132805.png" style="zoom:50%;" align="" />







## 2-12、其他—指令

**<u>*v-if 与 v-show 区别*</u>**

前者，真·条件渲染，其会在切换过程中，目标事件监听与子组件适当地被销毁/重建；只有条件为真时，才会开始渲染条件块(惰性)；

- 适用于在运行时很少改变条件，无需频繁切换条件的场景

后者，不管初始条件元素总是会被渲染，然后只是简单地基于 CSS 的 display 属性进行切换；

- 适用于需要非常频繁切换条件的场景；



















