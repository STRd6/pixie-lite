displaySaved = (sha, imgData) ->
  if imgData
    url = "data:image/png;base64,#{imgData}"
  else
    n = Math.floor(parseInt(sha.substring(0, 1), 16) / 4)
    url = "http://a#{n}.pixiecdn.com/#{sha}"
    # url = "https://s3.amazonaws.com/addressable/#{sha}"

  $.gritter.add
    title: ''
    text: ''
    image: url
    time: ''
    sticky: true

try
  if appData = JSON.parse(localStorage.pixieData)
    appData.each (datum) ->
      displaySaved(datum)
  else
    appData = []
catch e
  appData = []

_canvas = null

$ ->
  $(document).on "click", ".gritter-item", ->
    src = $(this).find("img").attr("src")
    _canvas.fromDataURL(src)

  pixelEditor = Pixie.Editor.Pixel.create
    width: 32
    height: 32
    initializer: (canvas) ->
      _canvas = canvas

      canvas.addAction
        name: "download"
        perform: (canvas) ->
          w = window.open()
          w.document.location = canvas.toDataURL()
        undoable: false

      canvas.addAction
        name: "save"
        perform: (canvas) ->
          data = canvas.toBase64()

          $.post '/upload',
            data_base64: data
            type: "image/png"

          raw = CryptoJS.enc.Base64.parse(data)
          sha = CryptoJS.SHA1(raw).toString()
          displaySaved(sha, data)

          # Store address locally
          appData.push(sha)
          localStorage.pixieData = JSON.stringify(appData)

        undoable: false

  pixelEditor.appendTo($('body'))
