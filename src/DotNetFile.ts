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

    public abstract tryFosterChildren(): Promise<void>;

    public async tryOrphanChildren(): Promise<void> {
        let currentChildren = await this.getChildren();
        let currentChildCount = currentChildren.length;

        for (var i = 0; i < currentChildCount; i++) {
            await currentChildren[i].tryFosterChildren();

            currentChildren = await this.getChildren();

            if(currentChildCount !== currentChildren.length) {
                i = 0;
            }
        }
    }

    overwriteChildren(newChildren: DotNetFile[]) {
        this.children = newChildren;
    }
}