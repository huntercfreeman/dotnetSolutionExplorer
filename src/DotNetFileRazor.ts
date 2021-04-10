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
        
        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
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

    public async tryFosterChildren(): Promise<void> {
        if(!this.parent) {
            return Promise.resolve();
        }

        let childrenOfParent = await this.parent.getChildren();

        let fosteredCodebehind: DotNetFile | undefined = childrenOfParent.find((dotNetFile) => {
            return dotNetFile.filename === `${this.filename}.cs`;
        });

        let fosteredCss: DotNetFile | undefined = childrenOfParent.find((dotNetFile) => {
            return dotNetFile.filename === `${this.filename}.css`;
        });

        let children = await this.getChildren();

        let newChildrenOfParent = childrenOfParent;

        if(fosteredCodebehind) {
            children.push(fosteredCodebehind);

            newChildrenOfParent = newChildrenOfParent.filter((dotNetFile) => {
                return dotNetFile.filename !== fosteredCodebehind?.filename;
            });
        }

        if(fosteredCss) {
            children.push(fosteredCss);

            newChildrenOfParent = newChildrenOfParent.filter((dotNetFile) => {
                return dotNetFile.filename !== fosteredCss?.filename;
            });
        }

        this.parent.overwriteChildren(newChildrenOfParent);

        return Promise.resolve();
    }

    contextValue = "vscode.open";
}
