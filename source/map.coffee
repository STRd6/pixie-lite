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
    cellsTall.times (z) ->
      cellsWide.times (i) ->
        cellsLong.times (j) ->
          j = (cellsLong - 1) - j

          tile = layers[z]?[i]?[j]

          if tile?
            x = (j * tileWidth / 2) + (i * tileWidth / 2)
            y = (i * tileHeight / 2) - (j * tileHeight / 2)

            drawTile(tile, x, y - (tileHeight * z))

          drawAt(i, j, z)

    return this

  layerData = []
  layers = []
  tiles = []

  Filetree.load "tilemap", (data) ->
    if data
      loadLayers(data)

  drawTile = (tile, x, y) ->
    if tile = tiles[tile]
      tile.draw(context, x, y + height/2)

  loadLayers = (data) ->
    layerData = data
    layers = layerData.map parseLayer

    $("#layers textarea").each (i) ->
      $(this).val(layerData[i])

    render()

  tiles: (newTiles) ->
    tiles = newTiles

    render()

  loadLayers: loadLayers

  saveLayerData: ->
    sha = CAS.storeJSON(layerData)

    Filetree.set "tilemap", sha

  eval: (code) ->
    eval(code)

  render: render
