import { log, tag } from '../src/index';

let buffer: string;

beforeEach(() => {
  buffer = '';
});

log.init(
  { network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' },
  (level, component, msg, params): void => {
    buffer += `${level}: [${component}] ${msg}`;
    for (const param of params) {
      buffer += `, ${param}`;
    }
  }
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
    log.init({ network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' });
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
    // Initialize the logger with valid tag settings
    log.init({ system: 'INFO', default: 'INFO' });

    // Call log.info with a valid tag but no other arguments
    buffer = '';  // Reset the buffer
    log.info(tag.system);

    // Since no message is provided, the output should be empty (no message logged)
    expect(buffer).toBe('');
  });

  test('log with one argument defaults to INFO', (): void => {
    log.log('hello world');
    expect(buffer).toBe('INFO: [] hello world');
  });

  test('log with unknown [tag] treated as untagged', (): void => {
    log.log('[unknownTag] Message');
    expect(buffer).toBe('INFO: [] [unknownTag] Message');
  });
});


describe('Log filtering', () => {
  test('logs below INFO are filtered when default is INFO', (): void => {
    log.init({ default: 'INFO' });

    log.debug('This should not appear');
    expect(buffer).toBe('');

    log.trace('Neither should this');
    expect(buffer).toBe('');
  });

  test('logs allowed when default is TRACE', (): void => {
    log.init({ default: 'TRACE' });

    log.trace('This should be logged');
    expect(buffer).toBe('TRACE: [] This should be logged');
    buffer = '';

    log.debug('Debugging message');
    expect(buffer).toBe('DEBUG: [] Debugging message');
    buffer = '';

    log.info('Info message');
    expect(buffer).toBe('INFO: [] Info message');
  });

  test('default to WARN filters out INFO logs', (): void => {
    log.init({ default: 'WARN' });

    log.info('This should be filtered out');
    expect(buffer).toBe('');
    buffer = '';

    log.warn('This should appear');
    expect(buffer).toBe('WARN: [] This should appear');
    buffer = '';

    log.error('This should also appear');
    expect(buffer).toBe('ERROR: [] This should also appear');
  });

  test('default to OFF disables all uncategorized logs', (): void => {
    log.init({ default: 'OFF' });

    log.info('This should not log');
    expect(buffer).toBe('');

    log.warn('Neither should this');
    expect(buffer).toBe('');

    log.error('Not even this');
    expect(buffer).toBe('');

    log.init({ default: 'INFO' });
  });
});

describe('Tag Proxy Behavior', () => {
  beforeEach(() => {
    log.init({ network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' });
  });

  test('accessing an unregistered tag returns undefined', () => {
    const unknownTag = tag.unknownTag;  // This should return undefined
    expect(unknownTag).toBeUndefined(); // Verifies the return value is undefined
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
    // Mock the console.warn method to check if the warning is triggered
    console.warn = jest.fn();

    // Initialize with an invalid log level for a tag
    log.init({ invalidTag: 'INVALID_LEVEL', default: 'INFO' });

    // Test logging with the invalid tag
    buffer = '';  // Reset the buffer
    log.info('This should use the default level', 'Test message');

    // Since the invalid level was ignored, it should use the default level, which is INFO
    expect(buffer).toBe('INFO: [] This should use the default level, Test message');

    // Verify that a warning message is logged about the invalid log level
    expect(console.warn).toHaveBeenCalledWith(
      'Invalid log level "INVALID_LEVEL" for tag "invalidTag". Using default (INFO).'
    );
  });
});

describe('Callback error handling and disabling', () => {
  test('throws error in callback', (): void => {
    log.init({}, () => {
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
    log.init({ network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' });
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
