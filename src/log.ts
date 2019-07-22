/**
 * Severity (relies on enum being both a number and string)
 */
enum Severity {
  ERROR = 1,
  WARN,
  INFO,
}

/**
 * maps a logging category to its max severity
 */
const _severity: Record<string, Severity> = {};

/**
 * log event callback
 */
let _callback: (severity: string, category: string, ...params: unknown[]) => void;

/**
 * calls log callback when appropriate
 * @param category
 * @param severity
 * @param message
 * @param optionalParams
 */
function write<T extends string>(category: T, severity: Severity, message: unknown, optionalParams: unknown[]): void {
  const maxSeverity = _severity[category];
  if (maxSeverity === undefined) {
    throw Error(`category ${category} not configured`);
  }
  if (severity <= maxSeverity) {
    _callback(Severity[severity], category, message, optionalParams);
  }
}

export const log = {
  /**
   * Initialize category log levels and set log event callback
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
   * Writes an error message to the log
   * @param category
   * @param message
   * @param optionalParams
   */
  error: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Severity.ERROR, message, optionalParams);
  },

  /**
   * Writes a warning to the log
   * @param message
   * @param message
   * @param optionalParams
   */
  warn: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Severity.WARN, message, optionalParams);
  },

  /**
   * Writes an info message to the log
   * @param message
   * @param message
   * @param optionalParams
   */
  info: <T extends string>(category: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(category, Severity.INFO, message, optionalParams);
  },
};
