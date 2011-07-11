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
    typeCheck(callback, "function");
    var len = this.length || 0;
    for(var i = 0; i < len; i++) {
      if(i in this) {
        callback.call(context, this[i], i, this);
      }
    }
  }
  
  Array.prototype.filter = Array.prototype.filter || function(callback, context) {
    typeCheck(callback, "function");
    var result = [];
    var len = this.length || 0;
    for(var i = 0; i < len; i++) {
      if(i in this && callback.call(context, this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  }
  
  Array.prototype.clone = function() {
    return this.slice(0);
  }
  
  Array.isArray = Array.isArray || function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  }
  
  Array.prototype.every = Array.prototype.every || function(callback, object) {
	  typeCheck(callback, "function");
    var len = this.length || 0;
    for(var i = 0; i < length; i++) {
		if(i in this && !callback.call(object, this[i], i, this)) {
			return false;
    }
    return true;
    }
  }
  
  Array.prototype.indexOf = Array.prototype.indexOf || function(target, start) {
    var len = this.length || 0;
    start = start || 0;
    if((start = (start < 0) ? Math.ceil(start) : Math.floor(start)) < 0)
      start += len;
    for(; start < len; start++)
      if(start in this && this[start] === target)
        return start;
    return -1;
  }
  
  //jPaq
  Array.prototype.subtract = function(arrOther) {
    if(!(arrOther instanceof Array))
      return [];
    var j, i = 0, difference = [], arrOtherFound = [];
    for(; i < this.length; i++) {
      for(j = 0; j < arrOther.length; j++) {
        if(arrOtherFound[j] != true && arrOther[j] === this[i]) {
          arrOtherFound[j] = true;
          break;
        }
      }
      if(j == arrOther.length)
        difference.push(this[i]);
    }
    return difference;
  }
  
  //jPaq
  Array.prototype.intersect = function(arrOther) {
    if(!(arrOther instanceof Array))
      return [];
    return this.subtract(this.subtract(arrOther));
  }
  
  //jPaq
  Array.prototype.union = function(arrOther) {
    if(!(arrOther instanceof Array))
      return [];
    return this.concat(arrOther.subtract(this));
  };
  
  function typeCheck(value, type) {
    if(typeof value != type) {
      throw new TypeError();
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
  
  /**
   * Applies the proprties of one object to another
   *
   *
   * @param {Object} destination The destination object to which the properties will be applied to.
   * @param {Object} source The source object to which the properties will be applied from.
   * @returns {Object} The destination with the new properties.
   */
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
    
  /**
   * Clone a model
   *
   * @param {Object} context The object that this will be referenced to.
   * @returns {Object} The cloned model
   */
    function clone(context) {
      var object = context || this;
      if(typeof(object) != 'object')
        return object;
      var temp = {}; 
      for(var key in object) {
        temp[key] = clone(object[key]);
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
      if(!isArray(enumerable)) {
        throw new TypeError();
      }
      for(var i = 0; i < enumerable.length; i++) {
        enumerable[i] = callback(enumerable[i]);
      }
      return enumerable;
    }
    
    function isArray(object) {
      return Array.isArray(object);
    }

    return {
      toArray:  toArray,
      map:      map,
      isArray:  isArray
    };
  })();

  Entity.Type = (function(){
    function isSet(object) {
       return typeof object !== "undefined" && object !== null;
    }

    function typeName(object) {
      return typeof object;
    }
    
    function isNumeric(object) {
      return !!(!isNaN(object));
    }
    
    
    extend(Entity, {
      isSet:      isSet,
      typeName:   typeName,
      isNumeric:  isNumeric
    });
    
    return {
      isSet:      isSet,
      typeName:   typeName,
      isNumeric:  isNumeric
    };
  })();
  
  Entity.Func = (function(){
    function clone(object) {
      if(typeof(object) != 'object' || typeof(object) !='function' || Array.isArray(object))
        return object;
      var temp = {}; 
      for(var key in object) {
        temp[key] = clone(object[key]);
      }
      return temp;
    }
    extend(Entity, {
      clone: clone
    });
    return {
    clone: clone
    };
  })();
  
  Entity.Dom = (function(){
    nodeType = {
      ELEMENT:                  1,
      ATTRIBUTE:                2,
      TEXT:                     3,
      CDATA_SECTION:            4,
      ENTITY_REFERENCE:         5,
      ENTITY:                   6,
      PROCESSING_INSTRUCTION:   7,
      COMMENT:                  8,
      DOCUMENT:                 9,
      DOCUMENT_TYPE:            10,
      DOCUMENT_FRAGMENT:        11,
      NOTATION:                 12
    };
    
    function addClass(element, className) {
      //TODO: Implement
    }
    
    function removeClass(element, className) {
      //TODO: Implement
    }
    
    function clearClasses(element, className) {
      //TODO: Implement
    }
    
    function hasClass(element, className) {
      //TODO: Implement
    }
    
    function replaceClass(element, oldClass, newClass) {
      //TODO: Implement
    }
    
    function getClassNames(element) {
      //TODO: Implement
    }
    
    function getAttribute(element, attribute) {
      //TODO: Implement
    }
    
    function setAttribute(element, name, value) {
      //TODO: Implement
    }
    
    function removeAttribute(element, name) {
      //TODO: Implement
    }
    
    Dom = {
      elements: [],
      selector: null,
      
      css: function() {
      },
      
      first: function() {
      },
      
      last: function() {
      },
      
      html: function() {
      },
      
      text: function() {
      },
      
      addClass: function(className) {
      },
      
      removeClass: function(className) {
      },
      
      /**
       * Get or set an attribute.
       *
       * @param {String} attribute The attribute name
       * @param {String} value The attribute value
       * @returns {String} The attribute value
       */
      attr: function(attribute, value) {
      },
    }
  })();

  if(!window.$e){window.$e=Entity;window.Entity=Entity;}
})(window);