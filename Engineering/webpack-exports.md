---
typora-root-url: ../Source
---



### 八、Loader & Plugin 编写

Loader 本质是函数，在该函数中对接收的内容进行转换，并返回转换后结果；因为 Webpack 只认识 JS，Loader 需要对其他类型资源进行转译预处理工作；

- 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性；

Plugin 就是插件，基于事件流框架 `Tapable`用以扩展 Webpack 功能；Webpack 运行的生命周期中会广播出许多事件，Plugin 可监听这些事件，并在合适时机通过 Webpack 提供的 API 改变输出结果，以扩展 webpack 功能；

- 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入；



#### 8-1、Loader

##### 8-1-1、基本

Webpack 基于 Node，故只能识别 JS 模块，无法加载其他类型文件，因此需要 **<u>对不同类型文件的 JS 转换器</u>**，也即 Loader ，Loader 本质是一个模块，作用是将源模块转换成通用模块，特性如下：

- <u>链式传递</u>，按照配置时相反的顺序链式执行；
- 基于 Node 环境，拥有 <u>较高权限</u>，比如文件的增删查改；
- 可同步也可异步；

```js
// 最简单的 loader：对 Webpack 传入的字符串进行按需修改
// html-loader/index.js
module.exports = function(htmlSource) {
	// 返回处理后的代码字符串
	// 删除 html 文件中的所有注释
	return htmlSource.replace(/<!--[\w\W]*?-->/g, '')
}
```

实际 loader 通常需要将代码进行分析，构建 AST， 遍历进行定向修改后，再重新生成新的代码字符串；比如 Babel-loader 会执行以下步骤:

- `babylon` 将 ES6/ES7 代码解析成 AST
- `babel-traverse` 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 `babel-generator` 转换成 ES5

与 plugin 区别：

- loader：转换器，匹配需要处理的文件类型后，将 A 文件进行转译成为 B 文件；
  - 比如：将 A.less 转换为 A.css，进行单纯的、文件转换过程；

- plugin：扩展器，丰富 webpack 自身功能，针对的是 loader 结束后，webpack 打包的整个过程；
  - 注意：plugin 并不直接操作文件，而是基于事件机制工作，监听 webpack 打包过程中事件，执行广泛任务；



##### 8-1-2、常用 Loader

- file-loader：加载文件资源，如字体/图片等，具有移动/复制/命名等功能；
- url-loader：常用于加载图片，可将小图片直接转换为 Date Url，减少请求；
- babel-loader：加载 JS / JSX 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题；
- ts-loader：加载 TS / TSX 文件，编译 TypeScript；
- style-loader：将 css 代码以 `<style>` 标签形式插入 html 中；
- css-loader：分析 `@import` 和 `url()`，引用 css 文件与对应的资源；
- postcss-loader：用于 css 的兼容性处理，还具有 添加前缀、单位转换 等功能；
- less-loader / sass-loader：将 css 预处理器转为 css；



##### 8-1-3、使用 Loader

##### 8-1-3-1、配置 Loader

```js
// 1、附带 loader 地址
let webpackConfig = {
    //...
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                // loader 的路径
                loader: path.resolve(__dirname, 'loaders/a-loader.js'), 
                options: {/* ... */}
            }]
        }]
    }
}

// 2、通过配置 resolveLoader 免于路径输入
// resolveLoader 用于告知 Webpack 如何寻找 Loader，默认只寻找 node_modules，寻找具有先后顺序
let webpackConfig = {
    //...
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                //这里写 loader 名即可
                loader: 'a-loader', 
                options: {/* ... */}
            }, {
                loader: 'b-loader', 
                options: {/* ... */}
            }]
        }]
    },
    resolveLoader: {
        // 告诉 webpack 该去那个目录下找 loader 模块
        modules: ['node_modules', path.resolve(__dirname, 'loaders'), './elseLoaders/']
      	// 设置别名
      	alias: {
      		"babel-loader": path.resolve('src/loaders/babel-loader.js')
    		} 
    }
}

// 3、通过 npm link 方式
// 专用于开发和调试本地 Npm 模块，能做到在不发布模块的情况下，将本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，于是此项目便可直接使用本地的 Npm 模块；由于通过软链接方式实现，编辑了本地的 Npm 模块代码，在项目中也能使用到编辑后的代码，完成 Npm link 步骤如下:
// 3-1、确保正在开发的本地 Npm 模块(即 loader 模块) 的 package.json 已配置好
// 3-2、在本地 Npm 模块目录下执行 Npm link，使其注册到全局
// 3-3、在项目根目录下执行 npm link loader-name，使 3-2 步中注册到全局的本地模块链接到项目的 node_modules 下
// 注意: 3-3 中 loader-name 即本地模块在 package.json 中配置的模块名
// 最后，即可像使用真正 loader 那样使用 本地 loader
```

注意：可使用 `enforce` 强制执行 `loader` 作用顺序，`pre` 代表在所有正常 loader 之前执行，`post` 是所有 loader 之后执行(inline 官方不推荐使用)；来如何保证各个loader按照预想方式工作；



##### 8-1-3-2、流程简介

配置完成后，当 webpack 工作时，匹配到 rule 时，就会启用相应的 loader ，loader 最终会导出一个函数，函数接受的唯一参数是一<u>包含源文件内容的字符串-source</u>，然后函数对 source 进行处理，最后通过 `return` 返回单个值，或调用 `this.callback(err, values...)` 来返回多个值；此时若为异步 loader 可通过抛错来处理异常情况；Webpack 建议返回 1-2 个参数：转化后的 source( string 或 buffer)、可选参数 SourceMap 对象；

```js
{
  test: /\.js/,
  use: [
    'bar-loader',
    'mid-loader',
    'foo-loader'
  ]
}
```

- loader 调用顺序：foo-loader -> mid-loader -> bar-loader；
- foo-loader 最先拿到 source，处理后将其传递给 mid，mid 拿到 foo 处理过的 "source" ，再处理后返回给 bar，bar 处理完后再交给  webpack；
- bar-loader 最终将返回值、source map(若有的话) 传给 webpack；



##### 8-1-4、解析 Loader

##### 8-1-4-1、url-loader

处理图片，将图片转为 base64；

```js
// 工作内容：将文件做 base64 编码，直接嵌入到 CSS/JS/HTML 代码中；
// 工作流程：
// 获取 limit 参数
// 如果 文件大小在 limit 之类，则直接返回文件的 base64 编码后内容
// 如果超过了 limit ，则调用 `file-loader

var loaderUtils = require("loader-utils");

module.exports = function(content) {

  var options = loaderUtils.getOptions(this) || {};
  
  // limit 参数，只有文件大小小于这个数值的时候我们才进行base64编码，否则将直接调用 file-loader
  var limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit);

  if (limit) {
    limit = parseInt(limit, 10);
  }

  var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

  // No limits or limit more than content length
  if (!limit || content.length < limit) {
    if (typeof content === "string") {
      content = new Buffer(content);
    }
    // 直接返回 base64 编码的内容
    return (
      "module.exports = " +
      JSON.stringify(
        "data:" +
          (mimetype ? mimetype + ";" : "") +
          "base64," +
          content.toString("base64")
      )
    );
  }
  // 超过了文件大小限制，那么我们将直接调用 file-loader 来加载
  var fallback = options.fallback || "file-loader";
  var fallbackLoader = require(fallback);

  return fallbackLoader.call(this, content);
};

// 注意：默认情况下 webpack 会将文件内容当做 UTF8 字符串处理，而我们的文件是二进制的，当做 UTF8 会导致图片格式错误；
// 此时需要指定 webpack 用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串返回；
// 参见： https://webpack.github.io/docs/loaders.html#raw-loader
module.exports.raw = true;
```



##### 8-1-4-2、file-loader

```js
// 工作内容：复制文件内容，并根据配置为其生成唯一文件名；
// 工作流程：
// 通过 loaderUtils.interpolateName 方法可以根据 options.name 以及文件内容生成一个唯一的文件名 url(一般配置都会带上hash，否则很可能由于文件重名而冲突)
// 通过 this.emitFile(url, content) 告诉 webpack 我需要创建一个文件，webpack会根据参数创建对应的文件，放在 public path 目录下。
// 返回 'module.exports = __webpack_public_path__ + '+ JSON.stringify(url) + ‘;’ ，这样就会把原来的文件路径替换为编译后的路径
// 对file-loader 中最重要的几行代码解释如下(我们自己来实现一个 file-loader 就只需要这几行代码就行了，完全可以正常运行且支持 name 配置)：

var loaderUtils = require('loader-utils')

module.exports = function (content) {

  // 获取参数：通过 loaderUtils 获取 webpack 中的配置 options
  // 当前配置：`name=[name]_[hash].[ext]`
  // 获取结果：{ name: "[name]_[hash].[ext]" }
  const options = loaderUtils.getOptions(this) || {};

  // 可根据 name 配置和 content 内容生成一个文件名；
  // 注意：需要文件内容是为了保证，当文件内容没有发生变化时，名字中的 [hash] 字段也不会变(可理解为用文件的内容作了一个 hash);
  let url = loaderUtils.interpolateName(this, options.name, {
    content
  })

  // 告诉 webpack 创建文件，文件名和内容，这样webpack就会帮你在 dist 目录下创建一个对应的文件
  this.emitFile(url, content);

  // 使用变量：__webpack_public_path__，webpack提供的全局变量，public 的根路径；
  // 详情参看：https://webpack.js.org/guides/public-path/#on-the-fly
  // 返回内容：一段JS，比如：background-image: url('a.png') --> background-image: require('xxxxxx.png')
  // 其中：require 语句返回的结果，即下面的 exports 的字符串，也就是图片的路径；
  return 'module.exports = __webpack_public_path__ + '+ JSON.stringify(url)
}

// 注意：默认情况下 webpack 会将文件内容当做 UTF8 字符串处理，而我们的文件是二进制的，当做 UTF8 会导致图片格式错误；
// 此时需要指定 webpack 用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串返回；
// 参见： https://webpack.github.io/docs/loaders.html#raw-loader
module.exports.raw = true
```



##### 8-1-4-3、style-loader

<img src="/Image/Engineering/424.png" style="zoom:50%;" align="left"/>

- css 代码会先经过 css-loader 处理，然后才送往 style-loader 处理；
- 前者作用：处理 css 中的 @import 和 url 等的外部资源引用；
- 后者作用：将样式插入到 DOM 中，具体做法是在 head 中插入一个 style 标签，然后将样式写入此标签中；

`style-loader` 主要代码如下及主要步骤：

- 通过 `require` 获取 CSS 文件的内容，得到是一个字符串；
- 调用 `addStyles` 将 CSS 内容插入到 DOM 中去；
- **<u>注意：style-loader 是一个 pitch loader</u>**

```js
module.exports.pitch = function(request) {
  // 获取 CSS 文件的内容
  return [
    "var content = require(" +
      loaderUtils.stringifyRequest(this, "!!" + request) +
      ");",
    "if(typeof content === 'string') content = [[module.id, content, '']];",
    // 省略无关内容
    "// Prepare cssTransformation", 
    "// add the styles to the DOM",
    // 调用 addStyles ，把CSS内容插入到DOM中去
    "var update = require(" +
      loaderUtils.stringifyRequest(
        this,
        "!" + path.join(__dirname, "lib", "addStyles.js")
      ) +
      ")(content, options);",
    // 支持 css modules，如果启用了 css modules，class的映射就放在 content.locals 中，因此直接默认导出，我们 import 的时候就会得到一个映射字典。
    "if(content.locals) module.exports = content.locals;",
    options.hmr ? hmrCode : ""
  ].join("\n");
};
```

pitch 实际是一个特殊的 loader，默认情况下，loader 加载顺序会从右往左；而 pitch-loader 是从左往右执行；[详看](https://webpack.js.org/api/loaders/#pitching-loader)

<img src="/Image/Engineering/425.png" style="zoom:50%;" align="left"/>

为何，使用 pitch loader？

因为：需要将 CSS 文件内容插入 DOM，在此之前，需要获取 CSS 文件样式；

而若，按照默认从右往左的顺序，使用 css-loader，则会获取到 JS 字符串，而非 CSS 样式；

而为，获取 CSS 样式，可在 style-loader 中直接通过 require 获取，如此需先执行 style-loader，在其中再执行 css-loader；

意即，同样的字符串，在默认模式下是当字符串传入，在 pitching 模式下是当代码运行；

所以，处理 CSS 时，实际是 styled-loader 先执行，其会调用 css-loader 来获取经过编译的内容(对象，对象 *toString()* 方法可直接返回 *css* 样式内容)；

最后，style-loader 处理流程如下：

- 感叹号：用来忽略 loader 配置，因 style-loader 用来加载 css 文件，若不忽略配置，会出现无限递归调用的情况；

- - 意即：! 语法会禁用掉 preLoader、loader，故此 require 并不会递归调用自身；
  - 否则：style-loader 里面调用 `require(‘xxx.css’)` ，此 require又会去调用 style-loader… [参考](https://webpack.github.io/docs/loaders.html#loader-order)

- `loaderUtils.stringifyRequest`：将绝对路径转成相对路径；[参考](https://github.com/webpack/loader-utils )

- addStyle：核心事情即在 head 中插入一个 style 标签，并把 CSS 内容写入这个标签中；

```js
// 自实现
module.exports.pitch = function (request) {
  var result = [
    // 得到 css 内容
    'var content=require(' + loaderUtils.stringifyRequest(this, '!!' + request) + ')', 
    // 调用  addStyle 把CSS内容插入到DOM中
    'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, "add-style.js")) + ')(content)', 
    // 如果发现启用了 css modules，则默认导出它
    'if(content.locals) module.exports = content.locals'
  ]
  return result.join(';')
}

// add-style.js
module.exports = function (content) {
  var style = document.createElement("style")
  style.innerHTML = content
  document.head.appendChild(style)
}
```



##### 8-1-4-4、css-loader

css-loader 工作原理：

- css-loader 并非 pitching loader，而是使用默认模式；
- style-loader 中若不用 css-loader就去调用 require 去加载 css 文件，会直接报错：“没有 css 文件对应的 loader “；
- style-loader 只负责插入 CSS，然而 CSS 中的 `@import` 和 url 语句仍需要 css-loader 去解析；
- 另外，modules 等也是在 css-loader 上实现；

<img src="/Image/Engineering/426.png" style="zoom:50%;" align="left"/>

css-loader 会执行2次，因为有2个文件，每个 css 文件的处理，比如上述 style.css 的处理会包括2部分：

- 将 `@import` 替换成 `require("-!../node_modules/css-loader/index.js!./global.css")`

- - ! 语法会禁用掉 preLoader、loader，故此 require 并不会递归调用自身；

- 将 `background-image: url('./avatar.jpeg’)` 替换成 `"background-image: url(" + require("./avatar.jpeg") + “)"`

- - 图片处理较简单，因如何加载图片，是另一个 loader 的事情，css-loader 不负责这部分，其只需将 url 转换成 require 即可；

- 总结：即将2种 CSS 内部的依赖，替换成 JS 语法 require，如此 webpack 即可正确处理；

```js
// css-base 中的方法执行后返回一个数组，故此处实际返回一个数组
// 随后的过程中，调用了数组上的 i 和 push 方法
// i 方法是用以处理 @import 的，而 push 则将当前模块的内容推入数组
exports = module.exports = require("../node_modules/css-loader/lib/css-base.js")(
  undefined
);

// imports
// i 方法其实就是把一个CSS模块 push 到数组中，例子中的 style.css 依赖 global.css 所以需要加入这个依赖
exports.i(require("-!../node_modules/css-loader/index.js!./global.css"), "");

// module
// 向默认导出的数组中加入了一个数组，存放 `module.id` 和自身 css 内容
// 实际上 exports.i 执行的过程与此类似，只不过是加入的是别的模块
exports.push([
  module.id,
  "h1 {\n  color: #f00;\n}\n\n.avatar {\n  width: 100px;\n  height: 100px;\n  background-image: url(" +
    require("./avatar.jpeg") +
    ");\n  background-size: cover;\n}\n",
  ""
]);

// exports
// 这里是 modules 模式的时候用的一个名字映射
// 如果启用了 css modules，就需要 classname 映射表
// 这里 exports.locals 中，传给 style-loader， 后者发现有 locals 后就会默认导出它
// 最终我们 import styles from “styles.css" 时就得到了这个 locals 映射表
exports.locals = {
  avatar: "_2cO19opl9mOimp5NKYGn-L"
};
```

上述四段代码执行后结果如下：

其中的 toString 方法会将所有依赖 map 一遍，并合并成一个大的字符串，即 CSS 内容；

<img src="/Image/Engineering/427.png" style="zoom:50%;" align="left"/>

```js
// 自实现 css-loader
var parserPlugin = postcss.plugin("css-loader-parser", function(options) {
  return function(css) {
    // 存储 import 依赖
    var importItems = []; 
    // 存储 url 依赖
    var urlItems = []; 

    // 遍历所有的 import 规则，然后存储到 importItems 中
    css.walkAtRules(/^import$/i, function(rule) {
      var values = Tokenizer.parseValues(rule.params);
      var url = values.nodes[0].nodes[0];
      if (url && url.type === "url") {
        url = url.url;
      } else if (url && url.type === "string") {
        url = url.value;
      }
      importItems.push({
        url: url
      });
    });

    function processNode(item) {
      switch (item.type) {
        case "value":
          item.nodes.forEach(processNode);
          break;
        case "nested-item":
          item.nodes.forEach(processNode);
          break;
        case "url":
          // 如果是一个url依赖，那么需要：
          // 1. 把它替换成一个占位符
          // 2. 把它对应的 url 存在 urlItems 中
          // 这样下一步我们就可以从 urlItems 中取出 url 替换掉占位符
          if (loaderUtils.isUrlRequest(item.url)) {
            var url = item.url;
            item.url = "___CSS_LOADER_URL___" + urlItems.length + "___";
            urlItems.push({
              url: url
            });
          }
          break;
      }
    }

    var icss = icssUtils.extractICSS(css);
    exports = icss.icssExports; // 这就是 css 名字被编译后的映射表

    css.walkDecls(function(decl) {
      var values = Tokenizer.parseValues(decl.value);
      values.nodes.forEach(function(value) {
        value.nodes.forEach(processNode);
      });
      decl.value = Tokenizer.stringifyValues(values);
    });

    options.importItems = importItems;
    options.urlItems = urlItems;
    options.exports = exports;
  };
});

module.exports = function(inputSource) {
  if (this.cacheable) this.cacheable();
  var callback = this.async();
  var options = {
    mode: "local"
  };
  var pipeline = postcss([
    // localByDefault 会把所有的 class 都编译成 :local(class) 形式
    localByDefault({ mode: options.mode }), 
    // modulesScope 会把 :local(class) 编译成 一个hash的类名，和上面的结合起来就可以实现 css modules
    modulesScope(), 
    parserPlugin(options)
  ]);

  pipeline.process(inputSource).then(function(result) {
    // 处理import
    var alreadyImported = {};
    // 这里开始处理 importItems 中记录的依赖，比如 对 `global.css` 的依赖
    var importJs = options.importItems
      .filter(function(imp) {
        // 因为很可能同一个模块会被多次依赖，所以要去重一下。
        if (alreadyImported[imp.url]) return false;
        alreadyImported[imp.url] = true;
        return true;
      })
      .map(function(imp) {
        // 对于新的依赖，就在这里处理, 加载远程资源的这里我们就不处理了。直接把所有的 import 都替换成 require
        return (
          "exports.i(require(" +
          loaderUtils.stringifyRequest(this, imp.url) +
          "))"
        );
      }, this);

    // 省略 sourcemap
    var cssAsString = JSON.stringify(result.css);

    // 处理 url
    var URLREG_G = /___CSS_LOADER_URL___(\d+)___/g;
    var URLREG = /___CSS_LOADER_URL___(\d+)___/;
    // 正则式匹配所有的占位符，然后取出其中的 id，根据 id 在 urlItems 中找到对应的 url，然后替换即可。
    cssAsString = cssAsString.replace(URLREG_G, function(item) {
      var match = URLREG.exec(item);
      if (!match) return item;
      const url = options.urlItems[+match[1]].url;

      return '" + require("' + url + '") + "';
    });

    var moduleJs = "exports.push([module.id, " + cssAsString + ', ""]);';

    // 我们的最终结果 包括这几部分:
    // 1. 引入 css-base，这个模块定义了 exports 默认的行为，包括 toString 和 i
    // 2. 所有的 import 依赖
    // 3. 导出自身
    // 4. locals
    callback(
      null,
      [
        "exports = module.exports = require(" +
          loaderUtils.stringifyRequest(this, require.resolve("./css-base.js")) +
          ")();\n",
        importJs.join(""),
        moduleJs,
        "exports.locals =" + JSON.stringify(options.exports)
      ].join(";")
    );
  });
};
```

附上其他解析：

css-loader [css-loader 源码解析](https://github.com/lihongxun945/diving-into-webpack/blob/master/3-style-loader-and-css-loader.md#css-loader-源码解析)：

包括处理 import 和 url 两种依赖，并支持 css modules、支持处理 CSS 新特性、sourceMap、外链 css，以及对各种不同配置的支持比如 root 等；

[css-loader 实现](https://github.com/lihongxun945/diving-into-webpack/blob/master/3-style-loader-and-css-loader.md#自己实现一个简单的-css-loader)(只能处理 import 和 url 两种依赖，并支持 css modules )：



##### 8-1-4-5、babel-loader

##### 8-1-4-6、vue-loader





##### 8-1-5、编写 Loader

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情；[Loader的API](https://www.webpackjs.com/api/loaders/) 

- Loader 运行在 Node.js 中，可调用任意 Node.js 自带的 API 或者安装第三方模块进行调用
- Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据
- 尽可能的异步化 Loader，若计算量很小，同步也可以
- Loader 为无状态，不应在 Loader 中保留状态
- 使用 loader-utils 和 schema-utils 可提供的实用工具(获取传参等)
- 加载本地 Loader 方法
  - Npm link
  - ResolveLoader



##### 8-1-5-1、编写原则

- **单一原则**：每个 Loader 只做一件事；
- **链式调用**：单一原则的延伸，Webpack 会按顺序链式调用每个 Loader；
- **统一原则**：应遵循 Webpack 制定的设计规则和结构(模块化)，输入与输出均为字符串，各个 Loader 完全独立(无状态)，即插即用；

##### 8-1-5-2、编写技巧

- Loader 参数获取
  - webpack.config.js 的 loader 的 options 内容(参数)，可用 webpack 自带插件 loader-utils 获取
  - <img src="/Image/Engineering/400.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/401.png" style="zoom:50%;" align="left"/>

- Loader 返回值方式：return & this.callback
  - 使用后者形式导出代码而不是 return，因其可传入更多参数，更细粒度调节；
  - 注意：SourceMap 生成耗时，一般只用于开发环境，故 webpack 为 loader 提供了 this.sourceMap API 告诉当前构建环境用户是否需要 SourceMap
  - <img src="/Image/Engineering/403.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/404.png" style="zoom:50%;" align="left"/>

- Loader 异步方案：
  - 可用 Promise + Async 方案，亦可用 Promise + 本地方案 thsi.async，图2
  - <img src="/Image/Engineering/405.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/406.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/407.png" style="zoom:50%;" align="left"/>

- Loader 缓存操作
  - Webpack 默认缓存所有 Loader 处理结果，故能在需要被处理的文件或其依赖的文件没有发生变化时，不会重新调用对应的 Loader 去执行转换操作；
  - 原因：某些情况下，某些转换操作需大量计算、十分耗时，若每次构建都重新执行重复的转换操作，构建将会变得非常缓慢；
  - 注意：若不缓存处理结果，则可设置：在 loader 中添加 `this.cacheable(false)` 以关闭 webpack 对 loader 执行结果的默认缓存效果；
  - <img src="/Image/Engineering/408.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/409.png" style="zoom:50%;" align="left"/>

- Loader 二进制数据处理
  - webpack 传给 Loader 内容默认均为 UTF-8 格式编码的字符串；但某些场景需要处理二进制文件，比如 file-loader，此时需为 Loader 传入二进制数据；
  - <img src="/Image/Engineering/410.png" style="zoom:50%;" align="left"/>

- Loader 共享数据
  - 在 loader 中添加 `pitch` 函数，此函数先于所有 loader 执行，且其第三参数为同一 rule下的所有 loader 所共享
  - <img src="/Image/Engineering/411.png" style="zoom:50%;" align="left"/>
  - <img src="/Image/Engineering/412.png" style="zoom:50%;" align="left"/>

- Loader Options 校验

  - 用于校验 options 的 JSON Schema 常量，从而校验 loader options

  - ```js
    import { getOptions } from 'loader-utils';
    import { validateOptions } from 'schema-utils';
    
    const schema = {
      type: object,
      properties: {
        test: {
          type: string
        }
      }
    }
    
    export default function(source) {
      	// 获取
        const options = getOptions(this);
      	// 校验
        validateOptions(schema, options, 'Example Loader');
        // 在这里写转换 source 的逻辑 ...
        return `export default ${ JSON.stringify(source) }`;
    };
    ```

- Loader 外部依赖

  - 通过 addDependency 声明外部资源(从文件系统中读取的资源)信息，用于在监控模式(watch mode)下验证可缓存的 loder 以及重新编译

  - ```js
    import path from 'path';
    
    export default function(source) {
        var callback = this.async();
        var headerPath = path.resolve('header.js');
    		// 声明操作
        this.addDependency(headerPath);
    		// 异步 loader
        fs.readFile(headerPath, 'utf-8', function(err, header) {
            if(err) return callback(err);
            // 这里的 callback 相当于异步版的 return
            callback(null, header + "\n" + source);
        });
    };
    ```

- Loader 同伴依赖

  -  若开发的 loader 只是简单包装另外一个包，则应在 package.json 中将此声明为同伴依赖(peerDependency)，以便指定具体版本；

  - ```json
    "peerDependencies": {
      "node-sass": "^4.0.0"
    }
    ```

- 其他技巧：比如 模块依赖、代码公用、绝对路径，更多的 API请看 [文1](https://juejin.im/post/6844903555673882632#heading-15)、[文2](https://segmentfault.com/a/1190000015088834#articleHeader10)

- 示例：

  - ```
    // 注意: source 参数是 compiler 传递给 Loader 的一个文件的原内容
    
    // 1、基本形式
    module.exports = function (source ) { 
        return source; 
    }
    
    // 2、三方模块
    const sass= require('node-sass'); 
    module.exports = function (source) { 
      return sass(source);
    }
    
    // 3、webpackAPI
    // 获取用户为 Loader 传入的 options
    const loaderUtils =require ('loader-utils'); 
    module.exports = (source) => {
        const options= loaderUtils.getOptions(this); 
        return source; 
    }
    // 返回sourceMap
    module.exports = (source)=> { 
        this.callback(null, source, sourceMaps); 
        // 当使用 this.callback 返回内容时 ，该 Loader 必须返回 undefined,
        // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中
        return; 
    }
    // 异步
    module.exports = (source) => {
        const callback = this.async()
        someAsyncOperation(source, (err, result, sourceMaps, ast) => {
            // 通过 callback 返回异步执行后的结果
            callback(err, result, sourceMaps, ast)
        })
    }
    // 缓存加速
    module.exports = (source) => { 
        // 关闭该 Loader 的缓存功能
        this.cacheable(false)
        return source 
    }
    ```

    



##### 8-1-5-3、empty-loader



##### 8-1-5-4、test-loader



##### 8-1-5-5、html-minify-loader

```js
// webpack.config.js
module: {
  rules: [{
    test: /\.html$/,
    use: [
      // 处理顺序 html-minify-loader => html-loader => webpack
      // html-loader 为三方 loader, 负责解析 html 、转化为 JS 执行脚本
      // html-minify-loader 为此例 loader, 负责压缩
      'html-loader', 
      {
      	loader: 'html-minify-loader',
      	options: {
        	comments: false
      	}
    	}
    ] 
  }]
},
  resolveLoader: {
    // 因为 html-loader 是开源 npm 包，所以这里要添加 'node_modules' 目录
    modules: [path.join(__dirname, './src/loaders'), 'node_modules']
  }

```

loader 也是一个 node 模块，它导出一个函数，该函数的参数是 require 的源模块，处理 source 后把返回值交给下一个 loader，基本模板如下

```js
// html-minify-loader
module.exports = function (source) {
    // 处理 source ...
    return handledSource;
}
// 或
module.exports = function (source) {
    // 处理 source ...
    this.callback(null, handledSource)
    return handledSource;
}
// 注意: 若是处理顺序排在最后一个的 loader，则它的返回值将最终交给 webpack 的 require
// 处理顺序排在最后的 loader
module.exports = function (source) {
    // 此 loader 的功能是把源模块转化为字符串交给 require 的调用方
    return 'module.exports = ' + JSON.stringify(source);
}
```

使用 `minimize` 这个库来完成核心的压缩功能

```js
// src/loaders/html-minify-loader.js
var Minimize = require('minimize');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
  	// 采用异步方式，不会阻塞其他编译进度
    var callback = this.async();
    if (this.cacheable) {
        this.cacheable();
    }
   	// 拿到 webpack.config.js 的 loader 配置
    var opts = loaderUtils.getOptions(this) || {};
    var minimize = new Minimize(opts);
    minimize.parse(source, callback);
};
```



##### 8-1-5-6、my-babel-loader

- 作用：将 ES6 代码转换为 ES5 代码；
- 注意：需配置参数：`babel-preset-es2015`、`babel-preset-stage-2`，此参数决定依赖包；
- 注意：参数最好在 loader 引入时随即提供，提供后便可在 loader 定义位置，通过 loader-utils 获取；
- 注意：可通过 resolveLoader - alias 为自身模块定义别名；

```js
// my-babel-loader.js
var babel = require("babel-core");
var loaderUtils = require("loader-utils");

module.exports = function (source) {
  var options = loaderUtils.getOptions(this);
  options =  Object.assign(options, {
    // 解析 JSX
    // plugins: ["transform-react-jsx"]
    plugins: []
  })
  var result = babel.transform(source, options);
  this.callback(null, result.code, result.map)
}



// webpack.config.js
const path = require("path");
module.exports = {
  // 配置 devtool 属性即可自动生成 sourceMap
  devtool: 'eval-source-map',
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    contentBase: "./",
    port: "8080"
  },
  // 配置别名
  resolveLoader: {
    alias: {
      "babel-loader": path.resolve("src/loaders/babel-loader.js")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "stage-2"],
            }
          }
        ]
      },
    ]
  }
};
```

<img src="/Image/Engineering/428.png" style="zoom:50%;" align="left"/>

<img src="/Image/Engineering/429.png" style="zoom:50%;" align="left"/>









#### 8-2、plugin

##### 8-2-1、基本

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



##### 8-2-2、常用 Plugin

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



##### 8-2-3、使用 Plugin

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



##### 8-2-4、解析 Plugin



##### 8-2-5、编写 Plugin

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








##### 8-2-5-1、知识再补充

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

<img src="/Image/Engineering/27.png" style="zoom:40%;" align="left" />

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

<img src="/Image/Engineering/503.png" style="zoom:40%;" align="left" />

***Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等***；当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建；`Compilation` 对象也提供了很多事件回调供插件做扩展；通过 `Compilation` 也能读取到 `Compiler` 对象；

<img src="/Image/Engineering/504.png" style="zoom:40%;" align="left" />






##### 8-2-5-2、编写原则

webpack 官方教程 [Writing a Plugin](https://webpack.js.org/contribute/writing-a-plugin/)：一个 webpack plugin由以下几个步骤组成：

- 一个 JS 类函数；
- 在函数原型 (`prototype`)  中定义一个注入`compiler` 对象的 `apply` 方法；
- `apply ` 函数中通过  `compiler` 插入指定的事件钩子，在钩子回调中拿到 compilation 对象；
- 使用 `compilation` 对象操纵修改 webapack 内部实例数据；
- 异步插件，数据处理完后使用 `callback` 回调；

Plugin 常用对象如下： 

<img src="/Image/Engineering/421.png" style="zoom:50%;" align="left"/>



##### 8-2-5-1、file-list-plugin

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



##### 8-2-5-2、watcher-plugin

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



##### 8-2-5-3、show-plugin-list-plugin

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





##### 8-2-5-X、coment-delete-plugin

实现功能如下：去除代码文件前的注释符合

<img src="/Image/Engineering/422.png" style="zoom:50%;" align="left"/>

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

  - <img src="/Image/Engineering/423.png" style="zoom:30%;" align="left"/>

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