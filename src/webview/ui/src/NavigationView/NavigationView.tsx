import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import {
  NavWebToExtMsgTypes,
  ExttoNavWebMsgTypes,
} from "../../../../types/navigationView";
import { IVersification } from "../../../../types/versification";

const vscode = acquireVsCodeApi();

function App() {
  const [versificationData, setVersificationData] =
    useState<IVersification | null>(null);

  // function handle post message
  const postMessage = (type: string, data: unknown) => {
    if (type) {
      vscode.postMessage({
        type: type,
        data: data,
      });
    }
  };

  console.log("verss )))))))))))) == >", versificationData);

  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    if (!versificationData) {
      postMessage(NavWebToExtMsgTypes.FetchVersification, "");
    }

    const handleExtensionPostMessages = (event: MessageEvent) => {
      console.log("listened event in Nav UI  : ", event);
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
    window.addEventListener("message", handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener("message", handleExtensionPostMessages);
    };
  }, []);

  const handleChapterSelect = (bookId: string, chapter: number) => {
    postMessage(NavWebToExtMsgTypes.BCSelection, { bookId, chapter });
  };

  return (
    <div className="">
      <div>
        {versificationData &&
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
            )
          )}
      </div>
    </div>
  );
}

export default App;
