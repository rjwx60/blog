# 三、DOMBOM

```js
const text = document.getElementById('text');
text.onclick = function (e) {
  console.log('onclick')
}
text.onfocus = function (e) {
  console.log('onfocus')
}
text.onmousedown = function (e) {
  console.log('onmousedown')
}
text.onmouseenter = function (e) {
  console.log('onmouseenter')
}
'onmouseenter'
'onmousedown'
'onfocus'
'onclick'
```



## 3-X、事件

### 3-X-1、冒泡&捕获

冒泡：当给某个目标元素绑定了事件后，此事件会依次在其父级元素中被触发；

捕获：从上层向下层传递，与冒泡相反；

```html
<!-- 会依次执行 button li ul -->
<ul onclick="alert('ul')">
  <li onclick="alert('li')">
    <button onclick="alert('button')">点击</button>
  </li>
</ul>
<script>
  window.addEventListener('click', function (e) {
    alert('window')
  })
  document.addEventListener('click', function (e) {
    alert('document')
  })
</script>
// 冒泡结果：button > li > ul > document > window
// 捕获结果：window > document > ul > li > button
```

注意：并非所有的事件都有冒泡：

- `onblur`
- `onfocus`
- `onmouseenter`
- `onmouseleave`



### 3-X-2、事件代理



### 3-X-X、addEventListener 

第三个参数涉及到冒泡和捕获，是`true`时为捕获，是`false`则为冒泡；

或是一个对象 `{passive: true}`，针对的是`Safari`浏览器，禁止/开启使用滚动的时候要用到；



### 3-X-Y、自定义事件

- 使用`Event`

```js
let myEvent = new Event('event_name');
```

- 使用 `customEvent` (可传参数)

```js
let myEvent = new CustomEvent('event_name', {
	detail: {
		// 将需要传递的参数放到这里
		// 可以在监听的回调函数中获取到：event.detail
	}
})
```

- 使用 `document.createEvent('CustomEvent')和initEvent()`
  - `createEvent`：创建一个事件
  - `initEvent`：初始化一个事件

```js
// 创建
// 注意这里是为'CustomEvent'
let myEvent = document.createEvent('CustomEvent');
// 初始化
myEvent.initEvent(
	// 1. event_name: 事件名称
	// 2. canBubble: 是否冒泡
	// 3. cancelable: 是否可以取消默认行为
)
```

自定义事件的监听与触发：

```js
// 与普通事件的一样，使用 addEventListener 监听
button.addEventListener('event_name', function (e) {})
// 触发自定义事件使用 dispatchEvent
dispatchEvent(myEvent)
```

自定义事件案例：

```js
let myEvent = document.createEvent('CustomEvent');
myEvent.initEvent('myEvent', true, true)

let btn = document.getElementsByTagName('button')[0]
btn.addEventListener('myEvent', function (e) {
  console.log(e)
  console.log(e.detail)
})

setTimeout(() => {
  btn.dispatchEvent(myEvent)
}, 2000)
```





## 3-Y、其他

### 3-Y-1、层级关系

```
window > document > html > body
```

- `window` 是 `BOM` 核心对象，它一方面用来获取或设置浏览器的属性和行为，另一方面作为一个全局对象；
- `document`对象是一个跟文档相关的对象，拥有一些操作文档内容的功能；
- `html` 元素对象和 `body` 元素对象是属于 `html` 文档的`DOM`对象，可认为就是`html`源代码中那些标签所化成的对象；



