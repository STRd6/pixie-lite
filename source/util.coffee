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
      list = JSON.parse(existing)
    else
      list = []

    return list

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
