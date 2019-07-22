/**
 * Severity (relies on enum being both a number and string)
 */
enum Severity {
  ERROR = 1,
  WARN,
  INFO,
}

/**
 * maps a component to its max severity
 */
const _severity: Record<string, Severity> = {};

/**
 * log event callback
 */
let _callback: (...params: unknown[]) => void;

/**
 * emits to the log listeners when appropriate
 * @param component
 * @param severity
 * @param message
 * @param optionalParams
 */
function write<T extends string>(component: T, severity: Severity, message: unknown, optionalParams: unknown[]): void {
  const maxSeverity = _severity[component];
  if (maxSeverity === undefined) {
    throw Error(`component ${component} not configured`);
  }
  if (severity <= maxSeverity) {
    _callback(Severity[severity], message, optionalParams);
  }
}

export const log = {
  /**
   * Initialize log
   * @param config
   * @param callback
   */
  init: (config: Record<string, 'ERROR' | 'INFO' | 'WARN'>, callback: (...params: unknown[]) => void): void => {
    for (const k in config) {
      _severity[k] = Severity[config[k]];
    }
    _callback = callback;
  },

  /**
   * Writes an error message for log listeners
   * @param component
   * @param message
   * @param optionalParams
   */
  error: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(component, Severity.ERROR, message, optionalParams);
  },

  /**
   * Writes an warning message to the log listeners
   * @param message
   * @param message
   * @param optionalParams
   */
  warn: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(component, Severity.WARN, message, optionalParams);
  },

  /**
   * Writes an info message for the log listeners
   * @param message
   * @param message
   * @param optionalParams
   */
  info: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(component, Severity.INFO, message, optionalParams);
  },
};
