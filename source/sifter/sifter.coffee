UI.buttons
  Save: ->
    shas = $("img").map ->
      @getAttribute("sha")
    .get()

    if name = prompt "Enter a name for this list"
      Filetree.save name, shas

  Load: ->
    if name = prompt "Enter a name to load"
      Filetree.load name, (shas) ->
        $tiles = $("#tiles").empty()

        shas.each (sha) ->
          data =
            url: Resource.url sha
            sha: sha

          $tiles.append HAML.image(data)

$("<div id='tiles'>").appendTo("body")

Storage.list("extractions").each (sha) ->
  data =
    url: Resource.url sha
    sha: sha

  $("#tiles").append HAML.image(data)

$("#tiles").on "click", "img", (e) ->
  if e.shiftKey
    $(this).remove()
  else
    $(this).nextAll().remove()
