# 一、依赖注入

**<u>*依赖*</u>**：如果类 A 功能的实现需借助类 B，则称类 B 是类 A 的依赖；

**<u>*问题*</u>**：如果在类 A 内部实例化类 B，则两者间就会出现较高耦合，一旦类 B 出现问题，类 A 也需进行改造，若此类情况较多，且每个类之间都有很多依赖，那么就会出现牵一发而动全身的情况，程序会变得极难维护，且很容易出现问题；

**<u>*解决*</u>**：将 A 类对 B 类的控制权抽离，交给第三方去管理；而将控制权反转给第三方，就称为 **<u>*控制反转(IOC—InversionOf Control)*</u>**

- 比如：类 A 依赖类 B，但 A 不控制 B 的创建和销毁，仅使用 B，那么将 B 的控制权则交给 A 之外的第三方处理，叫控制反转(IOC)；

- **<u>*控制反转*</u>**：最早在 04年由 *Martin Fowler* 提出，它是针对面向对象设计不断复杂化而提出的一种设计原则，是一种利用面向对象编程法则来降低应用程序耦合的设计模式；
- **<u>*IOC 容器*</u>**：IOC 强调对代码引用的控制权，由调用方法方转移到外部容器，在运行时通过某种方式注入进来，实现控制的反转，以降低服务类间的耦合度；实现 IOC 的框架叫 IOC 容器；
- **<u>*依赖注入*</u>**：DI—Dependency Injection，是 IOC 最典型的实现方法，由IOC容器来控制依赖，通过使用构造函数、属性或工厂模式等方法，将依赖注入到所需类中，极大程度对双方进行了解耦；Angular实现控制反转的形式/手段就是依赖注入；
  - DI 有利于应用程序中各模块之间的解耦，使得代码更容易维护，这种优势会随着项目复杂度的增加而增加；
  - DI 让开发者可专注于所依赖对象的消费，而无需关注这些依赖对象的产生过程，大大提升开发效率，此外还可松耦合和可重用性、提高可测试性；
- **<u>*两者区别*</u>**：DI 与 IOC 基本是一个意思，但前者是后者的具体形式，后者是一种思想和设计原则；
- 比如：类 A 对类 B 的控制，起初由程序员人工添加，形式、传参均被敲代码的瞬间固定下来，即可说明类 A "控制" 了类 B；引入 IOC 后，注入行为还是由程序员管理，但改为 import 等的统一形式，控制权不再由类 A 管理，而是由 DI 统一控制、统一管理； 

```ts
// 不使用 DI
class Player {
  Weapon: weapon;

  Player() {
    // 与 Sord 类紧耦合
    this.weapon = new Sord()
  }

  public void attack() {
    weapon.attack();
  }
}
// 使用 DI 效果
class Player {
  Weapon: weapon;

  // weapon 被注入进来
  Player(Weapon weapon) {
    this.weapon = weapon;
  }
  
  public void attack() {
    weapon.attack();
  }
}

// DI EX1
// A 依赖于 B，因此在 A 中必然要使用 B 的 instance，这里通过 A 的构造函数将 B 的实例注入
class B {}
class A {
  constructor(b: B) {
    console.log('b: ', b);
  }
}
const b = new B();
// 将 b 实例注入 A 中
const a = new A(b);
```





# 二、NG依赖注入

**<u>*基本*</u>**：Angular 的依赖注入一种创建依赖其他对象的方法，在创建一个新的对象实例时，依赖注入系统将会提供依赖对象(称为依赖关系) - **<u>*Angular Docs；*</u>**

Angular 的依赖注入是用来创建对象及其依赖的其它对象的一种方式，当依赖注入系统创建某个对象实例时，会负责提供该对象所依赖的对象(称为该对象的依赖)；在依赖注入模式中，应用组件无需关注所依赖对象的创建和初始化过程，可认为框架已初始化完毕，开发者只管调用即可；

**<u>*流程*</u>**：得到依赖项、查找依赖项所对应的对象、执行时注入；

**<u>*注入器*</u>**：Angular 依赖注入器，负责创建服务的实例，并把它们注入到你想要注入的类中；Angular 本身无法自动判断你是打算自行创建服务类的实例，亦或者是等注入器来创建它；若想通过注入器来创建，则须为每个服务指定服务提供商，<u>每个服务均需用 @xx 声明(以供 Angular 识别，方便统一管理)</u>





## 2-1、旧注入方式NG6-

- 在预加载的模块的 @NgModule 装饰器中指定 providers:[]
- 在懒加载的模块的 @NgModule 装饰器中指定 providers:[]
- 在 @Component 和 @Directive 装饰器中指定 providers:[]

预加载：服务将是全局单例，即使它被多个模块的 providers: [] 重复申明，也不会重新创建实例；

- 注入器只会创建一个实例，因为它们最终都会注册到根级注入器；

懒加载：在应用程序运行初始化后一段时间，懒加载模块中提供的服务实例才会在子注入器(懒加载模块)上创建；

- 假若在预加载模块中注入这些服务，将会报 <u>*`No provider for MyService!`*</u> 错误；
- 补充：[上述两种 NG 的预加载懒加载策略](https://zhuanlan.zhihu.com/p/56596626)

第三种：服务是按组件实例化，且可在组件及其子树中的所有子组件中访问；

- 此时的服务非单例对象，每次在另1个组件模板中使用组件时，均会获得所提供服务的新实例，但也意味着服务实例将与组件一起销毁；
- 比如：`RandomService` 在 `RandomComponent` 中被注册，因此每当在模板中使用 `<random></random>` 组件时均将得到不同随机数；
- 但若：在模块级别提供 `RandomService`并且将被作为单例提供则不会出现这种情况；
- 因为：此时 `<random></random>` 组件的每次使用都会显示相同的随机数，因为该数字是在服务实例化期间生成的；



## 2-2、新注入方式NG6+

通过使用 @Injectable 装饰器的新增的 provideIn 属性来使用，官方名称是“Tree-shakable providers”；

- 注意：其将 provideIn 视为以反向方式指定依赖关系，即非 "模块声明需要哪些服务”，而是“服务本身宣布它应该提供给哪些模块使用"；
- 注意：声明的模块可以是 root 或其他任何可用模块，此外，root 实际上是 AppModule 别名，使用 root 别名便可无需额外导入 AppModule；
- <img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124149.png" style="zoom:50%;" align=""/>

**<u>*问题A：懒加载模块与正常模块的服务自动绑定行为不可预测：*</u>**

- 懒加载模块意义：可非常容易的将应用程序分成完全独立的逻辑块：
  - 更小的初始化代码，这意味着更快的加载和启动时间；
  - 懒惰加载的模块是真正隔离的，主机应用程序应该引用它们的唯一一点是某些路由的 `loadChildren` 属性；
  - 即若：懒加载使用正确，可将整个模块删除或外部化为独立的应用程序/库，可能有数百个组件和服务的模块可在不影响应用程序其余部分的情况下随意移动，而对懒惰模块的逻辑进行更改永远不会导致应用程序的其他部分出错；
- 解释：在懒加载中使用 `providerIn:'root'` 实现服务，就会发生如下行为，但问题在于在拥有大量模块和服务的大型应用中，其将变得不可预测；
  - 若服务仅被注入到懒加载模块中，则其将绑定在懒加载包中；
  - 若服务又被注入到正常模块中，则将捆绑在主包中；

解决A-1：使用 `providedIn: EagerlyImportedModule`

原因：可用于防止应用程序的其余部分注入服务而无需导入相应的模块，但这其实并非必需，应坚持使用 `provideIn：'root'`

解决A-2：使用 `providedIn: LazyLoadedModule`

**<u>*问题B：循环引用：*</u>**

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124150.png" style="zoom:50%;" align=""/>

解决B：可通过创建 LazyServiceModule 来避免此问题，如下图；它将是 LazyModule 的一个子模块，并将被用作我们想要提供的所有懒加载服务的“锚”；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124151.png" style="zoom:50%;" align=""/>

注意：虽然有点不方便，但只需增加一个模块，这种方法结合了2者的优点:

- 其防止我们将懒加载的服务注入应用程序的正常加载模块；
- 只有当服务被"真正”注入其他惰性组件时，它才会打包到服务中；

注意：新注入方式不适用于@Component 和 @Directive，@Directive还需通过传统的使用 provider:[]来创建多个服务实例(每个组件)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20200923124152.png" style="zoom:50%;" align=""/>



## 2-3、总结

- 将 `providedIn: 'root'` 用于在整个应用程序中作为单例可用的服务；
- 永远不要使用 `providedIn:EagerLiymportedmodule`，若有一些非常特殊的用例，则使用 `providers: []` 来代替；
- 使用 `providedIn: LazyServiceModule` 可防止将懒加载的服务注入应用程序的正常加载模块；
- 若想使用 `LazyServiceModule`，则须先将其导入 `LazyModule`，以防止循环引用，然后 `LazyModule` 将以标准方式使用 NgRouter 为某些路由进行懒加载；
- 使用 `@Component 或 @Directive` 内部的 `providers: []`，为特定的组件子树提供服务，当然这将导致创建多个服务实例(每个组件使用一个服务实例)；
- 始终尝试保守地确定服务范围，以防止依赖蔓延和由此产生的巨大混乱；



## 2-4、NG2依赖注入原理

在 JS 语境下，依赖注入实际就是：函数参数是函数而已(高阶函数，因为JS没有类)；

在 TS 语境下，依赖注入实际就是：在类的构造函数中传入另一个类，类实例化时包括其参数的类也会被实例化；

- 为什么 DI 只有在 Angular 中才会被探讨：因为其它框架并不是原生支持强类型，自然无法以DI为出发点进行框架设计；

**<u>*1、Angular 依赖注入是如何实现的：*</u>**

可以参考 express 与 vue (实际上就是中间件)，如下；但不同的是它们没有类，因此传递的是一个函数，然后只要约定返回值和参数即可进行依赖注入；

```
app.use(bodyParser.json());
Vue.use(Vuex);
```

但 **<u>Angular 传递的是类，需要进行类的实例化，实例化后还须绑定到当前 this 以供当前类使用；</u>**

注意：传统 OO 中的依赖注入是类，但这更灵活：值/工厂/类均可：`ValueProvider、FactoryProvider、ExistingProvider、StaticClassProvider、function`

```ts
// https://github.com/angular/angular/blob/master/packages/core/src/di/injector.ts 181
// 1、有参数的工厂模式依赖 如 RouterModule.forChild(), 分析其参数依赖并加载
if (USE_VALUE in provider) {
  // We need to use USE_VALUE in provider since provider.useValue could be defined as undefined.
  value = (provider as ValueProvider).useValue;
} else if ((provider as FactoryProvider).useFactory) {
  fn = (provider as FactoryProvider).useFactory;
} else if ((provider as ExistingProvider).useExisting) {
  // Just use IDENT
} else if ((provider as StaticClassProvider).useClass) {
  useNew = true;
  fn = resolveForwardRef((provider as StaticClassProvider).useClass);
} else if (typeof provide == 'function') {
  useNew = true;
  fn = provide;
} else {
  throw staticError(
    'StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable',
    provider);
}

// ...

// 2、然后 resolveToken 加载相关工厂参数，即依赖的依赖；
// 注意：一旦加载依赖的参数是另一个依赖，为避免出现环形依赖，Angular 会自行判断，每加载一个依赖就会进行记录
value = record.value;
if (value == CIRCULAR) {
  throw Error(NO_NEW_LINE + 'Circular dependency');
}

// ...

// 3、最后，将所有依赖实例化
static create(
  options: StaticProvider[]|{providers: StaticProvider[], parent?: Injector, name?: string},
  parent?: Injector): Injector {
  if (Array.isArray(options)) {
    return new StaticInjector(options, parent);
  } else {
    return new StaticInjector(options.providers, options.parent, options.name || null);
  }
}
```



**<u>*2、Angular Module装饰器(decorator)是如何装配相关依赖和组件的：*</u>**

所有的 Angular decorator 都继承自 makePropDecorator 方法，自动为目标函数添加方法属性：

因此，组件，指令，服务都会被添加到同一 module 下；

然后， Angular 在 app 实例化时会初始化一个 module，添加根 Injector，形成 <u>模块树</u>；

此外，惰性模块中的依赖还涉及延迟加载等内容，模块加载也是在 zone 中进行；

```ts
export function makePropDecorator(
    name: string, props?: (...args: any[]) => any, parentClass?: any): any {
  const metaCtor = makeMetadataCtor(props);

  function PropDecoratorFactory(...args: any[]): any {
    if (this instanceof PropDecoratorFactory) {
      metaCtor.apply(this, args);
      return this;
    }

    const decoratorInstance = new (<any>PropDecoratorFactory)(...args);

    return function PropDecorator(target: any, name: string) {
      const constructor = target.constructor;
      // Use of Object.defineProperty is important since it creates non-enumerable property which
      // prevents the property is copied during subclassing.
      const meta = constructor.hasOwnProperty(PROP_METADATA) ?
          (constructor as any)[PROP_METADATA] :
          Object.defineProperty(constructor, PROP_METADATA, {value: {}})[PROP_METADATA];
      meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
      meta[name].unshift(decoratorInstance);
    };
  }

  if (parentClass) {
    PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
  }

  PropDecoratorFactory.prototype.ngMetadataName = name;
  (<any>PropDecoratorFactory).annotationCls = PropDecoratorFactory;
  return PropDecoratorFactory;
}
```

参考：[Ng2 依赖注入是如何实现的](https://www.zhihu.com/question/265773703/answer/298969485)



## 2-5、新版NG依赖注入原理

## 2-6、依赖注入使用

