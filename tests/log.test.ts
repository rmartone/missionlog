import { describe, test, expect, beforeEach, vi } from 'vitest';
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
  
  test('accessing registered tag returns the tag name itself', () => {
    // The proxy returns the tag name
    expect(tag.network).toBe('network');
    expect(tag.loader).toBe('loader');
    expect(tag.security).toBe('security');
    expect(tag.system).toBe('system');
  });
  
  test('verifies property descriptor for symbolic property', () => {
    // Using Symbol to test the proxy's handling of non-string properties
    const sym = Symbol('test');
    // @ts-ignore - Testing runtime behavior with Symbol
    const result = tag[sym];
    expect(result).toBeUndefined();
  });
  
  test('newly added tags are accessible via proxy', () => {
    log.init({ newTag: 'INFO' });
    expect(tag.newTag).toBe('newTag');
    const keys = Object.keys(tag);
    expect(keys).toContain('newTag');
  });

  test('getOwnPropertyDescriptor returns the correct descriptor', () => {
    const descriptor = Object.getOwnPropertyDescriptor(tag, 'network');
    expect(descriptor).toEqual({
      enumerable: true,
      configurable: true,
      value: undefined,
      writable: false
    });
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
    const originalWarn = console.warn;
    const mockWarn = vi.fn();
    console.warn = mockWarn;

    log.init({ invalidTag: 'INVALID_LEVEL', [DEFAULT_TAG]: 'INFO' });

    buffer = '';
    log.info('This should use the default level', 'Test message');

    expect(buffer).toBe('INFO: [] This should use the default level, Test message');

    expect(mockWarn).toHaveBeenCalledWith(
      'Invalid log level "INVALID_LEVEL" for tag "invalidTag". Using default (INFO).',
    );
    
    console.warn = originalWarn;
  });
  
  test('filters undefined params', (): void => {
    buffer = '';
    log.info(tag.loader, 'Message with undefined params', undefined, 'visible', undefined);
    expect(buffer).toBe('INFO: [loader] Message with undefined params, visible');
  });
  
  test('handles multiple primitive params', (): void => {
    buffer = '';
    log.info(tag.loader, 'Multiple params', 42, true, 'string');
    expect(buffer).toBe('INFO: [loader] Multiple params, 42, true, string');
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
  
  test('init without arguments returns the logger instance', () => {
    const result = log.init();
    expect(result).toBe(log);
  });
  
  test('init with empty object returns the logger instance', () => {
    const result = log.init({});
    expect(result).toBe(log);
  });
});

describe('Enhanced Callback functionality', () => {
  test('calls enhanced callback with structured data', (): void => {
    const enhancedCallbackMock = vi.fn();
    
    log.init({ [DEFAULT_TAG]: 'INFO' })
      .setEnhancedCallback(enhancedCallbackMock);
    
    const testMessage = 'Test enhanced callback';
    log.info(testMessage, 'extra param');
    
    expect(enhancedCallbackMock).toHaveBeenCalledTimes(1);
    expect(enhancedCallbackMock).toHaveBeenCalledWith(expect.objectContaining({
      level: 'INFO',
      tag: '',
      message: testMessage,
      params: ['extra param'],
      timestamp: expect.any(Date)
    }));
  });
  
  test('enhanced callback with tagged messages', (): void => {
    const enhancedCallbackMock = vi.fn();
    
    log.init({ network: 'DEBUG', [DEFAULT_TAG]: 'INFO' })
      .setEnhancedCallback(enhancedCallbackMock);
    
    log.debug(tag.network, 'Network debug message', { data: 123 });
    
    expect(enhancedCallbackMock).toHaveBeenCalledWith(expect.objectContaining({
      level: 'DEBUG',
      tag: 'network',
      message: 'Network debug message',
      params: [{ data: 123 }],
      timestamp: expect.any(Date)
    }));
  });
});

describe('isLevelEnabled method', () => {
  beforeEach(() => {
    log.init({
      network: 'DEBUG',
      system: 'OFF',
      [DEFAULT_TAG]: 'INFO'
    });
  });
  
  test('returns true for enabled levels', () => {
    expect(log.isLevelEnabled('INFO')).toBe(true);
    expect(log.isLevelEnabled('WARN')).toBe(true);
    expect(log.isLevelEnabled('ERROR')).toBe(true);
    expect(log.isLevelEnabled('DEBUG', 'network')).toBe(true);
  });
  
  test('returns false for disabled levels', () => {
    expect(log.isLevelEnabled('DEBUG')).toBe(false);
    expect(log.isLevelEnabled('TRACE')).toBe(false);
    expect(log.isLevelEnabled('ERROR', 'system')).toBe(false);
  });
  
  test('returns false for invalid level', () => {
    // @ts-ignore - Testing runtime behavior with invalid input
    expect(log.isLevelEnabled('INVALID_LEVEL')).toBe(false);
  });
});

describe('reset method', () => {
  test('resets all configuration to defaults', () => {
    log.init({
      network: 'TRACE',
      loader: 'DEBUG',
      [DEFAULT_TAG]: 'ERROR'
    });
    
    // Verify that the config is applied
    expect(log.isLevelEnabled('ERROR')).toBe(true);
    expect(log.isLevelEnabled('INFO')).toBe(false);
    expect(log.isLevelEnabled('TRACE', 'network')).toBe(true);
    
    // Reset the logger
    log.reset();
    
    // Verify default settings are restored (INFO is default level)
    expect(log.isLevelEnabled('INFO')).toBe(true);
    expect(log.isLevelEnabled('DEBUG')).toBe(false);
    expect(log.isLevelEnabled('TRACE', 'network')).toBe(false);
  });
  
  test('reset returns the logger instance for chaining', () => {
    const result = log.reset();
    expect(result).toBe(log);
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
  
  test('gets all tag keys correctly', () => {
    const keys = Object.keys(tag);
    expect(keys.length).toBeGreaterThan(0);
    expect(Array.isArray(keys)).toBe(true);
    // Check that all registered tags are returned by Object.keys
    expect(keys).toContain('network');
    expect(keys).toContain('loader');
    expect(keys).toContain('security');
    expect(keys).toContain('system');
  });
});
