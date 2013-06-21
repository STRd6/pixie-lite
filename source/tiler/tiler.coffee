
$("<div id='tiles'>").appendTo("body")

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

activeTile = null

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
    sha = $(this).attr("src").split("/").last()
    activeTile = tileset.lookup(sha)

    $("#props").val(Util.toCSON(activeTile))

    return false

, "#tiles img"

$("<textarea id='props'>")
  .appendTo "body"

$("#props").on
  blur: ->
    val = $(this).val()

    code = CoffeeScript.compile(val, bare: true)
    data = eval code

    Object.extend activeTile, data
