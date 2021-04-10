import { SpawnOptions } from "node:child_process";

const fs = require('fs');

export class SolutionHelperFactory {
    constructor() { }

    public async createSolutionHelperAsync(workspacePath: string, solutionPath: string)
        : Promise<ISolutionHelper> {

        let solutionHelper = new SolutionHelper(workspacePath, solutionPath);

        await fs.readFile(solutionPath, { "encoding": "UTF-8" }, (err: any, data: any) => {
            solutionHelper.slnFileContents = data;
        });

        return Promise.resolve(solutionHelper);
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
    slnFileContents: string | undefined;
}