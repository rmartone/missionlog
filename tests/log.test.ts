import { log, tag } from '../src/index';

let buffer: string;

log.init(
  { network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' },
  (level, component, msg, params): void => {
    buffer += `${level}: [${component}] ${msg}`;
    for (const param of params) {
      buffer += `, ${param}`;
    }
  }
);

test('Accessing registered and unregistered tags', () => {
  const systemTag = tag.system;
  const unknownTag = tag.unknownTag;

  expect(systemTag).toBe('system');
  expect(unknownTag).toBeUndefined();
});

test('ownKeys() and getOwnPropertyDescriptor() work with tags added through init()', () => {
  log.init({ network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' });

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

test('log.info() logs without a tag', (): void => {
  buffer = '';
  log.info('hello world');
  expect(buffer).toBe('INFO: [] hello world');
});

test('log.warn() logs without a tag', (): void => {
  buffer = '';
  log.warn('something happened');
  expect(buffer).toBe('WARN: [] something happened');
});

test('log.error() logs without a tag', (): void => {
  buffer = '';
  log.error('critical failure');
  expect(buffer).toBe('ERROR: [] critical failure');
});

test('log.debug() logs without a tag', (): void => {
  buffer = '';
  log.debug('debugging...');
  expect(buffer).toBe('');
});

test('log.trace() logs without a tag', (): void => {
  buffer = '';
  log.trace('tracing execution');
  expect(buffer).toBe('');
});

test('log.info() logs with a known tag', (): void => {
  buffer = '';
  log.info(tag.loader, 'Loading asset');
  expect(buffer).toBe('INFO: [loader] Loading asset');
});

test('log.info() logs unknown tag as part of the message', (): void => {
  buffer = '';
  log.info('unknownTag', 'should log as default');
  expect(buffer).toBe('INFO: [] unknownTag, should log as default');
});

test('log.log() with one argument defaults to INFO', (): void => {
  buffer = '';
  log.log('hello world');
  expect(buffer).toBe('INFO: [] hello world');
});

test('log.log() with explicit level', (): void => {
  buffer = '';
  log.log('DEBUG', 'debugging');
  expect(buffer).toBe('');

  buffer = '';
  log.log('WARN', 'this is a warning');
  expect(buffer).toBe('WARN: [] this is a warning');
});

test('log.log() with no tag', (): void => {
  buffer = '';
  log.log('Network Connected');
  expect(buffer).toBe('INFO: [] Network Connected');
});

test('log.log() with unknown [tag] is treated as untagged', (): void => {
  buffer = '';
  log.log('[unknownTag] Message');
  expect(buffer).toBe('INFO: [] [unknownTag] Message');
});

test('Logs below INFO are filtered when default is INFO', (): void => {
  log.init({ default: 'INFO' });

  buffer = '';
  log.debug('This should not appear');
  expect(buffer).toBe('');

  buffer = '';
  log.trace('Neither should this');
  expect(buffer).toBe('');
});

test('Logs are allowed when default is TRACE', (): void => {
  log.init({ default: 'TRACE' });

  buffer = '';
  log.trace('This should be logged');
  expect(buffer).toBe('TRACE: [] This should be logged');

  buffer = '';
  log.debug('Debugging message');
  expect(buffer).toBe('DEBUG: [] Debugging message');

  buffer = '';
  log.info('Info message');
  expect(buffer).toBe('INFO: [] Info message');
});

test('Setting default to WARN filters out INFO logs', (): void => {
  log.init({ default: 'WARN' });

  buffer = '';
  log.info('This should be filtered out');
  expect(buffer).toBe('');

  buffer = '';
  log.warn('This should appear');
  expect(buffer).toBe('WARN: [] This should appear');

  buffer = '';
  log.error('This should also appear');
  expect(buffer).toBe('ERROR: [] This should also appear');
});

test('Setting default to OFF disables all uncategorized logs', (): void => {
  log.init({ default: 'OFF' });

  buffer = '';
  log.info('This should not log');
  expect(buffer).toBe('');

  buffer = '';
  log.warn('Neither should this');
  expect(buffer).toBe('');

  buffer = '';
  log.error('Not even this');
  expect(buffer).toBe('');

  log.init({ default: 'INFO' });
});

test('log.info() is filtered when component level is OFF', (): void => {
  buffer = '';
  log.info(tag.system, 'This should not log');
  expect(buffer).toBe('');
});

test('log.error() logs with a security tag', (): void => {
  buffer = '';
  log.error(tag.security, 'Security breach');
  expect(buffer).toBe('ERROR: [security] Security breach');
});

test('log objects', (): void => {
  buffer = '';
  log.info(tag.loader, 'Logging objects works!', { foo: 'bar' });
  expect(buffer).toBe('INFO: [loader] Logging objects works!, [object Object]');
});

test('init() assigns default level for invalid log level', () => {
  console.warn = jest.fn();
  log.init({ invalidTag: 'INVALID_LEVEL' });

  expect(log['_tagToLevel'].get('invalidTag')).toBe(2);
  expect(console.warn).toHaveBeenCalledWith(
    'Invalid log level "INVALID_LEVEL" for tag "invalidTag". Using default (INFO).'
  );
});

test('log callback throws an error', (): void => {
  log.init({}, () => {
    throw new Error('Test Error');
  });

  buffer = '';
  expect(() => log.info('this should crash')).toThrow('Test Error');
});

test('disable callback', (): void => {
  log.init({ loader: 'ERROR', system: 'INFO' }, null);
  buffer = '';
  log.warn('system', 'warp core breach');
  expect(buffer).toBe('');
});
