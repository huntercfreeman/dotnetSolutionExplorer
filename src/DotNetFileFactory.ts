import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';
import { DotNetFileSolution } from './DotNetFileSolution';
import { DotNetFileProject } from './DotNetFileProject';
import { DotNetFileRazor } from './DotNetFileRazor';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetFileCss } from "./DotNetFileCss";
import { DotNetFileDirectory } from './DotNetFileDirectory';
import { DotNetFileJson } from './DotNetFileJson';
import { DotNetFileCs } from './DotNetFileCs';
import { DotNetFileCshtml } from './DotNetFileCshtml';

export class DotNetFileFactory {
    private constructor(
    ) {
    }

    public static async create(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile | undefined> {
        if (filename.endsWith(".sln")) {
            return await DotNetFileSolution.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".csproj")) {
            return await DotNetFileProject.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".txt")) {
            if (parent) {
                return await DotNetFileTxt.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".cs")) {
            if (parent) {
                return await DotNetFileCs.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".css")) {
            if (parent) {
                return await DotNetFileCss.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".cshtml")) {
            if (parent) {
                return await DotNetFileCshtml.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".razor file requires a parent");
            }
        }
        if (filename.endsWith(".razor")) {
            if (parent) {
                return await DotNetFileRazor.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".razor file requires a parent");
            }
        }
        if (filename.endsWith(".json")) {
            if (parent) {
                return await DotNetFileJson.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".json requires a parent");
            }
        }
        if (filename.includes(".")) {
            if (parent) {
                return await DotNetFileTxt.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }

        if(filename !== "bin" && filename !== "obj") {
            return await DotNetFileDirectory.createAsync(absolutePath, filename, parent);
        }

        return Promise.resolve(undefined);
    }
}