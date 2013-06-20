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

window.CAS =
  storeJSON: (data, type="application/json") ->
    jsonData = JSON.stringify(data)

    $.post '/upload',
      data: jsonData
      type: type

    return CryptoJS.SHA1(jsonData).toString()

  storeBase64: (data, type="image/png") ->
    $.post '/upload',
      data_base64: data
      type: type

    raw = CryptoJS.enc.Base64.parse(data)

    return CryptoJS.SHA1(raw).toString()

  getJSON: (sha, callback) ->
    url = Resource.url(sha, true)

    $.getJSON url, callback

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
