import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from "../../FileBaseKind";
import { FileFactory } from '../../../Factories/FileFactory';
import { DefaultFile } from '../../FileSystem/DefaultFile';
import { ProjectReferenceListFile } from './ProjectReferenceListFile';
import { ProjectFrameworkListFile } from './ProjectFrameworkListFile';
import { ProjectAnaylzerListFile } from './ProjectAnaylzerListFile';
import { NugetPackageListFile } from '../Nuget/NugetPackageListFile';

export class ProjectDependencyListFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent?: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.projectDependencies, parent);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileProjectDependenciesIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileProjectDependenciesIcon.svg')
        };

        if (parent && parent.namespaceString) {
            this.namespaceString = parent.namespaceString;
        }

        this.namespaceString += "." + filename;
    }

    public static async createAsync(absolutePath: string, filename: string, parent?: FileBase): Promise<FileBase> {
        return new ProjectDependencyListFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return this.children;
        }
        else {
            this.children = [];

            if(this.absolutePath.endsWith(".csproj")) {
                //let analyzers = await ProjectAnaylzerList.createAsync(this.absolutePath, "Analyzers", this);
                //let frameworks = await ProjectFrameworkList.createAsync(this.absolutePath, "Frameworks", this);
                let packages = await NugetPackageListFile.createAsync(this.absolutePath, "Packages", this);
                let projects = await ProjectReferenceListFile.createAsync(this.absolutePath, "Projects", this);

                //this.children.push(frameworks);
                //this.children.push(analyzers);
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


