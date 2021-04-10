import * as vscode from 'vscode';

export abstract class DotNetFile extends vscode.TreeItem {
    constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(filename, collapsibleState);
        this.tooltip = `${this.filename} test tooltip`;
        this.description = "abc test description";
    }

    children: DotNetFile[] | undefined = undefined;

    public abstract getChildren(): Promise<DotNetFile[]>;

    public async tryFosterChild(filename: string): Promise<DotNetFile | undefined> {
        let childFiles: DotNetFile[] = await this.getChildren();

        let fosteredChild = childFiles.find((dotNetFile) => {
            dotNetFile.filename === filename;
        });

        if(!fosteredChild) {
            return undefined;
        }

        this.children = childFiles.filter((dotNetFile) => {
            dotNetFile.filename === filename;
        });

        return fosteredChild;
    }
}