window.Map = (drawAt=->) ->
  tileWidth = 64 # pixels
  tileHeight = 32 # pixels

  width = 640 # pixels
  height = 480 # pixels

  cellsWide = 8
  cellsLong = 8
  cellsTall = 8

  canvas = $("<canvas width=#{width} height=#{height} id='map'>")
    .appendTo("body")

  canvasElement = canvas.get(0)

  context = canvasElement.getContext("2d")

  parseLayer = (text) ->
    text.split("\n").map (row) ->
      row.split('').map (n) ->
        res = parseInt(n, 36)

        if res != 0
          res || undefined
        else
          res

  render = ->
    context.clearRect(0, 0, width, height)
    cellsTall.times (k) ->
      cellsWide.times (i) ->
        cellsLong.times (j) ->
          j = (cellsLong - 1) - j

          tile = tileAt(i, j, k)

          if tile
            drawCell(tile, i, j, k)

          drawAt(i, j, k, tile)

    return this

  layerData = []
  layers = []
  tiles = []

  Filetree.load "tilemap", (data) ->
    if data
      loadLayers(data)

  tileAt = (i, j, k) ->
    tiles[layers[k]?[i]?[j]]

  drawObject = (object, x, y) ->
    object.draw(context, x, y + height/2)

  loadLayers = (data) ->
    layerData = data
    layers = layerData.map parseLayer

    $("#layers textarea").each (i) ->
      $(this).val(layerData[i])

    render()

  drawCell = (object, i, j, k) ->
    x = (j * tileWidth / 2) + (i * tileWidth / 2)
    y = (i * tileHeight / 2) - (j * tileHeight / 2)
    z = k * tileHeight

    drawObject(object, x, y - z)

  drawCell: drawCell

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
