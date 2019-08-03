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

/** singleton that implments the Log interface */
export const log: Log = {
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
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  error: (tag, message, ...optionalParams): void => {
    // avoid unnecessary arguments access in transpiled code
    if (Level.ERROR >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      _callback(Level[Level.ERROR], tag, message, optionalParams);
    }
  },

  /**
   * Writes a warning to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  warn: (tag, message, ...optionalParams): void => {
    // avoid unnecessary arguments access...
    if (Level.WARN >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      _callback(Level[Level.WARN], tag, message, optionalParams);
    }
  },

  /**
   * Writes info to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  info: (tag, message, ...optionalParams): void => {
    // avoid unnecessary arguments access...
    if (Level.INFO >= (_tagTolevel[tag] || Level.INFO) && _callback) {
      _callback(Level[Level.INFO], tag, message, optionalParams);
    }
  },
};
