# missionlog

Provides lightweight easy to use level-based logging and category filtering for JavaScript and TypeScript within a minimal footprint.

Missionlog is a barebones reliable everyday es6 logging library written in TypeScript. It isn't fancy (or complicated), but it does everything you're likely to need:

## Features
* Simple JSON configuration
* Filter by level (SILENT < ERROR < WARN < INFO)
* Filter by arbitrary named category (eg 'system' | 'whatever' )
* Flexible log event callback
  * style terminal output with chalk
  * send JSON to a cloud logging service like splunk
  * log strings and objects to the browser's console
* Mirrors console's supports for logging objects and rest parameters
* Works on node and browser (UMD module)
* Includes TypeScript definitions so no @types needed

## Install
```shell
npm install missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// Set the max severity to log for arbitrary categories
// where INFO > WARN > ERROR > OFF
log.init({ loader: 'INFO', security: 'ERROR', system: 'OFF' }, (severity, category, msg, params): void => {
  // then log the way that works best for you
  //  * style terminal output with chalk
  //  * send JSON to a cloud logging service like splunk
  //  * log strings and objects to the browser's console
  console.log(`${severity}: [${category}] `, msg, ...params);
});
```
## Use
```typescript
log.error('loader', 'failed to load', url);
log.error('security', 'not authorized');
log.info('loader', 'asset loaded', { name, url });
// filtered since category's max severity ERROR is less than INFO
log.info('security', 'login successful');
// filtered since system's level set to silent
log.error('system', 'eject the warp core', error);
```
