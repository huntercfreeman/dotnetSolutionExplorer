export class DotNetPathHelper {
    constructor() { }


    public static extractFileName(absolutePath: string): string {
        let reversedAbsolutePath = absolutePath
            .split("")
            .reverse()
            .join("");

        let position: number = 0;

        function currentChar(): string {
            return reversedAbsolutePath[position];
        }

        let fileName: string = "";

        // Directories end with the file delimiter
        // so we need to read it in and move
        // character by 1 index.
        if (position == 0 &&
            position < reversedAbsolutePath.length &&
            currentChar() == '/' ||
            currentChar() == '\\') {
            position++;
        }

        while (position < reversedAbsolutePath.length &&
            currentChar() != '/' &&
            currentChar() != '\\') {
            fileName = currentChar() + fileName;
            position++;
        }

        return fileName;
    }

    public static extractFileDelimiter(absolutePath: string): string {
        if(absolutePath.includes("\\")) {
            return "\\";
        }

        return "/";
    }

    public static convertRelativePathFromAbsolutePathToAbsolutePath(absolutePath: string, relativePathToAbsolutePath: string): string {
        var extractedFileNameFromAbsolutePath = this.extractFileName(absolutePath);

        if (!relativePathToAbsolutePath.startsWith("..")) {
            return absolutePath.replace(extractedFileNameFromAbsolutePath, relativePathToAbsolutePath);
        }

        let convertedRelativePathToAbsolutePathBuilder: string = absolutePath
            .replace(extractedFileNameFromAbsolutePath, "");

        while (relativePathToAbsolutePath.startsWith("..")) {
            while (convertedRelativePathToAbsolutePathBuilder.endsWith("\\")) {
                convertedRelativePathToAbsolutePathBuilder = convertedRelativePathToAbsolutePathBuilder.slice(0, convertedRelativePathToAbsolutePathBuilder.length - 1)
                    + convertedRelativePathToAbsolutePathBuilder.slice(convertedRelativePathToAbsolutePathBuilder.length);
            }

            while (convertedRelativePathToAbsolutePathBuilder.endsWith("/")) {
                convertedRelativePathToAbsolutePathBuilder = convertedRelativePathToAbsolutePathBuilder.slice(0, convertedRelativePathToAbsolutePathBuilder.length - 1)
                    + convertedRelativePathToAbsolutePathBuilder.slice(convertedRelativePathToAbsolutePathBuilder.length);
            }

            let currentFilename: string = this.extractFileName(convertedRelativePathToAbsolutePathBuilder);

            convertedRelativePathToAbsolutePathBuilder = convertedRelativePathToAbsolutePathBuilder
                .replace(currentFilename, "");

            relativePathToAbsolutePath = relativePathToAbsolutePath
                .replace("..", "");
        }

        return convertedRelativePathToAbsolutePathBuilder + relativePathToAbsolutePath;
    }
}