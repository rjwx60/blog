(window.webpackJsonp=window.webpackJsonp||[]).push([[107],{602:function(t,a,s){"use strict";s.r(a);var e=s(4),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"三、date相关"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#三、date相关"}},[t._v("#")]),t._v(" 三、Date相关")]),t._v(" "),s("p",[t._v("若只想看手写题请移步 3-5 小节，但不建议；")]),t._v(" "),s("p",[t._v("此外使用 Date 相关方法，建议使用市面上已成熟的集合方案，使用更方便，也能避免意外情况发生(浏览器实现差异、隐式处理)")]),t._v(" "),s("h2",{attrs:{id:"_3-1、基本"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-1、基本"}},[t._v("#")]),t._v(" 3-1、基本")]),t._v(" "),s("p",[t._v("1天的组成：86, 400秒；86, 400, 000毫秒；")]),t._v(" "),s("p",[t._v("1时的组成：3600秒；3, 600, 000毫秒；")]),t._v(" "),s("p",[t._v("1分的组成：60秒；60, 000毫秒；")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922085716.png",alt:"截屏2020-09-22 上午8.57.12"}}),t._v(" "),s("p",[t._v("注意：Date() 方法不处理任何传入参数，返回当前时间字符串；而 new Date() 则会根据传入内容而返回不一样的对象(Date Object)；")]),t._v(" "),s("h2",{attrs:{id:"_3-2、构造调用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2、构造调用"}},[t._v("#")]),t._v(" 3-2、构造调用")]),t._v(" "),s("h3",{attrs:{id:"_3-2-1、根据传参情况返回对象"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-1、根据传参情况返回对象"}},[t._v("#")]),t._v(" 3-2-1、根据传参情况返回对象")]),t._v(" "),s("p",[t._v("给定数据；返回：当前时区的 Date Object、Invalid Date Object；")]),t._v(" "),s("img",{staticStyle:{zoom:"60%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922090242.png",alt:"截屏2020-09-22 上午9.02.37"}}),t._v(" "),s("h3",{attrs:{id:"_3-2-2、传参毫秒值"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-2、传参毫秒值"}},[t._v("#")]),t._v(" 3-2-2、传参毫秒值")]),t._v(" "),s("p",[t._v("返回：以 1970年值为基准，上下加减的、UTC格式的 Date Object ;")]),t._v(" "),s("p",[t._v("逆向：上述返回值，再调用 getTime / valueOf；")]),t._v(" "),s("p",[t._v("注意：浏览器环境为本地格式；比如北京为东8区，结果会自动+8>；Node 环境则为 UTC格式；")]),t._v(" "),s("img",{staticStyle:{zoom:"70%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922090423.png",alt:"截屏2020-09-22 上午9.04.19"}}),t._v(" "),s("h3",{attrs:{id:"_3-2-3、传参字符串"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-3、传参字符串"}},[t._v("#")]),t._v(" 3-2-3、传参字符串")]),t._v(" "),s("p",[t._v("返回：Date Object、 Invalid Date Object；")]),t._v(" "),s("p",[t._v("注意：本质为 Date.parse 的隐式调用，如下所示，而其对不同格式 dateTimeString 的解析不同，会导致返回许多诡异结果，图2；")]),t._v(" "),s("p",[t._v("注意：浏览器环境为本地格式；比如北京为东8区，结果会自动+8>；Node 环境则为 UTC格式，图3；")]),t._v(" "),s("img",{staticStyle:{zoom:"60%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922091730.png",alt:"截屏2020-09-22 上午9.17.23"}}),t._v(" "),s("h3",{attrs:{id:"_3-2-4、不传参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-4、不传参数"}},[t._v("#")]),t._v(" 3-2-4、不传参数")]),t._v(" "),s("p",[t._v("返回：当前时间的 Date Object；")]),t._v(" "),s("p",[t._v("注意：效果等同于 new Date(Date.now)，即传递 number 类型参数的调用方式；")]),t._v(" "),s("p",[t._v("注意：浏览器环境为本地格式；比如北京为东8区，结果会自动+8>；Node 环境则为 UTC格式，图2；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922092404.png",alt:"截屏2020-09-22 上午9.24.00"}}),t._v(" "),s("h2",{attrs:{id:"_3-2、函数方法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2、函数方法"}},[t._v("#")]),t._v(" 3-2、函数方法")]),t._v(" "),s("h3",{attrs:{id:"_3-2-1、date-now"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-1、date-now"}},[t._v("#")]),t._v(" 3-2-1、Date.now()")]),t._v(" "),s("p",[t._v("返回：以 1970年 为基准值，累计的毫秒值(Number)，带时区；")]),t._v(" "),s("p",[t._v("注意：浏览器环境为本地格式；比如北京为东8区，结果会自动+8>；Node 环境则为 UTC格式；")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("Date"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("now")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getTime")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h3",{attrs:{id:"_3-2-2、date-utc"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-2、date-utc"}},[t._v("#")]),t._v(" 3-2-2、Date.UTC()")]),t._v(" "),s("p",[t._v("Date.UTC( year，month，date?，hours?，minutes?，seconds?，milliseconds? )")]),t._v(" "),s("p",[t._v("返回：以 1970年 为基准值，累计的毫秒值(Number)，不带时区；")]),t._v(" "),s("p",[t._v("注意：非 Date Object；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922092645.png",alt:"截屏2020-09-22 上午9.26.40"}}),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 注意：UTC 与 本地格式概念区分：")]),t._v("\nDate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("UTC")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2018")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1544486400000")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第1行：Date.UTC 返回UTC时间，即英国时间；")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1544486400000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Object: Tue Dec 11 2018 08:00:00 GMT+0800 (中国标准时间)")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第2行：new Date 处理时会在原有基础上自动 +8 ，所以变成8点；")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2018")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Object: Tue Dec 11 2018 00:00:00 GMT+0800 (中国标准时间)")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第3行：new Date 返回了给定数据的本地时间；")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2018")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getUTCHours")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 16")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第4行：根据本地时间求UTC时间，即英国时间，北京比英国早8小时，故返回昨天的下午4点；")]),t._v("\n")])])]),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922093007.png",alt:"截屏2020-09-22 上午9.30.04"}}),t._v(" "),s("p",[t._v("第1行：应该返回 本地时间的零点，但却返回了英国时间，说明Node环境默认给定 UTC时间；")]),t._v(" "),s("p",[t._v("第2行、第3行：都是返回 UTC时间，没毛病；")]),t._v(" "),s("h3",{attrs:{id:"_3-2-3、date-parse"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-3、date-parse"}},[t._v("#")]),t._v(" 3-2-3、Date.parse()")]),t._v(" "),s("p",[t._v("Date.parse( dateString )")]),t._v(" "),s("p",[t._v("返回：毫秒值(不准确) 或 NaN；")]),t._v(" "),s("p",[t._v("注意：参数会先经过字符串化、格式须规范，否则返回值不一样；")]),t._v(" "),s("p",[t._v("注意：观察下图知：不推荐使用 Date.parse 方法：")]),t._v(" "),s("ul",[s("li",[t._v("ES5前，字符串的解析，完全取决于宿主环境实现；")]),t._v(" "),s("li",[t._v("ES5后，不同宿主解析日期字符串上存诸多差异，推荐手动解析日期字符串；")])]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922093206.png",alt:"截屏2020-09-22 上午9.31.58"}}),t._v(" "),s("h2",{attrs:{id:"_3-3、传参总结与补充"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3、传参总结与补充"}},[t._v("#")]),t._v(" 3-3、传参总结与补充")]),t._v(" "),s("h3",{attrs:{id:"_3-3-1、new-date-各类型传参处理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-1、new-date-各类型传参处理"}},[t._v("#")]),t._v(" 3-3-1、new Date 各类型传参处理")]),t._v(" "),s("p",[t._v("String 类型、隐式调用 Date.parse；")]),t._v(" "),s("p",[t._v("非 String 类型的基本类型、进行 String 转换，无论是 Number、Boolean、Undefined（但Null例外，会直接赋值为0）；")]),t._v(" "),s("p",[t._v("非 String 类型的引用类型、进行 String 转换 - toPrimitive 转化；")]),t._v(" "),s("ul",[s("li",[t._v("转化失败，则返回特殊Date实例: Invalid Date；")]),t._v(" "),s("li",[t._v("转化成功，则使用 Date.parse 处理，处理要求同 Date.parse；")]),t._v(" "),s("li",[t._v("不符要求的返回：NaN，最后得到 Date特殊实例: Invalid Date")]),t._v(" "),s("li",[t._v("符合要求返回：毫秒数，但得到的结果与原结果有误差(省略了闰秒)")])]),t._v(" "),s("h3",{attrs:{id:"_3-3-2、时间格式问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-2、时间格式问题"}},[t._v("#")]),t._v(" 3-3-2、时间格式问题")]),t._v(" "),s("p",[t._v("分类：UTC/GMT/CST，"),s("a",{attrs:{href:"https://www.w3.org/TR/NOTE-datetime",target:"_blank",rel:"noopener noreferrer"}},[t._v("详情"),s("OutboundLink")],1)]),t._v(" "),s("ul",[s("li",[t._v("UTC：原子钟世界协调时间，对应方法 toUTCString()；")]),t._v(" "),s("li",[t._v("GMT：格林威治时、因公转自转问题会有误差、对应方法 toGMTString()；")]),t._v(" "),s("li",[t._v("CST：中央标准时区的简写，可视为美国、澳大利亚、古巴或中国的标准时间，此外还有EST(东部)、PST(太平洋)\n"),s("ul",[s("li",[t._v("注意："),s("a",{attrs:{href:"https://baike.baidu.com/item/IERS/530825",target:"_blank",rel:"noopener noreferrer"}},[t._v("UTC 与 GMT有若干秒的差别"),s("OutboundLink")],1),t._v("，于是 IERS 决定加入闰秒以修正，最后：UTC = GMT +|- 0.9s，图2；")]),t._v(" "),s("li",[t._v("注意："),s("a",{attrs:{href:"http://www.cnblogs.com/sanshi/archive/2009/08/28/1555717.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("旧时使用CST，客户端与服务器端会产生误差"),s("OutboundLink")],1),t._v("，因前者使用美国中部时间，后者使用中国标准时间；")]),t._v(" "),s("li",[t._v("建议：现浏览器已做优化，但"),s("a",{attrs:{href:"https://www.cnblogs.com/aliwa/p/7826668.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("推崇使用不变的UTC时间"),s("OutboundLink")],1),t._v("；")]),t._v(" "),s("li",[t._v("其他：最长的时间格式：YYYY-MM-DDTHH:mm:ss.sssZ，可由 new Date( ).toISOString( ) 生成，图4；")])])])]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922093736.png",alt:"截屏2020-09-22 上午9.37.32"}}),t._v(" "),s("h2",{attrs:{id:"_3-4、注意事项"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4、注意事项"}},[t._v("#")]),t._v(" 3-4、注意事项")]),t._v(" "),s("h3",{attrs:{id:"_3-4-1、new-date-tojson"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-1、new-date-tojson"}},[t._v("#")]),t._v(" 3-4-1、new Date().toJSON()")]),t._v(" "),s("p",[t._v("注意：此法会在内部调用 toISOString( )")]),t._v(" "),s("p",[t._v("注意：执行这句时，并非执行 JSON.stringify(new Date())，而是搜寻 new Date() 返回的时间对象上的 toJSON 方法；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094132.png",alt:"截屏2020-09-22 上午9.41.28"}}),t._v(" "),s("h3",{attrs:{id:"_3-4-2、直调与构造调用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-2、直调与构造调用"}},[t._v("#")]),t._v(" 3-4-2、直调与构造调用")]),t._v(" "),s("p",[t._v("前者返回字符串，后者返回 DateObject；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094201.png",alt:"截屏2020-09-22 上午9.41.58"}}),t._v(" "),s("h3",{attrs:{id:"_3-4-3、date-范围"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-3、date-范围"}},[t._v("#")]),t._v(" 3-4-3、Date 范围")]),t._v(" "),s("p",[t._v("±1亿天 (约为 ±2740个世纪，此范围由JS数据范围决定) ：")]),t._v(" "),s("p",[t._v("-(2^53-1)到2^53-1 —— 9007 199254740992 > 8640000000000000")]),t._v(" "),s("h3",{attrs:{id:"_3-4-4、慎用-date-parse"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-4、慎用-date-parse"}},[t._v("#")]),t._v(" 3-4-4、慎用 Date.parse()")]),t._v(" "),s("p",[t._v("其对 dateString 的处理根据不同实现有不同结果，应手动解析；")]),t._v(" "),s("p",[t._v("而获取当前时间时间戳时，Date.parse() 有误差，应用 valueOf(括号包裹获取，如下) 或 getTime 获取；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094406.png",alt:"截屏2020-09-22 上午9.44.00"}}),t._v(" "),s("h3",{attrs:{id:"_3-4-5、tolocalstring"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-5、tolocalstring"}},[t._v("#")]),t._v(" 3-4-5、toLocalString")]),t._v(" "),s("p",[t._v("用 toLocalString 确保获取到的始终是当前所在地区的时间；")]),t._v(" "),s("p",[t._v("Node环境默认返回UTC格式，浏览器环境默认返回带时区格式的时间对象；")]),t._v(" "),s("h3",{attrs:{id:"_3-4-6、其他"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-6、其他"}},[t._v("#")]),t._v(" 3-4-6、其他")]),t._v(" "),s("p",[t._v("new Date() 和 new Date( dateString ) 均可用： new Date( dateNumber ) 代替；")]),t._v(" "),s("p",[t._v("前者配合使用 Date.now() 后者配合使用 Date.parse()；")]),t._v(" "),s("h2",{attrs:{id:"_3-5、实现"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5、实现"}},[t._v("#")]),t._v(" 3-5、实现")]),t._v(" "),s("h3",{attrs:{id:"_3-5-1、按时间排序"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-1、按时间排序"}},[t._v("#")]),t._v(" 3-5-1、按时间排序")]),t._v(" "),s("ul",[s("li",[t._v("利用 sort 和 Date.parse转换毫秒数比较，注意输入格式要一致")])]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094802.png",alt:"截屏2020-09-22 上午9.47.59"}}),t._v(" "),s("h3",{attrs:{id:"_3-5-2、倒计时实现"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-2、倒计时实现"}},[t._v("#")]),t._v(" 3-5-2、倒计时实现")]),t._v(" "),s("ul",[s("li",[t._v("思路1：利用new Date分别转换，目标与当前时间为毫秒值，并做差值；")])]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094854.png",alt:"截屏2020-09-22 上午9.48.50"}}),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922094943.png",alt:"截屏2020-09-22 上午9.49.38"}}),t._v(" "),s("ul",[s("li",[t._v("思路2：单独处理，注意判断零")])]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095030.png",alt:"截屏2020-09-22 上午9.50.25"}}),t._v(" "),s("h3",{attrs:{id:"_3-5-3、快速获取每月天数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-3、快速获取每月天数"}},[t._v("#")]),t._v(" 3-5-3、快速获取每月天数")]),t._v(" "),s("p",[t._v("原理：传参数值大于合理范围时（如月份=13或分钟=70），相邻数值会被调整，如(2019，1，0) 实际指代1月31；"),s("a",{attrs:{href:"https://github.com/lishengzxc/bblog/issues/5",target:"_blank",rel:"noopener noreferrer"}},[t._v("详看"),s("OutboundLink")],1),t._v("；")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095359.png",alt:"截屏2020-09-22 上午9.53.54"}}),t._v(" "),s("p",[t._v("注意：浏览器环境本地格式<如东8区，浏览器在处理上会自动+8>；Node环境 UTC格式；")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095423.png",alt:"截屏2020-09-22 上午9.54.19"}}),t._v(" "),s("p",[t._v("下列分别是：传统方法、技巧1、技巧2的实现：")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095156.png",alt:"截屏2020-09-22 上午9.51.52"}}),t._v(" "),s("h3",{attrs:{id:"_3-5-4、获取对当前时间"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-4、获取对当前时间"}},[t._v("#")]),t._v(" 3-5-4、获取对当前时间")]),t._v(" "),s("p",[t._v("下列分别是：常规法、技巧法：")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095232.png",alt:"截屏2020-09-22 上午9.52.28"}}),t._v(" "),s("h3",{attrs:{id:"_3-5-5、表示公元-0-99-年"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-5、表示公元-0-99-年"}},[t._v("#")]),t._v(" 3-5-5、表示公元 0-99 年")]),t._v(" "),s("p",[t._v("解决：取得公元前1年的最后一天毫秒数，在此基础上 + 日总毫秒数 * 天数；")]),t._v(" "),s("p",[t._v("原理：日期对象的 getTime、valueOf、Number化方法均可得到毫秒数；")]),t._v(" "),s("img",{staticStyle:{zoom:"67%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200922095317.png",alt:"截屏2020-09-22 上午9.53.13"}}),t._v(" "),s("h3",{attrs:{id:"_3-5-6、手动转换-yyyy-mm-dd-格式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-6、手动转换-yyyy-mm-dd-格式"}},[t._v("#")]),t._v(" 3-5-6、手动转换 yyyy-mm-dd 格式")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.cnblogs.com/cryst/p/7651737.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("详看"),s("OutboundLink")],1),t._v("，"),s("a",{attrs:{href:"https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd",target:"_blank",rel:"noopener noreferrer"}},[t._v("详看2"),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"_3-5-7、获取两日期间有效日期"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-7、获取两日期间有效日期"}},[t._v("#")]),t._v(" 3-5-7、获取两日期间有效日期")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/264",target:"_blank",rel:"noopener noreferrer"}},[t._v("详看"),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"_3-5-8、获取当前时区"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-5-8、获取当前时区"}},[t._v("#")]),t._v(" 3-5-8、获取当前时区")]),t._v(" "),s("p",[t._v("getTimezoneOffset + 计算，"),s("a",{attrs:{href:"https://blog.csdn.net/qawser7335527/article/details/80179223",target:"_blank",rel:"noopener noreferrer"}},[t._v("详看"),s("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=n.exports}}]);