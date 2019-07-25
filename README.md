# missionlog [![NPM version][npm-image]][npm-url] [![Build status](https://travis-ci.com/rmartone/missionlog.svg)](https://travis-ci.com/rmartone/missionlog) [![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master) [![Bundlephobia](https://badgen.net/bundlephobia/minzip/missionlog)](https://bundlephobia.com/result?p=missionlog)

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat
[npm-url]: https://www.npmjs.com/package/missionlog

Missionlog is an easy to use lightweight logging library that provides level-based logging and category filtering. Messages are logged when their level is greater than or equal to their category's level `(OFF > ERROR > WARN > INFO)`. A category is a string that typically refers to a subsystem like "security" or "renderer". At initialization, each category is assigned a level which provides **granular control over your logs helps keep them readable and uncluttered**.

# Features
* Small footprint **~400 bytes with 0 dependencies**
* Simple **JSON configuration**
* Filter by level
* Filter by named category `'system' | 'whatever'`
* Flexible log event callback
  * Style terminal output with chalk
  * Send JSON to a cloud service like Loggly
  * Log strings and objects to the browser's console
* API mirrors `console.log` **logs objects** and **supports rest parameters**
* **CommonJS** module that works reliably with node or any browser through a bundler
* Includes **TypeScript definitions** so no `@types`

### Install
```shell
npm install missionlog
```

### Initialize
```typescript
improt { log } from 'missionlog';

// Set the max level to log for arbitrary categories
// where INFO > WARN > ERROR > OFF
log.init({ loader: 'INFO', security: 'ERROR', system: 'OFF' }, (level, category, msg, params): void => {
  // then log the way that works best for you
  //  * style terminal output with chalk
  //  * send JSON to a cloud logging service like Splunk
  //  * log strings and objects to the browser's console
  console.log(`${level}: [${category}] `, msg, ...params);
});
```
### Usage
```typescript
log.warn('loader', 'failed to load', url);
log.error('security', 'not authorized');
log.info('loader', 'asset loaded', { name, url });

// filtered since security's log level ERROR is greater than INFO
log.info('security', 'login successful');

// filtered since system's log level is turned OFF
log.error('system', 'eject the warp core', error);

// update log levels
log.init({ loader: 'ERROR', system: 'INFO' });
```

### Result
>![console](https://raw.githubusercontent.com/rmartone/missionlog/master/console.jpg)


### About
Created by [Ray Martone](mailto:rmartone@gmail.com).