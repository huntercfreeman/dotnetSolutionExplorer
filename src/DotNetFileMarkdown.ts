import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';

export class DotNetFileMarkdown extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.markdown, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileMarkdownIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileMarkdownIcon.svg')
        };

        if (this.filename === "README.md") {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'fileReadMeIcon.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileReadMeIcon.svg')
            };
        }

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetFileMarkdown(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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
