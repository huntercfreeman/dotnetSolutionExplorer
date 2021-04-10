import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';
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

    public static async create(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        if (filename.endsWith(".sln")) {
            return await DotNetFileSolution.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".csproj")) {
            return await DotNetFileProject.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".txt")) {
            return await DotNetFileTxt.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".razor")) {
            if(parent) {
                return await DotNetFileRazor.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".razor file does not have a parent");
            }
        }
        if (filename.endsWith(".json")) {
            return await DotNetFileJson.createAsync(absolutePath, filename);
        }
        if(filename.includes(".")) {
            return await DotNetFileTxt.createAsync(absolutePath, filename);
        }

        return await DotNetFileDirectory.createAsync(absolutePath, filename);
    }
}