# 一、总结

Vue 核心利用 Object.defineProperty 触发变化通知，然后 DOM Diff 负责值判断和视图刷新；

Angular 核心利用 Zone 对异步事件进行劫持，捕获变化通知，触发变更检测，深度优先遍历，利用组件视图中存储的旧值进行比对，然后更新视图；

再深入的比对待后续 React 完成后再做整理；

