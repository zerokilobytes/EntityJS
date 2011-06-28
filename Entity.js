/*!
 * Entity JavaScript
 * Copyright (C) 2011-2011 Anonymous Developer
 * GNU General Public Version 2 License
 */

(function( ){
  function Entity( ) {
    //TODO: Implement
  }
  Entity.VERSION = '1.0';

  Entity.Model = {
    $_factory: function() {
      function object() {
          this.init.apply(this, arguments);
      }
      return object;
    },

    create: function() {
      var object = Entity.Model.$_factory();

      object.prototype = {};
      object.prototype.constructor = object;

      Entity.Model.$_extend(object.prototype, arguments[0]);

      if( !Entity.Type.isSet(object.prototype.init) ) {
        object.prototype.init = function(){};
      }
      
      object.prototype.extend = Entity.Model.extend;
      object.prototype.inherit = Entity.Model.inherit;

      return object;
    },

    $_extend: function(object, args) {
      for (var method in args) {
        object[method] = args[method];
      }
      return object.prototype;
    },
    
    extend: function(parent) {
      Entity.Model.$_extend(this, parent.prototype);
    },
    
    inherit: function(parent) {
      if( arguments.length > 1 )  {
        parent.prototype.init.apply( this, Array.prototype.slice.call( arguments, 1 ) );
      } else  {
        parent.call(this);
      }
    }
  };

  Entity.Enumerable = {
    toArray: function(args) {
	  var length = args.length;
	  var result = new Array(length);

	  for( var i = 0; i < length; i++ ) {
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