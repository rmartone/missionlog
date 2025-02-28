/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description log adapter that provides level based filtering and tagging
 */

// missionlog

/**
 * Numeric representation of log levels, where ERROR > WARN > INFO.
 */
enum Level {
  TRACE = 1,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

/**
 * Log levels for event handling.
 */
export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  OFF = 'OFF',
}

/**
 * Log callback function type.
 */
export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;

/**
 * Union type for log level strings.
 */
export type LogLevelStr = 'DEBUG' | 'TRACE' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

/**
 * Tag registry.
 */
export const tagRegistry: Record<string, string> = {};

/**
 * Log class for level-based filtering and tagging.
 */
export class Log {
  /**
   * Default log level if not specified in tag config.
   */
  private readonly _defaultLevel: Level = Level.TRACE;

  /**
   * Tag to level mapping.
   */
  protected readonly _tagToLevel: Record<string, Level> = {};

  /**
   * Log callback function.
   */
  protected _callback?: LogCallback | null;

  /**
   * Converts a log level string to its corresponding numeric Level.
   * Marked as protected so that it’s available on the instance.
   *
   * @param levelStr Log level as a string.
   * @returns Numeric log level.
   */
  protected parseLevel(levelStr: LogLevelStr): Level | undefined {
    return Level[levelStr];
  }

  /**
   * Converts a numeric log level to its corresponding log level string.
   * Marked as protected so that it’s available on the instance.
   *
   * @param level Numeric log level.
   * @returns Log level as a string.
   */
  protected levelToString(level: Level): LogLevelStr {
    return Level[level] as LogLevelStr;
  }

  /**
   * Initializes the logger.
   *
   * @param config Optional configuration object mapping tags to log levels. Defaults to INFO if not specified.
   * @param callback Optional callback function for log events.
   * @returns The Log instance for chaining.
   */
  init(config?: Record<string, string>, callback?: LogCallback | null): this {
    if (config) {
      for (const key in config) {
        const levelStr = config[key] as LogLevelStr;
        const level = this.parseLevel(levelStr);
        if (level !== undefined) {
          this._tagToLevel[key] = level;
        } else {
          console.warn(`Invalid log level "${levelStr}" for tag "${key}". Using INFO.`);
          this._tagToLevel[key] = this._defaultLevel;
        }

        tagRegistry[key] = key;
      }
    }

    if (callback !== undefined) {
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
  debug<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.DEBUG, tag, message, optionalParams);
  }

  /**
   * Logs an error message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.ERROR, tag, message, optionalParams);
  }

  /**
   * Logs an informational message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.INFO, tag, message, optionalParams);
  }

  /**
   * Logs a trace message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  trace<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.TRACE, tag, message, optionalParams);
  }

  /**
   * Logs a warning message.
   *
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.WARN, tag, message, optionalParams);
  }

  /**
   * Internal log method.
   *
   * @param level Numeric log level.
   * @param tag Message category.
   * @param message Message to log.
   * @param optionalParams Optional parameters to log.
   */
  private log<T extends string>(level: Level, tag: T, message: unknown, optionalParams: unknown[]): void {
    // Register the tag if not already present using the 'in' operator
    if (!(tag in tagRegistry)) {
      tagRegistry[tag] = tag;
      console.debug(`logger: unregistered tag, "${tag}"`);
    }

    // Early exit if no callback is defined
    if (!this._callback) {
      return;
    }

    // Determine the effective log level for the tag
    const effectiveLevel = this._tagToLevel[tag] ?? this._defaultLevel;

    if (level < effectiveLevel) {
      return;
    }

    // Convert numeric level to string for the callback
    const levelStr = this.levelToString(level);

    // Execute the callback within a try-catch block to safeguard against errors
    try {
      this._callback(levelStr, tag, message, optionalParams);
    } catch (err) {
      console.error(`Error in log callback for tag "${tag}":`, err);
    }
  }
}

/**
 * Singleton Log instance.
 */
export const log = new Log();

/**
 * Tag registry.
 */
export const tag = tagRegistry;
