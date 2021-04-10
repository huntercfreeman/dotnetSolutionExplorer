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
        public readonly workspaceAbsolutePath: string,
        public readonly slnAbsolutePath: string
    ) {
        this.slnDisplayName = slnAbsolutePath.replace(workspaceAbsolutePath, "");
    }

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
                        let projectItem: DotNetProject = this.createProjectFromExactSlnText();

                        if (projectItem) {
                            this.dotNetProjects.push(projectItem);
                        }
                    }

                    break;
                case 'E':
                    this.position++;
                    this.peekConsumeIfTrue("ndProject");

                    break;
                default:
                    this.position++;

                    break;
            }
        }
    }

    private createProjectFromExactSlnText(): DotNetProject {
        let exactSlnText: string = "";

        while (!this.peek("rojectDependencies") &&
            !this.peek("rojectConfiguration") &&
            !this.peek("rojectConfigurationPlatforms") &&
            !this.peek("rojects)") && // NestedProjects)
            !this.peekConsumeIfTrue(WellKnownValues.endOfProjectMarker) &&
            this.position < this.slnFileContents.length) {
            this.consumeCurrentChar(exactSlnText);
        }

        return ProjectHelper.createProject(
            exactSlnText, this.slnAbsolutePath, this.slnDisplayName
        );
    }

    private consumeCurrentChar(exactSlnText: string): void {
        let currentChar: string = this.slnFileContents[this.position++];

        exactSlnText += currentChar;
    }

    private peekConsumeIfTrue(substring: string): boolean {
        let peekString = this.slnFileContents.substring(this.position, this.position + substring.length);

        if (this.position + substring.length < this.slnFileContents.length &&
            peekString === substring) {
            this.position += substring.length;

            return true;
        }

        return false;
    }

    private peek(substring: string): boolean {
        if (this.position + substring.length < this.slnFileContents.length &&
            this.slnFileContents.substring(this.position, this.position + substring.length) === substring) {
            return true;
        }

        return false;
    }
}