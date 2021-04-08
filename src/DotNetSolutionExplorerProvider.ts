import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DotNetFile } from './DotNetFile';

export class DotNetSolutionExplorerProvider implements vscode.TreeDataProvider<DotNetFile> {
    constructor(private workspaceRoot: string) { }

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
            vscode.window.showInformationMessage('Workspace has no package.json');
            return Promise.resolve([
                new DotNetFile("testOne.txt", vscode.TreeItemCollapsibleState.None)
            ]);
        }
    }
    

    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    // private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    //     if (this.pathExists(packageJsonPath)) {
    //         const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    //         const toDep = (moduleName: string, version: string): Dependency => {
    //             if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
    //                 return new Dependency(
    //                     moduleName,
    //                     version,
    //                     vscode.TreeItemCollapsibleState.Collapsed
    //                 );
    //             } else {
    //                 return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
    //             }
    //         };

    //         const deps = packageJson.dependencies
    //             ? Object.keys(packageJson.dependencies).map(dep =>
    //                 toDep(dep, packageJson.dependencies[dep])
    //             )
    //             : [];
    //         const devDeps = packageJson.devDependencies
    //             ? Object.keys(packageJson.devDependencies).map(dep =>
    //                 toDep(dep, packageJson.devDependencies[dep])
    //             )
    //             : [];
    //         return deps.concat(devDeps);
    //     } else {
    //         return [];
    //     }
    // }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }
}