import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DotNetFile } from './DotNetFile';

export class DotNetSolutionExplorerProvider implements vscode.TreeDataProvider<DotNetFile> {
    constructor(private workspaceRoot: string) { }

    private root : DotNetFile | undefined;

    getTreeItem(element: DotNetFile): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DotNetFile): Thenable<DotNetFile[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No files in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve(
                [
                    new DotNetFile("testOne.txt", vscode.TreeItemCollapsibleState.Collapsed),
                    new DotNetFile("testTwo.txt", vscode.TreeItemCollapsibleState.Collapsed)
                ]
            );
        }
        else {
            return this.getRoot();
        }
    }

    private async getRoot(): Promise<DotNetFile[]> {
        if(this.root) { return [ this.root ]; }
        
        let solutions = await vscode.workspace.findFiles("**/*.sln");
        let paths = solutions.map((x) => x.fsPath.toString());

        let selectedSolutionPath = await vscode.window.showQuickPick(paths);

        if(selectedSolutionPath) {
            this.root = new DotNetFile(selectedSolutionPath, vscode.TreeItemCollapsibleState.None);

            //this.root.children;
            return [ this.root ];
        }
        else {
            vscode.window.showErrorMessage("Must provide a path to a .sln within workspace");
            return [];
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }
}