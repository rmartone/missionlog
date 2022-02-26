import { log, tag } from '../src';

let buffer: string;

// setup a handler
log.init(
  { network: 'DEBUG', loader: 'INFO', security: 'ERROR', system: 'OFF' },
  (level, component, msg, params): void => {
    buffer += `${level}: [${component}] ${msg}`;
    for (const param of params) {
      buffer += `, ${param}`;
    }
    // console.log(`${level}: [${component}]`, msg, ...params);
  },
);

test('log info', (): void => {
  const component = tag.loader;
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.info(component, msg, url);
  expect(buffer).toBe(`INFO: [${component}] ${msg}, ${url}`);
});

test('log debug', (): void => {
  const component = tag.network;
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.debug(component, msg, url);
  expect(buffer).toBe(`DEBUG: [${component}] ${msg}, ${url}`);
});

test('log trace', (): void => {
  const component = tag.network;
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.trace(component, msg, url);
  expect(buffer).toBe(`TRACE: [${component}] ${msg}, ${url}`);
});

test('log info', (): void => {
  const component = tag.loader;
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.info(component, msg, url);
  expect(buffer).toBe(`INFO: [${component}] ${msg}, ${url}`);
});

test('log warning', (): void => {
  const component = tag.loader;
  const msg = 'asset failed to load';
  const url = 'image.png';
  buffer = '';
  log.warn(component, msg, url);
  expect(buffer).toBe(`WARN: [${component}] ${msg}, ${url}`);
});

test('log error', (): void => {
  const component = tag.security;
  const msg = 'login failed';
  buffer = '';
  log.error(component, msg, 401);
  expect(buffer).toBe(`ERROR: [${component}] ${msg}, 401`);
});

test('filter component', (): void => {
  const component = tag.security;
  const msg = 'login success';
  buffer = '';
  log.info(component, msg);
  expect(buffer).toBe('');
});

test(`component's level is set to OFF`, (): void => {
  const component = tag.system;
  const msg = 'warp core breach';
  buffer = '';
  log.error(component, msg);
  expect(buffer).toBe('');
});

test('log objects', (): void => {
  const component = tag.loader;
  const msg = 'logging objects works!';
  const param1 = { foo: 'bar' };
  const param2 = { foo: 'baz' };
  buffer = '';
  log.info(component, msg, param1, param2);
  expect(buffer).toBe(`INFO: [${component}] ${msg}, ${param1}, ${param2}`);
});

test('Log.info - uninitialized component', (): void => {
  const component = tag.transporter;
  const msg = 'evil twin detected';
  buffer = '';
  log.info(component, msg);
  expect(buffer).toBe(`INFO: [${component}] ${msg}`);
});

test('Log.warn - uninitialized component', (): void => {
  const component = tag.transporter;
  const msg = 'evil twin detected';
  buffer = '';
  log.warn(component, msg);
  expect(buffer).toBe(`WARN: [${component}] ${msg}`);
});

test('Log.error - uninitialized component', (): void => {
  const component = tag.transporter;
  const msg = 'evil twin detected';
  buffer = '';
  log.error(component, msg);
  expect(buffer).toBe(`ERROR: [${component}] ${msg}`);
});

test('Log bad tag defaults to INFO', (): void => {
  const component = 'badTag';
  const msg = 'evil twin detected';
  buffer = '';
  log.warn(component, msg);
  expect(buffer).toBe(`WARN: [${component}] ${msg}`);
});

test('update config', (): void => {
  const component = tag.system;
  const msg = 'warp core breach';
  buffer = '';
  log.init({ loader: 'ERROR', system: 'INFO' }).warn(component, msg);
  expect(buffer).toBe(`WARN: [${component}] ${msg}`);
});

test('bad config level set to INFO', (): void => {
  const component = tag.system;
  const msg = 'warp core breach';
  buffer = '';
  log.init({ loader: 'ERROR', system: 'ZZ' }).warn(component, msg);
  expect(buffer).toBe(`WARN: [${component}] ${msg}`);
});

test('uninitialized tag defaults to DEBUG', (): void => {
  const component = tag.security2;
  const msg = 'login failed';
  buffer = '';
  log.debug(component, msg, 401);
  expect(buffer).toBe(`DEBUG: [undefined] ${msg}, 401`);
});

// WARNING: has to be the last test
test('disable callback', (): void => {
  const component = 'system';

  const msg = 'warp core breach';
  buffer = '';
  log.init({ loader: 'ERROR', system: 'INFO' }, null).warn(component, msg);
  expect(buffer).toBe(``);
});
