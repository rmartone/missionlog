import { log } from '../src/log';

let output: string;
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, category, msg, params): void => {
  output = `${severity}: [${category}] ${msg}`;
  for (const param of params) {
    output += `, ${param}`;
  }
  // console.log(`${severity}: [${category}]`, msg, ...params);
});

test('log info', (): void => {
  const category = 'loader';
  const msg = 'asset failed to load';
  const url = 'image.png';
  output = '';
  log.info(category, msg, url);
  expect(output).toBe(`INFO: [${category}] ${msg}, ${url}`);
});

test('log warning', (): void => {
  const category = 'loader';
  const msg = 'asset failed to load';
  output = '';
  log.warn(category, msg);
  expect(output).toBe(`WARN: [${category}] ${msg}`);
});

test('log error', (): void => {
  const category = 'security';
  const msg = 'login failed';
  output = '';
  log.error(category, msg);
  expect(output).toBe(`ERROR: [${category}] ${msg}`);
});

test('filter category', (): void => {
  const category = 'security';
  const msg = 'login success';
  output = '';
  log.info(category, msg);
  expect(output).toBe('');
});

test('log objects', (): void => {
  const category = 'loader';
  const msg = 'logging objects works!';
  const param1 = { foo: 'bar' };
  const param2 = { foo: 'baz' };
  output = '';
  log.info(category, msg, param1, param2);
  expect(output).toBe(`INFO: [${category}] ${msg}, ${param1}, ${param2}`);
});
