import * as vscode from 'vscode';
import { DotNetPathHelper } from './DotNetPathHelper';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';

const fs = require('fs');

export class DotNetFileProject extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.csproj, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };

        this.namespaceString = filename.replace(".csproj", "");
    }

    public static async createAsync(absolutePath: string, filename: string): Promise<DotNetFile> {
        return new DotNetFileProject(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
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
                    let fileDelimiter: string = DotNetPathHelper.extractFileDelimiter(containingFolder);

                    let dotNetFile: DotNetFile = await DotNetFileFactory.create(containingFolder + fileDelimiter + projectFiles[i], projectFiles[i], this);

                    this.children.push(dotNetFile);
                }

                await this.tryOrphanChildren();
            }

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}
