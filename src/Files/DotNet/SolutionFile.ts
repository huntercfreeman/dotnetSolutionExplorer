import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../FileBase';
import { FileBaseKind } from "../FileBaseKind";


export class SolutionFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.sln, parent);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'fileSolutionIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'fileSolutionIcon.svg')
        };
    }

    public static async createAsync(absolutePath: string, filename: string): Promise<FileBase> {
        return new SolutionFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];
            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.solution";
}
