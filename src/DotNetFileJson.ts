import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile } from './DotNetFile';


export class DotNetFileJson extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileJsonIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileJsonIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetFileJson(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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
