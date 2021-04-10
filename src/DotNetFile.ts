import * as vscode from 'vscode';
import * as path from 'path';

export class DotNetFile extends vscode.TreeItem {
    constructor(
        public readonly fileName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(fileName, collapsibleState);
        this.tooltip = `${this.fileName} test tooltip`;
        this.description = "abc test description";
    }

    children = [
        
    ];

    iconPath = {
        light: path.join('.', 'media', 'account.svg'),
        dark: path.join('.', 'media', 'account.svg'),
    };
}