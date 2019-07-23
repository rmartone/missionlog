# missionlog
lightweight granular logging for both node and browser

## Install
```shell
npm install missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// Set the max log level for arbitrary categories
// where INFO > WARN > ERROR
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, category, msg, params): void => {
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
log.info('loader', 'asset loaded', url);
// filtered since security's max log level is ERROR
log.info('security', 'login successful');
```
