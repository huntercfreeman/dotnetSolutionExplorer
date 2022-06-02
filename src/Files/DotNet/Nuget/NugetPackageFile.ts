import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from "../../FileBaseKind";
import { ProjectParser } from '../../../Parsers/ProjectParser';
import { FilePathParser } from '../../../Parsers/FilePathParser';
import { ProjectNugetPackageVersion } from './NugetPackageVersionFile';
const fs = require('fs');


export class ProjectNugetPackage extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly include: string,
        public readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.nugetPackage, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        // this.command = {
        //     "command": "dotnet-solution-explorer.openFile",
        //     "title": "open",
        //     "arguments": [uri]
        // };
    }

    public static async createAsync(absolutePath: string, filename: string, include: string, version: string, parent: FileBase): Promise<FileBase> {
        return new ProjectNugetPackage(absolutePath, filename, include, version, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            this.children.push(await ProjectNugetPackageVersion.createAsync(this.absolutePath, this.version, this.parent));

            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.nuget-package";
}

