UI.buttons
  Save: ->
    tileset.save()
    map.saveLayerData()

$("<div id='tiles'>").appendTo("body")

layersElement = $("<div id='layers'>").appendTo("body")

5.times ->
  layersElement.append("<textarea>")

map = Map()

tileset = Tileset ->
  tileset.render()
  map.tiles(tileset.tiles())

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
    activeTile = tileset.get($(this).index())

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

UI.actions
  "[": ->
    map.changeCameraAngle (-1/4).turns
  "]": ->
    map.changeCameraAngle (+1/4).turns
  "up": ->
    map.changeTopLayer(+1)
  "down": ->
    map.changeTopLayer(-1)
