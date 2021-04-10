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

    public async tryOrphanChildren(): Promise<void> {
        let childFiles: DotNetFile[] = await this.getChildren();

        for(let i = 0; i < childFiles.length; i++) {
            let childFile = childFiles[i];

            childFile.tryFosterChildren();
        }
    }

    public abstract tryFosterChildren() : Promise<void>;
}