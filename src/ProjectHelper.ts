import { hasUncaughtExceptionCaptureCallback } from "node:process";
import { DotNetPathHelper } from "./DotNetPathHelper";
import { DotNetProject } from "./DotNetProject";

export class ProjectHelper {
    constructor() { }

    private static position: number = 0;

    public static createProject(exactSlnText: string,
        slnAbsolutePath: string,
        slnDisplayName: string)
        : DotNetProject {

        if (!exactSlnText) {
            throw new Error(`Argument was null in function ${ProjectHelper.createProject.name}, argument may have been exactSlnText`);
        }
        if (!slnAbsolutePath) {
            throw new Error(`Argument was null in function ${ProjectHelper.createProject.name}, argument may have been slnAbsolutePath`);
        }
        if (!slnDisplayName) {
            throw new Error(`Argument was null in function ${ProjectHelper.createProject.name}, argument may have been slnDisplayName`);
        }

        this.position = 0;

        let idOne: string = this.extractIdOne(exactSlnText);
        let filenameNoExtension: string = this.extractDisplayName(exactSlnText);
        let relativePathFromSln: string = this.extractFileName(exactSlnText);
        let idTwo: string = this.extractIdTwo(exactSlnText);

        let projectAbsolutePath: string = DotNetPathHelper.convertRelativePathFromAbsolutePathToAbsolutePath(
            slnAbsolutePath,
            relativePathFromSln)
            .replace("\\\\", "\\")
            .replace("//", "/");

            return new DotNetProject(
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

    private static extractIdTwo(exactSlnText: string): string
        {
            let idTwo: string = "";
            let finished: boolean = false;

            while (!finished && this.position < exactSlnText.length)
            {
                let currentChar: string = exactSlnText[this.position];

                switch (currentChar)
                {
                    case '{':
                        this.position++;
                        if (this.position < exactSlnText.length)
                        {
                            currentChar = exactSlnText[this.position];
                        }

                        while (currentChar !== '}')
                        {
                            idTwo += currentChar;
                            this.position++;

                            if (this.position < exactSlnText.length)
                            {
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
}