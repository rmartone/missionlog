/**
 * @module missionlog
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description A lightweight TypeScript logger providing level-based filtering and tagging capabilities.
 * missionlog is designed as a drop-in replacement for console.log with additional features for
 * categorizing and filtering logs by severity levels and custom tags.
 *
 * Key features:
 * - Type safety with LogMessage and LogConfig interfaces
 * - Performance optimizations with level caching
 * - Enhanced API with structured logging support via EnhancedLogCallback
 * - Fully chainable API with all methods returning the logger instance
 * - Level checking with isLevelEnabled() and configuration reset()
 * - Full backward compatibility with existing logging patterns
 */

enum Level {
  TRACE = 1,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  OFF = 'OFF',
}

export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';
export type LogMessage = string | number | boolean | object | Error | null | undefined;

export interface LogCallbackParams {
  level: LogLevelStr;
  tag: string;
  message: LogMessage;
  params: unknown[];
  timestamp: Date;
}

export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;
export type EnhancedLogCallback = (params: LogCallbackParams) => void;

export interface LogConfig {
  [tag: string]: LogLevelStr;
}

export const DEFAULT_TAG = '*';
const tagRegistry = new Set<string>();

/**
 * Proxy object for type-safe tag access
 * Provides autocompletion and validation for registered tags
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

// Map to convert numeric Level enum to string representation
const LEVEL_STR_MAP = new Map<Level, LogLevelStr>([
  [Level.TRACE, 'TRACE'],
  [Level.DEBUG, 'DEBUG'],
  [Level.INFO, 'INFO'],
  [Level.WARN, 'WARN'],
  [Level.ERROR, 'ERROR'],
  [Level.OFF, 'OFF'],
]);

// Map to convert string level to numeric Level enum
const STR_TO_LEVEL_MAP = new Map<LogLevelStr, Level>([
  ['TRACE', Level.TRACE],
  ['DEBUG', Level.DEBUG],
  ['INFO', Level.INFO],
  ['WARN', Level.WARN],
  ['ERROR', Level.ERROR],
  ['OFF', Level.OFF],
]);

export class Log {
  private _defaultLevel: Level = Level.INFO;
  protected readonly _tagToLevel = new Map<string, Level>();
  private readonly _levelCache = new Map<string, boolean>();
  protected _callback?: LogCallback | null;
  protected _enhancedCallback?: EnhancedLogCallback;

  /**
   * Initialize the logger with configuration and callback
   * @param config - Map of tags to log levels
   * @param callback - Callback function for log processing
   */
  init(config?: Record<string, string> | LogConfig, callback?: LogCallback | null): this {
    // Clear caches when configuration changes
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
   * Set the log level for a specific tag
   * @param tag - The tag to set the level for
   * @param levelStr - The log level as a string
   */
  private _setTagLevel(tag: string, levelStr: LogLevelStr): void {
    // Use direct map lookup instead of Object.values + includes
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
      // Use DEBUG as fallback level for invalid configurations
      this._tagToLevel.set(tag, Level.DEBUG);
      tagRegistry.add(tag);
    }
  }

  /**
   * Set an enhanced callback that receives structured log data
   * @param callback - Enhanced callback function
   */
  setEnhancedCallback(callback: EnhancedLogCallback): this {
    this._enhancedCallback = callback;
    return this;
  }

  /**
   * Check if a message should be logged based on level and tag
   * @param level - The log level
   * @param tag - The log tag
   */
  private _shouldLog(level: Level, tag: string): boolean {
    // Use cache to avoid repeated lookups and comparisons
    const cacheKey = `${level}:${tag || DEFAULT_TAG}`;
    if (this._levelCache.has(cacheKey)) {
      return this._levelCache.get(cacheKey)!;
    }

    const effectiveLevel = this._tagToLevel.get(tag || DEFAULT_TAG) ?? this._defaultLevel;
    const shouldLog = level >= effectiveLevel;

    // Cache the result
    this._levelCache.set(cacheKey, shouldLog);
    return shouldLog;
  }

  /**
   * Internal logging implementation
   */
  private _log(level: Level, messageOrTag?: unknown, ...optionalParams: unknown[]): void {
    if (!this._callback && !this._enhancedCallback) return;
    if (messageOrTag === undefined) return;

    let tag: string = '';
    let message: unknown;

    // Handle tag-based logging
    if (typeof messageOrTag === 'string' && tagRegistry.has(messageOrTag)) {
      tag = messageOrTag;
      message = optionalParams[0] ?? '';
      optionalParams = optionalParams.slice(1);
    } else {
      message = messageOrTag;
    }

    // Skip if message is undefined, empty, or if level is filtered
    if (message === undefined || message === '') return;
    if (!this._shouldLog(level, tag)) return;

    // Filter out undefined parameters
    const filteredParams = optionalParams.filter(param => param !== undefined);
    const levelStr = LEVEL_STR_MAP.get(level)!;

    // Call legacy callback for backward compatibility
    if (this._callback) {
      this._callback(levelStr, tag, message, filteredParams);
    }

    // Call enhanced callback with structured data if available
    if (this._enhancedCallback) {
      this._enhancedCallback({
        level: levelStr,
        tag,
        message: message as LogMessage,
        params: filteredParams,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Log a message at DEBUG level
   * @returns this for chaining
   */
  public debug(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.DEBUG, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at ERROR level
   * @returns this for chaining
   */
  public error(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.ERROR, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at INFO level
   * @returns this for chaining
   */
  public info(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at INFO level (alias for info)
   * @returns this for chaining
   */
  public log(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at TRACE level
   * @returns this for chaining
   */
  public trace(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.TRACE, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Log a message at WARN level
   * @returns this for chaining
   */
  public warn(messageOrTag?: unknown, ...optionalParams: unknown[]): this {
    this._log(Level.WARN, messageOrTag, ...optionalParams);
    return this;
  }

  /**
   * Check if a specific level would be logged for a tag
   * @param level - The log level to check
   * @param tag - The tag to check (optional)
   */
  public isLevelEnabled(level: LogLevelStr, tag: string = DEFAULT_TAG): boolean {
    const numericLevel = STR_TO_LEVEL_MAP.get(level);
    if (numericLevel === undefined) return false;
    return this._shouldLog(numericLevel, tag);
  }

  /**
   * Clear all tag registrations and configurations
   */
  public reset(): this {
    this._tagToLevel.clear();
    this._levelCache.clear();
    this._defaultLevel = Level.INFO;
    return this;
  }
}

export const log = new Log();
