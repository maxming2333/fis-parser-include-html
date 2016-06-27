'use strict';

var path = require("path");

module.exports = function (content, file, options) {
  var start = options.start || '<!--{';
  var end = options.end || '}-->';
  var reg = eval("/" + start + "include(.+)" + end + "/ig");

  function findFile(_src, _fatDir) {
    if (fis.util.isFile(_src)) {
      var tpl = fis.file.wrap(_src);

      if (reg.test(tpl.getContent())) {
        return replaceFile(path.dirname(path.dirname(_src)) + "/", tpl.getContent());
      } else {
        return tpl.getContent() + "\r\n<!--include[ " + _src + " ]-->";
      }
    }
    return false;
  }

  function replaceFile(_fatDir, _file) {
    return (_file ? _file : content).replace(reg, function (match, p1, offset, string) {
      var p = p1.replace(/.+["'](.*)["']/ig, '$1');
      p = (p == p1) ? p1.replace(/\s+(.*)/ig, '$1') : p;

      if(p == p1){
        throw new Error("can't parsing this include grammar \'" + p1 + "\'");
      }

      var srcAr = [];
      srcAr.push(_fatDir + p)
      if(options.root instanceof Array){
        for (var i = 0; i < options.root.length; i++) {
          srcAr.push(fis.project.getProjectPath() + "/" + options.root[i] + p);
        }
      }else{
        srcAr.push(fis.project.getProjectPath() + p);
      }

      var ret = false;
      for (var ii = 0; ii < srcAr.length; ii++) {
        ret = findFile(srcAr[ii], _fatDir);
        if (ret) {
          break;
        }
      }

      if (ret) {
        return ret;
      } else {

        throw new Error("Not Find file \'" + srcAr.join("\'  or  \'") + "\'");
      }
    });
  }

  for (var i in options) {
    if (["filename", "root"].indexOf(i) < 0) {
      options[i] = options[i].replace(/\\/ig, "\\\\").replace(/\//ig, "\\\/");
    }
  }

  var fatDir = path.dirname(options.filename) + "/";

  if (file.isHtmlLike) {
    return replaceFile(fatDir, content);
  }
  return content;
};