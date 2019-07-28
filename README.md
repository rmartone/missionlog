# missionlog [![NPM version][npm-image]][npm-url] [![Build status](https://travis-ci.com/rmartone/missionlog.svg)](https://travis-ci.com/rmartone/missionlog) [![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master) [![Bundlephobia](https://badgen.net/bundlephobia/minzip/missionlog)](https://bundlephobia.com/result?p=missionlog) [![dependencies Status](https://david-dm.org/rmartone/missionlog/status.svg)](https://david-dm.org/rmartone/missionlog)

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat
[npm-url]: https://www.npmjs.com/package/missionlog

lightweight log adapter that provides level based filtering and tagging. **Filtering keeps your logs readable and uncluttered while tagging makes them searchable**.

## Simple example
```javascript
import { log } from 'missionlog';

// assign tags levels and set a log callback
log.init({ transporter: 'WARN', phasers: 'OFF'}, (...args) => console.log(...args));
log.error('transporter', 'evil twin detected!');
```

## Features
* Small footprint **~400 bytes with 0 dependencies**
* Simple **JSON configuration**
* Filter by level, `ERROR > WARN > INFO`
* Filter by `tag` `'system' | 'whatever'`
* Flexible log event callback
  * Style terminal output with chalk
  * Send JSON to a cloud service like [Loggly](https://www.loggly.com/)
  * Log strings and objects to the console
* API mirrors `console.log` **logs objects** and **supports rest parameters**
* **CommonJS** module that works reliably with node or any browser through a bundler
* Includes **TypeScript definitions** so no need for external `@types`

## Install
```shell
npm install missionlog
```

## Initialize

Tags typically refer to a subsystem or component like `'security'` or `FooBar.name`.When missionlog is initialized, tags can be assigned a level. When a message's level is greater than or equal to its `tag`'s assigned level, missionlog executes a callkack. This simple and elegant approach to logging is incredibly flexible. For example, with **missionlog** you can seamlessly migrate from  `console` logging to a sophisticated cloud service with minimal impact!

```javascript
// var log = require('missionlog').log;
improt { log } from 'missionlog';

/**
 * init
 * @param config JSON object which assigns tags levels. If uninitialized,
 *    a tag's level defaults to INFO where ERROR > WARN > INFO.
 * @param callback? supports logging whatever way works best for you
 * @return {Log} supports chaining
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
log.warn('loader', 'failed to load', url);
log.error('security', 'not authorized', err);
log.info('loader', 'asset loaded', { name, url });

// filtered since security's log level ERROR is greater than INFO
log.info('security', 'login successful');

// filtered since system's level is OFF
log.error('system', 'eject the warp core', error);

// updates tag levels
log.init({ loader: 'ERROR', system: 'INFO' });
```