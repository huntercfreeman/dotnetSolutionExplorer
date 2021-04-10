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

    children = [];
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

    children = [];
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

    children = [];
}