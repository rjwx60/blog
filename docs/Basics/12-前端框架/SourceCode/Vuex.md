

```js
// 1、Store
export default new Vuex.Store({
    strict: true,
    modules: {
        moduleA,
        moduleB
    }
});

// Store constructor
constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
  	// 在浏览器环境下，如果插件还未安装（!Vue即判断是否未安装），则它会自动安装。
  	// 允许用户在某些情况下避免自动安装;
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `Store must be called with the new operator.`)
    }

    const {
      // 包含应用在 store 上的插件方法
      // 这些插件直接接收 store 作为唯一参数
      // 可监听 mutation（用于外部地数据持久化、记录或调试）或提交 mutation （用于内部数据，例如 websocket 或 某些观察者）
      plugins = [],
      // 让 Vuex store 进入严格模式，此时的任何 mutation 处理函数以外修改 Vuex state 都会抛出错误
      strict = false
    } = options

    // 从 option 中取出 state，若为 function 则执行，最终得到一个对象
    let { state = {} } = options
    if (typeof state === 'function') { state = state() }

    // store internal state
    // 用来判断严格模式下是否是用 mutation 修改 state
    this._committing = false
    // 存放 action
    this._actions = Object.create(null)
    // 存放 mutation
    this._mutations = Object.create(null)
    // 存放 getter
    this._wrappedGetters = Object.create(null)
    // module 收集器
    this._modules = new ModuleCollection(options)
    // 根据 namespace 存放 module
    this._modulesNamespaceMap = Object.create(null)
    // 存放订阅者
    this._subscribers = []
    // 用以实现 Watch 的 Vue 实例
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    // 将 dispatch 与 commit 调用的 this 绑定为 store 对象本身，否则在组件内部 this.dispatch 时的 this 会指向组件的 vm
    const store = this
    const { dispatch, commit } = this
    // 为 dispatch 与 commit 绑定 this (Store实例本身)
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    // 严格模式(使 Vuex store 进入严格模式，此时任何 mutation 处理函数以外修改 Vuex state 都会抛出错误)
    this.strict = strict

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    // 初始化根 module，同时递归注册了所有子 modle，收集所有 module 的 getter 到 _wrappedGetters 中去
  	// this._modules.root 代表根 module才独有保存的 Module 对象
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    // 通过 vm 重设 store，新建 Vue 对象使用 Vue 内部的响应式实现注册 state 及 computed
    resetStoreVM(this, state)

    // apply plugins
    // 调用插件
    plugins.forEach(plugin => plugin(this))

    // devtool 插件
    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }
```

```js
// 2、Store-installModule
//  初始化 module
function installModule (store, rootState, path, module, hot) {
  //  是否是根 module 
  const isRoot = !path.length
  //  获取 module 的 namespace 
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  //  若有 namespace 则在 _modulesNamespaceMap 中注册 
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    //  获取父级的 state 
    const parentState = getNestedState(rootState, path.slice(0, -1))
    //  module 的 name 
    const moduleName = path[path.length - 1]
    store.`_withCommit`(() => {
      //  将子 module 设置称响应式的 
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  //  遍历注册 mutation 
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  //  遍历注册 action 
  module.forEachAction((action, key) => {
    const namespacedType = namespace + key
    registerAction(store, namespacedType, action, local)
  })

  //  遍历注册 getter 
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  //  递归安装 mudule 
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

```js
// 3、Store-resetStoreVM-Core
// 通过 vm 重设 store，新建 Vue 对象使用 Vue 内部的响应式实现注册 state 及 computed 
function resetStoreVM (store, state, hot) {
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

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  //  Vue.config.silent 暂时设置为 true，原因是 new 一个 Vue 实例过程中不会报出一切警告 
  Vue.config.silent = true
  // 关键: Vuex 采用了 new 一个 Vue 对象来实现数据的"响应式化"，运用 Vue 内部提供的数据双向绑定功能来实现 store 的数据与视图的同步更新
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
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
  
// 上述两步完成后，即可通过 this.$store.getter.test 访问 vm 中的 test 属性
```

```js
// 4、Commit-mutation
// 调用 mutation 的 commit 方法
commit (_type, _payload, _options) {
  // check object-style commit
  // 校验参数
  const {
    type,
    payload,
    options
  } = unifyObjectStyle(_type, _payload, _options)

  const mutation = { type, payload }
  // 取出 type 对应的 mutation 方法
  const entry = this._mutations[type]
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] unknown mutation type: ${type}`)
    }
    return
  }
  // 执行 mutation 中所有方法
  this._withCommit(() => {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })
  // 通知所有订阅者
  this._subscribers.forEach(sub => sub(mutation, this.state))

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      `[vuex] mutation type: ${type}. Silent option has been removed. ` +
      'Use the filter functionality in the vue-devtools'
    )
  }
}
// commit 方法会根据 type 找到并调用 _mutations 中的所有 type 对应的 mutation 方法
// 当没有 namespace 时，commit 方法会触发所有 module 中的 mutation 方法, 再执行完所有的 mutation 后会执行 _subscribers 中的所有订阅者


// Store 向外部提供了一个 subscribe 方法
// 用以注册一个订阅函数，会 push 到 Store 实例的 _subscribers 中，同时返回一个从 _subscribers 中注销该订阅者的方法。
// 注册一个订阅函数，返回取消订阅的函数
subscribe (fn) {
  const subs = this._subscribers
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}

// commit 结束后会调用 _subscribers 中的订阅者，此订阅者模式提供给外部一监视 state 变化的可能 state 通过 mutation 改变时，可有效补获变化
```

```js
// 5、Dispatch-action
// 调用 action 的 dispatch 方法
dispatch (_type, _payload) {
  // check object-style dispatch
  const {
    type,
    payload
  } = unifyObjectStyle(_type, _payload)

  // actions 中取出 type 对应的 ation
  const entry = this._actions[type]
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] unknown action type: ${type}`)
    }
    return
  }

  // 若是数组则包装 Promise 形成一个新 Promise，只有一个则直接返回第0个
  return entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload)
}


// 遍历注册 action
function registerAction (store, type, handler, local) {
  // 取出 type 对应的 action
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    // 判断是否是 Promise
    if (!isPromise(res)) {
      // 不是 Promise 对象则转化 Promise 对象
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      // 存在 devtool 插件时触发 vuex 的 error 给 devtool
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

// 因 registerAction 时将 push 进 _actions 的 action 进行了一层封装（wrappedActionHandler）
// 所以在进行 dispatch 的第一个参数中获取 state、commit 等方法
// 之后，执行结果 res 会被进行判断是否是 Promise，不是则会进行一层封装，将其转化成 Promise 对象, 
// dispatch 时则从 _actions 中取出，只有一个的时候直接返回，否则用 Promise.all 处理再返回；
```

```js
// 6、watch
// 观察一个 getter 方法
// _watcherVM 是一 Vue 实例，所以 watch 就可直接采用 Vue 内部的 watch 特性提供了一种观察数据 getter 变动的方法
watch (getter, cb, options) {
  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', `store.watch only accepts a function.`)
  }
  return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
}
```

```js
// 7、un/registerModule
// registerModule 用以注册一个动态模块，也即在 store 创建后再注册模块的时候用该接口
// 注册一个动态 module，当业务进行异步加载的时候，可通过该接口进行注册动态 module
registerModule (path, rawModule) {
  // 转化称 Array
  if (typeof path === 'string') path = [path]

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), `module path must be a string or an Array.`)
    assert(path.length > 0, 'cannot register the root module by using registerModule.')
  }

  // 注册
  this._modules.register(path, rawModule)
  // 初始化 module
  installModule(this, this.state, path, this._modules.get(path))
  // reset store to update getters...
  // 通过 vm 重设 store，新建 Vue 对象使用 Vue 内部的响应式实现注册 state 及 computed
  resetStoreVM(this, this.state)
}

//  注销一个动态 module
// 动态注销模块, 通过先从 state 中删除模块，然后用 resetStore 来重制 store
unregisterModule (path) {
  // 转化称 Array
  if (typeof path === 'string') path = [path]

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), `module path must be a string or an Array.`)
  }

  // 注销
  this._modules.unregister(path)
  this._withCommit(() => {
    // 获取父级的 state
    const parentState = getNestedState(this.state, path.slice(0, -1))
    // 从父级中删除
    Vue.delete(parentState, path[path.length - 1])
  })
  // 重制 store
  resetStore(this)
}
```

```js
// 8、ResetStore—重制 store
// 将 store 中的 _actions 等进行初始化以后，重新执行 installModule 与 resetStoreVM 来初始化 module 及用 Vue 特性使其"响应式化"
function resetStore (store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state, hot)
}
```

