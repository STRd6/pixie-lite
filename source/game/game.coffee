$("<div id='tiles'>").appendTo("body")

objects = []

map = Map (x, y, z) ->


tileset = Tileset ->
  tileset.render()
  map.tiles(tileset.tiles())

setInterval ->
  map.render()
, 100
