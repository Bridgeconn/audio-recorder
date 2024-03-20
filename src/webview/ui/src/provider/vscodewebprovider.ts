import type { WebviewApi } from 'vscode-webview';
import { EditorUItoExtMsg } from '../../../../types/editor';
import { NavUItoExtMsg } from '../../../../types/navigationView';

class VsCodeWebInstanceProvider {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;

  constructor() {
    // ensure vscodeapi is not inited in the current web view
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  /**
   * post event to provider
   * non primitive values should be serialised
   */
  public postMessage(message: EditorUItoExtMsg | NavUItoExtMsg) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    }
  }
}

export const vscode = new VsCodeWebInstanceProvider();
