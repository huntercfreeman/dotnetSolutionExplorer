import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../FileBase';
import { FileBaseKind } from "../FileBaseKind";
import { FileFactory } from '../../Factories/FileFactory';
import { FileSorter } from '../../Utility/FileSorter';
import { DefaultFile } from './DefaultFile';
import { FilePathParser } from '../../Parsers/FilePathParser';

const fs = require('fs');

export class DirectoryFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.dir, parent);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'fileDirectoryIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'fileDirectoryIcon.svg')
        };

        if (this.filename === "wwwroot") {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'fileWwwRootIcon.svg'),
                dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'fileWwwRootIcon.svg')
            };
        }

        if (parent && parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename;
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: FileBase): Promise<FileBase> {
        return new DirectoryFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return this.children;
        }
        else {
            let projectFiles = fs.readdirSync(this.absolutePath);

            this.children = [];

            for (let i = 0; i < projectFiles.length; i++) {
                let fileDelimiter: string = FilePathParser.extractFileDelimiter(this.absolutePath);

                let fileBase: FileBase | undefined = await FileFactory.create(this.absolutePath + fileDelimiter + projectFiles[i], projectFiles[i], this);

                if (fileBase) {
                    this.children.push(fileBase);
                }
            }

            await this.tryOrphanChildren();

            this.children = FileSorter.organizeContainer(this.children);

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.directory";
}
