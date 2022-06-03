import * as vscode from 'vscode';
import { uuid } from 'uuidv4';
import { CopyState as ExtensionClipboardState } from './Models/CopyStateModel';
import { FileBase } from './Files/FileBase';
import { FilePathParser } from './Parsers/FilePathParser';
import { hasUncaughtExceptionCaptureCallback } from 'node:process';
import { normalize } from 'node:path';
import { SolutionFile } from './Files/DotNet/SolutionFile';
import { ProjectFile } from './Files/DotNet/CSharp/ProjectFile';
import { NugetPackageManagerWebview } from './Providers/NugetPackageManagerWebview';
import { SolutionExplorerControlsWebview } from './Providers/SolutionExplorerControlsWebview';
import { SolutionExplorerTreeView } from './Providers/SolutionExplorerTreeView';
import { razorMarkupFileTemplate } from './Templates/razorMarkupFileTemplate';
import { razorCodebehindFileTemplate } from './Templates/razorCodebehindFileTemplate';
import { csFileTemplate } from './Templates/csFileTemplate';
import { NugetPackageFile } from './Files/DotNet/Nuget/NugetPackageFile';

const fs = require('fs');

let displayIntegratedTerminalInformativeMessage = 1;
let displayIntegratedTerminalErrorMessage = 1;

export function activate(context: vscode.ExtensionContext) {
	const extensionClipboardState: ExtensionClipboardState = constructExtensionClipboardState(context);
	const solutionExplorerTreeView: SolutionExplorerTreeView = constructSolutionExplorerTreeView(context);
	const nugetPackageManagerWebview: NugetPackageManagerWebview = constructAndRegisterNugetPackageManagerWebview(context, solutionExplorerTreeView);
	const solutionExplorerControlsWebview: SolutionExplorerControlsWebview = constructAndRegisterSolutionExplorerControlsWebview(context, solutionExplorerTreeView);
	
	context.subscriptions.push(
		
		vscode.commands.registerCommand('dotnet-solution-explorer.addNugetPackage', () => {
			vscode.window.showInputBox();
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.removeProject', async (data: ProjectFile) => {
			if (!data.parent) {
				vscode.window.showErrorMessage("ERROR: FileBaseProject's parent was null. Could not find .sln absolute path.");
				return;
			}

			let slnNormalizedAbsolutePath = data.parent.absolutePath.replace(/\\/g, "/");
			let projectNormalizedAbsolutePath = data.absolutePath.replace(/\\/g, "/");

			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: `Enter '[y]es' to remove ${data.filename} from the .sln`
			};

			let inputBoxResponse = await vscode.window.showInputBox(inputBoxOptions);

			if (userAgreed(inputBoxResponse)) {
				let cmd = `dotnet sln ${slnNormalizedAbsolutePath} remove ${projectNormalizedAbsolutePath}`;

				showUserCommand(cmd);
			}
			else {
				vscode.window.showInformationMessage('Action was cancelled by user');
			}
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.newProject', async (sln: SolutionFile) => {
			let slnNormalizedAbsolutePath = sln.absolutePath.replace(/\\/g, "/");

			let templateInputOptions: vscode.InputBoxOptions = {
				"placeHolder": "Enter template (Example: 'blazorserver')"
			};
			let selectedTemplate = await vscode.window.showInputBox(templateInputOptions);

			let projectNameOptions: vscode.InputBoxOptions = {
				"placeHolder": "Enter project name (Example: 'MyProject')"
			};
			let projectName = await vscode.window.showInputBox(projectNameOptions);

			let cmd = `dotnet new ${selectedTemplate} -o ${projectName} && `;
			cmd += `dotnet sln ${slnNormalizedAbsolutePath} add ${projectName}`;

			showUserCommand(cmd);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addExistingProject', async (sln: SolutionFile) => {
			let slnNormalizedAbsolutePath = sln.absolutePath.replace(/\\/g, "/");

			let chosenFile: vscode.Uri[] | undefined = await vscode.window.showOpenDialog();

			if (!chosenFile || chosenFile.length > 1 || !chosenFile[0].fsPath.endsWith(".csproj")) {
				vscode.window.showErrorMessage("ERROR: User did not select a valid file");
				return;
			}

			let referenceNormalizedAbsolutePath = chosenFile[0].fsPath.replace(/\\/g, "/");

			let cmd = `dotnet sln ${slnNormalizedAbsolutePath} add ${referenceNormalizedAbsolutePath}`;

			showUserCommand(cmd);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.removeProjectReference', (data: FileBase) => {
			if (data.parent) {
				let projectNormalizedAbsolutePath = data.parent.absolutePath.replace(/\\/g, "/");
				let referenceNormalizedAbsolutePath = data.absolutePath.replace(/\\/g, "/");

				let cmd = `dotnet remove ${projectNormalizedAbsolutePath} reference ${referenceNormalizedAbsolutePath}`;

				showUserCommand(cmd);
			}
			else {
				vscode.window.showErrorMessage("ERROR: The absolute path of the .csproj could not be found.");
			}
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addProjectReference', async (data: FileBase) => {
			let projectNormalizedAbsolutePath = data.absolutePath.replace(/\\/g, "/");

			let chosenFile: vscode.Uri[] | undefined = await vscode.window.showOpenDialog();

			if (!chosenFile || chosenFile.length > 1) {
				vscode.window.showErrorMessage("ERROR: User did not select a valid file");
				return;
			}

			let referenceNormalizedAbsolutePath = chosenFile[0].fsPath.replace(/\\/g, "/");

			let cmd = `dotnet add ${projectNormalizedAbsolutePath} reference ${referenceNormalizedAbsolutePath}`;

			showUserCommand(cmd);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.removeNugetPackageReference', async (data: NugetPackageFile) => {
			var project = data.parent?.parent?.parent;
			
			if(!project) {
				vscode.window.showErrorMessage(`Could not remove nuget package ${data.filename}`);
			}

			let projectNormalizedAbsolutePath = project!.absolutePath.replace(/\\/g, "/");

			let cmd = `dotnet remove ${projectNormalizedAbsolutePath} package ${data.filename}`;

			showUserCommand(cmd);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.refreshEntry', (e: any) =>
			solutionExplorerTreeView.refresh(e)
		),
		vscode.commands.registerCommand('dotnet-solution-explorer.addDirectory', async (data: FileBase) => {
			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = FilePathParser.extractFileDelimiter(data.absolutePath);
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

			solutionExplorerTreeView.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.copy', (data: FileBase) => {
			extensionClipboardState.copy(data.absolutePath);
			vscode.window.showInformationMessage(`Copied: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.cut', (data: FileBase) => {
			extensionClipboardState.cut(data.absolutePath);
			vscode.window.showInformationMessage(`Cut: ${data.absolutePath} to virtual clipboard`);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.deleteFile', async (data: FileBase) => { 
			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: `Enter '[y]es' to DELETE ${data.filename} from the filesystem`
			};

			let inputBoxResponse = await vscode.window.showInputBox(inputBoxOptions);

			if (userAgreed(inputBoxResponse)) {
				deleteFile(data, solutionExplorerTreeView);
			}
			else {
				vscode.window.showInformationMessage('DELETE Action was cancelled by user');
			}
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.deleteDirectory', async (data: FileBase) => {
			let inputBoxOptions: vscode.InputBoxOptions = {
				placeHolder: `Enter '[y]es' to DELETE ${data.filename} from the filesystem`
			};

			let inputBoxResponse = await vscode.window.showInputBox(inputBoxOptions);

			if (userAgreed(inputBoxResponse)) {
				const edit = new vscode.WorkspaceEdit();

				deleteFile(data, solutionExplorerTreeView);

				await vscode.workspace.applyEdit(edit);

				vscode.window.showInformationMessage(`Deleted: ${data.filename}`);

				if (data.parent) {
					solutionExplorerTreeView.refresh(data.parent);
				}
			}
			else {
				vscode.window.showInformationMessage('DELETE Action was cancelled by user');
			}
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.paste', async (data: FileBase) => {
			let clipboardObject: any = extensionClipboardState.readClipboard();

			let clipboardItemFileName: string = FilePathParser.extractFileName(clipboardObject.absolutePath);

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = FilePathParser.extractFileDelimiter(data.absolutePath);
				absolutePathToAddFileTo += fileDelimiter;
			}

			let siblingFiles: string[] = fs.readdirSync(absolutePathToAddFileTo);

			let uniqueAbsolutePathForCopy: string | undefined;

			if (!siblingFiles.includes(clipboardItemFileName)) {
				uniqueAbsolutePathForCopy = absolutePathToAddFileTo +
					clipboardItemFileName;
			}
			else {
				let extension = FilePathParser.extractExtension(clipboardItemFileName);

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

			solutionExplorerTreeView.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.openFile', (uri: vscode.Uri) => {
			let textDocumentShowOptions: vscode.TextDocumentShowOptions = {
				"preserveFocus": false,
				"preview": false,
				"viewColumn": vscode.ViewColumn.One
			};

			let normalizedPath;
			if (uri.scheme !== "file") {
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
		vscode.commands.registerCommand('dotnet-solution-explorer.addFile', async (data: FileBase) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = FilePathParser.extractFileDelimiter(data.absolutePath);
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

			solutionExplorerTreeView.refresh(data);
		}),
		vscode.commands.registerCommand('dotnet-solution-explorer.addBlazorComponent', async (data: FileBase) => {

			let absolutePathToAddFileTo: string = data.absolutePath;

			if (data.filename.endsWith(".csproj")) {
				absolutePathToAddFileTo = absolutePathToAddFileTo.replace(data.filename, "");
			}
			else {
				let fileDelimiter = FilePathParser.extractFileDelimiter(data.absolutePath);
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

			solutionExplorerTreeView.refresh(data);
		})
	);
}

export function deactivate() { }

export function showUserCommand(cmd: string): void {
	let activeTerminal: vscode.Terminal | undefined = vscode.window.activeTerminal;

	if (!activeTerminal) {
		let terminals = vscode.window.terminals;

		if (terminals.length !== 0) {
			activeTerminal = terminals[0];
		}
	}

	if (!activeTerminal) {
		if(displayIntegratedTerminalErrorMessage) {
			displayIntegratedTerminalErrorMessage--;
			vscode.window.showErrorMessage("Could not access an integrated terminal. " + 
			"Check the information message for the command to run it yourself in an external terminal. " +
			"This tutorial notification will only show once.");
		}

		vscode.window.showInformationMessage(cmd);
		return;
	}
	else {
		if(displayIntegratedTerminalInformativeMessage) {
			displayIntegratedTerminalInformativeMessage--;
			vscode.window.showInformationMessage("Integrated terminal input field had the command inserted into it. " +
			"This tutorial notification will only show once.");
		}

		activeTerminal.show();
		activeTerminal.sendText(cmd, false);
	}
}

async function deleteFile(data: FileBase, solutionExplorerProvider: SolutionExplorerTreeView): Promise<void> {
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

function constructSolutionExplorerTreeView(context: vscode.ExtensionContext): SolutionExplorerTreeView {
	let workspaceFolderAbsolutePath;

	let workspaceFolderFsPaths = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath);

	if (workspaceFolderFsPaths === null ||
		workspaceFolderFsPaths === undefined ||
		workspaceFolderFsPaths.length === 0) {
	}
	else {
		workspaceFolderAbsolutePath = workspaceFolderFsPaths[0];
	}

	const solutionExplorerTreeView = new SolutionExplorerTreeView(workspaceFolderAbsolutePath ?? "");

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'dotnetSolutionExplorer',
			solutionExplorerTreeView
		)
	);

	return solutionExplorerTreeView;
}

function constructAndRegisterNugetPackageManagerWebview(context: vscode.ExtensionContext,
		solutionExplorerTreeView: SolutionExplorerTreeView)
		: NugetPackageManagerWebview {
	const nugetPackageManagerProvider = 
		new NugetPackageManagerWebview(context.extensionUri, 
			context,
			solutionExplorerTreeView);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
		"dotnet-solution-explorer.webview",
		nugetPackageManagerProvider
		)
	);

	return nugetPackageManagerProvider;
}

function constructAndRegisterSolutionExplorerControlsWebview(context: vscode.ExtensionContext, 
															 solutionExplorerTreeView: SolutionExplorerTreeView)
															 : SolutionExplorerControlsWebview {
	const solutionExplorerControlsWebview = 
		new SolutionExplorerControlsWebview(context.extensionUri, 
			context,
			solutionExplorerTreeView);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
		"dotnet-solution-explorer.controls.webview",
		solutionExplorerControlsWebview
		)
	);

	return solutionExplorerControlsWebview;
}

function constructExtensionClipboardState(context: vscode.ExtensionContext): ExtensionClipboardState {
	const newLocal = new ExtensionClipboardState();
	
	return newLocal;
}

function userAgreed(inputBoxResponse: string | undefined): boolean {
	if(inputBoxResponse === undefined) {
		return false;
	}

	switch (inputBoxResponse) {
		case "yes":
		case "Yes":
		case "y":
		case "Y":
		case "[y]es":
		case "[Y]es":
			return true;
		default:
			return false;
	}
}

