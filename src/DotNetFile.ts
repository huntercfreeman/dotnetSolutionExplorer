import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetPathHelper } from './DotNetPathHelper';

const fs = require('fs');

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
}

export class DotNetFileTxt extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileTxt(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];
            return Promise.resolve(this.children);
        }
    }
}

export class DotNetFileSolution extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileSolution(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];
            return Promise.resolve(this.children);
        }
    }
}

export class DotNetFileProject extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(absolutePath, filename, collapsibleState);
    }

    public static createAsync(absolutePath: string, filename: string): DotNetFile {
        return new DotNetFileProject(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return this.children;
        }
        else {
            let containingFolder: string = this.absolutePath
                .replace(`/${this.filename}`, "")
                .replace(`\\${this.filename}`, "");

            let projectFiles = fs.readdirSync(containingFolder);

            this.children = [];

            for(let i = 0; i < projectFiles.length; i++) {
                let fileDelimiter: string = DotNetPathHelper.extractFileDelimiter(containingFolder);

                let dotNetFile: DotNetFile = DotNetFileTxt.createAsync(containingFolder + fileDelimiter + projectFiles[i], projectFiles[i]);

                this.children.push(dotNetFile);
            }

            return this.children;
        }
    }

    public test(err: any, data: any): void {
        console.log("true");
    }
}