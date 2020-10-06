# 五、String相关

fromChatCode、charCodeAt、

charAt、slice、substr、substring、concat

trim、trimLeft、trimRight、repeat



localeCompare、normalize、toUpperCase、toLowerCase、

startsWitth、endsWith、include、indexOf、



encodeURIComponent、decodeURIComponent

escape、unescape(待废弃)



search、replace、match、matchAll、split 请看 [RegExp](./RegExp相关.md)



## 5-1、基本

### 5-1-1、创建

- 直接构建；
- String()；
- new String 创建再调用 valueOf；

注意：基本字符串，会被 JS引擎 转化为字符串对象，并且调用相应方法 / 执行查询；



<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215626.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215629.png" alt="img" style="zoom:67%;" />

 

### 5-1-2、获取

charAt & 数组索引法(因其为迭代器)

  

### 5-1-3、比较

<><+>=、localeCompare



## 5-2、方法

### 5-2-1、转码类

#### 5-2-1-1、fromCharCode

[String.fromCharCode(num1, *...*, numN)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)

参数：UTF-16代码单元数字，范围介于 0-65535 (0xFFFF)，超出将被截断(但实际中还能解析)

返回：字符串；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215633.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215628.png" alt="img" style="zoom:67%;" />

```js
function GetBytes(str) {
  let len = str.length,
    bytes = len;
  for (let i = 0; i < len; i++) {
    if (str.charCodeAt(i) > 255) bytes++;
  }
  return bytes;
}
```



#### 5-2-1-2、charCodeAt

[String.charCodeAt(index)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)

参数：索引位置(默认值为 0，若非法索引则返回NaN)；

返回：Unicode 编码单元表中对应值；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215634.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215628.png" alt="img" style="zoom:67%;" />



#### 5-2-1-3、encode/decodeURIComponent

注意：其不属于 StringAPI；[encodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)、[decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)



#### 5-2-1-4、escape、unescape

注意：[escape](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape)、[unescape](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape) 无法处理特色字符如: @*_+-./ 须用上面的两者替代；







### 5-2-2、提取类

#### 5-2-2-1、charAt

string.charAt(index)

参数：[0~length-1) 的整数，默认值0；

返回：给定索引处字符，若索引超出范围则返回空字符串；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215635.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215628.png" alt="img" style="zoom:67%;" />

#### 5-2-2-2、slice

string.slice(beginIndex[, endIndex])

参数1：该索引(默认0)处，开始提取，若值为负则先经 strLength + beginIndex 处理，若处理后仍为负数，则当0处理；

参数2：可选，在该索引(默认0)处，结束提取，若省略该参则一直提取至末尾，若值为负则先经 strLength + endIndex 处理，若处理后仍为负，则返回串；

返回：新字符串、不改变原字符串；

作用：可用于创建新字符串；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215636.png" alt="img" style="zoom:67%;" />

#### 5-2-2-3、substr

[string.substr(start[, length])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr)

参数1：开始提取字符索引处、若为负值则先经过 strLength + start 处理；

参数2：提取字符数目、为0或负数返回空字符串、忽略则默认提取所有内容；

返回：所选字符串；注意：应该避免使用；因并非 JS 一部分，未来将可能会被移除掉，应用 substring 替代；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215637.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215638.png" alt="img" style="zoom:67%;" />



#### 5-2-2-4、substring

[string.substring(indexStart[, indexEnd])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substring)

参数1：开始提取的字符索引、若与参数2等值则返回空字符串、

参数2：可选、该数字为索引的字符，不包含在提取字符串内、若省略则默认提取至末尾；

返回：包含给定字符串的指定部分的新字符串、不改变原字符串；

- 注意：任一参数小于0或NaN，则视为0；同理，大于字符串长度则视为值==字符串长度；
- 注意：若参数1 > 参数2，则结果等同于两参数位置对调后的结果；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215639.png" alt="img" style="zoom:67%;" />

应用1：获取最后x个字符可配合字符串长度值；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215640.png" alt="img" style="zoom:67%;" />

应用2：替换字符串

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215641.png" alt="img" style="zoom:67%;" />



#### 5-2-2-5、concat

[string.concat(string2, string3[, ..., stringN])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/concat)

参数：和原字符串连接的多个字符串；

返回：新字符串、不改变原值；



#### 5-2-2-6、repeat

[string.repeat(count)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

参数：重复次数；

返回：重复副本字符串、不改变原始值；

- 注意：参数不能为负数、不能为 Infinity、否则报错；若为0，则返回空字符串；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215627.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215642.png" alt="img" style="zoom:67%;" />

 



 

 

 

 

### 5-2-3、去除空格类

#### 5-2-3-1、trim

[string.trim()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)

注意：str.trimRight()、str.trimLeft(); 效果类似；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215643.png" alt="img" style="zoom:67%;" />



### 5-2-4、字符操作

#### 5-2-4-1、referenceStr.localeCompare

[referenceStr.localeCompare(compareString , locales[, options])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

参数1：用以比较的字符串；

参数2：可选、系列参数、更为细致的排序效果；

参数3：可选、系列参数、更为细致的排序效果；

返回：当 引用字符串 在 比较字符串 之前时返回 -1，之后返回1，相同返回0；

注意：规范中只要求返回值是正值和负值，而没有规定具体的值。一些浏览器可能返回-2或2或其他一些负的、正的值；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215644.png" alt="img" style="zoom:67%;" />

逐个比较、空字符串也能比较，且排序是首位：

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215645.png" alt="img" style="zoom:67%;" />

注意：若报错：Uncaught TypeError: a.localeCompare is not a function，[you can fix by：a.toString().localeCompare(b)](https://github.com/witheve/Eve/issues/232)



#### 5-2-4-2、normalize

[string.normalize([form])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)

参数：目标 str 输出形式，四种 Unicode 正规形式 "NFC", "NFD", "NFKC", 以及 "NFKD" 其中的一个, 默认值为 "NFC”(懵逼)

返回：传入 Unicode 正规形式，返回当前字符串正规化 (懵逼)、或非法字符的 Error；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215646.png" alt="img" style="zoom:67%;" />

#### 5-2-4-3、其他

str.toUpperCase()、str.toLowerCase() - 略、不改变原字符串；





### 5-2-5、匹配操作

#### 5-2-5-1、startsWith

[string.startsWith(searchString[, position])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)

参数1：目标字符串

参数2：开始搜索位置索引，默认0；

返回：布尔值；注意：大小写敏感、须严格等同；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215647.png" alt="img" style="zoom:67%;" />



#### 5-2-5-2、endsWith

[string.endsWith(searchString[, length])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

参数1：同 str.startsWith ，为目标字符串；

参数2：作为 str 的长度。默认值为 str.length；

返回：布尔值；注意：大小写敏感、参数2即匹配长度；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215648.png" alt="img" style="zoom:67%;" />



#### 5-2-5-3、 includes

[string.includes(searchString[, position])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes)

参数1：目标字符串

参数2：开始搜索位置索引，默认0；

返回：布尔值；注意：大小写敏感、包含即可、使用上与 startsWith 尚有区别；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215649.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215650.png" alt="img" style="zoom:67%;" />

 

#### 5-2-5-4、 indexOf

[string.indexOf(searchValue[, firomIndex])](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)

参数1：被查找值；

参数2：起始查找值；

返回：指定值的第一次出现的索引; 如果没有找到 -1；注意：区分大小写、连续/递归查询时，须使用大于前一次查询得出的 index；

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215651.png" alt="img" style="zoom:67%;" />

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215652.png" alt="img" style="zoom:67%;" />





## 5-3、应用

- 去除字符串最末字符

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215653.png" alt="img" style="zoom:67%;" />

- 截取后几位字符

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215654.png" alt="img" style="zoom:67%;" />

-  替换某索引处字符

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215655.png" alt="img" style="zoom:67%;" />

- 中文转码

- 注意：escape 待废弃，[谨慎使用](https://github.com/Microsoft/TypeScript/issues/8639)；
- 注意：若想在 TS 中使用，需声明，并尽快使用 encodeURI/encodeURIComponent 替代：declare function escape(s:string): string；
- 详看：[文章1](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape)、[文章2](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215656.png" alt="img" style="zoom:67%;" />

- 复制字符串

方法1：for 循环；

方法2：ES6 的 repeat

方法3：Array.join()

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215657.png" alt="img" style="zoom:67%;" />

- 统计字符串字节总长度(假设字母占1个，汉字占2个字节)

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215658.png" alt="img" style="zoom:67%;" />

- 逆序输出

```js
function reverse(str) {
  let res = str.split('');
  return res.reverse().join('');
}
reverse('hello world!'); // output: '!dlrow olleh'
```

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215700.png" alt="img" style="zoom:67%;" />

- 模拟 indexOf

```js
const fadeIndexOf = (a, b)  => a.search(b)
```



- 随机字符串

方式1：直接随机生成

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215630.png" alt="img" style="zoom:67%;" />

缺点：只能生成有 0-9、a-z字符组成的字符串；由于 Math.random()生成的18位小数，可能无法填充36位，最后几个字符串，只能在指定的几个字符中选择，导致随机性降低；某些情况下会返回空值，比如，当随机数为 0, 0.5, 0.25, 0.125...时，返回为空值；

 

方式2：直接指定字符集

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215631.png" alt="img" style="zoom:67%;" />

方式3：采用 crypto 库

<img src="https://leibnize-picbed.oss-cn-shenzhen.aliyuncs.com/img/20201006215632.png" alt="img" style="zoom:67%;" />



- 其他

```js
var a = {
    b: 123,
    c: '456',
    e: '789',
}
var str=`a{a.b}aa{a.c}aa {a.d}aaaa`;
// => 'a123aa456aa {a.d}aaaa'

// 模板输出
const fn1 = (str, obj) => {
    let res = '';
    // 标志位，标志前面是否有{
    let flag = false;
    let start;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '{') {
            flag = true;
            start = i + 1;
            continue;
        }
        if (!flag) res += str[i];
        else {
            if (str[i] === '}') {
                flag = false;
                res += match(str.slice(start, i), obj);
            }
        }
    }
    return res;
}
// 对象匹配操作
const match = (str, obj) => {
    const keys = str.split('.').slice(1);
    let index = 0;
    let o = obj;
    while (index < keys.length) {
        const key = keys[index];
        if (!o[key]) {
            return `{${str}}`;
        } else {
            o = o[key];
        }
        index++;
    }
    return o;
}
```



 



 

 









