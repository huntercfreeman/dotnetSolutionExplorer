import * as vscode from "vscode";
import { getNonce } from "../Utility/getNonce";
import { isDir } from "../Utility/isDir";
import { SolutionExplorerTreeView } from "./SolutionExplorerTreeView";

export class SolutionExplorerControlsWebview implements vscode.WebviewViewProvider {
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
		  case "reloadTreeView": {
        this.solutionExplorerTreeView.refresh(undefined);
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
		this.context.extensionUri, 'out/compiled', 'SolutionExplorerControls.js'));

    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    
		const nonce = getNonce();

	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>SolutionExplorerControlsWebview</title>
    <link href="${styleResetUri}" rel="stylesheet">
    <link href="${styleVSCodeUri}" rel="stylesheet">
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