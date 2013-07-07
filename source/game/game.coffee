$("<div id='tiles'>").appendTo("body").hide()

$("<div id='overlays'>").appendTo("body")

slimeSha = "20f9b8cd931474b4db69191149d304439f368d64"
wizardSha = "4f01094edfd72af20acc5d3469be7184c054eb2e"

slime = PlayerCharacter
  position: [4, 2, 1]
  image: Resource.imageFor slimeSha
  yOffset: 0
  name: "Slime"
  special: ->
    map.setData(@position..., 6)
    objectsAt(@position...).each (object) ->
     object.move [0, 0, 1]
  cleanup: ->

wizard = PlayerCharacter
  position: [4, 1, 1]
  image: Resource.imageFor wizardSha
  yOffset: 0
  name: "Wizard"
  special: ->
  cleanup: ->
    map.adjacentTiles(@position...).each (tile) =>
      if tile.acid
        @health -= 1

objects = [slime, wizard]
activeIndex = 0

map = Map
  objects: objects

tileset = Tileset
  name: "tileset"
  loaded: ->
    tileset.render()
    map.tiles(tileset.tiles())

setInterval ->
  map.render()

, 100

pointClamp = (p, min, max) ->
  p.map (n) ->
    n.clamp(min, max) | 0

pointAdd = (p1, p2) ->
  [
    p1.x + p2.x
    p1.y + p2.y
    p1.z + p2.z
  ]

# Groundswell
groundswell = ->
  pos = slime.position

activeCharacter = ->
  objects.wrap(activeIndex)

next = ->
  activeCharacter().cleanup()

  activeIndex += 1

  map.setTopLayer activeCharacter().position.z + 1

  displayOverlays()

act = (dir) ->
  currentPosition = activeCharacter().position

  activeCharacter().move(dir)
  activeCharacter().fall()

  next() unless _.isEqual(currentPosition, activeCharacter().position)

special = ->
  activeCharacter().special()

  next()

displayOverlays = ->
  $overlays = $("#overlays").empty()
  # TODO Fix off by one error!
  objects.wrap(activeIndex-1, objects.length).each (object) ->
    $overlays.append(object.renderOverlay())

actions =
  "[": ->
    map.changeCameraAngle (-1/4).turns
  "]": ->
    map.changeCameraAngle (+1/4).turns
  up: ->
    act [0, 1, 0]
  down: ->
    act [0, -1, 0]
  left: ->
    act [-1, 0, 0]
  right: ->
    act [1, 0, 0]
  space: ->
    special()


UI.actions actions
