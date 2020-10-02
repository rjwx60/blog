# 一、总结

甭说了，看图，注意模块化发展历史…

![截屏2020-10-01 下午4.08.43](https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201001160848.png)



## 1-1、模块化历史

看模块化规范演变的总结即可；



## 1-2、webpack原理

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





## 1-3、使用

- 文件指纹：filename+name—hash项目粒度chunkhash-chunk粒度contenthash文件粒度

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

- 原则
  - 单一原则：每个 Loader 只做一件事；
  - 链式调用：单一原则的延伸，Webpack 会按顺序链式调用每个 Loader；
  - 统一原则：应遵循 Webpack 制定的设计规则和结构(模块化)，输入与输出均为字符串，各个 Loader 完全独立(无状态)，即插即用；
- 参数获取：webpack.config.js 的 loader 的 options 内容(参数)，可用 webpack 自带插件 loader-utils 获取
- 案例
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

