# missionlog  
[![NPM version][npm-image]][npm-url]  
[![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master)  

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat  
[npm-url]: https://www.npmjs.com/package/missionlog  

**A lightweight, highly configurable logging library** with **level-based filtering** and **tag-based organization** for **structured, readable logs**—ideal for both **browser and server environments**.  

---

## **🚀 What's New in Version 2.0 + Key Features**

✔️ **Lightweight & Dependency-Free** – Small (~1KB) with zero dependencies for fast, efficient logging.  
✔️ **Seamless ESM & CJS Support** – Works effortlessly with both **ES Modules (ESM)** and **CommonJS (CJS)**.  
✔️ **Optimized Performance** – O(1) log level lookups ensure minimal overhead.  
✔️ **Level-Based Filtering** – Control log visibility with levels: `ERROR > WARN > INFO > DEBUG > TRACE`.  
✔️ **Tag-Based Logging** – Assign log levels per **subsystem** (e.g., `'security'`, `'transporter'`).  
✔️ **Smarter Tag Handling** – Enhanced proxy-based system for dynamic, intuitive tag registration.  
✔️ **Flexible Output** – Log to the console, **style with chalk**, or stream logs to **Firebase, AWS, or other services**.  
✔️ **Seamless Integration** – Works in **Node.js**, browsers, and **Firebase Functions**.  
✔️ **Improved Defaults & Error Handling** – Invalid log levels now gracefully default to **TRACE**.  
✔️ **Console-Like API** – Supports objects, rest parameters, and mirrors native `console` methods.  
✔️ **TypeScript-Ready** – Built-in types, no need for `@types`.  

---

## **📚 Installation**
```sh
npm i missionlog
```

---

## **🚀 Getting Started**

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


### **1⃣ Example Browser Initialization**
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

### **🔹 Example Firebase Functions Integration**
```typescript
import { debug, error, info, warn } from 'firebase-functions/logger';
import { log, LogLevel, tag } from 'missionlog';

const firebaseLogger = {
  [LogLevel.ERROR]: (tag, payload) => error({ tag, ...payload }),
  [LogLevel.WARN]: (tag, payload) => warn({ tag, ...payload }),
  [LogLevel.INFO]: (tag, payload) => info({ tag, ...payload }),
  [LogLevel.TRACE]: (tag, payload) => debug({ tag, ...payload }),
  [LogLevel.DEBUG]: (tag, payload) => debug({ tag, ...payload }),
  [LogLevel.OFF]: () => void 0,
};

log.init({ transporter: 'INFO', security: 'ERROR', system: 'OFF' },
  (level, tag, msg, params) => firebaseLogger[level](tag, { ...params, message: msg })
);
```

---

## **📞 License**
**MIT License**  
**© 2019-2025 Ray Martone**  

---

