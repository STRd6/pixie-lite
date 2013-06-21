$ ->
  $("#console").submit ->
    source = $("#console textarea").val()
    code = CoffeeScript.compile source

    # TODO Save with sha?

    eval(code)

    return false
