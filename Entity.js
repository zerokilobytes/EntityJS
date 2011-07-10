/*!
 * Entity JavaScript
 * Copyright (C) 2011-2012 Markel Mairs
 * GNU General Public Version 2 License
 */

(function(){
  function Entity() {
    return Entity.Model.create(arguments[0]);
  }
  var ENTITY_TYPE_ALL = 'ENTITY_TYPE_ALL';
  var ENTITY_TYPE_PROPERTY = 'ENTITY_TYPE_PROPERTY';
  var ENTITY_TYPE_METHOD = 'ENTITY_TYPE_METHOD';
  
  var slice = Array.prototype.slice;
  
  Array.prototype.forEach = Array.prototype.forEach || function(callback, context) {
    len = this.length || 0;
    for(var i = 0; i < len; i++) {
      if(i in this) {
        callback.call(context, this[i], i, this);
      }
    }
  }

  function getEntityBase() {
    return {
      extend: {},
      init : function () {},
    }
  }

  function hasOwnProperty(obj, prop){
    return (typeof(obj[prop]) !== 'undefined');
  }

  Entity.VERSION = '1.0';

  Entity.Model = {
    factory: function() {
      return function() {
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
        object.prototype.$super = protoType.extend.prototype;
        Entity.Model.extend(object.prototype, protoType.extend.prototype, ENTITY_TYPE_ALL);
      } else {
        object.prototype.$super = getEntityBase();
        Entity.Model.extend(object.prototype, object.prototype.$super, ENTITY_TYPE_ALL);
      }

      Entity.Model.extend(object.prototype, protoType, ENTITY_TYPE_ALL);

      return object;
    },

    clone : function(obj) {
      if(obj == null || typeof(obj) != 'object')
        return obj;
      var temp = {}; 
      for(var key in obj) {
        temp[key] = Entity.Model.clone(obj[key]);
      }
      return temp;
    },
    extend: function(object, args, type) {
      for (var method in args) {
        if(method != 'constructor' && method != '$super' && method != 'extend') {
          if(type == ENTITY_TYPE_ALL) {
            object[method] = args[method];
          }
          else if(type == ENTITY_TYPE_METHOD && (typeof args[method] == 'function')) {
            object[method] = args[method];
          }
          else if(type == ENTITY_TYPE_PROPERTY && (typeof args[method] != 'function')) {
            object[method] = args[method];
          }
        }
      }
      return object.prototype;
    },
  };

  Entity.Enumerable = {
    toArray: function(args) {
      var length = args.length;
      var result = new Array(length);

      for( var i = 0; i < length; i++ ) {
        result[i] = args[i];
      }
      return result;
    },
    
    map: function(enumerable, callback) {
      for(var i = 0; i < enumerable.length; i++) {
        enumerable[i] = callback(enumerable[i]);
      }
      return enumerable;
    },
    
    isArray: function(object) {
      return Object.prototype.toString.call(object) === "[object Array]";
    }
  };

  Entity.Type = {
    isSet: function(object) {
       return typeof object !== "undefined" && object !== null;
    },

    typeName: function(object) {
      return typeof object;
    },
    
    isNumeric: function(object) {
      return !!(!isNaN(object));
    }
  };
  
  Entity.Func = {
  
  };

  if(!window.$e){window.$e=Entity;}
})(window);