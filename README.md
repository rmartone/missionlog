# missionlog
Simple and flexible logging

## Install
```shell
npm install @rmartone/missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// specify components and their max log level
log.init({ loader: 'INFO', system: 'ERROR' }, (severity, msg, params): void => {
  console.log(severity, msg, params);
});
```
## Use
```typescript
log.error('loader', 'asset failed to load');

log.info('system', 'object created');
```
