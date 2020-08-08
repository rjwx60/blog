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



#### 2-3、其他相关

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



##### 2-3-2-1、Css Modules

待定整理，备忘录…



##### 2-3-3、解析 Image、Font

首先安装解析包：`npm i file-loader -D`；

- file-loader：可用于处理文件、亦可用于处理字体：
- url-loader：可用于处理文件、亦可用于处理字体、但还可进行较小资源文件自动转 base64 的配置；
  - 注意：图3 的 url-loader 内部使用了 file-loader；
  - 注意：按情况讲，link 中 css 也会被处理，若无处理，可参考：[问题八](https://blog.csdn.net/sinat_17775997/article/details/61924901)

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

文件监听即当发现源码发生变化时，自动重新构建出新的输出文件，开启监听方式如下：

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

原理：轮询判断文件的最后编辑时间是否发生变化，若发生变化，不会立即告知监听者，而是先缓存，等待 aggregateTimeout，等待时间内，若有其他的文件也发生了变化，则会将变化的文件列表一并修改，生成到 bundle 文件中；

劣势：每次均需手动刷新浏览器；



##### 2-3-5、热更新机制

待定整理，备忘录…



##### 2-3-6、文件指纹策略

待定整理，备忘录…



##### 2-3-7、代码压缩方式

待定整理，备忘录…



### 三、进阶用法