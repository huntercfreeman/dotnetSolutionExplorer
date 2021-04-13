import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileHelper } from './DotNetFileHelper';
import { DotNetPathHelper } from './DotNetPathHelper';
import { ProjectHelper } from './ProjectHelper';
const fs = require('fs');
import { DotNetProjectDependencies } from './DotNetProjectDependencies';


export class DotNetProjectReferenceList extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectReferenceList(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            let projectFileContents: string = fs.readFileSync(this.absolutePath, { "encoding": "UTF-8" });

            let projectReferences: string[] = ProjectHelper.extractProjectReferences(projectFileContents);
            projectReferences = projectReferences.map(projectReference => {
                var startOfAbsolutePath = projectReference.indexOf('\"');

                let position: number = startOfAbsolutePath + 1;

                let isolatedAbsolutePath = "";

                while (position < projectReference.length && projectReference[position] !== '\"') {
                    isolatedAbsolutePath += projectReference[position++];
                }

                return isolatedAbsolutePath;
            });

            this.children = [];

            for (let i = 0; i < projectReferences.length; i++) {
                let dotNetFile: DotNetFile = await DotNetProjectDependencies.createAsync(projectReferences[i], DotNetPathHelper.extractFileName(projectReferences[i]), this);

                this.children.push(dotNetFile);
            }

            await this.tryOrphanChildren();

            this.children = DotNetFileHelper.organizeContainer(this.children);

            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}
