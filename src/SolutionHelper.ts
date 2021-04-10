import * as vscode from 'vscode';

const fs = require('fs');

export class SolutionHelperFactory {
    constructor() { }

    public async createSolutionHelperAsync(workspaceAbsolutePath: string, solutionAbsolutePath: string)
        : Promise<ISolutionHelper> {

        let solutionHelper = new SolutionHelper(workspaceAbsolutePath, solutionAbsolutePath);

        solutionHelper.slnFileContents = 
            fs.readFileSync(solutionAbsolutePath, { "encoding": "UTF-8" });

        

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