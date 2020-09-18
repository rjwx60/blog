# 六、Plugin 编写

Loader 本质是函数，在该函数中对接收的内容进行转换，并返回转换后结果；因为 Webpack 只认识 JS，Loader 需要对其他类型资源进行转译预处理工作；

- 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性；

Plugin 就是插件，基于事件流框架 `Tapable`用以扩展 Webpack 功能；Webpack 运行的生命周期中会广播出许多事件，Plugin 可监听这些事件，并在合适时机通过 Webpack 提供的 API 改变输出结果，以扩展 webpack 功能；

- 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入；





## 6-2、plugin

### 6-2-1、基本

Webpack 就像工厂中的一条产品流水线，原材料经过 Loader 与 Plugin 的一道道处理，最后输出结果。

- 通过链式调用，按顺序串起一个个 Loader；

- 通过事件流机制，让 Plugin 可插入到整个生产过程中的每个步骤中；

  - 在编译的整个生命周期中，Webpack 会触发许多事件钩子，Plugin 可监听这些事件，根据需求在相应的时间点对打包内容进行定向的修改；

  - Webpack 事件流编程范式的核心是：基础类 <u>Tapable</u>，它是一种 <u>观察者模式</u> 的实现事件的订阅与广播，详看 **<u>*7-1-1-3*</u>**

  - ```js
    const { SyncHook } = require("tapable")
    
    const hook = new SyncHook(['arg'])
    
    // 订阅
    hook.tap('event', (arg) => {
    	// 'event-hook'
    	console.log(arg)
    })
    
    // 广播
    hook.call('event-hook')
    ```

  - Webpack 中两个最重要的类 Compiler 与 Compilation 便是继承于 Tapable，也拥有这样的事件流机制；

    - <u>*Compiler*</u>：可简单理解为 <u>*Webpack 实例*</u>，其包含当前 Webpack 中的所有配置信息，如 options， loaders, plugins 等信息，全局唯一，只在启动时完成初始化创建，随着生命周期逐一传递；
    - <u>*Compilation*</u>：可称为 <u>编译实例</u>，当监听到文件发生改变时，Webpack 会创建一个新的 Compilation 对象，开始一次新编译，其包含当前输入资源，输出资源，变化文件等，同时通过它提供的 API，可监听每次编译过程中触发的事件钩子；
    - <u>*两者区别*</u>：前者全局唯一，且从启动生存到结束；后者对应每次编译，每轮编译循环均会重新创建；



### 6-2-2、常用 Plugin

- UglifyJsPlugin：压缩、混淆代码；
- CommonsChunkPlugin：代码分割；
- ProvidePlugin：自动加载模块；
- html-webpack-plugin：加载 html 文件，并引入 css / js 文件；
- extract-text-webpack-plugin / mini-css-extract-plugin：抽离样式，生成 css 文件；
- DefinePlugin：定义全局变量；
- optimize-css-assets-webpack-plugin：CSS 代码去重；
- webpack-bundle-analyzer：代码分析；
- compression-webpack-plugin：使用 gzip 压缩 js 和 css；
- happypack：使用多进程，加速代码构建；
- EnvironmentPlugin：定义环境变量；



### 6-2-3、使用 Plugin

示例：最简单的 plugin：

```js
class Plugin{
  	// 注册插件时，会调用 apply 方法
  	// apply 方法接收 compiler 对象
  	// 通过 compiler 上提供的 Api，可以对事件进行监听，执行相应的操作
  	apply(compiler){
  		// compilation 是监听每次编译循环
  		// 每次文件变化，都会生成新的 compilation 对象并触发该事件
    	compiler.plugin('compilation',function(compilation) {})
  	}
}
```

注册 Plugin：

```js
// webpack.config.js
module.export = {
	plugins:[
		new Plugin(options),
	]
}
```



### 6-2-4、解析 Plugin



### 6-2-5、编写 Plugin

webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能；

Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好；[Plugin的API](https://www.webpackjs.com/api/plugins/) 

- Compiler 对象是 webpack 的编译器对象，compiler 对象会在启动 webpack 时被一次性地初始化，compiler 对象中包含了所有 webpack 可自定义操作的配置，例如 loader 的配置，plugin 的配置，entry 的配置等各种原始 webpack 配置等；还暴露了与 Webpack 整个生命周期相关的钩子；
- Compilation 对象代表了一次单一的版本 webpack 构建和生成编译资源的过程。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源以及新的 compilation 对象；一个 compilation 对象包含了 当前的模块资源、编译生成资源、变化的文件、以及 被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件(或称与模块和依赖有关的粒度更小的事件钩子)做自定义处理时选择使用；
- Compiler 和 Compilation 的区别在于： Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只代表一次新的编译；
- Tapable 库：webpack 的插件架构主要基于 Tapable 实现，Tapable 是 webpack 项目组的一个内部库，主要是抽象了一套插件机制；它类似于 NodeJS 的 EventEmitter 类，专注于自定义事件的触发和操作。Compilation 和 Compiler 都继承于 Tapable，除此之外, Tapable 允许你通过回调函数的参数访问事件的生产者；
- 注意：webpack 本质上是一种事件流机制，其工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 实例，Tapable 能够让开发者为 JS 模块添加并应用插件。 它可被其它模块继承或混合；

- 注意：插件需要在其原型上绑定 apply  方法，才能访问 compiler 实例；
- 注意：传给每个插件的 compiler 和 compilation对象均为同一引用，若在一个插件中修改了它们身上的属性，会影响后续插件；
- 注意：可找出合适的事件点去完成想要的功能，以构建自定义 plugin：
  - emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
  - watch-run 当依赖的文件发生变化时会触发
- 注意：异步事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住；

```js
// 基本形式
// 1、BasicPlugin.js 文件（独立模块）
// 2、模块对外暴露的 js 函数
class BasicPlugin{ 
  //在构造函数中获取用户为该插件传入的配置
  constructor(pluginOptions) {
    this.options = pluginOptions;
  } 
  //3、原型定义一个 apply 函数，并注入了 compiler 对象
  apply(compiler) { 
    //4、挂载 webpack 事件钩子（这里挂载的是 emit 事件）
    compiler.plugin('emit', function (compilation, callback) {
      // ... 内部进行自定义的编译操作
      // 5、操作 compilation 对象的内部数据
      console.log(compilation);
      // 6、执行 callback 回调
      callback();
    });
  }
} 
// 7、暴露 js 函数
module.exports = BasicPlugin;

// 总结：
// plugin 是一个独立模块，而模块对外暴露了一个 JS 函数，函数的原型(prototype) 上定义了一个注入 compiler 对象的 apply 方法，apply 函数中需要有通过 compiler 对象挂载的 webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象；若是异步编译插件则可拿到回调 callback(须在数据处理完成后执行 callback回调)；可自定义编译流程并处理 complition 对象的内部数据；

// 流程：
// Webpack 启动后，在读取配置的过程中会先执行 new BasicPlugin(options) 初始化一个 BasicPlugin 并获得其实例; 在初始化 Compiler 对象后，再调用 basicPlugin.apply(compiler) 为插件实例传入 compiler 对象。插件实例在获取到 compiler 对象后，就可以通过 compiler. plugin(事件名称, 回调函数)监听到 Webpack 广播的事件，并且可以通过 compiler 对象去操作 Webpack
```








### 6-2-5-1、知识再补充

**<u>*补充详看 Tapable、Webpack 构建流程 A 与 G*</u>**

```js
// 零、观察 plugin 调用形式，说明 plugin 极有可能是构造函数或类
new Plugin1({ msg: "TLP" })


// 一、构造函数形式
// 1. 创建一个构造函数
function Plugin1 (options) {
  this.options = options
}

// 2. 构建原型方法 apply
Plugin1.prototype.apply = function (compiler) {
  // 监听 done 事件 虽事件触发而触发
  compiler.plugin('done', () => {
    console.log(this.options.msg)
  })
}

// 3. 将自定义插件导出
module.exports = Plugin1;
// 1、插件如何调用，需不需要传递参数(对应 webpack.config.js 配置)；
// 2、创建一个构造函数/类，以此保证用它能创建一个个插件实例；
// 3、在构造函数原型对象上定义 apply 方法，并利用其中 compiler.plugin 注册自定义插件


// 二、亦可使用类形式
class Plugin1 {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    compiler.plugin('done', () => {
      console.log(this.options.msg)
    })
  }
}
module.exports = Plugin1;
// 打印了 TLP 并提示 Tapable.plugin 的形式的写法已被抛弃：Tapable.plugin is deprecated. Use new API on `.hooks` instead

// 三、将 Tappable.plugin 的形式改为 compiler.hooks.done.tap 形式
function Plugin1 (options) {
  this.options = options
}
Plugin1.prototype.apply = function (compiler) {
  compiler.hooks.done.tap('params', () => {
    console.log(this.options.msg)
  })
}
module.exports = Plugin1;

// compiler：一个扩展至 Tapable 的对象；
// compiler.hooks：compiler 对象属性，有不同的钩子函数；
// done：hooks 常用钩子之一，在一次编译完成后执行；
// tap：表示可注册同步的钩子和异步的钩子；
// 			此处的 done 属于异步 AsyncSeriesHook 类型的钩子，所以使用 tap 注册 done 异步钩子；

// 总结: 执行 new Plugin1() 时，会初始化一个插件实例，并调用其原型对象上的 apply 方法
```

**<u>*Tapable、compiler、compile、compilation*</u>**

[**<u>*Tapable*</u>**](https://github.com/webpack/tapable)

- Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好；
- Tapable 为 webpack 提供了统一的插件接口(钩子)类型定义，它是 webpack 的核心功能库、
- 总结：Tapable 是 webpack 用来创建钩子的库，为 webpack 提供了 plugin 接口；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001224.png" style="zoom:40%;" align="" />

Tapable 向外暴露了 9 个 `Hooks/钩子` 类、及 3 种注册/发布模式：tap、tapAsync、tapPromise，可用于为插件创建钩子；使用：[结合文档](https://www.webpackjs.com/api/compiler-hooks/#hooks)：比如，注册一个`compile`的钩子，根据官方文档，其属于 `SyncHook` 类型，则只能使用 `tap` 来注册；

<u>**Tapable-Hooks-Sync***</u>

- SyncHook --> 同步串行钩子，不关心返回值；
- SyncBailHook  --> 同步串行钩子，只要监听函数中有一个函数的返回值不为 null，则跳过剩下所有的逻辑；
- SyncLoopHook --> 同步循环，当监听函数被触发时，若该监听函数返回 true 时则这个监听函数会反复执行，若返回 undefined 则表示退出循环；
- SyncWaterfallHook --> 同步串行，上一个监听函数的返回值可以传给下一个监听函数；

<u>**Tapable-Hooks-Async***</u>

- AsyncParallel*：异步并发
  - AsyncParallelHook --> 异步并发，不关心监听函数的返回值；
  - AsyncParallelBailHook -->  异步并发，只要监听函数的返回值不为 null，则忽略后续监听函数执行，直接跳跃到 callAsync 等触发函数绑定的回调函数，然后执行此被绑定的回调函数；
- AsyncSeries*：异步串行；
  - AsyncSeriesHook --> 异步串行，不关心 callback 参数；
  - AsyncSeriesBailHook --> 异步串行，callback 参数不为 null，则忽略后续的函数，直接执行 callAsync 函数绑定的回调函数；
  - AsyncSeriesWaterfallHook --> 异步串行，上一个函数中的 callback(err, data) 第二个参数会传给下一个监听函数；

```js
// Tappable 简化模型，即发布订阅者模式
class SyncHook{
   constructor(){
      this.hooks = {}
   }
   
   tap(name,fn){
    if(!this.hooks[name])this.hooks[name] = []
     this.hooks[name].push(fn) 
   }      

   call(name){
     this.hooks[name].forEach(hook=>hook(...arguments))
   }
}
```

**<u>*Compiler*</u>**：一对象，代表了 ***完整的 webpack 环境配置***；webpack 在构建时：

- 首先，初始化参数：也即从配置文件 webpack.config.js 和 Shell 语句 "build": "webpack --mode development" 中去读取与合并参数；
- 然后，开始编译，也即将最终得到的参数初始化成此 Compiler 对象；
- 然后，加载所有配置的插件，执行该对象的 `run()` 方法开始执行编译；因此可将其理解为 Compiler 是 webpack 的支柱对象；

**<u>*Compilation*</u>**：一对象，表示***某一个模块的资源(编译生成的资源、变化的文件等)***，在使用 webpack 构建时可能会生成很多不同的模块；

- 总结：前者代表了整个构建的过程，后者代表构建过程中的某个模块；

- 注意：小写的 compile、compilation，实际就是 `Compiler` 对象下的两个钩子；

  - compile：一个新的编译(compilation)创建之后，钩入(hook into) compiler；

  - compilation：编译(compilation)创建之后，执行插件；

  - ```js
    Plugin1.prototype.apply = function (compiler) {
      compiler.hooks.compile.tap('params', () => {
        console.log(this.options.msg)
      })
      compiler.hooks.compilation.tap('params', () => {
        console.log(this.options.msg)
      })
    }
    ```

**<u>*四者关系(Tapable、compiler、compile、compilation)：*</u>**

1、compilation 与 compile 区别

```js
// 1、调用关系
function Plugin2 (options) {
  this.options = options
}
Plugin2.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('params2', () => {
    console.log('compile here')
  })
  compiler.hooks.compilation.tap('params2', () => {
    console.log('compilation here')
  })
}
module.exports = Plugin2;
// compile here
// compilation here
// compilation here

// 结果:
// compile 全程只调用1次
// compilation 若 dist 每生成 1文件且被使用到(index.html)就调用 1次




// 2、接收并打印参数
// compilation 接收2参数：chunk：表示当前模块 & filename：模块的名称

function Plugin2(options) {
  this.options = options;
}
Plugin2.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap("params3", (compilation) => {
    console.log("compile");
  });
  compiler.hooks.compilation.tap("params3", (compilation) => {
    console.log("compilation");
    // 对每一个 Compilation 对象调用它的 chunkAsset 钩子
    // 注意: 还有许多别的钩子，chunkAsset 只是其中一个，其属于 SyncHook 类型的钩子，只能用 tap 调用
    compilation.hooks.chunkAsset.tap("params3", (chunk, filename) => {
      console.log('chunk ', chunk);
      console.log('filename ', filename);
      // filename  __child-HtmlWebpackPlugin_0
      // filename  app.js
      // filename  main.js
    });
  });
};
module.exports = Plugin2;
```

2、Compiler 与 Compilation 区别

***Compiler 对象包含了 Webpack 环境所有的的配置信息***；包含 `options`，`hook`，`loaders`，`plugins` 等信息，此对象在 `Webpack` 启动时候被实例化，它是全局唯一，可简单地把它理解为 `Webpack` 实例；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001225.png" style="zoom:40%;" align="" />

***Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等***；当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建；`Compilation` 对象也提供了很多事件回调供插件做扩展；通过 `Compilation` 也能读取到 `Compiler` 对象；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001226.png" style="zoom:40%;" align="" />






### 6-2-5-2、编写原则

webpack 官方教程 [Writing a Plugin](https://webpack.js.org/contribute/writing-a-plugin/)：一个 webpack plugin由以下几个步骤组成：

- 一个 JS 类函数；
- 在函数原型 (`prototype`)  中定义一个注入`compiler` 对象的 `apply` 方法；
- `apply ` 函数中通过  `compiler` 插入指定的事件钩子，在钩子回调中拿到 compilation 对象；
- 使用 `compilation` 对象操纵修改 webapack 内部实例数据；
- 异步插件，数据处理完后使用 `callback` 回调；

Plugin 常用对象如下： 

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001227.png" style="zoom:50%;" align=""/>



### 6-2-5-1、file-list-plugin

```js
// file-list-plugin
// 功能: 每次 webpack 打包后，自动产生一个MD打包文件清单，上述记录打包后的文件夹 dist 中所有的文件的一些信息
// 使用: new FileListPlugin({ filename: 'fileList.md' })
// 实现: 利用 compiler 钩子的 emit Hooks
// 类型: AsyncSeriesHook
// 触发: 生成资源到 output 目录之前
// 参数: compilation

function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 1. 通过 compiler.hooks.emit.tapAsync() 触发生成资源到 output 目录前的钩子，回调函数会有两个参数：compilation、cb 回调
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
    // 2. MD 名称
    const fileListName = this.filename;
    // 3. 通过 compilation.assets 获取到所有待生成的文件，此处只获取其长度
    let len = Object.keys(compilation.assets).length;
    // 4. 定义 MD 文件的内容
    let content = `# 文件数量: ${len} 个\n\n`;
    // 5. 补充文件内容 filename
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`
    }
    // 6. 关键: 给即将生成的 dist 文件夹里添加一个新的资源，资源名称即 fileListName 变量
    compilation.assets[fileListName] = {
      // 7. 写入内容
      source: function () {
        return content;
      },
      // 8. 指定新资源的大小，用于 webpack 展示
      size: function () {
        return content.length;
      }
    }
    // 9. 由于使用 tapAsync 异步调用，所以必须执行回调函数 cb，否则打包后就只会创建一个空的 dist 文件夹
    cb();
  })
}
module.exports = FileListPlugin;



// 2、使用 tapPromise 重写
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  compiler.hooks.emit.tapPromise('FileListPlugin', compilation => {
    // 返回 Promise
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    }).then(() => {
      const fileListName = this.filename;
      let len = Object.keys(compilation.assets).length;
      let content = `# 文件数量: ${len} 个\n\n`;
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`;
      }
      compilation.assets[fileListName] = {
        source: function () {
          return content;
        },
        size: function () {
          return content.length;
        }
      }
      // 唯一区别: 回调函数中只需一个参数 compilation，不需要再调用一下 cb
    })
  })
}
module.exports = FileListPlugin;
```



### 6-2-5-2、watcher-plugin

```js
// watch-plugin 
// 功能: 开启观察者 watch 模式时，监听每一次资源的改动, 并将改动资源的个数以及改动资源的列表输出到控制台中
// 使用: 配置 package.json --watch 开启 watch 模式，new WatchPlugin()
// 实现: watchRun、watchClose
// 类型：AsyncSeriesHook
// 触发：监听模式下，一个新的编译(compilation)触发后，执行一个插件，但是是在实际编译开始之前；
// 参数：compiler
// 类型：SyncHook
// 触发：监听模式停止；
// 参数：无

function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    console.log("I'm watching you ...")
    // plugin 关键是对 compiler compiltation 对象的利用
    // 此处获取 compiler 的 watchFileSystem.watcher.mtimes 的属性，以获取变更文件信息
    // let mtimes = compiler.watchFileSystem.watcher.mtimes;
    // let mtimesKeys = Object.keys(mtimes);
    // if (mtimesKeys.length > 0) {
    //   console.log(`${mtimesKeys.length} file(s) has changed, at:`)
    //   console.log(mtimesKeys)
    //   console.log('-------------------------')
    // }

    // 此处获取 compiler 的 watchFileSystem.watcher.fileWatchers 的属性，以获取更多详细的信息
    const fileWatchers = compiler.watchFileSystem.watcher.fileWatchers;
    let paths = fileWatchers.map(watcher => watcher.path).filter(path => !/(node_modules)/.test(path))
    
    if (paths.length > 0) {
      console.log(`${paths.length} file(s) has changed, at:`)
      console.log(paths)
      console.log('-------------------------')
    }
    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log("No!! Don't kill me!!!")
  })

  // 监听 HTML 文件的变化
  compiler.hooks.afterCompile.tap('WatcherPlugin', (compilation) => {
    // 将 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
    // compilation.fileDependencies.push(filePath);
    console.log('compilation.fileDependencies: ', compilation.fileDependencies);
    // ...
  })
  
}
module.exports = WatcherPlugin;
```



### 6-2-5-3、show-plugin-list-plugin

```js
// ShowPluginListPlugin
// 功能: 检测使用过哪些 plugin
// 实现: compiler 对象：包含了 Webpack 环境所有的的配置信息，包含 options，hook，loaders，plugins 信息
// 实现: afterPlugins：设置完初始插件之后，执行插件

function ShowPluginListPlugin () {}

ShowPluginListPlugin.prototype.apply = function (compiler) {
  compiler.hooks.afterPlugins.tap('ShowPluginListPlugin', compiler => {
    const plugins = compiler.options.plugins;
    const pluginList = [];
    plugins.forEach(cv => {
      pluginList.push(cv.__proto__.constructor.name);
    })
    console.log('pluginList: ', pluginList);
  })
}

module.exports = ShowPluginListPlugin
```





### 6-2-5-X、coment-delete-plugin

实现功能如下：去除代码文件前的注释符合

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001228.png" style="zoom:50%;" align=""/>

```js
// 完整版
class MyPlugin {
    constructor(options) {
        this.options = options
        this.externalModules = {}
    }

    apply(compiler) {
      	// 注释匹配规则
        var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|(\/\*\*\*\*\*\*\/)/g
        // 事件监听
        compiler.hooks.emit.tap('CodeBeautify', (compilation)=> {
          	// 遍历 compilation.assets 资源文件并获取 source
            Object.keys(compilation.assets).forEach((data)=> {
              	// 目标文本
                let content = compilation.assets[data].source() 
                // 正则匹配去除注释
                content = content.replace(reg, function (word) { // 去除注释后的文本
                    return /^\/{2,}/.test(word) || /^\/\*!/.test(word) || /^\/\*{3,}\//.test(word) ? "" : word;
                });
              	// 更新文本
                compilation.assets[data] = {
                    source(){
                        return content
                    },
                    size(){
                        return content.length
                    }
                }
            })
        })
    }
}
module.exports = MyPlugin
```

- 第 1 步，使用 compiler 的 emit 钩子

  - emit 事件：将编译好的代码发射到指定的 stream 中触发，此钩子执行时，可从回调函数返回的 compilation 对象上拿到编译好的 stream

- 第 2 步，访问 compilation 对象

  - 每一次编译都会拿到新的 compilation 对象，compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中；

  - compilation 对象含有许多内部对象；

  - <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001229.png" style="zoom:30%;" align=""/>

  - 需要关注的是 compilation 中的 assets：优化所有 chunk 资源(asset)，资源(asset)会以 key-value 形式被存储在 `compilation.assets`。

  - ```js
    assetsCompilation {
      assets:
       { 'js/index/main.js':
          CachedSource {
            _source: [Object],
            _cachedSource: undefined,
            _cachedSize: undefined,
            _cachedMaps: {} } },
      errors: [],
      warnings: [],
      children: [],
      dependencyFactories:
       ArrayMap {
         keys:
          [ [Object],
            [Function: MultiEntryDependency],
            [Function: SingleEntryDependency],
            [Function: LoaderDependency],
            [Object],
            [Function: ContextElementDependency],
         values:
          [ NullFactory {},
            [Object],
            NullFactory {} ] },
      dependencyTemplates:
       ArrayMap {
         keys:
          [ [Object],
            [Object],
            [Object] ],
         values:
          [ ConstDependencyTemplate {},
            RequireIncludeDependencyTemplate {},
            NullDependencyTemplate {},
            RequireEnsureDependencyTemplate {},
            ModuleDependencyTemplateAsRequireId {},
            AMDRequireDependencyTemplate {},
            ModuleDependencyTemplateAsRequireId {},
            AMDRequireArrayDependencyTemplate {},
            ContextDependencyTemplateAsRequireCall {},
            AMDRequireDependencyTemplate {},
            LocalModuleDependencyTemplate {},
            ModuleDependencyTemplateAsId {},
            ContextDependencyTemplateAsRequireCall {},
            ModuleDependencyTemplateAsId {},
            ContextDependencyTemplateAsId {},
            RequireResolveHeaderDependencyTemplate {},
            RequireHeaderDependencyTemplate {} ] },
      fileTimestamps: {},
      contextTimestamps: {},
      name: undefined,
      _currentPluginApply: undefined,
      fullHash: 'f4030c2aeb811dd6c345ea11a92f4f57',
      hash: 'f4030c2aeb811dd6c345',
      fileDependencies: [ '/Users/mac/web/src/js/index/main.js' ],
      contextDependencies: [],
      missingDependencies: [] }
    ```

- 第 3 步，遍历 assets；

  - assets 数组对象中的 key 是资源名，在当前插件中，遍历 Object.key() 可获取：

    - ```js
      main.css
      bundle.js
      index.html
      ```

  - 调用 Object.source() 方法，得到资源的内容 

    - ```js
      compilation.assets[data].source() 
      ```

  - 使用正则去除注释

    - ```js
      Object.keys(compilation.assets).forEach((data)=> {
         let content = compilation.assets[data].source() 
         content = content.replace(reg, function (word) { 
             return /^\/{2,}/.test(word) || /^\/\*!/.test(word) || /^\/\*{3,}\//.test(word) ? "" : word;
         })
      });
      ```

- 第 4 步，更新 compilation.assets[data] 对象；

  - ```js
    compilation.assets[data] = {
        source(){
            return content
        },
        size(){
            return content.length
        }
    }
    ```

- 第 5 步，在 webpack 中引用插件

  - ```js
    const path  = require('path')
    const MyPlugin = require('./plugins/MyPlugin')
    
    module.exports = {
        entry:'./src/index.js',
        output:{
            path:path.resolve('dist'),
            filename:'bundle.js'
        },
        plugins:[
            ...
            new MyPlugin()
        ]
    }
    ```

    

参考：https://juejin.im/post/6844904022567043080