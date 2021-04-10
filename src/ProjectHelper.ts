import { hasUncaughtExceptionCaptureCallback } from "node:process";
import { DotNetProject } from "./DotNetProject";

export class ProjectHelper {
    constructor() { }

    public static createProject(exactSlnText: string, 
                                slnAbsolutePath: string, 
                                slnDisplayName: string)
        : DotNetProject {

            if(!exactSlnText) {
                throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
            }
            if(!slnAbsolutePath) {
                throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
            }
            if(!slnDisplayName) {
                throw new Error(`Argument passed to ${ProjectHelper.createProject.name}`);
            }
    }
}