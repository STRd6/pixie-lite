window.Tileset = (loaded) ->
  tiles = []

  Filetree.load "tileset", (data) ->
    tiles = data.map (sha) ->
      if _.isString sha
        Tile
          sha: sha
      else
        Tile sha

    loaded()

  render = ->
    $tiles = $("#tiles").empty()

    tiles.each (tile) ->
      $tiles.append tile.img

  render: render

  tiles: ->
    tiles

  save: (name="tileset") ->
    Filetree.save name, tiles

  lookup: (sha) ->
    tiles.select (tile) ->
      tile.sha is sha
    .first()

  eval: (code) ->
    eval(code)

window.TileProtos =
  stairs:
    offset: 32 # Adjusts things on top
    stair: true
