UI.buttons
  Save: ->
    tileset.save()
    map.saveLayerData()

$("<div id='tiles'>").appendTo("body")
$("<div id='preview'>").appendTo("body")

layersElement = $("<div id='layers'>").appendTo("body")

8.times ->
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

    $("#preview .tiledata").remove()
    $("#preview").append HAML.tiledata activeTile.present()

    return false

, "#tiles img"

$("<textarea id='props'>")
  .appendTo "#preview"

$("#props").on
  blur: ->
    val = $(this).val()

    code = CoffeeScript.compile(val, bare: true)
    data = eval code

    Object.extend activeTile, data

    $("#preview .tiledata").remove()
    $("#preview").append HAML.tiledata activeTile.present()

UI.actions
  "[": ->
    map.changeCameraAngle (-1/4).turns
  "]": ->
    map.changeCameraAngle (+1/4).turns
  "up": ->
    map.changeTopLayer(+1)
  "down": ->
    map.changeTopLayer(-1)
