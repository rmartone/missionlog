// src/index.ts
var Level = /* @__PURE__ */ ((Level2) => {
  Level2[Level2["TRACE"] = 1] = "TRACE";
  Level2[Level2["DEBUG"] = 2] = "DEBUG";
  Level2[Level2["INFO"] = 3] = "INFO";
  Level2[Level2["WARN"] = 4] = "WARN";
  Level2[Level2["ERROR"] = 5] = "ERROR";
  Level2[Level2["OFF"] = 6] = "OFF";
  return Level2;
})(Level || {});
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["TRACE"] = "TRACE";
  LogLevel2["DEBUG"] = "DEBUG";
  LogLevel2["INFO"] = "INFO";
  LogLevel2["WARN"] = "WARN";
  LogLevel2["ERROR"] = "ERROR";
  LogLevel2["OFF"] = "OFF";
  return LogLevel2;
})(LogLevel || {});
var tagRegistry = {};
var Log = class {
  /**
   * Default log level if not specified in tag config.
   */
  _defaultLevel = 3 /* INFO */;
  /**
   * Tag to level mapping.
   */
  _tagToLevel = {};
  /**
   * Log callback function.
   */
  _callback;
  /**
   * Converts a log level string to its corresponding numeric Level.
   * Marked as protected so that it’s available on the instance.
   *
   * @param levelStr Log level as a string.
   * @returns Numeric log level.
   */
  parseLevel(levelStr) {
    return Level[levelStr];
  }
  /**
   * Converts a numeric log level to its corresponding log level string.
   * Marked as protected so that it’s available on the instance.
   *
   * @param level Numeric log level.
   * @returns Log level as a string.
   */
  levelToString(level) {
    return Level[level];
  }
  /**
   * Initializes the logger.
   *
   * @param config Optional configuration object mapping tags to log levels. Defaults to INFO if not specified.
   * @param callback Optional callback function for log events.
   * @returns The Log instance for chaining.
   */
  init(config, callback) {
    if (config) {
      for (const key in config) {
        const levelStr = config[key];
        const level = this.parseLevel(levelStr);
        if (level !== void 0) {
          this._tagToLevel[key] = level;
        } else {
          console.warn(`Invalid log level "${levelStr}" for tag "${key}". Using INFO.`);
          this._tagToLevel[key] = this._defaultLevel;
        }
        tagRegistry[key] = key;
      }
    }
    if (callback) {
      this._callback = callback;
    }
    return this;
  }
  /**
   * Logs a debug message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  debug(tag2, message, ...optionalParams) {
    this.log(2 /* DEBUG */, tag2, message, optionalParams);
  }
  /**
   * Logs an error message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  error(tag2, message, ...optionalParams) {
    this.log(5 /* ERROR */, tag2, message, optionalParams);
  }
  /**
   * Logs an informational message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  info(tag2, message, ...optionalParams) {
    this.log(3 /* INFO */, tag2, message, optionalParams);
  }
  /**
   * Logs a trace message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  trace(tag2, message, ...optionalParams) {
    this.log(1 /* TRACE */, tag2, message, optionalParams);
  }
  /**
   * Logs a warning message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  warn(tag2, message, ...optionalParams) {
    this.log(4 /* WARN */, tag2, message, optionalParams);
  }
  /**
   * Internal log method.
   *
   * @param level Numeric log level.
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  log(level, tag2, message, optionalParams) {
    if (!(tag2 in tagRegistry)) {
      tagRegistry[tag2] = tag2;
      console.debug(`logger: unregistered tag, "${tag2}"`);
    }
    if (!this._callback) {
      return;
    }
    const effectiveLevel = this._tagToLevel[tag2] ?? this._defaultLevel;
    if (level < effectiveLevel) {
      return;
    }
    const levelStr = this.levelToString(level);
    try {
      this._callback(levelStr, tag2, message, optionalParams);
    } catch (err) {
      console.error(`Error in log callback for tag "${tag2}":`, err);
    }
  }
};
var log = new Log();
var tag = tagRegistry;
export {
  Log,
  LogLevel,
  log,
  tag,
  tagRegistry
};
/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description log adapter that provides level based filtering and tagging
 */
//# sourceMappingURL=index.esm.js.map
