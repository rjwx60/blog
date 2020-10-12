(window.webpackJsonp=window.webpackJsonp||[]).push([[161],{524:function(t,n,s){"use strict";s.r(n);var a=s(4),e=Object(a.a)({},(function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"一、整体流程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一、整体流程"}},[t._v("#")]),t._v(" 一、整体流程")]),t._v(" "),s("p",[t._v("主体引用自："),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/93242237",target:"_blank",rel:"noopener noreferrer"}},[t._v("文章1"),s("OutboundLink")],1),t._v("、"),s("a",{attrs:{href:"https://www.zhihu.com/question/58083132/answer/155731764",target:"_blank",rel:"noopener noreferrer"}},[t._v("文章2"),s("OutboundLink")],1)]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908132957.png",alt:"",align:""}}),t._v(" "),s("p",[t._v("本质还是那样，流程亦然…Angular 的应用可分为三部分组成："),s("u",[t._v("NG 编译器(Compiler)负责编译代码、NG Runtime(核心)负责提供的运行时、以及用户提供的业务代码")]),t._v("；Compiler 负责去解析开发应用中的 html模板、TS代码、 样式，提取元数据，模板表达式等必要的信息，然后将其转化、优化最终生成实际运行代码；Runtime 会去消费生成的代码，将其组织并运行起来；此两个部分是耦合一起共同工作，组合起来称为 "),s("u",[t._v("渲染器 Render")]),t._v("；")]),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("Compiler：细展下去可分为解析与转换两个步骤；")])])])]),t._v(" "),s("ul",[s("li",[t._v("解析：包括对 ts 代码、模板，样式解析，最终得到抽象语法树-AST；不同形式的代码最终会成为语法树节点的一部分；模板解析，跟 Vue 一样，将 Angular 定义的模板语法，最终编译成可创建视图和更新视图的 JS 代码，而相比于将模板交给浏览器解析，Angular 自定义实现过程能更好地：支持跨平台，服务端渲染，模板静态检查以及更多的扩展语法等等；思想与 Vue 一致…(AST 记录了对应的数据检索路径、行数记录方便编译报错寻址、元素上的指令 ngModel 会被映射到对应类 NgForm，并标识出依赖注入)")])]),t._v(" "),s("div",{staticClass:"language-ts extra-class"},[s("pre",{pre:!0,attrs:{class:"language-ts"}},[s("code",[t._v("@"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Component")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  selector"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'hello-user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  template"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("\n    <form>\n      <div>Hello {{user.name}}</div>\n      <input ngModel>\n    </form>")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloUserComponent")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  user "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'TLP'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 转换为下述:")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\ttext"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\texpr"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\tpropPath"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'name'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t\tline"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" col"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("14")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\t\n\tname"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'input'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" attrs"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ngModel'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\tdirectives"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\tctor"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" NgModel"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t\tdeps"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("NgForm"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("ul",[s("li",[s("p",[t._v("转换：转换就精彩多了，它是 NGCompiler—NGC 的核心，最终生成可执行代码；NGC至今有过三个大更新(三个版本)：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("一代：Template Compiler(2)：编译产物代码巨多：对每个 @Component 和 @NgModule 装饰类，生成一个 ngFactory.ts，且对应的 Component & NgModule 会被引入到此文件中(依赖注入—其本质是高阶函数—模块化思想影响)；ngFactory 负责描述类的使用方式：比如需 import 的内容、元数据使用、如何实例化、DI的处理、生命周期钩子调用时机、如何渲染(含宿主、子组件渲染)；而模板会被解析成 renderer 中的函数调用，包括创建视图的 createInternal 及变更检测 detectChangesInternal；")]),t._v(" "),s("ul",[s("li",[s("div",{staticClass:"language-ts extra-class"},[s("pre",{pre:!0,attrs:{class:"language-ts"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" parentRenderNode"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createViewRoot")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("parentElement"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" import3"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createRenderElement")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("parentRenderNode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'h1'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("import3"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("EMPTY_INLINE_ARRAY")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_1 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createText")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_2 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("createText")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("parentRenderNode"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'\\n'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("init")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("renderer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("directRenderer"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_el_0"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_text_2\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("any")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])])]),t._v(" "),s("li",[s("p",[t._v("二代：View Engine(4)：解决前代生成视图操作过于繁杂问题(毕竟随 web 工程日益庞大，相应代码量也随之增加，相对于其他框架(Vue)劣势明显)；故其不再直接生成 render 指令，在编译时只生成定义视图结构，在运行时才去解释(即将生成结构与解释分开，而非一步到位)；View Engine 中定义VIEW(一种 Node 数据结构)，比如对于 component，会定义一个 view_component 函数，通过 viewDef 返回 ViewDefinition(即 component  对应的 view 结构，由一个个 Node 来组成，Node 可能是元素，指令，插值，ngContent 等)；每种 Node 对应不同的 Def 函数，函数最终返回 NodeDef，NodeDef 则描绘了节点的数据结构(含有大量属性值，节点所需数据，结点父子关系，对应类，属性，事件，依赖注入关系，生命周期调用情况等)；对于每个 component 类只会创建一个ViewDefinition，而实际运行时产生的相关数据会存放在 ViewData 中；最终结果是极大减少编译产物的代码量，可读性提高，但也因此性能上不如一代；补充：AOT、JIT 区别：前者在本地编译好才放入浏览器中，性能更好，打包体积更小；后者相反；")])])]),t._v(" "),s("img",{staticStyle:{zoom:"37%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201001151805.png",alt:"截屏2020-10-01 下午3.18.01"}}),t._v(" "),s("ul",[s("li",[t._v("三代：IVY(newest)，其实现了打包代码体积的减少(质飞跃)，生成代码可读性增强，速度提升，更强的扩展性，支持元编程，高阶组件 HOC；首先是在编译产物上做了大幅优化；不再生成 ngFactory，而是生成定义函数，对不同装饰器对应类不同，分别为：component => ngComponentDef、Directive => ngDirectiveDef、Injectable => ngInjectableDef；即现在每个 component 就是自身的 componentFactory；然后，模板编译的结果，会被放入 ngComponentDef 定义函数的 template function 中；其由两个判断构成：view creation 部分，change detection；然后，回归二代的编译到指令方式，但不同二代中的 renderer API，IVY 的 template 函数由许多内置指令集组成，指令集详细定义每种元素对应的各种处理；过去结构过于笼统，存在大量 if-else；而指令集精准定义渲染器需操作，优化代码量，且取消之前的 factory-component 的映射关系；")])])])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908141036.png",alt:"截屏2020-09-08 下午2.10.31"}}),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908141736.png",alt:"截屏2020-09-08 下午2.15.08"}}),t._v(" "),s("p",[s("strong",[s("u",[s("em",[t._v("Runtime：负责变更检测与数据刷新：")])])])]),t._v(" "),s("p",[t._v("编译好的代码在 IVY 的 runtime 下运行，在应用运行时包括以下三个阶段：")]),t._v(" "),s("ul",[s("li",[t._v("模块启动—Module Steup：框架实例化应用 Modules 并于此同时设置相关依赖注入器(Injector)；\n"),s("ul",[s("li",[t._v("比如以根组件的启动为例，框架做了4个步骤：Bootstrap ->Locate root element -> Instantiate root component -> Render the root component\n"),s("ul",[s("li",[t._v("bootstrap 时框架寻找在 AppModule 的 NgModule 中设置的组件(根组件)，这部分在 main.ts 中定义；")]),t._v(" "),s("li",[t._v("框架在 index.html 中根据 tagName 寻找 root elemnt，确定应用渲染的正确位置；")]),t._v(" "),s("li",[t._v("调用组件 factory，检查注入器树，通过 Token 获取到正确的依赖注入参数，最终实例化 root component；")]),t._v(" "),s("li",[t._v("交给组件 template 的 View Creation 部分，开始创建视图；")])])])])]),t._v(" "),s("li",[t._v("视图创建—View Creation：创建 DOM 实例化 directive；\n"),s("ul",[s("li",[t._v("从父组件开始，递归调用子组件的 template function；template function 是由许多指令(instruction)组成，instruction 是由 NG 声明的一系列函数；大致分为两类：Creation Instructions 与 Update Instructions 分别用于创建和更新元素；而不同模板编译的结果，template function 会包含不同的 Instructions；注意 NG 创建 DOM 元素并非使用 innerHTML，而是一个个地创建；注意：对组件每个实例都做上述操作代价十分高昂，所以对同一组件共性数据会有缓存处理(TView)；其保存在 ComponentDef 中；若 NG 再次调用指令集创建 DOM 实例时，会先去 TView 中确认保存数据；")])])])]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200908142845.png",alt:"截屏2020-09-08 下午2.28.28",align:""}}),t._v(" "),s("ul",[s("li",[t._v("变更检测—Change Detection：检查绑定值(Binding value)，若需要做相应更新；即检测绑定数据变化和新数据渲染到视图的过程；与 view creation 阶段非常相似，该阶段主要调用 template function 来重新渲染；但不同的是这里使用的是 template function 的第二部分，即 RenderFlag.Update；此阶段，无需将每个 node 映射到 Instruction 中来，而是为那些需要更新的 node 提供指令；\n"),s("ul",[s("li",[t._v("首先，记录两笔数据：1.当前处理的 node 在 LView 中的索引位置 cursor；2.绑定值对应的新旧两组值；")]),t._v(" "),s("li",[t._v("然后，关注 advance function：advance 中，可确认当前处理 node 在 LView 中的索引位置，advance(2) 意即当前 LView 对应数据向下前进两位；然后会发现一个 text node 和一个插值语法，对应运行 textInterpolate1 instruction，在这个 instruction 中确定绑定数据 header 是否有变化；注意首次执行时将 old value 传入空值，即必定更新一次，后续会缓存绑定的 value，接着调用 advance(1) 即再向下前进一位，将会找到 info-card，执行property instruction，这里找到的是一个子组件，因而是将值传递给组件的输入中；")]),t._v(" "),s("li",[t._v("注意：change detection的顺序问题：IVY 中，变更检测是按照 template 中 nodes 的顺序从上到下执行的，但之前 NG 版本并非如此；之前变更检测存在两个独立的过程：1.对 directive inputs 做相应检测；2.对 element 和 text 的绑定做相应检测，过去如此处理会让开发者非常困惑；")])])])]),t._v(" "),s("h1",{attrs:{id:"二、angular-相关"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#二、angular-相关"}},[t._v("#")]),t._v(" 二、Angular 相关")]),t._v(" "),s("h2",{attrs:{id:"_2-1、变更检测"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-1、变更检测"}},[t._v("#")]),t._v(" 2-1、变更检测")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://skyfly.xyz/2017/07/04/Front_End/Angular/AngularChangeDetection/",target:"_blank",rel:"noopener noreferrer"}},[t._v("引用自文章1"),s("OutboundLink")],1),t._v("、"),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/96486260",target:"_blank",rel:"noopener noreferrer"}},[t._v("文章2"),s("OutboundLink")],1),t._v("、"),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/97884917",target:"_blank",rel:"noopener noreferrer"}},[t._v("文章3"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("总结即：通过 zone 触发检测机制(Zone劫持所有原生异步事件，从而实现变更检测的启动通知)，变更检测通过深度优先遍历组件，与存储在组件中的 ViewData 旧值比对实现更新；过去在开发环境下，变更检测会有两次检查，若二次检查发现数值改变，则会报错，以避免生产环境下的无限触发更新情况；为避免变更检测频繁触发，可通过多种方式减少变更检测对象的数目比如：")]),t._v(" "),s("ul",[s("li",[t._v("OnPush 策略：默认情况下，Ng 默认使用 "),s("code",[t._v("ChangeDetectionStrategy.Default")]),t._v(" 策略来进行变更检测；在此模式下，每组异步操作结束后(用户事件、记时器、XHR、promise等事件使应用中的数据将发生了改变时)，都将触发对整个组件树的变更检查；但并非所有场景和组件都需都被检查，此时可启用 OnPush 模式： "),s("code",[t._v("changeDetection: ChangeDetectionStrategy.OnPush")]),t._v("，与 NG 约定强制使用不可变对象，此后 NG 将跳过对该组件的全部变化监测(含子组件)，直到有属性的引用发生变化为止，来避免不必要的变更检查以提升应用性能；注意不可变对象即：保证对象不会改变，即当其内部属性发生变化时，将会用新对象来替代旧对象；不可变对象仅仅依赖初始化时的属性，也即初始化时候属性没有改变，没有改变就不会产生一份新的引用；\n"),s("ul",[s("li",[t._v("注意 OnPush 模式下，还是可以通过内部 Input、内部 DOM 事件、"),s("code",[t._v("cdr: ChangeDetectorRef; this.cdr.detectChanges();")]),t._v(" 来触发检测；")])])]),t._v(" "),s("li",[t._v("zone.runOutsideAngular(使其无法检测到变化)")])]),t._v(" "),s("p",[t._v("解释二：NG 中的所有组件，在内部均被表示为一种叫视图的数据结构；Angular 的编译器解析模板并创建绑定，而每一绑定定义了：一个要更新的DOM元素的属性 & 用于求值的表达式；视图中的 "),s("code",[t._v("oldValues")]),t._v(" 属性存储了在变更检测中被用于比较的旧值；在变更检测期间，Angular 遍历所有绑定，并对表达式求值，将所得的结果与旧值比较，若有必要则更新DOM；每个变更检测循环后，Angular 运行一次检查以确保组建的状态与用户界面同步；这次检查为同步运行并可能会报错"),s("code",[t._v("ExpressionChangedAfterItWasChecked")]),t._v("；")]),t._v(" "),s("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124147.png",align:""}}),t._v(" "),s("ol",[s("li",[t._v("Zone.js 为浏览器 API 打补丁")]),t._v(" "),s("li",[t._v("NgZone 初始化，监听当前 Zone 中的异步事件执行是否完成")]),t._v(" "),s("li",[t._v("异步事件执行结束后出发 tick 方法开始变更检查")]),t._v(" "),s("li",[t._v("变更检查由根组件开始按照深度优先遍历变更检查器树")]),t._v(" "),s("li",[t._v("在每个数据绑定的检查结束之后，立即更新视图")]),t._v(" "),s("li",[t._v("在继续检查子组件直到所有组件检查完成")])]),t._v(" "),s("h2",{attrs:{id:"_2-2、依赖注入"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-2、依赖注入"}},[t._v("#")]),t._v(" 2-2、依赖注入")]),t._v(" "),s("p",[t._v("可简单理解为高阶函数；")]),t._v(" "),s("h2",{attrs:{id:"_2-3、路由机制"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-3、路由机制"}},[t._v("#")]),t._v(" 2-3、路由机制")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/98516062",target:"_blank",rel:"noopener noreferrer"}},[t._v("可看此文以作了解"),s("OutboundLink")],1),t._v("，详看 SourceCode(本地)—AngularRouter")]),t._v(" "),s("h2",{attrs:{id:"_2-4、生命周期"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-4、生命周期"}},[t._v("#")]),t._v(" 2-4、生命周期")]),t._v(" "),s("p",[t._v("生命周期的钩子是在变更检测的不同阶段 emit 出来触发调用，而非变更检测则次序执行；")]),t._v(" "),s("ul",[s("li",[s("strong",[s("u",[s("em",[t._v("constructor")])])]),t._v("：是 ES6 中 class 中新增的属性，当 class 类实例化的时候调用 constructor，来初始化类；\n"),s("ul",[s("li",[t._v("Angular 组件的构造函数会在所有的生命周期钩子之前被调用，它主要用于依赖注入或执行简单的数据初始化操作；")])])]),t._v(" "),s("li",[s("strong",[s("u",[s("em",[t._v("ngOnChanges")])])]),t._v("：当数据绑定输入属性值发生变化时调用；\n"),s("ul",[s("li",[t._v("注意：首次调用一定会发生在 ngOnInit() 前(随后 ngOnInit 不调用(只调1次)，OnChanges 则继续调用)；")]),t._v(" "),s("li",[t._v("Angular 将会主动调用 ngOnChanges 方法；它会获得一个 SimpleChanges 对象，包含绑定属性的新值和旧值，它主要用于监测组件输入属性的变化；当 Angular(重新)设置数据绑定输入属性时响应；该方法接受当前和上一属性值的 SimpleChanges 对象；")])])]),t._v(" "),s("li",[s("strong",[s("u",[s("em",[t._v("ngOnInit")])])]),t._v("：在第一次 ngOnChanges 执行之后调用，且只被调用一次；\n"),s("ul",[s("li",[t._v("主要用于执行组件的其它初始化操作或获取组件输入的属性值；")]),t._v(" "),s("li",[t._v("适用于在构造函数之后马上执行复杂的初始化逻辑、或在 Angular 设置完输入属性后，对该组件进行准备；")])])]),t._v(" "),s("li",[t._v("ngDoCheck：当组件的输入属性发生变化时，将会触发 ngDoCheck 方法；\n"),s("ul",[s("li",[t._v("注意：在每个 Angular 变更检测周期中调用；")]),t._v(" "),s("li",[t._v("多用于自定义检测逻辑，用于检测和处理值的改变；")])])]),t._v(" "),s("li",[t._v("ngAfterContentInit：在组件内容初始化之后调用；\n"),s("ul",[s("li",[t._v("当在组件使用 ng-content 指令的情况下，Angular 会在将外部内容放到视图后用；")]),t._v(" "),s("li",[t._v("主要用于获取通过 @ContentChild 或 @ContentChildren 属性装饰器查询的内容视图元素；")]),t._v(" "),s("li",[t._v("当把内容投影进组件之后调用。第一次ngDoCheck()之后调用，只调用一次；")])])]),t._v(" "),s("li",[t._v("ngAfterContentChecked：组件每次检查内容时调用；\n"),s("ul",[s("li",[t._v("在组件使用 ng-content 指令的情况下，Angular 会在检测到外部内容的绑定或者每次变化的时候调用；每次完成被投影组件内容的变更检测之后调用。ngAfterContentInit() 和每次 ngDoCheck() 后调用；")])])]),t._v(" "),s("li",[t._v("ngAfterViewInit：组件相应的视图初始化后调用；\n"),s("ul",[s("li",[t._v("主要用于获取通过 @ViewChild 或 @ViewChildren 属性装饰器查询的视图元素；")]),t._v(" "),s("li",[t._v("初始化完组件视图及其子视图后调用；第一次ngAfterContentChecked()之后调用，只调用一次；")]),t._v(" "),s("li",[t._v("与 AfterContent 相似，区别如下：\n"),s("ul",[s("li",[t._v("前者关心的是 ViewChildren，这些子组件的元素标签会出现在该组件的模板里面；")]),t._v(" "),s("li",[t._v("后者关心的是 ContentChildren，这些子组件被Angular投影进该组件中；")])])])])]),t._v(" "),s("li",[t._v("ngAfterViewChecked：组件每次检查视图时调用；\n"),s("ul",[s("li",[t._v("即每次做完组件视图和子视图的变更检测之后调用；ngAfterViewInit() 和每次 ngAfterContentChecked 后调用；")])])]),t._v(" "),s("li",[s("strong",[s("u",[s("em",[t._v("ngOnDestroy")])])]),t._v(" - 指令销毁前调用；\n"),s("ul",[s("li",[t._v("主要用于执行一些清理操作，比如：移除事件监听、清除定时器、退订 Observable 等，以防内存泄漏")])])])])])}),[],!1,null,null,null);n.default=e.exports}}]);