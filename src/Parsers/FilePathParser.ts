export class FilePathParser {
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
        if (position === 0 &&
            position < reversedAbsolutePath.length &&
            currentChar() === '/' ||
            currentChar() === '\\') {
            position++;
        }

        while (position < reversedAbsolutePath.length &&
            currentChar() !== '/' &&
            currentChar() !== '\\') {
            fileName = currentChar() + fileName;
            position++;
        }

        return fileName;
    }

    public static extractExtension(absolutePath: string): string {
        let reversedAbsolutePath = absolutePath
            .split("")
            .reverse()
            .join("");

        let position: number = 0;

        function currentChar(): string {
            if (position < reversedAbsolutePath.length) {
                return reversedAbsolutePath[position];
            }

            return '\0';
        }

        let extension: string = "";

        // Directories end with the file delimiter
        // so we need to read it in and move
        // character by 1 index.
        if (position === 0 &&
            position < reversedAbsolutePath.length &&
            currentChar() === '/' ||
            currentChar() === '\\') {
            position++;
        }

        while (position < reversedAbsolutePath.length &&
            currentChar() !== '.' &&
            currentChar() !== '\0') {
            extension = currentChar() + extension;
            position++;
        }

        if (currentChar() === '\0') {
            return "";
        }

        return "." + extension;
    }

    public static extractFileDelimiter(absolutePath: string): string {
        if (absolutePath.includes("\\")) {
            return "\\";
        }

        return "/";
    }

    public static convertRelativePathFromAbsolutePathToAbsolutePath(absolutePath: string, relativePathToAbsolutePath: string): string {

        if(this.extractFileDelimiter(absolutePath) === "/") {
            relativePathToAbsolutePath = relativePathToAbsolutePath.replace(/\\/g, "/");
        }

        // absolutePath: /home/hunter/Repos/TestProject/DeepTest/DeepSln/DeepSln.sln
        // relativePathToAbsolutePath: ../../MyBlazorServerApp/MyBlazorServerApp.csproj

        // resulting extractedFileNameFromAbsolutePath: DeepSln.sln
        var extractedFileNameFromAbsolutePath = this.extractFileName(absolutePath);

        // If simpler case
        if (!relativePathToAbsolutePath.startsWith("..")) {
            return absolutePath.replace(extractedFileNameFromAbsolutePath, relativePathToAbsolutePath);
        }

        // resulting fileDelimiter: '/'
        let fileDelimiter: string = this.extractFileDelimiter(absolutePath);

        // resulting convertedRelativePathToAbsolutePathBuilder: /home/hunter/Repos/TestProject/DeepTest/DeepSln
        let convertedRelativePathToAbsolutePathBuilder: string = absolutePath
            .replace(fileDelimiter + extractedFileNameFromAbsolutePath, "");


        let moveUpDirectoryCount = 0;

        let position: number = 0;

        let peekChar = (peek: number): string => {
            if ((position + peek) < relativePathToAbsolutePath.length &&
                position >= 0) {
                return relativePathToAbsolutePath[position + peek];
            }

            return '\0';
        };

        let currentChar = (): string => {
            return peekChar(0);
        };

        let relativePath: string = "";

        while (currentChar() !== '\0') {
            switch (currentChar()) {
                case ".":
                    if (peekChar(1) === '.') {
                        position += 2;
                        moveUpDirectoryCount++;
                    }
                    else {
                        position = Number.MAX_SAFE_INTEGER;
                        break;
                    }
                case "/":
                case "\\":
                    position += 1;
                    break;
                default:
                    relativePath = relativePathToAbsolutePath.substring(position);
                    position = Number.MAX_SAFE_INTEGER;
                    break;
            }
        }

        

        // reminder of convertedRelativePathToAbsolutePathBuilder: /home/hunter/Repos/TestProject/DeepTest/DeepSln

        let reversedPath = convertedRelativePathToAbsolutePathBuilder.split("").reverse();

        position = 0;

        peekChar = (peek: number): string => {
            if ((position + peek) < reversedPath.length &&
                position > 0) {
                return reversedPath[position + peek];
            }

            return '\0';
        };

        while (moveUpDirectoryCount > 0) {
            switch (currentChar()) {
                case "/":
                case "\\":
                    moveUpDirectoryCount -= 1;
                    position += 1;
                    break;
                default:
                    position += 1;
                    break;
            }
        }

        let path: string = reversedPath.join("").substring(position).split("").reverse().join("");

        return path + fileDelimiter + relativePath;
    }
}