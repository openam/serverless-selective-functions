import * as Serverless from "serverless";
interface ServerlessPluginCommand {
    commands?: Record<string, ServerlessPluginCommand>;
    lifecycleEvents?: string[];
    options?: Record<string, {
        default?: any;
        required?: boolean;
        shortcut?: string;
        usage?: string;
    }>;
    usage?: string;
}
export default class ServerlessSelectiveFunctions {
    readonly serverless: Serverless;
    readonly commands: Record<string, ServerlessPluginCommand>;
    readonly hooks: Record<string, () => any | Promise<any>>;
    private info;
    private error;
    constructor(serverless: Serverless);
    private filterFunctions;
    static shouldFunctionBeSelected: (stage: string, includedStages: string[] | undefined, excludedStages: string[] | undefined) => boolean;
    static matchExact(regex: string, str: string): boolean | null;
}
export {};
