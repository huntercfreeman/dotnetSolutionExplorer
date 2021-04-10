import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetPathHelper } from './DotNetPathHelper';

const fs = require('fs');

export class DotNetFileDirectory extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileDirectory(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
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

                let dotNetFile: DotNetFile = DotNetFileTxt.createAsync(this.absolutePath + fileDelimiter + projectFiles[i], projectFiles[i]);

                this.children.push(dotNetFile);
            }

            return this.children;
        }
    }
}