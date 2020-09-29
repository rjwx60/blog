





# 一、虚拟 DOM 算法原理

- 1、用 JS 对象模拟真实 DOM树，对真实DOM进行抽象；
- 2、用 Diff 算法比较两棵虚拟DOM树间的差异；
- 3、用 pach 算法将两个虚拟 DOM 对象的差异，应用到真正的DOM树；



## 1-1、JS DOM 抽象

用 JS 对象模拟真实 DOM树，对真实DOM进行抽象；

```js
// 伪码
var el = require("./element.js");
var ul = el('div',{id:'virtual-dom'},[
  el('p',{},['Virtual DOM']),
  el('ul', { id: 'list' }, [
	el('li', { class: 'item' }, ['Item 1']),
	el('li', { class: 'item' }, ['Item 2']),
	el('li', { class: 'item' }, ['Item 3'])
  ]),
  el('div',{},['Hello World'])
]) 

// 伪码
Element.prototype.render = function () {
    var el = document.createElement(this.tagName)
    var props = this.props
    // 设置节点的 DOM 属性
    for (var propName in props) {
        var propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    var children = this.children || []
    children.forEach(function (child) {
        var childEl = (child instanceof Element)
            ? child.render() // 若子节点也是虚拟DOM，则递归构建
            : document.createTextNode(child) // 若字符串，只构建文本节点
        el.appendChild(childEl)
    })
    return el
} 
```



## 1-2、DIFF 比较前后差异

通过 Diff 算法比较两棵虚拟 DOM 树差异

- 注意：完全比较复杂度会达到 O(n^3)，而前端中很少会跨越层级地移动 `DOM` 元素，故 虚拟 DOM 只对同一层级元素进行对比，可将复杂度降至 O(n)

### 1-2-1、深度优先遍历

目的是记录差异

- 对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记；

- 在深度优先遍历的时候，每遍历到一个节点就把该节点和新的的树进行对比；若有差异的话就记录到一个对象中

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124058.png" style="zoom:50%;" align=""/>

```js
// diff 函数，对比两棵树
function diff(oldTree, newTree) {
  var index = 0 // 当前节点的标志
  var patches = {} // 用来记录每个节点差异的对象
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
  var currentPatch = []
  if (typeof (oldNode) === "string" && typeof (newNode) === "string") {
    // 文本内容改变
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  } else if (newNode!=null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // 节点相同，比较属性
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    // 比较子节点，如果子节点有'ignore'属性，则不需要比较
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
  } else if(newNode !== null){
    // 新节点和旧节点不同，用 replace 替换
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
} 
```



### 1-2-3、差异类型

差异类型：DOM 操作导致的差异类型包括以下几种：

- 节点替换：节点改变了，例如将上面的 `div` 换成 `h1`;

- 顺序互换：移动、删除、新增子节点，例如上面 `div` 的子节点，把 `p` 和 `ul` 顺序互换；

- 属性更改：修改了节点的属性，例如把上面 `li` 的 `class` 样式类删除；

- 文本改变：改变文本节点的文本内容，例如将上面 `p` 节点的文本内容更改为 “`Real Dom`”；


```js
var REPLACE = 0 // 替换原先的节点
var REORDER = 1 // 重新排序
var PROPS = 2 // 修改了节点的属性
var TEXT = 3 // 文本内容改变 
```



### 1-2-4、对比算法

列表对比算法；

比如：`p, ul, div` 顺序换成了 `div, p, ul`；若按同层级进行顺序对比，则都会被替换掉；这样 DOM 开销非常大；而实际上是不需要替换的节点，而只需要经过节点移动就可达到，即只需知道怎么进行移动；

解决：问题可抽象为：字符串的最小编辑距离问题 (`Edition Distance`)，最常见解决方法是： `Levenshtein Distance` ；其是一个度量两个字符序列之间差异的字符串度量标准，两个单词间的 `Levenshtein Distance` 是将一个单词转换为另一个单词所需的单字符编辑(插入、删除或替换)的最小数量；`Levenshtein Distance` 是1965 年由苏联数学家 Vladimir Levenshtein 发明；`Levenshtein Distance` 也被称为编辑距离（`Edit Distance`），通过动态规划求解，时间复杂度为 `O(M*N)`；

比如：对于两个字符串 `a、b`，则他们的 `Levenshtein Distance` 为：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124059.png" style="zoom:50%;" align=""/>

示例：字符串 `a` 和 `b`，`a=“abcde” ，b=“cabef”`，根据上面给出的计算公式，则他们的 `Levenshtein Distance` 的计算过程如下：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124100.png" style="zoom:50%;" align=""/>

最后，实例输出

```js
// 伪码
// 其中 ul1 表示原有的虚拟 DOM 树，ul2 表示改变后的虚拟 DOM 树
var ul1 = el('div',{id:'virtual-dom'},[
  el('p',{},['Virtual DOM']),
  el('ul', { id: 'list' }, [
	el('li', { class: 'item' }, ['Item 1']),
	el('li', { class: 'item' }, ['Item 2']),
	el('li', { class: 'item' }, ['Item 3'])
  ]),
  el('div',{},['Hello World'])
]) 
var ul2 = el('div',{id:'virtual-dom'},[
  el('p',{},['Virtual DOM']),
  el('ul', { id: 'list' }, [
	el('li', { class: 'item' }, ['Item 21']),
	el('li', { class: 'item' }, ['Item 23'])
  ]),
  el('p',{},['Hello World'])
]) 
var patches = diff(ul1,ul2);
console.log('patches:',patches);
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124101.png" style="zoom:50%;" align=""/>

## 1-3、Path 应用

通过 patch 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树

首先，深度优先遍历 DOM 树

```js
// 伪码
function patch (node, patches) {
  var walker = {index: 0}
  dfsWalk(node, walker, patches)
}

function dfsWalk (node, walker, patches) {
  // 从patches拿出当前节点的差异
  var currentPatches = patches[walker.index]

  var len = node.childNodes
    ? node.childNodes.length
    : 0
  // 深度遍历子节点
  for (var i = 0; i < len; i++) {
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }
  // 对当前节点进行DOM操作
  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
} 
```

然后，对原有 DOM 树进行 DOM 操作

```js
// 伪码
function applyPatches (node, currentPatches) {
  currentPatches.forEach(currentPatch => {
    switch (currentPatch.type) {
      case REPLACE:
        var newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        node.textContent = currentPatch.content
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
} 
```

最后，DOM 结构改变





# 二、Vue DOMDIFF

## 2-1、VNodeCreated

Vue 中，虚拟DOM 利用 VNode Class 去描述，实际上 `Vue.js` 中 `Virtual DOM` 是借鉴了一个开源库  [snabbdom](https://github.com/snabbdom/snabbdom) ，然后加入自身的一些特性实现：

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }
}
```

- `text` 属性是文本属性；
- `children` 属性是`vnode`的子节点；
- `tag` 属性即这个`vnode`的标签属性；
- `elm` 属性为这个`vnode`对应的真实`dom`节点；
- `key` 属性是`vnode`的标记，在`diff`过程中可以提高`diff`的效率；
- `data` 属性包含了最后渲染成真实`dom`节点后，节点上的`class`，`attribute`，`style`以及绑定的事件；



## 2-2、DOMDIFFInit

```js
// 1、初始化 Vue
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// ... 

// 2、通过 $mount 实例方法去挂载 dom，$mount 会调用原型上的方法
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this

  // ....

  if (vm.$options.el) {
    console.log('vm.$options.el:',vm.$options.el);
    vm.$mount(vm.$options.el)
  }
}

// ... 

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)
  
   // ...
  return mount.call(this, el, hydrating)
}

// ...

// 3、$mount 方法实际上会去调用 mountComponent 方法，而 mountComponent 核心就是: 
// 先实例化一个渲染 Watcher，在其回调函数中会调用 updateComponent 方法，在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el

  // ...
  
  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      // 生成虚拟 VNode   
      const vnode = vm._render()
      // 更新 DOM
      vm._update(vnode, hydrating)
     
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // 实例化一个渲染 Watcher，在它的回调函数中会调用 updateComponent 方法  
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  return vm
}

// ...

// 4、创建 VNode
// Vue 的 _render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node
// Vue 利用 _createElement 方法创建 VNode
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options
  let vnode
  try {
    // ...
    currentRenderingInstance = vm
    // 调用 createElement 方法来返回 vnode
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`){}
  }
  // set parent
  vnode.parent = _parentVnode
  console.log("vnode...:",vnode);
  return vnode
}

// _createElement 方法有 5 个参数
// context 表示 VNode 的上下文环境，它是 Component 类型；
// tag 表示标签，它可以是一个字符串，也可以是一个 Component；
// data 表示 VNode 的数据，它是一个 VNodeData 类型；
// children 表示当前 VNode 的子节点，它是任意类型的，需要被规范为标准的 VNode 数组；
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
    
  // ...
  
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 场景是 render 函数不是编译生成的
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // 场景是 render 函数是编译生成的
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // 创建虚拟 VNode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}


// 5、效果演示
var app = new Vue({
  el: '#app',
  render: function (createElement) {
    return createElement('div', {
      attrs: {
        id: 'app',
        class: "class_box"
      },
    }, this.message)
  },
  data: {
    message: 'Hello Vue!'
  }
})
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124102.png" style="zoom:50%;" align="" />



## 2-3、Diff Process

```js
// 1、change -> dep.notify -> updateComponent(视图更新)
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...
  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      // 生成虚拟 VNode   
      const vnode = vm._render()
      // 更新 DOM
      vm._update(vnode, hydrating)
     
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // 实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法  
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  return vm
}

// 2、完成视图的更新工作事实上就是调用了 vm._update 方法，方法接收的第一个参数是刚生成的 Vnode
// 关键是 vm.__patch__ 方法，此亦整个 virtual-dom 中最为核心方法，主要完成了 prevVnode 和 vnode 的 diff 过程并根据需要操作的 vdom 节点打 patch，最后生成新的真实 dom 节点并完成视图的更新工作
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  if (!prevVnode) {
    // 第一个参数为真实的 node 节点，则为初始化
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 若需要 diff 的 prevVnode 存在，则对 prevVnode 和 vnode 进行 diff
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  restoreActiveInstance()
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
}


// patch 过程中会调用 sameVnode 方法来对传入的2个 vnode 进行基本属性的比较，只有当基本属性相同的情况下才认为这个2个 vnode 只是局部发生了更新，然后才会对这 2 个 vnode 进行 diff，若 vnode 的基本属性存在不一致的情况，则直接跳过 diff 过程，进而依据 vnode 新建一个真实的 dom，同时删除老的 dom节点
function patch (oldVnode, vnode, hydrating, removeOnly) {
    // ......
    if (isUndef(oldVnode)) {
      // 当 oldVnode 不存在时，创建新的节点
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 对 oldVnode 和 vnode 进行 diff，并对 oldVnode 打 patch  
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } 
	// ......
  }
}
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// 3、diff 过程中主要是通过调用 patchVnode 方法进行
// diff 过程中又分了好几种情况: oldCh 为 oldVnode 的子节点，ch 为 Vnode 的子节点：
// 首先, 进行文本节点的判断，若 oldVnode.text !== vnode.text，则直接进行文本节点的替换；
// 然后, 在 vnode 没有文本节点情况下，进入子节点的 diff；
// 	当 oldCh 和 ch 都存在且不相同的情况下，调用 updateChildren 对子节点进行 diff；
// 	若 oldCh 不存在，ch 存在，首先清空 oldVnode 的文本节点，同时调用 addVnodes 方法将 ch 添加到 elm 真实 dom 节点当中；
// 	若 oldCh 存在，ch不存在，则删除 elm 真实节点下的 oldCh 子节点；
// 	若 oldVnode 有文本节点，而 vnode 没有，那么就清空这个文本节点。
function patchVnode (oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
  // ...... 
  const elm = vnode.elm = oldVnode.elm
  const oldCh = oldVnode.children
  const ch = vnode.children
  // 若 vnode 没有文本节点
  if (isUndef(vnode.text)) {
    // 若 oldVnode 的 children 属性存在且 vnode 的 children 属性也存在  
    if (isDef(oldCh) && isDef(ch)) {
      // updateChildren，对子节点进行 diff  
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(ch)
      }
      // 若 oldVnode 的 text 存在，则首先清空 text 内容, 然后将 vnode 的 children 添加进去  
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      // 删除 elm 下的 oldchildren
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      // oldVnode 有子节点，而 vnode 没有，则清空这个节点  
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 若 oldVnode 和 vnode 文本属性不同，则直接更新真实 dom 节点的文本元素
    nodeOps.setTextContent(elm, vnode.text)
  }
  // ......
}


function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  // 为 oldCh 和 newCh 分别建立索引，为之后遍历的依据
  // 开始遍历 diff 前，首先给 oldCh 和 newCh 分别分配一个 startIndex 和 endIndex 来作为遍历的索引
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // 直到 oldCh 或 newCh 被遍历完后跳出循环
  // 当 oldCh 或 newCh 遍历完后(遍历完的条件就是 oldCh 或 newCh 的 startIndex >= endIndex)，就停止 oldCh 和 newCh 的 diff 过程
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

- 无 key Diff
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124103.png" style="zoom:50%;" align=""/>
- 有 key Diff
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124104.png" style="zoom:50%;" align=""/>



## 2-4、Path Process

```js
// 观察上述代码知，通过 nodeOps 相关的方法对真实 DOM 结构进行操作
export function createElementNS (namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

export function createTextNode (text: string): Text {
  return document.createTextNode(text)
}

export function createComment (text: string): Comment {
  return document.createComment(text)
}

export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function removeChild (node: Node, child: Node) {
  node.removeChild(child)
}

```


