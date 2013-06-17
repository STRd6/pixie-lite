
/**
jQuery Hotkeys Plugin
Copyright 2010, John Resig
Dual licensed under the MIT or GPL Version 2 licenses.

Based upon the plugin by Tzury Bar Yochay:
http://github.com/tzuryby/hotkeys

Original idea by:
Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/


(function() {

  (function(jQuery) {
    var isFunctionKey, isTextAcceptingInput, keyHandler;
    isTextAcceptingInput = function(element) {
      return /textarea|select/i.test(element.nodeName) || element.type === "text" || element.type === "password";
    };
    isFunctionKey = function(event) {
      var _ref;
      return (event.type !== "keypress") && ((112 <= (_ref = event.which) && _ref <= 123));
    };
    jQuery.hotkeys = {
      version: "0.8",
      specialKeys: {
        8: "backspace",
        9: "tab",
        13: "return",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "del",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scroll",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "meta"
      },
      shiftNums: {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
      }
    };
    keyHandler = function(handleObj) {
      var keys, origHandler;
      if (typeof handleObj.data !== "string") {
        return;
      }
      origHandler = handleObj.handler;
      keys = handleObj.data.toLowerCase().split(" ");
      return handleObj.handler = function(event) {
        var character, key, modif, possible, special, target, _i, _len;
        special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which];
        character = String.fromCharCode(event.which).toLowerCase();
        modif = "";
        possible = {};
        target = event.target;
        if (event.altKey && special !== "alt") {
          modif += "alt+";
        }
        if (event.ctrlKey && special !== "ctrl") {
          modif += "ctrl+";
        }
        if (event.metaKey && !event.ctrlKey && special !== "meta") {
          modif += "meta+";
        }
        if (this !== target) {
          if (isTextAcceptingInput(target) && !modif && !isFunctionKey(event)) {
            return;
          }
        }
        if (event.shiftKey && special !== "shift") {
          modif += "shift+";
        }
        if (special) {
          possible[modif + special] = true;
        } else {
          possible[modif + character] = true;
          possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
          if (modif === "shift+") {
            possible[jQuery.hotkeys.shiftNums[character]] = true;
          }
        }
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (possible[key]) {
            return origHandler.apply(this, arguments);
          }
        }
      };
    };
    return jQuery.each(["keydown", "keyup", "keypress"], function() {
      return jQuery.event.special[this] = {
        add: keyHandler
      };
    });
  })(jQuery);

}).call(this);
(function() {

  (function($) {
    return $.fn.takeClass = function(name) {
      this.addClass(name).siblings().removeClass(name);
      return this;
    };
  })(jQuery);

}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["pixie/editor/pixel/templates/color_picker"] = (function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='color_picker'>\n  <div class='white_overlay'></div>\n  <div class='black_overlay'></div>\n  <div class='color_overlay'>\n    <div class='white_overlay'></div>\n    <div class='black_overlay'></div>\n    <div class='cursor_overlay'></div>\n  </div>\n  <div class='slider'>\n    <div class='hue_gradient'></div>\n  </div>\n  <div class='hue_selector'></div>\n</div>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  });;
}).call(this);

/*
 jQuery Plugin port of
 JavaScript Color Picker

 @author    Honza Odvarko, http:#odvarko.cz
 @copyright Honza Odvarko
 @license   http://www.gnu.org/copyleft/gpl.html  GNU General Public License
 @version   1.0.9
 @link      http://jscolor.com

 @ported_by Daniel Moore http://strd6.com
 @ported_by Matt Diebolt http://pixieengine.com
*/


(function() {

  (function($) {
    return $.fn.colorPicker = function(options) {
      var blur, colorOverlaySize, colorPicker, createDialog, cursorOverlay, cursorSize, dir, focus, generateHueGradient, getElementPos, getMousePos, gradient, gradientStep, hideDialog, instance, instanceId, leadingHash, overlay, showDialog, slider, sliderPointerHeight, updateInput, updateOverlayPosition, updateSliderPosition;
      options || (options = {});
      leadingHash = options.leadingHash != null ? options.leadingHash : true;
      dir = options.dir || '/assets/jscolor/';
      colorOverlaySize = 256;
      cursorSize = 15;
      sliderPointerHeight = 11;
      gradientStep = 2;
      instanceId = 0;
      instance = null;
      colorPicker = $(JST["pixie/editor/pixel/templates/color_picker"]());
      slider = colorPicker.find('.hue_selector');
      overlay = colorPicker.find('.color_overlay');
      gradient = colorPicker.find('.slider');
      cursorOverlay = colorPicker.find('.cursor_overlay');
      window.color = function(hex) {
        var HSV_RGB, RGB_HSV;
        this.hue = 0;
        this.saturation = 1;
        this.value = 0;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.setRGB = function(r, g, b) {
          var hsv;
          if (r != null) {
            this.red = r;
          }
          if (g != null) {
            this.green = g;
          }
          if (b != null) {
            this.blue = b;
          }
          hsv = RGB_HSV(this.red, this.green, this.blue);
          this.hue = hsv[0];
          this.saturation = hsv[1];
          return this.value = hsv[2];
        };
        this.setHSV = function(h, s, v) {
          var rgb;
          if (h != null) {
            this.hue = h;
          }
          if (s != null) {
            this.saturation = s;
          }
          if (v != null) {
            this.value = v;
          }
          rgb = HSV_RGB(this.hue, this.saturation, this.value);
          this.red = rgb[0];
          this.green = rgb[1];
          return this.blue = rgb[2];
        };
        RGB_HSV = function(r, g, b) {
          var h, m, n, v;
          n = Math.min(r, g, b);
          v = Math.max(r, g, b);
          m = v - n;
          if (m === 0) {
            return [0, 0, v];
          }
          if (r === n) {
            h = 3 + (b - g) / m;
          } else if (g === n) {
            h = 5 + (r - b) / m;
          } else {
            h = 1 + (g - r) / m;
          }
          h = h % 6;
          return [h, m / v, v];
        };
        HSV_RGB = function(h, s, v) {
          var f, i, m, n;
          if (h == null) {
            return [v, v, v];
          }
          i = Math.floor(h);
          f = i % 2 ? h - i : 1 - (h - i);
          m = v * (1 - s);
          n = v * (1 - s * f);
          switch (i) {
            case 0:
            case 6:
              return [v, n, m];
            case 1:
              return [n, v, m];
            case 2:
              return [m, v, n];
            case 3:
              return [m, n, v];
            case 4:
              return [n, m, v];
            case 5:
              return [v, m, n];
          }
        };
        this.setString = function(hex) {
          var m;
          m = hex.match(/^\s*#?([0-9A-F]{3}([0-9A-F]{3})?)\s*$/i);
          if (m) {
            if (m[1].length === 6) {
              return this.setRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255);
            } else {
              return this.setRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16) / 255, parseInt(m[1].charAt(1) + m[1].charAt(1), 16) / 255, parseInt(m[1].charAt(2) + m[1].charAt(2), 16) / 255);
            }
          } else {
            this.setRGB(0, 0, 0);
            return false;
          }
        };
        this.toString = function() {
          var b, color, g, r, _ref;
          _ref = (function() {
            var _i, _len, _ref, _results;
            _ref = [this.red, this.green, this.blue];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              color = _ref[_i];
              _results.push((color * 255).round().toString(16));
            }
            return _results;
          }).call(this), r = _ref[0], g = _ref[1], b = _ref[2];
          return ((r.length === 1 ? '0' + r : r) + (g.length === 1 ? '0' + g : g) + (b.length === 1 ? '0' + b : b)).toUpperCase();
        };
        if (hex) {
          return this.setString(hex);
        }
      };
      createDialog = function() {
        var g, i, setHue, setSV, _i;
        colorPicker.get(0).onmousedown = function(e) {
          instance.preserve = true;
          return cursorOverlay.css({
            cursor: 'none'
          });
        };
        colorPicker.get(0).onmousemove = function(e) {
          if (instance.overlayActive) {
            setSV(e);
          }
          if (instance.sliderActive) {
            return setHue(e);
          }
        };
        colorPicker.get(0).onselectstart = function(e) {
          return e.preventDefault();
        };
        colorPicker.get(0).onmouseup = colorPicker.onmouseout = function(e) {
          var _base;
          cursorOverlay.css({
            cursor: "url(/assets/jscolor/cross.png) 3 4, default"
          });
          if (instance.overlayActive || instance.sliderActive) {
            instance.overlayActive = instance.sliderActive = false;
            if (typeof (_base = instance.input).onchange === "function") {
              _base.onchange();
            }
          }
          return instance.input.focus();
        };
        setSV = function(e) {
          var p, relX, relY;
          p = getMousePos(e);
          relX = (p.x - instance.cursor.x).clamp(0, colorOverlaySize);
          relY = (p.y - instance.cursor.y).clamp(0, colorOverlaySize);
          instance.color.saturation = relX / colorOverlaySize;
          instance.color.value = 1 - (relY / colorOverlaySize);
          instance.color.setHSV();
          updateOverlayPosition(relX, relY);
          return updateInput(instance.input, instance.color);
        };
        overlay.get(0).onmousedown = function(e) {
          instance.overlayActive = true;
          return setSV(e);
        };
        for (i = _i = 0; 0 <= colorOverlaySize ? _i < colorOverlaySize : _i > colorOverlaySize; i = _i += gradientStep) {
          g = $('<div class="hue_gradient" />');
          g.css({
            backgroundColor: "hsl(" + i + ", 1, 0.5)",
            height: "" + gradientStep + "px"
          });
          $(gradient).append(g);
        }
        setHue = function(e) {
          var p, relY;
          p = getMousePos(e);
          relY = (p.y - instance.sliderPosition).clamp(0, colorOverlaySize);
          instance.color.hue = ((relY / colorOverlaySize) * 6).clamp(0, 5.99);
          instance.color.setHSV();
          updateSliderPosition(relY);
          return updateInput(instance.input, instance.color);
        };
        slider.get(0).onmousedown = function(e) {
          instance.sliderActive = true;
          setHue(e);
          return slider.css({
            cursor: 'none'
          });
        };
        return slider.get(0).onmouseup = function() {
          return slider.css({
            cursor: 'pointer'
          });
        };
      };
      showDialog = function(input) {
        var colorPickerWidth, dp, inputHeight, inputWidth, ip;
        inputHeight = input.offsetHeight;
        inputWidth = input.offsetWidth;
        colorPickerWidth = 292;
        ip = getElementPos(input);
        dp = {
          x: ip.x + inputWidth - colorPickerWidth,
          y: ip.y + inputHeight
        };
        instanceId++;
        instance = {
          input: input,
          color: new color(input.value),
          preserve: false,
          overlayActive: false,
          sliderActive: false,
          cursor: {
            x: dp.x,
            y: dp.y
          },
          sliderPosition: dp.y
        };
        updateOverlayPosition();
        updateSliderPosition();
        generateHueGradient();
        $(colorPicker).css({
          left: "" + dp.x + "px",
          top: "" + dp.y + "px"
        });
        return $('body').append(colorPicker);
      };
      hideDialog = function() {
        $('body').find(colorPicker).remove();
        return instance = null;
      };
      updateSliderPosition = function(y) {
        var hue;
        hue = instance.color.hue;
        y || (y = ((hue / 6) * colorOverlaySize).round());
        slider.css({
          backgroundPosition: "0 " + ((y - (sliderPointerHeight / 2) + 1).floor()) + "px"
        });
        return overlay.css({
          backgroundColor: "hsl(" + (hue * 60) + ", 100%, 50%)"
        });
      };
      updateOverlayPosition = function(x, y) {
        var hue, saturation, value, _ref;
        _ref = [instance.color.hue, instance.color.saturation, instance.color.value], hue = _ref[0], saturation = _ref[1], value = _ref[2];
        x || (x = (saturation * colorOverlaySize).round());
        y || (y = ((1 - value) * colorOverlaySize).round());
        return cursorOverlay.css({
          backgroundPosition: "" + ((x - cursorSize / 2).floor()) + "px " + ((y - cursorSize / 2).floor()) + "px"
        });
      };
      generateHueGradient = function() {
        var b, c, g, gr_length, hue, r, s, saturation, value, _ref;
        _ref = [instance.color.hue, instance.color.saturation, instance.color.value], hue = _ref[0], saturation = _ref[1], value = _ref[2];
        r = g = b = s = c = [value, 0, 0];
        gr_length = $(gradient).children().length;
        return $(gradient).children().each(function(i, element) {
          hue = ((i / gr_length) * 360).round();
          return $(element).css({
            backgroundColor: "hsl(" + hue + ", 100%, 50%)"
          });
        });
      };
      updateInput = function(el, color) {
        $(el).val((leadingHash ? '#' : '') + color);
        return $(el).css({
          backgroundColor: '#' + color,
          color: color.value < 0.6 ? '#FFF' : '#000',
          textShadow: color.value < 0.6 ? 'rgba(255, 255, 255, 0.2) 1px 1px' : 'rgba(0, 0, 0, 0.2) 1px 1px'
        });
      };
      getElementPos = function(e) {
        return {
          x: $(e).offset().left,
          y: $(e).offset().top
        };
      };
      getMousePos = function(e) {
        return {
          x: e.pageX,
          y: e.pageY
        };
      };
      focus = function() {
        if (instance != null ? instance.preserve : void 0) {
          return instance.preserve = false;
        } else {
          return showDialog(this);
        }
      };
      blur = function() {
        var id, self;
        if (instance != null ? instance.preserve : void 0) {
          return;
        }
        self = this;
        id = instanceId;
        return setTimeout(function() {
          if (instance != null ? instance.preserve : void 0) {
            return;
          }
          if (instance && instanceId === id) {
            hideDialog();
          }
          return updateInput(self, new color($(self).val()));
        }, 0);
      };
      createDialog();
      return this.each(function() {
        var self;
        self = this;
        $(this).css({
          backgroundColor: this.value
        });
        this.originalStyle = {
          color: this.style.color,
          backgroundColor: this.style.backgroundColor
        };
        $(this).attr('autocomplete', 'off');
        this.onfocus = focus;
        this.onblur = blur;
        return updateInput(this, new color(this.value));
      });
    };
  })(jQuery);

}).call(this);
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);
//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);
(function() {
  var _base, _base1, _base2, _base3, _base4, _base5, _base6, _base7, _base8, _base9;

  window.HAML || (window.HAML = {});

  (_base = window.HAML).escape || (_base.escape = function(text) {
    return ("" + text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  });

  (_base1 = window.HAML).cleanValue || (_base1.cleanValue = function(text) {
    if (text === null || text === void 0) {
      return '';
    } else {
      return text;
    }
  });

  (_base2 = window.HAML).extend || (_base2.extend = function(globals, locals) {
    if (typeof jQuery !== "undefined" && jQuery !== null ? jQuery.extend : void 0) {
      return jQuery.extend({}, globals, locals);
    } else if (typeof _ !== "undefined" && _ !== null ? _.extend : void 0) {
      return _.extend({}, globals, locals);
    } else if (typeof Zepto !== "undefined" && Zepto !== null ? Zepto.extend : void 0) {
      return Zepto.extend(Zepto.extend({}, globals), locals);
    } else if (Object.append) {
      return Object.append(Object.append({}, globals), locals);
    } else if (Object.extend) {
      return Object.extend(Object.extend({}, globals), locals);
    } else {
      return locals;
    }
  });

  (_base3 = window.HAML).globals || (_base3.globals = function() {
    return {};
  });

  (_base4 = window.HAML).context || (_base4.context = function(locals) {
    return HAML.extend(HAML.globals(), locals);
  });

  (_base5 = window.HAML).preserve || (_base5.preserve = function(text) {
    return text.replace(/\\n/g, '&#x000A;');
  });

  (_base6 = window.HAML).findAndPreserve || (_base6.findAndPreserve = function(text) {
    var tags;
    tags = 'textarea,pre'.split(',').join('|');
    return text.replace(RegExp("<(" + tags + ")>([^]*?)<\\/\\1>", "g"), function(str, tag, content) {
      return "<" + tag + ">" + (window.HAML.preserve(content)) + "</" + tag + ">";
    });
  });

  (_base7 = window.HAML).surround || (_base7.surround = function(start, end, fn) {
    return start + fn() + end;
  });

  (_base8 = window.HAML).succeed || (_base8.succeed = function(end, fn) {
    return fn() + end;
  });

  (_base9 = window.HAML).precede || (_base9.precede = function(start, fn) {
    return start + fn();
  });

}).call(this);
(function() {
  var __slice = [].slice;

  window.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref1;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref1 = name.split('.');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);

/**
Checks whether an object is an array.

    Object.isArray([1, 2, 4])
    # => true

    Object.isArray({key: "value"})
    # => false

@name isArray
@methodOf Object
@param {Object} object The object to check for array-ness.
@returns {Boolean} A boolean expressing whether the object is an instance of Array
*/



(function() {
  var __slice = [].slice;

  Object.isArray = function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  };

  /**
  Checks whether an object is a string.

      Object.isString("a string")
      # => true

      Object.isString([1, 2, 4])
      # => false

      Object.isString({key: "value"})
      # => false

  @name isString
  @methodOf Object
  @param {Object} object The object to check for string-ness.
  @returns {Boolean} A boolean expressing whether the object is an instance of String
  */


  Object.isString = function(object) {
    return Object.prototype.toString.call(object) === "[object String]";
  };

  /**
  Merges properties from objects into target without overiding.
  First come, first served.

        I =
          a: 1
          b: 2
          c: 3

        Object.reverseMerge I,
          c: 6
          d: 4

        I # => {a: 1, b:2, c:3, d: 4}

  @name reverseMerge
  @methodOf Object
  @param {Object} target The object to merge the properties into.
  @returns {Object} target
  */


  Object.defaults = Object.reverseMerge = function() {
    var name, object, objects, target, _i, _len;
    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (name in object) {
        if (!target.hasOwnProperty(name)) {
          target[name] = object[name];
        }
      }
    }
    return target;
  };

  /**
  Merges properties from sources into target with overiding.
  Last in covers earlier properties.

        I =
          a: 1
          b: 2
          c: 3

        Object.extend I,
          c: 6
          d: 4

        I # => {a: 1, b:2, c:6, d: 4}

  @name extend
  @methodOf Object
  @param {Object} target The object to merge the properties into.
  @returns {Object} target
  */


  Object.extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  /**
  Helper method that tells you if something is an object.

      object = {a: 1}

      Object.isObject(object)
      # => true

  @name isObject
  @methodOf Object
  @param {Object} object Maybe this guy is an object.
  @returns {Boolean} true if this guy is an object.
  */


  Object.isObject = function(object) {
    return Object.prototype.toString.call(object) === '[object Object]';
  };

}).call(this);

/**
Calculate the average value of an array. Returns undefined if some elements
are not numbers.

    [1, 3, 5, 7].average()
    # => 4

@name average
@methodOf Array#
@returns {Number} The average (arithmetic mean) of the list of numbers.
*/


(function() {
  var _base,
    __slice = [].slice;

  Array.prototype.average = function() {
    return this.sum() / this.length;
  };

  /**
  Returns a copy of the array without null and undefined values.

      [null, undefined, 3, 3, undefined, 5].compact()
      # => [3, 3, 5]

  @name compact
  @methodOf Array#
  @returns {Array} A new array that contains only the non-null values.
  */


  Array.prototype.compact = function() {
    return this.select(function(element) {
      return element != null;
    });
  };

  /**
  Creates and returns a copy of the array. The copy contains
  the same objects.

      a = ["a", "b", "c"]
      b = a.copy()

      # their elements are equal
      a[0] == b[0] && a[1] == b[1] && a[2] == b[2]
      # => true

      # but they aren't the same object in memory
      a === b
      # => false

  @name copy
  @methodOf Array#
  @returns {Array} A new array that is a copy of the array
  */


  Array.prototype.copy = function() {
    return this.concat();
  };

  /**
  Empties the array of its contents. It is modified in place.

      fullArray = [1, 2, 3]
      fullArray.clear()
      fullArray
      # => []

  @name clear
  @methodOf Array#
  @returns {Array} this, now emptied.
  */


  Array.prototype.clear = function() {
    this.length = 0;
    return this;
  };

  /**
  Flatten out an array of arrays into a single array of elements.

      [[1, 2], [3, 4], 5].flatten()
      # => [1, 2, 3, 4, 5]

      # won't flatten twice nested arrays. call
      # flatten twice if that is what you want
      [[1, 2], [3, [4, 5]], 6].flatten()
      # => [1, 2, 3, [4, 5], 6]

  @name flatten
  @methodOf Array#
  @returns {Array} A new array with all the sub-arrays flattened to the top.
  */


  Array.prototype.flatten = function() {
    return this.inject([], function(a, b) {
      return a.concat(b);
    });
  };

  /**
  Invoke the named method on each element in the array
  and return a new array containing the results of the invocation.

      [1.1, 2.2, 3.3, 4.4].invoke("floor")
      # => [1, 2, 3, 4]

      ['hello', 'world', 'cool!'].invoke('substring', 0, 3)
      # => ['hel', 'wor', 'coo']

  @param {String} method The name of the method to invoke.
  @param [arg...] Optional arguments to pass to the method being invoked.
  @name invoke
  @methodOf Array#
  @returns {Array} A new array containing the results of invoking the named method on each element.
  */


  Array.prototype.invoke = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.map(function(element) {
      return element[method].apply(element, args);
    });
  };

  /**
  Randomly select an element from the array.

      [1, 2, 3].rand()
      # => 2

  @name rand
  @methodOf Array#
  @returns {Object} A random element from an array
  */


  Array.prototype.rand = function() {
    return this[rand(this.length)];
  };

  /**
  Remove the first occurrence of the given object from the array if it is
  present. The array is modified in place.

      a = [1, 1, "a", "b"]
      a.remove(1)
      # => 1

      a
      # => [1, "a", "b"]

  @name remove
  @methodOf Array#
  @param {Object} object The object to remove from the array if present.
  @returns {Object} The removed object if present otherwise undefined.
  */


  Array.prototype.remove = function(object) {
    var index;
    index = this.indexOf(object);
    if (index >= 0) {
      return this.splice(index, 1)[0];
    } else {
      return void 0;
    }
  };

  /**
  Returns true if the element is present in the array.

      ["a", "b", "c"].include("c")
      # => true

      [40, "a"].include(700)
      # => false

  @name include
  @methodOf Array#
  @param {Object} element The element to check if present.
  @returns {Boolean} true if the element is in the array, false otherwise.
  */


  Array.prototype.include = function(element) {
    return this.indexOf(element) !== -1;
  };

  /**
  Call the given iterator once for each element in the array,
  passing in the element as the first argument, the index of
  the element as the second argument, and <code>this</code> array as the
  third argument.

      word = ""
      indices = []
      ["r", "a", "d"].each (letter, index) ->
        word += letter
        indices.push(index)

      # => ["r", "a", "d"]

      word
      # => "rad"

      indices
      # => [0, 1, 2]

  @name each
  @methodOf Array#
  @param {Function} iterator Function to be called once for each element in the array.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} this to enable method chaining.
  */


  Array.prototype.each = function(iterator, context) {
    var element, i, _i, _len;
    if (this.forEach) {
      this.forEach(iterator, context);
    } else {
      for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
        element = this[i];
        iterator.call(context, element, i, this);
      }
    }
    return this;
  };

  /**
  Call the given iterator once for each element in the array,
  passing in the element as the first argument, the index of
  the element as the second argument, and `this` array as the
  third argument.

      [1, 2, 3].map (number) ->
        number * number
      # => [1, 4, 9]

  @name map
  @methodOf Array#
  @param {Function} iterator Function to be called once for each element in the array.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} An array of the results of the iterator function being called on the original array elements.
  */


  (_base = Array.prototype).map || (_base.map = function(iterator, context) {
    var element, i, results, _i, _len;
    results = [];
    for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
      element = this[i];
      results.push(iterator.call(context, element, i, this));
    }
    return results;
  });

  /**
  Call the given iterator once for each pair of objects in the array.

      [1, 2, 3, 4].eachPair (a, b) ->
        # 1, 2
        # 1, 3
        # 1, 4
        # 2, 3
        # 2, 4
        # 3, 4

  @name eachPair
  @methodOf Array#
  @param {Function} iterator Function to be called once for each pair of elements in the array.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  */


  Array.prototype.eachPair = function(iterator, context) {
    var a, b, i, j, length, _results;
    length = this.length;
    i = 0;
    _results = [];
    while (i < length) {
      a = this[i];
      j = i + 1;
      i += 1;
      _results.push((function() {
        var _results1;
        _results1 = [];
        while (j < length) {
          b = this[j];
          j += 1;
          _results1.push(iterator.call(context, a, b));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  /**
  Call the given iterator once for each element in the array,
  passing in the element as the first argument and the given object
  as the second argument. Additional arguments are passed similar to
  <code>each</code>.

  @see Array#each
  @name eachWithObject
  @methodOf Array#
  @param {Object} object The object to pass to the iterator on each visit.
  @param {Function} iterator Function to be called once for each element in the array.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} this
  */


  Array.prototype.eachWithObject = function(object, iterator, context) {
    this.each(function(element, i, self) {
      return iterator.call(context, element, object, i, self);
    });
    return object;
  };

  /**
  Call the given iterator once for each group of elements in the array,
  passing in the elements in groups of n. Additional argumens are
  passed as in each.

      results = []
      [1, 2, 3, 4].eachSlice 2, (slice) ->
        results.push(slice)
      # => [1, 2, 3, 4]

      results
      # => [[1, 2], [3, 4]]

  @see Array#each
  @name eachSlice
  @methodOf Array#
  @param {Number} n The number of elements in each group.
  @param {Function} iterator Function to be called once for each group of elements in the array.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} this
  */


  Array.prototype.eachSlice = function(n, iterator, context) {
    var i, len;
    if (n > 0) {
      len = (this.length / n).floor();
      i = -1;
      while (++i < len) {
        iterator.call(context, this.slice(i * n, (i + 1) * n), i * n, this);
      }
    }
    return this;
  };

  /**
  Pipe the input through each function in the array in turn. For example, if you have a
  list of objects you can perform a series of selection, sorting, and other processing
  methods and then receive the processed list. This array must contain functions that
  accept a single input and return the processed input. The output of the first function
  is fed to the input of the second and so on until the final processed output is returned.

  @name pipeline
  @methodOf Array#

  @param {Object} input The initial input to pass to the first function in the pipeline.
  @returns {Object} The result of processing the input by each function in the array.
  */


  Array.prototype.pipeline = function(input) {
    var fn, _i, _len;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      fn = this[_i];
      input = fn(input);
    }
    return input;
  };

  /**
  Returns a new array with the elements all shuffled up.

      a = [1, 2, 3]

      a.shuffle()
      # => [2, 3, 1]

      a # => [1, 2, 3]

  @name shuffle
  @methodOf Array#
  @returns {Array} A new array that is randomly shuffled.
  */


  Array.prototype.shuffle = function() {
    var shuffledArray;
    shuffledArray = [];
    this.each(function(element) {
      return shuffledArray.splice(rand(shuffledArray.length + 1), 0, element);
    });
    return shuffledArray;
  };

  /**
  Returns the first element of the array, undefined if the array is empty.

      ["first", "second", "third"].first()
      # => "first"

  @name first
  @methodOf Array#
  @returns {Object} The first element, or undefined if the array is empty.
  */


  Array.prototype.first = function() {
    return this[0];
  };

  /**
  Returns the last element of the array, undefined if the array is empty.

      ["first", "second", "third"].last()
      # => "third"

  @name last
  @methodOf Array#
  @returns {Object} The last element, or undefined if the array is empty.
  */


  Array.prototype.last = function() {
    return this[this.length - 1];
  };

  /**
  Returns an object containing the extremes of this array.

      [-1, 3, 0].extremes()
      # => {min: -1, max: 3}

  @name extremes
  @methodOf Array#
  @param {Function} [fn] An optional funtion used to evaluate each element to calculate its value for determining extremes.
  @returns {Object} {min: minElement, max: maxElement}
  */


  Array.prototype.extremes = function(fn) {
    var max, maxResult, min, minResult;
    fn || (fn = function(n) {
      return n;
    });
    min = max = void 0;
    minResult = maxResult = void 0;
    this.each(function(object) {
      var result;
      result = fn(object);
      if (min != null) {
        if (result < minResult) {
          min = object;
          minResult = result;
        }
      } else {
        min = object;
        minResult = result;
      }
      if (max != null) {
        if (result > maxResult) {
          max = object;
          return maxResult = result;
        }
      } else {
        max = object;
        return maxResult = result;
      }
    });
    return {
      min: min,
      max: max
    };
  };

  /**
  Pretend the array is a circle and grab a new array containing length elements.
  If length is not given return the element at start, again assuming the array
  is a circle.

      [1, 2, 3].wrap(-1)
      # => 3

      [1, 2, 3].wrap(6)
      # => 1

      ["l", "o", "o", "p"].wrap(0, 16)
      # => ["l", "o", "o", "p", "l", "o", "o", "p", "l", "o", "o", "p", "l", "o", "o", "p"]

  @name wrap
  @methodOf Array#
  @param {Number} start The index to start wrapping at, or the index of the sole element to return if no length is given.
  @param {Number} [length] Optional length determines how long result array should be.
  @returns {Object} or {Array} The element at start mod array.length, or an array of length elements, starting from start and wrapping.
  */


  Array.prototype.wrap = function(start, length) {
    var end, i, result;
    if (length != null) {
      end = start + length;
      i = start;
      result = [];
      while (i++ < end) {
        result.push(this[i.mod(this.length)]);
      }
      return result;
    } else {
      return this[start.mod(this.length)];
    }
  };

  /**
  Partitions the elements into two groups: those for which the iterator returns
  true, and those for which it returns false.

      [evens, odds] = [1, 2, 3, 4].partition (n) ->
        n.even()

      evens
      # => [2, 4]

      odds
      # => [1, 3]

  @name partition
  @methodOf Array#
  @param {Function} iterator
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} An array in the form of [trueCollection, falseCollection]
  */


  Array.prototype.partition = function(iterator, context) {
    var falseCollection, trueCollection;
    trueCollection = [];
    falseCollection = [];
    this.each(function(element) {
      if (iterator.call(context, element)) {
        return trueCollection.push(element);
      } else {
        return falseCollection.push(element);
      }
    });
    return [trueCollection, falseCollection];
  };

  /**
  Return the group of elements for which the return value of the iterator is true.

  @name select
  @methodOf Array#
  @param {Function} iterator The iterator receives each element in turn as the first agument.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} An array containing the elements for which the iterator returned true.
  */


  Array.prototype.select = function(iterator, context) {
    return this.partition(iterator, context)[0];
  };

  /**
  Return the group of elements that are not in the passed in set.

      [1, 2, 3, 4].without ([2, 3])
      # => [1, 4]

  @name without
  @methodOf Array#
  @param {Array} values List of elements to exclude.
  @returns {Array} An array containing the elements that are not passed in.
  */


  Array.prototype.without = function(values) {
    return this.reject(function(element) {
      return values.include(element);
    });
  };

  /**
  Return the group of elements for which the return value of the iterator is false.

  @name reject
  @methodOf Array#
  @param {Function} iterator The iterator receives each element in turn as the first agument.
  @param {Object} [context] Optional context parameter to be used as `this` when calling the iterator function.
  @returns {Array} An array containing the elements for which the iterator returned false.
  */


  Array.prototype.reject = function(iterator, context) {
    return this.partition(iterator, context)[1];
  };

  /**
  Combines all elements of the array by applying a binary operation.
  for each element in the arra the iterator is passed an accumulator
  value (memo) and the element.

  @name inject
  @methodOf Array#
  @returns {Object} The result of a
  */


  Array.prototype.inject = function(initial, iterator) {
    this.each(function(element) {
      return initial = iterator(initial, element);
    });
    return initial;
  };

  /**
  Add all the elements in the array.

      [1, 2, 3, 4].sum()
      # => 10

  @name sum
  @methodOf Array#
  @returns {Number} The sum of the elements in the array.
  */


  Array.prototype.sum = function() {
    return this.inject(0, function(sum, n) {
      return sum + n;
    });
  };

  /**
  Multiply all the elements in the array.

      [1, 2, 3, 4].product()
      # => 24

  @name product
  @methodOf Array#
  @returns {Number} The product of the elements in the array.
  */


  Array.prototype.product = function() {
    return this.inject(1, function(product, n) {
      return product * n;
    });
  };

  /**
  Merges together the values of each of the arrays with the values at the corresponding position.

      ['a', 'b', 'c'].zip([1, 2, 3])
      # => [['a', 1], ['b', 2], ['c', 3]]

  @name zip
  @methodOf Array#
  @returns {Array} Array groupings whose values are arranged by their positions in the original input arrays.
  */


  Array.prototype.zip = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.map(function(element, index) {
      var output;
      output = args.map(function(arr) {
        return arr[index];
      });
      output.unshift(element);
      return output;
    });
  };

}).call(this);

/**
Bindable module.

    player = Core
      x: 5
      y: 10

    player.bind "update", ->
      updatePlayer()
    # => Uncaught TypeError: Object has no method 'bind'

    player.include(Bindable)

    player.bind "update", ->
      updatePlayer()
    # => this will call updatePlayer each time through the main loop

@name Bindable
@module
@constructor
*/


(function() {
  var Bindable,
    __slice = [].slice;

  Bindable = function(I, self) {
    var eventCallbacks;
    if (I == null) {
      I = {};
    }
    eventCallbacks = {};
    return {
      bind: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return self.on.apply(self, args);
      },
      unbind: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return self.off.apply(self, args);
      },
      /**
      Adds a function as an event listener.

          # this will call coolEventHandler after
          # yourObject.trigger "someCustomEvent" is called.
          yourObject.on "someCustomEvent", coolEventHandler

          #or
          yourObject.on "anotherCustomEvent", ->
            doSomething()

      @name on
      @methodOf Bindable#
      @param {String} event The event to listen to.
      @param {Function} callback The function to be called when the specified event
      is triggered.
      */

      on: function(namespacedEvent, callback) {
        var event, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (namespace) {
          callback.__PIXIE || (callback.__PIXIE = {});
          callback.__PIXIE[namespace] = true;
        }
        eventCallbacks[event] || (eventCallbacks[event] = []);
        eventCallbacks[event].push(callback);
        return this;
      },
      /**
      Removes a specific event listener, or all event listeners if
      no specific listener is given.

          #  removes the handler coolEventHandler from the event
          # "someCustomEvent" while leaving the other events intact.
          yourObject.off "someCustomEvent", coolEventHandler

          # removes all handlers attached to "anotherCustomEvent"
          yourObject.off "anotherCustomEvent"

      @name off
      @methodOf Bindable#
      @param {String} event The event to remove the listener from.
      @param {Function} [callback] The listener to remove.
      */

      off: function(namespacedEvent, callback) {
        var callbacks, event, key, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (event) {
          eventCallbacks[event] || (eventCallbacks[event] = []);
          if (namespace) {
            eventCallbacks[event] = eventCallbacks.select(function(callback) {
              var _ref1;
              return !(((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) != null);
            });
          } else {
            if (callback) {
              eventCallbacks[event].remove(callback);
            } else {
              eventCallbacks[event] = [];
            }
          }
        } else if (namespace) {
          for (key in eventCallbacks) {
            callbacks = eventCallbacks[key];
            eventCallbacks[key] = callbacks.select(function(callback) {
              var _ref1;
              return !(((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) != null);
            });
          }
        }
        return this;
      },
      /**
      Calls all listeners attached to the specified event.

          # calls each event handler bound to "someCustomEvent"
          yourObject.trigger "someCustomEvent"

      @name trigger
      @methodOf Bindable#
      @param {String} event The event to trigger.
      @param {Array} [parameters] Additional parameters to pass to the event listener.
      */

      trigger: function() {
        var callbacks, event, parameters;
        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        callbacks = eventCallbacks[event];
        if (callbacks && callbacks.length) {
          self = this;
          return callbacks.each(function(callback) {
            return callback.apply(self, parameters);
          });
        }
      }
    };
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this)["Bindable"] = Bindable;

}).call(this);
(function() {
  var CommandStack;

  CommandStack = function() {
    var index, stack;
    stack = [];
    index = 0;
    return {
      execute: function(command) {
        stack[index] = command;
        command.execute();
        return stack.length = index += 1;
      },
      undo: function() {
        var command;
        if (this.canUndo()) {
          index -= 1;
          command = stack[index];
          command.undo();
          return command;
        }
      },
      redo: function() {
        var command;
        if (this.canRedo()) {
          command = stack[index];
          command.execute();
          index += 1;
          return command;
        }
      },
      current: function() {
        return stack[index - 1];
      },
      canUndo: function() {
        return index > 0;
      },
      canRedo: function() {
        return stack[index] != null;
      }
    };
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this)["CommandStack"] = CommandStack;

}).call(this);

/**
The Core class is used to add extended functionality to objects without
extending the object class directly. Inherit from Core to gain its utility
methods.

@name Core
@constructor

@param {Object} I Instance variables
*/


(function() {
  var __slice = [].slice;

  (function() {
    var root;
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    return root.Core = function(I) {
      var Module, moduleName, self, _i, _len, _ref;
      if (I == null) {
        I = {};
      }
      Object.reverseMerge(I, {
        includedModules: []
      });
      self = {
        /**
        External access to instance variables. Use of this property should be avoided
        in general, but can come in handy from time to time.

            I =
              r: 255
              g: 0
              b: 100

            myObject = Core(I)

            # a bad idea most of the time, but it's
            # pretty convenient to have available.
            myObject.I.r
            # => 255

            myObject.I.g
            # => 0

            myObject.I.b
            # => 100

        @name I
        @fieldOf Core#
        */

        I: I,
        /**
        Generates a public jQuery style getter / setter method for each
        String argument.

            myObject = Core
              r: 255
              g: 0
              b: 100

            myObject.attrAccessor "r", "g", "b"

            myObject.r(254)
            myObject.r()

            => 254

        @name attrAccessor
        @methodOf Core#
        */

        attrAccessor: function() {
          var attrNames;
          attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return attrNames.each(function(attrName) {
            return self[attrName] = function(newValue) {
              if (newValue != null) {
                I[attrName] = newValue;
                return self;
              } else {
                return I[attrName];
              }
            };
          });
        },
        /**
        Generates a public jQuery style getter method for each String argument.

            myObject = Core
              r: 255
              g: 0
              b: 100

            myObject.attrReader "r", "g", "b"

            myObject.r()
            => 255

            myObject.g()
            => 0

            myObject.b()
            => 100

        @name attrReader
        @methodOf Core#
        */

        attrReader: function() {
          var attrNames;
          attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return attrNames.each(function(attrName) {
            return self[attrName] = function() {
              return I[attrName];
            };
          });
        },
        /**
        Extends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)

            I =
              x: 30
              y: 40
              maxSpeed: 5

            # we are using extend to give player
            # additional methods that Core doesn't have
            player = Core(I).extend
              increaseSpeed: ->
                I.maxSpeed += 1

            player.I.maxSpeed
            => 5

            player.increaseSpeed()

            player.I.maxSpeed
            => 6

        @name extend
        @methodOf Core#
        @see Object.extend
        @returns self
        */

        extend: function(options) {
          Object.extend(self, options);
          return self;
        },
        /**
        Includes a module in this object.

            myObject = Core()
            myObject.include(Bindable)

            # now you can bind handlers to functions
            myObject.bind "someEvent", ->
              alert("wow. that was easy.")

        @name include
        @methodOf Core#
        @param {String} Module the module to include. A module is a constructor that takes two parameters, I and self, and returns an object containing the public methods to extend the including object with.
        */

        include: function() {
          var Module, key, moduleName, modules, value, _i, _len;
          modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          for (_i = 0, _len = modules.length; _i < _len; _i++) {
            Module = modules[_i];
            if (typeof Module.isString === "function" ? Module.isString() : void 0) {
              moduleName = Module;
              Module = Module.constantize();
            } else if (moduleName = Module._name) {

            } else {
              for (key in root) {
                value = root[key];
                if (value === Module) {
                  Module._name = moduleName = key;
                }
              }
            }
            if (moduleName) {
              if (!I.includedModules.include(moduleName)) {
                I.includedModules.push(moduleName);
                self.extend(Module(I, self));
              }
            } else {
              warn("Unable to discover name for module: ", Module, "\nSerialization issues may occur.");
              self.extend(Module(I, self));
            }
          }
          return self;
        },
        send: function() {
          var args, name;
          name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return self[name].apply(self, args);
        }
      };
      self.include("Bindable");
      _ref = I.includedModules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        moduleName = _ref[_i];
        Module = moduleName.constantize();
        self.extend(Module(I, self));
      }
      return self;
    };
  })();

}).call(this);
(function() {
  var __slice = [].slice;

  Function.prototype.once = function() {
    var func, memo, ran;
    func = this;
    ran = false;
    memo = void 0;
    return function() {
      if (ran) {
        return memo;
      }
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  /**
  Calling a debounced function will postpone its execution until after
  wait milliseconds have elapsed since the last time the function was
  invoked. Useful for implementing behavior that should only happen after
  the input has stopped arriving. For example: rendering a preview of a
  Markdown comment, recalculating a layout after the window has stopped
  being resized...

      lazyLayout = calculateLayout.debounce(300)
      $(window).resize(lazyLayout)

  @name debounce
  @methodOf Function#
  @returns {Function} The debounced version of this function.
  */


  Function.prototype.debounce = function(wait) {
    var func, timeout;
    timeout = null;
    func = this;
    return function() {
      var args, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        return func.apply(context, args);
      };
      clearTimeout(timeout);
      return timeout = setTimeout(later, wait);
    };
  };

  Function.prototype.returning = function(x) {
    var func;
    func = this;
    return function() {
      func.apply(this, arguments);
      return x;
    };
  };

  Function.prototype.delay = function() {
    var args, func, wait;
    wait = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    func = this;
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };

  Function.prototype.defer = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.delay.apply(this, [1].concat(args));
  };

}).call(this);

/**
@name Logging
@namespace

Gives you some convenience methods for outputting data while developing.

      log "Testing123"
      info "Hey, this is happening"
      warn "Be careful, this might be a problem"
      error "Kaboom!"
*/


(function() {
  var __slice = [].slice;

  ["log", "info", "warn", "error"].each(function(name) {
    if (typeof console !== "undefined") {
      return (typeof exports !== "undefined" && exports !== null ? exports : this)[name] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (console[name]) {
          return console[name].apply(console, args);
        }
      };
    } else {
      return (typeof exports !== "undefined" && exports !== null ? exports : this)[name] = function() {};
    }
  });

}).call(this);

/**
* Matrix.js v1.3.0pre
*
* Copyright (c) 2010 STRd6
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* Loosely based on flash:
* http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/flash/geom/Matrix.html
*/


(function() {

  (function() {
    /**
    <pre>
       _        _
      | a  c tx  |
      | b  d ty  |
      |_0  0  1 _|
    </pre>
    Creates a matrix for 2d affine transformations.

    concat, inverse, rotate, scale and translate return new matrices with the
    transformations applied. The matrix is not modified in place.

    Returns the identity matrix when called with no arguments.

    @name Matrix
    @param {Number} [a]
    @param {Number} [b]
    @param {Number} [c]
    @param {Number} [d]
    @param {Number} [tx]
    @param {Number} [ty]
    @constructor
    */

    var Matrix;
    Matrix = function(a, b, c, d, tx, ty) {
      var _ref;
      if (Object.isObject(a)) {
        _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;
      }
      return {
        __proto__: Matrix.prototype,
        /**
        @name a
        @fieldOf Matrix#
        */

        a: a != null ? a : 1,
        /**
        @name b
        @fieldOf Matrix#
        */

        b: b || 0,
        /**
        @name c
        @fieldOf Matrix#
        */

        c: c || 0,
        /**
        @name d
        @fieldOf Matrix#
        */

        d: d != null ? d : 1,
        /**
        @name tx
        @fieldOf Matrix#
        */

        tx: tx || 0,
        /**
        @name ty
        @fieldOf Matrix#
        */

        ty: ty || 0
      };
    };
    Matrix.prototype = {
      /**
      Returns the result of this matrix multiplied by another matrix
      combining the geometric effects of the two. In mathematical terms,
      concatenating two matrixes is the same as combining them using matrix multiplication.
      If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
      http://mathworld.wolfram.com/MatrixMultiplication.html
      @name concat
      @methodOf Matrix#
      @param {Matrix} matrix The matrix to multiply this matrix by.
      @returns {Matrix} The result of the matrix multiplication, a new matrix.
      */

      concat: function(matrix) {
        return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);
      },
      /**
      Copy this matrix.
      @name copy
      @methodOf Matrix#
      @returns {Matrix} A copy of this matrix.
      */

      copy: function() {
        return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
      },
      /**
      Given a point in the pretransform coordinate space, returns the coordinates of
      that point after the transformation occurs. Unlike the standard transformation
      applied using the transformPoint() method, the deltaTransformPoint() method
      does not consider the translation parameters tx and ty.
      @name deltaTransformPoint
      @methodOf Matrix#
      @see #transformPoint
      @return {Point} A new point transformed by this matrix ignoring tx and ty.
      */

      deltaTransformPoint: function(point) {
        return Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);
      },
      /**
      Returns the inverse of the matrix.
      http://mathworld.wolfram.com/MatrixInverse.html
      @name inverse
      @methodOf Matrix#
      @returns {Matrix} A new matrix that is the inverse of this matrix.
      */

      inverse: function() {
        var determinant;
        determinant = this.a * this.d - this.b * this.c;
        return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);
      },
      /**
      Returns a new matrix that corresponds this matrix multiplied by a
      a rotation matrix.
      @name rotate
      @methodOf Matrix#
      @see Matrix.rotation
      @param {Number} theta Amount to rotate in radians.
      @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
      @returns {Matrix} A new matrix, rotated by the specified amount.
      */

      rotate: function(theta, aboutPoint) {
        return this.concat(Matrix.rotation(theta, aboutPoint));
      },
      /**
      Returns a new matrix that corresponds this matrix multiplied by a
      a scaling matrix.
      @name scale
      @methodOf Matrix#
      @see Matrix.scale
      @param {Number} sx
      @param {Number} [sy]
      @param {Point} [aboutPoint] The point that remains fixed during the scaling
      @returns {Matrix} A new Matrix. The original multiplied by a scaling matrix.
      */

      scale: function(sx, sy, aboutPoint) {
        return this.concat(Matrix.scale(sx, sy, aboutPoint));
      },
      /**
      Returns a new matrix that corresponds this matrix multiplied by a
      a skewing matrix.

      @name skew
      @methodOf Matrix#
      @see Matrix.skew
      @param {Number} skewX The angle of skew in the x dimension.
      @param {Number} skewY The angle of skew in the y dimension.
      */

      skew: function(skewX, skewY) {
        return this.concat(Matrix.skew(skewX, skewY));
      },
      /**
      Returns a string representation of this matrix.

      @name toString
      @methodOf Matrix#
      @returns {String} A string reperesentation of this matrix.
      */

      toString: function() {
        return "Matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
      },
      /**
      Returns the result of applying the geometric transformation represented by the
      Matrix object to the specified point.
      @name transformPoint
      @methodOf Matrix#
      @see #deltaTransformPoint
      @returns {Point} A new point with the transformation applied.
      */

      transformPoint: function(point) {
        return Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);
      },
      /**
      Translates the matrix along the x and y axes, as specified by the tx and ty parameters.
      @name translate
      @methodOf Matrix#
      @see Matrix.translation
      @param {Number} tx The translation along the x axis.
      @param {Number} ty The translation along the y axis.
      @returns {Matrix} A new matrix with the translation applied.
      */

      translate: function(tx, ty) {
        return this.concat(Matrix.translation(tx, ty));
      }
    };
    /**
    Creates a matrix transformation that corresponds to the given rotation,
    around (0,0) or the specified point.
    @see Matrix#rotate
    @param {Number} theta Rotation in radians.
    @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
    @returns {Matrix} A new matrix rotated by the given amount.
    */

    Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {
      var rotationMatrix;
      rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));
      if (aboutPoint != null) {
        rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
      }
      return rotationMatrix;
    };
    /**
    Returns a matrix that corresponds to scaling by factors of sx, sy along
    the x and y axis respectively.
    If only one parameter is given the matrix is scaled uniformly along both axis.
    If the optional aboutPoint parameter is given the scaling takes place
    about the given point.
    @see Matrix#scale
    @param {Number} sx The amount to scale by along the x axis or uniformly if no sy is given.
    @param {Number} [sy] The amount to scale by along the y axis.
    @param {Point} [aboutPoint] The point about which the scaling occurs. Defaults to (0,0).
    @returns {Matrix} A matrix transformation representing scaling by sx and sy.
    */

    Matrix.scale = function(sx, sy, aboutPoint) {
      var scaleMatrix;
      sy = sy || sx;
      scaleMatrix = Matrix(sx, 0, 0, sy);
      if (aboutPoint) {
        scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
      }
      return scaleMatrix;
    };
    /**
    Returns a matrix that corresponds to a skew of skewX, skewY.

    @see Matrix#skew
    @param {Number} skewX The angle of skew in the x dimension.
    @param {Number} skewY The angle of skew in the y dimension.
    @return {Matrix} A matrix transformation representing a skew by skewX and skewY.
    */

    Matrix.skew = function(skewX, skewY) {
      return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);
    };
    /**
    Returns a matrix that corresponds to a translation of tx, ty.
    @see Matrix#translate
    @param {Number} tx The amount to translate in the x direction.
    @param {Number} ty The amount to translate in the y direction.
    @return {Matrix} A matrix transformation representing a translation by tx and ty.
    */

    Matrix.translate = Matrix.translation = function(tx, ty) {
      return Matrix(1, 0, 0, 1, tx, ty);
    };
    /**
    A constant representing the identity matrix.
    @name IDENTITY
    @fieldOf Matrix
    */

    Matrix.IDENTITY = Matrix();
    /**
    A constant representing the horizontal flip transformation matrix.
    @name HORIZONTAL_FLIP
    @fieldOf Matrix
    */

    Matrix.HORIZONTAL_FLIP = Matrix(-1, 0, 0, 1);
    /**
    A constant representing the vertical flip transformation matrix.
    @name VERTICAL_FLIP
    @fieldOf Matrix
    */

    Matrix.VERTICAL_FLIP = Matrix(1, 0, 0, -1);
    if (Object.freeze) {
      Object.freeze(Matrix.IDENTITY);
      Object.freeze(Matrix.HORIZONTAL_FLIP);
      Object.freeze(Matrix.VERTICAL_FLIP);
    }
    return (typeof exports !== "undefined" && exports !== null ? exports : this)["Matrix"] = Matrix;
  })();

}).call(this);

/**
Returns the absolute value of this number.

    (-4).abs()
    # => 4

@name abs
@methodOf Number#
@returns {Number} The absolute value of the number.
*/


(function() {

  Number.prototype.abs = function() {
    return Math.abs(this);
  };

  /**
  Returns the mathematical ceiling of this number.

      4.9.ceil()
      # => 5

      4.2.ceil()
      # => 5

      (-1.2).ceil()
      # => -1

  @name ceil
  @methodOf Number#
  @returns {Number} The number truncated to the nearest integer of greater than or equal value.
  */


  Number.prototype.ceil = function() {
    return Math.ceil(this);
  };

  /**
  Returns the mathematical floor of this number.

      4.9.floor()
      # => 4

      4.2.floor()
      # => 4

      (-1.2).floor()
      # => -2

  @name floor
  @methodOf Number#
  @returns {Number} The number truncated to the nearest integer of less than or equal value.
  */


  Number.prototype.floor = function() {
    return Math.floor(this);
  };

  /**
  Returns this number rounded to the nearest integer.

      4.5.round()
      # => 5

      4.4.round()
      # => 4

  @name round
  @methodOf Number#
  @returns {Number} The number rounded to the nearest integer.
  */


  Number.prototype.round = function() {
    return Math.round(this);
  };

  /**
  Get a bunch of points equally spaced around the unit circle.

      4.circularPoints (p) ->

      # p gets Point(1, 0), Point(0, 1), Point(-1, 0), Point(0, -1)

  @name circularPoint
  @methodOf Number#
  */


  Number.prototype.circularPoints = function(block) {
    var n;
    n = this;
    return n.times(function(i) {
      return block(Point.fromAngle((i / n).turns), i);
    });
  };

  /**
  Returns a number whose value is limited to the given range.

      # limit the output of this computation to between 0 and 255
      (2 * 255).clamp(0, 255)
      # => 255

  @name clamp
  @methodOf Number#
  @param {Number} min The lower boundary of the output range
  @param {Number} max The upper boundary of the output range
  @returns {Number} A number in the range [min, max]
  */


  Number.prototype.clamp = function(min, max) {
    if ((min != null) && (max != null)) {
      return Math.min(Math.max(this, min), max);
    } else if (min != null) {
      return Math.max(this, min);
    } else if (max != null) {
      return Math.min(this, max);
    } else {
      return this;
    }
  };

  /**
  A mod method useful for array wrapping. The range of the function is
  constrained to remain in bounds of array indices.

      (-1).mod(5)
      # => 4

  @name mod
  @methodOf Number#
  @param {Number} base
  @returns {Number} An integer between 0 and (base - 1) if base is positive.
  */


  Number.prototype.mod = function(base) {
    var result;
    result = this % base;
    if (result < 0 && base > 0) {
      result += base;
    }
    return result;
  };

  /**
  Get the sign of this number as an integer (1, -1, or 0).

      (-5).sign()
      # => -1

      0.sign()
      # => 0

      5.sign()
      # => 1

  @name sign
  @methodOf Number#
  @returns {Number} The sign of this number, 0 if the number is 0.
  */


  Number.prototype.sign = function() {
    if (this > 0) {
      return 1;
    } else if (this < 0) {
      return -1;
    } else {
      return 0;
    }
  };

  /**
  Returns true if this number is even (evenly divisible by 2).

      2.even()
      # => true

      3.even()
      # => false

      0.even()
      # => true

  @name even
  @methodOf Number#
  @returns {Boolean} true if this number is an even integer, false otherwise.
  */


  Number.prototype.even = function() {
    return this % 2 === 0;
  };

  /**
  Returns true if this number is odd (has remainder of 1 when divided by 2).

      2.odd()
      # => false

      3.odd()
      # => true

      0.odd()
      # => false

  @name odd
  @methodOf Number#
  @returns {Boolean} true if this number is an odd integer, false otherwise.
  */


  Number.prototype.odd = function() {
    if (this > 0) {
      return this % 2 === 1;
    } else {
      return this % 2 === -1;
    }
  };

  /**
  Calls iterator the specified number of times, passing in the number of the
  current iteration as a parameter: 0 on first call, 1 on the second call, etc.

      output = []

      5.times (n) ->
        output.push(n)

      output
      # => [0, 1, 2, 3, 4]

  @name times
  @methodOf Number#
  @param {Function} iterator The iterator takes a single parameter, the number of the current iteration.
  @param {Object} [context] The optional context parameter specifies an object to treat as <code>this</code> in the iterator block.
  @returns {Number} The number of times the iterator was called.
  */


  Number.prototype.times = function(iterator, context) {
    var i;
    i = -1;
    while (++i < this) {
      iterator.call(context, i);
    }
    return i;
  };

  /**
  Returns the the nearest grid resolution less than or equal to the number.

      7.snap(8)
      # => 0

      4.snap(8)
      # => 0

      12.snap(8)
      # => 8

  @name snap
  @methodOf Number#
  @param {Number} resolution The grid resolution to snap to.
  @returns {Number} The nearest multiple of resolution lower than the number.
  */


  Number.prototype.snap = function(resolution) {
    var n;
    n = this / resolution;
    1 / 1;
    return n.floor() * resolution;
  };

  /**
  In number theory, integer factorization or prime factorization is the
  breaking down of a composite number into smaller non-trivial divisors,
  which when multiplied together equal the original integer.

  Floors the number for purposes of factorization.

      60.primeFactors()
      # => [2, 2, 3, 5]

      37.primeFactors()
      # => [37]

  @name primeFactors
  @methodOf Number#
  @returns {Array} An array containing the factorization of this number.
  */


  Number.prototype.primeFactors = function() {
    var factors, i, iSquared, n;
    factors = [];
    n = Math.floor(this);
    if (n === 0) {
      return void 0;
    }
    if (n < 0) {
      factors.push(-1);
      n /= -1;
    }
    i = 2;
    iSquared = i * i;
    while (iSquared < n) {
      while ((n % i) === 0) {
        factors.push(i);
        n /= i;
      }
      i += 1;
      iSquared = i * i;
    }
    if (n !== 1) {
      factors.push(n);
    }
    return factors;
  };

  /**
  Returns the two character hexidecimal
  representation of numbers 0 through 255.

      255.toColorPart()
      # => "ff"

      0.toColorPart()
      # => "00"

      200.toColorPart()
      # => "c8"

  @name toColorPart
  @methodOf Number#
  @returns {String} Hexidecimal representation of the number
  */


  Number.prototype.toColorPart = function() {
    var s;
    s = parseInt(this.clamp(0, 255), 10).toString(16);
    if (s.length === 1) {
      s = '0' + s;
    }
    return s;
  };

  /**
  Returns a number that is maxDelta closer to target.

      255.approach(0, 5)
      # => 250

      5.approach(0, 10)
      # => 0

  @name approach
  @methodOf Number#
  @returns {Number} A number maxDelta toward target
  */


  Number.prototype.approach = function(target, maxDelta) {
    return (target - this).clamp(-maxDelta, maxDelta) + this;
  };

  /**
  Returns a number that is closer to the target by the ratio.

      255.approachByRatio(0, 0.1)
      # => 229.5

  @name approachByRatio
  @methodOf Number#
  @returns {Number} A number toward target by the ratio
  */


  Number.prototype.approachByRatio = function(target, ratio) {
    return this.approach(target, this * ratio);
  };

  /**
  Returns a number that is closer to the target angle by the delta.

      Math.PI.approachRotation(0, Math.PI/4)
      # => 2.356194490192345 # this is (3/4) * Math.PI, which is (1/4) * Math.PI closer to 0 from Math.PI

  @name approachRotation
  @methodOf Number#
  @returns {Number} A number toward the target angle by maxDelta
  */


  Number.prototype.approachRotation = function(target, maxDelta) {
    while (target > this + Math.PI) {
      target -= Math.TAU;
    }
    while (target < this - Math.PI) {
      target += Math.TAU;
    }
    return (target - this).clamp(-maxDelta, maxDelta) + this;
  };

  /**
  Constrains a rotation to between -PI and PI.

      (9/4 * Math.PI).constrainRotation()
      # => 0.7853981633974483 # this is (1/4) * Math.PI

  @name constrainRotation
  @methodOf Number#
  @returns {Number} This number constrained between -PI and PI.
  */


  Number.prototype.constrainRotation = function() {
    var target;
    target = this;
    while (target > Math.PI) {
      target -= Math.TAU;
    }
    while (target < -Math.PI) {
      target += Math.TAU;
    }
    return target;
  };

  /**
  The mathematical d operator. Useful for simulating dice rolls.

  @name d
  @methodOf Number#
  @returns {Number} The sum of rolling <code>this</code> many <code>sides</code>-sided dice
  */


  Number.prototype.d = function(sides) {
    var sum;
    sum = 0;
    this.times(function() {
      return sum += rand(sides) + 1;
    });
    return sum;
  };

  /**
  Utility method to convert a number to a duration of seconds.

      3.seconds
      # => 3000

      setTimout doSometing, 3.seconds

  @name seconds
  @propertyOf Number#
  @returns {Number} This number as a duration of seconds
  */


  if (!5..seconds) {
    Object.defineProperty(Number.prototype, 'seconds', {
      get: function() {
        return this * 1000;
      }
    });
  }

  if (!1..second) {
    Object.defineProperty(Number.prototype, 'second', {
      get: function() {
        return this * 1000;
      }
    });
  }

  /**
  Utility method to convert a number to an amount of rotations.

      0.5.rotations
      # => 3.141592653589793

      I.rotation = 0.25.rotations

  @name rotations
  @propertyOf Number#
  @returns {Number} This number as an amount of rotations
  */


  if (!5..rotations) {
    Object.defineProperty(Number.prototype, 'rotations', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..rotation) {
    Object.defineProperty(Number.prototype, 'rotation', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  /**
  Utility method to convert a number to an amount of rotations.

      0.5.turns
      # => 3.141592653589793

      I.rotation = 0.25.turns

      1.turn # => Math.TAU (aka 2 * Math.PI)

  @name turns
  @propertyOf Number#
  @returns {Number} This number as an amount of rotation.
  1 turn is one complete rotation.
  */


  if (!5..turns) {
    Object.defineProperty(Number.prototype, 'turns', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..turn) {
    Object.defineProperty(Number.prototype, 'turn', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  /**
  Utility method to convert a number to an amount of degrees.

      180.degrees
      # => 3.141592653589793

      I.rotation = 90.degrees

  @name degrees
  @propertyOf Number#
  @returns {Number} This number as an amount of degrees
  */


  if (!2..degrees) {
    Object.defineProperty(Number.prototype, 'degrees', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  if (!1..degree) {
    Object.defineProperty(Number.prototype, 'degree', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  /**
  The mathematical circle constant of 1 turn.

  @name TAU
  @fieldOf Math
  */


  Math.TAU = 2 * Math.PI;

}).call(this);
(function() {
  var __slice = [].slice;

  (function() {
    /**
    Create a new point with given x and y coordinates. If no arguments are given
    defaults to (0, 0).

        point = Point()

        p.x
        # => 0

        p.y
        # => 0

        point = Point(-2, 5)

        p.x
        # => -2

        p.y
        # => 5

    @name Point
    @param {Number} [x]
    @param {Number} [y]
    @constructor
    */

    var Point;
    Point = function(x, y) {
      var _ref;
      if (Object.isObject(x)) {
        _ref = x, x = _ref.x, y = _ref.y;
      }
      return {
        __proto__: Point.prototype,
        /**
        The x coordinate of this point.
        @name x
        @fieldOf Point#
        */

        x: x || 0,
        /**
        The y coordinate of this point.
        @name y
        @fieldOf Point#
        */

        y: y || 0
      };
    };
    Point.prototype = {
      /**
      Constrain the magnitude of a vector.

      @name clamp
      @methodOf Point#
      @param {Number} n Maximum value for magnitude.
      @returns {Point} A new point whose magnitude has been clamped to the given value.
      */

      clamp: function(n) {
        return this.copy().clamp$(n);
      },
      clamp$: function(n) {
        if (this.magnitude() > n) {
          return this.norm$(n);
        } else {
          return this;
        }
      },
      /**
      Creates a copy of this point.

      @name copy
      @methodOf Point#
      @returns {Point} A new point with the same x and y value as this point.

          point = Point(1, 1)
          pointCopy = point.copy()

          point.equal(pointCopy)
          # => true

          point == pointCopy
          # => false
      */

      copy: function() {
        return Point(this.x, this.y);
      },
      /**
      Adds a point to this one and returns the new point. You may
      also use a two argument call like <code>point.add(x, y)</code>
      to add x and y values without a second point object.

          point = Point(2, 3).add(Point(3, 4))

          point.x
          # => 5

          point.y
          # => 7

          anotherPoint = Point(2, 3).add(3, 4)

          anotherPoint.x
          # => 5

          anotherPoint.y
          # => 7

      @name add
      @methodOf Point#
      @param {Point} other The point to add this point to.
      @returns {Point} A new point, the sum of both.
      */

      add: function(first, second) {
        return this.copy().add$(first, second);
      },
      /**
      Adds a point to this one, returning a modified point. You may
      also use a two argument call like <code>point.add(x, y)</code>
      to add x and y values without a second point object.

          point = Point(2, 3)

          point.x
          # => 2

          point.y
          # => 3

          point.add$(Point(3, 4))

          point.x
          # => 5

          point.y
          # => 7

          anotherPoint = Point(2, 3)
          anotherPoint.add$(3, 4)

          anotherPoint.x
          # => 5

          anotherPoint.y
          # => 7

      @name add$
      @methodOf Point#
      @param {Point} other The point to add this point to.
      @returns {Point} The sum of both points.
      */

      add$: function(first, second) {
        if (second != null) {
          this.x += first;
          this.y += second;
        } else {
          this.x += first.x;
          this.y += first.y;
        }
        return this;
      },
      /**
      Subtracts a point to this one and returns the new point.

          point = Point(1, 2).subtract(Point(2, 0))

          point.x
          # => -1

          point.y
          # => 2

          anotherPoint = Point(1, 2).subtract(2, 0)

          anotherPoint.x
          # => -1

          anotherPoint.y
          # => 2

      @name subtract
      @methodOf Point#
      @param {Point} other The point to subtract from this point.
      @returns {Point} A new point, this - other.
      */

      subtract: function(first, second) {
        return this.copy().subtract$(first, second);
      },
      /**
      Subtracts a point to this one and returns the new point.

          point = Point(1, 2)

          point.x
          # => 1

          point.y
          # => 2

          point.subtract$(Point(2, 0))

          point.x
          # => -1

          point.y
          # => 2

          anotherPoint = Point(1, 2)
          anotherPoint.subtract$(2, 0)

          anotherPoint.x
          # => -1

          anotherPoint.y
          # => 2

      @name subtract$
      @methodOf Point#
      @param {Point} other The point to subtract from this point.
      @returns {Point} The difference of the two points.
      */

      subtract$: function(first, second) {
        if (second != null) {
          this.x -= first;
          this.y -= second;
        } else {
          this.x -= first.x;
          this.y -= first.y;
        }
        return this;
      },
      /**
      Scale this Point (Vector) by a constant amount.

          point = Point(5, 6).scale(2)

          point.x
          # => 10

          point.y
          # => 12

      @name scale
      @methodOf Point#
      @param {Number} scalar The amount to scale this point by.
      @returns {Point} A new point, this * scalar.
      */

      scale: function(scalar) {
        return this.copy().scale$(scalar);
      },
      /**
      Scale this Point (Vector) by a constant amount. Modifies the point in place.

          point = Point(5, 6)

          point.x
          # => 5

          point.y
          # => 6

          point.scale$(2)

          point.x
          # => 10

          point.y
          # => 12

      @name scale$
      @methodOf Point#
      @param {Number} scalar The amount to scale this point by.
      @returns {Point} this * scalar.
      */

      scale$: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      },
      /**
      The norm of a vector is the unit vector pointing in the same direction. This method
      treats the point as though it is a vector from the origin to (x, y).

          point = Point(2, 3).norm()

          point.x
          # => 0.5547001962252291

          point.y
          # => 0.8320502943378437

          anotherPoint = Point(2, 3).norm(2)

          anotherPoint.x
          # => 1.1094003924504583

          anotherPoint.y
          # => 1.6641005886756874

      @name norm
      @methodOf Point#
      @returns {Point} The unit vector pointing in the same direction as this vector.
      */

      norm: function(length) {
        if (length == null) {
          length = 1.0;
        }
        return this.copy().norm$(length);
      },
      /**
      The norm of a vector is the unit vector pointing in the same direction. This method
      treats the point as though it is a vector from the origin to (x, y). Modifies the point in place.

          point = Point(2, 3).norm$()

          point.x
          # => 0.5547001962252291

          point.y
          # => 0.8320502943378437

          anotherPoint = Point(2, 3).norm$(2)

          anotherPoint.x
          # => 1.1094003924504583

          anotherPoint.y
          # => 1.6641005886756874

      @name norm$
      @methodOf Point#
      @returns {Point} The unit vector pointing in the same direction as this vector.
      */

      norm$: function(length) {
        var m;
        if (length == null) {
          length = 1.0;
        }
        if (m = this.length()) {
          return this.scale$(length / m);
        } else {
          return this;
        }
      },
      /**
      Floor the x and y values, returning a new point.

          point = Point(3.4, 5.8).floor()

          point.x
          # => 3

          point.y
          # => 5

      @name floor
      @methodOf Point#
      @returns {Point} A new point, with x and y values each floored to the largest previous integer.
      */

      floor: function() {
        return this.copy().floor$();
      },
      /**
      Floor the x and y values, returning a modified point.

          point = Point(3.4, 5.8)
          point.floor$()

          point.x
          # => 3

          point.y
          # => 5

      @name floor$
      @methodOf Point#
      @returns {Point} A modified point, with x and y values each floored to the largest previous integer.
      */

      floor$: function() {
        this.x = this.x.floor();
        this.y = this.y.floor();
        return this;
      },
      /**
      Determine whether this point is equal to another point.

          pointA = Point(2, 3)
          pointB = Point(2, 3)
          pointC = Point(4, 5)

          pointA.equal(pointB)
          # => true

          pointA.equal(pointC)
          # => false

      @name equal
      @methodOf Point#
      @param {Point} other The point to check for equality.
      @returns {Boolean} true if the other point has the same x, y coordinates, false otherwise.
      */

      equal: function(other) {
        return this.x === other.x && this.y === other.y;
      },
      /**
      Computed the length of this point as though it were a vector from (0,0) to (x,y).

          point = Point(5, 7)

          point.length()
          # => 8.602325267042627

      @name length
      @methodOf Point#
      @returns {Number} The length of the vector from the origin to this point.
      */

      length: function() {
        return Math.sqrt(this.dot(this));
      },
      /**
      Calculate the magnitude of this Point (Vector).

          point = Point(5, 7)

          point.magnitude()
          # => 8.602325267042627

      @name magnitude
      @methodOf Point#
      @returns {Number} The magnitude of this point as if it were a vector from (0, 0) -> (x, y).
      */

      magnitude: function() {
        return this.length();
      },
      /**
      Returns the direction in radians of this point from the origin.

          point = Point(0, 1)

          point.direction()
          # => 1.5707963267948966 # Math.PI / 2

      @name direction
      @methodOf Point#
      @returns {Number} The direction in radians of this point from the origin
      */

      direction: function() {
        return Math.atan2(this.y, this.x);
      },
      /**
      Calculate the dot product of this point and another point (Vector).
      @name dot
      @methodOf Point#
      @param {Point} other The point to dot with this point.
      @returns {Number} The dot product of this point dot other as a scalar value.
      */

      dot: function(other) {
        return this.x * other.x + this.y * other.y;
      },
      /**
      Calculate the cross product of this point and another point (Vector).
      Usually cross products are thought of as only applying to three dimensional vectors,
      but z can be treated as zero. The result of this method is interpreted as the magnitude
      of the vector result of the cross product between [x1, y1, 0] x [x2, y2, 0]
      perpendicular to the xy plane.

      @name cross
      @methodOf Point#
      @param {Point} other The point to cross with this point.
      @returns {Number} The cross product of this point with the other point as scalar value.
      */

      cross: function(other) {
        return this.x * other.y - other.x * this.y;
      },
      /**
      Compute the Euclidean distance between this point and another point.

          pointA = Point(2, 3)
          pointB = Point(9, 2)

          pointA.distance(pointB)
          # => 7.0710678118654755 # Math.sqrt(50)

      @name distance
      @methodOf Point#
      @param {Point} other The point to compute the distance to.
      @returns {Number} The distance between this point and another point.
      */

      distance: function(other) {
        return Point.distance(this, other);
      },
      /**
      @name toString
      @methodOf Point#
      @returns {String} A string representation of this point.
      */

      toString: function() {
        return "Point(" + this.x + ", " + this.y + ")";
      }
    };
    /**
    Compute the Euclidean distance between two points.

        pointA = Point(2, 3)
        pointB = Point(9, 2)

        Point.distance(pointA, pointB)
        # => 7.0710678118654755 # Math.sqrt(50)

    @name distance
    @fieldOf Point
    @param {Point} p1
    @param {Point} p2
    @returns {Number} The Euclidean distance between two points.
    */

    Point.distance = function(p1, p2) {
      return Math.sqrt(Point.distanceSquared(p1, p2));
    };
    /**
        pointA = Point(2, 3)
        pointB = Point(9, 2)

        Point.distanceSquared(pointA, pointB)
        # => 50

    @name distanceSquared
    @fieldOf Point
    @param {Point} p1
    @param {Point} p2
    @returns {Number} The square of the Euclidean distance between two points.
    */

    Point.distanceSquared = function(p1, p2) {
      return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
    };
    /**
    @name interpolate
    @fieldOf Point

    @param {Point} p1
    @param {Point} p2
    @param {Number} t
    @returns {Point} A point along the path from p1 to p2
    */

    Point.interpolate = function(p1, p2, t) {
      return p2.subtract(p1).scale(t).add(p1);
    };
    /**
    Construct a point on the unit circle for the given angle.

        point = Point.fromAngle(Math.PI / 2)

        point.x
        # => 0

        point.y
        # => 1

    @name fromAngle
    @fieldOf Point
    @param {Number} angle The angle in radians
    @returns {Point} The point on the unit circle.
    */

    Point.fromAngle = function(angle) {
      return Point(Math.cos(angle), Math.sin(angle));
    };
    /**
    If you have two dudes, one standing at point p1, and the other
    standing at point p2, then this method will return the direction
    that the dude standing at p1 will need to face to look at p2.

        p1 = Point(0, 0)
        p2 = Point(7, 3)

        Point.direction(p1, p2)
        # => 0.40489178628508343

    @name direction
    @fieldOf Point
    @param {Point} p1 The starting point.
    @param {Point} p2 The ending point.
    @returns {Number} The direction from p1 to p2 in radians.
    */

    Point.direction = function(p1, p2) {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };
    /**
    The centroid of a set of points is their arithmetic mean.

    @name centroid
    @methodOf Point
    @param points... The points to find the centroid of.
    */

    Point.centroid = function() {
      var points;
      points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return points.inject(Point(0, 0), function(sumPoint, point) {
        return sumPoint.add(point);
      }).scale(1 / points.length);
    };
    /**
    Generate a random point on the unit circle.

    @returns {Point} A random point on the unit circle.
    */

    Point.random = function() {
      return Point.fromAngle(Random.angle());
    };
    /**
    @name ZERO
    @fieldOf Point
    @returns {Point} The point (0, 0)
    */

    Point.ZERO = Point(0, 0);
    /**
    @name LEFT
    @fieldOf Point
    @returns {Point} The point (-1, 0)
    */

    Point.LEFT = Point(-1, 0);
    /**
    @name RIGHT
    @fieldOf Point
    @returns {Point} The point (1, 0)
    */

    Point.RIGHT = Point(1, 0);
    /**
    @name UP
    @fieldOf Point
    @returns {Point} The point (0, -1)
    */

    Point.UP = Point(0, -1);
    /**
    @name DOWN
    @fieldOf Point
    @returns {Point} The point (0, 1)
    */

    Point.DOWN = Point(0, 1);
    if (Object.freeze) {
      Object.freeze(Point.ZERO);
      Object.freeze(Point.LEFT);
      Object.freeze(Point.RIGHT);
      Object.freeze(Point.UP);
      Object.freeze(Point.DOWN);
    }
    return (typeof exports !== "undefined" && exports !== null ? exports : this)["Point"] = Point;
  })();

}).call(this);
(function() {

  (function() {
    /**
    @name Random
    @namespace Some useful methods for generating random things.
    */
    (typeof exports !== "undefined" && exports !== null ? exports : this)["Random"] = {
      /**
      Returns a random angle, uniformly distributed, between 0 and 2pi.

      @name angle
      @methodOf Random
      @returns {Number} A random angle between 0 and 2pi
      */

      angle: function() {
        return rand() * Math.TAU;
      },
      /**
      Returns a random angle between the given angles.

      @name angleBetween
      @methodOf Random
      @returns {Number} A random angle between the angles given.
      */

      angleBetween: function(min, max) {
        return rand() * (max - min) + min;
      },
      /**
      Returns a random color.

      @name color
      @methodOf Random
      @returns {Color} A random color
      */

      color: function() {
        return Color.random();
      },
      /**
      Happens often.

      @name often
      @methodOf Random
      */

      often: function() {
        return rand(3);
      },
      /**
      Happens sometimes.

      @name sometimes
      @methodOf Random
      */

      sometimes: function() {
        return !rand(3);
      }
    };
    /**
    Returns random integers from [0, n) if n is given.
    Otherwise returns random float between 0 and 1.

    @name rand
    @methodOf window
    @param {Number} n
    @returns {Number} A random integer from 0 to n - 1 if n is given. If n is not given, a random float between 0 and 1.
    */

    (typeof exports !== "undefined" && exports !== null ? exports : this)["rand"] = function(n) {
      if (n) {
        return Math.floor(n * Math.random());
      } else {
        return Math.random();
      }
    };
    /**
    Returns random float from [-n / 2, n / 2] if n is given.
    Otherwise returns random float between -0.5 and 0.5.

    @name signedRand
    @methodOf window
    @param {Number} n
    @returns {Number} A random float from -n / 2 to n / 2 if n is given. If n is not given, a random float between -0.5 and 0.5.
    */

    return (typeof exports !== "undefined" && exports !== null ? exports : this)["signedRand"] = function(n) {
      if (n) {
        return (n * Math.random()) - (n / 2);
      } else {
        return Math.random() - 0.5;
      }
    };
  })();

}).call(this);
(function() {

  (function() {
    var Rectangle;
    Rectangle = function(_arg) {
      var height, width, x, y;
      x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height;
      return {
        __proto__: Rectangle.prototype,
        x: x || 0,
        y: y || 0,
        width: width || 0,
        height: height || 0
      };
    };
    Rectangle.prototype = {
      center: function() {
        return Point(this.x + this.width / 2, this.y + this.height / 2);
      },
      equal: function(other) {
        return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
      }
    };
    Rectangle.prototype.__defineGetter__('left', function() {
      return this.x;
    });
    Rectangle.prototype.__defineGetter__('right', function() {
      return this.x + this.width;
    });
    Rectangle.prototype.__defineGetter__('top', function() {
      return this.y;
    });
    Rectangle.prototype.__defineGetter__('bottom', function() {
      return this.y + this.height;
    });
    return (typeof exports !== "undefined" && exports !== null ? exports : this)["Rectangle"] = Rectangle;
  })();

}).call(this);

/**
Returns true if this string only contains whitespace characters.

    "".blank()
    # => true

    "hello".blank()
    # => false

    "   ".blank()
    # => true

@name blank
@methodOf String#
@returns {Boolean} Whether or not this string is blank.
*/


(function() {

  String.prototype.blank = function() {
    return /^\s*$/.test(this);
  };

  /**
  Returns a new string that is a camelCase version.

      "camel_case".camelize()
      "camel-case".camelize()
      "camel case".camelize()

      # => "camelCase"

  @name camelize
  @methodOf String#
  @returns {String} A new string. camelCase version of `this`.
  */


  String.prototype.camelize = function() {
    return this.trim().replace(/(\-|_|\s)+(.)?/g, function(match, separator, chr) {
      if (chr) {
        return chr.toUpperCase();
      } else {
        return '';
      }
    });
  };

  /**
  Returns a new string with the first letter capitalized and the rest lower cased.

      "capital".capitalize()
      "cAPITAL".capitalize()
      "cApItAl".capitalize()
      "CAPITAL".capitalize()

      # => "Capital"

  @name capitalize
  @methodOf String#
  @returns {String} A new string. Capitalized version of `this`
  */


  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  };

  /**
  Return the class or constant named in this string.


      "Constant".constantize()
      # => Constant
      # notice this isn't a string. Useful for calling methods on class with the same name as `this`.

  @name constantize
  @methodOf String#
  @returns {Object} The class or constant named in this string.
  */


  String.prototype.constantize = function() {
    var item, target, _i, _len, _ref;
    target = typeof exports !== "undefined" && exports !== null ? exports : window;
    _ref = this.split('.');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      target = target[item];
    }
    return target;
  };

  /**
  Get the file extension of a string.

      "README.md".extension() # => "md"
      "README".extension() # => ""

  @name extension
  @methodOf String#
  @returns {String} File extension
  */


  String.prototype.extension = function() {
    var extension, _ref;
    if (extension = (_ref = this.match(/\.([^\.]*)$/, '')) != null ? _ref.last() : void 0) {
      return extension;
    } else {
      return '';
    }
  };

  /**
  Returns a new string that is a more human readable version.

      "player_id".humanize()
      # => "Player"

      "player_ammo".humanize()
      # => "Player ammo"

  @name humanize
  @methodOf String#
  @returns {String} A new string. Replaces _id and _ with "" and capitalizes the word.
  */


  String.prototype.humanize = function() {
    return this.replace(/_id$/, "").replace(/_/g, " ").capitalize();
  };

  /**
  Returns true.

  @name isString
  @methodOf String#
  @returns {Boolean} true
  */


  String.prototype.isString = function() {
    return true;
  };

  /**
  Parse this string as though it is JSON and return the object it represents. If it
  is not valid JSON returns the string itself.

      # this is valid json, so an object is returned
      '{"a": 3}'.parse()
      # => {a: 3}

      # double quoting instead isn't valid JSON so a string is returned
      "{'a': 3}".parse()
      # => "{'a': 3}"


  @name parse
  @methodOf String#
  @returns {Object} Returns an object from the JSON this string contains. If it is not valid JSON returns the string itself.
  */


  String.prototype.parse = function() {
    try {
      return JSON.parse(this.toString());
    } catch (e) {
      return this.toString();
    }
  };

  /**
  Returns true if this string starts with the given string.

  @name startsWith
  @methodOf String#
  @param {String} str The string to check.

  @returns {Boolean} True if this string starts with the given string, false otherwise.
  */


  String.prototype.startsWith = function(str) {
    return this.lastIndexOf(str, 0) === 0;
  };

  /**
  Returns a new string in Title Case.

      "title-case".titleize()
      # => "Title Case"

      "title case".titleize()
      # => "Title Case"

  @name titleize
  @methodOf String#
  @returns {String} A new string. Title Cased.
  */


  String.prototype.titleize = function() {
    return this.split(/[- ]/).map(function(word) {
      return word.capitalize();
    }).join(' ');
  };

  /**
  Underscore a word, changing camelCased with under_scored.

      "UNDERScore".underscore()
      # => "under_score"

      "UNDER-SCORE".underscore()
      # => "under_score"

      "UnDEr-SCorE".underscore()
      # => "un_d_er_s_cor_e"

  @name underscore
  @methodOf String#
  @returns {String} A new string. Separated by _.
  */


  String.prototype.underscore = function() {
    return this.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  };

  /**
  Assumes the string is something like a file name and returns the
  contents of the string without the extension.

      "neat.png".witouthExtension()
      # => "neat"

  @name withoutExtension
  @methodOf String#
  @returns {String} A new string without the extension name.
  */


  String.prototype.withoutExtension = function() {
    return this.replace(/\.[^\.]*$/, '');
  };

  String.prototype.parseHex = function() {
    var alpha, hexString, i, rgb;
    hexString = this.replace(/#/, '');
    switch (hexString.length) {
      case 3:
      case 4:
        if (hexString.length === 4) {
          alpha = (parseInt(hexString.substr(3, 1), 16) * 0x11) / 255;
        } else {
          alpha = 1;
        }
        rgb = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 2; i = ++_i) {
            _results.push(parseInt(hexString.substr(i, 1), 16) * 0x11);
          }
          return _results;
        })();
        rgb.push(alpha);
        return rgb;
      case 6:
      case 8:
        if (hexString.length === 8) {
          alpha = parseInt(hexString.substr(6, 2), 16) / 255;
        } else {
          alpha = 1;
        }
        rgb = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i <= 2; i = ++_i) {
            _results.push(parseInt(hexString.substr(2 * i, 2), 16));
          }
          return _results;
        })();
        rgb.push(alpha);
        return rgb;
      default:
        return void 0;
    }
  };

}).call(this);

/**
Returns a string representing the specified Boolean object.

<code><em>bool</em>.toString()</code>

@name toString
@methodOf Boolean#
*/


/**
Returns the primitive value of a Boolean object.

<code><em>bool</em>.valueOf()</code>

@name valueOf
@methodOf Boolean#
*/


/**
Returns a string representing the Number object in exponential notation

<code><i>number</i>.toExponential( [<em>fractionDigits</em>] )</code>
@param  fractionDigits
An integer specifying the number of digits after the decimal point. Defaults
to as many digits as necessary to specify the number.
@name toExponential
@methodOf Number#
*/


/**
Formats a number using fixed-point notation

<code><i>number</i>.toFixed( [<em>digits</em>] )</code>
@param  digits   The number of digits to appear after the decimal point; this
may be a value between 0 and 20, inclusive, and implementations may optionally
support a larger range of values. If this argument is omitted, it is treated as
0.
@name toFixed
@methodOf Number#
*/


/**
number.toLocaleString();

@name toLocaleString
@methodOf Number#
*/


/**
Returns a string representing the Number object to the specified precision.

<code><em>number</em>.toPrecision( [ <em>precision</em> ] )</code>
@param precision An integer specifying the number of significant digits.
@name toPrecision
@methodOf Number#
*/


/**
Returns a string representing the specified Number object

<code><i>number</i>.toString( [<em>radix</em>] )</code>
@param  radix
An integer between 2 and 36 specifying the base to use for representing
numeric values.
@name toString
@methodOf Number#
*/


/**
Returns the primitive value of a Number object.

@name valueOf
@methodOf Number#
*/


/**
Returns the specified character from a string.

<code><em>string</em>.charAt(<em>index</em>)</code>
@param index  An integer between 0 and 1 less than the length of the string.
@name charAt
@methodOf String#
*/


/**
Returns the numeric Unicode value of the character at the given index (except
for unicode codepoints > 0x10000).


@param index  An integer greater than 0 and less than the length of the string;
if it is not a number, it defaults to 0.
@name charCodeAt
@methodOf String#
*/


/**
Combines the text of two or more strings and returns a new string.

<code><em>string</em>.concat(<em>string2</em>, <em>string3</em>[, ..., <em>stringN</em>])</code>
@param string2...stringN  Strings to concatenate to this string.
@name concat
@methodOf String#
*/


/**
Returns the index within the calling String object of the first occurrence of
the specified value, starting the search at fromIndex,
returns -1 if the value is not found.

<code><em>string</em>.indexOf(<em>searchValue</em>[, <em>fromIndex</em>]</code>
@param searchValue  A string representing the value to search for.
@param fromIndex  The location within the calling string to start the search
from. It can be any integer between 0 and the length of the string. The default
value is 0.
@name indexOf
@methodOf String#
*/


/**
Returns the index within the calling String object of the last occurrence of the
specified value, or -1 if not found. The calling string is searched backward,
starting at fromIndex.

<code><em>string</em>.lastIndexOf(<em>searchValue</em>[, <em>fromIndex</em>])</code>
@param searchValue  A string representing the value to search for.
@param fromIndex  The location within the calling string to start the search
from, indexed from left to right. It can be any integer between 0 and the length
of the string. The default value is the length of the string.
@name lastIndexOf
@methodOf String#
*/


/**
Returns a number indicating whether a reference string comes before or after or
is the same as the given string in sort order.

<code> localeCompare(compareString) </code>

@name localeCompare
@methodOf String#
*/


/**
Used to retrieve the matches when matching a string against a regular
expression.

<code><em>string</em>.match(<em>regexp</em>)</code>
@param regexp A regular expression object. If a non-RegExp object obj is passed,
it is implicitly converted to a RegExp by using new RegExp(obj).
@name match
@methodOf String#
*/


/**
Returns a new string with some or all matches of a pattern replaced by a
replacement.  The pattern can be a string or a RegExp, and the replacement can
be a string or a function to be called for each match.

<code><em>str</em>.replace(<em>regexp|substr</em>, <em>newSubStr|function[</em>, </code><code><em>flags]</em>);</code>
@param regexp  A RegExp object. The match is replaced by the return value of
parameter #2.
@param substr  A String that is to be replaced by newSubStr.
@param newSubStr  The String that replaces the substring received from parameter
#1. A number of special replacement patterns are supported; see the "Specifying
a string as a parameter" section below.
@param function  A function to be invoked to create the new substring (to put in
place of the substring received from parameter #1). The arguments supplied to
this function are described in the "Specifying a function as a parameter"
section below.
@param flags gimy

Non-standardThe use of the flags parameter in the String.replace method is
non-standard. For cross-browser compatibility, use a RegExp object with
corresponding flags.A string containing any combination of the RegExp flags: g
global match i ignore case m match over multiple lines y Non-standard
sticky global matchignore casematch over multiple linesNon-standard     sticky
@name replace
@methodOf String#
*/


/**
Executes the search for a match between a regular expression and this String
object.

<code><em>string</em>.search(<em>regexp</em>)</code>
@param regexp  A  regular expression object. If a non-RegExp object obj is
passed, it is implicitly converted to a RegExp by using new RegExp(obj).
@name search
@methodOf String#
*/


/**
Extracts a section of a string and returns a new string.

<code><em>string</em>.slice(<em>beginslice</em>[, <em>endSlice</em>])</code>
@param beginSlice  The zero-based index at which to begin extraction.
@param endSlice  The zero-based index at which to end extraction. If omitted,
slice extracts to the end of the string.
@name slice
@methodOf String#
*/


/**
Splits a String object into an array of strings by separating the string into
substrings.

<code><em>string</em>.split([<em>separator</em>][, <em>limit</em>])</code>
@param separator  Specifies the character to use for separating the string. The
separator is treated as a string or a regular expression. If separator is
omitted, the array returned contains one element consisting of the entire
string.
@param limit  Integer specifying a limit on the number of splits to be found.
@name split
@methodOf String#
*/


/**
Returns the characters in a string beginning at the specified location through
the specified number of characters.

<code><em>string</em>.substr(<em>start</em>[, <em>length</em>])</code>
@param start  Location at which to begin extracting characters.
@param length  The number of characters to extract.
@name substr
@methodOf String#
*/


/**
Returns a subset of a string between one index and another, or through the end
of the string.

<code><em>string</em>.substring(<em>indexA</em>[, <em>indexB</em>])</code>
@param indexA  An integer between 0 and one less than the length of the string.
@param indexB  (optional) An integer between 0 and the length of the string.
@name substring
@methodOf String#
*/


/**
Returns the calling string value converted to lower case, according to any
locale-specific case mappings.

<code> toLocaleLowerCase() </code>

@name toLocaleLowerCase
@methodOf String#
*/


/**
Returns the calling string value converted to upper case, according to any
locale-specific case mappings.

<code> toLocaleUpperCase() </code>

@name toLocaleUpperCase
@methodOf String#
*/


/**
Returns the calling string value converted to lowercase.

<code><em>string</em>.toLowerCase()</code>

@name toLowerCase
@methodOf String#
*/


/**
Returns a string representing the specified object.

<code><em>string</em>.toString()</code>

@name toString
@methodOf String#
*/


/**
Returns the calling string value converted to uppercase.

<code><em>string</em>.toUpperCase()</code>

@name toUpperCase
@methodOf String#
*/


/**
Removes whitespace from both ends of the string.

<code><em>string</em>.trim()</code>

@name trim
@methodOf String#
*/


/**
Returns the primitive value of a String object.

<code><em>string</em>.valueOf()</code>

@name valueOf
@methodOf String#
*/


/**
Removes the last element from an array and returns that element.

<code>
<i>array</i>.pop()
</code>

@name pop
@methodOf Array#
*/


/**
Mutates an array by appending the given elements and returning the new length of
the array.

<code><em>array</em>.push(<em>element1</em>, ..., <em>elementN</em>)</code>
@param element1, ..., elementN The elements to add to the end of the array.
@name push
@methodOf Array#
*/


/**
Reverses an array in place.  The first array element becomes the last and the
last becomes the first.

<code><em>array</em>.reverse()</code>

@name reverse
@methodOf Array#
*/


/**
Removes the first element from an array and returns that element. This method
changes the length of the array.

<code><em>array</em>.shift()</code>

@name shift
@methodOf Array#
*/


/**
Sorts the elements of an array in place.

<code><em>array</em>.sort([<em>compareFunction</em>])</code>
@param compareFunction  Specifies a function that defines the sort order. If
omitted, the array is sorted lexicographically (in dictionary order) according
to the string conversion of each element.
@name sort
@methodOf Array#
*/


/**
Changes the content of an array, adding new elements while removing old
elements.

<code><em>array</em>.splice(<em>index</em>, <em>howMany</em>[, <em>element1</em>[, ...[, <em>elementN</em>]]])</code>
@param index  Index at which to start changing the array. If negative, will
begin that many elements from the end.
@param howMany  An integer indicating the number of old array elements to
remove. If howMany is 0, no elements are removed. In this case, you should
specify at least one new element. If no howMany parameter is specified (second
syntax above, which is a SpiderMonkey extension), all elements after index are
removed.
@param element1, ..., elementN  The elements to add to the array. If you don't
specify any elements, splice simply removes elements from the array.
@name splice
@methodOf Array#
*/


/**
Adds one or more elements to the beginning of an array and returns the new
length of the array.

<code><em>arrayName</em>.unshift(<em>element1</em>, ..., <em>elementN</em>) </code>
@param element1, ..., elementN The elements to add to the front of the array.
@name unshift
@methodOf Array#
*/


/**
Returns a new array comprised of this array joined with other array(s) and/or
value(s).

<code><em>array</em>.concat(<em>value1</em>, <em>value2</em>, ..., <em>valueN</em>)</code>
@param valueN  Arrays and/or values to concatenate to the resulting array.
@name concat
@methodOf Array#
*/


/**
Joins all elements of an array into a string.

<code><em>array</em>.join(<em>separator</em>)</code>
@param separator  Specifies a string to separate each element of the array. The
separator is converted to a string if necessary. If omitted, the array elements
are separated with a comma.
@name join
@methodOf Array#
*/


/**
Returns a one-level deep copy of a portion of an array.

<code><em>array</em>.slice(<em>begin</em>[, <em>end</em>])</code>
@param begin  Zero-based index at which to begin extraction.As a negative index,
start indicates an offset from the end of the sequence. slice(-2) extracts the
second-to-last element and the last element in the sequence.
@param end  Zero-based index at which to end extraction. slice extracts up to
but not including end.slice(1,4) extracts the second element through the fourth
element (elements indexed 1, 2, and 3).As a negative index, end indicates an
offset from the end of the sequence. slice(2,-1) extracts the third element
through the second-to-last element in the sequence.If end is omitted, slice
extracts to the end of the sequence.
@name slice
@methodOf Array#
*/


/**
Returns a string representing the specified array and its elements.

<code><em>array</em>.toString()</code>

@name toString
@methodOf Array#
*/


/**
Returns the first index at which a given element can be found in the array, or
-1 if it is not present.

<code><em>array</em>.indexOf(<em>searchElement</em>[, <em>fromIndex</em>])</code>
@param searchElement fromIndex  Element to locate in the array.The index at
which to begin the search. Defaults to 0, i.e. the whole array will be searched.
If the index is greater than or equal to the length of the array, -1 is
returned, i.e. the array will not be searched. If negative, it is taken as the
offset from the end of the array. Note that even when the index is negative, the
array is still searched from front to back. If the calculated index is less than
0, the whole array will be searched.
@name indexOf
@methodOf Array#
*/


/**
Returns the last index at which a given element can be found in the array, or -1
if it is not present. The array is searched backwards, starting at fromIndex.

<code><em>array</em>.lastIndexOf(<em>searchElement</em>[, <em>fromIndex</em>])</code>
@param searchElement fromIndex  Element to locate in the array.The index at
which to start searching backwards. Defaults to the array's length, i.e. the
whole array will be searched. If the index is greater than or equal to the
length of the array, the whole array will be searched. If negative, it is taken
as the offset from the end of the array. Note that even when the index is
negative, the array is still searched from back to front. If the calculated
index is less than 0, -1 is returned, i.e. the array will not be searched.
@name lastIndexOf
@methodOf Array#
*/


/**
Creates a new array with all elements that pass the test implemented by the
provided function.

<code><em>array</em>.filter(<em>callback</em>[, <em>thisObject</em>])</code>
@param callback thisObject  Function to test each element of the array.Object to
use as this when executing callback.
@name filter
@methodOf Array#
*/


/**
Executes a provided function once per array element.

<code><em>array</em>.forEach(<em>callback</em>[, <em>thisObject</em>])</code>
@param callback thisObject  Function to execute for each element.Object to use
as this when executing callback.
@name forEach
@methodOf Array#
*/


/**
Tests whether all elements in the array pass the test implemented by the
provided function.

<code><em>array</em>.every(<em>callback</em>[, <em>thisObject</em>])</code>
@param callbackthisObject Function to test for each element.Object to use as
this when executing callback.
@name every
@methodOf Array#
*/


/**
Creates a new array with the results of calling a provided function on every
element in this array.

<code><em>array</em>.map(<em>callback</em>[, <em>thisObject</em>])</code>
@param callbackthisObject Function that produces an element of the new Array
from an element of the current one.Object to use as this when executing
callback.
@name map
@methodOf Array#
*/


/**
Tests whether some element in the array passes the test implemented by the
provided function.

<code><em>array</em>.some(<em>callback</em>[, <em>thisObject</em>])</code>
@param callback thisObject  Function to test for each element.Object to use as
this when executing callback.
@name some
@methodOf Array#
*/


/**
Apply a function against an accumulator and each value of the array (from
left-to-right) as to reduce it to a single value.

<code><em>array</em>.reduce(<em>callback</em>[, <em>initialValue</em>])</code>
@param callbackinitialValue Function to execute on each value in the
array.Object to use as the first argument to the first call of the callback.
@name reduce
@methodOf Array#
*/


/**
Apply a function simultaneously against two values of the array (from
right-to-left) as to reduce it to a single value.

<code><em>array</em>.reduceRight(<em>callback</em>[, <em>initialValue</em>])</code>
@param callback initialValue  Function to execute on each value in the
array.Object to use as the first argument to the first call of the callback.
@name reduceRight
@methodOf Array#
*/


/**
Returns a boolean indicating whether the object has the specified property.

<code><em>obj</em>.hasOwnProperty(<em>prop</em>)</code>
@param prop The name of the property to test.
@name hasOwnProperty
@methodOf Object#
*/


/**
Calls a function with a given this value and arguments provided as an array.

<code><em>fun</em>.apply(<em>thisArg</em>[, <em>argsArray</em>])</code>
@param thisArg  Determines the value of this inside fun. If thisArg is null or
undefined, this will be the global object. Otherwise, this will be equal to
Object(thisArg) (which is thisArg if thisArg is already an object, or a String,
Boolean, or Number if thisArg is a primitive value of the corresponding type).
Therefore, it is always true that typeof this == "object" when the function
executes.
@param argsArray  An argument array for the object, specifying the arguments
with which fun should be called, or null or undefined if no arguments should be
provided to the function.
@name apply
@methodOf Function#
*/


/**
Creates a new function that, when called, itself calls this function in the
context of the provided this value, with a given sequence of arguments preceding
any provided when the new function was called.

<code><em>fun</em>.bind(<em>thisArg</em>[, <em>arg1</em>[, <em>arg2</em>[, ...]]])</code>
@param thisValuearg1, arg2, ... The value to be passed as the this parameter to
the target function when the bound function is called.  The value is ignored if
the bound function is constructed using the new operator.Arguments to prepend to
arguments provided to the bound function when invoking the target function.
@name bind
@methodOf Function#
*/


/**
Calls a function with a given this value and arguments provided individually.

<code><em>fun</em>.call(<em>thisArg</em>[, <em>arg1</em>[, <em>arg2</em>[, ...]]])</code>
@param thisArg  Determines the value of this inside fun. If thisArg is null or
undefined, this will be the global object. Otherwise, this will be equal to
Object(thisArg) (which is thisArg if thisArg is already an object, or a String,
Boolean, or Number if thisArg is a primitive value of the corresponding type).
Therefore, it is always true that typeof this == "object" when the function
executes.
@param arg1, arg2, ...  Arguments for the object.
@name call
@methodOf Function#
*/


/**
Returns a string representing the source code of the function.

<code><em>function</em>.toString(<em>indentation</em>)</code>
@param indentation Non-standard     The amount of spaces to indent the string
representation of the source code. If indentation is less than or equal to -1,
most unnecessary spaces are removed.
@name toString
@methodOf Function#
*/


/**
Executes a search for a match in a specified string. Returns a result array, or
null.


@param regexp  The name of the regular expression. It can be a variable name or
a literal.
@param str  The string against which to match the regular expression.
@name exec
@methodOf RegExp#
*/


/**
Executes the search for a match between a regular expression and a specified
string. Returns true or false.

<code> <em>regexp</em>.test([<em>str</em>]) </code>
@param regexp  The name of the regular expression. It can be a variable name or
a literal.
@param str  The string against which to match the regular expression.
@name test
@methodOf RegExp#
*/


/**
Returns a string representing the specified object.

<code><i>regexp</i>.toString()</code>

@name toString
@methodOf RegExp#
*/


/**
Returns a reference to the Date function that created the instance's prototype.
Note that the value of this property is a reference to the function itself, not
a string containing the function's name.



@name constructor
@methodOf Date#
*/


/**
Returns the day of the month for the specified date according to local time.

<code>
getDate()
</code>

@name getDate
@methodOf Date#
*/


/**
Returns the day of the week for the specified date according to local time.

<code>
getDay()
</code>

@name getDay
@methodOf Date#
*/


/**
Returns the year of the specified date according to local time.

<code>
getFullYear()
</code>

@name getFullYear
@methodOf Date#
*/


/**
Returns the hour for the specified date according to local time.

<code>
getHours()
</code>

@name getHours
@methodOf Date#
*/


/**
Returns the milliseconds in the specified date according to local time.

<code>
getMilliseconds()
</code>

@name getMilliseconds
@methodOf Date#
*/


/**
Returns the minutes in the specified date according to local time.

<code>
getMinutes()
</code>

@name getMinutes
@methodOf Date#
*/


/**
Returns the month in the specified date according to local time.

<code>
getMonth()
</code>

@name getMonth
@methodOf Date#
*/


/**
Returns the seconds in the specified date according to local time.

<code>
getSeconds()
</code>

@name getSeconds
@methodOf Date#
*/


/**
Returns the numeric value corresponding to the time for the specified date
according to universal time.

<code> getTime() </code>

@name getTime
@methodOf Date#
*/


/**
Returns the time-zone offset from UTC, in minutes, for the current locale.

<code> getTimezoneOffset() </code>

@name getTimezoneOffset
@methodOf Date#
*/


/**
Returns the day (date) of the month in the specified date according to universal
time.

<code>
getUTCDate()
</code>

@name getUTCDate
@methodOf Date#
*/


/**
Returns the day of the week in the specified date according to universal time.

<code>
getUTCDay()
</code>

@name getUTCDay
@methodOf Date#
*/


/**
Returns the year in the specified date according to universal time.

<code>
getUTCFullYear()
</code>

@name getUTCFullYear
@methodOf Date#
*/


/**
Returns the hours in the specified date according to universal time.

<code>
getUTCHours
</code>

@name getUTCHours
@methodOf Date#
*/


/**
Returns the milliseconds in the specified date according to universal time.

<code>
getUTCMilliseconds()
</code>

@name getUTCMilliseconds
@methodOf Date#
*/


/**
Returns the minutes in the specified date according to universal time.

<code>
getUTCMinutes()
</code>

@name getUTCMinutes
@methodOf Date#
*/


/**
Returns the month of the specified date according to universal time.

<code>
getUTCMonth()
</code>

@name getUTCMonth
@methodOf Date#
*/


/**
Returns the seconds in the specified date according to universal time.

<code>
getUTCSeconds()
</code>

@name getUTCSeconds
@methodOf Date#
*/


/**
Sets the day of the month for a specified date according to local time.

<code> setDate(<em>dayValue</em>) </code>
@param dayValue  An integer from 1 to 31, representing the day of the month.
@name setDate
@methodOf Date#
*/


/**
Sets the full year for a specified date according to local time.

<code>
setFullYear(<i>yearValue</i>[, <i>monthValue</i>[, <em>dayValue</em>]])
</code>
@param  yearValue   An integer specifying the numeric value of the year, for
example, 1995.
@param  monthValue   An integer between 0 and 11 representing the months January
through December.
@param  dayValue   An integer between 1 and 31 representing the day of the
month. If you specify the dayValue parameter, you must also specify the
monthValue.
@name setFullYear
@methodOf Date#
*/


/**
Sets the hours for a specified date according to local time.

<code>
setHours(<i>hoursValue</i>[, <i>minutesValue</i>[, <i>secondsValue</i>[, <em>msValue</em>]]])
</code>
@param  hoursValue   An integer between 0 and 23, representing the hour.
@param  minutesValue   An integer between 0 and 59, representing the minutes.
@param  secondsValue   An integer between 0 and 59, representing the seconds. If
you specify the secondsValue parameter, you must also specify the minutesValue.
@param  msValue   A number between 0 and 999, representing the milliseconds. If
you specify the msValue parameter, you must also specify the minutesValue and
secondsValue.
@name setHours
@methodOf Date#
*/


/**
Sets the milliseconds for a specified date according to local time.

<code>
setMilliseconds(<i>millisecondsValue</i>)
</code>
@param  millisecondsValue   A number between 0 and 999, representing the
milliseconds.
@name setMilliseconds
@methodOf Date#
*/


/**
Sets the minutes for a specified date according to local time.

<code>
setMinutes(<i>minutesValue</i>[, <i>secondsValue</i>[, <em>msValue</em>]])
</code>
@param  minutesValue   An integer between 0 and 59, representing the minutes.
@param  secondsValue   An integer between 0 and 59, representing the seconds. If
you specify the secondsValue parameter, you must also specify the minutesValue.
@param  msValue   A number between 0 and 999, representing the milliseconds. If
you specify the msValue parameter, you must also specify the minutesValue and
secondsValue.
@name setMinutes
@methodOf Date#
*/


/**
Set the month for a specified date according to local time.

<code>
setMonth(<i>monthValue</i>[, <em>dayValue</em>])
</code>
@param  monthValue   An integer between 0 and 11 (representing the months
January through December).
@param  dayValue   An integer from 1 to 31, representing the day of the month.
@name setMonth
@methodOf Date#
*/


/**
Sets the seconds for a specified date according to local time.

<code>
setSeconds(<i>secondsValue</i>[, <em>msValue</em>])
</code>
@param  secondsValue   An integer between 0 and 59.
@param  msValue   A number between 0 and 999, representing the milliseconds.
@name setSeconds
@methodOf Date#
*/


/**
Sets the Date object to the time represented by a number of milliseconds since
January 1, 1970, 00:00:00 UTC.

<code>
setTime(<i>timeValue</i>)
</code>
@param  timeValue   An integer representing the number of milliseconds since 1
January 1970, 00:00:00 UTC.
@name setTime
@methodOf Date#
*/


/**
Sets the day of the month for a specified date according to universal time.

<code>
setUTCDate(<i>dayValue</i>)
</code>
@param  dayValue   An integer from 1 to 31, representing the day of the month.
@name setUTCDate
@methodOf Date#
*/


/**
Sets the full year for a specified date according to universal time.

<code>
setUTCFullYear(<i>yearValue</i>[, <i>monthValue</i>[, <em>dayValue</em>]])
</code>
@param  yearValue   An integer specifying the numeric value of the year, for
example, 1995.
@param  monthValue   An integer between 0 and 11 representing the months January
through December.
@param  dayValue   An integer between 1 and 31 representing the day of the
month. If you specify the dayValue parameter, you must also specify the
monthValue.
@name setUTCFullYear
@methodOf Date#
*/


/**
Sets the hour for a specified date according to universal time.

<code>
setUTCHours(<i>hoursValue</i>[, <i>minutesValue</i>[, <i>secondsValue</i>[, <em>msValue</em>]]])
</code>
@param  hoursValue   An integer between 0 and 23, representing the hour.
@param  minutesValue   An integer between 0 and 59, representing the minutes.
@param  secondsValue   An integer between 0 and 59, representing the seconds. If
you specify the secondsValue parameter, you must also specify the minutesValue.
@param  msValue   A number between 0 and 999, representing the milliseconds. If
you specify the msValue parameter, you must also specify the minutesValue and
secondsValue.
@name setUTCHours
@methodOf Date#
*/


/**
Sets the milliseconds for a specified date according to universal time.

<code>
setUTCMilliseconds(<i>millisecondsValue</i>)
</code>
@param  millisecondsValue   A number between 0 and 999, representing the
milliseconds.
@name setUTCMilliseconds
@methodOf Date#
*/


/**
Sets the minutes for a specified date according to universal time.

<code>
setUTCMinutes(<i>minutesValue</i>[, <i>secondsValue</i>[, <em>msValue</em>]])
</code>
@param  minutesValue   An integer between 0 and 59, representing the minutes.
@param  secondsValue   An integer between 0 and 59, representing the seconds. If
you specify the secondsValue parameter, you must also specify the minutesValue.
@param  msValue   A number between 0 and 999, representing the milliseconds. If
you specify the msValue parameter, you must also specify the minutesValue and
secondsValue.
@name setUTCMinutes
@methodOf Date#
*/


/**
Sets the month for a specified date according to universal time.

<code>
setUTCMonth(<i>monthValue</i>[, <em>dayValue</em>])
</code>
@param  monthValue   An integer between 0 and 11, representing the months
January through December.
@param  dayValue   An integer from 1 to 31, representing the day of the month.
@name setUTCMonth
@methodOf Date#
*/


/**
Sets the seconds for a specified date according to universal time.

<code>
setUTCSeconds(<i>secondsValue</i>[, <em>msValue</em>])
</code>
@param  secondsValue   An integer between 0 and 59.
@param  msValue   A number between 0 and 999, representing the milliseconds.
@name setUTCSeconds
@methodOf Date#
*/


/**
Returns the date portion of a Date object in human readable form in American
English.

<code><em>date</em>.toDateString()</code>

@name toDateString
@methodOf Date#
*/


/**
Returns a JSON representation of the Date object.

<code><em>date</em>.prototype.toJSON()</code>

@name toJSON
@methodOf Date#
*/


/**
Converts a date to a string, returning the "date" portion using the operating
system's locale's conventions.

<code>
toLocaleDateString()
</code>

@name toLocaleDateString
@methodOf Date#
*/


/**
Converts a date to a string, using the operating system's locale's conventions.

<code>
toLocaleString()
</code>

@name toLocaleString
@methodOf Date#
*/


/**
Converts a date to a string, returning the "time" portion using the current
locale's conventions.

<code> toLocaleTimeString() </code>

@name toLocaleTimeString
@methodOf Date#
*/


/**
Returns a string representing the specified Date object.

<code> toString() </code>

@name toString
@methodOf Date#
*/


/**
Returns the time portion of a Date object in human readable form in American
English.

<code><em>date</em>.toTimeString()</code>

@name toTimeString
@methodOf Date#
*/


/**
Converts a date to a string, using the universal time convention.

<code> toUTCString() </code>

@name toUTCString
@methodOf Date#
*/


(function() {



}).call(this);
/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/**
Generate a random uuid.

<code><pre>
   // No arguments  - returns RFC4122, version 4 ID
   Math.uuid()
=> "92329D39-6F5C-4520-ABFC-AAB64544E172"

   // One argument - returns ID of the specified length
   Math.uuid(15)     // 15 character ID (default base=62)
=> "VcydxgltxrVZSTV"

   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
   Math.uuid(8, 2)  // 8 character ID (base=2)
=> "01001010"

   Math.uuid(8, 10) // 8 character ID (base=10)
=> "47473046"

   Math.uuid(8, 16) // 8 character ID (base=16)
=> "098F4D35"
</pre></code>

@name uuid
@methodOf Math
@param length The desired number of characters
@param radix  The number of allowable values for each character.
 */

(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };
})();
(function() {



}).call(this);
/* ===================================================
 * bootstrap-transition.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.item.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide', {
            relatedTarget: $next[0]
          })

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    getParent($(toggle))
      .removeClass('open')
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html')
      .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
      .on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          if (this.options.backdrop != 'static') {
            this.$backdrop.click($.proxy(this.hide, this))
          }

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: true
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.chrome || $.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
(function() {
  var __slice = [].slice;

  (function() {
    var Color, channelize, hslParser, hslToRgb, lookup, names, normalizeKey, parseHSL, parseHex, parseRGB, rgbParser;
    rgbParser = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d?\.?\d*)?\)$/;
    hslParser = /^hsla?\((\d{1,3}),\s*(\d?\.?\d*),\s*(\d?\.?\d*),?\s*(\d?\.?\d*)?\)$/;
    parseRGB = function(colorString) {
      var channel, channels, parsedColor;
      if (!(channels = rgbParser.exec(colorString))) {
        return void 0;
      }
      parsedColor = (function() {
        var _i, _len, _ref, _results;
        _ref = channels.slice(1, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push(parseFloat(channel));
        }
        return _results;
      })();
      if (isNaN(parsedColor[3])) {
        parsedColor[3] = 1;
      }
      return parsedColor;
    };
    parseHex = function(hexString) {
      var alpha, i, rgb;
      hexString = hexString.replace(/#/, '');
      switch (hexString.length) {
        case 3:
        case 4:
          if (hexString.length === 4) {
            alpha = (parseInt(hexString.substr(3, 1), 16) * 0x11) / 255;
          } else {
            alpha = 1;
          }
          rgb = (function() {
            var _i, _results;
            _results = [];
            for (i = _i = 0; _i <= 2; i = ++_i) {
              _results.push(parseInt(hexString.substr(i, 1), 16) * 0x11);
            }
            return _results;
          })();
          rgb.push(alpha);
          return rgb;
        case 6:
        case 8:
          if (hexString.length === 8) {
            alpha = parseInt(hexString.substr(6, 2), 16) / 255;
          } else {
            alpha = 1;
          }
          rgb = (function() {
            var _i, _results;
            _results = [];
            for (i = _i = 0; _i <= 2; i = ++_i) {
              _results.push(parseInt(hexString.substr(2 * i, 2), 16));
            }
            return _results;
          })();
          rgb.push(alpha);
          return rgb;
        default:
          return void 0;
      }
    };
    parseHSL = function(colorString) {
      var channel, channels, parsedColor;
      if (!(channels = hslParser.exec(colorString))) {
        return void 0;
      }
      parsedColor = (function() {
        var _i, _len, _ref, _results;
        _ref = channels.slice(1, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push(parseFloat(channel));
        }
        return _results;
      })();
      if (isNaN(parsedColor[3])) {
        parsedColor[3] = 1;
      }
      return hslToRgb(parsedColor);
    };
    hslToRgb = function(hsl) {
      var a, b, channel, g, h, hueToRgb, l, p, q, r, rgbMap, s;
      h = hsl[0], s = hsl[1], l = hsl[2], a = hsl[3];
      h = h % 360;
      if (a == null) {
        a = 1;
      }
      r = g = b = null;
      hueToRgb = function(p, q, hue) {
        hue = hue.mod(360);
        if (hue < 60) {
          return p + (q - p) * (hue / 60);
        }
        if (hue < 180) {
          return q;
        }
        if (hue < 240) {
          return p + (q - p) * ((240 - hue) / 60);
        }
        return p;
      };
      if (s === 0) {
        r = g = b = l;
      } else {
        q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        p = 2 * l - q;
        r = hueToRgb(p, q, h + 120);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 120);
      }
      rgbMap = (function() {
        var _i, _len, _ref, _results;
        _ref = [r, g, b];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push((channel * 255).round());
        }
        return _results;
      })();
      return rgbMap.concat(a);
    };
    normalizeKey = function(key) {
      return key.toString().toLowerCase().split(' ').join('');
    };
    channelize = function(color, alpha) {
      var channel, result;
      if (color.channels != null) {
        return color.channels();
      }
      if (Object.isArray(color)) {
        if (alpha != null) {
          alpha = parseFloat(alpha);
        } else if (color[3] != null) {
          alpha = parseFloat(color[3]);
        } else {
          alpha = 1;
        }
        result = ((function() {
          var _i, _len, _ref, _results;
          _ref = color.slice(0, 3);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            _results.push(parseFloat(channel));
          }
          return _results;
        })()).concat(alpha);
      } else {
        result = lookup[normalizeKey(color)] || parseHex(color) || parseRGB(color) || parseHSL(color);
        if (alpha != null) {
          result[3] = parseFloat(alpha);
        }
      }
      return result;
    };
    /**
    Create a new color. The constructor is very flexible. It accepts individual r, g, b, a values,
    arrays of r, g, b values, hex strings, rgb strings, hsl strings, other Color objects,
    and even the named colors from the xkcd survey: http://blog.xkcd.com/2010/05/03/color-survey-results/.
    If no arguments are given, defaults to transparent.

    <code><pre>
    individualRgb = Color(23, 56, 49, 0.4)

    individualRgb.toString()
    # => 'rgba(23, 56, 49, 0.4)'

    arrayRgb = Color([59, 100, 230])

    arrayRgb.toString()
    # => 'rgba(59, 100, 230, 1)'

    hex = Color('#ff0000')

    hex.toString()
    # => 'rgba(255, 0, 0, 1)'

    rgb = Color('rgb(0, 255, 0)')

    rgb.toString()
    # => 'rgba(0, 255, 0, 1)'

    hsl = Color('hsl(180, 1, 0.5)')

    hsl.toString()
    # => 'rgba(0, 255, 255, 1)'

    anotherColor = Color('blue')

    Color(anotherColor)
    # => a new color with the same r, g, b, and alpha values as `anotherColor`

    # You have access to all sorts of weird colors.
    # We give you all the named colors the browser recognizes
    # and the ones from this survey
    # http://blog.xkcd.com/2010/05/03/color-survey-results/
    namedBrown = Color('Fuzzy Wuzzy Brown')

    namedBrown.toHex()
    # => '#c45655'

    # Default behavior
    transparent = Color()

    transparent.toString()
    # => 'rgba(0, 0, 0, 0)'
    </pre></code>

    @name Color
    @param {Array|Number|String|Color} args... An Array, r, g, b values,
    a sequence of numbers defining r, g, b values, a hex or hsl string, another Color object, or a named color
    @constructor
    */

    Color = function() {
      var args, parsedColor;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      parsedColor = (function() {
        switch (args.length) {
          case 0:
            return [0, 0, 0, 0];
          case 1:
            return channelize(args.first());
          case 2:
            return channelize(args.first(), args.last());
          default:
            return channelize(args);
        }
      })();
      if (!parsedColor) {
        throw "" + (args.join(',')) + " is an unknown color";
      }
      return {
        __proto__: Color.prototype,
        r: parsedColor[0].round(),
        g: parsedColor[1].round(),
        b: parsedColor[2].round(),
        a: parsedColor[3]
      };
    };
    Color.prototype = {
      /**
      Returns the rgba color channels in an array.

      <code><pre>
      transparent =  Color()

      transparent.channels()
      # => [0, 0, 0, 0]

      red = Color("#FF0000")

      red.channels()
      # => [255, 0, 0, 1]

      rgb = Color(200, 34, 2)

      rgb.channels()
      # => [200, 34, 2, 1]
      </pre></code>

      @name channels
      @methodOf Color#

      @returns {Array} Array of r, g, b, and alpha values of the color
      */

      channels: function() {
        return [this.r, this.g, this.b, this.a];
      },
      /**
      A copy of the calling color that is its complementary color on the color wheel.

      <code><pre>
      red = Color(255, 0, 0)

      cyan = red.complement()

      cyan.toString()
      # => 'rgba(0, 255, 255, 1)'
      </pre></code>

      @name complement
      @methodOf Color#

      @returns {Color} new color that is a copy of the calling color with its hue shifted by 180 degrees on the color wheel
      */

      complement: function() {
        return this.copy().complement$();
      },
      /**
      Modifies the calling color to make it the complement of its previous value.

      <code><pre>
      red = Color(255, 0, 0)

      # modifies red in place to make it into cyan
      red.complement$()

      red.toString()
      # => 'rgba(0, 255, 255, 1)'
      </pre></code>

      @name complement$
      @methodOf Color#

      @returns {Color} the color hue shifted by 180 degrees on the color wheel. Modifies the existing color.
      */

      complement$: function() {
        return this.shiftHue$(180);
      },
      /**
      A copy of the calling color.

      <code><pre>
      color = Color(0, 100, 200)

      copy = color.copy()

      color == copy
      # => false

      color.equal(copy)
      # => true
      </pre></code>

      @name copy
      @methodOf Color#

      @returns {Color} A new color. A copy of the calling color
      */

      copy: function() {
        return Color(this.r, this.g, this.b, this.a);
      },
      /**
      Returns a copy of the calling color darkened by `amount` (Lightness of the color ranges from 0 to 1).

      <code><pre>
      green = Color(0, 255, 0)

      darkGreen = green.darken(0.3)

      darkGreen.toString()
      # => 'rgba(0, 102, 0, 1)'
      </pre></code>

      @name darken
      @methodOf Color#
      @param {Number} amount Amount to darken color by (between 0 - 1)

      @returns {Color} A new color. The lightness value is reduced by `amount` from the original.
      */

      darken: function(amount) {
        return this.copy().darken$(amount);
      },
      /**
      Modifies the color so that it is darkened by `amount` (Lightness of the color ranges from 0 to 1).

      <code><pre>
      green = Color(0, 255, 0)

      # Modifies green to be darkGreen
      green.darken$(0.3)

      green.toString()
      # => 'rgba(0, 102, 0, 1)'
      </pre></code>

      @name darken$
      @methodOf Color#
      @param {Number} amount Amount to darken color by (between 0 - 1)

      @returns {Color} the color with the lightness value reduced by `amount`
      */

      darken$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[2] -= amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A copy of the calling color with its saturation reduced by `amount`.

      <code><pre>
      blue = Color(0, 0, 255)

      desaturatedBlue = blue.desaturate(0.3)

      desaturatedBlue.toString()
      # => 'rgba(38, 38, 217, 1)'
      </pre></code>

      @name desaturate
      @methodOf Color#
      @param {Number} amount Amount to reduce color saturation by (between 0 - 1)

      @returns {Color} A copy of the color with the saturation value reduced by `amount`
      */

      desaturate: function(amount) {
        return this.copy().desaturate$(amount);
      },
      /**
      The modified color with its saturation reduced by `amount`.

      <code><pre>
      blue = Color(0, 0, 255)

      # modifies blue to be desaturatedBlue
      blue.desaturate$(0.3)

      blue.toString()
      # => 'rgba(38, 38, 217, 1)'
      </pre></code>

      @name desaturate$
      @methodOf Color#
      @param {Number} amount Amount to reduce color saturation by (between 0 - 1)

      @returns {Color} the color with the saturation value reduced by `amount`
      */

      desaturate$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[1] -= amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      Determine whether two colors are equal. Compares their r, g, b, and alpha values.

      <code><pre>
      hex = Color('#ffff00')
      rgb = Color(255, 255, 0)

      hex == rgb
      # => false

      hex.equal(rgb)
      # => true
      </pre></code>

      @name equal
      @methodOf Color#
      @param {Color} other the color to compare to the calling color

      @returns {Boolean} true if the r, g, b, a values of the colors agree, false otherwise
      */

      equal: function(other) {
        return other.r === this.r && other.g === this.g && other.b === this.b && other.a === this.a;
      },
      /**
      A copy of the calling color converted to grayscale.

      <code><pre>
      color = Color(255, 255, 0)

      gray = color.grayscale()

      gray.toString()
      # => 'rgba(128, 128, 128, 1)'
      </pre></code>

      @name grayscale
      @methodOf Color#

      @returns {Color} A copy of the calling color converted to grayscale.
      */

      grayscale: function() {
        return this.copy().grayscale$();
      },
      /**
      The calling color converted to grayscale.

      <code><pre>
      color = Color(255, 255, 0)

      # modifies color into gray
      color.grayscale$()

      color.toString()
      # => 'rgba(128, 128, 128, 1)'
      </pre></code>

      @name grayscale$
      @methodOf Color#

      @returns {Color} The calling color converted to grayscale.
      */

      grayscale$: function() {
        var g, hsl;
        hsl = this.toHsl();
        g = (hsl[2] * 255).round();
        this.r = this.g = this.b = g;
        return this;
      },
      /**
      A getter / setter for the hue value of the color. Passing no argument returns the
      current hue value. Passing a value will set the hue to that value and return the color.

      <code><pre>
      magenta = Color(255, 0, 255)

      yellow = magenta.hue(60)

      yellow.toString()
      # => 'rgba(255, 255, 0, 1)'
      </pre></code>

      @name hue
      @methodOf Color#
      @param {Number} [newVal] the new hue value

      @returns {Color|Number} returns the color object if you pass a new hue value and returns the hue otherwise
      */

      hue: function(newVal) {
        var hsl, _ref;
        hsl = this.toHsl();
        if (newVal != null) {
          hsl[0] = newVal;
          _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsl[0];
        }
      },
      /**
      A getter / setter for the lightness value of the color. Passing no argument returns the
      current lightness value. Passing a value will set the lightness to that value and return the color.

      <code><pre>
      magenta = Color(255, 0, 255)

      magenta.lightness()
      # => 0.9

      darkerMagenta = magenta.lightness(0.75)

      darkerMagenta.lightness()
      # => 0.75
      </pre></code>

      @name lightness
      @methodOf Color#
      @param {Number} [newVal] the new lightness value

      @returns {Color|Number} returns the color object if you pass a new lightness value and returns the lightness otherwise
      */

      lightness: function(newVal) {
        var hsl, _ref;
        hsl = this.toHsl();
        if (newVal != null) {
          hsl[2] = newVal;
          _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsl[2];
        }
      },
      /**
      A copy of the calling color with its hue shifted by `degrees`. This differs from the hue setter in that it adds to the existing hue value and will wrap around 0 and 360.

      <code><pre>
      magenta = Color(255, 0, 255)

      magenta.hue()
      # => 300

      yellow = magenta.shiftHue(120)

      # since magenta's hue is 300 we have wrapped
      # around 360 to end up at 60
      yellow.hue()
      # => 60

      yellow.toString()
      # => 'rgba(255, 255, 0, 1)'
      </pre></code>

      @name shiftHue
      @methodOf Color#
      @param {Number} degrees number of degrees to shift the hue on the color wheel.

      @returns {Color} A copy of the color with its hue shifted by `degrees`
      */

      shiftHue: function(degrees) {
        return this.copy().shiftHue$(degrees);
      },
      /**
      The calling color with its hue shifted by `degrees`. This differs from the hue setter in that it adds to the existing hue value and will wrap around 0 and 360.

      <code><pre>
      magenta = Color(255, 0, 255)

      magenta.hue()
      # => 300

      magenta.shiftHue$(120)

      # since magenta's hue is 300 we have wrapped
      # around 360 to end up at 60. Also we have
      # modified magenta in place to become yellow
      magenta.hue()
      # => 60

      magenta.toString()
      # => 'rgba(255, 255, 0, 1)'
      </pre></code>

      @name shiftHue$
      @methodOf Color#
      @param {Number} degrees number of degrees to shift the hue on the color wheel.

      @returns {Color} The color with its hue shifted by `degrees`
      */

      shiftHue$: function(degrees) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[0] = (hsl[0] + degrees.round()).mod(360);
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      Returns a copy of the calling color lightened by `amount` (Lightness of the color ranges from 0 to 1).

      <code><pre>
      green = Color(0, 255, 0)

      lightGreen = green.lighten(0.2)

      lightGreen.toString()
      # => 'rgba(102, 255, 102, 1)'
      </pre></code>

      @name lighten
      @methodOf Color#
      @param {Number} amount Amount to lighten color by (between 0 to 1)

      @returns {Color} A new color. The lightness value is increased by `amount` from the original.
      */

      lighten: function(amount) {
        return this.copy().lighten$(amount);
      },
      /**
      The calling color lightened by `amount` (Lightness of the color ranges from 0 to 1).

      <code><pre>
      green = Color(0, 255, 0)

      green.lighten(0.2)

      # we have modified green in place
      # to become lightGreen
      green.toString()
      # => 'rgba(102, 255, 102, 1)'
      </pre></code>

      @name lighten$
      @methodOf Color#
      @param {Number} amount Amount to lighten color by (between 0 - 1)

      @returns {Color} The calling color with its lightness value increased by `amount`.
      */

      lighten$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[2] += amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A copy of the calling color mixed with `other` using `amount` as the
      mixing ratio. If amount is not passed, then the colors are mixed evenly.

      <code><pre>
      red = Color(255, 0, 0)
      yellow = Color(255, 255, 0)

      # With no amount argument the colors are mixed evenly
      orange = red.mixWith(yellow)

      orange.toString()
      # => 'rgba(255, 128, 0, 1)'

      # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
      somethingCloseToOrange = red.mixWith(yellow, 0.3)

      somethingCloseToOrange.toString()
      # => rgba(255, 179, 0, 1)
      </pre></code>

      @name mixWith
      @methodOf Color#
      @param {Color} other the other color to mix
      @param {Number} [amount] the mixing ratio of the calling color to `other`

      @returns {Color} A new color that is a mix of the calling color and `other`
      */

      mixWith: function(other, amount) {
        return this.copy().mixWith$(other, amount);
      },
      /**
      A copy of the calling color mixed with `other` using `amount` as the
      mixing ratio. If amount is not passed, then the colors are mixed evenly.

      <code><pre>
      red = Color(255, 0, 0)
      yellow = Color(255, 255, 0)
      anotherRed = Color(255, 0, 0)

      # With no amount argument the colors are mixed evenly
      red.mixWith$(yellow)

      # We have modified red in place to be orange
      red.toString()
      # => 'rgba(255, 128, 0, 1)'

      # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
      anotherRed.mixWith$(yellow, 0.3)

      # We have modified `anotherRed` in place to be somethingCloseToOrange
      anotherRed.toString()
      # => rgba(255, 179, 0, 1)
      </pre></code>

      @name mixWith$
      @methodOf Color#
      @param {Color} other the other color to mix
      @param {Number} [amount] the mixing ratio of the calling color to `other`

      @returns {Color} The modified calling color after mixing it with `other`
      */

      mixWith$: function(other, amount) {
        var _ref, _ref1;
        amount || (amount = 0.5);
        _ref = [this.r, this.g, this.b, this.a].zip([other.r, other.g, other.b, other.a]).map(function(array) {
          return (array[0] * amount) + (array[1] * (1 - amount));
        }), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        _ref1 = [this.r, this.g, this.b].map(function(color) {
          return color.round();
        }), this.r = _ref1[0], this.g = _ref1[1], this.b = _ref1[2];
        return this;
      },
      /**
      A copy of the calling color with its saturation increased by `amount`.

      <code><pre>
      color = Color(50, 50, 200)

      color.saturation()
      # => 0.6

      saturatedColor = color.saturate(0.2)

      saturatedColor.saturation()
      # => 0.8

      saturatedColor.toString()
      # => rgba(25, 25, 225, 1)
      </pre></code>

      @name saturate
      @methodOf Color#
      @param {Number} amount the amount to increase saturation by

      @returns {Color} A copy of the calling color with its saturation increased by `amount`
      */

      saturate: function(amount) {
        return this.copy().saturate$(amount);
      },
      /**
      The calling color with its saturation increased by `amount`.

      <code><pre>
      color = Color(50, 50, 200)

      color.saturation()
      # => 0.6

      color.saturate$(0.2)

      # We have modified color in place and increased its saturation to 0.8
      color.saturation()
      # => 0.8

      color.toString()
      # => rgba(25, 25, 225, 1)
      </pre></code>

      @name saturate$
      @methodOf Color#
      @param {Number} amount the amount to increase saturation by

      @returns {Color} The calling color with its saturation increased by `amount`
      */

      saturate$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[1] += amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A getter / setter for the saturation value of the color. Passing no argument returns the
      current saturation value. Passing a value will set the saturation to that value and return the color.

      <code><pre>
      hslColor = Color('hsl(60, 0.5, 0.5)')

      hslColor.saturation()
      # => 0.5
      </pre></code>

      @name saturation
      @methodOf Color#
      @param {Number} [newVal] the new saturation value

      @returns {Color|Number} returns the color object if you pass a new saturation value and returns the saturation otherwise
      */

      saturation: function(newVal) {
        var hsl, _ref;
        hsl = this.toHsl();
        if (newVal != null) {
          hsl[1] = newVal;
          _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsl[1];
        }
      },
      /**
      returns the Hex representation of the color. Exclude the leading `#` by passing false.

      <code><pre>
      color = Color('hsl(60, 1, 0.5)')

      # passing nothing will leave the `#` intact
      color.toHex()
      # => '#ffff00'

      # passing false will remove the `#`
      color.toHex(false)
      # => 'ffff00'
      </pre></code>

      @name toHex
      @methodOf Color#
      @param {Boolean} [leadingHash] if passed as false excludes the leading `#` from the string

      @returns {String} returns the Hex representation of the color
      */

      toHex: function(leadingHash) {
        var hexFromNumber, padString;
        padString = function(hexString) {
          var pad;
          if (hexString.length === 1) {
            pad = "0";
          } else {
            pad = "";
          }
          return pad + hexString;
        };
        hexFromNumber = function(number) {
          return padString(number.toString(16));
        };
        if (leadingHash === false) {
          return "" + (hexFromNumber(this.r)) + (hexFromNumber(this.g)) + (hexFromNumber(this.b));
        } else {
          return "#" + (hexFromNumber(this.r)) + (hexFromNumber(this.g)) + (hexFromNumber(this.b));
        }
      },
      /**
      returns an array of the hue, saturation, lightness, and alpha values of the color.

      <code><pre>
      magenta = Color(255, 0, 255)

      magenta.toHsl()
      # => [300, 1, 0.5, 1]
      </pre></code>

      @name toHsl
      @methodOf Color#

      @returns {Array} An array of the hue, saturation, lightness, and alpha values of the color.
      */

      toHsl: function() {
        var b, channel, chroma, g, hue, lightness, max, min, r, saturation, _ref, _ref1;
        _ref = (function() {
          var _i, _len, _ref, _results;
          _ref = [this.r, this.g, this.b];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            _results.push(channel / 255);
          }
          return _results;
        }).call(this), r = _ref[0], g = _ref[1], b = _ref[2];
        _ref1 = [r, g, b].extremes(), min = _ref1.min, max = _ref1.max;
        hue = saturation = lightness = (max + min) / 2;
        chroma = max - min;
        if (chroma.abs() < 0.00001) {
          hue = saturation = 0;
        } else {
          saturation = lightness > 0.5 ? chroma / (1 - lightness) : chroma / lightness;
          saturation /= 2;
          switch (max) {
            case r:
              hue = ((g - b) / chroma) + 0;
              break;
            case g:
              hue = ((b - r) / chroma) + 2;
              break;
            case b:
              hue = ((r - g) / chroma) + 4;
          }
          hue = (hue * 60).mod(360);
        }
        return [hue, saturation, lightness, this.a];
      },
      /**
      returns string rgba representation of the color.

      <code><pre>
      red = Color('#ff0000')

      red.toString()
      # => 'rgba(255, 0, 0, 1)'
      </pre></code>

      @name toString
      @methodOf Color#

      @returns {String} The rgba string representation of the color
      */

      toString: function() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
      },
      /**
      A copy of the calling color with its alpha reduced by `amount`.

      <code><pre>
      color = Color(0, 0, 0, 1)

      color.a
      # => 1

      transparentColor = color.transparentize(0.5)

      transparentColor.a
      # => 0.5
      </pre></code>

      @name transparentize
      @methodOf Color#

      @returns {Color} A copy of the calling color with its alpha reduced by `amount`
      */

      transparentize: function(amount) {
        return this.copy().transparentize$(amount);
      },
      /**
      The calling color with its alpha reduced by `amount`.

      <code><pre>
      color = Color(0, 0, 0, 1)

      color.a
      # => 1

      # We modify color in place
      color.transparentize$(0.5)

      color.a
      # => 0.5
      </pre></code>

      @name transparentize$
      @methodOf Color#

      @returns {Color} The calling color with its alpha reduced by `amount`
      */

      transparentize$: function(amount) {
        this.a = (this.a - amount).clamp(0, 1);
        return this;
      },
      /**
      A copy of the calling color with its alpha increased by `amount`.

      <code><pre>
      color = Color(0, 0, 0, 0)

      color.a
      # => 1

      opaqueColor = color.opacify(0.25)

      opaqueColor.a
      # => 0.25
      </pre></code>

      @name opacify
      @methodOf Color#

      @returns {Color} A copy of the calling color with its alpha increased by `amount`
      */

      opacify: function(amount) {
        return this.copy().opacify$(amount);
      },
      /**
      The calling color with its alpha increased by `amount`.

      <code><pre>
      color = Color(0, 0, 0, 0)

      color.a
      # => 1

      # We modify color in place
      color.opacify$(0.25)

      color.a
      # => 0.25
      </pre></code>

      @name opacify$
      @methodOf Color#

      @returns {Color} The calling color with its alpha increased by `amount`
      */

      opacify$: function(amount) {
        this.a += amount;
        return this;
      }
    };
    lookup = {};
    names = [["000000", "Black"], ["000080", "Navy Blue"], ["0000C8", "Dark Blue"], ["0000FF", "Blue"], ["000741", "Stratos"], ["001B1C", "Swamp"], ["002387", "Resolution Blue"], ["002900", "Deep Fir"], ["002E20", "Burnham"], ["002FA7", "International Klein Blue"], ["003153", "Prussian Blue"], ["003366", "Midnight Blue"], ["003399", "Smalt"], ["003532", "Deep Teal"], ["003E40", "Cyprus"], ["004620", "Kaitoke Green"], ["0047AB", "Cobalt"], ["004816", "Crusoe"], ["004950", "Sherpa Blue"], ["0056A7", "Endeavour"], ["00581A", "Camarone"], ["0066CC", "Science Blue"], ["0066FF", "Blue Ribbon"], ["00755E", "Tropical Rain Forest"], ["0076A3", "Allports"], ["007BA7", "Deep Cerulean"], ["007EC7", "Lochmara"], ["007FFF", "Azure Radiance"], ["008080", "Teal"], ["0095B6", "Bondi Blue"], ["009DC4", "Pacific Blue"], ["00A693", "Persian Green"], ["00A86B", "Jade"], ["00CC99", "Caribbean Green"], ["00CCCC", "Robin's Egg Blue"], ["00FF00", "Green"], ["00FF7F", "Spring Green"], ["00FFFF", "Cyan / Aqua"], ["010D1A", "Blue Charcoal"], ["011635", "Midnight"], ["011D13", "Holly"], ["012731", "Daintree"], ["01361C", "Cardin Green"], ["01371A", "County Green"], ["013E62", "Astronaut Blue"], ["013F6A", "Regal Blue"], ["014B43", "Aqua Deep"], ["015E85", "Orient"], ["016162", "Blue Stone"], ["016D39", "Fun Green"], ["01796F", "Pine Green"], ["017987", "Blue Lagoon"], ["01826B", "Deep Sea"], ["01A368", "Green Haze"], ["022D15", "English Holly"], ["02402C", "Sherwood Green"], ["02478E", "Congress Blue"], ["024E46", "Evening Sea"], ["026395", "Bahama Blue"], ["02866F", "Observatory"], ["02A4D3", "Cerulean"], ["03163C", "Tangaroa"], ["032B52", "Green Vogue"], ["036A6E", "Mosque"], ["041004", "Midnight Moss"], ["041322", "Black Pearl"], ["042E4C", "Blue Whale"], ["044022", "Zuccini"], ["044259", "Teal Blue"], ["051040", "Deep Cove"], ["051657", "Gulf Blue"], ["055989", "Venice Blue"], ["056F57", "Watercourse"], ["062A78", "Catalina Blue"], ["063537", "Tiber"], ["069B81", "Gossamer"], ["06A189", "Niagara"], ["073A50", "Tarawera"], ["080110", "Jaguar"], ["081910", "Black Bean"], ["082567", "Deep Sapphire"], ["088370", "Elf Green"], ["08E8DE", "Bright Turquoise"], ["092256", "Downriver"], ["09230F", "Palm Green"], ["09255D", "Madison"], ["093624", "Bottle Green"], ["095859", "Deep Sea Green"], ["097F4B", "Salem"], ["0A001C", "Black Russian"], ["0A480D", "Dark Fern"], ["0A6906", "Japanese Laurel"], ["0A6F75", "Atoll"], ["0B0B0B", "Cod Gray"], ["0B0F08", "Marshland"], ["0B1107", "Gordons Green"], ["0B1304", "Black Forest"], ["0B6207", "San Felix"], ["0BDA51", "Malachite"], ["0C0B1D", "Ebony"], ["0C0D0F", "Woodsmoke"], ["0C1911", "Racing Green"], ["0C7A79", "Surfie Green"], ["0C8990", "Blue Chill"], ["0D0332", "Black Rock"], ["0D1117", "Bunker"], ["0D1C19", "Aztec"], ["0D2E1C", "Bush"], ["0E0E18", "Cinder"], ["0E2A30", "Firefly"], ["0F2D9E", "Torea Bay"], ["10121D", "Vulcan"], ["101405", "Green Waterloo"], ["105852", "Eden"], ["110C6C", "Arapawa"], ["120A8F", "Ultramarine"], ["123447", "Elephant"], ["126B40", "Jewel"], ["130000", "Diesel"], ["130A06", "Asphalt"], ["13264D", "Blue Zodiac"], ["134F19", "Parsley"], ["140600", "Nero"], ["1450AA", "Tory Blue"], ["151F4C", "Bunting"], ["1560BD", "Denim"], ["15736B", "Genoa"], ["161928", "Mirage"], ["161D10", "Hunter Green"], ["162A40", "Big Stone"], ["163222", "Celtic"], ["16322C", "Timber Green"], ["163531", "Gable Green"], ["171F04", "Pine Tree"], ["175579", "Chathams Blue"], ["182D09", "Deep Forest Green"], ["18587A", "Blumine"], ["19330E", "Palm Leaf"], ["193751", "Nile Blue"], ["1959A8", "Fun Blue"], ["1A1A68", "Lucky Point"], ["1AB385", "Mountain Meadow"], ["1B0245", "Tolopea"], ["1B1035", "Haiti"], ["1B127B", "Deep Koamaru"], ["1B1404", "Acadia"], ["1B2F11", "Seaweed"], ["1B3162", "Biscay"], ["1B659D", "Matisse"], ["1C1208", "Crowshead"], ["1C1E13", "Rangoon Green"], ["1C39BB", "Persian Blue"], ["1C402E", "Everglade"], ["1C7C7D", "Elm"], ["1D6142", "Green Pea"], ["1E0F04", "Creole"], ["1E1609", "Karaka"], ["1E1708", "El Paso"], ["1E385B", "Cello"], ["1E433C", "Te Papa Green"], ["1E90FF", "Dodger Blue"], ["1E9AB0", "Eastern Blue"], ["1F120F", "Night Rider"], ["1FC2C2", "Java"], ["20208D", "Jacksons Purple"], ["202E54", "Cloud Burst"], ["204852", "Blue Dianne"], ["211A0E", "Eternity"], ["220878", "Deep Blue"], ["228B22", "Forest Green"], ["233418", "Mallard"], ["240A40", "Violet"], ["240C02", "Kilamanjaro"], ["242A1D", "Log Cabin"], ["242E16", "Black Olive"], ["24500F", "Green House"], ["251607", "Graphite"], ["251706", "Cannon Black"], ["251F4F", "Port Gore"], ["25272C", "Shark"], ["25311C", "Green Kelp"], ["2596D1", "Curious Blue"], ["260368", "Paua"], ["26056A", "Paris M"], ["261105", "Wood Bark"], ["261414", "Gondola"], ["262335", "Steel Gray"], ["26283B", "Ebony Clay"], ["273A81", "Bay of Many"], ["27504B", "Plantation"], ["278A5B", "Eucalyptus"], ["281E15", "Oil"], ["283A77", "Astronaut"], ["286ACD", "Mariner"], ["290C5E", "Violent Violet"], ["292130", "Bastille"], ["292319", "Zeus"], ["292937", "Charade"], ["297B9A", "Jelly Bean"], ["29AB87", "Jungle Green"], ["2A0359", "Cherry Pie"], ["2A140E", "Coffee Bean"], ["2A2630", "Baltic Sea"], ["2A380B", "Turtle Green"], ["2A52BE", "Cerulean Blue"], ["2B0202", "Sepia Black"], ["2B194F", "Valhalla"], ["2B3228", "Heavy Metal"], ["2C0E8C", "Blue Gem"], ["2C1632", "Revolver"], ["2C2133", "Bleached Cedar"], ["2C8C84", "Lochinvar"], ["2D2510", "Mikado"], ["2D383A", "Outer Space"], ["2D569B", "St Tropaz"], ["2E0329", "Jacaranda"], ["2E1905", "Jacko Bean"], ["2E3222", "Rangitoto"], ["2E3F62", "Rhino"], ["2E8B57", "Sea Green"], ["2EBFD4", "Scooter"], ["2F270E", "Onion"], ["2F3CB3", "Governor Bay"], ["2F519E", "Sapphire"], ["2F5A57", "Spectra"], ["2F6168", "Casal"], ["300529", "Melanzane"], ["301F1E", "Cocoa Brown"], ["302A0F", "Woodrush"], ["304B6A", "San Juan"], ["30D5C8", "Turquoise"], ["311C17", "Eclipse"], ["314459", "Pickled Bluewood"], ["315BA1", "Azure"], ["31728D", "Calypso"], ["317D82", "Paradiso"], ["32127A", "Persian Indigo"], ["32293A", "Blackcurrant"], ["323232", "Mine Shaft"], ["325D52", "Stromboli"], ["327C14", "Bilbao"], ["327DA0", "Astral"], ["33036B", "Christalle"], ["33292F", "Thunder"], ["33CC99", "Shamrock"], ["341515", "Tamarind"], ["350036", "Mardi Gras"], ["350E42", "Valentino"], ["350E57", "Jagger"], ["353542", "Tuna"], ["354E8C", "Chambray"], ["363050", "Martinique"], ["363534", "Tuatara"], ["363C0D", "Waiouru"], ["36747D", "Ming"], ["368716", "La Palma"], ["370202", "Chocolate"], ["371D09", "Clinker"], ["37290E", "Brown Tumbleweed"], ["373021", "Birch"], ["377475", "Oracle"], ["380474", "Blue Diamond"], ["381A51", "Grape"], ["383533", "Dune"], ["384555", "Oxford Blue"], ["384910", "Clover"], ["394851", "Limed Spruce"], ["396413", "Dell"], ["3A0020", "Toledo"], ["3A2010", "Sambuca"], ["3A2A6A", "Jacarta"], ["3A686C", "William"], ["3A6A47", "Killarney"], ["3AB09E", "Keppel"], ["3B000B", "Temptress"], ["3B0910", "Aubergine"], ["3B1F1F", "Jon"], ["3B2820", "Treehouse"], ["3B7A57", "Amazon"], ["3B91B4", "Boston Blue"], ["3C0878", "Windsor"], ["3C1206", "Rebel"], ["3C1F76", "Meteorite"], ["3C2005", "Dark Ebony"], ["3C3910", "Camouflage"], ["3C4151", "Bright Gray"], ["3C4443", "Cape Cod"], ["3C493A", "Lunar Green"], ["3D0C02", "Bean  "], ["3D2B1F", "Bistre"], ["3D7D52", "Goblin"], ["3E0480", "Kingfisher Daisy"], ["3E1C14", "Cedar"], ["3E2B23", "English Walnut"], ["3E2C1C", "Black Marlin"], ["3E3A44", "Ship Gray"], ["3EABBF", "Pelorous"], ["3F2109", "Bronze"], ["3F2500", "Cola"], ["3F3002", "Madras"], ["3F307F", "Minsk"], ["3F4C3A", "Cabbage Pont"], ["3F583B", "Tom Thumb"], ["3F5D53", "Mineral Green"], ["3FC1AA", "Puerto Rico"], ["3FFF00", "Harlequin"], ["401801", "Brown Pod"], ["40291D", "Cork"], ["403B38", "Masala"], ["403D19", "Thatch Green"], ["405169", "Fiord"], ["40826D", "Viridian"], ["40A860", "Chateau Green"], ["410056", "Ripe Plum"], ["411F10", "Paco"], ["412010", "Deep Oak"], ["413C37", "Merlin"], ["414257", "Gun Powder"], ["414C7D", "East Bay"], ["4169E1", "Royal Blue"], ["41AA78", "Ocean Green"], ["420303", "Burnt Maroon"], ["423921", "Lisbon Brown"], ["427977", "Faded Jade"], ["431560", "Scarlet Gum"], ["433120", "Iroko"], ["433E37", "Armadillo"], ["434C59", "River Bed"], ["436A0D", "Green Leaf"], ["44012D", "Barossa"], ["441D00", "Morocco Brown"], ["444954", "Mako"], ["454936", "Kelp"], ["456CAC", "San Marino"], ["45B1E8", "Picton Blue"], ["460B41", "Loulou"], ["462425", "Crater Brown"], ["465945", "Gray Asparagus"], ["4682B4", "Steel Blue"], ["480404", "Rustic Red"], ["480607", "Bulgarian Rose"], ["480656", "Clairvoyant"], ["481C1C", "Cocoa Bean"], ["483131", "Woody Brown"], ["483C32", "Taupe"], ["49170C", "Van Cleef"], ["492615", "Brown Derby"], ["49371B", "Metallic Bronze"], ["495400", "Verdun Green"], ["496679", "Blue Bayoux"], ["497183", "Bismark"], ["4A2A04", "Bracken"], ["4A3004", "Deep Bronze"], ["4A3C30", "Mondo"], ["4A4244", "Tundora"], ["4A444B", "Gravel"], ["4A4E5A", "Trout"], ["4B0082", "Pigment Indigo"], ["4B5D52", "Nandor"], ["4C3024", "Saddle"], ["4C4F56", "Abbey"], ["4D0135", "Blackberry"], ["4D0A18", "Cab Sav"], ["4D1E01", "Indian Tan"], ["4D282D", "Cowboy"], ["4D282E", "Livid Brown"], ["4D3833", "Rock"], ["4D3D14", "Punga"], ["4D400F", "Bronzetone"], ["4D5328", "Woodland"], ["4E0606", "Mahogany"], ["4E2A5A", "Bossanova"], ["4E3B41", "Matterhorn"], ["4E420C", "Bronze Olive"], ["4E4562", "Mulled Wine"], ["4E6649", "Axolotl"], ["4E7F9E", "Wedgewood"], ["4EABD1", "Shakespeare"], ["4F1C70", "Honey Flower"], ["4F2398", "Daisy Bush"], ["4F69C6", "Indigo"], ["4F7942", "Fern Green"], ["4F9D5D", "Fruit Salad"], ["4FA83D", "Apple"], ["504351", "Mortar"], ["507096", "Kashmir Blue"], ["507672", "Cutty Sark"], ["50C878", "Emerald"], ["514649", "Emperor"], ["516E3D", "Chalet Green"], ["517C66", "Como"], ["51808F", "Smalt Blue"], ["52001F", "Castro"], ["520C17", "Maroon Oak"], ["523C94", "Gigas"], ["533455", "Voodoo"], ["534491", "Victoria"], ["53824B", "Hippie Green"], ["541012", "Heath"], ["544333", "Judge Gray"], ["54534D", "Fuscous Gray"], ["549019", "Vida Loca"], ["55280C", "Cioccolato"], ["555B10", "Saratoga"], ["556D56", "Finlandia"], ["5590D9", "Havelock Blue"], ["56B4BE", "Fountain Blue"], ["578363", "Spring Leaves"], ["583401", "Saddle Brown"], ["585562", "Scarpa Flow"], ["587156", "Cactus"], ["589AAF", "Hippie Blue"], ["591D35", "Wine Berry"], ["592804", "Brown Bramble"], ["593737", "Congo Brown"], ["594433", "Millbrook"], ["5A6E9C", "Waikawa Gray"], ["5A87A0", "Horizon"], ["5B3013", "Jambalaya"], ["5C0120", "Bordeaux"], ["5C0536", "Mulberry Wood"], ["5C2E01", "Carnaby Tan"], ["5C5D75", "Comet"], ["5D1E0F", "Redwood"], ["5D4C51", "Don Juan"], ["5D5C58", "Chicago"], ["5D5E37", "Verdigris"], ["5D7747", "Dingley"], ["5DA19F", "Breaker Bay"], ["5E483E", "Kabul"], ["5E5D3B", "Hemlock"], ["5F3D26", "Irish Coffee"], ["5F5F6E", "Mid Gray"], ["5F6672", "Shuttle Gray"], ["5FA777", "Aqua Forest"], ["5FB3AC", "Tradewind"], ["604913", "Horses Neck"], ["605B73", "Smoky"], ["606E68", "Corduroy"], ["6093D1", "Danube"], ["612718", "Espresso"], ["614051", "Eggplant"], ["615D30", "Costa Del Sol"], ["61845F", "Glade Green"], ["622F30", "Buccaneer"], ["623F2D", "Quincy"], ["624E9A", "Butterfly Bush"], ["625119", "West Coast"], ["626649", "Finch"], ["639A8F", "Patina"], ["63B76C", "Fern"], ["6456B7", "Blue Violet"], ["646077", "Dolphin"], ["646463", "Storm Dust"], ["646A54", "Siam"], ["646E75", "Nevada"], ["6495ED", "Cornflower Blue"], ["64CCDB", "Viking"], ["65000B", "Rosewood"], ["651A14", "Cherrywood"], ["652DC1", "Purple Heart"], ["657220", "Fern Frond"], ["65745D", "Willow Grove"], ["65869F", "Hoki"], ["660045", "Pompadour"], ["660099", "Purple"], ["66023C", "Tyrian Purple"], ["661010", "Dark Tan"], ["66B58F", "Silver Tree"], ["66FF00", "Bright Green"], ["66FF66", "Screamin' Green"], ["67032D", "Black Rose"], ["675FA6", "Scampi"], ["676662", "Ironside Gray"], ["678975", "Viridian Green"], ["67A712", "Christi"], ["683600", "Nutmeg Wood Finish"], ["685558", "Zambezi"], ["685E6E", "Salt Box"], ["692545", "Tawny Port"], ["692D54", "Finn"], ["695F62", "Scorpion"], ["697E9A", "Lynch"], ["6A442E", "Spice"], ["6A5D1B", "Himalaya"], ["6A6051", "Soya Bean"], ["6B2A14", "Hairy Heath"], ["6B3FA0", "Royal Purple"], ["6B4E31", "Shingle Fawn"], ["6B5755", "Dorado"], ["6B8BA2", "Bermuda Gray"], ["6B8E23", "Olive Drab"], ["6C3082", "Eminence"], ["6CDAE7", "Turquoise Blue"], ["6D0101", "Lonestar"], ["6D5E54", "Pine Cone"], ["6D6C6C", "Dove Gray"], ["6D9292", "Juniper"], ["6D92A1", "Gothic"], ["6E0902", "Red Oxide"], ["6E1D14", "Moccaccino"], ["6E4826", "Pickled Bean"], ["6E4B26", "Dallas"], ["6E6D57", "Kokoda"], ["6E7783", "Pale Sky"], ["6F440C", "Cafe Royale"], ["6F6A61", "Flint"], ["6F8E63", "Highland"], ["6F9D02", "Limeade"], ["6FD0C5", "Downy"], ["701C1C", "Persian Plum"], ["704214", "Sepia"], ["704A07", "Antique Bronze"], ["704F50", "Ferra"], ["706555", "Coffee"], ["708090", "Slate Gray"], ["711A00", "Cedar Wood Finish"], ["71291D", "Metallic Copper"], ["714693", "Affair"], ["714AB2", "Studio"], ["715D47", "Tobacco Brown"], ["716338", "Yellow Metal"], ["716B56", "Peat"], ["716E10", "Olivetone"], ["717486", "Storm Gray"], ["718080", "Sirocco"], ["71D9E2", "Aquamarine Blue"], ["72010F", "Venetian Red"], ["724A2F", "Old Copper"], ["726D4E", "Go Ben"], ["727B89", "Raven"], ["731E8F", "Seance"], ["734A12", "Raw Umber"], ["736C9F", "Kimberly"], ["736D58", "Crocodile"], ["737829", "Crete"], ["738678", "Xanadu"], ["74640D", "Spicy Mustard"], ["747D63", "Limed Ash"], ["747D83", "Rolling Stone"], ["748881", "Blue Smoke"], ["749378", "Laurel"], ["74C365", "Mantis"], ["755A57", "Russett"], ["7563A8", "Deluge"], ["76395D", "Cosmic"], ["7666C6", "Blue Marguerite"], ["76BD17", "Lima"], ["76D7EA", "Sky Blue"], ["770F05", "Dark Burgundy"], ["771F1F", "Crown of Thorns"], ["773F1A", "Walnut"], ["776F61", "Pablo"], ["778120", "Pacifika"], ["779E86", "Oxley"], ["77DD77", "Pastel Green"], ["780109", "Japanese Maple"], ["782D19", "Mocha"], ["782F16", "Peanut"], ["78866B", "Camouflage Green"], ["788A25", "Wasabi"], ["788BBA", "Ship Cove"], ["78A39C", "Sea Nymph"], ["795D4C", "Roman Coffee"], ["796878", "Old Lavender"], ["796989", "Rum"], ["796A78", "Fedora"], ["796D62", "Sandstone"], ["79DEEC", "Spray"], ["7A013A", "Siren"], ["7A58C1", "Fuchsia Blue"], ["7A7A7A", "Boulder"], ["7A89B8", "Wild Blue Yonder"], ["7AC488", "De York"], ["7B3801", "Red Beech"], ["7B3F00", "Cinnamon"], ["7B6608", "Yukon Gold"], ["7B7874", "Tapa"], ["7B7C94", "Waterloo "], ["7B8265", "Flax Smoke"], ["7B9F80", "Amulet"], ["7BA05B", "Asparagus"], ["7C1C05", "Kenyan Copper"], ["7C7631", "Pesto"], ["7C778A", "Topaz"], ["7C7B7A", "Concord"], ["7C7B82", "Jumbo"], ["7C881A", "Trendy Green"], ["7CA1A6", "Gumbo"], ["7CB0A1", "Acapulco"], ["7CB7BB", "Neptune"], ["7D2C14", "Pueblo"], ["7DA98D", "Bay Leaf"], ["7DC8F7", "Malibu"], ["7DD8C6", "Bermuda"], ["7E3A15", "Copper Canyon"], ["7F1734", "Claret"], ["7F3A02", "Peru Tan"], ["7F626D", "Falcon"], ["7F7589", "Mobster"], ["7F76D3", "Moody Blue"], ["7FFF00", "Chartreuse"], ["7FFFD4", "Aquamarine"], ["800000", "Maroon"], ["800B47", "Rose Bud Cherry"], ["801818", "Falu Red"], ["80341F", "Red Robin"], ["803790", "Vivid Violet"], ["80461B", "Russet"], ["807E79", "Friar Gray"], ["808000", "Olive"], ["808080", "Gray"], ["80B3AE", "Gulf Stream"], ["80B3C4", "Glacier"], ["80CCEA", "Seagull"], ["81422C", "Nutmeg"], ["816E71", "Spicy Pink"], ["817377", "Empress"], ["819885", "Spanish Green"], ["826F65", "Sand Dune"], ["828685", "Gunsmoke"], ["828F72", "Battleship Gray"], ["831923", "Merlot"], ["837050", "Shadow"], ["83AA5D", "Chelsea Cucumber"], ["83D0C6", "Monte Carlo"], ["843179", "Plum"], ["84A0A0", "Granny Smith"], ["8581D9", "Chetwode Blue"], ["858470", "Bandicoot"], ["859FAF", "Bali Hai"], ["85C4CC", "Half Baked"], ["860111", "Red Devil"], ["863C3C", "Lotus"], ["86483C", "Ironstone"], ["864D1E", "Bull Shot"], ["86560A", "Rusty Nail"], ["868974", "Bitter"], ["86949F", "Regent Gray"], ["871550", "Disco"], ["87756E", "Americano"], ["877C7B", "Hurricane"], ["878D91", "Oslo Gray"], ["87AB39", "Sushi"], ["885342", "Spicy Mix"], ["886221", "Kumera"], ["888387", "Suva Gray"], ["888D65", "Avocado"], ["893456", "Camelot"], ["893843", "Solid Pink"], ["894367", "Cannon Pink"], ["897D6D", "Makara"], ["8A3324", "Burnt Umber"], ["8A73D6", "True V"], ["8A8360", "Clay Creek"], ["8A8389", "Monsoon"], ["8A8F8A", "Stack"], ["8AB9F1", "Jordy Blue"], ["8B00FF", "Electric Violet"], ["8B0723", "Monarch"], ["8B6B0B", "Corn Harvest"], ["8B8470", "Olive Haze"], ["8B847E", "Schooner"], ["8B8680", "Natural Gray"], ["8B9C90", "Mantle"], ["8B9FEE", "Portage"], ["8BA690", "Envy"], ["8BA9A5", "Cascade"], ["8BE6D8", "Riptide"], ["8C055E", "Cardinal Pink"], ["8C472F", "Mule Fawn"], ["8C5738", "Potters Clay"], ["8C6495", "Trendy Pink"], ["8D0226", "Paprika"], ["8D3D38", "Sanguine Brown"], ["8D3F3F", "Tosca"], ["8D7662", "Cement"], ["8D8974", "Granite Green"], ["8D90A1", "Manatee"], ["8DA8CC", "Polo Blue"], ["8E0000", "Red Berry"], ["8E4D1E", "Rope"], ["8E6F70", "Opium"], ["8E775E", "Domino"], ["8E8190", "Mamba"], ["8EABC1", "Nepal"], ["8F021C", "Pohutukawa"], ["8F3E33", "El Salva"], ["8F4B0E", "Korma"], ["8F8176", "Squirrel"], ["8FD6B4", "Vista Blue"], ["900020", "Burgundy"], ["901E1E", "Old Brick"], ["907874", "Hemp"], ["907B71", "Almond Frost"], ["908D39", "Sycamore"], ["92000A", "Sangria"], ["924321", "Cumin"], ["926F5B", "Beaver"], ["928573", "Stonewall"], ["928590", "Venus"], ["9370DB", "Medium Purple"], ["93CCEA", "Cornflower"], ["93DFB8", "Algae Green"], ["944747", "Copper Rust"], ["948771", "Arrowtown"], ["950015", "Scarlett"], ["956387", "Strikemaster"], ["959396", "Mountain Mist"], ["960018", "Carmine"], ["964B00", "Brown"], ["967059", "Leather"], ["9678B6", "Purple Mountain's Majesty"], ["967BB6", "Lavender Purple"], ["96A8A1", "Pewter"], ["96BBAB", "Summer Green"], ["97605D", "Au Chico"], ["9771B5", "Wisteria"], ["97CD2D", "Atlantis"], ["983D61", "Vin Rouge"], ["9874D3", "Lilac Bush"], ["98777B", "Bazaar"], ["98811B", "Hacienda"], ["988D77", "Pale Oyster"], ["98FF98", "Mint Green"], ["990066", "Fresh Eggplant"], ["991199", "Violet Eggplant"], ["991613", "Tamarillo"], ["991B07", "Totem Pole"], ["996666", "Copper Rose"], ["9966CC", "Amethyst"], ["997A8D", "Mountbatten Pink"], ["9999CC", "Blue Bell"], ["9A3820", "Prairie Sand"], ["9A6E61", "Toast"], ["9A9577", "Gurkha"], ["9AB973", "Olivine"], ["9AC2B8", "Shadow Green"], ["9B4703", "Oregon"], ["9B9E8F", "Lemon Grass"], ["9C3336", "Stiletto"], ["9D5616", "Hawaiian Tan"], ["9DACB7", "Gull Gray"], ["9DC209", "Pistachio"], ["9DE093", "Granny Smith Apple"], ["9DE5FF", "Anakiwa"], ["9E5302", "Chelsea Gem"], ["9E5B40", "Sepia Skin"], ["9EA587", "Sage"], ["9EA91F", "Citron"], ["9EB1CD", "Rock Blue"], ["9EDEE0", "Morning Glory"], ["9F381D", "Cognac"], ["9F821C", "Reef Gold"], ["9F9F9C", "Star Dust"], ["9FA0B1", "Santas Gray"], ["9FD7D3", "Sinbad"], ["9FDD8C", "Feijoa"], ["A02712", "Tabasco"], ["A1750D", "Buttered Rum"], ["A1ADB5", "Hit Gray"], ["A1C50A", "Citrus"], ["A1DAD7", "Aqua Island"], ["A1E9DE", "Water Leaf"], ["A2006D", "Flirt"], ["A23B6C", "Rouge"], ["A26645", "Cape Palliser"], ["A2AAB3", "Gray Chateau"], ["A2AEAB", "Edward"], ["A3807B", "Pharlap"], ["A397B4", "Amethyst Smoke"], ["A3E3ED", "Blizzard Blue"], ["A4A49D", "Delta"], ["A4A6D3", "Wistful"], ["A4AF6E", "Green Smoke"], ["A50B5E", "Jazzberry Jam"], ["A59B91", "Zorba"], ["A5CB0C", "Bahia"], ["A62F20", "Roof Terracotta"], ["A65529", "Paarl"], ["A68B5B", "Barley Corn"], ["A69279", "Donkey Brown"], ["A6A29A", "Dawn"], ["A72525", "Mexican Red"], ["A7882C", "Luxor Gold"], ["A85307", "Rich Gold"], ["A86515", "Reno Sand"], ["A86B6B", "Coral Tree"], ["A8989B", "Dusty Gray"], ["A899E6", "Dull Lavender"], ["A8A589", "Tallow"], ["A8AE9C", "Bud"], ["A8AF8E", "Locust"], ["A8BD9F", "Norway"], ["A8E3BD", "Chinook"], ["A9A491", "Gray Olive"], ["A9ACB6", "Aluminium"], ["A9B2C3", "Cadet Blue"], ["A9B497", "Schist"], ["A9BDBF", "Tower Gray"], ["A9BEF2", "Perano"], ["A9C6C2", "Opal"], ["AA375A", "Night Shadz"], ["AA4203", "Fire"], ["AA8B5B", "Muesli"], ["AA8D6F", "Sandal"], ["AAA5A9", "Shady Lady"], ["AAA9CD", "Logan"], ["AAABB7", "Spun Pearl"], ["AAD6E6", "Regent St Blue"], ["AAF0D1", "Magic Mint"], ["AB0563", "Lipstick"], ["AB3472", "Royal Heath"], ["AB917A", "Sandrift"], ["ABA0D9", "Cold Purple"], ["ABA196", "Bronco"], ["AC8A56", "Limed Oak"], ["AC91CE", "East Side"], ["AC9E22", "Lemon Ginger"], ["ACA494", "Napa"], ["ACA586", "Hillary"], ["ACA59F", "Cloudy"], ["ACACAC", "Silver Chalice"], ["ACB78E", "Swamp Green"], ["ACCBB1", "Spring Rain"], ["ACDD4D", "Conifer"], ["ACE1AF", "Celadon"], ["AD781B", "Mandalay"], ["ADBED1", "Casper"], ["ADDFAD", "Moss Green"], ["ADE6C4", "Padua"], ["ADFF2F", "Green Yellow"], ["AE4560", "Hippie Pink"], ["AE6020", "Desert"], ["AE809E", "Bouquet"], ["AF4035", "Medium Carmine"], ["AF4D43", "Apple Blossom"], ["AF593E", "Brown Rust"], ["AF8751", "Driftwood"], ["AF8F2C", "Alpine"], ["AF9F1C", "Lucky"], ["AFA09E", "Martini"], ["AFB1B8", "Bombay"], ["AFBDD9", "Pigeon Post"], ["B04C6A", "Cadillac"], ["B05D54", "Matrix"], ["B05E81", "Tapestry"], ["B06608", "Mai Tai"], ["B09A95", "Del Rio"], ["B0E0E6", "Powder Blue"], ["B0E313", "Inch Worm"], ["B10000", "Bright Red"], ["B14A0B", "Vesuvius"], ["B1610B", "Pumpkin Skin"], ["B16D52", "Santa Fe"], ["B19461", "Teak"], ["B1E2C1", "Fringy Flower"], ["B1F4E7", "Ice Cold"], ["B20931", "Shiraz"], ["B2A1EA", "Biloba Flower"], ["B32D29", "Tall Poppy"], ["B35213", "Fiery Orange"], ["B38007", "Hot Toddy"], ["B3AF95", "Taupe Gray"], ["B3C110", "La Rioja"], ["B43332", "Well Read"], ["B44668", "Blush"], ["B4CFD3", "Jungle Mist"], ["B57281", "Turkish Rose"], ["B57EDC", "Lavender"], ["B5A27F", "Mongoose"], ["B5B35C", "Olive Green"], ["B5D2CE", "Jet Stream"], ["B5ECDF", "Cruise"], ["B6316C", "Hibiscus"], ["B69D98", "Thatch"], ["B6B095", "Heathered Gray"], ["B6BAA4", "Eagle"], ["B6D1EA", "Spindle"], ["B6D3BF", "Gum Leaf"], ["B7410E", "Rust"], ["B78E5C", "Muddy Waters"], ["B7A214", "Sahara"], ["B7A458", "Husk"], ["B7B1B1", "Nobel"], ["B7C3D0", "Heather"], ["B7F0BE", "Madang"], ["B81104", "Milano Red"], ["B87333", "Copper"], ["B8B56A", "Gimblet"], ["B8C1B1", "Green Spring"], ["B8C25D", "Celery"], ["B8E0F9", "Sail"], ["B94E48", "Chestnut"], ["B95140", "Crail"], ["B98D28", "Marigold"], ["B9C46A", "Wild Willow"], ["B9C8AC", "Rainee"], ["BA0101", "Guardsman Red"], ["BA450C", "Rock Spray"], ["BA6F1E", "Bourbon"], ["BA7F03", "Pirate Gold"], ["BAB1A2", "Nomad"], ["BAC7C9", "Submarine"], ["BAEEF9", "Charlotte"], ["BB3385", "Medium Red Violet"], ["BB8983", "Brandy Rose"], ["BBD009", "Rio Grande"], ["BBD7C1", "Surf"], ["BCC9C2", "Powder Ash"], ["BD5E2E", "Tuscany"], ["BD978E", "Quicksand"], ["BDB1A8", "Silk"], ["BDB2A1", "Malta"], ["BDB3C7", "Chatelle"], ["BDBBD7", "Lavender Gray"], ["BDBDC6", "French Gray"], ["BDC8B3", "Clay Ash"], ["BDC9CE", "Loblolly"], ["BDEDFD", "French Pass"], ["BEA6C3", "London Hue"], ["BEB5B7", "Pink Swan"], ["BEDE0D", "Fuego"], ["BF5500", "Rose of Sharon"], ["BFB8B0", "Tide"], ["BFBED8", "Blue Haze"], ["BFC1C2", "Silver Sand"], ["BFC921", "Key Lime Pie"], ["BFDBE2", "Ziggurat"], ["BFFF00", "Lime"], ["C02B18", "Thunderbird"], ["C04737", "Mojo"], ["C08081", "Old Rose"], ["C0C0C0", "Silver"], ["C0D3B9", "Pale Leaf"], ["C0D8B6", "Pixie Green"], ["C1440E", "Tia Maria"], ["C154C1", "Fuchsia Pink"], ["C1A004", "Buddha Gold"], ["C1B7A4", "Bison Hide"], ["C1BAB0", "Tea"], ["C1BECD", "Gray Suit"], ["C1D7B0", "Sprout"], ["C1F07C", "Sulu"], ["C26B03", "Indochine"], ["C2955D", "Twine"], ["C2BDB6", "Cotton Seed"], ["C2CAC4", "Pumice"], ["C2E8E5", "Jagged Ice"], ["C32148", "Maroon Flush"], ["C3B091", "Indian Khaki"], ["C3BFC1", "Pale Slate"], ["C3C3BD", "Gray Nickel"], ["C3CDE6", "Periwinkle Gray"], ["C3D1D1", "Tiara"], ["C3DDF9", "Tropical Blue"], ["C41E3A", "Cardinal"], ["C45655", "Fuzzy Wuzzy Brown"], ["C45719", "Orange Roughy"], ["C4C4BC", "Mist Gray"], ["C4D0B0", "Coriander"], ["C4F4EB", "Mint Tulip"], ["C54B8C", "Mulberry"], ["C59922", "Nugget"], ["C5994B", "Tussock"], ["C5DBCA", "Sea Mist"], ["C5E17A", "Yellow Green"], ["C62D42", "Brick Red"], ["C6726B", "Contessa"], ["C69191", "Oriental Pink"], ["C6A84B", "Roti"], ["C6C3B5", "Ash"], ["C6C8BD", "Kangaroo"], ["C6E610", "Las Palmas"], ["C7031E", "Monza"], ["C71585", "Red Violet"], ["C7BCA2", "Coral Reef"], ["C7C1FF", "Melrose"], ["C7C4BF", "Cloud"], ["C7C9D5", "Ghost"], ["C7CD90", "Pine Glade"], ["C7DDE5", "Botticelli"], ["C88A65", "Antique Brass"], ["C8A2C8", "Lilac"], ["C8A528", "Hokey Pokey"], ["C8AABF", "Lily"], ["C8B568", "Laser"], ["C8E3D7", "Edgewater"], ["C96323", "Piper"], ["C99415", "Pizza"], ["C9A0DC", "Light Wisteria"], ["C9B29B", "Rodeo Dust"], ["C9B35B", "Sundance"], ["C9B93B", "Earls Green"], ["C9C0BB", "Silver Rust"], ["C9D9D2", "Conch"], ["C9FFA2", "Reef"], ["C9FFE5", "Aero Blue"], ["CA3435", "Flush Mahogany"], ["CABB48", "Turmeric"], ["CADCD4", "Paris White"], ["CAE00D", "Bitter Lemon"], ["CAE6DA", "Skeptic"], ["CB8FA9", "Viola"], ["CBCAB6", "Foggy Gray"], ["CBD3B0", "Green Mist"], ["CBDBD6", "Nebula"], ["CC3333", "Persian Red"], ["CC5500", "Burnt Orange"], ["CC7722", "Ochre"], ["CC8899", "Puce"], ["CCCAA8", "Thistle Green"], ["CCCCFF", "Periwinkle"], ["CCFF00", "Electric Lime"], ["CD5700", "Tenn"], ["CD5C5C", "Chestnut Rose"], ["CD8429", "Brandy Punch"], ["CDF4FF", "Onahau"], ["CEB98F", "Sorrell Brown"], ["CEBABA", "Cold Turkey"], ["CEC291", "Yuma"], ["CEC7A7", "Chino"], ["CFA39D", "Eunry"], ["CFB53B", "Old Gold"], ["CFDCCF", "Tasman"], ["CFE5D2", "Surf Crest"], ["CFF9F3", "Humming Bird"], ["CFFAF4", "Scandal"], ["D05F04", "Red Stage"], ["D06DA1", "Hopbush"], ["D07D12", "Meteor"], ["D0BEF8", "Perfume"], ["D0C0E5", "Prelude"], ["D0F0C0", "Tea Green"], ["D18F1B", "Geebung"], ["D1BEA8", "Vanilla"], ["D1C6B4", "Soft Amber"], ["D1D2CA", "Celeste"], ["D1D2DD", "Mischka"], ["D1E231", "Pear"], ["D2691E", "Hot Cinnamon"], ["D27D46", "Raw Sienna"], ["D29EAA", "Careys Pink"], ["D2B48C", "Tan"], ["D2DA97", "Deco"], ["D2F6DE", "Blue Romance"], ["D2F8B0", "Gossip"], ["D3CBBA", "Sisal"], ["D3CDC5", "Swirl"], ["D47494", "Charm"], ["D4B6AF", "Clam Shell"], ["D4BF8D", "Straw"], ["D4C4A8", "Akaroa"], ["D4CD16", "Bird Flower"], ["D4D7D9", "Iron"], ["D4DFE2", "Geyser"], ["D4E2FC", "Hawkes Blue"], ["D54600", "Grenadier"], ["D591A4", "Can Can"], ["D59A6F", "Whiskey"], ["D5D195", "Winter Hazel"], ["D5F6E3", "Granny Apple"], ["D69188", "My Pink"], ["D6C562", "Tacha"], ["D6CEF6", "Moon Raker"], ["D6D6D1", "Quill Gray"], ["D6FFDB", "Snowy Mint"], ["D7837F", "New York Pink"], ["D7C498", "Pavlova"], ["D7D0FF", "Fog"], ["D84437", "Valencia"], ["D87C63", "Japonica"], ["D8BFD8", "Thistle"], ["D8C2D5", "Maverick"], ["D8FCFA", "Foam"], ["D94972", "Cabaret"], ["D99376", "Burning Sand"], ["D9B99B", "Cameo"], ["D9D6CF", "Timberwolf"], ["D9DCC1", "Tana"], ["D9E4F5", "Link Water"], ["D9F7FF", "Mabel"], ["DA3287", "Cerise"], ["DA5B38", "Flame Pea"], ["DA6304", "Bamboo"], ["DA6A41", "Red Damask"], ["DA70D6", "Orchid"], ["DA8A67", "Copperfield"], ["DAA520", "Golden Grass"], ["DAECD6", "Zanah"], ["DAF4F0", "Iceberg"], ["DAFAFF", "Oyster Bay"], ["DB5079", "Cranberry"], ["DB9690", "Petite Orchid"], ["DB995E", "Di Serria"], ["DBDBDB", "Alto"], ["DBFFF8", "Frosted Mint"], ["DC143C", "Crimson"], ["DC4333", "Punch"], ["DCB20C", "Galliano"], ["DCB4BC", "Blossom"], ["DCD747", "Wattle"], ["DCD9D2", "Westar"], ["DCDDCC", "Moon Mist"], ["DCEDB4", "Caper"], ["DCF0EA", "Swans Down"], ["DDD6D5", "Swiss Coffee"], ["DDF9F1", "White Ice"], ["DE3163", "Cerise Red"], ["DE6360", "Roman"], ["DEA681", "Tumbleweed"], ["DEBA13", "Gold Tips"], ["DEC196", "Brandy"], ["DECBC6", "Wafer"], ["DED4A4", "Sapling"], ["DED717", "Barberry"], ["DEE5C0", "Beryl Green"], ["DEF5FF", "Pattens Blue"], ["DF73FF", "Heliotrope"], ["DFBE6F", "Apache"], ["DFCD6F", "Chenin"], ["DFCFDB", "Lola"], ["DFECDA", "Willow Brook"], ["DFFF00", "Chartreuse Yellow"], ["E0B0FF", "Mauve"], ["E0B646", "Anzac"], ["E0B974", "Harvest Gold"], ["E0C095", "Calico"], ["E0FFFF", "Baby Blue"], ["E16865", "Sunglo"], ["E1BC64", "Equator"], ["E1C0C8", "Pink Flare"], ["E1E6D6", "Periglacial Blue"], ["E1EAD4", "Kidnapper"], ["E1F6E8", "Tara"], ["E25465", "Mandy"], ["E2725B", "Terracotta"], ["E28913", "Golden Bell"], ["E292C0", "Shocking"], ["E29418", "Dixie"], ["E29CD2", "Light Orchid"], ["E2D8ED", "Snuff"], ["E2EBED", "Mystic"], ["E2F3EC", "Apple Green"], ["E30B5C", "Razzmatazz"], ["E32636", "Alizarin Crimson"], ["E34234", "Cinnabar"], ["E3BEBE", "Cavern Pink"], ["E3F5E1", "Peppermint"], ["E3F988", "Mindaro"], ["E47698", "Deep Blush"], ["E49B0F", "Gamboge"], ["E4C2D5", "Melanie"], ["E4CFDE", "Twilight"], ["E4D1C0", "Bone"], ["E4D422", "Sunflower"], ["E4D5B7", "Grain Brown"], ["E4D69B", "Zombie"], ["E4F6E7", "Frostee"], ["E4FFD1", "Snow Flurry"], ["E52B50", "Amaranth"], ["E5841B", "Zest"], ["E5CCC9", "Dust Storm"], ["E5D7BD", "Stark White"], ["E5D8AF", "Hampton"], ["E5E0E1", "Bon Jour"], ["E5E5E5", "Mercury"], ["E5F9F6", "Polar"], ["E64E03", "Trinidad"], ["E6BE8A", "Gold Sand"], ["E6BEA5", "Cashmere"], ["E6D7B9", "Double Spanish White"], ["E6E4D4", "Satin Linen"], ["E6F2EA", "Harp"], ["E6F8F3", "Off Green"], ["E6FFE9", "Hint of Green"], ["E6FFFF", "Tranquil"], ["E77200", "Mango Tango"], ["E7730A", "Christine"], ["E79F8C", "Tonys Pink"], ["E79FC4", "Kobi"], ["E7BCB4", "Rose Fog"], ["E7BF05", "Corn"], ["E7CD8C", "Putty"], ["E7ECE6", "Gray Nurse"], ["E7F8FF", "Lily White"], ["E7FEFF", "Bubbles"], ["E89928", "Fire Bush"], ["E8B9B3", "Shilo"], ["E8E0D5", "Pearl Bush"], ["E8EBE0", "Green White"], ["E8F1D4", "Chrome White"], ["E8F2EB", "Gin"], ["E8F5F2", "Aqua Squeeze"], ["E96E00", "Clementine"], ["E97451", "Burnt Sienna"], ["E97C07", "Tahiti Gold"], ["E9CECD", "Oyster Pink"], ["E9D75A", "Confetti"], ["E9E3E3", "Ebb"], ["E9F8ED", "Ottoman"], ["E9FFFD", "Clear Day"], ["EA88A8", "Carissma"], ["EAAE69", "Porsche"], ["EAB33B", "Tulip Tree"], ["EAC674", "Rob Roy"], ["EADAB8", "Raffia"], ["EAE8D4", "White Rock"], ["EAF6EE", "Panache"], ["EAF6FF", "Solitude"], ["EAF9F5", "Aqua Spring"], ["EAFFFE", "Dew"], ["EB9373", "Apricot"], ["EBC2AF", "Zinnwaldite"], ["ECA927", "Fuel Yellow"], ["ECC54E", "Ronchi"], ["ECC7EE", "French Lilac"], ["ECCDB9", "Just Right"], ["ECE090", "Wild Rice"], ["ECEBBD", "Fall Green"], ["ECEBCE", "Aths Special"], ["ECF245", "Starship"], ["ED0A3F", "Red Ribbon"], ["ED7A1C", "Tango"], ["ED9121", "Carrot Orange"], ["ED989E", "Sea Pink"], ["EDB381", "Tacao"], ["EDC9AF", "Desert Sand"], ["EDCDAB", "Pancho"], ["EDDCB1", "Chamois"], ["EDEA99", "Primrose"], ["EDF5DD", "Frost"], ["EDF5F5", "Aqua Haze"], ["EDF6FF", "Zumthor"], ["EDF9F1", "Narvik"], ["EDFC84", "Honeysuckle"], ["EE82EE", "Lavender Magenta"], ["EEC1BE", "Beauty Bush"], ["EED794", "Chalky"], ["EED9C4", "Almond"], ["EEDC82", "Flax"], ["EEDEDA", "Bizarre"], ["EEE3AD", "Double Colonial White"], ["EEEEE8", "Cararra"], ["EEEF78", "Manz"], ["EEF0C8", "Tahuna Sands"], ["EEF0F3", "Athens Gray"], ["EEF3C3", "Tusk"], ["EEF4DE", "Loafer"], ["EEF6F7", "Catskill White"], ["EEFDFF", "Twilight Blue"], ["EEFF9A", "Jonquil"], ["EEFFE2", "Rice Flower"], ["EF863F", "Jaffa"], ["EFEFEF", "Gallery"], ["EFF2F3", "Porcelain"], ["F091A9", "Mauvelous"], ["F0D52D", "Golden Dream"], ["F0DB7D", "Golden Sand"], ["F0DC82", "Buff"], ["F0E2EC", "Prim"], ["F0E68C", "Khaki"], ["F0EEFD", "Selago"], ["F0EEFF", "Titan White"], ["F0F8FF", "Alice Blue"], ["F0FCEA", "Feta"], ["F18200", "Gold Drop"], ["F19BAB", "Wewak"], ["F1E788", "Sahara Sand"], ["F1E9D2", "Parchment"], ["F1E9FF", "Blue Chalk"], ["F1EEC1", "Mint Julep"], ["F1F1F1", "Seashell"], ["F1F7F2", "Saltpan"], ["F1FFAD", "Tidal"], ["F1FFC8", "Chiffon"], ["F2552A", "Flamingo"], ["F28500", "Tangerine"], ["F2C3B2", "Mandys Pink"], ["F2F2F2", "Concrete"], ["F2FAFA", "Black Squeeze"], ["F34723", "Pomegranate"], ["F3AD16", "Buttercup"], ["F3D69D", "New Orleans"], ["F3D9DF", "Vanilla Ice"], ["F3E7BB", "Sidecar"], ["F3E9E5", "Dawn Pink"], ["F3EDCF", "Wheatfield"], ["F3FB62", "Canary"], ["F3FBD4", "Orinoco"], ["F3FFD8", "Carla"], ["F400A1", "Hollywood Cerise"], ["F4A460", "Sandy brown"], ["F4C430", "Saffron"], ["F4D81C", "Ripe Lemon"], ["F4EBD3", "Janna"], ["F4F2EE", "Pampas"], ["F4F4F4", "Wild Sand"], ["F4F8FF", "Zircon"], ["F57584", "Froly"], ["F5C85C", "Cream Can"], ["F5C999", "Manhattan"], ["F5D5A0", "Maize"], ["F5DEB3", "Wheat"], ["F5E7A2", "Sandwisp"], ["F5E7E2", "Pot Pourri"], ["F5E9D3", "Albescent White"], ["F5EDEF", "Soft Peach"], ["F5F3E5", "Ecru White"], ["F5F5DC", "Beige"], ["F5FB3D", "Golden Fizz"], ["F5FFBE", "Australian Mint"], ["F64A8A", "French Rose"], ["F653A6", "Brilliant Rose"], ["F6A4C9", "Illusion"], ["F6F0E6", "Merino"], ["F6F7F7", "Black Haze"], ["F6FFDC", "Spring Sun"], ["F7468A", "Violet Red"], ["F77703", "Chilean Fire"], ["F77FBE", "Persian Pink"], ["F7B668", "Rajah"], ["F7C8DA", "Azalea"], ["F7DBE6", "We Peep"], ["F7F2E1", "Quarter Spanish White"], ["F7F5FA", "Whisper"], ["F7FAF7", "Snow Drift"], ["F8B853", "Casablanca"], ["F8C3DF", "Chantilly"], ["F8D9E9", "Cherub"], ["F8DB9D", "Marzipan"], ["F8DD5C", "Energy Yellow"], ["F8E4BF", "Givry"], ["F8F0E8", "White Linen"], ["F8F4FF", "Magnolia"], ["F8F6F1", "Spring Wood"], ["F8F7DC", "Coconut Cream"], ["F8F7FC", "White Lilac"], ["F8F8F7", "Desert Storm"], ["F8F99C", "Texas"], ["F8FACD", "Corn Field"], ["F8FDD3", "Mimosa"], ["F95A61", "Carnation"], ["F9BF58", "Saffron Mango"], ["F9E0ED", "Carousel Pink"], ["F9E4BC", "Dairy Cream"], ["F9E663", "Portica"], ["F9E6F4", "Underage Pink"], ["F9EAF3", "Amour"], ["F9F8E4", "Rum Swizzle"], ["F9FF8B", "Dolly"], ["F9FFF6", "Sugar Cane"], ["FA7814", "Ecstasy"], ["FA9D5A", "Tan Hide"], ["FAD3A2", "Corvette"], ["FADFAD", "Peach Yellow"], ["FAE600", "Turbo"], ["FAEAB9", "Astra"], ["FAECCC", "Champagne"], ["FAF0E6", "Linen"], ["FAF3F0", "Fantasy"], ["FAF7D6", "Citrine White"], ["FAFAFA", "Alabaster"], ["FAFDE4", "Hint of Yellow"], ["FAFFA4", "Milan"], ["FB607F", "Brink Pink"], ["FB8989", "Geraldine"], ["FBA0E3", "Lavender Rose"], ["FBA129", "Sea Buckthorn"], ["FBAC13", "Sun"], ["FBAED2", "Lavender Pink"], ["FBB2A3", "Rose Bud"], ["FBBEDA", "Cupid"], ["FBCCE7", "Classic Rose"], ["FBCEB1", "Apricot Peach"], ["FBE7B2", "Banana Mania"], ["FBE870", "Marigold Yellow"], ["FBE96C", "Festival"], ["FBEA8C", "Sweet Corn"], ["FBEC5D", "Candy Corn"], ["FBF9F9", "Hint of Red"], ["FBFFBA", "Shalimar"], ["FC0FC0", "Shocking Pink"], ["FC80A5", "Tickle Me Pink"], ["FC9C1D", "Tree Poppy"], ["FCC01E", "Lightning Yellow"], ["FCD667", "Goldenrod"], ["FCD917", "Candlelight"], ["FCDA98", "Cherokee"], ["FCF4D0", "Double Pearl Lusta"], ["FCF4DC", "Pearl Lusta"], ["FCF8F7", "Vista White"], ["FCFBF3", "Bianca"], ["FCFEDA", "Moon Glow"], ["FCFFE7", "China Ivory"], ["FCFFF9", "Ceramic"], ["FD0E35", "Torch Red"], ["FD5B78", "Wild Watermelon"], ["FD7B33", "Crusta"], ["FD7C07", "Sorbus"], ["FD9FA2", "Sweet Pink"], ["FDD5B1", "Light Apricot"], ["FDD7E4", "Pig Pink"], ["FDE1DC", "Cinderella"], ["FDE295", "Golden Glow"], ["FDE910", "Lemon"], ["FDF5E6", "Old Lace"], ["FDF6D3", "Half Colonial White"], ["FDF7AD", "Drover"], ["FDFEB8", "Pale Prim"], ["FDFFD5", "Cumulus"], ["FE28A2", "Persian Rose"], ["FE4C40", "Sunset Orange"], ["FE6F5E", "Bittersweet"], ["FE9D04", "California"], ["FEA904", "Yellow Sea"], ["FEBAAD", "Melon"], ["FED33C", "Bright Sun"], ["FED85D", "Dandelion"], ["FEDB8D", "Salomie"], ["FEE5AC", "Cape Honey"], ["FEEBF3", "Remy"], ["FEEFCE", "Oasis"], ["FEF0EC", "Bridesmaid"], ["FEF2C7", "Beeswax"], ["FEF3D8", "Bleach White"], ["FEF4CC", "Pipi"], ["FEF4DB", "Half Spanish White"], ["FEF4F8", "Wisp Pink"], ["FEF5F1", "Provincial Pink"], ["FEF7DE", "Half Dutch White"], ["FEF8E2", "Solitaire"], ["FEF8FF", "White Pointer"], ["FEF9E3", "Off Yellow"], ["FEFCED", "Orange White"], ["FF0000", "Red"], ["FF007F", "Rose"], ["FF00CC", "Purple Pizzazz"], ["FF00FF", "Magenta / Fuchsia"], ["FF2400", "Scarlet"], ["FF3399", "Wild Strawberry"], ["FF33CC", "Razzle Dazzle Rose"], ["FF355E", "Radical Red"], ["FF3F34", "Red Orange"], ["FF4040", "Coral Red"], ["FF4D00", "Vermilion"], ["FF4F00", "International Orange"], ["FF6037", "Outrageous Orange"], ["FF6600", "Blaze Orange"], ["FF66FF", "Pink Flamingo"], ["FF681F", "Orange"], ["FF69B4", "Hot Pink"], ["FF6B53", "Persimmon"], ["FF6FFF", "Blush Pink"], ["FF7034", "Burning Orange"], ["FF7518", "Pumpkin"], ["FF7D07", "Flamenco"], ["FF7F00", "Flush Orange"], ["FF7F50", "Coral"], ["FF8C69", "Salmon"], ["FF9000", "Pizazz"], ["FF910F", "West Side"], ["FF91A4", "Pink Salmon"], ["FF9933", "Neon Carrot"], ["FF9966", "Atomic Tangerine"], ["FF9980", "Vivid Tangerine"], ["FF9E2C", "Sunshade"], ["FFA000", "Orange Peel"], ["FFA194", "Mona Lisa"], ["FFA500", "Web Orange"], ["FFA6C9", "Carnation Pink"], ["FFAB81", "Hit Pink"], ["FFAE42", "Yellow Orange"], ["FFB0AC", "Cornflower Lilac"], ["FFB1B3", "Sundown"], ["FFB31F", "My Sin"], ["FFB555", "Texas Rose"], ["FFB7D5", "Cotton Candy"], ["FFB97B", "Macaroni and Cheese"], ["FFBA00", "Selective Yellow"], ["FFBD5F", "Koromiko"], ["FFBF00", "Amber"], ["FFC0A8", "Wax Flower"], ["FFC0CB", "Pink"], ["FFC3C0", "Your Pink"], ["FFC901", "Supernova"], ["FFCBA4", "Flesh"], ["FFCC33", "Sunglow"], ["FFCC5C", "Golden Tainoi"], ["FFCC99", "Peach Orange"], ["FFCD8C", "Chardonnay"], ["FFD1DC", "Pastel Pink"], ["FFD2B7", "Romantic"], ["FFD38C", "Grandis"], ["FFD700", "Gold"], ["FFD800", "School bus Yellow"], ["FFD8D9", "Cosmos"], ["FFDB58", "Mustard"], ["FFDCD6", "Peach Schnapps"], ["FFDDAF", "Caramel"], ["FFDDCD", "Tuft Bush"], ["FFDDCF", "Watusi"], ["FFDDF4", "Pink Lace"], ["FFDEAD", "Navajo White"], ["FFDEB3", "Frangipani"], ["FFE1DF", "Pippin"], ["FFE1F2", "Pale Rose"], ["FFE2C5", "Negroni"], ["FFE5A0", "Cream Brulee"], ["FFE5B4", "Peach"], ["FFE6C7", "Tequila"], ["FFE772", "Kournikova"], ["FFEAC8", "Sandy Beach"], ["FFEAD4", "Karry"], ["FFEC13", "Broom"], ["FFEDBC", "Colonial White"], ["FFEED8", "Derby"], ["FFEFA1", "Vis Vis"], ["FFEFC1", "Egg White"], ["FFEFD5", "Papaya Whip"], ["FFEFEC", "Fair Pink"], ["FFF0DB", "Peach Cream"], ["FFF0F5", "Lavender blush"], ["FFF14F", "Gorse"], ["FFF1B5", "Buttermilk"], ["FFF1D8", "Pink Lady"], ["FFF1EE", "Forget Me Not"], ["FFF1F9", "Tutu"], ["FFF39D", "Picasso"], ["FFF3F1", "Chardon"], ["FFF46E", "Paris Daisy"], ["FFF4CE", "Barley White"], ["FFF4DD", "Egg Sour"], ["FFF4E0", "Sazerac"], ["FFF4E8", "Serenade"], ["FFF4F3", "Chablis"], ["FFF5EE", "Seashell Peach"], ["FFF5F3", "Sauvignon"], ["FFF6D4", "Milk Punch"], ["FFF6DF", "Varden"], ["FFF6F5", "Rose White"], ["FFF8D1", "Baja White"], ["FFF9E2", "Gin Fizz"], ["FFF9E6", "Early Dawn"], ["FFFACD", "Lemon Chiffon"], ["FFFAF4", "Bridal Heath"], ["FFFBDC", "Scotch Mist"], ["FFFBF9", "Soapstone"], ["FFFC99", "Witch Haze"], ["FFFCEA", "Buttery White"], ["FFFCEE", "Island Spice"], ["FFFDD0", "Cream"], ["FFFDE6", "Chilean Heath"], ["FFFDE8", "Travertine"], ["FFFDF3", "Orchid White"], ["FFFDF4", "Quarter Pearl Lusta"], ["FFFEE1", "Half and Half"], ["FFFEEC", "Apricot White"], ["FFFEF0", "Rice Cake"], ["FFFEF6", "Black White"], ["FFFEFD", "Romance"], ["FFFF00", "Yellow"], ["FFFF66", "Laser Lemon"], ["FFFF99", "Pale Canary"], ["FFFFB4", "Portafino"], ["FFFFF0", "Ivory"], ["FFFFFF", "White"], ["acc2d9", "cloudy blue"], ["56ae57", "dark pastel green"], ["b2996e", "dust"], ["a8ff04", "electric lime"], ["69d84f", "fresh green"], ["894585", "light eggplant"], ["70b23f", "nasty green"], ["d4ffff", "really light blue"], ["65ab7c", "tea"], ["952e8f", "warm purple"], ["fcfc81", "yellowish tan"], ["a5a391", "cement"], ["388004", "dark grass green"], ["4c9085", "dusty teal"], ["5e9b8a", "grey teal"], ["efb435", "macaroni and cheese"], ["d99b82", "pinkish tan"], ["0a5f38", "spruce"], ["0c06f7", "strong blue"], ["61de2a", "toxic green"], ["3778bf", "windows blue"], ["2242c7", "blue blue"], ["533cc6", "blue with a hint of purple"], ["9bb53c", "booger"], ["05ffa6", "bright sea green"], ["1f6357", "dark green blue"], ["017374", "deep turquoise"], ["0cb577", "green teal"], ["ff0789", "strong pink"], ["afa88b", "bland"], ["08787f", "deep aqua"], ["dd85d7", "lavender pink"], ["a6c875", "light moss green"], ["a7ffb5", "light seafoam green"], ["c2b709", "olive yellow"], ["e78ea5", "pig pink"], ["966ebd", "deep lilac"], ["ccad60", "desert"], ["ac86a8", "dusty lavender"], ["947e94", "purpley grey"], ["983fb2", "purply"], ["ff63e9", "candy pink"], ["b2fba5", "light pastel green"], ["63b365", "boring green"], ["8ee53f", "kiwi green"], ["b7e1a1", "light grey green"], ["ff6f52", "orange pink"], ["bdf8a3", "tea green"], ["d3b683", "very light brown"], ["fffcc4", "egg shell"], ["430541", "eggplant purple"], ["ffb2d0", "powder pink"], ["997570", "reddish grey"], ["ad900d", "baby shit brown"], ["c48efd", "liliac"], ["507b9c", "stormy blue"], ["7d7103", "ugly brown"], ["fffd78", "custard"], ["da467d", "darkish pink"], ["410200", "deep brown"], ["c9d179", "greenish beige"], ["fffa86", "manilla"], ["5684ae", "off blue"], ["6b7c85", "battleship grey"], ["6f6c0a", "browny green"], ["7e4071", "bruise"], ["009337", "kelley green"], ["d0e429", "sickly yellow"], ["fff917", "sunny yellow"], ["1d5dec", "azul"], ["054907", "darkgreen"], ["b5ce08", "green/yellow"], ["8fb67b", "lichen"], ["c8ffb0", "light light green"], ["fdde6c", "pale gold"], ["ffdf22", "sun yellow"], ["a9be70", "tan green"], ["6832e3", "burple"], ["fdb147", "butterscotch"], ["c7ac7d", "toupe"], ["fff39a", "dark cream"], ["850e04", "indian red"], ["efc0fe", "light lavendar"], ["40fd14", "poison green"], ["b6c406", "baby puke green"], ["9dff00", "bright yellow green"], ["3c4142", "charcoal grey"], ["f2ab15", "squash"], ["ac4f06", "cinnamon"], ["c4fe82", "light pea green"], ["2cfa1f", "radioactive green"], ["9a6200", "raw sienna"], ["ca9bf7", "baby purple"], ["875f42", "cocoa"], ["3a2efe", "light royal blue"], ["fd8d49", "orangeish"], ["8b3103", "rust brown"], ["cba560", "sand brown"], ["698339", "swamp"], ["0cdc73", "tealish green"], ["b75203", "burnt siena"], ["7f8f4e", "camo"], ["26538d", "dusk blue"], ["63a950", "fern"], ["c87f89", "old rose"], ["b1fc99", "pale light green"], ["ff9a8a", "peachy pink"], ["f6688e", "rosy pink"], ["76fda8", "light bluish green"], ["53fe5c", "light bright green"], ["4efd54", "light neon green"], ["a0febf", "light seafoam"], ["7bf2da", "tiffany blue"], ["bcf5a6", "washed out green"], ["ca6b02", "browny orange"], ["107ab0", "nice blue"], ["2138ab", "sapphire"], ["719f91", "greyish teal"], ["fdb915", "orangey yellow"], ["fefcaf", "parchment"], ["fcf679", "straw"], ["1d0200", "very dark brown"], ["cb6843", "terracota"], ["31668a", "ugly blue"], ["247afd", "clear blue"], ["ffffb6", "creme"], ["90fda9", "foam green"], ["86a17d", "grey/green"], ["fddc5c", "light gold"], ["78d1b6", "seafoam blue"], ["13bbaf", "topaz"], ["fb5ffc", "violet pink"], ["20f986", "wintergreen"], ["ffe36e", "yellow tan"], ["9d0759", "dark fuchsia"], ["3a18b1", "indigo blue"], ["c2ff89", "light yellowish green"], ["d767ad", "pale magenta"], ["720058", "rich purple"], ["ffda03", "sunflower yellow"], ["01c08d", "green/blue"], ["ac7434", "leather"], ["014600", "racing green"], ["9900fa", "vivid purple"], ["02066f", "dark royal blue"], ["8e7618", "hazel"], ["d1768f", "muted pink"], ["96b403", "booger green"], ["fdff63", "canary"], ["95a3a6", "cool grey"], ["7f684e", "dark taupe"], ["751973", "darkish purple"], ["089404", "true green"], ["ff6163", "coral pink"], ["598556", "dark sage"], ["214761", "dark slate blue"], ["3c73a8", "flat blue"], ["ba9e88", "mushroom"], ["021bf9", "rich blue"], ["734a65", "dirty purple"], ["23c48b", "greenblue"], ["8fae22", "icky green"], ["e6f2a2", "light khaki"], ["4b57db", "warm blue"], ["d90166", "dark hot pink"], ["015482", "deep sea blue"], ["9d0216", "carmine"], ["728f02", "dark yellow green"], ["ffe5ad", "pale peach"], ["4e0550", "plum purple"], ["f9bc08", "golden rod"], ["ff073a", "neon red"], ["c77986", "old pink"], ["d6fffe", "very pale blue"], ["fe4b03", "blood orange"], ["fd5956", "grapefruit"], ["fce166", "sand yellow"], ["b2713d", "clay brown"], ["1f3b4d", "dark blue grey"], ["699d4c", "flat green"], ["56fca2", "light green blue"], ["fb5581", "warm pink"], ["3e82fc", "dodger blue"], ["a0bf16", "gross green"], ["d6fffa", "ice"], ["4f738e", "metallic blue"], ["ffb19a", "pale salmon"], ["5c8b15", "sap green"], ["54ac68", "algae"], ["89a0b0", "bluey grey"], ["7ea07a", "greeny grey"], ["1bfc06", "highlighter green"], ["cafffb", "light light blue"], ["b6ffbb", "light mint"], ["a75e09", "raw umber"], ["152eff", "vivid blue"], ["8d5eb7", "deep lavender"], ["5f9e8f", "dull teal"], ["63f7b4", "light greenish blue"], ["606602", "mud green"], ["fc86aa", "pinky"], ["8c0034", "red wine"], ["758000", "shit green"], ["ab7e4c", "tan brown"], ["030764", "darkblue"], ["fe86a4", "rosa"], ["d5174e", "lipstick"], ["fed0fc", "pale mauve"], ["680018", "claret"], ["fedf08", "dandelion"], ["fe420f", "orangered"], ["6f7c00", "poop green"], ["ca0147", "ruby"], ["1b2431", "dark"], ["00fbb0", "greenish turquoise"], ["db5856", "pastel red"], ["ddd618", "piss yellow"], ["41fdfe", "bright cyan"], ["cf524e", "dark coral"], ["21c36f", "algae green"], ["a90308", "darkish red"], ["6e1005", "reddy brown"], ["fe828c", "blush pink"], ["4b6113", "camouflage green"], ["4da409", "lawn green"], ["beae8a", "putty"], ["0339f8", "vibrant blue"], ["a88f59", "dark sand"], ["5d21d0", "purple/blue"], ["feb209", "saffron"], ["4e518b", "twilight"], ["964e02", "warm brown"], ["85a3b2", "bluegrey"], ["ff69af", "bubble gum pink"], ["c3fbf4", "duck egg blue"], ["2afeb7", "greenish cyan"], ["005f6a", "petrol"], ["0c1793", "royal"], ["ffff81", "butter"], ["f0833a", "dusty orange"], ["f1f33f", "off yellow"], ["b1d27b", "pale olive green"], ["fc824a", "orangish"], ["71aa34", "leaf"], ["b7c9e2", "light blue grey"], ["4b0101", "dried blood"], ["a552e6", "lightish purple"], ["af2f0d", "rusty red"], ["8b88f8", "lavender blue"], ["9af764", "light grass green"], ["a6fbb2", "light mint green"], ["ffc512", "sunflower"], ["750851", "velvet"], ["c14a09", "brick orange"], ["fe2f4a", "lightish red"], ["0203e2", "pure blue"], ["0a437a", "twilight blue"], ["a50055", "violet red"], ["ae8b0c", "yellowy brown"], ["fd798f", "carnation"], ["bfac05", "muddy yellow"], ["3eaf76", "dark seafoam green"], ["c74767", "deep rose"], ["b9484e", "dusty red"], ["647d8e", "grey/blue"], ["bffe28", "lemon lime"], ["d725de", "purple/pink"], ["b29705", "brown yellow"], ["673a3f", "purple brown"], ["a87dc2", "wisteria"], ["fafe4b", "banana yellow"], ["c0022f", "lipstick red"], ["0e87cc", "water blue"], ["8d8468", "brown grey"], ["ad03de", "vibrant purple"], ["8cff9e", "baby green"], ["94ac02", "barf green"], ["c4fff7", "eggshell blue"], ["fdee73", "sandy yellow"], ["33b864", "cool green"], ["fff9d0", "pale"], ["758da3", "blue/grey"], ["f504c9", "hot magenta"], ["77a1b5", "greyblue"], ["8756e4", "purpley"], ["889717", "baby shit green"], ["c27e79", "brownish pink"], ["017371", "dark aquamarine"], ["9f8303", "diarrhea"], ["f7d560", "light mustard"], ["bdf6fe", "pale sky blue"], ["75b84f", "turtle green"], ["9cbb04", "bright olive"], ["29465b", "dark grey blue"], ["696006", "greeny brown"], ["adf802", "lemon green"], ["c1c6fc", "light periwinkle"], ["35ad6b", "seaweed green"], ["fffd37", "sunshine yellow"], ["a442a0", "ugly purple"], ["f36196", "medium pink"], ["947706", "puke brown"], ["fff4f2", "very light pink"], ["1e9167", "viridian"], ["b5c306", "bile"], ["feff7f", "faded yellow"], ["cffdbc", "very pale green"], ["0add08", "vibrant green"], ["87fd05", "bright lime"], ["1ef876", "spearmint"], ["7bfdc7", "light aquamarine"], ["bcecac", "light sage"], ["bbf90f", "yellowgreen"], ["ab9004", "baby poo"], ["1fb57a", "dark seafoam"], ["00555a", "deep teal"], ["a484ac", "heather"], ["c45508", "rust orange"], ["3f829d", "dirty blue"], ["548d44", "fern green"], ["c95efb", "bright lilac"], ["3ae57f", "weird green"], ["016795", "peacock blue"], ["87a922", "avocado green"], ["f0944d", "faded orange"], ["5d1451", "grape purple"], ["25ff29", "hot green"], ["d0fe1d", "lime yellow"], ["ffa62b", "mango"], ["01b44c", "shamrock"], ["ff6cb5", "bubblegum"], ["6b4247", "purplish brown"], ["c7c10c", "vomit yellow"], ["b7fffa", "pale cyan"], ["aeff6e", "key lime"], ["ec2d01", "tomato red"], ["76ff7b", "lightgreen"], ["730039", "merlot"], ["040348", "night blue"], ["df4ec8", "purpleish pink"], ["6ecb3c", "apple"], ["8f9805", "baby poop green"], ["5edc1f", "green apple"], ["d94ff5", "heliotrope"], ["c8fd3d", "yellow/green"], ["070d0d", "almost black"], ["4984b8", "cool blue"], ["51b73b", "leafy green"], ["ac7e04", "mustard brown"], ["4e5481", "dusk"], ["876e4b", "dull brown"], ["58bc08", "frog green"], ["2fef10", "vivid green"], ["2dfe54", "bright light green"], ["0aff02", "fluro green"], ["9cef43", "kiwi"], ["18d17b", "seaweed"], ["35530a", "navy green"], ["1805db", "ultramarine blue"], ["6258c4", "iris"], ["ff964f", "pastel orange"], ["ffab0f", "yellowish orange"], ["8f8ce7", "perrywinkle"], ["24bca8", "tealish"], ["3f012c", "dark plum"], ["cbf85f", "pear"], ["ff724c", "pinkish orange"], ["280137", "midnight purple"], ["b36ff6", "light urple"], ["48c072", "dark mint"], ["bccb7a", "greenish tan"], ["a8415b", "light burgundy"], ["06b1c4", "turquoise blue"], ["cd7584", "ugly pink"], ["f1da7a", "sandy"], ["ff0490", "electric pink"], ["805b87", "muted purple"], ["50a747", "mid green"], ["a8a495", "greyish"], ["cfff04", "neon yellow"], ["ffff7e", "banana"], ["ff7fa7", "carnation pink"], ["ef4026", "tomato"], ["3c9992", "sea"], ["886806", "muddy brown"], ["04f489", "turquoise green"], ["fef69e", "buff"], ["cfaf7b", "fawn"], ["3b719f", "muted blue"], ["fdc1c5", "pale rose"], ["20c073", "dark mint green"], ["9b5fc0", "amethyst"], ["0f9b8e", "blue/green"], ["742802", "chestnut"], ["9db92c", "sick green"], ["a4bf20", "pea"], ["cd5909", "rusty orange"], ["ada587", "stone"], ["be013c", "rose red"], ["b8ffeb", "pale aqua"], ["dc4d01", "deep orange"], ["a2653e", "earth"], ["638b27", "mossy green"], ["419c03", "grassy green"], ["b1ff65", "pale lime green"], ["9dbcd4", "light grey blue"], ["fdfdfe", "pale grey"], ["77ab56", "asparagus"], ["464196", "blueberry"], ["990147", "purple red"], ["befd73", "pale lime"], ["32bf84", "greenish teal"], ["af6f09", "caramel"], ["a0025c", "deep magenta"], ["ffd8b1", "light peach"], ["7f4e1e", "milk chocolate"], ["bf9b0c", "ocher"], ["6ba353", "off green"], ["f075e6", "purply pink"], ["7bc8f6", "lightblue"], ["475f94", "dusky blue"], ["f5bf03", "golden"], ["fffeb6", "light beige"], ["fffd74", "butter yellow"], ["895b7b", "dusky purple"], ["436bad", "french blue"], ["d0c101", "ugly yellow"], ["c6f808", "greeny yellow"], ["f43605", "orangish red"], ["02c14d", "shamrock green"], ["b25f03", "orangish brown"], ["2a7e19", "tree green"], ["490648", "deep violet"], ["536267", "gunmetal"], ["5a06ef", "blue/purple"], ["cf0234", "cherry"], ["c4a661", "sandy brown"], ["978a84", "warm grey"], ["1f0954", "dark indigo"], ["03012d", "midnight"], ["2bb179", "bluey green"], ["c3909b", "grey pink"], ["a66fb5", "soft purple"], ["770001", "blood"], ["922b05", "brown red"], ["7d7f7c", "medium grey"], ["990f4b", "berry"], ["8f7303", "poo"], ["c83cb9", "purpley pink"], ["fea993", "light salmon"], ["acbb0d", "snot"], ["c071fe", "easter purple"], ["ccfd7f", "light yellow green"], ["00022e", "dark navy blue"], ["828344", "drab"], ["ffc5cb", "light rose"], ["ab1239", "rouge"], ["b0054b", "purplish red"], ["99cc04", "slime green"], ["937c00", "baby poop"], ["019529", "irish green"], ["ef1de7", "pink/purple"], ["000435", "dark navy"], ["42b395", "greeny blue"], ["9d5783", "light plum"], ["c8aca9", "pinkish grey"], ["c87606", "dirty orange"], ["aa2704", "rust red"], ["e4cbff", "pale lilac"], ["fa4224", "orangey red"], ["0804f9", "primary blue"], ["5cb200", "kermit green"], ["76424e", "brownish purple"], ["6c7a0e", "murky green"], ["fbdd7e", "wheat"], ["2a0134", "very dark purple"], ["044a05", "bottle green"], ["fd4659", "watermelon"], ["0d75f8", "deep sky blue"], ["fe0002", "fire engine red"], ["cb9d06", "yellow ochre"], ["fb7d07", "pumpkin orange"], ["b9cc81", "pale olive"], ["edc8ff", "light lilac"], ["61e160", "lightish green"], ["8ab8fe", "carolina blue"], ["920a4e", "mulberry"], ["fe02a2", "shocking pink"], ["9a3001", "auburn"], ["65fe08", "bright lime green"], ["befdb7", "celadon"], ["b17261", "pinkish brown"], ["885f01", "poo brown"], ["02ccfe", "bright sky blue"], ["c1fd95", "celery"], ["836539", "dirt brown"], ["fb2943", "strawberry"], ["84b701", "dark lime"], ["b66325", "copper"], ["7f5112", "medium brown"], ["5fa052", "muted green"], ["6dedfd", "robin's egg"], ["0bf9ea", "bright aqua"], ["c760ff", "bright lavender"], ["ffffcb", "ivory"], ["f6cefc", "very light purple"], ["155084", "light navy"], ["f5054f", "pink red"], ["645403", "olive brown"], ["7a5901", "poop brown"], ["a8b504", "mustard green"], ["3d9973", "ocean green"], ["000133", "very dark blue"], ["76a973", "dusty green"], ["2e5a88", "light navy blue"], ["0bf77d", "minty green"], ["bd6c48", "adobe"], ["ac1db8", "barney"], ["2baf6a", "jade green"], ["26f7fd", "bright light blue"], ["aefd6c", "light lime"], ["9b8f55", "dark khaki"], ["ffad01", "orange yellow"], ["c69c04", "ocre"], ["f4d054", "maize"], ["de9dac", "faded pink"], ["05480d", "british racing green"], ["c9ae74", "sandstone"], ["60460f", "mud brown"], ["98f6b0", "light sea green"], ["8af1fe", "robin egg blue"], ["2ee8bb", "aqua marine"], ["11875d", "dark sea green"], ["fdb0c0", "soft pink"], ["b16002", "orangey brown"], ["f7022a", "cherry red"], ["d5ab09", "burnt yellow"], ["86775f", "brownish grey"], ["c69f59", "camel"], ["7a687f", "purplish grey"], ["042e60", "marine"], ["c88d94", "greyish pink"], ["a5fbd5", "pale turquoise"], ["fffe71", "pastel yellow"], ["6241c7", "bluey purple"], ["fffe40", "canary yellow"], ["d3494e", "faded red"], ["985e2b", "sepia"], ["a6814c", "coffee"], ["ff08e8", "bright magenta"], ["9d7651", "mocha"], ["feffca", "ecru"], ["98568d", "purpleish"], ["9e003a", "cranberry"], ["287c37", "darkish green"], ["b96902", "brown orange"], ["ba6873", "dusky rose"], ["ff7855", "melon"], ["94b21c", "sickly green"], ["c5c9c7", "silver"], ["661aee", "purply blue"], ["6140ef", "purpleish blue"], ["9be5aa", "hospital green"], ["7b5804", "shit brown"], ["276ab3", "mid blue"], ["feb308", "amber"], ["8cfd7e", "easter green"], ["6488ea", "soft blue"], ["056eee", "cerulean blue"], ["b27a01", "golden brown"], ["0ffef9", "bright turquoise"], ["fa2a55", "red pink"], ["820747", "red purple"], ["7a6a4f", "greyish brown"], ["f4320c", "vermillion"], ["a13905", "russet"], ["6f828a", "steel grey"], ["a55af4", "lighter purple"], ["ad0afd", "bright violet"], ["004577", "prussian blue"], ["658d6d", "slate green"], ["ca7b80", "dirty pink"], ["005249", "dark blue green"], ["2b5d34", "pine"], ["bff128", "yellowy green"], ["b59410", "dark gold"], ["2976bb", "bluish"], ["014182", "darkish blue"], ["bb3f3f", "dull red"], ["fc2647", "pinky red"], ["a87900", "bronze"], ["82cbb2", "pale teal"], ["667c3e", "military green"], ["fe46a5", "barbie pink"], ["fe83cc", "bubblegum pink"], ["94a617", "pea soup green"], ["a88905", "dark mustard"], ["7f5f00", "shit"], ["9e43a2", "medium purple"], ["062e03", "very dark green"], ["8a6e45", "dirt"], ["cc7a8b", "dusky pink"], ["9e0168", "red violet"], ["fdff38", "lemon yellow"], ["c0fa8b", "pistachio"], ["eedc5b", "dull yellow"], ["7ebd01", "dark lime green"], ["3b5b92", "denim blue"], ["01889f", "teal blue"], ["3d7afd", "lightish blue"], ["5f34e7", "purpley blue"], ["6d5acf", "light indigo"], ["748500", "swamp green"], ["706c11", "brown green"], ["3c0008", "dark maroon"], ["cb00f5", "hot purple"], ["002d04", "dark forest green"], ["658cbb", "faded blue"], ["749551", "drab green"], ["b9ff66", "light lime green"], ["9dc100", "snot green"], ["faee66", "yellowish"], ["7efbb3", "light blue green"], ["7b002c", "bordeaux"], ["c292a1", "light mauve"], ["017b92", "ocean"], ["fcc006", "marigold"], ["657432", "muddy green"], ["d8863b", "dull orange"], ["738595", "steel"], ["aa23ff", "electric purple"], ["08ff08", "fluorescent green"], ["9b7a01", "yellowish brown"], ["f29e8e", "blush"], ["6fc276", "soft green"], ["ff5b00", "bright orange"], ["fdff52", "lemon"], ["866f85", "purple grey"], ["8ffe09", "acid green"], ["eecffe", "pale lavender"], ["510ac9", "violet blue"], ["4f9153", "light forest green"], ["9f2305", "burnt red"], ["728639", "khaki green"], ["de0c62", "cerise"], ["916e99", "faded purple"], ["ffb16d", "apricot"], ["3c4d03", "dark olive green"], ["7f7053", "grey brown"], ["77926f", "green grey"], ["010fcc", "true blue"], ["ceaefa", "pale violet"], ["8f99fb", "periwinkle blue"], ["c6fcff", "light sky blue"], ["5539cc", "blurple"], ["544e03", "green brown"], ["017a79", "bluegreen"], ["01f9c6", "bright teal"], ["c9b003", "brownish yellow"], ["929901", "pea soup"], ["0b5509", "forest"], ["a00498", "barney purple"], ["2000b1", "ultramarine"], ["94568c", "purplish"], ["c2be0e", "puke yellow"], ["748b97", "bluish grey"], ["665fd1", "dark periwinkle"], ["9c6da5", "dark lilac"], ["c44240", "reddish"], ["a24857", "light maroon"], ["825f87", "dusty purple"], ["c9643b", "terra cotta"], ["90b134", "avocado"], ["01386a", "marine blue"], ["25a36f", "teal green"], ["59656d", "slate grey"], ["75fd63", "lighter green"], ["21fc0d", "electric green"], ["5a86ad", "dusty blue"], ["fec615", "golden yellow"], ["fffd01", "bright yellow"], ["dfc5fe", "light lavender"], ["b26400", "umber"], ["7f5e00", "poop"], ["de7e5d", "dark peach"], ["048243", "jungle green"], ["ffffd4", "eggshell"], ["3b638c", "denim"], ["b79400", "yellow brown"], ["84597e", "dull purple"], ["411900", "chocolate brown"], ["7b0323", "wine red"], ["04d9ff", "neon blue"], ["667e2c", "dirty green"], ["fbeeac", "light tan"], ["d7fffe", "ice blue"], ["4e7496", "cadet blue"], ["874c62", "dark mauve"], ["d5ffff", "very light blue"], ["826d8c", "grey purple"], ["ffbacd", "pastel pink"], ["d1ffbd", "very light green"], ["448ee4", "dark sky blue"], ["05472a", "evergreen"], ["d5869d", "dull pink"], ["3d0734", "aubergine"], ["4a0100", "mahogany"], ["f8481c", "reddish orange"], ["02590f", "deep green"], ["89a203", "vomit green"], ["e03fd8", "purple pink"], ["d58a94", "dusty pink"], ["7bb274", "faded green"], ["526525", "camo green"], ["c94cbe", "pinky purple"], ["db4bda", "pink purple"], ["9e3623", "brownish red"], ["b5485d", "dark rose"], ["735c12", "mud"], ["9c6d57", "brownish"], ["028f1e", "emerald green"], ["b1916e", "pale brown"], ["49759c", "dull blue"], ["a0450e", "burnt umber"], ["39ad48", "medium green"], ["b66a50", "clay"], ["8cffdb", "light aqua"], ["a4be5c", "light olive green"], ["cb7723", "brownish orange"], ["05696b", "dark aqua"], ["ce5dae", "purplish pink"], ["c85a53", "dark salmon"], ["96ae8d", "greenish grey"], ["1fa774", "jade"], ["7a9703", "ugly green"], ["ac9362", "dark beige"], ["01a049", "emerald"], ["d9544d", "pale red"], ["fa5ff7", "light magenta"], ["82cafc", "sky"], ["acfffc", "light cyan"], ["fcb001", "yellow orange"], ["910951", "reddish purple"], ["fe2c54", "reddish pink"], ["c875c4", "orchid"], ["cdc50a", "dirty yellow"], ["fd411e", "orange red"], ["9a0200", "deep red"], ["be6400", "orange brown"], ["030aa7", "cobalt blue"], ["fe019a", "neon pink"], ["f7879a", "rose pink"], ["887191", "greyish purple"], ["b00149", "raspberry"], ["12e193", "aqua green"], ["fe7b7c", "salmon pink"], ["ff9408", "tangerine"], ["6a6e09", "brownish green"], ["8b2e16", "red brown"], ["696112", "greenish brown"], ["e17701", "pumpkin"], ["0a481e", "pine green"], ["343837", "charcoal"], ["ffb7ce", "baby pink"], ["6a79f7", "cornflower"], ["5d06e9", "blue violet"], ["3d1c02", "chocolate"], ["82a67d", "greyish green"], ["be0119", "scarlet"], ["c9ff27", "green yellow"], ["373e02", "dark olive"], ["a9561e", "sienna"], ["caa0ff", "pastel purple"], ["ca6641", "terracotta"], ["02d8e9", "aqua blue"], ["88b378", "sage green"], ["980002", "blood red"], ["cb0162", "deep pink"], ["5cac2d", "grass"], ["769958", "moss"], ["a2bffe", "pastel blue"], ["10a674", "bluish green"], ["06b48b", "green blue"], ["af884a", "dark tan"], ["0b8b87", "greenish blue"], ["ffa756", "pale orange"], ["a2a415", "vomit"], ["154406", "forrest green"], ["856798", "dark lavender"], ["34013f", "dark violet"], ["632de9", "purple blue"], ["0a888a", "dark cyan"], ["6f7632", "olive drab"], ["d46a7e", "pinkish"], ["1e488f", "cobalt"], ["bc13fe", "neon purple"], ["7ef4cc", "light turquoise"], ["76cd26", "apple green"], ["74a662", "dull green"], ["80013f", "wine"], ["b1d1fc", "powder blue"], ["ffffe4", "off white"], ["0652ff", "electric blue"], ["045c5a", "dark turquoise"], ["5729ce", "blue purple"], ["069af3", "azure"], ["ff000d", "bright red"], ["f10c45", "pinkish red"], ["5170d7", "cornflower blue"], ["acbf69", "light olive"], ["6c3461", "grape"], ["5e819d", "greyish blue"], ["601ef9", "purplish blue"], ["b0dd16", "yellowish green"], ["cdfd02", "greenish yellow"], ["2c6fbb", "medium blue"], ["c0737a", "dusty rose"], ["d6b4fc", "light violet"], ["020035", "midnight blue"], ["703be7", "bluish purple"], ["fd3c06", "red orange"], ["960056", "dark magenta"], ["40a368", "greenish"], ["03719c", "ocean blue"], ["fc5a50", "coral"], ["ffffc2", "cream"], ["7f2b0a", "reddish brown"], ["b04e0f", "burnt sienna"], ["a03623", "brick"], ["87ae73", "sage"], ["789b73", "grey green"], ["ffffff", "white"], ["98eff9", "robin's egg blue"], ["658b38", "moss green"], ["5a7d9a", "steel blue"], ["380835", "eggplant"], ["fffe7a", "light yellow"], ["5ca904", "leaf green"], ["d8dcd6", "light grey"], ["a5a502", "puke"], ["d648d7", "pinkish purple"], ["047495", "sea blue"], ["b790d4", "pale purple"], ["5b7c99", "slate blue"], ["607c8e", "blue grey"], ["0b4008", "hunter green"], ["ed0dd9", "fuchsia"], ["8c000f", "crimson"], ["ffff84", "pale yellow"], ["bf9005", "ochre"], ["d2bd0a", "mustard yellow"], ["ff474c", "light red"], ["0485d1", "cerulean"], ["ffcfdc", "pale pink"], ["040273", "deep blue"], ["a83c09", "rust"], ["90e4c1", "light teal"], ["516572", "slate"], ["fac205", "goldenrod"], ["d5b60a", "dark yellow"], ["363737", "dark grey"], ["4b5d16", "army green"], ["6b8ba4", "grey blue"], ["80f9ad", "seafoam"], ["a57e52", "puce"], ["a9f971", "spring green"], ["c65102", "dark orange"], ["e2ca76", "sand"], ["b0ff9d", "pastel green"], ["9ffeb0", "mint"], ["fdaa48", "light orange"], ["fe01b1", "bright pink"], ["c1f80a", "chartreuse"], ["36013f", "deep purple"], ["341c02", "dark brown"], ["b9a281", "taupe"], ["8eab12", "pea green"], ["9aae07", "puke green"], ["02ab2e", "kelly green"], ["7af9ab", "seafoam green"], ["137e6d", "blue green"], ["aaa662", "khaki"], ["610023", "burgundy"], ["014d4e", "dark teal"], ["8f1402", "brick red"], ["4b006e", "royal purple"], ["580f41", "plum"], ["8fff9f", "mint green"], ["dbb40c", "gold"], ["a2cffe", "baby blue"], ["c0fb2d", "yellow green"], ["be03fd", "bright purple"], ["840000", "dark red"], ["d0fefe", "pale blue"], ["3f9b0b", "grass green"], ["01153e", "navy"], ["04d8b2", "aquamarine"], ["c04e01", "burnt orange"], ["0cff0c", "neon green"], ["0165fc", "bright blue"], ["cf6275", "rose"], ["ffd1df", "light pink"], ["ceb301", "mustard"], ["380282", "indigo"], ["aaff32", "lime"], ["53fca1", "sea green"], ["8e82fe", "periwinkle"], ["cb416b", "dark pink"], ["677a04", "olive green"], ["ffb07c", "peach"], ["c7fdb5", "pale green"], ["ad8150", "light brown"], ["ff028d", "hot pink"], ["000000", "black"], ["cea2fd", "lilac"], ["001146", "navy blue"], ["0504aa", "royal blue"], ["e6daa6", "beige"], ["ff796c", "salmon"], ["6e750e", "olive"], ["650021", "maroon"], ["01ff07", "bright green"], ["35063e", "dark purple"], ["ae7181", "mauve"], ["06470c", "forest green"], ["13eac9", "aqua"], ["00ffff", "cyan"], ["d1b26f", "tan"], ["00035b", "dark blue"], ["c79fef", "lavender"], ["06c2ac", "turquoise"], ["033500", "dark green"], ["9a0eea", "violet"], ["bf77f6", "light purple"], ["89fe05", "lime green"], ["929591", "grey"], ["75bbfd", "sky blue"], ["ffff14", "yellow"], ["c20078", "magenta"], ["96f97b", "light green"], ["f97306", "orange"], ["029386", "teal"], ["95d0fc", "light blue"], ["e50000", "red"], ["653700", "brown"], ["ff81c0", "pink"], ["0343df", "blue"], ["15b01a", "green"], ["7e1e9c", "purple"], ["FF5E99", "paul irish pink"], ["00000000", "transparent"]];
    names.each(function(element) {
      return lookup[normalizeKey(element[1])] = parseHex(element[0]);
    });
    /**
    returns a random color.

    <code><pre>
    Color.random().toString()
    # => 'rgba(213, 144, 202, 1)'

    Color.random().toString()
    # => 'rgba(1, 211, 24, 1)'
    </pre></code>

    @name random
    @methodOf Color

    @returns {Color} A random color.
    */

    Color.random = function() {
      return Color(rand(256), rand(256), rand(256));
    };
    /**
    Mix two colors. Behaves just like `#mixWith` except that you are passing two colors.

    <code><pre>
    red = Color(255, 0, 0)
    yellow = Color(255, 255, 0)

    # With no amount argument the colors are mixed evenly
    orange = Color.mix(red, yellow)

    orange.toString()
    # => 'rgba(255, 128, 0, 1)'

    # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
    somethingCloseToOrange = Color.mix(red, yellow, 0.3)

    somethingCloseToOrange.toString()
    # => rgba(255, 179, 0, 1)
    </pre></code>

    @name mix
    @methodOf Color
    @see Color#mixWith
    @param {Color} color1 the first color to mix
    @param {Color} color2 the second color to mix
    @param {Number} amount the ratio to mix the colors

    @returns {Color} A new color that is the two colors mixed at the ratio defined by `amount`
    */

    Color.mix = function(color1, color2, amount) {
      var newColors;
      amount || (amount = 0.5);
      newColors = [color1.r, color1.g, color1.b, color1.a].zip([color2.r, color2.g, color2.b, color2.a]).map(function(array) {
        return (array[0] * amount) + (array[1] * (1 - amount));
      });
      return Color(newColors);
    };
    return (typeof exports !== "undefined" && exports !== null ? exports : this)["Color"] = Color;
  })();

}).call(this);
(function() {
  var __slice = [].slice;

  (function() {
    var Color, channelize, hslParser, hslToRgb, hsvToRgb, parseHSL, parseRGB, rgbParser;
    rgbParser = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d?\.?\d*)?\)$/;
    hslParser = /^hsla?\((\d{1,3}),\s*(\d?\.?\d*),\s*(\d?\.?\d*),?\s*(\d?\.?\d*)?\)$/;
    parseRGB = function(colorString) {
      var channel, channels, parsedColor;
      if (!(channels = rgbParser.exec(colorString))) {
        return void 0;
      }
      parsedColor = (function() {
        var _i, _len, _ref, _results;
        _ref = channels.slice(1, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push(parseFloat(channel));
        }
        return _results;
      })();
      if (isNaN(parsedColor[3])) {
        parsedColor[3] = 1;
      }
      return parsedColor;
    };
    parseHSL = function(colorString) {
      var channel, channels, parsedColor;
      if (!(channels = hslParser.exec(colorString))) {
        return void 0;
      }
      parsedColor = (function() {
        var _i, _len, _ref, _results;
        _ref = channels.slice(1, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push(parseFloat(channel));
        }
        return _results;
      })();
      if (isNaN(parsedColor[3])) {
        parsedColor[3] = 1;
      }
      return hslToRgb(parsedColor);
    };
    hsvToRgb = function(hsv) {
      var a, b, f, g, h, i, p, q, r, rgb, s, t, v;
      r = g = b = null;
      h = hsv[0], s = hsv[1], v = hsv[2], a = hsv[3];
      if (a == null) {
        a = 1;
      }
      i = (h / 60).floor();
      f = h / 60 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
      rgb = [(r * 255).round(), (g * 255).round(), (b * 255).round()];
      return rgb.concat(a);
    };
    hslToRgb = function(hsl) {
      var a, b, channel, g, h, hueToRgb, l, p, q, r, rgbMap, s;
      h = hsl[0], s = hsl[1], l = hsl[2], a = hsl[3];
      h = h % 360;
      if (a == null) {
        a = 1;
      }
      r = g = b = null;
      hueToRgb = function(p, q, hue) {
        hue = hue.mod(360);
        if (hue < 60) {
          return p + (q - p) * (hue / 60);
        }
        if (hue < 180) {
          return q;
        }
        if (hue < 240) {
          return p + (q - p) * ((240 - hue) / 60);
        }
        return p;
      };
      if (s === 0) {
        r = g = b = l;
      } else {
        q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        p = 2 * l - q;
        r = hueToRgb(p, q, h + 120);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 120);
      }
      rgbMap = (function() {
        var _i, _len, _ref, _results;
        _ref = [r, g, b];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push((channel * 255).round());
        }
        return _results;
      })();
      return rgbMap.concat(a);
    };
    channelize = function(color, alpha) {
      var channel, result;
      if (color.channels != null) {
        return color.channels();
      }
      if (Object.isArray(color)) {
        if (alpha != null) {
          alpha = parseFloat(alpha);
        } else if (color[3] != null) {
          alpha = parseFloat(color[3]);
        } else {
          alpha = 1;
        }
        result = ((function() {
          var _i, _len, _ref, _results;
          _ref = color.slice(0, 3);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            _results.push(parseFloat(channel));
          }
          return _results;
        })()).concat(alpha);
      } else {
        result = (typeof Color.lookup === "function" ? Color.lookup(color) : void 0) || color.parseHex() || parseRGB(color) || parseHSL(color);
        if (alpha != null) {
          result[3] = parseFloat(alpha);
        }
      }
      return result;
    };
    /**
    Create a new color. The constructor is very flexible. It accepts individual r, g, b, a values,
    arrays of r, g, b values, hex strings, rgb strings, hsl strings, other Color objects,
    and even the named colors from the xkcd survey: http://blog.xkcd.com/2010/05/03/color-survey-results/.
    If no arguments are given, defaults to transparent.

        individualRgb = Color(23, 56, 49, 0.4)

        arrayRgb = Color([59, 100, 230])

        hex = Color('#ff0000')

        rgb = Color('rgb(0, 255, 0)')

        hsl = Color('hsl(180, 1, 0.5)')

        anotherColor = Color('blue')

        Color(anotherColor)
        # => a new color with the same r, g, b, and alpha values as `anotherColor`

        # You have access to all sorts of weird colors.
        # We give you all the named colors the browser recognizes
        # and the ones from this survey
        # http://blog.xkcd.com/2010/05/03/color-survey-results/
        namedBrown = Color('Fuzzy Wuzzy Brown')

        # Uutput color in Hex format
        namedBrown.toHex()
        # => '#c45655'

        # Default behavior
        transparent = Color()

        transparent.toString()
        # => 'rgba(0, 0, 0, 0)'

        # let's print out the colors on a canvas to see what they look like
        canvas.font('14px Helvetica')
        for color, index in ['individualRgb', 'arrayRgb', 'hex', 'rgb', 'hsl', 'anotherColor', 'namedBrown']
          canvas.centerText
            color: eval(color)
            text: color
            y: 20 * (index + 1)

    @name Color
    @param {Array|Number|String|Color} args... An Array, r, g, b values,
    a sequence of numbers defining r, g, b values, a hex or hsl string, another Color object, or a named color
    @constructor
    */

    Color = function() {
      var args, parsedColor;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      parsedColor = (function() {
        switch (args.length) {
          case 0:
            return [0, 0, 0, 0];
          case 1:
            return channelize(args.first());
          case 2:
            return channelize(args.first(), args.last());
          default:
            return channelize(args);
        }
      })();
      if (!parsedColor) {
        throw "" + (args.join(',')) + " is an unknown color";
      }
      return {
        __proto__: Color.prototype,
        r: parsedColor[0].round(),
        g: parsedColor[1].round(),
        b: parsedColor[2].round(),
        a: parsedColor[3]
      };
    };
    Color.prototype = {
      /**
      Returns the rgba color channels in an array.

          transparent =  Color()

          transparent.channels()
          # => [0, 0, 0, 0]

          red = Color("#FF0000")

          red.channels()
          # => [255, 0, 0, 1]

          rgb = Color(200, 34, 2)

          rgb.channels()
          # => [200, 34, 2, 1]

      @name channels
      @methodOf Color#

      @returns {Array} Array of r, g, b, and alpha values of the color
      */

      channels: function() {
        return [this.r, this.g, this.b, this.a];
      },
      /**
      A copy of the calling color that is its complementary color on the color wheel.

          red = Color(255, 0, 0)

          cyan = red.complement()

          # to see what they look like
          for color, index in [red, cyan]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name complement
      @methodOf Color#

      @returns {Color} new color that is a copy of the calling color with its hue shifted by 180 degrees on the color wheel
      */

      complement: function() {
        return this.copy().complement$();
      },
      /**
      Modifies the calling color to make it the complement of its previous value.

          red = Color(255, 0, 0)

          # modifies red in place to make it into cyan
          red.complement$()

          red.toString()
          # => 'rgba(0, 255, 255, 1)'

      @name complement$
      @methodOf Color#

      @returns {Color} the color hue shifted by 180 degrees on the color wheel. Modifies the existing color.
      */

      complement$: function() {
        return this.shiftHue$(180);
      },
      /**
      A copy of the calling color.

          color = Color(0, 100, 200)

          copy = color.copy()

          color == copy
          # => false

          color.equal(copy)
          # => true

      @name copy
      @methodOf Color#

      @returns {Color} A new color. A copy of the calling color
      */

      copy: function() {
        return Color(this.r, this.g, this.b, this.a);
      },
      /**
      Returns a copy of the calling color darkened by `amount` (Lightness of the color ranges from 0 to 1).

          green = Color(0, 255, 0)

          darkGreen = green.darken(0.3)

          # to see what they look like
          for color, index in [green, darkGreen]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name darken
      @methodOf Color#
      @param {Number} amount Amount to darken color by (between 0 - 1)

      @returns {Color} A new color. The lightness value is reduced by `amount` from the original.
      */

      darken: function(amount) {
        return this.copy().darken$(amount);
      },
      /**
      Modifies the color so that it is darkened by `amount` (Lightness of the color ranges from 0 to 1).

          green = Color(0, 255, 0)

          # Modifies green to be darkGreen
          green.darken$(0.3)

          green.toString()
          # => 'rgba(0, 102, 0, 1)'

      @name darken$
      @methodOf Color#
      @param {Number} amount Amount to darken color by (between 0 - 1)

      @returns {Color} the color with the lightness value reduced by `amount`
      */

      darken$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[2] -= amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A copy of the calling color with its saturation reduced by `amount`.

          blue = Color(0, 0, 255)

          desaturatedBlue = blue.desaturate(0.4)

          # to see what they look like
          for color, index in [blue, desaturatedBlue]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name desaturate
      @methodOf Color#
      @param {Number} amount Amount to reduce color saturation by (between 0 and 1)

      @returns {Color} A copy of the color with the saturation value reduced by `amount`
      */

      desaturate: function(amount) {
        return this.copy().desaturate$(amount);
      },
      /**
      The modified color with its saturation reduced by `amount`.

          blue = Color(0, 0, 255)

          # modifies blue to be desaturatedBlue
          blue.desaturate$(0.4)

          blue.toString()
          # => 'rgba(38, 38, 217, 1)'

      @name desaturate$
      @methodOf Color#
      @param {Number} amount Amount to reduce color saturation by (between 0 and 1)

      @returns {Color} the color with the saturation value reduced by `amount`
      */

      desaturate$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[1] -= amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      Determine whether two colors are equal. Compares their r, g, b, and alpha values.

          hex = Color('#ffff00')
          rgb = Color(255, 255, 0)

          hex == rgb
          # => false

          hex.equal(rgb)
          # => true

      @name equal
      @methodOf Color#
      @param {Color} other the color to compare to the calling color

      @returns {Boolean} true if the r, g, b, a values of the colors agree, false otherwise
      */

      equal: function(other) {
        return other.r === this.r && other.g === this.g && other.b === this.b && other.a === this.a;
      },
      /**
      A copy of the calling color converted to grayscale.

          yellow = Color(255, 255, 0)

          gray = yellow.grayscale()

          # to see what they look like
          for color, index in [yellow, gray]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name grayscale
      @methodOf Color#

      @returns {Color} A copy of the calling color converted to grayscale.
      */

      grayscale: function() {
        return this.copy().grayscale$();
      },
      /**
      The calling color converted to grayscale.

          color = Color(255, 255, 0)

          # modifies color into gray
          color.grayscale$()

          color.toString()
          # => 'rgba(128, 128, 128, 1)'

      @name grayscale$
      @methodOf Color#

      @returns {Color} The calling color converted to grayscale.
      */

      grayscale$: function() {
        var g, hsl;
        hsl = this.toHsl();
        g = (hsl[2] * 255).round();
        this.r = this.g = this.b = g;
        return this;
      },
      /**
      A getter / setter for the hue value of the color. Passing no argument returns the
      current hue value. Passing a value will set the hue to that value and return the color.

          magenta = Color(255, 0, 255)

          magenta.hue()
          # => 300

          # modifies the color to be yellow
          magenta.hue(60)

          # to see what it looks like
          canvas.drawRect
            color: magenta
            x: 50
            y: 30
            width: 80
            height: 80

      @name hue
      @methodOf Color#
      @param {Number} [newVal] the new hue value

      @returns {Color|Number} returns the color object if you pass a new hue value and returns the hue otherwise
      */

      hue: function(newVal) {
        var hsl, _ref;
        hsl = this.toHsl();
        if (newVal != null) {
          hsl[0] = newVal;
          _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsl[0];
        }
      },
      /**
      A getter / setter for the lightness value of the color. Passing no argument returns the
      current lightness value. Passing a value will set the lightness to that value and return the color.

          magenta = Color(255, 0, 255)

          magenta.lightness()
          # => 0.9

          # modifies magenta in place to be lighter
          magenta.lightness(0.75)

          # to see what it looks like
          canvas.drawRect
            color: magenta
            x: 50
            y: 30
            width: 80
            height: 80

      @name lightness
      @methodOf Color#
      @param {Number} [newVal] the new lightness value

      @returns {Color|Number} returns the color object if you pass a new lightness value and returns the lightness otherwise
      */

      lightness: function(newVal) {
        var hsl, _ref;
        hsl = this.toHsl();
        if (newVal != null) {
          hsl[2] = newVal;
          _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsl[2];
        }
      },
      value: function(newVal) {
        var hsv, _ref;
        hsv = this.toHsv();
        if (newVal != null) {
          hsv[2] = newVal;
          _ref = hsvToRgb(hsv), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
          return this;
        } else {
          return hsv[2];
        }
      },
      /**
      A copy of the calling color with its hue shifted by `degrees`. This differs from the hue setter in that it adds to the existing hue value and will wrap around 0 and 360.

          magenta = Color(255, 0, 255)

          magenta.hue()
          # => 300

          yellow = magenta.shiftHue(120)

          # since magenta's hue is 300 we have wrapped
          # around 360 to end up at 60
          yellow.hue()
          # => 60

          # to see what they look like
          for color, index in [magenta, yellow]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name shiftHue
      @methodOf Color#
      @param {Number} degrees number of degrees to shift the hue on the color wheel.

      @returns {Color} A copy of the color with its hue shifted by `degrees`
      */

      shiftHue: function(degrees) {
        return this.copy().shiftHue$(degrees);
      },
      /**
      The calling color with its hue shifted by `degrees`. This differs from the hue setter in that it adds to the existing hue value and will wrap around 0 and 360.

          magenta = Color(255, 0, 255)

          magenta.hue()
          # => 300

          magenta.shiftHue$(120)

          # since magenta's hue is 300 we have wrapped
          # around 360 to end up at 60. Also we have
          # modified magenta in place to become yellow
          magenta.hue()
          # => 60

          magenta.toString()
          # => 'rgba(255, 255, 0, 1)'

      @name shiftHue$
      @methodOf Color#
      @param {Number} degrees number of degrees to shift the hue on the color wheel.

      @returns {Color} The color with its hue shifted by `degrees`
      */

      shiftHue$: function(degrees) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[0] = (hsl[0] + degrees.round()).mod(360);
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      Returns a copy of the calling color lightened by `amount` (Lightness of the color ranges from 0 to 1).

          green = Color(0, 255, 0)

          lightGreen = green.lighten(0.3)

          # to see what they look like
          for color, index in [green, lightGreen]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name lighten
      @methodOf Color#
      @param {Number} amount Amount to lighten color by (between 0 to 1)

      @returns {Color} A new color. The lightness value is increased by `amount` from the original.
      */

      lighten: function(amount) {
        return this.copy().lighten$(amount);
      },
      /**
      The calling color lightened by `amount` (Lightness of the color ranges from 0 to 1).

          green = Color(0, 255, 0)

          green.lighten$(0.2)

          # we have modified green in place
          # to become lightGreen
          green.toString()
          # => 'rgba(102, 255, 102, 1)'

      @name lighten$
      @methodOf Color#
      @param {Number} amount Amount to lighten color by (between 0 - 1)

      @returns {Color} The calling color with its lightness value increased by `amount`.
      */

      lighten$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[2] += amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A copy of the calling color mixed with `other` using `amount` as the
      mixing ratio. If amount is not passed, then the colors are mixed evenly.

          red = Color(255, 0, 0)
          yellow = Color(255, 255, 0)

          # With no amount argument the colors are mixed evenly
          orange = red.mixWith(yellow)

          # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
          somethingCloseToOrange = red.mixWith(yellow, 0.3)

          # to see what they look like
          for color, index in [red, yellow, orange, somethingCloseToOrange]
            canvas.drawRect
              color: color
              x: 20 + (60 * (index % 2))
              y: 20 + (60 * (if index > 1 then 1 else 0))
              width: 60
              height: 60

      @name mixWith
      @methodOf Color#
      @param {Color} other the other color to mix
      @param {Number} [amount] the mixing ratio of the calling color to `other`

      @returns {Color} A new color that is a mix of the calling color and `other`
      */

      mixWith: function(other, amount) {
        return this.copy().mixWith$(other, amount);
      },
      /**
      A copy of the calling color mixed with `other` using `amount` as the
      mixing ratio. If amount is not passed, then the colors are mixed evenly.

          red = Color(255, 0, 0)
          yellow = Color(255, 255, 0)
          anotherRed = Color(255, 0, 0)

          # With no amount argument the colors are mixed evenly
          red.mixWith$(yellow)

          # We have modified red in place to be orange
          red.toString()
          # => 'rgba(255, 128, 0, 1)'

          # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
          anotherRed.mixWith$(yellow, 0.3)

          # We have modified `anotherRed` in place to be somethingCloseToOrange
          anotherRed.toString()
          # => rgba(255, 179, 0, 1)

      @name mixWith$
      @methodOf Color#
      @param {Color} other the other color to mix
      @param {Number} [amount] the mixing ratio of the calling color to `other`

      @returns {Color} The modified calling color after mixing it with `other`
      */

      mixWith$: function(other, amount) {
        var _ref, _ref1;
        amount || (amount = 0.5);
        _ref = [this.r, this.g, this.b, this.a].zip([other.r, other.g, other.b, other.a]).map(function(array) {
          return (array[0] * amount) + (array[1] * (1 - amount));
        }), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        _ref1 = [this.r, this.g, this.b].map(function(color) {
          return color.round();
        }), this.r = _ref1[0], this.g = _ref1[1], this.b = _ref1[2];
        return this;
      },
      /**
      A copy of the calling color with its saturation increased by `amount`.

          color = Color(50, 50, 200)

          color.saturation()
          # => 0.6

          saturatedColor = color.saturate(0.2)

          saturatedColor.saturation()
          # => 0.8

          # to see what they look like
          for color, index in [color, saturatedColor]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name saturate
      @methodOf Color#
      @param {Number} amount the amount to increase saturation by

      @returns {Color} A copy of the calling color with its saturation increased by `amount`
      */

      saturate: function(amount) {
        return this.copy().saturate$(amount);
      },
      /**
      The calling color with its saturation increased by `amount`.

          color = Color(50, 50, 200)

          color.saturation()
          # => 0.6

          color.saturate$(0.2)

          # We have modified color in place and increased its saturation to 0.8
          color.saturation()
          # => 0.8

          color.toString()
          # => rgba(25, 25, 225, 1)

      @name saturate$
      @methodOf Color#
      @param {Number} amount the amount to increase saturation by

      @returns {Color} The calling color with its saturation increased by `amount`
      */

      saturate$: function(amount) {
        var hsl, _ref;
        hsl = this.toHsl();
        hsl[1] += amount;
        _ref = hslToRgb(hsl), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
        return this;
      },
      /**
      A getter / setter for the saturation value of the color. Passing no argument returns the
      current saturation value. Passing a value will set the saturation to that value and return the color.

          yellow = Color('hsl(60, 0.5, 0.5)')

          yellow.saturation()
          # => 0.5

          yellow.saturation(0.8)

          # to see what it looks like
          canvas.drawRect
            color: yellow
            x: 50
            y: 30
            width: 80
            height: 80

      @name saturation
      @methodOf Color#
      @param {Number} [newVal] the new saturation value

      @returns {Color|Number} returns the color object if you pass a new saturation value and returns the saturation otherwise
      */

      saturation: function(newVal, mode) {
        var hsl, hsv, _ref, _ref1;
        if (mode === 'hsv') {
          hsv = this.toHsv();
          if (newVal != null) {
            hsv[1] = newVal;
            _ref = hsvToRgb(hsv), this.r = _ref[0], this.g = _ref[1], this.b = _ref[2], this.a = _ref[3];
            return this;
          } else {
            return hsv[1];
          }
        } else {
          hsl = this.toHsl();
          if (newVal != null) {
            hsl[1] = newVal;
            _ref1 = hslToRgb(hsl), this.r = _ref1[0], this.g = _ref1[1], this.b = _ref1[2], this.a = _ref1[3];
            return this;
          } else {
            return hsl[1];
          }
        }
      },
      /**
      returns the Hex representation of the color. Exclude the leading `#` by passing false.

          color = Color('hsl(60, 1, 0.5)')

          # passing nothing will leave the `#` intact
          color.toHex()
          # => '#ffff00'

          # passing false will remove the `#`
          color.toHex(false)
          # => 'ffff00'

      @name toHex
      @methodOf Color#
      @param {Boolean} [leadingHash] if passed as false excludes the leading `#` from the string

      @returns {String} returns the Hex representation of the color
      */

      toHex: function(leadingHash) {
        var hexFromNumber, padString;
        padString = function(hexString) {
          var pad;
          if (hexString.length === 1) {
            pad = "0";
          } else {
            pad = "";
          }
          return pad + hexString;
        };
        hexFromNumber = function(number) {
          return padString(number.toString(16));
        };
        if (leadingHash === false) {
          return "" + (hexFromNumber(this.r)) + (hexFromNumber(this.g)) + (hexFromNumber(this.b));
        } else {
          return "#" + (hexFromNumber(this.r)) + (hexFromNumber(this.g)) + (hexFromNumber(this.b));
        }
      },
      /**
      returns an array of the hue, saturation, lightness, and alpha values of the color.

          magenta = Color(255, 0, 255)

          magenta.toHsl()
          # => [300, 1, 0.5, 1]

      @name toHsl
      @methodOf Color#

      @returns {Array} An array of the hue, saturation, lightness, and alpha values of the color.
      */

      toHsl: function() {
        var b, channel, chroma, g, hue, lightness, max, min, r, saturation, _ref, _ref1;
        _ref = (function() {
          var _i, _len, _ref, _results;
          _ref = [this.r, this.g, this.b];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            _results.push(channel / 255);
          }
          return _results;
        }).call(this), r = _ref[0], g = _ref[1], b = _ref[2];
        _ref1 = [r, g, b].extremes(), min = _ref1.min, max = _ref1.max;
        hue = saturation = lightness = (max + min) / 2;
        chroma = max - min;
        if (chroma.abs() < 0.00001) {
          hue = saturation = 0;
        } else {
          saturation = lightness > 0.5 ? chroma / (1 - lightness) : chroma / lightness;
          saturation /= 2;
          switch (max) {
            case r:
              hue = ((g - b) / chroma) + 0;
              break;
            case g:
              hue = ((b - r) / chroma) + 2;
              break;
            case b:
              hue = ((r - g) / chroma) + 4;
          }
          hue = (hue * 60).mod(360);
        }
        return [hue, saturation, lightness, this.a];
      },
      toHsv: function() {
        var b, d, g, h, max, min, r, s, v, _ref;
        r = this.r / 255;
        g = this.g / 255;
        b = this.b / 255;
        _ref = [r, g, b].extremes(), min = _ref.min, max = _ref.max;
        h = s = v = max;
        d = max - min;
        s = (max === 0 ? 0 : d / max);
        if (max === min) {
          h = 0;
        } else {
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
          }
          h *= 60;
        }
        return [h, s, v];
      },
      /**
      returns string rgba representation of the color.

          red = Color('#ff0000')

          red.toString()
          # => 'rgba(255, 0, 0, 1)'

      @name toString
      @methodOf Color#

      @returns {String} The rgba string representation of the color
      */

      toString: function() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
      },
      /**
      A copy of the calling color with its alpha reduced by `amount`.

          color = Color(0, 0, 0, 1)

          color.a
          # => 1

          transparentColor = color.transparentize(0.5)

          transparentColor.a
          # => 0.5

          # to see what they look like
          for color, index in [color, transparentColor]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name transparentize
      @methodOf Color#

      @returns {Color} A copy of the calling color with its alpha reduced by `amount`
      */

      transparentize: function(amount) {
        return this.copy().transparentize$(amount);
      },
      /**
      The calling color with its alpha reduced by `amount`.

          color = Color(0, 0, 0, 1)

          color.a
          # => 1

          # We modify color in place
          color.transparentize$(0.5)

          color.a
          # => 0.5

      @name transparentize$
      @methodOf Color#

      @returns {Color} The calling color with its alpha reduced by `amount`
      */

      transparentize$: function(amount) {
        this.a = (this.a - amount).clamp(0, 1);
        return this;
      },
      /**
      A copy of the calling color with its alpha increased by `amount`.

          color = Color(0, 0, 0, 0.25)

          color.a
          # => 0.25

          opaqueColor = color.opacify(0.5)

          opaqueColor.a
          # => 0.75

          # to see what they look like
          for color, index in [color, opaqueColor]
            canvas.drawRect
              color: color
              x: 20 + (60 * index)
              y: 20 + (60 * index)
              width: 60
              height: 60

      @name opacify
      @methodOf Color#

      @returns {Color} A copy of the calling color with its alpha increased by `amount`
      */

      opacify: function(amount) {
        return this.copy().opacify$(amount);
      },
      /**
      The calling color with its alpha increased by `amount`.

          color = Color(0, 0, 0, 0)

          color.a
          # => 0

          # We modify color in place
          color.opacify$(0.25)

          color.a
          # => 0.25

      @name opacify$
      @methodOf Color#

      @returns {Color} The calling color with its alpha increased by `amount`
      */

      opacify$: function(amount) {
        this.a = (this.a + amount).clamp(0, 1);
        return this;
      }
    };
    /**
    returns a random color.

        Color.random().toString()
        # => 'rgba(213, 144, 202, 1)'

        Color.random().toString()
        # => 'rgba(1, 211, 24, 1)'

    @name random
    @methodOf Color

    @returns {Color} A random color.
    */

    Color.random = function() {
      return Color(rand(256), rand(256), rand(256));
    };
    /**
    Mix two colors. Behaves just like `#mixWith` except that you are passing two colors.

        red = Color(255, 0, 0)
        yellow = Color(255, 255, 0)

        # With no amount argument the colors are mixed evenly
        orange = Color.mix(red, yellow)

        orange.toString()
        # => 'rgba(255, 128, 0, 1)'

        # With an amount of 0.3 we are mixing the color 30% red and 70% yellow
        somethingCloseToOrange = Color.mix(red, yellow, 0.3)

        somethingCloseToOrange.toString()
        # => rgba(255, 179, 0, 1)

    @name mix
    @methodOf Color
    @see Color#mixWith
    @param {Color} color1 the first color to mix
    @param {Color} color2 the second color to mix
    @param {Number} amount the ratio to mix the colors

    @returns {Color} A new color that is the two colors mixed at the ratio defined by `amount`
    */

    Color.mix = function(color1, color2, amount) {
      var newColors;
      amount || (amount = 0.5);
      newColors = [color1.r, color1.g, color1.b, color1.a].zip([color2.r, color2.g, color2.b, color2.a]).map(function(array) {
        return (array[0] * amount) + (array[1] * (1 - amount));
      });
      return Color(newColors);
    };
    return (typeof exports !== "undefined" && exports !== null ? exports : this)["Color"] = Color;
  })();

}).call(this);
(function() {

  window.ColorUtil = {
    additive: function(c1, c2) {
      var A, B, G, R, a, ax, b, bx, g, gx, r, rx, _ref, _ref1;
      _ref = c1.channels(), R = _ref[0], G = _ref[1], B = _ref[2], A = _ref[3];
      _ref1 = c2.channels(), r = _ref1[0], g = _ref1[1], b = _ref1[2], a = _ref1[3];
      if (a === 0) {
        return c1;
      }
      if (A === 0) {
        return c2;
      }
      ax = 1 - (1 - a) * (1 - A);
      rx = (r * a / ax + R * A * (1 - a) / ax).round().clamp(0, 255);
      gx = (g * a / ax + G * A * (1 - a) / ax).round().clamp(0, 255);
      bx = (b * a / ax + B * A * (1 - a) / ax).round().clamp(0, 255);
      return Color(rx, gx, bx, ax);
    },
    replace: function(c1, c2) {
      return c2;
    }
  };

}).call(this);
(function() {

  namespace("Pixie.Editor.Pixel", function(Pixel) {
    return Pixel.config = {
      DEBUG: false,
      IMAGE_DIR: "/assets/pixie/editor/pixel/"
    };
  });

}).call(this);
(function() {

  namespace("Pixie.Editor.Pixel", function(Pixel) {
    return Pixel.actions = (function($) {
      var actions;
      return actions = {
        guides: {
          hotkeys: ['g'],
          menu: false,
          perform: function(canvas) {
            return canvas.toggleGuides();
          },
          undoable: false
        },
        undo: {
          hotkeys: ['ctrl+z', 'meta+z'],
          perform: function(canvas) {
            return canvas.undo();
          },
          undoable: false
        },
        redo: {
          hotkeys: ["ctrl+y", "meta+z"],
          perform: function(canvas) {
            return canvas.redo();
          },
          undoable: false
        },
        clear: {
          perform: function(canvas) {
            return canvas.clear();
          }
        },
        resize: {
          perform: function(canvas) {
            var newSize, x, y, _ref;
            if (newSize = prompt('New Dimensions', "" + (canvas.width()) + "x" + (canvas.height()))) {
              if (!/\d+x\d+$/.test(newSize)) {
                return alert("Please specify a width x height");
              }
              _ref = newSize.split('x'), x = _ref[0], y = _ref[1];
              return canvas.resize(parseInt(x), parseInt(y), true);
            }
          }
        },
        preview: {
          menu: false,
          perform: function(canvas) {
            return canvas.preview();
          },
          undoable: false
        },
        opacify: {
          hotkeys: ["+", "="],
          menu: false,
          perform: function(canvas) {
            return canvas.opacity(canvas.opacity() + 0.1);
          },
          undoable: false
        },
        transparentize: {
          hotkeys: ["-"],
          menu: false,
          perform: function(canvas) {
            return canvas.opacity(canvas.opacity() - 0.1);
          },
          undoable: false
        },
        left: {
          hotkeys: ["left"],
          menu: false,
          perform: function(canvas) {
            var deferredColors;
            deferredColors = [];
            canvas.height().times(function(y) {
              return deferredColors[y] = canvas.getPixel(0, y).color();
            });
            canvas.eachPixel(function(pixel, x, y) {
              var rightPixel;
              rightPixel = canvas.getPixel(x + 1, y);
              if (rightPixel) {
                return pixel.color(rightPixel.color(), 'replace');
              } else {
                return pixel.color(Color(), 'replace');
              }
            });
            return deferredColors.each(function(color, y) {
              return canvas.getPixel(canvas.width() - 1, y).color(color);
            });
          }
        },
        right: {
          hotkeys: ["right"],
          menu: false,
          perform: function(canvas) {
            var currentPixel, deferredColors, height, leftPixel, width, x, y;
            width = canvas.width();
            height = canvas.height();
            deferredColors = [];
            height.times(function(y) {
              return deferredColors[y] = canvas.getPixel(width - 1, y).color();
            });
            x = width - 1;
            while (x >= 0) {
              y = 0;
              while (y < height) {
                currentPixel = canvas.getPixel(x, y);
                leftPixel = canvas.getPixel(x - 1, y);
                if (leftPixel) {
                  currentPixel.color(leftPixel.color(), "replace");
                } else {
                  currentPixel.color(Color(), "replace");
                }
                y++;
              }
              x--;
            }
            return $.each(deferredColors, function(y, color) {
              return canvas.getPixel(0, y).color(color);
            });
          }
        },
        up: {
          hotkeys: ["up"],
          menu: false,
          perform: function(canvas) {
            var deferredColors;
            deferredColors = [];
            canvas.width().times(function(x) {
              return deferredColors[x] = canvas.getPixel(x, 0).color();
            });
            canvas.eachPixel(function(pixel, x, y) {
              var lowerPixel;
              lowerPixel = canvas.getPixel(x, y + 1);
              if (lowerPixel) {
                return pixel.color(lowerPixel.color(), "replace");
              } else {
                return pixel.color(Color(), "replace");
              }
            });
            return $.each(deferredColors, function(x, color) {
              return canvas.getPixel(x, canvas.height() - 1).color(color);
            });
          }
        },
        down: {
          hotkeys: ["down"],
          menu: false,
          perform: function(canvas) {
            var currentPixel, deferredColors, height, upperPixel, width, x, y;
            width = canvas.width();
            height = canvas.height();
            deferredColors = [];
            canvas.width().times(function(x) {
              return deferredColors[x] = canvas.getPixel(x, height - 1).color();
            });
            x = 0;
            while (x < width) {
              y = height - 1;
              while (y >= 0) {
                currentPixel = canvas.getPixel(x, y);
                upperPixel = canvas.getPixel(x, y - 1);
                if (upperPixel) {
                  currentPixel.color(upperPixel.color(), "replace");
                } else {
                  currentPixel.color(Color(), "replace");
                }
                y--;
              }
              x++;
            }
            return $.each(deferredColors, function(x, color) {
              return canvas.getPixel(x, 0).color(color);
            });
          }
        }
      };
    })(jQuery);
  });

}).call(this);
(function() {

  namespace("Pixie.Editor.Pixel", function(Pixel) {
    return Pixel.Layer = function(I) {
      var context, layer, layerElement, layerHeight, layerWidth;
      layer = $("<canvas />", {
        "class": "layer"
      });
      layerWidth = function() {
        return I.width * I.pixelWidth;
      };
      layerHeight = function() {
        return I.height * I.pixelHeight;
      };
      layerElement = layer.get(0);
      layerElement.width = layerWidth();
      layerElement.height = layerHeight();
      context = layerElement.getContext("2d");
      return Object.extend(layer, {
        context: context,
        resize: function() {
          layerElement.width = layerWidth();
          return layerElement.height = layerHeight();
        }
      });
    };
  });

}).call(this);
(function() {

  Pixie.Editor.Pixel.palette = ["#000000", "#FFFFFF", "#666666", "#DCDCDC", "#EB070E", "#F69508", "#FFDE49", "#388326", "#0246E3", "#563495", "#58C4F5", "#E5AC99", "#5B4635", "#FFFEE9"];

}).call(this);
(function() {
  var Pixel;

  Pixel = function(I) {
    var changed, color, oldColor, self, x, y;
    if (I == null) {
      I = {};
    }
    x = I.x, y = I.y, color = I.color, oldColor = I.oldColor, changed = I.changed;
    color || (color = Color(0, 0, 0, 0));
    oldColor || (oldColor = Color(0, 0, 0, 0));
    return self = {
      color: function(newColor, blendMode) {
        if (blendMode == null) {
          blendMode = "additive";
        }
        if (arguments.length >= 1) {
          oldColor = color;
          newColor = Color(newColor);
          color = ColorUtil[blendMode](oldColor, newColor);
          if (typeof changed === "function") {
            changed(self);
          }
          return self;
        } else {
          return color;
        }
      },
      oldColor: function() {
        return oldColor;
      },
      x: x,
      y: y,
      toString: function() {
        return "[Pixel: " + [x, y].join(",") + "]";
      }
    };
  };

  Pixie.Editor.Pixel.Pixel = Pixel;

}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["pixie/editor/pixel/templates/pixel"] = (function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='editor pixie'>\n  <div class='content'>\n    <div class='actions'></div>\n    <div class='cursor_position'>x: 0 y: 0</div>\n    <div class='viewport'>\n      <div class='canvas'></div>\n    </div>\n    <div class='left module toolbar'></div>\n    <div class='module right'>\n      <div class='color_picker_holder'></div>\n      <div class='toolbar'>\n        <div class='swatches'></div>\n      </div>\n      <hr>\n      <div class='preview'></div>\n      <label class='opacityLabel'>\n        <h4>Opacity</h4>\n        <input class='opacity' type='number' min='0' max='100' step='5' value='100'>\n      </label>\n    </div>\n  </div>\n</div>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  });;
}).call(this);
(function() {

  namespace("Pixie.Editor.Pixel", function(Pixel) {
    var circle, colorNeighbors, erase, floodFill, line, pencilTool, tools;
    colorNeighbors = function(color) {
      this.color(color);
      return this.canvas.getNeighbors(this.x, this.y).each(function(neighbor) {
        return neighbor != null ? neighbor.color(color) : void 0;
      });
    };
    erase = function(pixel, opacity) {
      var inverseOpacity, pixelColor;
      inverseOpacity = 1 - opacity;
      pixelColor = pixel.color();
      return pixel.color(Color(pixelColor.toString(), pixelColor.a * inverseOpacity), "replace");
    };
    floodFill = function(e, newColor, pixel) {
      var canvas, neighbors, originalColor, q;
      originalColor = this.color();
      if (newColor.equal(originalColor)) {
        return;
      }
      q = [];
      pixel.color(newColor);
      q.push(pixel);
      canvas = this.canvas;
      while (q.length) {
        pixel = q.pop();
        neighbors = canvas.getNeighbors(pixel.x, pixel.y);
        neighbors.each(function(neighbor) {
          if (neighbor != null ? neighbor.color().equal(originalColor) : void 0) {
            neighbor.color(newColor);
            return q.push(neighbor);
          }
        });
      }
    };
    circle = function(canvas, color, center, endPoint) {
      var ddFx, ddFy, f, radius, x, x0, x1, y, y0, y1, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
      x0 = center.x, y0 = center.y;
      x1 = endPoint.x, y1 = endPoint.y;
      radius = endPoint.subtract(center).magnitude().floor();
      f = 1 - radius;
      ddFx = 1;
      ddFy = -2 * radius;
      x = 0;
      y = radius;
      if ((_ref = canvas.getPixel(x0, y0 + radius)) != null) {
        _ref.color(color);
      }
      if ((_ref1 = canvas.getPixel(x0, y0 - radius)) != null) {
        _ref1.color(color);
      }
      if ((_ref2 = canvas.getPixel(x0 + radius, y0)) != null) {
        _ref2.color(color);
      }
      if ((_ref3 = canvas.getPixel(x0 - radius, y0)) != null) {
        _ref3.color(color);
      }
      _results = [];
      while (x < y) {
        if (f > 0) {
          y--;
          ddFy += 2;
          f += ddFy;
        }
        x++;
        ddFx += 2;
        f += ddFx;
        if ((_ref4 = canvas.getPixel(x0 + x, y0 + y)) != null) {
          _ref4.color(color);
        }
        if ((_ref5 = canvas.getPixel(x0 - x, y0 + y)) != null) {
          _ref5.color(color);
        }
        if ((_ref6 = canvas.getPixel(x0 + x, y0 - y)) != null) {
          _ref6.color(color);
        }
        if ((_ref7 = canvas.getPixel(x0 - x, y0 - y)) != null) {
          _ref7.color(color);
        }
        if ((_ref8 = canvas.getPixel(x0 + y, y0 + x)) != null) {
          _ref8.color(color);
        }
        if ((_ref9 = canvas.getPixel(x0 - y, y0 + x)) != null) {
          _ref9.color(color);
        }
        if ((_ref10 = canvas.getPixel(x0 + y, y0 - x)) != null) {
          _ref10.color(color);
        }
        _results.push((_ref11 = canvas.getPixel(x0 - y, y0 - x)) != null ? _ref11.color(color) : void 0);
      }
      return _results;
    };
    line = function(canvas, color, p0, p1) {
      var dx, dy, e2, err, sx, sy, x0, x1, y0, y1, _results;
      x0 = p0.x, y0 = p0.y;
      x1 = p1.x, y1 = p1.y;
      dx = (x1 - x0).abs();
      dy = (y1 - y0).abs();
      sx = (x1 - x0).sign();
      sy = (y1 - y0).sign();
      err = dx - dy;
      _results = [];
      while (!(x0 === x1 && y0 === y1)) {
        e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
        _results.push(canvas.getPixel(x0, y0).color(color));
      }
      return _results;
    };
    pencilTool = (function() {
      var center, lastPosition;
      center = Point(0, 0);
      lastPosition = Point(0, 0);
      return {
        hotkeys: ['p', '1'],
        mousedown: function(e, color) {
          var currentPosition;
          currentPosition = Point(this.x, this.y);
          if (e.shiftKey) {
            line(this.canvas, color, lastPosition, currentPosition);
          } else if (e.altKey) {
            circle(this.canvas, color, center, currentPosition);
          } else {
            this.color(color);
            center = Point(this.x, this.y);
          }
          return lastPosition = currentPosition;
        },
        mouseenter: function(e, color) {
          var currentPosition;
          currentPosition = Point(this.x, this.y);
          line(this.canvas, color, lastPosition, currentPosition);
          return lastPosition = currentPosition;
        }
      };
    })();
    return Pixel.tools = tools = {
      pencil: pencilTool,
      mirror_pencil: {
        hotkeys: ['m', '2'],
        mousedown: function(e, color) {
          var mirrorCoordinate;
          mirrorCoordinate = this.canvas.width() - this.x - 1;
          this.color(color);
          return this.canvas.getPixel(mirrorCoordinate, this.y).color(color);
        },
        mouseenter: function(e, color) {
          var mirrorCoordinate;
          mirrorCoordinate = this.canvas.width() - this.x - 1;
          this.color(color);
          return this.canvas.getPixel(mirrorCoordinate, this.y).color(color);
        }
      },
      brush: {
        hotkeys: ['b', '3'],
        mousedown: function(e, color) {
          return colorNeighbors.call(this, color);
        },
        mouseenter: function(e, color) {
          return colorNeighbors.call(this, color);
        }
      },
      dropper: {
        hotkeys: ['i', '4'],
        mousedown: function(e) {
          this.canvas.color(this.color());
          if (!e.shiftKey) {
            return this.canvas.setTool(tools.pencil);
          }
        }
      },
      eraser: {
        hotkeys: ['e', '5'],
        mousedown: function(e, color, pixel) {
          return erase(pixel, color.a);
        },
        mouseenter: function(e, color, pixel) {
          return erase(pixel, color.a);
        }
      },
      fill: {
        hotkeys: ['f', '6'],
        mousedown: floodFill,
        mouseenter: floodFill
      },
      zoom_in: {
        hotkeys: ['z', '7'],
        mousedown: function() {
          return this.canvas.zoomIn();
        }
      },
      zoom_out: {
        hotkeys: ['shift+z', '8'],
        mousedown: function() {
          return this.canvas.zoomOut();
        }
      }
    };
  });

}).call(this);
(function() {

  window.UndoStack = function() {
    var empty, redos, undos;
    undos = [];
    redos = [];
    empty = true;
    return {
      last: function() {
        return undos[undos.length - 1];
      },
      popUndo: function() {
        var undo;
        undo = undos.pop();
        if (undo) {
          redos.push(undo);
        }
        return undo;
      },
      popRedo: function() {
        var redo;
        redo = redos.pop();
        if (redo) {
          undos.push(redo);
        }
        return redo;
      },
      next: function() {
        var last;
        last = this.last();
        if (!last || !empty) {
          undos.push({});
          empty = true;
          return redos = [];
        }
      },
      add: function(object, data) {
        var last;
        last = this.last();
        if (!last) {
          this.next();
          last = this.last();
        }
        if (last[object]) {
          last[object].newColor = data.newColor;
        } else {
          last[object] = data;
          empty = false;
        }
        return this;
      },
      replayData: function() {
        var replayData;
        replayData = [];
        $.each(undos, function(i, items) {
          replayData[i] = [];
          return $.each(items, function(key, data) {
            var pixel;
            pixel = data.pixel;
            return replayData[i].push({
              x: pixel.x,
              y: pixel.y,
              color: data.newColor.toString()
            });
          });
        });
        return replayData;
      }
    };
  };

}).call(this);
(function() {

  namespace("Pixie.Editor.Pixel", function(Pixel) {
    return Pixel.Undo = function(I, self) {
      var lastClean, noUndo, undoStack;
      undoStack = UndoStack();
      noUndo = 0;
      lastClean = void 0;
      Object.extend(self, {
        addUndoData: function(pixel, oldColor, newColor) {
          if (!noUndo) {
            return undoStack.add(pixel, {
              pixel: pixel,
              oldColor: oldColor,
              newColor: newColor
            });
          }
        },
        dirty: function(newDirty) {
          if (newDirty != null) {
            if (newDirty === false) {
              lastClean = undoStack.last();
            }
            return this;
          } else {
            return lastClean !== undoStack.last();
          }
        },
        getReplayData: function() {
          return undoStack.replayData();
        },
        nextUndo: function() {
          return undoStack.next();
        },
        redo: function() {
          var data;
          data = undoStack.popRedo();
          if (data) {
            self.trigger("dirty");
            return self.withoutUndo(function() {
              return $.each(data, function() {
                return this.pixel.color(this.newColor, "replace");
              });
            });
          }
        },
        undo: function() {
          var data;
          data = undoStack.popUndo();
          if (data) {
            self.trigger("dirty");
            return self.withoutUndo(function() {
              return $.each(data, function() {
                return this.pixel.color(this.oldColor, "replace");
              });
            });
          }
        },
        withoutUndo: function(fn) {
          noUndo += 1;
          fn();
          return noUndo -= 1;
        }
      });
      return self.bind("initialized", function() {
        return self.dirty(false);
      });
    };
  });

}).call(this);

/**
Simple jQuery constructor wrappers for common elements.
*/


(function() {

  namespace("Pixie.UI", function(UI) {
    var elements;
    elements = ["Button", "Canvas", "Div", "Img", "Input"];
    elements.each(function(type) {
      var tag;
      tag = type.toLowerCase();
      return UI[type] = function(options) {
        if (type === 'Button') {
          options["class"] = 'btn';
        }
        return jQuery("<" + tag + "/>", options);
      };
    });
    return UI.Image = UI.Img;
  });

}).call(this);
(function() {

  (function($) {
    var Button, ColorPicker, DEBUG, Div, IMAGE_DIR, Image, Input, Layer, Pixel, actions, palette, primaryButton, tools, track, _ref, _ref1, _ref2;
    track = function(action, label) {
      return typeof trackEvent === "function" ? trackEvent("Pixel Editor", action, label) : void 0;
    };
    _ref = Pixie.Editor.Pixel, actions = _ref.actions, (_ref1 = _ref.config, IMAGE_DIR = _ref1.IMAGE_DIR, DEBUG = _ref1.DEBUG), palette = _ref.palette, tools = _ref.tools, Layer = _ref.Layer, Pixel = _ref.Pixel;
    _ref2 = Pixie.UI, Button = _ref2.Button, Div = _ref2.Div, Image = _ref2.Image, Input = _ref2.Input;
    primaryButton = function(event) {
      return !(event.button != null) || event.button === 0;
    };
    ColorPicker = function() {
      return Input({
        "class": 'color'
      }).colorPicker({
        leadingHash: false
      });
    };
    return Pixie.Editor.Pixel.create = function(I) {
      var actionbar, active, canvas, colorPickerHolder, colorbar, content, currentTool, cursorPosition, guideLayer, guides, handleEvent, initialStateData, initializer, lastPixel, layer, layers, mode, noUndo, pixelChanged, pixels, preview, primaryColorPicker, replaying, secondaryColorPicker, self, swatches, tilePreview, toolbar, viewport;
      if (I == null) {
        I = {};
      }
      I.zoom = 1;
      I.width = parseInt(I.width || 8, 10);
      I.height = parseInt(I.height || 8, 10);
      initializer = I.initializer;
      I.pixelWidth = parseInt(I.pixelWidth || I.pixelSize || 16, 10);
      I.pixelHeight = parseInt(I.pixelHeight || I.pixelSize || 16, 10);
      self = $(JST["pixie/editor/pixel/templates/pixel"]());
      content = self.find(".content");
      viewport = self.find(".viewport");
      canvas = self.find(".canvas").css({
        width: I.width * I.pixelWidth + 2,
        height: I.height * I.pixelHeight + 2
      });
      cursorPosition = self.find(".cursor_position");
      actionbar = self.find(".actions");
      toolbar = self.find(".toolbar.left");
      swatches = self.find(".swatches");
      colorbar = self.find(".module.right .toolbar");
      colorPickerHolder = self.find(".color_picker_holder");
      colorbar.append(colorPickerHolder, swatches);
      preview = self.find(".preview").css({
        width: I.width,
        height: I.height
      });
      currentTool = void 0;
      active = false;
      mode = void 0;
      primaryColorPicker = ColorPicker().addClass('primary').appendTo(colorPickerHolder);
      secondaryColorPicker = ColorPicker().addClass('secondary').appendTo(colorPickerHolder);
      noUndo = false;
      replaying = false;
      tilePreview = true;
      guides = false;
      initialStateData = void 0;
      pixelChanged = function(pixel) {
        var color, layerCanvas, oldColor, x, xPos, y, yPos;
        x = pixel.x, y = pixel.y;
        color = pixel.color();
        oldColor = pixel.oldColor();
        xPos = x * I.pixelWidth;
        yPos = y * I.pixelHeight;
        layerCanvas = layer.context;
        layerCanvas.clearRect(xPos, yPos, I.pixelWidth, I.pixelHeight);
        layerCanvas.fillStyle = color.toString();
        layerCanvas.fillRect(xPos, yPos, I.pixelWidth, I.pixelHeight);
        return self.addUndoData(pixel, oldColor, color);
      };
      self.bind('contextmenu', function() {
        return false;
      }).bind('mouseup', function(e) {
        active = false;
        mode = void 0;
        return self.preview();
      });
      preview.mousedown(function() {
        tilePreview = !tilePreview;
        self.preview();
        return track('mousedown', 'preview');
      });
      swatches.bind('mousedown touchstart', function(e) {
        var color, target;
        target = $(e.target);
        if (target.is('.swatch')) {
          color = Color(target.css('backgroundColor'));
          self.color(color, !primaryButton(e));
          return track(e.type, color.toString());
        }
      });
      pixels = [];
      lastPixel = void 0;
      handleEvent = function(event, element) {
        var col, color, eventType, local, offset, opacity, pixel, row;
        opacity = self.opacity();
        offset = element.offset();
        local = {
          y: event.pageY - offset.top,
          x: event.pageX - offset.left
        };
        row = Math.floor(local.y / I.pixelHeight);
        col = Math.floor(local.x / I.pixelWidth);
        cursorPosition.text("x: " + col + " y: " + row);
        pixel = self.getPixel(col, row);
        eventType = void 0;
        if ((event.type === "mousedown") || (event.type === "touchstart")) {
          eventType = "mousedown";
        } else if (pixel && pixel !== lastPixel && (event.type === "mousemove" || event.type === "touchmove")) {
          eventType = "mouseenter";
        }
        if (pixel && active && currentTool && currentTool[eventType]) {
          color = self.color().toString();
          currentTool[eventType].call({
            canvas: self,
            x: pixel.x,
            y: pixel.y,
            color: pixel.color
          }, event, Color(color, opacity), pixel);
        }
        return lastPixel = pixel;
      };
      layer = Layer(I);
      guideLayer = Layer(I).bind("mousedown touchstart", function(e) {
        self.trigger("dirty");
        self.nextUndo();
        active = true;
        if (primaryButton(e)) {
          mode = "P";
        } else {
          mode = "S";
        }
        return e.preventDefault();
      }).bind("mousedown mousemove", function(event) {
        return handleEvent(event, $(this));
      }).bind("touchstart touchmove", function(e) {
        var _this = this;
        return Array.prototype.each.call(event.touches, function(touch) {
          touch.type = e.type;
          return handleEvent(touch, $(_this));
        });
      });
      layers = [layer, guideLayer];
      I.height.times(function(row) {
        pixels[row] = [];
        return I.width.times(function(col) {
          var pixel;
          pixel = Pixel({
            changed: pixelChanged,
            x: col,
            y: row
          });
          return pixels[row][col] = pixel;
        });
      });
      canvas.append(layer, guideLayer);
      $.extend(self, {
        addAction: function(action) {
          var actionButton, doIt, name, titleText, undoable;
          name = action.name;
          titleText = name.capitalize();
          undoable = action.undoable;
          doIt = function() {
            if (undoable) {
              self.trigger("dirty");
              self.nextUndo();
            }
            return action.perform(self);
          };
          if (action.hotkeys) {
            titleText += " (" + action.hotkeys + ") ";
            $.each(action.hotkeys, function(i, hotkey) {
              return $(document).bind('keydown', hotkey, function(e) {
                if (currentComponent === self) {
                  e.preventDefault();
                  doIt();
                  track('hotkey', action.name);
                  return false;
                }
              });
            });
          }
          if (action.menu !== false) {
            actionButton = Button({
              "class": 'tool btn',
              text: name.capitalize(),
              title: titleText
            }).prepend($("<icon>", {
              attr: {
                "data-tool": name
              }
            })).bind("mousedown touchstart", function(e) {
              if (!$(this).attr('disabled')) {
                doIt();
              }
              track(e.type, action.name);
              return false;
            });
            return actionButton.appendTo(actionbar);
          }
        },
        addSwatch: function(color) {
          return swatches.append(Div({
            "class": 'swatch',
            style: "background-color: " + (color.toString())
          }));
        },
        setPalette: function(colors) {
          swatches.empty();
          return colors.each(function(color) {
            return self.addSwatch(Color(color));
          });
        },
        addTool: function(tool) {
          var alt, name, setMe, toolDiv;
          name = tool.name;
          alt = name.capitalize();
          tool.icon || (tool.icon = IMAGE_DIR + name + '.png');
          setMe = function() {
            return self.setTool(tool);
          };
          if (tool.hotkeys) {
            alt += " (" + tool.hotkeys + ")";
            $.each(tool.hotkeys, function(i, hotkey) {
              return $(document).bind('keydown', hotkey, function(e) {
                if (currentComponent === self) {
                  e.preventDefault();
                  setMe();
                  track("hotkey", tool.name);
                  return false;
                }
              });
            });
          }
          tool.elementSet = toolDiv = Div({
            attr: {
              "data-tool": name
            },
            "class": "tool"
          }).bind("mousedown touchstart", function(e) {
            setMe();
            track(e.type, tool.name);
            return false;
          });
          return toolbar.append(toolDiv);
        },
        color: function(color, alternate) {
          if (arguments.length === 0 || color === false) {
            if (mode === "S") {
              return Color(secondaryColorPicker.css('backgroundColor'));
            } else {
              return Color(primaryColorPicker.css('backgroundColor'));
            }
          } else if (color === true) {
            if (mode === "S") {
              return Color(primaryColorPicker.css('backgroundColor'));
            } else {
              return Color(secondaryColorPicker.css('backgroundColor'));
            }
          }
          if ((mode === "S") ^ alternate) {
            secondaryColorPicker.val(color.toHex().substr(1));
            secondaryColorPicker[0].onblur();
          } else {
            primaryColorPicker.val(color.toHex().substr(1));
            primaryColorPicker[0].onblur();
          }
          return self;
        },
        clear: function() {
          return self.eachPixel(function(pixel) {
            return pixel.color(Color(0, 0, 0, 0).toString(), "replace");
          });
        },
        displayInitialState: function(stateData) {
          return self.withoutUndo(function() {
            self.clear();
            stateData || (stateData = initialStateData);
            if (stateData) {
              return $.each(stateData, function(f, data) {
                return self.eachPixel(function(pixel, x, y) {
                  var pos;
                  pos = x + y * I.width;
                  return pixel.color(Color(data[pos]), "replace");
                });
              });
            }
          });
        },
        eachPixel: function(fn) {
          I.height.times(function(row) {
            return I.width.times(function(col) {
              var pixel;
              pixel = pixels[row][col];
              return fn.call(pixel, pixel, col, row);
            });
          });
          return self;
        },
        "eval": function(code) {
          return eval(code);
        },
        fromDataURL: function(dataURL) {
          var context, maxDimension;
          context = document.createElement('canvas').getContext('2d');
          maxDimension = 256;
          img = Image({
            load: function() {
              var getColor, imageData;
              if (this.width * this.height < maxDimension * maxDimension) {
                self.resize(this.width, this.height);
                context.drawImage(this, 0, 0);
                imageData = context.getImageData(0, 0, this.width, this.height);
                getColor = function(x, y) {
                  var index;
                  index = (x + y * imageData.width) * 4;
                  return Color(imageData.data[index + 0], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3] / 255);
                };
                self.clear();
                self.eachPixel(function(pixel, x, y) {
                  return pixel.color(getColor(x, y));
                });
              } else {
                alert("This image is too big for our editor to handle, try " + maxDimension + "x" + maxDimension + " and smaller");
              }
            }
          }).get(0);

          if(dataURL.startsWith("data:")) {
            // Do Nothing
          } else {
            img.crossOrigin = "";
          }

          img.src = dataURL;
        },
        getNeighbors: function(x, y) {
          return [this.getPixel(x + 1, y), this.getPixel(x, y + 1), this.getPixel(x - 1, y), this.getPixel(x, y - 1)];
        },
        getPixel: function(x, y) {
          if (((0 <= y && y < I.height)) && ((0 <= x && x < I.width))) {
            return pixels[y][x];
          }
          return void 0;
        },
        opacity: function(newVal) {
          var opacityEl, v;
          opacityEl = self.find('.opacity');
          if (newVal != null) {
            v = (newVal * 100).round().clamp(0, 100);
            return opacityEl.val(v);
          } else {
            return parseInt(opacityEl.val()) / 100;
          }
        },
        toggleGuides: function() {
          var guideCanvas;
          guides = !guides;
          guideCanvas = guideLayer.context;
          guideCanvas.clearRect(0, 0, I.width * I.pixelWidth, I.height * I.pixelHeight);
          if (guides) {
            return this.eachPixel(function(pixel) {
              var xPos, yPos;
              guideCanvas.fillStyle = 'rgba(0, 0, 0, 0.25)';
              xPos = pixel.x * I.pixelWidth;
              yPos = pixel.y * I.pixelHeight;
              if (yPos !== 0) {
                guideCanvas.fillRect(xPos, yPos, I.pixelWidth, 1);
              }
              if (xPos !== 0) {
                return guideCanvas.fillRect(xPos, yPos, 1, I.pixelHeight);
              }
            });
          }
        },
        preview: function() {
          var tileCount;
          tileCount = tilePreview ? 4 : 1;
          return preview.css({
            backgroundImage: this.toCSSImageURL(),
            width: tileCount * I.width,
            height: tileCount * I.height
          });
        },
        replay: function(steps, parentData) {
          var delay, i, runStep;
          if (!replaying) {
            replaying = true;
            if (!steps) {
              steps = self.getReplayData();
              self.displayInitialState();
            } else {
              if (parentData) {
                self.displayInitialState(parentData);
              } else {
                self.clear();
              }
            }
            i = 0;
            delay = (5000 / steps.length).clamp(1, 200);
            runStep = function() {
              var step;
              step = steps[i];
              if (step) {
                self.withoutUndo(function() {
                  return $.each(step, function(j, p) {
                    return self.getPixel(p.x, p.y).color(p.color, "replace");
                  });
                });
                i++;
                return setTimeout(runStep, delay);
              } else {
                return replaying = false;
              }
            };
            return setTimeout(runStep, delay);
          }
        },
        zoom: function(amount) {
          var pixelsCopy, previousZoom;
          pixelsCopy = pixels.copy();
          previousZoom = I.zoom;
          I.zoom = (I.zoom * amount).clamp(1 / 16, 16);
          if (I.zoom === previousZoom) {
            return;
          }
          I.pixelHeight = I.pixelHeight * amount;
          I.pixelWidth = I.pixelWidth * amount;
          canvas = self.find(".canvas").css({
            width: I.width * I.pixelWidth + 2,
            height: I.height * I.pixelHeight + 2
          });
          layers.invoke('resize');
          return pixels.each(function(col, colIndex) {
            return col.each(function(row, rowIndex) {
              return row.color(pixelsCopy[colIndex][rowIndex].color(), 'replace');
            });
          });
        },
        zoomIn: function() {
          return self.zoom(2);
        },
        zoomOut: function() {
          return self.zoom(0.5);
        },
        resize: function(newWidth, newHeight, preserveImage) {
          var pixelColors;
          if (preserveImage == null) {
            preserveImage = false;
          }
          I.width = newWidth;
          I.height = newHeight;
          if (preserveImage) {
            pixelColors = [];
            pixels.each(function(col, colIndex) {
              return col.each(function(row, rowIndex) {
                pixelColors[colIndex] || (pixelColors[colIndex] = []);
                if (row.color().a > 0) {
                  return pixelColors[colIndex][rowIndex] = row;
                }
              });
            });
          }
          pixels = pixels.slice(0, newHeight);
          while (pixels.length < newHeight) {
            pixels.push([]);
          }
          pixels.each(function(row, y) {
            var _results;
            while (row.length > newWidth) {
              row.pop();
            }
            _results = [];
            while (row.length < newWidth) {
              _results.push(row.push(Pixel({
                x: row.length,
                y: y,
                changed: pixelChanged
              })));
            }
            return _results;
          });
          layers.invoke('resize');
          if (preserveImage) {
            pixels.each(function(col, colIndex) {
              return col.each(function(row, rowIndex) {
                var pixel;
                if ((col = pixelColors[colIndex]) != null) {
                  if ((pixel = col[rowIndex]) != null) {
                    return row.color(pixel.color(), 'replace');
                  }
                }
              });
            });
          }
          return canvas.css({
            width: I.width * I.pixelWidth + 2,
            height: I.height * I.pixelHeight + 2
          });
        },
        setInitialState: function(frameData) {
          initialStateData = frameData;
          return this.displayInitialState();
        },
        setTool: function(tool) {
          currentTool = tool;
          canvas.attr({
            "data-tool": tool.name
          });
          return tool.elementSet.takeClass("active");
        },
        toBase64: function() {
          var data;
          data = this.toDataURL();
          return data.substr(data.indexOf(',') + 1);
        },
        toCSSImageURL: function() {
          return "url(" + (this.toDataURL()) + ")";
        },
        toDataURL: function() {
          var context, tempCanvas;
          tempCanvas = $("<canvas width=" + I.width + " height=" + I.height + "></canvas>").get(0);
          context = tempCanvas.getContext('2d');
          this.eachPixel(function(pixel, x, y) {
            var color;
            color = pixel.color();
            context.fillStyle = color.toString();
            return context.fillRect(x, y, 1, 1);
          });
          return tempCanvas.toDataURL("image/png");
        },
        width: function() {
          return I.width;
        },
        height: function() {
          return I.height;
        }
      });
      $.each(tools, function(key, tool) {
        tool.name = key;
        return self.addTool(tool);
      });
      $.each(actions, function(key, action) {
        action.name = key;
        return self.addAction(action);
      });
      self.setPalette(palette);
      self.setTool(tools.pencil);
      self.bind('mouseenter', function() {
        return window.currentComponent = self;
      });
      self.bind('touchstart touchmove touchend', function() {
        return event.preventDefault();
      });
      Pixie.Editor.Pixel.Undo(I, self);
      window.currentComponent = self;
      if (initializer) {
        initializer(self);
      }
      self.trigger("initialized");
      return self;
    };
  })(jQuery);

}).call(this);
(function() {



}).call(this);
