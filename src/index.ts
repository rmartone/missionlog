/**
 * Level enum relies on being both a number and string
 */
enum Level {
  OFF = 1,
  ERROR,
  WARN,
  INFO,
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
 * handler that invokes the log callback when appropriate
 * @param level
 * @param category
 * @param message
 * @param optionalParams
 */
function _log<T extends string>(level: Level, category: T, message: unknown, optionalParams: unknown[]): void {
  if (_callback) {
    const maxLevel = _level[category];
    if (maxLevel === undefined) {
      _callback('ERROR', 'missionlog', `uninitialized category "${category}"`, []);
    }
    if (level <= maxLevel || maxLevel === undefined) {
      _callback(Level[level], category, message, optionalParams);
    }
  }
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
    if (callback) {
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
  error: (category, message, ...optionalParams): void => _log(Level.ERROR, category, message, optionalParams),

  /**
   * Writes a warning to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  warn: (category, message, ...optionalParams): void => _log(Level.WARN, category, message, optionalParams),

  /**
   * Writes an info message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  info: (category, message, ...optionalParams): void => _log(Level.INFO, category, message, optionalParams),
};
