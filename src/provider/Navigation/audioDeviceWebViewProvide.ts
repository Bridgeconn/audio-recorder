import * as vscode from 'vscode';
import * as os from 'os';
import { getNonce } from '../../utils/getNonce';
import {
  ExtToNavMsg,
  ExttoNavWebMsgTypes,
  NavWebToExtMsgTypes,
} from '../../types/navigationView';
import { getVersification } from './functions/getVersification';
import { getProjectMeta } from '../../utils/getMeta';
import { storageKeys } from '../../types/storage';
import { initializeStateStore } from '../../store/stateStore';
import { audioInputDevices } from '../Editor/audioInputDevices';

export class AudioDeviceWebViewProvide implements vscode.WebviewViewProvider {
  /**
   * register custom nav sidebar provider
   * pass view type (unique id) and context
   */
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerWebviewViewProvider(
      AudioDeviceWebViewProvide.viewType,
      new AudioDeviceWebViewProvide(context),
    );
  }

  private static readonly viewType = 'audio-devices-sidebar';

  private _webviewView: vscode.WebviewView | undefined;
  private _context: vscode.ExtensionContext;
  private _metadata: Record<string, any> | undefined;
  private readonly globalState: vscode.Memento;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this.globalState = context.workspaceState;
    this._registerCommands();
    this._getMetaData();
  }

  public async resolveWebviewView(
    webviewPanel: vscode.WebviewView,
    ctx: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    /**
     * Handle recieve message from webview
     */
    webviewPanel.webview.onDidReceiveMessage(
      async (e: { type: NavWebToExtMsgTypes; data: any }) => {
        switch (e.type) {
          case NavWebToExtMsgTypes.getDevices: {
            // TODO : Change the versifcation to constructor on load and keep the data in storage

            if (os.platform() !== 'linux') {
              await audioInputDevices((data) => {
                console.log('eturning data from inuut mic ==> ', data);
                console.log('devices---->', data);
                if (data) {
                  this.postMessage(webviewPanel.webview, {
                    type: ExttoNavWebMsgTypes.MicData,
                    data: { devices: data, platform: os.platform() },
                  });
                }
              });
            } else {
              this.postMessage(webviewPanel.webview, {
                type: ExttoNavWebMsgTypes.MicData,
                data: { devices: ['Default'], platform: os.platform() },
              });
            }
            break;
          }

          case NavWebToExtMsgTypes.selectedMic: {
            this.updateGlobalState(storageKeys.selectedMicDevice, e.data);
          }

          default:
            break;
        }
      },
    );

    this._webviewView = webviewPanel;
  }

  private async _registerCommands() {
    const commands: {
      command: string;
      title: string;
      handler: (...args: any[]) => any;
    }[] = [];

    const registeredCommands = await vscode.commands.getCommands();

    commands.forEach((command) => {
      if (!registeredCommands.includes(command.command)) {
        this._context?.subscriptions.push(
          vscode.commands.registerCommand(command.command, command.handler),
        );
      }
    });
  }

  /**
   * Get metadata on load - constructor
   */
  private async _getMetaData() {
    this._metadata = await getProjectMeta(this._context);
    if (this._metadata) {
      this.updateGlobalState(
        storageKeys.metadataJSON,
        JSON.stringify(this._metadata),
      );
    }
  }

  /**
   * Send Message or event from EDITOR to Webview
   */
  private postMessage(webview: vscode.Webview, message: ExtToNavMsg) {
    webview.postMessage(message);
  }

  /**
   * Function to get the html of the Webview
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'SelectMicView',
        'index.js',
      ),
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'SelectMicView',
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
            
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <link href="${styleVSCodeUri}" rel="stylesheet" />
            
            <title>Scribe Audio Navigation</title>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
    `;
  }

  // Method to update the global state
  public updateGlobalState(key: string, value: any) {
    this.globalState.update(key, value);
  }

  // Method to retrieve data from the global state
  public getGlobalState(key: string): any {
    return this.globalState.get(key);
  }
}
