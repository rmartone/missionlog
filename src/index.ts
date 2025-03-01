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

export type LogCallback = (
  level: LogLevelStr,
  tag: string,
  message: unknown,
  optionalParams: unknown[],
) => void;

export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

const DEFAULT_TAG = 'default';
const tagRegistry = new Set<string>();

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

const LEVEL_STR_MAP = new Map<Level, LogLevelStr>([
  [Level.TRACE, 'TRACE'],
  [Level.DEBUG, 'DEBUG'],
  [Level.INFO, 'INFO'],
  [Level.WARN, 'WARN'],
  [Level.ERROR, 'ERROR'],
  [Level.OFF, 'OFF'],
]);

export class Log {
  private _defaultLevel: Level = Level.INFO;
  protected readonly _tagToLevel = new Map<string, Level>();
  protected _callback?: LogCallback | null;

  init(config?: Record<string, string>, callback?: LogCallback | null): this {
    if (config) {
      for (const key in config) {
        const levelStr = config[key] as LogLevelStr;

        if (Object.values(LogLevel).includes(levelStr as LogLevel)) {
          const level = (Level as unknown as Record<string, Level>)[levelStr];

          if (key === DEFAULT_TAG) {
            this._defaultLevel = level;
          } else {
            this._tagToLevel.set(key, level);
            tagRegistry.add(key);
          }
        } else {
          console.warn(
            `Invalid log level "${levelStr}" for tag "${key}". Using default (${LEVEL_STR_MAP.get(this._defaultLevel)}).`,
          );
          this._tagToLevel.set(key, Level.DEBUG);
          tagRegistry.add(key);
        }
      }
    }

    if (callback !== undefined) {
      this._callback = callback;
    }

    return this;
  }

  private _log(level: Level, messageOrTag: unknown, ...optionalParams: unknown[]): void {
    if (!this._callback) return;

    let tag: string;
    let message: unknown;

    if (typeof messageOrTag === 'string' && tagRegistry.has(messageOrTag)) {
      tag = messageOrTag;
      message = optionalParams[0] ?? '';
      optionalParams = optionalParams.slice(1);
    } else {
      tag = '';
      message = messageOrTag;
    }

    if (!message) return;

    const effectiveLevel = this._tagToLevel.get(tag || DEFAULT_TAG) ?? this._defaultLevel;
    if (level < effectiveLevel) return;

    this._callback(
      LEVEL_STR_MAP.get(level)!,
      tag,
      message,
      optionalParams.filter((param) => param !== undefined),
    );
  }

  public log(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
  }

  public debug(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.DEBUG, messageOrTag, ...optionalParams);
  }

  public error(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.ERROR, messageOrTag, ...optionalParams);
  }

  public info(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.INFO, messageOrTag, ...optionalParams);
  }

  public trace(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.TRACE, messageOrTag, ...optionalParams);
  }

  public warn(messageOrTag: unknown, ...optionalParams: unknown[]): void {
    this._log(Level.WARN, messageOrTag, ...optionalParams);
  }
}

export const log = new Log();
