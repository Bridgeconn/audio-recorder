import { useEffect, useState } from "react";
import VerseView from "./VerseView";
import {
  ExttoEditorWebMsgTypes,
  IChapterdata,
  IVerseData,
} from "../../../../types/editor";

const dummyDataChapter = [
  {
    verseNumber: 1,
    verseText: "In the beginning God created the heavens and the earth.",
    audio: "",
  },
  {
    verseNumber: 2,
    verseText:
      " Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
    audio: "",
  },
  {
    verseNumber: 3,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 4,
    verseText:
      "God saw that the light was good, and he separated the light from the darkness. 5 God called the light “day,” and the darkness he called “night.” And there was evening, and there was morning—the first day.",
    audio: "",
  },
  {
    verseNumber: 5,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 6,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 7,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 8,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 9,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 10,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 11,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 12,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 13,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 14,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 15,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 16,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 17,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 18,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 19,
    verseText: "",
    audio: "",
  },
  {
    verseNumber: 20,
    verseText: "",
    audio: "",
  },
];

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
