import * as vscode from 'vscode';

export interface VerseRefGlobalState {
  verseRef: string;
  uri: string;
}
type StateStoreUpdate = { key: 'verseRef'; value: VerseRefGlobalState };

type StateStoreKey = StateStoreUpdate['key'];
type StateStoreValue<K extends StateStoreKey> = Extract<
  StateStoreUpdate,
  { key: K }
>['value'];

const extensionId = 'project-accelerate.shared-state-store';

type DisposeFunction = () => void;
export async function initializeStateStore() {
  let storeListener: <K extends StateStoreKey>(
    keyForListener: K,
    callBack: (value: StateStoreValue<K> | undefined) => void,
  ) => DisposeFunction = () => () => undefined;

  let updateStoreState: (update: StateStoreUpdate) => void = () => undefined;
  let getStoreState: <K extends StateStoreKey>(
    key: K,
  ) => Promise<StateStoreValue<K> | undefined> = () =>
    Promise.resolve(undefined);

  const extension = vscode.extensions.getExtension(extensionId);
  if (extension) {
    const api = await extension.activate();
    if (!api) {
      vscode.window.showErrorMessage(
        `Extension ${extensionId} does not expose an API. Please make sure it is up to date.`,
      );
    } else {
      storeListener = api.storeListener;

      updateStoreState = api.updateStoreState;
      getStoreState = api.getStoreState;
      return {
        storeListener,
        updateStoreState,
        getStoreState,
      };
    }
  }
  console.error(`Extension ${extensionId} not found.`);
  return {
    storeListener,
    updateStoreState,
    getStoreState,
  };
}

export type StateStore = Awaited<ReturnType<typeof initializeStateStore>>;
