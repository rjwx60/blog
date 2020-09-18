module.exports = {
  title: "Leibnize 个人学习笔记", 
  description: "整理自网络",
  theme: 'reco',
  base: "/docs/",
  themeConfig: {
    nav: [
      { text: "Github", link: "https://github.com/rjwx60" },
    ],
    sidebarDepth: 3,
    displayAllHeaders: true,
    sidebar: [
      {
        title: '前端专题',   // 必要的
        path: '/Basics/',   // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 5,    // 可选的, 默认值是 1
        children: [
          {
            title: '01-前端基本',
            path: '/Basics/01-前端基础',
            children: [
              {
                title: '一、HTML',
                path: '/Basics/01-前端基础/HTML'
              },
              {
                title: '二、CSS',
                path: '/Basics/01-前端基础/CSS'
              },
              {
                title: '三、DOMBOM',
                path: '/Basics/01-前端基础/DOMBOM'
              },
              {
                title: '四、Summary',
                path: '/Basics/01-前端基础/Summary'
              }
            ]
          },
          ['/Basics/02-前端性能', '性能优化'],
          {
            title: '03-前端工程',
            path: '/Basics/03-前端工程', 
            children: [
              {
                title: '一、模块规范演变',
                path: '/Basics/03-前端工程/模块规范演变', 
              },
              {
                title: '二、模块构建工具',
                path: '/Basics/03-前端工程/模块构建工具', 
              },
              {
                title: '三、webpack 配置',
                path: '/Basics/03-前端工程/webpack配置', 
              },
              {
                title: '四、webpack 原理',
                path: '/Basics/03-前端工程/webpack原理', 
              },
              {
                title: '五、webpack loader',
                path: '/Basics/03-前端工程/webpackLoader', 
              },
              {
                title: '六、webpack plugin',
                path: '/Basics/03-前端工程/webpackPlugin', 
              },
              {
                title: '七、前端开发流程',
                path: '/Basics/03-前端工程/前端开发流程', 
              },
              {
                title: '八、Summary',
                path: '/Basics/03-前端工程/Summary', 
              }
            ]
          },
          {
            title: '04-前端异步',
            path: '/Basics/04-前端异步',
            children: [
              {
                title: '一、传统回调',
                path: '/Basics/04-前端异步/传统回调'
              },
              {
                title: '二、Promise',
                path: '/Basics/04-前端异步/Promise'
              },
              {
                title: '三、Generator',
                path: '/Basics/04-前端异步/Generator'
              },
              {
                title: '四、Async/await',
                path: '/Basics/04-前端异步/Async'
              },
              {
                title: '五、Rxjs',
                path: '/Basics/04-前端异步/Rxjs'
              },
              {
                title: '六、集成工具',
                path: '/Basics/04-前端异步/集成工具'
              },
              {
                title: '七、异步题集',
                path: '/Basics/04-前端异步/异步题集'
              },
              {
                title: '八、Summary',
                path: '/Basics/04-前端异步/Summary'
              }
            ]
          },
          {
            title: '05-前端设计',
            path: '/Basics/05-前端设计',
            children: [
              {
                title: '一、基本内容',
                path: '/Basics/05-前端设计/基本内容'
              },
              {
                title: '二、面向对象',
                path: '/Basics/05-前端设计/面向对象编程'
              },
              {
                title: '三、设计模式',
                path: '/Basics/05-前端设计/设计模式'
              },
              {
                title: '四、架构模式',
                path: '/Basics/05-前端设计/架构模式'
              },
              {
                title: '五、Summary',
                path: '/Basics/05-前端设计/Summary'
              }
            ]
          },
          ['/Basics/06-前端数据', '数据类型'],
          {
            title: '07-前端安全',
            path: '/Basics/07-前端安全',
            children: [
              {
                title: '一、XSS',
                path: '/Basics/07-前端安全/XSS'
              },
              {
                title: '二、CSRF',
                path: '/Basics/07-前端安全/CSRF'
              },
              {
                title: '三、劫持',
                path: '/Basics/07-前端安全/劫持'
              },
              {
                title: '四、其他安全问题',
                path: '/Basics/07-前端安全/其他安全问题'
              },
              {
                title: '五、Summary',
                path: '/Basics/07-前端安全/Summary'
              }
            ]
          },
          ['/Basics/08-前端新概', '前端新概'],
          ['/Basics/09-前端实现', '白板码字'],
          ['/Basics/10-前端新标', '前端新标'],
          ['/Basics/11-前端会话', '会话机制'],
          ['/Basics/12-前端框架', '框架源码'],
          ['/Basics/13-前端框架', '框架使用'],
          ['/Basics/14-浏览器相关', '浏览器'],
          {
            title: '15-前端核心',
            path: '/Basics/15-前端核心',
            children: [
              {
                title: '一、代码运行机制',
                path: '/Basics/15-前端核心/代码运行机制'
              },
              {
                title: '二、事件循环机制',
                path: '/Basics/15-前端核心/事件循环机制'
              },
              {
                title: '三、垃圾回收机制',
                path: '/Basics/15-前端核心/垃圾回收机制'
              },
              {
                title: '四、Summary',
                path: '/Basics/15-前端核心/Summary'
              },
            ]
          },
          ['/Basics/16-Node相关', 'Node'],
        ]
      },
      {
        title: '网络专题',
        children: [ /* ... */ ]
      },
      {
        title: '算法专题',
        children: [ /* ... */ ]
      }
    ],
    lastUpdated: 'Last Updated',

  },
};
