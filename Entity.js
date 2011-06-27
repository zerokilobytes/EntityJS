/*!
 * Entity JavaScript
 * Copyright (C) 2011-2011 Anonymous Developer
 * GNU General Public Version 2 License
 */

(function(){
  function Entity() {
    //TODO: Implement
  }
  Entity.VERSION = '1.0';

  Entity.Base = {};

  Entity.Model = {
    factory: function() {
	  function object() {
        this.init.apply(this, arguments);
      }
	  return object;
	},

    create: function() {
	  var object = Entity.Model.factory();

	  object.prototype = {};
	  object.prototype.constructor = object;

      Entity.Model.extend(object, arguments[0]);

	  if(!Entity.Type.isSet(object.prototype.init)) {
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

  Entity.Enumerable = {
    toArray: function(args) {
	  var length = args.length;
	  var result = new Array(length);

	  for(var i = 0; i < length; i++) {
	    result[i] = args[i];
	  }
	  return result;
	}
  };

  Entity.Type = {
    isSet: function(object) {
       return typeof object !== "undefined" && object !== null;
	},
	typeName: function(object) {
       return typeof object;
	}
  };

  if(!window.$e){window.$e=Entity;}
})(window);