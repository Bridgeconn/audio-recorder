import * as vscode from "vscode";

export class ScribeAudioEditor {
  private panel: vscode.WebviewPanel | undefined;
  private static readonly viewType = "scribeAudioEditor";

  constructor(private readonly context: vscode.ExtensionContext) {
    // starting here
    console.log(
      "called Scribe Editor ============= 7777777777777777777777777777777"
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

    // // Load the HTML content of your custom audio editor UI
    // const htmlPath = vscode.Uri.file(
    //     path.join(this.context.extensionPath, 'path', 'to', 'your', 'audioEditor.html')
    // );
    // fs.readFile(htmlPath.fsPath, 'utf8', (err, data) => {
    //     if (!err && data) {
    //         this.panel.webview.html = data;
    //     } else {
    //         console.error('Error loading HTML content:', err);
    //     }
    // });

    // set UI here
    this.panel.webview.html = `<html><body><h1>Scribe Audio Editor</h1></body></html>`;

    // Dispose of the panel when it is closed
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
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
