# fis-parser-include-html

a parser plugin for fis to compile html file
在 parser 阶段，解析自行定义include语法

## usage

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
      hook: "file", // 用于引用表达式滴开始
      start: "#{", // 引用开始标记
      end: "/}" // 引用结束标记
    })
  });
```
