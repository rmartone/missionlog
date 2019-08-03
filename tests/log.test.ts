import { log } from '../src';

let buffer: string;

// setup a handler
log.init({ loader: 'INFO', security: 'ERROR', system: 'OFF' }, (level, tag, msg, params): void => {
  buffer += `${level}: [${tag}] ${msg}`;
  for (const param of params) {
    buffer += `, ${param}`;
  }
  // console.log(`${level}: [${tag}]`, msg, ...params);
});

test('log info', (): void => {
  const tag = 'loader';
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.info(tag, msg, url);
  expect(buffer).toBe(`INFO: [${tag}] ${msg}, ${url}`);
});

test('log warning', (): void => {
  const tag = 'loader';
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.warn(tag, msg, url);
  expect(buffer).toBe(`WARN: [${tag}] ${msg}, ${url}`);
});

test('log error', (): void => {
  const tag = 'security';
  const msg = 'login failed';
  buffer = '';
  log.error(tag, msg, 401);
  expect(buffer).toBe(`ERROR: [${tag}] ${msg}, 401`);
});

test('filter tag', (): void => {
  const tag = 'security';
  const msg = 'login success';
  buffer = '';
  log.info(tag, msg);
  expect(buffer).toBe('');
});

test(`tag's level is set to OFF`, (): void => {
  const tag = 'system';
  const msg = 'warp core breach';
  buffer = '';
  log.error(tag, msg);
  expect(buffer).toBe('');
});

test('log objects', (): void => {
  const tag = 'loader';
  const msg = 'logging objects works!';
  const param1 = { foo: 'bar' };
  const param2 = { foo: 'baz' };
  buffer = '';
  log.info(tag, msg, param1, param2);
  expect(buffer).toBe(`INFO: [${tag}] ${msg}, ${param1}, ${param2}`);
});

test('Log.info - uninitialized tag', (): void => {
  const tag = 'transporter';
  const msg = 'evil twin detected';
  buffer = '';
  log.info(tag, msg);
  expect(buffer).toBe(`INFO: [${tag}] ${msg}`);
});

test('Log.warn - uninitialized tag', (): void => {
  const tag = 'transporter';
  const msg = 'evil twin detected';
  buffer = '';
  log.warn(tag, msg);
  expect(buffer).toBe(`WARN: [${tag}] ${msg}`);
});

test('Log.error - uninitialized tag', (): void => {
  const tag = 'transporter';
  const msg = 'evil twin detected';
  buffer = '';
  log.error(tag, msg);
  expect(buffer).toBe(`ERROR: [${tag}] ${msg}`);
});

test('update config', (): void => {
  const tag = 'system';
  const msg = 'warp core breach';
  buffer = '';
  log.init({ loader: 'ERROR', system: 'INFO' }).warn(tag, msg);
  expect(buffer).toBe(`WARN: [${tag}] ${msg}`);
});

test('disable callback', (): void => {
  const tag = 'system';
  const msg = 'warp core breach';
  buffer = '';
  log.init({ loader: 'ERROR', system: 'INFO' }, null).warn(tag, msg);
  expect(buffer).toBe(``);
});
