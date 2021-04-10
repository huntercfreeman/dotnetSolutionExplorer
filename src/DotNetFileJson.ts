import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';


export class DotNetFileJson extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileJson(absolutePath, filename, vscode.TreeItemCollapsibleState.None);
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
}
