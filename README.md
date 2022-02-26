# missionlog [![NPM version][npm-image]][npm-url] [![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master) 

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat
[npm-url]: https://www.npmjs.com/package/missionlog

Lightweight logger with an extensible configuration. Supports level based filtering and tagging. Filtering keeps your logs readable and uncluttered while tagging makes them searchable.

## Features
* Small footprint, around 500 bytes with 0 dependencies
* Filter by level, `ERROR > WARN > INFO`
* Filter by tag, `'security' | 'whatever'`
* Log callback is extensible from console to cloud
  * Style terminal output with chalk
  * Send JSON to a cloud service like [Loggly](https://www.loggly.com/)
  * Log strings and objects to the console
  * Combine any of the above based on env
* API mirrors `console.log`, logs objects and supports rest parameters
* Works reliably with node or any browser through a bundler
* Includes **TypeScript definitions** so no need for external `@types`


## Install
```shell
npm install missionlog
```

## Initialize

Tags typically refer to a subsystem or component like `'security'` or `FooBar.name`.When missionlog is initialized, tags can be assigned a level. A message is logged when its level is greater than or equal to its `tag`'s assigned level.

``` javascript
import { log, LogLevel } from 'missionlog';
import chalk from 'chalk';

// handler which does the logging to the console or anything
const logger = {
  [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
  [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
  [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

/**
 * initialize missionlog
 * @param config JSON which assigns tags levels. An uninitialized,
 *    tag's level defaults to INFO.
 * @param callback? handle logging whichever way works best for you
 */
log.init( transporter: 'INFO', security: 'ERROR', system: 'OFF' }, (level, tag, msg, params) => {
  logger[level as keyof typeof logger](tag, msg, params);
});

```

## Usage
```javascript
import { log, tag } from 'missionlog';

// the imported value "tag" is populated with YOUR tags!
log.error(tag.security, 'not authorized', statusCode);

// but if you prefer simply use strings
log.warn('transporter', 'Evil twin detected!');

// filtered since security's log level ERROR is greater than INFO
log.info(tag.security, 'login successful');

// also filtered since system's level is OFF
log.error(tag.system, 'eject the warp core', error);

// updates tag levels on the fly
log.init({ loader: 'ERROR', system: 'INFO' });

// disable logging by clearing the callback
log.init();
```
## Advanced Usage
Create an instance with its own tags and callback.
```javascript

import { Log, tag } from 'missionlog';

const myLog = new Log().init(
  { loader: 'INFO', security: 'ERROR' },
  (level, tag, msg, params) => {
    console.log(`${level}: [${tag}] `, msg, ...params);
});

myLog.info(tag.security, 'login successful');
```