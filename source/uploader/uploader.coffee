$ ->
  $("body").dropImageReader
    matchType: /.*/
    callback: ({dataURL, file}) ->
      data = Util.dataFromDataURL(dataURL)

      sha = CAS.storeBase64 data,
        callback: ->
        type: file.type

      console.log sha
