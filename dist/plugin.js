"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOG_PREFIX = "[selective-functions]";
class ServerlessSelectiveFunctions {
    constructor(serverless) {
        this.filterFunctions = () => {
            var _a, _b;
            const functions = this.serverless.service.getAllFunctions();
            if (functions.length <= 0) {
                this.error(`No functions were found`);
                return;
            }
            else {
                this.info(`Found ${functions.length} functions`);
            }
            const stage = ((_b = (_a = this.serverless.service.provider) === null || _a === void 0 ? void 0 : _a.environment) === null || _b === void 0 ? void 0 : _b.DEPLOYMENT_NAME) ||
                this.serverless.service.provider.stage;
            this.info(`Selecting functions for stage: "${stage}"`);
            const selectedFunctions = {};
            functions.forEach((functionName) => {
                var _a, _b;
                const functionProps = this.serverless.service.getFunction(functionName);
                if (ServerlessSelectiveFunctions.shouldFunctionBeSelected(stage, (_a = functionProps.stages) === null || _a === void 0 ? void 0 : _a.include, (_b = functionProps.stages) === null || _b === void 0 ? void 0 : _b.exclude)) {
                    this.info(`Selected: ${functionName}`);
                    selectedFunctions[functionName] = functionProps;
                }
            });
            this.serverless.service.functions = selectedFunctions;
            const numSelectedFunctions = Object.keys(selectedFunctions).length;
            if (numSelectedFunctions > 0) {
                this.info(`Selection complete, ${numSelectedFunctions} function${numSelectedFunctions > 1 ? "s" : ""} added`);
            }
            else {
                this.info(`Selection complete, no functions added`);
            }
        };
        this.serverless = serverless;
        this.commands = {};
        this.hooks = {
            "before:info:info": this.filterFunctions,
            "before:package:initialize": this.filterFunctions,
            "before:offline:start:init": this.filterFunctions,
        };
        this.info = (...args) => serverless.cli.log([LOG_PREFIX, "[INFO]", ...args].join(" "));
        this.error = (...args) => serverless.cli.log([LOG_PREFIX, "[ERROR]", ...args].join(" "));
    }
    static matchExact(regex, str) {
        const match = str.toLowerCase().match(regex.toLowerCase());
        return match && str === match[0];
    }
}
exports.default = ServerlessSelectiveFunctions;
ServerlessSelectiveFunctions.shouldFunctionBeSelected = (stage, includedStages, excludedStages) => {
    let isSelected = true;
    if ((includedStages !== null && includedStages !== void 0 ? includedStages : []).length === 0 &&
        (excludedStages !== null && excludedStages !== void 0 ? excludedStages : []).length === 0) {
        return isSelected;
    }
    if (includedStages && includedStages.length > 0) {
        isSelected = includedStages.some((includedStage) => ServerlessSelectiveFunctions.matchExact(includedStage, stage));
    }
    if (excludedStages && excludedStages.length > 0) {
        isSelected = !excludedStages.some((excludedStage) => ServerlessSelectiveFunctions.matchExact(excludedStage, stage));
    }
    return isSelected;
};
//# sourceMappingURL=plugin.js.map