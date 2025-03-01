/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description Log adapter providing level-based filtering and tagging.
 */

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
 * Log levels as strings for event handling.
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
 * Callback function type for handling log events.
 */
export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;

/**
 * Allowed log level strings.
 */
export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

/**
 * Internal registry of known log tags.
 */
const tagRegistry = new Set<string>();

/**
 * Proxy-based dictionary that allows dynamic tag access (`tag.system`).
 */
export const tag: Record<string, string> = new Proxy(
  {},
  {
    get(target, prop: string) {
      if (typeof prop === 'string') {
        if (!tagRegistry.has(prop)) {
          tagRegistry.add(prop);
          console.debug(`logger: unregistered tag, "${prop}"`);
        }
        return prop;
      }
    },
    ownKeys() {
      return Array.from(tagRegistry);
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  },
);

/**
 * Direct mapping from log level strings to numeric values.
 */
const LEVEL_MAP = new Map<LogLevelStr, Level>([
  ['TRACE', Level.TRACE],
  ['DEBUG', Level.DEBUG],
  ['INFO', Level.INFO],
  ['WARN', Level.WARN],
  ['ERROR', Level.ERROR],
  ['OFF', Level.OFF],
]);

/**
 * Direct mapping from numeric levels to string levels.
 */
const LEVEL_STR_MAP = new Map<Level, LogLevelStr>([
  [Level.TRACE, 'TRACE'],
  [Level.DEBUG, 'DEBUG'],
  [Level.INFO, 'INFO'],
  [Level.WARN, 'WARN'],
  [Level.ERROR, 'ERROR'],
  [Level.OFF, 'OFF'],
]);

/**
 * Log class for level-based filtering and tagging.
 */
export class Log {
  /** Default log level if not specified. */
  private readonly _defaultLevel: Level = Level.TRACE;

  /** Mapping of tags to their assigned log levels. */
  protected readonly _tagToLevel = new Map<string, Level>();

  /** Optional callback function for handling log events. */
  protected _callback?: LogCallback | null;

  /**
   * Converts a log level string to its corresponding numeric Level.
   * @param levelStr The log level string.
   * @returns The corresponding numeric log level.
   */
  protected parseLevel(levelStr: LogLevelStr): Level {
    return LEVEL_MAP.get(levelStr) ?? this._defaultLevel;
  }

  /**
   * Converts a numeric log level to its corresponding string representation.
   * @param level The numeric log level.
   * @returns The corresponding log level string.
   */
  protected levelToString(level: Level): LogLevelStr {
    return LEVEL_STR_MAP.get(level) ?? LEVEL_STR_MAP.get(this._defaultLevel)!;
  }

  /**
   * Initializes the logger with optional tag configurations.
   * @param config An object mapping tags to log levels.
   * @param callback A function to handle log messages.
   * @returns The Log instance for method chaining.
   */
  init(config?: Record<string, string>, callback?: LogCallback | null): this {
    if (config) {
      for (const key in config) {
        const levelStr = config[key] as LogLevelStr;

        if (LEVEL_MAP.has(levelStr)) {
          this._tagToLevel.set(key, LEVEL_MAP.get(levelStr)!);
        } else {
          console.warn(
            `Invalid log level "${levelStr}" for tag "${key}". Using default (${this.levelToString(this._defaultLevel)}).`,
          );
          this._tagToLevel.set(key, this._defaultLevel);
        }

        tagRegistry.add(key);
      }
    }

    if (callback !== undefined) {
      this._callback = callback;
    }

    return this;
  }

  /**
   * Retrieves the effective log level for a tag.
   * Logs a warning if the tag is unregistered.
   * @param tag The log tag.
   * @returns The numeric log level for the tag.
   */
  private getEffectiveLogLevel(tag: string): Level {
    const level = this._tagToLevel.get(tag);

    if (level === undefined) {
      console.debug(`logger: unregistered tag, "${tag}"`);
      return this._defaultLevel;
    }

    return level;
  }

  /**
   * Internal log method that processes log messages.
   * @param level The numeric log level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  private log<T extends string>(level: Level, tag: T, message: unknown, optionalParams: unknown[]): void {
    if (!this._callback) {
      return;
    }

    const effectiveLevel = this.getEffectiveLogLevel(tag);

    if (level < effectiveLevel) {
      return;
    }

    const levelStr = this.levelToString(level);

    try {
      this._callback(levelStr, tag, message, optionalParams);
    } catch (err) {
      console.error(`Error in log callback for tag "${tag}":`, err);
    }
  }

  /**
   * Logs a message at the DEBUG level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  debug<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.DEBUG, tag, message, optionalParams);
  }

  /**
   * Logs a message at the ERROR level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.ERROR, tag, message, optionalParams);
  }

  /**
   * Logs a message at the INFO level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.INFO, tag, message, optionalParams);
  }

  /**
   * Logs a message at the TRACE level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  trace<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.TRACE, tag, message, optionalParams);
  }

  /**
   * Logs a message at the WARN level.
   * @param tag The category or tag for the log message.
   * @param message The message content.
   * @param optionalParams Additional parameters to log.
   */
  warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.WARN, tag, message, optionalParams);
  }
}

/**
 * Singleton Log instance.
 */
export const log = new Log();
