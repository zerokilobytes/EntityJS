/*!
 * Entity JavaScript
 * Copyright (C) 2011-2012 Markel Mairs
 * GNU General Public Version 2 License
 */

(function(){
  function Entity() {
    return Entity.Model.create(arguments[0]);
  }
  var ENTITY_TYPE_ALL = '1';
  var ENTITY_TYPE_PROPERTY = '2';
  var ENTITY_TYPE_METHOD = '3';
  
  var slice = Array.prototype.slice;
  
  Array.prototype.forEach = Array.prototype.forEach || function(callback, context) {
    if(typeof callback != "function") {
      throw new TypeError();
    }

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
  
  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  Entity.VERSION = '1.0';

  Entity.Model = (function(){
    function factory() {
      return function() {
        this.init.apply(this, arguments);
      }
    }

    function create() {
      protoType = arguments[0];
      var object = factory();

      object.prototype = {};
      object.prototype.constructor = object;

      if( !Entity.Type.isSet(protoType.init) ) {
        protoType.init = function(){};
      }

      if( Entity.Type.isSet(protoType.extend) ) {
        object.prototype.$super = protoType.extend.prototype;
        extend(object.prototype, protoType.extend.prototype, ENTITY_TYPE_ALL);
      } else {
        object.prototype.$super = getEntityBase();
        extend(object.prototype, object.prototype.$super, ENTITY_TYPE_ALL);
      }

      extend(object.prototype, protoType, ENTITY_TYPE_ALL);

      return object;
    }

    function clone(obj) {
      if(obj == null || typeof(obj) != 'object')
        return obj;
      var temp = {}; 
      for(var key in obj) {
        temp[key] = clone(obj[key]);
      }
      return temp;
    }

    function extend(object, args, type) {
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
    }
    
    return {
      create: create
    };
  })();

  Entity.Enumerable = (function(){
    function toArray(args) {
      var length = args.length;
      var result = new Array(length);

      for( var i = 0; i < length; i++ ) {
        result[i] = args[i];
      }
      return result;
    }
    
    function map(enumerable, callback) {
      for(var i = 0; i < enumerable.length; i++) {
        enumerable[i] = callback(enumerable[i]);
      }
      return enumerable;
    }
    
    function isArray(object) {
      return Object.prototype.toString.call(object) === "[object Array]";
    }

    return {
      toArray:  toArray,
      map:      map,
      isArray:  isArray
    };
  })();

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