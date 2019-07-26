/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019 Ray Martone
 * @license MIT
 * @description missionlog is an easy to use lightweight logging library
 * that provides level based category filtering. Messages are logged
 * when their level is greater than or equal to their category's level.
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
 * At initialization, categories are assigned a level.
 * _level maps categorites to their level
 */
const _level: Record<string, Level> = {};

/**
 * log callback that supports logging whatever way works best for you!
 */
type Callback = (level: string, category: string, message: unknown, optionalParams: unknown[]) => void;
let _callback: Callback;

/**
 * missionlog's public interface
 */
interface Log {
  init(config: Record<string, LevelString>, callback?: Callback): Log;
  error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
}

export const log: Log = {
  /**
   * init
   * @param config JSON assigns category levels. If uninitialized,
   *    categories default to INFO (log everything)
   * @param callback? supports logging whatever way works best for you
   *  - style terminal output with chalk
   *  - send JSON to a cloud logging service like Splunk
   *  - log strings and objects to the browser console
   * @return {Log} supports chaining
   */
  init: (config: Record<string, LevelString>, callback?: Callback): Log => {
    for (const k in config) {
      _level[k] = Level[config[k]];
    }
    if (callback !== undefined) {
      _callback = callback;
    }
    return log;
  },

  /**
   * Writes an error to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  error: (category, message, ...optionalParams): void => {
    // avoids unnecessary arguments access in transpiled code
    if (_callback && (_level[category] === undefined || Level.ERROR >= _level[category])) {
      _callback(Level[Level.ERROR], category, message, optionalParams);
    }
  },

  /**
   * Writes a warning to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  warn: (category, message, ...optionalParams): void => {
    // avoids unnecessary arguments access...
    if (_callback && (_level[category] === undefined || Level.WARN >= _level[category])) {
      _callback(Level[Level.WARN], category, message, optionalParams);
    }
  },

  /**
   * Writes info to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  info: (category, message, ...optionalParams): void => {
    // avoids unnecessary arguments access...
    if (_callback && (_level[category] === undefined || Level.INFO >= _level[category])) {
      _callback(Level[Level.INFO], category, message, optionalParams);
    }
  },
};
