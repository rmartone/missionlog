# missionlog [![NPM version][npm-image]][npm-url] [![Build status](https://travis-ci.com/rmartone/missionlog.svg)](https://travis-ci.com/rmartone/missionlog) [![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master) [![Bundlephobia](https://badgen.net/bundlephobia/minzip/missionlog)](https://bundlephobia.com/result?p=missionlog) [![dependencies Status](https://david-dm.org/rmartone/missionlog/status.svg)](https://david-dm.org/rmartone/missionlog)

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat
[npm-url]: https://www.npmjs.com/package/missionlog

Lightweight logger with an extensible configuration. Supports level based filtering and tagging. Filtering keeps your logs readable and uncluttered while tagging makes them searchable.

## Features
* Small footprint, around 400 bytes with 0 dependencies
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

```javascript
// var log = require('missionlog').log;
import { log } from 'missionlog';

/**
 * initialize missionlog
 * @param config JSON which assigns tags levels. An uninitialized,
 *    tag's level defaults to INFO.
 * @param callback? handle logging whichever way works best for you
 */
log.init(
  { loader: 'INFO', security: 'ERROR', system: 'OFF' },
  (level, tag, msg, params) => {
    const prefix = `${level}: [${tag}] `;
    switch(level) {
      case 'ERROR':
        console.error(prefix, msg, ...params);
        break;
      case 'WARN':
        console.warn(prefix, msg, ...params);
        break;
      case 'INFO':
        console.info(prefix, msg, ...params);
        break;
    }
  });
```
## Usage
```javascript
log.error('security', 'not authorized', statusCode);
log.warn('transporter', 'Evil twin detected!');

// filtered since security's log level ERROR is greater than INFO
log.info('security', 'login successful');

// filtered since system's level is OFF
log.error('system', 'eject the warp core', error);

// updates tag levels
log.init({ loader: 'ERROR', system: 'INFO' });
```
