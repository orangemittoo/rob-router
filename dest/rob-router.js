"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Router {
  /**
   * Create a Router.
   * @param {object} params - Router settings.
   * @param {object} params.controllers - Object with function to be excuted.
   * @param {object} params.routes - Router information.
   */
  constructor() {
    let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.handlers = this.assignHandlers(Router.permitParams(params));
  }
  /**
   * Convert url method from string to function.
   * @param {object} params - Permitted parameter.
   * @return {object} Router with function.
   */


  assignHandlers(params) {
    const controllers = params.controllers;
    const routes = params.routes;
    const routeKeys = Object.keys(routes);
    return routeKeys.reduce((prev, currentKey) => {
      const [controllerName, methodName] = routes[currentKey].split('#');

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


  run(path) {
    path = path.split('/').splice(3).join('/') || '/';
    const matchedHandler = this.handlers.reduce((prev, current) => {
      const args = path.match(current.route);

      if (args) {
        prev.push({
          handler: current.handler.bind(current.context),
          args
        });
      }

      return prev;
    }, []);

    if (matchedHandler.length !== 1) {
      return;
    }

    matchedHandler[0].args.shift();
    return matchedHandler[0].handler(...matchedHandler[0].args);
  }
  /**
   * Check parameters.
   * @param {object} params - Router settings.
   * @return {object} Permitted parameter only.
   */


  static permitParams(params) {
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


  static toRegExp(key) {
    const route = key.replace(/[\-{}\[\]+?.,\\\^$|#\s]/g, '\\$&').replace(/\((.*?)\)/g, '(?:$1)?').replace(/(\(\?)?:\w+/g, function (match, optional) {
      return optional ? match : '([^/?]+)';
    }).replace(/\*\w+/g, '([^?]*?)');
    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  }

}

var _default = Router;
exports.default = _default;
