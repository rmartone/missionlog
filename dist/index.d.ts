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
export type LogCallback = (level: LogLevelStr, tag: string, message: unknown, optionalParams: unknown[]) => void;
export type LogLevelStr = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';
export declare const tag: Record<string, string>;
export declare class Log {
    private readonly _defaultLevel;
    protected readonly _tagToLevel: Map<string, Level>;
    protected _callback?: LogCallback | null;
    protected levelToString(level: Level): LogLevelStr;
    init(config?: Record<string, string>, callback?: LogCallback | null): this;
    private getEffectiveLogLevel;
    private log;
    debug<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    error<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    info<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    trace<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
    warn<T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]): void;
}
export declare const log: Log;
export {};
