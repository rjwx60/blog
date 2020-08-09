---
typora-root-url: ../Source
---



### 一、基本介绍





### 二、基础用法

#### 2-1、环境搭建与配置

- 初始化：`npm init -y`；

- - 注意：-y 是默认勾选确认；

- 安装包：`npm install webpack webpack-cli --save-dev`；

- - 注意：webpack4 将 webpack核心和脚手架进行分离，故需两者均进行安装；

- 始运行：或 `./node_modules/.bin/webpack` 构建，或 `npm scripts` 运行；

- - 原理：模块的局部安装，会在 node_modules/.bin 目录下创建软链；当执行 package.json 中的 script 时，则会按照一定顺序寻找命令对应位置，本地 node_modules/.bin 路径就在此寻找清单中；
  - 所以：无论是全局亦或局部安装的 Webpack，均无需写详细路径；

- 配置项：或自行新建 `webpack.config.js` 或执行命令 `webpack --config` 指定配置文件名；

- 示例如：配置文件基本配置如下：

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
module: {
	rules: [
		{
			test: /\.txt$/,
			use: 'raw-loader'
		}
	]
}
// test：正则表达式，用以匹配 loaders 所处理文件的拓展名；
// loader：loader 名称；
// include/exclude：必须处理的文件(文件夹) / 无需处理的文件(文件夹)；
// query：为 loaders 提供额外的设置项；
```

常见 loader 及功能示意：

- babel-loader：转换 ES6 ES7 等新特性语法；
- css-loader：支持 .css 文件的加载与解析；
- less-loader：将 less 文件转为 css；
- ts-loader：将 ts 转成 js；
- file-loader：进行图片、字体等的打包；
- raw-loader：将文件以字符串形式导入；
- thread-loader：多进程打包 JS 和 CSS；

- 

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

##### 2-2-4-1、BannerPlugin

版权提示插件；

```js
plugins: [
	new webpack.BannerPlugin('版权所有，翻版必究')
]
```

##### 2-2-4-2、HtmlWebpackPlugin

依据 index.html 模板，生成一个自动引用打包后 JS 文件的新 index.html，常用于为文件添加 hash 值；

在编译过程中，插件会依据此模板生成最终的 html 页面，会自动添加所依赖的 css, js，favicon等文件；

使用如下：引入模板文件，自动生成：index.html 文件；

```js
new HtmlWebpackPlugin({
	template: __dirname + "/app/index.tmpl.html"
})
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
module: {
	rules: [
		{
			test: /\.js$/,
			use: 'babel-loader'
		}
	]
}

// .babelrc
{
  "presets": [
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
module: {
	rules: [
		{
			test: /\.css$/,
			use: [
				'style-loader', 'css-loader'
			]
		},
		{
			test: /\.less$/,
			use: [
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
module: {
	rules: [
		{
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: "css-loader",
					options: {
            // 启用 css module
						module: true,
            // 指定 css 类名格式
						localIdentName: '[name]__[local]--[hash:base64:5]'
					}
				}
			]
		}
	]
}

// 1、局部作用域
module: {
	rules: [
		{
			test: /\.css$/, 
      loader: "style-loader!css-loader?modules" 
      // 查询参数 modules，表示打开 CSS Modules 功能
		}
	]
}

// 2、全局作用域
// CSS Modules 允许使用 :global(.className) 语法，声明一个全局规则, 凡是这样声明的 class，都不会被编译成哈希字符串;
// CSS Modules 还提供一种显式的局部作用域语法 :local(.className)，等同于 .className
:global(.title) {
	color: green;
}

// 3、定制哈希类名
// css-loader 默认的哈希算法是 [hash:base64]; 会将 .title 编译成 ._3zyde4l1yATCOkgn-DBWEL 这样的字符串
module: {
   rules: [
    {
       test: /\.css$/,
       loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
       // demo03-components-App---title—GpMto
    },
   ]
}

// 4、Class 组合
// CSS Modules 中，一个选择器可继承另一个选择器的规则，这称为"组合-composition"
.className {
 background-color: blue;
}

.title {
 composes: className;
 color: red;
}
// 编译后结果
// <h1 class="_2DHwuiHWMnKTOYG45T0x34 _10B-buq6_BEOTOl9urIjf8">
._2DHwuiHWMnKTOYG45T0x34 {
   color: red;
}
._10B-buq6_BEOTOl9urIjf8 {
   background-color: blue;
}

// 5、与其他模块的 Class 组合
// another.css
.className {
   background-color: blue;
}
// app.css
.title {
   composes: className from './another.css';
   color: red;
}

// 6、输入变量使用
// CSS Modules 支持使用变量，但需安装 PostCSS 和 postcss-modules-values 
// 把 postcss-loader 加入 webpack.config.js
var values = require("postcss-modules-values");
module.exports = {
  entry: __dirname + "/index.js",
  output: {
    publicPath: "/",
    filename: "./bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "stage-0", "react"],
        },
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules!postcss-loader",
      },
    ],
  },
  postcss: [values],
};
// 接着，在 colors.css 里面定义变量：
@value blue: #0c77f8;
@value red: #ff0000;
@value green: #aaf200;

// App.css 可以引用这些变量：
@value colors: "./colors.css";
@value blue, red, green from colors;
```





##### 2-3-3、解析 Image、Font

首先安装解析包：`npm i file-loader -D`；

- file-loader：可用于处理文件、亦可用于处理字体：
- url-loader：可用于处理文件、亦可用于处理字体、但还可进行较小资源文件自动转 base64 的配置；
  - 注意：图3 的 url-loader 内部使用了 file-loader；
  - 注意：一般情况下，link 中 css 也会被处理，若无处理，可参考：[问题八](https://blog.csdn.net/sinat_17775997/article/details/61924901)

```js
module: {
	rules: [
		{
			test: '/\.(png|svg|jpg|gif)$/',
			use: [
				'file-loader'
			]
		},
		{
			test: '/\.(woff|woff2|eot|ttf|otf)$/',
			use: [
				'file-loader'
			]
		},
		{
			test: '/\.(png|svg|jpg|gif)$/',
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 10240
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
- 方式2：配置 webpack.config.js 时，设置 watch: true；

- 注意：开启 ignored 可提高监听性能；

```js
module.export = {
  // 默认 false 不开启
	watch: true,
  // 开启后设置 options 才有意义
	watchOptions: {
    // 默认为空，不监听的文件或文件夹，支持正则
		ignored: /node_modules/,
    // 监听到变化后会等待 300ms 再去执行，默认 300
		aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件是否发生变化实现的，默认每秒询问 1000 次
		poll: 1000
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
  "scripts": {
  	"build": "webpack",
  	"dev": "webpack-dev-server --open"
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
	plugin: [
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
    // 本地服务器所加载的页面所在的目录
		contentBase: './dist',
    // 不跳转
    historyApiFallback: true,
    // 实时刷新
    inline: true
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

- Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 就会更改；
- Chunkhash：和 webpack 打包的 chunk 相关，不同的 entry 会生成不同的 chunkhash 值；
- Contenthash：根据文件内容定义 hash，文件内容不变，则 contenthash 不变；
  - 注意：contenthash 用于 css 文件、chunkhash 用于 js 文件；
  - 注意：若 hash 与 chunkhash 造成的问题，请看[问题十二](https://blog.csdn.net/sinat_17775997/article/details/61924901)；
  - 注意：chunk 模式无法与 WDS 共用，即无法与 hotModule 共用，须切换至 production mode，去除热更新；

##### 2-3-6-1、JS 文件指纹设置

使用 [chunkhash]，设置 output filename

```js
// webpack.config.js
module.export = {
	// ...
	output: {
		filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
	},
  // ...
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.join(__dirname, 'dist')
	}
}
```

补充：https://juejin.im/post/5a068c2b5188255851322b8c#heading-14

注意：关于浏览器缓存，若版本更新后，客户端没有清除缓存，同时缓存还未过期的情况下，无法获取最新资源，此时可通过 hash 值来进行版本控制；

```js
// webpack.config.js
module.export = {
	// ...
	output: {
		filename: '[name][hash].js',
    path: __dirname + '/dist'
	}
}
```



##### 2-3-6-2、图片文件指纹设置

- 方式A：使用 [hash] 设置 file-loader 的 name

- ```js
  module: {
    // ...
  	rules: [
  		{
  			test: '/\.(png|svg|jpg|gif)$/',
  			use: [
  				{
            loader: 'file-loader',
            options: {
              name: 'img/[name]_[hash:8].[ext]'
            }
          }
  			]
  		}
  	]
  }
  ```

- 方式B：url-loader，小于阀值转码，大于命名打包，此外可处理 svg、eot、ttf 等文件，[参考](https://juejin.im/post/5a068c2b5188255851322b8c#heading-13)

- ```js
  module: {
    // ...
  	rules: [
  		{
  			test: '/\.(png|svg|jpg|gif)$/',
  			loader: 'url?limit=8192&name=images/[hash:8].[name].[ext]'
  		}
  	]
  }
  ```

  <img src="/Image/Engineering/16.png" style="zoom:90%;" align="left"/>



##### 2-3-6-3、CSS 文件指纹设置

使用 [contenthash] 设置 MiniCssExtractPlugin 的 filename；安装：`npm i mini-css-extract-plugin -D`；

- 注意：普通使用中，style-loader 会将 css 合并插入至文档，但此不利于作版本管理，故通常将其提取分离，然后再处理；

```js
module.export = {
  // ... 
  module: {
  	rules: [
      {
        test: /\.css$/,
        use: [
          // 删除与之冲突的 style-loader，并替换为插件提供的loader
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 删除与之冲突的 style-loader，并替换为插件提供的loader
          // 'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'less-loader'
        ]
      }
		]
  },
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash:8].css'
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
	plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
	]
}
```



##### 2-3-7-2、HTML 压缩

使用：强大插件：html-webpack-plugin、空格、换行符、注释均可处理，安装：`npm i html-webpack-plugin -D`

- 注意：<u>多个文件须多次写入</u>，比如下面用法；

```js
// webpack.config.js
module.export = {
  // ...
	plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      chunks: ['index'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
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
	plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
         warnings: false
      }
  	})
	]
}
```



### 三、进阶用法