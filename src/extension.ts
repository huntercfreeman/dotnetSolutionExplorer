import * as vscode from 'vscode';
import { DotNetSolutionExplorerProvider } from './DotNetSolutionExplorerProvider';

const fs = require('fs');

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
		vscode.commands.registerCommand('dotnet-solution-explorer.addFile', async (data: any) => {

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: "Enter filename with extension"
			};

			let filename = await vscode.window.showInputBox(inputBoxOptions);

			if(!filename) {
				return;
			}

			let fileTemplate;

			if(filename.endsWith(".razor")) {
				fileTemplate = razorMarkupFileTemplate(filename);
			}

			await fs.writeFile(data, "hello world!", (err: any) => {
                if (err) {
                  console.error(err);
                  return vscode.window.showErrorMessage("Failed to create " + data);
                }

                vscode.window.showInformationMessage("Created " + data);
              });
		}),
		vscode.window.registerTreeDataProvider(
			'dotnetSolutionExplorer',
			new DotNetSolutionExplorerProvider(workspaceFolderAbsolutePath ?? "")
		)
	);
}

export function deactivate() { }

function razorMarkupFileTemplate(filename: string): string {
	return `<h3>${filename.replace(".razor", "")}</h3>

	@code {
	
	}
`;
}

function razorCodebehindFileTemplate(filename: string, namespace: string): string {
	return `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ${namespace}
{
    public class ${filename.replace(".razor.cs", "")} : ComponentBase
    {
    }
}

`;
}