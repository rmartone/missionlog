# missionlog  
[![NPM version][npm-image]][npm-url]  
[![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master)  

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat  
[npm-url]: https://www.npmjs.com/package/missionlog  

🚀 **missionlog** is a **lightweight, structured logging library** designed for **performance, flexibility, and ease of use**.  
It works as a **drop-in replacement for `console.log` or `ts-log`**, featuring **tag-based organization**, **log level filtering**, and **customizable output handling**—all in a tiny (~1KB) package.  

✔ **Fully Typed (TypeScript)** • ✔ **ESM & CJS Support** • ✔ **Zero Dependencies**  

---

## **✨ Why Use `missionlog`?**  
Compared to other logging libraries like `ts-log`, `missionlog` offers:  

✅ **Drop-in Replacement for `console.log` & `ts-log`** – Start using it instantly.  
✅ **Seamless Upgrade to Tag-Based Logging** – Reduce log clutter by dynamically focusing on what's important.  
✅ **Configurable Log Levels** – Adjust visibility for each tag at runtime to filter noise.  
✅ **Customizable Output** – Send logs anywhere: console, JSON, cloud services.  
✅ **Blazing Fast Performance** – O(1) log level lookups for minimal overhead.  
✅ **TypeScript-First** – Full type safety, no need for `@types`.  
✅ **Works Everywhere** – Browser, Node.js, Firebase, AWS Lambda etc.  

---

## **📦 Installation**  
```sh  
npm i missionlog  
```

```sh  
yarn add missionlog  
```

## **🔧 Works with TypeScript, ESM & CJS**  
✅ Fully typed API with **zero dependencies**.  
✅ Works seamlessly with both **ES Modules (ESM)** and **CommonJS (CJS)**.  

---

## 🎯 **Focus on What Matters, When It Matters**  
`missionlog` lets you **filter logs dynamically** to avoid clutter and focus on what's important—without forcing you to use tags.  

---

### **🚀 Example Usage**

```typescript
import { log, LogLevel, LogLevelStr, tag } from 'missionlog.js';
import chalk from 'chalk';

// Use the built-in dummy logger so becomes a no-op
log.info(tag.engineering, 'Engaging warp drive! Destination: The Final Frontier.');

// Let's set some tags
log.init({ engineering: LogLevel.INFO, transporter: LogLevel.DEBUG });

// Log with a tag
log.info(tag.engineering, 'Warp Factor 9!'); 

// Override the built-in dummy with custom behavior
log.init({ engineering: LogLevel.INFO }, createLogHandler());

// engineering's level is INFO+ so this gets logged!
log.info(tag.engineering, 'Warp Factor 5.'); 

// No tag so works like console and uses the default level
log.warn('Alert! Evil twin detected!'); 

// Gets filtered since engineering is INFO+
log.debug(tag.engineering, 'Warp Factor 9!'); 

// Set specific log levels for tags and override the default ('*') level from INFO to ERROR
log.init({ engineering: LogLevel.TRACE, '*': LogLevel.ERROR, transporter: LogLevel.DEBUG });

// Log an error
const error = new Error('Warp core breach!')
log.error(tag.engineering, '🚨 Red Alert!', error.message); 

// Show some color! 
log.debug( tag.transporter, '✨ Beam me up, Scotty!');

// Log objects
log.warn(tag.transporter, 'Transporter anomaly detected,', { evilTwin: true });

log.info()

// replace dummy logger with custom behavior
function createLogHandler() {
  const logConfig: Record<LogLevelStr, { color: (text: string) => string; method: (...args: unknown[]) => void }> = {
    ERROR: { color: chalk.red, method: console.error },
    WARN: { color: chalk.yellow, method: console.warn },
    INFO: { color: chalk.green, method: console.log },
    DEBUG: { color: chalk.magenta, method: console.log },
    TRACE: { color: chalk.cyan, method: console.log },
    OFF: { color: chalk.white, method: () => { /* no-op */ } }, 
  };

  return (level: LogLevelStr, tag: string, message: unknown, params: unknown[]) => {
    const config = logConfig[level];
    config.method(tag ? `[${config.color(tag)}] ${message}` : message, ...params, '\n');
  };
}
```

![Example Image](example.jpg)

---

## **🔧 Works with TypeScript, ESM & CJS**  
✅ Fully typed API with **zero dependencies**.  
✅ Works seamlessly with both **ES Modules (ESM)** and **CommonJS (CJS)**.  

---

## **📄 License**  
**MIT License**  
**© 2019-2025 Ray Martone**  

---

🚀 **Install `missionlog` today and make logging clean, structured, and powerful!**
