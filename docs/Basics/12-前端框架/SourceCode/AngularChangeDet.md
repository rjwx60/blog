# 一、变更检测机制

**<u>*Angular 的变更检测*</u>**  要从一个错误说起 **<u>*ExpressionChangedAfterItHasBeenCheckedError*</u>**，一个按钮应用，当发生变化检测时将时间渲染到屏幕上。时间戳的精度是毫秒。点击按钮触发变化监测；组件类中有个名为`time`的getter，返回当前的时间戳；[地址](https://stackblitz.com/edit/angular-hqbenm?file=src/app/app.component.ts)

```ts
@Component({
    selector: 'my-app',
    template: `
        <h3>Change detection is triggered at: <span [textContent]="time | date:'hh:mm:ss:SSS'"></span></h3>
				<!-- Angular 不允许空的表达式，所以在 click 回调中放了一个 0 -->
        <button (click)="0">Trigger Change Detection</button>
    `
})
export class AppComponent {
    get time() {
        return Date.now();
    }
}
```

果然，报错 ExpressionChangedAfterItHasBeenCheckedError
原因：表达式在被 Angular 检查后发生了变化：之前的值："textContent: 1542375826274"，而现在的值："textContent: 1542375826275"；
所以，可发现 Angular 对表达式进行了两次计算，并将两次计算结果进行了比较，发现结果不一致，遂报错；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124132.png" style="zoom:50%;" align="" />

**<u>*Angular 的变更检测中有两个主要的构成元素：*</u>**

- 一个组件的视图
- 相关的数据绑定

Angular 中的每个组件都有一个由 HTML 元素构成的模板；

Angular 创建了 DOM 节点以便将模板中的内容渲染到屏幕上，它需要有一个地方存储这些 DOM 节点的引用；为此，在 Angular 内部有一个称为 **<u>*视图*</u>** 的数据结构。<u>*视图也被用来存储组件实例的引用，以及绑定表达式之前的值*</u>。组件和视图之间是一对一的关系：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124133.png" style="zoom:50%;" align="" />



首先，当编译器在分析模板时，它会<u>识别</u>可能需要在变化检测期间被更新的DOM元素的属性；

然后，编译器会为每个这样的属性<u>创建</u>一个 **<u>*绑定*</u>**；数据绑定定义了：<u>*需要更新的属性名称*</u>、<u>*Angular 用于获取新值的表达式*</u>；

- 比如：此例中，`time` 属性被用在 `textContent` 属性的表达式中；所以 Angular 创建了绑定，并将它关联到 `span` 元素；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124134.png" style="zoom:50%;" align="" />

- 注意：实际实现中，<u>*绑定不是一个有着所有必须信息的单独的对象*</u>；
  -  `viewDfinition` 为模板元素和需要更新的属性定义了绑定；
  -  而用于绑定的表达式则被置于 `updateRenderer` 函数中；

**<u>*Angular 变更检测流程：*</u>**Angular中，每个组件都会执行变更检测；而组件在 Angular 内部会被表达为视图，所以可以说每个视图都会执行变更检测；

- 首先，当 Angular 检查一个视图时，它只会运行所有的编译器为视图生成的绑定，对表达式求值并将它们的结果，存储在视图的 `oldValues` 数组中；此亦脏检查的由来；
- 然后，如果后续过程中，Angular 检测到了变化(Zone)，它就会更新与绑定相关的 DOM 属性，并将这个新的值放入视图的 `oldValues` 数组中；
- 然后，(进行渲染)，用户就得到了一个更新过的 UI (组件层级)；
- 最后，一旦 Angular 完成了当前组件的检测，它会递归地去检查子组件；
  - 比如：在本次示例中只有一个绑定：连接到 `App` 组件中的 `span` 元素的 `textContent` 属性；
  - 所以：在变化检测期间，Angular 读取了组件类的 `time` 属性的值，并将其应用到 `date` 管道上，然后将返回值与储存在视图中的旧值相比较；如果它检测到不同(也即表示发生值变更)，Angular 就会更新 `span` 的 `textContent` 属性和 `oldValues` 数组；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124135.png" style="zoom:50%;" align="" />

- 注意：<u>*在开发模式下，每一次变更检测循环后(同步任务)，Angular 会同步地运行另一次检查(同步任务)，以确保表达式生成的值，与先前在变更检测中的值相同*</u>；这次检查并非是原始变更监测循环的一部分，它在整个组件树的变化检查结束后执行完全相同的步骤；但是在次次检查中，当 Angular 检测到了变更是不会更新DOM的；相反会抛出`ExpressionChangedAfterItHasBeenCheckedError` 错误；即：开发模式与生产模式不同，前者进行了两次检查，后者进行了一次；前者检查后若值不同则报错，后者值不同则更新UI；

- <u>原因：Ng 做此次检查的原因：确保表达式生成的值与先前在变更检测中的值相同，在开发模式中排查错误，以免在生产模式下，陷入变更检测循环；</u>

  - 比如：组件类中的某些属性在变化检测运行期间就已被更新，造成的结果是：表达式产生了与渲染到 UI 中的值不一致的新值；此时的 Angular 当然可以再运行一次变化检测以同步应用状态与UI；但如果在此过程中，某些属性再次被更新了呢？那么 Angular 就有可能会在无限的变化检测循环中崩溃；

- 所以，为避免这种情况，Angular 强制实行了被称为 **<u>*单项数据流*</u>** 的模式，并且在变化检测后运行的检查和由此产生错误`ExpressionChangedAfterItHasBeenCheckedError` 是强制的机制；一旦 Angular 处理完当前组件的绑定，就不能再更新绑定表达式中使用的属性；

- 解决：明白了变更检测原理，即可修复此错误，确保表达式在变化检测期间与随后的检查中返回的值是相同的：

  - 思路1：确保值始终不变；

  - 思路2：变更检测与二次检查均为同步任务(产生错误的检查在变化检测循环后立即同步运行)，遂可利用 EventLoop 机制，将值的变更操作封装在异步或微任务中执行，等检查后再去更新值，以避免错误发生；注意避免使用 setInterval 等异步操作，因为

  - 思路3：利用 zones 提供 API，在变更检测之外执行，见下方；

  - ```ts
    @Component({
        selector: 'my-app',
        template: `
            <h3>Change detection is triggered at: <span [textContent]="time | date:'hh:mm:ss:SSS'"></span></h3>
    				<!-- Angular 不允许空的表达式，所以在 click 回调中放了一个 0 -->
            <button (click)="0">Trigger Change Detection</button>
        `
    })
    export class AppComponent {
      	// ExpressionChangedAfterItHasBeenCheckedError
      	// 两次检查，所得的值均不同，报错
        get time() {
            return Date.now();
        }
      
      	// fix - 思路1
      	// 将值写死，time 返回值始终不变，不管如何前后两次检测的值均等，无报错，但没有实现需求，
        _time;
        get time() {  return this._time; }
        constructor() {
            this._time = Date.now();
        }
    
        // fix - 思路2
        _time;
        get time() {  return this._time; }
        constructor() {
            this._time = Date.now();
          	// 不断更新 _time 值，因为二次检查是同步任务，所以可利用 EventLoop 机制，用异步任务封装更新操作，等检查后再去更新；
          	// 异步操作被 Angular 做了劫持，都会触发新一轮的变更检测，若使用 setInterval 更是会无限次触发；
            setInterval(() => {
                this._time = Date.now();
            }, 1);
        }
    }
    ```

**<u>*Angular 变更检测之变更通知 Zone：*</u>**

与 React 相反，Angular 中的变更检测可完全自动地由浏览器中的任何一个异步事件触发；Angular 通过使用 `zone.js ` 库，以实现变更监测流程的触发( zone.js 检测到异步事件，事件通知 Angular，进入变更检测流程)；

此外 Angular 同时还引入了 zones 概念，注意 zones 并非 Angular 变更检测机制的一部分，而是独立于 Angular 之外的仅仅提供了一种拦截异步事件的方法的库，比如 `setInterval`，并通知 Angular 发生了异步事件，Angular 基于此通知来运行变更检测；一个网页应用可包含许多不同的 zones；其中一个是 `NgZone`，它在 Angular 启动时被创建；Angular 整一应用就运行在这个 zone 当中；只有在 zone 中发生的异步事件才会通知 Angular；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124136.png" style="zoom:50%;" align="" />

但是，`zone.js`也提供了一个API：`NgZone` 服务实现的 `runOutsideAngular`，以便在 Angular zone 之外的 zone 中运行某些代码；而在其他 zone 中发生异步事件时，Angular 并不会收到通知；没有通知就意味着没有变更检测；所以在本次示例中，可解决不断触发变更检测的问题：

**<u>注意：使用 NgZone 来在 Angular 之外运行某些代码以避免触发变化检测是一种常用的优化技巧；</u>**

```ts
@Component({
    selector: 'my-app',
    template: `
        <h3>Change detection is triggered at: <span [textContent]="time | date:'hh:mm:ss:SSS'"></span></h3>
				<!-- Angular 不允许空的表达式，所以在 click 回调中放了一个 0 -->
        <button (click)="0">Trigger Change Detection</button>
    `
})
export class AppComponent {
  	// ExpressionChangedAfterItHasBeenCheckedError
  	// 两次检查，所得的值均不同，报错
    get time() {
        return Date.now();
    }
  
  	// fix - 思路1
  	// 将值写死，time 返回值始终不变，不管如何前后两次检测的值均等，无报错，但没有实现需求，
    _time;
    get time() {  return this._time; }
    constructor() {
        this._time = Date.now();
    }

    // fix - 思路2
    _time;
    get time() {  return this._time; }
    constructor() {
        this._time = Date.now();
      	// 不断更新 _time 值，因为二次检查是同步任务，所以可利用 EventLoop 机制，用异步任务封装更新操作，等检查后再去更新；
      	// 异步操作被 Angular 做了劫持，都会触发新一轮的变更检测，若使用 setInterval 更是会无限次触发；
        setInterval(() => {
            this._time = Date.now();
        }, 1);
    }
  
  	// fix - 思路3
    _time;
    get time() {
        return this._time;
    }
    constructor(zone: NgZone) {
        this._time = Date.now();
				// 不断更新 _time 值，因为二次检查是同步任务，所以可利用 EventLoop 机制，用异步任务封装更新操作，等检查后再去更新；
      	// 异步操作被 Angular 做了劫持，都会触发新一轮的变更检测，若使用 setInterval 更是会无限次触发；
      	// 所以引入 NgZone 服务，使得异步任务在 NgZone 执行，绕开 NgZone 的变更检测，避免无限触发，又能确保检查后再更新值
      	// 1、异步 -> EventLoop 机制，异步绕开同步，避免值在检查前变化，保证检查后再变化，避免错误
      	// 2、Zone -> NgZone 原理，避免异步多次重复触发变更检测，避免死循环
        zone.runOutsideAngular(() => {
            setInterval(() => {
                this._time = Date.now()
            }, 1);
        });
    }
}
```

**<u>*Angular 变更检测之生命周期钩子的执行顺序：*</u>**

由于单项数据流的限制，在组件被检查后，不能在变化检测期间改变组件的某些属性；但绝大多数时候，当 Angular 对子组件进行变更检测时，数据的更新通过共享服务或同步事件进行广播、或直接将父组件注入到子组件中，然后通过生命周期钩子更新父组件的状态：[地址](https://stackblitz.com/edit/angular-zntusy)

```ts
// 父组件
@Component({
    selector: 'my-app',
    template: `
        <div [textContent]="text"></div>
        <child-comp></child-comp>
    `
})
export class AppComponent {
    text = 'Original text in parent component';
}


// 子组件
@Component({
    selector: 'child-comp',
    template: `<span>I am child component</span>`
})
export class ChildComponent {
  	// 获取到父组件
    constructor(private parent: AppComponent) {}
		// 通过父组件直接更新数据
    ngAfterViewChecked() {
        this.parent.text = 'Updated text in parent component';
    }
}
// 结果：ExpressionChangedAfterItHasBeenCheckedError
// 原因：当 Angular 在子组件中调用 ngAfterViewChecked 生命周期钩子时，父级 App 组件视图的数据绑定已被检查过，但这里在检查后更新了父组件中的 text 属性，导致前后两次绑定表达式的产生结果不一致，报错；
// 但是：若将 ngAfterViewChecked 改为 ngOnInit 等其他钩子函数(不含 AfterViewInit、AfterViewChecked)则不会报错
// 原因：Angular 在变更检测期间执行的操作顺序
```

在获悉 Angular 在变更检测期间执行的操作顺序前，需要搞明白 Angular 中的视图和绑定；在 `@angular/core` 模块中有一个名为 `checkAndUpdateView`的函数，它遍历组件树中的视图(组件)，并对每个视图执行检测；可通过 [此演示](https://angular-eobrrh.stackblitz.io/) 去进行调试：打开控制台，找到函数并打上断点，点击按钮触发变化监测，审查`view`变量

<video src="/Image/Frame/Angular/10.mov" style="zoom:50%;" align=""></video>

结果：第一个 view 会成为宿主视图，其是 Angular 创建的一个根组件，用来托管 app 组件，继续执行，以获得它的子视图，此亦 AppComponent 的视图；

- component 属性存放了 App 组件的实例；
- node 属性存放了 DOM 节点的引用，这些 DOM 节点是为 App 组件的模板中的元素创建的；
- oldValues 数组存储了绑定表达式的结果；

关键：`checkAndUpdateView` 函数(**<u>*先别管上面的调试过程与结果，只须知道此函数即可*</u>**)，可以发现，Angular 会在变化检测期间触发生命周期钩子：当 Angular 处理绑定时，一些钩子在渲染前被调用，一些钩子则在渲染后才被调用

```js
function checkAndUpdateView(view, ...) {
    ...       
    // 更新子视图(组件)和指令中的绑定,
    // 如果有需要的话，调用 NgOnInit, NgDoCheck and ngOnChanges 钩子
    Services.updateDirectives(view, CheckType.CheckAndUpdate);
    
    // DOM 更新，为当前视图(组件)执行渲染
    Services.updateRenderer(view, CheckType.CheckAndUpdate);
    
    // 在子视图(组件)中执行变更检测
    execComponentViewsAction(view, ViewAction.CheckAndUpdate);
    
    // 调用 AfterViewChecked 和 AfterViewInit 钩子
    callLifecycleHooksChildrenFirst(…, NodeFlags.AfterViewChecked…);
    ...
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124137.png" style="zoom:50%;" align="" />

- 首先，Angular 为子组件更新输入绑定；
- 然后，Angular 调用了子组件上的 `OnInit`、`DoCheck`、`Onchanges` 钩子；
  - 意义：因子组件刚更新了输入绑定，所以 Angular 需要通知子组件输入绑定已被初始化；
- 然后，Angular 为子组件执行渲染；
- 此后，**<u>*Angular 为子组件运行变更检测 Run change detection，即意味着它会在子视图中重复这些操作；*</u>**
- 最后，Angular 调用了子组件上的 `AfterViewChecked`、`AfterViewInit` 钩子让子组件知道已被检查；

  - 注意：Angular 在处理了父组件的绑定后，才调用子组件的 `AfterViewChecked` 生命周期钩子；
  - 注意：`OnInit` 钩子在绑定被处理前调用，故即使在 `OnInit` 中改变 `text` 值，在随后检查中它仍然是相同的，就解释了在 `ngOnInit`中不报错的行为；
- 再说流程：一个运行的 Angular 程序其实一个组件树，在变更检测期间，Angular 会按照以下顺序检查每一个组件：
  - **[更新所有子组件/指令的绑定属性](https://link.zhihu.com/?target=https%3A//hackernoon.com/the-mechanics-of-property-bindings-update-in-angular-39c0812bc4ce)**；
  - 调用所有子组件/指令的三个生命周期钩子：`ngOnInit`，`OnChanges`，`ngDoCheck`；
  - **[更新当前组件的 DOM](https://link.zhihu.com/?target=https%3A//hackernoon.com/the-mechanics-of-dom-updates-in-angular-3b2970d5c03d)**；
  - 为子组件执行变更检测 (译者注：在子组件上重复上面三个步骤，依次递归下去)；
  - 为所有子组件/指令调用当前组件的 `ngAfterViewInit` 生命周期钩子；



# 二、变更检测机制总结

Angular 中的所有组件，在内部均被表示为一种叫视图的数据结构；

Angular 的编译器解析模板并创建绑定，而每一绑定定义了：一个要更新的DOM元素的属性 & 用于求值的表达式；

视图中的 `oldValues `属性存储了在变更检测中被用于比较的旧值；

在变更检测期间，Angular 遍历所有绑定，并对表达式求值，将所得的结果与旧值比较，若有必要则更新DOM；

每个变更检测循环后，Angular 运行一次检查以确保组建的状态与用户界面同步；这次检查为同步运行并可能会报错`ExpressionChangedAfterItWasChecked`；

[引用自](https://blog.angularindepth.com/a-gentle-introduction-into-change-detection-in-angular-33f9ffff6f10)




# 三、变更检测触发器 Zone

## 3-1、变化源于异步操作

**<u>*组件初始化后的 一切 数据变化均是由某个异步事件产生*</u>**；因为：初始化是一个同步过程，在 Angular 框架中，组件初始化对应的就是组件的构造方法被调用，此构造过程是一个同步的过程；而在构造过程后只有异步事件才会令组件中的数据发生变化，比如：点击，Ajax 请求，Promise，setTimeout 或 Websocket 等；



## 3-2、Zone.js

为能在上述异步事件发生时及时检查变化，在 Angular 应用启动时会通过 Zone.js 库，为许多浏览器提供的 API 打补丁(可理解为劫持或封装处理)，使用代理方法来代理浏览器 API 的调用，代理方法不仅会调用监听事件时提供的回调函数，还会执行变更检查以及刷新界面；

Zone.js 是 Angular 团队在开发 Angular2 时实现的一个独立的库；Angular2 框架直接依赖 Zone.js 来实现变更检查；而 [Zone.js](https://www.cnblogs.com/whitewolf/p/zone-js.html) 实际上是一个异步操作的执行上下文，它为一组异步操作提供了一个统一的运行环境，并为这组异步过程的生命周期提供钩子方法，以方便在异步事件进行的不同阶段执行一些任务；

Zone.js 对浏览器中的 setTimeout、setInterval、setImmediate、以及事件、promise、地理信息geolocation都做了特殊处理；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124138.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124139.png" style="zoom:50%;" align="" />

首先，zone会将浏览器的原生方法保存在 setNative 中以便将会重用；

然后，zone 就开始其暴力行为，覆盖 window[setName] 和 window[clearName]；

然后，将对 setName 的调用转到自身的 zone[setName] 的调用(如此暴力的对浏览器原生对象实现了拦截转移)；

然后，zone 会在 Task 执行的前后调用自身的 addRepeatingTask、addTask 以及 wtf 事件来应用注册上的所有钩子函数；

补丁示例如下：addEventListener(Zone.js v0.6.0 版本)：是浏览器提供的用于监听事件的 API，在 Angular 启动的时候将它替换成了一个新的版本：

```js
function patchEventTargetMethods(obj, addFnName, removeFnName, metaCreator) {
    if (addFnName === void 0) { addFnName = ADD_EVENT_LISTENER; }
    if (removeFnName === void 0) { removeFnName = REMOVE_EVENT_LISTENER; }
    if (metaCreator === void 0) { metaCreator = defaultListenerMetaCreator; }
    if (obj && obj[addFnName]) {
        // 将 addEventListener 和 removeEventListener 分别替换为 makeZoneAwareAddListener 和 makeZoneAwareRemoveListener
        patchMethod(obj, addFnName, function () { return makeZoneAwareAddListener(addFnName, removeFnName, true, false, false, metaCreator); });
        patchMethod(obj, removeFnName, function () { return makeZoneAwareRemoveListener(removeFnName, true, metaCreator); });
        return true;
    }
    else {
        return false;
    }
}

// 实施替换的方法
function patchMethod(target, name, patchFn) {
    var proto = target;
    // ...
    // 获取带前缀的方法名
    var delegateName = zoneSymbol(name);
    var delegate;
    // 检查是否已经 patch 过
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // 获取代理方法
        var patchDelegate_1 = patchFn(delegate, delegateName, name);
        // 将代理方法赋给对象的 addEventListener 属性
        proto[name] = function () {
            return patchDelegate_1(this, arguments);
        };
        // 将原来的方法实现作为属性添加到 proto[name] 上面
        attachOriginToPatched(proto[name], delegate);
    }
    // 返回原方法
    return delegate;
}

// 替换后的 "addEventListener"
function makeZoneAwareAddListener(addFnName, removeFnName, useCapturingParam, allowDuplicates, isPrepend, metaCreator) {
    // ...
    // 调度事件的方法
    function scheduleEventListener(eventTask) {
        var meta = eventTask.data;
        attachRegisteredEvent(meta.target, eventTask, isPrepend);
        return meta.invokeAddFunc(addFnSymbol, eventTask);
    }
    // 取消事件监听的方法
    function cancelEventListener(eventTask) {
        var meta = eventTask.data;
        findExistingRegisteredTask(meta.target, eventTask.invoke, meta.eventName, meta.useCapturing, true);
        return meta.invokeRemoveFunc(removeFnSymbol, eventTask);
    }
    // self 是被监听的对象， args 是监听的事件，包括事件名称和 callback
    return function zoneAwareAddListener(self, args) {
        // 根据事件的名称和回调方法创建封装 ZoneTask 的 data 对象
        var data = metaCreator(self, args);
        // ...
        // 获取当前的 Zone
        var zone = Zone.current;
        var source = data.target.constructor['name'] + '.' + addFnName + ':' + data.eventName;
        // 创建 ZoneTask 并开始调度这个 Task
        zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
      	// 注意: 上述方法中又调用了 invokeAddFunc 方法，方法中有如下的语句:
      	// this.target[addFnSymbol](this.eventName, delegate.invoke, this.useCapturing);
      	// target 是被监听的对象
      	// target[addFnSymbol] 是浏览器提供的原始的 addEventListener 方法
      
      	// 这里，Zone.js 才真正地将 Task 的 invoke 方法与事件绑定在一起
      	// 当事件被触发时，便会调用 Task.invoke 在 invoke 中响应事件执行操作;
      	// 当事件发生时，便直接调用 invoke 方法来执行用户提供的 callback 以及其他的操作;
      	// 至此也就完成了给 addEventListener 打补丁的工作
      	// 总结: 层层封装，层层套娃

    };
}
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124140.png" style="zoom:50%;" align="" />

总结：Zone 为异步事件的处理提供了代理方法，在所有的异步事件被触发的时，都会先经过 Zone 的代理方法，此后，凡是在 Zone 内执行的异步事件的执行过程都在 Zone 的掌控之下，Zone 也就能知道这组异步事件在什么时候执行完成；而又因数据的变化是且仅可能是由于异步事件而产生，所以 Angular 也就可以通过监听 Zone 的生命周期事件，来得知什么时候应该进行变更检查；

## 3-3、Zone.js 的 NG 应用

Zone.js 向外暴露了一个 Zone 对象，下面是其生命周期中各阶段的钩子方法，这些方法都会在 Zone 的各个生命周期钩子中被调用；

```js
// NgZone
NgZone.prototype.onEnter = function () {
    this._nesting++;
    if (this._isStable) {
        this._isStable = false;
        this._onUnstable.emit(null);
    }
};
NgZone.prototype.onLeave = function () {
    this._nesting--;
    this.checkStable();
};
NgZone.prototype.setHasMicrotask = function (hasMicrotasks) {
    this._hasPendingMicrotasks = hasMicrotasks;
    this.checkStable();
};
NgZone.prototype.setHasMacrotask = function (hasMacrotasks) { this._hasPendingMacrotasks = hasMacrotasks; };
NgZone.prototype.triggerError = function (error) { this._onErrorEvents.emit(error); };
```

当 NgZone run 之后，Angular 便会实例化一个叫做 `ApplicationRef` 的类，其中的 onMicrotaskEmpty 监听到后就会触发变更检测；

```js
// ...  
class ApplicationRef {
    _views:Array = [];
    constructor(private zone: NgZone) {
      	// onMicrotaskEmpty 事件会在当前 Zone 中的异步过程都已完成时触发
      	// 当监听到此事件后就去遍历 View 并且调用每个 view 的 detectChanges 方法来进行变更检查
        this.zone.onMicrotaskEmpty.subscribe(() => this.zone.run(() => this.tick());
    }
    tick() {
        this._runningTick = true;
        this._views.forEach(function (view) {
            return  view.ref.detectChanges();
        });
    }
}
```

注意：并非所有异步操作都有必要触发变更检查；比如某次异步操作，却没有数据发生变化，则应不必触发；而由于 Angular 应用运行在 NgZone 之中，所有在 NgZone 之中的异步操作都会通知框架进行变更检查；为此，NgZone 提供了一个 `runOutsideAngular` 方法，可供方法在 NgZone 之外运行，而不会触发 Angular 的变更检查，示例见前文，[或看此](http://plnkr.co/edit/j9W2op4lGezi8eexwHg6?p=preview)





# 四、再述变更检测

以下内容<u>基于 Angular2.4.9</u>，补充 JIT 与 AOT 机制：

- JIT：吞吐量高，有运行时性能加成，可跑得更快，并可做到动态生成代码等，但相对启动速度较慢，并需一定时间和调用频率才能触发 JIT 的分层机制证；
- AOT：内存占用低启动速度快，无需 runtime 运行，直接将 runtime 静态链接至最终程序中，但无运行时性能加成，不能根据程序运行情况做进一步优化；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124141.png" style="zoom:50%;" align="" />

非 AOT 模式下 Angular 将在运行时利用 JIT 机制，创建组件的包装类，框架将会为每个组件生成相应的包装类，也即对于每一个组件来讲，Angular 会为其生成至少两个类型 `View_ClassName_App` 和 `Wrapper_ClassName_App`，根组件还会生成一个 `View_ClassNameApp_Host`，来作为应用组件的入口，变更检查也是从这个地方开始；`Wrapper_ClassName_App` 类主要是提供了组件的生命周期钩子，`View_ClassName_App` 类主要做了下面5件事：

- 注入依赖；
- 创建组件中的 DOM 元素渲染页面；
- 响应绑定的事件；
- 利用类型为 `changeDetectorRef` 的变更检查器执行变更检查；
- 提供 debug 信息；

Angular 应用是由组件组成的树，每个组件又有自己的变更检查器，于是变更检查器们也组成了一颗变更检查器树；

无论哪一个组件的变更检查被触发时 Angular 都会采用 **<u>*深度优先遍历*</u>** 方式从根节点遍历整个变更检查器树；在 JIT 模式下，这些变更检查器会被编译成为 `View_ClassName_App` 中的`detectChangesInternal` 方法，在这个方法中组件会对自己内部的数据绑定进行检查，调用自己的 `ngOnChanges` 生命周期方法，若有子组件则还会调用子组件 `internalDetectChanges` 方法，如此不断，将检查沿着树枝的方向进行下去，如下图；此树也可描述 Angular 中组件的数据流是从上往下流动(原因是变更检查也是从上到下)；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124142.png" style="zoom:50%;" align="" />

**<u>*比如*</u>**：在文本框中输入文字时，就会马上触发组件的变更检查，此时调用了 `View_InventoryApp0.detectChangesInternal` 方法：

**<u>*首先*</u>**，仔细留意末行，调用了 `jit_checkBinding25` 方法，其会比较新旧两个值是否相同，此方法是框架编译生成的方法，在运行时找到实际上调用的是 `view_utils.checkBinding` 方法，若`throwOnChange` 的值为 false，则使用 `looseIdentical` 来进行新旧值的比较，方法存在于 lang.js：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124143.png" style="zoom:50%;" align="" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124144.png" style="zoom:70%;" align="" />

```js
export function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
// 注意: 只是简单比较了引用或者值是否相同，并无做深度比较；所以数组或者对象等集合类型内部的值发生变化，Angular 并不能检查到
```

**<u>*然后*</u>**，Angular 在检查变更之后立即更新了视图：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124145.png" style="zoom:80%;" align="" />

```
if (jit_checkBinding24(throwOnChange,self._expr_32,currVal_32)) {
    self.renderer.setText(self._text_5,currVal_32);
    self._expr_32 = currVal_32;
}
```

当前组件所有的变更检查执行完成后，开始检查子组件的变更，然后变更检查器会按照深度优先的规则遍历整个组件树，直到所有节点的变更检查都完成为止；

由于单向数据流的原因，变更检查只需要执行一遍就可稳定下来，若在首次检查中产生副作用使得已检查过的节点发生了变化，Angular 会抛出异常(在开发模式开启二次检查机制，以避免上线发生此种情况)；抛出前面提到错误 ExpressionChangedAfterItHasBeenCheckedError；

**<u>*优化：OnPush 策略*</u>**

默认情况下，Angular使用`ChangeDetectionStrategy.Default`策略来进行变更检测；而在此 Default 模式下，每一组异步操作结束后(用户事件、记时器、XHR、promise等事件使应用中的数据将发生了改变时)，都会触发对整个组件树的变更检查；

```js
// 子组件
@Component({
  template: `
    <h1>Hello {{name}}!</h1>
    {{runChangeDetection}}
  `
})
export class HelloComponent {
  @Input() name: string;
  get runChangeDetection() {
    console.log('Checking the view');
    return true;
  }
}
// 根组件
@Component({
  template: `
    <hello></hello>
    <button (click)="onClick()">Trigger change detection</button>
  `
})
export class AppComponent  {
  onClick() {}
}
// 执行以上代码后，每当我们点击按钮时。Angular 将会执行一遍变更检测循环，此时还会输出 "Checking the view"
// 这种技术被称作脏检查。为了知道视图是否需要更新，Angular 需要访问新值并和旧值比较来判断是否需要更新视图;
// 注意: 如果有一个有成千上万个表达式的大应用，Angular 去检查每一个表达式，我们可能会遇到性能上的问题;
```

但在某些场景下，某些组件是不需要每次都被检查，此时可启用 OnPush 模式，与 Angular 约定强制使用不可变对象，Angular 将跳过对该组件的全部变化监测(含子组件)，直到有属性的引用发生变化为止，来避免不必要的变更检查以提升应用性能；

- 补充：不可变对象：保证对象不会改变，即当其内部属性发生变化时，将会用新对象来替代旧对象；不可变对象仅仅依赖初始化时的属性，也即初始化时候属性没有改变，没有改变就不会产生一份新的引用；

若需要在 Angular 中使用不可变对象，则需要设置 `changeDetection: ChangeDetectionStrategy.OnPush`

```js
// 开启 OnPush 策略
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
}
export class InventoryApp {
	// ...
}
```

这将告诉Angular该组件仅仅依赖于它的`@inputs()`，只有在以下几种情况才需要检查：

**<u>*1、Input 引用发生改变*</u>**

在变更检测的上下文中使用不可变对象好处是：Angular 可通过检查引用是否发生了改变来判断视图是否需要检查；这比深度检查要容易很多：

```js
// 子组件
@Component({
  selector: 'tooltip',
  template: `
    <h1>{{config.position}}</h1>
    {{runChangeDetection}}
  `,
  // 开启 OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent  {
  @Input() config;
  get runChangeDetection() {
    console.log('Checking the view');
    return true;
  }
}

// 父组件
@Component({
  template: `
    <tooltip [config]="config"></tooltip>
  `
})
export class AppComponent  {
  config = {
    position: 'top'
  };
	// config 引用地址未改变，子组件将不会进行变更检测，不会进行新旧值比较 if( oldValue !== newValue ) {  runChangeDetection(); }，视图未刷新
  onClick() {
    this.config.position = 'bottom';
  }
	// config 引用地址改变后，视图被检查，新值被展示
  onClick() {
    this.config = {
      position: 'bottom'
    }
  }
}
//  注意: 此时点击按钮时看不到任何日志，因为 Angular 将旧值和新值的引用进行比较，上述变量的引用地址未被改变，故未被触发
```

**<u>*2、源于该组件或其子组件的事件*</u>**

```js
// 当在一个组件或者其子组件中触发了某一个事件时，这个组件的内部状态会更新
@Component({
  template: `
    <button (click)="add()">Add</button>
    {{count}}
  `,
  // 开启 OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = 0;
  add() {
    this.count++;
  }
}
// 注意：此规则只适用于 DOM 事件，API 并不会触发变更检测
// 下列情况中，count 属性发生改变但视图未更改，只有点击时才会更改，但视图会显示 x+1，而非显示 0+1 的 1
@Component({
  template: `...`,
  // 开启 OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = 0;
  constructor() {
    setTimeout(() => this.count = 5, 0);
    setInterval(() => this.count = 5, 100);
    Promise.resolve().then(() => this.count = 5); 
    this.http.get('https://count.com').subscribe(res => {
      this.count = res;
    });
  }
  add() {
    this.count++;
  }
}
```

**<u>*3、显式的去执行变更检测*</u>**

Angular给我们提供了3种方法来触发变更检测：

- `detectChanges()`：告诉 Angular 在该组件和它的子组件中去执行变更检测；
- `ApplicationRef.tick()`：告诉 Angular 来对整个应用程序执行变更检测；
- `markForCheck()`：它不会触发变更检测；相反，它会将所有设置了onPush 的祖先标记，在当前或下一次变更检测循环中检测；

```js
// detectChanges 
// 告诉 Angular 在该组件和它的子组件中去执行变更检测
@Component({
  selector: 'counter',
  template: `{{count}}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent { 
  count = 0;
  constructor(private cdr: ChangeDetectorRef) {
    setTimeout(() => {
      this.count = 5;
      this.cdr.detectChanges();
    }, 1000);
  }
}

// tick
// 告诉 Angular 来对整个应用程序执行变更检测；
tick() {
  try {
    this._views.forEach((view) => view.detectChanges());
    // ...
  } catch (e) {
    // ...
  }
}

// markForCheck
// 它不会触发变更检测；相反，它会将所有设置了onPush 的祖先标记，在当前或下一次变更检测循环中检测；
markForCheck(): void { 
  markParentViewsForCheck(this._view); 
}
export function markParentViewsForCheck(view: ViewData) {
  let currView: ViewData|null = view;
  while (currView) {
    if (currView.def.flags & ViewFlags.OnPush) {
      currView.state |= ViewState.ChecksEnabled;
    }
    currView = currView.viewContainerParent || currView.parent;
  }
}
```

**<u>*4、Angular Async Pipe*</u>**

`async` pipe会订阅一个 Observable 或 Promise，并返回它发出的最近一个值；

```js
// 一个 input() 是 observable 的 OnPush 组件
// 点击按钮并不能看到视图更新，因为上述提到的几种情况均未发生，所以 Angular 在当前变更检测循环并不会检查该组件
// App 组件
@Component({
  template: `
    <button (click)="add()">Add</button>
    <app-list [items$]="items$"></app-list>
  `
})
export class AppComponent {
  items = [];
  items$ = new BehaviorSubject(this.items);
  add() {
    this.items.push({ title: Math.random() })
    this.items$.next(this.items);
  }
}
// List 组件
@Component({
  template: `
     <div *ngFor="let item of _items ; ">{{item.title}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  @Input() items: Observable<Item>;
  _items: Item[];
  ngOnInit() {
    // Observable 
    this.items.subscribe(items => {
      this._items = items;
    });
  }
}

// Use Async Pipe
// 当点击按钮时，视图也更新了，原因是当新的值被发射出来时，async pipe 将该组件标记为发生了更改需要检查
@Component({
  template: `
    <div *ngFor="let item of items | async">{{item.title}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  @Input() items;
}
// async pipe 内部原理实际还是利用 markForCheck
// 所以上述情况中，Angular 为其调用 markForCheck()，所以能看到视图更新了即使 input 引用没有发生改变
private _updateLatestValue(async: any, value: Object): void {
  if (async === this._obj) {
    this._latestValue = value;
    this._ref.markForCheck();
  }
}
// 懵：如果一个组件仅仅依赖于它的input属性，并且input属性是observable，那么这个组件只有在它的input属性发射一个事件的时候才会发生改变
```

**<u>*OnPush 与视图检查：*</u>**

```js
// 父组件 Tabs
@Component({
  selector: 'app-tabs',
  template: `<ng-content></ng-content>`
})
export class TabsComponent implements OnInit {
  // 获取 tab 子组件
  @ContentChild(TabComponent) tab: TabComponent;
  ngAfterContentInit() {
    setTimeout(() => {
      this.tab.content = 'Content'; 
    }, 3000);
  }
}
// 子组件 Tab
@Component({
  selector: 'app-tab',
  template: `{{content}}`,
  // 开启 OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() content;
}
<app-tabs>
  <app-tab></app-tab>
</app-tabs>
// 注意，上述 Angular 不知道正在更新 tab 组件的 input 属性
// 在模板中定义 input()是让 Angular 知道应在变更检测循环中检查此属性的唯一途径;
// 在模板中定义 input()是让 Angular 知道应在变更检测循环中检查此属性的唯一途径;
// 在模板中定义 input()是让 Angular 知道应在变更检测循环中检查此属性的唯一途径;

// 比如
// 若明确的在模板中定义了 input()，Angular 会创建一个叫 updateRenderer() 方法，它会在每个变更检测循环中都对 content 的值进行追踪。
// <app-tabs>
//   <app-tab [content]="content"></app-tab>
// </app-tabs>

// 在这种情况下, 即未添加 input，简单的解决办法使用setter然后调用markForCheck()。
@Component({
  selector: 'app-tab',
  template: `
    {{_content}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  _content;
  @Input() set content(value) {
    this._content = value;
    this.cdr.markForCheck();
  }
  constructor(private cdr: ChangeDetectorRef) {}
}
```

**<u>*OnPush++*</u>**

onPush组件越多，Angular需要执行的检查就越少

```js
// 1、原版
// 一个 todos 组件，它有一个 todos 作为 input()。
// todos 组件
@Component({
  selector: 'app-todos',
  template: `
     <div *ngFor="let todo of todos">
       {{todo.title}} - {{runChangeDetection}}
     </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
  @Input() todos;
  get runChangeDetection() {
    console.log('TodosComponent - Checking the view');
    return true;
  }
}

// App 组件
@Component({
  template: `
    <button (click)="add()">Add</button>
    <app-todos [todos]="todos"></app-todos>`
})
export class AppComponent {
  todos = [{ title: 'One' }, { title: 'Two' }];
  add() {
    this.todos = [...this.todos, { title: 'Three' }];
  }
}
// 缺点: 当单击添加按钮时，即使之前的数据没有任何更改，Angular 也需要检查每个 todo。因此第一次单击后，控制台中将显示三个日志。
// 但在上面的示例中，只有一个表达式需要检查，但是想象一下如果是一个有多个绑定（ngIf，ngClass，表达式等）的真实组件，这将会非常耗性能, 且白白的执行变更检测



// 2、优化版
// 创建一个 todo 组件并将其变更检测策略定义为 onPush
// todo 组件
@Component({
  selector: 'app-todo',
  template: `{{todo.title}} {{runChangeDetection}}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  @Input() todo;
  get runChangeDetection() {
    console.log('TodoComponent - Checking the view');
    return true;
  }
}

// todos 组件
@Component({
  selector: 'app-todos',
  template: `
    <app-todo [todo]="todo" *ngFor="let todo of todos"></app-todo>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
  @Input() todos;
}

// App 组件
@Component({
  template: `
    <button (click)="add()">Add</button>
    <app-todos [todos]="todos"></app-todos>`
})
export class AppComponent {
  todos = [{ title: 'One' }, { title: 'Two' }];
  add() {
    this.todos = [...this.todos, { title: 'Three' }];
  }
}
// 现在，当我们单击添加按钮时，控制台中只会看到一个日志，因为其他的 todo 组件的 input 均未更改，因此不会去检查其视图
// 并且，通过创建更小粒度的组件，我们的代码变得更具可读性和可重用性
```



**<u>*OnPush示例*</u>**：

[示例地址](https://plnkr.co/edit/zGNlvnYsPSKbQPv7HxX3?p=preview&preview)；黄色部分是父组件，灰色的部分是子组件，子组件开启了 OnPush 模式； 

当点击黄色部分时，虽改变了 `this.person.name` 值，但是此变化并不能被框架检测到，也即反映在视图上；因为开启了 OnPush 模式的组件，它的变更检查器将会被关闭，它与它的子节点都无法再检查到父组件带来的变更；但注意：由节点内部产生的变化依然会触发变更检查；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124146.png" style="zoom:50%;" align="" />

点击灰色部分，也即被设置为 OnPush 模式的子组件，此时触发了子组件中的 onclick 方法，改变了 `this.person.name` 的值，由于此变更是由子组件内部事件导致，这时将会触发变更检查，视图上的文字也会被更新；





# 五、变更检测机制再总结

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124147.png" style="zoom:50%;" align="" />

1. Zone.js 为浏览器 API 打补丁
2. NgZone 初始化，监听当前 Zone 中的异步事件执行是否完成
3. 异步事件执行结束后出发 tick 方法开始变更检查
4. 变更检查由根组件开始按照深度优先遍历变更检查器树
5. 在每个数据绑定的检查结束之后，立即更新视图
6. 在继续检查子组件直到所有组件检查完成



