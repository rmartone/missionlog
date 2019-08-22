/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019 Ray Martone
 * @license MIT
 * @description missionlog is an easy to use lightweight log adapter
 * that provides level based filtering and tagging.
 *
 * TLDR: Messages are logged when their level is greater than
 * or equal to their `tag`'s level.
 */

/**
 * Level where `ERROR > WARN > INFO`.
 */
enum Level {
  INFO = 1,
  WARN,
  ERROR,
  OFF,
}

type LevelString = 'OFF' | 'ERROR' | 'INFO' | 'WARN';
type Callback = (level: string, tag: string, message: unknown, optionalParams: unknown[]) => void;

export class Log {
  /**
   * init assigns tags a level or they default to INFO
   * _tagToLevel hash that maps tags to their level
   */
  protected readonly _tagTolevel: Record<string, Level> = {};

  /**
   * callback that supports logging whatever way works best for you!
   */
  protected _callback?: Callback;

  /**
   * init
   * @param config JSON that assigns tags levels. If uninitialized,
   *    a tag's level defaults to INFO where ERROR > WARN > INFO.
   * @param callback? supports logging whatever way works best for you
   *  - style terminal output with chalk
   *  - send JSON to a cloud logging service like Splunk
   *  - log strings and objects to the browser console
   *  - combine any of the above based on your app's env
   * @return {this} supports chaining
   */
  public init(config: Record<string, LevelString>, callback?: Callback): this {
    for (const k in config) {
      this._tagTolevel[k] = Level[config[k]];
    }
    if (callback !== undefined) {
      this._callback = callback;
    }
    return this;
  }

  /**
   * Writes an error to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  public error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    // avoid unnecessary arguments access in transpiled code
    if (Level.ERROR >= (this._tagTolevel[tag] || Level.INFO) && this._callback) {
      this._callback(Level[Level.ERROR], tag, message, optionalParams);
    }
  }

  /**
   * Writes a warning to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  public warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    // avoid unnecessary arguments access...
    if (Level.WARN >= (this._tagTolevel[tag] || Level.INFO) && this._callback) {
      this._callback(Level[Level.WARN], tag, message, optionalParams);
    }
  }

  /**
   * Writes info to the log
   * @param tag string categorizes a message
   * @param message object to log
   * @param optionalParams optional list of objects to log
   */
  public info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void {
    // avoid unnecessary arguments access...
    if (Level.INFO >= (this._tagTolevel[tag] || Level.INFO) && this._callback) {
      this._callback(Level[Level.INFO], tag, message, optionalParams);
    }
  }
}

/** singleton Log instance */
export const log = new Log();
