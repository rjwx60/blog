module.exports = {
  title: "Leibnize 个人学习笔记", 
  description: "整理自网络",
  theme: 'reco',
  base: "/",
  themeConfig: {
    nav: [
      { text: "Github", link: "https://github.com/rjwx60" },
    ],
    sidebarDepth: 5,
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
          {
            title: '02-前端性能',
            path: '/Basics/02-前端性能',
            children: [
              {
                title: '一、优化指标',
                path: '/Basics/02-前端性能/优化指标'
              },
              {
                title: '二、定义环境',
                path: '/Basics/02-前端性能/定义环境'
              },
              {
                title: '三、静态资源优化',
                path: '/Basics/02-前端性能/静态资源优化'
              },
              {
                title: '四、构建优化',
                path: '/Basics/02-前端性能/构建优化'
              },
              {
                title: '五、传输优化',
                path: '/Basics/02-前端性能/传输优化'
              },
              {
                title: '六、网络优化',
                path: '/Basics/02-前端性能/网络优化'
              },
              {
                title: '七、测试与监控',
                path: '/Basics/02-前端性能/测试与监控'
              },
              {
                title: '八、速成方案',
                path: '/Basics/02-前端性能/速成方案'
              },
              {
                title: '九、下载清单',
                path: '/Basics/02-前端性能/下载清单'
              },
              {
                title: '十、Summary',
                path: '/Basics/02-前端性能/Summary'
              }
            ]
          },
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
          {
            title: '06-前端数据',
            path: '/Basics/06-前端数据', 
            children: [
              {
                title: '一、数据类型',
                path: '/Basics/06-前端数据/数据类型'
              },
              {
                title: '二、数据检测',
                path: '/Basics/06-前端数据/数据检测'
              },
              {
                title: '三、数据转换',
                path: '/Basics/06-前端数据/数据转换'
              },
              {
                title: '四、Summary',
                path: '/Basics/06-前端数据/Summary'
              }
            ]
          },
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
          {
            title: '08-前端概念',
            path: '/Basics/08-前端概念',
            children: [
              {
                title: '一、前端概念',
                path: '/Basics/08-前端概念/前端概念'
              },
              {
                title: '二、Summary',
                path: '/Basics/08-前端概念/Summary'
              }
            ]
          },
          {
            title: '09-前端实现',
            path: '/Basics/09-前端实现',
            children: [
              {
                title: '一、Array 相关',
                path: '/Basics/09-前端实现/Array相关'
              },
              {
                title: '二、Function 相关',
                path: '/Basics/09-前端实现/Function相关'
              },
              {
                title: '三、Date 相关',
                path: '/Basics/09-前端实现/Date相关'
              },
              {
                title: '四、RegExp 相关',
                path: '/Basics/09-前端实现/RegExp相关'
              },
              {
                title: '五、String 相关',
                path: '/Basics/09-前端实现/String相关'
              },
              {
                title: '六、Number 相关',
                path: '/Basics/09-前端实现/Number相关'
              },
              {
                title: '七、ES6 相关',
                path: '/Basics/09-前端实现/ES6相关'
              },
              {
                title: '八、常见实现',
                path: '/Basics/09-前端实现/常见实现'
              },
              {
                title: '九、综合实现',
                path: '/Basics/09-前端实现/综合实现'
              },
              {
                title: '十、Summary',
                path: '/Basics/09-前端实现/Summary'
              }
            ]
          },
          {
            title: '10-前端新标',
            path: '/Basics/10-前端新标',
            children: [
              {
                title: '一、前端新标',
                path: '/Basics/10-前端新标/前端新标'
              },
              {
                title: '二、Summary',
                path: '/Basics/10-前端新标/Summary'
              }
            ]
          },
          {
            title: '11-前端会话',
            path: '/Basics/11-前端会话',
            children: [
              {
                title: '一、前端会话',
                path: '/Basics/11-前端会话/前端会话'
              },
              {
                title: '二、Summary',
                path: '/Basics/11-前端会话/Summary'
              }
            ]
          },
          {
            title: '12-前端框架',
            path: '/Basics/12-前端框架',
            children: [
              {
                title: '一、框架Vue',
                path: '/Basics/12-前端框架/框架Vue'
              },
              {
                title: '二、框架Angular',
                path: '/Basics/12-前端框架/框架Angular'
              },
              {
                title: '三、框架React',
                path: '/Basics/12-前端框架/框架React'
              },
              {
                title: '四、Summary',
                path: '/Basics/12-前端框架/Summary'
              }
            ]
          },
          {
            title: '14-浏览器相关',
            path: '/Basics/14-浏览器相关',
            children: [
              {
                title: '一、浏览器基本',
                path: '/Basics/14-浏览器相关/浏览器基本'
              },
              {
                title: '二、浏览器缓存',
                path: '/Basics/14-浏览器相关/浏览器缓存'
              },
              {
                title: '三、浏览器存储',
                path: '/Basics/14-浏览器相关/浏览器存储'
              },
              {
                title: '四、浏览器跨域',
                path: '/Basics/14-浏览器相关/浏览器跨域'
              },
              {
                title: '五、浏览器应用',
                path: '/Basics/14-浏览器相关/浏览器应用'
              },
              {
                title: '六、输入URL展示',
                path: '/Basics/14-浏览器相关/输入URL展示'
              },
              {
                title: '七、Summary',
                path: '/Basics/14-浏览器相关/Summary'
              }
            ]
          },
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
          {
            title: '16-前端Node',
            path: '/Basics/16-前端Node', 
            children: [
              {
                title: '一、基本',
                path: '/Basics/16-前端Node/基本'
              },
              {
                title: '二、运行原理',
                path: '/Basics/16-前端Node/运行原理'
              },
              {
                title: '三、模块机制',
                path: '/Basics/16-前端Node/模块机制'
              },
              {
                title: '四、异步机制',
                path: '/Basics/16-前端Node/异步机制'
              },
              {
                title: '五、内存管理',
                path: '/Basics/16-前端Node/内存管理'
              },
              {
                title: '六、事件机制',
                path: '/Basics/16-前端Node/事件机制'
              },
              {
                title: '七、Summary',
                path: '/Basics/16-前端Node/Summary'
              }
            ]
          },
        ]
      },
      {
        title: '网络专题',   // 必要的
        path: '/NetWork/',   // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 5,    // 可选的, 默认值是 1
        children: [
          {
            title: '20-前端网络',
            path: '/NetWork/20-前端网络',
            children: [
              {
                title: '一、基本',
                path: '/NetWork/20-前端网络/base'
              },
              {
                title: '二、IP',
                path: '/NetWork/20-前端网络/ip'
              },
              {
                title: '三、TCP',
                path: '/NetWork/20-前端网络/tcp'
              },
              {
                title: '四、DNS',
                path: '/NetWork/20-前端网络/dns'
              },
              {
                title: '五、HTTP',
                path: '/NetWork/20-前端网络/http'
              },
              {
                title: '六、Websocket',
                path: '/NetWork/20-前端网络/websocket'
              },
              {
                title: '七、Summary',
                path: '/NetWork/20-前端网络/Summary'
              }
            ]
          }
        ]
      },
      {
        title: '算法专题',   // 必要的
        path: '/Algorithm/',   // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 5,    // 可选的, 默认值是 1
        children: [
          {
            title: '30-前端算法',
            path: '/Algorithm/30-前端算法',
            children: [
              {
                title: 'X、排序',
                path: '/Algorithm/30-前端算法/排序'
              },
              {
                title: 'X、Summary',
                path: '/Algorithm/30-前端算法/Summary'
              },
            ]
          }
        ]
      }
    ],
    lastUpdated: 'Last Updated',
  },
};
