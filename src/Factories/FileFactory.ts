import * as vscode from 'vscode';
import { isDir } from "../Utility/isDir";
import { FileBase } from '../Files/FileBase';
import { SolutionFile } from '../Files/DotNet/SolutionFile';
import { ProjectFile } from '../Files/DotNet/CSharp/ProjectFile';
import { RazorFile } from '../Files/DotNet/Razor/RazorFile';
import { DefaultFile } from '../Files/FileSystem/DefaultFile';
import { CssFile } from '../Files/WebDevelopment/CssFile';
import { DirectoryFile } from '../Files/FileSystem/DirectoryFile';
import { JsonFile } from '../Files/Serialization/JsonFile';
import { CSharpFile } from '../Files/DotNet/CSharp/CSharpFile';
import { CshtmlFile } from '../Files/DotNet/Razor/CshtmlFile';
import { MarkdownFile } from '../Files/Markup/MarkdownFile';

export class FileFactory {
    private constructor(
    ) {
    }

    public static async create(absolutePath: string, filename: string, parent?: FileBase): Promise<FileBase | undefined> {
        if (filename.endsWith(".sln")) {
            return await SolutionFile.createAsync(absolutePath, filename);
        }
        if (filename.endsWith(".txt")) {
            if (parent) {
                return await DefaultFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".cs")) {
            if (parent) {
                return await CSharpFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".css")) {
            if (parent) {
                return await CssFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }
        if (filename.endsWith(".cshtml")) {
            if (parent) {
                return await CshtmlFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".razor file requires a parent");
            }
        }
        if (filename.endsWith(".razor")) {
            if (parent) {
                return await RazorFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".razor file requires a parent");
            }
        }
        if (filename.endsWith(".json")) {
            if (parent) {
                return await JsonFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".json requires a parent");
            }
        }
        if (filename.endsWith(".md")) {
            if (parent) {
                return await MarkdownFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".md requires a parent");
            }
        }
        if (filename.includes(".")) {
            if (parent) {
                return await DefaultFile.createAsync(absolutePath, filename, parent);
            }
            else {
                throw new Error(".txt file requires a parent");
            }
        }

        if(filename !== "bin" && filename !== "obj") {
            if(isDir(absolutePath)) {
                return await DirectoryFile.createAsync(absolutePath, filename, parent);
            } 
            else {
                if (parent) {
                    return await DefaultFile.createAsync(absolutePath, filename, parent);
                }
                else {
                    throw new Error(".txt file requires a parent");
                }
            }
        }

        return Promise.resolve(undefined);
    }
}