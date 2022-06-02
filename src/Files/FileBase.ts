import * as vscode from 'vscode';
import { FileBaseKind } from './FileBaseKind';


export abstract class FileBase extends vscode.TreeItem {
    constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly fileBaseKind: FileBaseKind,
        public readonly parent?: FileBase
    ) {
        super(filename, collapsibleState);
        // this.tooltip = `${this.filename} test tooltip`;
        // this.description = "abc test description";
    }

    public namespaceString: string | undefined;

    children: FileBase[] | undefined = undefined;

    public abstract getChildren(): Promise<FileBase[]>;

    public abstract tryFosterChildren(): Promise<void>;

    public async tryOrphanChildren(): Promise<void> {
        let currentChildren = await this.getChildren();
        let currentChildCount = currentChildren.length;

        for (var i = 0; i < currentChildCount; i++) {
            await currentChildren[i].tryFosterChildren();

            currentChildren = await this.getChildren();

            if(currentChildCount !== currentChildren.length) {
                currentChildCount = currentChildren.length;
                i = 0;
            }
        }
    }

    overwriteChildren(newChildren: FileBase[] | undefined) {
        this.children = newChildren;
    }
}