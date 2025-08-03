/**
 * @module missionlog
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description A lightweight TypeScript logger with level-based filtering and tagging.
 * Drop-in replacement for console.log with additional categorization and filtering capabilities.
 */

/**
 * Internal log levels enum
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
 * Public log levels enum for external use
 */
export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  OFF = 'OFF',
}

/** Valid log level strings */
export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

/** Supported message types for logging */
export type LogMessage = string | number | boolean | object | Error | null | undefined;

/** Callback function invoked for each log message */
export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;

/** Configuration mapping tags to log levels */
export interface LogConfig {
  [tag: string]: LogLevelStr;
}

/** Default tag used for untagged logging and wildcard configuration */
export const DEFAULT_TAG = '*';
const tagRegistry = new Set<string>();

/**
 * Proxy for type-safe tag access with runtime validation.
 * Returns the tag name if registered, undefined otherwise.
 */
export const tag: Record<string, string> = new Proxy(
  {},
  {
    get(_, prop: string) {
      if (typeof prop === 'string' && tagRegistry.has(prop)) {
        return prop;
      }
      return undefined;
    },
    ownKeys() {
      return Array.from(tagRegistry);
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  },
);

// Level enum to string conversion
const LEVEL_STR_MAP = new Map<Level, LogLevelStr>([
  [Level.TRACE, 'TRACE'],
  [Level.DEBUG, 'DEBUG'],
  [Level.INFO, 'INFO'],
  [Level.WARN, 'WARN'],
  [Level.ERROR, 'ERROR'],
  [Level.OFF, 'OFF'],
]);

// String to level enum conversion
const STR_TO_LEVEL_MAP = new Map<LogLevelStr, Level>([
  ['TRACE', Level.TRACE],
  ['DEBUG', Level.DEBUG],
  ['INFO', Level.INFO],
  ['WARN', Level.WARN],
  ['ERROR', Level.ERROR],
  ['OFF', Level.OFF],
]);

const DEFAULT_LEVEL = Level.INFO;
const FALLBACK_LEVEL = Level.DEBUG;
const EMPTY_ARRAY: readonly unknown[] = [];

/**
 * Main logging class with level-based filtering and tagging support
 */
export class Log {
  private _defaultLevel: Level = DEFAULT_LEVEL;
  protected readonly _tagToLevel = new Map<string, Level>();
  private readonly _levelCache = new Map<Level, Map<string, boolean>>();
  protected _callback?: LogCallback | null;

  /**
   * Initialize logger with tag levels and callback
   * @param config - Map of tags to log levels
   * @param callback - Callback function for log processing
   * @returns this for method chaining
   */
  init(config?: Record<string, string> | LogConfig, callback?: LogCallback | null): this {
    this._levelCache.clear();

    if (config) {
      for (const key in config) {
        const levelStr = config[key] as LogLevelStr;
        this._setTagLevel(key, levelStr);
      }
    }

    if (callback !== undefined) {
      this._callback = callback;
    }

    return this;
  }

  /**
   * Set log level for a tag
   */
  private _setTagLevel(tag: string, levelStr: LogLevelStr): void {
    const level = STR_TO_LEVEL_MAP.get(levelStr);

    if (level !== undefined) {
      if (tag === DEFAULT_TAG) {
        this._defaultLevel = level;
      } else {
        this._tagToLevel.set(tag, level);
        tagRegistry.add(tag);
      }
    } else {
      console.warn(
        `Invalid log level "${levelStr}" for tag "${tag}". Using default (${LEVEL_STR_MAP.get(this._defaultLevel)}).`,
      );
      this._tagToLevel.set(tag, FALLBACK_LEVEL);
      tagRegistry.add(tag);
    }
  }

  /**
   * Check if logging is enabled for level and tag (cached)
   */
  private _shouldLog(level: Level, tag: string): boolean {
    let levelMap = this._levelCache.get(level);
    if (!levelMap) {
      levelMap = new Map<string, boolean>();
      this._levelCache.set(level, levelMap);
    }

    const normalizedTag = tag || DEFAULT_TAG;
    const cached = levelMap.get(normalizedTag);
    if (cached !== undefined) {
      return cached;
    }

    const effectiveLevel = this._tagToLevel.get(normalizedTag) ?? this._defaultLevel;
    const shouldLog = level >= effectiveLevel;

    levelMap.set(normalizedTag, shouldLog);
    return shouldLog;
  }

  /**
   * Internal logging implementation
   */
  private _log(level: Level, messageOrTag?: unknown, ...optionalParams: unknown[]): void {
    if (!this._callback || messageOrTag === undefined) return;

    let tag: string;
    let message: unknown;
    let params: unknown[];

    if (typeof messageOrTag === 'string' && tagRegistry.has(messageOrTag)) {
      tag = messageOrTag;
      message = optionalParams[0];
      params = optionalParams.slice(1);
    } else {
      tag = DEFAULT_TAG;
      message = messageOrTag;
      params = optionalParams;
    }

    if (message === undefined || message === '') return;
    if (!this._shouldLog(level, tag)) return;

    const filteredParams = params.length > 0 ? params.filter(param => param !== undefined) : (EMPTY_ARRAY as unknown[]);

    const levelStr = LEVEL_STR_MAP.get(level)!;

    const outputTag = tag === DEFAULT_TAG ? '' : tag;
    this._callback(levelStr, outputTag, message, filteredParams);
  }

  /**
   * Log a message at DEBUG level
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public debug(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.DEBUG, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at ERROR level
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public error(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.ERROR, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at INFO level
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public info(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at INFO level (alias for info)
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public log(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at TRACE level
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public trace(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.TRACE, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at WARN level
   * @param messageOrTag - Message to log, or tag if second parameter is provided
   * @param optionalParams - Additional parameters to log
   * @returns this for method chaining
   */
  public warn(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.WARN, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Check if level would be logged for tag
   * @param level - The log level to check
   * @param tag - The tag to check (defaults to DEFAULT_TAG)
   * @returns true if the level would be logged for the tag
   */
  public isLevelEnabled(level: LogLevelStr, tag: string = DEFAULT_TAG): boolean {
    const numericLevel = STR_TO_LEVEL_MAP.get(level);
    if (numericLevel === undefined) return false;
    return this._shouldLog(numericLevel, tag);
  }

  /**
   * Check if DEBUG level is enabled for a tag
   * @param tag - The tag to check (defaults to DEFAULT_TAG)
   * @returns true if DEBUG level is enabled for the tag
   */
  public isDebugEnabled(tag: string = DEFAULT_TAG): boolean {
    return this.isLevelEnabled(LogLevel.DEBUG, tag);
  }

  /**
   * Check if TRACE level is enabled for a tag
   * @param tag - The tag to check (defaults to DEFAULT_TAG)
   * @returns true if TRACE level is enabled for the tag
   */
  public isTraceEnabled(tag: string = DEFAULT_TAG): boolean {
    return this.isLevelEnabled(LogLevel.TRACE, tag);
  }

  /**
   * Reset logger to initial state
   * @returns this for method chaining
   */
  public reset(): this {
    this._tagToLevel.clear();
    this._levelCache.clear();
    this._defaultLevel = DEFAULT_LEVEL;
    this._callback = undefined;
    tagRegistry.clear();
    return this;
  }
}

/** Default logger instance ready for immediate use */
export const log = new Log();
