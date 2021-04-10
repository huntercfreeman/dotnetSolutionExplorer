import { SpawnOptions } from "node:child_process";

export class SolutionHelperFactory {
    constructor() { }

    createSolutionHelperAsync(workspacePath: string, solutionPath: string)
        : ISolutionHelper {

        let solutionHelper = new SolutionHelper(workspacePath, solutionPath);

        return solutionHelper;
    }
}

export interface ISolutionHelper {
    readonly slnDisplayName: string;
    readonly slnFileContents: string | undefined;
}

class SolutionHelper implements ISolutionHelper {
    constructor(
        public readonly workspacePath: string,
        public readonly solutionPath: string
    ) {
        this.slnDisplayName = solutionPath.replace(workspacePath, "");
    }

    readonly slnDisplayName: string;
    readonly slnFileContents: string | undefined;
}