import { Signal } from './signal';

/**
 * Severity (relies on enum being both a number and string)
 */
export enum Severity {
  ERROR = 1,
  WARN,
  INFO,
}

/**
 * maps a component to its max severity
 */
const _severity: Record<string, Severity> = {};

/**
 * log event emiiter
 */
let _event: Signal;

/**
 * emits a message to the log listeners when appropriate
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
    _event.dispatch(severity, message, ...optionalParams);
  }
}

export const log = {
  /**
   * Initialize log from settings
   * @param severity log messages with this or greater severaity
   * @param signal Signal interface that supports add and dispatch
   */
  init: (config: Record<string, 'ERROR' | 'INFO' | 'WARN'>, signal: Signal): void => {
    for (const k in config) {
      _severity[k] = Severity[config[k]];
    }
    _event = signal;
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
   */
  warn: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(component, Severity.WARN, message, optionalParams);
  },

  /**
   * Writes an info message for the log listeners
   * @param message
   */
  info: <T extends string>(component: T, message: unknown, ...optionalParams: unknown[]): void => {
    write(component, Severity.INFO, message, optionalParams);
  },
};
