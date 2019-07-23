# missionlog [![NPM version][npm-image]][npm-url] [![NPM downloads](https://img.shields.io/npm/dw/missionlog.svg)](https://www.npmjs.com/package/missionlog) [![Build status](https://travis-ci.org/pimterry/missionlog.png)](https://travis-ci.org/pimterry/missionlog)

Provides lightweight easy to use level-based logging and category filtering for JavaScript and TypeScript. Missionlog is a barebones reliable everyday  logging library. It isn't fancy (or complicated), but it does everything you're likely to need.

# Features
* Simple JSON configuration
* Filter by level (SILENT < ERROR < WARN < INFO)
* Filter by named category (eg 'system' | 'whatever' )
* Flexible log event callback
  * Style terminal output with chalk
  * Send JSON to a cloud logging service like Splunk
  * Log strings and objects to the browser's console
* API mirrors `console.log`, logs objects and supports rest parameters
* UMD module that works with node and browser
* Includes TypeScript definitions so no @types needed
* Super small footprint with zero dependencies

## Install
```shell
npm install missionlog
```

## Initialize
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
## Use
```typescript
log.error('loader', 'failed to load', url);
log.error('security', 'not authorized');
log.info('loader', 'asset loaded', { name, url });
// filtered since security's log level ERROR is less than INFO
log.info('security', 'login successful');
// filtered since system's log level is turned OFF
log.error('system', 'eject the warp core', error);
```
