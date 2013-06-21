window.Tileset = (loaded) ->
  tiles = []

  complete = (data) ->
    tiles = data.map (sha) ->
      if _.isString sha
        Tile
          sha: sha
      else
        Tile sha

    loaded()

  if Filetree.sha "tileset"
    Filetree.load "tileset", complete
  else
    sha = "fb5eadfdbba50cddf5a8e1cedcfbc9184f0b0fd0"

    CAS.getJSON sha, complete

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
