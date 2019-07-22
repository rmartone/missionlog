var Severity;
(function (Severity) {
    Severity[Severity["ERROR"] = 1] = "ERROR";
    Severity[Severity["WARN"] = 2] = "WARN";
    Severity[Severity["INFO"] = 3] = "INFO";
})(Severity || (Severity = {}));
const _severity = {};
let _callback;
function write(category, severity, message, optionalParams) {
    const maxSeverity = _severity[category];
    if (maxSeverity === undefined) {
        throw Error(`category ${category} not configured`);
    }
    if (severity <= maxSeverity) {
        _callback(Severity[severity], category, message, optionalParams);
    }
}
export const log = {
    init: (config, callback) => {
        for (const k in config) {
            _severity[k] = Severity[config[k]];
        }
        _callback = callback;
    },
    error: (category, message, ...optionalParams) => {
        write(category, Severity.ERROR, message, optionalParams);
    },
    warn: (category, message, ...optionalParams) => {
        write(category, Severity.WARN, message, optionalParams);
    },
    info: (category, message, ...optionalParams) => {
        write(category, Severity.INFO, message, optionalParams);
    },
};
