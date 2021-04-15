import * as vscode from 'vscode';
import { uuid } from 'uuidv4';
import { CopyState } from './CopyState';
import { DotNetFile } from './DotNetFile';
import { DotNetPathHelper } from './DotNetPathHelper';
import { DotNetSolutionExplorerProvider } from './DotNetSolutionExplorerProvider';
import { hasUncaughtExceptionCaptureCallback } from 'node:process';
import { normalize } from 'node:path';

const fs = require('fs');

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
		vscode.commands.registerCommand('dotnet-solution-explorer.addDirectory', async (data: DotNetFile) => {
			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = DotNetPathHelper.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: "Enter directory name"
			};

			let filename = await vscode.window.showInputBox(inputBoxOptions);

			if (!filename) {
				return;
			}

			try {
				fs.mkdirSync(absolutePathToAddFileTo + filename);
				vscode.window.showInformationMessage("Added directory.");
			}
			catch {
				vscode.window.showErrorMessage("Could not add directory.");
			}

			solutionExplorerProvider.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.copy', (data: DotNetFile) => {
			clipboard.copy(data.absolutePath);
			vscode.window.showInformationMessage(`Copied: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.cut', (data: DotNetFile) => {
			clipboard.cut(data.absolutePath);
			vscode.window.showInformationMessage(`Cut: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.deleteFile', (data: DotNetFile) => deleteFile(data, solutionExplorerProvider)),
		vscode.commands.registerCommand('dotnet-solution-explorer.deleteDirectory', async (data: DotNetFile) => {
			const edit = new vscode.WorkspaceEdit();

			let fileUri = vscode.Uri.file(data.absolutePath);

			edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

			await vscode.workspace.applyEdit(edit);

			vscode.window.showInformationMessage(`Deleted: ${data.filename}`);

			if (data.parent) {
				solutionExplorerProvider.refresh(data.parent);
			}
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

			let siblingFiles: string[] = fs.readdirSync(absolutePathToAddFileTo);

			let uniqueAbsolutePathForCopy: string | undefined;

			if (!siblingFiles.includes(clipboardItemFileName)) {
				uniqueAbsolutePathForCopy = absolutePathToAddFileTo +
					clipboardItemFileName;
			}
			else {
				let extension = DotNetPathHelper.extractExtension(clipboardItemFileName);

				let filenameNoExtension = clipboardItemFileName.replace(extension, "");

				uniqueAbsolutePathForCopy = absolutePathToAddFileTo +
					filenameNoExtension +
					"_copy-" +
					uuid() +
					extension;
			}

			let absolutePath = clipboardObject.absolutePath;
			let wasCut = clipboardObject.wasCut;

			if (!absolutePath || absolutePath === "") {
				vscode.window.showInformationMessage("Clipboard is empty");
				return;
			}

			let fileContents = fs.readFileSync(absolutePath, { "encoding": "UTF-8" });

			fs.writeFileSync(uniqueAbsolutePathForCopy, fileContents);

			vscode.window.showInformationMessage("Pasted " + data.absolutePath);

			if (wasCut) {
				const edit = new vscode.WorkspaceEdit();

				let fileUri = vscode.Uri.file(clipboardObject.absolutePath);

				edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

				await vscode.workspace.applyEdit(edit);

				vscode.window.showInformationMessage(`Deleted: ${clipboardObject.filename}`);
			}

			solutionExplorerProvider.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.openFile', (uri: vscode.Uri) => {
			let textDocumentShowOptions: vscode.TextDocumentShowOptions = {
				"preserveFocus": false,
				"preview": false,
				"viewColumn": vscode.ViewColumn.One
			};

			let normalizedPath;
			if(uri.scheme !== "file") {
				normalizedPath = `${uri.scheme}:${uri.path}`;
			}
			else {
				normalizedPath = uri.path;
			}

			vscode.workspace.openTextDocument(normalizedPath).then((a: vscode.TextDocument) => {
				vscode.window.showTextDocument(a, textDocumentShowOptions);
			}, (error: any) => {
				console.error(error);
				debugger;
			});
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addFile', async (data: DotNetFile) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
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

				vscode.window.showInformationMessage("Created " + filename);
			});

			solutionExplorerProvider.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addBlazorComponent', async (data: DotNetFile) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
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
					return vscode.window.showErrorMessage("Failed to create " + componentName + ".razor");
				}

				vscode.window.showInformationMessage("Created " + componentName + ".razor");
			});

			fileTemplate = razorCodebehindFileTemplate(componentName, data.namespaceString ?? "NamespaceWasUndefined");

			await fs.writeFile(absolutePathToAddFileTo + componentName + ".razor.cs", fileTemplate, (err: any) => {
				if (err) {
					console.error(err);
					return vscode.window.showErrorMessage("Failed to create " + componentName + ".razor.cs");
				}

				vscode.window.showInformationMessage("Created " + componentName + ".razor.cs");
			});

			solutionExplorerProvider.refresh(data);
		})
	);
}

export function deactivate() { }

async function deleteFile(data: DotNetFile, solutionExplorerProvider: DotNetSolutionExplorerProvider): Promise<void> {
	let children = await data.getChildren();
	let childDeleteCounter: number = 0;

	const edit = new vscode.WorkspaceEdit();
	let fileUri = vscode.Uri.file(data.absolutePath);
	edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

	if (children && children.length > 0) {
		for (let i = 0; i < children.length; i++) {
			fileUri = vscode.Uri.file(children[i].absolutePath);
			edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });
			childDeleteCounter++;
			// await deleteFile(children[i], solutionExplorerProvider);
		}
	}

	await vscode.workspace.applyEdit(edit);

	vscode.window.showInformationMessage(`Deleted: ${data.filename} and ${childDeleteCounter} nested files.`);

	if (data.parent) {
		solutionExplorerProvider.refresh(data.parent);
	}

	return Promise.resolve();
}

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