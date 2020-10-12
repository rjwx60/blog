(window.webpackJsonp=window.webpackJsonp||[]).push([[147],{529:function(t,n,s){"use strict";s.r(n);var e=s(4),a=Object(e.a)({},(function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"一、compiler"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一、compiler"}},[t._v("#")]),t._v(" 一、Compiler")]),t._v(" "),s("p",[t._v("编译器是什么，简而言之就是开发者代码和最终运行时代码之间的一切工作，Angular编译器（NGC)包括以下过程：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("@"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Component")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  selector"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'hello-user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  template"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("\n    <form>\n      <div>Hello {{user.name}}</div>\n      <input ngModel>\n    </form>")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloUserComponent")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  user "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'TLP'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"_1-1、解析"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-1、解析"}},[t._v("#")]),t._v(" 1-1、解析")]),t._v(" "),s("p",[t._v("代码 parse 过程包括对 ts 代码、模板，样式的解析，最终得到抽象语法树-AST，"),s("a",{attrs:{href:"https://astexplorer.net/",target:"_blank",rel:"noopener noreferrer"}},[t._v("ASTExplore"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("代码的解析，不同形式的代码最终会成为语法树节点的一部分，可以作为一个 JSON 结构继续处理；")]),t._v(" "),s("p",[t._v("注意：区别于TC39的装饰器提案，Angular 的装饰器语法在于添加注解-annotation，用来定义类型的 metadata；")]),t._v(" "),s("p",[t._v("注意：模板解析是理解框架工作的关键；其目标是将 Angular 定义的模板语法最终编译成可创建视图和更新视图的 JS 代码，而相比于将模板交给浏览器解析，Angular 自定义实现过程能更好地：支持跨平台，服务端渲染，模板静态检查以及更多的扩展语法等等；")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("{\n\ttext: '',\n\texpr: {\n\t\tpropPath: ['user', 'name'],\n\t\tline: 2, col: 14\n\t}\n}\n{\t\n\tname: 'input', attrs: [['ngModel': '']],\n\tdirectives: [{\n\t\tctor: NgModel,\n\t\tdeps: [NgForm]\n\t}]\n}\n// AST 记录了对应的数据检索路径\n// 行数记录方便编译报错寻址\n// 元素上的指令 ngModel 会被映射到对应类 NgForm，并标识出依赖注入\n")])])]),s("h2",{attrs:{id:"_1-2、转换"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-2、转换"}},[t._v("#")]),t._v(" 1-2、转换")]),t._v(" "),s("p",[t._v("先补充 NGC(AngularCompiler) 历史：从 Angular2 发布至今，NGC 已有三代版本：")]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("第一代")])])]),t._v("：Angular2 采用的编译器叫 "),s("strong",[t._v("Template Compiler")]),t._v("，编译产物代码巨多：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("Template Compiler 会对每个@Component 和 @NgModule 装饰类，生成一个 ngFactory.ts，且对应的 Component & NgModule 会被引入到此文件中；")])]),t._v(" "),s("li",[s("p",[t._v("ngFactory 负责描述类的使用方式：比如需 import 的内容、元数据使用、如何实例化、DI的处理、生命周期钩子调用时机、如何渲染(含宿主、子组件渲染)；")])]),t._v(" "),s("li",[s("p",[t._v("模板被解析成 renderer 中的函数调用，包括创建视图的 createInternal 及变更检测 detectChangesInternal；")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("注意：此种处理 DOM 的模式经由 Ng 团队反复测试，性能十分高效；")])]),t._v(" "),s("li",[s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" parentRenderNode"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("any "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createViewRoot")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("parentElement"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" import3"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createRenderElement")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("parentRenderNode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'h1'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("import3"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("EMPTY_INLINE_ARRAY")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_1 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createText")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_2 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createText")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("parentRenderNode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'\\n'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("init")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("any"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("directRenderer"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_2\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" any"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])])])]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("第二代")])])]),t._v("，Angular4 开始采用编译器 "),s("strong",[t._v("View Engine")]),t._v("，其解决：Template Compiler 中的生成的视图操作过于太繁杂，随 web 工程日益庞大，相应代码量也随之增加，相对于其他框架(Vue)劣势明显；于是 View Engine 不再直接生成 render 的指令，而是在编译时生成定义的视图结构，在运行时 runtime 会去解释它们；")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[s("u",[s("em",[t._v("View Engine 中 Angular 做的事情就是定义 VIEW，即定义 Node 的结构")])])])])]),t._v(" "),s("li",[s("p",[t._v("对于 component，angular 会定义一个 componentname_view(后改名 view_component) 函数，通过 viewDef 返回 ViewDefinition，即 component  对应的 view 结构，而 ViewDefinition 是 "),s("strong",[s("u",[s("em",[t._v("由一个个 Node 来组成")])])]),t._v("，Node 可能是元素，指令，插值，ngContent 等等；")])]),t._v(" "),s("li",[s("p",[s("strong",[s("u",[s("em",[t._v("NodeDef 描绘了")])])]),t._v(" 节点的数据结构，其含有大量的属性值，详细描述了节点所有需数据；")])]),t._v(" "),s("li",[s("p",[s("strong",[s("u",[s("em",[t._v("每种 Node 对应不同的 Def 函数")])])]),t._v("，这些函数也有足够复杂的入参，来**"),s("u",[s("em",[t._v("最终返回出NodeDef")])]),t._v("**；")])])]),t._v(" "),s("p",[t._v("注意：ViewDefinition 对于每个 component 类只会创建一个，但对于不同的实例，实际运行时需要保存 runtime 相关数据，此部分数据放在 ViewData 的数据结构中，即 ViewData 会有多个 (ViewDefinition 每个 component 类只有一个，但 ViewData 会有多个)；")]),t._v(" "),s("p",[t._v("示例：下图是 View Engine 的元素创建、指令、及数据绑定大概过程；")]),t._v(" "),s("ul",[s("li",[t._v("观察 Node 的定义函数(NodeDef) 可知，它们详细描述了结点父子关系，对应类，属性，事件，依赖注入关系，生命周期调用情况等等；")]),t._v(" "),s("li",[t._v("通过这种方式，极大减少编译产物的代码量，当然因为此种更直接(更注理解)，此方案性能上不如一代，可这是多方面取舍后的结果；")]),t._v(" "),s("li",[t._v("补充：AOT、JIT 区别：后者会将编译器放入 vendor 中，在浏览器中运行编译过程；前者则在本地编译好才放入浏览器中，因而性能更好，打包体积更小。")])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908135942.png",alt:"2020-09-08 下午1.59.35"}}),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908140039.png",alt:"2020-09-08 下午2.00.35"}}),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908140116.png",alt:"2020-09-08 下午2.01.13"}}),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("第三代")])])]),t._v("，IVY 是 Angular 的新一代编译器，其目标在于：减少打包代码体积(质的飞跃)，提升速度，使生成代码友好阅读从而方便调试修改(使用过 Angular2 编译生成出代码，结果…阿巴阿巴)，并且在元编程，高阶组件 HOC 方面给出了极大的支持，给angular开发更强的扩展性；")]),t._v(" "),s("ul",[s("li",[t._v("首先，在编译产物上做了大幅优化；基于 Locality 宗旨，即 component 的编译结果可以自己提供运行时所需要的信息，而不是用 ngFactory 来使用它；即不再生成 ngFactory，取而代之的是："),s("strong",[s("u",[s("em",[t._v("在类的编译产中一个新的定义函数，对不同装饰器对应的类不同")])])]),t._v("，分别为：component => ngComponentDef、Directive => ngDirectiveDef、Injectable => ngInjectableDef，"),s("strong",[s("u",[s("em",[t._v("即现在每个 component 就是自身的 componentFactory")])])]),t._v("；")])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908141036.png",alt:"截屏2020-09-08 下午2.10.31"}}),t._v(" "),s("ul",[s("li",[t._v("另外，对于模板编译的结果，则会被放入 ngComponentDef 定义函数的 template 中，称为 template function；template由两个 if 构成两个主要部分，一个是 view creation 部分，一个是 change detection；此外，还重新回归二代的编译到指令的方式，但远远不同二代中的 renderer API，IVY 的 template 函数由许多内置定义好的 Instructions 集组成，指令集详细定义每种元素对应的各种处理；\n"),s("ul",[s("li",[t._v("之前结构过于笼统，存在大量 if-else；而指令集精准定义渲染器需要的操作，优化代码量，且取消之前的 factory-component 的映射关系，而动态组件需要 resolveComponentFactorylveComponentFactory 也取消了；")])])])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908141736.png",alt:"截屏2020-09-08 下午2.15.08"}}),t._v(" "),s("h1",{attrs:{id:"二、runtime"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#二、runtime"}},[t._v("#")]),t._v(" 二、Runtime")]),t._v(" "),s("p",[t._v("编译好的代码在 IVY 的 runtime 下运行，在应用运行时包括以下三个阶段：")]),t._v(" "),s("ul",[s("li",[t._v("Module Steup—模块启动：框架实例化应用的 Modules 并于此同时设置相关的依赖注入器(Injector)；")]),t._v(" "),s("li",[t._v("View Creation—视图创建：创建 DOM 实例化 directive；")]),t._v(" "),s("li",[t._v("Change Detection—变更检测：检查绑定值(Binding value)，如果需要做相应更新；")])]),t._v(" "),s("h2",{attrs:{id:"_2-1、模块启动阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-1、模块启动阶段"}},[t._v("#")]),t._v(" 2-1、模块启动阶段")]),t._v(" "),s("p",[t._v("以根组件的启动为例，事实上框架主要做了以下4个步骤")]),t._v(" "),s("p",[t._v("Bootstrap ->Locate root element -> Instantiate root component -> Render the root component")]),t._v(" "),s("ul",[s("li",[t._v("bootstrap 时框架会寻找在 AppModule 的NgModule 中设置的组件，即根组件，这部分在 main.ts 中定义；")]),t._v(" "),s("li",[t._v("框架会在 index.html 中根据 tagName 寻找 root elemnt，确定应用渲染的正确位置；")]),t._v(" "),s("li",[t._v("调用组件的 factory，其中会检查注入器树，通过 Token 获取到正确的依赖注入参数，最终实例化 root component；")]),t._v(" "),s("li",[t._v("交给组件的 template 的 View Creation 部分，开始创建视图；")])]),t._v(" "),s("h2",{attrs:{id:"_2-2、视图创建阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-2、视图创建阶段"}},[t._v("#")]),t._v(" 2-2、视图创建阶段")]),t._v(" "),s("p",[t._v("此阶段会从父组件开始，递归调用子组件的 template function；")]),t._v(" "),s("p",[t._v("template function 是由许多指令(instruction)组成，instruction 是由 Angular 声明的一系列函数；")]),t._v(" "),s("p",[t._v("大致分为两类：Creation Instructions 与 Update Instructions 分别用于创建和更新元素；")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908142845.png",alt:"截屏2020-09-08 下午2.28.28",align:""}}),t._v(" "),s("p",[t._v("不同模板编译的结果，template function 会包含不同的 Instructions，映射过程示例如下：")]),t._v(" "),s("p",[t._v("注意：Angular 创建 DOM 元素的方式没有使用 innerHTML，而是对元素一个个的创建，原因可以看tosiba相关说明")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908144158.png",alt:"截屏2020-09-08 下午2.41.53",align:""}}),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 上面用到的 element 函数伪码")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 详见 packages\\core\\src\\render3\\instructions\\element.ts")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("element")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" tag"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" attrs")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" el "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("tag"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" parent "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getCurrentParent")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("setAttributes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("el"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" attrs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  parent"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("appendChild")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("el"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" lview "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getLView")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 注意: Angular 会记录创建的所有元素，将其放入内部的数组 LView 中")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 此后在 change detection 中更新这些元素时便于获取他们，相对于使用 DOM API 重新 querySelectorX，此种方式会高效的多")]),t._v("\n  lview"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" el"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("**"),s("u",[s("em",[t._v("补充：LView：")])]),t._v("**意即 logic view；对于每个 template 或者 component 实例，框架都会创建一个 LView 数组实例；LView 中包含 DOM 元素、绑定值和Directive 的实例，方便变更检测及设置输入属性；")]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("补充：Directives 工作：")])])]),t._v(" 在编译阶段，将会根据 component 的装饰器和 ngmodule 的 module scope 确定组件中使用的 Directive，保存在组件的定义(ComponentDef)中；在使用 instruction 创建视图时，将会通过 selector，将创建的视图同保存在 ComponentDef 中的 Directives 比较，若匹配成功则需实例化对应的Directive(实例化通过调用对应的 componentDef 中的 factory 方法)，实例化成功后将其放入LView中；")]),t._v(" "),s("p",[t._v("注意：不要将 Directives 与 instruction混淆；前者是 angular定义给开发者的类型，后者是创建 DOM 的一些 help function；")]),t._v(" "),s("p",[t._v("注意：component 是 Directive 的子类，所以 component 也是在这个阶段一并处理，后续流程如不明确区分，directive 相关操作中中包含 component；")]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("补充：TView：")])])])]),t._v(" "),s("p",[t._v("对组件的每个实例都做上述操作代价十分高昂，有必要对同一组件共性的数据做缓存处理，即有 TView 概念；")]),t._v(" "),s("p",[t._v("TView 意即 template view，template 对同一组件的所有实例只创建一个共享实例；共享实现如下：")]),t._v(" "),s("ul",[s("li",[t._v("TView 会保存在 ComponentDef 中；Directive 实例将保存在 LView 中；而将 Directive的定义函数放入TView，并且同一 Directive 在两者的 Index 是一致；")]),t._v(" "),s("li",[t._v("除了 Directive 在创建 DOM 时也把对应的Node(TNode) 放入TView中，TNode 中还包含着要创建的 DOM 元素的元数据(metadata)，比如tagName，匹配的Directive等；")]),t._v(" "),s("li",[t._v("通过此方式 angular 再次调用 Instruction 创建 DOM 实例时，就会去 TView 中确认保存的数据，这样就能立刻做后续的操作；")])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908160826.png",alt:"img"}}),t._v(" "),s("h2",{attrs:{id:"_2-3、变更检测阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-3、变更检测阶段"}},[t._v("#")]),t._v(" 2-3、变更检测阶段")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908144158.png",alt:"截屏2020-09-08 下午2.41.53",align:""}}),t._v(" "),s("p",[t._v("即检测绑定数据变化和新数据渲染到视图的过程；与 view creation 阶段非常相似，该阶段主要调用 template function 来重新渲染；但不同的是：变更检测，使用的是 template function 的第二部分，即 RenderFlag.Update；此阶段，无需将每个 node 映射到 Instruction 中来，而是为那些需要更新的 node 提供指令；")]),t._v(" "),s("ul",[s("li",[t._v("首先需要记录两笔数据：\n"),s("ul",[s("li",[t._v("1.当前处理的 node 在 LView 中的索引位置 cursor；")]),t._v(" "),s("li",[t._v("2.绑定的值对应的新旧两组值；")])])]),t._v(" "),s("li",[t._v("然后，关注 advance function：\n"),s("ul",[s("li",[t._v("advance 中，可确认当前处理 node 在 LView 中的索引位置，advance(2) 意即当前 LView 对应数据向下前进两位；然后会发现一个 text node 和一个插值语法，对应运行 textInterpolate1 instruction，在这个 instruction 中确定绑定数据 header 是否有变化；")]),t._v(" "),s("li",[t._v("注意首次执行时将 old value 传入空值，即必定更新一次，后续会缓存绑定的 value，接着调用 advance(1) 即再向下前进一位，将会找到 info-card，执行property instruction，这里找到的是一个子组件，因而是将值传递给组件的输入中；")])])])]),t._v(" "),s("p",[s("em",[s("strong",[s("u",[t._v("注意：change detection的顺序问题")])])])]),t._v(" "),s("p",[t._v("IVY 中，变更检测是按照 template 中 nodes 的顺序从上到下执行的，但是之前的 angular 版本并非如此；")]),t._v(" "),s("ul",[s("li",[t._v("之前变更检测存在两个独立的过程：\n"),s("ul",[s("li",[t._v("1.对 directive inputs 做相应检测")]),t._v(" "),s("li",[t._v("2.对 element 和 text 的绑定做相应检测，在之前这样的处理会让使用者非常困惑，因而在这个版本做了修复；")])])])]),t._v(" "),s("p",[s("img",{attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908152042.jpg",alt:"img"}})]),t._v(" "),s("p",[t._v("注意：虽然在 node 层，IVY 保证了变更检测执行顺序与用户写的 template 一致，"),s("u",[t._v("但对于同一 node 的每个绑定值却并非如此")]),t._v("：同一 node 的多绑定值：property  提升，变更检测会先检查此；")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908152047.jpg",alt:"img"}})]),t._v(" "),s("p",[t._v("通过在 instruction 将自身返回出来，可实现类似的 property 链式操作，从而做到代码优化；")]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("补充：生命周期钩子调用时机")])])])]),t._v(" "),s("p",[t._v("生命周期的钩子是在变更检测的不同阶段 emit 出来；")])])}),[],!1,null,null,null);n.default=a.exports}}]);