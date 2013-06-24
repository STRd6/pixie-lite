(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['image'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<img src='" + ($c(this.url)) + "' sha='" + ($c(this.sha)) + "'>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);
(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['player_overlay'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='player-overlay'>\n  <div class='name'>" + ($e($c(this.name))) + "</div>\n  <div class='health'>");
      $o.push("    " + $e($c(this.health)));
      $o.push("    \/");
      $o.push("    " + $e($c(this.healthMax)));
      $o.push("  </div>\n  <progress class='health' value='" + ($c(this.health)) + "' max='" + ($c(this.healthMax)) + "'></progress>\n</div>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);
