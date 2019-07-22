export interface Signal {
    add(listener: (...params: unknown[]) => void, listenerContext?: unknown, priority?: number): Signal;
    dispatch(...params: unknown[]): void;
}
