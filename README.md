# missionlog
Super simple and flexible logging that's granular

## Install
```shell
npm install @rmartone/missionlog
```

## Initialize
```typescript
improt { log } from 'missionlog';

// set max log level for subsystem
log.init({ loader: 'INFO', security: 'ERROR' }, (severity, category, msg, params): void => {
  console.log(`${severity}: [${category}] msg`, params`);
});
```
## Use
```typescript
log.error('loader', 'asset failed to load');
log.info('security', 'login successful');
```
