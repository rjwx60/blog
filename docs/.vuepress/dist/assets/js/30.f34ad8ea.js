(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{620:function(e,n,a){"use strict";a.r(n);var t=a(4),r=Object(t.a)({},(function(){var e=this,n=e.$createElement,a=e._self._c||n;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h4",{attrs:{id:"_605-can-place-flowers"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_605-can-place-flowers"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"https://leetcode-cn.com/problems/can-place-flowers/",target:"_blank",rel:"noopener noreferrer"}},[e._v("605. Can Place Flowers"),a("OutboundLink")],1)]),e._v(" "),a("p",[e._v("Suppose you have a long flowerbed in which some of the plots are planted and some are not. However, flowers cannot be planted in adjacent plots - they would compete for water and both would die.")]),e._v(" "),a("p",[e._v("Given a flowerbed (represented as an array containing 0 and 1, where 0 means empty and 1 means not empty), and a number n, return if n new flowers can be planted in it without violating the no-adjacent-flowers rule.")]),e._v(" "),a("p",[e._v("假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死")]),e._v(" "),a("p",[e._v("给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花？能则返回True，不能则返回False。")]),e._v(" "),a("h4",{attrs:{id:"example"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#example"}},[e._v("#")]),e._v(" Example")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Input: flowerbed = [1,0,0,0,1], n = 1\nOutput: True\n\nInput: flowerbed = [1,0,0,0,1], n = 2\nOutput: False\n")])])]),a("h4",{attrs:{id:"note"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#note"}},[e._v("#")]),e._v(" Note")]),e._v(" "),a("p",[e._v("The input array won't violate no-adjacent-flowers rule.\nThe input array size is in the range of [1, 20000].\nn is a non-negative integer which won't exceed the input array size.")]),e._v(" "),a("p",[e._v("Think：")]),e._v(" "),a("p",[e._v("思路：边界处理与连续三值为0")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("/**\n * @param {number[]} flowerbed\n * @param {number} n\n * @return {boolean}\n */\nvar canPlaceFlowers = function(flowerbed, n) {\n  // 计数器\n  let max = 0\n  // 右边界补充[0,0,0],最后一块地能不能种只取决于前面的是不是1，所以默认最后一块地的右侧是0（无须考虑右侧边界有阻碍）\n  flowerbed.push(0)\n  for (let i = 0, len = flowerbed.length - 1; i < len; i++) {\n    if (flowerbed[i] === 0) {\n      // 左边界判断\n      if (i === 0 && flowerbed[1] === 0) {\n        max++\n        i++\n      // 三者均为 0 即可种花\n      } else if (flowerbed[i - 1] === 0 && flowerbed[i + 1] === 0) {\n        max++\n        i++\n      }\n    }\n  }\n  return max >= n\n};\n")])])]),a("p",[e._v("https://leetcode-cn.com/problems/can-place-flowers/solution/")])])}),[],!1,null,null,null);n.default=r.exports}}]);