export declare const log: {
    init: (config: Record<string, "ERROR" | "INFO" | "WARN">, callback: (...params: unknown[]) => void) => void;
    error: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
    warn: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
    info: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]) => void;
};
