$("<div id='tiles'>").appendTo("body")

slimeSha = "20f9b8cd931474b4db69191149d304439f368d64"

slime =
  position: [4, 2, 1]
  image: Resource.imageFor slimeSha
  yOffset: 0
  draw: (canvas, x, y) ->
    canvas.drawImage(@image, x + 16, y + 32 - @yOffset)

  move: (delta) ->
    onTile = map.tileAt(@position...)

    if onTile && onTile.stairs
      delta.z += 1

    newPosition = pointAdd(@position, delta)

    if map.isClear(newPosition...)
      @position = newPosition

    if tile = map.tileAt(@position...)
      @yOffset = tile.yOffset
    else
      @yOffset = 0

  fall: ->
    onTile = map.tileAt(@position...)

    if onTile && onTile.surface
      # Can't fall through surfaces
    else
      @move [0, 0, -1]
      @move [0, 0, -1]
      @move [0, 0, -1]
      @move [0, 0, -1]

    @position.z = 0 if @position.z < 0

objects = [slime]

map = Map (x, y, z, tile) ->
  inCell = objects.select (object) ->
    object.position.x == x &&
    object.position.y == y &&
    object.position.z == z

  inCell.each (object) ->
    map.drawCell object, x, y, z

tileset = Tileset ->
  tileset.render()
  map.tiles(tileset.tiles())

setInterval ->
  map.render()
, 100

pointAdd = (p1, p2) ->
  [
    p1.x + p2.x
    p1.y + p2.y
    p1.z + p2.z
  ]

actions =
  up: ->
    slime.move [0, 1, 0]
    slime.fall()
  down: ->
    slime.move [0, -1, 0]
    slime.fall()
  left: ->
    slime.move [-1, 0, 0]
    slime.fall()
  right: ->
    slime.move [1, 0, 0]
    slime.fall()

UI.actions actions
