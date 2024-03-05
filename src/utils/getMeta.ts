import * as vscode from "vscode";
import { storageKeys } from "../types/storage";

export async function getProjectMeta(context:vscode.ExtensionContext) {
  const workspaceRootUri = vscode.workspace.workspaceFolders?.[0].uri;
  if (!workspaceRootUri) {
    vscode.window.showErrorMessage("Workspace not opened");
    return;
  }

  const metaUri = vscode.Uri.joinPath(
    workspaceRootUri,
    "metadata.json"
  );
  // Storing theworkspace path globally
  context.workspaceState.update(storageKeys.workspaceDirectory, workspaceRootUri);
  console.log("getProjectMeta constructor :  ------ ", metaUri);

  const metaJson = await vscode.workspace.fs.readFile(metaUri);
  if (!metaJson) {
    vscode.window.showErrorMessage(
      "Versification not found. Please open valid audio workspace or creare new audio project"
    );
    return;
  }

  //   TODO : metadata need to be load on extension start and store in extension / workspace global store

  const parsedMeta = JSON.parse(metaJson.toString());

  return parsedMeta;
}
