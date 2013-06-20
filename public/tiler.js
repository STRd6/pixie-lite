// Generated by CoffeeScript 1.4.0
var Map, Tiler, tiler;

Map = function() {
  var canvas, canvasElement, context, drawTile, height, layer, tileHeight, tileWidth, width;
  tileWidth = 64;
  tileHeight = 32;
  width = 640;
  height = 480;
  canvas = $("<canvas width=" + width + " height=" + height + ">").css({
    display: "block"
  }).appendTo("body");
  canvasElement = canvas.get(0);
  context = canvasElement.getContext("2d");
  layer = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  drawTile = function(tile, x, y) {
    var img;
    img = $("img").get(0);
    debugger;
    return context.drawImage(img, x, y + height / 2);
  };
  return {
    render: function() {
      return layer.length.times(function(i) {
        var row, size;
        row = layer[i];
        size = row.length;
        return size.times(function(j) {
          var tile, x, y;
          j = (size - 1) - j;
          tile = row[j];
          x = (j * tileWidth / 2) + (i * tileWidth / 2);
          y = (i * tileHeight / 2) - (j * tileHeight / 2);
          return drawTile(tile, x, y);
        });
      });
    }
  };
};

Tiler = function() {
  var page, perPage, render, tileShas;
  tileShas = Storage.list("tiles");
  perPage = 113;
  page = 0;
  console.log(tileShas);
  render = function() {
    var n;
    $("#tiles").empty();
    n = perPage * page;
    return tileShas.slice(n, n + perPage).each(function(sha) {
      var img, url;
      url = Resource.url(sha);
      return img = $("<img>", {
        src: url
      }).appendTo("#tiles");
    });
  };
  render();
  return {
    changePage: function(delta) {
      page += delta;
      return render();
    }
  };
};

window.Tiler = Tiler;

$("<div id='tiles'>").appendTo("body");

tiler = Tiler();

setTimeout(function() {
  return Map().render();
}, 1000);

$(document).bind("keydown", "=", function() {
  return tiler.changePage(+1);
});

$(document).bind("keydown", "-", function() {
  return tiler.changePage(-1);
});