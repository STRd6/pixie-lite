// Generated by CoffeeScript 1.4.0
var act, actions, activeCharacter, activeIndex, displayOverlays, groundswell, map, next, objects, pointAdd, pointClamp, slime, slimeSha, special, tileset, wizard, wizardSha,
  __slice = [].slice;

$("<div id='tiles'>").appendTo("body").hide();

$("<div id='overlays'>").appendTo("body");

slimeSha = "20f9b8cd931474b4db69191149d304439f368d64";

wizardSha = "4f01094edfd72af20acc5d3469be7184c054eb2e";

slime = PlayerCharacter({
  position: [4, 2, 1],
  image: Resource.imageFor(slimeSha),
  yOffset: 0,
  name: "Slime",
  special: function() {
    map.setData.apply(map, __slice.call(this.position).concat([6]));
    return objectsAt.apply(null, this.position).each(function(object) {
      return object.move([0, 0, 1]);
    });
  },
  cleanup: function() {}
});

wizard = PlayerCharacter({
  position: [4, 1, 1],
  image: Resource.imageFor(wizardSha),
  yOffset: 0,
  name: "Wizard",
  special: function() {},
  cleanup: function() {
    var _this = this;
    return map.adjacentTiles.apply(map, this.position).each(function(tile) {
      if (tile.acid) {
        return _this.health -= 1;
      }
    });
  }
});

objects = [slime, wizard];

activeIndex = 0;

map = Map({
  objects: objects
});

tileset = Tileset(function() {
  tileset.render();
  return map.tiles(tileset.tiles());
});

setInterval(function() {
  return map.render();
}, 100);

pointClamp = function(p, min, max) {
  return p.map(function(n) {
    return n.clamp(min, max) | 0;
  });
};

pointAdd = function(p1, p2) {
  return [p1.x + p2.x, p1.y + p2.y, p1.z + p2.z];
};

groundswell = function() {
  var pos;
  return pos = slime.position;
};

activeCharacter = function() {
  return objects.wrap(activeIndex);
};

next = function() {
  activeCharacter().cleanup();
  activeIndex += 1;
  map.setTopLayer(activeCharacter().position.z + 1);
  return displayOverlays();
};

act = function(dir) {
  var currentPosition;
  currentPosition = activeCharacter().position;
  activeCharacter().move(dir);
  activeCharacter().fall();
  if (!_.isEqual(currentPosition, activeCharacter().position)) {
    return next();
  }
};

special = function() {
  activeCharacter().special();
  return next();
};

displayOverlays = function() {
  var $overlays;
  $overlays = $("#overlays").empty();
  return objects.wrap(activeIndex - 1, objects.length).each(function(object) {
    return $overlays.append(object.renderOverlay());
  });
};

actions = {
  "[": function() {
    return map.changeCameraAngle((-1 / 4).turns);
  },
  "]": function() {
    return map.changeCameraAngle((+1 / 4).turns);
  },
  up: function() {
    return act([0, 1, 0]);
  },
  down: function() {
    return act([0, -1, 0]);
  },
  left: function() {
    return act([-1, 0, 0]);
  },
  right: function() {
    return act([1, 0, 0]);
  },
  space: function() {
    return special();
  }
};

UI.actions(actions);
