- Vue.js 源码的入口主要做了些什么处理？
  - 各种初始化，各种属性方法的添加(静态 & 原型)；
- Vue 的整个框架的实现原理大致可分为哪几个部分？
  - 详看 1-1 实现原理；
- Vue.js 中的数据劫持是怎么实现的？浏览器兼容性呢？
  - 详看数据绑定小节 & 源码小节；通过  Object.defineProperty 实现，最低支持 IE8；
- Vue.js 中的依赖收集是怎么处理的？和闭包有什么关联吗？
  - 详看数据绑定小节 & 源码小节；Dep 内部通过闭包获取 watcher，Watcher 内部通过闭包获取 dep；
- Vue.js 中的模板解析需要经历哪几个阶段？
  - parse，optimize，generate，解析模板，生成渲染模板的 render
  - 注意：optimize 标记了静态节点(没有绑定任何动态数据)，在页面需要更新时，VueDiff 时会直接此部分 DOM 的处理，从而达到性能优化的目的；
- Vue.js 中的虚拟节点优势是什么？
  - 详看 DOM Diff 小节；无需频繁操作 DOM，性能优异、本质为 JS 对象，可跨平台处理；
- Vue.js 中的 DIFF 算法是怎么处理的？
  - 详看生命周期小节与源码解析部分小节；
- Vue.js 中 DIFF 算法的时间复杂度是多少？为什么？
  - O(n)，同时比较，同层比较，而非传统的多层嵌套比较；
- Vue.js 中 `computed` / `watch` 实现的原理是什么？
  - 前者是带有 dirty 属性的 watch，通过 dirty 标记位，阻止页面刷新渲染时计算值，而只有相关值变化时才触发；
- Vue.js 中有哪些周期函数？这些周期函数都是在什么时机执行的？
  - 详看生命周期小节；
- Vue.js 中的 `$nextTick` 的原理是什么？它主要经历了哪些变化？为什么？
  - 详看源码解析部分小节；
- Vue.js 对 DOM 的更新做了哪些标记优化处理？
  - 静态节点标记忽略、key 标记复用节点
- Vue.js 在语法层面可以做哪些优化处理？
  - Keep-alive、使用 key、使用 jsx render 形式、编写规范的 data、prop 等属性形式
- Vue.js 2.x 中的 Proxy 代理主要做了些什么工作？
  - 通过 Object.defineProperty 实现，将 data 属性代理到 vm 实例上(this.key == this.data.key)；
- Vue 3.x 的源码相对 Vue 2.x 主要做了哪些变化？
  - 见上方；
- Vue 2.x 中的数据劫持能否采用发布 / 订阅模式实现？采用观察者模式带来的优势和劣势有哪些？
  - 
- Vue.js 中的 M / V / VM 分别指的是哪些？简述 MVC / MVP / MVVM 的区别？
  - Model、View、ViewMode，详见前端设计一章
- 发布 / 订阅模式和观察者模式的区别是什么？手写一个发布 / 订阅模式？
  - 前者具有调度器；略；
- Vue.js 报 error / warning 的时有深入追踪错误栈的习惯吗，如何追踪；
  - 
- Polyfill 是什么？Vue 支持哪些相关的可配置化信息？
  - 
- Vue.js 2.x 中如何支持 TypeScript ?
  - 
- Vue.js 如何做 ESLint 校验？
  - 
- Vue.js 如何做单元测试？
  - 没做过
- 了解过 Vue-Router  / Vuex 的源码吗？
  - 了解过；详见源码分析；
- Vue-loader 主要有哪些特性？
  - 
- Vue 路由懒加载是如何实现的？
  - 
- Coding Split 和哪些 Webpack 配置相关？
  - SplitChunkPlugin；
- Vue 中可以使用 JSX 吗？
  - 可以；
- 设置了 `keep-alive` 之后对组件渲染的生命周期有什么影响？
- `keep-alive` 有哪些特性？

