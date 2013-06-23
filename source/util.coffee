Object.extend Storage,
  pushData: (name, value) ->
    list = @list(name)

    list.push value unless list.include(value)

    @store(name, list)

    return list

  removeData: (name, value) ->
    list = @list(name)

    list.remove value

    @store(name, list)

    return list

  store: (key, value) ->
    localStorage[key] = JSON.stringify(value)

    return value

  list: (name) ->
    if existing = localStorage[name]
      JSON.parse(existing)
    else
      []

  hash: (name) ->
    if existing = localStorage[name]
      JSON.parse(existing)
    else
      {}

  filetree: ->
    @hash("filetree")

  mergeTree: (tree) ->
    key = "filetree"

    mergedTree = Object.extend @hash(key), tree

    @store(key, mergedTree)

window.Filetree =
  set: (name, sha) ->
    tree = Storage.filetree()
    tree[name] = sha

    Storage.store("filetree", tree)

  sha: (name) ->
    Storage.filetree()[name]

  save: (name, data) ->
    sha = CAS.storeJSON data

    @set name, sha

  load: (name, callback) ->
    if sha = Storage.filetree()[name]
      CAS.getJSON sha, callback
    else
      setTimeout callback

window.CAS =
  storeJSON: (data, type="application/json") ->
    jsonData = JSON.stringify(data)

    $.post '/upload',
      data: jsonData
      type: type

    return CryptoJS.SHA1(jsonData).toString()

  storeBase64: (data, options={}) ->
    Object.reverseMerge options,
      type: "image/png"
      callback: ->

    $.post '/upload',
      data_base64: data
      type: options.type
    , ->
      options.callback()

    raw = CryptoJS.enc.Base64.parse(data)

    return CryptoJS.SHA1(raw).toString()

  getJSON: (sha, callback) ->
    url = Resource.url(sha, true)

    $.getJSON url, callback

window.Util =
  dataFromDataURL: (dataURL) ->
    dataURL.substr(dataURL.indexOf(',') + 1)

  toCSON: (obj) ->
    representation = JSON.parse(JSON.stringify(obj))

    Object.keys(representation).map (key) ->
      value = representation[key]
      "#{key}: #{JSON.stringify(value)}"
    .join("\n")


window.Resource =
  # If you call crossOrigin, but use the url in a normal request rather than a cross
  # origin request CloudFront will cache the wrong headers making it unusable, so don't
  # make a mistake!
  url: (sha, crossOrigin=false) ->
    n = Math.floor(parseInt(sha.substring(0, 1), 16) / 4)

    url = "http://a#{n}.pixiecdn.com/#{sha}"

    if crossOrigin
      "#{url}?#{location.host}"
    else
      url

  imageFor: (sha) ->
    $ "<img>",
      src: @url(sha)
    .get(0)

window.UI =
  buttons: (buttons, selector="body") ->
    _.each buttons, (fn, name) ->
      $("<button>",
        text: name
        click: fn
      ).appendTo(selector)

  actions: (actions) ->
    _.each actions, (fn, key) ->
      $(document).bind "keydown", key, ->
        fn()

        return false

window.Effect =
  flash: ->
    $("canvas").css("opacity", 0).animate({opacity: 1}, "fast")

# Array madness!!

["x", "y", "z"].each (dim, i) ->
  Object.defineProperty Array::, dim,
    get: ->
      @[i]
    set: (x) ->
      @[i] = x

Point::round = ->
  Point(
    @x.round()
    @y.round()
  )
