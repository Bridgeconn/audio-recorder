import * as vscode from 'vscode';
import { storageKeys } from '../../types/storage';
import { getNonce } from '../../utils/getNonce';
import { readUsfm } from './utils/readBook';
import { processTheChapter } from './utils/processChapter';
import {
  EditorToExtMSgType,
  EditorUItoExtMsg,
  ExttoEditorWebMsgTypes,
  IChapterdata,
  RecordTriggerData,
} from '../../types/editor';
import * as path from 'path';
import { startRecord, stopRecord } from './record';
const md5 = require('md5');
export class ScribeAudioEditor {
  private panel: vscode.WebviewPanel | undefined;
  private static readonly viewType = 'scribeAudioEditor';
  private readonly globalState: vscode.Memento;
  private readonly currentBC: { bookId: string; chapter: number };
  private loadedUSFMBookContent: Record<string, any>;
  private currentChapterVerses: IChapterdata[] | undefined;
  private readonly projectDirectory: vscode.Uri;
  private recordingProcess: any;
  private metadataJson: any;

  /**
   * Constructor
   */
  constructor(private readonly context: vscode.ExtensionContext) {
    // starting here
    this.globalState = context.workspaceState;
    this.currentBC = this.getGlobalState(storageKeys.currentBC);
    this.projectDirectory = this.getGlobalState(storageKeys.workspaceDirectory);
    this.loadedUSFMBookContent = this.getGlobalState(
      storageKeys.loadedUSFMContent,
    );
    this.metadataJson = this.getGlobalState(storageKeys.metadataJSON);
    this.metadataJson = JSON.parse(this.metadataJson);

    // parse if loadedUSFM have content
    if (
      this.loadedUSFMBookContent &&
      typeof this.loadedUSFMBookContent === 'string'
    ) {
      this.loadedUSFMBookContent = JSON.parse(this.loadedUSFMBookContent);
    }

    // Create and configure the webview panel
    this.panel = vscode.window.createWebviewPanel(
      ScribeAudioEditor.viewType,
      `${this.currentBC.bookId} - ${this.currentBC.chapter}`, // panel tab title
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'src')),
          vscode.Uri.file(
            path.join(
              vscode.workspace.workspaceFolders?.[0].uri.fsPath as string,
            ),
          ),
        ],
      },
    );

    // set UI here
    if (this.panel) {
      this.panel.webview.html = this.getHtmlForEditoPanel(this.panel.webview);

      // after panel init
      this.readData(this.currentBC.bookId, this.currentBC.chapter);

      /**
       * Handle recieve message from webview
       */
      this.panel.webview.onDidReceiveMessage(async (e: EditorUItoExtMsg) => {
        switch (e.type) {
          case EditorToExtMSgType.startRecord: {
            const { verse } = e.data as RecordTriggerData;
            const projectDir = await vscode.Uri.joinPath(
              this.projectDirectory,
              'audio',
              'ingredients',
              this.currentBC.bookId,
              this.currentBC.chapter.toString(),
            );
            const projectFileDir = await vscode.Uri.joinPath(
              projectDir,
              `${this.currentBC.chapter}_${verse}_1_default.wav`,
            );

            // check if dir exist
            const isDirExist = await vscode.workspace.fs.stat(projectDir).then(
              () => true,
              () => false,
            );
            if (!isDirExist) {
              await vscode.workspace.fs.createDirectory(projectDir);
            }

            this.recordingProcess = startRecord(
              projectFileDir.fsPath,
              this.currentBC.bookId,
              this.currentBC.chapter,
              verse,
              this.metadataJson?.identification?.name?.en ||
                "Scribe Extension's Project",
              this.metadataJson?.meta.generator.userName,
            );
            break;
          }

          case EditorToExtMSgType.stopRecord: {
            const { verse } = e.data as RecordTriggerData;
            stopRecord(this.recordingProcess);
            const audioFile = await vscode.Uri.joinPath(
              this.projectDirectory,
              'audio',
              'ingredients',
              this.currentBC.bookId,
              this.currentBC.chapter.toString(),
              `${this.currentBC.chapter}_${verse}_1_default.wav`,
            );
            // check if file recorded
            const isFileExist = await vscode.workspace.fs.stat(audioFile).then(
              (value) => value,
              () => false,
            );

            if (isFileExist && typeof isFileExist !== 'boolean') {
              const ingredient = await path.join(
                'audio',
                'ingredients',
                this.currentBC.bookId,
                this.currentBC.chapter.toString(),
                `${this.currentBC.chapter}_${verse}_1_default.wav`,
              );
              const file = await vscode.workspace.fs.readFile(audioFile);
              const metadata = this.getGlobalState(storageKeys.metadataJSON);
              let meta = JSON.parse(metadata);
              meta.ingredients[ingredient] = {
                checksum: { md5: md5(file) },
                mimeType: 'audio/wav',
                size: isFileExist?.size,
                scope: {},
              };

              meta.ingredients[ingredient].scope[this.currentBC.bookId] = [
                `${this.currentBC.chapter}:${verse}`,
              ];
              const metaFile = await vscode.Uri.joinPath(
                this.projectDirectory,
                'metadata.json',
              );
              const projectFileData = Buffer.from(
                JSON.stringify(meta, null, 4),
                'utf8',
              );
              this.updateGlobalState(
                storageKeys.metadataJSON,
                JSON.stringify(meta),
              );
              vscode.workspace.fs.writeFile(metaFile, projectFileData);
            }

            // after panel init
            this.readData(this.currentBC.bookId, this.currentBC.chapter);
            break;
          }

          case EditorToExtMSgType.deleteAudio: {
            const { verse } = e.data as RecordTriggerData;
            // deleteAudio(this.recordingProcess);
            const audioFile = await vscode.Uri.joinPath(
              this.projectDirectory,
              'audio',
              'ingredients',
              this.currentBC.bookId,
              this.currentBC.chapter.toString(),
              `${this.currentBC.chapter}_${verse}_1_default.wav`,
            );

            // Deleting the audio file
            await vscode.workspace.fs.delete(audioFile);

            // check if file recorded
            const isFileExist = await vscode.workspace.fs.stat(audioFile).then(
              () => true,
              () => false,
            );

            if (!isFileExist) {
              const ingredient = await path.join(
                'audio',
                'ingredients',
                this.currentBC.bookId,
                this.currentBC.chapter.toString(),
                `${this.currentBC.chapter}_${verse}_1_default.wav`,
              );
              const metadata = this.getGlobalState(storageKeys.metadataJSON);
              let meta = JSON.parse(metadata);

              delete meta.ingredients[ingredient];

              const metaFile = await vscode.Uri.joinPath(
                this.projectDirectory,
                'metadata.json',
              );
              const projectFileData = Buffer.from(
                JSON.stringify(meta, null, 4),
                'utf8',
              );
              this.updateGlobalState(
                storageKeys.metadataJSON,
                JSON.stringify(meta),
              );
              vscode.workspace.fs.writeFile(metaFile, projectFileData);
            }
            // after panel init
            this.readData(this.currentBC.bookId, this.currentBC.chapter);
            break;
          }

          default:
            break;
        }
      });
    }

    // Dispose of the panel when it is closed
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }
  /**
   * Send Message or event from EDITOR to Webview
   */
  private postMessage(webview: vscode.Webview, message: any) {
    webview.postMessage(message);
  }

  /**
   * Read the chapter content (USFM and Audio)
   */
  private async readData(book: string, chapter: number) {
    let versificationData;
    // read only once while changing book
    const usfmData =
      this.loadedUSFMBookContent && this.loadedUSFMBookContent[book]
        ? this.loadedUSFMBookContent[book]
        : await readUsfm(book);

    if (!usfmData) {
      const versification = this.getGlobalState(storageKeys.versification);
      const versificationJSON = JSON.parse(versification);
      versificationData = versificationJSON.maxVerses[book];
    } else {
      // store parsed data to resue
      if (!this.loadedUSFMBookContent?.[book]) {
        if (!this.loadedUSFMBookContent) {
          this.loadedUSFMBookContent = {};
        }
        this.loadedUSFMBookContent[book] = usfmData;
      }
      this.updateGlobalState(
        storageKeys.loadedUSFMContent,
        JSON.stringify(this.loadedUSFMBookContent),
      );
    }

    const chapterData = await processTheChapter(
      book,
      chapter,
      usfmData,
      versificationData,
      this.projectDirectory,
    );
    this.currentChapterVerses = chapterData;

    // conversion of path to webViewPath
    for (
      let index = 0;
      index < this.currentChapterVerses[0].contents.length;
      index++
    ) {
      const currentverseAudioObj =
        this.currentChapterVerses[0].contents[index].audio;
      if (currentverseAudioObj?.take1) {
        // currentverseAudioObj.take1 = audioBlob;
        currentverseAudioObj.take1 = await this.convertToAsWebViewUri(
          currentverseAudioObj.take1 as vscode.Uri,
        );
      }
      if (currentverseAudioObj?.take2) {
        currentverseAudioObj.take2 = await this.convertToAsWebViewUri(
          currentverseAudioObj.take2 as vscode.Uri,
        );
      }
      if (currentverseAudioObj?.take3) {
        currentverseAudioObj.take3 = await this.convertToAsWebViewUri(
          currentverseAudioObj.take3 as vscode.Uri,
        );
      }
    }

    // if (this.panel?.webview) {
    //   this.postMessage(this.panel?.webview, {
    //     type: ExttoEditorWebMsgTypes.ChapterData,
    //     data: this.currentChapterVerses,
    //   });
    // }
    if (this.panel?.webview) {
      setTimeout(() => {
        if (this.panel?.webview) {
          this.postMessage(this.panel?.webview, {
            type: ExttoEditorWebMsgTypes.ChapterData,
            data: {
              ChapterData: this.currentChapterVerses,
              scriptDirection:
                this.metadataJson?.languages?.[0]?.scriptDirection,
            },
          });
        }
      }, 500);
    }
    return chapterData;
  }

  // Method to update the global state
  public updateGlobalState(key: string, value: any) {
    this.globalState.update(key, value);
  }

  // Method to retrieve data from the global state
  public getGlobalState(key: string): any {
    return this.globalState.get(key);
  }

  /**
   * Public method to convert normal file uri to webview uri
   */
  public async convertToAsWebViewUri(url: vscode.Uri) {
    if (this.panel) {
      const webviewUri = this.panel.webview.asWebviewUri(url);
      return webviewUri.toString();
    }
    return undefined;
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
        'src',
        'webview-dist',
        'AudioEditorView',
        'index.js',
      ),
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        'src',
        'webview-dist',
        'AudioEditorView',
        'index.css',
      ),
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
            
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
