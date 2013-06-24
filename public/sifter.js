// Generated by CoffeeScript 1.4.0

UI.buttons({
  Save: function() {
    var name, shas;
    shas = $("img").map(function() {
      return this.getAttribute("sha");
    }).get();
    if (name = prompt("Enter a name for this list")) {
      return Filetree.save(name, shas);
    }
  },
  Load: function() {
    var name;
    if (name = prompt("Enter a name to load")) {
      return Filetree.load(name, function(shas) {
        var $tiles;
        $tiles = $("#tiles").empty();
        return shas.each(function(sha) {
          var data;
          data = {
            url: Resource.url(sha),
            sha: sha
          };
          return $tiles.append(HAML.image(data));
        });
      });
    }
  }
});

$("<div id='tiles'>").appendTo("body");

Storage.list("extractions").each(function(sha) {
  var data;
  data = {
    url: Resource.url(sha),
    sha: sha
  };
  return $("#tiles").append(HAML.image(data));
});

$("#tiles").on("click", "img", function(e) {
  if (e.shiftKey) {
    return $(this).remove();
  } else {
    return $(this).nextAll().remove();
  }
});
