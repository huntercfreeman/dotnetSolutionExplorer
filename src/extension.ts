import * as vscode from 'vscode';
import { CopyState } from './CopyState';
import { DotNetFile } from './DotNetFile';
import { DotNetPathHelper } from './DotNetPathHelper';
import { DotNetSolutionExplorerProvider } from './DotNetSolutionExplorerProvider';

const fs = require('fs');
const uuidv4 = require("uuid/v4")

export function activate(context: vscode.ExtensionContext) {
	let clipboard: CopyState = new CopyState();

	let workspaceFolderAbsolutePath;

	let workspaceFolderFsPaths = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath);

	if (workspaceFolderFsPaths === null ||
		workspaceFolderFsPaths === undefined ||
		workspaceFolderFsPaths.length === 0) {
	}
	else {
		workspaceFolderAbsolutePath = workspaceFolderFsPaths[0];
	}

	let solutionExplorerProvider: DotNetSolutionExplorerProvider = new DotNetSolutionExplorerProvider(workspaceFolderAbsolutePath ?? "");

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'dotnetSolutionExplorer',
			solutionExplorerProvider
		),
		vscode.commands.registerCommand('dotnet-solution-explorer.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from dotnet Solution Explorer!');
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.refreshEntry', (e: any) =>
			solutionExplorerProvider.refresh(e)
		),
		vscode.commands.registerCommand('dotnet-solution-explorer.copy', (data: DotNetFile) => {
			clipboard.copy(data.absolutePath);
			vscode.window.showInformationMessage(`Copied: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.cut', (data: DotNetFile) => {
			clipboard.copy(data.absolutePath);
			vscode.window.showInformationMessage(`Copied: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.delete', (data: DotNetFile) => {
			clipboard.copy(data.absolutePath);
			vscode.window.showInformationMessage(`Copied: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.paste', async (data: DotNetFile) => {
			let clipboardObject: any = clipboard.readClipboard();

			let clipboardItemFileName: string = DotNetPathHelper.extractFileName(clipboardObject.absolutePath);

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = DotNetPathHelper.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let siblingFiles: string[] = fs.readdirSync();

			let uniqueAbsolutePathForCopy: string | undefined;

			if (!siblingFiles.includes(clipboardItemFileName)) {
				uniqueAbsolutePathForCopy = absolutePathToAddFileTo +
											clipboardItemFileName;
			}
			else {
				uniqueAbsolutePathForCopy = absolutePathToAddFileTo +
				clipboardItemFileName +
				"_copy-" +
				uuidv4();
			}


			let absolutePath = clipboardObject.absolutePath;
			let wasCut = clipboardObject.wasCut;

			if (!absolutePath || absolutePath === "") {
				vscode.window.showInformationMessage("Clipboard is empty");
				return;
			}

			await fs.readFile(absolutePath, { "encoding": "UTF-8" }, async (err: any, data: any) => {
				await fs.writeFile(data.absolutePath, data, (err: any) => {
					if (err) {
						console.error(err);
						return vscode.window.showErrorMessage("Failed to paste " + data.absolutePath);
					}

					vscode.window.showInformationMessage("Pasted " + data.absolutePath);
				});
			});

			if (wasCut) {
				const edit = new vscode.WorkspaceEdit();

				let fileUri = vscode.Uri.file(absolutePath);

				edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

				await vscode.workspace.applyEdit(edit);
			}

			if (data.parent) {
				solutionExplorerProvider.refresh(data.parent);
			}
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

			if (data.filename.endsWith(".csproj")) {
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

			if (!filename) {
				return;
			}

			let fileTemplate = "";

			if (filename.endsWith(".razor")) {
				fileTemplate = razorMarkupFileTemplate(filename);
			}
			else if (filename.endsWith(".razor.cs")) {
				fileTemplate = razorCodebehindFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}
			else if (filename.endsWith(".cs")) {
				fileTemplate = csFileTemplate(filename, data.namespaceString ?? "NamespaceWasUndefined");
			}

			await fs.writeFile(absolutePathToAddFileTo + filename, fileTemplate, (err: any) => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage("Failed to create " + data);
				}

				vscode.window.showInformationMessage("Created " + data);
			});

			if (data) {
				solutionExplorerProvider.refresh(data);
			}
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addBlazorComponent', async (data: DotNetFile) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = DotNetPathHelper.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: "Enter component name no extension"
			};

			let componentName = await vscode.window.showInputBox(inputBoxOptions);

			if (!componentName) {
				return;
			}

			let fileTemplate = "";

			fileTemplate = razorMarkupFileTemplate(componentName);

			await fs.writeFile(absolutePathToAddFileTo + componentName + ".razor", fileTemplate, (err: any) => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage("Failed to create " + data);
				}

				vscode.window.showInformationMessage("Created " + data);
			});

			fileTemplate = razorCodebehindFileTemplate(componentName, data.namespaceString ?? "NamespaceWasUndefined");

			await fs.writeFile(absolutePathToAddFileTo + componentName + ".razor.cs", fileTemplate, (err: any) => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage("Failed to create " + data);
				}

				vscode.window.showInformationMessage("Created " + data);
			});

			if (data) {
				solutionExplorerProvider.refresh(data);
			}
		})
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