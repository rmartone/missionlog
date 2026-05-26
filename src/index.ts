/**
 * @module missionlog
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description A lightweight TypeScript logger with level-based filtering and tagging.
 * Drop-in replacement for console.log with additional categorization and filtering capabilities.
 */

/**
 * Internal log levels (const-object + derived type; values are contiguous 1..6
 * so they can index into LEVEL_STR directly).
 */
const Level = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  OFF: 6,
} as const;
type Level = (typeof Level)[keyof typeof Level];

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

// Level-to-string conversion, indexed directly by the numeric Level value.
// Index 0 is an unused placeholder (Level values start at 1).
const LEVEL_STR: readonly LogLevelStr[] = ['OFF', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF'];

// String to level conversion. Keyed by string so arbitrary user input
// (init config values, isLevelEnabled args) can be looked up without casts.
const STR_TO_LEVEL_MAP = new Map<string, Level>([
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
      for (const key of Object.keys(config)) {
        this._setTagLevel(key, config[key]);
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
  private _setTagLevel(tag: string, levelStr: string): void {
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
        `Invalid log level "${levelStr}" for tag "${tag}". Using default (${LEVEL_STR[this._defaultLevel]}).`,
      );
      this._tagToLevel.set(tag, FALLBACK_LEVEL);
      tagRegistry.add(tag);
    }
  }

  /**
   * Check if logging is enabled for level and tag (cached)
   */
  private _shouldLog(level: Level, tag: string): boolean {
    const normalizedTag = tag || DEFAULT_TAG;

    let levelMap = this._levelCache.get(level);
    if (levelMap) {
      const cached = levelMap.get(normalizedTag);
      if (cached !== undefined) {
        return cached;
      }
    }

    const tagLevel = this._tagToLevel.get(normalizedTag);
    const shouldLog = level >= (tagLevel ?? this._defaultLevel);

    // Only cache known tags (registered, or the default). Arbitrary tags passed
    // to isLevelEnabled() would otherwise grow _levelCache without bound; their
    // result is recomputed each call but is identical to the cached value.
    if (tagLevel !== undefined || normalizedTag === DEFAULT_TAG) {
      if (!levelMap) {
        levelMap = new Map<string, boolean>();
        this._levelCache.set(level, levelMap);
      }
      levelMap.set(normalizedTag, shouldLog);
    }

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

    // Skip the filter allocation unless an undefined is actually present.
    let filteredParams: unknown[];
    if (params.length === 0) {
      filteredParams = EMPTY_ARRAY as unknown[];
    } else if (params.includes(undefined)) {
      filteredParams = params.filter(param => param !== undefined);
    } else {
      filteredParams = params;
    }

    const levelStr = LEVEL_STR[level];

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
