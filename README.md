# missionlog
Simple and flexible logging for javascript

### Setup
Download
```shell
npm install @rmartone/missionlog
```

Initialize
```javascript
improt { log, Severity } from 'missionlog';

log.init({ loader: 'INFO', system: 'ERROR }, (severity, msg, params) => {
  console.log(Severity[severity], msg, ...params);
});
```
And use
```javascript
log.info('loader', 'asset loaded');
```
