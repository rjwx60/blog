# 一、基本

Angular 应用是一棵组件树，而根组件，在整个应用中位置不变；然而，我们需要动态渲染组件，其中一种方式是使用路由器。通过使用路由模块的 **[router-outlet 指令](https://link.zhihu.com/?target=https%3A//angular.io/api/router/RouterOutlet)**，可以根据当前 url 在程序中某个位置渲染一些组件；

路由内部会把这些*可被路由*的组件称为路由状态，路由器会把程序中可被路由的组件作为 **[一棵路由状态树](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/router/src/router_state.ts)**；

**路由的核心功能是可以在程序内进行组件导航，并且需要路由器在页面的某个出口处渲染组件，url 还得随渲染状态进行对应的修改**。为此路由器需要把相关 url 和加载的组件绑定到一起，它通过让开发者自定义路由状态，根据指定 url 来渲染对应的组件。

通过在程序内导入 **[RouterModule](https://link.zhihu.com/?target=https%3A//angular.io/api/router/RouterModule)** 并在 **forRoot** 方法内定义 **[Route](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/router/src/config.ts%23L372-L398)** 对象数组，来定义路由状态；

```js
import { RouterModule, Route } from '@angular/router';

const ROUTES: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'notes',
    children: [
      { path: '', component: NotesComponent },
      { path: ':id', component: NoteComponent }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ]
})
```



# 二、路由配置

- **RouterModule** 有一个 **forChild** 方法，也可以传入 **Route** 对象数组，然而尽管 **forChild** 和 **forRoot** 方法都包含路由指令和配置，但是 **forRoot** 可以返回 **Router** 对象，由于 **Router** 服务会改变 **[浏览器 location 对象](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/Location)**，而 location 对象又是一个全局单例对象，**[所以 Router 服务对象也必须全局单例](https://link.zhihu.com/?target=https%3A//blog.angularindepth.com/avoiding-common-confusions-with-modules-in-angular-ada070e6891f)**。这就是你必须在根模块中只使用一次 **forRoot** 方法的原因，特性模块中应当使用 **forChild** 方法；
- 当匹配到路由路径时，路由状态 **component** 属性定义的组件会被渲染在 **[router-outlet 指令](https://link.zhihu.com/?target=https%3A//angular.io/api/router/RouterOutlet)** 挂载的地方，即渲染激活组件的动态元素。被渲染的组件会作为 **router-outlet** 元素的兄弟节点而不是子节点，**router-outlet** 元素也可以层层嵌套，形成父子路由关系。

> 注：**[@angular/common/src/location](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/common/src/location/index.ts)** 提供了更高层级的抽象，不单单针对浏览器平台，提供了很多好用的 API，并暴露了 **[PlatformLocation](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/common/src/location/platform_location.ts%23L32-L48)** 接口供不同平台具体实现；针对具体的浏览器平台，**[BrowserPlatformLocation](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/platform-browser/src/browser/location/browser_platform_location.ts)** 实现了该接口，并在程序初始化时针对浏览器平台 **[指定对应的 PlatformLocation 实现](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/platform-browser/src/browser.ts%23L29)**

**程序内部导航时，路由器对象会捕捉导航的 url，并与路由状态树中的某个路由状态进行匹配**

**任意时刻，当前 url 表示当前程序激活路由状态的序列化形式**。路由状态的改变会触发 url 的改变，同时，url 的改变也会触发当前激活路由状态的改变，它们表示的是同一个东西；**[路由器对象根据路径匹配路由的内部算法](https://link.zhihu.com/?target=https%3A//blog.angularindepth.com/angular-routing-series-pillar-1-router-states-and-url-matching-12520e62d0fc)**，是使用最先匹配策略，内部实现采用的是第一层级搜索，匹配 url 的第一个路径。



## 2-1、路由生命周期

与组件生命周期相同，路由器在每一次路由状态切换时也存在生命周期：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124055.png" style="zoom:50%;" align=""/>

在每一次导航周期内，路由器会触发一系列事件。路由器对象也提供了监听路由事件的 observable 对象，用来定义一些自定义逻辑，如加载动画，或辅助调试路由。值得关注的事件有： *NavigationStart：表示导航周期的开始。* NavigationCancel：表示取消本次导航，比如，路由守卫拒绝导航到特定的路由。 *RoutesRecognized：当 url 匹配到对应的路由。* NavigationEnd：导航成功结束

```
const ROUTES: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'notes',
    children: [
      { path: '', component: NotesComponent },
      { path: ':id', component: NoteComponent }
    ]
  },
];
```

根据上面定义的路由状态，当 url 导航到 **http://localhost:4200/notes/42**，看看发生什么有趣的事情。总体上来说主要包括以下几步： *第一步，任何重定向会被优先处理。因为只有将最终稳定的 url 匹配到路由状态才有意义，而本示例中没有重定向，所以 url **http://localhost:4200/notes/42** 就是最终稳定的。* 第二步，路由器使用最先匹配策略来匹配 url 和路由状态。本示例中，会优先匹配 **path:'notes'**，然后就是 **path:':id'**，匹配的路由组件是 **NoteComponent**。 *第三步，由于匹配到了路由状态，所以路由器会检查该路由状态是否存在阻止导航的路由守卫。比如，只有登录用户才能看到笔记列表，而本示例中，没有路由守卫。同时，也没有定义 **[resolvers](https://link.zhihu.com/?target=https%3A//angular.cn/guide/router%23emresolveem-pre-fetching-component-data)** 预先获取数据，所以路由器会继续执行导航。* 第四步，路由器会激活该路由状态的路由组件。 * 第五步，路由器完成导航。然后它会等待下一次路由状态的改变，重复以上过程。

可以通过在 **forRoot** 方法内开启 **enableTrace: true** 选项，这样可以在浏览器控制台里看到打印的事件：

```ts
RouterModule.forRoot([
  ROUTES,
  {
    enableTracing: true
  }
]),
```

同理，组件可以通过注入路由器对象来访问到路由事件流，并订阅**[该事件流](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/router/src/router.ts%23L242)**：

```ts
constructor(private router: Router) {
  this.router.events.subscribe( (event: RouterEvent) => console.log(event))
}
```



## 2-2、路由组件懒加载

Angular 路由器系列第三部分是有关**懒加载模块**。随着程序越来越大，很多功能会被封装在单独的特性模块中，比如，一个卖书的网站可能包括书籍、用户等模块。**问题是程序首次加载时不需要展示所有数据，所以没必要在主模块中包含所有模块**。否则这会导致主模块文件膨胀，并导致程序加载时加载时间过长。最好的解决方案是当用户导航到某些模块时再按需加载这些模块，而 Angular 路由器的懒加载功能就可以做到这一点。

懒加载模块的示例如下：

```ts
// from the Angular docs https://angular.io/guide/lazy-loading-ngmodules#routes-at-the-app-level
{
  path: 'customers',
  loadChildren: 'app/customers/customers.module#CustomersModule'
}
```

传给 **loadChildren** 属性的值类型是字符串，而不是组件对象引用。在导入模块时，注意避免引用任何懒加载模块，否则会在编译时依赖该模块，导致 Angular 不得不在主代码包中把它编译进来，破坏了懒加载目的。

路由器在导航周期的重定向和 url 匹配阶段内，会开始加载懒加载模块：

```ts
/**
 * Returns the `UrlTree` with the redirection applied.
 *
 * Lazy modules are loaded along the way.
 */
export function applyRedirects(
    moduleInjector: Injector, configLoader: RouterConfigLoader, urlSerializer: UrlSerializer,
    urlTree: UrlTree, config: Routes): Observable<UrlTree> {
  return new ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config).apply();
}
```

正如源码文件 **[config.ts](https://link.zhihu.com/?target=https%3A//github.com/angular/angular/blob/7.1.3/packages/router/src/config.ts%23L259-L261)** 所描述的：

> The router will use registered NgModuleFactoryLoader to fetch an NgModule associated with 'team'.Then it will extract the set of routes defined in that NgModule, and will transparently add those routes to the main configuration.
> 路由器会使用注册的 **NgModuleFactoryLoader** 来加载与 'team' 相关的模块，并把该懒加载模块中定义的路由集合，添加到主配置里。

在懒加载模块中定义的路由会被加载到主配置里，从而可以进行路由匹配。本系列将会稍后大量聊聊懒加载。

