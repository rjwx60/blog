# 一、Computed



**<u>*首先*</u>**，在调用 Vue 创建实例过程中，会处理各种选项(初始化)，其中包括处理 computed(initComputed)；每个 computed 都创建一个 watcher，用来存储计算值，判断是否需要重新计算；initComputed 作用：

- 为每个 computed 配发 watcher；
- defineComputed 处理；
- 收集所有 computed 的 watcher；

```js
function initComputed(vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    // 1、为每个 computed 都创建一个 watcher
    // watcher 用来存储计算值，判断是否需要重新计算
    watchers[key] = new Watcher(vm, getter, { lazy: true });
    // 判断是否有重名的属性
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}

// Watcher
// 总结: computed 即带有标志位的 watcher
function Watcher(vm, expOrFn, options) {   
  	// dirty 默认为 false 的，而 lazy 赋给 dirty 只相当于一个开启的作用(或初始化)，使其延后执行
    this.dirty = this.lazy = options.lazy;  
  	// 保存设置的 getter
    this.getter = expOrFn;   
  	// watcher.value 存放计算结果，但因受 lazy 条件的控制，不会新建实例并马上读取值，最初为 undefined
  	// 只有再读取 computed 时，才开始计算，而不是初始化就开始计算值，通过 watcher.get 计算 value 
    this.value = this.lazy ? undefined: this.get();
};

Watcher.prototype.get = function() {    
    // getter 就是 watcher 回调
    var value = this.getter.call(vm, vm);    
    return value
};


// defineComputed
// 总结: 使用 createComputedGetter 包装 get 函数
function defineComputed( target, key, userDef) {    
    // 设置 set 为默认值，避免 computed 并没有设置 set
  	// 1、set 函数默认是空函数，如果用户设置，则使用用户设置
    var set = function(){}      
    //  如果用户设置了set，就使用用户的set
    if (userDef.set) set = userDef.set   

  	// 2、使用 Object.defineProperty 在实例上 computed 属性，所以可以直接访问
    Object.defineProperty(target, key, {        
        // 3、使用 createComputedGetter 包装 get 函数，主要用于判断计算缓存结果是否有效
        get:createComputedGetter(key),        
        set:set
    });
}


// createComputedGetter
function createComputedGetter(key) {    
    return function() {        
        // 获取到相应 key 的 computed-watcher
        // 总结：即当 data 变化时，获取相应的 watcher，若 _computedWatchers 中包含所依赖的数据的 watcher，则返回 watcher；
        var watcher = this._computedWatchers[key];        
        // 若 computed 依赖的数据变化，dirty 会变成 true，从而重新计算，然后更新缓存值 watcher.value
      	// 总结: 
      	// 首先，watcher 初始化时，dirty 为默认值 true，遂进行首次执行；
 				// 然后，data 发生变化时，触发 watcher.prototype.update, 设置标志为 true；
      	// (data 会有一个 watcher 数组，其中有 computed类的 watcher，也有 watch类的watcher);
      	// 注意: 关键在于控制 watcher.dirty，这是执行的关键，首先要明白: computed 数据A 引用了 data 数据B，即 A 依赖 B，所以 B 会收集到 A 的 watcher，而当 B 改变时，会通知 A 进行更新，即调用 A-watcher.update, 而 update 中开启了 dirty，从而读取 comptued 时，会调用 evalute 重新计算
        if (watcher.dirty) {
            watcher.evaluate();
        }        
        // data 与 computed 双向绑定
      	// 总结: 之所以 data 能通知 computed 的 watcher，是因为初始化时就进行了双方关系绑定，绑定通过 watcher.depend 实现
      	// 即让 data 依赖收集器收集当前 watcher(computed_watcher)
      	// 举例说即: 页面-P、computed-C、data-D
      	// 1、P 引用了 C，C 引用了 D
				// 2、理论上 D 改变时，C 就会改变，C 则通知 P 更新
				// 3、实际上 C 让 D 和 P 建立联系，让 D 改变时直接通知 P
				// 而绑定的关键即下方代码 depend
        if (Dep.target) {
            watcher.depend();
        }        
        return watcher.value
    }
}

// evaluate
Watcher.prototype.evaluate = function() {    
    this.value = this.get();    
    // 执行完更新函数之后，立即重置标志位
    this.dirty = false;
};


// update 
Watcher.prototype.update = function() {    
    if (this.lazy)  this.dirty = true;
  	// ...
};


// depend
Watcher.prototype.depend = function() {    
    var i = this.deps.length;    
    while (i--) {        
        // this.deps[i].depend();
      	// Dep.target 即页面 watcher
        dep.addSub(Dep.target)
    }
};


Watcher.prototype.get = function() {    
    // 改变 Dep.target
    pushTarget()    
    // getter 就是 watcher 回调
    var value = this.getter.call(this.vm, this.vm);    
    // 恢复前一个 watcher
    popTarget()    
    return value
};
Dep.target = null;
var targetStack = [];
function pushTarget(_target) {    
    // 把上一个 Dep.target 缓存起来，便于后面恢复
    if (Dep.target) {
        targetStack.push(Dep.target);
    }
    Dep.target = _target;
}
function popTarget() {
    Dep.target = targetStack.pop();
}
// 1、页面 watcher.getter 保存 页面更新函数，computed watcher.getter 保存 计算 getter
// 2、watcher.get 用于执行 watcher.getter 并 设置 Dep.target
// 3、Dep.target 会有缓存
```





# 二、Watch

# 三、Methods