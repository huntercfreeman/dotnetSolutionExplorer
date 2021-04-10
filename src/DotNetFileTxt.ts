import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';

export class DotNetFileTxt extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static async createAsync(absolutePath: string, filename: string): Promise<DotNetFile> {
        return new DotNetFileTxt(absolutePath, filename, vscode.TreeItemCollapsibleState.None);
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