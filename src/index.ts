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
let _callback: Callback = (level, category, msg, params): void => {
  console.log(`${level}: [${category}]`, msg, ...params);
};

interface Log {
  init(config: Record<string, LevelString>, callback?: Callback): Log;
  error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
  warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
}

export const log: Log = {
  /**
   * init optional
   * @param config JSON sets category levels that default to INFO
   * @param callback log callback defaults to console.log
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
    // predicate avoids unnecessary arguments access needed to support rest params in transpiled code
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
    if (_callback && (_level[category] === undefined || Level.WARN >= _level[category])) {
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
    if (_callback && (_level[category] === undefined || Level.INFO >= _level[category])) {
      _callback(Level[Level.INFO], category, message, optionalParams);
    }
  },
};
