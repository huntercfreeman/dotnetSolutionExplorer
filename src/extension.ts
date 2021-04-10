import * as vscode from 'vscode';
import { DotNetFile } from './DotNetFile';
import { DotNetPathHelper } from './DotNetPathHelper';
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
		vscode.commands.registerCommand('dotnet-solution-explorer.addFile', async (data: DotNetFile) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if(data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = DotNetPathHelper.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: "Enter filename with extension"
			};

			let filename = await vscode.window.showInputBox(inputBoxOptions);

			if(!filename) {
				return;
			}

			let fileTemplate = "";

			if(filename.endsWith(".razor")) {
				fileTemplate = razorMarkupFileTemplate(filename);
			}
			else if(filename.endsWith(".razor.cs")) {
				fileTemplate = razorCodebehindFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}
			else if(filename.endsWith(".cs")) {
				fileTemplate = csFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}

			await fs.writeFile(absolutePathToAddFileTo + filename, fileTemplate, (err: any) => {
                if (err) {
                  console.error(err);
                  return vscode.window.showErrorMessage("Failed to create " + data);
                }

                vscode.window.showInformationMessage("Created " + data);
              });
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addBlazorComponent', async (data: DotNetFile) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if(data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = DotNetPathHelper.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: "Enter filename with extension"
			};

			let filename = await vscode.window.showInputBox(inputBoxOptions);

			if(!filename) {
				return;
			}

			let fileTemplate = "";

			if(filename.endsWith(".razor")) {
				fileTemplate = razorMarkupFileTemplate(filename);
			}
			else if(filename.endsWith(".razor.cs")) {
				fileTemplate = razorCodebehindFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}
			else if(filename.endsWith(".cs")) {
				fileTemplate = csFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}

			await fs.writeFile(absolutePathToAddFileTo + filename, fileTemplate, (err: any) => {
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
using Microsoft.AspNetCore.Components;

namespace ${namespace}
{
    public partial class ${filename.replace(".razor.cs", "")} : ComponentBase
    {
    }
}

`;
}

function csFileTemplate(filename: string, namespace: string): string {
	return `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ${namespace}
{
    public class ${filename.replace(".cs", "")}
    {
    }
}

`;
}