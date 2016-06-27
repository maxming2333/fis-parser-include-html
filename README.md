# fis-parser-include-html

a parser plugin for fis to compile html file
在 parser 阶段，解析自行定义include语法

## usage

**支持格式**

```
<!--{include file="../../common/nav.html"}-->
<!--{include file="../../common/nav.html"/}-->
<!--{include "../../common/nav.html"}-->
<!--{include ../../common/nav.html}-->
<!--{include common/nav.html}-->
<!--{include file="common/nav.html"}-->
...
```

**install**

```bash
npm install fis-parser-include-html
```

**use**

```javascript
  fis.match('**.html', {
    rExt: '.html',
    parser: fis.plugin('include-html', {
      root: ["src/html/", "src/"], // 引用文件的目录前缀
      start: "#{", // 引用开始标记
      end: "/}" // 引用结束标记
    })
  });
```
