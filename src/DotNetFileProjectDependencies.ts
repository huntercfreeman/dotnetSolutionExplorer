import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';
import { DotNetFileHelper } from './DotNetFileHelper';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetPathHelper } from './DotNetPathHelper';

const fs = require('fs');

export class DotNetFileProjectDependencies extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.dir, parent);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileProjectDependenciesIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileProjectDependenciesIcon.svg')
        };

        if(this.filename === "wwwroot") {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'fileWwwRootIcon.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileWwwRootIcon.svg')
            };
        }

        if (parent && parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename;
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        return new DotNetFileProjectDependencies(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return this.children;
        }
        else {
            let projectFiles = fs.readdirSync(this.absolutePath);

            this.children = [];

            for (let i = 0; i < projectFiles.length; i++) {
                let fileDelimiter: string = DotNetPathHelper.extractFileDelimiter(this.absolutePath);

                let dotNetFile: DotNetFile = await DotNetFileFactory.create(this.absolutePath + fileDelimiter + projectFiles[i], projectFiles[i], this);

                this.children.push(dotNetFile);
            }

            await this.tryOrphanChildren();

            this.children = DotNetFileHelper.organizeContainer(this.children);

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.project-dependencies";
}
