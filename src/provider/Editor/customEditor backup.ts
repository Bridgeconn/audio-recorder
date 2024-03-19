// import * as vscode from "vscode";
// import { Disposable, disposeAll } from "./dispose";
// import documentData from "./audioEditorDocument";
// import {
//   ExtMessage,
//   ExtMessageType,
//   WebviewMessage,
//   WebviewMessageType,
// } from "../../types/message";
// import { getNonce } from "../../utils/getNonce";

// /**
//  * class tracks all the web views
//  */
// class WebviewCollection {
//   private readonly _webviews = new Set<{
//     readonly resource: string;
//     readonly webviewPanel: vscode.WebviewPanel;
//   }>();

//   /**
//    * Get all known webviews for a given uri.
//    * craete a generator function can provide added web views
//    */
//   public *get(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
//     const key = uri.toString();
//     for (const entry of this._webviews) {
//       if (entry.resource === key) {
//         yield entry.webviewPanel;
//       }
//     }
//   }

//   /**
//    * Add a new webview to the collection.
//    */
//   public add(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel) {
//     const entry = { resource: uri.toString(), webviewPanel };
//     this._webviews.add(entry);

//     webviewPanel.onDidDispose(() => {
//       this._webviews.delete(entry);
//     });
//   }
// }

// /**
//  * Audio Editor custom document type for editor
//  */
// class AudioEditorDocument extends Disposable implements vscode.CustomDocument {
//   static async create(
//     uri: vscode.Uri,
//     backupId: string | undefined
//   ): Promise<AudioEditorDocument | PromiseLike<AudioEditorDocument>> {
//     // If we have a backup, read that. Otherwise read the resource from the workspace
//     const dataFile =
//       typeof backupId === "string" ? vscode.Uri.parse(backupId) : uri;
//     const fileData = await AudioEditorDocument.readFile(dataFile);
//     try {
//       const decoder = await documentData.create(fileData);
//       return new AudioEditorDocument(uri, decoder);
//     } catch (err: any) {
//       vscode.window.showErrorMessage(err.message);
//       return new AudioEditorDocument(uri, undefined);
//     }
//   }

//   private static async readFile(uri: vscode.Uri): Promise<Uint8Array> {
//     if (uri.scheme === "untitled") {
//       return new Uint8Array();
//     }
//     return vscode.workspace.fs.readFile(uri);
//   }

//   private readonly _uri: vscode.Uri;
//   private _documentData: documentData;
//   private _fsWatcher: vscode.FileSystemWatcher;

//   private constructor(uri: vscode.Uri, initialContent: any) {
//     super();
//     this._uri = uri;
//     this._documentData = initialContent;
//     this._fsWatcher = vscode.workspace.createFileSystemWatcher(
//       uri.fsPath,
//       false,
//       false,
//       true
//     );
//     this.onDidChange = this._fsWatcher.onDidChange;
//   }

//   public get uri() {
//     return this._uri;
//   }

//   public onDidChange: vscode.Event<vscode.Uri>;

//   public async reload() {
//     const fileData = await AudioEditorDocument.readFile(this._uri);
//     try {
//       //   this._documentData.dispose();
//       this._documentData = await documentData.create(fileData);
//     } catch (err: any) {
//       vscode.window.showErrorMessage(err.message);
//       //   this._documentData = undefined;
//     }
//   }

//   private readonly _onDidDispose = this._register(
//     new vscode.EventEmitter<void>()
//   );
//   public readonly onDidDispose = this._onDidDispose.event;

//   /**
//    * Called by VS Code when there are no more references to the document.
//    *
//    * This happens when all editors for it have been closed.
//    */
//   dispose(): void {
//     this._onDidDispose.fire();
//     // this._documentData.dispose();
//     super.dispose();
//   }
// }

// /**
//  * Audio Editor Class
//  * handle custom document modal opening
//  */
// export class AudioEditorProvider
//   implements vscode.CustomReadonlyEditorProvider
// {
//   /**
//    * register custom editor provider
//    * pass view type (unique id) and context
//    */
//   public static register(context: vscode.ExtensionContext): vscode.Disposable {
//     return vscode.window.registerCustomEditorProvider(
//       AudioEditorProvider.viewType,
//       new AudioEditorProvider(context),
//       {
//         supportsMultipleEditorsPerDocument: false,
//         webviewOptions: {
//           retainContextWhenHidden: true,
//         },
//       }
//     );
//   }

//   private static readonly viewType = "scribe.scribeAudioEditor";

//   private readonly webviews = new WebviewCollection();

//   constructor(private readonly _context: vscode.ExtensionContext) {}

//   async openCustomDocument(
//     uri: vscode.Uri,
//     openContext: { backupId?: string },
//     _token: vscode.CancellationToken
//   ): Promise<AudioEditorDocument> {
//     console.log(
//       "in open  AudioEditorProvider.openCustomDocument ======= 1111111"
//     );

//     // Creating the document Type modal for the custom editor
//     const document: AudioEditorDocument = await AudioEditorDocument.create(
//       uri,
//       openContext.backupId
//     );

//     const listeners: vscode.Disposable[] = [];

//     // adding listners for the created document
//     listeners.push(
//       document.onDidChange(async (e) => {
//         await document.reload();
//         for (const webviewPanel of this.webviews.get(document.uri)) {
//           this.postMessage(webviewPanel.webview, {
//             type: ExtMessageType.Reload,
//           });
//         }
//       })
//     );

//     // on close the doc remove all the listners
//     document.onDidDispose(() => disposeAll(listeners));

//     return document;
//   }

//   /**
//    * init and load content in the custom editor webview created
//    */
//   async resolveCustomEditor(
//     document: AudioEditorDocument,
//     webviewPanel: vscode.WebviewPanel,
//     _token: vscode.CancellationToken
//   ): Promise<void> {
//     console.log("in resolveCustomEditor ============ 222222222222");

//     /**
//      * create a web view when a document is inited
//      * Add the webview to our internal set of active webviews
//      */
//     this.webviews.add(document.uri, webviewPanel);

//     // Setup initial content for the webview
//     webviewPanel.webview.options = {
//       enableScripts: true,
//     };

//     // setting up the html content for the generated webview
//     webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

//     // Wait for the webview to be properly ready before we init
//     webviewPanel.webview.onDidReceiveMessage((msg: WebviewMessage) => {
//       try {
//         this.onReceiveMessage(msg, webviewPanel, document);
//       } catch (err) {
//         vscode.window.showErrorMessage(err as unknown as string);
//       }
//     });
//   }

//   /**
//    * handle message - event message based on types
//    * On Recieve Event message from WebView to VsEditor extension
//    */
//   private onReceiveMessage(
//     msg: WebviewMessage,
//     webviewPanel: vscode.WebviewPanel,
//     document: AudioEditorDocument
//   ) {
//     console.log("msg type ready -------------------- 33333 : ", msg.type);
//     switch (msg.type) {
//       case WebviewMessageType.Ready:
//         break;

//       case WebviewMessageType.Error: {
//         vscode.window.showErrorMessage(msg.data.message);
//       }

//       default:
//         break;
//     }
//   }

//   /**
//    * Send Message or event from EDITOR to Webview
//    */
//   private postMessage(webview: vscode.Webview, message: ExtMessage) {
//     webview.postMessage(message);
//   }

//   /**
//    * Function to get the html of the Webview
//    */
//   private getHtmlForWebview(webview: vscode.Webview): string {
//     // Local path to script and css for the webview
//     const scriptUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(
//         this._context.extensionUri,
//         "src",
//         "webview",
//         "ui",
//         "dist",
//         "AudioEditorView",
//         "index.js"
//       )
//     );
//     const styleVSCodeUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(
//         this._context.extensionUri,
//         "src",
//         "webview",
//         "ui",
//         "dist",
//         "AudioEditorView",
//         "index.css"
//       )
//     );

//     // Use a nonce to whitelist which scripts can be run
//     const nonce = getNonce();

//     return /* html */ `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
            
//             <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
//             <link href="${styleVSCodeUri}" rel="stylesheet" />
            
//             <title>Scribe Audio Editor</title>
//         </head>
//         <body>
//             <div id="root"></div>
//             <script nonce="${nonce}" src="${scriptUri}"></script>
//         </body>
//         </html>
//     `;
//   }
// }
