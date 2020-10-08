全文均出自于：[多年持续更新的性能优化目录列表](https://www.smashingmagazine.com/2020/01/front-end-performance-checklist-2020-pdf-pages)，[及此文译文](https://mp.weixin.qq.com/s/d9J-_aF9K8QTUtemol-EfQ)；

注意，文章只是综述列表，要逐个引用(不乏论文)逐个阅读实践，内容涉及之广难以一次性整理完毕；须长期不断关注并实践；

注意：此情况下，个人所了解到的性能优化，可通过网络(DNS优化、CDN优化)、框架(最佳实践—懒加载/延迟加载/节流防抖/SSR)、代码体积(静态资源/文件指纹/压缩)、减少请求(缓存/WebWorker/WebSocket)，浏览器机制(脚本底置async+defer/GPU)等；

- [一、优化指标](./优化指标.md)
- [二、定义环境](./定义环境.md)
- [三、静态资源优化](./静态资源优化.md)
- [四、构建优化](./构建优化.md)
- [五、传输优化](./传输优化.md)
- [六、网络优化](./网络优化.md)
- [七、测试与监控](./测试与监控.md)
- [八、速成方案](./速成方案.md)
- [九、下载清单](./下载清单.md)
- [十、Summary](./Summary.md)



### [preload,prefetch,dns-prefetch](https://juejin.im/post/6844903562070196237#heading-5)

- 使用 preload 指令的好处包括：
- 允许浏览器来设定资源加载的优先级因此可以允许前端开发者来优化指定资源的加载。
- 赋予浏览器决定资源类型的能力，因此它能分辨这个资源在以后是否可以重复利用。
- 浏览器可以通过指定 as 属性来决定这个请求是否符合 content security policy。
- 浏览器可以基于资源的类型（比如 image/webp）来发送适当的 accept 头。

### Prefetch

Prefetch 是一个低优先级的资源提示，允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。一旦一个页面加载完毕就会开始下载其他的资源，然后当用户点击了一个带有 prefetched 的连接，它将可以立刻从缓存中加载内容。

### DNS Prefetching

DNS prefetching 允许浏览器在用户浏览页面时在后台运行 DNS 的解析。如此一来，DNS 解析在用户点击一个链接时已完成，故可减少延迟；可在一个 link 标签属性中添加 rel="dns-prefetch'  来对指定的 URL 进行 DNS prefetching；


### 首屏加载优化

首屏时间是指浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但在当前视窗的内容需要；

白屏时间是指浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间；白屏时间是首屏时间的一个子集；

- CDN分发
- HTTP缓存方案：强缓存+hash文件
- 缓存方案，例如存储在内存(即保存变量)，另一个存储在LocalStorage
- 动态资源加载：路由动态加载、组件动态加载
- 利用好`async`和`defer`两个属性
- 页面使用骨架屏
- 使用 SSR 渲染
- 利用好HTTP压缩，比如指定`Content-Encoding`首部字段为`gzip`

### 缓存方案

- 对于一些没有指纹信息的资源，例如 `index.html`可使用`Cache-Control: no-cache`开启协商缓存
- 对于带有指纹信息资源，一般使用 splitChunksPlugin 进行代码分割，来保证造成最小范围的缓存失效，再设置 `Cache-Control: max-age=3153600`
- 不需要缓存的资源设置 `Cache-Control: no-store`，即不强缓存也不进行协商缓存

https://mp.weixin.qq.com/s/d9J-_aF9K8QTUtemol-EfQ

https://mp.weixin.qq.com/s/7NJv21Dz7eGFFt-c3qitWw

https://mp.weixin.qq.com/s/J1hMFK9LfzvTNvEtyOwE-Q

https://www.smashingmagazine.com/2020/01/front-end-performance-checklist-2020-pdf-pages/

