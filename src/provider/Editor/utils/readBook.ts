import * as vscode from 'vscode';
const grammar = require('usfm-grammar');

export async function readUsfm(book: string) {
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
    const fileExists = await vscode.workspace.fs.stat(projectMetadataPath).then(
      () => true,
      () => false,
    );
    if (!fileExists) {
      return undefined;
    }

    const usfm = await vscode.workspace.fs.readFile(projectMetadataPath);

    const myUsfmParser = new grammar.USFMParser(
      usfm.toString(),
      grammar.LEVEL.RELAXED,
    );

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
