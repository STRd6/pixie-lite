Map = ->
  tileWidth = 64 # pixels
  tileHeight = 32 # pixels

  width = 640 # pixels
  height = 480 # pixels

  canvas = $("<canvas width=#{width} height=#{height}>")
    .css
      display: "block"
    .appendTo("body")

  canvasElement = canvas.get(0)

  context = canvasElement.getContext("2d")

  layer = [
    [0, 0, 0, 0]
    [0, 0, 0, 0]
    [0, 0, 0, 0]
    [0, 0, 0, 0]
  ]

  drawTile = (tile, x, y) ->
    img = $("img").get(0)

    debugger

    context.drawImage(img, x, y + height/2)

  render: ->
    layer.length.times (i) ->
      row = layer[i]

      size = row.length
      size.times (j) ->
        j = (size - 1) - j

        tile = row[j]
        x = (j * tileWidth / 2) + (i * tileWidth / 2)
        y = (i * tileHeight / 2) - (j * tileHeight / 2)

        drawTile(tile, x, y)

Tiler = ->
  tileShas = Storage.list("tiles")

  perPage = 113
  page = 0

  console.log tileShas

  render = ->
    $("#tiles").empty()

    n = perPage * page

    tileShas[n...(n + perPage)].each (sha) ->
      url = Resource.url(sha)

      img = $("<img>",
        src: url
      ).appendTo("#tiles")

  render()

  changePage: (delta) ->
    page += delta

    render()

window.Tiler = Tiler

$("<div id='tiles'>").appendTo("body")

tiler = Tiler()

setTimeout ->
  Map().render()
, 1000

$(document).bind "keydown", "=", ->
  tiler.changePage(+1)

$(document).bind "keydown", "-", ->
  tiler.changePage(-1)
