import * as vscode from 'vscode';
import { DotNetPathHelper } from './DotNetPathHelper';
import { DotNetFileTxt } from './DotNetFileTxt';
const fs = require('fs');
import { DotNetFile } from './DotNetFile';


export class DotNetFileProject extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
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

            let projectFiles = fs.readdirSync(containingFolder);

            this.children = [];

            for (let i = 0; i < projectFiles.length; i++) {
                let fileDelimiter: string = DotNetPathHelper.extractFileDelimiter(containingFolder);

                let dotNetFile: DotNetFile = DotNetFileTxt.createAsync(containingFolder + fileDelimiter + projectFiles[i], projectFiles[i]);

                this.children.push(dotNetFile);
            }

            return this.children;
        }
    }

    public test(err: any, data: any): void {
        console.log("true");
    }
}
