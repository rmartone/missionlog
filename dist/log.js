var Severity;
(function (Severity) {
    Severity[Severity["ERROR"] = 1] = "ERROR";
    Severity[Severity["WARN"] = 2] = "WARN";
    Severity[Severity["INFO"] = 3] = "INFO";
})(Severity || (Severity = {}));
const _severity = {};
let _onLog;
function write(component, severity, message, optionalParams) {
    const maxSeverity = _severity[component];
    if (maxSeverity === undefined) {
        throw Error(`component ${component} not configured`);
    }
    if (severity <= maxSeverity) {
        _onLog(Severity[severity], message, optionalParams);
    }
}
export const log = {
    init: (config, callback) => {
        for (const k in config) {
            _severity[k] = Severity[config[k]];
        }
        _onLog = callback;
    },
    error: (component, message, ...optionalParams) => {
        write(component, Severity.ERROR, message, optionalParams);
    },
    warn: (component, message, ...optionalParams) => {
        write(component, Severity.WARN, message, optionalParams);
    },
    info: (component, message, ...optionalParams) => {
        write(component, Severity.INFO, message, optionalParams);
    },
};
