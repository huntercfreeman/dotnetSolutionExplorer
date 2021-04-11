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

        if(currentChar() === '\0') {
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

    // public static GetUniqueAbsolutePathForCopy(clipboardItemAbsolutePath: string,
    //     pasteFolderAbsolutePath: string,
    //     siblingFiles: string[])
    //     : string
    // {
    //     let pasteFileAbsolutePath: string = pasteFolderAbsolutePath +
    //                                     this.extractFileDelimiter(pasteFolderAbsolutePath) +
    //                                     this.extractFileName(clipboardItemAbsolutePath);

    //     let reversedInsertionPointForUniqueness: number = pasteFileAbsolutePath
    //         .split("")
    //         .reverse()
    //         .indexOf(".");

    //     let normalizedInsertionPointForUniqueness: number = pasteFileAbsolutePath.length - 1
    //         - reversedInsertionPointForUniqueness;

    //     let uniquePastedFileAbsolutePathFormatter: string | undefined = undefined;

    //     let copiedFileExample: string = 
    //         string.Format(WellKnownValues.UniqueIdentifierFormatter, 0);

    //     bool isACopy = false;
    //     int positionInNewCopy = normalizedInsertionPointForUniqueness - 1;
    //     int positionInCopyExample = copiedFileExample.Length - 1;
    //     StringBuilder currentCopyIndexBuilder = new StringBuilder();

    //     while (positionInNewCopy >= 0 && positionInCopyExample >= 0)
    //     {
    //         if (pasteFileAbsolutePath[positionInNewCopy] == copiedFileExample[positionInCopyExample])
    //         {
    //             positionInNewCopy--;
    //             positionInCopyExample--;
    //         }
    //         else
    //         {
    //             if (copiedFileExample[positionInCopyExample] == '0')
    //             {
    //                 List<char> numbers = new List<char> { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

    //                 if (numbers.Contains(pasteFileAbsolutePath[positionInNewCopy]))
    //                 {
    //                     currentCopyIndexBuilder.Append(pasteFileAbsolutePath[positionInNewCopy]);

    //                     positionInNewCopy--;
    //                     positionInCopyExample--;

    //                     // for when " - Copy (0)." was found
    //                     // with the '0' being a wildcard
    //                     // value greater than 1 digits long (Ex. " - Copy (14).")
    //                     while (numbers.Contains(pasteFileAbsolutePath[positionInNewCopy]) &&
    //                            positionInNewCopy > 0)
    //                     {
    //                         currentCopyIndexBuilder.Insert(0, pasteFileAbsolutePath[positionInNewCopy]);

    //                         positionInNewCopy--;
    //                     }
    //                 }
    //             }
    //             else
    //             {
    //                 break;
    //             }
    //         }
    //     }

    //     // true means " - Copy (0)." was found
    //     // with the '0' being a wildcard
    //     if (positionInCopyExample == -1)
    //     {
    //         isACopy = true;
    //     }

    //     if (isACopy)
    //     {
    //         if (currentCopyIndexBuilder.Length == 0)
    //             currentCopyIndexBuilder.Append('0');

    //         uniquePastedFileAbsolutePathFormatter = pasteFileAbsolutePath.Replace($" - Copy ({currentCopyIndexBuilder})", "{0}");
    //     }
    //     else
    //     {
    //         uniquePastedFileAbsolutePathFormatter = pasteFileAbsolutePath
    //             .Insert(normalizedInsertionPointForUniqueness, "{0}");
    //     }

    //     int uniqueIdentifier = 0;
    //     string resultingUniqueAbsolutePath = null;

    //     while (uniqueIdentifier < 200)
    //     {
    //         string uniqueIdentifierFormatted =
    //                 string.Format(WellKnownValues.UniqueIdentifierFormatter, uniqueIdentifier);

    //         resultingUniqueAbsolutePath = string.Format(uniquePastedFileAbsolutePathFormatter,
    //             uniqueIdentifierFormatted);

    //         if (!siblingFiles.Contains(resultingUniqueAbsolutePath.ExtractFileName()))
    //         {
    //             break;
    //         }

    //         uniqueIdentifier++;
    //     }

    //     if (resultingUniqueAbsolutePath == null)
    //     {
    //         // if after iterating over 200 numbers
    //         // a unique value is still not found
    //         // return the file with a guid as the copy number
    //         return string.Format(uniquePastedFileAbsolutePathFormatter,
    //             string.Format(WellKnownValues.UniqueIdentifierFormatter, Guid.NewGuid()));
    //     }

    //     return resultingUniqueAbsolutePath;
    // }
}