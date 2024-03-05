import * as vscode from 'vscode';
const grammar = require('usfm-grammar');

export async function readUsfm(book: string) {
	console.log('inside read usfm in util');

	// Book is \id - GEN in caps
	const workspaceFolder = vscode.workspace.workspaceFolders
		? vscode.workspace.workspaceFolders[0].uri
		: undefined;
	if (workspaceFolder) {
		const projectMetadataPath = vscode.Uri.joinPath(
			workspaceFolder,
			'text-1',
			'ingredients',
			`${book}.usfm`,
		);
		const fileExists = await vscode.workspace.fs
			.stat(projectMetadataPath)
			.then(
				() => true,
				() => false,
			);
		if (!fileExists) {
			return undefined;
		}
		console.log(
			'projectMetadata',
			projectMetadataPath,
			'fileExists',
			fileExists,
		);

		const usfm = await vscode.workspace.fs.readFile(projectMetadataPath);
		// console.log('usfm', usfm.toString());

		const myUsfmParser = new grammar.USFMParser(
			usfm.toString(),
			grammar.LEVEL.RELAXED,
		);
		// console.log('myUsfmParser', myUsfmParser);

		const isJsonValid = myUsfmParser.validate();
		if (isJsonValid) {
			const jsonOutput = myUsfmParser.toJSON();
			return jsonOutput.chapters;
		} else {
			vscode.window.showErrorMessage('USFM file is invalid');
			return undefined;
		}
	}
}
