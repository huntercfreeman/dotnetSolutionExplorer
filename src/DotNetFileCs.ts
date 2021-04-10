import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';


export class DotNetFileCs extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileCs(absolutePath, filename, vscode.TreeItemCollapsibleState.None);
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
