import * as vscode from 'vscode';
import { DotNetFileSolution } from './DotNetFileSolution';
import { DotNetFileProject } from './DotNetFileProject';
import { DotNetFileRazor } from './DotNetFileRazor';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetFileDirectory } from './DotNetFileDirectory';
import { DotNetFileJson } from './DotNetFileJson';

export class DotNetFileFactory {
    private constructor(
    ) {
    }

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