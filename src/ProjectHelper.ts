import { hasUncaughtExceptionCaptureCallback } from "node:process";
import { DotNetProject } from "./DotNetProject";

export class ProjectHelper {
    constructor() { }

    private static position: number = 0;

    public static createProject(exactSlnText: string,
        slnAbsolutePath: string,
        slnDisplayName: string)
        : DotNetProject {

        if (!exactSlnText) {
            throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
        }
        if (!slnAbsolutePath) {
            throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
        }
        if (!slnDisplayName) {
            throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
        }

        this.position = 0;

        let idOne: string = this.extractIdOne(exactSlnText);
    }

    private static extractIdOne(exactSlnText: string): string {
        let idOne: string = "";
        let finished: boolean = false;

        while (!finished && _position < exactSlnText.Length) {
            char currentChar = exactSlnText[_position];

            switch (currentChar) {
                case '{':
                    _position++;
                    if (_position < exactSlnText.Length) {
                        currentChar = exactSlnText[_position];
                    }

                    while (currentChar != '}') {
                        idOne.Append(currentChar);
                        _position++;

                        if (_position < exactSlnText.Length) {
                            currentChar = exactSlnText[_position];
                        }
                    }

                    finished = true;
                    break;
                default:
                    _position++;
                    break;
            }
        }

        return Guid.Parse(idOne.ToString());
    }
}