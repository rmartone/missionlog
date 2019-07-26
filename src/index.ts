/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019 Ray Martone
 * @license MIT
 * @description missionlog is a lightweight logging library
 * supports granular level based filtering and tagging.
 *
 * TLDR: Messages are logged when their level is greater than
 * or equal to their `tag`'s level.
 */

/**
 * Level where `ERROR > WARN > INFO`.
 */
enum Level {
  INFO = 1,
  WARN,
  ERROR,
  OFF,
}
type LevelString = 'OFF' | 'ERROR' | 'INFO' | 'WARN';

/**
 * init assigns tags a level or they default to INFO
 * _tagToLevel hash that maps tags to their level
 */
const _tagTolevel: Record<string, Level> = {};

/**
 * callback that supports logging whatever way works best for you!
 */
type Callback = (level: string, tag: string, message: unknown, optionalParams: unknown[]) => void;
let _callback: Callback;

/**
 * missionlog's public interface
 */
interface Log {
  init(config: Record<string, LevelString>, callback?: Callback): Log;
  error: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
  info: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
  warn: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
}

export const log: Log = {
  /**
   * init
   * @param config JSON object that assigns tags levels. If uninitialized,
   *    a tag's level defaults to INFO where ERROR > WARN > INFO.
   * @param callback? supports logging whatever way works best for you
   *  - style terminal output with chalk
   *  - send JSON to a cloud logging service like Splunk
   *  - log strings and objects to the browser console
   *  - dynamic combination of the above based on your app's env
   * @return {Log} supports chaining
   */
  init: (config: Record<string, LevelString>, callback?: Callback): Log => {
    for (const k in config) {
      _tagTolevel[k] = Level[config[k]];
    }
    if (callback !== undefined) {
      _callback = callback;
    }
    return log;
  },

  /**
   * Writes an error to the log
   * @param tag
   * @param message
   * @param optionalParams
   */
  error: (tag, message, ...optionalParams): void => {
    // avoids unnecessary arguments access in transpiled code
    if (_callback && (_tagTolevel[tag] === undefined || Level.ERROR >= _tagTolevel[tag])) {
      _callback(Level[Level.ERROR], tag, message, optionalParams);
    }
  },

  /**
   * Writes a warning to the log
   * @param tag
   * @param message
   * @param optionalParams
   */
  warn: (tag, message, ...optionalParams): void => {
    // avoids unnecessary arguments access...
    if (_callback && (_tagTolevel[tag] === undefined || Level.WARN >= _tagTolevel[tag])) {
      _callback(Level[Level.WARN], tag, message, optionalParams);
    }
  },

  /**
   * Writes info to the log
   * @param tag
   * @param message
   * @param optionalParams
   */
  info: (tag, message, ...optionalParams): void => {
    // avoids unnecessary arguments access...
    if (_callback && (_tagTolevel[tag] === undefined || Level.INFO >= _tagTolevel[tag])) {
      _callback(Level[Level.INFO], tag, message, optionalParams);
    }
  },
};
