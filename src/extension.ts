import * as vscode from 'vscode';
import { DotNetSolutionExplorerProvider } from './DotNetSolutionExplorerProvider';

export function activate(context: vscode.ExtensionContext) {
	let workspaceFolderAbsolutePath;

	let workspaceFolderFsPaths = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath);

	if (workspaceFolderFsPaths === null ||
		workspaceFolderFsPaths === undefined ||
		workspaceFolderFsPaths.length === 0) {
	}
	else {
		workspaceFolderAbsolutePath = workspaceFolderFsPaths[0];
	}


	context.subscriptions.push(
		vscode.commands.registerCommand('dotnet-solution-explorer.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from dotnet Solution Explorer!');
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.openFile', (uri: vscode.Uri) => {
			let textDocumentShowOptions: vscode.TextDocumentShowOptions = {
                "preserveFocus": false,
                "preview": false,
                "viewColumn": vscode.ViewColumn.One
              };

              vscode.workspace.openTextDocument(uri.fsPath).then((a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, textDocumentShowOptions);
              }, (error: any) => {
                console.error(error);
                debugger;
              });
		}),
		vscode.window.registerTreeDataProvider(
			'dotnetSolutionExplorer',
			new DotNetSolutionExplorerProvider(workspaceFolderAbsolutePath ?? "")
		)
	);
}

export function deactivate() { }

// comment to ensure committed