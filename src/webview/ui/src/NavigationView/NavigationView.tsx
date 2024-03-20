import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import {
  NavWebToExtMsgTypes,
  ExttoNavWebMsgTypes,
} from '../../../../types/navigationView';
import { IVersification } from '../../../../types/versification';
import InitiateProject from '../components/initiateProject';
import { vscode } from '../provider/vscodewebprovider';

function App() {
  const [versificationData, setVersificationData] =
    useState<IVersification | null>(null);

  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    if (!versificationData) {
      // postMessage(NavWebToExtMsgTypes.FetchVersification, '');
      vscode.postMessage({
        type: NavWebToExtMsgTypes.FetchVersification,
        data: null,
      });
    }

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case ExttoNavWebMsgTypes.VersificationData: {
          // processed vesification data from workspace dir
          setVersificationData(data);
          break;
        }

        default:
          break;
      }
    };

    // add listener for the event
    window.addEventListener('message', handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener('message', handleExtensionPostMessages);
    };
  }, []);

  const handleChapterSelect = (bookId: string, chapter: number) => {
    // postMessage(NavWebToExtMsgTypes.BCSelection, { bookId, chapter });
    vscode.postMessage({
      type: NavWebToExtMsgTypes.BCSelection,
      data: { bookId, chapter },
    });
  };

  return (
    <div className="">
      <div>
        {versificationData ? (
          Object.entries(versificationData.maxVerses).map(
            ([bookId, chapters]) => (
              <details className="pt-3">
                <summary className="w-full cursor-pointer">
                  {bookId.toUpperCase()}
                </summary>
                <div className="grid grid-cols-3 gap-2 my-2">
                  {chapters?.map((chapter: string, index: number) => (
                    <VSCodeButton
                      onClick={() => handleChapterSelect(bookId, index + 1)}
                    >
                      {index + 1}
                    </VSCodeButton>
                  ))}
                </div>
              </details>
            ),
          )
        ) : (
          <InitiateProject />
        )}
      </div>
    </div>
  );
}

export default App;
