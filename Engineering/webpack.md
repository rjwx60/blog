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

首先安装解析包：`npm i babel-loader @babel/core @babel/preset-env -D`

- 注意：`@babel/core `是 Babel 核心， `@babel/preset-env` 是能将 ES6+ 的语法转成 ES5 的一组插件集合；
- 其中：<u>JSX 解析可在 ES6 基础上在 `.babelrc` 文件上增加 `@babel/preset-reat` 即可</u>；

优化：

- 编译慢：
  - 减少文件：通过配置 `include `和 `exclude `来减少被处理的文件；
  - 开启缓存：设置 `cacheDirectory`  选项为`true` 以开启缓存，转译的结果将会缓存到文件系统中；
- 体积大：Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`；默认情况下会被添加到每一个需要它的文件中，所以会导致打包文件体积过大；引入 `babel runtime` 作为一个单独的模块，避免重复；
  - 使用方式：执行 `npm install @babel/plugin-transform-runtime --save-dev`  来将它包含到项目中；并使用 `npm install babel-runtime --save` 将 `babel-runtime` 安装为一个依赖:

```js
// webpack.config.js
module：{
	rules：[
		{
      // 作用: 
      // 对除 node_modules、bower_components 文件夹外所有 JS 文件使用 babel-loader.
      // 同时 Babel 配置使用的是 @babel/preset-env 这个 preset.
      test: /.js$/,
      exclude: /(node_moudules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            // 注意：babel 有两个重要概念：presets(一系列 babel plugin 集合)、plugin(一 plugin 对应一功能)
            // 下面 plugins 配置表示只将箭头函数转换为普通函数
            presets: ["@babel/preset-env"]
            // plugins: [require('@babel/plugin-transform-arrow-functions')]
            // 或写法2
            // plugins: ['@babel/plugin-transform-arrow-functions']
          	// 优化方式 - runtime
            // plugins: ['@babel/plugin-transform-runtime']
          }
        }
      ]
		},
    {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: /node_modules/
    }
	]
}


// .babelrc
// 注意：babel-loader 依赖 babel，若上述无配置 options, 则还须配置 .babelrc 文件；
{
  "presets"：[
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```



##### 2-3-2、解析 Css、Sass、Less

首先安装解析包：`npm i style-loader css-loader less less-loader sass sass-loader -D`；[补充](https://segmentfault.com/a/1190000006178770#articleHeader5) 和 [深入](https://github.com/css-modules/css-modules)

- css-loader：用于加载 css 文件，并转成 commonjs 对象，使其能够使用类似 @import 和 url(...) 的方法实现 require() 功能；
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
		},
    {
      test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
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
						limit：10240,
          	// 不设置, 默认返回 base64 格式
          	// 设置 limit, 小于该值, 返回 base64 格式
          	// 设置 limit, 大于该值, 交给 file-loader 处理, 若无安装配置 file-loader 则报错
          	esModule: false
          	// 避免输出 Module{...} 的形式，避免发生 <img src="[object Module]" />
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



##### 2-3-6、文件指纹策略(hash)

文件指纹即打包后输出的文件名的后缀；

作用：用于版本管理、修改文件替换，未修改文件则使用浏览器缓存、也可用于控制版本更新；

<img src="/Image/Engineering/15.png" style="zoom:50%;" align="left"/>

**<u>*策略：chunkhash、contenthash、hash：*</u>**

- `hash`：与整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 就会更改，且全部文件都共用相同的 hash 值(粒度为整个项目)；
- `chunkhash`：与 webpack 打包的 chunk 相关，根据不同的 entry 进行依赖文件解析，构建对应的 chunk，并生成对应的 hash 值；只有被修改的 chunk 在重新构建后才会生成新的 hash 值，此过程不会影响其它的 chunk(粒度为 entry 的每个入口文件)；
- `contenthash`：根据文件内容定义 hash，文件内容不变，则 contenthash 不变；即跟每个生成的文件有关，每个文件都有一个唯一 hash 值；当要构建的文件内容发生改变时，就会生成新 hash 值，且该文件的改变并不会影响和它同一个模块下的其它文件(粒度为每个文件的内容)
  - 注意：contenthash 用于 css 文件、chunkhash 用于 js 文件；
  - 注意：若 hash 与 chunkhash 造成的问题，请看[问题十二](https://blog.csdn.net/sinat_17775997/article/details/61924901)；
  - 注意：chunk 模式无法与 WDS 共用，即无法与 hotModule 共用，须切换至 production mode，去除热更新；

**<u>*策略补充*</u>**：

- 如果是 `hash` ，则跟整个项目有关，有一处文件发生更改则所有文件的 `hash` 值都会发生改变，它们共用一个 `hash` 值；
- 如果是 `chunkhash`，只和 `entry` 的每个入口文件有关，也即同一个 `chunk` 下的文件有所改动，则该 `chunk` 下的文件的 `hash` 值就会发生改变；
- 如果是 `contenthash`，和每个生成的文件有关，只有当要构建的文件内容发生改变时，才会给该文件生成新的 `hash` 值，并不会影响其它文件；



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

安装：`npm i mini-css-extract-plugin -D`；

普通使用中，style-loader 会将 css 合并插入至文档，但此不利于作版本管理，故通常将其提取分离，然后再处理；

可通过使用 [contenthash] 设置 MiniCssExtractPlugin (替代 ExtractTextWebpackPlugin)的 filename，来实现将 css 类文件提取并作为单独文件加载到页面上；

```js
module.export = {
  // ... 
  module：{
  	rules：[
      {
        test：/\.css$/,
        use：[
          // 删除与之冲突的 style-loader，并替换为插件提供的 loader
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test：/\.less$/,
        use：[
          // 删除与之冲突的 style-loader，并替换为插件提供的 loader
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

更多优化请参考 [官网](https://www.webpackjs.com/)、 [官网-构建性能](https://www.webpackjs.com/guides/build-performance/)

#### 5-1、优化分析

`size-plugin`：监控资源体积变化，尽早发现问题；

`webpack-dashboard`：可更友好的展示相关打包信息；

`speed-measure-webpack-plugin`：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈；

`webpack-bundle-analyzer`：分析打包后整个项目中的体积结构，输出结果含项目中用到的所有第三方包，及各个模块在整个项目中的占比；



#### 5-2、优化配置

全局优化：使用`高版本`的 Webpack 和 Node.js



##### 5-2-1、开发体验优化

##### 5-2-1-1、优化 loader 配置

Loader 对文件的转换操作很耗时，可通过下列方式 **<u>加快编译处理速度</u>**：

- 减少处理：让尽可能少的文件被 Loader 处理；可通过 `test/include/exclude` 三个配置项来命中 Loader 要应用规则的文件；
- 开启缓存：设置 `cacheDirectory`  选项为`true` 以开启缓存，转译的结果将会缓存到文件系统中；
- 减小体积：Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`；默认情况下会被添加到每一个需要它的文件中，所以会导致打包文件体积过大；引入 `babel runtime` 作为一个单独的模块，避免重复；
  - 使用方式：执行 `npm install @babel/plugin-transform-runtime --save-dev`  来将它包含到项目中；并使用 `npm install babel-runtime --save` 将 `babel-runtime` 安装为一个依赖:

```js
// webpack.config.js
module：{
	rules：[
		{
      // 作用: 
      // 对除 node_modules、bower_components 文件夹外所有 JS 文件使用 babel-loader.
      // 同时 Babel 配置使用的是 @babel/preset-env 这个 preset.
      test: /.js$/,
      exclude: /(node_moudules|bower_components)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          	// 优化方式 - runtime
            // plugins: ['@babel/plugin-transform-runtime']
          }
        }
      ]
		},
    {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: /node_modules/
    },
    {
      test: /\.js$/,
      // babel -loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
      use: ['babel-loader?cacheDirectory'] ,
      // 只对项目根目录下 src 目录中的文件采用 babel-loader
      include: path.resolve(__dirname,'src'),
      exclude: /node_modules/
    }
	]
}
```



##### 5-2-1-2、exclude & resolve & ignore & module

- resolve.modules：指明第三方模块的绝对路径，避免层层查找祖先目录 (减少不必要的查找)
- resolve.mainFields：只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)；
- resolve.alias：创建 import 或 require 别名；加快 webpack 查找速度；
- resolve.extensions：尽可能减少后缀尝试的可能性；
- module.noParse：忽略完全无需解析的库 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应包含 import、require、define 等模块化语句)



##### 5-2-1-2-1、优化 resolve.modules 配置

resolve.modules 默认值是 `['node_modules']`，含义是先去当前目录的 `node_modules` 目录下去寻找模块，如果没找到就去上一级目录 `../node_modules` 中找，再没有就去 `../../node_modules` 中找，以此类推；与 Node 模块寻找机制相似；

但当安装的三方模块都放在项目根目录的 `node_modules` 目录下时，就没必要按默认方式去一层层寻找，此时 **<u>指明存放三方模块的绝对路径可加速寻找模块</u>**；

```js
module.exports = {
  resolve: {
    modules: [path.resolve( __dirname,'node modules')]
  },
  // else
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    },
    extensions: [".js", ".vue"],
    mainFields: ["index", "main"],
    modules: [path.resolve(__dirname, "src"),"node_modules"]
  }
}
```



##### 5-2-1-2-2、优化 resolve.mainFields 配置

安装的第三方模块中，都会有一个 `package.json` 文件，用于描述模块属性与依赖，其中可能存在多个入口文件的字段描述，原因是<u>某些模块可同时用于多种环境，针对不同运行环境需要使用不同代码</u>；resolve.mainFields 默认值与当前 target 配置有关，对应关系如下：

- target 为 web 或 webworker 时，值是 `['browser', 'module', 'main']`；
- target 为其他情况时，值是 `[ 'module', 'main']`；

以 target 等于 web 为例， Webpack 会先采用三方模块中的 browser 字段，去寻找模块的入口文件，若不存在则采用 module 字段，以此类推；

为 **<u>减少搜索步骤</u>**，在明确三方模块的入口文件描述字段时，可将其设置得尽量少；而由于大多数三方模块均采用 main 字段去描述入口文件位置，故可这样配置：

```js
module.exports = {
  resolve: {
    // 只采用 main 字段作为入口文件的描述字段，以减少搜索步骤
    mainFields: ['main']
  }
  // else
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    },
    extensions: [".js", ".vue"],
    mainFields: ["index", "main"],
    modules: [path.resolve(__dirname, "src"),"node_modules"]
  }
}
```



##### 5-2-1-2-3、优化 resolve.alias 配置

resolve.alias 配置项可设置别名，来将原导入路径映射成一个新的导入路径；

在实战项目中常常会依赖一些庞大的三方模块，以 React 库为例，发布出去的 React 库中包含两套代码：

- 一套是采用 CommonJS 规范的模块化代码，这些文件都放在 lib 录下，以 `package.json` 中指定的入口文件 react.js 为模块的入口；
- 一套是将 React 的所有相关代码打包好的完整代码放到一个单独文件中， 这些代码没有采用模块化，可直接执行；其中：
  - dist/react.js 用于开发环境，包含检查和警告的代码；
  - dist/react.min.js 用于线上环境，被最小化了；

默认情况下， Webpack 会从入口文件 `./node_modules/react/react.js` 开始递归解析和处理依赖的几十个文件，操作十分耗时，而通过配置 resolve.alias, 可让 Webpack 在处理 React 库时，直接使用单独、完整的 react.min.js 文件，从而 **<u>跳过耗时的递归解析操作，加快查找速度</u>**；

```js
module.exports = {
  resolve: {
    // 使用 alias 将导入 react 的语句换成直接使用单独、完整的 react.min.js 文件，
    // 减少耗时的递归解析操作
    alias: {
      'react': path.resolve( __dirname ,'./node_modules/react/dist/react.min.js'),
    }
  }
  // else
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    },
    extensions: [".js", ".vue"],
    mainFields: ["index", "main"],
    modules: [path.resolve(__dirname, "src"),"node_modules"]
  }
}
```

注意：对某些库使用这个优化方法后，会影响到利用 Tree-Sharking 去除无效代码的优化，因打包好的完整文件中有部分代码在项目中可能永远用不上；

**<u>分场景使用</u>**：对整体性比较强的库采用此法优化，因完整文件中的代码是一个整体，每一行都是不可或缺的；但是对于一些工具类的库，则不建议用此方法；



##### 5-2-1-2-4、优化 resolve.extensions 配置

若导入的语句无带文件后缀，Webpack 会自动带上后缀去尝试询问文件是否存在；若此列表越长或正确后缀越往后，就会造成尝试次数越多；

可通过 resolve .extensions **<u>尽可能减少后缀尝试的可能性</u>**

但注意 resolve .extensions 的配置也会影响到构建性能，在配置 resolve.extensions 时应遵守以下几点，以做到尽可能地优化构建性能：

- 后缀尝试列表要尽可能小，不要将项目中不可能存在的情况写到后缀尝试列表中；
- 频率出现最高的文件后缀要优先放在最前面，以做到尽快退出寻找过程；
- 在源码中写导入语句时，要尽可能带上后缀从而可以避免寻找过程；比如确定情况下将 `require ('./data ')` 写成 `require ('./data.json')`

```js
module.exports = {
  resolve : {
    // 尽可能减少后缀尝试的可能性
    extensions : ['.js', '.json'],
  }
  // else
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    },
    extensions: [".js", ".vue"],
    mainFields: ["index", "main"],
    modules: [path.resolve(__dirname, "src"),"node_modules"]
  }
}
```



##### 5-2-1-2-5、优化 module.noParse 配置

module.noParse 配置项可 **<u>让 Webpack 忽略对部分无采用模块化的文件的递归解析处理</u>**，提高构建性能；

```js
module.exports = {
  module: {
    noParse: /jquery/,
  }
};
```



##### 5-2-1-2-6、Ignore 多余包

使用 webpack 自带插件 IgnorePlugin 防止在 `import` 或 `require` 调用时，生成以下正则表达式匹配的模块：

- `requestRegExp` 匹配(test)资源请求路径的正则表达式。
- `contextRegExp` （可选）匹配(test)资源上下文（目录）的正则表达式。

```js
new webpack.IgnorePlugin(requestRegExp, [contextRegExp])
new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
```

```js
// index.js
// 利用 IgnorePlugin 将必要语言包导入使用即可
import moment from 'moment';
// 单独导入中文语言包
import 'moment/locale/zh-cn';
```





##### 5-2-1-3、使用 HardSourceWebpackPlugin / DLL

作用等同过去的 DLLPlugin 和 DLLReferencePlugin，其用某种方法实现了拆分 bundles，即 **<u>利用动态链接库减少编译</u>**，大大提升了构建的速度；

包含大量复用模块的动态链接库只需被编译一次，在之后的构建过程中，被动态链接库包含的模块，将不会重新编译，而是直接使用动态链接库中的代码；由于动态链接库中大多数包含的是常用的第三方模块，比如 react、react-dom ，所以只要不升级这些模块的版本，动态链接库就无需重新编译；

```js
// https://github.com/webpack/webpack/tree/master/examples/dll-user
// DllPlugin 和 DLLReferencePlugin 都是 webpack 的内置模块
module.exports = {
  // mode: "development || "production",
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "..", "dll"),
      manifest: require("../dll/dist/alpha-manifest.json") // eslint-disable-line
    }),
    new webpack.DllReferencePlugin({
      scope: "beta",
      manifest: require("../dll/dist/beta-manifest.json"), // eslint-disable-line
      extensions: [".js", ".jsx"]
    })
  ]
};

// Ex - 1
// 1、配置 webpack.dll.js，将 lodash、jquery、antd 抽离出来
const path = require("path");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    lodash: ["lodash"],
    jquery: ["jquery"],
    antd: ["antd"]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]" // name 和 library 保持一致
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: "[name]",
      path: path.resolve(__dirname, "manifest/[name].manifest.json")
    })
  ]
};


// 2、配置 package.json 中，新增 script 打包 dll
"scripts": {
  ...,
  "dll": "webpack --config webpack.dll.js"
}


// 3、配置webpack.config.js：
// 将打包的 dll 通过 add-asset-html-webpack-plugin 添加到 html 中，再通过 DllReferencePlugin 把 dll 引用到需要编译的依赖
const manifests = ['antd', 'jquery', 'lodash'];
const dllPlugins = manifests.map(item => {
  return new webpack.DllReferencePlugin({
    manifest: require(`./manifest/${item}.manifest`)
  });
});

module.exports = {
  // ...,
  plugins: [
    ...dllPlugins,
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, "./dll/*.dll.js")
    })
  ]
}
```

而 Webpack5 中使用 `HardSourceWebpackPlugin` 实现，使用简单且一样的效果(webapck4 就可以用!!!!!)；

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const plugins = [
	new HardSourceWebpackPlugin()
]
```

注意：该插件与测量各流程耗时的插件 `speed-measure-webpack-plugin` 不兼容；



##### 5-2-1-4、使用 HappyPack/Thread-loader

Webpack 是单线程模型，即需要一个一个地处理任务，不能同时处理多个任务；

HappyPack **<u>将任务分解给多个子进程去并发执行</u>**，子进程处理完后再将结果发送给主进程，从而发挥多核 CPU 性能；

整个 Webpack 构建流程中，最耗时的流程可能就是 Loader 对文件的转换操作，因要转换的文件数据量巨大，且这些转换都只能一个个地处理； 

HappyPack 核心原理就是将这部分任务分解到多个进程中去并行处理，从而减少总的构建时间。

```js
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

{
  test: /\.js$/,
    // loader: 'babel-loader',
    loader: 'happypack/loader?id=happy-babel-js', // 增加新的HappyPack构建loader
      include: [resolve('src')],
        exclude: /node_modules/,
}
// ...
plugins: [
  new HappyPack({
    id: 'happy-babel-js',
    loaders: ['babel-loader?cacheDirectory=true'],
    threadPool: happyThreadPool
  })
]
```

[Thread-loader](https://www.webpackjs.com/loaders/thread-loader/)

安装：`npm install --save-dev thread-loader`

使用：将此 loader 放置在其他 loader 前，而后的 loader 就会在一个单独的 worker 池(worker pool)中运行，但注意是受限的：

- 这些 loader 不能产生新的文件。
- 这些 loader 不能使用定制的 loader API（也就是说，通过插件）。
- 这些 loader 无法获取 webpack 的选项设置。

注意：每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制；

注意：请仅在耗时的 loader 上使用；

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          {
            loader: "thread-loader",
            // 有同样配置的 loader 会共享一个 worker 池(worker pool)
            options: {
              // 产生的 worker 的数量，默认是 cpu 的核心数
              workers: 2,

              // 一个 worker 进程中并行执行工作的数量
              // 默认为 20
              workerParallelJobs: 50,

              // 额外的 node.js 参数
              workerNodeArgs: ['--max-old-space-size', '1024'],

              // 闲置时定时删除 worker 进程
              // 默认为 500ms
              // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
              poolTimeout: 2000,

              // 池(pool)分配给 worker 的工作数量
              // 默认为 200
              // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
              poolParallelJobs: 50,

              // 池(pool)的名称
              // 可以修改名称来创建其余选项都一样的池(pool)
              name: "my-pool"
            }
          },
          "expensive-loader"
        ]
      }
    ]
  }
}

// 预热
// 通过预热 worker 池(worker pool)来防止启动 worker 时的高延时
// 这会启动池(pool)内最大数量的 worker 并把指定的模块载入 node.js 的模块缓存中
const threadLoader = require('thread-loader');

threadLoader.warmup({
  // pool options, like passed to loader options
  // must match loader options to boot the correct pool
}, [
  // modules to load
  // can be any module, i. e.
  'babel-loader',
  'babel-preset-es2015',
  'sass-loader',
]);
```





##### 5-2-1-5、内容物压缩

JS：webpack 默认提供 UglifyJS 插件来压缩 JS 代码，但其使用的是单线程压缩代码，也即对于多个 JS 文件则需一个一个文件地进行压缩；这在正式环境中打包压缩代码速度非常慢，(因压缩代码前须先将代码解析成 AST，然后再去应用各种规则分析和处理，导致过程耗时非常大)；

所以当 webpack 有多个 JS 文件需要输出和压缩时，可利用 ParallelUglifyPlugin 插件，其会开启多个子进程，将多个文件压缩工作分别给多个子进程去完成，但注意，每个子进程还是通过 UglifyJS 去压缩代码；**<u>即单线变多线程并行处理压缩</u>**；

- webpack-paralle-uglify-plugin
- uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)
- terser-webpack-plugin 开启 parallel 参数

CSS：通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS；

- 使用 `purgecss-webpack-plugin` 和 `glob` 插件去除无用样式 (`glob`插件可以可以同步查找目录下的任意文件夹下的任意文件)：

- ```js
  new PurgecssWebpackPlugin({
      // paths表示指定要去解析的文件名数组路径
      // Purgecss会去解析这些文件然后把无用的样式移除
      paths: glob.sync('./src/**/*', {nodir: true})
      // glob.sync同步查找src目录下的任意文件夹下的任意文件
      // 返回一个数组，如['真实路径/src/css/style.css','真实路径/src/index.js',...]
  })
  ```

Image：

- 使用基于 Node 库的 imagemin (很多定制选项、可处理多种图片格式)
- 配置 image-webpack-loader











##### 5-2-1-6、优化文件监听的性能

在开启监听模式时，默认情况下会监听配置的 Entry 文件、与所有 Entry 递归依赖的文件，在这些文件中会有很多存在于 `node_modules` 下，因如今的 Web 项目会依赖大量的第三方模块， 所以大多数情况下都不可能去编辑 `node_modules` 下的文件，所以此时可 **<u>忽略监听 node_modules 下的文件</u>**，采用此方法优化后， Webpack 消耗的内存和 CPU 将会大大减少；

```js
module.export = {
  watchOptions : {
    // 不监听的 node_modules 目录下的文件
    ignored : /node_modules/,
  }
}
```





##### 5-2-2、输出质量优化

##### 5-2-2-1、实现 CDN 的接入

构建需要实现以下几点:

- 静态资源的导入  URL 需要变成指向 DNS 服务的绝对路径的 URL，而不是相对 HTML 文件的
- 静态资源的文件名需要带上由文件内容算出来的 Hash 值，以防止被缓存
- 将不同类型的资源放到不同域名的 DNS 服务上，以防止资源的并行加载被阻塞



##### 5-2-2-2、使用 Tree Shaking

即打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉；但Tree Shaking 正常工作前提：提交给 Webpack 的 JS 代码须采用 ES6 的模块化语法，**<u>因 摇树优化 的实现依赖于 ES6 模块化的静态语法</u>**，可进行静态分析；

首先，为将采用 ES6 模块化的代码提交给 Webpack ，需配置 Babel 以让其保留 ES6 模块化语句(否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking)；修改 .babelrc 文件如下：

```json
{
  'presets':[
    [
      'env',{
        'module':false
      }
    ]
  ]
}
```

然后，要使用 UglifyJsPlugin 插件；若在 `mode:"production"` 模式，则插件已默认添加；若在其它模式下，则须手工添加；

- 注意：要配置 `optimization.usedExports` (当然在 `mode: "production"` 模式下默认打开)，其告诉 webpack 每个模块明确使用 exports；此后，webpack 会在打包文件中添加诸如 `/* unused harmony export */` 的注释，然后 UglifyJsPlugin 插件会对这些注释作出理解；


总结：开启 TreeShaking 有多种方式，

- `webpack4` 直接通过 `mode` 配置成 `production` 即可；
- `webpack4` 若无配置 `mode`的话它默认也会启用；
- 通过在命令行中添加 `--optimize-minimize`, 比如`"build": "webpack --optimize-minimize"`；
- 所以：开启 mode prodduction 模式就完事…，不开也会帮你开…；
- 其他：使用 PurifyCSS(不再维护) 或 uncss 去除无用 CSS 代码：purgecss-webpack-plugin 和 mini-css-extract-plugin 配合使用(建议)

```js
module.exports = {
  mode: 'none',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin()
    ],
    usedExports: true,
    sideEffects: true
  }
}
```







##### 5-2-2-3、提取公共代码 SplitChunks

大型网站通常由多个页面组成，每个页面都是一个独立的单页应用，但由于所有页面都采用同样的技术栈及同一套样式代码，这就导致页面间有很多相同代码；过去(版本3)通过 CommonsChunkPlugin 实现，现在通过(版本4) SplitChunks 实现；

- 注意：代码分割本质是：在 `源代码直接上线 `和 `打包成唯一脚本main.bundle.js` 这两种极端方案间的一种更适合实际场景的中间状态；<u>用可接受的服务器性能压力增加来换取更好的用户体验</u>；

**<u>通过 splitChunks 对相同代码进行分包</u>**：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async、initial、all
      chunks: "async",
      // 表示新分离出的 chunk 必须大于等于 minSize，默认为 30000，约 30kb
      minSize: 30000,
      // 表示一个模块至少应被 minChunks 个 chunk 所包含才能分割；默认为1
      minChunks: 1,
      // 表示按需加载文件时，并行请求的最大数目；默认为5
      maxAsyncRequests: 5,
      // 表示加载入口文件时，并行请求的最大数目；默认为3。
      maxInitialRequests: 3,
      // 表示拆分出的 chunk 的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: '~',
      // 设置 chunk 的文件名。默认为 true。当为 true 时，splitChunks 基于 chunk 和 cacheGroups 的 key 自动命名。
      name: true,
      // cacheGroups 下可配置多个组，每个组根据 test 设置条件，符合 test 条件的模块，就分配到该组
      // 模块可被多个组引用，但最终会根据 priority 来决定打包到哪个组中
      // 默认将所有来自 node_modules 目录的模块打包至 vendors 组，将两个以上的 chunk 所共享的模块打包至 default 组
      cacheGroups: {
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          },
          // 
      default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
          }
      }
    }
  }
}
// 总结:
// 1.被复用代码或来自 node_moules 文件夹中的模块
// 2.模块的体积大小必须大于等于 30kb 才进行拆分
// 3.当按需加载 chunks 时，并行请求的最大数量不能超过 5
// 4.初始页面加载时，并行请求的最大数量不能超过 3



// Ex - 1
// 将 node_modules 中的 react 和 moment 再进行拆分，避免打包出的 vendor 包过大
splitChunks: {  
    chunks: 'all',  
    minSize: 30000,
     minChunks: 1,
    cacheGroups: {    
        lib: {      
            name: 'vendors',      
            test: /[\\/]node_modules[\\/]/,      
            priority: 10,      
            chunks: 'initial' // 只打包初始时依赖的第三方    
        },    
       react: {      
            name: 'react', // 单独将 react 拆包      
            priority: 20,
            test: /[\\/]node_modules[\\/]react[\\/]/,      
            chunks: 'all'    
       },
       moment: {
            name: 'moment', //单独将moment拆包
            priority: 20,
            test: /[\\/]node_modules[\\/]moment[\\/]/
       },
       default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}

```



##### 5-2-2-4、分割代码以按需加载/懒加载

Webpack 支持两种动态代码拆分技术：

- 符合 ECMAScript proposal 的 `import() 语法`(推荐)
- 传统的 `require.ensure`

import() 用于动态加载模块，其引用的模块及子模块会被分割打包成一个独立的 chunk；Webpack 还允许以注释的方式传参，进而更好的生成 chunk；

即使用 `import` 动态导入方式，可将要导入的模块单独分离到一个 `bundle` 中，以实现代码分离；

```js
import(/** webpackChunkName: "lodash" **/ 'lodash').then(_ => {
 // doSomething
})

// single target
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);

// multiple possible targets
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  `./locale/${language}`
);


// Ex - 1
// index.js
function getTLP() {
    return import ( /* webpackChunkName: "tlp" */ 'jquery').then(_ => {})
}
// 或 async await 形式
async function getTLP() {
  const TLP = await import ( /* webpackChunkName: "tlp" */ 'jquery');
  return TLP;
}
// 更为明显的表现懒加载形式 - 打包内容同样包含 bundle.js，但只有点击才会被网页请求加载
btn.onclick = e => import ( /* webpackChunkName: "TSL" */ "./print").then(module => {
  var print = module.default
  print()
})

// webpack.config.js
const path = require('path');
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
      	// 可通过 chunkFilename 进行更自定义的命名操作，若无配置 output.chunkFilename 则取默认值 [id].bundle.js
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
// 结果：生成文件包含一个叫 tlp.bundle.js
```

1、页面按需加载/懒加载(路由，页面绑定路由)(框架层级)

```js
// React 实现1
// 使用 loaable 动态引入
import React from'react'
import { Route } from'react-router-dom'
import { loadable } from'react-common-lib'

const Test = loadable({
  loader: () =>import('./test'),
})

const AppRouter = () => (
<div>
  <Route path="/test" exact component={Test} />
<div/>
)

// React 实现2
// 使用 React.lazy 函数可以像渲染常规组件一样处理动态引入的组件，应在 Suspense 组件中渲染 lazy 组件，配合路由更高效
import { Switch, Route, Redirect } from 'react-router-dom';

const Home = lazy(() => import('../views/Home));
const About = lazy(() => import('../views/About'));
const WrappedComponent = (component) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {component}
        </Suspense>
    );
};
const Main = () => (
  <Switch>
    <Route path="/home" component={WrappedComponent(Home)} />
    <Route exact path="/about" component={WrappedComponent(About)} />
  </Switch>
);
export default Main;


// Vue 
// 使用 () => import(xxx.vue)形式，打包会根据路由自动拆分打包
import VueRouter from 'vue-router'
Vue.use(VueRouter)
export default new VueRouter {
   routes: [
      {
        path: 'a',
        component: () => import('../views/A.vue')
      },
      {
        path: 'b',
        component: () => import('../views/B.vue')
      }
   ]
}

// Angular
// 早已支持
```

2、三方库按需加载，按功能模块加载，避免把整个库打包到项目中；

```js
// 按需引入lodash需要函数
import get from 'lodash/get';

// 按需引入组件
import { Button } from 'element-ui';
Vue.component(Button.name, Button);
```





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

