import { log } from '../src/log';

let output: string;
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, category, msg): void => {
  output = `${severity}: [${category}] ${msg}`;
});

test('log info', (): void => {
  const category = 'loader';
  const msg = 'asset failed to load';
  output = '';
  log.info(category, msg);
  expect(output).toBe(`INFO: [${category}] ${msg}`);
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

test('category filter', (): void => {
  const category = 'security';
  const msg = 'login success';
  output = '';
  log.info(category, msg);
  expect(output).toBe('');
});
