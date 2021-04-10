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

    public abstract getChildren(): DotNetFile[];
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

    public getChildren(): DotNetFile[] {
        if(this.children) {
            return this.children;
        }
        else {
            this.children = [];
            return this.children;
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

    public getChildren(): DotNetFile[] {
        if(this.children) {
            return this.children;
        }
        else {
            return [];
        }
    }
}