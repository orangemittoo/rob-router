(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _routesOnBrowser = require('../../dest/routes-on-browser');

var _routesOnBrowser2 = _interopRequireDefault(_routesOnBrowser);

var _users_controller = require('./users_controller');

var _users_controller2 = _interopRequireDefault(_users_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _routesOnBrowser2.default({
  controllers: {
    users: _users_controller2.default
  },
  routes: {
    '/': 'users#root',
    'users(/)': 'users#index',
    'users/:userId': 'users#show',
    'users/:userId/posts(/)': 'users#posts',
    'users/:userId/posts/:postId(/)': 'users#postShow'
  }
});

router.run(location.href);

},{"../../dest/routes-on-browser":3,"./users_controller":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  root: function root() {
    alert('root');
  },
  index: function index() {
    alert('index');
  },
  show: function show(userId) {
    alert('show:' + userId);
  },
  posts: function posts(userId) {
    alert('posts:' + userId);
  },
  postShow: function postShow(userId, postId) {
    alert('posts:' + userId + ':' + postId);
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Router = function () {
  /**
   * Create a Router.
   * @param {object} params - Router settings.
   * @param {object} params.controllers - Object with function to be excuted.
   * @param {object} params.routes - Router information.
   */
  function Router() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    this.handlers = this.assignHandlers(Router.permitParams(params));
  }

  /**
   * Convert url method from string to function.
   * @param {object} params - Permitted parameter.
   * @return {object} Router with function.
   */

  _createClass(Router, [{
    key: 'assignHandlers',
    value: function assignHandlers(params) {
      var controllers = params.controllers;
      var routes = params.routes;
      var routeKeys = Object.keys(routes);

      return routeKeys.reduce(function (prev, currentKey) {
        var _routes$currentKey$sp = routes[currentKey].split('#'),
            _routes$currentKey$sp2 = _slicedToArray(_routes$currentKey$sp, 2),
            controllerName = _routes$currentKey$sp2[0],
            methodName = _routes$currentKey$sp2[1];

        if (!methodName || !controllers[controllerName] || !controllers[controllerName][methodName]) {
          throw new Error('Routes value is invalid.');
        }

        prev.push({
          context: controllers[controllerName],
          route: toString.call(currentKey) == '[object RegExp]' ? currentKey : Router.toRegExp(currentKey),
          handler: controllers[controllerName][methodName]
        });

        return prev;
      }, []);
    }

    /**
    * Execute a handler that matches URL.
    * @param {string} path - String url.
    * @result {*} Return value by executed handler.
    */

  }, {
    key: 'run',
    value: function run(path) {
      var _matchedHandler$;

      path = path.split('/').splice(3).join('/') || '/';
      var matchedHandler = this.handlers.reduce(function (prev, current) {
        var args = path.match(current.route);
        if (args) {
          prev.push({
            handler: current.handler.bind(current.context),
            args: args
          });
        }
        return prev;
      }, []);

      if (matchedHandler.length !== 1) {
        return;
      }
      matchedHandler[0].args.shift();
      return (_matchedHandler$ = matchedHandler[0]).handler.apply(_matchedHandler$, _toConsumableArray(matchedHandler[0].args));
    }

    /**
     * Check parameters.
     * @param {object} params - Router settings.
     * @return {object} Permitted parameter only.
     */

  }], [{
    key: 'permitParams',
    value: function permitParams(params) {
      if (!params.controllers || Object.keys(params.controllers).length === 0) {
        throw new Error('Controller parameters are required.');
      }
      if (!params.routes || Object.keys(params.routes).length === 0) {
        throw new Error('Routes parameters are required.');
      }
      return {
        controllers: params.controllers,
        routes: params.routes
      };
    }

    /**
    * Transform sgring to regexp.（inspired by Backbone.Router）
    * @param {string} key - String route.
    * @return {object} RegExp route.
    */

  }, {
    key: 'toRegExp',
    value: function toRegExp(key) {
      var route = key.replace(/[\-{}\[\]+?.,\\\^$|#\s]/g, '\\$&').replace(/\((.*?)\)/g, '(?:$1)?').replace(/(\(\?)?:\w+/g, function (match, optional) {
        return optional ? match : '([^/?]+)';
      }).replace(/\*\w+/g, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    }
  }]);

  return Router;
}();

exports.default = Router;

},{}]},{},[1]);
