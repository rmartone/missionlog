declare type LevelString = 'OFF' | 'ERROR' | 'INFO' | 'WARN';
declare type Callback = (level: string, category: string, message: unknown, optionalParams: unknown[]) => void;
interface Log {
    init(config: Record<string, LevelString>, callback?: Callback): Log;
    error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
    info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
    warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
}
export declare const log: Log;
export {};
