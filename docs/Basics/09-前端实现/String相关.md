# 五、String相关

## 5-1、逆序输出

```js
function reverse(str) {
  let res = str.split('');
  return res.reverse().join('');
}
reverse('hello world!'); // output: '!dlrow olleh'
```

