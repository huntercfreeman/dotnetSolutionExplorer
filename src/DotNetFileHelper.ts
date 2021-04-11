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
            txtFiles: DotNetFile[] = [];

        let organizedFiles: DotNetFile[] = [];

        for (let i = 0; i < dotNetFiles.length; i++) {
            let currentFile = dotNetFiles[i];

            switch (currentFile.dotNetFileKind) {
                case DotNetFileKind.cs:
                    break;
                case DotNetFileKind.css:
                    break;
                case DotNetFileKind.dir:
                    break;
                case DotNetFileKind.json:
                    break;
                case DotNetFileKind.csproj:
                    break;
                case DotNetFileKind.razor:
                    break;
                case DotNetFileKind.sln:
                    break;
                case DotNetFileKind.txt:
                    break;
            }
        }
    }
}
