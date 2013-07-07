window.Tileset = ({loaded, name}}) ->
  name ||= "tileset"
  tiles = []

  complete = (data) ->
    tiles = data.map (sha) ->
      if _.isString sha
        Tile
          sha: sha
      else
        Tile sha

    loaded()

  loadSha = (sha) ->
    CAS.getJSON sha, complete

  if Filetree.sha name
    Filetree.load name, complete
  else
    loadSha "fb5eadfdbba50cddf5a8e1cedcfbc9184f0b0fd0"

  render = ->
    $tiles = $("#tiles").empty()

    tiles.each (tile) ->
      $tiles.append tile.img

  render: render

  loadSha: loadSha

  tiles: ->
    tiles

  save: ->
    @saveAs(name)

  saveAs: (fileName="tileset") ->
    Filetree.save fileName, tiles

  get: (n) ->
    tiles[n]

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
