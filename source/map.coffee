window.Map = (I={}) ->
  tileWidth = 64 # pixels
  tileHeight = 32 # pixels

  width = 640 # pixels
  height = 480 # pixels

  cellsWide = 8
  cellsLong = 8
  cellsTall = 8

  objects = I.objects || []

  cameraAngle = 0.turns
  cameraRotation = Matrix.rotation(cameraAngle, Point(3.5,3.5))
  topLayer = 1

  viewport = $("<viewport id='map'>")

  canvas = $("<canvas width=#{width} height=#{height}>")
    .appendTo(viewport)
    .pixieCanvas()

  upperCanvas = $("<canvas width=#{width} height=#{height}>")
    .appendTo(viewport)
    .pixieCanvas()

  viewport.appendTo "body"

  objectsAt = (i, j, k) ->
    objects.select (object) ->
      object.position.x == i &&
      object.position.y == j &&
      object.position.z == k

  parseLayer = (text) ->
    text.split("\n").map (row) ->
      row.split('').map (n) ->
        res = parseInt(n, 36)

        if res != 0
          res || undefined
        else
          res

  render = ->
    canvas.clear()
    upperCanvas.clear()

    cellsTall.times (k) ->
      cellsWide.times (i) ->
        cellsLong.times (j) ->
          j = (cellsLong - 1) - j

          # Rotate i, j through camera rotation to select correct tile to draw
          p = cameraRotation.transformPoint(Point(i, j)).round()
          tile = tileAt(p.x, p.y, k)

          if tile
            if k >= topLayer
              upperCanvas.globalAlpha 1
              upperCanvas.globalCompositeOperation "destination-out"
              drawCell(tile, i, j, k, upperCanvas) # Erase to prevent ghosties

              upperCanvas.globalCompositeOperation "source-over"
              upperCanvas.globalAlpha 0.25
              drawCell(tile, i, j, k, upperCanvas)
            else
              drawCell(tile, i, j, k)

          objectsAt(p.x, p.y, k).each (object) ->
            drawCell object, i, j, k

    return this

  layerData = []
  layers = []
  tiles = []

  if Filetree.sha "tilemap"
    Filetree.load "tilemap", (data) ->
      if data
        loadLayers(data)
  else
    CAS.getJSON "a296b41fb709d9d0e0433754546400e5f003f17a", (data) ->
      loadLayers(data)

  tileAt = (i, j, k) ->
    tiles[layers[k]?[i]?[j]]

  setData = (i, j, k, id) ->
    ((layers[k] ||= [])[i] ||= [])[j] = id

  drawObject = (object, x, y, context=canvas) ->
    object.draw(context, x, y + height/2, cameraRotation)

  loadLayers = (data) ->
    layerData = data
    layers = layerData.map parseLayer

    $("#layers textarea").each (i) ->
      $(this).val(layerData[i])

    render()

  drawCell = (object, i, j, k, context=canvas) ->
    x = (j * tileWidth / 2) + (i * tileWidth / 2)
    y = (i * tileHeight / 2) - (j * tileHeight / 2)
    z = k * tileHeight

    drawObject(object, x, y - z, context)

  setData: setData

  changeCameraAngle: (delta) ->
    cameraAngle += delta
    cameraRotation = Matrix.rotation(cameraAngle, Point(3.5,3.5))
    @render()

  changeTopLayer: (delta) ->
    topLayer = (topLayer + delta).clamp(0, 7)
    @render()

  setTopLayer: (n) ->
    topLayer = n.clamp(0, 7)
    @render()

  adjacentTiles: (i, j, k) ->
    [
      @tileAt(i, j, k - 1)
      @tileAt(i, j, k + 1)
      @tileAt(i, j - 1, k)
      @tileAt(i, j + 1, k)
      @tileAt(i - 1, j, k)
      @tileAt(i + 1, j, k)
    ].compact()

  tiles: (newTiles) ->
    tiles = newTiles

    render()

  loadLayers: loadLayers

  saveLayerData: ->
    sha = CAS.storeJSON(layerData)

    Filetree.set "tilemap", sha

  isClear: (i, j, k) ->
    tile = tileAt(i, j, k)

    !tile or (tile.solid is false)

  tileAt: tileAt

  eval: (code) ->
    eval(code)

  render: render
