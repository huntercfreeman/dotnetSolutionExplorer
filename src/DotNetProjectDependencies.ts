import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';
import { DotNetFileHelper } from './DotNetFileHelper';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetPathHelper } from './DotNetPathHelper';
import { ProjectHelper } from './ProjectHelper';

const fs = require('fs');

export class DotNetProjectDependencies extends DotNetFile {
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

        if (parent && parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename;
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectDependencies(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return this.children;
        }
        else {
            this.children = [];

            if(this.absolutePath.endsWith(".csproj")) {
                let analyzers = await DotNetProjectAnaylzerList.createAsync(this.absolutePath, "Analyzers", this);
                let frameworks = await DotNetProjectFrameworkList.createAsync(this.absolutePath, "Frameworks", this);
                let packages = await DotNetProjectPackageList.createAsync(this.absolutePath, "Packages", this);
                let projects = await DotNetProjectReferenceList.createAsync(this.absolutePath, "Projects", this);

                this.children.push(analyzers);
                this.children.push(frameworks);
                this.children.push(packages);
                this.children.push(projects);
            }

            return this.children;
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }

    contextValue = "dotnet-solution-explorer.project-dependencies";
}

export class DotNetProjectFrameworkList extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectFrameworkList(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

export class DotNetProjectAnaylzerList extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectAnaylzerList(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

export class DotNetProjectPackageList extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectPackageList(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
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

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

export class DotNetProjectReferenceList extends DotNetFile {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: DotNetFile
    ) {
        super(absolutePath, filename, collapsibleState, DotNetFileKind.txt, parent);

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };

        this.command = {
            "command": "dotnet-solution-explorer.openFile",
            "title": "open",
            "arguments": [uri]
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: DotNetFile): Promise<DotNetFile> {
        return new DotNetProjectReferenceList(absolutePath, filename, vscode.TreeItemCollapsibleState.None, parent);
    }

    public async getChildren(): Promise<DotNetFile[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            let projectFileContents: string = fs.readFileSync(this.absolutePath, { "encoding": "UTF-8" });

            let projectReferences: string[] = ProjectHelper.extractProjectReferences(projectFileContents);
            projectReferences = projectReferences.map(projectReference => {
                var startOfAbsolutePath = projectReference.indexOf('\"');

                let position: number = startOfAbsolutePath + 1;

                let isolatedAbsolutePath = "";

                while (position < projectReference.length && projectReference[position] !== '\"') {
                    isolatedAbsolutePath += projectReference[position++];
                }

                return isolatedAbsolutePath;
            });

            this.children = [];

            for (let i = 0; i < projectReferences.length; i++) {
                let dotNetFile: DotNetFile = await DotNetProjectDependencies.createAsync(projectReferences[i], DotNetPathHelper.extractFileName(projectReferences[i]), this);

                this.children.push(dotNetFile);
            }

            await this.tryOrphanChildren();

            this.children = DotNetFileHelper.organizeContainer(this.children);

            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

