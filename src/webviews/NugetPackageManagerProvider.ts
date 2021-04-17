import * as vscode from 'vscode';

export class NugetPackageManagerProvider {
    constructor() {}

    public getWebviewContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
          </head>
          <body style="background-color: rgb(30, 30, 30);">
        
          </body>
        </html>`;
      }
}
