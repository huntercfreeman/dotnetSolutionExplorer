import * as vscode from 'vscode';
import { DotNetProject } from './DotNetProject';
import { ProjectHelper } from './ProjectHelper';

const fs = require('fs');

export class SolutionHelperFactory {
    constructor() { }

    public async createSolutionHelperAsync(workspaceAbsolutePath: string, solutionAbsolutePath: string)
        : Promise<ISolutionHelper> {

        let solutionHelper = new SolutionHelper(workspaceAbsolutePath, solutionAbsolutePath);

        solutionHelper.slnFileContents = 
            fs.readFileSync(solutionAbsolutePath, { "encoding": "UTF-8" });

        solutionHelper.parseProjects();

        return Promise.resolve(solutionHelper);
    }
}

export interface ISolutionHelper {
    readonly slnDisplayName: string;
    readonly slnFileContents: string | undefined;
    
    parseProjects() : void;
}

class SolutionHelper implements ISolutionHelper {
    constructor(
        public readonly workspacePath: string,
        public readonly solutionPath: string
    ) {
        this.slnDisplayName = solutionPath.replace(workspacePath, "");
    }

    private projectHelper = new ProjectHelper();
    private dotNetProjects : DotNetProject[] = [];

    public readonly slnDisplayName: string;
    public slnFileContents: string = "";

    public parseProjects() : void {
        let position: number = 0;


        while(position < this.slnFileContents.length) {
            let currentChar: string = this.slnFileContents[position];

            switch(currentChar) {
                case 'P':
                    position++;
                    
            }
        }
    }
}