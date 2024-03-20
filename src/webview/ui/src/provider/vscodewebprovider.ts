import type { WebviewApi } from 'vscode-webview';
import { EditorUItoExtMsg } from '../../../../types/editor';

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
  public postMessage(message: EditorUItoExtMsg) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    }
  }
}

export const vscode = new VsCodeWebInstanceProvider();
