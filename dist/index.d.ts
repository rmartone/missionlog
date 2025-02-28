/**
 * @author Ray Martone
 * @copyright Copyright (c) 2019-2022 Ray Martone
 * @license MIT
 * @description log adapter that provides level based filtering and tagging
 */
/**
 * Numeric representation of log levels, where ERROR > WARN > INFO.
 */
declare enum Level {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    OFF = 6
}
/**
 * Log levels for event handling.
 */
export declare enum LogLevel {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    OFF = "OFF"
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
export declare const tagRegistry: Record<string, string>;
/**
 * Log class for level-based filtering and tagging.
 */
export declare class Log {
    /**
     * Default log level if not specified in tag config.
     */
    private readonly _defaultLevel;
    /**
     * Tag to level mapping.
     */
    protected readonly _tagToLevel: Record<string, Level>;
    /**
     * Log callback function.
     */
    protected _callback?: LogCallback;
    /**
     * Converts a log level string to its corresponding numeric Level.
     * Marked as protected so that it’s available on the instance.
     *
     * @param levelStr Log level as a string.
     * @returns Numeric log level.
     */
    protected parseLevel(levelStr: LogLevelStr): Level | undefined;
    /**
     * Converts a numeric log level to its corresponding log level string.
     * Marked as protected so that it’s available on the instance.
     *
     * @param level Numeric log level.
     * @returns Log level as a string.
     */
    protected levelToString(level: Level): LogLevelStr;
    /**
     * Initializes the logger.
     *
     * @param config Optional configuration object mapping tags to log levels. Defaults to INFO if not specified.
     * @param callback Optional callback function for log events.
     * @returns The Log instance for chaining.
     */
    init(config?: Record<string, string>, callback?: LogCallback): this;
    /**
     * Logs a debug message.
     *
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    debug<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    /**
     * Logs an error message.
     *
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    /**
     * Logs an informational message.
     *
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    /**
     * Logs a trace message.
     *
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    trace<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    /**
     * Logs a warning message.
     *
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    /**
     * Internal log method.
     *
     * @param level Numeric log level.
     * @param tag Message category.
     * @param message Message to log.
     * @param optionalParams Optional parameters to log.
     */
    private log;
}
/**
 * Singleton Log instance.
 */
export declare const log: Log;
/**
 * Tag registry.
 */
export declare const tag: Record<string, string>;
export {};
