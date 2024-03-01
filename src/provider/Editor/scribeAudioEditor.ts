import * as vscode from "vscode";
import { storageKeys } from "../../types/storage";

export class ScribeAudioEditor {
  private panel: vscode.WebviewPanel | undefined;
  private static readonly viewType = "scribeAudioEditor";
  private readonly globalState: vscode.Memento;
  private readonly currentBC: { bookId: string; chapter: number };

  constructor(private readonly context: vscode.ExtensionContext) {
    // starting here
    this.globalState = context.globalState;
    this.currentBC = this.getGlobalState(storageKeys.currentBC);
    console.log(
      "called Scribe Editor ============= 7777777777777777777777777777777",
      this.globalState
    );

    // Create and configure the webview panel
    this.panel = vscode.window.createWebviewPanel(
      ScribeAudioEditor.viewType,
      "Scribe Audio Editor",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );

    // set UI here
    this.panel.webview.html = `<html><body><h1>Scribe Audio Editor : Book : ${this.currentBC.bookId} , Chapter : ${this.currentBC.chapter}</h1></body></html>`;

    // Dispose of the panel when it is closed
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  // Method to update the global state
  public updateGlobalState(key: string, value: any) {
    this.globalState.update(key, value);
  }

  // Method to retrieve data from the global state
  public getGlobalState(key: string): any {
    return this.globalState.get(key);
  }

  // Method to dispose the panel
  public dispose() {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
  }
}

export let scribeAudioEditorInstance: ScribeAudioEditor | undefined;

export async function initAudioEditor(context: vscode.ExtensionContext) {
  if (scribeAudioEditorInstance) {
    scribeAudioEditorInstance.dispose();
  }
  scribeAudioEditorInstance = new ScribeAudioEditor(context);
  return scribeAudioEditorInstance;
}
