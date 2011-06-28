/*!
 * Entity JavaScript
 * Copyright (C) 2011-2012 Markel Mairs
 * GNU General Public Version 2 License
 */

(function( ){
  function Entity() {
    return Entity.Model.create(arguments[0]);
  }
  Entity.VERSION = '1.0';
  
  Entity.ModelBase = {};

  Entity.Model = {
    factory: function() {
      return function() {
        var parent = this._parent;
        this._parent = null;

        if( Entity.Type.isSet(parent.init ) ) {
          this.base = function() { return parent.init.apply( this, arguments ); };
          Entity.Model.extend(this.base, parent);
        }
        
        this.init.apply(this, arguments);
      }
    },

    create: function() {
      protoType = arguments[0];
      var object = Entity.Model.factory();

      object.prototype = {};
      object.prototype.constructor = object;

      if( !Entity.Type.isSet(protoType.init) ) {
        protoType.init = function(){};
      }

      if( Entity.Type.isSet(protoType.extend) ) {
        object.prototype._parent = protoType.extend.prototype;
        Entity.Model.extend(object.prototype, protoType.extend.prototype);
      }
      
      Entity.Model.extend(object.prototype, protoType);
      
      return object;
    },

    extend: function(object, args) {
      for (var method in args) {
        object[method] = args[method];
      }
      return object.prototype;
    },

    apply: function(parent) {
      if( arguments.length > 1 )  {
        return parent.prototype.init.apply( this, Array.prototype.slice.call( arguments, 1 ) );
      } else  {
        return parent.call(this);
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