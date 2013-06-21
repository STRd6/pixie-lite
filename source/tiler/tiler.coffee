Map = ->
  tileWidth = 64 # pixels
  tileHeight = 32 # pixels

  width = 640 # pixels
  height = 480 # pixels

  canvas = $("<canvas width=#{width} height=#{height}>")
    .css
      display: "block"
      margin: "auto"
    .appendTo("body")

  canvasElement = canvas.get(0)

  layersElement = $("<div id='layers'>").appendTo("body")

  5.times ->
    layersElement.append("<textarea>")

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
    layers.each (layer, z) ->
      layer.length.times (i) ->
        row = layer[i]

        size = row.length
        size.times (j) ->
          j = (size - 1) - j

          tile = row[j]
          x = (j * tileWidth / 2) + (i * tileWidth / 2)
          y = (i * tileHeight / 2) - (j * tileHeight / 2)

          if tile?
            drawTile(tile, x, y - (tileHeight * z))

    return this

  layerData = []
  layers = []

  Filetree.load "tilemap", (data) ->
    if data
      loadLayers(data)

  drawTile = (tile, x, y) ->
    if img = $("img").get(tile)

      context.drawImage(img, x, y + height/2)

  loadLayers = (data) ->
    layerData = data
    layers = layerData.map parseLayer

    $("#layers textarea").each (i) ->
      $(this).val(layerData[i])

    render()

  loadLayers: loadLayers

  saveLayerData: ->
    sha = CAS.storeJSON(layerData)

    Filetree.set "tilemap", sha

  eval: (code) ->
    eval(code)

  render: render

Tiler = ->
  tileShas = Storage.list("tiles")

  perPage = 113
  page = 0

  render = ->
    $("#tiles").empty()

    n = perPage * page

    tileShas[n...(n + perPage)].each (sha) ->
      url = Resource.url(sha)

      img = $("<img>",
        src: url
      ).appendTo("#tiles")

  render()

  eval: (code) ->
    eval(code)

  changePage: (delta) ->
    page += delta

    render()
    map.render()

window.Tiler = Tiler

$("<div id='tiles'>").appendTo("body")

tiler = Tiler()

map = null

setTimeout ->
  map = Map().render()
, 1000

$(document).bind "keydown", "=", ->
  tiler.changePage(+1)

$(document).bind "keydown", "-", ->
  tiler.changePage(-1)

$(document).bind "keydown", "s", ->
  map.saveLayerData()

window.saveTilesets = ->
  tree = {}
  n = 0

  Storage.list("tiles").eachSlice 113, (shas) ->
    tree["tileset#{n}"] = CAS.storeJSON(shas)
    n += 1

  Storage.mergeTree(tree)

refreshLayers = ->
  data = $("#layers textarea").map ->
    $(this).val()
  .get()

  map.loadLayers data

$(document).on
  keyup: refreshLayers
  blur: refreshLayers
, "#layers textarea"
