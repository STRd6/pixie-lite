// Generated by CoffeeScript 1.4.0
var Map, Tiler, map, refreshLayers, tiler;

Map = function() {
  var canvas, canvasElement, context, drawTile, height, layerData, layers, layersElement, loadLayers, parseLayer, render, tileHeight, tileWidth, width;
  tileWidth = 64;
  tileHeight = 32;
  width = 640;
  height = 480;
  canvas = $("<canvas width=" + width + " height=" + height + ">").css({
    display: "block",
    margin: "auto"
  }).appendTo("body");
  canvasElement = canvas.get(0);
  layersElement = $("<div id='layers'>").appendTo("body");
  5..times(function() {
    return layersElement.append("<textarea>");
  });
  context = canvasElement.getContext("2d");
  parseLayer = function(text) {
    return text.split("\n").map(function(row) {
      return row.split('').map(function(n) {
        var res;
        res = parseInt(n, 36);
        if (res !== 0) {
          return res || void 0;
        } else {
          return res;
        }
      });
    });
  };
  render = function() {
    context.clearRect(0, 0, width, height);
    layers.each(function(layer, z) {
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
          if (tile != null) {
            return drawTile(tile, x, y - (tileHeight * z));
          }
        });
      });
    });
    return this;
  };
  layerData = [];
  layers = [];
  Filetree.load("tilemap", function(data) {
    if (data) {
      return loadLayers(data);
    }
  });
  drawTile = function(tile, x, y) {
    var img;
    if (img = $("img").get(tile)) {
      return context.drawImage(img, x, y + height / 2);
    }
  };
  loadLayers = function(data) {
    layerData = data;
    layers = layerData.map(parseLayer);
    $("#layers textarea").each(function(i) {
      return $(this).val(layerData[i]);
    });
    return render();
  };
  return {
    loadLayers: loadLayers,
    saveLayerData: function() {
      var sha;
      sha = CAS.storeJSON(layerData);
      return Filetree.set("tilemap", sha);
    },
    "eval": function(code) {
      return eval(code);
    },
    render: render
  };
};

Tiler = function() {
  var page, perPage, render, tileShas;
  tileShas = Storage.list("tiles");
  perPage = 113;
  page = 0;
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
    "eval": function(code) {
      return eval(code);
    },
    changePage: function(delta) {
      page += delta;
      render();
      return map.render();
    }
  };
};

window.Tiler = Tiler;

$("<div id='tiles'>").appendTo("body");

tiler = Tiler();

map = null;

setTimeout(function() {
  return map = Map().render();
}, 1000);

$(document).bind("keydown", "=", function() {
  return tiler.changePage(+1);
});

$(document).bind("keydown", "-", function() {
  return tiler.changePage(-1);
});

$(document).bind("keydown", "s", function() {
  return map.saveLayerData();
});

window.saveTilesets = function() {
  var n, tree;
  tree = {};
  n = 0;
  Storage.list("tiles").eachSlice(113, function(shas) {
    tree["tileset" + n] = CAS.storeJSON(shas);
    return n += 1;
  });
  return Storage.mergeTree(tree);
};

refreshLayers = function() {
  var data;
  data = $("#layers textarea").map(function() {
    return $(this).val();
  }).get();
  return map.loadLayers(data);
};

$(document).on({
  keyup: refreshLayers,
  blur: refreshLayers
}, "#layers textarea");
