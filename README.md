# missionlog
Super simple and flexible logging

## Install
```shell
npm install @rmartone/missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// set max log level for componennts
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, msg, params): void => {
  console.log(severity, msg, params);
});
```
## Use
```typescript
log.error('loader', 'asset failed to load');
log.info('security', 'login successful');
```
