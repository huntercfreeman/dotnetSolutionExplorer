import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
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

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
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
            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

export class DotNetProjectNugetPackage extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.nugetPackage, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        // this.command = {
        //     "command": "dotnet-solution-explorer.openFile",
        //     "title": "open",
        //     "arguments": [uri]
        // };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectNugetPackage(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
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

                position = startOfInclude += startOfInclude;

                let isolatedVersion = "";

                while (position < projectReference.length && projectReference[position] !== '\"') {
                    isolatedVersion += projectReference[position++];
                }

                return {
                    "include": isolatedInclude,
                    "version": isolatedVersion
                };
            });



            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.nuget-package";
}
