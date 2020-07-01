"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.Log = exports.tag = exports.LogLevel = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019 Ray Martone
 * @license MIT
 * @description log adapter that provides level based filtering and tagging
 */
var LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  OFF: "OFF"
};
exports.LogLevel = LogLevel;
var Level;

(function (Level) {
  Level[Level["INFO"] = 1] = "INFO";
  Level[Level["WARN"] = 2] = "WARN";
  Level[Level["ERROR"] = 3] = "ERROR";
  Level[Level["OFF"] = 4] = "OFF";
})(Level || (Level = {}));

var tag = {};
exports.tag = tag;

var Log = function () {
  function Log() {
    (0, _classCallCheck2.default)(this, Log);
    (0, _defineProperty2.default)(this, "_tagToLevel", {});
    (0, _defineProperty2.default)(this, "_callback", void 0);
  }

  (0, _createClass2.default)(Log, [{
    key: "init",
    value: function init(config, callback) {
      for (var k in config) {
        this._tagToLevel[k] = Level[config[k]] || 1;
      }

      if (callback !== undefined) {
        this._callback = callback;
      }

      for (var key in this._tagToLevel) {
        tag[key] = key;
      }

      return this;
    }
  }, {
    key: "error",
    value: function error(tag, message) {
      if (Level.ERROR >= (this._tagToLevel[tag] || Level.INFO) && this._callback) {
        for (var _len = arguments.length, optionalParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          optionalParams[_key - 2] = arguments[_key];
        }

        this._callback(Level[Level.ERROR], tag, message, optionalParams);
      }
    }
  }, {
    key: "warn",
    value: function warn(tag, message) {
      if (Level.WARN >= (this._tagToLevel[tag] || Level.INFO) && this._callback) {
        for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          optionalParams[_key2 - 2] = arguments[_key2];
        }

        this._callback(Level[Level.WARN], tag, message, optionalParams);
      }
    }
  }, {
    key: "info",
    value: function info(tag, message) {
      if (Level.INFO >= (this._tagToLevel[tag] || Level.INFO) && this._callback) {
        for (var _len3 = arguments.length, optionalParams = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          optionalParams[_key3 - 2] = arguments[_key3];
        }

        this._callback(Level[Level.INFO], tag, message, optionalParams);
      }
    }
  }]);
  return Log;
}();

exports.Log = Log;
var log = new Log();
exports.log = log;