(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("xutil", [], factory);
	else if(typeof exports === 'object')
		exports["xutil"] = factory();
	else
		root["xutil"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var AND = '&',
	    EQUAL = '=';

	var doc = document;
	var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
	var baseElement = head.getElementsByTagName('base')[0];

	var slice = Array.prototype.slice;

	var currentlyAddingScript;

	function isType(type) {
	    return function (obj) {
	        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
	    };
	}

	module.exports = {

	    isNumber: function (obj) {
	        return typeof obj === 'number';
	    },
	    isString: isType('String'),
	    isBoolean: function (obj) {
	        return obj === true || obj === false;
	    },
	    isObject: isType('Object'),
	    isArray: Array.isArray || isType('Array'),
	    isFunction: isType('Function'),
	    isArguments: isType('Arguments'),

	    guid: function () {
	        return 'tmd' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
	    },

	    /**
	     * 将Object对象转成query string
	     * @param  {Object} obj 需要进行转换的对象
	     * @return {String}     转换好的query string
	     */
	    param: function (obj) {
	        if (!this.isObject) return '';
	        var query = '';
	        for (var key in obj) {
	            // jshint ignore:line
	            if (!obj.hasOwnProperty(key) || !obj[key]) continue;
	            query += AND + key + EQUAL + obj[key];
	        }
	        return query.slice(1); // 去除第一个'&'
	    },

	    /**
	     * 将query string 转换成 Object 对象
	     * @param  {String} str query string
	     * @return {Object}     Object 或 null
	     */
	    unparam: function (str) {
	        if (!this.isString(str)) return null;
	        var kvs = str.split(AND),
	            obj = {},
	            isEmpty = true;
	        for (var i = 0; i < kvs.length; i++) {
	            var kv = kvs[i].split(EQUAL),
	                k = decodeURIComponent(kv[0]),
	                v = decodeURIComponent(kv[1]);
	            if (v) {
	                obj[k] = v;
	                isEmpty = false;
	            }
	        }
	        return isEmpty ? null : obj;
	    },

	    trim: function (str) {
	        return String.prototype.trim ? String.prototype.trim.call(str) : str.replace(/^\s*|\s*$/g, '');
	    },

	    extend: function (destination) {
	        if (!destination || !this.isObject(destination)) throw 'Invalid argument: destination';
	        var sources = slice.call(arguments, 1);
	        for (var i = 0; i < sources.length; i++) {
	            for (var key in sources[i]) {
	                // jshint ignore:line
	                if (!sources[i].hasOwnProperty(key)) continue;
	                destination[key] = sources[i][key];
	            }
	        }
	        return destination;
	    },

	    /**
	     * 安全地执行函数
	     * @param  {Any} f 要执行的函数
	     * @param {Array|Arguments} args 数组中的每一项是传递给f的入参
	     * @return {Boolean}   是否正确执行
	     */
	    safeExeFUNC: function (f, args) {
	        if (!f || !this.isFunction(f)) return false;
	        if (!args) args = [];
	        if (!this.isArray(args) && !this.isArguments(args)) return false;
	        try {
	            f.apply(window, args);
	            return true;
	        } catch (ex) {
	            console.error(ex);
	            return false;
	        }
	    },

	    getScript: function (url, callback, charset) {
	        var self = this;
	        var script = doc.createElement('script');
	        if (charset) script.charset = charset;

	        var onload = function (error) {
	            script.onload = script.onerror = script.onreadystatechange = null;
	            script.parentNode.removeChild(script);
	            script = null;
	            self.safeExeFUNC(callback, [error]);
	        };

	        if ('onload' in script) {
	            script.onload = onload;
	            script.onerror = function () {
	                onload(true);
	            };
	        } else {
	            script.onreadystatechange = function () {
	                if (/loaded|complete/.test(script.readyState)) onload();
	            };
	        }

	        script.src = url;

	        // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
	        // the end of the insert execution, so use `currentlyAddingScript` to
	        // hold current node, for deriving url in `define` call
	        currentlyAddingScript = script;

	        // ref: #185 & http://dev.jquery.com/ticket/2709
	        baseElement ? head.insertBefore(script, baseElement) : head.appendChild(script);
	        currentlyAddingScript = null;
	    },

	    // TODO 这个串行加载并不是真的串行，需要完善
	    getScriptsSerial: function (urls, callback) {
	        var url = urls.shift();
	        if (!url) {
	            this.safeExeFUNC(callback);
	            return;
	        }
	        this.getScriptSerial(urls, callback);
	    },

	    /**
	     * 遍历
	     * @param  {Array|String|Arguments|NodeList|Object} list     可以遍历的数据，不局限于以上类型
	     * @param  {Function} iterator 遍历器，遍历函数。
	     *   如果是数组或类数组，入参为`(list[i], i, list)`。
	     *   如果是Object，入参为`(list[key], key, list)`。
	     *   如果调用此函数的返回值false，则遍历终止。
	     * @param  {Any} context  iterator的执行上下文
	     */
	    each: function (list, iterator, context) {
	        if (!list) throw 'Missing argument list';
	        if (!this.isFunction(iterator)) 'Type error: iterator must be function';
	        context = context || window;
	        if (this.isNumber(list.length)) {
	            // 数组、类数组
	            for (var i = 0; i < list.length; i++) {
	                if (iterator.call(context, list[i], i, list) === false) break;
	            }
	        } else if (this.isObject(list)) {
	            // Object
	            for (var key in list) {
	                if (!list.hasOwnProperty(key)) continue;
	                if (iterator.call(context, list[key], key, list) === false) break;
	            }
	        }
	    },

	    /**
	     * 判断一个可枚举的对象是否为空
	     * @param  {Array|String|Arguments|NodeList|Object}  o 字符串、数组、类数组或者对象
	     * @return {Boolean}   如果对象存在length属性，则length为0时，返回true，对象无自有属性时，返回true
	     */
	    isEmpty: function (o) {
	        if (!o) throw 'Missing argument';
	        if (this.isNumber(o.length)) {
	            return o.length === 0;
	        } else {
	            for (var key in o) {
	                if (!o.hasOwnProperty(key)) continue;
	                return false;
	            }
	            return true;
	        }
	    },

	    /**
	     * 克隆对象
	     * @param  {Array|Object} o    要克隆的对象
	     * @param  {Boolean} deep 是否进行深度克隆，默认false。目前只支持对Object和Array深度克隆
	     * @return {Array|Object}      克隆好的对象
	     */
	    clone: function (o, deep) {
	        var self = this;
	        var _o = self.isArray(o) ? [] : {};
	        var iterator = deep ? function (v, k) {
	            _o[k] = self.isArray(v) || self.isObject(v) ? self.clone(v, deep) : v;
	        } : function (v, k) {
	            _o[k] = v;
	        };
	        self.each(o, iterator);
	        return o;
	    }
	};

/***/ }
/******/ ])
});
;