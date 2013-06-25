// Generated by CoffeeScript 1.6.3
$(function() {
  return $("body").dropImageReader({
    matchType: /.*/,
    callback: function(_arg) {
      var data, dataURL, file, sha;
      dataURL = _arg.dataURL, file = _arg.file;
      data = Util.dataFromDataURL(dataURL);
      sha = CAS.storeBase64(data, {
        callback: function() {},
        type: file.type
      });
      return console.log(sha);
    }
  });
});
