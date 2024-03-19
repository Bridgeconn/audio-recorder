import * as vscode from 'vscode';

export const getWorkSpaceFolder = (): string | undefined => {
  // Generic function to get the workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : null;
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace found');
    return;
  }
  return workspaceFolder;
};

// function to trigger select workspace folder from explorer and return workspace folder
export async function openWorkspace() {
  let workspaceFolder;
  const openFolder = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Choose audio project folder',
  });

  if (openFolder && openFolder.length > 0) {
    await vscode.commands.executeCommand(
      'vscode.openFolder',
      openFolder[0],
      false,
    );
    workspaceFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined;
  }

  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace opened.');
    return;
  }
  return workspaceFolder;
}
