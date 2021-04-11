import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';

export class DotNetFileJson extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.json, parent);

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

    public async tryFosterChildren(): Promise<void> {
        if (!this.parent) {
            return Promise.resolve();
        }

        let mainAppsettings = "appsettings.json";

        if (this.filename !== mainAppsettings) {
            return Promise.resolve();
        }

        let childrenOfParent = await this.parent.getChildren();

        let fosteredAppsettings: DotNetFile[] | undefined = childrenOfParent.filter((dotNetFile) => {
            return dotNetFile.filename.startsWith("appsettings") &&
                dotNetFile.filename.endsWith(".json") &&
                dotNetFile.filename !== mainAppsettings;
        });

        let children = await this.getChildren();

        let newChildrenOfParent = childrenOfParent;

        if (fosteredAppsettings) {
            for (let i = 0; i < fosteredAppsettings.length; i++) {
                let currentAppsettingsFile = fosteredAppsettings[i];

                children.push(currentAppsettingsFile);

                newChildrenOfParent = newChildrenOfParent.filter((dotNetFile) => {
                    return dotNetFile.filename !== currentAppsettingsFile.filename;
                });
            }
        }

        this.parent.overwriteChildren(newChildrenOfParent);

        if (children.length <= 0) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        }
        else {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }

        return Promise.resolve();
    }
}
