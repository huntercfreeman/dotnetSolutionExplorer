export class NugetPackageManagerProvider {
    constructor() { }

    public getWebviewContent() {
        return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
          </head>
          <body>
            <button onclick="incrementCount()">
              Hello World!
            </button>
            <p id="counter">0</p>
            
            <script>
            let vscode;
                let count = 0;
            (function() {
                vscode = acquireVsCodeApi();
                const counter = document.getElementById('lines-of-code-counter');
            }())

                
                function incrementCount() {
                    count++;
                  
                  document.getElementById('counter').innerHTML = count;
                  vscode.postMessage({
                    command: 'increment',
                    text: 'Counter is at: ' + count
                })
                }
            </script>
          </body>
        </html>`;
    }
}