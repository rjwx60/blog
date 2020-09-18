# 一、HTML

## 1-1、HTML5

- 标签：
  - 新增语义化标签(`aside / figure / section / header / footer / nav`等)
  - 增加多媒体标签 `video` 和 `audio`，使样式和结构更加分离；
- 属性：
  - 增强表单，主要是增强了`input`的 type 属性；
  - `meta`增加charset以设置字符集；
  - `script`增加async以异步加载脚本
- 存储：
  - 增加 `localStorage`、`sessionStorage` 和 `indexedDB`；
  - 引入 `application cache` 对 web 和 应用进行缓存；
- API：
  - 增加 `拖放API`、`地理定位`、`SVG绘图`、`canvas绘图`、`Web Worker`、`WebSocket`



## 1-2、doctype

声明文档类型，告知浏览器用什么文档标准解析这个文档：

- 怪异模式：浏览器使用自己的模式解析文档，不加doctype时默认为怪异模式
- 标准模式：浏览器以W3C的标准解析文档



## 1-3、href 与 src

- **<u>href(hyperReference) 即超文本引用</u>**：当浏览器遇到 href 时，会并行的地下载资源，不会阻塞页面解析；
  - 比如使用 `<link>` 引入CSS，浏览器会并行地下载 CSS 而不阻塞页面解析. 因此在引入CSS时建议使用 `<link>` 而不是 `@import`

```html
<link href="style.css" rel="stylesheet" />
```

- `src(resource` 即资源，当浏览器遇到 src 时会暂停页面解析，直到该资源下载或执行完毕，此亦 script 标签之所以放底部的原因；

```html
<script src="script.js"></script>
```



## 1-4、meta 标签

<u>meta 标签用于描述网页的 元信息；比如网站作者、描述、关键词；</u>

meta 通过 `name=xxx` 和 `content=xxx` 形式定义信息，常用设置如下：

- charset：定义HTML文档的字符集

```html
 <meta charset="UTF-8" >
```

- http-equiv：可用于模拟http 请求头、设置过期时间、缓存、刷新

```html
＜meta http-equiv="expires" content="Wed, 20 Jun 2019 22:33:00 GMT"＞
```

- viewport：视口，用于控制页面宽高及缩放比例

```html
<meta  name="viewport"  content="width=device-width, initial-scale=1, maximum-scale=1">
```

- **<u>将 http 请求转为 https 请求</u>**

```html
<meta http-equiv ="Content-Security-Policy" content="upgrade-insecure-requests">
```



### 1-4-1、viewport

- width/height，宽高，默认宽度 980px
- initial-scale，初始缩放比例，1~10
- maximum-scale/minimum-scale，允许用户缩放的最大/小比例
- user-scalable，用户是否可以缩放 (yes/no)



### 1-4-2、http-equive

- expires，指定过期时间
- progma，设置no-cache可以禁止缓存
- refresh，定时刷新
- set-cookie，可以设置cookie
- X-UA-Compatible，使用浏览器版本
- apple-mobile-web-app-status-bar-style，针对WebApp全屏模式，隐藏状态栏/设置状态栏颜色



### 1-4-X、综合示例

**<u>做响应式网站时，一定要在页面头部加入如下 meta 声明：</u>**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"> 
```

- width = device-width：宽度等于当前设备的宽度
- initial-scale：初始的缩放比例（默认设置为1.0）
- minimum-scale：允许用户缩放到的最小比例（默认设置为1.0）
- maximum-scale：允许用户缩放到的最大比例（默认设置为1.0）
- user-scalable：用户是否可以手动缩放（默认设置为 no，因不希望用户放大缩小页面）

此段 meta 所表示的作用如下：

- **<u>设备浏览器根据设定的尺寸来显示页面，且比例是1，不可通过手势放大缩小；</u>** 
- 否则，移动客户端的浏览器真的会以它的 1px 来显示你设定的 1px；最终效果是被缩放的效果，字小小的那种；





## 1-5、a 标签

link→visited→hover→active

- `a:link`：未访问时的样式，一般省略成a

- `a:visited`：已经访问后的样式

- `a:hover`：鼠标移上去时的样式

- `a:active`：鼠标按下时的样式


