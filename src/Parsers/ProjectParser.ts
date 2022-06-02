import * as vscode from 'vscode';
import { hasUncaughtExceptionCaptureCallback } from "node:process";
import { getVSCodeDownloadUrl } from "vscode-test/out/util";
import { FilePathParser } from "./FilePathParser";
import { CSharpProjectModel } from "../Models/CSharpProjectModel";

export class ProjectParser {
    constructor() { }

    private static position: number = 0;

    public static createProject(exactSlnText: string,
        slnAbsolutePath: string,
        slnDisplayName: string)
        : CSharpProjectModel {

        if (!exactSlnText) {
            throw new Error(`Argument was null in function ${ProjectParser.createProject.name}, argument may have been exactSlnText`);
        }
        if (!slnAbsolutePath) {
            throw new Error(`Argument was null in function ${ProjectParser.createProject.name}, argument may have been slnAbsolutePath`);
        }
        if (!slnDisplayName) {
            throw new Error(`Argument was null in function ${ProjectParser.createProject.name}, argument may have been slnDisplayName`);
        }

        this.position = 0;

        let idOne: string = this.extractIdOne(exactSlnText);
        let filenameNoExtension: string = this.extractDisplayName(exactSlnText);
        let relativePathFromSln: string = this.extractFileName(exactSlnText);
        let idTwo: string = this.extractIdTwo(exactSlnText);

        let projectAbsolutePath: string = FilePathParser.convertRelativePathFromAbsolutePathToAbsolutePath(
            slnAbsolutePath,
            relativePathFromSln)
            .replace("\\\\", "\\")
            .replace("//", "/");

        return new CSharpProjectModel(
            idOne,
            idTwo,
            filenameNoExtension,
            relativePathFromSln,
            projectAbsolutePath
        );
    }

    private static extractIdOne(exactSlnText: string): string {
        let idOne: string = "";
        let finished: boolean = false;

        while (!finished && this.position < exactSlnText.length) {
            let currentChar: string = exactSlnText[this.position];

            switch (currentChar) {
                case '{':
                    this.position++;
                    if (this.position < exactSlnText.length) {
                        currentChar = exactSlnText[this.position];
                    }

                    while (currentChar !== '}') {
                        idOne += currentChar;
                        this.position++;

                        if (this.position < exactSlnText.length) {
                            currentChar = exactSlnText[this.position];
                        }
                    }

                    finished = true;
                    break;
                default:
                    this.position++;
                    break;
            }
        }

        return idOne;
    }

    private static extractDisplayName(exactSlnText: string): string {
        let displayName: string = "";
        let finished: boolean = false;
        let seenEquals: boolean = false;

        while (!finished && this.position < exactSlnText.length) {
            let currentChar: string = exactSlnText[this.position];

            switch (currentChar) {
                case '\"':
                    if (seenEquals) {
                        this.position++;
                        if (this.position < exactSlnText.length) {
                            currentChar = exactSlnText[this.position];
                        }

                        while (currentChar !== '\"') {
                            displayName += currentChar;
                            this.position++;

                            if (this.position < exactSlnText.length) {
                                currentChar = exactSlnText[this.position];
                            }
                        }

                        finished = true;
                    }
                    else {
                        this.position++;
                    }
                    break;
                case '=':
                    seenEquals = true;
                    this.position++;

                    break;
                default:
                    this.position++;

                    break;
            }
        }

        return displayName;
    }

    private static extractFileName(exactSlnText: string): string {
        let fileName: string = "";
        let finished: boolean = false;
        let seenComma: boolean = false;

        while (!finished && this.position < exactSlnText.length) {
            let currentChar: string = exactSlnText[this.position];

            switch (currentChar) {
                case '\"':
                    if (seenComma) {
                        this.position++;
                        if (this.position < exactSlnText.length) {
                            currentChar = exactSlnText[this.position];
                        }

                        while (currentChar !== '\"') {
                            fileName += currentChar;
                            this.position++;

                            if (this.position < exactSlnText.length) {
                                currentChar = exactSlnText[this.position];
                            }
                        }

                        finished = true;
                    }
                    else {
                        this.position++;
                    }
                    break;
                case ',':
                    seenComma = true;
                    this.position++;

                    break;
                default:
                    this.position++;
                    break;
            }
        }

        return fileName;
    }

    private static extractIdTwo(exactSlnText: string): string {
        let idTwo: string = "";
        let finished: boolean = false;

        while (!finished && this.position < exactSlnText.length) {
            let currentChar: string = exactSlnText[this.position];

            switch (currentChar) {
                case '{':
                    this.position++;
                    if (this.position < exactSlnText.length) {
                        currentChar = exactSlnText[this.position];
                    }

                    while (currentChar !== '}') {
                        idTwo += currentChar;
                        this.position++;

                        if (this.position < exactSlnText.length) {
                            currentChar = exactSlnText[this.position];
                        }
                    }

                    finished = true;
                    break;
                default:
                    this.position++;
                    break;
            }
        }

        return idTwo;
    }

    public static extractProjectReferences(exactProjectText: string): string[] {
        let position: number = 0;

        let projectReferenceString = "ProjectReference";

        let peekSubstring = (peekToIndex: number) => {
            if (position >= exactProjectText.length) {
                return '\0';
            }

            if (peekToIndex > exactProjectText.length) {
                peekToIndex = exactProjectText.length;
            }

            return exactProjectText.substring(position, peekToIndex);
        };

        let currentChar = () => {
            return peekSubstring(position + 1);
        };

        let projectReferencesArray: string[] = [];

        while (currentChar() !== '\0') {
            switch (currentChar()) {
                case 'P':
                    let peekedString = peekSubstring(position + projectReferenceString.length);
                    if(peekedString === projectReferenceString)
                    {
                        position += projectReferenceString.length;
                        let projectReference: string = "";

                        while(peekSubstring(position + 2) !== '/>')
                        {
                            projectReference += currentChar();
                            position++;
                        }

                        projectReferencesArray.push(projectReference);
                    }
                    else
                    {
                        position += 1;
                    }
                    break;
                default:
                    position += 1;
                    break;
            }
        }

        return projectReferencesArray;
    }

    public static extractNugetPackageReferences(exactProjectText: string): string[] {
        let position: number = 0;

        let projectReferenceString = "PackageReference";

        let peekSubstring = (peekToIndex: number) => {
            if (position >= exactProjectText.length) {
                return '\0';
            }

            if (peekToIndex > exactProjectText.length) {
                peekToIndex = exactProjectText.length;
            }

            return exactProjectText.substring(position, peekToIndex);
        };

        let currentChar = () => {
            return peekSubstring(position + 1);
        };

        let projectReferencesArray: string[] = [];

        while (currentChar() !== '\0') {
            switch (currentChar()) {
                case 'P':
                    let peekedString = peekSubstring(position + projectReferenceString.length);
                    if(peekedString === projectReferenceString)
                    {
                        position += projectReferenceString.length;
                        let projectReference: string = "";

                        while(peekSubstring(position + 2) !== '/>')
                        {
                            projectReference += currentChar();
                            position++;
                        }

                        projectReferencesArray.push(projectReference);
                    }
                    else
                    {
                        position += 1;
                    }
                    break;
                default:
                    position += 1;
                    break;
            }
        }

        return projectReferencesArray;
    }
}