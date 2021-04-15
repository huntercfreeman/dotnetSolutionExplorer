import * as vscode from 'vscode';
import { DotNetPathHelper } from './DotNetPathHelper';
import { DotNetFileTxt } from './DotNetFileTxt';
import { DotNetFile, DotNetFileKind } from './DotNetFile';
import { DotNetFileFactory } from './DotNetFileFactory';

const fs = require('fs');

export class DotNetFileHelper {
    private constructor() { }

    public static organizeContainer(dotNetFiles: DotNetFile[]): DotNetFile[] {
        let csFiles: DotNetFile[] = [],
            cssFiles: DotNetFile[] = [],
            dirFiles: DotNetFile[] = [],
            jsonFiles: DotNetFile[] = [],
            csprojFiles: DotNetFile[] = [],
            razorFiles: DotNetFile[] = [],
            slnFiles: DotNetFile[] = [],
            projectDependencies: DotNetFile[] = [],
            txtFiles: DotNetFile[] = [];

        let unrecognizedFiles: DotNetFile[] = [];

        let organizedFiles: DotNetFile[] = [];

        for (let i = 0; i < dotNetFiles.length; i++) {
            let currentFile = dotNetFiles[i];

            switch (currentFile.dotNetFileKind) {
                case DotNetFileKind.dir:
                    dirFiles.push(currentFile);
                    break;
                case DotNetFileKind.projectDependencies:
                    projectDependencies.push(currentFile);
                    break;
                // case DotNetFileKind.cs:
                //     csFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.css:
                //     cssFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.json:
                //     jsonFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.csproj:
                //     csprojFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.razor:
                //     razorFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.sln:
                //     slnFiles.push(currentFile);
                //     break;
                // case DotNetFileKind.txt:
                //     txtFiles.push(currentFile);
                //     break;
                default:
                    unrecognizedFiles.push(currentFile);
                    break;
            }
        }

        unrecognizedFiles.sort();

        organizedFiles = organizedFiles
            .concat(projectDependencies)
            .concat(dirFiles)
            .concat(unrecognizedFiles);
        // .concat(csFiles)
        // .concat(cssFiles)
        // .concat(jsonFiles)
        // .concat(csprojFiles)
        // .concat(razorFiles)
        // .concat(slnFiles)
        // .concat(txtFiles);

        return organizedFiles;
    }
}
