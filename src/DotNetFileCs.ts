import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';


export class DotNetFileCs extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };

        if(parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }
        
        this.namespaceString += "." + filename.replace(".cs", "");
    }

    public static createAsync(absolutePath: string, filename: string, parent: DotNetFile): DotNetFile {
        return new DotNetFileCs(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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
