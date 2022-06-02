import * as vscode from 'vscode';
import { CSharpProjectModel } from '../Models/CSharpProjectModel';
import { ProjectParser } from './ProjectParser';
import { ConstantValues } from '../Constants/ConstantValues';

const fs = require('fs');

export class SolutionParser {
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
    readonly slnFileName: string;
    readonly slnFileContents: string | undefined;
    dotNetProjects: CSharpProjectModel[];

    parseProjects(): void;
}

class SolutionHelper implements ISolutionHelper {
    constructor(
        public readonly workspaceAbsolutePath: string,
        public readonly slnAbsolutePath: string
    ) {
        this.slnFileName = slnAbsolutePath
            .replace(workspaceAbsolutePath, "")
            .replace("/", "")
            .replace("\\", "");
    }

    private position: number = 0;

    public readonly slnFileName: string;
    public slnFileContents: string = "";
    public dotNetProjects: CSharpProjectModel[] = [];

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
                        let projectItem: CSharpProjectModel = this.createProjectFromExactSlnText();

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

    private createProjectFromExactSlnText(): CSharpProjectModel {
        let exactSlnText: string = "";

        while (!this.peek("rojectDependencies") &&
            !this.peek("rojectConfiguration") &&
            !this.peek("rojectConfigurationPlatforms") &&
            !this.peek("rojects)") && // NestedProjects)
            !this.peekConsumeIfTrue(ConstantValues.endOfProjectMarker) &&
            this.position < this.slnFileContents.length) {
            exactSlnText = this.consumeCurrentChar(exactSlnText);
        }

        return ProjectParser.createProject(
            exactSlnText, this.slnAbsolutePath, this.slnFileName
        );
    }

    private consumeCurrentChar(exactSlnText: string): string {
        let currentChar: string = this.slnFileContents[this.position++];

        return exactSlnText + currentChar;
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