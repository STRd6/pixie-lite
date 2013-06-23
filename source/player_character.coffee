window.PlayerCharacter = (I={}) ->
  Object.extend {},
    __proto__: PlayerCharacter::
    health: 10
    healthMax: 10
  , I

PlayerCharacter:: =
  draw: (canvas, x, y) ->
    canvas.drawImage(@image, x + 16, y + 32 - @yOffset)

  renderOverlay: ->
    HAML.player_overlay(@)

  move: (delta) ->
    onTile = map.tileAt(@position...)

    if onTile && onTile.stairs
      delta.z += 1

    newPosition = pointClamp(pointAdd(@position, delta), 0, 7)

    if map.isClear(newPosition...)
      @position = newPosition

    if tile = map.tileAt(@position...)
      @yOffset = tile.yOffset
    else
      @yOffset = 0

  special: ->

  cleanup: ->

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
