module.exports = {
  title: "Leibnize 个人学习笔记", 
  description: "整理自网络",
  theme: 'reco',
  base: "/docs/",
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
          ['/Basics/01-前端基础', 'HtmlCss'],
          ['/Basics/02-前端性能', '性能优化'],
          ['/Basics/03-前端工程', '前端模块化发展'],
          ['/Basics/04-前端异步', '前端异步历史'],
          ['/Basics/05-前端设计', '前端设计思想'],
          ['/Basics/06-前端数据', '数据类型'],
          ['/Basics/07-前端安全', '前端安全'],
          ['/Basics/08-前端新概', '前端新概'],
          ['/Basics/09-前端实现', '白板码字'],
          ['/Basics/10-前端新标', '前端新标'],
          ['/Basics/11-前端会话', '前端会话机制'],
          ['/Basics/12-前端框架', '前端框架源码理解'],
          ['/Basics/13-前端框架', '前端框架常用']
        ]
      },
      {
        title: 'Chromium',
        children: [ /* ... */ ]
      }
    ],
    lastUpdated: 'Last Updated',

  },
};
