import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFileSolution } from './DotNetFileSolution';
import { DotNetFileProject } from './DotNetFileProject';
import { DotNetFileRazor } from './DotNetFileRazor';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetFileDirectory } from './DotNetFileDirectory';
import { DotNetFileJson } from './DotNetFileJson';

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

    public static dotNetFileFactory(absolutePath: string, filename: string, collapsibleState: vscode.TreeItemCollapsibleState) {
        if (filename.endsWith(".sln")) {
            return DotNetFileSolution.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".csproj")) {
            return DotNetFileProject.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".txt")) {
            return DotNetFileTxt.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".razor")) {
            return DotNetFileRazor.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".json")) {
            return DotNetFileJson.createAsync(absolutePath, filename);
        }
        if(filename.includes(".")) {
            return DotNetFileTxt.createAsync(absolutePath, filename);
        }

        return DotNetFileDirectory.createAsync(absolutePath, filename);
    }
}

