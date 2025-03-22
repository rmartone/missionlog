var Level;
(function (Level) {
    Level[Level["TRACE"] = 1] = "TRACE";
    Level[Level["DEBUG"] = 2] = "DEBUG";
    Level[Level["INFO"] = 3] = "INFO";
    Level[Level["WARN"] = 4] = "WARN";
    Level[Level["ERROR"] = 5] = "ERROR";
    Level[Level["OFF"] = 6] = "OFF";
})(Level || (Level = {}));
export var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "TRACE";
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
export const DEFAULT_TAG = '*';
const tagRegistry = new Set();
export const tag = new Proxy({}, {
    get(_, prop) {
        if (typeof prop === 'string' && tagRegistry.has(prop)) {
            return prop;
        }
        return undefined;
    },
    ownKeys() {
        return Array.from(tagRegistry);
    },
    getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true };
    },
});
const LEVEL_STR_MAP = new Map([
    [Level.TRACE, 'TRACE'],
    [Level.DEBUG, 'DEBUG'],
    [Level.INFO, 'INFO'],
    [Level.WARN, 'WARN'],
    [Level.ERROR, 'ERROR'],
    [Level.OFF, 'OFF'],
]);
export class Log {
    _defaultLevel = Level.INFO;
    _tagToLevel = new Map();
    _callback;
    init(config, callback) {
        if (config) {
            for (const key in config) {
                const levelStr = config[key];
                if (Object.values(LogLevel).includes(levelStr)) {
                    const level = Level[levelStr];
                    if (key === DEFAULT_TAG) {
                        this._defaultLevel = level || Level.INFO;
                    }
                    else {
                        this._tagToLevel.set(key, level || Level.DEBUG);
                        tagRegistry.add(key);
                    }
                }
                else {
                    console.warn(`Invalid log level "${levelStr}" for tag "${key}". Using default (${LEVEL_STR_MAP.get(this._defaultLevel)}).`);
                    this._tagToLevel.set(key, Level.DEBUG);
                    tagRegistry.add(key);
                }
            }
        }
        if (callback !== undefined) {
            this._callback = callback;
        }
        return this;
    }
    _log(level, messageOrTag, ...optionalParams) {
        if (!this._callback || !messageOrTag)
            return;
        let tag;
        let message;
        if (typeof messageOrTag === 'string' && tagRegistry.has(messageOrTag)) {
            tag = messageOrTag;
            message = optionalParams[0] ?? '';
            optionalParams = optionalParams.slice(1);
        }
        else {
            tag = '';
            message = messageOrTag;
        }
        if (!message)
            return;
        const effectiveLevel = this._tagToLevel.get(tag || DEFAULT_TAG) ?? this._defaultLevel;
        if (level < effectiveLevel)
            return;
        this._callback(LEVEL_STR_MAP.get(level), tag, message, optionalParams.filter(param => param !== undefined));
    }
    debug(messageOrTag, ...optionalParams) {
        this._log(Level.DEBUG, messageOrTag, ...optionalParams);
    }
    error(messageOrTag, ...optionalParams) {
        this._log(Level.ERROR, messageOrTag, ...optionalParams);
    }
    info(messageOrTag, ...optionalParams) {
        this._log(Level.INFO, messageOrTag, ...optionalParams);
    }
    log(messageOrTag, ...optionalParams) {
        this._log(Level.INFO, messageOrTag, ...optionalParams);
    }
    trace(messageOrTag, ...optionalParams) {
        this._log(Level.TRACE, messageOrTag, ...optionalParams);
    }
    warn(messageOrTag, ...optionalParams) {
        this._log(Level.WARN, messageOrTag, ...optionalParams);
    }
}
export const log = new Log();
//# sourceMappingURL=index.js.map