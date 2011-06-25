/*!
 * Entity JavaScript
 * Copyright (C) 2011-2011 Anonymous Developer
 * GNU General Public Version 2 License
 */

(function(){
  function EntityJS() {
    //TODO: Implement
  }
  EntityJS.VERSION = '1.0';
  
  EntityJS.Base = {};
  
  EntityJS.Model = {
    factory: function() {
	  function object() {
        this.init.apply(this, arguments);
      }
	  return object;
	},
	
    create: function() {
	  var object = EntityJS.Model.factory();
	  if(!EntityJS.Type.isSet(object.init)) {
		  object.prototype.init = function(){};
	  }
	  object.prototype = EntityJS.Base;
	  object.prototype.constructor = object;
	  
      EntityJS.Model.extend(object, arguments[0]);
	  
	  if(!EntityJS.Type.isSet(object.prototype.init)) {
		  object.prototype.init = function(){};
	  }

	  return object;
    },
	
    extend: function(object, args) {
      for (var method in args) {
        object.prototype[method] = args[method];
	  }
      return object.prototype;
    },
  };
  
  EntityJS.Enumerable = {
    toArray: function(args) {
	  var length = args.length;
	  var result = new Array(length);
	
	  for(var i = 0; i < length; i++) {
	    result[i] = args[i];
	  }
	  return result;
	}
  };
  
  EntityJS.Type = {
    isSet: function(object) {
       return typeof object !== "undefined" && object !== null;
	},
	typeName: function(object) {
       return typeof object;
	}
  };

  if(!window.$e){window.$e=EntityJS;}
})(window);