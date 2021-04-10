import * as vscode from 'vscode';
import * as path from 'path';

export abstract class DotNetFile extends vscode.TreeItem {
    constructor(
        public readonly fileName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(fileName, collapsibleState);
        this.tooltip = `${this.fileName} test tooltip`;
        this.description = "abc test description";
    }

    children: DotNetFile[] | undefined = undefined;

    public abstract getChildren(): Promise<DotNetFile[]>;
}

export class DotNetFileSolution extends DotNetFile {
    private constructor(
        public readonly fileName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(fileName, collapsibleState);
    }

    public static createAsync(filename: string): DotNetFile {
        return new DotNetFileSolution(filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if(this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];
            return Promise.resolve(this.children);
        }
    }
}

export class DotNetFileProject extends DotNetFile {
    private constructor(
        public readonly fileName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(fileName, collapsibleState);
    }

    public static createAsync(filename: string): DotNetFile {
        return new DotNetFileProject(filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if(this.children) {
            return this.children;
        }
        else {
            await fs.readdir(vscodeInteropEvent.targetOne, (err: any, files: any) => {
                // update vscodeInteropEvent.targetOne to be
                // the absolute path of the csproj
                // the result is the list of files
                let csvOfFiles = "";

                for (let i = 0; i < files.length; i++) {
                  csvOfFiles += files[i];

                  if (i < files.length - 1) {
                    csvOfFiles += ',';
                  }
                }

                vscodeInteropEvent.result = csvOfFiles;

                webviewView.webview.postMessage(vscodeInteropEvent);
              });
              break;


            return [];
        }
    }
}