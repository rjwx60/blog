# 一、总结

甭说了，看图，注意模块化发展历史…

![截屏2020-10-01 下午4.08.43](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201001160848.png)



## 1-1、模块化历史

看模块化规范演变的总结即可；



## 1-2、webpack原理

**<u>下面是构建原理：</u>**

![image-20201002175028479](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002175028.png)

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- `初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- `开始编译`：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- `确定入口`：根据配置中的 entry 找出所有的入口文件
- `编译模块`：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- `完成模块编译`：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- `输出资源`：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- `输出完成`：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果；简单说

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

**<u>下面是打包和使用原理：</u>**

webpack 根据 `webpack.config.js` 中的入口文件，在入口文件里识别模块依赖，不管这里的模块依赖是用 CJS 写的，还是 ESM 规范写，webpack 会自动进行分析，并通过转换、编译代码，打包成最终文件；最终文件中的模块实现是基于 webpack 自实现的 webpack_require(es5 code)，所以打包后的文件可以跑在浏览器上；同时意味着：webpack 环境中，可以使用 es6 语法，也可以使用 CJS 语法，因为从 webpack2 开始内置了对 ES6、CJS、AMD 模块化语句的支持，webpack 会对各种模块进行语法分析，并作转换编译；针对异步模块：webpack 实现模块的异步加载方式有点像 JSONP 的流程；遇到异步模块时，使用 `__webpack_require__.e` 函数去将异步代码加载进来；该函数会在 html 的 Head 中动态增加 script 标签，src 指向指定的异步模块存放的文件；加载的异步模块文件会执行 `webpackJsonpCallback` 函数，将异步模块加载到主文件中；所以后续可以像同步模块一样，直接使用 `__webpack_require__("**.js")` 加载异步模块；

**<u>下面是 SourceMap 作用：</u>**

sourcemap 是将编译、打包、压缩之后的代码映射回源码的过程；打包压缩后，代码不具备良好的可读性，想要调试源码就需要 sourcemap，出错时控制台会直接显示原始代码出错的位置；map 文件只要不打开开发者工具，浏览器是不会加载；

**<u>下面是解析代码路径原理：</u>**

webpack 依赖 enhanced-resolve 来解析代码模块路径，过程类似 Node 的模块路径解析，但有很多自定义的解析配置；模块解析规则分三种：

*   解析相对路径
    - 查找想对当前模块的路径下是否有对应的文件或文件夹，是 文件 则直接加载；
    - 如果是文件夹则找到对应文件夹下是否有 `package.json` 文件；
    - 有的话就按照文件中的 `main` 字段的文件名来查找文件；
    - 没有 `package.json ` 或 `main ` 字段，则查找 `index.js` 文件；
*   解析绝对路径：直接查找对应路径文件，不建议使用，因为不同的机器会用绝对路径查找不到
*   解析模块名：查找当前文件目录，父级直至根目录下的 node_modules 文件夹，看是否有对应名称的模块

通过配置 `resolve.alias`、`resolve.extensions` 、`resolve.modules`等字段优化路径查找速度





## 1-3、webpack使用

- 文件指纹：filename+name：hash-项目粒度(image)；chunkhash-打包的chunk粒度(js)；contenthash-文件粒度(css)

- JS 的解析：babel-loader-cacheDirectory开启缓存—include+exclude减少被处理文件

- 作用域优化

- - resolve.alias 设置别名，来将原导入路径映射成一个新的导入路径；跳过耗时的递归解析操作，加快查找速度；
  - resolve.modules 默认值是 ['node_modules']，含义是先去当前目录的 node_modules 目录下去寻找模块，若无则向上逐级查询
  - resolve .extensions 可减少后缀尝试的可能性
  - resolve.mainFields 减少搜索步骤，若明确三方模块入口文件描述字段时，可将其设置得尽量少；
    - 而由于大多数三方模块均采用 main 字段去描述入口文件位置

- 代码压缩

- - webpack4 已内置压缩插件 uglifyjs-webpack-plugin，故无需手动进行 JS 压缩

- 多线程处理：HappyPack

- - HappyPack 将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程，从而发挥多核 CPU 性能
  - 将此 Threadloader 放置在其他 loader 前，而后的 loader 就会在一个单独的 worker 池(worker pool)中运行

- 动态链接库减少编译：HardSourceWebpackPlugin

- - 使用 HardSourceWebpackPlugin / DLL，作用等同过去的 DLLPlugin 和 DLLReferencePlugin，实现了拆分 bundles；
    - 即利用动态链接库减少编译，大大提升了构建的速度；
  - 而 Webpack5 中使用 HardSourceWebpackPlugin 实现，使用简单且一样的效果(webapck4 就可以用!!!!!)；

- 提取公共代码：SplitChunks

- - 提取公共代码 SplitChunks，过去(版本3)通过 CommonsChunkPlugin 实现，现在通过(版本4) SplitChunks 实现；注意下载资源数与资源大小的协调

- 分割代码懒加载按需加载

- - 符合 ECMAScript proposal 的 import() 语法(推荐)
  - 框架层面-路由懒加载-打包自动处理

**<u>影响打包速度环节与优化：</u>**

- 开始打包，需要获取所有的依赖模块
  - 搜索所有依赖模块，这需要占用一定的时间；
  - 故可优化搜索时间A；
- 解析所有依赖模块(解析成浏览器可运行的代码)
  - webpack 根据配置的 loader 解析相应文件。日常开发中我们需要使用 loader 对 js、css、图片、字体等文件进行转换处理，并且转换处理的文件的数量也是十分大。由于 JS 单线程使得操作不能并发处理，而是需要一个个文件处理；
  - 故可优化解析时间B；
- 将所有依赖模块打包到一个文件
  - 将所有解析完成的代码，打包到一个文件中，为使浏览器加载的包更小(减少白屏时间)，所以 webpack 会对代码进行优化；
  - JS 压缩是发布编译的最后阶段，时间耗费较久，因压缩 JS 需将代码解析成 AST，然后根据复杂规则去解析/处理 AST，最后将 AST 还原回 JS；
  - 故可优化压缩时间C；
- 二次打包
  - 有时只改动了项目中的一个小地方，所有文件都会重新打包，但大部分文件并没有变更；
  - 故可优化二次打包时间D；

**<u>A优化搜索时间</u>**：缩小文件搜索范围，减少不必要的编译工作

webpack 打包时，会从配置的 entry 出发，解析入口文件的导入语句，再递归解析；

在遇到导入语句时，webpack 会做两件事情：

*   根据导入语句去寻找对应的要导入的文件；
*   根据找到要导入文件的后缀，使用配置中的 loader 去处理文件。例如：使用了 ES Next 语法需要用到 babel-loader。

这两件事情一旦项目文件数量增多，速度会显著降低，所以虽然无法避免以上两件事情，但是可以尽量减少事情的发生以提高速度。

1. **优化 loader 配置**

   使用 loader 时可以通过 test、include、exclude 三个配置项来命中 loader 要应用规则的文件；

2. **优化 resolve.modules 配置**

   resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块，resolve.modules 的默认值是 ['node_modules']，含义是先去当前目录下的 ./node_modules 寻找，没有找到就去上一级目录中找，一路递归；

3. **优化 resolve.alias 配置**

   resolve.alias 配置项通过别名来把原导入路径映射成新的导入路径，减少耗时的递归解析操作；

4. **优化 resolve.extensions 配置**

   在导入语句中没带文件后缀时，webpack 会根据 resolve.extensions 自动带上后缀去尝试询问文件是否存在，所以配置 resolve.extensions 应注意：

   *   resolve.extensions 列表要尽可能小，不要把不存在的后缀添加进去；
   *   高频后缀名放在前面，以便尽快退出超找过程；
   *   在写代码时，尽可能带上后缀名，从而避免寻找过程。

5. **优化 resolve.mainFields 配置**

   有一些第三方模块会针对不同环境提供几分代码，路径一般会写在 package.json 中。

   webpack 会根据 mainFields 中配置去决定优先采用哪份代码，只会使用找到的第一个。

6. **优化 module.noParse 配置**

   module.noParse 配置项可以让 webpack 忽略对部分没采用模块化的文件的递归处理，这样做的好处是能提高构建性能。原因是部分年代比较久远的库体积庞大且没有采用模块化标准，让 webpack 去解析这些文件没有任何意义



**<u>B优化解析时间</u>**：运行在 Node.JS 上的 webpack 是单线程模式；即 webpack 打包只能逐个文件处理，当文件数量比较多时，打包时间就会比较漫长，故需开启多线程来提高解析速度；thread-loader(webpack4 官方推荐)

使用：将此 loader 放在其他 loader 前，放置在其之后的 loader 就会在一个单独的 worker【worker pool】池里运行，一个 worker 就是一个 Node.JS 进程，每个单独进程处理时间上限为 600ms，各个进程的数据交换也会限制在这个时间内。

```typescript
import { Configuration } from 'webpack'

const config: Configuration = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader']
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'thread-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
```

注意： 由于工作原理限制，thread-loader 需放在 style-loader 之后，因 thread-loader 后的 loader 没法存取文件，也没法获取 webpack 的选项配置；

官方说每个 worker 大概都要花费 600ms，为防止启动 worker 时的高延迟，提供了对 worker 池的优化：预热机制；另外请仅在耗时的 loader 上使用；

```typescript
import threadLoader from 'thread-loader'

const jsWorkerPool = {
  // 产生的 worker 数量，默认是cpu核心数 - 1
  // 当 require('os').cpus() 是 undefined时则为 1
  worker: 2, 
  
  // 闲置时定时删除 worker 进程
  // 默认为 500ms
  // 可以设置为无穷大，监视模式(--watch)下可以保持 worker 持续存在
  poolTimeout: 2000 
}

const cssWorkerPool = {
  // 一个 worker 进程中并行执行工作的数量
  // 默认为 20
  wokerParallelJobs: 2,
  poolTimeout: 2000
}

threadLoader.warmup(jsWorkerPool, ['babel-loader'])
threadLoader.warmup(cssWorkerPool, ['css-loader'])
```





**<u>C优化压缩时间</u>**：webpack 4 默认使用 terser-webpack-plugin 压缩插件压缩优化代码，该插件使用 terser 来缩小 JS。

terser：用于 ES Next 的 JS 解析器、mangler/compressor(压缩器)工具包；

启动多进程：使用多进程来并行运行提高构建速度，默认并发数量为 os.cspus().length - 1

```typescript
import { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

const config: Configuration = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
}
```



**<u>D优化二次打包时间</u>**：将改动少的文件缓存起来，二次打包直接读取缓存，显著提升打包时间；

使用 webpack 缓存方法有几种，例如 cache-loader，HardSourceWebpackPlugin 或 babel-loader 的 cacheDirectory 标志；

注意：这些缓存方法都有启动开销，重新运行期间在本地节省的时间很大，但是初次启动实际上会更慢；

cache-loader：和 thread-loader 用法一样，在性能开销比较大的 loader 之前添加此 loader，以将结果缓存到磁盘

``` typescript
import { Configuration } from 'webpack'
import { resolve } from 'path'

const config: Configuration = {
  module: {
    rules: [
      {
        test: /\.js$/
        use: ['cache-loader', ...loaders],
    		include: resolve('src')
      }
    ]
  }
}
```

HardSourceWebpackPlugin：第一次构建将花费正常时间、第二次构建将显著加快（大约提升 90% 的构建速度）

```typescript
import { Configuration } from 'webpack'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'

const config: Configuration = {
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```







## 1-4、HMR 原理

原理：webpack 配合 `webpack-dev-server` 进行应用开发的模块热更新流程图：

- 注意：此图表示：<u>修改代码到模块热更新完成的一个周期</u>；
- 注意：框色功能区域：
  - 绿框：表示 webpack 代码控制区域；
  - 蓝框：表示 webpack-dev-server 代码控制的区域；
  - 红框：表示文件系统，文件修改后的变化就发生在这；
  - 青框：表示应用本身；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908001312.png" style="zoom:50%;" align=""/>

解释1：

- 当修改一或多个文件时；
- 文件系统接收更改并通知 webpack (webpack监听)；
- webpack 重新编译构建一或多个模块，并通知 HMR Server 进行更新；
- HMR Server 使用 websocket 通知 HMR runtime 需要更新，HMR runtime 通过 Ajax 请求、JSONP 分别获取更新文件列表与更新模块代码；
- HMR runtime 根据配置决定更新替换旧模块亦或刷新页面，若替换出错则回退刷新页面；

解释2：

`hot-module-replacement-plugin` 包给 `webpack-dev-server(WDS)` 提供了热更新的能力，它们两者是结合使用的，单独写两个包目的是使功能解耦；

- `WDS` 作用是：提供 `bundle server` 的能力，即生成的 `bundle.js` 文件可通过 `localhost://xxx` 形式访问，并提供浏览器的自动刷新—livereload；
- `hot-module-replacement-plugin` 作用是：提供 `HMR runtime`，并且将 `runtime` 注入到 `bundle.js` 代码中；一旦磁盘文件发生修改，则 `HMR server` 将有修改的 JS 模块信息通过 `websocket` 发送给 `HMR runtime`，然后 `HMR runtime` 去局部更新页面的代码，实现无刷新浏览器更新；

解释3：

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









## 1-5、Loader

Webpack 基于 *Node*，故只能识别 JS 模块，无法加载其他类型文件，因此需要 对不同类型文件的 JS 转换器，loader 负责此功能

**<u>*与 plugin 区别：*</u>**

- loader：转换器，匹配需要处理的文件类型后，将 A 文件进行转译成为 B 文件；
  - 比如：将 A.less 转换为 A.css，进行单纯的、文件转换过程；
- plugin：扩展器，丰富 webpack 自身功能，针对的是 loader 结束后，webpack 打包的整个过程；
  - 注意：plugin 并不直接操作文件，而是基于事件机制工作，监听 webpack 打包过程中事件，执行广泛任务；

**<u>*常用 Loader*</u>**

- file-loader：加载文件资源，如字体/图片等，具有移动/复制/命名等功能；
- url-loader：常用于加载图片，可将小图片直接转换为 *Date* Url，减少请求；
- babel-loader：加载 JS / JSX 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题；
- style-loader：将 css 代码以 `<style>` 标签形式插入 html 中；
- css-loader：分析 @import 和 url()，引用 css 文件与对应的资源；
- postcss-loader：用于 css 的兼容性处理，还具有 添加前缀、单位转换 等功能；
- less-loader / sass-loader：将 css 预处理器转为 css；

**<u>*loader 解析*</u>**

- url-loader：文件大小小于 limit 数值时才进行base64编码，否则将直接调用 file-loader
  - new Buffer(content).toString("base64")
- file-loader：告诉 webpack 创建文件，文件名和内容，这样webpack就会帮你在 dist 目录下创建一个对应的文件
  - this.emitFile(url, content);

**<u>*loader编写*</u>**

- 三大原则：
  - 单一原则：每个 Loader 只做一件事；
  - 链式调用：单一原则的延伸，Webpack 会按顺序链式调用每个 Loader；
  - 统一原则：应遵循 Webpack 制定的设计规则和结构(模块化)，输入与输出均为字符串，各个 Loader 完全独立(无状态)，即插即用；
- 参数获取：webpack.config.js 的 loader 的 options 内容(参数)，可用 webpack 自带插件 loader-utils 获取
- 案例展示：
  - my-babel-loader 将 ES6 代码转换为 ES5 代码；
  - babel.transform(source, options);
  - html-minify-loader 压缩html文本
  - new Minimize(opts);



## 1-6、Plugin

Webpack 就像工厂中的一条产品流水线，原材料经过 Loader 与 Plugin 的一道道处理，最后输出结果。

- 通过链式调用，按顺序串起一个个 Loader；
- 通过事件流机制，让 Plugin 可插入到整个生产过程中的每个步骤中；
  - 在编译的整个生命周期中，Webpack 会触发许多事件钩子，*Plugin* 可监听这些事件，根据需求在相应的时间点对打包内容进行定向的修改；
  - Webpack 事件流编程范式的核心是：基础类 Tapable，它是一种 观察者模式 的实现事件的订阅与广播

![image-20201002180435727](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002180435.png)

**<u>*两个最重要的实现类：均继承于 Tapable，也拥有这样的事件流机制；*</u>**

- Compiler：可简单理解为 Webpack 实例，其包含当前 Webpack 中的所有配置信息，如 options， loaders, plugins 等信息，全局唯一，只在启动时完成初始化创建，随着生命周期逐一传递；
- Compilation：可称为 编译实例，当监听到文件发生改变时，Webpack 会创建一个新的 Compilation 对象，开始一次新编译，其包含当前输入资源，输出资源，变化文件等，同时通过它提供的 API，可监听每次编译过程中触发的事件钩子；
- 两者区别：前者全局唯一，且从启动生存到结束；后者对应每次编译，每轮编译循环均会重新创建；

**<u>*常用 Plugin*</u>**

- UglifyJsPlugin：压缩、混淆代码；
- CommonsChunkPlugin：代码分割；
- html-webpack-plugin：加载 html 文件，并引入 css / js 文件；
- optimize-css-assets-webpack-plugin：*CSS* 代码去重；
- webpack-bundle-analyzer：代码分析；
- compression-webpack-plugin：使用 gzip 压缩 js 和 css；
- happypack：使用多进程，加速代码构建；

**<u>*plugin 编写*</u>**

核心：通过上述两个对象获取构建处理内容与webpack相关配置信息，并通过 tappable 监听构建事件，并作出相关处理

- Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好；
- Tapable 为 webpack 提供了统一的插件接口(钩子)类型定义，它是 webpack 的核心功能库、
  - Tapable 向外暴露了 9 个 Hooks/钩子 类、及 3 种注册/发布模式：tap、tapAsync、tapPromise，可用于为插件创建钩子；使用请结合[文档](https://www.webpackjs.com/api/compiler-hooks/#hooks)：比如，注册一个compile的钩子，根据官方文档，其属于 SyncHook 类型，则只能使用 tap 来注册；

![image-20201002180758811](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002180758.png)

- compiler.hooks.emit.tapPromise('FileListPlugin', *compilation* => {
- compiler.hooks.emit.tapAsync('FileListPlugin', (*compilation*, *cb*) => {
- compiler.hooks.watchRun.tapAsync('WatcherPlugin', (*compiler*, *cb*) => {
- *compiler*.hooks.watchClose.tap('WatcherPlugin', () => {
- *compiler*.hooks.afterCompile.tap('WatcherPlugin', (*compilation*) => {

![image-20201002181007722](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201002181007.png)

- 总结：Tapable 是 webpack 用来创建钩子的库，为 webpack 提供了 plugin 接口；

