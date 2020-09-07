---
typora-root-url: ../../../BlogImgsBed/Source
---



### 七、Webpack 工作原理

传统问题：

- 问题1：各个脚本间存在隐式依赖关系，若某一依赖项丢失/顺序错误，程序则无法正常运行；
- 问题2：若依赖项被包含但并无使用，浪费资源，打包体积变大；
- 问题3：无法判断 CSS or Js 作用域；
- 问题4：优化资源分发机制却又担心会破坏掉某些东西；
- 问题5：ES6 module 浏览器不完全支持，JSX语法转移、CSS前缀补全/预处理、压缩混淆、图片等文件压缩需求

解决方案：

- Gulp 虽可处理多个文件，但为顾及所有情况，需开发者手动检查确保无遗漏；
- Webpack 相比于 gulp，通过 JS 管理依赖 & 加载顺序，只会打包实际生产环境中使用的部分，使管理层面的JS百分百有效；



#### 7-1、构建原理

##### 7-1-1、基础概念

##### 7-1-1-1、核心概念

- **<u>*Entry*</u>**：入口文件，Webpack 会从该文件开始进行分析与编译；

- **<u>*Output*</u>**：出口路径，打包后创建 bundler 的文件路径以及文件名；

- **<u>*Module*</u>**：模块，Webpack 中一切皆模块，一模块对应一文件；从配置 Entry 开始递归找出所有依赖模块，并根据配置的 Loader 进行加载和打包；

- **<u>*Loader*</u>**：模块转换器，用于把模块原内容按照需求，转成可供 WebPack 处理的内容(Webpack仅能处理 Js 文件)

- **<u>*Plugin*</u>** - 扩展插件，可通过 Webpack 相应的事件钩子，介入到打包过程中的任意环节，从而对代码按需修改

- **<u>*Chunk*</u>**：代码块，由多个模块组合而成，用于代码合并与分割，以便按需加载，提高性能

  

##### 7-1-1-2、核心基本

- ***<u>webpack</u>*** 处理如同生产线，经过系列处理流程后，将源文件转换成输出结果，其通过 **<u>*Tapable*</u>** 来组织这条复杂的生产线；每一流程职责单一，但多个流程之间有存在依赖关系，当且仅当当前处理完成后，才交给下一个流程处理；
  - **<u>*tapable*</u>** 原理实际就是 EventEmit，通过发布者-订阅者模式实现，部分核心代码可概括如下；
  - webpack4 重写了事件流机制，但实际使用中只需记住几个重要事件即可，[详看](https://juejin.im/post/5abf33f16fb9a028e46ec352)
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001239.png" style="zoom:50%;" align="left"/>

- **<u>*plugin*</u>** 就像是一个插入到生产线中的一个功能，在特定的时机，对生产线上的资源做处理，*webpack* 在运行过程中会广播 **<u>*event*</u>**，*plugin* 只需要监听它所关心的事件，就能加入到这条生产线中，然后去改变生产线的运作，*Webpack* 的事件流机制保证了插件的有序性，使得整个系统扩展性很好；

- ***<u>event</u>*** 构建过程中的一系列事件，分别表示着不同的构建周期和状态，可像在浏览器上监听 click 事件一样监听事件流上的事件，并为它们挂载事件回调；亦可自定义事件，并在合适时机进行广播，当然这也是使用上述提到的， webpack 自带模块 Tapable 进行管理；
- webpack 处理的几个主要对象，、[详看2](https://github.com/slashhuang/blog/issues/1)
  - **<u>compiler</u>**：每个 webpack 构建任务对应一个 compiler 实例，互相之间独立，其执行方式是 async.map，其将处理如下流程:
    - 结合用户和默认配置初始化 option；
    - 先加载 option 中定义的插件，再加载内建插件；
    - emit 过程，负责输出文件；
  - **<u>compilation</u>**：webpack 编译任务的真正执行者，自身会处理如下流程：
    - addEntry：调用方法将 entry 转化为 Dependency 并转化为 module；
    - seal：实现 modules ==> chunks ==> assets， 过程中会调度 plugin 执行优化，包括给出 hash；
  - **<u>parse</u>**：解析 JS 文件，并遍历、自身会这么做:
    - 调用 acorn 生成 AST；
    - 遍历 ast，其中每个语句都会触发插件，例如 parse.applyPluginBailResult('call commonjs:require:xxx', xxx, xx)；
    - 就连 require 函数添加依赖的功能也是插件完成的；
    - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001240.png" style="zoom:20%;" align="left"/>
  - **<u>resolver</u>**
    - 用于将路径转化为绝对路径，有 normalResolver、contextResolver、loaderResolver 三种；
    - contextResolver 用于解析 contextModule(形如require('a/' + b + '/c')这种)



##### 7-1-1-3、Tapbale

webpack 本质是一种事件流机制，工作流程是：将各个插件串联并处理，而实现这一切的核心就是 [Tapable](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Ftapable)；

- 比如：Tapable 实例：核心、负责编译的 `Compiler`；
- 比如：Tapable 实例：负责创建 `bundles` 的 `Compilation`；



##### 7-1-1-3-1、Tapable 1.0-

[Tapable 1.0-](https://segmentfault.com/a/1190000008060440：)，如同 Node 中 `EventEmitter`，提供对事件的注册和触发，提供以下等功能/接口：

- 供外部注册插件：`plugin(name:string, handler:function)`

- 供外部注册事件：`apply(…pluginInstances：(AnyPlugin|function)[])` (解释1中提及的 apply就是这个)

- 控制事件触发的：`applyPlugins*(name:string, …)`，包括 `applyPluginsAsync、applyPluginsParallel` 等方法实现对事件触发的控制，比如：

- - 多个事件连续顺序执行、并行执行、异步执行
  - 一个接一个地执行插件，前面的输出是后一个插件的输入的瀑布流执行顺序 
  - 在允许时停止执行插件，即某个插件返回 `undefined` ，即退出执行；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001241.png" style="zoom:50%;" align="left"/>



##### 7-1-1-3-2、Tapable 1.0+

Tapable 1.0+ 版本发生巨变：

- 1.0- 中通过 plugin 注册插件、apply 注册事件、applyPlugins* 触发事件；

- 1.0+ 中通过 暴露很多事件钩子，可用于为插件创建钩子函数：

- ```js
  const {
  	SyncHook,
  	SyncBailHook,
  	SyncWaterfallHook,
  	SyncLoopHook,
  	AsyncParallelHook,
  	AsyncParallelBailHook,
  	AsyncSeriesHook,
  	AsyncSeriesBailHook,
  	AsyncSeriesWaterfallHook
   } = require("tapable");
  ```

- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001242.png" style="zoom:40%;" align="left" />

- 插件注册数量
- 插件注册的类型(sync, async, promise)
- 调用的方式(sync, async, promise)
- 实例钩子的时候参数数量
- 是否使用了interception



##### 7-1-1-3-2-1、Tapable 使用方法

- 首先，new Hook 新建钩子

  - tapable 暴露出的都是类方法，new 一个类方法获得所需钩子；

  - class 接受数组参数 options，非必传，类方法会根据传参，接受同样数量的参数；

  - ```js
    const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);
    ```

- 然后，使用 `tap/tapAsync/tapPromise` 绑定钩子

  - tabpack 提供了 `同步` & `异步` 绑定钩子的方法，且它们均有 `绑定事件` 和 `执行事件` 对应的方法；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001243.png" style="zoom:60%;" align="left" />

- 然后，`call/callAsync` 执行绑定事件

- 最后，如下所示：

  - ```js
    const hook1 = new SyncHook(["arg1", "arg2", "arg3"]);
    
    // 绑定事件到 webapck 事件流
    hook1.tap('hook1', (arg1, arg2, arg3) => console.log(arg1, arg2, arg3)) // 1,2,3
    
    // 执行绑定的事件
    hook1.call(1,2,3)
    ```

  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001244.png" style="zoom:60%;" align="left" />

**<u>Tapable 具体使用示例：</u>**

定义 Car 方法，内部 hooks 上新建钩子，分别是下述钩子，并使用钩子对应的 `绑定和执行方法`，`calculateRoutes` 使用 `tapPromise` 可返回一`promise`对象

- 同步钩子：`accelerate`、break (accelerate接受一个参数)
- 异步钩子：`calculateRoutes`；

```js
// 1、引入 tapable
const {
    SyncHook,
    AsyncParallelHook
} = require('tapable');

// 创建类
class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(["newSpeed"]),
            break: new SyncHook(),
            calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
        };
    }
}
const myCar = new Car();

// 2、绑定同步钩子 SyncHook.tap
myCar.hooks.break.tap("WarningLampPlugin", () => console.log('WarningLampPlugin'));

// 2、绑定同步钩子 并传参 SyncHook.tap
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));

// 2、绑定一个异步 Promise 钩子 AsyncParallelHook.tapPromise
myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, routesList, callback) => {
    // return a promise
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log(`tapPromise to ${source}${target}${routesList}`)
            resolve();
        },1000)
    })
});

// 执行同步钩子
myCar.hooks.break.call();
myCar.hooks.accelerate.call('hello');
console.time('cost');

// 执行异步钩子
myCar.hooks.calculateRoutes.promise('i', 'love', 'tapable').then(() => {
    console.timeEnd('cost');
}, err => {
    console.error(err);
    console.timeEnd('cost');
})
```

```shell
WarningLampPlugin
Accelerating to hello
tapPromise to ilovetapable
cost: 1003.898ms
```

```js
// calculateRoutes 也可使用 tapAsync 绑定钩子，注意：此时用 callback 结束异步回调 AsyncParallelHook.tapAsync
myCar.hooks.calculateRoutes.tapAsync("calculateRoutes tapAsync", (source, target, routesList, callback) => {
    // return a promise
    setTimeout(() => {
        console.log(`tapAsync to ${source}${target}${routesList}`)
        callback();
    }, 2000)
});

// AsyncParallelHook.callAsync
myCar.hooks.calculateRoutes.callAsync('i', 'like', 'tapable', err => {
    console.timeEnd('cost');
    if(err) console.log(err)
})
```

```shell
WarningLampPlugin
Accelerating to hello
tapAsync to iliketapable
cost: 2007.850ms
```



**<u>Tapable 于 webpack/webpack 插件关联：</u>**

将上述示例文件分拆为两份：Compiler.js、Myplugin.js

**<u>1、Compiler.js</u>**

- 将 Class Car 类名改成 webpack 的核心 `Compiler`
- 接受 options 里传入的 plugins
- 将 Compiler 作为参数传给 plugin
- 执行 run 函数，在编译的每个阶段，都触发执行相对应的钩子函数；

**<u>2、MyPlugin.js</u>**

- 引入Compiler
- 定义一个自己的插件；
- apply 方法接受 compiler 参数；
  - webpack 插件是一具有 `apply` 方法的 JS 对象；
  - apply 属性会被 webpack compiler 调用，且 compiler 对象可在整个编译生命周期访问；
- 给 compiler 上的钩子绑定方法；
- 仿照 webpack 规则，向 plugins  属性传入 new 实例；

**<u>3、总结</u>**

Compiler 的每个阶段，出发 tapable 相关钩子，plugin  "tap" 到后执行相关操作

```js
// Compiler
const {
    SyncHook,
    AsyncParallelHook
} = require('tapable');

class Compiler {
    constructor(options) {
        this.hooks = {
            accelerate: new SyncHook(["newSpeed"]),
            break: new SyncHook(),
            calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
        };
        let plugins = options.plugins;
        if (plugins && plugins.length > 0) {
            plugins.forEach(plugin => plugin.apply(this));
        }
    }
    run(){
        console.time('cost');
        this.accelerate('hello')
        this.break()
        this.calculateRoutes('i', 'like', 'tapable')
    }
    accelerate(param){
        this.hooks.accelerate.call(param);
    }
    break(){
        this.hooks.break.call();
    }
    calculateRoutes(){
        const args = Array.from(arguments)
        this.hooks.calculateRoutes.callAsync(...args, err => {
            console.timeEnd('cost');
            if (err) console.log(err)
        });
    }
}

module.exports = Compiler
```

```js
// Plugin.js
const Compiler = require('./Compiler')

class MyPlugin{
    constructor() {
    }
  	// 接受 compiler 参数
    apply(conpiler){
      	// 给 compiler 上的钩子绑定方法
        conpiler.hooks.break.tap("WarningLampPlugin", () => console.log('WarningLampPlugin'));
        conpiler.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
        conpiler.hooks.calculateRoutes.tapAsync("calculateRoutes tapAsync", (source, target, routesList, callback) => {
            setTimeout(() => {
                console.log(`tapAsync to ${source}${target}${routesList}`)
                callback();
            }, 2000)
        });
    }
}



// 此处模拟于 webpack.config.js 的 plugins 配置
// 向 plugins 属性传入 new 实例
const myPlugin = new MyPlugin();

const options = {
    plugins: [myPlugin]
}
let compiler = new Compiler(options)
compiler.run()
```

```shell
Accelerating to hello
WarningLampPlugin
tapAsync to iliketapable
cost: 2015.866ms
```



**<u>Tapable 其他方法，可根据自己的开发需求，选择适合的同步/异步钩子</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001245.png" style="zoom:50%;" align="left"/>





##### 7-1-1-3-2-2、Tapable 源码分析

Tapable 1.0+ [实现分析](https://juejin.im/post/5aa3d2056fb9a028c36868aa#heading-2)，而由下图知：

- 钩子均继承于 Hook；

- 钩子注册方法：

- - Sync* 类型钩子、注册插件顺序执行：

  - - 只能使用 tap 注册，不能使用 tapPromise / tapAsync 注册；

  - Async* 类型钩子、注册插件异步执行：

  - - 支持 tap、tapPromise、tapAsync 注册

- 钩子调用方法：

- - 通过调用 call、callAsync 、promise 方式调用：
  - 调用方式不同原因：为了按照一定的执行策略执行、调用 compile 方法快速编译出一个方法来执行这些插件；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001246.png" style="zoom:50%;" align="left"/>

- 追根溯源1：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001247.png" style="zoom:50%;" align="left"/>

- 追根溯源2：上图中，用以继承的 Hook 类：用以添加勾子；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001248.png" style="zoom:50%;" align="left"/>

- 追根溯源3：
- 上图中，`factory` 是类 `Sync*CodeFactory` 的实例，而此类继承自 `HookCodeFactory` (下图填写 `class Sync*CodeFactory` 报错，故用 X 替代 *)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001249.png" style="zoom:50%;" align="left"/>

- 追根溯源4：
  - 其中 `callTapsSeries` 用于将插件列表中插件按照注册顺序遍历执行，编译生成最终执行插件的函数；
  - 其中 `create` 中调用到 `content` 方法，将按照此钩子的执行策略，调用不同的方法来执行编译 生成最终的代码；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001250.png" style="zoom:50%;" align="left"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001251.png" style="zoom:50%;" align="left"/>

- 数个勾子依赖于 `HookCodeFactory` 的实现，尤其是 `content & callTapsSeries`：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001252.png" style="zoom:50%;" align="left"/>







##### 7-1-2、构建流程A

- **初始：启动、构建、读取、合并配置参数，加载 Plugin，实例化 Compiler；**
- **编译：Entry 出发，由 Module 寻找依赖 Module，直至完全，此时会串行调用对应 Loader 转译内容为可处理文件，进行编译处理；**
- **输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统**
- **假若：开启监听模式，则流程如下：**
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001253.png" style="zoom:50%;" align="left"/>



##### 7-1-3、构建流程B

分为三个阶段：初始、编译、输出；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001254.png" style="zoom:50%;" align="left"/>

##### 7-1-3-1、初始阶段

- 初始化参数： 从配置文件 & Shell 语句中， 读取与合并参数，得出最终参数 、执行配置文件中的插件实例化语句 new Plugin()
- 开始编译前： 使用前述参数，**<u>*实例化 Compiler 对象 ，加载所有配置插件*</u>**；

  - 补充：Compiler 对象：负责文件监听 & 启动编译 ，其实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例；
  - 补充：加载配置插件：依次调用插件的 apply 方法，让插件可监听后续所有事件节点，同时为插件传入 compiler 实例引用 ，以方便其通过实例，调用 Webpack 提供的 API；
  - 事件 - environment：开始应用 Node.js 风格文件系统到 compiler 对象，以方便后续的文件寻找和读取；
  - 事件 - entry-option：读取配置 Entrys，为每个 Entry 实例化一对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备；
  - 事件 - after-plugins：调用完所有内置的和配置的插件的 apply 方法；
  - 事件 - after-resolvers：根据配置初始化完 resolver，resolver 负责在文件系统中寻找指定路径的文件；

##### 7-1-3-2、编译阶段

- 开始编译 ： 执行 Compiler 对象 run 方法，开始执行编译；

- 确定入口： 从配置文件中的 entry，找出所有入口文件；
- 编译文件： **<u>*根据入口文件文件类型 & 配置 Loader，对文件进行编译，编译完后，再找出该文件依赖的文件，递归编译和解析直至所有依赖完成本步骤*</u>**；
- 完成编译： **<u>*经过上述步骤，使用 Loader 翻译完所有模块，得到每个模块被翻译后的最终内容，及之间的依赖关系*</u>**；

  - run & watch-run：均为启动编译，区别在于后者为监听模式下，启动的编译，其可判断哪些文件发生变化，来重新启动一次新的编译；
  - 事件 - compile：发生在确定入口前，通知插件即将编译，传入 compiler 对象 (奇怪，初始化就已经传入了吧)；

  - 事件 - compilation：每检测到文件变化，新 Compilation 对象将被创建(含当前模块资源、编译生成资源、变化文件等，并提供事件回调供插件扩展) ；

  - 事件 - make： 上述的 Compilation 创建完毕，执行上述“编译文件”步骤：

    - 根据入口文件的文件类型 & 配置的 Loader，对文件进行编译，编译完后，再找出该文件依赖的文件，递归编译和解析直至所有依赖完成本步骤；
      - 事件 - build-module：使用对应的 Loader 去转换一个模块；
      - 事件 - normal-module-loader：前述转换完后，使用 acorn 解析转换后的内容，输出对应AST，以方便 Webpack 后面对代码的分析；
      - 事件 - program：从配置入口模块开始，分析其 AST，当遇到 require 等导入语句时，便将其加入依赖模块列表，并对新找出依赖模块递归分析，直至理清所有模块依赖关系；
      - 事件 - seal：所有模块及其依赖的模块，均通过 Loader 转换完成后，根据依赖关系开始生成 Chunk；

  - 事件 - after-compile：一次 Compilation 执行完成；

  - 事件 - invalid：文件不存在或编译错误等异常时触发，但不会导致 Webpack 退出；

##### 7-1-3-3、输出阶段

- 输出资源： **<u>*根据入口 & 模块间的依赖关系，组装成数个包含多个模块的 Chunk，再将每个 Chunk 根据其对应类型，使用对应模板，转换成单独文件，并加入输出列表 (可修改的最后机会)*</u>**；
- 输出完成： **<u>*根据插件，确定输出内容，根据配置文件，确定输出路径 & 文件名，将内容写入文件系统*</u>**；

  - 事件 - should-emit：所有需输出文件已生成好，询问插件确定输出的文件；
  - 事件 - emit：确定输出文件后，执行文件输出，可在此获取和修改输出内容；
  - 事件 - after-emit：文件输出完毕；
  - 事件 - done：成功完成一次完成编译 & 输出流程；
  - 事件 -failed ：若编译 & 输出流程中，遇到异常导致 Webpack 退出时，就会直接跳转到本步骤，插件可在本事件中获取到具体的错误原因；



##### 7-1-3-4、其他补充

- 优先使用目录中的 moment.js，然后才是模块；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001255.png" style="zoom:50%;" align="left"/>







##### 7-1-4、构建流程C

初始化配置参数 -> 绑定事件钩子回调 -> 确定 Entry 逐一遍历 -> 使用 loader 编译文件 -> 输出文件；

- 首先，读取你在命令行传入的配置，及项目里的 `webpack.config.js` 文件，初始化本次构建的配置参数，并且执行配置文件中的插件实例化语句；
  - 生成 `Compiler` 传入 `plugin` 的 `apply` 方法，为 `webpack` 事件流挂上自定义钩子；
- 然后，`entryOption` 阶段，`webpack` 开始读取配置 `Entries`，递归遍历所有的入口文件；
- 然后，`compilation` 过程，依次进入其中每一个入口文件(`entry`)，使用用户配置好的 `loader` 对文件内容进行编译(`buildModule`)
  - 此阶段，可从传入事件回调的 `compilation` 上拿到 `module` 的 `resource`(资源路径)、`loaders`(经过的 `loaders`)等信息；
- 然后，再将编译好的文件内容使用 `acorn` 解析生成  AST 静态语法树(`normalModuleLoader`)，分析文件依赖关系，并逐个拉取依赖模块并重复上述过程；
- 然后，将所有模块中的 `require` 语法替换成 `__webpack_require__` 来模拟模块化操作；
  - 注意：`__webpack_require__` 函数，可在浏览器中执行的加载函数；
    - 作用：用以模拟 Node 中的 require 语句，做了缓存优化，不会二次执行加载；
    - 因为：浏览器无法像 Node 快速加载多个模块文件，而须通过网络请求异步加载文件；
    - 所以：原多个独立模块文件，被合并到一单独 bundle.js 文件，且模块数量很多加载时间会越长，将所有模块都存放在数组中，便于执行一次网络加载；
    - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001256.png" style="zoom:50%;" align="left"/>
- 最后，`emit` 阶段，所有文件的编译及转化都已经完成，包含了最终输出的资源；
  - 此阶段可在传入事件回调的 `compilation.assets` 上拿到所需数据，其中包括即将输出的资源、代码块 `Chunk` 等信息；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001257.png" style="zoom:60%;" align="left"/>



##### 7-1-4-1、输出结果分析

[输出结果分析(大段代码-很好)](https://juejin.im/post/5badd0c5e51d450e4437f07a#heading-6)，webpack 在浏览器实现模块化的本质：将所有的代码都注入到同一个JS文件中；

观察上述链接的输出结果：webpack 最后生成的也不过只是一个 IIFE，而引入的所有模块，都被一个 `function` 包裹组装成对象，此对象作为 IIFE 的实参被传递进去；若配置 `splitChunk`，IIFE 的形参也变成摆设，所有模块都被放在了一个名为 `webpackJsonp` 的全局数组上，并通过 IIFE 里的 `webpackJsonpCallback` 来处理数据；



##### 7-1-4-2、构建流程小结

整个构建过程主要花费时间的部分也就是递归遍历各个 entry 然后寻找依赖逐个编译的过程；

每次递归都需要经历 **String->AST->String** 的流程、经过 loader 还需要处理一些字符串或者执行一些JS脚本；介于node.js单线程的壁垒，webpack构建慢一直成为它饱受诟病的原因，而为提示编译速度，可通过 happypack 打破 node.js 单线程的壁垒，其利用了node 原生的 cluster 模块去开辟多进程执行构建，但此多进程构建已被集成在 webpack4 本身上，还利用了增量编译，大幅度提升构建效率；

```js
// @file：webpack.config.js
const HappyPack = require('happypack');
const os = require('os');
// 开辟一个线程池
// 拿到系统 CPU 的最大核数，让 happypack 将编译工作灌满所有 CPU 核
const happyThreadPool = HappyPack.ThreadPool({ size：os.cpus().length });

module.exports = {
  // ...
  plugins：[
    // 使用
    new HappyPack({
      id：'js',
      threadPool：happyThreadPool,
      loaders：[ 'babel-loader' ]
    }),

    new HappyPack({
      id：'styles',
      threadPool：happyThreadPool,
      loaders：[ 'style-loader', 'css-loader', 'less-loader' ]
    })
  ]
};
```



##### 7-1-5、构建流程D

Webpack 可认为是一种基于事件流的编程范例，内部的工作流程都是基于插件机制串接，而串接的实现是通过 webpack 自身实现的基础类 [Tapable](https://github.com/webpack/tapable/blob/master/lib/Tapable.js)

plugin 方法根据此类来向外暴露、而核心对象 Compiler、Compilation 等均继承于该对象；[Tapable 相关方法](https://segmentfault.com/a/1190000008060440#articleHeader1)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001258.png" style="zoom:60%;" align="left"/>

- entry-option：初始化 options；
- run：开始编译；
- make：从 entry 开始递归的分析依赖，对每个依赖模块进行 build；
- before-resolve - after-resolve： 对其中一个模块位置进行解析；
- build-module ：使用文件对应的 loader 加载，开始构建 module；
- normal-module-loader：对用 loader 加载完成的 module 进行编译，用 [acorn](https://github.com/ternjs/acorn) 编译，生成 AST；
- program： 遍历 AST，当遇到 require 等调用表达式时，触发 call、require 事件的 handler 并执行，以收集依赖；
  - 比如：AMDRequireDependenciesBlockParserPlugin；
- seal： 所有依赖 build 完成，对 chunk 进行优化，比如合并、抽取公共模块、hash、混淆；
- optimize-chunk-assets：压缩代码，UglifyJsPlugin；
- bootstrap： 生成启动代码；
- emit： 将各个 chunk 输出到结果文件；



##### 7-1-6、构建流程E

在浏览器调试 webpack：

实现：安装 `node-nightly`、配合 `RemoteDebug`；[文1](https://www.webpackjs.com/contribute/debugging/)、[文2](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)

首先，安装：`sudo npm i node-nightly -g`、`sudo node-nightly`

然后，设置 webpack mode：`sudo node-nightly --inspect-brk ./node_modules/webpack/lib/webpack.js`；[文](https://webpack.js.org/configuration/mode/)

问题：remote debug 不显示内容，[解决1](https://superuser.com/questions/1418163/chrome-devtools-target-discovery-does-not-work-anymore-with-node)、[解决2](https://github.com/nodejs/node/issues/26887)



##### 7-1-6-1、入口

- 在函数中引入：入口 -> lib/webpack.js；
- 在 shell 中执行：入口 -> ./bin/webpack.js；

##### 7-1-6-2、主体

webpack：./webpack/lib/webpack.js

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001259.png" style="zoom:60%;" align="left"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001300.png" style="zoom:60%;" align="left"/>

其中 `WebpackOptionsApply` 会注册大量内部插件(图中第3个箭头)，诸如：**<u>*EntryOptionPlugin*</u>** (用以处理 entry)、`LoaderPlugin` 等；

随后调用 `compiler.run` 方法，启动编译，随后在不同生命周期，调用对应插件的回调，诸如下列生命周期/钩子调用顺序 [文](https://juejin.im/post/5aa3d2056fb9a028c36868aa#heading-7)：

- before-run 清除缓存
- run 注册缓存数据钩子
- before-compile
- compile 开始编译
  - this-compilation
  - compilation 进行一些代码编译的准备工作
- make 从入口分析依赖以及间接依赖模块，创建模块对象
- build-module 模块构建
- seal 构建结果封装， 不可再更改
- after-compile 完成构建，缓存数据，根据编译结果 合并出最终生成的文件名 & 文件内容；
- emit 输出到dist目录



##### 7-1-6-3、源码分析

从 entry 出发：从上面提到的 **<u>*EntryOptionPlugin*</u>** 得到的类实现如下：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001301.png" style="zoom:60%;" align="left"/>

根据 entry 参数类型选择相应处理类，以下为其中1个处理方式 SingleEentryPlugin：

观察到此类，分别在编译 & 输出阶段，均注册了勾子函数：

编译阶段 - compilation 时，设置当前 entry 类型信息；

输出阶段 - make 时，则调用 compilation.addEntry 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001302.png" style="zoom:60%;" align="left"/>

compilation 是一个编译对象，会存储编译一个 entry 的所有信息，包括他的依赖，对应的配置等；

compilation.addEntry 会调用 _addModuleChain 方法，其又会调用 buildModule 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001303.png" style="zoom:60%;" align="left"/>

buildModule 中调用 module.build 方法，此法使用的是 NormalModule.js 中的 build 方法；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001304.png" style="zoom:60%;" align="left"/>

build 先调用 doBuild 将模块转为 JS 模块，再利用 parse 编译 Js 为 AST

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001305.png" style="zoom:60%;" align="left"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001306.png" style="zoom:60%;" align="left"/>

parse 调用 acorn 对JS进行语法解析，acorn 就是一个JS的 parser

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001307.png" style="zoom:60%;" align="left"/>

[parse 阶段](https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md)：比如：import 语句，经过 babel-loader 处理后，变为 require，进入 parse 阶段：

- 首先：经过 `walkStatements`、`walkStatement`、`walkVariableDeclaration` 等相应处理函数；
- 然后：进入 `AMDRequireDependenciesBlockParserPlugin.js` 创建依赖，记录对 import 模块的依赖关系；
- 最终：这些依赖会被收集在 `module.dependencies` 中；
- 然后，收集所有依赖后，最终回到 `compiler.js` 中的 `compile` 方法，并调用 `compilation.seal` 将所有依赖模块，通过相应模板 `render` 出一个拼接好的字符串，`compilation.seal` 遍历 `this.chunks` ，生成相应文件内容(单 entry，则 chunk 为对应文件 ，多 entry 则多个 chunks)，而其 `dependencies` 记录了依赖的 `modules`，即 <u>依赖树</u>；
- 最后，将 `chunk` 传给 `MainTemplate` 中的 `render` 插件，以此生成最终的代码，而 `module` 中的 `asset` 字段用于存放最终编译出的文件对应源码；



##### 7-1-6-4、构建流程小结

注意：此乃简化版，详看 [此文]([https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md#%E6%80%BB%E7%BB%93webpack-%E6%B5%81%E7%A8%8B](https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md#总结webpack-流程))

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001308.png" style="zoom:60%;" align="left"/>

根据 `webpack` 配置，注册对应插件；

调用 `compile.run` 启动编译；

- 阶段一：`compilation`：注册不同类型 `module` 对应 `factory` (progress、build 等初始化)
- 阶段二：`make`：`entry` 开始进行两步操作：
  - 一步：调用 `loaders` 对模块原始代码进行编译，转换成标准 JS 代码；
  - 二步：调用 `acorn` 对 JS 代码进行语法分析、收集其中依赖关系、形成依赖树 (每一模块均会记录自身依赖关系)；
- 阶段三：`render`：调用 `compilation.seal`，根据先前收集依赖，决定生成文件数目、文件内容；





##### 7-1-7、构建流程F

##### 7-1-7-1、综合解释F-1

1. 读取配置文件，按命令 **<u>初始化</u>** 配置参数，创建 Compiler 对象；
2. 调用插件的 apply 方法 **<u>挂载插件</u>** 监听，然后从入口文件开始执行编译；
3. 根据文件类型调用相应 Loader，对模块进行 **<u>编译</u>**，并在合适时机触发相应事件，调用 Plugin 执行，最后再根据模块 **<u>依赖查找</u>** 到所依赖模块，递归执行此步
4. 将编译后的所有代码包装成一个个代码块 (Chuck)， 并按依赖和配置确定 **<u>输出内容</u>**。这个步骤，仍然可以通过 Plugin 进行文件的修改;
5. 最后，根据 Output 把文件内容一一写入到指定的文件夹中，完成整个过程；

```js
(function(modules) {
	// 模拟 require 函数，从内存中加载模块；
	function __webpack_require__(moduleId) {
		// 缓存模块
		if (installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		
		var module = installedModules[moduleId] = {
			i：moduleId,
			l：false,
			exports：{}
		};
		
		// 执行代码；
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		
		// Flag：标记是否加载完成；
		module.l = true;
		
		return module.exports;
	}
	
	// ...
	
	// 开始执行加载入口文件；
	return __webpack_require__(__webpack_require__.s = "./src/index.js");
 })({
 	"./src/index.js"：function (module, __webpack_exports__, __webpack_require__) {
		// 使用 eval 执行编译后的代码；
		// 继续递归引用模块内部依赖；
		// 实际情况并不是使用模板字符串，这里是为了代码的可读性；
		eval(`
			__webpack_require__.r(__webpack_exports__);
			//
			var _test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("test", ./src/test.js");
		`);
	},
	"./src/test.js"：function (module, __webpack_exports__, __webpack_require__) {
		// ...
	},
 })
```

- **模块机制**：webpack 自己实现了一套模拟模块的机制，将其包裹于业务代码的外部，从而提供了一套模块机制；
- **文件编译**：webpack 规定了一套编译规则，通过 Loader 和 Plugin，以管道的形式对文件字符串进行处理；





##### 7-1-8、构建流程G

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001309.png" style="zoom:70%;" align="left"/>

##### 7-1-8-1、入口

webpack入口，对应图中：**<u>*webpack.config.js+shell options*</u>**

从配置文件 package.json 和 Shell 语句中读取与合并参数，得出最终的参数；

- 每次在命令行输入 webpack 后，操作系统都会去调用 `./node_modules/.bin/webpack` 这个 shell 脚本；
- 脚本会去调用 `./node_modules/webpack/bin/webpack.js`  并追加输入参数，如 -p , -w ；

##### 7-1-8-2、参数解析

用 yargs 参数解析，对应图中 **<u>*optimist*</u>**；[源码](https://github.com/webpack/webpack-cli/blob/master/bin/cli.js#L210)

```js
// 用 yargs 参数解析
yargs.parse(process.argv.slice(2), (err, argv, output) => {})
```

##### 7-1-8-3、初始化

webpack 初始化，对应图中 **<u>*new webpack()*</u>**

- 构建 compiler 对象 [源码](https://github.com/webpack/webpack-cli/blob/master/bin/cli.js#L417)

  - ```js
    let compiler = new Webpack(options)
    ```

- 注册 NOdeEnvironmentPlugin 插件 [源码](https://github.com/webpack/webpack/blob/master/lib/webpack.js#L41)

  - ```js
    new NodeEnvironmentPlugin().apply(compiler);
    ```

- 挂载 options 中的基础插件，调用 `WebpackOptionsApply` 库初始化基础插件 [源码](https://github.com/webpack/webpack/blob/master/lib/webpack.js#L53)

  - ```js
    if (options.plugins && Array.isArray(options.plugins)) {
    	for (const plugin of options.plugins) {
    		if (typeof plugin === "function") {
    			plugin.apply(compiler);
    		} else {
    			plugin.apply(compiler);
    		}
    	}
    }
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    compiler.options = new WebpackOptionsApply().process(options, compiler);
    ```

##### 7-1-8-4、编译

run 开始编译，分下述两种情况 [源码](https://github.com/webpack/webpack-cli/blob/master/bin/cli.js#L495)，对应图中 **<u>*run()*</u>**

- Watching：监听文件变化

- run：执行编译

```js
if (firstOptions.watch || options.watch) {
	const watchOptions = firstOptions.watchOptions || firstOptions.watch || options.watch || {};
	if (watchOptions.stdin) {
		process.stdin.on("end", function(_) {
			process.exit(); // eslint-disable-line
		});
		process.stdin.resume();
	}
	compiler.watch(watchOptions, compilerCallback);
	if (outputOptions.infoVerbosity !== "none") console.log("\nwebpack is watching the files…\n");
} else compiler.run(compilerCallback);
```

##### 7-1-8-5、触发 compiler

在 run() 方法中，触发了 compiler，对应图中 ***<u>compile()</u>***

- 注意：在 run 的过程中，已触发了些钩子：**<u>*beforeRun->run->beforeCompile->compile->make->seal*</u>** ，所以编写插件时，就可将自定义方法挂挂载到相应钩子上，钩子按照编译顺序被执行；
- 注意：run 时执行了 this.compile，而 this.compile() 中创建了关键的 `compilation` 对象；
- 注意：<u>**`Compilation ` 对象负责整个编译过程，是十分重要的对象，编译生产资源变换文件都靠它**</u>，其包含每个构建环节所对应的方法，且对象内部保留了对compiler 的引用；当 Webpack 以开发模式运行时，每当检测到文件变化，一次新的 Compilation 将被创建；[源码](https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L265)

```js
this.hooks.beforeRun.callAsync(this, err => {
    ...
	this.hooks.run.callAsync(this, err => {
        ...
		this.readRecords(err => {
            ...
			this.compile(onCompiled);
		});
	});
});

...

compile(callback) {
	const params = this.newCompilationParams();
	this.hooks.beforeCompile.callAsync(params, err => {
		...
		this.hooks.compile.call(params);
    // 关键对象 compilation 构建
		const compilation = this.newCompilation(params);
		this.hooks.make.callAsync(compilation, err => {
            ...
			compilation.finish();
			compilation.seal(err => {
                ...
				this.hooks.afterCompile.callAsync(compilation, err 
				    ...
					return callback(null, compilation);
				});
			});
		});
	});
}
```

##### 7-1-8-6、addEntry

compile中触发 `make` 事件并调用 `addEntry`，对应图中 ***<u>addEntry()</u>***

webpack 的 make 钩子中，利用 tapAsync 注册了一个 `DllEntryPlugin`，即将入口模块通过调用 compilation；

即 Compiler.compile() 方法做了几件事，其中包括：

- 触发 make 事件，make 的相关钩子注册了 `DllEntryPlugin`，故 `DllEntryPlugin.js` 被执行；
- 调用 addEntry 方法，此法将所有的入口模块添加到编译构建队列中，开启编译流程；

[DllEntryPlugin.js](https://github.com/webpack/webpack/blob/master/lib/DllEntryPlugin.js#L33)

```js
compiler.hooks.make.tapAsync("DllEntryPlugin", (compilation, callback) => {
	compilation.addEntry(
		this.context,
		new DllEntryDependency(
			this.entries.map((e, idx) => {
				const dep = new SingleEntryDependency(e);
				dep.loc = {
					name: this.name,
					index: idx
				};
				return dep;
			}),
			this.name
		),
		this.name,
		callback
	);
});
```

DllEntryPlugin 实例来源：

之前 WebpackOptionsApply.process() 初始化插件时，执行了 `compiler.hooks.entryOption.call(options.context, options.entry)`;

```js
// WebpackOptionsApply.js
class WebpackOptionsApply extends OptionsApply {
	process(options, compiler) {
	    ...
	    compiler.hooks.entryOption.call(options.context, options.entry);
	}
}

```

上述 [process](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsApply.js#L79)、[entryOption](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsApply.js#L307) 方法，而 entryOption 事件触发了 [DllPlugin](https://github.com/webpack/webpack/blob/master/lib/DllPlugin.js#L26) 执行：

```js
compiler.hooks.entryOption.tap("DllPlugin", (context, entry) => {
	const itemToPlugin = (item, name) => {
		if (Array.isArray(item)) {
      // DllEntryPlugin 实例构建
			return new DllEntryPlugin(context, item, name);
		}
		throw new Error("DllPlugin: supply an Array as entry");
	};
	if (typeof entry === "object" && !Array.isArray(entry)) {
		Object.keys(entry).forEach(name => {
			itemToPlugin(entry[name], name).apply(compiler);
		});
	} else {
		itemToPlugin(entry, "main").apply(compiler);
	}
	return true;
});
```

其实 addEntry 方法，存在很多入口，SingleEntryPlugin 也注册了 compiler.hooks.make.tapAsync 钩子 

##### 7-1-8-7、构建模块

回到 addEntry，compilation.addEntry 中执行 `_addModuleChain()`方法，而方法主要做了两件事： 

- 根据模块类型，获取相应模块工厂并创建模块；
  - 通过 `*ModuleFactory.create` 方法创建模块，有 `NormalModule , MultiModule , ContextModule , DelegatedModule` 等
- 构建模块；
  - 对模块使用的 loader 进行加载；并调用 acorn 解析经 loader 处理后的源文件生成抽象语法树 AST，遍历 AST，构建该模块所依赖的模块；

对应图中 **<u>*addModuleChain、addModuleDependencies、buildModule*</u>**  [addEntry addModuleChain源码](https://github.com/webpack/webpack/blob/master/lib/Compilation.js#L1072)

```js
addEntry(context, entry, name, callback) {
	const slot = {
		name: name,
		request: entry.request,
		module: null
	};
	this._preparedEntrypoints.push(slot);
	this._addModuleChain(
		context,
		entry,
		module => {
			this.entries.push(module);
		},
		(err, module) => {
			if (err) {
				return callback(err);
			}

			if (module) {
				slot.module = module;
			} else {
				const idx = this._preparedEntrypoints.indexOf(slot);
				this._preparedEntrypoints.splice(idx, 1);
			}
			return callback(null, module);
		}
	);
}
```

##### 7-1-8-8、封装结果 

封装构建结果，即 seal，webpack 会监听 seal 事件，并调用各插件对构建后的结果进行封装，并逐次对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分，生成 hash ；**<u>注意：此步是在开发时进行代码优化和功能添加的关键环节</u>**；

最后通过模板(`MainTemplate、ChunkTemplate`) 将 chunk 生成 `_webpack_requie()` 的格式；对应图中 **<u>*seal*</u>**

```js
template.getRenderMainfest.render()
```

##### 7-1-8-9、输出资源

即 emit，将 Assets 输出到 output 的 path 中；

##### 7-1-8-10、流程总结

webpack 是一个插件合集，由 tapable 控制各插件在 webpack 事件流上运行，主要依赖 compilation 对象的编译模块和封装；

webpack 的入口文件其实就实例了 Compiler 并调用了 run 方法开启了编译，webpack 的主要编译都按下面钩子调用顺序执行：

- Compiler:beforeRun—清除缓存
- Compiler:run—注册缓存数据钩子
- Compiler:beforeCompile
- Compiler:compile 开始编译
- Compiler:make—从入口分析依赖以及间接依赖模块，创建模块对象
- Compilation:buildModule—模块构建
- Compiler:normalModuleFactory—构建
- Compilation:seal—构建结果封装， 不可再更改
- Compiler:afterCompile—完成构建，缓存数据
- Compiler:emit—输出到 dist 目录

Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等；

Compilation 对象也提供了很多事件回调供插件做扩展；

Compilation 对象中比较重要的部分是 assets，若需借助  webpack 帮助生成文件，就要在 assets 上添加对应的文件信息；

compilation.getStats() 能得到生产文件以及 chunkhash 的一些信息等；





##### 7-1-9、构建流程H

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001310.png" style="zoom:50%;" align="left"/>

`webpack` 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：首先会从配置文件和 `Shell` 语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数；初始化完成后会调用`Compiler`的`run`来真正启动`webpack`编译构建过程，`webpack`的构建流程包括`compile`、`make`、`build`、`seal`、`emit`阶段，执行完这些阶段就完成了构建过程；

初始化

- entry-options 启动：从配置文件和 `Shell` 语句中读取与合并参数，得出最终的参数。

- compiler 与 run 实例化：用上一步得到的参数初始化 `Compiler` 对象，加载所有配置的插件，执行对象的 `run` 方法开始执行编译

编译构建

- entry 确定入口：根据配置中的 `entry` 找出所有的入口文件
- make 编译模块：从入口文件出发，调用所有配置的 `Loader` 对模块进行翻译，再找出该模块依赖的模块，再递归此步直到所有入口依赖文件均得到处理；
- build module 完成模块编译：经过上面一步使用 `Loader` 翻译完所有模块后，得到了每个模块被翻译后的最终内容，及它们之间的依赖关系；
- seal 输出资源：根据入口和模块间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表；
  - 此亦为可修改输出内容的最后机会
- emit 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统；





##### 7-1-10、构建流程I

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- `初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- `开始编译`：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- `确定入口`：根据配置中的 entry 找出所有的入口文件
- `编译模块`：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- `完成模块编译`：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- `输出资源`：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- `输出完成`：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

简单说

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中







#### 7-2、构建自实现

##### 7-2-1、自实现1

此实现为探究 webpack 实现原理的简易版；

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

```js
// 场景：编写一个 bundler.js, 将其中的 ES6 代码转换为 ES5 代码，并将这些文件打包，生成一段能在浏览器正确运行起来的代码
// word.js
export const word = 'hello'

// message.js
import {word} from './word.js';
const message = `say ${word}`
export default message;

// index.js
import message from './message.js'
console.log(message)

// 1、利用 babel 完成代码转换, 并生成单个文件的依赖
// 2、生成依赖图谱
// 3、生成最后打包代码
```

- 转换代码、 生成依赖

转换需利用 @babel/parser 生成 AST，然后利用 @babel/traverse 进行 AST 遍历，记录依赖关系，最后通过 @babel/core 和 @babel/preset-env 进行代码转换

```js
// 先安装好相应的包
npm install @babel/parser @babel/traverse @babel/core @babel/preset-env -D
// 导入包
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

function stepOne(filename){
    // 读入文件
    const content =  fs.readFileSync(filename, 'utf-8')
    const ast = parser.parse(content, {
        sourceType：'module'// babel官方规定必须加这个参数，不然无法识别ES Module
    })
    const dependencies = {}
    // 遍历 AST 抽象语法树
    traverse(ast, {
        // 获取通过 import 引入的模块
        ImportDeclaration({node}){
            const dirname = path.dirname(filename)
            const newFile = './' + path.join(dirname, node.source.value)
            // 保存所依赖的模块
            dependencies[node.source.value] = newFile
        }
    })
    // 通过 @babel/core 和 @babel/preset-env 进行代码的转换
    const {code} = babel.transformFromAst(ast, null, {
        presets：["@babel/preset-env"]
    })
    return{
        filename,// 该文件名
        dependencies,// 该文件所依赖的模块集合(键值对存储)
        code// 转换后的代码
    }
}
```

- 生成依赖图谱

```js
// entry 为入口文件
function stepTwo(entry){
    const entryModule = stepOne(entry)
    // 此数组是核心
    const graphArray = [entryModule]
    for(let i = 0; i < graphArray.length; i++){
        const item = graphArray[i];
        const {dependencies} = item;//  拿到文件所依赖的模块集合(键值对存储)
        for(let j in dependencies){
            graphArray.push(
                stepOne(dependencies[j])
            )// 关键，目的是将入口模块及其所有相关的模块放入数组
        }
    }
    // 接下来生成图谱
    const graph = {}
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies：item.dependencies,
            code：item.code
        }
    })
    return graph
}

// 测试一下
console.log(stepTwo('./src/index.js'))
// 结果如下
{ 
    './src/index.js':
   { dependencies：{ './message.js'：'./src\\message.js' },
     code:
      '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj ：{ "default"：obj }; }\n\nconsole.log(_message["default"]);' 
   },
  './src\\message.js':
   { dependencies：{ './word.js'：'./src\\word.js' },
     code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value：true\n});\nexports["default"] = void 0;\n\nvar _word = require("./word.js");\n\nvar message = "say ".concat(_word.word);\nvar _default = message;\nexports["default"] = _default;' },
  './src\\word.js':
   { dependencies：{},
     code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value：true\n});\nexports.word = void 0;\nvar word = \'hello\';\nexports.word = word;' 
   } 
}
```

- 生成代码字符串

```js
// 下面是生成代码字符串的操作
function step3(entry){
    // 要先把对象转换为字符串，不然在下面的模板字符串中会默认调取对象的 toString 方法，参数变成 [Object object], 显然不行
    const graph = JSON.stringify(stepTwo(entry))
    return `
        (function(graph) {
            // require 函数本质是执行一个模块的代码，然后将相应变量挂载到 exports 对象上
            function require(module) {
                // localRequire 的本质是拿到依赖包的 exports 变量
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                }
                var exports = {};
                (function(require, exports, code) {
                    eval(code);
                })(localRequire, exports, graph[module].code);
                return exports;// 函数返回指向局部变量，形成闭包，exports 变量在函数执行后不会被摧毁
            }
            require('${entry}')
        })(${graph})`
}

// 最终测试
const code = step3('./src/index.js')
console.log(code)
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001311.png" style="zoom:60%;" align="left"/>







##### 7-2-1、自实现2

```
|-- forestpack
    |-- dist
    |   |-- bundle.js
    |   |-- index.html
    |-- lib								// 核心文件夹; 主要包括 compiler 和 parser
    |   |-- compiler.js		// 编译相关; Compiler 为一个类, 并有 run 方法去开启编译，还有构建module(buildModule)和输出文件(emitFiles)
    |   |-- index.js 			// 实例化Compiler类，并将配置参数(对应 fors tpack.config.js)传入 
    |   |-- parser.js			// 解析相关; 包含解析 AST(getAST)、收集依赖(getDependencies)、转换(es6转es5)
    |   |-- test.js
    |-- src
    |   |-- greeting.js
    |   |-- index.js
    |-- forstpack.config.js // 配置文件。类似 webpack.config.js
    |-- package.json
```

```js
// 1、基本
// forstpack.js
const path = require("path");
module.exports = {
	// 定义入口、出口
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
};

// greeting.js
export function greeting(name) {
  return "你好" + name;
}
// index.js
import { greeting } from "./greeting.js";
document.write(greeting("森林"));
```

```js
// 2、构建流程 - 1
// 2-1、读取入口文件
// 2-2、分析入口文件，递归的去读取模块所依赖的文件内容，生成AST语法树。
// 2-3、根据 AST 语法树，生成浏览器能够运行的代码

// compiler.js
// 负责接收 forestpack.config.js 配置参数，并初始化 entry、output，并开启编译 run 方法: 处理构建模块、收集依赖、输出文件等;
// 其中：buildModule 方法: 主要用于构建模块（被 run 方法调用）
// 其中：emitFiles 方法: 输出文件（同样被 run 方法调用）
const path = require("path");
const fs = require("fs");
module.exports = class Compiler {
  // 接收通过lib/index.js new Compiler(options).run()传入的参数，对应`forestpack.config.js`的配置
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  // 开启编译
  run() {}
  // 构建模块相关
  buildModule(filename, isEntry) {
    // filename: 文件名称
    // isEntry: 是否是入口文件
  }
  // 输出文件
  emitFiles() {}
};


// parse.js
// 负责解析,替换源码和获取模块的依赖项
// getAST： 将获取到的模块内容 解析成 AST 语法树
// getDependencies：遍历 AST，将用到的依赖收集起来
// transform：把获得的 ES6 的 AST 转化成 ES5
const fs = require("fs");
// const babylon = require("babylon");
const parser = require("@babel/parser");
// @babel/parser：用于将源码生成 AST
const traverse = require("@babel/traverse").default;
// @babel/traverse：对 AST 节点进行递归遍历
const { transformFromAst } = require("babel-core");
// babel-core/@babel/preset-env：将获得的 ES6 的 AST 转化成 ES5
module.exports = {
  // 解析我们的代码生成AST抽象语法树
  getAST: (path) => {
    const source = fs.readFileSync(path, "utf-8");

    return parser.parse(source, {
      sourceType: "module", //表示我们要解析的是ES模块
    });
  },
  // 对AST节点进行递归遍历
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },
    });
    return dependencies;
  },
  // 将获得的ES6的AST转化成ES5
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ["env"],
    });
    return code;
  },
};

```

```js
// 2、构建流程 - 2
// 完善 compiler.js
const { getAST, getDependencies, transform } = require("./parser");
const path = require("path");
const fs = require("fs");

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  // 开启编译
  run() {
    const entryModule = this.buildModule(this.entry, true);
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    // console.log(this.modules);
    this.emitFiles();
  }
  // 构建模块相关
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      const absolutePath = path.join(process.cwd(), "./src", filename);
      ast = getAST(absolutePath);
    }

    return {
      filename, // 文件名称
      dependencies: getDependencies(ast), // 依赖列表
      transformCode: transform(ast), // 转化后的代码
    };
  }
  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = "";
    this.modules.map((_module) => {
      modules += `'${_module.filename}' : function(require, module, exports) {${_module.transformCode}},`;
    });

    const bundle = `
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('${this.entry}')
        })({${modules}})
    `;

    fs.writeFileSync(outputPath, bundle, "utf-8");
  }
};

// 解析 emitFiles 机制
// 补充 webpack 打包后代码，简单分析即：
// 1、webpack 将所有模块(可以简单理解成文件)包裹于一个函数中，并传入默认参数，将所有模块放入一个数组中，取名为 modules，并通过数组的下标来作为 moduleId。
// 2、将 modules 传入一个自执行函数中，自执行函数中包含一个 installedModules 已经加载过的模块和一个模块加载函数，最后加载入口模块并返回。
// 3、__webpack_require__ 模块加载，先判断 installedModules 是否已加载，加载过了就直接返回 exports 数据，没有加载过该模块就通过 modules[moduleId].call(module.exports, module, module.exports, __webpack_require__) 执行模块并且将 module.exports 给返回。

// 用人话讲就是：

// 1、经过 webpack 打包出来的是一个匿名闭包函数（IIFE）
// 2、modules 是一个数组，每一项是一个模块初始化函数
// 3、__webpack_require__ 用来加载模块，返回 module.exports，通过 WEBPACK_REQUIRE_METHOD(0) 启动程序

// dist/index.xxxx.js
(function(modules) {
  // 已经加载过的模块
  var installedModules = {};

  // 模块加载函数
  function __webpack_require__(moduleId) {
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__(0);
})([
/* 0 module */
(function(module, exports, __webpack_require__) {
  ...
}),
/* 1 module */
(function(module, exports, __webpack_require__) {
  ...
}),
/* n module */
(function(module, exports, __webpack_require__) {
  ...
})]);
```

```js
// 3、构造输出
// lib/index
const Compiler = require("./compiler");
const options = require("../forestpack.config");
// 实例化 Compiler 类，并将配置参数（对应forstpack.config.js）传入
new Compiler(options).run();

// 4、结果输出
// 运行 node lib/index.js 就会在 dist 目录下生成 bundle.js 文件
// 与用 webpack 打包生成的 js 文件作下对比
(function (modules) {
  function require(fileName) {
    const fn = modules[fileName];
    const module = { exports: {} };
    fn(require, module, module.exports);
    return module.exports;
  }
  require("/Users/fengshuan/Desktop/workspace/forestpack/src/index.js");
})({
  "/Users/fengshuan/Desktop/workspace/forestpack/src/index.js": function (
    require,
    module,
    exports
  ) {
    "use strict";

    var _greeting = require("./greeting.js");

    document.write((0, _greeting.greeting)("森林"));
  },
  "./greeting.js": function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports.greeting = greeting;

    function greeting(name) {
      return "你好" + name;
    }
  },
});
// 测试运行
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./bundle.js"></script>
  </body>
</html>
```







#### 7-3、HMR 原理

**<u>*过去*</u>**：使用文件监听，在发现源码发生变化时，自动重新构建出新的输出文件；缺点：每次需要手动刷新浏览器；Webpack 有两种开启监听模式的方式：

- 启动 webpack 命令时，带上 --watch 参数
- 在配置 webpack.config.js 中设置 watch:true

原理：轮询判断文件的最后编辑时间是否变化，若某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 后再执行。

```js
module.export = {
  // 默认 false, 也就是不开启
  watch: true,
  // 只有开启监听模式时，watchOptions 才有意义
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等 300ms 再去执行，默认 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    poll: 1000,
  },
};
```

**<u>*现在*</u>**：**<u>*HMR*</u>** 即 **<u>*HotModuleReplacement*</u>**，指当对代码修改并保存后，webpack 将会对代码进行重新打包，并将新的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，<u>以实现在无刷新浏览器的前提下更新页面</u>；相对于`live reload` 刷新页面的方案，HMR的优点在于可保存应用的状态，提高了开发效率；

**<u>*补充*</u>**：HMR 机制可实现无刷新浏览器而将新变更的模块替换掉旧的模块；其核心是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 `Websocket`，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 `Ajax` 请求来获取更改内容(文件列表、hash)，这样客户端就可再借助这些信息继续向 WDS 发起 `jsonp` 请求获取该chunk的增量更新；后续的部分(拿到增量更新的处理、状态的保留与更新)由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像`react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR；



HMR 现已是 Webpack 内置功能，可通过 --hot 或者 HotModuleReplacementPlugin 开启

- 优势：相比于 live reload 方案，HMR 不会刷新浏览器，而是运行时对模块进行热替换，应用状态不丢失；
- 优势：通过 HMR 工作流来自动化完成状态刷新，使更多精力投入到业务中；
- 优势：HMR 兼容市面上大多前端框架或库；

示例如下，以 vue 项目为例：

```js
// index.js
// 创建一个input，可以在里面输入一些东西，方便我们观察热更新的效果
let inputEl = document.createElement("input");
document.body.appendChild(inputEl);

let divEl = document.createElement("div")
document.body.appendChild(divEl);

let render = () => {
    let content = require("./content").default;
    divEl.innerText = content;
}
render();

// 要实现热更新，这段代码并不可少，描述当模块被更新后做什么
// vue-cli 中.vue 无需写额外逻辑，也可实现热更新: 因为有 vue-loader 帮忙实现，许多 loader 都实现了热更新
if (module.hot) {
    module.hot.accept(["./content.js"], render);
}

// content.js
let content = "hello world"
console.log("welcome");
export default content;

// 执行
// cd 项目根目录，并 npm run dev
```



##### 7-3-1、疑问

疑问1：webpack 可将不同的模块打包成 bundle 文件或者几个 chunk 文件，但 dist 目录并无发现？<u>参考第A-1步</u>；

疑问2：webpack-dev-server 的 package.json 中，其依赖于 webpack-dev-middleware，所以其在 HMR 过程中扮演什么角色？<u>参考A原理</u>

疑问3：使用 HMR 过程中，通过开发者工具得知浏览器通过 websocket 和 webpack-dev-server 进行通信，但 websocket 的 message 中并无发现新模块代码；

- 打包后的新模块又是通过什么方式发送到浏览器端的呢？<u>参考第A-4步</u>
- 为什么新的模块不通过 websocket 随消息一起发送到浏览器端呢？<u>参考第A-4步</u>

疑问4：浏览器拿到最新的模块代码，HMR 又是怎么将老的模块替换成新的模块，在替换的过程中怎样处理模块之间的依赖关系？<u>参考第A-5步</u>

疑问5：当模块的热替换过程中，如果替换模块失败，有什么回退机制吗？<u>参考第A-5步</u>

疑问6：浏览器如何知道修改了哪里？<u>client/index.js 的 check 方法；</u>

疑问7：浏览器如何替换旧模块？



##### 7-3-2、基本原理A

原理：webpack 配合 `webpack-dev-server` 进行应用开发的模块热更新流程图：

- 注意：此图表示：<u>修改代码到模块热更新完成的一个周期</u>；
- 注意：框色功能区域：
  - 绿框：表示 webpack 代码控制区域；
  - 蓝框：表示 webpack-dev-server 代码控制的区域；
  - 红框：表示文件系统，文件修改后的变化就发生在这；
  - 青框：表示应用本身；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001312.png" style="zoom:50%;" align="left"/>

- 首先：**<u>*第 1 步*</u>**，webpack 进入 watch 模式，监听文件系统中的文件变化(代码层级)；

  - 监听变化后，根据配置文件对模块重新编译打包，并将打包后的代码，通过简单的 JS 对象保存在内存中；

- 然后：**<u>*第 2 步*</u>**，是 `webpack-dev-server` 和 `webpack` 间的接口交互；

  - 注意：主要是 `webpack-dev-server` 中间件 `webpack-dev-middleware` 与 `webpack` 间交互：

- - `webpack-dev-middleware` 调用 `webpack` 向外暴露的 API 对代码变化进行监控，并告诉 webpack，将代码打包到内存中；

- 然后：**<u>*第 3 步*</u>**，是 `webpack-dev-server` 对文件变化的一个监控(文件层级)；

  - 注意：不同于第1步，并非监控代码变化重新打包，而是监控静态文件变化；

- - 若在：配置文件中配置 [devServer.watchContentBase](https://link.zhihu.com/?target=https%3A//webpack.js.org/configuration/dev-server/%23devserver-watchcontentbase) 为 true，`dev-server` 就会监听此配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload；注意：此处是浏览器刷新，和 HMR 是两个概念；

- 然后：**<u>*第 4 步*</u>**，是 `webpack-dev-server` 代码的工作，此步主要通过 [sockjs](https://link.zhihu.com/?target=https%3A//github.com/sockjs/sockjs-client) (dev-server 依赖之一)，在浏览器端与服务端间建立 `websocket` 长连接，并将 webpack 编译打包的各个阶段的状态信息告知客户端(包括第3步中 `dev-server` 监听静态文件变化信息)；浏览器端根据这些 `socket` 消息进行不同的操作；

- - 注意：服务端向浏览器端传递的最主要信息还是 新模块的 hash 值，后续步骤会根据此 hash 值来进行模块热替换；

- 然后，**<u>*第 5 步*</u>**，`webpack-dev-server/client` 端无法请求更新的代码，也不会执行热更模块操作，而是将这些工作又交回给 webpack

- - `webpack/hot/dev-server` 工作是根据 `webpack-dev-server/client` 传给它的信息以及 `dev-server` 的配置，决定是刷新浏览器还是进行模块热更新；
  - 若仅决定刷新浏览器 (**<u>*第 11 步*</u>**)，就无后续步骤 (**<u>*第 6 7 8 9 10 步*</u>**)；

- 然后，**<u>*第 6 步*</u>**， `HotModuleReplacement.runtime` 是客户端 HMR 的中枢：

  - 首先，它接收到第 5 步向其传递的新模块的 hash 值；
  - 然后，通过 `JsonpMainTemplate.runtime` 向 `dev-server` 端发送 `Ajax` 请求，服务端返回一 JSON 文件(mainfest)，该 JSON 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块(`HotModuleReplacement.runtime`)再次通过 `JSONP` 请求，获取到最新模块代码；此乃上图中第 7、8、9 步；

- 然后，**<u>*第 10 步*</u>**，<u>此乃决定 HMR 成功与否的关键一步</u>，在此步骤中，`HotModulePlugin` 将会对新旧模块进行对比，决定是否更新模块；

  - 若决定更新模块，则先检查模块间的依赖关系，使更新模块的同时，更新模块间的依赖引用；

- 最后，如果 HMR 失败，则回退到 live reload 操作，也即进行刷新浏览器来获取最新打包代码；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001312.png" style="zoom:50%;" align="left"/>

##### 7-3-2-1、原理演示

##### 7-3-2-1-1、环境准备

- 示例结构如下

```js
--hello.js
--index.js
--index.html
--package.json
--webpack.config.js
// 其中 index 依赖 hello；
```

- webpack.config.js 配置如下

```js
const path = require('path')
const webpack = require('webpack')
module.exports = {
    entry：'./index.js',
    output：{
        filename：'bundle.js',
        path：path.join(__dirname, '/')
    },
    devServer：{
        hot：true
    }
}
// 其中 webpack.config 没有配置 HotModuleReplacementPlugin；
// 原因：设置 devServer.hot 为 true，且在 package.json 文件中添加 webpack-dev-server --hot --open 脚本后
// devServer 会告诉 webpack 自动引入 HotModuleReplacementPlugin 插件，而无需手动引入；
```

- npm install 安装依赖，运行 npm start 启动了 devServer 服务，并访问 [http://127.0.0.1:8080](https://link.zhihu.com/?target=http%3A//127.0.0.1%3A8080/) 即可看到页面执行

```json
"start"："webpack-dev-server --hot --open"
```

##### 7-3-2-1-2、HMR 流程演示

- 修改 hello 代码

```js
// hello.js
- const hello = () => 'hello world' // 将 hello world 字符串修改为 hello TLP
+ const hello = () => 'hello TLP'
```

**<u>*第 1 步*</u>**，webpack  对文件系统进行 watch 并重新编译打包到内存中

- `webpack-dev-middleware` 调用 `webpack` 的 `api` 对文件系统实行 `watch`；
  - 当 `hello.js` 文件发生改变后，`webpack` 重新对文件进行编译和打包，然后保存到内存中；

```js
// webpack-dev-middleware/lib/Shared.js
if(!options.lazy) {
    var watching = compiler.watch(options.watchOptions, share.handleCompilerCallback);
    context.watching = watching;
}
```

- 注意：`webpack` 并无将文件直接打包到 `output.path` 目录下，而是将 `bundle.js` 文件打包到了内存中；
- 原因：不生成文件的原因在于：访问内存中的代码，比访问文件系统中的文件要快得多，且减少了代码写入文件的开销；
- 实现：通过 [memory-fs](https://link.zhihu.com/?target=https%3A//github.com/webpack/memory-fs) 实现，其是 `webpack-dev-middleware` 的一个依赖库，`webpack-dev-middleware` 将 `webpack` 原本的 `outputFileSystem` 替换成了 `MemoryFileSystem` 实例，这样代码就将输出到内存中；具体流程是：首先判断当前 `fileSystem` 是否已是 `MemoryFileSystem` 的实例，若不是则用 `MemoryFileSystem` 的实例替换 `compiler` 之前的 `outputFileSystem`；如此 `bundle.js` 文件代码就能作为一个简单 JS 对象保存在内存中，当浏览器请求 `bundle.js` 文件时，`devServer` 就直接去内存中找到先前保存的 JS 对象并直接返回给浏览器端；

```js
// webpack-dev-middleware/lib/Shared.js
var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
if(isMemoryFs) {
    fs = compiler.outputFileSystem;
} else {
    fs = compiler.outputFileSystem = new MemoryFileSystem();
}
```



**<u>*第 2 步*</u>**，devServer 通知浏览器端文件发生改变

[sockjs](https://link.zhihu.com/?target=https%3A//github.com/sockjs/sockjs-client) 是服务端和浏览器端间的通信桥梁，在启动 `devServer` 时，`sockjs` 就在服务端和浏览器端建立了一个 `webSocket` 长连接，以便将 `webpack` 编译和打包的各个阶段状态告知浏览器；但最关键步骤还是 `webpack-dev-server` 调用 `webpack` 的 `api` 监听 `compile` 的 `done` 事件，当 `compile` 完成后，`webpack-dev-server` 通过 `_sendStatus` 方法将编译打包后的新模块 hash 值发送到浏览器端；

```js
// webpack-dev-server/lib/Server.js
compiler.plugin('done', (stats) => {
  // stats.hash 是最新打包文件的 hash 值
  this._sendStats(this.sockets, stats.toJson(clientStats));
  this._stats = stats;
});
...
Server.prototype._sendStats = function (sockets, stats, force) {
  if (!force && stats &&
  (!stats.errors || stats.errors.length === 0) && stats.assets &&
  stats.assets.every(asset => !asset.emitted)
  ) { return this.sockWrite(sockets, 'still-ok'); }
  // 调用 sockWrite 方法将 hash 值通过 websocket 发送到浏览器端
  this.sockWrite(sockets, 'hash', stats.hash);
  if (stats.errors.length > 0) { this.sockWrite(sockets, 'errors', stats.errors); } 
  else if (stats.warnings.length > 0) { this.sockWrite(sockets, 'warnings', stats.warnings); }      else { this.sockWrite(sockets, 'ok'); }
};
```



**<u>*第 3 步*</u>**，webpack-dev-server/client 接收到服务端消息做出响应

注意：之所以打包后的 `bundle.js` 能接收 `websocket` 消息，原因在于 `webpack-dev-server` 修改了 `webpack` 配置中的 `entry` 属性(添加了新的入口文件)，并向 `bundle.js` 添加了 `webpack-dev-client` 的代码，所以最后打包的 `bundle.js` 文件中就会有能接收 `websocket` 消息的代码；

注意：下图中为  "<u>websocket 接收 dev-server 通过 sockjs 发送到浏览器端的消息列表</u>" 

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001313.png" style="zoom:35%;" align="left"/>

然后，`webpack-dev-server/client` 根据接收到的消息的 type 作不同操作：

- 若接收到 type 为 hash 的消息，则会将 hash 值暂存起来(暂存到 `currentHash` 变量)；

- 若接收到 type 为 ok 的消息，则对应用执行 reload 操作；

  - 注意：在 `reload` 操作中，`webpack-dev-server/client` 会根据 hot 配置，决定是刷新浏览器亦或是对代码进行热更新HMR，(<u>故使用 HMR 需要设置 webpackconfig.js 和 package.json 命令行，前者控制拦截加入监听，后者控制开关</u>)
  - 若配置了模块热更新，则调用 `webpack/hot/emitter` 将最新 hash 值发送给 webpack，然后，将控制权交给 webpack 客户端代码；

  - 若无配置模块热更新，则直接调用 `location.reload` 方法刷新页面；

- 注意：hash 消息是在 ok 消息之前；

```js
// webpack-dev-server/client/index.js
hash：function msgHash(hash) {
    currentHash = hash;
},
ok：function msgOk() {
    // ...
    reloadApp();
},
// ...
function reloadApp() {
  // ...
  if (hot) {
    log.info('[WDS] App hot update...');
    const hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
    // ...
  } else {
    log.info('[WDS] App updated. Reloading...');
    self.location.reload();
  }
}
```



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001312.png" style="zoom:50%;" align="left"/>

**<u>*第 4 步*</u>**，webpack 接收到最新 hash 值验证并请求模块代码

此步实际上是 webpack 中三个模块(三个文件，后面英文名对应文件路径)间配合的结果：

- 首先，`webpack/hot/dev-server` (以下简称 `dev-server`) 监听第 3 步 `webpack-dev-server/client` 所发送的 `webpackHotUpdate` 消息；
- 然后，调用 `HMR runtime` 中的 `check` 方法，检测是否有新的更新；
  - 在 check 过程中会利用 `jsonp runtime`； 中的 2 个方法 `hotDownloadUpdateChunk` 和 `hotDownloadManifest`；
    - `hotDownloadUpdateChunk`  方法是通过 JSONP 请求最新的模块代码；
      - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001314.png" style="zoom:25%;" align="left"/>
    - `hotDownloadManifest` 方法是调用 AJAX 向服务端请求是否有更新的文件，若有将发更新的文件列表返回浏览器端；
      - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001315.png" style="zoom:25%;" align="left"/>
  - 注意：`webpack/lib/JsonpMainTemplate.runtime` 简称 `jsonp runtime`；
  - 注意： `webpack/lib/HotModuleReplacement.runtime` 简称 `HMR runtime`；
  - 注意：上述两次请求均使用上一次的 hash 值拼接的请求文件名：
    - `hotDownloadManifest` 方法返回的是最新的 hash 值；
    - `hotDownloadUpdateChunk` 方法返回的是最新 hash 值对应的代码块，新代码块返回给 `HMR runtime` 作进一步处理(即下面一步)；
- 然后，将代码返回给 `HMR runtime`，`HMR runtime` 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新；



释疑3：使用 HMR 过程中，通过开发者工具得知浏览器通过 websocket 和 webpack-dev-server 通信，但 websocket 的 message 中并无发现新模块代码；

- 打包后的新模块又是通过什么方式发送到浏览器端？
  - 原因：通过 JSONP 获取新模块；
- 为何新模块不通过 websocket 随消息一起发送到浏览器端(而是通过 JSONP)？
  - 原因A：实现功能块解耦，使各个模块各司其职；
    - `dev-server/client` 只负责消息的传递；
    - `HMR runtime` 负责新模块代码的获取；
  - 原因B：若假设不使用 `webpack-dev-server`，只用 [webpack-hot-middleware](https://link.zhihu.com/?target=https%3A//github.com/glenjamin/webpack-hot-middleware) 和 webpack 配合同样也可完成模块热更新流程，而使用 `webpack-hot-middleware` 时，并无使用 websocket，而是使用的 [EventSource](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)；即通过 JSONP 方式，避免了使用 websocket
  - 综上，HMR 的工作流中，不应将新模块代码放在 `websocket` 消息中；





**<u>*第 5 步*</u>**，HotModuleReplacement.runtime 对模块进行热更新

此乃整一模块热更新(HMR)的关键步骤，且模块热更新都是发生在 `HMR runtime` 中的 `hotApply` 方法中，仅有 300 行代码

```js
// webpack/lib/HotModuleReplacement.runtime
function hotApply() {
    // ...
    var idx;
    var queue = outdatedModules.slice();
    while(queue.length > 0) {
        moduleId = queue.pop();
        module = installedModules[moduleId];
        // ...
        // remove module from cache
        delete installedModules[moduleId];
        // when disposing there is no need to call dispose handler
        delete outdatedDependencies[moduleId];
        // remove "parents" references from all children
        for(j = 0; j < module.children.length; j++) {
            var child = installedModules[module.children[j]];
            if(!child) continue;
            idx = child.parents.indexOf(moduleId);
            if(idx >= 0) {
                child.parents.splice(idx, 1);
            }
        }
    }
    // ...
    // insert new code
    for(moduleId in appliedUpdate) {
        if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
            modules[moduleId] = appliedUpdate[moduleId];
        }
    }
    // ...
}
```

由下面得知，模块热替换主要分3个阶段：

- 第一个阶段：找出 `outdatedModules` 和 `outdatedDependencies`；

- 第二个阶段：从缓存中删除过期的模块和依赖：`delete installedModules[moduleId]; & delete outdatedDependencies[moduleId];`

- 第三个阶段：将新的模块添加到 `modules` 中，当下次调用 `__webpack_require__` (webpack 重写的 require 方法)方法时，即获取到了新的模块代码；

  - 注意：`__webpack_require__` 函数，可在浏览器中执行的加载函数；
    - 作用：用以模拟 Node 中的 require 语句，做了缓存优化，不会二次执行加载；
    - 因为：浏览器无法像 Node 快速加载多个模块文件，而须通过网络请求异步加载文件；
    - 所以：原多个独立模块文件，被合并到一 bundle.js 文件，且模块数量很多加载时间会越长，将所有模块都存放在数组中，便于执行一次网络加载；
    - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001256.png" style="zoom:50%;" align="left"/>

  



至于模块热更新的错误处理，若在热更新过程中出现错误，热更新将回退到刷新浏览器：

```js
module.hot.check(true).then(function(updatedModules) {
    if(!updatedModules) {
        return window.location.reload();
    }
    // ...
}).catch(function(err) {
    var status = module.hot.status();
    if(["abort", "fail"].indexOf(status) >= 0) {
        window.location.reload();
    }
});
```

`dev-server` 先验证是否有更新，没有代码更新的话，重载浏览器；若在 `hotApply` 的过程中出现 abort 或 fail 错误，也进行重载浏览器；



**<u>*第 6 步*</u>**，业务代码的处理

当用新的模块代码替换老的模块后，但业务代码无法得知代码已发生变化，即当 hello.js 文件修改后，还需要在 index.js 文件中调用 HMR 的 accept 方法，添加模块更新后的处理函数，及时将 hello 方法的返回值插入到页面中；

```js
// index.js
if(module.hot) {
    module.hot.accept('./hello.js', function() {
        div.innerHTML = hello()
    })
}
```

**<u>*最后*</u>**，上述即整个HMR流程；



##### 7-3-3、基本原理B

##### 7-3-3-1、综合解释B-1

- 当修改一或多个文件时；
- 文件系统接收更改并通知 webpack (webpack监听)；
- webpack 重新编译构建一或多个模块，并通知 HMR Server 进行更新；
- HMR Server 使用 websocket 通知 HMR runtime 需要更新，HMR runtime 通过 Ajax 请求、JSONP 分别获取更新文件列表与更新模块代码；
- HMR runtime 根据配置决定更新替换旧模块亦或刷新页面，若替换出错则回退刷新页面；

##### 7-3-3-2、综合解释B-2

`hot-module-replacement-plugin` 包给 `webpack-dev-server(WDS)` 提供了热更新的能力，它们两者是结合使用的，单独写两个包目的是使功能解耦；

- `WDS` 作用是：提供 `bundle server` 的能力，即生成的 `bundle.js` 文件可通过 `localhost://xxx` 形式访问，并提供浏览器的自动刷新—livereload；
- `hot-module-replacement-plugin` 作用是：提供 `HMR runtime`，并且将 `runtime` 注入到 `bundle.js` 代码中；一旦磁盘文件发生修改，则 `HMR server` 将有修改的 JS 模块信息通过 `websocket` 发送给 `HMR runtime`，然后 `HMR runtime` 去局部更新页面的代码，实现无刷新浏览器更新；

##### 7-3-3-3、综合解释B-3

首先，webpack-dev-server(WDS) 主要包含了三个部分：

- webpack：负责编译代码
- webpack-dev-middleware：负责构建内存文件系统，将 webpack 的 OutputFileSystem 替换成 InMemoryFileSystem；同时作为 Express 中间件拦截请求，从内存文件系统中将结果拿出来；
- express：负责搭建请求路由服务；

其次，HMR 工作流程：

- 首先，启动 dev-server，webpack 开始构建，在编译期间会向 entry 文件注入热更新代码；
- 然后，Client 首次打开后，Server 和 Client 基于Socket 建立通讯渠道；
- 然后，当修改文件时，Server 端监听到文件发生变动，webpack 开始编译，直到编译完成会触发 Done 事件；
- 然后，Server 通过 socket 发送消息告知 Client；
- 然后，Client 根据 Server 传送的消息(hash 值和 state 状态)，通过 ajax 请求获取 Server 的 manifest 描述文件(包含了所有要更新的模块的 hash 值)；
- 然后，Client 对比当前 modules tree ，再次发请求到 Server 端并通过 JSONP 的方式获取新的 JS 模块
- 然后，Client 获取到新的 JS 模块后，会更新 modules tree 并替换掉现有的模块；
- 最后，调用 module.hot.accept() 完成热更新(业务代码)；

##### 7-3-3-4、综合解释B-4

webpack 中都是模块且有唯一标识

- webpack-dev-middleware 是用来处理文件打包到哪里，到内存读取速度更快；

- devServer 在监听 compiler done 后，利用 socket 告诉 devServer/client 修改模块的 hash；

- HMR.runtime 利用 Ajax 请求 `hash.hot-update.json` 获取更新模块列表 `hotDownloadManifest`

  ```js
  {"h":"11ba55af05df7c2d3d13","c":{"index-wrap":true}}
  ```

- 再通过 JSONP 方式获取更新模块的 JS

  ```js
  index-wrap.7466b9e256c084c8463f.hot-update.js
  ```

  返回执行

  ```js
  webpackHotUpdate("index-wrap", {
    // ....
  })
  ```

- webpackHotUpdate 做了三件事：

  - 找到过期的模块和依赖并从缓存中删除

    ```js
    delete installedModules[moduleId];
    delete outdatedDependencies[moduleId];
    ```

  - 遍历所有的 module.children，重新 `installedModules` 所有的子模块

  - 将自身模块的内容做替换修改：`modules[moduleId] = appliedUpdate[moduleId]`

- 最后代码替换之后并没有重新执行，需要手动注册需要重新执行的模块方法

  ```js
  if (module.hot) {
    module.hot.accept('./print.js', function() {
    	console.log('Accepting the updated printMe module!');
    	printMe();
    })
  }
  ```





##### 7-3-4、基本原理C

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001316.png" style="zoom:50%;" align="left"/>

基本：代码在开发打包阶段，被编译注入到客户端的 Bundle.js 中(加塞用于 websocket 连接通讯的相关代码)，如此 bundle.js 就能与服务端建立起 websocket 连接，此后编辑器中修改代码，相应文件变化就可得到及时通知；过程如下：

- 启动阶段：文件系统中代码经过 webpack compiler 编译，打包输出为 bundle.js，并传输给 Bundle Server，使浏览器能通过访问服务器获取 bundle.js;
  - 对应图中过程的 1，2，A，B；
- 更新阶段：改动的代码仍通过 webpack compiler 编译，然后传给 HMR Server(确定代码中哪些模块发生了改变)，HMR Server 再去通知浏览器端的 HMR Runtime 发生了变化，HMR Runtime 发起 Ajax 请求获取更新文模块 JSON 列表，获取到后与本地 modules tree 比对，并再发起请求，通过 JSONP 形式获取更新的模块代码，然后 HMR Runtime 更新代码，最后页面上呈现相应的改变；
  - 对应图中过程的 1，2，3，4，5；

最后，还可使用 webpack-dev-middleware(WDM) 来进行热更新，将 webpack 输出的文件传输给服务器，适用于灵活的定制场景；



##### 7-3-5、基本原理D

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001317.png" style="zoom:35%;" align="left"/>

##### 7-3-5-1、HMR 在 Server 端的实现

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001318.png" style="zoom:35%;" align="left"/>

启动位置：`webpack-dev-server/bin/webpack-dev-server.js`

组成功能：

- webpack：负责编译代码；
- express：作为服务器；
- webpack-dev-middleware：提供 `in-memory` 内存文件系统，将 webpack 的 `outputFileSystem` 替换为 `inMemoryFileSystem`，并拦截浏览器请求，从这个文件系统中把结果取出来返回；

server 端 HMR 流程：

- 初始化阶段：
  - `webpack-dev-server` 初始化：
    - `var compiler = webpack(options)`，创建 webpack 实例，下图1；
    - 监听 compiler 也就是 webpack 的 done 事件；
    - 创建 express 实例，下图2；
    - 创建 `WebpackDevMiddleware` 实例，下图2；
    - 设置 `express router`，`WebpackDevServer` 会作为 `express` 的一个中间件拦截所有请求；
  - `WebpackDevMiddleware` 初始化：
    - 创建 `MemoryFileSystem` 实例，以替换 `webpack.outputFileSystem`；
    - 此后 webpack 编译出的文件均存放在内存中而非磁盘；
    - 将对编译后的文件的请求，都重定向到上面创建的 `MemoryFileSystem` 中；
- 热更新阶段：
  - webpack 监听文件变化，并完成编译；
  - `webpack-dev-server` 监听 done 事件，并通过 websocket 向客户端发送消息，下图3；
  - 客户端经过处理后，请求新的JS模块代码；
  - `WebpackDevServer` 从 `MemoryFileSystem` 中取出代码，并返回；



- webpack-dev-server.js

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001319.png" style="zoom:45%;" align="left"/>

- webpack-dev-server/lib/Server.js

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001320.png" style="zoom:45%;" align="left"/>

- _sendStats 会通过 websocket 给客户端发送两条消息；
- 客户端收到消息后，会去请求一个 json 配置文件，然后根据配置请求新的JS模块代码、请求都会被 WebpackDevMiddleware 拦截：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001321.png" style="zoom:45%;" align="left"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001322.png" style="zoom:45%;" align="left"/>



##### 7-3-5-2、HMR 在 Client 端的实现

webpack 在启用 HMR 后，会在 server 端(Node)监听文件改动，并且一旦发生变动就把新的代码编译后发送到浏览器；

浏览器中也会有 HMR 相关的代码，其会通过 socket 和 server 保持通信，获取新代码并进行热替换；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001323.png" style="zoom:45%;" align="left"/>

client 端 HMR 流程：

- client 和 server 建立一个 websocket 通信；
- 当有文件发生变动的时候，webpack 编译文件，并通过 websocket 向 client 发送更新消息(hash、status )；
- client 根据收到的 hash 值，通过 ajax 获取一个 manifest 描述文件；
- client 根据 manifest 再次请求 Server 获取最新的 JS 模块的代码(JSONP)；
- 当取到新的 JS 代码后，会更新 modules tree (installedModules)；
- 调用之前通过 module.hot.accept 注册好的回调，可能是 loader 提供的，也可能是你自己写的；



- 启用 HMR 后，会在入口文件包裹一层，含有两个依赖：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001324.png" style="zoom:45%;" align="left"/>

- 其中 client/index.js 主要负责：建立socket 通信，并在收到消息后调用对应的方法；
- 其中 dev-server.js 会调用 `module.hot.check` 方法，而最终作代码更新的，是在 `webpack/lib/HotModuleReplacement.runtime.js` 文件中；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001325.png" style="zoom:45%;" align="left"/>

- bundle 文件会被加入 webpack-dev-server/client.js，他会创建一个 socket 和 devserver 连接，监听事件：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001326.png" style="zoom:45%;" align="left"/>

- dev-server.js 中的check方法，最终会进入到这里：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001327.png" style="zoom:45%;" align="left"/>

- 加载JS的代码如下：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001328.png" style="zoom:45%;" align="left"/>

- 加载JS的代码如下：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001329.png" style="zoom:45%;" align="left"/>

- 得到了新模块的 JS 代码，下面要做的就是调用对应的 accept 回调，这也是在 hotApply 方法的后面部分做的：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001330.png" style="zoom:45%;" align="left"/>



##### 7-3-6、基本原理E

现象：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001331.png" style="zoom:45%;" align="left"/>

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001332.png" style="zoom:45%;" align="left"/>

- 流程A：代码一旦发生改动保存就会自动重新编译打包，此系列的重新检测、编译依赖于 webpack 文件监听：
  - 在项目启动后，webpack 会通过 `Compiler` 类的 `Run` 方法开启编译构建过程，编译完成后(编译之后的文件会被写入到内存)，调用 Watch 方法监听文件变更，当文件发生变化，重新编译，编译完成之后继续监听；
  - Webpack 编译打包之后得到一个 `Compilation` ，并将 `Compilation` 传递到 `Webpack-dev-middleware` 插件中，于是`Webpack-dev-middleware` 便可通过 `Compilation` 调用 Webpack中 的 Watch 方法实时监控文件变化，并重新编译打包写入内存
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001333.png" style="zoom:45%;" align="left"/>

- 流程B：页面的访问需要依赖 Web 服务器，此举通过 `Webpack-dev-middleware` 将 Webpack 编译打包之后的文件传递给 Web 服务器(即本地文件变更编译后发送给页面服务器)：
  - `Webpack-dev-middleware` 是一个封装器(wrapper)，其可以将 Webpack 处理过的文件 (通过 `memory-fs` 实现静态资源请求直接访问内存文件获取处理后的文件) 发送到一个 Server (其中 `Webpack-Dev-Server` 就是内置了 `Webpack-dev-middleware` 和 `Express` 服务器)；

- 流程C：在浏览器端，每次代码变动重新编译后，浏览器会发出 `hash.hot-update.json`、`fileChunk.hash.hot-update.js` 资源请求(而 `__Webpack_hmr` 请求返回的消息包含了首次 Hash 值)
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001334.png" style="zoom:45%;" align="left"/>

点开查看 `hash.hot-update.json` 请求，返回的结果中，h 是一个 hash 值，用于下次文件热更新请求的前缀，c 表示当前要热更新的文件是 main1 

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001335.png" style="zoom:45%;" align="left"/>

继续查看 `fileChunk.hash.hot-update.js`，返回的内容是使用 `webpackHotUpdate` 标识的 fileChunk 内容：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001336.png" style="zoom:45%;" align="left"/>

问题：Webpack 服务器和浏览器端如何建立起通信？(Webpack 服务器通知更新，浏览器请求 Webpack 服务器获取更新资源)

回答：通过 Webpack-hot-middleware 插件；开发时浏览器的 Network 中总是有一个 `Webpack_hmr` 的请求(请求Webpack服务器)，点开查看会看到`EventStream` 事件流，并且以 2s 的频率不停的更新消息内容(心跳请求)，而此 `__Webpack_hmr` 的配置，位于 Webpack-hot-middleware/client.js：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001337.png" style="zoom:45%;" align="left"/>

而继续向下查看 Client.js 代码，发现这完全就是一个只要浏览器支持就可以自发建立通信通道的客户端：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001338.png" style="zoom:45%;" align="left"/>

此外，除了能自发请求，还可监听内容并作出响应：在建立通信的过程中，浏览器端会初始化一个 `EventSource` 实例并通过 `onmessage` 事件监听消息。浏览器端在收到服务器发来的数据时，就会触发 `onmessage` 事件，可以通过定义 `onmessage` 的回调函数处理接收到的消息；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001339.png" style="zoom:45%;" align="left"/>

而监听的消息有(Client.js )：

- `building/built`：构建中，不会触发热更新； 
- `sync`：开始更新的流程

并 sync 中的 `processUpdate` 处理传递过来的消息：在 `processUpdate` 方法中，处理一切异常/错误的方法都是直接更新整个页面即调用 `window.location.reload()；`

其首先调用 `module.hot.check` 方法检测是否有更新，然后进入 `HotModuleReplacement.runtime` 的 Check 阶段

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001340.png" style="zoom:45%;" align="left"/>

- 流程D：浏览器在 Check 之后触发 `WebpackHotUpdateCallback`，具体 `HotModuleReplacement.runtime.js` 会做以下几个操作：
  - 进入 HotCheck，调用 `hotDownloadManifest` 发送 `/hash.hot-update.json` 请求；
  - 通过 Json 请求结果获取热更新文件，以及下次热更新的 Hash 标识，并进入热更新准备阶段；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001341.png" style="zoom:45%;" align="left"/>

- 而 `HotCheck` 确认需要热更新之后，进入 `hotAddUpdateChunk` 方法：
- 该方法先检查 Hash 标识的模块是否已更新，若没更新则通过在 DOM 中添加 Script 标签方式，动态请求js： `/fileChunk.hash.hot-update.js`，获取最新打包的 js 内容；
- 而最新打包的js内容如何更新的呢？
- `HotModuleReplacement.runtime.js` 在 window 对象上定义了 `WebpackHotUpdate`方法；在这里定义了如何解析前面 `fileChunk.hash.hot-update.js` 请求返回的js内容 `webpackHotUpdate(main1, { moreModules })`，直接遍历 `moreModules`，并且执行 `hotUpdate` 方法更新；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001342.png" style="zoom:45%;" align="left"/>

总结：Webpack 如何实现热更新的呢？首先是建立起浏览器端和服务器端之间的通信，浏览器会接收服务器端推送的消息，如果需要热更新，浏览器发起http请求去服务器端获取打包好的资源解析并局部刷新页面；





#### 7-4、HMR 自实现

##### 7-4-1、chunk 与 module

chunk 是若干 module 打成的包，一个 chunk 应该包括多个 module，一般来说最终会形成一个 file；而 JS 以外的资源，webpack 会通过各种 loader 转化成一个 module，这个 module 会被打包到某个 chunk 中，并不会形成一个单独的 chunk；

##### 7-4-2、HMRP

HMRP，即 HotModuleReplacementPlugin 是 HMR 中一个非常关键的插件，它主要做了：

- 生成两个补丁文件：
  - **<u>*manifest*</u>(JSON)**：`上一次编译生成的hash.hot-update.json`，比如：b1f49e2fc76aae861d9f.hot-update.json
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001343.png" style="zoom:50%;" align="left"/>
  - <u>***updated chunk (JS)***</u>： `chunkName.上一次编译生成的hash.hot-update.js`，比如：main.b1f49e2fc76aae861d9f.hot-update.js；
  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001344.png" style="zoom:50%;" align="left"/>
- 在 chunk 文件中注入 HMR runtime 运行时代码：
  - 热更新客户端主要逻辑(HMR Runtime )：<u>拉取新模块代码</u>、<u>执行新模块代码</u>、<u>执行 accept 的回调实现局部更新</u>，<u>都是此插件将函数注入到 chunk 文件中</u>，而非 webpack-dev-server，WDS 只是调用了这些函数；
- 注意：就是这个插件生成了最关键的两个文件，而非 webpack

##### 7-4-3、HMRP 打包的 Chunk

下述即用 HotModuleReplacementPlugin 编译生成的 chunk，被注入了 HMR runtime 代码

```js
(function (modules) {
  	// (HMR runtime代码) module.hot 属性就是 hotCreateModule 函数的执行结果，所有 hot 属性都有 accept、check 属性
  	function hotCreateModule() {
        var hot = {
            accept: function (dep, callback) {
                for (var i = 0; i < dep.length; i++)
                    hot._acceptedDependencies[dep[i]] = callback;
            },
          	// 在 webpack/hot/dev-server.js 中调用 module.hot.accept 执行的就是 hotCheck 函数
            check: hotCheck,
        };
        return hot;
    }
  	
    // (HMR runtime 代码) 以下几个方法是 拉取更新模块的代码
    function hotCheck(apply) {}
    function hotDownloadUpdateChunk(chunkId) {}
    function hotDownloadManifest(requestTimeout) {}

    // (HMR runtime 代码) 以下几个方法是 执行新代码 并 执行 accept 回调
    window["webpackHotUpdate"] = function webpackHotUpdateCallback(chunkId, moreModules) {
        hotAddUpdateChunk(chunkId, moreModules);
    };
    function hotAddUpdateChunk(chunkId, moreModules) {hotUpdateDownloaded();}
    function hotUpdateDownloaded() {hotApply()}
    function hotApply(options) {}

    // (HMR runtime 代码) hotCreateRequire 给模块 parents、children 赋值了
    function hotCreateRequire(moduleId) {
      	var fn = function(request) {
            return __webpack_require__(request);
        };
        return fn;
    }
  
    // 模块缓存对象
    var installedModules = {};

    // 实现了一个 require 方法
    function __webpack_require__(moduleId) {
        // 判断这个模块是否在 installedModules 缓存 中
        if (installedModules[moduleId]) {
            // 若在缓存中，则直接返回 installedModules 缓存中该模块的导出对象
            return installedModules[moduleId].exports;
        }
      
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,  // 模块是否加载
            exports: {},  // 模块的导出对象
            hot: hotCreateModule(moduleId), // 获取 hotCreateModule 导出的对象 hot，即 module.hot === 外层 hot 对象
            parents: [], // 这个模块 被 哪些模块引用了
            children: [] // 这个模块 引用了 哪些模块
        };

        // (HMR runtime 代码) 执行模块的代码，传入参数
      	// hotCreateRequire == var fn = function(request) { return __webpack_require__(request); };
        modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

        // 设置模块已加载
        module.l = true;

        // 返回模块的导出对象
        return module.exports;
    }
  
    // 暴露 模块的缓存
    __webpack_require__.c = installedModules;

    // 加载入口模块 并且 返回导出对象
    return hotCreateRequire(0)(__webpack_require__.s = 0);
})(
    {
        "./src/content.js":
            (function (module, __webpack_exports__, __webpack_require__) {}),
        "./src/index.js":
            (function (module, exports, __webpack_require__) {}),// 在模块中使用的 require 都编译成了 __webpack_require__

        "./src/lib/client/emitter.js":
            (function (module, exports, __webpack_require__) {}),
        "./src/lib/client/hot/dev-server.js":
            (function (module, exports, __webpack_require__) {}),
        "./src/lib/client/index.js":
            (function (module, exports, __webpack_require__) {}),

      	// 主入口
      	// 主入口
      	// 主入口
        0:
            (function (module, exports, __webpack_require__) {
                eval(`
                    __webpack_require__("./src/lib/client/index.js");
                    __webpack_require__("./src/lib/client/hot/dev-server.js");
                    module.exports = __webpack_require__("./src/index.js");
                `);
            })
    }
);
```

- `hotCreateRequire(0)(__webpack_require__.s = 0)`  即主入口

- 当浏览器执行这个 chunk 时，在执行每个模块时，会给每个模块传入一个 module 对象，结构如下，并把这个 module 对象放到缓存 installedModules 中；此时可通过`__webpack_require__.c` 拿到这个模块缓存对象；

```js
var module = installedModules[moduleId] = {
  i: moduleId,
  l: false,
  exports: {},
  hot: hotCreateModule(moduleId),
  parents: [],
  children: []
};
```

- hotCreateRequire 帮助给模块 module 的 parents、children 赋值
- hot  属性，hotCreateModule(moduleId) 返回了一个具有 accept、check 两个主要属性的对象 hot，详看下小节；

```js
 function hotCreateModule() {
      var hot = {
          accept: function (dep, callback) {
          for (var i = 0; i < dep.length; i++)
              hot._acceptedDependencies[dep[i]] = callback;
          },
          check: hotCheck,
      };
      return hot;
 }
```

##### 7-4-4、module.hot & module.hot.accept

- accept 使用 
  - 要实现热更新，下述代码必不可少(原因看 accept 原理)，accept 传入的回调函数就是局部刷新逻辑，当./content.js模块改变时执行

```js
if (module.hot) {
    module.hot.accept(["./content.js"], render);
}
```

- accept 原理

```js
function hotCreateModule() {
    var hot = {
        accept: function (dep, callback) {
            for (var i = 0; i < dep.length; i++)
                hot._acceptedDependencies[dep[i]] = callback;
        },
    };
    return hot;
} 
var module = installedModules[moduleId] = {
    // ...
    hot: hotCreateModule(moduleId),
};
```

accept 工作时往 `hot._acceptedDependencies` 对象存入局部更新回调函数，而当当模块文件改变时，就会调用 acceptedDependencies 搜集的回调

- 再看 accept

```js
if (module.hot) {
    module.hot.accept(["./content.js"], render);
    // 等价于 module.hot._acceptedDependencies["./content.js"] = render
    // 即将 模块-content.js 改变时，对要做的事-render 进行了搜集，搜集到 _acceptedDependencies 中
    // 以便当 content.js 模块改变时，其父模块 index.js 通过 _acceptedDependencies 知道要干什么
}
```

##### 7-4-5、详看 HMR-实现

##### 7-4-6、补充

webpack-dev-server，webpack-hot-middleware，webpack-dev-middleware

- Webpack-dev-middleware：负责将编译的文件返回、更改文件系统为内存文件系统、让 webpack 以 watch 模式编译；

- Webpack-hot-middleware：实现浏览器和 Webpack 服务器间双向通信、并在客户端订阅/接收服务端的更新变化，然后利用 HMR.runtime 执行更改；

  - 服务端：负责监听 compiler.hooks.done 的 webpack 编译完成事件；并通过 SSE 实现向客户端推送事件服务(类似 websocket)：building、built、sync事件；SSE (server-sent-event)，亦称 EventSource，可实现服务端到客户端的单向通信；并可通过心跳机制检测客户端是否存活；

  - 客户端：客户端需负责响应/接应服务端消息，并获取服务端返回内容，处理新编译模块代码，此部分内容通过打包时注入进去；页面执行时，页面代码随之执行， 创建 SSE 实例，请求 [/__webpack_hmr](https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/client.js#L88)，监听building、built、sync事件，回调函数利用 HMR.runtime 进行更新；

    - ```js
      entry: {
        	index: [
          		// 主动引入client.js
          		"./node_modules/webpack-hot-middleware/client.js",
          		// 无需引入webpack/hot/dev-server，webpack/hot/dev-server 通过 require('./process-update') 已经集成到 client.js模块
          		"./src/index.js",
        	]
      },
      ```
  
- webpack-dev-server：内置了 Webpack-dev-middleware 和 Express 服务器，利用 `eventSource` 实现 webpack-hot-middleware 逻辑
- 注意： `webpack-dev-server ` 功能已封装好，除 `webpack.config` 和命令行参数之外，很难定制型开发；在搭建脚手架时，利用 `webpack-dev-middleware`和`webpack-hot-middleware`，以及后端服务，可让开发更灵活；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001345.png" style="zoom:50%;" align=""/>

参考：https://juejin.im/post/6844904020528594957