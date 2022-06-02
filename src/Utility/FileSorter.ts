import * as vscode from 'vscode';
import { FilePathParser } from '../Parsers/FilePathParser';
import { DefaultFile } from '../Files/FileSystem/DefaultFile';
import { FileBase } from '../Files/FileBase';
import { FileBaseKind } from "../Files/FileBaseKind";
import { FileFactory } from '../Factories/FileFactory';

const fs = require('fs');

export class FileSorter {
    private constructor() { }

    public static organizeContainer(fileBases: FileBase[]): FileBase[] {
        let csFiles: FileBase[] = [],
            cssFiles: FileBase[] = [],
            dirFiles: FileBase[] = [],
            jsonFiles: FileBase[] = [],
            csprojFiles: FileBase[] = [],
            razorFiles: FileBase[] = [],
            slnFiles: FileBase[] = [],
            projectDependencies: FileBase[] = [],
            txtFiles: FileBase[] = [];

        let unrecognizedFiles: FileBase[] = [];

        let organizedFiles: FileBase[] = [];

        for (let i = 0; i < fileBases.length; i++) {
            let currentFile = fileBases[i];

            switch (currentFile.fileBaseKind) {
                case FileBaseKind.dir:
                    dirFiles.push(currentFile);
                    break;
                case FileBaseKind.projectDependencies:
                    projectDependencies.push(currentFile);
                    break;
                // case FileBaseKind.cs:
                //     csFiles.push(currentFile);
                //     break;
                // case FileBaseKind.css:
                //     cssFiles.push(currentFile);
                //     break;
                // case FileBaseKind.json:
                //     jsonFiles.push(currentFile);
                //     break;
                // case FileBaseKind.csproj:
                //     csprojFiles.push(currentFile);
                //     break;
                // case FileBaseKind.razor:
                //     razorFiles.push(currentFile);
                //     break;
                // case FileBaseKind.sln:
                //     slnFiles.push(currentFile);
                //     break;
                // case FileBaseKind.txt:
                //     txtFiles.push(currentFile);
                //     break;
                default:
                    unrecognizedFiles.push(currentFile);
                    break;
            }
        }

        projectDependencies.sort((fileOne, fileTwo) => {
            return fileOne.filename.localeCompare(fileTwo.filename);
        });
        unrecognizedFiles.sort((fileOne, fileTwo) => {
            return fileOne.filename.localeCompare(fileTwo.filename);
        });

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
