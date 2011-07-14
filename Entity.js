/*!
 * Entity JavaScript
 * Copyright (C) 2011-2012 Markel Mairs
 * GNU General Public Version 2 License
 */

(function(window){
  var Entity = function() {
    return Entity.Model.create(arguments[0]);
  }
  var ENTITY_TYPE_ALL = '1';
  var ENTITY_TYPE_PROPERTY = '2';
  var ENTITY_TYPE_METHOD = '3';

  var slice = Array.prototype.slice;

  /**
   * The MDN implementation of the array foreach function
   *
   * @param {Object} callback The function that will be called for the iteration of each item of the array.
   * @param {Object} context The scope to which the 'this' object will be referenced to.
   * @returns {Void}
   */
  Array.prototype.forEach = Array.prototype.forEach || function(callback, context) {
    typeCheck(callback, "function");
    var len = this.length || 0;
    for(var i = 0; i < len; i++) {
      if(i in this) {
        callback.call(context, this[i], i, this);
      }
    }
  }

  /**
   * The MDN implementation of the array filter function
   *
   * @param {Object} callback The function that will be called for the iteration of each item of the array.
   * @param {Object} context The scope to which the 'this' object will be referenced to.
   * @returns {Array}
   */
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

  /**
   * The MDN implementation of the array isArray function
   *
   * @param {Object} object The object to be checked.
   * @returns {Boolean}
   */
  Array.isArray = Array.isArray || function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  }

  /**
   * The MDN implementation of the array every function
   *
   * @param {Object} callback The function that will be called for the iteration of each item of the array.
   * @param {Object} context The scope to which the 'this' object will be referenced to.
   * @returns {Boolean}
   */
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

  /**
   * The MDN implementation of the array indexOf function
   *
   * @param {Number} target The element to locate within the array.
   * @param {Number} start The index to start the search at.
   * If this number is negative, it is taken as the offset from the end of the array.
   * If omitted, this value defaults to zero.
   * @return {Number}
   */
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

  /**
   * The JPAQ implementation of the array subtract function.
   *
   * Returns all elements that are in this array but not in arrOther.
   *
   * @param {Object} arrOther The array whose elements will not be found in the returned array.
   * @return {Array}
   */
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

  /**
   * The JPAQ implementation of the array intersect function.
   *
   * Returns all elements that are common to this array and arrOther.
   *
   * @param {Object} arrOther The array that will be intersected with the current one.
   * @returns {Array}
   */
  Array.prototype.intersect = function(arrOther) {
    if(!(arrOther instanceof Array))
      return [];
    return this.subtract(this.subtract(arrOther));
  }

  /**
   * The JPAQ implementation of the array union function.
   *
   * Gets a new array which contains all of the elements that are in this
	 * array and the other one.  Any elements found in the other array that are
	 * already in this one will not be added to this array.
   *
   * @param {Object} arrOther The array that will be unioned with this array.
   * @returns {Array}
   */
  Array.prototype.union = function(arrOther) {
    if(!(arrOther instanceof Array))
      return [];
    return this.concat(arrOther.subtract(this));
  };

  /**
   * The JPAQ implementation of the array union function.
   * Creates a shallow copy of this array.
   *
   * @param {Object} arrOther The array that will be unioned with this array.
   * @returns {Array}
   */
  Array.prototype.clone = function() {
    return this.slice(0);
  }

  /**
   * Clears all the elements in the array.
   *
   * @returns {Array} The empty array
   */
  Array.prototype.clear = function() {
    this.length = 0;
    return this;
  }

  /**
   * The MDN implementation of the Object keys function
   *
   * Returns all the key values found in an object.
   *
   * @param {Number} target The element to locate within the array.
   * @returns {Array}
   */
  Object.keys = Object.keys || function(obj) {
    if (obj !== Object(obj))
      throw new TypeError('Object.keys called on non-object');
    var result = [];
    var property;
    for(property in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, property))
        result.push(property);
    }
    return result;
  }

  /**
   * Checks if a value is of the type supplied.
   * Throws a TypeError exception if value is not of the type supplied.
   *
   * @param {Object} value The object to type-check.
   * @param {String} type The type to check against.
   * @returns {Void}
   */
  function typeCheck(value, type) {
    if(typeof value != type) {
      throw new TypeError('Invalid type');
    }
  }

  /**
   * Returns the base class of Entity objects
   * Throws a TypeError exception if value is not of the type supplied.
   
   * @returns {Object}
   */
  function getEntityBase() {
    return {
      extend: {},
      init : function () {},
    }
  }

  /**
   * Checks is an object has a property defined
   *
   * @returns {Boolean}
   */
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

  Browser = {
    Gecko: (/Gecko/.test(navigator.userAgent)),
    IE: ((navigator.appName.indexOf('Microsoft Internet Explorer')> -1) || (navigator.appVersion.indexOf('MSIE') > -1)),
    WebKit: (/AppleWebKit/.test(navigator.userAgent)),
    Opera: (window.opera != undefined)
  }

  Entity.Model = (function(){
    function factory() {
      return function() {
        this.init.apply(this, arguments);
      }
    }

    /**
     * Creates a model using 'arguments'.
     *
     * @returns {Object} The new model
     */
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
     * Clones a model using the deep copy technique.
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

    /**
     * Extend a model properties from a list of arguments.
     *
     * @param {Object} object object to extend arguments to.
     * @param {Array} args arguments to add to object.
     * @param {String} type The of properties to extend ie. (Function, mehod, all).
     * @returns {Object} The extended model.
     */
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

    function _properties() {
      //TODO: Implement
    }

    function _methods() {
      //TODO: Implement
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

  Entity.Event = (function() {
    var DOMReadyCallbacks = [];
    var isReady           = false;
    var events = {};

    function _domLoadedListner() {
      if (document.addEventListener) {
        document.removeEventListener('DOMContentLoaded', _domLoadedListner, false);
        _ready();
      } else {
        if (document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', _domLoadedListner);
          _ready();
        }
      }
    }

    function _ready() {
      for (var i = 0; i < DOMReadyCallbacks.length; i++) {
        DOMReadyCallbacks[i]();
      }
      DOMReadyCallbacks.clear();
    }

    function _initReady() {
      if (!isReady)
        isReady = true;

      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', _domLoadedListner, false);
      } else {
        document.onreadystatechange = _domLoadedListner;
        window.onload = _ready;
      }
    }

    function start() {
    }

    function stop(event) {
      event.preventDefault(event);
      event.stopPropagation(event);
    }

    function stopObserve() {
    }

    events = {
      ready: function(callback) {
        _initReady();
        DOMReadyCallbacks.push(callback);
      },

      fire: function(element, event) {
        if (document.createEventObject){
          var eventObject = document.createEventObject();
          return element.fireEvent('on' + event, eventObject)
        } else {
          var eventObject = document.createEvent('HTMLEvents');
          eventObject.initEvent(event, true, true );
          return !element.dispatchEvent(eventObject);
        }
      },

      add: function() {
      },

      remove: function(event) {
      },
    }
    
    elements = {
      fire: function(event) {
        events.fire(this, event);
      }
    }

    extend(Element.prototype, {
      fire: elements.fire
    });

    return {
      ready:  events.ready,
      fire: events.fire
    };

  })();

  if(!window.$e || !window.Entity){window.$e=Entity;window.Entity=Entity;}

})(window);