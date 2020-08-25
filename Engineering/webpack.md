---
typora-root-url: ../Source
---



### 一、基本介绍

#### 1-1、基本

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

webpack 是 JS 的 **模块打包工具** (module bundler)，通过分析模块间的依赖，最终将所有模块打包成一份或者多份代码包 (bundler)，供 HTML 直接引用。实质上，Webpack 仅仅提供了 **打包功能** 和一套 **文件处理机制**，然后通过生态中的各种 Loader 和 Plugin 对代码进行预编译和打包；因此 Webpack 具有高度的可拓展性，能更好的发挥社区生态的力量。

#### 1-2、模块打包原理

Webpack 实际上为每个模块创造了一个可导出和导入的环境，但本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致；



### 二、基础用法

#### 2-1、环境搭建与配置

初始化：`npm init -y`；

- 注意：-y 是默认勾选确认；


安装包：`npm install webpack webpack-cli --save-dev`；

- 注意：webpack4 将 webpack核心和脚手架进行分离，故需两者均进行安装；


始运行：或 `./node_modules/.bin/webpack` 构建，或 `npm scripts` 运行；

- 原理：模块的局部安装，会在 node_modules/.bin 目录下创建软链；当执行 package.json 中的 script 时，则会按照一定顺序寻找命令对应位置，本地 node_modules/.bin 路径就在此寻找清单中；
- 所以：无论是全局亦或局部安装的 Webpack，均无需写详细路径；

配置项：或自行新建 `webpack.config.js` 或执行命令 `webpack --config` 指定配置文件名；

示例如：配置文件基本配置如下：

<img src="/Image/Engineering/1.png" style="zoom:45%;" align="left"/>









#### 2-2、核心概念

##### 2-2-1、entry

entry 用于指定打包入口；<u>**单入口是字符串形式，单页应用、多入口是键值对形式、多页应用；**</u>

<img src="/Image/Engineering/2.png" style="zoom:50%;" align="left"/>

- 注意：其中插件：`npm i html-webpack-plugin --save-dev`
- 注意：若提示 `command not found`，请手动输入上述命令；
- 注意：是 rules 而非 rule；
- 注意：`output should be an object`；
- 注意：`__dirname` 指的是当前命令运行目录；



##### 2-2-2、output

output 用于指定编译结果输出位置(磁盘)；

<img src="/Image/Engineering/3.png" style="zoom:50%;" align="left"/>

- 注意：多入口输出时需通过占位符确保文件名称的唯一和区分，比如上面的 [name]；



##### 2-2-3、loaders

 loader 使得 webpack 有能力调用外部的脚本或工具，实现对不同格式的文件的处理；

- 比如：分析转换 scss 为 css、JS Babel 文件、JSX 文件转 JS 文件的 loaders；
- 详情：https://segmentfault.com/a/1190000006178770#articleHeader3

本质：loaders 是用于进行某种操作的函数；**<u>loaders 本质是函数，接受源文件作为参数，并返回转换结果</u>**；

意义：webpack 只支持 JS、JSON 类型，通过 loaders 可将 webpack 无法解析的文件，转为有效模块，使其能识别并添加到依赖中；

配置：Loaders 需单独安装，<u>且需在配置文件中的 modules 关键字下进行配置</u>:

```js
module：{
	rules：[
		{
			test：/\.txt$/,
			use：'raw-loader'
		}
	]
}
// test：正则表达式，用以匹配 loaders 所处理文件的拓展名；
// loader：loader 名称；
// include/exclude：必须处理的文件(文件夹) / 无需处理的文件(文件夹)；
// query：为 loaders 提供额外的设置项；
```

常见 loader 及功能示意：

- raw-loader：加载文件原始内容(utf-8)
- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- svg-inline-loader：将压缩后的 SVG 内容注入代码中
- image-loader：加载并且压缩图片文件
- json-loader：加载 JSON 文件（默认包含）
- handlebars-loader: 将 Handlebars 模版编译成函数并返回
- babel-loader：把 ES6 转换成 ES5
- ts-loader：将 TypeScript 转换成 JavaScript
- awesome-typescript-loader：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
- sass-loader：将SCSS/SASS代码转换成CSS
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
- eslint-loader：通过 ESLint 检查 JavaScript 代码
- tslint-loader：通过 TSLint检查 TypeScript 代码
- mocha-loader：加载 Mocha 测试用例的代码
- coverjs-loader：计算测试的覆盖率
- vue-loader：加载 Vue.js 单文件组件
- i18n-loader: 国际化
- cache-loader: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里




##### 2-2-4、plugin

plugin 用于增强 webpack 功能，常用于打包输出的 JS 文件优化、资源管理、环境变量的注入，loader 无法实现 plugin 均可实现；

- 注意：作用于整个构建过程，即构建开始到结束均可使用 plugin；
- 补充：https://segmentfault.com/a/1190000006178770#articleHeader6

常见 plugin 及功能示意：

- CommonsChunkPlugin：将 chunks 相同的模块代码提取成公共 Js；
- CleanWebpackPlugin：清理构建目录；
- ExtractTextWebpackPlugin：将 CSS 从 bunlde 文件提取成一个独立的 CSS 文件；
- CopyWebpackPlugin：将文件或文件夹拷贝到构建的输出目录；
- HtmlWebpackPlugin：创建 html 文件去承载输出的 bundle；
- UglifyjsWebpackPlugin：压缩 JS；
- ZipWebpackPlugin：将打包出的资源生成一个 zip 包；

- define-plugin：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
- ignore-plugin：忽略部分文件
- html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
- web-webpack-plugin：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
- uglifyjs-webpack-plugin：不支持 ES6 压缩 (Webpack4 以前)
- terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
- webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
- serviceworker-webpack-plugin：为网页应用增加离线缓存功能
- clean-webpack-plugin: 目录清理
- ModuleConcatenationPlugin: 开启 Scope Hoisting
- speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
- webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)

##### 2-2-4-1、HtmlWebpackPlugin

会自动在 `dist` 文件夹下生成 `index.html`，并将输出的 `js` 都引入进去；而配置 template 后，会依据所配置的 index.html 模板，生成一个自动引用打包后 JS 文件的新 index.html(此举常用于为文件添加 hash 值)；在编译过程中，插件会依据此模板生成最终的 html 页面，会自动添加所依赖的 css, js，favicon等文件；

使用如下：引入模板文件，自动生成：index.html 文件；常用配置项如下：

- filename：默认为 `index.html`，指定生成的 `index.html` 路径和名称；
- template：默认为 '', 指定自定义模版 index.html 的路径；
- favion：指定生成 `index.html` 的图标，若使用了 `template`，此属性亦可不用；

```js
// template.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>
<body></body>
</html>

// Ex1
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Output Management",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};


// Ex2
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Output Management",
      filename: "admin.html",
      template: "src/template.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

##### 2-2-4-2、BannerPlugin

```js
// 版权提示插件；
plugins：[
	new webpack.BannerPlugin('版权所有，翻版必究')
]
```

##### 2-2-4-3、CleanWebpackPlugin

安装：`npm i --save-dev clean-webpack-plugin`

每次构建之后, 都会生成 `dist` 文件夹，但若有历史遗留下来的文件，它不会自动清理掉，可利用此插件在每次构建前清理`/dist`文件夹；

注意：若安装的 `clean-webpack-plugin` 是 `3.0`  以上，则须通过 `const { CleanWebpackPlugin } = require('clean-webpack-plugin')` 方式引用，并须用 `cleanAfterEveryBuildPatterns` 来配置要清理的文件夹；

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"], // 这个是非必填的
    }),
    new HtmlWebpackPlugin({
      title: "Webpack Output Management",
      filename: "assets/admin.html",
      template: "src/index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```





##### 2-2-4-X、其他

待定整理，备忘录…



##### 2-2-5、mode

Mode 乃 Webpack4 新概念，用以指定当前构建环境，以使用相对应的内置函数、参数；

Mode 的内置函数功能与选项：production(默认)、development、none；

<img src="/Image/Engineering/4.png" style="zoom:50%;" align="left"/>



#### 2-3、基础相关

##### 2-3-1、解析 JSX、ES6

首先安装解析包：`npm i @babel/preset-env -D`、`npm i @babel/preset-reat -D`；

其中：<u>JSX 解析可在 ES6 基础上在 `.babelrc` 文件上增加 `@babel/preset-reat` 即可</u>；

- 注意：babel-loader 依赖 babel，此须配置 .babelrc 文件；
- 注意：babel 有两个重要概念：presets(一系列 babel plugin 集合)、plugin(一 plugin 对应一功能)；

```js
// webpack.config.js
module：{
	rules：[
		{
			test：/\.js$/,
			use：'babel-loader'
		}
	]
}

// .babelrc
{
  "presets"：[
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```



##### 2-3-2、解析 Css、Sass、Less

首先安装解析包：`npm i style-loader css-loader less less-loader sass sass-loader -D`；[补充](https://segmentfault.com/a/1190000006178770#articleHeader5) 和 [深入](https://github.com/css-modules/css-modules)

- css-loader：用于加载 css 文件，并转成 commonjs 对象，能够使用类似 @import 和 url(...) 的方法实现 require() 功能；
- style-loader：将所有计算后的样式，通过 `<style>` 标签插入 `head` 中，二者组合能将样式表，嵌入 webpack 打包后的 JS 文件中；

```js
module：{
	rules：[
		{
      // webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader
			test：/\.css$/,
			use：[
      	// loader 执行顺序是从右往左，从下往上的
				'style-loader', 'css-loader'
			]
		},
		{
			test：/\.less$/,
			use：[
				'style-loader', 'css-loader', 'less-loader'
			]
		}
	]
}
```



##### 2-3-2-1、模块 Css Modules

CSS modules 不是将 CSS 改造成编程语言，而只是加入 <u>局部作用域</u> 和 <u>模块依赖</u>，即将 JS 模块化思想引入 CSS 中，通过 CSS 模块，所有的类名，动画名默认都只作用于当前模块；可保证某个组件的样式，不会影响到其他组件；

Webpack 对 CSS 模块化有很好支持，只需在 CSS loader 中配置，随后即可直接将 CSS 类名传递到组件代码中，有效避免全局污染；

- 注意：若出现CSS 重复压缩问题，请看[问题九](https://blog.csdn.net/sinat_17775997/article/details/61924901)

```js
module：{
	rules：[
		{
			test：/\.css$/,
			use：[
				'style-loader',
				{
					loader："css-loader",
					options：{
            // 启用 css module
						module：true,
            // 指定 css 类名格式
						localIdentName：'[name]__[local]--[hash:base64:5]'
					}
				}
			]
		}
	]
}

// 1、局部作用域
module：{
	rules：[
		{
			test：/\.css$/, 
      loader："style-loader!css-loader?modules" 
      // 查询参数 modules，表示打开 CSS Modules 功能
		}
	]
}

// 2、全局作用域
// CSS Modules 允许使用 :global(.className) 语法，声明一个全局规则, 凡是这样声明的 class，都不会被编译成哈希字符串;
// CSS Modules 还提供一种显式的局部作用域语法 :local(.className)，等同于 .className
:global(.title) {
	color：green;
}

// 3、定制哈希类名
// css-loader 默认的哈希算法是 [hash:base64]; 会将 .title 编译成 ._3zyde4l1yATCOkgn-DBWEL 这样的字符串
module：{
   rules：[
    {
       test：/\.css$/,
       loader："style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
       // demo03-components-App---title—GpMto
    },
   ]
}

// 4、Class 组合
// CSS Modules 中，一个选择器可继承另一个选择器的规则，这称为"组合-composition"
.className {
 background-color：blue;
}

.title {
 composes：className;
 color：red;
}
// 编译后结果
// <h1 class="_2DHwuiHWMnKTOYG45T0x34 _10B-buq6_BEOTOl9urIjf8">
._2DHwuiHWMnKTOYG45T0x34 {
   color：red;
}
._10B-buq6_BEOTOl9urIjf8 {
   background-color：blue;
}

// 5、与其他模块的 Class 组合
// another.css
.className {
   background-color：blue;
}
// app.css
.title {
   composes：className from './another.css';
   color：red;
}

// 6、输入变量使用
// CSS Modules 支持使用变量，但需安装 PostCSS 和 postcss-modules-values 
// 把 postcss-loader 加入 webpack.config.js
var values = require("postcss-modules-values");
module.exports = {
  entry：__dirname + "/index.js",
  output：{
    publicPath："/",
    filename："./bundle.js",
  },
  module：{
    loaders：[
      {
        test：/\.jsx?$/,
        exclude：/node_modules/,
        loader："babel",
        query：{
          presets：["es2015", "stage-0", "react"],
        },
      },
      {
        test：/\.css$/,
        loader："style-loader!css-loader?modules!postcss-loader",
      },
    ],
  },
  postcss：[values],
};
// 接着，在 colors.css 里面定义变量：
@value blue：#0c77f8;
@value red：#ff0000;
@value green：#aaf200;

// App.css 可以引用这些变量：
@value colors："./colors.css";
@value blue, red, green from colors;
```





##### 2-3-3、解析 Image、Font

首先安装解析包：`npm i file-loader -D`；

- file-loader：可用于处理文件、亦可用于处理字体，[file-loader-options设置](https://www.webpackjs.com/loaders/file-loader/)
  - `name` 的 `[name]` 表示使用文件的原始名称、 `[ext]` 表示文件的原始类型、 `[hash]` 表示以哈希值命名、 `[path]` 表示资源相对于 `context`路径等；
  - `context` 默认为 `webpack.config.js`
- url-loader：可用于处理文件、亦可用于处理字体、但还可进行较小资源文件自动转 base64 的配置；
  - 注意：url-loader 内部使用了 file-loader；
  - 注意：一般情况下，link 中 css 也会被处理，若无处理，可参考：[问题八](https://blog.csdn.net/sinat_17775997/article/details/61924901)

```js
module：{
	rules：[
		{
			test：'/\.(png|svg|jpg|gif)$/',
			use：[
        {
      		// 将打包之后的图片存放到 images 文件夹下, 并且命名为图片的原始名称
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
          },
        },
			]
		},
		{
			test：'/\.(woff|woff2|eot|ttf|otf)$/',
			use：[
				'file-loader'
			]
		},
		{
			test：'/\.(png|svg|jpg|gif)$/',
			use：[
				{
					loader：'url-loader',
					options：{
						limit：10240
					}
				}
			]
		}
	]
}
```



##### 2-3-4、文件监听

文件监听即当发现源码发生变化时，自动重新构建出新的输出文件；

**<u>文件监听原理</u>**：轮询判断文件的最后编辑时间是否发生变化，若发生变化，不会立即告知监听者，而是先缓存，等待 aggregateTimeout，等待时间内，若有其他的文件也发生了变化，则会将变化的文件列表一并修改，生成到 bundle 文件中；

文件监听开启监听方式如下：

- 方式1：启动 webpack 时，带上 `--watch` 参数，或在 npm script 中的 watch 增加 --watch 后缀；
- 方式2：配置 webpack.config.js 时，设置 watch：true；

- 注意：开启 ignored 可提高监听性能；

```js
module.export = {
  // 默认 false 不开启
	watch：true,
  // 开启后设置 options 才有意义
	watchOptions：{
    // 默认为空，不监听的文件或文件夹，支持正则
		ignored：/node_modules/,
    // 监听到变化后会等待 300ms 再去执行，默认 300
		aggregateTimeout：300,
    // 判断文件是否发生变化是通过不停询问系统指定文件是否发生变化实现的，默认每秒询问 1000 次
		poll：1000
	}
}
```

劣势：每次均需手动刷新浏览器；





##### 2-3-5、热更新机制

即 webpack-dev-server—WDS，安装：`npm install --save-dev webpack-dev-server`

- 优势：无需刷新浏览器、不输出文件而是存放内存中，不涉及 IO 操作，构建速度高；

- 注意：切换至 development mode；

- ```json
  // package.json
  "scripts"：{
  	"build"："webpack",
  	"dev"："webpack-dev-server --open"
  }
  ```



##### 2-3-5-1、监听方式A

配合 HotModuleReplacementPlugin 插件使用，补充：

- https://segmentfault.com/a/1190000006178770#articleHeader3
- https://webpack.js.org/configuration/dev-server/

```js
// webpack.config.js
module.export = {
	// ...
	plugin：[
		new webpack.HotModuleReplacementPlugin()
	],
	devServer：{
    // 本地服务器所加载的页面所在的目录
		contentBase：'./dist',
    // 不跳转
    historyApiFallback：true,
    // 实时刷新
    inline：true
	}
}
```

<img src="/Image/Engineering/5.png" style="zoom:60%;" align="left"/>



##### 2-3-5-2、监听方式B

使用 webpack-dev-middleware，适用于更为灵活适合定制场比如 koa、express：WDM 将 webpack 输出的文件传输给服务器

<img src="/Image/Engineering/6.png" style="zoom:60%;" align="left"/>



##### 2-3-5-3、热更新原理与过程

<img src="/Image/Engineering/7.png" style="zoom:70%;" align="left"/>

- 其中：Bundle Server 作用示例，在浏览器通过 localhost 访问文件；
- 其中：HMR Runtime 由初次编译时一并打包进浏览器端的 bundlejs (注入)，如此浏览器端的 bundlejs 可通过 webSocket 与 webpack dev Server 进行连接通信，发生变化时及时改变；

热更新过程：

- 启动：在文件系统中进行，将初始代码经由 webpackCompiler 编译打包，将结果传输给 Bundle Server 服务端，从而让客户端可访问，对应上图的 1 2 A B；
- 更新：实质为文件系统变化，也同样须经过 webpackCompiler 编译，并将结果传给服务端 HMR Server，从而得知变化资源，通常以 JSON 数据传输通知客户端 HMR Runtime，更新代码并不刷新浏览器进行变化，对应上图的 1 2 3 4 5；



##### 2-3-5-4、WDS 相关配置及 proxy 使用

补充：[webpack-dev-server 相关配置 及 proxy 配置使用](https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options) ，及 webpack-dev-serve 配置问题，请看[问题十一](https://blog.csdn.net/sinat_17775997/article/details/61924901)

<img src="/Image/Engineering/8.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/9.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/10.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/11.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/12.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/13.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/14.png" style="zoom:50%;" align="left"/>



##### 2-3-6、文件指纹策略

文件指纹即打包后输出的文件名的后缀；

作用：用于版本管理、修改文件替换，未修改文件则使用浏览器缓存、也可用于控制版本更新；

<img src="/Image/Engineering/15.png" style="zoom:50%;" align="left"/>

策略：chunkhash、contenthash、hash：

- `Hash`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 就会更改；
- `Chunkhash`：和 webpack 打包的 chunk 相关，不同的 entry 会生成不同的 chunkhash 值；
- `Contenthash`：根据文件内容定义 hash，文件内容不变，则 contenthash 不变；
  - 注意：contenthash 用于 css 文件、chunkhash 用于 js 文件；
  - 注意：若 hash 与 chunkhash 造成的问题，请看[问题十二](https://blog.csdn.net/sinat_17775997/article/details/61924901)；
  - 注意：chunk 模式无法与 WDS 共用，即无法与 hotModule 共用，须切换至 production mode，去除热更新；

##### 2-3-6-1、JS 文件指纹设置

使用 [chunkhash]，设置 output filename

```js
// webpack.config.js
module.export = {
	// ...
	output：{
		filename：'[name][chunkhash:8].js',
    path：__dirname + '/dist'
	},
  // ...
  output：{
    filename：'[name]_[chunkhash:8].js',
    path：path.join(__dirname, 'dist')
	}
}
```

补充：https://juejin.im/post/5a068c2b5188255851322b8c#heading-14

注意：关于浏览器缓存，若版本更新后，客户端没有清除缓存，同时缓存还未过期的情况下，无法获取最新资源，此时可通过 hash 值来进行版本控制；

```js
// webpack.config.js
module.export = {
	// ...
	output：{
		filename：'[name][hash].js',
    path：__dirname + '/dist'
	}
}
```



##### 2-3-6-2、图片文件指纹设置

占位符名称及含义

- ext     资源后缀名
- name    文件名称
- path    文件的相对路径
- folder  文件所在的文件夹
- contenthash   文件的内容hash，默认是md5生成
- hash         文件内容的hash，默认是md5生成
- emoji        一个随机的指代文件内容的emoj

方式A：使用 [hash] 设置 file-loader 的 name

- ```js
  module：{
    // ...
  	rules：[
  		{
  			test：'/\.(png|svg|jpg|gif)$/',
  			use：[
  				{
            loader：'file-loader',
            options：{
              name：'img/[name]_[hash:8].[ext]'
            }
          }
  			]
  		}
  	]
  }
  ```


方式B：url-loader，小于阀值转码，大于命名打包，此外可处理 svg、eot、ttf 等文件，[参考](https://juejin.im/post/5a068c2b5188255851322b8c#heading-13)

- ```js
  module：{
    // ...
  	rules：[
  		{
  			test：'/\.(png|svg|jpg|gif)$/',
  			loader：'url?limit=8192&name=images/[hash:8].[name].[ext]'
  		}
  	]
  }
  ```




##### 2-3-6-3、CSS 文件指纹设置

使用 [contenthash] 设置 MiniCssExtractPlugin 的 filename；安装：`npm i mini-css-extract-plugin -D`；

- 注意：普通使用中，style-loader 会将 css 合并插入至文档，但此不利于作版本管理，故通常将其提取分离，然后再处理；

```js
module.export = {
  // ... 
  module：{
  	rules：[
      {
        test：/\.css$/,
        use：[
          // 删除与之冲突的 style-loader，并替换为插件提供的loader
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test：/\.less$/,
        use：[
          // 删除与之冲突的 style-loader，并替换为插件提供的loader
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'less-loader'
        ]
      }
		]
  },
	plugins：[
		new MiniCssExtractPlugin({
			filename：'[name]_[contenthash:8].css'
		})
	]
}
```



##### 2-3-7、代码压缩

注意：webpack4 已内置压缩插件 uglifyjs-webpack-plugin，故无需手动进行 JS 压缩；

注意：但亦可单独下载 UglifyJsPlugi 插件，以使用个性化设置；

##### 2-3-7-1、CSS 压缩

使用：通过配置 css-loader 的 minify 参数压缩，安装：`npm i optimize-css-assets-webpack-plugin cssnano -D`

- 问题：css-loader 在版本 1.0 后去掉此参数；
- 解决：改用插件 optimize-css-assets-webpack-plugin，此外还需预处理器 cssnano；

```js
// webpack.config.js
module.export = {
  // ...
	plugins：[
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp：/\.css$/g,
      cssProcessor：require('cssnano')
    })
	]
}
```



##### 2-3-7-3、HTML 压缩

使用：强大插件：html-webpack-plugin、空格、换行符、注释均可处理，安装：`npm i html-webpack-plugin -D`

- 注意：<u>多个文件须多次写入</u>，比如下面用法；

```js
// webpack.config.js
module.export = {
  // ...
	plugins：[
    new HtmlWebpackPlugin({
      template：path.join(__dirname, 'src/search.html'),
      filename：'search.html',
      chunks：['search'],
      inject：true,
      minify：{
        html5：true,
        collapseWhitespace：true,
        preserveLineBreaks：false,
        minifyCSS：true,
        minifyJS：true,
        removeComments：false
      }
    }),
    new HtmlWebpackPlugin({
      template：path.join(__dirname, 'src/index.html'),
      filename：'index.html',
      chunks：['index'],
      inject：true,
      minify：{
        html5：true,
        collapseWhitespace：true,
        preserveLineBreaks：false,
        minifyCSS：true,
        minifyJS：true,
        removeComments：false
      }
    }),
    // ... 复数 ...
	]
}
```

- 注意：[使用二](https://juejin.im/post/5a068c2b5188255851322b8c#heading-15)



##### 2-3-7-3、JS 压缩

参考：https://juejin.im/post/5a068c2b5188255851322b8c#heading-10

```js
// webpack.config.js
module.export = {
  // ...
	plugins：[
    new webpack.optimize.UglifyJsPlugin({
      compress：{
         warnings：false
      }
  	})
	]
}
```



### 三、进阶用法



### 四、可维护配置



### 五、构建优化策略



#### 5-1、优化构建速度

- 使用`高版本`的 Webpack 和 Node.js
- `多进程/多实例构建`：HappyPack(不维护)、thread-loader
- `压缩代码`
  - 多进程并行压缩
    - webpack-paralle-uglify-plugin
    - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)
    - terser-webpack-plugin 开启 parallel 参数
  - 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
- `图片压缩`
  - 使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)
  - 配置 image-webpack-loader
- `缩小打包作用域`：
  - exclude/include (确定 loader 规则范围)
  - resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
  - resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
  - resolve.extensions 尽可能减少后缀尝试的可能性
  - noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应包含 import、require、define 等模块化语句)
  - IgnorePlugin (完全排除模块)
  - 合理使用alias
- `提取页面公共资源`：
  - 基础包分离：
    - 使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中
    - 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置)即代码分割，替代了 CommonsChunkPlugin 插件；
    - 注意：代码分割本质其实是：在`源代码直接上线`和`打包成唯一脚本main.bundle.js`这两种极端方案间的一种更适合实际场景的中间状态。<u>用可接受的服务器性能压力增加来换取更好的用户体验</u>；
    - 极端1：源代码直接上线：虽然过程可控，但是http请求多，性能开销大；
    - 极端2：打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好；
- `DLL`：
  - 用 DllPlugin 进行分包、用DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不改动的代码先打包成静态资源，避免反复编译浪费时间。
  - HashedModuleIdsPlugin 可解决模块数字id问题
- `充分利用缓存提升二次构建速度`：
  - babel-loader 开启缓存
  - terser-webpack-plugin 开启缓存
  - 使用 cache-loader 或者 hard-source-webpack-plugin
- `Tree shaking`
  - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率
  - 禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking
  - 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
    - purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)
- `Scope hoisting`
  - 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
  - 必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法
- `动态Polyfill`
  - 建议采用 polyfill-service 只给用户返回需要的polyfill，社区维护。 (部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)

更多优化请参考[官网-构建性能](https://www.webpackjs.com/guides/build-performance/)





#### 5-X、高效插件

##### 5-X-1、webpack --watch

观察者模式, 只需要在`package.json`里配置一个脚本命令:

```json
// 观察模式-只需在 package.json 配置一个脚本命令
"scripts": {
	"watch": "webpack --watch/-w"
}
// 实时监控文件, 改动后自执行编译指令, 但需要手动刷新页面
```



##### 5-X-2、webpack-dev-server

此插件是 watch 模式的改进，无需手动刷新浏览器；每次修改了本地代码之后, 都会重新自动编译, 并刷新页面

- 安装： `npm i --save-dev webpack-dev-server`

- 添加脚本命令： `"start": "webpack-dev-server --open"`

- 结果：不会生成 `dist` 文件夹，而是开启一本地的 web 服务器 `localhost:8080`；

- 配置：在 `webpack.config.js` 中配置 `devServer`：[更多配置项](https://www.webpackjs.com/configuration/dev-server/)

- ```js
  module.exports = {
      devServer: {
          contentBase: './dist', 		// 告诉服务器从哪里提供内容
          host: '0.0.0.0', 					// 默认是 localhost
          port: 8000, 							// 端口号, 默认是8080
          open: true, 							// 是否自动打开浏览器
          hot: true, 								// 启用 webpack 的模块热替换特性
          hotOnly: true 						// 当编译失败之后不进行热更新
      }
  }
  ```



##### 5-X-3、webpack-dev-middle

安装：`npm i --save-dev webpack-dev-middleware express`

前面介绍的 `webpack-dev-server` 能开启一个本地的`web`服务器(通过服务器实现与客户端通讯)，其实现原理是 WDS 内部使用了 webpack-dev-middle 中间件；此中间件是一个容器(wrapper)，能将 webpack 处理后的文件传递给一个服务器(server)，也可单独使用，<u>实现本地服务器的搭建</u>；

- 每次修改本地代码能够重新编译，代码发往服务器执行；
- 不会自动刷新页面；

```json
// package.json 配置命令
{
    "scripts": {
        "server": "node server.js"
    }
}
```

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js",
  },
  devtool: "inline-source-map", // 仅开发环境报错追踪
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new HtmlWebpackPlugin({
      title: "Webpack Output2",
      filename: "index.html",
      template: "src/index.html",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    // 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」
    publicPath: "/assets/",
  },
};
```

```js
// server.js - 根目录 - 用以编写本地服务
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config");
const compiler = webpack(config);
// 将 webpack 处理后的文件传递给一个服务器
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});

// 随后 npm run server 即可运行，打开 localhost:3000/assets/ 访问页面
```

- 注意：若无配置 `output.publicPath` 和 `webpack-dev-middleware` 的 `publicPath`，则默认都会是`""`，以根目录作为配置项；
- 注意：若配置了`output.publicPath`，则 `webpack-dev-middleware` 中的 `publicPath` 也要和它一样才行；





##### 5-X-4、webpack-merge 

安装：`npm i --save-dev webpack-merge`

开发环境和生产环境的构建目标差异巨大：

- 开发环境：可能需要有 HMR 等能力；
- 生产环境：更加关注体积、资源优化与整理，力求更小 bundle(压缩输出)，更轻量 source map；

为遵循逻辑分离，可为每个环境编写彼此独立的 webpack 配置，但这些配置，不乏公用的配置项，此时便可通过 webpack-merge 将这些公用配置项提取，然后不同配置则写在不同文件中；插件原理实际就是将多个 `webpack` 配置合并成一个；

```js
// webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack bundle",
    }),
  ],
};


// webpack.dev.js
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  devtool: "inline-source-map", // 错误追踪
  devServer: {
    // 设置 webpack-dev-server 监听的文件
    contentBase: "./dist",
  },
});


// webpack.prod.js
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(commonConfig, {
  plugins: [
    new UglifyJSPlugin(), // 压缩输出
  ],
});
```

```json
// package.json
{
    "name": "webpack-bundle",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "webpack-dev-server --open --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "clean-webpack-plugin": "^3.0.0",
        "html-webpack-plugin": "^3.2.0",
        "uglifyjs-webpack-plugin": "^2.2.0",
        "webpack": "^4.41.5",
        "webpack-cli": "^3.3.10",
        "webpack-dev-server": "^3.10.3",
        "webpack-merge": "^4.2.2"
    }
}
```

- 开发环境：执行 `npm run start` ，自动打开 `localhost:8080` 页面并且有自动重载功能；
- 生产环境：执行 `npm run build` ，打包生成 `dist` 文件夹，且 `bundle` 中 `js` 为压缩过后的代码；



##### 5-X-5、process.env.NODE_ENV

`process.env.NODE_ENV`是 Node.js 暴露给执行脚本的系统环境变量，其主要作用声明当前环境是：开发环境(development)亦或是生产环境(production)；

可在任何 `src` 本地代码中引用：`process.env.NODE_ENV`，但注意在 `webpack.config.js` 中却无法获取；

##### 5-X-5-1、webpack.DefinePlugin 

鉴于上述问题，可通过 webpack 内置的 webpack.DefinePlugin 插件在 webpack.config.js 内部修改/指定 `NODE_ENV` 值

```js
const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const commonConfig = require("./webpack.common.js");

module.exports = merge(commonConfig, {
  devtool: "source-map",
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    // 方式1
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    // 方式2
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"production"`,
      },
    });
  ],
});
```

##### 5-X-5-2、命令行配置模式mode

除使用 `webpack.DefinePlugin` 插件来修改环境变量，还可在命令行中 `--mode` 变量设置：`webpack --mode=production 或 webpack --mode=development`

此后，**<u>*在本地代码中便可获取到*</u>**的 `process.env.NODE_ENV`值就即为配置的 `mode` 值；

- 注意：若同时设置，则 webpack.definePlugin 优先级高于 mode 设置；

##### 5-X-5-3、命令行传递环境变量

可通过命令行的 `--env` 参数设置能**<u>*在 webpack.config.js 配置中访问到*</u>** 的值；

```json
// Ex1
{
  "scripts": {
      "start": "webpack-dev-server --open --config webpack.dev.js",
      "build": "webpack --config webpack.prod.js",
      "local": "webpack --env.custom=local --env.production --progress --config webpack.local.js"
  }
}
// --env.custom=local  	给环境变量中设置一个自定义的属性 custom ，其值为 local 
// --env.production  	 	设置 env.production == true (这里的 env 并不会影响 process.env )
// --progress  					打印出编译进度的百分比值
// --config webpack.local.js  
// 以 webpack.local.js 中的内容执行 webpack 构建，随后在根目录下构建 webpack.config.js 即可
```

命令行传递环境变量判断 NODE_ENV

- 注意：下面的 env.NODE_ENV 并非 process.env.NODE_ENV，所以它并不能改变 `process.env`，也即不管哪种方式生成的页面，在页面中获取到的`process.env.NODE_ENV` 都还是 `production`；

```js
// Ex2
// package.json
// 配置参数进行参数传递
{
  "name": "webpack-bundle",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "webpack-dev-server --open --config webpack.dev.js",
      "build": "webpack --config webpack.prod.js",
      "local": "webpack --env.custom=local --env.production=false --mode=development --progress --config webpack.local.js",
      "combine-dev": "webpack --env.NODE_ENV=development --config webpack.combine.js",
      "combine-prod": "webpack --env.NODE_ENV=production --config webpack.combine.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
      "clean-webpack-plugin": "^3.0.0",
      "html-webpack-plugin": "^3.2.0",
      "lodash": "^4.17.15",
      "uglifyjs-webpack-plugin": "^2.2.0",
      "webpack": "^4.41.5",
      "webpack-cli": "^3.3.10",
      "webpack-dev-server": "^3.10.3",
      "webpack-merge": "^4.2.2"
  }
}


// webpack.combine.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = env => {
    return {
        entry: './src/index.js',
        output: {
            filename: env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: '合并成同一个webpack配置'
            })
        ]
    }
}
```

- `HotModuleReplacementPlugin`：模块热替换；
- `size-plugin`：监控资源体积变化，尽早发现问题；
- `webpack-merge`：提取公共配置，减少重复配置代码；
- `webpack-dashboard`：可更友好的展示相关打包信息；
- `speed-measure-webpack-plugin`：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈；



#### 5-Y、性能监控

对 bundle 体积进行监控和分析：

`VSCode` 插件 `Import Cost` 可帮助对引入模块的大小进行实时监测；

 `webpack-bundle-analyzer` 插件可生成 `bundle` 的模块组成图，显示所占体积；

`bundlesize` 工具包可以进行自动化资源体积监控；







### 六、大型项目配置

