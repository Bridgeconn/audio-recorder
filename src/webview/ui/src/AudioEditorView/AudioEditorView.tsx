import { useEffect, useState } from "react";
import VerseView from "./VerseView";
import { ExttoEditorWebMsgTypes, IChapterdata } from "../../../../types/editor";

import WaveSurfer from "wavesurfer.js";

const vscode = acquireVsCodeApi();

function App() {
  const [chapterContent, setChapterContent] = useState<IChapterdata | null>(
    null
  );
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  // function handle post message
  const postMessage = (type: string, data: unknown) => {
    if (type) {
      vscode.postMessage({
        type: type,
        data: data,
      });
    }
  };

  useEffect(() => {
    const handleExtensionPostMessages = (event: MessageEvent) => {
      console.log("listened event in Editor UI  : ", event);
      const { type, data } = event.data;
      switch (type) {
        case ExttoEditorWebMsgTypes.ChapterData: {
          // processed vesification data from workspace dir

          setChapterContent(data[0]);
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

  console.log("999999999999999999999", { chapterContent });

  return (
    <main className="my-5 flex flex-col gap-y-5">
      {!chapterContent && <>Loading...</>}
      {chapterContent?.contents.map((verseData) => (
        <VerseView
          key={verseData.verseNumber}
          verseData={verseData}
          selectedVerse={selectedVerse}
          setSelectedVerse={setSelectedVerse}
        />
      ))}
    </main>
  );
}

export default App;
