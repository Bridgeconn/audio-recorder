import { useEffect, useState } from 'react';
import VerseView from './VerseView';
import { ExttoEditorWebMsgTypes, IChapterdata } from '../../../../types/editor';

// const vscode = acquireVsCodeApi();

function App() {
  const [chapterContent, setChapterContent] = useState<IChapterdata | null>(
    null,
  );
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [scriptDirection, setScriptDirection] = useState<'ltr' | 'rtl'>();

  useEffect(() => {
    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case ExttoEditorWebMsgTypes.ChapterData: {
          // processed vesification data from workspace dir
          setChapterContent(data.ChapterData[0]);
          setScriptDirection(data.scriptDirection);
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

  return (
    <main className="my-5 flex flex-col gap-y-5">
      {!chapterContent && <>Loading...</>}
      {chapterContent?.contents.map((verseData) => (
        <VerseView
          key={verseData.verseNumber}
          verseData={verseData}
          selectedVerse={selectedVerse}
          setSelectedVerse={setSelectedVerse}
          scriptDirection={scriptDirection}
        />
      ))}
    </main>
  );
}

export default App;
