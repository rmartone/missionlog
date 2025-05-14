# missionlog

[![NPM version][npm-image]][npm-url] [![Coverage Status](https://coveralls.io/repos/github/rmartone/missionlog/badge.svg?branch=master)](https://coveralls.io/github/rmartone/missionlog?branch=master) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

[npm-image]: https://img.shields.io/npm/v/missionlog.svg?style=flat
[npm-url]: https://www.npmjs.com/package/missionlog

---

🚀 **missionlog** is a **lightweight, structured logging package** designed for **performance, flexibility, and ease of use**. It works as a **drop-in replacement for `console.log` or `ts-log`**, and offers both **log level** filtering, optional **tag** filtering, and **customizable output handling**—all in a tiny (~1KB) package.

✔ **Fully Typed (TypeScript)** • ✔ **ESM & CJS Support** • ✔ **Zero Dependencies** • ✔ **100% Coverage**

---

## ✨ Why Use `missionlog`?

- **Drop-in Replacement for `console.log` & `ts-log`** – Start using it instantly!
- **Seamless Upgrade to Tagged Logging** – Reduce log clutter and focus on what's important.
- **Configurable Log Levels** – Adjust visibility for log level and tags at runtime.
- **Customizable Output** – Send logs anywhere: console, JSON, cloud services.
- **Structured Logging Support** – Enhanced callbacks with timestamp and typed message data.
- **Blazing Fast Performance** – O(1) log level lookups with advanced level caching.
- **TypeScript-First** – Full type safety with LogMessage and LogConfig interfaces.
- **Chainable API** – All methods return the logger instance for method chaining.
- **Works Everywhere** – Browser, Node.js, Firebase, AWS Lambda etc.

---

## 📦 Installing

```sh
npm i missionlog
```

---

## 🚀 Getting Started

### Basic Usage

Missionlog works as a drop-in replacement for console.log:

```typescript
import { log } from 'missionlog';

// Works just like console.log
log.info('Hello, world!');
log.warn('Warning message');
log.error('Error occurred!');

// Chainable API for fluent logging
log.debug('Starting process').info('Process step 1 complete').warn('Process running slowly');
```

---

## 💡 Usage Examples

### Using Tags for Categorization

```typescript
import { log, tag, LogLevel, DEFAULT_TAG } from 'missionlog';

// Configure logging levels for different tags
log.init({
  network: LogLevel.DEBUG,
  ui: LogLevel.INFO,
  [DEFAULT_TAG]: LogLevel.WARN, // Default level for uncategorized logs
});

// Log with tags
log.debug(tag.network, 'Connection established');
log.info(tag.ui, 'Component rendered');

// Untagged logs use the DEFAULT_TAG level
log.debug("This won't be logged because DEFAULT_TAG is WARN");
log.error('This will be logged because ERROR > WARN');
```

### Custom Log Handler (with Chalk)

```typescript
import { log, LogLevel, LogLevelStr, LogCallbackParams } from 'missionlog';
import chalk from 'chalk';

// Create a custom log handler
function createCustomHandler() {
  const logConfig: Record<LogLevelStr, { color: (text: string) => string; method: (...args: unknown[]) => void }> = {
    ERROR: { color: chalk.red, method: console.error },
    WARN: { color: chalk.yellow, method: console.warn },
    INFO: { color: chalk.blue, method: console.log },
    DEBUG: { color: chalk.magenta, method: console.log },
    TRACE: { color: chalk.cyan, method: console.log },
    OFF: { color: () => '', method: () => {} },
  };

  return (level: LogLevelStr, tag: string, message: unknown, params: unknown[]) => {
    const { method, color } = logConfig[level];
    const logLine = `[${color(level)}] ${tag ? tag + ' - ' : ''}${message}`;
    method(logLine, ...params);
  };
}

// Initialize with custom handler
log.init({ network: LogLevel.INFO, [DEFAULT_TAG]: LogLevel.INFO }, createCustomHandler());

// Enhanced structured logging with timestamps and typed data
log.setEnhancedCallback((params: LogCallbackParams) => {
  const { level, tag, message, timestamp, params: extraParams } = params;
  console.log(`[${timestamp.toISOString()}] [${level}] ${tag ? tag + ' - ' : ''}${message}`, ...extraParams);
});

// Check if specific levels are enabled before performing expensive operations
if (log.isDebugEnabled('network')) {
  // Only perform this expensive operation if DEBUG logs for 'network' will be shown
  const stats = getNetworkStatistics(); // Example of an expensive operation
  log.debug(tag.network, 'Network statistics', stats);
}

// Similarly for TRACE level
if (log.isTraceEnabled('ui')) {
  // Avoid expensive calculations when trace logging is disabled
  const detailedMetrics = calculateDetailedRenderMetrics();
  log.trace(tag.ui, 'UI rendering detailed metrics', detailedMetrics);
}

// The general method is still available for other log levels
if (log.isLevelEnabled(LogLevel.WARN, 'security')) {
  const securityCheck = performSecurityAudit();
  log.warn(tag.security, 'Security audit results', securityCheck);
}
```

---

## 📖 API Reference

### Log Methods

- `log.trace(messageOrTag?, ...params)` - Lowest verbosity level
- `log.debug(messageOrTag?, ...params)` - Detailed debugging information
- `log.info(messageOrTag?, ...params)` - Notable but expected events
- `log.log(messageOrTag?, ...params)` - Alias for info()
- `log.warn(messageOrTag?, ...params)` - Potential issues or warnings
- `log.error(messageOrTag?, ...params)` - Error conditions

### Configuration

- `log.init(config?, callback?)` - Configure log levels and custom handler
- `log.setEnhancedCallback(callback)` - Set structured logging callback with extended parameters
- `log.isLevelEnabled(level, tag?)` - Check if a specific level would be logged for a tag
- `log.isDebugEnabled(tag?)` - Convenience method to check if DEBUG level is enabled for a tag
- `log.isTraceEnabled(tag?)` - Convenience method to check if TRACE level is enabled for a tag
- `log.reset()` - Clear all tag registrations and configurations

### Log Levels (in order of verbosity)

1. `LogLevel.TRACE` - Most verbose
2. `LogLevel.DEBUG`
3. `LogLevel.INFO` - Default level
4. `LogLevel.WARN`
5. `LogLevel.ERROR`
6. `LogLevel.OFF` - No logs

---

## 🖼️ Example Output

![Example Image](https://raw.githubusercontent.com/rmartone/missionlog/e267c41e4d36b5523198e8eafcdda2ed203f7941/example.jpg)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/rmartone/missionlog/issues) or submit a pull request.

---

## 📄 License

**MIT License**
**© 2019-2025 Ray Martone**

---

🚀 **Install `missionlog` today and make logging clean, structured, and powerful!**
