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
function _log(level, category, message, optionalParams) {
    if (_callback) {
        const maxLevel = _level[category];
        if (maxLevel === undefined) {
            _callback('ERROR', 'missionlog', `uninitialized category "${category}"`, []);
        }
        if (level <= maxLevel || maxLevel === undefined) {
            _callback(Level[level], category, message, optionalParams);
        }
    }
}
exports.log = {
    init: (config, callback) => {
        for (const k in config) {
            _level[k] = Level[config[k]];
        }
        if (callback) {
            _callback = callback;
        }
        return exports.log;
    },
    error: (category, message, ...optionalParams) => _log(Level.ERROR, category, message, optionalParams),
    warn: (category, message, ...optionalParams) => _log(Level.WARN, category, message, optionalParams),
    info: (category, message, ...optionalParams) => _log(Level.INFO, category, message, optionalParams),
};
