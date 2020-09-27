# 五、String相关



## 5-1、逆序输出

```js
function reverse(str) {
  let res = str.split('');
  return res.reverse().join('');
}
reverse('hello world!'); // output: '!dlrow olleh'
```



## 5-X、其他

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

