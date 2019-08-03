"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = void 0;

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
/**
 * callback that supports logging whatever way works best for you!
 */

var _callback;
/**
 * missionlog's public interface
 */


/** singleton that implments the Log interface */
var log = {
  /**
   * init
   * @param config JSON that assigns tags levels. If uninitialized,
   *    a tag's level defaults to INFO where ERROR > WARN > INFO.
   * @param callback? supports logging whatever way works best for you
   *  - style terminal output with chalk
   *  - send JSON to a cloud logging service like Splunk
   *  - log strings and objects to the browser console
   *  - dynamic combination of the above based on your app's env
   * @return {Log} supports chaining
   */
  init: function init(config, callback) {
    for (var k in config) {
      _tagTolevel[k] = Level[config[k]];
    }

    if (callback !== undefined) {
      _callback = callback;
    }

    return log;
  },

  /**
   * Writes an error to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  error: function error(tag, message) {
    // avoid unnecessary arguments access in transpiled code
    if (Level.ERROR >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      for (var _len = arguments.length, optionalParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        optionalParams[_key - 2] = arguments[_key];
      }

      _callback(Level[Level.ERROR], tag, message, optionalParams);
    }
  },

  /**
   * Writes a warning to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  warn: function warn(tag, message) {
    // avoid unnecessary arguments access...
    if (Level.WARN >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        optionalParams[_key2 - 2] = arguments[_key2];
      }

      _callback(Level[Level.WARN], tag, message, optionalParams);
    }
  },

  /**
   * Writes info to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  info: function info(tag, message) {
    // avoid unnecessary arguments access...
    if (Level.INFO >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      for (var _len3 = arguments.length, optionalParams = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        optionalParams[_key3 - 2] = arguments[_key3];
      }

      _callback(Level[Level.INFO], tag, message, optionalParams);
    }
  }
};
exports.log = log;