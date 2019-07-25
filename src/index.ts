/**
 * Level enum relies on being both a number and string
 */
enum Level {
  INFO = 1,
  WARN,
  ERROR,
  OFF,
}
type LevelString = 'OFF' | 'ERROR' | 'INFO' | 'WARN';

/**
 * maps logging categorites to their max level
 */
const _level: Record<string, Level> = {};

/**
 * log callback
 */
type Callback = (level: string, category: string, message: unknown, optionalParams: unknown[]) => void;
let _callback: Callback;

/**
 * predicate that determines whether a message is log based on category and level
 * @param level
 * @param category
 * @return {boolean}
 */
function _log<T extends string>(level: Level, category: T): boolean {
  if (_callback) {
    if (_level[category] === undefined) {
      _callback('ERROR', 'missionlog', `uninitialized category "${category}"`, []);
    } else {
      return level >= _level[category];
    }
  }
  return false;
}

interface Log {
  init(config: Record<string, LevelString>, callback?: Callback): Log;
  error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
}

export const log: Log = {
  /**
   * Initialize category log levels and set log event callback
   * @param config
   * @param callback
   * @param {Log} support chaining
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
   * Writes an error message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  error: (category, message, ...optionalParams): void => {
    if (_log(Level.ERROR, category)) {
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
    if (_log(Level.WARN, category)) {
      _callback(Level[Level.WARN], category, message, optionalParams);
    }
  },

  /**
   * Writes an info message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  info: (category, message, ...optionalParams): void => {
    if (_log(Level.INFO, category)) {
      _callback(Level[Level.INFO], category, message, optionalParams);
    }
  },
};
