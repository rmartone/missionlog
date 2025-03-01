import { log, tag } from '../src/index';

let buffer: string;

/** Setup a handler */
log.init(
  { network: 'TRACE', loader: 'INFO', security: 'ERROR', system: 'OFF', default: 'INFO' },
  (level, component, msg, params): void => {
    buffer += `${level}: [${component}] ${msg}`;
    for (const param of params) {
      buffer += `, ${param}`;
    }
  }
);

/**
 *  ✅ Test: Single-Argument Logging (No Tag)
 */
test('log.info() logs without a tag', (): void => {
  buffer = '';
  log.info('hello world');
  expect(buffer).toBe('INFO: [default] hello world');
});

test('log.warn() logs without a tag', (): void => {
  buffer = '';
  log.warn('something happened');
  expect(buffer).toBe('WARN: [default] something happened');
});

test('log.error() logs without a tag', (): void => {
  buffer = '';
  log.error('critical failure');
  expect(buffer).toBe('ERROR: [default] critical failure');
});

test('log.debug() logs without a tag', (): void => {
  buffer = '';
  log.debug('debugging...');
  expect(buffer).toBe(''); // ✅ Should be filtered since default is INFO
});

test('log.trace() logs without a tag', (): void => {
  buffer = '';
  log.trace('tracing execution');
  expect(buffer).toBe(''); // ✅ TRACE should also be filtered
});

/**
 *  ✅ Test: Tagged Logging
 */
test('log.info() logs with a known tag', (): void => {
  buffer = '';
  log.info(tag.loader, 'Loading asset');
  expect(buffer).toBe(`INFO: [loader] Loading asset`);
});

/**
 *  ✅ Test: Unknown Tags Are Treated as Messages
 */
test('log.info() logs unknown tag as part of the message', (): void => {
  buffer = '';
  log.info('unknownTag', 'should log as default');
  expect(buffer).toBe('INFO: [default] unknownTag, should log as default');
});

/**
 *  ✅ Test: `log.log()` Functionality
 */
test('log.log() with one argument defaults to INFO', (): void => {
  buffer = '';
  log.log('hello world');
  expect(buffer).toBe('INFO: [default] hello world');
});

test('log.log() with explicit level', (): void => {
  buffer = '';
  log.log('DEBUG', 'debugging');
  expect(buffer).toBe(''); // ✅ Should be filtered due to default INFO level

  buffer = '';
  log.log('WARN', 'this is a warning');
  expect(buffer).toBe('WARN: [default] this is a warning');
});

test('log.log() with [tag] syntax', (): void => {
  buffer = '';
  log.log('[network] Connected');
  expect(buffer).toBe('INFO: [network] Connected');
});

test('log.log() with unknown [tag] is treated as untagged', (): void => {
  buffer = '';
  log.log('[unknownTag] Message');
  expect(buffer).toBe('INFO: [default] [unknownTag] Message');
});

/**
 *  ✅ Test: Filtering Behavior
 */
test('Logs below INFO are filtered when default is INFO', (): void => {
  log.init({ default: 'INFO' });

  buffer = '';
  log.debug('This should not appear');
  expect(buffer).toBe(''); // ✅ DEBUG should be filtered out

  buffer = '';
  log.trace('Neither should this');
  expect(buffer).toBe(''); // ✅ TRACE should be filtered out
});

test('Logs are allowed when default is TRACE', (): void => {
  log.init({ default: 'TRACE' });

  buffer = '';
  log.trace('This should be logged');
  expect(buffer).toBe('TRACE: [default] This should be logged'); // ✅ TRACE is allowed

  buffer = '';
  log.debug('Debugging message');
  expect(buffer).toBe('DEBUG: [default] Debugging message'); // ✅ DEBUG is allowed

  buffer = '';
  log.info('Info message');
  expect(buffer).toBe('INFO: [default] Info message'); // ✅ INFO is allowed
});

test('Setting default to WARN filters out INFO logs', (): void => {
  log.init({ default: 'WARN' });

  buffer = '';
  log.info('This should be filtered out');
  expect(buffer).toBe('');

  buffer = '';
  log.warn('This should appear');
  expect(buffer).toBe('WARN: [default] This should appear');

  buffer = '';
  log.error('This should also appear');
  expect(buffer).toBe('ERROR: [default] This should also appear');
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

  log.init({ default: 'INFO' }); // Reset default
});

/**
 *  ✅ Test: Component-Level Filtering
 */
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

/**
 *  ✅ Test: Logging Objects
 */
test('log objects', (): void => {
  buffer = '';
  log.info(tag.loader, 'Logging objects works!', { foo: 'bar' });
  expect(buffer).toBe(`INFO: [loader] Logging objects works!, [object Object]`);
});

/**
 *  ✅ Test: Unregistered Tags Are Treated as Default
 */
test('Unregistered tag logs as INFO', (): void => {
  buffer = '';
  log.trace('unregisteredTag', 'this is a trace message');
  expect(buffer).toBe(`TRACE: [default] unregisteredTag, this is a trace message`);
});

/**
 *  ✅ Test: Handling of Invalid Log Levels in `init()`
 */
test('init() assigns default level for invalid log level', () => {
  console.warn = jest.fn();
  log.init({ invalidTag: 'INVALID_LEVEL' });

  expect(log['_tagToLevel'].get('invalidTag')).toBe(2); // Should default to DEBUG
  expect(console.warn).toHaveBeenCalledWith(
    `Invalid log level "INVALID_LEVEL" for tag "invalidTag". Using default (INFO).`
  );
});

/**
 *  ✅ Test: Error Handling in Callbacks
 */
test('log callback throws an error', (): void => {
  log.init({}, () => {
    throw new Error('Test Error');
  });

  buffer = '';
  log.info('this should not crash');
  expect(buffer).toBe('');
});

/**
 *  ✅ Final Test: Disabling Callback
 */
test('disable callback', (): void => {
  log.init({ loader: 'ERROR', system: 'INFO' }, null);
  buffer = '';
  log.warn('system', 'warp core breach');
  expect(buffer).toBe('');
});
