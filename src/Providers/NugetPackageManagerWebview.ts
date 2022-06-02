import * as vscode from "vscode";
import { getNonce } from "../Utility/getNonce";
import { isDir } from "../Utility/isDir";
import { CrossWidgetCommunicationTest } from "../extension";

export class NugetPackageManagerWebview implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(
	  private readonly _extensionUri: vscode.Uri,
	  private readonly context: vscode.ExtensionContext,
	  private readonly crossWidgetCommunicationTest: CrossWidgetCommunicationTest
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
		  case "showMessage": {
			const y = await vscode.window.showInformationMessage(
			  `Cheese`);
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
		this.context.extensionUri, 'out/compiled', 'SolutionExplorer.js'));

		const nonce = getNonce();

	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
	  <script nonce="${nonce}">
		const tsVscode = acquireVsCodeApi();
	</script>
  </head>
  <body>
	  <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src; img-src https: data:; style-src 'unsafe-inline' ${
      webview.cspSource
    }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
            const tsvscode = acquireVsCodeApi();
            const crossWidgetCommunicationTest = ${this.crossWidgetCommunicationTest.numericValue};
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}