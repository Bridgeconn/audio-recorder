import * as vscode from 'vscode';
import { getWorkSpaceFolder } from './common';
import { storageKeys } from '../types/storage';
import { VersificationMaxVerseType } from '../types/versification';
const grammar = require('usfm-grammar');

// function - prompt to select USFM files
async function selectUSFM() {
	try {
		const options = {
			canSelectFolders: false,
			canSelectFiles: true,
			canSelectMany: true,
			filters: { USFM: ['usfm', 'USFM', 'sfm', 'SFM'] },
			openLabel: 'Select the Files to Import',
		};

		const result = await vscode.window.showOpenDialog(options);

		if (result && result.length > 0) {
			return result;
		} else {
			return;
		}
	} catch (error) {
		console.error('Error selecting usfm files:', error);
		return;
	}
}

export async function importUSFM(context: vscode.ExtensionContext) {
	let projectTargetPath: string | null = null;

	// check for project workspace
	const workspaceFolder = await getWorkSpaceFolder();
	if (!workspaceFolder) {
		vscode.window.showErrorMessage(
			'Workspace not found. please check your Audio Project is opened',
		);
		return;
	}
	const projectDir = await vscode.Uri.joinPath(
		vscode.Uri.parse(workspaceFolder),
		'text-1',
		'ingredients',
	);
	// Fetching the metadata from Global state
	const metadata: string = context.workspaceState.get(
		storageKeys.metadataJSON,
	);
	const metadataJson = JSON.parse(metadata);
	const scope: Partial<VersificationMaxVerseType> =
		metadataJson?.type?.flavorType?.currentScope;

	// prompt to select USFM files
	const usfmPaths = await selectUSFM();

	if (!usfmPaths) {
		vscode.window.showErrorMessage(
			"You haven't selected any USFM's . Import Process Cancelled",
		);
		return;
	}

	usfmPaths.forEach(async (usfmPath) => {
		const usfm = await vscode.workspace.fs.readFile(
			vscode.Uri.parse(usfmPath.fsPath),
		);

		const myUsfmParser = new grammar.USFMParser(
			usfm.toString(),
			grammar.LEVEL.RELAXED,
		);

		const isJsonValid = myUsfmParser.validate();
		if (isJsonValid) {
			const jsonOutput = myUsfmParser.toJSON();
			const bookId = Object.keys(scope).find(
				(value) => value === jsonOutput.book.bookCode,
			);

			if (!bookId) {
				vscode.window.showErrorMessage(
					`${jsonOutput.book.bookCode} - Book is not in the selected scope`,
				);
			} else {
				// check if dir exist
				const isDirExist = await vscode.workspace.fs
					.stat(projectDir)
					.then(
						() => true,
						() => false,
					);
				if (!isDirExist) {
					await vscode.workspace.fs.createDirectory(projectDir);
				}
				const usfmFile = await vscode.Uri.joinPath(
					projectDir,
					`${bookId}.usfm`,
				);
				vscode.workspace.fs.writeFile(usfmFile, usfm).then(() => {
					let globalUSFMcontent: string | undefined =
						context.workspaceState.get(
							storageKeys.loadedUSFMContent,
						);
					if (typeof globalUSFMcontent === 'string') {
						let globalUSFM = JSON.parse(globalUSFMcontent);
						globalUSFM[bookId] = jsonOutput.chapters;
						context.workspaceState.update(
							storageKeys.loadedUSFMContent,
							JSON.stringify(globalUSFM),
						);
					}

					vscode.window.showInformationMessage(
						`Imported USFM of Book -${bookId} successfully`,
					);
				});
			}
		} else {
			vscode.window.showErrorMessage(`USFM file ${usfmPath} is invalid`);
		}
	});
}
