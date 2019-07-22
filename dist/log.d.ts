import { Signal } from './signal';
export declare enum Severity {
    ERROR = 1,
    WARN = 2,
    INFO = 3
}
export declare const log: {
    init: (config: Record<string, "ERROR" | "INFO" | "WARN">, signal: Signal) => void;
    error: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
    warn: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
    info: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
};
