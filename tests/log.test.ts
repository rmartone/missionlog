import { log, tag, DEFAULT_TAG } from '../src/index';

let buffer: string;

beforeEach(() => {
  buffer = '';
});

log.init(
  { network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', [DEFAULT_TAG]: 'INFO' },
  (level, component, msg, params): void => {
    buffer += `${level}: [${component}] ${msg}`;
    for (const param of params) {
      buffer += `, ${param}`;
    }
  },
);

describe('Logging without a tag', () => {
  test('logs info without a tag', (): void => {
    log.info('hello world');
    expect(buffer).toBe('INFO: [] hello world');
  });

  test('logs warn without a tag', (): void => {
    log.warn('something happened');
    expect(buffer).toBe('WARN: [] something happened');
  });

  test('logs error without a tag', (): void => {
    log.error('critical failure');
    expect(buffer).toBe('ERROR: [] critical failure');
  });

  test('logs debug without a tag', (): void => {
    log.debug('debugging...');
    expect(buffer).toBe('');
  });

  test('logs trace without a tag', (): void => {
    log.trace('tracing execution');
    expect(buffer).toBe('');
  });
});

describe('Logging with tags', () => {
  beforeEach(() => {
    log.init({
      network: 'TRACE',
      loader: 'INFO',
      security: 'ERROR',
      system: 'OFF',
      [DEFAULT_TAG]: 'INFO',
    });
  });

  test('logs info with a known tag', (): void => {
    log.info(tag.loader, 'Loading asset');
    expect(buffer).toBe('INFO: [loader] Loading asset');
  });

  test('logs unknown tag as part of the message', (): void => {
    log.info('unknownTag', 'should log as default');
    expect(buffer).toBe('INFO: [] unknownTag, should log as default');
  });

  test('log.info() with valid tag but no other arguments', () => {
    log.init({ system: 'INFO', [DEFAULT_TAG]: 'INFO' });

    buffer = ''; // Reset the buffer
    log.info(tag.system);

    expect(buffer).toBe('');
  });

  test('logs with valid tag but no message', () => {
    buffer = '';
    log.info(tag.system);
    expect(buffer).toBe('');
  });

  test('log with one argument defaults to INFO', (): void => {
    log.log('hello world');
    expect(buffer).toBe('INFO: [] hello world');
  });

  test('log with no args', (): void => {
    log.info();
    expect(buffer).toBe('');
  });
});

describe('Log filtering', () => {
  test('logs below INFO are filtered when default is INFO', (): void => {
    log.init({ [DEFAULT_TAG]: 'INFO' });

    log.debug('This should not appear');
    expect(buffer).toBe('');

    log.trace('Neither should this');
    expect(buffer).toBe('');
  });

  test('logs allowed when default is TRACE', (): void => {
    log.init({ [DEFAULT_TAG]: 'TRACE' });

    log.trace('This should be logged');
    expect(buffer).toBe('TRACE: [] This should be logged');
    buffer = '';

    log.debug('Debugging message');
    expect(buffer).toBe('DEBUG: [] Debugging message');
    buffer = '';

    log.info('Info message');
    expect(buffer).toBe('INFO: [] Info message');
  });

  test('default level to WARN filters out INFO logs', (): void => {
    log.init({ [DEFAULT_TAG]: 'WARN' });

    log.info('This should be filtered out');
    expect(buffer).toBe('');
    buffer = '';

    log.warn('This should appear');
    expect(buffer).toBe('WARN: [] This should appear');
    buffer = '';

    log.error('This should also appear');
    expect(buffer).toBe('ERROR: [] This should also appear');
  });

  test('default level to OFF disables all uncategorized logs', (): void => {
    log.init({ [DEFAULT_TAG]: 'OFF' });

    log.info('This should not log');
    expect(buffer).toBe('');

    log.warn('Neither should this');
    expect(buffer).toBe('');

    log.error('Not even this');
    expect(buffer).toBe('');

    log.init({ [DEFAULT_TAG]: 'INFO' });
  });
});

describe('Tag Proxy Behavior', () => {
  beforeEach(() => {
    log.init({
      network: 'TRACE',
      loader: 'INFO',
      security: 'ERROR',
      system: 'OFF',
      [DEFAULT_TAG]: 'INFO',
    });
  });

  test('accessing an unregistered tag returns undefined', () => {
    const unknownTag = tag.unknownTag;
    expect(unknownTag).toBeUndefined();
  });
});

describe('Component-level filtering', () => {
  test('logs info when component level is OFF', (): void => {
    log.init({ system: 'OFF' });

    log.info(tag.system, 'This should not log');
    expect(buffer).toBe('');
  });

  test('logs error with a security tag', (): void => {
    log.error(tag.security, 'Security breach');
    expect(buffer).toBe('ERROR: [security] Security breach');
  });
});

describe('Object logging and invalid levels', () => {
  test('logs objects properly', (): void => {
    log.info(tag.loader, 'Logging objects works!', { foo: 'bar' });
    expect(buffer).toBe('INFO: [loader] Logging objects works!, [object Object]');
  });

  test('handles invalid log levels in init()', () => {
    console.warn = jest.fn();

    log.init({ invalidTag: 'INVALID_LEVEL', [DEFAULT_TAG]: 'INFO' });

    buffer = '';
    log.info('This should use the default level', 'Test message');

    expect(buffer).toBe('INFO: [] This should use the default level, Test message');

    expect(console.warn).toHaveBeenCalledWith(
      'Invalid log level "INVALID_LEVEL" for tag "invalidTag". Using default (INFO).',
    );
  });
});

describe('Callback error handling and disabling', () => {
  test('throws error in callback', (): void => {
    log.init({ [DEFAULT_TAG]: 'DEBUG' }, () => {
      throw new Error('Test Error');
    });

    expect(() => log.info('this should crash')).toThrow('Test Error');
  });

  test('disables callback', (): void => {
    log.init({ loader: 'ERROR', system: 'INFO' }, null);

    log.warn('system', 'warp core breach');
    expect(buffer).toBe('');
  });
});

describe('Tag registration and reflection', () => {
  beforeEach(() => {
    log.init({
      network: 'TRACE',
      loader: 'INFO',
      security: 'ERROR',
      system: 'OFF',
      [DEFAULT_TAG]: 'INFO',
    });
  });

  test('works with tags added through init()', () => {
    const keys = Object.keys(tag);

    expect(keys).toContain('network');
    expect(keys).toContain('loader');
    expect(keys).toContain('security');
    expect(keys).toContain('system');

    expect(Object.getOwnPropertyDescriptor(tag, 'network')).toEqual({
      enumerable: true,
      configurable: true,
      value: undefined,
      writable: false,
    });
    expect(Object.getOwnPropertyDescriptor(tag, 'loader')).toEqual({
      enumerable: true,
      configurable: true,
      value: undefined,
      writable: false,
    });
    expect(Object.getOwnPropertyDescriptor(tag, 'security')).toEqual({
      enumerable: true,
      configurable: true,
      value: undefined,
      writable: false,
    });
    expect(Object.getOwnPropertyDescriptor(tag, 'system')).toEqual({
      enumerable: true,
      configurable: true,
      value: undefined,
      writable: false,
    });
  });
});
