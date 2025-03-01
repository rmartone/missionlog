/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2025 Ray Martone
 * @license MIT
 * @description Log adapter providing level-based filtering and tagging.
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

export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;

export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

const tagRegistry = new Set<string>();

export const tag: Record<string, string> = new Proxy(
  {},
  {
    get(_, prop: string) {
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

const LEVEL_MAP = new Map<LogLevelStr, Level>([
  ['TRACE', Level.TRACE],
  ['DEBUG', Level.DEBUG],
  ['INFO', Level.INFO],
  ['WARN', Level.WARN],
  ['ERROR', Level.ERROR],
  ['OFF', Level.OFF],
]);

const LEVEL_STR_MAP = new Map<Level, LogLevelStr>([
  [Level.TRACE, 'TRACE'],
  [Level.DEBUG, 'DEBUG'],
  [Level.INFO, 'INFO'],
  [Level.WARN, 'WARN'],
  [Level.ERROR, 'ERROR'],
  [Level.OFF, 'OFF'],
]);

export class Log {
  private readonly _defaultLevel: Level = Level.TRACE;
  protected readonly _tagToLevel = new Map<string, Level>();
  protected _callback?: LogCallback | null;

  protected levelToString(level: Level): LogLevelStr {
    return LEVEL_STR_MAP.get(level)!;
  }

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

    // Preserve undefined behavior unless explicitly setting null
    if (callback !== undefined) {
      this._callback = callback;
    }

    return this;
  }

  private getEffectiveLogLevel(tag: string): Level {
    if (!this._tagToLevel.has(tag)) {
      if (!tagRegistry.has(tag)) {
        console.debug(`logger: unregistered tag, "${tag}"`);
      }
      return this._defaultLevel;
    }
    return this._tagToLevel.get(tag)!;
  }

  private log<T extends string>(level: Level, tag: T, message: unknown, optionalParams: unknown[]): void {
    if (!this._callback) {
      return;
    }

    const effectiveLevel = this.getEffectiveLogLevel(tag);

    if (level < effectiveLevel) {
      return;
    }

    const levelStr = this.levelToString(level);
    this._callback(levelStr, tag, message, optionalParams);
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

export const log = new Log();
