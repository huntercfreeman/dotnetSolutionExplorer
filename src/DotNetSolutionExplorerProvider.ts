import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DotNetFile } from './DotNetFile';
import { SolutionHelperFactory, ISolutionHelper } from './SolutionHelper';

export class DotNetSolutionExplorerProvider implements vscode.TreeDataProvider<DotNetFile> {
    constructor(private workspaceAbsolutePath: string) { }

    private root : DotNetFile | undefined;
    private solutionHelper: ISolutionHelper | undefined;


    getTreeItem(element: DotNetFile): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DotNetFile): Thenable<DotNetFile[]> {
        if (!this.workspaceAbsolutePath) {
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
        let absolutePaths = solutions.map((x) => x.fsPath.toString());

        if(absolutePaths.length === 0) {
            vscode.window.showErrorMessage("No .sln files were found within workspace");

            return [];
        }

        let selectedSolutionAbsolutePath = await vscode.window.showQuickPick(absolutePaths);

        if(selectedSolutionAbsolutePath) {
            let solutionHelperFactory = new SolutionHelperFactory();

            this.solutionHelper = await solutionHelperFactory.createSolutionHelperAsync(
                this.workspaceAbsolutePath, selectedSolutionAbsolutePath
            );

            this.root = new DotNetFile(this.solutionHelper.slnFileName, vscode.TreeItemCollapsibleState.None);

            for(let i = 0; i < this.solutionHelper.dotNetProjects.length; i++) {
                this.root.children.push()
            }


            return [ this.root ];
        }
        else {
            vscode.window.showErrorMessage("Must provide an absolute path to a .sln within workspace");
            return [];
        }
    }
}