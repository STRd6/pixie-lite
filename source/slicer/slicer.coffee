Slicer = (I={}) ->
  {width, height, image} = I

  canvas = $("<canvas width=#{width} height=#{height}>")
    .css
      display: "block"
  canvasElement = canvas.get(0)

  canvas.appendTo("body")

  overlayCanvas = $("<canvas width=#{width} height=#{height}>")
    .css
      position: "absolute"
      top: 0
      bottom: 0
      display: "block"
  overlayCanvas.appendTo("body")

  context = canvasElement.getContext("2d")
  overlayContext = overlayCanvas.get(0).getContext("2d")

  offsetX = 0
  offsetY = 0

  guidesX = []
  guidesY = []

  selection = null
  snap = 16

  selections = Storage.list("selections")

  drawGuides = (context) ->
    context.fillStyle = 'rgba(0, 0, 0, 0.25)'

    (width / snap).times (n) ->
      context.fillRect(n * snap, 0, 1, height)

    (height / snap).times (n) ->
      context.fillRect(0, n * snap, width, 1)

  drawSelection = (context) ->
    if selection
      context.fillStyle = 'rgba(255, 0, 0, 0.25)'
      context.fillRect selection...

    selections.each (selection) ->
      context.fillStyle = 'rgba(0, 255, 0, 0.25)'
      context.fillRect selection...

  update = ->
    context.clearRect(0, 0, width, height)
    context.drawImage(image, offsetX, offsetY)

    overlayContext.clearRect(0, 0, width, height)
    drawGuides(overlayContext)
    drawSelection(overlayContext)

  update()

  snapSelection = (points) ->
    points[3] += snap
    points[2] += snap

    points.invoke("snap", snap)

  selectionData = (x, y, width, height) ->
    tempCanvas = $("<canvas width=" + width + " height=" + height + "></canvas>").get(0)

    context = tempCanvas.getContext('2d')

    context.drawImage(canvasElement, x, y, width, height, 0, 0, width, height)

    data = tempCanvas.toDataURL("image/png")

    return data.substr(data.indexOf(',') + 1)

  selection: (newSelection) ->
    if arguments.length >= 1
      selection = snapSelection(newSelection)
      update()
    else
      selection

  remember: ->
    if selection
      selections.push(selection)

      Storage.pushData "selections", selection

      update()

  extract: (bounds, delay=0) ->
    bounds ||= selection
    data = selectionData(bounds...)

    setTimeout ->
      $.post '/upload',
        data_base64: data
        type: "image/png"
    , delay

    raw = CryptoJS.enc.Base64.parse(data)
    sha = CryptoJS.SHA1(raw).toString()

    Storage.pushData "extractions", sha

    return sha

  extractAll: ->
    extract = @extract
    selections.map (selection, i) ->
      extract(selection, i * 500)

  eval: (code) ->
    eval(code)

window.Slicer = Slicer

$ ->
  slicer = null

  sha = Storage.list("extractions")[0]
  url = Resource.url(sha, true)

  img = $ "<img>",
    crossOrigin: ""
    load: ->
      window.slicer = slicer = Slicer
        width: @width
        height: @height
        image: this

    src: url

  startPosition = null

  pos = (event) ->
    offset = $(event.currentTarget).offset()

    [
      event.pageX - offset.left
      event.pageY - offset.top
    ]

  $(document).on
    mousedown: (e) ->
      startPosition = pos(e)

    mousemove: (e) ->
      if startPosition
        [x, y] = pos(e)
        extent = [
          x - startPosition[0]
          y - startPosition[1]
        ]

        slicer.selection([startPosition..., extent...])

    mouseup: ->
      startPosition = null
  , "canvas"

  $(document).bind "keydown", "x", ->
    slicer.extract()

  $(document).bind "keydown", "r", ->
    slicer.remember()

  $(document).bind "keydown", "a", ->
    shas = slicer.extractAll()
    shas.each (sha) ->
      Storage.pushData("tiles", sha)
