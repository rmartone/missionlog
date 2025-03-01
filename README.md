# missionlog  
[![NPM version][npm-image]][npm-url]  
[![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master)  

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat  
[npm-url]: https://www.npmjs.com/package/missionlog  

**Lightweight, configurable logging library** with **level-based filtering** and **tagging** to keep logs structured and readable.

---

## New in Version 2.0 🚀

- **ESM & CJS Support** – Now works seamlessly with both **ES Modules (ESM)** and **CommonJS (CJS)**.
- **More Efficient Logging** – Removed unnecessary internal error handling to improve performance.
- **Improved Tag Handling** – Optimized proxy behavior for dynamic tag registration.
- **Better Config Defaults** – Invalid log levels now correctly default to TRACE with a warning.

---

## **✨ Features**
✔️ **Small footprint (~1KB)**  
✔️ **Filter logs by level:** `ERROR > WARN > INFO > DEBUG > TRACE`  
✔️ **Tag-based filtering:** Assign log levels per **subsystem** (`'security'`, `'transporter'`, etc.)  
✔️ **Customizable log output:**  
   - Style logs with **chalk**  
   - Send logs to a cloud service like **[Loggly](https://www.loggly.com/)**  
   - **Integrate seamlessly with Firebase Functions**  
   - **Styled console output in the browser**  
✔️ **API mirrors `console`**, supports objects & rest parameters  
✔️ **Works in both Node.js & browsers**  
✔️ **TypeScript-ready** – No need for `@types`  

---

## **📚 Installation**
```sh
npm i missionlog
```

---

## **🚀 Getting Started**
### **1⃣ Initialize the Logger**
```typescript
import { log, LogLevel } from 'missionlog';
import chalk from 'chalk';

// Define how each log level should be handled
const logger = {
  [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
  [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
  [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.green(tag)}]`, msg, ...params),
  [LogLevel.DEBUG]: (tag, msg, params) => console.log(`[${chalk.magenta(tag)}]`, msg, ...params),
  [LogLevel.TRACE]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

// Initialize missionlog with tag levels & a custom handler
log.init(
  { transporter: 'INFO', security: 'ERROR', system: 'OFF' },
  (level, tag, msg, params) => logger[level](tag, msg, params)
);
```

---

## **🗒 Basic Usage**
```typescript
import { log, tag } from 'missionlog';

// Use predefined tags (auto-populated)
log.error(tag.security, 'Access denied', statusCode);

// Or use string-based tags
log.warn('transporter', 'Evil twin detected!');

// Filtered: security level is ERROR (INFO won't log)
log.info(tag.security, 'User logged in');

// DEBUG message
log.debug(tag.system, { warpFactor, starDate });

// TRACE message
log.trace(tag.system, 'Entering warp core');

// Filtered: system's level is OFF
log.error(tag.system, 'Ejecting warp core', error);

// Dynamically update log levels
log.init({ loader: 'ERROR', system: 'INFO' });

// Disable logging completely
log.init();
```

---

## **💡 Advanced Usage**
### **🔹 Firebase Functions Integration**
```typescript
import { debug, error, info, warn } from 'firebase-functions/logger';
import { log, LogLevel, tag } from 'missionlog';

// import from a settings
const logOptiosn = { 
    "functions": "DEBUG",
    "system": "INFO",
    "firestore": "WARN"
};

const firebaseLogger = {
  [LogLevel.ERROR]: (tag, payload) => error({ tag, ...payload }),
  [LogLevel.WARN]: (tag, payload) => warn({ tag, ...payload }),
  [LogLevel.INFO]: (tag, payload) => info({ tag, ...payload }),
  [LogLevel.TRACE]: (tag, payload) => debug({ tag, ...payload }),
  [LogLevel.DEBUG]: (tag, payload) => debug({ tag, ...payload }),
  [LogLevel.OFF]: () => void 0,
};

log.init(settings.logOptions, (level, tag, msg, params) => {
  firebaseLogger[level](tag, { ...params, message: msg });
});

```

---

## **📞 License**
**MIT License**  
**© 2019-2025 Ray Martone**  

---

