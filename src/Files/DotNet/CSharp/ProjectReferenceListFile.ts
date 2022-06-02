import * as vscode from 'vscode';
import * as path from 'path';
import { FileBase } from '../../FileBase';
import { FileBaseKind } from "../../FileBaseKind";
import { FileSorter } from '../../../Utility/FileSorter';
import { FilePathParser } from '../../../Parsers/FilePathParser';
import { ProjectParser } from '../../../Parsers/ProjectParser';
import { ProjectDependencyListFile } from './ProjectDependencyListFile';
import { ProjectReferenceFile } from './ProjectReferenceFile';

const fs = require('fs');

export class ProjectReferenceListFile extends FileBase {
    private constructor(
        public readonly absolutePath: string,
        public readonly filename: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: FileBase
    ) {
        super(absolutePath, filename, collapsibleState, FileBaseKind.referenceList, parent);

        this.contextValue = "dotnet-solution-explorer.project-reference-list";

        let uri: vscode.Uri = vscode.Uri.parse(absolutePath);

        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'light', 'fileTxtIcon.svg'),
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'dark', 'fileTxtIcon.svg')
        };
    }

    public static async createAsync(absolutePath: string, filename: string, parent: FileBase): Promise<FileBase> {
        return new ProjectReferenceListFile(absolutePath, filename, vscode.TreeItemCollapsibleState.Collapsed, parent);
    }

    public async getChildren(): Promise<FileBase[]> {
        if (this.children) {
            return Promise.resolve(this.children);
        }
        else {
            this.children = [];

            let projectFileContents: string = fs.readFileSync(this.absolutePath, { "encoding": "UTF-8" });

            let projectReferences: string[] = ProjectParser.extractProjectReferences(projectFileContents);
            
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
                let fileBase: FileBase = await ProjectReferenceFile.createAsync(projectReferences[i], 
                    FilePathParser.extractFileName(projectReferences[i]), this);

                this.children.push(fileBase);
            }

            await this.tryOrphanChildren();

            this.children = FileSorter.organizeContainer(this.children);

            return Promise.resolve(this.children);
        }
    }

    public tryFosterChildren(): Promise<void> {
        return Promise.resolve();
    }
}

