# 一、基本

## 1-1、数据绑定

Vue2 数据绑定依靠 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124056.png" style="zoom:50%;" align="" />



### 1-1-1、initData

首先，initData，获取 data 的 key，并获取 props，并确保 props 优先，不能与 data 重复，并判断是否保留字段，并将 data 属性代理到 vm 实例上(this.key == this.data.key)，随后进行 observer(data) - 数据绑定操作；

```js
function initData (vm: Component) {
  /* 获取 data */
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  /* data 是否为对象 */
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }

  // proxy data on instance
  /* 获取 props */
  const keys = Object.keys(data)
  const props = vm.$options.props
  let i = keys.length

 	/* 遍历对象 data 的键值进行处理 */
  while (i--) {
    /* 确保 data 的键值 key 不与 props 键值重复，props 优先*/
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${keys[i]}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    // 如果不是保留字段，则继续进行代理操作，将 data 上的属性代理到 vm 实例上，即实现：vm.key == vm._data.key
    } else if (!isReserved(keys[i])) {
      proxy(vm, `_data`, keys[i])
    }
  }

  // observe data
  // observe: 开始对数据进行绑定，asRootData，表示此步作为数据的最初操作，后续会进行递归 observe 从而实现对深层对象的绑定
  observe(data, true /* asRootData */)
}






// Proxy - 负责代代理 - 通过 Object.defineProperty 实现
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```



### 1-1-2、observe

observe 作用是防止 Observer 的重复绑定

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
// 尝试创建一个 Observer 实例（__ob__），若成功创建 Observer 实例则返回新的 Observer 实例，若已有 Observer 实例则返回现有的 Observer 实例
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value)) { return }
  let ob: Observer | void

  // 若已有 Observer 实例则直接返回该实例，若没有则会新建一个 Observer 实例并赋值给 __ob__ 属性
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    // 确保 value 是单纯的对象，而非函数或是Regexp等情况。*/
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // ob 存放 Observer 实例/该属性的观察器，防止重复绑定
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    // 若为根数据则计数，后面 Observer 中的 observe 的 asRootData 均为 false 则不计数
    ob.vmCount++
  }
  return ob
}
```



### 1-1-3、Observer

Observer 作用是遍历对象的所有属性将其进行双向绑定—walk 方法—针对数组/对象处理+赋值操作 `data.__ob__ = Observer 实例`；

```js
/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
export class  {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    // 含有 id & subs 用于管理 watchers
    this.dep = new Dep()
    this.vmCount = 0

    // 将 Observer 实例绑定到 data 的 __ob__ 属性上，前面的 observe 方法就是检测这个属性：data.__ob__
    def(value, '__ob__', this)
    
    // 若值为数组，则利用被劫持的数组方法，实现对数组操作的监听(重写push、pop、shift、unshift、splice、sort、reverse)
    if (Array.isArray(value)) {
      // 若当前浏览器支持 __proto__ 属性，则直接覆盖当前数组对象原型上的原生数组方法(直接覆盖该属性则使数组对象具有了重写后的数组方法)
      // 若不支持该属性，则通过遍历 def 所有需要重写的数组方法(arrayMethods 中有调用 def，显然前者效率更高，优先使用前者)
      const augment = hasProto
        ? protoAugment  // 直接覆盖原型的方法来修改目标对象
        : copyAugment   // 定义（覆盖）目标对象或数组的某一个方法
      augment(value, arrayMethods, arrayKeys)
     	// 对每一个数组成员进行 observe
      this.observeArray(value)
      
    // 若是对象则直接利用 walk 进行绑定
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)

    // walk 方法会遍历对象的每一个属性进行 defineReactive 绑定
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}






// arrayMethods
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 原生数组的原型
const arrayProto = Array.prototype
// 数组对象，劫持 7 个原生数组方法
export const arrayMethods = Object.create(arrayProto)
/**
 * Intercept mutating methods and emit events
 */
// 在保证不污染原生数组原型的情况下重写数组方法，截获数组的成员发生的变化，执行原生数组操作的同时 dep 通知关联的所有观察者进行响应式处理
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // 缓存原生数组方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    let i = arguments.length
    const args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    // 调用原生的数组方法执行结果
    const result = original.apply(this, args)

		// 通过 ob 属性获取 Observer 实例
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 数组新插入元素需重新进行 observe
    if (inserted) ob.observeArray(inserted)

    // notify change
    // dep 通知所有注册的观察者进行响应式处理 
    ob.dep.notify()
    return result
    // arrayMethods 做了两件事:
    // 一是通知所有注册的观察者进行响应式处理
    // 二是若是添加成员的操作，需要对新成员进行 observe
    // 注意：修改了数组的原生方法后，还是没法像原生数组一样直接通过数组的下标或者设置 length 来修改数组，但 Vue 提供了 $set() 及 $remove()方法弥补
  })
})
```



### 1-1-4、defineReactive

defineReactive 作用是通过 Object.defineProperty 为数据定义上 getter\setter 方法，进行依赖收集后闭包中的 Deps 会存放 Watcher 对象。触发 setter 改变数据的时候会通知 Deps 订阅者通知所有的 Watcher 观察者对象进行试图的更新；

- 补充：defineReactive 接收整一个 data 对象，并每一个 key 与与之对应的 value
- 补充：关键理解 Dep，每一个 key 都有自己的 Dep 对象实例，此实例在 getSet 使用；

```js
/**
 * Define a reactive property on an Object.
 */
// defineReactive(obj, keys[i], obj[keys[i]])
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  // 获取 Dep 实例
  // 关键理解 Dep，每一个 key 都有自己的 Dep 对象实例，此实例在 getSet 使用
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
	// 若先前该对象已预设 getter 或 setter 函数则将其取出，并在新定义的 getter/setter 中执行，从而避免发生覆盖 
  const getter = property && property.get
  const setter = property && property.set

  // 将当前键值进行 observe 并获取其返回值 new Observer 实例
  // 注意：只在 val 为对象时才如此: observe: if (!isObject(value)) { return }
  // 注意：new Observer 实例化时，执行了 walk 方法，即对 val 的子属性进行 defineReactive，并实例了一个 dep = new Dep
  let childOb = observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 执行原本对象拥有的 getter 方法
      const value = getter ? getter.call(obj) : val
      
      // 1、执行 new Vue 时，进行 data 代理，data 下的属性的绑定 Observer，此时 Dep.target 也即 Watcher 仍为被实例化，为 undefined
      // 2、随后进行 vue.mount 时，执行了 new Watcher...，此时 Dep.target 不为 undefined，也就在此时进行依赖的收集
      // 3、Dep.target 是全局 watcher 对象
      if (Dep.target) {
        // 进行依赖收集 - 通过闭包传递 dep/watcher 对象
        // 即 Dep.target.addDep(this/dep) -> Watcher.addDep(this/dep) -> dep.addSub(this/watcher) -> this/dep.subs.push(watcher)
        // 通过闭包获取必要参数：watcher 想要 dep，dep 想要 watcher
        dep.depend()
        
        // 子对象也进行依赖收集，实际就是将同一个 watcher 观察者实例放进了两 dep.subs 中，一个是正在本身闭包中的 dep.subs，另一个是子元素的 dep.subs
        if (childOb) { childOb.dep.depend() }
        
        // 数组类型则对每一成员进行依赖收集，若数组的成员还是数组，则递归处理
        if (Array.isArray(value)) { dependArray(value)}
      }
      return value
    },
    
    
    set: function reactiveSetter (newVal) {
      // getter 方法获取当前值
      // 并与新值进行比较，一致则不需要执行下面的操作
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) { return }
      
 
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      
      // 若原本对象拥有 setter 方法则执行
      val = setter ? setter.call(obj, newVal) : newVal

      // 新值需要重新进行 observe，保证数据响应式
      childOb = observe(newVal)

      // dep 对象通知所有的观察者
      // 即 subs[i].update() -> watcher.run()
      dep.notify()
    }
  })
}
```





### 1-1-5、Dep

Dep 是一个发布者，可订阅多个观察者，依赖收集之后，Deps中会存在一或多个 Watcher 对象，在数据变更时通知所有 Watcher；

```js
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 添加一个观察者对象
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除一个观察者对象
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 依赖收集，当存在 Dep.target 时添加观察者对象
  depend () {
    if (Dep.target) {
      // Watcher.addDep
      Dep.target.addDep(this)
    }
  }

  // 通知所有订阅者
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      // Watcher.update()
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
// 依赖收集完需要将 Dep.target 设为 null，防止后面重复添加依赖
```



### 1-1-6、Watcher

Watcher 是一个观察者对象，依赖收集后 Watcher 对象会被保存在 Deps 中，数据变动时 Deps 会通知 Watcher 实例，然后由实例回调进行视图更新；

```js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: ISet;
  newDepIds: ISet;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    // watchers 存放订阅者实例
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    // uid for batching
    this.id = ++uid
    this.active = true
    // for lazy watchers
    this.dirty = this.lazy 
    // Note
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    // 将表达式 expOrFn 解析成 getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
   // 获得 getter 的值并且重新进行依赖收集
  get () {
    // 将自身 watcher 观察者实例设置给 Dep.target，用以依赖收集
    pushTarget(this)
    let value
    const vm = this.vm

		// 执行了 getter 操作，看似执行了渲染操作，其实是执行了依赖收集; 在将 Dep.target 设置为自生观察者实例以后，执行 getter 操作;
    // 比如: data 中可能有 a、b、c三个数据，getter 渲染需要依赖 a & c，则在执行 getter 时就会触发 a & c 两个数据的 getter 函数，在 getter 函数中即可判断 Dep.target是否存在然后完成依赖收集，将该观察者对象放入闭包中的 Dep 的 subs 中去。
    if (this.user) {
      try {
        value = this.getter.call(vm, vm)
      } catch (e) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      }
    } else {
      value = this.getter.call(vm, vm)
    }
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    // 如果存在 deep，则触发每个深层对象的依赖，追踪其变化
    if (this.deep) {
      // 递归每一个对象或者数组，触发它们的 getter，使得对象或数组的每一个成员都被依赖收集，形成一个 "深(deep)" 依赖关系
      traverse(value)
    }

    // 将观察者实例从 target 栈中取出并设置给 Dep.target
    popTarget()
    this.cleanupDeps()
    return value
  }

  /**
   * Add a dependency to this directive.
   */
   // 添加一个依赖关系到 Deps 集合中
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
   // 清理依赖收集
  cleanupDeps () {
    // 移除所有观察者对象
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  // 调度者接口，当依赖发生改变的时候进行回调
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      // 同步则执行 run 直接渲染视图
      this.run()
    } else {
      // 异步推送到观察者队列中，由调度者调用
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
	// 调度者工作接口，将被调度者回调
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        // 即便值相同，拥有 Deep 属性的观察者以及在对象／数组上的观察者应该被触发更新，因它们的值可能发生改变。
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        // 设置新的值
        this.value = value

        // 触发回调渲染视图
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
   /*获取观察者的值*/
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  // 收集该 watcher 的所有 deps 依赖
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  // 将自身从所有依赖收集订阅列表删除
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      /*从vm实例的观察者列表中将自身移除，由于该操作比较耗费资源，所以如果vm实例正在被销毁则跳过该步骤。*/
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```



### 1-1-X、总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124116.png" style="zoom:50%;" align="" />

**<u>*首先*</u>**，initData，获取 data 的 key，并获取 props，并确保 props 优先，不能与 data 重复，并判断是否保留字段，并将 data 属性代理到 vm 实例上(即 vm.key == vm._data.key)，随后进行 observer(data) 数据绑定操作；

然后，new Observer(data)(对数组方法及数组元素的处理，最终执行 walk 方法)、defineReactive(data, keys, values)、定义数据的 get 和 set 操作：

- `Object.defineProperty-get-(dep.depend->Dep.target.addDep->this.subs.push(watcher))`
- `Object.defineProperty-set-(dep.notify->subs[i].update-watcher.run)；`

**<u>*然后*</u>**，初次渲染时，DepTarget 不为 undefined，触发 Data 的 get 操作(保证只有视图中需要被用到的 data 才会触发 getter)，进行依赖收集：将组件 watcher (和 data 相关联的 watcher (存疑))添加到变量的 dep 的 subs 容器中；此时 Watcher 与 data 可看成是一种相互绑定状态；

**<u>*最后*</u>**，data 发生变化，set 被触发时，遍历执行 data.dep.subs 数组下的元素，即执行 watcher.run 方法、执行 render 函数的生成，进入 DOM diff 渲染流程；

**<u>*注意*</u>**：Vue 在初始化组件数据时，在生命周期 [beforeCreate](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js#L55)与[created ](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js#L59)钩子函数间实现了对 [data、props、computed、methods、events及watch](https://github.com/vuejs/vue/blob/dev/src/core/instance/state.js#L43) 的处理；

**<u>*补充*</u>**：依赖收集：

1. ObjectdefineProperty - get 时进行收集
2. data 中每个声明的属性，都会有一个 专属的依赖收集器 subs
3. 当页面使用到 某个属性时，页面的 watcher 就会被 放到 依赖收集器 subs 中
4. 总结即当 页面 A 读取了 name 时，会触发 name 的 get 函数，此时，name 就会保存 页面A 的 watcher；

**<u>*补充*</u>**：依赖更新：

1. Object.defineProperty - set触发依赖更新
2. 总结即当 name 改变时，name 会遍历自身的依赖收集器 subs，逐个通知其中的 watcher，让 watcher 完成更新；

**<u>*补充*</u>**：稍微总结：

1. Object.defineProperty - get ，用于 依赖收集
2. Object.defineProperty - set，用于 依赖更新
3. 每个 data 声明的属性，都拥有一个的专属依赖收集器 subs
4. 依赖收集器 subs 保存的依赖是 watcher
5. watcher 可用于 进行视图更新





### 1-1-Y、补充

**<u>*前期数据处理*</u>**：new Vue -> this._init(options) -> 各种 init 包含 initState -> data属性的各种初始化，比如 initProps、initMethods、initData、initComputed、initWatch，此处重点在 initData，而 initData 中，组件 options 中的 data 会被赋给 vm._data，并进行代理操作，最后会执行 observe(data，true)

**<u>*依赖收集流程*</u>**

- defineReactive 接收整一个 data 对象，并每一个 key 与与之对应的 value

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124117.png" style="zoom:50%;" align=""/>

- Dep.target 在 Watcher 实例化时赋值：Vue实例化 initState 中调用，实例化时调用 this.get，随后调用 pushTarget，即可赋值：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124118.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124119.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124120.png" style="zoom:50%;" align=""/>

- 回到 Dep.target.addDep(this)，由上述推导即 watcher.addDdep(dep)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124121.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124122.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124123.png" style="zoom:50%;" align=""/>

依赖收集最终：

- 在 watcher.newDeps 中 push了闭包中传过来的 dep 对象；
- 在 dep.subs中push了初始化 Vue 是建立的 Watcher 对象；
- 即：watcher.newDeps.push(dep)、dep.subs.push(Watcher)；
- 而：后者中包含：this.getter = expOrFn，传过来的expOrFn是后期数据更新页面渲染的核心步骤；

**<u>*组件渲染流程*</u>**：

- 注意：初次依赖收集发生首次渲染时，依赖收集后试图更新时才会双绑响应

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124124.png" style="zoom:50%;" align=""/>

**<u>*视图更新流程*</u>**：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124125.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124126.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124127.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124128.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124129.png" style="zoom:50%;" align=""/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124130.png" style="zoom:50%;" align=""/>

- 在上面 Watcher.get 方法中：
- 首先，会调用 `pushTarget` 函数将 `Watcher` 对象设为 `Dep.target`；
- 然后，会调用 getter 函数获取 value，即：调用 `updateCompent` 方法 —> `vm._update(vm._render(), hydrating)` —>  `compileToFunctions` 函数生成的 `render` 函数；
- 然后，上述 `render` 函数会返回一个 `VNode` 对象，同时会去获取模板中所使用到的数据，从而又触发数据 `Observer` 的 `getter` (即初次依赖收集通过 `mount`，后续依赖收集随 get 触发)；
- 最后，后面会调用 `vm.__patch__` 方法，进而执行虚拟 DOM 的 diff 过程实时的更新界面；
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124131.png" style="zoom:50%;" align=""/>

视图更新流程总结：

触发 getter 时，数据的 Dep 对象会将 Watcher 对象收集为依赖，这样就完成了渲染的依赖收集；而每当去修改响应式数据时，setter 就会通过 dep.notify 方法来调用 Watcher 的 update 方法。在 update 调用完 getter 函数后，会通过 popTarget 函数将 Dep.target 置空(途中没有展示)；





### 1-1-Z、实现

```js
/**
 * Vue Minimalist implementation
 * By rjwx60
 */


const Observer = function(data) {
  // 遍历设置 getSet 方法
  for (let key in data) {
    defineReactive(data, key);
  }
};


const defineReactive = function(obj, key) {
  // 局部变量 dep，用于 getSet 内部调用, 发布者，用于管理观察者 watcher
  const dep = new Dep();
  // 获取当前值
  let val = obj[key];
  Object.defineProperty(obj, key, {
    // 设置可被循环
    enumerable: true,
    // 设置可被修改
    configurable: true,

    // 主体
    get() {
      console.log("in get");
      // 调用依赖收集器中的 addSub，用于收集当前属性与 Watcher 中的依赖关系
      dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      
      val = newVal;
      // 当值变更时，通知依赖收集器，更新每个需要更新的 Watcher，
      // 这里每个需要更新通过什么断定？dep.subs
      dep.notify();
    }
  });
};


const observe = function(data) {
  // 缺少对依赖重复收集的防御
  return new Observer(data);
};


const Vue = function(options) {
  const self = this;
  // 将 data 赋值给 this._data，源码此部分用的 Proxy 实现
  if (options && typeof options.data === "function") {
    this._data = options.data.apply(this);
  }
  // 挂载函数
  this.mount = function() {
    // 挂载后，Dep.target 才不为 undefined，才可以进行依赖收集
    new Watcher(self, self.render);
  };
  // 渲染函数
  this.render = function() {
    with (self) {
      _data.text;
      // _data.text2;
    }
  };
  // 监听 this._data
  observe(this._data);
};



// 观察者
const Watcher = function(vm, fn) {
  const self = this;
  this.vm = vm;
  // 将当前 Dep.target 指向自身，当 mount 时实例化
  Dep.target = this;
  
  this.addDep = function(dep) {
    // 闭包获取遍历 dep, 即调用 dep.addSub 方法，实现当前 Wathcer 的变量传递
    dep.addSub(self);
  };
  
  // 用于触发 vm._render
  this.update = function() {
    console.log("Watcher updated");
    fn();
  };

  // 此处负责首次调用 vm._render，从而触发 text 的 get 从而将当前的 Wathcer 与 Dep 相关联
  this.value = fn();

  // 清空 Dep.target，防止 notify 触发时，不停绑定 Watcher 与 Dep 造成死循环
  Dep.target = null;
};



// 发布者
const Dep = function() {
  const self = this;
  // 收集目标
  this.target = null;
  // 存储收集器中需要通知的 Watcher
  this.subs = [];
  // 当有目标时，绑定 Dep 与 Wathcer 关系
  this.depend = function() {
    if (Dep.target) {
      Dep.target.addDep(self);
    }
  };
  // 为当前收集器添加 Watcher
  this.addSub = function(watcher) {
    self.subs.push(watcher);
  };
  // 通知收集器中所的所有 Wathcer，调用其 update 方法
  this.notify = function() {
    for (let i = 0; i < self.subs.length; i += 1) {
      self.subs[i].update();
    }
  };
};





// 示例1:
const vue1 = new Vue({
  data() {
    return {
      text: "hello guys"
    };
  }
});

vue1.mount(); // in get
// new Vue -> Vue._data = data && observe(this._data)
// 初始化时，即 new Vue 时即进行了 data 的代理、data 下的每一属性的绑定 observer、此时的 DepTarget 为 undefined
// -> vue.mount -> new Watcher(Vue.this, Vue.render)
// 进行 mount 时，实例化 Watcher, 此时的 Watcher.DepTarget 不为 undefined，并进行首次的依赖收集(this.value = fn()(Vue.render()))
// -> this.value = Vue.render() = Vue._data.text, 即触发 get, 完成收集, 核心是 dep.depend(), (收集依赖, 未被依赖的属性值不会 get)
// dep.depend 通知 Dep.target(即 watcher).addDep(dep)，再折返给 Dep.dep.addSub(watcher)(来回传值是为了传递 watcher)，最终 dep.subs.push(watcher)
vue1._data.text = "123"; // Watcher updated /n in get
// 当发生变化时触发 set，即 dep.notify()，进行更新 subs[i].update()也即 watcher.update()，即 Vue.render




// 示例2:
const vue2 = new Vue({
  data() {
    return {
      text: 'hello guys',
      text2: 'hey'
    };
  }
})

vue2.mount(); // in get
// vue2._data.text = '456'; // Watcher updated /n in get
vue2._data.text2 = '123'; // nothing
// 流程与上述类似，但为何 text2 没有打印是因为没有进行依赖收集，render 中只进行了 Vue._data.text
// 并无 Vue._data.text2 所以没有触发 text2 的 Observer.get 也即没有收集和后续的相应改变
// 即核心关键在于 render 中没有它的身影
```





