import * as vscode from "vscode";
import { storageKeys } from "../../types/storage";
import { getNonce } from "../../utils/getNonce";

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
      `${this.currentBC.bookId} - ${this.currentBC.chapter}`, // panel tab title
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
      }
    );

    // set UI here
    this.panel.webview.html = this.getHtmlForEditoPanel(this.panel.webview);

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

  /**
   * Function to get the html of the Webview
   */
  private getHtmlForEditoPanel(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "webview",
        "ui",
        "dist",
        "AudioEditorView",
        "index.js"
      )
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "webview",
        "ui",
        "dist",
        "AudioEditorView",
        "index.css"
      )
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <link href="${styleVSCodeUri}" rel="stylesheet" />
            
            <title>Scribe Audio Editor</title>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
    `;
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
