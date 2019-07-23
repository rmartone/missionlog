declare type Callback = (level: string, category: string, message: unknown, optionalParams: unknown[]) => void;
export declare const log: {
    init: (config: Record<string, "OFF" | "ERROR" | "INFO" | "WARN">, callback: Callback) => void;
    error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
    warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
    info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]) => void;
};
export {};
