import * as vscode from 'vscode';
import {
  IVersification,
  VersificationMaxVerseType,
} from '../../../types/versification';

export const getVersification = async (
  metadata: Record<string, any>,
): Promise<IVersification | undefined> => {
  let _currentVersification: IVersification = {
    mappedVerses: {},
    maxVerses: {},
  };

  const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri;
  if (!workspaceRootUri) {
    vscode.window.showErrorMessage('Workspace not opened');
    return;
  }

  const versificationUri = vscode.Uri.joinPath(
    workspaceRootUri,
    'audio',
    'ingredients',
    'versification.json',
  );

  const versificationJson =
    await vscode.workspace.fs.readFile(versificationUri);
  if (!versificationJson) {
    vscode.window.showErrorMessage(
      'Versification not found. Please open valid audio workspace or creare new audio project',
    );
    return;
  }

  const parsedVersification = JSON.parse(versificationJson.toString());

  const scope: Partial<VersificationMaxVerseType> =
    metadata?.type?.flavorType?.currentScope;

  if (parsedVersification && Object.keys(scope).length > 0) {
    Object.keys(scope).forEach((bookId) => {
      // assign scope - versification
      _currentVersification.maxVerses[
        bookId as keyof Partial<VersificationMaxVerseType>
      ] = parsedVersification.maxVerses[bookId];
      // assign scope - verse mapping
      _currentVersification.mappedVerses = parsedVersification.mappedVerses;
    });

    return _currentVersification;
  }

  return;
};
