window.Tile = (I={}) ->
  {sha} = I

  url = Resource.url(sha)

  img = $("<img>",
    src: url
    load: ->
      self.height = @height
  ).get(0)

  self = Object.extend {},
    __proto__: Tile::
    img: img
  , I

Tile:: =
  toJSON: ->
    _.omit(@, "img")
  draw: (canvas, x, y) ->
    offset = 64 - @height

    canvas.drawImage(@img, x, y + offset)
