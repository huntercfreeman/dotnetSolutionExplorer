import * as vscode from 'vscode';
import * as path from 'path';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetProjectReferenceList } from './DotNetProjectReferenceList';
import { DotNetProjectFrameworkList } from './DotNetProjectFrameworkList';
import { DotNetProjectAnaylzerList } from './DotNetProjectAnaylzerList';
import { DotNetProjectPackageList } from './DotNetProjectPackageList';

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


