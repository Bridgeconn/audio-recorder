import * as vscode from "vscode";

export class AudioPanel {
  public static currentPanel: AudioPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent();
  }

  private _getWebviewContent() {
    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scribe Audio</title>
        </head>
        <body>
          <h1>Welcome to Scribe Audio</h1>
        </body>
      </html>
    `;
  }

  public static render() {
    if (AudioPanel.currentPanel) {
        AudioPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("scribe-audio", "Scribe Audio", vscode.ViewColumn.One, {
        // Empty for now
      });

      AudioPanel.currentPanel = new AudioPanel(panel);
    }
  }

  public dispose() {
    AudioPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
