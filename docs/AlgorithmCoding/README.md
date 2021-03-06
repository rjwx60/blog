# 一、范围

## 1-1、笔试题

1. 【超高频】手写深拷贝，考虑正则、Date

2. 【高频】实现一个 Vue 自定义指令懒加载

3. 判断 DOM 标签的合法性，标签的闭合，span 里面不能有 div，写一个匹配 DOM 标签的正则

4. 替换日期格式，`xxxx-yy-zz` 替换成 `xxx-zz-yy`，可以使用正则捕获组来实现

   ```js
   var reg = /(\d{2})\.(\d{2})\/(\d{4})/
   var date = '10.24/2017'
   date = date.replace(reg, '$3-$1-$2')
   console.log(date) // 2017-10-24
   ```

5. 【高频】实现 Promise.all、Promise.allSettled

6. 获取一段 DOM 节点中标签个数最多的标签

7. 写一个简单的 diff

8. 【高频】手写节流

9. 手写 es6 继承

10. 实现一个自定义hook -- usePrevious

    可以参考 usePrevious 这个的实现

    ```typescript
    import { useRef } from 'react'
    
    export type compareFunction<T> = (prev: T | undefined, next: T) => boolean;
    
    export default <T>(state: T, compare?: compareFunction<T>): T | undefined => {
      const prevRef = useRef<T>()
      const curRef = useRef<T>()
      
      const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true
      
      if(needUpdate) {
        prevRef.current = curRef.current
        curRef.current = state
      }
      
      return prevRef.current
    }
    ```

11. 【高频】实现一个 vue 的双向绑定

12. LazyMan、callbindapply、节流防抖



## 1-2、算法题

1.  二叉树的最大深度
2.  另一棵树的子树
3.  相同的树
4.  翻转二叉树
5.  【高频】斐波那契数列
6.  【高频】合并两个有序数组
7.  【高频】打乱数组



## 1-3、webpack、babel

1.  babel 的缓存是怎么实现的
2.  webpack 的 HMR 怎么配置：
    1.  浏览器是如何更新的
    2.  如何做到页面不刷新就能自动更新
    3.  webpack-dev-server webpack-dev-middleware
3.  有没有写过 ast，webpack 通过什么把公共部分抽出来，属性配置是什么
4.  webpack 怎么配置 mock 转发代理，mock的服务，怎么拦截转换的
5.  webpack 的 plugin 和 loader 的编写，调用顺序
6.  webpack 的打包构建优化，体积和速度
7.  DLLPlugin 原理，为什么不直接使用压缩版本的 js 



## 1-4、HTTP

1.  【超高频】缓存（强缓存），如何设置缓存
2.  【高频】HTTP2，HTTP2的性能优化方面，真的优化很多吗
3.  【高频】简单请求和复杂请求
4.  【高频】HTTPS的整个详细过程
5.  301 和 302 的区别
6.  怎么用 get 实现 post，就是使用 get 方法但是参数放到 body 里面
7.  TCP 和 UDP 的区别



## 1-5、CSS 

1.  【超高频】flex
    1.  说一下 flex
    2.  flex：1 具体代表什么，有什么应用场景
    3.  flex-basic 是什么含义
2.  css var 自定义变量的兼容性
3.  行内元素和块级元素的区别
4.  position 有哪些值，分别是什么还以
5.  盒模型
6.  CSS 实现
    1.  淘宝购物车添加商品到购物车的动画（CSS 实现抛物线运动效果）
    2.  tooTip 的实现
7.  【高频】实现固定宽高比的 div
8.  【高频】伪类和伪元素



## 1-6、js

1. 单例应用

2. 【超高频】什么是闭包，闭包的应用场景

3. 如何判断当前浏览器是否支持 webp

4. Vue3 和 Vue2 实现双向绑定的区别，然后手写两种方式，proxy 除了拦截 getter setter 之外还能做什么

5. 若一下你对同步阻塞，异步非阻塞的理解

6. 弱引用，WeakMap 和 Map 的区别

7. 【高频】XSS 反射型是什么，如何避免

8. 【超高频】事件循环

9. 【超高频】说一下你对 promise 的理解

10. 【超高频】浏览器渲染（从输入 url 到页面渲染完成的整个过程）

11. 【超高频】首屏加载优化，通过哪些指标去衡量性能优化

12. canvas 和 svg 区别？优缺点？

13. 牛客网如何监听你调用了其他页面

    ```js
    document.addEventListener('visibilitychange', function() {
      console.log(document.hidden)
    })
    ```

14. js 原生 3种绑定事件

    ```html
    <!-- 第一种 直接在标签里绑定 -->
    <button id="btn" onclick="handleClick()">
      自定义函数
    </button>
    
    <script>
    	// 利用 DOM0 进行绑定
      var btn = document.getElementById('btn')
      btn.onclick = handleClick()
      
      // 利用 DOM3 进行绑定
      btn.addEventListener('click', handleClick)
    </script>
    ```

15. 说一下 websocket

16. 【超高频】实现复杂数据去重

17. 基本数据类型有哪些，为什么 symbol 是一个函数，BigInt 为什么可以用来存储大整数

18. 什么是依赖注入

19. js类型转换

20. 富文本编辑器相关的 js 知识

21. cli 工具的一些实现逻辑



## 1-7、Vue

1.  【高频】vue3 新特性，比较 composition 和 hooks 的区别
2.  new Vue 做了什么
3.  双向绑定原理
4.  vue 组件通信方法







## 1-X、React

1.  【高频】hooks 相关
    1.  为什么引入，什么原理
    2.  如何监听响应，内部是如何做到只有数据修改时才执行函数
    3.  依赖的值发生变化，需要不停的绑定和监听事件
    4.  render props 和 hoc 相比的优缺点
    5.  和 mixin，hoc区别在哪
2.  创建 ref 的几种方法
3.  context 怎么使用，内部原理怎么做到
4.  【超高频】生命周期
5.  redux
    1.  使用方法，为什么 action 要返回一个函数，返回一个对象可以吗
    2.  state 为什么要设计成不可变

