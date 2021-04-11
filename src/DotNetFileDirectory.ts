import * as vscode from 'vscode';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetPathHelper } from './DotNetPathHelper';

const fs = require('fs');

export class DotNetFileDirectory extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.dir, parent);

        if (parent && parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename;
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        return new DotNetFileDirectory(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return this.children;
        }
        else {
            let projectFiles = fs.readdirSync(this.absolutePath);

            this.children = [];

            for (let i = 0; i < projectFiles.length; i++) {
                let fileDelimiter: string = DotNetPathHelper.extractFileDelimiter(this.absolutePath);

                let dotNetFile: DotNetFile = await DotNetFileFactory.create(this.absolutePath + fileDelimiter + projectFiles[i], projectFiles[i], this);

                this.children.push(dotNetFile);
            }

            await this.tryOrphanChildren();

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.directory";
}
