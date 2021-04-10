import * as vscode from 'vscode';
import { DotNetProject } from './DotNetProject';
import { ProjectHelper } from './ProjectHelper';
import { WellKnownValues } from './WellKnownValues';

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

    parseProjects(): void;
}

class SolutionHelper implements ISolutionHelper {
    constructor(
        public readonly workspacePath: string,
        public readonly solutionPath: string
    ) {
        this.slnDisplayName = solutionPath.replace(workspacePath, "");
    }

    private projectHelper = new ProjectHelper();
    private dotNetProjects: DotNetProject[] = [];
    private position: number = 0;


    public readonly slnDisplayName: string;
    public slnFileContents: string = "";

    public parseProjects(): void {
        while (this.position < this.slnFileContents.length) {
            let currentChar: string = this.slnFileContents[this.position];

            switch (currentChar) {
                case 'P':
                    this.position++;

                    if (!this.peek("rojectDependencies") &&
                        !this.peek("rojectConfiguration") &&
                        !this.peek("rojectConfigurationPlatforms") &&
                        !this.peek("rojects)") && // NestedProjects)
                        this.peekConsumeIfTrue("roject")) {
                        DotNetProject projectItem = CreateProjectFromExactSlnText();

                        if (projectItem != null) {
                            _csharpProjects.Add(projectItem);
                        }
                    }
            }
        }
    }

    private CreateProjectFromExactSlnText(): DotNetProject
        {
            let exactSlnText: string[] = [];

            while (!this.peek("rojectDependencies") &&
                   !this.peek("rojectConfiguration") &&
                   !this.peek("rojectConfigurationPlatforms") &&
                   !this.peek("rojects)") && // NestedProjects)
                   !this.peekConsumeIfTrue(WellKnownValues.endOfProjectMarker) &&
                    this.position < this.slnFileContents.length)
            {
                ConsumeCurrentChar(exactSlnText);
            }

            return _projectHelper.Parse(exactSlnText.ToString(), SlnAbsolutePath, SlnDisplayName);
        }


    private peekConsumeIfTrue(substring: string): boolean {
        if (this.position + substring.length < this.slnFileContents.length &&
            this.slnFileContents.substring(this.position, substring.length) == substring) {
            this.position += substring.length;

            return true;
        }

        return false;
    }

    private peek(substring: string): boolean {
        if (this.position + substring.length < this.slnFileContents.length &&
            this.slnFileContents.substring(this.position, substring.length) == substring) {
            return true;
        }

        return false;
    }
}