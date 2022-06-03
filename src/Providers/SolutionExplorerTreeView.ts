import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileBase } from '../Files/FileBase';
import { FileBaseKind } from "../Files/FileBaseKind";
import { ProjectFile } from "../Files/DotNet/CSharp/ProjectFile";
import { SolutionFile } from "../Files/DotNet/SolutionFile";
import { SolutionParser, ISolutionHelper } from '../Parsers/SolutionParser';

export class SolutionExplorerTreeView implements vscode.TreeDataProvider<FileBase> {
    constructor(private workspaceAbsolutePath: string) { }

    private root: FileBase | undefined;
    private solutionHelper: ISolutionHelper | undefined;

    getTreeItem(element: FileBase): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FileBase): Thenable<FileBase[]> {
        if (!this.workspaceAbsolutePath) {
            vscode.window.showInformationMessage('No files in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve(element.getChildren());
        }
        else {
            return this.getRoot();
        }
    }

    public async getRoot(): Promise<FileBase[]> {
        if (this.root) { return [this.root]; }

        let solutions = await vscode.workspace.findFiles("**/*.sln");
        let slnPathObjects = solutions.map((x) => {
            let slnFsPath = x.fsPath.toString();

            // .substring(1) to remove leading file delimiter: '/' or '\\'
            let slnFilename: string = slnFsPath
                .replace(this.workspaceAbsolutePath, "")
                .substring(1);

            return {
                "absolutePath": slnFsPath,
                "filename": slnFilename
            };
        });

        if (slnPathObjects.length === 0) {
            vscode.window.showErrorMessage("No .sln files were found within workspace");

            return [];
        }

        slnPathObjects.sort((fileOne, fileTwo) => {
            return fileOne.filename.localeCompare(fileTwo.filename);
        });

        let selectedSolutionFilename = await vscode.window.showQuickPick(slnPathObjects.map(x => x.filename));

        if (selectedSolutionFilename) {
            let selectedSlnPathObject: any = slnPathObjects.find((x) => {
                return x.filename === selectedSolutionFilename;
            });

            if (!selectedSlnPathObject) {
                vscode.window.showErrorMessage("Could not find absolute path for chosen .sln filename");

                return [];
            }

            let selectedSolutionAbsolutePath = selectedSlnPathObject.absolutePath;

            let solutionHelperFactory = new SolutionParser();

            this.solutionHelper = await solutionHelperFactory.createSolutionHelperAsync(
                this.workspaceAbsolutePath, selectedSolutionAbsolutePath
            );

            this.root = await SolutionFile.createAsync(
                selectedSolutionAbsolutePath,
                this.solutionHelper.slnFileName
            );

            let children: FileBase[] = await this.root.getChildren();

            for (let i = 0; i < this.solutionHelper.dotNetProjects.length; i++) {
                let fileBaseProject: FileBase = await ProjectFile.createAsync(
                    this.solutionHelper.dotNetProjects[i].absolutePath,
                    this.solutionHelper.dotNetProjects[i].filenameNoExtension + ".csproj",
                    this.root
                );

                children.push(fileBaseProject);
            }

            children.sort((fileOne, fileTwo) => {
                return fileOne.filename.localeCompare(fileTwo.filename);
            });

            return [this.root];
        }
        else {
            vscode.window.showErrorMessage("Must provide an absolute path to a .sln within workspace");
            return [];
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<FileBase | undefined | null | void> = new vscode.EventEmitter<FileBase | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FileBase | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(e: FileBase | undefined): void {
        if (e) {
            if(e.fileBaseKind !== FileBaseKind.sln) {
                e.overwriteChildren(undefined);
            }
            else {
                this.root = undefined;
                this.getRoot();    
            }
        }
        else {
            this.root = undefined;
            this.getRoot();
        }

        this._onDidChangeTreeData.fire();
    }
    
    public fireOnDidChangeTreeData(): void {
        this._onDidChangeTreeData.fire();
    }
}