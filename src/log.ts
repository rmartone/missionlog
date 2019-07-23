/**
 * Level (relies on enum being both a number and string)
 */
enum Level {
  OFF = 1,
  ERROR,
  WARN,
  INFO,
}

/**
 * maps a logging category to its max severity
 */
const _level: Record<string, Level> = {};

/**
 * log event callback
 */
type Callback = (level: string, category: string, message: unknown, optionalParams: unknown[]) => void;
let _callback: Callback;

/**
 * calls log callback when appropriate
 * @param category
 * @param level
 * @param message
 * @param optionalParams
 */
function write<T extends string>(category: T, level: Level, message: unknown, optionalParams: unknown[]): void {
  const maxLevel = _level[category];
  if (maxLevel === undefined) {
    throw Error(`category ${category} not configured`);
  }
  if (level <= maxLevel) {
    _callback(Level[level], category, message, optionalParams);
  }
}

export const log = {
  /**
   * Initialize category log levels and set log event callback
   * @param config
   * @param callback
   */
  init: (config: Record<string, 'OFF' | 'ERROR' | 'INFO' | 'WARN'>, callback: Callback): void => {
    for (const k in config) {
      _level[k] = Level[config[k]];
    }
    _callback = callback;
  },

  /**
   * Writes an error message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Level.ERROR, message, optionalParams);
  },

  /**
   * Writes a warning to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Level.WARN, message, optionalParams);
  },

  /**
   * Writes an info message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Level.INFO, message, optionalParams);
  },
};
