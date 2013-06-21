window.Tileset = (loaded) ->
  tiles = []

  Filetree.load "tileset", (data) ->
    tiles = data.map (sha) ->
      Tile
        sha: sha

    loaded()

  render = ->
    $tiles = $("#tiles").empty()

    tiles.each (tile) ->
      $tiles.append tile.img

  render: render

  tiles: ->
    tiles

  eval: (code) ->
    eval(code)
