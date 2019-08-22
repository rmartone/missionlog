"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.Log = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019 Ray Martone
 * @license MIT
 * @description missionlog is an easy to use lightweight log adapter
 * that provides level based filtering and tagging.
 *
 * TLDR: Messages are logged when their level is greater than
 * or equal to their `tag`'s level.
 */

/**
 * Level where `ERROR > WARN > INFO`.
 */
var Level;

(function (Level) {
  Level[Level["INFO"] = 1] = "INFO";
  Level[Level["WARN"] = 2] = "WARN";
  Level[Level["ERROR"] = 3] = "ERROR";
  Level[Level["OFF"] = 4] = "OFF";
})(Level || (Level = {}));

/**
 * init assigns tags a level or they default to INFO
 * _tagToLevel hash that maps tags to their level
 */
var _tagTolevel = {};

var Log =
/*#__PURE__*/
function () {
  function Log() {
    _classCallCheck(this, Log);

    _defineProperty(this, "_callback", void 0);
  }

  _createClass(Log, [{
    key: "init",

    /**
     * init
     * @param config JSON that assigns tags levels. If uninitialized,
     *    a tag's level defaults to INFO where ERROR > WARN > INFO.
     * @param callback? supports logging whatever way works best for you
     *  - style terminal output with chalk
     *  - send JSON to a cloud logging service like Splunk
     *  - log strings and objects to the browser console
     *  - combine any of the above based on your app's env
     * @return {this} supports chaining
     */
    value: function init(config, callback) {
      for (var k in config) {
        _tagTolevel[k] = Level[config[k]];
      }

      if (callback !== undefined) {
        this._callback = callback;
      }

      return this;
    }
    /**
     * Writes an error to the log
     * @param tag string categorizes a message
     * @param message object to log
     * @param optionalParams optional list of objects to log
     */

  }, {
    key: "error",
    value: function error(tag, message) {
      // avoid unnecessary arguments access in transpiled code
      if (Level.ERROR >= (_tagTolevel[tag] || Level.INFO) && this._callback) {
        for (var _len = arguments.length, optionalParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          optionalParams[_key - 2] = arguments[_key];
        }

        this._callback(Level[Level.ERROR], tag, message, optionalParams);
      }
    }
    /**
     * Writes a warning to the log
     * @param tag string categorizes a message
     * @param message object to log
     * @param optionalParams optional list of objects to log
     */

  }, {
    key: "warn",
    value: function warn(tag, message) {
      // avoid unnecessary arguments access...
      if (Level.WARN >= (_tagTolevel[tag] || Level.INFO) && this._callback) {
        for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          optionalParams[_key2 - 2] = arguments[_key2];
        }

        this._callback(Level[Level.WARN], tag, message, optionalParams);
      }
    }
    /**
     * Writes info to the log
     * @param tag string categorizes a message
     * @param message object to log
     * @param optionalParams optional list of objects to log
     */

  }, {
    key: "info",
    value: function info(tag, message) {
      // avoid unnecessary arguments access...
      if (Level.INFO >= (_tagTolevel[tag] || Level.INFO) && this._callback) {
        for (var _len3 = arguments.length, optionalParams = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          optionalParams[_key3 - 2] = arguments[_key3];
        }

        this._callback(Level[Level.INFO], tag, message, optionalParams);
      }
    }
  }]);

  return Log;
}();
/** singleton Log instance */


exports.Log = Log;
var log = new Log();
exports.log = log;