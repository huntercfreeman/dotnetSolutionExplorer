import * as vscode from "vscode";
import { showUserCommand } from "../extension";
import { getNonce } from "../Utility/getNonce";
import { isDir } from "../Utility/isDir";
import { SolutionExplorerTreeView } from "./SolutionExplorerTreeView";

export class NugetPackageManagerWebview implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(
	  private readonly _extensionUri: vscode.Uri,
	  private readonly context: vscode.ExtensionContext,
	  private readonly solutionExplorerTreeView: SolutionExplorerTreeView
	  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "getProjects": {
          let solution = (await this.solutionExplorerTreeView.getChildren())[0];

          this.solutionExplorerTreeView.fireOnDidChangeTreeData();

          let projects = await solution.getChildren();

          webviewView.webview.postMessage({
            type: 'getProjects',
            projects: projects
                        .map(project => new ProjectDto(project.filename, project.absolutePath))
          });
          break;
        }
        case "addNugetPackage": {
          let projectNormalizedAbsolutePath = data.selectedProjectFile.absolutePath.replace(/\\/g, "/");

          let cmd = `dotnet add ${projectNormalizedAbsolutePath} package ${data.nugetPackage.title}`;

				  showUserCommand(cmd);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private getWebviewContent(webview: vscode.Webview) {
	const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
		this.context.extensionUri, 'out/compiled', 'NugetPackageManager.js'));

    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const dotNetSolutionExplorerUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "dotNetSolutionExplorer.css")
    );
    
		const nonce = getNonce();

	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>NugetPackageManagerWebview</title>
    <link href="${styleResetUri}" rel="stylesheet">
    <link href="${styleVSCodeUri}" rel="stylesheet">
    <link href="${dotNetSolutionExplorerUri}" rel="stylesheet">
	  <script nonce="${nonce}">
		const tsVscode = acquireVsCodeApi();
	</script>
  </head>
  <body>
	  <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;
  }
}

class ProjectDto {
  constructor(public filename: string, public absolutePath: string) { }
}