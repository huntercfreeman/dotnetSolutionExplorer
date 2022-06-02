import * as vscode from 'vscode';
import * as path from 'path';
import { FilePathParser } from '../../../Parsers/FilePathParser';
import { DefaultFile } from '../../FileSystem/DefaultFile';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from "../../FileBaseKind";
import { FileFactory } from '../../../Factories/FileFactory';
import { FileSorter } from '../../../Utility/FileSorter';
import { ProjectDependencyListFile } from './ProjectDependencyListFile';
import { SolutionFile } from '../SolutionFile';

const fs = require('fs');

export class ProjectFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.csproj, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileProjectIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileProjectIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };

        this.namespaceString = filename.replace(".csproj", "");
    }

    public static async createAsync(absolutePath: string, filename: string, parent: FileBase): Promise<FileBase> {
        return new ProjectFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return this.children;
        }
        else {
            let containingFolder: string = this.absolutePath
                .replace(`/${this.filename}`, "")
                .replace(`\\${this.filename}`, "");

            let projectFiles: string[] = fs.readdirSync(containingFolder);

            this.children = [];

            if (projectFiles) {
                projectFiles = projectFiles.filter((x) => x !== this.filename);

                for (let i = 0; i < projectFiles.length; i++) {
                    let fileDelimiter: string = FilePathParser.extractFileDelimiter(containingFolder);

                    let fileBase: FileBase | undefined = await FileFactory.create(containingFolder + fileDelimiter + projectFiles[i], projectFiles[i], this);

                    if (fileBase) {
                        this.children.push(fileBase);
                    }
                }

                await this.tryOrphanChildren();
            }

            this.children.push(await ProjectDependencyListFile.createAsync(this.absolutePath, "Dependencies", this));

            this.children = FileSorter.organizeContainer(this.children);

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.project";
}
