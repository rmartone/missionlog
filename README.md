# missionlog
lightweight granular logging for both node and browser

## Install
```shell
npm install missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// set the max log level for various subsystem
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, category, msg, params): void => {
  // use chalk, send JSON to a service or log objects to the console...
  console.log(`${severity}: [${category}] `, msg, ...params);
});
```
## Use
```typescript
log.error('loader', 'failed to load', url);
log.error('security', 'not authorized');
log.info('loader', 'asset was loaded', url);
// filtered since 'security' was set to ERROR or higher
log.info('security', 'login successful');
```
