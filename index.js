"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level;
(function (Level) {
    Level[Level["OFF"] = 1] = "OFF";
    Level[Level["ERROR"] = 2] = "ERROR";
    Level[Level["WARN"] = 3] = "WARN";
    Level[Level["INFO"] = 4] = "INFO";
})(Level || (Level = {}));
const _level = {};
let _callback;
function write(category, level, message, optionalParams) {
    const maxLevel = _level[category];
    if (maxLevel === undefined) {
        throw Error(`category ${category} not configured`);
    }
    if (level <= maxLevel) {
        _callback(Level[level], category, message, optionalParams);
    }
}
exports.log = {
    init: (config, callback) => {
        for (const k in config) {
            _level[k] = Level[config[k]];
        }
        _callback = callback;
    },
    error: (category, message, ...optionalParams) => {
        write(category, Level.ERROR, message, optionalParams);
    },
    warn: (category, message, ...optionalParams) => {
        write(category, Level.WARN, message, optionalParams);
    },
    info: (category, message, ...optionalParams) => {
        write(category, Level.INFO, message, optionalParams);
    },
};
