import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../FileBase';
import { FileBaseKind } from "../FileBaseKind";

export class CssFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.css, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'fileCssIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'fileCssIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: FileBase): Promise<FileBase> {
        return new CssFile(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
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
