declare enum Level {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    OFF = 6
}
export declare enum LogLevel {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    OFF = "OFF"
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
export declare const DEFAULT_TAG = "*";
export declare const tag: Record<string, string>;
export declare class Log {
    private _defaultLevel;
    protected readonly _tagToLevel: Map<string, Level>;
    private readonly _levelCache;
    protected _callback?: LogCallback | null;
    protected _enhancedCallback?: EnhancedLogCallback;
    init(config?: Record<string, string> | LogConfig, callback?: LogCallback | null): this;
    private _setTagLevel;
    setEnhancedCallback(callback: EnhancedLogCallback): this;
    private _shouldLog;
    private _log;
    debug(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    error(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    info(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    log(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    trace(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    warn(messageOrTag?: unknown, ...optionalParams: unknown[]): this;
    isLevelEnabled(level: LogLevelStr, tag?: string): boolean;
    reset(): this;
}
export declare const log: Log;
export {};
