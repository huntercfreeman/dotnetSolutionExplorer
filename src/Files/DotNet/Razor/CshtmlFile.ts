import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from "../../FileBaseKind";


export class CshtmlFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public parent: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.cshtml, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileCshtmlIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileCshtmlIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };

        if (parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename.replace(".razor", "");
    }

    public static async createAsync(absolutePath: string, filename: string, parent: FileBase): Promise<FileBase> {
        return new CshtmlFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
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

    public async tryFosterChildren(): Promise<void> {
        if (!this.parent) {
            return Promise.resolve();
        }

        let childrenOfParent = await this.parent.getChildren();

        let fosteredCodebehind: FileBase | undefined = childrenOfParent.find((FileBase) => {
            return FileBase.filename === `${this.filename}.cs`;
        });

        let fosteredCss: FileBase | undefined = childrenOfParent.find((FileBase) => {
            return FileBase.filename === `${this.filename}.css`;
        });

        let children = await this.getChildren();

        let newChildrenOfParent = childrenOfParent;

        if (fosteredCodebehind) {
            children.push(fosteredCodebehind);

            newChildrenOfParent = newChildrenOfParent.filter((FileBase) => {
                return FileBase.filename !== fosteredCodebehind?.filename;
            });
        }

        if (fosteredCss) {
            children.push(fosteredCss);

            newChildrenOfParent = newChildrenOfParent.filter((FileBase) => {
                return FileBase.filename !== fosteredCss?.filename;
            });
        }

        this.parent.overwriteChildren(newChildrenOfParent);

        if (children.length <= 0) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        }

        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.razor";
}
