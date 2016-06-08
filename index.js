'use strict';

var path = require("path");

module.exports = function (content, file, options) {

  function findFile(_src, _reg, _fatDir) {
    if (fis.util.isFile(_src)) {
      var tpl = fis.file.wrap(_src);

      if (_reg.test(tpl.getContent())) {
        return replaceFile(_reg, path.dirname(path.dirname(_src)) + "/", tpl.getContent());
      } else {
        return tpl.getContent() + "\r\n<!-- include[ " + _src + " ] -->";
      }
    }
    return false;
  }

  function replaceFile(_reg, _fatDir, _file) {
    return (_file ? _file : content).replace(_reg, function (ret, src) {
      var srcAr = [];
      if(options.root instanceof Array){
        for (var i = 0; i < options.root.length; i++) {
          srcAr.push(fis.project.getProjectPath() + "/" + options.root[i] + src);
        }
      }else{
        srcAr.push(fis.project.getProjectPath() + src);
      }
      _file ? srcAr.push(_fatDir + src) : srcAr.push(_fatDir + src);

      var ret = false;
      for (var ii = 0; ii < srcAr.length; ii++) {
        ret = findFile(srcAr[ii], _reg, _fatDir);
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
  var fatDir = path.dirname(path.dirname(options.filename)) + "/";

  var fileReg = eval("/" + options.start + ".+" + options.hook + "=\"(.*)\".+" + options.end + "/ig");

  if (file.isHtmlLike) {
    return replaceFile(fileReg, fatDir);
  }
  return content;
};