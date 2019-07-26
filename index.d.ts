declare type LevelString = 'OFF' | 'ERROR' | 'INFO' | 'WARN';
declare type Callback = (level: string, tag: string, message: unknown, optionalParams: unknown[]) => void;
interface Log {
    init(config: Record<string, LevelString>, callback?: Callback): Log;
    error: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
    info: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
    warn: <T extends string>(tag: T, message: unknown, ...optionalParams: unknown[]) => void;
}
export declare const log: Log;
export {};
