
$("<div id='tiles'>").appendTo("body")
$("<div id='coolTiles'>").appendTo("body")

layersElement = $("<div id='layers'>").appendTo("body")

5.times ->
  layersElement.append("<textarea>")

map = Map()

tileset = Tileset ->
  tileset.render()
  map.tiles(tileset.tiles())

$(document).bind "keydown", "=", ->
  tiler.changePage(+1)

$(document).bind "keydown", "-", ->
  tiler.changePage(-1)

$(document).bind "keydown", "s", ->
  map.saveLayerData()

tileProps =
  default:
    hflip: false
    offset: 0

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

$(document).on
  mousedown: (e) ->
    $(this).appendTo("#coolTiles")

    return false

, "#tiles img"

$(document).on
  mousedown: (e) ->
    $(this).appendTo("#tiles")

    return false

, "#coolTiles img"
