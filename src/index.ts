/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description log adapter that provides level-based filtering and tagging
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
 * Internal Set for fast tag lookups.
 */
const tagRegistry = new Set<string>();

/**
 * Exported tag dictionary that mirrors the Set.
 */
export const tag: Record<string, string> = new Proxy({}, {
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
  }
});

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
  /**
   * Default log level if not specified in tag config.
   */
  private readonly _defaultLevel: Level = Level.TRACE;

  /**
   * Tag to level mapping (Now a `Map` instead of an object).
   */
  protected readonly _tagToLevel = new Map<string, Level>();

  /**
   * Log callback function.
   */
  protected _callback?: LogCallback | null;

  /**
   * Converts a log level string to its corresponding numeric Level.
   * Optimized to avoid enum reverse lookups.
   *
   * @param levelStr Log level as a string.
   * @returns Numeric log level.
   */
  protected parseLevel(levelStr: LogLevelStr): Level {
    return LEVEL_MAP.get(levelStr) ?? this._defaultLevel;
  }

  /**
   * Converts a numeric log level to its corresponding log level string.
   * Optimized to avoid enum reverse lookups.
   *
   * @param level Numeric log level.
   * @returns Log level as a string.
   */
  protected levelToString(level: Level): LogLevelStr {
    return LEVEL_STR_MAP.get(level) ?? LEVEL_STR_MAP.get(this._defaultLevel)!;
  }

  /**
   * Initializes the logger.
   *
   * @param config Optional configuration object mapping tags to log levels. Defaults to TRACE if not specified.
   * @param callback Optional callback function for log events.
   * @returns The Log instance for chaining.
   */
  init(config?: Record<string, string>, callback?: LogCallback | null): this {
    if (config) {
      for (const key in config) {
        const levelStr = config[key] as LogLevelStr;
        const level = this.parseLevel(levelStr);
        this._tagToLevel.set(key, level);
        tagRegistry.add(key);
      }
    }

    if (callback !== undefined) {
      this._callback = callback;
    }

    return this;
  }

  /**
   * Logs a message at the specified level.
   */
  private log<T extends string>(level: Level, tag: T, message: unknown, optionalParams: unknown[]): void {
    if (!tagRegistry.has(tag)) {
      console.debug(`logger: unregistered tag, "${tag}"`);
    }

    if (!this._callback) {
      return;
    }

    const effectiveLevel = this._tagToLevel.get(tag) ?? this._defaultLevel;

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

  debug<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.DEBUG, tag, message, optionalParams);
  }

  error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.ERROR, tag, message, optionalParams);
  }

  info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.INFO, tag, message, optionalParams);
  }

  trace<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.TRACE, tag, message, optionalParams);
  }

  warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    this.log(Level.WARN, tag, message, optionalParams);
  }
}

/**
 * Singleton Log instance.
 */
export const log = new Log();
