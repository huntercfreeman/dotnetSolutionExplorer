export class CSharpProjectModel {
    constructor(public idOne: string,
        public idTwo: string,
        public filenameNoExtension: string,
        public relativePathFromSln: string,
        public absolutePath: string
        ) { }
}