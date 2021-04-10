import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';

export class DotNetFileRazor extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public parent?: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        return new DotNetFileRazor(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
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
