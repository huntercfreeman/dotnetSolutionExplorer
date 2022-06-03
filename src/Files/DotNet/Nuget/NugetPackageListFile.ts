import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from '../../FileBaseKind';
import { NugetPackageFile } from './NugetPackageFile';
import { FileSorter } from '../../../Utility/FileSorter';
import { FilePathParser } from '../../../Parsers/FilePathParser';
import { ProjectParser } from '../../../Parsers/ProjectParser';
const fs = require('fs');

export class NugetPackageListFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: FileBase): Promise<FileBase> {
        return new NugetPackageListFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            let projectFileContents: string = fs.readFileSync(this.absolutePath, { "encoding": "UTF-8" });

            let projectNugetPackageStrings: string[] = ProjectParser.extractNugetPackageReferences(projectFileContents);

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
                let fileBase: FileBase = await NugetPackageFile.createAsync(this.absolutePath,
                    nugetPackage.include,
                    nugetPackage.include,
                    nugetPackage.version,
                    this);

                this.children.push(fileBase);
            }

            await this.tryOrphanChildren();

            this.children = FileSorter.organizeContainer(this.children);

            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.project-nuget-package-list";
}


