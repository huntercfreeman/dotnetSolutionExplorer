import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetProjectNugetPackage } from './DotNetProjectNugetPackage';
import { DotNetFileHelper } from './DotNetFileHelper';
import { DotNetPathHelper } from './DotNetPathHelper';
import { ProjectHelper } from './ProjectHelper';
const fs = require('fs');

export class DotNetProjectNugetPackageList extends DotNetFile {
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
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectNugetPackageList(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            let projectFileContents: string = fs.readFileSync(this.absolutePath, { "encoding": "UTF-8" });

            let projectNugetPackageStrings: string[] = ProjectHelper.extractNugetPackageReferences(projectFileContents);

            let projectNugetPackageObjects: any = projectNugetPackageStrings.map(projectReference => {
                var startOfInclude = projectReference.indexOf('\"');

                let position: number = startOfInclude + 1;

                let isolatedInclude = "";

                while (position < projectReference.length && projectReference[position] !== '\"') {
                    isolatedInclude += projectReference[position++];
                }

                var startOfInclude = (projectReference.substring(++position)).indexOf('\"');

                position = startOfInclude + position + 1;

                let isolatedVersion = "";

                while (position < projectReference.length && projectReference[position] !== '\"') {
                    isolatedVersion += projectReference[position++];
                }

                return {
                    "include": isolatedInclude,
                    "version": isolatedVersion
                };
            });

            this.children = [];

            for (let i = 0; i < projectNugetPackageObjects.length; i++) {
                let nugetPackage: any = projectNugetPackageObjects[i];
                let dotNetFile: DotNetFile = await DotNetProjectNugetPackage.createAsync(this.absolutePath,
                    nugetPackage.include,
                    nugetPackage.include,
                    nugetPackage.version,
                    this);

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

    contextValue = "dotnet-solution-explorer.project-nuget-package-list";
}


